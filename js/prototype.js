(function ($) {
    $(document).ready( function () {
        var arrObjects = [];


        function Todo () {
            this.id = -1;
            this.checked = false;
        }

        //===============================Отправляем сообщение=============================//

        Todo.prototype.sendMessage = function (text) {
            this.text = text;
            this.id += 1;
            var objectTodo = $.extend({}, todo);
            arrObjects.push(objectTodo);
            var li = $('<li data-id= ' + this.id + '> ' +
                            '<div class="view"> ' +
                                '<input class="toggle" type="checkbox"> ' +
                                '<label>' + this.text + '</label> ' +
                            '</div> ' +
                            '<input class="edit" type="text" value=' + this.text + '> ' +
                            '<a class="destroy" href="#"></a> ' +
                        '</li>'),
            ul = $('#todo-list');
            ul.append(li);
            $('#main, footer').show();
            todo.countItems();
            todo.checkDoneItem();
        };

        //===============================Редактирование сообщения=============================//

        Todo.prototype.editMessage = function () {
            $(this).find('.edit').show();
            $(this).find('.view').hide();
            $(this).find('.destroy').hide();
            $(this).addClass('editing');
            todo.clearSelection();
        };

        //===============================Окончание редактирвоания сообщения=============================//

        Todo.prototype.finishEditMessage = function (e, value, li) {
            var view = $(e.currentTarget).closest('li').find('.view'),
                edit = $(e.currentTarget).closest('.edit');

                edit.hide();
                view.show();
                $(this).closest('li').find('.destroy').css('display', '');
                view.find('label').html(value);
                edit.attr('value', value);
                li.removeClass('editing');
        };

        //===============================Удаление сообщения=============================//

        Todo.prototype.destroyMessage = function (e) {
            for(var i = 0; i < arrObjects.length; i++) {
                if(arrObjects[i].id == $(e.currentTarget).closest('li').data('id') )
                    arrObjects.splice(i, 1);
            }
            $(this).closest('li').remove();
            todo.countItems();
            todo.checkDoneItem();
        };

        //===============================Считаем кол-во существующих сообщений=============================//

        Todo.prototype.countItems = function () {
            var count = arrObjects.length,
                counter = $('.todo-count').find('b');
                counter.html(count);

                if(count == 0) {
                    $('#main, footer').hide();
                    $('#main').find('#toggle-all').prop('checked', false);
                }
        };

        //===============================Проверка на наличие чека у чекбокса=============================//

        Todo.prototype.checkForCheckBox = function (e, li) {
            for(var i = 0; i < arrObjects.length; i++){
                if(arrObjects[i].id == li.data('id')) {
                    arrObjects[i].checked = $(e.currentTarget).is(':checked');
                }
            }
            $(e.currentTarget).closest('li').toggleClass('done');
            todo.ifOneCheckBoxNotChecked();
            todo.ifHaveDoneItem();
        };

        //===============================Проверка для общего чекбокса=============================//

        Todo.prototype.checkForAllCheckBox = function (e) {
            if($(e.currentTarget).is(':checked')) {
                for(var i = 0; i < arrObjects.length; i++){
                    arrObjects[i].checked = true;
                };
                $('#todo-list').find('li').addClass('done').find('.toggle').prop("checked", true);
            } else {
                for(var i = 0; i < arrObjects.length; i++){
                    arrObjects[i].checked = false;
                };
                $('#todo-list').find('li').removeClass('done').find('.toggle').prop("checked", false);
            }
            todo.checkDoneItem();
            todo.ifHaveDoneItem();
        };

        //===============================Не позволяет выделять элемент=============================//

        Todo.prototype.clearSelection = function () {
            try {
                window.getSelection().removeAllRanges();
            } catch(e) {
                document.selection.empty();
            }
        };

        //===============================Сколько задач выполненно=============================//

        Todo.prototype.checkDoneItem = function () {
            var trueCheck = 0,
                result,
                resultForClearBtn = 0,
                counter = $('.todo-count').find('b');

            for(var i = 0; i < arrObjects.length; i++) {
                if(arrObjects[i].checked == false) {
                    trueCheck += 1;
                }
                result = trueCheck;
                resultForClearBtn = arrObjects.length - trueCheck;
            }
            todo.countDoneItem(resultForClearBtn);

            counter.html(result);
        };

        //===============================Если хоть один чек не чекнут, вырубает общий или наоборот=============================//

        Todo.prototype.ifOneCheckBoxNotChecked = function () {
            for( var i = 0; i < arrObjects.length; i++ ) {
                if( arrObjects[i].checked == false ) {
                    $('#main').find('#toggle-all').prop('checked', false);
                    return;
                } else if (arrObjects[i].checked == true){
                    $('#main').find('#toggle-all').prop('checked', true);
                }
            }
        };

        //===============================Удаляем отмеченные пункты=============================//

        Todo.prototype.ifHaveDoneItem = function () {
            for(var i = 0; i < arrObjects.length; i++) {
                if(arrObjects[i].checked == true) {
                    $('footer').find('#clear-completed').show();
                    return;
                } else {
                    $('footer').find('#clear-completed').hide();
                }
            }
        };

        //===============================Отрисовываем кол-во отмеченных пункотв для кнопки удаления отмеченных=============================//

        Todo.prototype.countDoneItem = function (resultForClearBtn) {
            $('footer').find('#clear-completed').html('Clear ' + resultForClearBtn + ' completed item');
        };

        Todo.prototype.removeDoneMessage = function () {
            for(var i = 0; i < arrObjects.length; i++) {
                if(arrObjects[i].checked) {
                    arrObjects.splice(i, 1);
                    i--;
                } else {
                    $('footer').find('#clear-completed').hide();
                }
            }
            $('#todo-list').find('li.done').remove();
            if (!arrObjects.length) {
                $('#main, footer').hide();
                $('footer').find('#clear-completed').hide();
                $('#main').find('#toggle-all').prop('checked', false);
            }
        };

        var todo = new Todo();

        //===============================Здесь вызывются события=============================//

        $('header').on('keydown', 'input', function (e) {
            if(e.keyCode == 13) {
                var inputTexts = $('header').find('input').val();
                if (!inputTexts) {
                    return;
                }
                $(this).val('');
                todo.sendMessage(inputTexts);
            }
        });
        $('#todo-list').on('keydown', 'input', function (e) {
            if( e.keyCode == 13 || e.keyCode == 27 ){
                var value = $(e.currentTarget).val(),
                    li = $(e.currentTarget).closest('li');
                for(var i = 0; i < arrObjects.length; i++){
                    if(arrObjects[i].id == li.data('id')) {
                        arrObjects[i].text = value;
                    }
                };
                todo.finishEditMessage(e, value, li);
            }
        });
        $('#todo-list').on('dblclick', 'li', todo.editMessage);
        $('#todo-list').on('dblclick', '.toggle', function () {return false;});
        $('#todo-list').on('click', '.destroy', todo.destroyMessage);
        $('#todo-list').on('click', '.toggle', function (e) {
            var li = $(this).closest('li');
            todo.checkForCheckBox(e, li);
            todo.checkDoneItem();
        });
        $('#main').on('click', '#toggle-all', todo.checkForAllCheckBox);
        $('footer').on('click', '#clear-completed', todo.removeDoneMessage);




    });
}(jQuery));