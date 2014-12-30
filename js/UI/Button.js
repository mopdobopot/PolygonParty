/**
 * Created by mopdobopot on 30.12.2014.
 */

function Button($container, id, textValue) {
    $container.append(
        "<button id=" + id + ">" + textValue + "</button>"
    );
    var $elem = $('#' + id);
    return {
        $container: $container,
        $elem: $elem,
        name: name,
        textValue: textValue
    }
}