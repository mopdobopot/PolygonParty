/**
 * @author Lomovtsev Pavel
 * Date: 10.04.2014
 * Time: 23:20
 */
//Принимает два объекта @Point
function Segment(p1, p2) {

    this.a = p1;
    this.b = p2;
    if (p1.equalsToPoint(p2)) {
        throw new Error("Для задания отрезка необходимы две различные точки, а переданы " + p1.toString() + " и " + p2.toString());
    }

}