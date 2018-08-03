function TypeaheadComponent($scope, $inputEl) {
  let _this = this,
    emitter = $({}),
    $container = $scope.find('.pac-container'),
    $voiceoverAlert = $scope.find('.js-voiceover-polite-alert'),
    $hintElSpacer,
    $hintElRemainingText,

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
  this.$inputElClone = $inputEl.clone(true);
  this.hintElClass = 'js-hint-spacer';
  this.hintElRemainingTextClass = 'js-hint-remaining-text';

  function setup() {
    let $nodeEl = $('<div class="field__input-typeahead js-suggest-input-container"></div>'),
      $hintEl = $('<span class="field__input-hint"></span>');

    $hintElSpacer = $('<span class="field__input-hint-spacer ' + _this.hintElClass + '"></span>');
    $hintElRemainingText = $('<span class="field__input-hint-secondary ' + _this.hintElRemainingTextClass + '"></span>');
    $inputEl.replaceWith($nodeEl);
    $nodeEl.append($hintEl.append($hintElSpacer).append($hintElRemainingText));
    $nodeEl.append(_this.$inputElClone);

    $hintElSpacer = $nodeEl.find('.' + _this.hintElClass);
    $hintElRemainingText = $nodeEl.find('.' + _this.hintElRemainingTextClass);
  }

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
        _this.optionsAreHidden = true;
      }
    }, 0);
  }

  function show() {
    if ((showWhenEmpty && (_this.$inputElClone.val() === '') && _this.$inputElClone.is(':active') && _this.data.length) || !isClean) {
      $container.removeClass('hide');
      _this.optionsAreHidden = false;
    }
  }

  function switchFocusedItem(index) {
    /**
     * Don't navigate list if options are hidden
     */
    if (_this.optionsAreHidden) {
      return;
    }

    let current = currentFocusedItemIndex,
      $currentEl = $container.find('.pac-item:nth-child(' + current + ')'),
      next = index,
      $nextEl = $container.find('.pac-item:nth-child(' + next + ')');

    $currentEl.removeClass('focused');
    $nextEl.addClass('focused');

    $voiceoverAlert.html(_this.data[next - 1].primaryText + ' focused');
    $voiceoverAlert.attr('aria-live', 'polite');

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
    voiceOverSelected(data);
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

  function dirtyKeyDown_handler(e) {
    setTimeout(function() {
      typeaheadHint();
    }, 0);
  }

  function itemMouseDown_handler(item, e) {
    e.preventDefault();

    inputChanged();
    voiceOverSelected(item);
    emitter.trigger('itemSelected', [item]);
  }

  function typeaheadHint() {
    const inputText = _this.$inputElClone.val(),
      inputTextLen = inputText.length;

    if (!_this.data.length || !_this.data[0] || !inputTextLen) {
      clearTypeaheadHint();
      return;
    }

    const match = _this.data.find(function (item) {
      let itemText = item.primaryText;
      return itemText && itemText.substr(0, inputTextLen) === inputText;
    });

    match ? showTypeahead(inputText, match.primaryText.substr(inputTextLen)) : clearTypeaheadHint();
  }

  function showTypeahead(spacer, hint) {
    $hintElSpacer.html(spacer);
    $hintElRemainingText.html(hint);
  }

  function clearTypeaheadHint() {
    $hintElSpacer.html('');
    $hintElRemainingText.html('');
  }

  function voiceOverSelected(dataItem) {
    console.log(dataItem, $voiceoverAlert);

    $voiceoverAlert.html(dataItem.primaryText + ' option chosen');
    $voiceoverAlert.attr('aria-live', 'assertive');

    console.log(dataItem, $voiceoverAlert);
  }

  emitter.on('itemSelected', clearTypeaheadHint);

  function resetSelection() {
    currentFocusedItemIndex = 0;
    $container.scrollTop(0);
  }

  /**
   * Subscribe to input field events
   */
  this.$inputElClone.on('focus', show);
  this.$inputElClone.on('blur', hide);
  this.$inputElClone.on('keydown', function(e) {
    if (e.keyCode === 13) {
      e.preventDefault();
    }
    let keyDownMethod = keyDownMethods[e.keyCode];

    keyDownMethod && keyDownMethod(e);

    if (TypeaheadComponent.isKeyPressClean(e)) {
      return;
    }

    dirtyKeyDown_handler(e);

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
    typeaheadHint();
  };

  /**
   * Event emitter
   * Events: ['itemSelected']
   */
  this.emitter = emitter;

  this.hide = hide;
  this.show = show;

  setup();
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

export default TypeaheadComponent;
