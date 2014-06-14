/**
 * @author Lomovtsev Pavel
 * Date: 10.04.2014
 * Time: 23:22
 */
//Принимает два числа
function Point(x, y) {
    this.x = x;
    this.y = y;

    this.equalsToPoint = function(p) {
        return (Math.abs(this.x - p.x) < Config.eps) && (Math.abs(this.y - p.y) < Config.eps);
    };
    this.distToPoint = function(p) {
        return Math.sqrt((p.x - this.x) * (p.x - this.x) + (p.y - this.y) * (p.y - this.y));
    };
    this.distToLine = function(line) {
        return Math.abs(line.a * this.x + line.b * this.y + line.c)
             / Math.sqrt(line.a * line.a + line.b * line.b);
    };
    this.distToSegment = function(seg) {
        var ab = new Vector(seg.a, seg.b),
            ap = new Vector(seg.a, this),
            ba = new Vector(seg.b, seg.a),
            bp = new Vector(seg.b, this);
        if (ab.getScalarProduct(ap) >= 0 && ba.getScalarProduct(bp) >= 0) {
            return this.distToLine(new Line(seg.a, seg.b));
        }
        else {
            return Math.min(this.distToPoint(seg.a), this.distToPoint(seg.b));
        }
    };
    this.getShiftedByVector = function(v) {
        return new Point(this.x + v.x, this.y + v.y);
    };
    this.getMulOnScalar = function(scalar) {
        return new Point(this.x * scalar, this.y * scalar);
    };
    this.getRotated = function(phi) {
        var newX = this.x * Math.cos(phi) - this.y * Math.sin(phi),
            newY = this.x * Math.sin(phi) + this.y * Math.cos(phi);
        return new Point(newX, newY);
    };
    this.toString = function() {
        return "{x: " + this.x + ", y: " + this.y + "}";
    }
}