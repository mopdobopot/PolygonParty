/**
 * @author Lomovtsev Pavel
 * Date: 10.04.2014
 * Time: 22:56
 */
function Beam(point, vector) {
    this.point = point;
    this.vector = vector;
    this.line = new Line(point, point.getShiftedByVector(vector));

    this.getIntersectionWithBeam = function(beam) {
        var p = this.line.getIntersectionWithBeam(beam);
        if (p === Infinity) {
            var v = new Vector(this.point, beam.point);
            if (v.sameDirected(this.vector)) {
                return beam;
            }
            else if (v.getMulOnScalar(-1).sameDirected(beam.vector)) {
                return this;
            }
            else {
                return null;
            }
        }
        else if (p === null) {
            return null;
        }
        else {
            return p.isOnBeam(this) && p.isOnBeam(beam);
        }
    };
}
