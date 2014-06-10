/**
 * @Author Lomovtsev Pavel
 * Date: 05.10.13
 * Time: 15:04
 */
var BasePolygon = (function() {

    var getTrapezeSquare = function(v1, v2) {
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
        chooseParabolicBeam = function(parabola, intersection, intersectingBeam, anotherBeam) {
            var v = new Vector(intersectingBeam.getPointOn(), anotherBeam.getPointOn()),
                normalV = intersectingBeam.getNormalVector(),
                directingV = intersectingBeam.vector;
            if (directingV.getVectorProduct(v) * directingV.getVectorProduct(normalV) > 0) {
                return new ParabolicBeam(parabola, intersection, normalV);
            }
            else {
                return new ParabolicBeam(parabola, intersection, normalV.getMulOnScalar(-1));
            }
        },
        peakCutFromCenterPerp = function(peak, centerPerp) {
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
        peakCutFromParabola = function(peak, parabola) {
            var intersec1 = G.getIntersection(parabola, peak.beam1),
                intersec2 = G.getIntersection(parabola, peak.beam2);
            //peak это фокус параболы => intersec1 и intersec2 содержат ровно по одной точке
            return G.getIntersection(chooseParabolicBeam(parabola, intersec1.p[0], peak.beam1, peak.beam2),
                                     chooseParabolicBeam(parabola, intersec2.p[0], peak.beam2, peak.beam1));
        },
        sideCutFromParabola = function(side, parabola) {
            var intersec1 = G.getIntersection(parabola, side.beamA),
                intersec2 = G.getIntersection(parabola, side.beamB);
            //Сторона содержится в директрисе параболы => intersec1 и intersec2 содержат ровно по одной точке
            return G.getIntersection(chooseParabolicBeam(parabola, intersec1.p[0], side.beamA, side.beamB),
                                     chooseParabolicBeam(parabola, intersec2.p[0], side.beamB, side.beamA));
        },
        //Возвращает @Beam, @Segment или null
        getPieceForPeakPeak = function(peak1, peak2) {
            if (peak1.isNeighbour(peak2)) {
                return null;
            }
            var seg = new Segment(peak1.vertex, peak2.vertex);
            var center = seg.getCenter();
            //Сначала подозреваем все точки на серединном перпендикуляре
            var currentPiece = seg.getCentralPerpendicular();
            //Затем, отсекаем всё что не лежит в секторах пиков
            var pieceForPeak1 = peakCutFromCenterPerp(peak1, currentPiece, center);
            var pieceForPeak2 = peakCutFromCenterPerp(peak2, currentPiece, center);
            return G.getIntersection(pieceForPeak1, pieceForPeak2);
        },
        //Возвращает @ParabolicSegment или null
        getPieceForPeakSide = function(peak, side) {
            var d = new Line(side.a, side.b);
            if (d.isPointOnLine(peak.vertex)) {
                return null;
            }
            //Сначала подозреваем все точки на параболе
            var currentPiece = new Parabola(peak, d),
                //Затем, отсекаем всё что не лежит в полосе стороны и секторе пика
                pieceForSide = sideCutFromParabola(side, currentPiece);
            if (pieceForSide === null) {
                return null;
            }
            var pieceForPeak = peakCutFromParabola(peak, currentPiece);
            return G.getIntersection(pieceForPeak, pieceForSide);
        },
        applyPeakEffect = function(peak, effectPeak, currentPiece) {
            if (currentPiece === null) {
                return null;
            }
            var effectPiece, intersec, effectCenterPerp, pointOnCurrentPiece, beam, v;
            effectPiece = getPieceForPeakPeak(peak, effectPeak);
            if (effectPiece === null) {
                return currentPiece;
            }
            else {
                intersec = G.getIntersection(currentPiece, effectPiece);
                //intersec это @Point или null (TODO порисовать, убедиться)
                effectCenterPerp = new Segment(peak.vertex, effectPeak.vertex).getCentralPerpendicular();
                pointOnCurrentPiece = currentPiece.getPointOn();
                if (intersec === null) {
                    //Если currentPiece целиком лежит ближе к effectPeak чем к peak, то currentPiece — пуст,
                    //иначе, effectPeak не оказывает влияния на currentPiece
                    return effectCenterPerp.arePointsOnSameSide(effectPeak.vertex, pointOnCurrentPiece) ? null
                                                                                                        : currentPiece;
                }
                else {
                    //Выбираем направление на которое не влияет effectPeak
                    v = new Vector(intersec, pointOnCurrentPiece);
                    if (effectCenterPerp.arePointsOnSameSide(effectPeak.vertex, pointOnCurrentPiece)) {
                        v = v.getMulOnScalar(-1);
                    }
                    beam = new Beam(intersec, v);
                    return G.getIntersection(currentPiece, beam);
                }
            }
        },
        applySideEffect = function(peak, effectSide, currentPiece) {
            if (currentPiece === null) {
                return null;
            }
            var effectPiece, intersec, effectParabola, pointOnCurrentPiece, s, p;
            effectPiece = getPieceForPeakSide(peak, effectSide);
            if (effectPiece === null) {
                return currentPiece;
            }
            else {
                intersec = G.getIntersection(currentPiece, effectPiece);
                //intersec это @Point или null (TODO порисовать, убедиться)
                effectParabola = new Parabola(peak.vertex, new Line(effectSide.a, effectSide.b));
                pointOnCurrentPiece = currentPiece.getPointOn();
                if (intersec === null) {
                    //Если отрезок соединияющий фокус effectParabola с точкой на currentPiece пересекает параболу,
                    //то currentPiece целиком ближе к effectSide, иначе effectSide не оказывает эффекта
                    s = new Segment(peak.vertex, pointOnCurrentPiece);
                    return G.getIntersection(s, effectParabola) != null ? null
                                                                        : currentPiece;
                }
                else {
                    //Пока только для пар пик-пик
                    p = intersec.getShiftedByVector(currentPiece.getDirectingVector());
                    s = new Segment(p, peak.vertex);
                    var directingV = currentPiece.getDirectingVector();
                    if (G.getIntersection(s, effectParabola) != null) {
                        directingV = directingV.getMulOnScalar(-1);
                    }
                    return G.getIntersection(currentPiece, new Beam(intersec, directingV));
                }
            }
        },
        getBestAlphaForPeakPeak = function(currentPiece, peak1, peak2) {
            var v1, v2;
            if (Type.isSegment(currentPiece)) {
                v1 = new Vector(currentPiece.a, peak1.vertex);
                v2 = new Vector(currentPiece.b, peak1.vertex);
                if (v1.getModule() > v2.getModule()) {
                    v1 = v2;
                    v2 = new Vector(currentPiece.b, peak2.vertex);
                }
                else {
                    v2 = new Vector(currentPiece.a, peak2.vertex);
                }
                return v1.getAlpha(v2);
            }
            else if (Type.isBeam(currentPiece)) {
                v1 = new Vector(currentPiece.point, peak1.vertex);
                v2 = new Vector(currentPiece.point, peak2.vertex);
                return v1.getAlpha(v2);
            }
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
            var maxAlpha = 0,
                lp = this.peaks.length,
                ls = this.sides.length,
                pi, pj, pk, sk, currentPiece; //currentPiece — множество подозреваемых точек
            //Перебор всех пар несоседних пиков
            for (var i = 0; i < lp - 1; i++) {
                for (var j = i + 1; j < lp; j++) {
                    pi = this.peaks[i];
                    pj = this.peaks[j];
                    currentPiece = getPieceForPeakPeak(pi, pj);
                    //Если пересечение пусто, то пара пиков не представляет интереса. Иначе:
                    if (currentPiece != null) {
                        //Влияние остальных пиков на выделенный промежуток
                        for (var k = 0; k < lp; k++) {
                            pk = this.peaks[k];
                            if (!pk.vertex.equalsToPoint(pi) && !pk.vertex.equalsToPoint(pj)) {
                                currentPiece = applyPeakEffect(pi, pk, currentPiece);
                                currentPiece = applyPeakEffect(pj, pk, currentPiece);
                                if (currentPiece === null) break;
                            }
                        }
                        //Если множество пусто, переходим к следующей паре
                        if (currentPiece === null) continue;
                        //Влияние сторон на выделенный промежуток
                        for (k = 0; k < ls; k++) {
                            sk = this.sides[k];
                            if (!pi.equalsToPoint(sk.a) && !pi.equalsToPoint(sk.b)) {
                                currentPiece = applySideEffect(pi, sk, currentPiece);
                                if (currentPiece === null) break;
                            }
                            if (!pj.equalsToPoint(sk.a) && !pj.equalsToPoint(sk.b)) {
                                currentPiece = applySideEffect(pj, sk, currentPiece);
                                if (currentPiece === null) break;
                            }
                        }
                        //Выбор точки на CurrentPiece для вычисления заветного угла
                        var currentAlpha = getBestAlphaForPeakPeak(currentPiece, pi, pj);
                        maxAlpha = Math.max(maxAlpha, currentAlpha);
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
