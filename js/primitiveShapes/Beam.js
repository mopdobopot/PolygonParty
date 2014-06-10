/**
 * @author Lomovtsev Pavel
 * Date: 10.04.2014
 * Time: 22:56
 */
function Beam(point, vector) {
    this.point = point;
    this.vector = vector;
    this.line = new Line(point, point.getShiftedByVector(vector));

    this.getPointOn = function() {
        return this.point.getShiftedByVector(this.vector);
    };
    this.equalsToBeam = function(beam) {
        return this.point.equalsToPoint(beam.point) &&
               this.vector.equalsToVector(beam.vector);
    };
    this.getNormalVector = function() {
        return this.line.getNormalVector();
    };
    this.getDirectingVector = function() {
        return this.vector;
    };
    //Может вернуть @Beam, @Segment, @Point или null
    this.getIntersectionWithBeam = function(beam) {
        var intersec = this.line.getIntersectionWithBeam(beam);
        if (intersec === null) {
            return null;
        }
        else if (Type.isBeam(intersec)) {
            if (this.point.isOnBeam(beam)) {
                return beam.point.isOnBeam(this) ? new Segment(this.point, beam.point)
                                                 : this;
            }
            else {
                return beam.point.isOnBeam(this) ? beam : null;
            }
        }
        else if (Type.isPoint(intersec)) {
            return intersec.isOnBeam(beam) ? intersec : null;
        }
    };
}
