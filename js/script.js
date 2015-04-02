(function ($) {

    $(document).ready( function () {
        var ArrObj= [],
            counter = $('.todo-count').find('b'),
            todo = {
                message: {
                    id: -1,
                    checked: false
                },
                functions : {
                    SendMessageForEnterEvent : function (e) {
                        var text = $('header').find('input').val();
                        if (e.keyCode == 13) {
                            if (!text) {
                                return;
                            }
                            var value = todo.message.text = text,
                                id = todo.message.id += 1;
                                var obj = $.extend(obj, todo.message);
                                ArrObj.push(obj);
                            console.log(ArrObj, obj);
                            var li = $('<li data-id= ' + id + '> <div class="view"> <input class="toggle" type="checkbox"> <label>'
                                + value + '</label> </div> <input class="edit" type="text" value='
                                + value + '> <a class="destroy" href="#"></a> </li>'),
                                ul = $('#todo-list');
                                ul.append(li);
                                $(this).val('');
                                $('#main').show();
                                $('footer').show();
                                todo.functions.countItems();
                                todo.functions.countItemsLeft();
                        }
                    },
                    checkDoneItem: function () {
                        var inputsArr = $('#todo-list').find('.toggle'),
                            trueCheck = 0,
                            result,
                            resultForClearBtn = 0;
                        for(var i = 0; i < inputsArr.length; i++) {
                            if($(inputsArr[i]).is(":checked")) {
                                trueCheck += 1;
                            } else if (!$(inputsArr[i]).is(":checked") && $(inputsArr[i]).is(":checked")) {
                                $('footer').find('#clear-completed').hide();
                            }
                            result = inputsArr.length - trueCheck;
                            resultForClearBtn = trueCheck;
                        }
                        todo.functions.unRenderDoneMessage(resultForClearBtn);

                        if ( $('#toggle-all').is(":checked") ) {
                            result = inputsArr.length - inputsArr.length;
                        }

                        counter.html(result);
                    },
                    checkForCheckBox: function () {
                        if ($(this).is(':checked')) {

                            $(this).closest('li').addClass('done');
                            $('footer').find('#clear-completed').show();
                        } else {
                            $(this).closest('li').removeClass('done');
                        }

                        todo.functions.ifOneCheckBoxNotChecked(this);
                        todo.functions.countItemsLeft();
                    },
                    checkForAllCheckBox: function () {
                        if($(this).is(':checked')) {
                            $('#todo-list').find('li').addClass('done').find('.toggle').prop("checked", true);
                            $('footer').find('#clear-completed').show();

                        } else {
                            $('#todo-list').find('li').removeClass('done').find('.toggle').prop("checked", false);
                            $('footer').find('#clear-completed').hide();
                        }
                        todo.functions.countItemsLeft();
                    },
                    clearSelection: function () {
                        try {
                            window.getSelection().removeAllRanges();
                        } catch(e) {
                            document.selection.empty();
                        }
                    },
                    countItems: function() {
                        var liLength = ArrObj.length;
                        counter.html(liLength);
                    },
                    countItemsLeft: function () {
                        var liLength = ArrObj.length;
                        counter.html( liLength );
                        if(liLength == 0) {
                            $('#main, footer').hide();
                            $('#main').find('#toggle-all').prop('checked', false);
                        }
                        todo.functions.checkDoneItem();
                    },
                    destroyMessage: function() {
                        for(var i = 0; i < ArrObj.length; i++) {
                            if(ArrObj[i].id == $(this).closest('li').data('id') )
                                ArrObj.splice(i, 1);
                        }
                        $(this).closest('li').remove();
                        todo.functions.countItemsLeft();
                        var liLength = $('li.done').length;
                        if(liLength == 0) {
                            $('footer').find('#clear-completed').hide();
                        }
                    },
                    editMessage: function () {
                        $(this).find('.edit').show();
                        $(this).find('.view').hide();
                        $(this).find('.destroy').hide();
                        $(this).addClass('editing');
                        todo.functions.clearSelection();
                    },
                    finishEditMessage: function(e){
                        if( e.keyCode == 13 || e.keyCode == 27){
                            var value = $(this).val(),
                                li = $(this).closest('li'),
                                view = $(this).closest('li').find('.view'),
                                edit = $(this).closest('.edit');
                            edit.hide();
                            view.show();
                            $(this).closest('li').find('.destroy').css('display', '');
                            view.find('label').html(value);
                            edit.attr('value', value);
                            li.removeClass('editing');
                        }
                    },
                    hideUnRenderdoneMessage: function (){
                        if($('#todo-list').find('li.done'))
                            $('footer').find('#clear-completed').hide();
                    },
                    ifOneCheckBoxNotChecked: function(thisCheckbox){
                        if( $(thisCheckbox).is(':checked') === false ) {
                            $('#main').find('#toggle-all').prop('checked', false);
                        }
                    },
                    removeDoneMessage: function (){
                        $('#todo-list').find('li.done').remove();
                        todo.functions.hideUnRenderdoneMessage();
                        var liLength = $('li').length;
                        if(liLength == 0) {
                            $('#main, footer').hide();
                            $('#main').find('#toggle-all').prop('checked', false);
                        }
                    },
                    unRenderDoneMessage: function (resultForClearBtn){
                        $('footer').find('#clear-completed').html('Clear ' + resultForClearBtn + ' completed item');
                    }
                }
            };

        $('header').on('keydown', 'input', todo.functions.SendMessageForEnterEvent);
        $('#todo-list').on('keydown', 'input', todo.functions.finishEditMessage);
        $('#todo-list').on('dblclick', 'li', todo.functions.editMessage);
        $('#todo-list').on('dblclick', '.toggle', function () {return false;});
        $('#todo-list').on('click', '.destroy', todo.functions.destroyMessage);
        $('#todo-list').on('click', '.toggle', todo.functions.checkForCheckBox);
        $('#main').on('click', '#toggle-all', todo.functions.checkForAllCheckBox);
        $('footer').on('click', '#clear-completed', todo.functions.removeDoneMessage);


    });
}(jQuery));
