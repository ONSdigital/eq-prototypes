import TypeaheadComponent from './Typeahead';
import SuggestService from './SuggestService';

export default function suggest() {
  let $scope = $('.js-suggest'),
    $inputEl = $scope.find('.js-suggest-input'),
    typeaheadComponent = TypeaheadComponent.create({
      scopeElement: $scope,
      inputElement: $inputEl,
      listId: $inputEl.attr('data-list-id'),
      listLabelledBy: $inputEl.attr('data-list-labelled-by-ref')
    }),

    serviceRoot = 'https://jonshaw-lookup-api.dev.eq.ons.digital/',

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

    //service.query(val).done(typeaheadUpdate);

    service.query(val).fail(function () {
      typeaheadComponent.update(mockData())
    });
  }

  function keyDown_handler(e) {
    let $input = $(this);

    setTimeout(function() {
      if ($input.val() === '') {
        typeaheadComponent.update([]);
      }
    }, 0);
  }

  function typeaheadUpdate(data) {
    typeaheadComponent.update(((data || {})[$inputEl.attr('data-suggest-type')] || []).map(function(dataItem) {
      return {
        primaryText: cleanFormattingFromService(dataItem),
        formattedText: dataItem
      };
    }));
  }

  /**
   * Temporary utility until service fixed
   */
  function cleanFormattingFromService(val) {
    return val.replace(/<em>|<\/em>/gi, '');
  }

  typeaheadComponent.emitter.on('itemSelected', function(e, item) {
    typeaheadComponent.$inputElClone.val(item.primaryText);

    if (service.requestInFlight) {
      service.$request.abort();
    }
  });

  typeaheadComponent.$inputElClone.on('keydown', keyDown_handler);
  typeaheadComponent.$inputElClone.on('keyup', keyUp_handler);

  document.documentElement.setAttribute('data-useragent', navigator.userAgent);
}

function mockData() {
  return [
    {
      primaryText: 'line 1 formatted',
      formattedText: 'line 1 <em>Formatted</em>'
    },
    {
      primaryText: 'line 2 formatted',
      formattedText: 'line 2 <em>Formatted</em>'
    },
    {
      primaryText: 'line 3 formatted',
      formattedText: 'line 3 <em>Formatted</em>'
    },
    {
      primaryText: 'line 4 formatted',
      formattedText: 'line 4 <em>Formatted</em>'
    },
    {
      primaryText: 'line 5 formatted',
      formattedText: 'line 5 <em>Formatted</em>'
    },
    {
      primaryText: 'line 6 formatted',
      formattedText: 'line 6 <em>Formatted</em>'
    },
    {
      primaryText: 'line 7 formatted',
      formattedText: 'line 7 <em>Formatted</em>'
    },
    {
      primaryText: 'line 8 formatted',
      formattedText: 'line 8 <em>Formatted</em>'
    }
  ];
}

$(suggest);
