$(document).ready(function() {
    var $typeaheadInputEl = $('.js-typeahead-input'),
      countriesList = [],
	  countryPriority = ['GB', 'IE'];

    var typeaheadComponent = TypeaheadComponent.create({
        scopeElement: $('.js-typeahead-component')[0],
        inputElement: $typeaheadInputEl[0],
		showWhenEmpty: true
    });

    function convertCountryToTypeahead (country) {
      return {

        /**
         * Not sure why item is an array - could change this?
         */
        primaryText: country.item[0].name,
        secondaryText: country.item[0]["citizen-names"],
        data: country
      };
    }

    function sortCountriesByPrimaryTextComparator (a, b) {
		var nameA = a.primaryText.toUpperCase(),
			nameB = b.primaryText.toUpperCase();

		if (nameA < nameB) {
			return -1;
		}
		if (nameA > nameB) {
			return 1;
		}
		return 0;
	}

	function sortCountriesByPriority (item) {
		var index = countryPriority.indexOf(item.data.key);

		if (countryPriority[index]) {
			return -(index+1);
		}

		return false;
	}

	function transformSortCountries (countryList) {

		return _.sortBy(
			countryList.map(convertCountryToTypeahead)
				.sort(sortCountriesByPrimaryTextComparator),
			sortCountriesByPriority);
	}

    function init() {
      $.getJSON("../data/records.json")
        .done(function (countryData) {

          /**
           * Declare all variable used in a function up front.
           * If not these will get attached as global object properties.
           */
          var country,

            /**
             * All countries appear to be stored in the first object of the array - could change this?
             */
            countries = countryData.Countries[0];

          for (country in countries) {
            countriesList.push(countries[country]);
          }

          /**
           * After arranging the countries into an array, we need to map the data to an array with properties
           * that are compatible with the Typeahead's update interface.
           */
          typeaheadComponent.update(
		  	transformSortCountries(countriesList)
          );
      });
    }

	typeaheadComponent.emitter.on('itemSelected', function (e, item) {
		console.log('Item selected: ', item);

		// remove any white space from the selected item
		var primaryTextNoSpaces = item.primaryText.split(' ').join('-'),
			id = 'passport-types-playback-answer-' + primaryTextNoSpaces,
			$playbackContainer = $("#playback-container"),

			$templateEl = $('<div class="playback_item">' +
				'<div class="playback__answer-text u-dib"' +
				'id="' + id + '"' +
				'data-qa="' + id + '">' +
				'<ul class="u-pl-no u-mb-xs list--bare">' +
				'<li id="playback-value" class="playback-list-value">' + item.primaryText + '</li>' +
				'</ul>' +
				'</div>' +
				'</div>'),

			$removeButtonWrapper = $('<div class="playback__remove u-fr"></div>'),

			$removeButton = $('<a href="#"' +
				'class="js--playback__remove-link"' +
				'aria-describedby="' + id + '"' +
				'data-qa="passport-types-playback-answer-remove"' +
				'data-ga-action="Remove click"' +
				'data-ga-category="Playback"' +
				'data-ga="click">Remove <span class="u-vh">your answer</span></a>');

		$removeButton.on('click', removePlaybackItem_handler);

		/**
		 * Bind it all up
		 */
		$templateEl.append($removeButtonWrapper.append($removeButton));

		$playbackContainer.html($($templateEl));

		checkSetupPlayback();
	});

    $typeaheadInputEl.on('keydown', function (e) {

      if (TypeaheadComponent.isKeyPressClean(e)) {
        return;
      }

      setTimeout(function () {
        typeaheadComponent.update(
		  transformSortCountries(
		  	countriesList.filter(function (country) {

			  /**
			   * Return items that match the input element value.
			   */
			  var val = $typeaheadInputEl.val().toLowerCase(),
			    countryName = country.item[0].name.toLowerCase(),
				citizenName = country.item[0]['citizen-names'].toLowerCase();

				return countryName.match(val) || citizenName.match(val);
		    }
          ))
        );
      }, 0);
    });

    init();
});

// Check URL for parameters and dynamically change content
// (for version2 of prototype to display eg. 'UK aleady selected')
$(document).ready(function () {
	if (window.location.href.indexOf("?passport-type-opener-answer=United+Kingdom&passport-type-opener-answer=Ireland") > -1) {
		$("#uk-ireland-selected").show();
	}
	else if (window.location.href.indexOf("Ireland") > -1) {
		$("#ireland-selected").show();
	} else if (window.location.href.indexOf("United+Kingdom") > -1) {
		$("#uk-selected").show();
	}
	else {
		$('#nothing-selected').show();
	}
});

function checkSetupPlayback () {
	var shouldShow = $("#playback-container").children().length;

	$("#playback-heading").css({
		"display": shouldShow ? "block" : "none"
	});

	$(".js-address-start-again-trigger").css({
		"display": shouldShow ? "inline-block" : "none"
	});
}

// Removing playback items
function removePlaybackItem_handler (e) {
	e.preventDefault();

	$(this).closest('.playback_item').remove();
	// remove playback heading if no playback_item listed
	checkSetupPlayback();
}

// Remove all selected values
function removeAllPlayback (){
	$("#playback-container").children().remove();
	//console.clear()
	// remove playback heading
	checkSetupPlayback();
}
