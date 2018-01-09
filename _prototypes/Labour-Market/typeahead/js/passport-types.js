function passportTypes (config) {
	var $typeaheadInputEl = $('.js-typeahead-input'),
		countriesList = [],
		countryPriority = ['GB', 'IE'],

		countriesSelected = config.countriesSelected || [];

	var typeaheadComponent = TypeaheadComponent.create({
		scopeElement: $('.js-typeahead-component')[0],
		inputElement: $typeaheadInputEl[0],
		showWhenEmpty: true
	});

	function convertCountryToTypeahead(country) {
		return {

			/**
			 * Not sure why item is an array - could change this?
			 */
			primaryText: country,
			secondaryText: country,
			data: country
		};
	}

	function sortCountriesByPrimaryTextComparator(a, b) {
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

	function sortCountriesByPriority(item) {
		var index = countryPriority.indexOf(item);

		if (countryPriority[index]) {
			return -(index + 1);
		}

		return false;
	}

	function transformSortCountries(countryList) {

		return _.sortBy(
			countryList.map(convertCountryToTypeahead)
				.sort(sortCountriesByPrimaryTextComparator),
			sortCountriesByPriority);
	}

	function checkSetupPlayback() {
		var itemsExist = $("#playback-container").children().length;

		$("#playback-heading").css({
			"display": itemsExist ? "block" : "none"
		});

		$(".js-address-start-again-trigger").css({
			"display": itemsExist ? "inline-block" : "none"
		});

		if (!itemsExist) {

			/**
			 * Reset selection
			 */
			typeaheadComponent.update(
				transformSortCountries(countriesList)
			);
		}
	}

	// Removing playback items
	function removePlaybackItem_handler(countryKey, e) {
		e.preventDefault();

		/**
		 * Remove from selected list
		 */
		var selectedIndex = countriesSelected.indexOf(countryKey);

		countriesSelected.splice(selectedIndex, 1);

		$(this).closest('.playback_item').remove();

		checkSetupPlayback();
		updateTypeaheadComponentData();
	}

	// Remove all selected values
	function removeAllPlayback(e) {
		e.preventDefault();
		typeaheadComponent.show();
		$("#playback-container").children().remove();
		$(".job-title-confirm").hide();
		checkSetupPlayback();
	}

	function updateTypeaheadComponentData () {
		typeaheadComponent.update(
			transformSortCountries(
				countriesList.filter(function (countryItem) {

					/**
					 * If item is already selected remove from list
					 */
					return !countriesSelected[countriesSelected.indexOf(countryItem)];
				})
			)
		);
	}

	function createPlaybackItem (dataItem) {

		// remove any white space from the selected item
		var name = dataItem,
			primaryTextNoSpaces = name.split(' ').join('-'),
			id = 'passport-types-playback-answer-' + primaryTextNoSpaces,

			$templateEl = $('<div class="playback_item">' +
				'<div class="playback__answer-text u-dib"' +
				'id="' + id + '"' +
				'data-qa="' + id + '">' +
				'<ul class="u-pl-no u-mb-xs list--bare">' +
				'<li id="playback-value" class="playback-list-value">' + name + '</li>' +
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

		$removeButton.on('click', removePlaybackItem_handler.bind($removeButton, dataItem.key));

		/**
		 * Bind it all up
		 */
		$templateEl.append($removeButtonWrapper.append($removeButton));

		return $templateEl;
	}

	function addPlaybackItem ($item) {
		var $playbackContainer = $("#playback-container");
		$playbackContainer.empty().append($item);
	}

	function initPlaybackList () {
		$.each(countriesSelected, function (key, val) {

			var dataItem = countriesList.filter(function (country) {
				return country === val;
			})[0];

			if (dataItem) {
				addPlaybackItem(createPlaybackItem(dataItem));
				checkSetupPlayback();
			}
		});
	}

	function init() {
		$.getJSON("../typeahead/data/occupations.json")
			.done(function (countryData) {

				/**
				 * Declare all variable used in a function up front.
				 * If not these will get attached as global object properties.
				 */
				// var country,

					/**
					 * All countries appear to be stored in the first object of the array - could change this?
					 */
					// countries = countryData.Countries[0];

				// for (country in countries) {
				// 	if (countries.hasOwnProperty(country)) {
				// 		countriesList.push(countries[country]);
				// 	}
				// }

				countriesList = countryData;

				updateTypeaheadComponentData();
				initPlaybackList();
			});
	}

	typeaheadComponent.emitter.on('itemSelected', function (e, item) {
		console.log('Item selected: ', item);

		var countryKey = item.data.key;

		/**
		 * Add selected country if it's not in the list
		 */
		if (!countriesSelected[countriesSelected.indexOf(countryKey)]) {
			countriesSelected.push(countryKey);
		}

		addPlaybackItem(createPlaybackItem(item.data));
		checkSetupPlayback();
		updateTypeaheadComponentData();

		/**
		 * Clear typeahead value
		 */
		$typeaheadInputEl.val('');

		$('.replace-job-title').text(item.primaryText);
		$('.job-title-confirm').show();
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
								countryName = country.toLowerCase(),
								citizenName = country.toLowerCase();

							return countryName.match(val) || citizenName.match(val);
						}
					))
			);
		}, 0);
	});

	$('.js-address-start-again-trigger').on('click', removeAllPlayback);

	init();
}
