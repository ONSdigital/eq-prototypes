$(document).ready(function() {
    var $typeaheadInputEl = $('.js-typeahead-input'),
      countriesList = [];

    var typeaheadComponent = TypeaheadComponent.create({
        scopeElement: $('.js-typeahead-component')[0],
        inputElement: $typeaheadInputEl[0]
    });

    typeaheadComponent.emitter.on('itemSelected', function (e, item) {
        console.log('Item selected: ', item);

        // remove any white space from the selected item
        var primaryTextNoSpaces = item.primaryText.split(' ').join('-');
        // add playback item when selection is made, with selected.item as part of unique ID
        var oClone = document.getElementById("playback__item").cloneNode(true);
        oClone.id += ('-' + primaryTextNoSpaces);
        document.getElementById("playback-container").appendChild(oClone);
        // selected.item to appear in playback item playback-list-value
        var playbackListValue = document.getElementsByClassName("playback-list-value");
        $(playbackListValue).append(item.primaryText); 
 
        // add playback heading and remove all button if this is the first playback_item
        addRemovePlaybackHeading();
        removeAllButton();

        // selected.item to appear in playback item playback-list-value
        //$('.playback-list-value').append(item.primaryText);
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
            countriesList.map(convertCountryToTypeahead)
          );
      });
    }

    $typeaheadInputEl.on('keydown', function (e) {

      if (TypeaheadComponent.isKeyPressClean(e)) {
        return;
      }

      setTimeout(function () {
        typeaheadComponent.update(
          countriesList.filter(function (country) {

            /**
             * Return items that match the input element value.
             */
            var val = $typeaheadInputEl.val().toLowerCase(),
				countryName = country.item[0].name.toLowerCase(),
				citizenName = country.item[0]['citizen-names'].toLowerCase();

            return countryName.match(val) || citizenName.match(val);
          })
          .map(function (country) {
            return convertCountryToTypeahead(country);
          })
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

// remove all button
	function removeAllButton () {
		var $playbackItem = $('*[id^="playback__item-"]');
    	if (jQuery.contains(document, $playbackItem[0])) {
			$(".js-address-start-again-trigger").css({"display":"inline-block"});
		} else {
			$(".js-address-start-again-trigger").css({"display":"none"});
		}
	};

// add/remove playback heading
	function addRemovePlaybackHeading () {
		var $playbackItem = $('*[id^="playback__item-"]');
    	if (jQuery.contains(document, $playbackItem[0])) {
			$("#playback-heading").css({"display":"block"});
		} else {
			$("#playback-heading").css({"display":"none"});
		}
	};

// Removing playback items
	function removePlaybackItem () {
		$('.js--playback__remove-link').on('click', function(){
    		$(this).closest('.playback_item').remove();
    		// remove playback heading if no passports listed
    		addRemovePlaybackHeading();
    		removeAllButton();
		});
	}

// Remove all selected values
	function removeAllPlayback (){
		var $playbackItem = $('*[id^="playback__item-"]');
		$('.js-address-start-again-trigger').on('click', function(){
    		$($playbackItem).remove();
		});
		//console.clear()
		// remove playback heading
    	addRemovePlaybackHeading();
    	removeAllButton();
	}


	// - data from downloaded records.json file from https://country.register.gov.uk/records.json
	// - use "name" as options 
	// "name" must map to "country" "official-name" and "citizen-names" 
	// allowing the "name" to appear when any of those values are entered 

	// can we add in an "abbreviation" value for each entry? eg. USA
	// can we add in a "translation" value for each entry? eg. Francais

	// Options to appear A-Z on focus 
	// Ireland and United Kingdom to appear as soon as focus is in input box 

	// - when country is selected 
	// - add playback__item 
	// - append {{name}} to ID of each playback__item eg. playback__item__united_kingdom
	// - if it is the first playback__item then #all-passports-heading needs to appear at the same time
	// if more than one playback__item, the countries should appear A-Z 

	// - when remove button is pressed 
	// - remove that #playback__item
	// - if there was only 1 playback__item also remove #all-passports-heading


	// non-JS version 
	// displays just as dropdown 
	// using "name" as select options


	// version 2 page 2
	// if Ireland or UK are selected on first screen 
	// pass through those values to appear in the playback 
	// - add a message above the typeahead "{{United Kingdom}} has already been selected" (Highlight the country name)
