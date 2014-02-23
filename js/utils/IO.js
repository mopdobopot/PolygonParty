/**
 * @Author Lomovtsev Pavel
 * Date: 02.11.13
 * Time: 14:35
 */
var IO = (function() {

    var vertexes2String = function(vertexes) {
        var ans = vertexes.length + "\n";
        for (var i = 0; i < vertexes.length; i++) {
            ans += vertexes[i].x + " " + vertexes[i].y + "\n";
        }
        return ans;
    }

    return {
        // принимаем массив vertexes
        writeToSingleFile: function(polygonArray, fileName) {
            var acc = [];
            for (var i = 0; i < polygonArray.length; i++) {
                acc.push(vertexes2String(polygonArray[i]));
            }
            var blob = new Blob(acc, {type: "text/plain;charset=utf-8"});
            saveAs(blob, fileName);
        },
        writeToMultipleFiles: function(polygonArray, fileNamePattern) {
            var blob;
            for (var i = 0; i < polygonArray.length; i++) {
                blob = new Blob([vertexes2String(polygonArray[i])], {type: "text/plain;charset=utf-8"});
                saveAs(blob, fileNamePattern + "" + i);
            }
        }
    }
})();
