/**
 * @Author Lomovtsev Pavel
 * Date: 05.10.13
 * Time: 15:04
 */
var BasePolygon = (function() {

    var getTrapezeSquare = function(v1, v2) {
            return (v1.y + v2.y) * (v2.x - v1.x) / 2;
        },
        pocketFinder = function(pocketStart, vertexes) {
            var l = vertexes.length,
                i = undefined,
                j = pocketStart,
                isFinal = false,
                k, v1, v2;
            do {
                if (i === 0 && pocketStart != 0) {
                    isFinal = true;
                }
                i = j;
                j = (i + 1) % l;
                k = (i + 2) % l;
                v1 = G.makeVector(vertexes[i], vertexes[j]);
                v2 = G.makeVector(vertexes[j], vertexes[k]);
            } while (!G.isRotationRight(v1, v2));
            return {pocketFinish: j, isFinal: isFinal};
        },
        checkPocket = function(s, f, pushAlphaFunc, vertexes) {
            var intersec, p1, p2, p3, p4, v1, v2, l1, l2, bisector;
            for (var i = s; i < f - 1; i++) {
                for (var j = i + 1; j < f; j++) {
                    p1 = vertexes[i];
                    p2 = vertexes[i + 1];
                    p3 = vertexes[j];
                    p4 = vertexes[j + 1];
                    v1 = G.makeVector(p1, p2);
                    v2 = G.makeVector(p3, p4);
                    if (Point.arePointsEquals(p2, p3)) {
                        pushAlphaFunc(G.calcAlpha(v1, v2) - Math.PI);
                    }
                    else {
                        l1 = G.makeLine(p1, p2);
                        l2 = G.makeLine(p3, p4);
                        intersec = G.getLinesIntersection(l1, l2);
                        if (intersec) {
                            bisector = G.getBisector(p1, p2, p3, p4);
                            analyzeBisector(p1, p2, p3, p4, bisector, pushAlphaFunc, vertexes);
                            analyzeBisector(p2, p1, p3, p4, bisector, pushAlphaFunc, vertexes);
                            analyzeBisector(p3, p4, p1, p2, bisector, pushAlphaFunc, vertexes);
                            analyzeBisector(p4, p3, p1, p2, bisector, pushAlphaFunc, vertexes);
                        }
                        else {
                            analyzeParallelSegments(p1, p2, p3, p4, pushAlphaFunc, vertexes);
                            analyzeParallelSegments(p2, p1, p3, p4, pushAlphaFunc, vertexes);
                            analyzeParallelSegments(p3, p4, p1, p2, pushAlphaFunc, vertexes);
                            analyzeParallelSegments(p4, p3, p1, p2, pushAlphaFunc, vertexes);
                        }
                    }
                }
            }
        },
    //Бросает пару перпендикуляров из seg1A, проверяет попадание в [seg2A, seg2B] и, если попали,
    // проверяет точку на биссектрисе
        analyzeBisector = function(seg1A, seg1B, seg2A, seg2B, bisector, pushAlphaFunc, vertexes) {
            var normal1 = G.getNormalToLineContainsSegment(seg1A, seg1A, seg1B),
                pointOnBisector = G.getLinesIntersection(bisector, normal1),
                normal2 = G.getNormalToLineContainsSegment(pointOnBisector, seg2A, seg2B),
                line = G.makeLine(seg2A, seg2B),
                pointOnSide = G.getLinesIntersection(normal2, line);
            if (G.isPointOnSegment(pointOnSide, seg2A, seg2B) &&
                isPointSatisfactory(pointOnBisector, G.dist(pointOnBisector, pointOnSide), vertexes)) {
                var v1 = G.makeVector(seg1A, pointOnBisector),
                    v2 = G.makeVector(pointOnBisector, pointOnSide),
                    alpha = G.calcAlpha(v1, v2);
                if (alpha > Math.PI) {
                    alpha = 2 * Math.PI - alpha;
                }
                pushAlphaFunc(alpha);
            }
        },
    //Проводит перпендикуляр из seg1A, проверяет попадание в [seg2A, seg2B] и, если попали,
    // проверяет точку на середине перпендикуляра
        analyzeParallelSegments = function(seg1A, seg1B, seg2A, seg2B, pushAlphaFunc, vertexes) {
            var normal = G.getNormalToLineContainsSegment(seg1A, seg1A, seg1B),
                line = G.makeLine(seg2A, seg2B),
                pointOnSide = G.getLinesIntersection(normal, line);
            if (G.isPointOnSegment(pointOnSide, seg2A, seg2B)) {
                var v = G.makeVector(seg1A, pointOnSide);
                v = G.mulVectorOnScalar(v, 0.5);
                var p = G.vectorSum(seg1A, v);
                if (isPointSatisfactory(p, G.dist(seg1A, pointOnSide), vertexes)) {
                    pushAlphaFunc(Math.PI);
                }
            }
        },
        isPointSatisfactory = function(p, dist, vertexes) {
            return !G.isPointInPolygon(p, vertexes) && (G.distToPolygon(p, vertexes) >= dist);
        },
        analyzePeaks = function(peaks, pushAlphaFunc, vertexes) {
            var l = peaks.length,
                p1, p1Right, p2, p2Left, centerNormal, sideNormal, p, v1, v2;
            for (var i = 0; i < l - 1; i++) {
                for (var j = i + 1; j < l; j++) {
                    if (Math.abs(peaks[i] - peaks[j]) > 1) {
                        p1 = vertexes[peaks[i]];
                        p2 = vertexes[peaks[j]];
                        centerNormal = G.getCentralNormal(p1, p2);
                        p1Right = vertexes[(peaks[i] + 1) % l];
                        sideNormal = G.getNormalToLineContainsSegment(p1, p1, p1Right);
                        p = G.getLinesIntersection(centerNormal, sideNormal);
                        v1 = G.makeVector(p, p1);
                        v2 = G.makeVector(p, p2);
                        if (isPointSatisfactory(p, G.dist(p1, p), vertexes)) {
                            pushAlphaFunc(G.calcAlpha(v1, v2));
                        }
                        p2Left = (peaks[j] === 0) ? vertexes[l - 1] : vertexes[peaks[j] - 1];
                        sideNormal = G.getNormalToLineContainsSegment(p2, p2, p2Left);
                        p = G.getLinesIntersection(centerNormal, sideNormal);
                        v1 = G.makeVector(p, p1);
                        v2 = G.makeVector(p, p2);
                        if (isPointSatisfactory(p, G.dist(p2, p), vertexes)) {
                            pushAlphaFunc(G.calcAlpha(v1, v2));
                        }
                    }
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

        rotate: function(phi) {
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
                this.addVertex({x: newX, y: newY});
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
            var peaks = [],
                result,
                pStart = 0, pFinish,
                suspectAlphas = [],
                maxAlpha = 0,
                pushAlphaFunc = function(alpha) {
                    maxAlpha = Math.max(maxAlpha, alpha);
                    suspectAlphas.push(alpha);
                };
            do {
                result = pocketFinder(pStart, this.vertexes);
                pFinish = result.pocketFinish;
                peaks.push(pFinish);
                if (Math.abs(pStart - pFinish) > 1) {
                    checkPocket(pStart, pFinish, pushAlphaFunc, this.vertexes);
                }
                pStart = pFinish;
            } while (!result.isFinal);
            analyzePeaks(peaks, pushAlphaFunc, this.vertexes);
            return maxAlpha;
        },

        centerAndDraw: function(width, height, context, isVertexNumberNeeded) {
            this.center(width, height);
            Drawing.drawPolygon(this.vertexes, context, width, height, isVertexNumberNeeded);
        },

        centerRotateAndDraw: function(width, height, context, isVertexNumberNeeded) {
            this.rotate(Math.random() * Math.PI);
            this.center(width, height);
            Drawing.drawPolygon(this.vertexes, context, width, height, isVertexNumberNeeded);
        }
    }
})();
