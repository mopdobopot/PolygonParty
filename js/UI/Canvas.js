/**
 * Created by mopdobopot on 04.01.2015.
 */

function Canvas($container, canvasId, coordinateSystemCanvasId) {
    return {
        $container: $container,
        $elem: undefined,
        canvasId: canvasId,
        coordinateSystemCanvasId: coordinateSystemCanvasId,
        width: undefined,
        height: undefined,

        init: function(width, height) {
            this.$container.append(
                "<canvas id=" + this.canvasId + " width=" + width + " height=" + height + "></canvas>" +
                "<canvas id=" + this.coordinateSystemCanvasId + ">Ваш браузер не поддерживает canvas</canvas>"
            );
            this.$elem = $('#' + this.id);
            this.width = width;
            this.height = height;
        }
    }
}