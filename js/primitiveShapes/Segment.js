/**
 * @author Lomovtsev Pavel
 * Date: 10.04.2014
 * Time: 23:20
 */
//Принимает два объекта @Point
function Segment(p1, p2) {
    this.a = p1;
    this.b = p2;
    if (p1.equalsToPoint(p2)) {
        throw new Error("Для задания отрезка необходимы две различные точки, а переданы " + p1.toString() + " и " + p2.toString());
    }
    var v = new Vector(this.a, this.b),
        n1 = new Vector(-v.y, v.x),
        n2 = new Vector(v.y, -v.x),
        //Нормаль, составляющая угол 90 со стороной — внешняя (проверка на > pi, чтобы избежать проблем с точностью)
        externalNormal = v.getAlpha(n1) > Math.PI ? n1 : n2;
    this.beamA = new Beam(this.a, externalNormal);
    this.beamB = new Beam(this.b, externalNormal);

    this.getPointOn = function() {
        return this.a;
    };
    this.getLength = function() {
        return this.getDirectingVector().getModule();
    };
    this.isPointOn = function(point) {
        if (point.equalsToPoint(this.a) || point.equalsToPoint(this.b)) {
            return true;
        }
        var v1 = new Vector(this.a, point);
        var v2 = new Vector(this.b, point);
        return this.getLine().isPointOn(point) && v1.getScalarProduct(v2) < 0;
    };
    this.getDirectingVector = function() {
        return new Vector(this.a, this.b);
    };
    this.getLine = function() {
        return new Line(this.a, this.b);
    };
    this.getCenter = function() {
        return new Point((this.a.x + this.b.x) / 2, (this.a.y + this.b.y) / 2);
    };
    this.getCentralPerpendicular = function() {
        var a = 2 * (this.b.x - this.a.x),
            b = 2 * (this.b.y - this.a.y),
            c = this.a.x * this.a.x + this.a.y * this.a.y - this.b.x * this.b.x - this.b.y * this.b.y;
        return new Line(a, b, c);
    };
    //Может вернуть @Segment, @Point или null
    this.getIntersectionWithBeam = function(beam) {
        var l = this.getLine(),
            intersec = l.getIntersectionWithBeam(beam);
        if (intersec === null) {
            return null;
        }
        else if (Type.isPoint(intersec)) {
            return this.isPointOn(intersec) ? intersec : null;
        }
        else if (Type.isBeam(intersec)) {
            var pa = new Vector(intersec.point, this.a);
            //Вершина луча лежит на отрезке
            if (this.isPointOn(intersec.point)) {
                return pa.sameDirected(intersec.vector) ? new Segment(intersec.point, this.a)
                                                        : new Segment(intersec.point, this.b);
            }
            //Вершина луча не лежит на отрезке
            else {
                return pa.sameDirected(intersec.vector) ? this : null
            }
        }
    };
    //Может вернуть @Segment, @Point или null
    this.getIntersectionWithSegment = function(segment) {
        var intersec = this.getLine().getIntersectionWithLine(segment.getLine()),
            //Меняет местами точки отрезка по возрастанию x и y
            swapIfNeed = function(seg) {
                var t;
                if (seg.b.x < seg.a.x) {
                    t = seg.a;
                    seg.a = seg.b;
                    seg.b = t;
                }
                else if (seg.b.x === seg.a.x) {
                    if (seg.b.y < seg.a.y) {
                        t = seg.a;
                        seg.a = seg.b;
                        seg.b = t;
                    }
                }
            },
            lessThan = function(p1, p2) {
                return p1.x === p2.x ? p1.y < p2.y
                                     : p1.x < p2.x;
            };
        if (intersec === null) {
            return null;
        }
        else if (intersec === Infinity) {
            swapIfNeed(this);
            swapIfNeed(segment);
            var a, b, c;
            if (lessThan(this.a, segment.a)) {
                a = this.a.distToPoint(this.b);
                b = this.a.distToPoint(segment.a);
                c = this.a.distToPoint(segment.b);
                if (Math.abs(b - a) < Config.eps) {
                    return this.b;
                }
                return b > a ? null
                             : c > a ? new Segment(segment.a, this.b)
                                     : segment;
            }
            else {
                a = segment.a.distToPoint(segment.b);
                b = segment.a.distToPoint(this.a);
                c = segment.a.distToPoint(this.b);
                if (Math.abs(b - a) < Config.eps) {
                    return segment.b;
                }
                return b > a ? null
                             : c > a ? new Segment(this.a, segment.b)
                                     : this;
            }
        }
        else {
            return this.isPointOn(intersec) && segment.isPointOn(intersec) ? intersec
                                                                           : null;
        }
    };
    this.toString = function() {
        return this.a.index + "-" + this.b.index;
    }
}