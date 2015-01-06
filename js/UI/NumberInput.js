/**
 * Created by mopdobopot on 06.01.2015.
 */

function NumberInput() {

    return {

        min: undefined,
        max: undefined,

        init: function($container, name, label, min, max, defaultValue, onChange, onError, onUnError) {
            var numberInput = new Input().init(
                $container,
                name,
                label,
                defaultValue,
                onChange,
                onError,
                onUnError
            );
            numberInput.$elem.attr('type', 'number');
            numberInput.$elem.attr('min', min);
            numberInput.$elem.attr('max', max);
            this.min = min;
            this.max = max;
            var _this = this;
            numberInput.isValidValue = function(value) {
                return value >= _this.min && value <= _this.max && value != "";
            };
            return numberInput;
        }
    }
}