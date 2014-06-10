/**
 * @author Lomovtsev Pavel
 * Date: 17.04.2014
 * Time: 16:14
 */
var TestParabola = {
    getIntersectionWithLine: function() {
        var testName = "getIntersectionWithLine()",
            f, p1, p2, p3, p4, d, l, res;
        try {
            f = new Point(1, 0);
            p1 = new Point(-1, 1);
            p2 = new Point(-1, -1);
            d = new Line(p1, p2);
            p3 = new Point(-10, 10);
            p4 = new Point(-9, -9);
            l = new Line(p3, p4);
            res = new Parabola(f, d).getIntersectionWithLine(l);
            if (res.pointAmount != 0)
                throw new Error("пересечений нет, но найдено " + res.pointAmount + " пересечений");

            f = new Point(1, 0);
            p1 = new Point(-1, 1);
            p2 = new Point(-1, -1);
            d = new Line(p1, p2);
            p3 = new Point(-1, 10);
            p4 = new Point(-1, 9);
            l = new Line(p3, p4);
            res = new Parabola(f, d).getIntersectionWithLine(l);
            if (res.pointAmount != 0)
                throw new Error("пересечений с прямой x = -1 нет, но найдено " + res.pointAmount + " пересечений");

            f = new Point(1, 0);
            p1 = new Point(-1, 1);
            p2 = new Point(-1, -1);
            d = new Line(p1, p2);
            p3 = new Point(0, 1);
            p4 = new Point(0, 2);
            l = new Line(p3, p4);
            res = new Parabola(f, d).getIntersectionWithLine(l);
            if (res.pointAmount != 1)
                throw new Error("парабола касается прямой x = 0 в точке (0, 0), но найдено " + res.pointAmount + " пересечений");
            if (!res.p[0].equalsToPoint(new Point(0, 0)))
                throw new Error("пересечение с прямой x = 0 найдено не верно");

            f = new Point(1, 0);
            p1 = new Point(-1, 1);
            p2 = new Point(-1, -1);
            d = new Line(p1, p2);
            p3 = new Point(0, -2);
            p4 = new Point(2, -2);
            l = new Line(p3, p4);
            res = new Parabola(f, d).getIntersectionWithLine(l);
            if (res.pointAmount != 1)
                throw new Error("пересечение с прямой y = -2 в точке (1, -2), но найдено " + res.pointAmount + " пересечений");
            if (!res.p[0].equalsToPoint(new Point(1, -2)))
                throw new Error("пересечение с прямой y = -2 найдено не верно");

            f = new Point(1, 0);
            p1 = new Point(-1, 1);
            p2 = new Point(-1, -1);
            d = new Line(p1, p2);
            p3 = new Point(-1, -2);
            p4 = new Point(1, 2);
            l = new Line(p3, p4);
            res = new Parabola(f, d).getIntersectionWithLine(l);
            if (res.pointAmount != 2)
                throw new Error("прямая пересекает параболу в двух точках, но найдено " + res.pointAmount + " пересечений");
            if ((!res.p[0].equalsToPoint(new Point(0, 0)) || !res.p[1].equalsToPoint(new Point(1, 2))) &&
                (!res.p[0].equalsToPoint(new Point(1, 2)) || !res.p[1].equalsToPoint(new Point(0, 0))))
                throw new Error("Пересечение с прямой y = 2x найдено не верно");

            f = new Point(1, 0);
            p1 = new Point(-1, 1);
            p2 = new Point(-1, -1);
            d = new Line(p1, p2);
            p3 = new Point(0, -3);
            p4 = new Point(100, 0);
            l = new Line(p3, p4);
            res = new Parabola(f, d).getIntersectionWithLine(l);
            if (res.pointAmount != 2)
                throw new Error("прямая пересекает параболу в двух точках, но найдено " + res.pointAmount + " пересечений");

            f = new Point(1, 1);
            p1 = new Point(1, 0);
            p2 = new Point(2, 1);
            d = new Line(p1, p2);
            p3 = new Point(1, -1);
            p4 = new Point(2, 0);
            l = new Line(p3, p4);
            res = new Parabola(f, d).getIntersectionWithLine(l);
            if (res.pointAmount != 0)
                throw new Error("прямая не пересекает параболу, но найдено " + res.pointAmount + " пересечений");

            f = new Point(1, 1);
            p1 = new Point(1, 0);
            p2 = new Point(2, 1);
            d = new Line(p1, p2);
            p3 = new Point(0, 2);
            p4 = new Point(2, 0);
            l = new Line(p3, p4);
            res = new Parabola(f, d).getIntersectionWithLine(l);
            if (res.pointAmount != 1)
                throw new Error("прямая пересекает параболу в одной точке, но найдено " + res.pointAmount + " пересечений");

            f = new Point(1, 1);
            p1 = new Point(1, 0);
            p2 = new Point(2, 1);
            d = new Line(p1, p2);
            p3 = new Point(-1, 0);
            p4 = new Point(2, 3);
            l = new Line(p3, p4);
            res = new Parabola(f, d).getIntersectionWithLine(l);
            if (res.pointAmount != 2)
                throw new Error("прямая пересекает параболу в двух точках, но найдено " + res.pointAmount + " пересечений");

            this.logSuccess(testName);
        } catch (whatsWrong) {
            this.logFailure(testName, whatsWrong);
        }
    },
    getIntersectionWithParabola: function() {
        var testName = "getIntersectionWithParabola()",
            p1, p2, p3, p4, f1, f2, l1, l2, res;
        try {
            //Общий фокус
            p1 = new Point(-1, 0);
            p2 = new Point(0, 0);
            l1 = new Line(p1, p2);
            f1 = new Point(0, 1);
            p3 = new Point(0, -2);
            p4 = new Point(1, -2);
            l2 = new Line(p3, p4);
            res = new Parabola(f1, l1).getIntersectionWithParabola(new Parabola(f1, l2));
            if (res.pointAmount != 0)
                throw new Error("параболы с общим фокусом не пересекаются, но найдено " + res.pointAmount + " пересечений");

            p1 = new Point(-1, 0);
            p2 = new Point(0, 0);
            l1 = new Line(p1, p2);
            f1 = new Point(0, 1);
            p3 = new Point(0, 2);
            p4 = new Point(1, 2);
            l2 = new Line(p3, p4);
            res = new Parabola(f1, l1).getIntersectionWithParabola(new Parabola(f1, l2));
            if (res.pointAmount != 2)
                throw new Error("параболы с общим фокусом пересекаются в двух точках, но найдено " + res.pointAmount + " пересечений");

            p1 = new Point(-1, 0);
            p2 = new Point(0, 0);
            l1 = new Line(p1, p2);
            f1 = new Point(0, 1);
            p3 = new Point(0, 2);
            p4 = new Point(1, 1);
            l2 = new Line(p3, p4);
            res = new Parabola(f1, l1).getIntersectionWithParabola(new Parabola(f1, l2));
            if (res.pointAmount != 2)
                throw new Error("параболы с общим фокусом пересекаются в двух точках, но найдено " + res.pointAmount + " пересечений");

            p1 = new Point(-1, 0);
            p2 = new Point(0, 0);
            l1 = new Line(p1, p2);
            f1 = new Point(0, 1);
            p3 = new Point(2, 0);
            p4 = new Point(2, 1);
            l2 = new Line(p3, p4);
            res = new Parabola(f1, l1).getIntersectionWithParabola(new Parabola(f1, l2));
            if (res.pointAmount != 2)
                throw new Error("параболы с общим фокусом пересекаются в двух точках, но найдено " + res.pointAmount + " пересечений");

            p1 = new Point(-1, -1);
            p2 = new Point(0, -1);
            l1 = new Line(p1, p2);
            f1 = new Point(0, 1);
            p3 = new Point(1, -3);
            p4 = new Point(3, -2.8);
            l2 = new Line(p3, p4);
            res = new Parabola(f1, l1).getIntersectionWithParabola(new Parabola(f1, l2));
            if (res.pointAmount != 2)
                throw new Error("параболы с общим фокусом пересекаются в двух точках, но найдено " + res.pointAmount + " пересечений");

            //Общая директриса
            p1 = new Point(-1, 0);
            p2 = new Point(0, 0);
            l1 = new Line(p1, p2);
            f1 = new Point(0, 1);
            f2 = new Point(2, 2);
            res = new Parabola(f1, l1).getIntersectionWithParabola(new Parabola(f2, l1));
            if (res.pointAmount != 2)
                throw new Error("параболы с общей директрисой пересекаются в двух точках, но найдено " + res.pointAmount + " пересечений");

            p1 = new Point(-1, 0);
            p2 = new Point(0, 0);
            l1 = new Line(p1, p2);
            f1 = new Point(0, -1);
            f2 = new Point(2, 2);
            res = new Parabola(f1, l1).getIntersectionWithParabola(new Parabola(f2, l1));
            if (res.pointAmount != 0)
                throw new Error("параболы с общей директрисой не пересекаются, но найдено " + res.pointAmount + " пересечений");

            p1 = new Point(-1, 0);
            p2 = new Point(0, 0);
            l1 = new Line(p1, p2);
            f1 = new Point(0, -1);
            f2 = new Point(0, -10);
            res = new Parabola(f1, l1).getIntersectionWithParabola(new Parabola(f2, l1));
            if (res.pointAmount != 2)
                throw new Error("параболы с общей директрисой пересекаются в двух точках, но найдено " + res.pointAmount + " пересечений");

            p1 = new Point(-1, 0);
            p2 = new Point(0, 0);
            l1 = new Line(p1, p2);
            f1 = new Point(-100, 1);
            f2 = new Point(100, 1);
            res = new Parabola(f1, l1).getIntersectionWithParabola(new Parabola(f2, l1));
            if (res.pointAmount != 1)
                throw new Error("параболы с общей директрисой пересекаются в одной точке, но найдено " + res.pointAmount + " пересечений");

            p1 = new Point(-1, 0);
            p2 = new Point(0, 0);
            l1 = new Line(p1, p2);
            f1 = new Point(-this.eps, 1);
            f2 = new Point(this.eps, 1);
            res = new Parabola(f1, l1).getIntersectionWithParabola(new Parabola(f2, l1));
            if (res.pointAmount != 1)
                throw new Error("параболы с общей директрисой пересекаются в одной точке, но найдено " + res.pointAmount + " пересечений");

            this.logSuccess(testName);
        } catch (whatsWrong) {
            this.logFailure(testName, whatsWrong);
        }
    },
    all: function() {
        console.log("\nTestParabola...");
        for (t in TestParabola) {
            if (TestParabola.hasOwnProperty(t) && t != "all") {
                TestParabola[t]();
            }
        }
    }
};
TestParabola.__proto__ = BaseTest;