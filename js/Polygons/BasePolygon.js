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
                v1 = side1.getVector();
                v2 = side2.getVector();
                if (v1.getAlpha(v2) < Math.PI) {
                    peaks.push(new Peak(vertexes[i], side1, side2));
                }
            }
            return {sides: sides, peaks: peaks};
        },
        //Определяет направление луча-(множества допустимых точек, не попадающих в полосу стороны)
        chooseBeam = function(intersection, curBeam, peak, center) {
            var v1, v2, vCenter = new Vector(intersection, center);
            if (curBeam.equalsToBeam(peak.beam1)) {
                v1 = peak.beam1.vector;
                v2 = peak.beam2.vector;
            }
            else if (curBeam.equalsToBeam(peak.beam2)) {
                v1 = peak.beam2.vector;
                v2 = peak.beam1.vector;
            }
            else {
                throw new Error("метод chooseBeam() вызван с несвязанными пиком и лучём");
            }
            if (v1.getVectorProduct(v2) * v1.getVectorProduct(vCenter) > 0) {
                return new Beam(intersection, vCenter);
            }
            else {
                return new Beam(intersection, vCenter.getMulOnScalar(-1));
            }
        },
        //Отсекает кусок от currentPiece лучами пика
        peakCut = function(peak, currentPiece, center) {
            var intersec1 = G.getIntersection(currentPiece, peak.beam1),
                intersec2 = G.getIntersection(currentPiece, peak.beam2);
            if (intersec1 === null) {
                return intersec2 === null ? null : chooseBeam(intersec2, peak.beam2, peak, center);
            }
            else if (intersec2 === null) {
                return chooseBeam(intersec1, peak.beam1, peak, center);
            }
            else {
                return G.getIntersection(chooseBeam(intersec1, peak.beam1, peak, center),
                                         chooseBeam(intersec2, peak.beam2, peak, center));
            }
        },
        //Может вернуть @Beam, @Segment или null
        getPieceForPeakPeak = function(peak1, peak2) {
            if (peak1.isNeighbour(peak2)) {
                return null;
            }
            var seg = new Segment(peak1.vertex, peak2.vertex),
                center = seg.getCenter(),
                //Сначала подозреваем все точки на серединном перпендикуляре
                currentPiece = seg.getCentralPerpendicular(),
                //Затем, отсекаем всё что не лежит в секторах пиков
                pieceForPeak1 = peakCut(peak1, currentPiece, center),
                pieceForPeak2 = peakCut(peak2, currentPiece, center);
            return G.getIntersection(pieceForPeak1, pieceForPeak2);
        },
        //Возвращает обновлённый currentPiece с учётом эффекта, оказываемого effectPeak
        applyPeakEffect = function(peak, effectPeak, currentPiece) {
            if (currentPiece === null) {
                return null;
            }
            var effectPiece, intersec, centPerp, pointOnCurrentPiece, beam, v;
            effectPiece = getPieceForPeakPeak(peak, effectPeak);
            if (effectPiece === null) {
                return currentPiece;
            }
            else {
                //intersec это @Point или null (TODO порисовать, убедиться)
                intersec = G.getIntersection(currentPiece, effectPiece);
                centPerp = new Segment(peak, effectPeak).getCentralPerpendicular();
                pointOnCurrentPiece = currentPiece.getPointOn();
                if (intersec === null) {
                    //TODO БАГ! effectPeak — луч, непересекающий луч currentPiece и логика неверная
                    //Если currentPiece целиком лежит ближе к effectPeak чем к peak, то currentPiece — пуст,
                    //иначе, effectPeak не оказывает влияния на currentPiece
                    return centPerp.arePointsOnSameSide(effectPeak, pointOnCurrentPiece) ? null
                                                                                         : currentPiece;
                }
                else {
                    //Выбираем направление на которое не влияет effectPeak
                    v = new Vector(intersec, pointOnCurrentPiece);
                    if (centPerp.arePointsOnSameSide(effectPeak, pointOnCurrentPiece)) {
                        v = v.getMulOnScalar(-1);
                    }
                    beam = new Beam(intersec, v);
                    return G.getIntersection(currentPiece, beam);
                }
            }
        };

    return {
        //Хорошим считаем обход по часовой стрелке
        vertexes: [],
        minX: 0,
        maxX: 0,
        minY: 0,
        maxY: 0,
        type: "Тип не определён",
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
            var lp = this.peaks.length,
                ls = this.sides.length,
                pi, pj, pk, currentPiece; //currentPiece — множество подозреваемых точек
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
                                if (currentPiece === null) {
                                    break;
                                }
                            }
                        }
                        //Влияние сторон на выделенный промежуток
                        for (k = 0; k < ls; k++) {

                        }
                    }
                }
            }
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
