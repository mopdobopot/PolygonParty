/**
 * @author Lomovtsev Pavel
 * Date: 12.04.2014
 * Time: 10:20
 */
var BaseTest = {
    logFailure: function(testName, whatsWrong) {
        console.error("FAILURE:\t" + testName + ", " + whatsWrong);
    },
    logSuccess: function(testName) {
        console.info("SUCCESS:\t" + testName);
    }
};