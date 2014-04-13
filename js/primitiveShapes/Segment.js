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

    this.getVector = function() {
        return new Vector(this.a, this.b);
    };
    this.getCenter = function() {
        return new Point((this.a.x + this.b.x) / 2, (this.a.y + this.b.y) / 2);
    };
    this.getCentralPerpendicular = function() {
        var a = this.b.x - this.a.x,
            b = this.b.y - this.a.y,
            c = this.a.x * this.a.x + this.a.y * this.a.y - this.b.x * this.b.x - this.b.y * this.b.y;
        return new Line(a, b, c);
    };
}