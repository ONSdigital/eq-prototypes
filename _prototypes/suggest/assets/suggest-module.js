function suggest() {
  let $scope = $('.js-suggest'),
    $inputEl = $scope.find('.js-suggest-input'),
    typeaheadComponent = TypeaheadComponent.create({
      scopeElement: $scope,
      inputElement: $inputEl
    }),

    serviceRoot = (window.location.hostname === 'localhost')
      ? 'http://localhost:5000/api/'
      : 'http://ec2-34-243-26-71.eu-west-1.compute.amazonaws.com/api/',

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

  typeaheadComponent.$inputElClone.on('keyup', keyUp_handler);
}

$(suggest);
