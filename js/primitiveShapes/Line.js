/**
 * @author Lomovtsev Pavel
 * Date: 10.04.2014
 * Time: 23:10
 */
function Line(a, b, c) {
    //По двум точкам
    if (c === undefined) {
        this.a = a.y - b.y;
        this.b = b.x - a.x;
        this.c = a.x * b.y - b.x * a.y;
    }
    //Конкретные значения a, b и с
    else {
        this.a = a;
        this.b = b;
        this.c = c;
    }
    if (this.a === 0 && this.b === 0) {
        throw new Error("Для задания прямой необходимы две различные точки, а переданы " + a.toString() + " и " + b.toString());
    }

    //Возвращает infinity если прямые совпадают, null если параллельны
    this.getIntersectionWithLine = function(line) {
        var d = line.a * this.b - this.a * line.b;
        if (d === 0) {
            return (this.a * line.c - this.c * line.a === 0 &&
                    this.b * line.c - this.c * line.b === 0) ? Infinity : null;
        }
        var x = (this.c * line.b - line.c * this.b) / d,
            y = (this.a * line.c - line.a * this.c) / d;
        return new Point(x, y);
    };
    this.getIntersectionWithBeam = function(beam) {
        var p = this.getIntersectionWithLine(beam.line);
        if (p === Infinity) {
            return beam;
        }
        else if (p === null) {
            return null;
        }
        else {
            var v = new Vector(beam.point, p);
            return v.sameDirected(beam.vector)
        }
    }
}