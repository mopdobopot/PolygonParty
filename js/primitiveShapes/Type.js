/**
 * @author Lomovtsev Pavel
 * Date: 14.04.2014
 * Time: 17:16
 */
var Type = {
    isBeam: function(obj) {
        return obj.hasOwnProperty("point") &&
               obj.hasOwnProperty("vector") &&
               obj.hasOwnProperty("line");
    },
    isLine: function(obj) {
        return obj.hasOwnProperty("a") &&
               obj.hasOwnProperty("b") &&
               obj.hasOwnProperty("c");
    },
    isSegment: function(obj) {
        return obj.hasOwnProperty("a") &&
               obj.hasOwnProperty("b") &&
               obj.hasOwnProperty("beamA") &&
               obj.hasOwnProperty("beamB");
    },
    isPoint: function(obj) {
        return obj.hasOwnProperty("x") &&
               obj.hasOwnProperty("y");
    }
};
