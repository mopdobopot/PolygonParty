/**
 * @author Lomovtsev Pavel
 * Date: 16.06.2014
 * Time: 10:48
 */
var Example = {
    parallelSides1: function() {
        this.dropVertexes();
        this.addVertex(new Point(100, 100));
        this.addVertex(new Point(200, 100));
        this.addVertex(new Point(200, 250));
        this.addVertex(new Point(220, 250));
        this.addVertex(new Point(220, 50));
        this.addVertex(new Point(300, 100));
        this.addVertex(new Point(300, 300));
        this.addVertex(new Point(100, 300));
        this.centerAndDraw(720, 500, Drawing.c, true);
        return this.vertexes;
    },
    parallelSides2: function() {
        this.dropVertexes();
        this.addVertex(new Point(100, 100));
        this.addVertex(new Point(110, 100));
        this.addVertex(new Point(110, 250));
        this.addVertex(new Point(470, 250));
        this.addVertex(new Point(470, 50));
        this.addVertex(new Point(550, 100));
        this.addVertex(new Point(550, 300));
        this.addVertex(new Point(100, 300));
        this.centerAndDraw(720, 500, Drawing.c, true);
        return this.vertexes;
    }
};
Example.__proto__ = BasePolygon;