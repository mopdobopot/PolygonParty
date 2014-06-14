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
            var p2 = intersection.getShiftedByVector(parabola.directrixNormalVector).getShiftedByVector(v);
            var l = new Line(p1, p2);
            var T = G.getIntersection(l, parabola);
            var vT = new Vector(peak.vertex, T);
            var b1v = peak.beam1.vector;
            var b2v = peak.beam2.vector;
            if (b1v.getVectorProduct(vT) * b1v.getVectorProduct(b2v) > 0 &&
                b2v.getVectorProduct(vT) * b2v.getVectorProduct(b1v) > 0) {
                return v;
            }
            else {
                return v.getMulOnScalar(-1);
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
            //peak это фокус параболы => intersec1 и intersec2 содержат ровно по одной точке
            var pBeam1 = chooseParabolicBeam(pSeg.parabola, intersec1.p[0], peak);
            var pBeam2 = chooseParabolicBeam(pSeg.parabola, intersec2.p[0], peak);
            var beamIntersec = G.getIntersection(pBeam1, pBeam2);
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
            if (Type.isSegment(x)) {
                return side;
            }
            if (x === null) {
                //Если сторона перпендикулярна прямой и не пересекает её — вернём null
                return intersec1 === null ? null : new Segment(intersec1, intersec2);
            }
            //Берём непустое пересечение, если оно есть
            intersec1 = intersec1 || intersec2;
            if (Type.isBeam(intersec1) || Type.isPoint(intersec1)) {
                return intersec1;
            }
            if (intersec1 === null) {
                return new Beam(x, side.beamA.getDirectingVector());
            }
            return new Segment(x, intersec1);
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
            currentPiece = peakCutFromParabolicSegment(peak, currentPiece);
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
            var bisectors = G.getBisectors(side1.getLine(), side2.getLine());
            Drawing.drawLine(bisectors.b1, "#f33");
            Drawing.drawLine(bisectors.b2, "#f33");
            //TODO Будет точно верно, если доказать единственность piece для 2 сторон
            return G.getIntersection(sideCutFromLine(side1, bisectors.b1), sideCutFromLine(side2, bisectors.b1)) ||
                   G.getIntersection(sideCutFromLine(side1, bisectors.b2), sideCutFromLine(side2, bisectors.b2));
        },
        //----------------------------------------------------------------------------------------------    EFFECT
        //Влияние пика на пару пиков (currentPiece — луч или отрезок)
        peakPeakOnLinearEffect = function(peak, effectPeak, currentPiece) {
            if (currentPiece === null) {
                return null;
            }
            var effectPiece = getPieceForPeakPeak(peak, effectPeak);
            if (effectPiece != null) {
                var effectCenterPerp = new Segment(peak.vertex, effectPeak.vertex).getCentralPerpendicular();
                var intersec = G.getIntersection(currentPiece, effectCenterPerp);
                //intersec это @Point или null
                var pointOnCurrentPiece = currentPiece.getPointOn();
                if (intersec === null || intersec.pointAmount === 0) {
                    //Если currentPiece целиком лежит ближе к effectPeak чем к peak, то currentPiece — пуст,
                    //иначе, effectPeak не оказывает влияния на currentPiece
                    return effectCenterPerp.arePointsOnSameSide(effectPeak.vertex, pointOnCurrentPiece) ? null
                                                                                                        : currentPiece;
                }
                else {
                    //Выбираем направление на которое не влияет effectPeak
                    var v = new Vector(intersec.p[0], pointOnCurrentPiece);
                    if (effectCenterPerp.arePointsOnSameSide(effectPeak.vertex, pointOnCurrentPiece)) {
                        v = v.getMulOnScalar(-1);
                    }
                    var beam = new Beam(intersec.p[0], v);
                    return G.getIntersection(currentPiece, beam);
                }
            }
            return currentPiece;
        },
        //Влияние стороны на пару пиков (currentPiece — луч или отрезок)
        //параметр peakIsEffect — фича для метода peakSideOnLinearEffect()
        sidePeakOnLinearEffect = function(peak, side, currentPiece, peakIsEffect) {
            if (currentPiece === null) {
                return null;
            }
            var effectPiece = getPieceForPeakSide(peak, side);
            if (effectPiece != null) {
                var effectParabola = new Parabola(peak.vertex, side.getLine());
                if (debug) Drawing.draw(effectParabola, "#5F9EA0");
                var intersec = G.getIntersection(currentPiece, effectParabola);
                //intersec это @Point x2, @Point или null
                if (intersec.pointAmount === 0) {
                    //sideEffect: Если отрезок соединияющий фокус effectParabola с точкой на currentPiece пересекает параболу,
                    //то currentPiece целиком ближе к effectSide, иначе effectSide не оказывает эффекта
                    //peakEffect: наоборот
                    var s = new Segment(peak.vertex, currentPiece.getPointOn());
                    if (G.getIntersection(s, effectParabola) != null) {
                        return peakIsEffect ? currentPiece : null;
                    }
                    else {
                        return peakIsEffect ? null : currentPiece;
                    }
                }
                else if (intersec.pointAmount === 1) {
                    //Чуть сдвигаем точку пересечения
                    var directingV = currentPiece.getDirectingVector();
                    directingV = decreaseShiftingVector(effectParabola, intersec.p[0], directingV);
                    var p = intersec.p[0].getShiftedByVector(directingV);
                    s = new Segment(p, peak.vertex);
                    //и смотрим где оказались — внутри или снаружи от параболы
                    var x = G.getIntersection(s, effectParabola);
                    if (x.pointAmount != 0 && !peakIsEffect ||
                        x.pointAmount === 0 && peakIsEffect) {
                        directingV = directingV.getMulOnScalar(-1);
                    }
                    return G.getIntersection(currentPiece, new Beam(intersec.p[0], directingV));
                }
                else {
                    //TODO парабола пересекает currentPiece в двух точках
                    console.log("Парабола пересекает currentPiece в двух точках!");
                }
            }
            return currentPiece;
        },
        //Влияние стороны на пару сторон (currentPiece — отрезок)
        sideSideOnLinearEffect = function(side, effectSide, currentPiece) {
            if (currentPiece === null) {
                return null;
            }
            //Предполагаю что effectPiece отрезок
            var effectPiece = getPieceForSideSide(side, effectSide);
            if (effectPiece != null) {
                var b = effectPiece.getLine();
                var intersec = G.getIntersection(currentPiece, b);
                if (intersec === Infinity) {
                    return currentPiece;
                }
                //intersec это @Point или null
                if (intersec === null) {
                    return b.arePointsOnSameSide(currentPiece.getPointOn(), effectSide.getPointOn()) ? null
                                                                                                     : currentPiece;
                }
                else {
                    var v = currentPiece.getDirectingVector();
                    if (b.arePointsOnSameSide(intersec.p[0].getShiftedByVector(v), effectSide.getPointOn())) {
                        v = v.getMulOnScalar(-1);
                    }
                    return G.getIntersection(currentPiece, new Beam(intersec.p[0], v));
                }
            }
            return currentPiece;
        },
        //Влияние пика на пару сторон (currentPiece — отрезок)
        peakSideOnLinearEffect = function(side, effectPeak, currentPiece) {
            return sidePeakOnLinearEffect(effectPeak, side, currentPiece, true);
        },
        //Влияние пика на пару пик-сторона (currentPiece — @parabolicSegment)
        peakPeakOnParabolicEffect = function(peak, effectPeak, currentPiece) {
            if (currentPiece === null) {
                return null;
            }
            var effectPiece = getPieceForPeakPeak(peak, effectPeak);
            if (effectPiece != null) {
                var effectCenterPerp = new Segment(peak.vertex, effectPeak.vertex).getCentralPerpendicular();
                var intersec = G.getIntersection(currentPiece, effectCenterPerp);
                if (intersec === null || intersec.pointAmount === 0) {
                    return effectCenterPerp.arePointsOnSameSide(currentPiece.getPointOn(), effectPeak) ? null
                                                                                                       : currentPiece;
                }
                else if (intersec.pointAmount === 1) {
                    //Чуть смещаем точку пересечения и смотрим — она с той же стороны что peak или нет
                    var v = decreaseShiftingVector(currentPiece.parabola, intersec.p[0], currentPiece.vectorA);
                    var p = intersec.p[0].getShiftedByVector(v);
                    var c = currentPiece;
                    if (effectCenterPerp.arePointsOnSameSide(p, peak.vertex)) {
                        return new ParabolicSegment(c.parabola, c.b, c.vectorB, p, v);
                    }
                    else {
                        return new ParabolicSegment(c.parabola, c.a, c.vectorA, p, v.getMulOnScalar(-1));
                    }
                }
                else {
                    console.log("Серединный перпендикуляр пересекает currentPiece-parabolicSegment в двух точках");
                }
            }
            return currentPiece;
        },
        //Влияние стороны на пару пик-сторона (currentPiece — @parabolicSegment)
        sidePeakOnParabolicEffect = function(peak, effectSide, currentPiece, peakIsEffect) {
            if (currentPiece === null) {
                return null;
            }
            var effectPiece = getPieceForPeakSide(peak, effectSide);
            if (effectPiece != null) {
                var effectParabola = new Parabola(peak.vertex, effectSide.getLine());
                var intersec = G.getIntersection(currentPiece, effectParabola);
                if (intersec === null || intersec.pointAmount === 0) {
                    var s = new Segment(peak.vertex, currentPiece.getPointOn());
                    if (G.getIntersection(effectParabola, s) != null) {
                        return peakIsEffect ? currentPiece : null;
                    }
                    else {
                        return peakIsEffect ? null : currentPiece;
                    }
                }
                else if (intersec.pointAmount === 1) {
                    //Чуть смещаем точку пересечения и смотрим — внутри она effectParabola или нет
                    var v = decreaseShiftingVector(currentPiece.parabola, intersec.p[0], currentPiece.vectorA);
                    var p = intersec.getShiftedByVector(v);
                    var c = currentPiece;
                    var seg1 = new ParabolicSegment(c.parabola, c.b, c.vectorB, p, v);
                    var seg2 = new ParabolicSegment(c.parabola, c.a, c.vectorA, p, v.getMulOnScalar(-1));
                    if (G.getIntersection(new Segment(p, peak.vertex), effectParabola) === null) {
                        return peakIsEffect ? seg2 : seg1;
                    }
                    else {
                        return peakIsEffect ? seg1 : seg2;
                    }
                }
                else {
                    console.log("Парабола пересекает currentPiece-parabolicSegment в двух точках");
                }
            }
            return currentPiece;
        },
        //Влияние пика на пару пик-сторона (currentPiece — @parabolicSegment)
        peakSideOnParabolicEffect = function(side, effectPeak, currentPiece) {
            return sidePeakOnParabolicEffect(effectPeak, side, currentPiece, true);
        },
        //Влияние стороны на пару пик-сторона (currentPiece — @parabolicSegment)
        sideSideOnParabolicEffect = function(side, effectSide, currentPiece) {
            if (currentPiece === null) {
                return null;
            }
            var effectPiece = getPieceForSideSide(side, effectSide);
            if (effectPiece != null) {

                var b = effectPiece.getLine();
                var intersec = G.getIntersection(currentPiece, b);
                if (intersec === null || intersec.pointAmount === 0) {
                    return b.arePointsOnSameSide(currentPiece.getPointOn(), side.getPointOn()) ? null
                                                                                               : currentPiece;
                }
                else if (intersec.pointAmount === 1) {
                    //Чуть смещаем точку пересечения и смотрим — она внутри параболы или нет
                    var v = decreaseShiftingVector(currentPiece.parabola, intersec.p[0], currentPiece.vectorA);
                    var p = intersec.p[0].getShiftedByVector(v);
                    var c = currentPiece;
                    if (b.arePointsOnSameSide(p, currentPiece.parabola.focus)) {
                        return new ParabolicSegment(c.parabola, c.b, c.vectorB, p, v);
                    }
                    else {
                        return new ParabolicSegment(c.parabola, c.a, c.vectorA, p, v.getMulOnScalar(-1));
                    }
                }
                else if (intersec.pointAmount === 2) {
                    console.log("Биссектриса пересекает currentPiece-parabolicSegment в двух точках");
                }
            }
            return currentPiece;
        },
        //-------------------------------------------------------------------------------------------------   others
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
        },
        //Выбирает точку ближайшую к середине отрезка, соединяющего пики и вычисляет для неё альфа
        getBestAlphaForPeakPeak = function(currentPiece, peak1, peak2) {
            var center = new Segment(peak1.vertex, peak2.vertex).getCenter();
            if (currentPiece.isPointOn(center)) {
                return Math.PI;
            }
            if (Type.isSegment(currentPiece)) {
                var v1 = new Vector(currentPiece.a, peak1.vertex);
                var v2 = new Vector(currentPiece.b, peak1.vertex);
                if (v1.getModule() > v2.getModule()) {
                    v1 = v2;
                    v2 = new Vector(currentPiece.b, peak2.vertex);
                }
                else {
                    v2 = new Vector(currentPiece.a, peak2.vertex);
                }
                return v1.getMinAlpha(v2);
            }
            else if (Type.isBeam(currentPiece)) {
                v1 = new Vector(currentPiece.point, peak1.vertex);
                v2 = new Vector(currentPiece.point, peak2.vertex);
                return v1.getMinAlpha(v2);
            }
        },
        //currentPiece — всегда @ParabolicSegment
        getBestAlphaForPeakSide = function(currentPiece, peak, side) {
            if (currentPiece.isPointOn(currentPiece.parabola.vertex)) {
                return Math.PI;
            }
            var v1 = new Vector(peak.vertex, currentPiece.a);
            var v2 = new Vector(peak.vertex, currentPiece.b);
            var p = v1.getModule() < v2.getModule() ? currentPiece.a : currentPiece.b;
            var v = new Vector(currentPiece.parabola.focus, currentPiece.parabola.vertex);
            return v.getMinAlpha(new Vector(p, peak.vertex));
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
            //Ищем внешние лучи для каждой вершины и выделяем из множества вершин пики
            var preCalc = calcSidesAndPeaks(this.vertexes);
            this.sides = preCalc.sides;
            this.peaks = preCalc.peaks;
            var maxAlpha = 0;
            var lp = this.peaks.length;
            var ls = this.sides.length;
            //Перебор всех пар пик-пик
            for (var i = 0; i < lp - 1; i++) {
                for (var j = i + 1; j < lp; j++) {
                    var peak1 = this.peaks[i];
                    var peak2 = this.peaks[j];
                    var currentPiece = getPieceForPeakPeak(peak1, peak2);
                    //Если пересечение пусто, то пара пиков не представляет интереса. Иначе:
                    if (currentPiece != null) {
                        //Влияние пиков на пару пик-пик
                        for (var k = 0; k < lp; k++) {
                            if (k != i && k != j) {
                                var effectPeak = this.peaks[k];
                                if (!peak1.isNeighbour(effectPeak)) {
                                    currentPiece = peakPeakOnLinearEffect(peak1, effectPeak, currentPiece);
                                }
                                if (!peak2.isNeighbour(effectPeak)) {
                                    currentPiece = peakPeakOnLinearEffect(peak2, effectPeak, currentPiece);
                                }
                                if (currentPiece === null) break;
                            }
                        }
                        //Если множество пусто, переходим к следующей паре пиков
                        if (currentPiece === null) continue;
                        //Влияние сторон на пару пик-пик
                        for (k = 0; k < ls; k++) {
                            var effectSide = this.sides[k];
                            if (!effectSide.isPointOn(peak1.vertex) && !effectSide.isPointOn(peak2.vertex)) {
                                currentPiece = sidePeakOnLinearEffect(peak1, effectSide, currentPiece);
                                currentPiece = sidePeakOnLinearEffect(peak2, effectSide, currentPiece);
                            }
                            if (currentPiece === null) break;
                        }
                        if (currentPiece != null) {
                            var currentAlpha = getBestAlphaForPeakPeak(currentPiece, peak1, peak2);
                            if (currentAlpha > maxAlpha) {
                                maxAlpha = currentAlpha;
                                Drawing.draw(currentPiece, "#8FBC8F");
                                Drawing.draw(new Segment(peak1.vertex, peak2.vertex), "#8FBC8F");
                            }
                        }
                    }
                }
            }
            //Перебор всех пар пик-сторона
            for (i = 0; i < lp; i++) {
                for (j = 0; j < ls; j++) {
                    var peak = this.peaks[i];
                    var side = this.sides[j];
                    //Не рассматриваем пары, в которых пик принадлежит стороне
                    if (!side.isPointOn(peak.vertex)) {
                        currentPiece = getPieceForPeakSide(peak, side);
                        if (currentPiece != null) {
                            //Влияние пиков
                            for (k = 0; k < lp; k++) {
                                if (k != i) {
                                    effectPeak = this.peaks[k];
                                    //На пик
                                    if (!peak.isNeighbour(effectPeak)) {
                                        currentPiece = peakPeakOnParabolicEffect(peak, effectPeak, currentPiece);
                                    }
                                    //На сторону
                                    if (!side.isPointOn(effectPeak.vertex)) {
                                        currentPiece = peakSideOnParabolicEffect(effectPeak, side, currentPiece);
                                    }
                                }
                                if (currentPiece === null) break;
                            }
                            if (currentPiece === null) continue;
                            //Влияние сторон
                            for (k = 0; k < ls; k++) {
                                if (k != j) {
                                    effectSide = this.sides[k];
                                    //На пик
                                    if (!effectSide.isPointOn(peak)) {
                                        currentPiece = sidePeakOnParabolicEffect(peak, effectSide, currentPiece);
                                    }
                                    //На сторону (соседние стороны тоже оказывают влияние)
                                    currentPiece = sideSideOnParabolicEffect(side, effectSide, currentPiece);
                                }
                                if (currentPiece === null) break;
                            }
                        }
                        if (currentPiece != null) {
                            currentAlpha = getBestAlphaForPeakSide(currentPiece, peak, side);
                            if (currentAlpha > maxAlpha) {
                                maxAlpha = currentAlpha;
                                //TODO drawing
                            }
                        }
                    }
                }
            }
            //Перебор всех пар сторона-сторона
            for (i = 0; i < ls - 1; i++) {
                for (j = i + 1; j < ls; j++) {
                    var side1 = this.sides[i];
                    var side2 = this.sides[j];
                    var sidesAlpha = side1.getDirectingVector().getAlpha(side2.getDirectingVector());
                    currentAlpha = 0;
                    //Для соседних "вмятых" сторон сразу считаем альфа-выпуклость
                    if (j === i + 1 && sidesAlpha >= Math.PI) {
                        currentAlpha = Math.PI - sidesAlpha;
                    }
                    else {
                        currentPiece = getPieceForSideSide(side1, side2);
                        if (currentPiece != null) {
                            //Влияние пиков
                            for (k = 0; k < lp; k++) {
                                effectPeak = this.peaks[k];
                                //Рассматриваем все пики, кроме соседних
                                if (!side1.isPointOn(effectPeak.vertex) && !side2.isPointOn(effectPeak.vertex)) {
                                    currentPiece = peakSideOnLinearEffect(side1, effectPeak, currentPiece);
                                    currentPiece = peakSideOnLinearEffect(side2, effectPeak, currentPiece);
                                }
                                if (currentPiece === null) break;
                            }
                            if (currentPiece === null) continue;
                            //Влияние сторон
                            for (k = 0; k < ls; k++) {
                                if (k != i && k != j) {
                                    //Учитываем любые стороны, в том числе, смежные
                                    effectSide = this.sides[k];
                                    currentPiece = sideSideOnLinearEffect(side1, effectSide, currentPiece);
                                    currentPiece = sideSideOnLinearEffect(side2, effectSide, currentPiece);
                                }
                                if (currentPiece === null) break;
                            }
                        }
                        if (currentPiece != null) {
                            currentAlpha = Math.PI - sidesAlpha;
                        }
                    }
                    if (currentAlpha > maxAlpha) {
                        maxAlpha = currentAlpha;
                        //TODO drawing
                    }
                }
            }
            return maxAlpha;
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
