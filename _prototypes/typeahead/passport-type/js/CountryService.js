/**
 * Country Register service 
 */
/*
function setup() {
  noLoop();
  var url = 'https://country.register.gov.uk/records.json';
  loadJSON(url, typeaheadData);
}

function typeaheadData(records) {
  // Get the loaded JSON data
  console.log(records); // inspect the records JSON

  var countryName = records.Countries[1].item.name; // get the item out of the loaded JSON
  console.log(name); // inspect the name in the console
}*/

var countryData = {
	"PL":{
		"index-entry-number": "146",
		"entry-number": "146",
		"entry-timestamp": "2016-04-05T13:23:05Z",
		"key": "PL",
		"item": { // remove [] here as stopped query working 
			"country": "PL",
			"officialName": "The Republic of Poland",
			"name": "Poland",
			"citizen-names": "Pole"
		}
	}
}

//countryData = JSON.parse(countryData);

function alertTest () {
	alert('I am in ' + countryData.PL.item.name);
}