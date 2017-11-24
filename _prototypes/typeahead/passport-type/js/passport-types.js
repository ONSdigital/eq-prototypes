// Adding playback items (for test)
	var _counter = 0;
	$('.js--add-playback-item').on('click', function(){
   		_counter++;
    	var oClone = document.getElementById("playback__item-0").cloneNode(true);
    	oClone.id += (_counter + "");
    	document.getElementById("playback-container").appendChild(oClone);
    });

// Removing playback items
	function removePlaybackItem () {
		$('.playback__remove-link').on('click', function(){
    		$(this).closest('.playback_item').remove();
		});
	}

// check page for playback items 
	var $playbackItem= $('.playback_item');
	if (jQuery.contains(document, $playbackItem[0])) { 

	} else {
		$("#all-passports-heading").css({"display":"none"});
	}


	// data from https://country.register.gov.uk/records.json
	// use "name" as options 
	// "name" must map to "country" "official-name" and "citizen-names" 
	// allowing the "name" to appear when any of those values are entered 

	// can we add in an "abbreviation" value for each entry? eg. USA
	// can we add in a "translation" value for each entry? eg. Francais

	// Ireland and United Kingdom to appear as soon as focus is in input box 

	// when country is selected 
	// add playback__item 
	// append {{name}} to ID of each playback__item eg. playback__item__united_kingdom
	// if it is the first playback__item then #all-passports-heading needs to appear at the same time
	// if more than one playback__item, the countries should appear A-Z 

	// when remove button is pressed 
	// remove that #playback__item
	// if there was only 1 playback__item also remove #all-passports-heading


	// non-JS version 
	// displays just as dropdown 
	// using "name" as select options


	// version 2 page 2
	// if Ireland or UK are selected on first screen 
	// pass through those values to appear in the playback 
	// add a message above the typeahead "{{United Kingdom}} has already been selected" (Highlight the country name)