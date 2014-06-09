/**
 * @author Lomovtsev Pavel
 * Date: 09.06.2014
 * Time: 11:19
 */
//Задаётся параболой, точкой и направлением параллельным директрисе
function ParabolicBeam(parabola, point, vector) {
    this.parabola = parabola;
    this.point = point;
    this.vector = vector;
    this.normalLine = new Line(point, point.getShiftedByVector(parabola.directrixNormalVector));

    this.getPointOn = function() {
        return this.point;
    };
    this.getIntersectionWithOtherShape = function(shape) {
        var intersec = G.getIntersection(this.parabola, shape),
            resPoints = [];
        for (var i = 0; i < intersec.pointAmount; i++) {
            if (this.normalLine.arePointsOnSameSide(this.point.getShiftedByVector(this.vector), intersec.p[i])) {
                resPoints.push(intersec.p[i]);
            }
        }
        return {
            pointAmount: resPoints.length,
            p: resPoints
        }
    }
}