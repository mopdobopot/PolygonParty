/**
 * @Author Lomovtsev Pavel
 * Date: 11.10.13
 * Time: 20:28
 */

var Test = (function() {

    var eps = 0.001;

    var compareNumbers = function(a, b) {
        if (Math.abs(a - b) < eps) {
            console.log(" ok");
            return true;
        }
        else {
            console.error("expected " + a + ", found " + b + ", test failed");
            return false;
        }
    }

    return {

        testAll: function() {

            if (
                this.testDist() &&
                this.testGetTriangleSquare() &&
                this.testGetSquare()
            ) {
                console.log("------------------------SUCCESS------------------------");
                return true;
            }
            else {
                console.log("------------------------FAILURE------------------------");
                return false;
            }

        },

        /* Geometry */

        testDist: function() {

            console.log("\nTestDist");
            if (
                compareNumbers(3, Geometry.dist({x: 0, y: 0}, {x: 3, y: 0})) &&
                compareNumbers(1, Geometry.dist({x: 0, y: 0}, {x: 0, y: 1})) &&
                compareNumbers(0, Geometry.dist({x: 0, y: 0}, {x: 0, y: 0})) &&
                compareNumbers(Math.sqrt(13), Geometry.dist({x: 0, y: 0}, {x: 2, y: 3}))
            ) {
                console.log("success\n");
                return true;
            }
            else {
                console.log("------------------------failure------------------------\n");
                return false;
            }

        },

        testGetTriangleSquare: function() {

            console.log("\nTestGetTriangleSquare");
            var success = true;

            var p1 = {x: 0, y: 0},
                p2 = {x: 0, y: 2},
                p3 = {x: 2, y: 0};
            if (!compareNumbers(2, Geometry.getTriangleSquare(p1, p2, p3)))
                success = false;

            var p1 = {x: 2, y: -3},
                p2 = {x: 8, y: -3},
                p3 = {x: 4, y: -1};
            if (!compareNumbers(6, Geometry.getTriangleSquare(p1, p2, p3)))
                success = false;

            if (success) {
                console.log("success\n");
                return true;
            }
            else {
                console.log("------------------------failure------------------------\n");
                return false;
            }
        },

        /* BasePolygon */

        testGetSquare: function() {

            console.log("\nTestGetSquare");
            var success = true;

            var bp = BasePolygon;

            bp.dropVertexes();
            bp.addVertex({x: 1, y: 1});
            bp.addVertex({x: -1, y: 1});
            bp.addVertex({x: -1, y: -1});
            bp.addVertex({x: 1, y: -1});
            if (!compareNumbers(4, bp.getSquare()))
                success = false;

            bp.dropVertexes();
            bp.addVertex({x: 7, y: 0});
            bp.addVertex({x: 5, y: 2});
            bp.addVertex({x: 2, y: 2});
            bp.addVertex({x: 0, y: 0});
            if (!compareNumbers(10, bp.getSquare()))
                success = false;

            bp.dropVertexes();
            bp.addVertex({x: 0, y: 1});
            bp.addVertex({x: -1, y: 0});
            bp.addVertex({x: -1, y: -3});
            bp.addVertex({x: 0, y: -2});
            bp.addVertex({x: 1, y: -2});
            bp.addVertex({x: 2, y: -1});
            bp.addVertex({x: 2, y: 2});
            bp.addVertex({x: 1, y: 1});
            if (!compareNumbers(9, bp.getSquare()))
                success = false;

            Geometry.shiftPolygon(bp.vertexes, Math.random() * 10000, Math.random() * 10000);
            if (!compareNumbers(9, bp.getSquare()))
                success = false;

            if (success) {
                console.log("success\n");
                return true;
            }
            else {
                console.log("------------------------failure------------------------\n");
                return false;
            }

        }

    }

})();
