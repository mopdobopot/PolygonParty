/**
 * @Author Lomovtsev Pavel
 * Date: 05.10.13
 * Time: 14:51
 */
var G = (function() {

    return {

        getRandPoint: function(min, max) {
            if (min > max) {
                throw new Error("Неверный диапазон для генерации точки: [" + min + ".." + max + ")");
            } else if (min < 0) {
                throw new Error("Координаты генерируемой точки могут изменяться только от 0 до +inf");
            } else {
                var x = min + Math.random() * (max - min),
                    y = min + Math.random() * (max - min);
                return new Point(x, y);
            }
        },

        dist: function(p1, p2) {
            return Math.sqrt((p2.x - p1.x) * (p2.x - p1.x) + (p2.y - p1.y) * (p2.y - p1.y));
        },

        shiftPolygon: function(vertexes, shiftX, shiftY) {
            for (var i = 0; i < vertexes.length; i++) {
                vertexes[i].x += shiftX;
                vertexes[i].y += shiftY;
            }
            return vertexes;
        },

        vectorSum: function(v1, v2) {
            return {
                x: v1.x + v2.x,
                y: v1.y + v2.y
            }
        },

        mulVectorOnScalar: function(v, n) {
            v.x = v.x * n;
            v.y = v.y * n;
            return v;
        },

        scalarProduct: function(v1, v2) {
            return v1.x * v2.x + v1.y * v2.y;
        },

        vectorProduct: function(v1, v2) {
            return v1.x * v2.y - v2.x * v1.y;
        },

        //Угол от v1 до v2 против часовой стрелки
        calcAlpha: function(v1, v2) {
            var alpha = Math.acos(this.scalarProduct(v1, v2)
                                / this.dist({x: 0, y: 0}, v1)
                                / this.dist({x: 0, y: 0}, v2));
            var vp = this.vectorProduct(v1, v2);
            if (vp > 0) {
                return alpha;
            }
            else {
                return (2 * Math.PI - alpha);
            }
        },

        isRotationRight: function(v1, v2) {
            return this.calcAlpha(v1, v2) > Math.PI;
        },

        makeVector: function(p1, p2) {
            return {x: p2.x - p1.x, y: p2.y - p1.y};
        },

        makeLine: function(p1, p2) {
            return {
                a: p1.y - p2.y,
                b: p2.x - p1.x,
                c: p1.x * p2.y - p2.x * p1.y
            }
        },

        distToLine: function(p, line) {
            return Math.abs(line.a * p.x + line.b * p.y + line.c)
                 / Math.sqrt(line.a * line.a + line.b * line.b);
        },

        distToSegment: function(p, segA, segB) {
            if (this.scalarProduct(this.makeVector(segA, segB), this.makeVector(segA, p)) >= 0
                && this.scalarProduct(this.makeVector(segB, segA), this.makeVector(segB, p)) >= 0) {
                return this.distToLine(p, this.makeLine(segA, segB));
            }
            else {
                return Math.min(this.dist(p, segA), this.dist(p, segB));
            }
        },

        distToPolygon: function(p, vertexes) {
            var l = vertexes.length,
                minDist = this.distToSegment(p, vertexes[l - 1], vertexes[0]);
            for (var i = 0; i < l - 1; i++) {
                minDist = Math.min(minDist, this.distToSegment(p, vertexes[i], vertexes[i + 1]));
            }
        },

        //Возвращает true <=> l1 и l2 имеют ровно одну точку пересечения
        getLinesIntersection: function(l1, l2) {
            var d = l2.a * l1.b - l1.a * l2.b;
            if (d === 0) {
                return false;
            }
            var x = (l1.c * l2.b - l2.c * l1.b) / d,
                y = (l1.a * l2.c - l2.a * l1.c) / d;
            return {x: x, y: y};
        },

        isPointOnSegment: function(p, segA, segB) {
            return p.y <= Math.max(segA.y, segB.y) &&
                   p.y >= Math.min(segA.y, segB.y) &&
                   p.x <= Math.max(segA.x, segB.x) &&
                   p.x >= Math.min(segA.x, segB.x) &&
                   this.vectorProduct(this.makeVector(segA, p), this.makeVector(segA, segB)) === 0;
        },

        isPointOnInterval: function(p, intervalA, intervalB) {
            return this.isPointOnSegment(p, intervalA, intervalB) &&
                   !Point.arePointsEquals(p, intervalA) &&
                   !Point.arePointsEquals(p, intervalB);
        },

        //Лучём считаем правую часть прямой line относительно точки point,
        //пересечение луча и верхнего конца отрезка игнорируем
        isBeamIntersectsSegment: function(line, p, segA, segB) {
            var intersection = this.getLinesIntersection(line, this.makeLine(segA, segB));
            if ((segA.y > segB.y && Point.arePointsEquals(intersection, segA)) ||
                (segB.y > segA.y && Point.arePointsEquals(intersection, segB))) {
                return false;
            }
            return this.isPointOnSegment(intersection, segA, segB) && (intersection.x >= p.x);
        },

        isLineIntersectsInterval: function(line, intervalA, intervalB) {
            var intersection = this.getLinesIntersection(line, this.makeLine(intervalA, intervalB));
            return this.isPointOnInterval(intersection, intervalA, intervalB);
        },

        isSegmentIntersectsInterval: function(segA, segB, intervalA, intervalB) {
            var intersection = this.getLinesIntersection(this.makeLine(segA, segB), this.makeLine(intervalA, intervalB));
            return this.isPointOnInterval(intersection, segA, segB) &&
                   this.isPointOnInterval(intersection, intervalA, intervalB);
        },

        isLineIntersectsPolygon: function(line, vertexes) {
            var l = vertexes.length;
            for (var i = 0; i < l - 1; i++) {
                if (this.isLineIntersectsInterval(line, vertexes[i], vertexes[i + 1])) {
                    return true;
                }
            }
            return this.isLineIntersectsInterval(line, vertexes[l - 1], vertexes[0]);
        },

        isSegmentIntersectsPolygon: function(segA, segB, vertexes) {
            var l = vertexes.length;
            for (var i = 0; i < l - 1; i++) {
                if (this.isSegmentIntersectsInterval(segA, segB, vertexes[i], vertexes[i + 1])) {
                    return true;
                }
            }
            return this.isSegmentIntersectsInterval(segA, segB, vertexes[l - 1], vertexes[0]);
        },

        isPointInPolygon: function(p, vertexes) {
            var beamLine = {a: 0, b: 1, c: -p.y},
                intersections = 0,
                length = vertexes.length;
            for (var i = 0; i < length - 1; i++) {
                if (this.isPointOnSegment(p, vertexes[i], vertexes[i+1])) {
                    return true;
                }
                if (this.isBeamIntersectsSegment(beamLine, p, vertexes[i], vertexes[i + 1])) {
                    intersections++;
                }
            }
            if (this.isBeamIntersectsSegment(beamLine, p, vertexes[length - 1], vertexes[0])) {
                intersections++;
            }
            return intersections % 2;
        },

        rotateVector: function(v, alpha) {
            return {
                x: v.x * Math.cos(alpha) - v.y * Math.sin(alpha),
                y: v.x * Math.sin(alpha) + v.y * Math.cos(alpha)
            }
        },

        getBisector: function(seg1A, seg1B, seg2A, seg2B) {
            var l1 = this.makeLine(seg1A, seg1B),
                l2 = this.makeLine(seg2A, seg2B),
                intersec = this.getLinesIntersection(l1, l2),
                v1 = this.makeVector(seg1A, seg1B),
                v2 = this.makeVector(seg2A, seg2B),
                alpha = this.calcAlpha(v1, v2) / 2,
                vb = this.rotateVector(this.makeVector(intersec, seg1A), alpha),
                pointOnBisector = this.vectorSum(intersec, vb);
            return this.makeLine(intersec, pointOnBisector);
        },

        getNormalToLineContainsSegment: function(point, segA, segB) {
            var v = this.makeVector(segA, segB);
            return {
                a: v.x,
                b: v.y,
                c: -(v.x * point.x + v.y * point.y)
            }
        },

        getCentralNormal: function(p1, p2) {
            var v = this.makeVector(p1, p2),
                c = this.mulVectorOnScalar(v, 0.5);
            return this.getNormalToLineContainsSegment(c, p1, p2);
        },

        getIntersection: function(a, b) {
            if (a === null || b === null)
                return null;
            if (Type.isLine(a)) {
                if (Type.isLine(b)) {
                    return a.getIntersectionWithLine(b);
                }
                else if (Type.isBeam(b)) {
                    return a.getIntersectionWithBeam(b);
                }
                else if (Type.isSegment(b)) {
                    return a.getIntersectionWithSegment(b);
                }
                else if (Type.isParabola(b)) {
                    return b.getIntersectionWithLine(a);
                }
            }
            else if (Type.isBeam(a)) {
                if (Type.isLine(b)) {
                    return b.getIntersectionWithBeam(a);
                }
                else if (Type.isBeam(b)) {
                    return a.getIntersectionWithBeam(b);
                }
                else if (Type.isSegment(b)) {
                    return b.getIntersectionWithBeam(b);
                }
                else if (Type.isParabola(b)) {
                    return b.getIntersectionWithBeam(a);
                }
            }
            else if (Type.isSegment(a)) {
                if (Type.isLine(b)) {
                    return b.getIntersectionWithSegment(a);
                }
                else if (Type.isBeam(b)) {
                    return a.getIntersectionWithBeam(b);
                }
                else if (Type.isSegment(b)) {
                    return a.getIntersectionWithSegment(b);
                }
                else if (Type.isParabola(b)) {
                    return b.getIntersectionWithSegment(a);
                }
            }
            else if (Type.isParabola(a)) {
                if (Type.isLine(b)) {
                    return a.getIntersectionWithSegment(b);
                }
                else if (Type.isBeam(b)) {
                    return a.getIntersectionWithBeam(b);
                }
                else if (Type.isSegment(b)) {
                    return a.getIntersectionWithSegment(b);
                }
                else if (Type.isParabola(b)) {
                    return b.getIntersectionWithParabola(a);
                }
            }
        },

        getRotated: function(obj, phi) {
            if (obj === null)
                return null;
            if (Type.isPoint(obj) || Type.isVector(obj)) {
                return obj.getRotated(phi);
            }
            else if (Type.isSegment(obj)) {
                return new Segment(obj.a.getRotated(phi), obj.b.getRotated(phi));
            }
            else if (Type.isBeam(obj)) {
                return new Beam(obj.point.getRotated(), obj.vector.getRotated());
            }
            else if (Type.isLine(obj)) {
                var a = obj.getPointOn(),
                    b = a.getSum(obj.getDirectingVector());
                return new Line(a.getRotated(phi), b.getRotated(phi));
            }
            else if (Type.isParabola(obj)) {
                return new Parabola(this.getRotated(obj.focus, phi), this.getRotated(obj.directrix, phi));
            }
        },

        getShifted: function(obj, v) {
            if (obj === null)
                return null;
            if (Type.isPoint(obj)) {
                return obj.getShiftedByVector(v);
            }
            else if (Type.isVector(obj)) {
                return obj;
            }
            else if (Type.isSegment(obj)) {
                return new Segment(obj.a.getShiftedByVector(v), obj.b.getShiftedByVector(v));
            }
            else if (Type.isBeam(obj)) {
                return new Beam(obj.point.getShiftedByVector(v), obj.vector);
            }
            else if (Type.isLine(obj)) {
                var a = obj.getPointOn(),
                    b = a.getSum(obj.getDirectingVector());
                return new Line(a.getShiftedByVector(v), b.getShiftedByVector(v));
            }
            else if (Type.isParabola(obj)) {
                return new Parabola(this.getShifted(obj.focus, v), this.getShifted(obj.directrix, v));
            }
        }
    }
})();



