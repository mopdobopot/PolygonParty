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
        cutPeakSectorFromLine = function(peak, centerPerp) {
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
            //Сторона содержится в директрисе параболы => intersec1 и intersec2 содержат одновременно
            //по одной точке или не содержат точек вовсе
            if (intersec1.pointAmount === 0) {
                return null;
            }
            return G.getIntersection(chooseParabolicBeam(parabola, intersec1.p[0], side.beamA, side.beamB),
                                     chooseParabolicBeam(parabola, intersec2.p[0], side.beamB, side.beamA));
        },
        //Возвращает @ParabolicSegment или null
        getPieceForPeakSide = function(peak, side) {
            var d = new Line(side.a, side.b);
            if (d.isPointOn(peak.vertex)) {
                return null;
            }
            //Сначала подозреваем все точки на параболе
            var currentPiece = new Parabola(peak.vertex, d);
            DebugDrawing.drawPoint(currentPiece.vertex, "#0f0", 3);
            DebugDrawing.draw(currentPiece);
            //Затем, отсекаем всё что не лежит в полосе стороны и секторе пика
            var pieceForSide = sideCutFromParabola(side, currentPiece);
            if (pieceForSide === null) {
                return null;
            }
            var pieceForPeak = peakCutFromParabola(peak, currentPiece);
            return G.getIntersection(pieceForPeak, pieceForSide);
        },
        //Возвращает @Beam, @Segment или null
        getPieceForPeakPeak = function(peak1, peak2) {
            if (peak1.isNeighbour(peak2)) {
                return null;
            }
            var seg = new Segment(peak1.vertex, peak2.vertex);
            DebugDrawing.drawSegment(seg, "#ddd");
            var center = seg.getCenter();
            DebugDrawing.drawPoint(center, "#666", 0.8);
            //Сначала подозреваем все точки на серединном перпендикуляре
            var centerPerp = seg.getCentralPerpendicular();
            DebugDrawing.draw(centerPerp, "#aaa");
            //Затем, отсекаем всё что не лежит в секторах пиков
            var pieceForPeak1 = cutPeakSectorFromLine(peak1, centerPerp, center);
            DebugDrawing.draw(pieceForPeak1);
            var pieceForPeak2 = cutPeakSectorFromLine(peak2, centerPerp, center);
            DebugDrawing.draw(pieceForPeak2);
            return G.getIntersection(pieceForPeak1, pieceForPeak2);
        },
        peakOnPeakPeakEffect = function(peak, effectPeak, currentPiece) {
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
                    var v = new Vector(intersec, pointOnCurrentPiece);
                    if (effectCenterPerp.arePointsOnSameSide(effectPeak.vertex, pointOnCurrentPiece)) {
                        v = v.getMulOnScalar(-1);
                    }
                    var beam = new Beam(intersec, v);
                    return G.getIntersection(currentPiece, beam);
                }
            }
            return currentPiece;
        },
        sideOnPeakPeakEffect = function(peak, effectSide, currentPiece) {
            if (currentPiece === null) {
                return null;
            }
            var effectPiece = getPieceForPeakSide(peak, effectSide);
            if (effectPiece != null) {
                var effectParabola = new Parabola(peak.vertex, new Line(effectSide.a, effectSide.b));
                DebugDrawing.draw(effectParabola);
                var intersec = G.getIntersection(currentPiece, effectParabola);
                //intersec это @Point x2, @Point или null
                if (intersec.pointAmount === 0) {
                    //Если отрезок соединияющий фокус effectParabola с точкой на currentPiece пересекает параболу,
                    //то currentPiece целиком ближе к effectSide, иначе effectSide не оказывает эффекта
                    var s = new Segment(peak.vertex, currentPiece.getPointOn());
                    return G.getIntersection(s, effectParabola) != null ? null
                                                                        : currentPiece;
                }
                else if (intersec.pointAmount === 1) {
                    var directingV = currentPiece.getDirectingVector();
                    decreaseShiftingVector(effectParabola, intersec.p[0], directingV);
                    var p = intersec.p[0].getShiftedByVector(directingV);
                    s = new Segment(p, peak.vertex);
                    var x = G.getIntersection(s, effectParabola);
                    if (x.pointAmount != 0) {
                        directingV = directingV.getMulOnScalar(-1);
                    }
                    return G.getIntersection(currentPiece, new Beam(intersec.p[0], directingV));
                }
                else {
                    //TODO парабола пересекает currentPiece в двух точках
                }
            }
            return currentPiece;
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
        },
        //Выбирает точку ближайшую к середине отрезка, соединяющего пики и вычисляет для неё альфа
        getBestAlphaForPeakPeak = function(currentPiece, peak1, peak2) {
            if (Type.isSegment(currentPiece)) {
                var center = new Segment(peak1.vertex, peak2.vertex).getCenter();
                if (currentPiece.isPointOn(center)) {
                    var v1 = new Vector(center, peak1.vertex);
                    var v2 = new Vector(center, peak2.vertex);
                    return v1.getMinAlpha(v2);
                }
                else {
                    v1 = new Vector(currentPiece.a, peak1.vertex);
                    v2 = new Vector(currentPiece.b, peak1.vertex);
                    if (v1.getModule() > v2.getModule()) {
                        v1 = v2;
                        v2 = new Vector(currentPiece.b, peak2.vertex);
                    }
                    else {
                        v2 = new Vector(currentPiece.a, peak2.vertex);
                    }
                    return v1.getMinAlpha(v2);
                }
            }
            else if (Type.isBeam(currentPiece)) {
                v1 = new Vector(currentPiece.point, peak1.vertex);
                v2 = new Vector(currentPiece.point, peak2.vertex);
                return v1.getMinAlpha(v2);
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
            var maxAlpha = 0;
            var lp = this.peaks.length;
            var ls = this.sides.length;
            //Перебор всех пар несоседних пиков
            for (var i = 0; i < lp - 1; i++) {
                for (var j = i + 1; j < lp; j++) {
                    var pi = this.peaks[i];
                    var pj = this.peaks[j];
                    var currentPiece = getPieceForPeakPeak(pi, pj);
                    //Если пересечение пусто, то пара пиков не представляет интереса. Иначе:
                    if (currentPiece != null) {
                        //Влияние пиков на пару пик-пик
                        for (var k = 0; k < lp; k++) {
                            if (k != i && k != j) {
                                var pk = this.peaks[k];
                                if (!pi.isNeighbour(pk)) {
                                    currentPiece = peakOnPeakPeakEffect(pi, pk, currentPiece);
                                }
                                if (!pj.isNeighbour(pk)) {
                                    currentPiece = peakOnPeakPeakEffect(pj, pk, currentPiece);
                                }
                                if (currentPiece === null) break;
                            }
                        }
                        //Если множество пусто, переходим к следующей паре пиков
                        if (currentPiece === null) continue;
                        //Влияние сторон на пару пик-пик
                        for (k = 0; k < ls; k++) {
                            var sk = this.sides[k];
                            if (!pi.vertex.equalsToPoint(sk.a) && !pi.vertex.equalsToPoint(sk.b) &&
                                !pj.vertex.equalsToPoint(sk.a) && !pj.vertex.equalsToPoint(sk.b)) {
                                currentPiece = sideOnPeakPeakEffect(pi, sk, currentPiece);
                                currentPiece = sideOnPeakPeakEffect(pj, sk, currentPiece);
                            }
                            if (currentPiece === null) break;
                        }
                        if (currentPiece != null) {
                            //Выбор точки на CurrentPiece для вычисления заветного угла
                            var currentAlpha = getBestAlphaForPeakPeak(currentPiece, pi, pj);
                            maxAlpha = Math.max(maxAlpha, currentAlpha);
                        }
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
