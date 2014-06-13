/**
 * @author Lomovtsev Pavel
 * Date: 10.04.2014
 * Time: 23:10
 */
function Line(a, b, c) {
    //Представление ax + by + c = 0
    //По двум точкам
    if (c === undefined) {
        this.a = a.y - b.y;
        this.b = b.x - a.x;
        if (this.a === 0 && this.b === 0)
            throw new Error("Для задания прямой необходимо чтобы a != 0 или b != 0");
        this.c = a.x * b.y - b.x * a.y;
        this.pointOnLine = a;
    }
    //Конкретные значения a, b и с
    else {
        if (a === 0 && b === 0)
            throw new Error("Для задания прямой необходимо чтобы a != 0 или b != 0");
        this.a = a;
        this.b = b;
        this.c = c;
        this.pointOnLine = b != 0 ? new Point(0, -c / b) : new Point(-c / a, 0);
    }
    //Представление y = m * x + n
    if (this.b != 0) {
        this.isXConst = false;
        this.m = -this.a / this.b;
        this.n = -this.c / this.b;
    }
    else {
        this.isXConst = true;
        this.x = -this.c / this.a;
    }

    this.getPointOn = function() {
        return this.pointOnLine;
    };
    this.getDirectingVector = function() {
        return new Vector(-this.b, this.a);
    };
    this.getNormalVector = function() {
        return new Vector(this.a, this.b);
    };
    this.arePointsOnSameSide = function(p1, p2) {
        var v = this.getDirectingVector(),
            v1 = new Vector(this.pointOnLine, p1),
            v2 = new Vector(this.pointOnLine, p2);
        return v.getVectorProduct(v1) * v.getVectorProduct(v2) > 0;
    };
    this.isEqualToLine = function(line) {
        return this.getIntersectionWithLine(line) === Infinity;
    };
    this.isPointOn = function(point) {
        if (this.isXConst) {
            return Math.abs(point.x - this.x) < Config.eps;
        }
        else {
            return Math.abs(point.y - this.m * point.x - this.n) < Config.eps;
        }
    };
    //Может вернуть @Point, infinity или null
    this.getIntersectionWithLine = function(line) {
        var d = line.a * this.b - this.a * line.b;
        if (Math.abs(d) < Config.eps) {
            return (Math.abs(this.a * line.c - this.c * line.a) < Config.linesEqualsEps &&
                    Math.abs(this.b * line.c - this.c * line.b) < Config.linesEqualsEps) ? Infinity : null;
        }
        var x = (this.c * line.b - line.c * this.b) / d,
            y = (this.a * line.c - line.a * this.c) / d;
        return new Point(x, y);
    };
    //Может вернуть @Beam, @Point или null
    this.getIntersectionWithBeam = function(beam) {
        var p = this.getIntersectionWithLine(beam.line);
        if (p === Infinity) {
            return beam;
        }
        else if (p === null) {
            return null;
        }
        else {
            var v = new Vector(beam.point, p);
            return v.sameDirected(beam.vector) ? p : null;
        }
    };
    //Может вернуть @Segment, @Point или null
    this.getIntersectionWithSegment = function(segment) {
        if (segment.a.isOnLine(this) && segment.b.isOnLine(this)) {
            return segment;
        }
        else {
            var p = this.getIntersectionWithLine(segment.getLine());
            return p === null ? null
                              : p.isOnSegment(segment) ? p
                                                       : null;
        }
    }
}