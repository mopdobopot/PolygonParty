/**
 * @author Lomovtsev Pavel
 * Date: 10.04.2014
 * Time: 22:56
 */
function Beam(point, vector) {
    this.p = point;
    this.v = vector;
    this.l = new Line(point, G.vectorSum(point, vector));

    this.intersecWithSegment = function(seg) {

    }
}
