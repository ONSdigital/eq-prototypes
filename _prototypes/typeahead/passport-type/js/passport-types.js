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

// Adding playback items (for test)
	var _counter = 0;
	$('.js--add-playback-item').on('click', function(){
   		_counter++;
    	var oClone = document.getElementById("playback__item-0").cloneNode(true);
    	oClone.id += (_counter + "");
    	document.getElementById("playback-container").appendChild(oClone);
    	// add passports heading
    	var $playbackItem= $('.playback_item');
    	if (jQuery.contains(document, $playbackItem[0])) {
			$("#all-passports-heading").css({"display":"block"}); 
		} else {
			$("#all-passports-heading").css({"display":"none"});
		}
    });

// Removing playback items
	function removePlaybackItem () {
		$('.js--playback__remove-link').on('click', function(){
    		$(this).closest('.playback_item').remove();
		});
		// remove passports heading if no passports listed
		var $playbackItem= $('.playback_item');
		if (jQuery.contains(document, $playbackItem[0])) {
			$("#all-passports-heading").css({"display":"block"}); 
		} else {
			$("#all-passports-heading").css({"display":"none"});
		}
	}





	// - data from downloaded records.json file from https://country.register.gov.uk/records.json
	// - use "name" as options 
	// "name" must map to "country" "official-name" and "citizen-names" 
	// allowing the "name" to appear when any of those values are entered 

	// can we add in an "abbreviation" value for each entry? eg. USA
	// can we add in a "translation" value for each entry? eg. Francais

	// Options to appear A-Z on focus 
	// Ireland and United Kingdom to appear as soon as focus is in input box 

	// when country is selected 
	// add playback__item 
	// append {{name}} to ID of each playback__item eg. playback__item__united_kingdom
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