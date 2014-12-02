/**
 * @author Lomovtsev Pavel
 * Date: 07.09.2014
 * Time: 10:55
 */
var TestGeometry = {
    isPointInPolygon: function() {
        var testName = "isPointIntPolygon()";
        try {
            var vertexes = [];
            vertexes.push(new Point(0, 10));
            vertexes.push(new Point(10, 10));
            vertexes.push(new Point(10, 0));
            vertexes.push(new Point(30, 0));
            vertexes.push(new Point(30, 10));
            vertexes.push(new Point(40, 10));
            vertexes.push(new Point(40, 30));
            vertexes.push(new Point(30, 30));
            vertexes.push(new Point(20, 5));
            vertexes.push(new Point(10, 30));
            if (!G.isPointInPolygon(new Point(10, 20), vertexes)) {
                throw new Error("точка внутри многоугольника, а метод считает что снаружи");
            }
            if (G.isPointInPolygon(new Point(-10, 10), vertexes)) {
                throw new Error("точка снаружи многоугольника, а метод считает что внутри");
            }
            if (!G.isPointInPolygon(new Point(5, 10), vertexes)) {
                throw new Error("точка лежит на стороне многоугольника, а метод считает что она снаружи");
            }
            if (G.isPointInPolygon(new Point(20, 10), vertexes)) {
                throw new Error("точка снаружи многоугольника, а метод считает что внутри");
            }
            if (!G.isPointInPolygon(new Point(25, 10), vertexes)) {
                throw new Error("точка внутри многоугольника, а метод считает что снаружи");
            }
            if (G.isPointInPolygon(new Point(20, 20), vertexes)) {
                throw new Error("точка снаружи многоугольника, а метод считает что внутри");
            }
            if (G.isPointInPolygon(new Point(0, 30), vertexes)) {
                throw new Error("точка снаружи многоугольника, а метод считает что внутри");
            }
            if (G.isPointInPolygon(new Point(20, 30), vertexes)) {
                throw new Error("точка снаружи многоугольника, а метод считает что внутри");
            }
            this.logSuccess(testName);
        } catch (whatsWrong) {
            this.logFailure(testName, whatsWrong);
        }
    }
};
TestGeometry.__proto__ = BaseTest;