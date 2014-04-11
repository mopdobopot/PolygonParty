/**
 * @author Lomovtsev Pavel
 * Date: 10.04.2014
 * Time: 23:10
 */
function Line(p1, p2) {

    this.a = p1.y - p2.y;
    this.b = p2.x - p1.x;
    this.c = p1.x * p2.y - p2.x * p1.y;
    if (this.a === 0 && this.b === 0) {
        throw new Error("Для задания прямой необходимы две различные точки, а переданы " + p1.toString() + " и " + p2.toString());
    }


}