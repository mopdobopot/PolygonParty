/**
 * @author Lomovtsev Pavel
 * Date: 16.06.2014
 * Time: 10:48
 */
var Example = {
    build: function(vertexes) {
        this.dropVertexes();
        for (var i = 0; i < vertexes.length; i++) {
            this.addVertex(new Point(vertexes[i][0], vertexes[i][1]));
        }
        this.centerAndDraw(720, 500, Drawing.c, true);
        return this.vertexes;
    },
    bisector: [
        [0, 0],
        [100, 100],
        [200, 0],
        [200, 200],
        [0, 200]
    ],
    twoVertexes: [
        [0, 0],
        [200, 0],
        [160, 120],
        [120, 80],
        [160, 40],
        [40, 40],
        [80, 80],
        [40, 120]
    ],
    parallelSides1: [
        [0, 0],
        [40, 0],
        [40, 120],
        [80, 120],
        [80, 0],
        [120, 0],
        [120, 160],
        [0, 160]
    ],
    parallelSides2: [
        [0, 0],
        [40, 0],
        [40, 40],
        [260, 40],
        [260, 0],
        [300, 0],
        [300, 80],
        [0, 80]
    ],
    nonNeighbourSides: [
        [0, 0],
        [40, 80],
        [120, 80],
        [160, 0],
        [160, 120],
        [0, 120]
    ],
    nonNeighbourSides2: [
        [0, 0],
        [50, 100],
        [75, 50],
        [100, 100],
        [150, 0],
        [150, 150],
        [0, 150]
    ],
    parabolaVertex: [
        [0, 0],
        [250, 0],
        [250, 50],
        [200, 50],
        [150, 150],
        [100, 50],
        [50, 50],
        [50, 200],
        [200, 200],
        [250, 250],
        [0, 250]
    ],
    twoBisectors: [
        [0, 0],
        [350, 0],
        [350, 300],
        [300, 50],
        [50, 100],
        [0, 300]
    ],
    threeSides: [
        [0, 0],
        [50, 100],
        [75, 111],
        [100, 100],
        [150, 0],
        [150, 150],
        [0, 150]
    ],
    acTestThreeVertexes: function() {
        this.dropVertexes();
        this.addVertex(new Point(100, 100));
        this.addVertex(new Point(400, 100));
        this.addVertex(new Point(400, 400));
        this.addVertex(new Point(100, 400));
        this.addVertex(new Point(200, 230));
        this.addVertex(new Point(250, 350));
        this.addVertex(new Point(320, 220));
        this.addVertex(new Point(240, 200));
        this.addVertex(new Point(300, 180));
        this.addVertex(new Point(200, 130));
        this.addVertex(new Point(200, 170));
        this.centerAndDraw(720, 500, Drawing.c, true);
        return this.vertexes;
    },
    acTestTwoSidesAndVertex: function() {
        this.dropVertexes();
        this.addVertex(new Point(0, 0));
        this.addVertex(new Point(400, 0));
        this.addVertex(new Point(240, 80));
        this.addVertex(new Point(160, 160));
        this.addVertex(new Point(160, 80));
        this.addVertex(new Point(50, 80));
        this.addVertex(new Point(50, 400));
        this.addVertex(new Point(160, 400));
        this.addVertex(new Point(160, 480));
        this.addVertex(new Point(0, 480));
        this.centerAndDraw(720, 500, Drawing.c, true);
        return this.vertexes;
    }
};
Example.__proto__ = BasePolygon;