/**
 * @Author Lomovtsev Pavel
 * Date: 05.10.13
 * Time: 15:04
 */
var BasePolygon = (function() {

    var debug = Config.debugDrawing,
        getTrapezeSquare = function(v1, v2) {
            return (v1.y + v2.y) * (v2.x - v1.x) / 2;
        },
        calcSidesAndPeaks = function(vertexes) {
            var l = vertexes.length,
                sides = [],
                peaks = [],
                side1, side2, prev, next, v1, v2;
            for (var i = 0; i < l; i++) {
                prev = i === 0 ? l - 1 : i - 1;
                next = (i + 1) % l;
                side1 = new Segment(vertexes[prev], vertexes[i]);
                side2 = new Segment(vertexes[i], vertexes[next]);
                sides.push(side1);
                v1 = side1.getDirectingVector();
                v2 = side2.getDirectingVector();
                if (v1.getAlpha(v2) < Math.PI) {
                    peaks.push(new Peak(vertexes[i], side1, side2));
                }
            }
            return {sides: sides, peaks: peaks};
        },
        //-----------------------------------------------------------------------------------------    CHOOSE BEAMS
        chooseBeam = function(line, intersection, intersectingBeam, anotherBeam) {
            var v = line.getDirectingVector();
            if (intersectingBeam.getDirectingVector().getVectorProduct(anotherBeam.getDirectingVector()) *
                intersectingBeam.getDirectingVector().getVectorProduct(v) > 0) {
                return new Beam(intersection, v);
            }
            else {
                return new Beam(intersection, v.getMulOnScalar(-1));
            }
        },
        chooseParabolicBeam = function(parabola, intersection, peak) {
            var v = decreaseShiftingVector(parabola, intersection, parabola.directrix.getDirectingVector());
            var p1 = intersection.getShiftedByVector(v);
            var p2 = intersection.getShiftedByVector(new Vector(parabola.vertex, parabola.focus)).getShiftedByVector(v);
            var l = new Line(p1, p2);
            var T = G.getIntersection(l, parabola);
            var vT = new Vector(peak.vertex, T.p[0]);
            var b1v = peak.beam1.vector;
            var b2v = peak.beam2.vector;
            if (b1v.getVectorProduct(vT) * b1v.getVectorProduct(b2v) > 0 &&
                b2v.getVectorProduct(vT) * b2v.getVectorProduct(b1v) > 0) {
                return new ParabolicBeam(parabola, intersection, v);
            }
            else {
                return new ParabolicBeam(parabola, intersection, v.getMulOnScalar(-1));
            }
        },
        // -------------------------------------------------------------------------------------------------    CUTS
        peakCutFromLine = function(peak, centerPerp) {
            var intersec1 = G.getIntersection(centerPerp, peak.beam1),
                intersec2 = G.getIntersection(centerPerp, peak.beam2);
            if (intersec1 === null) {
                return intersec2 === null ? null
                                          : chooseBeam(centerPerp, intersec2, peak.beam2, peak.beam1);
            }
            else if (intersec2 === null) {
                return chooseBeam(centerPerp, intersec1, peak.beam1, peak.beam2);
            }
            else {
                return G.getIntersection(chooseBeam(centerPerp, intersec1, peak.beam1, peak.beam2),
                                         chooseBeam(centerPerp, intersec2, peak.beam2, peak.beam1));
            }
        },
        //Возвращает @ParabolicSegment или null TODO Случай когда peak лежит на @parabolicSegment
        peakCutFromParabolicSegment = function(peak, pSeg) {
            var intersec1 = G.getIntersection(pSeg.parabola, peak.beam1),
                intersec2 = G.getIntersection(pSeg.parabola, peak.beam2);
            //peak это фокус параболы => intersec1 и intersec2 содержат не более чем по одной точке
            if (intersec1.pointAmount === 0) {
                var beamIntersec = chooseParabolicBeam(pSeg.parabola, intersec2.p[0], peak);
            }
            else if (intersec2.pointAmount === 0) {
                beamIntersec = chooseParabolicBeam(pSeg.parabola, intersec1.p[0], peak);
            }
            else {
                var pBeam1 = chooseParabolicBeam(pSeg.parabola, intersec1.p[0], peak);
                var pBeam2 = chooseParabolicBeam(pSeg.parabola, intersec2.p[0], peak);
                beamIntersec = G.getIntersection(pBeam1, pBeam2);
            }
            if (beamIntersec != null) {
                return G.getIntersection(beamIntersec, pSeg);
            }
            else {
                return G.getIntersection(pBeam1, pSeg) || G.getIntersection(pBeam2, pSeg);
            }
        },
        //Возвращает @ParabolicSegment или null
        //side лежит на директрисе параболы!
        sideCutFromParabola = function(side, parabola) {
            var intersec1 = G.getIntersection(parabola, side.beamA),
                intersec2 = G.getIntersection(parabola, side.beamB);
            //Сторона содержится в директрисе параболы => intersec1 и intersec2 содержат одновременно
            //по одной точке или не содержат точек вовсе
            if (intersec1.pointAmount === 0) {
                return null;
            }
            var v1 = new Vector(side.a, side.b);
            var v2 = v1.getMulOnScalar(-1);
            return new ParabolicSegment(parabola, intersec1.p[0], v1, intersec2.p[0], v2);
        },
        //Возвращает @Beam, @Segment, @Point или null
        sideCutFromLine = function(side, line) {
            var x = G.getIntersection(side, line);
            var intersec1 = G.getIntersection(line, side.beamA);
            var intersec2 = G.getIntersection(line, side.beamB);
            if (intersec1 != null && intersec2 != null) {
                return new Segment(intersec1, intersec2);
            }
            //Отрезок перпендикулярен прямой и не пересекает её
            if (x === null) {
                return null;
            }
            //Берём непустое пересечение, если оно есть
            var intersec = intersec1 || intersec2;
            if (intersec === null) {
                return new Beam(x, side.beamA.getDirectingVector());
            }
            if (Type.isBeam(intersec) || intersec.equalsToPoint(x)) {
                return intersec;
            }
            return new Segment(x, intersec);
        },
        // ---------------------------------------------------------------------------------------------   GET PIECE
        //Возвращает @ParabolicSegment или null
        getPieceForPeakSide = function(peak, side) {
            var d = new Line(side.a, side.b);
            if (d.isPointOn(peak.vertex)) {
                return null;
            }
            //Сначала подозреваем все точки на параболе
            var currentPiece = new Parabola(peak.vertex, d);
            if (debug) Drawing.draw(currentPiece, "#5F9EA0");
            //Затем, отсекаем всё что не лежит в полосе стороны и секторе пика
            currentPiece = sideCutFromParabola(side, currentPiece);
            if (currentPiece === null) {
                return null;
            }
            //Отключено чтобы избежать проблем с пересечением двух параболических линий
            //currentPiece = peakCutFromParabolicSegment(peak, currentPiece);
            return currentPiece;
        },
        //Возвращает @Beam, @Segment или null
        getPieceForPeakPeak = function(peak1, peak2) {
            if (peak1.isNeighbour(peak2)) {
                return null;
            }
            var seg = new Segment(peak1.vertex, peak2.vertex);
            if (debug) Drawing.draw(seg, "#ddd");
            var center = seg.getCenter();
            if (debug) Drawing.drawPoint(center, "#666", 0.8);
            //Сначала подозреваем все точки на серединном перпендикуляре
            var centerPerp = seg.getCentralPerpendicular();
            if (debug) Drawing.draw(centerPerp, "#aaa");
            //Затем, отсекаем всё что не лежит в секторах пиков
            var pieceForPeak1 = peakCutFromLine(peak1, centerPerp, center);
            if (debug) Drawing.draw(pieceForPeak1, "#a33");
            var pieceForPeak2 = peakCutFromLine(peak2, centerPerp, center);
            if (debug) Drawing.draw(pieceForPeak2, "#a33");
            return G.getIntersection(pieceForPeak1, pieceForPeak2);
        },
        //Возвращает @Segment или null
        getPieceForSideSide = function(side1, side2) {
            var l1 = side1.getLine();
            var l2 = side2.getLine();
            var x = G.getIntersection(l1, l2);
            if (x === null) {
                var midLine = G.getMidLine(l1, l2);
                return G.getIntersection(sideCutFromLine(side1, midLine), sideCutFromLine(side2, midLine));
            }
            if (x === Infinity) {
                return null;
            }
            var bisectors = G.getBisectors(side1.getLine(), side2.getLine());
            //Выбираем биссектрису
            var n1 = side1.beamA.getDirectingVector();
            var n2 = side2.beamA.getDirectingVector();
            var v = bisectors.b1.getDirectingVector();
            var b = v.getVectorProduct(n1) * v.getVectorProduct(n2) < 0 ? bisectors.b1
                                                                        : bisectors.b2;
            //if (debug) Drawing.draw(b, "#aaf");
            var cut1 = sideCutFromLine(side1, b);
            var cut2 = sideCutFromLine(side2, b);
            if (Type.isPoint(cut1) || Type.isPoint(cut2)) {
                return null;
            }
            return G.getIntersection(cut1, cut2);
        },

        //Уменьшает длину вектора, начинающегося в точке point, чтобы не выскочить за параболу
        decreaseShiftingVector = function(parabola, point, vector) {
            vector = vector.getNormalized();
            var l = new Line(point, point.getShiftedByVector(vector));
            var x = G.getIntersection(l, parabola);
            //Вектор параллельный оси параболы не требует укорачивания
            if (x.pointAmount === 2) {
                var k = new Vector(x.p[0], x.p[1]).getModule() / 2;
                vector = vector.getMulOnScalar(k);
            }
            return vector;
        };

    return {
        //Хорошим считаем обход по часовой стрелке
        vertexes: [],
        minX: 0,
        maxX: 0,
        minY: 0,
        maxY: 0,
        type: "Не определён",
        peaks: [],
        sides: [],
        alphaConvexity: undefined,

        dropVertexes: function() {
            this.vertexes = [];
            this.minX = this.minY = this.maxX = this.maxY = 0;
        },

        addVertex: function(point) {
            this.maxX = (point.x > this.maxX) ? point.x : this.maxX;
            this.minX = (point.x < this.minX) ? point.x : this.minX;
            this.maxY = (point.y > this.maxY) ? point.y : this.maxY;
            this.minY = (point.y < this.minY) ? point.y : this.minY;
            point.index = this.vertexes.length;
            this.vertexes.push(point);
        },

        center: function(canvasWidth, canvasHeight) {
            var dx = (canvasWidth - this.minX - this.maxX) / 2;
            var dy = (canvasHeight - this.minY - this.maxY) / 2;
            return G.shiftPolygon(this.vertexes, dx, dy);
        },

        rotatePolygon: function(phi) {
            var n = this.vertexes.length,
                oldX, newX = 0,
                oldY, newY = 0,
                vertexes = this.vertexes;
            this.dropVertexes();
            for (var i = 0; i < n; i++) {
                oldX = vertexes[i].x;
                oldY = vertexes[i].y;
                newX = oldX * Math.cos(phi) - oldY * Math.sin(phi);
                newY = oldX * Math.sin(phi) + oldY * Math.cos(phi);
                this.addVertex(new Point(newX, newY));
            }
        },

        getPerimeter: function() {
            var p = 0,
                n = this.vertexes.length;
            for (var i = 0; i < n - 1; i++) {
                p += G.dist(this.vertexes[i], this.vertexes[i + 1]);
            }
            p += G.dist(this.vertexes[0], this.vertexes[n - 1]);
            return p;
        },

        getSquare: function() {
            var s = 0,
                l = this.vertexes.length;
            for (var i = 0; i < l - 1; i++) {
                s += getTrapezeSquare(this.vertexes[i], this.vertexes[i + 1]);
            }
            s += getTrapezeSquare(this.vertexes[l - 1], this.vertexes[0]);
            return Math.abs(s);
        },

        getAlphaConvexity: function() {
            //В треугольнике вершины нумеруются как повезёт, поэтому алгоритм может работать некорректно
            if (this.vertexes.length == 3) return 0;

            var preCalc = calcSidesAndPeaks(this.vertexes);
            var peaks = preCalc.peaks;
            var sides = preCalc.sides;
            var a, b, c, ab, bc, ac, abLine, bcLine, acLine, x, parabola1, parabola2, finalRes = new Res();
            finalRes.alpha = 0;
            var _thisref = this;
            function Res(a, b, x, line, line2) {
                this.x = x;
                this.a = a;
                this.b = b;
                this.seg1 = (x != null && a != null) ? new Segment(x, a) : null;
                this.seg2 = (x != null && b != null) ? new Segment(x, b) : null;
                this.line = line;
                this.line2 = line2;
                this.alpha = (this.seg1 != null && this.seg2 != null)
                    ? this.seg1.getDirectingVector().getMinAlpha(this.seg2.getDirectingVector())
                    : null;
            }
            var drawFinalRes = function() {
                var color1 = "#CD5C5C";
                var color2 = "#BEBEBE";
                if (finalRes.alpha) {
                    Drawing.draw(finalRes.seg1, color1);
                    Drawing.draw(finalRes.seg2, color1);
                    if (finalRes.line) Drawing.draw(finalRes.line, color2);
                    if (finalRes.line2) Drawing.draw(finalRes.line2, color2);
                    if (finalRes.x)
                        Drawing.drawAngleSign(
                            finalRes.seg1.getDirectingVector(),
                            finalRes.seg2.getDirectingVector(),
                            finalRes.x, color1
                        );
                }
            };
            var updateRes = function(res, msg) {
                if (res.alpha > finalRes.alpha) {
                    finalRes = res;
                    finalRes.msg = msg;
                    return true;
                }
                return false;
            };
            //Метод предназначен для сегмента, концы которого являются вершинами
            var checkBestPointForSegment = function(seg, msg) {
                var x = seg.getCenter();
                if (G.isPointAtDistanceToPolygon(x, G.dist(x, seg.a), _thisref.vertexes)) {
                    updateRes(
                        new Res(
                            seg.a,
                            seg.b,
                            x,
                            seg.getCentralPerpendicular()
                        ),
                        msg || "best point (center of segment) for 2 vertexes");
                }
            };
            var checkBestPointForParabola = function(parabola, directrixSeg, msg) {
                if (parabola != null) {
                    if (Type.isParabolicBeam(parabola) ||
                        Type.isParabolicSegment(parabola)) {
                        parabola = parabola.parabola;
                    }
                    var h = G.getIntersection(parabola.directrix, new Line(parabola.focus, parabola.vertex));
                    if (directrixSeg.isPointOn(h) &&
                        G.isPointAtDistanceToPolygon(parabola.vertex, G.dist(parabola.focus, parabola.vertex), _thisref.vertexes)) {
                        updateRes(
                            new Res(
                                parabola.focus,
                                h,
                                parabola.vertex,
                                parabola
                            ),
                            msg || "best point (parabola's vertex) for vertex and side");
                    }
                }
            };
            var checkBestPointForBisector = function(biseg, side1, side2, msg) {
                if (Type.isSegment(biseg)) {
                    var x = biseg.getCenter();
                    if (G.isPointAtDistanceToPolygon(x, x.distToSegment(side1), _thisref.vertexes)) {
                        updateRes(
                            new Res(
                                G.getIntersection(
                                    side1,
                                    new Line(x, x.getShiftedByVector(side1.getLine().getNormalVector()))
                                ),
                                G.getIntersection(
                                    side2,
                                    new Line(x, x.getShiftedByVector(side2.getLine().getNormalVector()))
                                ),
                                x,
                                biseg
                            ),
                            msg || "any point on bisector of 2 sides"
                        )
                    }
                }
            };
            var areSidesNeighbours = function(side1, side2) {
                if (side1.a == side2.a || side1.a == side2.b) {
                    return side1.a;
                }
                else if (side1.b == side2.a || side1.b == side2.b) {
                    return side1.b;
                }
                else {
                    return false;
                }
            };
            //Вершины
            for (var i = 0; i < peaks.length - 2; i++) {
                a = peaks[i].vertex;
                //Вершины
                for (var j = i + 1; j < peaks.length - 1; j++) {
                    b = peaks[j].vertex;
                    ab = new Segment(a, b);
                    abLine = ab.getCentralPerpendicular();
                    checkBestPointForSegment(ab);
                    //3 вершины
                    for (var k = j + 1; k < peaks.length; k++) {
                        c = peaks[k].vertex;
                        bc = new Segment(b, c);
                        ac = new Segment(a, c);
                        bcLine = bc.getCentralPerpendicular();
                        acLine = ac.getCentralPerpendicular();
                        checkBestPointForSegment(bc);
                        checkBestPointForSegment(ac);
                        //сер. перп. в теругольнике пересекаются в одной точке => достаточно рассмотреть одну пару
                        x = G.getIntersection(abLine, bcLine);
                        if (x != null && G.isPointAtDistanceToPolygon(x, G.dist(x, a), this.vertexes)) {
                            updateRes(new Res(a, b, x, abLine), "3 vertexes");
                            updateRes(new Res(b, c, x, bcLine), "3 vertexes");
                            updateRes(new Res(a, c, x, acLine), "3 vertexes");
                        }
                    }
                    //2 вершины и сторона
                    for (k = 0; k < sides.length; k++) {
                        c = sides[k];
                        if (!c.getLine().isPointOn(a) && !c.getLine().isPointOn(b)) {
                            var cLine = c.getLine();
                            parabola1 = getPieceForPeakSide(peaks[i], c);
                            //new Parabola(peaks[i].vertex, new Line(c.a, c.b));
                            checkBestPointForParabola(parabola1, c);
                            x = G.getIntersection(abLine, parabola1);
                            if (x != null && G.isPointAtDistanceToPolygon(x, G.dist(x, a), _thisref.vertexes)) {
                                var h = G.getIntersection(
                                    cLine,
                                    new Line(x, x.getShiftedByVector(cLine.getNormalVector()))
                                );
                                updateRes(new Res(a, h, x, abLine, parabola1), "2 vertexes and side");
                                updateRes(new Res(b, h, x, abLine, parabola1), "2 vertexes and side");
                                updateRes(new Res(a, b, x, abLine, parabola1), "2 vertexes and side");
                            }
                            parabola1 = getPieceForPeakSide(peaks[j], c);
                            //new Parabola(peaks[j].vertex, new Line(c.a, c.b));
                            checkBestPointForParabola(parabola1, c);
                        }
                    }
                }
                //вершина и две стороны
                for (j = 0; j < sides.length - 1; j++) {
                    b = sides[j];
                    for (k = j + 1; k < sides.length; k++) {
                        c = sides[k];
                        var bisectorPiece = getPieceForSideSide(b, c);
                        var checkPoint = function(x, a, b, c, bisector, parabola) {
                            if (x != null && G.isPointAtDistanceToPolygon(x, G.dist(x, a), _thisref.vertexes)) {
                                var hb = G.getIntersection(
                                    b.getLine(),
                                    new Line(x, x.getShiftedByVector(b.getLine().getNormalVector()))
                                );
                                var hc = G.getIntersection(
                                    c.getLine(),
                                    new Line(x, x.getShiftedByVector(c.getLine().getNormalVector()))
                                );
                                if (b.isPointOn(hb)) {
                                    if (c.isPointOn(hc)) {
                                        updateRes(new Res(hb, hc, x, bisector, parabola), "vertex and 2 sides");
                                        updateRes(new Res(hb, a, x, bisector, parabola), "vertex and 2 sides");
                                        updateRes(new Res(hc, a, x, bisector, parabola), "vertex and 2 sides");
                                    }
                                    else {
                                        updateRes(new Res(hb, a, x, bisector, parabola), "vertex and 2 sides");
                                    }
                                }
                                else if (c.isPointOn(hc)) {
                                    updateRes(new Res(hc, a, x, bisector, parabola), "vertex and 2 sides");
                                }
                            }
                        };
                        if (bisectorPiece && !Type.isPoint(bisectorPiece) && !areSidesNeighbours(b, c)) {
                            var bisector = bisectorPiece.getLine();
                            if (!b.getLine().isPointOn(a)) {
                                parabola1 = getPieceForPeakSide(peaks[i], b);
                                //new Parabola(peaks[i].vertex, new Line(b.a, b.b));
                                checkBestPointForParabola(parabola1, b);
                                x = G.getIntersection(bisector, parabola1);
                                if (x) {
                                    for (var z = 0; z < x.pointAmount; z++) {
                                        checkPoint(x.p[z], a, b, c, bisector, parabola1);
                                    }
                                }
                            }
                            if (!c.getLine().isPointOn(a)) {
                                parabola1 = getPieceForPeakSide(peaks[i], c);
                                //new Parabola(peaks[i].vertex, new Line(c.a, c.b));
                                checkBestPointForParabola(parabola1, c);
                                x = G.getIntersection(bisector, parabola1);
                                if (x) {
                                    for (z = 0; z < x.pointAmount; z++) {
                                        checkPoint(x.p[z], a, b, c, bisector, parabola1);
                                    }
                                }
                            }
                        }
                    }
                }
            }
            //три стороны
            for (i = 0; i < sides.length - 2; i++) {
                for (j = i + 1; j < sides.length - 1; j++) {
                    a = sides[i];
                    b = sides[j];
                    var biSeg1 = getPieceForSideSide(a, b);
                    checkBestPointForBisector(biSeg1, a, b);
                    for (k = j + 1; k < sides.length; k++) {
                        c = sides[k];
                        var biSeg2 = getPieceForSideSide(b, c);
                        checkBestPointForBisector(biSeg2, b, c);
                        var biSeg3 = getPieceForSideSide(c, a);
                        checkBestPointForBisector(biSeg3, c, a);
                        if (biSeg1 && biSeg2) {
                            x = G.getIntersection(biSeg1, biSeg2);
                            if (Type.isPoint(x)) {
                                var l1 = new Line(x, x.getShiftedByVector(a.getLine().getNormalVector()));
                                var h1 = G.getIntersection(l1, a);
                                var l2 = new Line(x, x.getShiftedByVector(c.getLine().getNormalVector()));
                                var h2 = G.getIntersection(l2, c);
                                var res = new Res(h1, h2, x, biSeg1, biSeg2);
                                updateRes(res, "3 sides");
                            }
                        }
                    }
                }
            }
            drawFinalRes();
            if (finalRes.msg) {
                console.log(finalRes.msg);
            }
            this.alphaConvexity = finalRes.alpha;
            return finalRes.alpha;
        },

        centerAndDraw: function(width, height, context, isVertexNumberNeeded) {
            this.center(width, height);
            Drawing.drawPolygon(this.vertexes, context, width, height, isVertexNumberNeeded);
        },

        centerRotateAndDraw: function(width, height, context, isVertexNumberNeeded) {
            this.rotatePolygon(Math.random() * Math.PI);
            this.center(width, height);
            Drawing.drawPolygon(this.vertexes, context, width, height, isVertexNumberNeeded);
        }
    }
})();
