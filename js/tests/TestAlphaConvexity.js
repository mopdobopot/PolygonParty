/**
 * @author Lomovtsev Pavel
 * Date: 29.10.2014
 * Time: 22:43
 */

var TestAlphaConvexity = {
    all: function() {
        var testName = "alphaConvexity()";
        try {
            exampleBisector();
            if (Math.abs(Example.getAlphaConvexity() - Math.PI / 2) >= Config.alphaConvexityEps) {
                throw new Error("Случай с одной биссектрисой")
            }

            exampleTwoVertexes();
            if (Math.abs(Example.getAlphaConvexity() - Math.PI) >= Config.alphaConvexityEps) {
                throw new Error("Случай с двумя вершинами (когда угол равен PI)")
            }

            exampleParallelSides1();
            if (Math.abs(Example.getAlphaConvexity() - Math.PI) >= Config.alphaConvexityEps) {
                throw new Error("Случай с параллельными сторонами (когда угол равен PI)")
            }

            exampleParallelSides2();
            if (Math.abs(Example.getAlphaConvexity() - Math.PI) <= Config.alphaConvexityEps) {
                throw new Error("Случай с параллельными сторонами (когда угол не равен PI)")
            }

            exampleParabolaVertex();
            if (Math.abs(Example.getAlphaConvexity() - Math.PI) >= Config.alphaConvexityEps) {
                throw new Error("Случай с вершиной параболы (когда угол равен PI)")
            }

            exampleTwoBisectors();
            if (Math.abs(Example.getAlphaConvexity()) <= Math.PI / 2) {
                throw new Error("Случай с двумя биссектрисами")
            }

            acTestThreeVertexes();
            if (Math.abs(Example.getAlphaConvexity() - Math.PI) >= Config.alphaConvexityEps) {
                throw new Error("Случай с двумя вершинами")
            }

            this.logSuccess(testName);
        } catch (whatsWrong) {
            this.logFailure(testName, whatsWrong);
        }
    }
};

TestAlphaConvexity.__proto__ = BaseTest;