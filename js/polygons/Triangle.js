/**
 * @Author Lomovtsev Pavel
 * Date: 05.10.13
 * Time: 15:05
 */
var Triangle = (function() {

    var rect = false,
        isos = false,
        equi = false,
        generateType = function() {
            isos = (Math.random() * 100 < 30);
            rect = (Math.random() * 100 < 30);
            equi = (Math.random() * 100 < 10);
        };

    return {

        genRand: function(size) {
            this.dropVertexes();
            this.addVertex(new Point(0, 0));
            var a = Math.random() * size,
                b = Math.random() * size;
            generateType();
            if (equi) {
                this.addVertex(new Point(a, 0));
                this.addVertex(new Point(a / 2, a * Math.sqrt(3) / 2));
                this.type = "Равносторонний";
            }
            else if (isos) {
                if (rect) {
                    this.addVertex(new Point(0, a));
                    this.addVertex(new Point(a, 0));
                    this.type = "Прямоугольный равнобедренный";
                }
                else {
                    this.addVertex(new Point(a, 0));
                    this.addVertex(new Point(a / 2, b));
                    this.type = "Равнобедренный";
                }
            }
            else if (rect) {
                this.addVertex(new Point(0, a));
                this.addVertex(new Point(b, 0));
                this.type = "Прямоугольный";
            }
            else {
                this.addVertex(G.getRandPoint(0, size));
                this.addVertex(G.getRandPoint(0, size));
                this.type = "Случайный";
            }
            return this.vertexes;
        },

        drawRand: function(context, width, height, size, isVertexNumberNeeded) {
            this.genRand(size);
            this.rotatePolygon(Math.random() * Math.PI);
            this.center(width, height);
            Drawing.drawPolygon(this.vertexes, context, width, height, isVertexNumberNeeded);
        }
    }
})();

Triangle.__proto__ = BasePolygon;
