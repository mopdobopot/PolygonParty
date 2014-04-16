/**
 * @author Lomovtsev Pavel
 * Date: 16.04.2014
 * Time: 16:22
 */
//Принимает @Point и @Line
function Parabola(focus, directrix) {
    this.focus = focus;
    this.directrix = directrix;
    this.angle = directrix.getDirectingVector().getAlpha(new Vector(1, 0));
    var intersec = G.getIntersection(directrix, new Line(focus, focus.getShiftedByVector(directrix.getNormalVector()))),
        v = new Vector(focus, intersec).getMulOnScalar(0.5);
    this.vertex = focus.getShiftedByVector(v);


}