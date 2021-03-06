function suggest() {
  let $scope = $('.js-suggest'),
    $inputEl = $scope.find('.js-suggest-input'),
    typeaheadComponent = TypeaheadComponent.create({
      scopeElement: $scope,
      inputElement: $inputEl
    }),

    serviceRoot = (window.location.hostname === 'localhost')
      ? 'http://localhost:5000/api/'
      : '//davec.dev.eq.ons.digital/api/',

    service = SuggestService.create({url: serviceRoot + $inputEl.attr('data-suggest-url')});

  function keyUp_handler(e) {
    e.preventDefault();

    let val = $(this).val();

    if (TypeaheadComponent.isKeyPressClean(e) || val.length < 3) {
      return;
    }

    /**
     * Cancel previous request if not yet returned
     */
    if (service.requestInFlight) {
      service.$request.abort();
    }

    service.query(val).done(typeaheadUpdate);
  }

  function keyDown_handler(e) {
    let $input = $(this);

    setTimeout(function() {
      if ($input.val() === '') {
        console.log(2);
        typeaheadComponent.update([]);
      }
    }, 0);
  }

  function typeaheadUpdate(data) {
    typeaheadComponent.update(((data || {})['matches'] || []).map(function(dataItem) {
      return {
        primaryText: dataItem
      };
    }));
  }

  typeaheadComponent.emitter.on('itemSelected', function(e, item) {
    typeaheadComponent.$inputElClone.val(item.primaryText);

    if (service.requestInFlight) {
      service.$request.abort();
    }
  });

  typeaheadComponent.$inputElClone.on('keydown', keyDown_handler);
  typeaheadComponent.$inputElClone.on('keyup', keyUp_handler);
}

$(suggest);
