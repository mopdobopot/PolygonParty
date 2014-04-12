/**
 * @author Lomovtsev Pavel
 * Date: 12.04.2014
 * Time: 10:20
 */
var BaseTest = {
    eps: 0.0000001,
    logFailure: function(testName, whatsWrong) {
        console.error("FAILURE:\t" + testName + ", " + whatsWrong);
    },
    logSuccess: function(testName) {
        console.log("SUCCESS:\t" + testName);
    },
    assertEquals: function(a, b) {
        return Math.abs(a - b) < this.eps;
    },
    assertMore: function(a, b) {
        return a - b < this.eps;
    }
};