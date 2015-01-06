/**
 * Created by mopdobopot on 06.01.2015.
 */

function TextInput() {

    return {

        maxLength: undefined,

        init: function($container, name, label, maxLength, defaultValue, onChange, onError, onUnError) {
            var textInput = new Input().init(
                $container,
                name,
                label,
                defaultValue,
                onChange,
                onError,
                onUnError
            );
            textInput.$elem.attr('type', 'text');
            textInput.$elem.attr('maxLength', maxLength);
            this.maxLength = maxLength;
            textInput.isValidValue = function(value) {
                return typeof(value) == 'string';
            };
            return textInput;
        }
    }
}