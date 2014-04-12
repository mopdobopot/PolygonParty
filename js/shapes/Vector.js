/**
 * @author Lomovtsev Pavel
 * Date: 10.04.2014
 * Time: 23:32
 */
//Принимает два объекта @Point или два числа
function Vector(a, b) {

    if (typeof(a) === "object" && typeof(b) === "object") {
        this.x = a.x - b.x;
        this.y = a.y - b.y;
    }
    else if (typeof(a) === "number" && typeof(b) === "number") {
        this.x = a;
        this.y = b;
    }

    this.equalsToVector = function(v) {
        return this.x === v.x && this.y === v.y;
    };
    this.getModule = function() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
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
    //От текущего до v, против часовой стрелки
    this.getAlpha = function(v) {
        var zero = {x: 0, y: 0},
            alpha = Math.acos(this.getScalarProduct(v)
                            / G.dist(zero, this)
                            / G.dist(zero, v)),
            vp = this.getVectorProduct(v);
        if (vp >= 0) {
            return alpha;
        }
        else {
            return (2 * Math.PI - alpha);
        }
    }
}