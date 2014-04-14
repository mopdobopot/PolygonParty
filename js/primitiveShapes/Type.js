/**
 * @author Lomovtsev Pavel
 * Date: 14.04.2014
 * Time: 17:16
 */
var Type = {
    isBeam: function(obj) {
        return obj.hasOwnProperty("line");
    },
    isLine: function(obj) {
        return obj.hasOwnProperty("c");
    },
    isSegment: function(obj) {
        return obj.hasOwnProperty("beamA");
    },
    isPoint: function(obj) {
        return obj.hasOwnProperty("x");
    }
};
