/**
 * @Author Lomovtsev Pavel
 * Date: 05.10.13
 * Time: 15:05
 */
var Triangle = (function() {

    var rect = false,
        isos = false,
        equi = false;

    var generateType = function() {
        isos = (Math.random() * 100 < 30);
        rect = (Math.random() * 100 < 30);
        equi = (Math.random() * 100 < 10);
    };

    return {

        genRand: function(size) {

            this.dropVertexes();

            this.addVertex({x: 0, y: 0});
            var a = Math.random() * size,
                b = Math.random() * size;

            generateType();
            if (equi) {
                this.addVertex({x: a, y: 0});
                this.addVertex({x: a / 2, y: a * Math.sqrt(3) / 2});
                this.type = "Равносторонний";
            }
            else if (isos) {
                if (rect) {
                    this.addVertex({x: 0, y: a});
                    this.addVertex({x: a, y: 0});
                    this.type = "Прямоугольный равнобедренный";
                }
                else {
                    this.addVertex({x: a, y: 0});
                    this.addVertex({x: a / 2, y: b});
                    this.type = "Равнобедренный";
                }
            }
            else if (rect) {
                this.addVertex({x: 0, y: a});
                this.addVertex({x: b, y: 0});
                this.type = "Прямоугольный";
            }
            else {
                this.addVertex(Point.genRand(0, size));
                this.addVertex(Point.genRand(0, size));
                this.type = "Случайный";
            }
            return this.vertexes;
        },

        drawRand: function(context, width, height, size, isVertexNumberNeeded) {
            this.genRand(size);
            this.rotate(Math.random() * Math.PI);
            this.center(width, height);
            Drawing.drawPolygon(this.vertexes, context, width, height, isVertexNumberNeeded);
        },

        getPerimeter: function() {
            return Geometry.getTrianglePerimeter(
                this.vertexes[0],
                this.vertexes[1],
                this.vertexes[2]
            );
        },

        getSquare: function() {
            return Geometry.getTriangleSquare(
                this.vertexes[0],
                this.vertexes[1],
                this.vertexes[2]
            );
        }

    }
})();

Triangle.__proto__ = BasePolygon;
