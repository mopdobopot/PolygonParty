/**
 * @author Lomovtsev Pavel
 * Date: 10.04.2014
 * Time: 23:32
 */
//Принимает два объекта @Point или два числа
function Vector(a, b) {
    if (typeof(a) === "object" && typeof(b) === "object") {
        this.x = b.x - a.x;
        this.y = b.y - a.y;
    }
    else if (typeof(a) === "number" && typeof(b) === "number") {
        this.x = a;
        this.y = b;
    }
    this.module = Math.sqrt(this.x * this.x + this.y * this.y);

    this.equalsToVector = function(v) {
        return this.x === v.x && this.y === v.y;
    };
    this.getModule = function() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    };
    this.getNormalized = function() {
        var m = this.getModule();
        return new Vector(this.getMulOnScalar(1 / m));
    };
    this.getSum = function(v) {
        return new Vector(this.x + v.x, this.y + v.y);
    };
    this.getMulOnScalar = function(scalar) {
        return new Vector(this.x * scalar, this.y * scalar);
    };
    this.getScalarProduct = function(v) {
        return this.x * v.x + this.y * v.y;
    };
    this.getVectorProduct = function(v) {
        return this.x * v.y - this.y * v.x;
    };
    this.getPerpendicularVector = function() {
        return new Vector(-this.y, this.x);
    };
    this.getRotated = function(phi) {
        var p = new Point(this.x, this.y).getRotated(phi);
        return new Vector(p.x, p.y);
    };
    //От текущего до v, по часовой стрелке
    this.getAlpha = function(v) {
        var alpha = this.getMinAlpha(v),
            vp = this.getVectorProduct(v);
        if (vp >= 0) {
            return alpha;
        }
        else {
            return (2 * Math.PI - alpha);
        }
    };
    this.getMinAlpha = function(v) {
        var cos = this.getScalarProduct(v) / this.module / v.module;
        cos = (cos > 1) ? 1
                        : (cos < -1) ? -1
                                     : cos;
        return Math.acos(cos);
    };
    this.sameDirected = function(v) {
        return Math.abs(this.getMinAlpha(v)) < Config.sameDirectingEps;
    }
}