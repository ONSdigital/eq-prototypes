function TypeaheadComponent($scope, $inputEl) {
  let _this = this,
    emitter = $({}),
    $container = $scope.find('.pac-container'),

    showWhenEmpty = false,

    /**
     * If user has not typed anything new
     */
    isClean = true,

    keyDownMethods = {
      13: enterKey_handler,
      38: arrowUpKey_handler,
      40: arrowDownKey_handler
    },

    currentFocusedItemIndex = 0;

  /**
   * Initial rendered data
   */
  this.data = [];

  function render() {
    let data = _this.data;

    $container.html('');

    $(data).each(function(key, item) {
      let $item = $('<button class="pac-item">' +
        // '<span class="pac-item-query">' +
        '<span class="pac-matched">' + item.primaryText + '</span>' +
        // '</span>' +
        (item.secondaryText ? '<span>' + ' / ' + item.secondaryText + '</span>' : '') +
      '</button>');

      $item.on('click', function(e) {
        e.preventDefault();
      });

      $item.on('mousedown', itemMouseDown_handler.bind(_this, item));

      $container.append($item);
    });

    !data.length ? hide() : show();
  }

  function hide() {
    setTimeout(function() {
      if (!$container.hasClass('hide')) {
        $container.addClass('hide');
      }
    }, 0);
  }

  function show() {
    if (
      (showWhenEmpty && ($inputEl.val() === '') && $inputEl.is(':active') && _this.data.length) || !isClean) {
      $container.removeClass('hide');
    }
  }

  function switchFocusedItem(index) {
    let current = currentFocusedItemIndex,
      $currentEl = $container.find('.pac-item:nth-child(' + current + ')'),
      next = index,
      $nextEl = $container.find('.pac-item:nth-child(' + next + ')');

    $currentEl.removeClass('focused');
    $nextEl.addClass('focused');

    currentFocusedItemIndex = next;

    $container.scrollTop($container.scrollTop() + $nextEl.position().top);
  }

  function inputChanged() {
    isClean = true;
    hide();
  }

  /**
   * Event handlers
   */
  function enterKey_handler(e) {
    let data = _this.data[currentFocusedItemIndex - 1];

    if (!isClean && currentFocusedItemIndex === 0) {
      return;
    }

    inputChanged();
    emitter.trigger('itemSelected', [data]);
  }

  function arrowUpKey_handler(e) {
    e.preventDefault();

    if (currentFocusedItemIndex < 2) {
      return;
    }

    switchFocusedItem(currentFocusedItemIndex - 1);
  }

  function arrowDownKey_handler(e) {
    e.preventDefault();

    if (currentFocusedItemIndex === _this.data.length) {
      return;
    }

    switchFocusedItem(currentFocusedItemIndex + 1);
  }

  function itemMouseDown_handler(item, e) {
    e.preventDefault();

    inputChanged();
    emitter.trigger('itemSelected', [item]);
  }

  function resetSelection() {
    currentFocusedItemIndex = 0;
    $container.scrollTop(0);
  }

  /**
   * Subscribe to input field events
   */
  $inputEl.on('focus', show);
  $inputEl.on('blur', hide);
  $inputEl.on('keydown', function(e) {
    if (e.keyCode === 13) {
      e.preventDefault();
    }

    let keyDownMethod = keyDownMethods[e.keyCode];

    keyDownMethod && keyDownMethod(e);

    if (TypeaheadComponent.isKeyPressClean(e)) {
      return;
    }

    isClean = false;
  });

  this.showListWhenEmpty = function(val) {
    showWhenEmpty = !!val;
  };

  this.update = function(dataArr) {
    if (!dataArr || dataArr.length === undefined) {
      return;
    }

    this.data = dataArr || this.data;
    render();
    resetSelection();
  };

  /**
   * Event emitter
   * Events: ['itemSelected']
   */
  this.emitter = emitter;

  this.hide = hide;
  this.show = show;
}

TypeaheadComponent.cleanKeys = [37, 38, 39, 40, 13];
TypeaheadComponent.isKeyPressClean = function(e) {
  return !!this.cleanKeys.filter(function(item) { return item === e.keyCode }).length;
};

/**
 *
 * opts example
 * {
 *   scopeElement: <HTML element>,
 *   inputElement: <HTML element>,
 *   showWhenEmpty: <Boolean>
 * }
 */
TypeaheadComponent.create = function(opts) {
  let $scope = $(opts.scopeElement),
    $inputEl = $(opts.inputElement),
    showWhenEmpty = opts.showWhenEmpty,

    component = new TypeaheadComponent($scope, $inputEl);

  component.showListWhenEmpty(showWhenEmpty);

  return component;
};
