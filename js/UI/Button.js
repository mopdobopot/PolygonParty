/**
 * Created by mopdobopot on 30.12.2014.
 */

function Button($container, id, textValue) {

    return {
        $container: $container,
        $elem: undefined,
        id: id,
        textValue: textValue,
        state: ButtonState.ENABLED,

        init: function(state) {
            this.$container.append(
                "<button id=" + this.id + ">" + this.textValue + "</button>"
            );
            this.$elem = $('#' + this.id);
            if (state != undefined) {
                this.updateState(state);
            }
            return this;
        },
        updateState: function(state) {
            switch (state) {
                case ButtonState.DISABLED:
                    this.$elem.attr('disabled', true);
                    break;
                case ButtonState.ENABLED:
                    this.$elem.attr('disabled', false);
                    break;
                default:
                    throw new Error('Unknown Button state');
            }
            this.state = state;
        },
        enable: function() {
            this.updateState(ButtonState.ENABLED);
        },
        disable: function() {
            this.updateState(ButtonState.DISABLED);
        }
    }
}

var ButtonState = {
    ENABLED: 'enabled',
    DISABLED: 'disabled'
};