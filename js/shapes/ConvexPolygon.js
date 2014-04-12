/**
 * @Author Lomovtsev Pavel
 * Date: 06.10.13
 * Time: 15:37
 */
var ConvexPolygon = (function() {

    var r;

    return {

        genRegular: function(n, size) {
            this.dropVertexes();
            var alpha = 2 * Math.PI / n,
                curAlpha = 0;
                r = Math.random() * size;
            this.addVertex(new Point(r, 0));
            for (var i = 1; i < n; i++) {
                curAlpha += alpha;
                this.addVertex(new Point(r * Math.cos(curAlpha), r * Math.sin(curAlpha)));
            }
            if (n === 3) {
                this.type = "Равносторонний";
            }
            else if (n === 4) {
                this.type = "Квадрат";
            }
            else {
                this.type = "Правильный " + n + "-угольник";
            }
            return this.vertexes;
        },

        drawRegular: function(context, width, height, n, size, isVertexNumberNeeded) {
            this.genRegular(n, size);
            this.centerRotateAndDraw(width, height, context, isVertexNumberNeeded);
        },

        genTrapeze: function(size) {
            this.dropVertexes();
            var a = Math.random() * size,
                b = Math.random() * a,
                c = Math.random() * b,
                d = Math.random() * size,
                rect = (Math.random() * 100) < 30;
            this.addVertex(new Point(0, 0));
            this.addVertex(new Point(a, 0));
            if (rect) {
                this.addVertex(new Point(a, b));
                this.addVertex(new Point(c, b));
                this.type = "Прямоугольная трапеция";
            }
            else {
                this.addVertex(new Point(b, d));
                this.addVertex(new Point(c, d));
                this.type = "Трапеция";
            }
            return this.vertexes;
        },

        drawTrapeze: function(context, width, height, size, isVertexNumberNeeded) {
            this.genTrapeze(size);
            this.centerRotateAndDraw(width, height, context, isVertexNumberNeeded);
        },

        genParallelogram: function(size) {
            this.dropVertexes();
            var a = Math.random() * size,
                b = Math.random() * size,
                rhombus = (Math.random() * 100) < 30,
                rectangle = (Math.random() * 100) < 20,
                square = (Math.random() * 100) < 10;
            if (square) {
                this.addVertex({x: 0, y: 0});
                this.addVertex({x: a, y: 0});
                this.addVertex({x: a, y: a});
                this.addVertex({x: 0, y: a});
                this.type = "Квадрат";
            }
            else if (rectangle) {
                this.addVertex(new Point(0, 0));
                this.addVertex(new Point(a, 0));
                this.addVertex(new Point(a, b));
                this.addVertex(new Point(0, b));
                this.type = "Прямоугольник";
            }
            else if (rhombus) {
                this.addVertex(new Point(a, 0));
                this.addVertex(new Point(0, b));
                this.addVertex(new Point(-a, 0));
                this.addVertex(new Point(0, -b));
                this.type = "Ромб";
            }
            else {
                this.addVertex(new Point(a, 0));
                this.addVertex(new Point(a, b));
                this.addVertex(new Point(-a, 0));
                this.addVertex(new Point(-a, -b));
                this.type = "Параллелограмм";
            }
            return this.vertexes;
        },

        drawParallelogram: function(context, width, height, size, isVertexNumberNeeded) {
            this.genParallelogram(size);
            this.centerRotateAndDraw(width, height, context, isVertexNumberNeeded);
        },

        genRandomQuadrangle: function(size) {
            this.dropVertexes();
            var trapeze = (Math.random() * 100) < 25,
                parallelogram = (Math.random() * 100) < 25;
            if (trapeze) {
                this.genTrapeze(size);
            }
            else if (parallelogram) {
                this.genParallelogram(size);
            }
            else {
                this.genRand(4, size);
            }
        },

        drawRandomQuadrangle: function(context, width, height, size, isVertexNumberNeeded) {
            this.genRandomQuadrangle(size);
            this.centerRotateAndDraw(width, height, context, isVertexNumberNeeded);
        },

        genRand: function(n, size) {
            this.dropVertexes();
            var alpha = 2 * Math.PI / n,
                maxAlpha = alpha,
                curAlpha = 0,
                newAlpha;
            r = Math.random() * size;
            this.addVertex(new Point(r, 0));
            for (var i = 1; i < n; i++) {
                newAlpha = Math.random() * maxAlpha;
                curAlpha += newAlpha;
                this.addVertex(new Point(r * Math.cos(curAlpha), r * Math.sin(curAlpha)));
                maxAlpha += alpha - newAlpha;
            }
            this.type = "Вписанный в окружность радиуса " + r;
            return this.vertexes;
        },

        drawRand: function(context, width, height, n, size, isVertexNumberNeeded) {
            this.genRand(n, size);
            this.centerRotateAndDraw(width, height, context, isVertexNumberNeeded);
        },

        getRadius: function() {
            return r;
        },

        getType: function() {
            return this.type;
        }
    }
})();

ConvexPolygon.__proto__ = BasePolygon;
