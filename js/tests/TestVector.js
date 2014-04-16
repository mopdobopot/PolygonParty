/**
 * @author Lomovtsev Pavel
 * Date: 12.04.2014
 * Time: 10:12
 */
var TestVector = {
    getSum: function() {
        var testName = "getSum()",
            p1, p2, p3, v1, v2, v3;
        try {
            v1 = new Vector(3, 4);
            v2 = new Vector(-3, -4);
            v3 = new Vector(0, 0);
            if (!v1.getSum(v2).equalsToVector(v3))
                throw new Error("сумма противоположных векторов с одинаковыми модулями не даёт нулевой вектор");

            for (var i = 0; i < 100; i++) {
                p1 = G.getRandPoint(0, 100);
                p2 = G.getRandPoint(0, 100);
                p3 = G.getRandPoint(0, 100);
                v1 = new Vector(p1, p2);
                v2 = new Vector(p2, p3);
                v3 = new Vector(p3, p1);
                if (!this.assertEquals(v1.getSum(v2).module, v3.module))
                    throw new Error("нарушается неравенство треугольника");
            }
            this.logSuccess(testName);
        } catch (whatsWrong) {
            this.logFailure(testName, whatsWrong);
        }
    },
    getAlpha: function() {
        var testName = "getAlpha()",
            v1, v2;
        try {
            v1 = new Vector(1, 0);
            v2 = new Vector(0, 1);
            if (!this.assertEquals(v1.getAlpha(v2), Math.PI / 2))
                throw new Error("меньший угол между перпендикулярными векторами не равен pi/2");

            if (!this.assertEquals(v2.getAlpha(v1), 3 * Math.PI / 2))
                throw new Error("больший угол между перпендикулярными векторами не равен 3/2 * pi");

            v2 = new Vector(10, 0);
            if (!this.assertEquals(v1.getAlpha(v2), 0))
                throw new Error("угол между сонаправвленными векторами не равен 0");

            v2 = new Vector(-4, 0);
            if (!this.assertEquals(v1.getAlpha(v2), v2.getAlpha(v1)))
                throw new Error("угол между противонаправленными векторами вычисляется неверно");

            v1 = new Vector(1, 1);
            v2 = new Vector(-1, 1);
            if (v1.getAlpha(v2) > Math.PI)
                throw new Error("угол вычисляется против часовой стрелки (договорённость: вычислять угол \"по часовой\"");
            this.logSuccess(testName);
        } catch (whatsWrong) {
            this.logFailure(testName, whatsWrong);
        }
    },
    all: function() {
        console.log("\nTestVector...");
        for (t in TestVector) {
            if (TestVector.hasOwnProperty(t) && t != "all") {
                TestVector[t]();
            }
        }
    }
};

TestVector.__proto__ = BaseTest;