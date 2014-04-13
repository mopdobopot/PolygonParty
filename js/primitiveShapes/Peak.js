/**
 * @author Lomovtsev Pavel
 * Date: 13.04.2014
 * Time: 13:59
 */
function Peak(vertex, segment1, segment2) {
    this.vertex = vertex;
    this.seg1 = segment1;
    this.seg2 = segment2;
    this.beam1 = this.seg1.beamB;
    this.beam2 = this.seg2.beamA;

    this.isNeighbour = function(peak) {
        return this.vertex.equalsToPoint(peak.seg1.a) ||
               this.vertex.equalsToPoint(peak.seg2.b);
    }
}