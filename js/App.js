/**
 * @Author Lomovtsev Pavel
 * Date: 03.10.13
 * Time: 21:30
 */
$(document).ready(function() {

    var div_canvasBlock = $('div.canvasBlock');
    var canvas = new Canvas().init(
            div_canvasBlock,
            'canvas',
            'csCanvas',
            720, 500
        ),
        //local aliases
        w = canvas.width,
        h = canvas.height;

    var convexPolygonName = "Выпуклый многоугольник",
        starPolygonName = "Звёздный многоугольник";

    CurState.polygonType = convexPolygonName;
    CurState.infoTable = new InfoTable().init(
        div_canvasBlock,
        'infoTable',
        CurState.polygon
    );

    // Общие методы ----------------------------------------------------------------------------------------------------|

    var hide = function(object) {
            object.addClass('displayNone');
            unError(object);
        },
        show = function(object) {
            object.removeClass('displayNone');
        },
        unError = function(object) {
            object.children().removeClass('error');
        },
        checkRadioButton = function(radioButton) {
            radioButton.attr('checked', true);
        },
        isChecked = function(checkBox) {
            return checkBox.prop('checked');
        },
        enableButtons = function() {
            button_generate.enable();
            button_save.enable();
        },
        disableButtons = function() {
            button_generate.disable();
            button_save.disable();
        };

    // Тип многоугольника ----------------------------------------------------------------------------------------------|

    var select_polygonType = new Select().init(
        $('div#polygonTypeOption'),
        'polygonTypeSelect',
        [
            convexPolygonName,
            starPolygonName
        ],
        convexPolygonName,
        function(newType) {
            CurState.polygonType = newType;
            Drawing.clearCanvas(null, w, h);
            switch (CurState.polygonType) {
                case convexPolygonName:
                    show(div_regular);
                    hide(div_nonConvexityDegreeBlock);
                    if (input_vertexAmount.val() == 4 && !checkbox_regular.isChecked()) {
                        show(div_rectangleTypes);
                    }
                    break;
                case starPolygonName:
                    hide(div_regular);
                    hide(div_rectangleTypes);
                    show(div_nonConvexityDegreeBlock);
                    break;
            }
        }
    );
    CurState.select_polygonType = select_polygonType;

    // Кнопка "Нарисовать" ---------------------------------------------------------------------------------------------|

    var generateAndDrawPolygon = function() {
        var n = input_vertexAmount.val();
        switch (CurState.polygonType) {
            case convexPolygonName:
                if (checkbox_regular.isChecked()) {
                    ConvexPolygon.drawRegular(null, w, h, n, h / 2, checkbox_showVertexNumbers.isChecked());
                    CurState.infoTable.update(ConvexPolygon);
                }
                else if (n == 3) {
                    Triangle.drawRand(null, w, h, h / 2, checkbox_showVertexNumbers.isChecked());
                    CurState.infoTable.update(Triangle);
                }
                else {
                    if (n == 4) {
                        if (isChecked(radioButton_trapeze)) {
                            ConvexPolygon.drawTrapeze(null, w, h, h / 2, checkbox_showVertexNumbers.isChecked());
                        }
                        else if (isChecked(radioButton_parallelogram)) {
                            ConvexPolygon.drawParallelogram(null, w, h, h / 2, checkbox_showVertexNumbers.isChecked());
                        }
                        else if (isChecked(radioButton_randomRectangle)) {
                            ConvexPolygon.drawRandomQuadrangle(null, w, h, h / 2, checkbox_showVertexNumbers.isChecked());
                        }
                    }
                    else {
                        ConvexPolygon.drawRand(null, w, h, n, h / 2, checkbox_showVertexNumbers.isChecked());
                    }
                    CurState.infoTable.update(ConvexPolygon);
                }
                if (n == 3) {
                    CurState.vertexes = Triangle.vertexes;
                    CurState.polygon = Triangle;
                }
                else {
                    CurState.vertexes = ConvexPolygon.vertexes;
                    CurState.polygon = ConvexPolygon;
                }
                break;
            case starPolygonName:
                if (isChecked(radioButton_definedNonConvexityDegree)) {
                    var phi = input_nonConvexityDegree.val() / 180 * Math.PI;
                    StarPolygon.drawRandStretched(null, w, h, n, h, phi, checkbox_showVertexNumbers.isChecked());
                }
                else {
                    StarPolygon.drawRand(null, w, h, n, h, checkbox_showVertexNumbers.isChecked());
                }
                CurState.infoTable.update(StarPolygon);
                CurState.vertexes = StarPolygon.vertexes;
                CurState.polygon = StarPolygon;
                break;
        }
    };
    var button_generate = new Button().init(
            $('#polygonTypeOption'),
            'generateButton',
            'Нарисовать',
            ButtonState.ENABLED,
            generateAndDrawPolygon
        );
    CurState.button_generate = button_generate;

    // Кнопка "Сохранить" ----------------------------------------------------------------------------------------------|

    var savePolygonsFunction = function() {
        var n = input_polygonAmount.val(),
            name = input_fileName.val();
        if (name == "") {
            name = Config.polygonFileName;
        }
        if (CurState.vertexes.length == 0) {
            generateAndDrawPolygon();
        }
        if (n == 1) {
            savePolygons([CurState.vertexes], name, name);
        }
        else {
            if (isChecked(radioButton_manyFiles)) {
                if (CurState.vertexes.length == 0) {
                    generateAndDrawPolygon();
                }
                savePolygons([CurState.vertexes], name + "1", name + "1");
                for (var i = 2; i <= n; i++) {
                    generateAndDrawPolygon();
                    savePolygons([CurState.vertexes], name + i, name + i);
                }
            }
            else {
                if (CurState.vertexes.length == 0) {
                    generateAndDrawPolygon();
                }
                var polygonList = [CurState.vertexes];
                for (i = 1; i < n; i++) {
                    if (checkbox_image.isChecked()) {
                        canvas.HTMLElem.toBlob(function(blob) {
                            saveAs(blob, name + i);
                        });
                    }
                    generateAndDrawPolygon();
                    polygonList.push(CurState.vertexes);
                }
                savePolygons(polygonList, name, name + n);
            }
        }
    };
    var savePolygons = function(polygonList, txtName, pngName) {
        IO.writeToSingleFile(polygonList, txtName + ".txt");
        if (checkbox_image.isChecked()) {
            canvas.HTMLElem.toBlob(function(blob) {
                saveAs(blob, pngName + ".png");
            });
        }
    };
    var button_save = new Button().init(
            $('#saveButtonOption'),
            'saveButton',
            "Сохранить",
            ButtonState.ENABLED,
            savePolygonsFunction
        );
    CurState.button_save = button_save;

    // Правильный ------------------------------------------------------------------------------------------------------|

    var div_regular = $('div#regularOption');
    var checkbox_regular = new Checkbox().init(
        div_regular,
        'regular',
        'Правильный',
        CheckboxState.UNCHECKED,
        null,
        function() {
            if (input_vertexAmount.val() == 4) {
                hide(div_rectangleTypes);
            }
        },
        function() {
            if (input_vertexAmount.val() == 4) {
                show(div_rectangleTypes);
            }
        }
    );
    CurState.checkbox_regular = checkbox_regular;

    // Типы четырёхугольников ------------------------------------------------------------------------------------------|

    var div_rectangleTypes = $('div#rectangleOptionsBlock'),
        radioButtons_rectangleTypes = new RadioButton().init(
            div_rectangleTypes,
            'rectangleOption',
            [
                {
                    value: 'randomRectangle',
                    label: 'любой'
                },
                {
                    value: 'trapeze',
                    label: 'трапеция'
                },
                {
                    value: 'parallelogram',
                    label: 'параллелограмм'
                }
            ],
            'randomRectangle'
        ),
        radioButton_randomRectangle = radioButtons_rectangleTypes.$elems['randomRectangle'],
        radioButton_trapeze = radioButtons_rectangleTypes.$elems['trapeze'],
        radioButton_parallelogram = radioButtons_rectangleTypes.$elems['parallelogram'];

    checkRadioButton(radioButton_randomRectangle);
    hide(div_rectangleTypes);

    // Количество вершин -----------------------------------------------------------------------------------------------|

    var div_vertexAmount = $('div#vertexAmountOption');
    var input_vertexAmount = new NumberInput().init(
            div_vertexAmount,
            'vertexAmount',
            'Число вершин (три и более)',
            3, Infinity,
            3,
            function(value) {
                if (value == 4 && CurState.polygonType == convexPolygonName) {
                    if (!checkbox_regular.isChecked()) {
                        show(div_rectangleTypes);
                    }
                    enableButtons();
                    checkRadioButton(radioButton_randomRectangle);
                }
            },
            function() {
                disableButtons();
            },
            function() {
                hide(div_rectangleTypes);
                enableButtons();
            }
        );
    CurState.input_vertexAmount = input_vertexAmount;

    // Степень невыпуклости --------------------------------------------------------------------------------------------|

    var div_nonConvexityDegreeBlock = $('div#nonConvexityDegreeBlock');
    var div_nonConvexityDegree = $('div#nonConvexityDegreeOption');
    var radioButtons_nonConvexityDegree = new RadioButton().init(
        div_nonConvexityDegreeBlock.find('div.option').first(),
        'nonConvexityOption',
        [
            {
                value: 'randomDegree',
                label: 'любой',
                onCheck: function() {
                    hide(div_nonConvexityDegree);
                }
            },
            {
                value: 'definedDegree',
                label: 'указать степень невыпуклости',
                onCheck: function() {
                    show(div_nonConvexityDegree)
                }
            }
        ],
        'randomDegree'
    );

    hide(div_nonConvexityDegreeBlock);
    hide(div_nonConvexityDegree);

    var radioButton_definedNonConvexityDegree = radioButtons_nonConvexityDegree.$elems['definedDegree'];
    var input_nonConvexityDegree = new NumberInput().init(
        div_nonConvexityDegree,
        'nonConvexityDegree',
        'Угол в градусах (от 0 до 180)',
        0, 180,
        45,
        null,
        disableButtons,
        enableButtons
    );
    CurState.input_nonConvexityDegree = input_nonConvexityDegree;

    // Показать номера вершин ------------------------------------------------------------------------------------------|

    var checkbox_showVertexNumbers = new Checkbox().init(
        $('div#vertexNumbersOption'),
        'withNumbers',
        'Показывать номера вершин',
        CheckboxState.CHECKED,
        function() {
            if (CurState.polygon != undefined) {
                canvas.redraw();
            }
        }
    );
    CurState.checkbox_showVertexNumbers = checkbox_showVertexNumbers;

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

    // Имя файла для сохранения ----------------------------------------------------------------------------------------|

    var input_fileName = new TextInput().init(
        $('div#fileNameOption'),
        'fileName',
        'Имя файла',
        Infinity,
        Config.polygonFileName
    );

    // Количество многоугольников для сохранения -----------------------------------------------------------------------|

    var polygonAmountChangeHandler = function(value) {
        if (value > 1) {
            enableOneFile();
            show(div_fileAmountOption);
            checkbox_image.setLabel("С картинками");
        }
        else if (value == 1) {
            checkRadioButton(radioButton_oneFile);
            input_fileName.setLabel("Имя файла");
            hide(div_fileAmountOption);
            checkbox_image.setLabel("С картинкой");
        }
    };
    var div_polygonAmountOption = $('div#polygonAmountOption');
    var input_polygonAmount = new NumberInput().init(
        div_polygonAmountOption,
        'polygonAmount',
        'Количество многоугольников',
        1, Infinity,
        1,
        polygonAmountChangeHandler,
        function() {
            button_save.disable();
        },
        function() {
            button_save.enable();
        }
    );
    CurState.input_polygonAmount = input_polygonAmount;

    // С картинками или без --------------------------------------------------------------------------------------------|

    var checkbox_image = new Checkbox().init(
        $('div#imageOption'),
        'imageCheck',
        'С картинкой',
        CheckboxState.CHECKED
    );
    CurState.checkbox_image = checkbox_image;

    // В один файл или в разные ----------------------------------------------------------------------------------------|

    var div_fileAmountOption = $('div#fileAmountOption'),
        div_oneFile = $('div#oneFileOption'),
        div_manyFiles = $('div#manyFilesOption'),
        radioButtons_filesAmount = new RadioButton().init(
            div_fileAmountOption,
            'fileAmountOption',
            [
                {
                    value: 'oneFile',
                    label: 'в один файл',
                    onCheck: function() {
                        input_fileName.setLabel("Имя файла");
                    }
                },
                {
                    value: 'manyFiles',
                    label: 'в разные файлы',
                    onCheck: function() {
                        input_fileName.setLabel("Префикс имён файлов");
                    }
                }
            ]
        ),
        radioButton_oneFile = $('input[value = oneFile]'),
        radioButton_manyFiles = $('input[value = manyFiles]'),
        enableOneFile = function() {
            show(div_oneFile);
            checkRadioButton(radioButton_oneFile);
        };
    CurState.radioButtons_filesAmount = radioButtons_filesAmount;

    hide(div_fileAmountOption);
    checkRadioButton(radioButton_oneFile);

    // Примеры многоугольников -----------------------------------------------------------------------------------------|

    example = function(polygonExample) {
        CurState.polygon = Example;
        CurState.vertexes = Example.build(polygonExample);
        CurState.infoTable.update(CurState.polygon);
    };

    exampleBisector = function() {
        example(Example.bisector);
    };
    exampleTwoVertexes = function() {
        example(Example.twoVertexes);
    };
    exampleParallelSides1 = function() {
        example(Example.parallelSides1);
    };
    exampleParallelSides2 = function() {
        example(Example.parallelSides2);
    };
    exampleNonNeighbourSides = function() {
        example(Example.nonNeighbourSides);
    };
    exampleNonNeighbourSides2 = function() {
        example(Example.nonNeighbourSides2);
    };
    exampleParabolaVertex = function() {
        example(Example.parabolaVertex);
    };
    exampleTwoBisectors = function() {
        example(Example.twoBisectors);
    };
    exampleThreeSides = function() {
        example(Example.threeSides);
    };
    exampleTwoSidesAndVertex = function() {
        example(Example.acTestTwoSidesAndVertex);
    };
});

