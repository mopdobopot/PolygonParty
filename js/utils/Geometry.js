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
            return minDist;
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

        //Пересечение луча и верхнего конца отрезка игнорируем
        isBeamIntersectsSegment: function(beam, p, segA, segB) {
            var intersection = this.getIntersection(beam, new Line(segA, segB));
            return intersection != null;
        },

        isLineIntersectsInterval: function(line, intervalA, intervalB) {
            var intersection = this.getIntersection(line, new Line(intervalA, intervalB));
            return this.isPointOnInterval(intersection, intervalA, intervalB);
        },

        isSegmentIntersectsInterval: function(segA, segB, intervalA, intervalB) {
            var intersection = this.getIntersection(new Line(segA, segB), new Line(intervalA, intervalB));
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
            var sumAlpha = 0;
            for (var i = 0; i < vertexes.length - 1; i++) {
                var a = new Vector(p, vertexes[i]).getAlpha(new Vector(p, vertexes[i + 1]));
                sumAlpha += (a > Math.PI) ? a - 2 * Math.PI : a;
            }
            a = new Vector(p, vertexes[vertexes.length - 1]).getAlpha(new Vector(p, vertexes[0]));
            sumAlpha += (a > Math.PI) ? a - 2 * Math.PI : a;
            return Math.abs(sumAlpha - Math.PI * 2) < 0.01;
        },

        rotateVector: function(v, alpha) {
            return {
                x: v.x * Math.cos(alpha) - v.y * Math.sin(alpha),
                y: v.x * Math.sin(alpha) + v.y * Math.cos(alpha)
            }
        },

        getBisectors: function(line1, line2) {
            var intersec = this.getIntersection(line1, line2),
                alpha = line1.getDirectingVector().getAlpha(line2.getDirectingVector()) / 2,
                v1 = line1.getDirectingVector().getRotated(alpha),
                v2 = v1.getRotated(Math.PI / 2);
            if (intersec === null) {
                return null;
            }
            if (intersec === Infinity) {
                return line1;
            }
            //Пара пересекающихся прямых задаёт 2 биссектрисы
            return {
                b1: new Line(intersec, intersec.getShiftedByVector(v1)),
                b2: new Line(intersec, intersec.getShiftedByVector(v2))
            }
        },

        //Возвращает биссектрису, проходящую через область в которой лежит точка
        chooseBisectorInSameSectorAsPoint: function(line1, line2, point) {
            var intersec = this.getIntersection(line1, line2);
            if (intersec === null || intersec === Infinity) {
                return null;
            }
            var bisectors = this.getBisectors(line1, line2),
                b1 = bisectors.b1,
                b2 = bisectors.b2,
                p = intersec.getShiftedByVector(b1.getDirectingVector()),
                invertedP = intersec.getShiftedByVector(b1.getDirectingVector().getMulOnScalar(-1));
            if (line1.arePointsOnSameSide(point, p) && line2.arePointsOnSameSide(point, p) ||
                line1.arePointsOnSameSide(point, invertedP) && line2.arePointsOnSameSide(point, invertedP)) {
                return b1;
            }
            else {
                return b2;
            }
        },

        //Возвращает медиатрису двух параллельных прямых
        getMidLine: function(line1, line2) {
            if (line1.getIntersectionWithLine(line2) != null)
                throw Error("Невозможно найти медиатрису, прямые не параллельны");
            var d = line1.getPointOn().distToLine(line2) / 2,
                normalizedNormalVector = line1.getNormalVector().getMulOnScalar(d / line1.getNormalVector().getModule());
            //Разворачиваем вектор нормали, чтобы он был направлен ко второй прямой
            if (!line1.arePointsOnSameSide(line1.getPointOn().getShiftedByVector(normalizedNormalVector), line2.getPointOn())) {
                normalizedNormalVector = normalizedNormalVector.getMulOnScalar(-1);
            }
            var p1 = line1.getPointOn().getShiftedByVector(normalizedNormalVector),
                p2 = line1.getPointOn().getShiftedByVector(line1.getDirectingVector()).getShiftedByVector(normalizedNormalVector);
            return new Line(p1, p2);
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

        isPointAtDistanceToPolygon: function(p, dist, vertexes) {     //todo перенести в Geometry
            return !this.isPointInPolygon(p, vertexes) && Math.abs(this.distToPolygon(p, vertexes) - dist) <= Config.eps;
        },

        getIntersection: function(a, b) {
            if (a === null || b === null)
                return null;
            if (Type.isPoint(a)) {
                if (Type.isPoint(b)) {
                    return a.equalsToPoint(b) ? a : null;
                }
                else {
                    return b.isPointOn(a);
                }
            }
            else if (Type.isPoint(b)) {
                return a.isPointOn(b);
            }
            else if (Type.isLine(a)) {
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
                else if (Type.isParabolicBeam(b)) {
                    return b.getIntersectionWithOtherShape(a);
                }
                else if (Type.isParabolicSegment(b)) {
                    return b.getIntersectionWithOtherShape(a);
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
                    return b.getIntersectionWithBeam(a);
                }
                else if (Type.isParabola(b)) {
                    return b.getIntersectionWithBeam(a);
                }
                else if (Type.isParabolicBeam(b)) {
                    return b.getIntersectionWithOtherShape(a);
                }
                else if (Type.isParabolicSegment(b)) {
                    return b.getIntersectionWithOtherShape(a);
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
                else if (Type.isParabolicBeam(b)) {
                    return b.getIntersectionWithOtherShape(a);
                }
                else if (Type.isParabolicSegment(b)) {
                    return b.getIntersectionWithOtherShape(a);
                }
            }
            else if (Type.isParabola(a)) {
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
                    return b.getIntersectionWithParabola(a);
                }
                else if (Type.isParabolicBeam(b)) {
                    return b.getIntersectionWithOtherShape(a);
                }
                else if (Type.isParabolicSegment(b)) {
                    return b.getIntersectionWithOtherShape(a);
                }
            }
            else if (Type.isParabolicBeam(a)) {
                if (Type.isParabolicBeam(b)) {
                    return a.getIntersectionWithParabolicBeam(b);
                }
                else if (Type.isParabolicSegment(b)) {
                    return a.getIntersectionWithParabolicSegment(b);
                }
                else {
                    return a.getIntersectionWithOtherShape(b);
                }
            }
            else if (Type.isParabolicSegment(a)) {
                if (Type.isParabolicBeam(b)) {
                    return b.getIntersectionWithParabolicSegment(a);
                }
                else if (Type.isParabolicSegment(b)) {
                    return a.getIntersectionWithParabolicSegment(b);
                }
                else {
                    return a.getIntersectionWithOtherShape(b);
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



