/**
 * @Author Lomovtsev Pavel
 * Date: 05.10.13
 * Time: 14:51
 */
var Geometry = (function() {

    return {

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

        getTrianglePerimeter: function(p1, p2, p3) {
            return this.dist(p1, p2) +
                   this.dist(p2, p3) +
                   this.dist(p3, p1);
        },

        getTriangleSquare: function(p1, p2, p3) {
            var p = this.getTrianglePerimeter(p1, p2, p3) / 2,
                a = this.dist(p1, p2),
                b = this.dist(p2, p3),
                c = this.dist(p3, p1);

            return Math.sqrt(p * (p - a) * (p - b) * (p - c));
        },

        vectorSum: function(v1, v2) {
            return {
                x: v1.x + v2.x,
                y: v1.y + v2.y
            }
        },

        scalarProduct: function(v1, v2) {
            return v1.x * v2.x + v1.y * v2.y;
        },

        vectorProduct: function(v1, v2) {
            return v1.x * v2.y - v2.x * v1.y;
        },

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

        makeVector: function(p1, p2) {
            return {x: p2.x - p1.x, y: p2.y - p1.y};
        },

        multiplyVectorOnScalar: function(v, n) {
            v.x = v.x * n;
            v.y = v.y * n;
            return v;
        }

    }

})();



