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
        isBeam = function(obj) {
            return obj.hasOwnProperty("line");
        },
        isLine = function(obj) {
            return obj.hasOwnProperty("c");
        },
        isSegment = function(obj) {
            return obj.hasOwnProperty("beamA");
        },
        beamCut = function(p, peak, center) {
            var v1 = peak.beam1.vector,
                v2 = peak.beam2.vector,
                vCenter = new Vector(peak.vertex, center);
            //Определяем направление луча-пересечения
            if (v1.getVectorProduct(v2) * v1.getVectorProduct(vCenter) > 0) {
                return new Beam(p, new Vector(p, center));
            }
            else {
                return new Beam(p, new Vector(p, center).getMulOnScalar(-1));
            }
        },
        //Отсечение лучами пика
        peakCut = function(peak, currentPiece, center) {
            if (isLine(currentPiece)) {
                var p1 = currentPiece.getIntersectionWithBeam(peak.beam1),
                    p2 = currentPiece.getIntersectionWithBeam(peak.beam2);
                //Если оба луча пересекают прямую, они отсекают отрезок
                if (p1 != null && p2 != null) {
                    return new Segment(p1, p2);
                }
                //Если один из лучей пересекает прямую, он отсекает луч
                else if (p1 != null) {
                    return beamCut(p1, peak, center);
                }
                else if (p2 != null) {
                    return beamCut(p2, peak, center);
                }
                //Ни один из лучей не пересекает прямую
                else {
                    return currentPiece;
                }
            }
            else if (isBeam(currentPiece)) {

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
            var l = this.peaks.length,
                seg, pi, pj, center, currentPiece; //currentPiece — множество подозреваемых точек
            //Перебор всех пар несоседних пиков
            for (var i = 0; i < l - 1; i++) {
                for (var j = i + 1; j < l; j++) {
                    pi = this.peaks[i];
                    pj = this.peaks[j];
                    if (!pi.isNeighbour(pj)) {
                        seg = new Segment(pi.vertex, pj.vertex);
                        center = seg.getCenter();
                        //Сначала подозреваем все точки на серединном перпендикуляре
                        currentPiece = seg.getCentralPerpendicular();

                    }
                }
            }
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
