(function ($) {
    $(document).ready( function () {
        var arrObjects = [],
            mainFooter = $('#main, footer'),
            clearCompleted = $('footer').find('#clear-completed'),
            toggleAll = $('#main').find('#toggle-all');

        /**
         * Creates an instance of Todo.
         *
         * @constructor
         * @this {Todo}
         */
        function Todo () {
            this.id = -1;
            this.checked = false;
        }

        /**
         * Send message
         *
         * @this {Todo}
         * @param {string} text This is text each message(object)
         */
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
            mainFooter.show();
            todo.countItems();
            todo.checkDoneItem();
        };

        /**
         * Edit message
         *
         * @this {li}
         */
        Todo.prototype.editMessage = function () {
            var that = $(this);
            that.find('.edit').show();
            that.find('.view').hide();
            that.find('.destroy').hide();
            that.addClass('editing');
            todo.clearSelection();
        };

        /**
         * Finish edit message
         *
         * @this {li}
         * @param {event, edited value input, li element}
         */
        Todo.prototype.finishEditMessage = function (e, value, li) {
            var view = $(e.currentTarget).closest('li').find('.view'),
                edit = $(e.currentTarget).closest('.edit'),
                destroy = $(this).closest('li').find('.destroy');

                edit.hide();
                view.show();
                destroy.css('display', '');
                view.find('label').html(value);
                edit.attr('value', value);
                li.removeClass('editing');
        };


        /**
         * Remove message
         *
         * @this {icon's remove}
         * @param {event}
         */
        Todo.prototype.destroyMessage = function (e) {
            var dataId = $(e.currentTarget).closest('li').data('id');
            for(var i = 0; i < arrObjects.length; i++) {
                if(arrObjects[i].id == dataId )
                    arrObjects.splice(i, 1);
            }
            $(this).closest('li').remove();
            todo.countItems();
            todo.checkDoneItem();
            todo.ifHaveDoneItem();
        };

        /**
         * Count number exist message
         *
         */
        Todo.prototype.countItems = function () {
            var count = arrObjects.length,
                counter = $('.todo-count').find('b');
                counter.html(count);

                if(count == 0) {
                    mainFooter.hide();
                    toggleAll.prop('checked', false);
                }
        };

        /**
         * Check availability pin checkbox
         *
         * @param {event, li element}
         */
        Todo.prototype.checkForCheckBox = function (e, li) {
            var checked = $(e.currentTarget).is(':checked');
            for(var i = 0; i < arrObjects.length; i++){
                if(arrObjects[i].id == li.data('id')) {
                    arrObjects[i].checked = checked;
                }
            }
            $(e.currentTarget).closest('li').toggleClass('done');
            todo.ifOneCheckBoxNotChecked();
            todo.ifHaveDoneItem();
        };

        /**
         * Check for general checkbox
         *
         * @param {event}
         */
        Todo.prototype.checkForAllCheckBox = function (e) {
            var checked = $(e.currentTarget).is(':checked');
            if(checked) {
                for(var i = 0; i < arrObjects.length; i++){
                    arrObjects[i].checked = checked;
                };
                $('#todo-list').find('li').toggleClass('done').find('.toggle').prop("checked", checked);
            }
            todo.checkDoneItem();
            todo.ifHaveDoneItem();
        };

        /**
         * Don't resolution selection element
         *
         */
        Todo.prototype.clearSelection = function () {
            try {
                window.getSelection().removeAllRanges();
            } catch(e) {
                document.selection.empty();
            }
        };

        /**
         * How task achieved
         *
         */
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

        /**
         * if one checkbox don't pin, turn off general checkbox or turn on
         *
         */
        Todo.prototype.ifOneCheckBoxNotChecked = function () {
            for( var i = 0; i < arrObjects.length; i++ ) {
                if( !arrObjects[i].checked ) {
                    toggleAll.prop('checked', false);
                    return;
                } else if (arrObjects[i].checked){
                    toggleAll.prop('checked', true);
                }
            }
        };

        /**
         * Remove marked items
         *
         */
        Todo.prototype.ifHaveDoneItem = function () {
            for(var i = 0; i < arrObjects.length; i++) {
                if( arrObjects[i].checked ) {
                    clearCompleted.show();
                    return;
                } else {
                    clearCompleted.hide();
                }
            }
        };

        /**
         * Render number marked items for button's delete  marked
         *
         * @this {number} resultForClearBtn number marked checkbox
         */
        Todo.prototype.countDoneItem = function (resultForClearBtn) {
            clearCompleted.html('Clear ' + resultForClearBtn + ' completed item');
        };

        /**
         * Remove done message
         *
         *
         */
        Todo.prototype.removeDoneMessage = function () {
            for(var i = 0; i < arrObjects.length; i++) {
                if(arrObjects[i].checked) {
                    arrObjects.splice(i, 1);
                    i--;
                } else {
                    clearCompleted.hide();
                }
            }
            $('#todo-list').find('li.done').remove();
            if (!arrObjects.length) {
                mainFooter.hide();
                clearCompleted.hide();
                toggleAll.prop('checked', false);
            }
        };

        var todo = new Todo();

        /**
         * Here declared events
         *
         *
         */
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