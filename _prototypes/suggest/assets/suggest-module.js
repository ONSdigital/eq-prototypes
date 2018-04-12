function suggest() {
  let $scope = $('.js-suggest'),
    $inputEl = $scope.find('.js-suggest-input'),
    occupationComponent = TypeaheadComponent.create({
      scopeElement: $scope,
      inputElement: $inputEl
    }),
    occupationsService = SuggestService.create({ url: $inputEl.attr('data-suggest-url') });

  function keyUp_handler(e) {
    e.preventDefault();

    let val = $(this).val();

    if (TypeaheadComponent.isKeyPressClean(e)) {
      return;
    }

    /**
     * Cancel previous request if not yet returned
     */
    if (occupationsService.requestInFlight) {
      occupationsService.$request.abort();
    }

    occupationsService.query(val).done(typeaheadUpdate);
  }

  function typeaheadUpdate(data) {
    occupationComponent.update(((data || {})['matches'] || []).map(function(dataItem) {
      return {
        primaryText: dataItem
      };
    }));
  }

  occupationComponent.emitter.on('itemSelected', function(e, item) {
    $inputEl.val(item.primaryText);
  });

  $inputEl.on('keyup', keyUp_handler);
}

$(suggest);
