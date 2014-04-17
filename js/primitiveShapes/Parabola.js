/**
 * @author Lomovtsev Pavel
 * Date: 16.04.2014
 * Time: 16:22
 */
//Принимает @Point и @Line
function Parabola(focus, directrix) {
    this.focus = focus;
    this.directrix = directrix;
    //Представление y = 2px. Прежде чем искать пересечение с прямой, прямую нужно повернуть на angle и
    //сдвинуть на вектор, смотрящий из нуля в vertex. Затем, найти пересечения и сдвинуть-повернуть их обратно
    this.angle = new Vector(0, 1).getAlpha(directrix.getDirectingVector());
    var intersec = G.getIntersection(directrix, new Line(focus, focus.getShiftedByVector(directrix.getNormalVector()))),
        v = new Vector(focus, intersec).getMulOnScalar(0.5);
    this.vertex = focus.getShiftedByVector(v);
    //Представление ax^2 + bx^2 + 2gx + 2fy + 2hxy + c = 0
    var t = directrix.a * directrix.a + directrix.b * directrix.b;
    this.a = directrix.b * directrix.b;
    this.b = directrix.a * directrix.a;
    this.g = -t * focus.x + directrix.a * directrix.c;
    this.f = -t * focus.y + directrix.b * directrix.c;
    this.h = -directrix.a * directrix.b;
    this.c = (focus.x * focus.x + focus.y * focus.y) * t - directrix.c * directrix.c;

    this.getIntersectionWithLine = function(line) {
        var a, b, c, res;
        if (line.isXConst) {
            //Подставляем уравнение прямой в уравнение параболы, всё что было с "х" уйдёт в константу
            a = this.b;
            b = 2 * this.f + 2 * this.h * line.x;
            c = this.c + 2 * this.g * line.x + this.a * line.x * line.x;
            res = MyMath.solveQuadratic(a, b, c);
            if (res.rootAmount === 0)
                return {
                    pointAmount: 0
                };
            if (res.rootAmount === 1)
                return {
                    pointAmount: 1,
                    p: new Point(line.x, res.root)
                };
            if (res.rootAmount === 2)
                return {
                    pointAmount: 2,
                    p1: new Point(line.x, res.root1),
                    p2: new Point(line.x, res.root2)
                }
        }
        else {
            //Подставляем уравнение прямой в уравнение параболы и получаем ax^2 + bx + c = 0
            a = this.a + this.b * line.m * line.m + 2 * this.h * line.m;
            b = 2 * this.b * line.m * line.n + 2 * this.g + 2 * this.f * line.m + 2 * this.h * line.n;
            c = this.b * line.n * line.n + 2 * this.f * line.n + this.c;
            res = MyMath.solveQuadratic(a, b, c);
            if (res.rootAmount === 0)
                return {
                    pointAmount: 0
                };
            if (res.rootAmount === 1)
                return {
                    pointAmount: 1,
                    p: new Point(res.root, line.m * res.root + line.n)
                };
            if (res.rootAmount === 2)
                return {
                    pointAmount: 2,
                    p1: new Point(res.root1, line.m * res.root1 + line.n),
                    p2: new Point(res.root2, line.m * res.root2 + line.n)
                }
        }
    }
}