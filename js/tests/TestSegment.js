/**
 * @author Lomovtsev Pavel
 * Date: 12.04.2014
 * Time: 20:24
 */
var TestSegment = {

    getAlpha: function() {
        var testName = "getAlpha()",
            p1, p2, p3, p4, seg1, seg2, seg3;
        try {
            p1 = new Point(1, 1);
            p2 = new Point(2, 2);
            p3 = new Point(3, 3);
            p4 = new Point(4, 4);
            seg1 = new Segment(p1, p2);
            seg2 = new Segment(p3, p4);
            if (!this.assertEquals(seg1.getAlpha(seg2), 0))
                throw new Error("угол между параллельными отрезками не равен нулю");

            p3 = new Point(-1, 0);
            p4 = new Point(-2, 0);
            seg2 = new Segment(p3, p4);
            if (!this.assertEquals(seg1.getAlpha(seg2), seg2.getAlpha(seg1)))
                throw new Error("операция \"найти угол\" несимметрична");

            if (!this.assertEquals(seg1.getAlpha(seg2), 3 * Math.PI / 4))
                throw new Error("угол вычислен неверно");

            seg3 = new Segment(p4, p3);
            if (!this.assertEquals(seg1.getAlpha(seg2), seg1.getAlpha(seg3)))
                throw new Error("угол между отрезками зависит от порядка вершин в отрезке");

            this.logSuccess(testName);
        } catch (whatsWrong) {
            this.logFailure(testName, whatsWrong);
        }
    }
};

TestSegment.__proto__ = BaseTest;