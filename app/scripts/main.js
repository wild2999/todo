(function ($) {
  var arrObjects = [],
    mainFooter = $('.main, footer'),
    mainBlock = $('.main'),
    footer = $('footer'),
    clearCompleted = footer.find('.clear-completed'),
    toggleAll = mainBlock.find('#toggle-all'),
    header = $('header'),
    list = $('.todo-list'),
    id = 0;


  /**
   * Creates an instance of Todo.
   *
   * @constructor
   * @this {Todo}
   */
  function Todo (id, checked) {
    this._id = id;
    this._checked = checked;
    TodoListItem.call(this, arguments);

    /**
     * Send message
     *
     * @this {Todo}
     * @param {string} text This is text each message(object)
     */
    this.sendMessage = function (text) {
      this._text = text;
      var objectTodo = $.extend({}, todo),
        $source = $("#entry-template").html(),
        template = Handlebars.compile($source),
        context = {id: this._id, text: this._text },
        html = template(context),
        $ul = $('.todo-list');
        arrObjects.push(objectTodo);

      $ul.append(html);
      mainFooter.show();
      todo.countItems();
      todo.checkDoneItem();
    };

    /**
     * Remove done message
     *
     *
     */
    this.removeDoneMessage = function () {
      for(var i = 0; i < arrObjects.length; i++) {
        if(arrObjects[i]._checked) {
          arrObjects.splice(i, 1);
          i--;
        } else {
          clearCompleted.hide();
        }
      }
      setTimeout(function () {
        $('.todo-list').find('li.done').remove();
      }, 1000);
      $('.todo-list').find('li.done').css({
        'opacity': '0',
        'transition' : 'all 1s ease-in-out'
      });
      if (!arrObjects.length) {
        setTimeout(function () {
          mainFooter.hide();
          clearCompleted.hide();
        }, 1000);
        toggleAll.prop('checked', false);
      }
    };

    /**
     * Count number exist message
     *
     */
    this.countItems = function () {
      var count = arrObjects.length,
        counter = $('.todo-count').find('b');
        counter.html(count);

      if(count == 0) {
        mainFooter.hide();
        toggleAll.prop('checked', false);
      }
    };

    /**
     * How task achieved
     *
     */
    this.checkDoneItem = function () {
      var trueCheck = 0,
        result,
        resultForClearBtn = 0,
        counter = $('.todo-count').find('b');

      for(var i = 0; i < arrObjects.length; i++) {
        if(arrObjects[i]._checked == false) {
          trueCheck += 1;
        }
        result = trueCheck;
        resultForClearBtn = arrObjects.length - trueCheck;
      }
      todo.countDoneItem(resultForClearBtn);

      counter.html(result);
    };

    /**
     * Render number marked items for button's delete  marked
     *
     * @this {number} resultForClearBtn number marked checkbox
     */
    this.countDoneItem = function (resultForClearBtn) {
      clearCompleted.html('Clear ' + resultForClearBtn + ' completed item');
    };

    function eventKeyEnter(e) {
      if(e.keyCode == 13) {
        var $inputTexts = header.find('input').val();
        if (!$inputTexts) {
          return;
        }
        $(this).val('');
        todo.sendMessage($inputTexts);
        footer.on('click', '.clear-completed', todo.removeDoneMessage);
      }
    };

    function eventKeyEnterAndEsc(e) {
      if( e.keyCode == 13 ){
        var value = $(e.currentTarget).val(),
          li = $(e.currentTarget).closest('li');
        for(var i = 0, max = arrObjects.length; i < max; i++){
          if(arrObjects[i]._id == li.data('id')) {
            arrObjects[i]._text = value;
          }
        };
        todoListItem.finishEditMessage(e, value, li);
      } else if (e.keyCode == 27) {
        var value,
          li = $(e.currentTarget).closest('li');
        for(var i = 0, max = arrObjects.length; i < max; i++){
          if(arrObjects[i]._id == li.data('id')) {
            value = arrObjects[i]._text;
          }
        };
        todoListItem.finishEditMessage(e, value, li);
      }
    };

    header.on('keydown', 'input', eventKeyEnter);
    list.on('keydown', 'input', eventKeyEnterAndEsc);

  }

  /**
   * Create an instance of TodoListItem.
   *
   * @constructor
   * @this {TodoListItem}
   */
  function TodoListItem () {

    /**
     * Edit message
     *
     * @this {li}
     */
    this.editMessage = function () {
      var $this = $(this);
      $this.find('.edit').show();
      $this.find('.view').hide();
      $this.find('.destroy').hide();
      $this.addClass('editing');
      todoListItem.clearSelection();
    };


    /**
     * Remove message
     *
     * @this {icon's remove}
     * @param {event}
     */
    this.destroyMessage = function (e) {
      var dataId = $(e.currentTarget).closest('li').data('id');
      for(var i = 0; i < arrObjects.length; i++) {
        if(arrObjects[i]._id == dataId )
          arrObjects.splice(i, 1);
      }
      setTimeout(function () {
        $(e.currentTarget).closest('li').remove();
      }, 1000);
      $(this).closest('li').css({
        'opacity': '0',
        'transition' : 'all 1s ease-in-out'
      });
      todo.countItems();
      todo.checkDoneItem();
      todoListItem.ifHaveDoneItem();
    };

    /**
     * Finish edit message
     *
     * @this {li}
     * @param {event, edited value input, li element}
     */
    this.finishEditMessage = function (e, value, li) {
      var $view = $(e.currentTarget).closest('li').find('.view'),
        $edit = $(e.currentTarget).closest('.edit'),
        $destroy = $(this).closest('li').find('.destroy');

      $edit.hide();
      $view.show();
      $destroy.css('display', '');
      $view.find('label').html(value);
      $edit.attr('value', value);
      li.removeClass('editing');
    };

    /**
     * Check availability pin checkbox
     *
     * @param {event, li element}
     */
    this.checkForCheckBox = function (e, li) {
      var checked = $(e.currentTarget).is(':checked');
      for(var i = 0; i < arrObjects.length; i++){
        if(arrObjects[i]._id == li.data('id')) {
          arrObjects[i]._checked = checked;
        }
      }
      $(e.currentTarget).closest('li').toggleClass('done');
      todoListItem.ifOneCheckBoxNotChecked();
      todoListItem.ifHaveDoneItem();
    };

    /**
     * Check for general checkbox
     *
     * @param {event}
     */
    this.checkForAllCheckBox = function (e) {
      var checked = $(e.currentTarget).is(':checked');
      if(checked) {
        for(var i = 0; i < arrObjects.length; i++){
          arrObjects[i]._checked = true;
        };
        $('.todo-list').find('li').addClass('done').find('.toggle').prop("checked", true);
      } else {
        for(var i = 0; i < arrObjects.length; i++){
          arrObjects[i]._checked = false;
        };
        $('.todo-list').find('li').removeClass('done').find('.toggle').prop("checked", false);
      }
      todoListItem.ifHaveDoneItem();
      todo.checkDoneItem();
    };

    /**
     * Don't resolution selection element
     *
     */
    this.clearSelection = function () {
      try {
        window.getSelection().removeAllRanges();
      } catch(e) {
        document.selection.empty();
      }
    };

    /**
     * if one checkbox don't pin, turn off general checkbox or turn on
     *
     */
    this.ifOneCheckBoxNotChecked = function () {
      for( var i = 0; i < arrObjects.length; i++ ) {
        if( !arrObjects[i]._checked ) {
          toggleAll.prop('checked', false);
          return;
        } else if (arrObjects[i]._checked){
          toggleAll.prop('checked', true);
        }
      }
    };

    /**
     * Remove marked items
     *
     */
    this.ifHaveDoneItem = function () {
      for(var i = 0; i < arrObjects.length; i++) {
        if( arrObjects[i]._checked ) {
          clearCompleted.show();
          return;
        } else {
          clearCompleted.hide();
        }
      }
    };

    var eventCheckBox = function (e) {
      var li = $(this).closest('li');
      todoListItem.checkForCheckBox(e, li);
      todo.checkDoneItem();
    };

    list.on('click', '.toggle', eventCheckBox);
  }

  /**
   * Declared instance class
   *
   */
  var todoListItem = new TodoListItem();
  var todo = new Todo(id++, false);


  /**
   * Declared events
   *
   */
  list.on('dblclick', 'li', todoListItem.editMessage);
  list.on('dblclick', '.toggle', function () {return false;});
  list.on('click', '.destroy', todoListItem.destroyMessage);
  mainBlock.on('click', '#toggle-all', todoListItem.checkForAllCheckBox);

}(jQuery));
