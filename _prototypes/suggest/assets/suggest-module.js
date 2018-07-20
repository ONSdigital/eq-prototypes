function suggest() {
  let $scope = $('.js-suggest'),
  $inputEl = $scope.find('.js-suggest-input'),
  typeaheadComponent = TypeaheadComponent.create({
  	  scopeElement: $scope,
	  inputElement: $inputEl
	  }),

	serviceRoot = (window.location.hostname === 'localhost')
	  ? 'http://localhost:5000/'
	  : 'https://jonshaw-lookup-api.dev.eq.ons.digital/',

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
    typeaheadComponent.update(((data || {})[$inputEl.attr('data-suggest-type')] || []).map(function(dataItem) {
      return {
        primaryText: dataItem
      };
    }));
  }

  typeaheadComponent.emitter.on('itemSelected', function(e, item) {
    typeaheadComponent.$inputElClone.val(item.primaryText.replace('<em>', '').replace('</em>', ''));

    if (service.requestInFlight) {
      service.$request.abort();
    }
  });

  typeaheadComponent.$inputElClone.on('keydown', keyDown_handler);
  typeaheadComponent.$inputElClone.on('keyup', _.debounce(keyUp_handler, 300));
}

$(suggest);
