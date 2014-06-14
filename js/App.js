/**
 * @Author Lomovtsev Pavel
 * Date: 03.10.13
 * Time: 21:30
 */
$(document).ready(function() {

    /* Холст */

    var canvasId = "canvas",
        coordinateSystemCanvasId = "csCanvas",
        $canvas = $("#" + canvasId),
        canvas = document.getElementById(canvasId),
        context = canvas.getContext("2d"),
        w = canvas.width,
        h = canvas.height,
        csCanvas = document.getElementById(coordinateSystemCanvasId),
        csContext = csCanvas.getContext("2d");

    Drawing.c = context;
    DebugDrawing.c = context;
    csCanvas.width = w;
    csCanvas.height = h;
    Drawing.drawCoordinateSystem(csContext, w, h);

    var clickedVertex,
        clone = function(obj) {
            return $.extend(true, {}, obj); //Глубокое клонирование
        };

    $canvas.mousedown(function(e) {
        $canvas.css('cursor', 'default');
        var i = tryToFindVertex({x: e.offsetX, y: e.offsetY}, currentVertexes);
        if (i || i === 0) {
            currentVertexes[i].isClicked = true;
            clickedVertex = clone(currentVertexes[i]);
            clickedVertex.index = i;
            redraw();
        }
    });
    $canvas.mouseup(function() {
        for (var i = 0; i < currentVertexes.length; i++) {
            currentVertexes[i].isClicked = undefined;
        }
        clickedVertex = undefined;
        redraw();
    });
    $canvas.mousemove(function(e) {
        if (clickedVertex) {
            clickedVertex.x = e.offsetX;
            clickedVertex.y = e.offsetY;
            currentVertexes[clickedVertex.index] = clone(clickedVertex);
            redraw();
        }
        else {
            var i = tryToFindVertex({x: e.offsetX, y: e.offsetY}, currentVertexes);
            (i || i === 0) ? $canvas.css('cursor', 'pointer') : $canvas.css('cursor', 'default');
        }
    });

    var tryToFindVertex = function(v, vertexes) {
            var w;
            for (var i = 0; i < vertexes.length; i++) {
                w = vertexes[i];
                if (Math.abs(w.x - v.x) <= Config.vertexRadius &&
                    Math.abs(w.y - v.y) <= Config.vertexRadius) {
                    return i;
                }
            }
            return false;
        };

    /* Интерфейс */

    var convexPolygonName = "Выпуклый многоугольник",
        starPolygonName = "Звёздный многоугольник";

    // Общие методы ----------------------------------------------------------------------------------------------------|

    var disable = function(object) {
            object.addClass('disabled');
            unError(object);
        },
        enable = function(object) {
            object.removeClass('disabled');
        },
        error = function(object) {
            object.children().addClass('error');
        },
        unError = function(object) {
            object.children().removeClass('error');
        },
        enableButton = function(button) {
            button.removeAttr('disabled');
        },
        disableButton = function(button) {
            button.attr('disabled', 'true');
        },
        checkRadioButton = function(radioButton) {
            radioButton.attr('checked', true);
        },
        checkCheckBox = function(checkbox) {
            checkbox.prop('checked', true);
        },
        uncheckCheckBox = function(checkbox) {
            checkbox.prop('checked', false);
        },
        isChecked = function(checkBox) {
            return checkBox.prop('checked');
        };

    // Тип многоугольника ----------------------------------------------------------------------------------------------|

    var select_polygonType = $('select#polygonTypeSelect'),
        polygonType = convexPolygonName,
        button_generate = $('#generateButton'),
        button_save = $('#saveButton'),
        currentPolygon,
        currentVertexes = [];

    select_polygonType.change(function() {
        polygonType = $(this).val();
        Drawing.clearCanvas(context, w, h);
        switch (polygonType) {
            case convexPolygonName:
                enable(div_regular);
                disable(div_nonConvexityDegreeBlock);
                if (input_vertexAmount.val() == 4 && !isChecked(checkbox_regular)) {
                    enable(div_rectangleTypes);
                }
                break;
            case starPolygonName:
                disable(div_regular);
                disable(div_rectangleTypes);
                enable(div_nonConvexityDegreeBlock);
                break;
        }
    });

    var enableVertexAmount = function() {
            enable(div_vertexAmount);
            if (!input_vertexAmount.val()) {
                input_vertexAmount.val(genRandomVertexesAmount());
            }
            if (vertexAmountError) {
                input_vertexAmount.val(genRandomVertexesAmount());
                vertexAmountError = false;
            }
        },
        genRandomVertexesAmount = function() {
            return (3 + Math.random() * 100).toFixed(0);
        },
        disableVertexAmount = function() {
            disable(div_vertexAmount);
        };

    // Правильный ------------------------------------------------------------------------------------------------------|

    var div_regular = $('div#regularOption'),
        checkbox_regular = $('input[name = regular]');

    checkbox_regular.change(function() {
        if (isChecked(checkbox_regular)) {
            disable(div_rectangleTypes);
        }
        else if (input_vertexAmount.val() == 4) {
            enable(div_rectangleTypes);
        }
    });

    // Типы четырёхугольников ------------------------------------------------------------------------------------------|

    var div_rectangleTypes = $('div#rectangleOptionsBlock'),
        radioButton_randomRectangle = $('input[value = randomRectangle]'),
        radioButton_trapeze = $('input[value = trapeze]'),
        radioButton_parallelogram = $('input[value = parallelogram]');

    checkRadioButton(radioButton_randomRectangle);
    disable(div_rectangleTypes);

    // Количество вершин -----------------------------------------------------------------------------------------------|

    var div_vertexAmount = $('div#vertexAmountOption'),
        input_vertexAmount = $('input[name = vertexAmount]'),
        vertexAmountError = false;

    input_vertexAmount.val(3);

    input_vertexAmount.keyup(function() {
        vertexAmountChangeHandler(input_vertexAmount.val());
    });
    input_vertexAmount.change(function() {
        vertexAmountChangeHandler(input_vertexAmount.val());
    });
    var vertexAmountChangeHandler = function(value) {
            if (value < 3 || value == "") {
                disableButtons();
                error(div_vertexAmount);
                vertexAmountError = true;
            }
            else if (value == 4 && polygonType == convexPolygonName) {
                if (!isChecked(checkbox_regular)) {
                    enable(div_rectangleTypes);
                }
                checkRadioButton(radioButton_randomRectangle);
            }
            else {
                disable(div_rectangleTypes);
                enableButtons();
                unError(div_vertexAmount);
                vertexAmountError = false;
            }
        },
        enableButtons = function() {
            enableButton(button_generate);
            enableButton(button_save);
        },
        disableButtons = function() {
            disableButton(button_generate);
            disableButton(button_save);
        };

    // Степень невыпуклости --------------------------------------------------------------------------------------------|

    var div_nonConvexityDegreeBlock = $('div#nonConvexityDegreeBlock'),
        radioButton_randomNonConvexityDegree = $('input[value = randomDegree]'),
        radioButton_definedNonConvexityDegree = $('input[value = definedDegree]'),
        div_nonConvexityDegree = $('div#nonConvexityDegreeOption'),
        input_nonConvexityDegree = $('input[name = nonConvexityDegree]');

    checkRadioButton(radioButton_randomNonConvexityDegree);
    disable(div_nonConvexityDegree);
    disable(div_nonConvexityDegreeBlock);
    input_nonConvexityDegree.val(45);

    radioButton_definedNonConvexityDegree.change(function() {
        if (isChecked(radioButton_definedNonConvexityDegree)) {
            enable(div_nonConvexityDegree);
        }
    });
    radioButton_randomNonConvexityDegree.change(function() {
        if (isChecked(radioButton_randomNonConvexityDegree)) {
            disable(div_nonConvexityDegree);
        }
    });
    input_nonConvexityDegree.keyup(function() {
        nonConvexityDegreeChangeHandler(input_nonConvexityDegree.val());
    });
    input_nonConvexityDegree.change(function() {
        nonConvexityDegreeChangeHandler(input_nonConvexityDegree.val());
    });
    var nonConvexityDegreeChangeHandler = function(value) {
        if (value < 0 || value > 180 || value == "") {
            disableButtons();
            error(div_nonConvexityDegree);
        }
        else {
            enableButtons();
            unError(div_nonConvexityDegree);
        }
    };

    // Показать номера вершин ------------------------------------------------------------------------------------------|

    var div_showVertexNumbers = $('div#vertexNumbersOption'),
        checkbox_showVertexNumbers = $('input[name = withNumbers]');

    checkbox_showVertexNumbers.click(function() {
        redraw();
    });

    // Кнопка "Нарисовать" ---------------------------------------------------------------------------------------------|

    button_generate.click(function() {
        generateAndDrawPolygon();
    });
    $(document).keydown(function(e) {
        if (e.keyCode === 13) {
            generateAndDrawPolygon();
        }
    });

    var generateAndDrawPolygon = function() {
        var n = input_vertexAmount.val();
        switch (polygonType) {
            case convexPolygonName:
                if (isChecked(checkbox_regular)) {
                    ConvexPolygon.drawRegular(context, w, h, n, h / 2, isChecked(checkbox_showVertexNumbers));
                    createInfoTable(ConvexPolygon);
                }
                else if (n == 3) {
                    Triangle.drawRand(context, w, h, h / 2, isChecked(checkbox_showVertexNumbers));
                    createInfoTable(Triangle);
                }
                else {
                    if (n == 4) {
                        if (isChecked(radioButton_trapeze)) {
                            ConvexPolygon.drawTrapeze(context, w, h, h / 2, isChecked(checkbox_showVertexNumbers));
                        }
                        else if (isChecked(radioButton_parallelogram)) {
                            ConvexPolygon.drawParallelogram(context, w, h, h / 2, isChecked(checkbox_showVertexNumbers));
                        }
                        else if (isChecked(radioButton_randomRectangle)) {
                            ConvexPolygon.drawRandomQuadrangle(context, w, h, h / 2, isChecked(checkbox_showVertexNumbers));
                        }
                    }
                    else {
                        ConvexPolygon.drawRand(context, w, h, n, h / 2, isChecked(checkbox_showVertexNumbers));
                    }
                    createInfoTable(ConvexPolygon);
                }
                if (n == 3) {
                    currentVertexes = Triangle.vertexes;
                    currentPolygon = Triangle;
                }
                else {
                    currentVertexes = ConvexPolygon.vertexes;
                    currentPolygon = ConvexPolygon;
                }
                break;
            case starPolygonName:
                if (isChecked(radioButton_definedNonConvexityDegree)) {
                    var phi = input_nonConvexityDegree.val() / 180 * Math.PI;
                    StarPolygon.drawRandStretched(context, w, h, n, h, phi, isChecked(checkbox_showVertexNumbers));
                }
                else {
                    StarPolygon.drawRand(context, w, h, n, h, isChecked(checkbox_showVertexNumbers));
                }
                createInfoTable(StarPolygon);
                currentVertexes = StarPolygon.vertexes;
                currentPolygon = StarPolygon;
                break;
        }
    };

    var makeInfoObject = function(polygon) {
            return {
                "Тип": polygon.type,
                "Периметр": polygon.getPerimeter(),
                "Площадь": polygon.getSquare(),
                "Альфа-выпуклость": polygon.getAlphaConvexity()
            }
        },
        createInfoTable = function(polygon) {
            $('#infoTable').html(toHtml(makeInfoObject(polygon)));
        },
        toHtml = function(object) {
            var info = "";
            for (var key in object) {
                if (object.hasOwnProperty(key)) {
                    info += '<tr>' +
                        '<td>' + key + ':</td>' +
                        '<td>' + object[key] + '</td>' +
                        '</tr>';
                }
            }
            return info;
        },
        redraw = function() {
            Drawing.drawPolygon(currentVertexes, context, w, h, isChecked(checkbox_showVertexNumbers));
            currentPolygon.vertexes = currentVertexes;
            currentPolygon.type = "Не определён";
            createInfoTable(currentPolygon);
        };

    // Скрыть/показать опции сохранения --------------------------------------------------------------------------------|

    var toggle_saveOptions = $('#saveOptionsToggle'),
        div_saveOptions = $('div#saveOptionsBlock');

    toggle_saveOptions.click(function() {
        if (div_saveOptions.is(':visible')) {
            div_saveOptions.slideUp(100);
            toggle_saveOptions.text("Дополнительные параметры");
        }
        else {
            div_saveOptions.slideDown(100);
            toggle_saveOptions.text("Скрыть");
        }
    });

    // Количество многоугольников --------------------------------------------------------------------------------------|

    var option_polygonAmount = $('div#polygonAmountOption'),
        input_polygonAmount = $('input[name = polygonAmount]'),
        polygonAmountError = false;

    input_polygonAmount.val(1);

    input_polygonAmount.keyup(function() {
        polygonAmountChangeHandler(input_polygonAmount.val());
    });
    input_polygonAmount.change(function() {
        polygonAmountChangeHandler(input_polygonAmount.val());
    });
    var polygonAmountChangeHandler = function(value) {
        if (value < 1) {
            disableButton(button_save);
            error(option_polygonAmount);
            polygonAmountError = true;
        }
        else {
            enableButton(button_save);
            unError(option_polygonAmount);
            polygonAmountError = false;
            if (value > 1) {
                enableOneFile();
                enable(div_manyFiles);
                imageOptionLabel.text("С картинками");
            }
            else if (value == 1) {
                checkRadioButton(radioButton_oneFile);
                fileNameLabel.text("Имя файла");
                disable(div_oneFile);
                disable(div_manyFiles);
                imageOptionLabel.text("С картинкой");
            }
        }
    };

    // С картинками или без --------------------------------------------------------------------------------------------|

    var checkbox_image = $('input[name = imageCheck]'),
        imageOptionLabel = $('#imageOptionLabel');

    checkCheckBox(checkbox_image);
    imageOptionLabel.text("С картинкой");

    // В один файл или в разные ----------------------------------------------------------------------------------------|

    var div_oneFile = $('div#oneFileOption'),
        div_manyFiles = $('div#manyFilesOption'),
        radioButton_oneFile = $('input[value = oneFile]'),
        radioButton_manyFiles = $('input[value = manyFiles]'),
        fileNameLabel = $('#fileNameLabel'),
        enableOneFile = function() {
            enable(div_oneFile);
            checkRadioButton(radioButton_oneFile);
        };

    fileNameLabel.text("Имя файла");

    radioButton_oneFile.change(function() {
        if ($(this).prop('checked')) {
            fileNameLabel.text("Имя файла");
        }
    });
    radioButton_manyFiles.change(function() {
        if ($(this).prop('checked')) {
            fileNameLabel.text("Префикс имён файлов");
        }
    });

    // Имя файла для сохранения ----------------------------------------------------------------------------------------|

    var input_fileName = $('input[name = fileName]');

    input_fileName.val(Config.polygonFileName);

    // Кнопка "Сохранить" ----------------------------------------------------------------------------------------------|

    button_save.click(function() {

        var n = input_polygonAmount.val(),
            name = input_fileName.val();

        if (name == "") {
            name = Config.polygonFileName;
        }
        if (currentVertexes.length == 0) {
            generateAndDrawPolygon();
        }
        if (n == 1) {
            savePolygons([currentVertexes], name, name);
        }
        else {
            if (isChecked(radioButton_manyFiles)) {
                if (currentVertexes.length == 0) {
                    generateAndDrawPolygon();
                }
                savePolygons([currentVertexes], name + "1", name + "1");
                for (var i = 2; i <= n; i++) {
                    generateAndDrawPolygon();
                    savePolygons([currentVertexes], name + i, name + i);
                }
            }
            else {
                if (currentVertexes.length == 0) {
                    generateAndDrawPolygon();
                }
                var polygonList = [currentVertexes];
                for (i = 1; i < n; i++) {
                    if (isChecked(checkbox_image)) {
                        canvas.toBlob(function(blob) {
                            saveAs(blob, name + i);
                        });
                    }
                    generateAndDrawPolygon();
                    polygonList.push(currentVertexes);
                }
                savePolygons(polygonList, name, name + n);
            }
        }
    });

    var savePolygons = function(polygonList, txtName, pngName) {
            IO.writeToSingleFile(polygonList, txtName + ".txt");
            if (checkbox_image.prop('checked')) {
                canvas.toBlob(function(blob) {
                    saveAs(blob, pngName + ".png");
                });
            }
        }
});

