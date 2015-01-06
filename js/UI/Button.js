/**
 * Created by mopdobopot on 30.12.2014.
 */

function Button() {

    return {

        $container: undefined,
        $elem: undefined,
        id: undefined,
        textValue: undefined,
        state: ButtonState.ENABLED,

        init: function($container, id, textValue, defaultState, onClickFunc) {
            this.$container = $container;
            this.$container.append(
                "<button id=" + id + ">" + textValue + "</button>"
            );
            this.$elem = $('#' + id);
            this.$elem.click(function() {
                if (onClickFunc) onClickFunc();
            });
            this.id = id;
            this.textValue = textValue;
            if (defaultState) {
                this.setState(defaultState);
            }
            return this;
        },
        setState: function(newState) {
            switch (newState) {
                case ButtonState.DISABLED:
                    this.$elem.attr('disabled', true);
                    break;
                case ButtonState.ENABLED:
                    this.$elem.attr('disabled', false);
                    break;
                default:
                    throw new Error('Unknown Button state');
            }
            this.state = newState;
        },
        enable: function() {
            this.setState(ButtonState.ENABLED);
        },
        disable: function() {
            this.setState(ButtonState.DISABLED);
        }
    }
}

var ButtonState = {
    ENABLED: 'enabled',
    DISABLED: 'disabled'
};