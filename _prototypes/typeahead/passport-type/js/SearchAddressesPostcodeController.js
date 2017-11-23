function SearchAddressesPostcodeController (scopeElement, addressService) {

	var $scopeEl = $(scopeElement),
		$addressEl = $scopeEl.find('.js-typeahead-input'),
		$addressDetailsTrigger = $scopeEl.find('.js-address-details-trigger'),
		$addressStartAgainTrigger = $scopeEl.find('.js-address-start-again-trigger'),
		$details = $scopeEl.find('.js-manual-address'),
		addressComponent = TypeaheadComponent.create({
			scopeElement: $scopeEl.find('.js-typeahead-component')[0],
			inputElement: $scopeEl.find('.js-typeahead-input')[0]
		}),
		fieldToDataMap = {
			houseNameOrNumber: 'street_number',
			organisationName: 'organisation_name',
			streetAddress: 'route',
			cityTown: 'postal_town',
			county: 'county',
			postCode: 'postal_code',
			country: 'country'
		},
		isOpen = false,
		keyEntryPace = {
			/*timeout: 3000,
			entries: [1000],
			record: function () {
				console.log(this);
			},*/
			get: function () {
				return 0;
			}
		},
		callService;

	this.init = function () {
		addressService.setLanguage('EN');
		$details.hide();
	};

	function toggleDetails (e, toOpen) {
		if (e) {
			e.preventDefault();
		}

		/**
		 * If persistent state isn't specified, flip state
		 */
		if (toOpen === undefined) {
			toOpen = !isOpen;
		}

		$details.parent()[toOpen ? 'addClass' : 'removeClass']('is-expanded');
		$details.attr('aria-hidden', !toOpen);
		$addressDetailsTrigger.attr('aria-expanded', toOpen);

		isOpen = toOpen;

		if (toOpen){
			$details.show();
		} else {

			/**
			 * Make sure fields are removed from DOM after animation
			 */
			setTimeout(function () {
				$details.hide();
			}, 300);
		}
	}

	function resetFields (e) {
		e.preventDefault();

		$addressEl.val('');

		for (i in fieldToDataMap) {
			$('#' + fieldToDataMap[i]).val('');
		}

		$addressEl.focus();
	}

	function keyUp_handler(e) {
		e.preventDefault();

		var val = $(this).val();

		if (TypeaheadComponent.isKeyPressClean(e)) {
			return;
		}

		if (addressService.request.isInflight) {
			addressService.request.cancel();
		}

		if (val.length < 3) {

			// keyEntryPace.record();

			if (addressComponent.data.length) {
				addressComponent.update([]);
			}

			return;
		}

		var shouldAttachScrollToAddressElBool = $('body').prop('scrollWidth') < 485;

		/*addressComponent.update(addressService.responseAdaptor({ results: mockData }));
		return;*/

		callService(val, shouldAttachScrollToAddressElBool ? [{
			prop: 'then',
			method: function () {
				$(window).scrollTop($addressEl.parent().prev('.label').offset().top);
			}}] : []);
	}

	function addressSortAscendingComparator (a, b) {

		var aNumber,
			bNumber;

		if (a.houseNameOrNumber) {
			aNumber = a.houseNameOrNumber.split(', ')[0].replace(/([a-z A-Z])/g, '');
		}

		if (b.houseNameOrNumber) {
			bNumber = b.houseNameOrNumber.split(', ')[0].replace(/([a-z A-Z])/g, '');
		}

		/**
		 * If not comparable guard
		 */
		if (!aNumber || !bNumber) {
			if (aNumber) {
				return aNumber;
			}

			if (bNumber) {
				return bNumber;
			}

			return false;
		}

		return aNumber - bNumber;
	}

	callService = _.debounce(function callService (address, attachArr) {

		var serviceCall = addressService.findAddress(address)
			.then(function (res) {
				console.log('and then', res);

				var results = addressService.responseAdaptor(res);

				addressComponent.update(
					_.flatten(
						_.partition(results, function (item) {
							return item.postCode
								.replace(' ', '')
								.toUpperCase()
								.match($addressEl.val()
									.replace(' ', '')
									.toUpperCase()
								);
							})
							.map(function (resultSet) {
								return resultSet.sort(addressSortAscendingComparator)
							})
					)
				);

			})
			.catch(function (res) {
				console.log('and fail', res);
			});

		/**
		 * Can't return promise from debounce - call is async
		 */
		$.each(attachArr, function (key, item) {
			if (item && item.prop && item.method) {
				serviceCall[item.prop](item.method);
			}
		});

	}, keyEntryPace.get());

	window.onload = toggleDetails;

	//$addressDetailsTrigger.on('click', toggleDetails);
	$addressStartAgainTrigger.on('click', resetFields);
	$addressEl.on('keyup', keyUp_handler);

	addressComponent.emitter.on('itemSelected', function (e, dataItem) {
		var i;

		/**
		 * Populate manual entry fields
		 */
		for (i in fieldToDataMap) {
			$('#' + fieldToDataMap[i]).val(dataItem[i]);
		}

		$addressDetailsTrigger.hide();
		$addressStartAgainTrigger.show();

		/**
		 * Open field list
		 */
		toggleDetails(null, true);
	});
}

var mockData = [{
	"DPA" : {
		"UPRN" : "43014115",
		"UDPRN" : "4547315",
		"ADDRESS" : "1, WARE ROAD, CAERFFILI, CF83 1SX",
		"BUILDING_NUMBER" : "1",
		"THOROUGHFARE_NAME" : "WARE ROAD",
		"POST_TOWN" : "CAERFFILI",
		"POSTCODE" : "CF83 1SX",
		"RPC" : "1",
		"X_COORDINATE" : 314172.0,
		"Y_COORDINATE" : 186296.0,
		"STATUS" : "APPROVED",
		"LOGICAL_STATUS_CODE" : "1",
		"CLASSIFICATION_CODE" : "RD",
		"CLASSIFICATION_CODE_DESCRIPTION" : "Dwelling",
		"LOCAL_CUSTODIAN_CODE" : 6920,
		"LOCAL_CUSTODIAN_CODE_DESCRIPTION" : "CAERPHILLY",
		"POSTAL_ADDRESS_CODE" : "D",
		"POSTAL_ADDRESS_CODE_DESCRIPTION" : "A record which is linked to PAF",
		"BLPU_STATE_CODE_DESCRIPTION" : "Unknown/Not applicable",
		"TOPOGRAPHY_LAYER_TOID" : "osgb1000027048446",
		"LAST_UPDATE_DATE" : "10/02/2016",
		"ENTRY_DATE" : "31/01/2003",
		"LANGUAGE" : "CY",
		"MATCH" : 0.2,
		"MATCH_DESCRIPTION" : "NO MATCH"
	}
}, {
	"DPA" : {
		"UPRN" : "100100209509",
		"UDPRN" : "4650113",
		"ADDRESS" : "1, GREENACRE DRIVE, BAGILLT, CH6 6DY",
		"BUILDING_NUMBER" : "1",
		"THOROUGHFARE_NAME" : "GREENACRE DRIVE",
		"POST_TOWN" : "BAGILLT",
		"POSTCODE" : "CH6 6DY",
		"RPC" : "1",
		"X_COORDINATE" : 322637.53,
		"Y_COORDINATE" : 374544.52,
		"STATUS" : "APPROVED",
		"LOGICAL_STATUS_CODE" : "1",
		"CLASSIFICATION_CODE" : "RD02",
		"CLASSIFICATION_CODE_DESCRIPTION" : "Detached",
		"LOCAL_CUSTODIAN_CODE" : 6835,
		"LOCAL_CUSTODIAN_CODE_DESCRIPTION" : "FLINTSHIRE",
		"POSTAL_ADDRESS_CODE" : "D",
		"POSTAL_ADDRESS_CODE_DESCRIPTION" : "A record which is linked to PAF",
		"BLPU_STATE_CODE_DESCRIPTION" : "Unknown/Not applicable",
		"TOPOGRAPHY_LAYER_TOID" : "osgb1000034471824",
		"LAST_UPDATE_DATE" : "10/02/2016",
		"ENTRY_DATE" : "10/05/2001",
		"LANGUAGE" : "CY",
		"MATCH" : 0.2,
		"MATCH_DESCRIPTION" : "NO MATCH"
	}
}, {
	"DPA" : {
		"UPRN" : "200003767038",
		"UDPRN" : "4379366",
		"ADDRESS" : "1, POWELLS PLACE, PORTH, CF39 9RW",
		"BUILDING_NUMBER" : "1",
		"THOROUGHFARE_NAME" : "POWELLS PLACE",
		"POST_TOWN" : "PORTH",
		"POSTCODE" : "CF39 9RW",
		"RPC" : "1",
		"X_COORDINATE" : 302542.0,
		"Y_COORDINATE" : 191420.0,
		"STATUS" : "APPROVED",
		"LOGICAL_STATUS_CODE" : "1",
		"CLASSIFICATION_CODE" : "RD04",
		"CLASSIFICATION_CODE_DESCRIPTION" : "Terraced",
		"LOCAL_CUSTODIAN_CODE" : 6940,
		"LOCAL_CUSTODIAN_CODE_DESCRIPTION" : "RHONDDA CYNON TAF",
		"POSTAL_ADDRESS_CODE" : "D",
		"POSTAL_ADDRESS_CODE_DESCRIPTION" : "A record which is linked to PAF",
		"BLPU_STATE_CODE" : "2",
		"BLPU_STATE_CODE_DESCRIPTION" : "In use",
		"TOPOGRAPHY_LAYER_TOID" : "osgb1000023740817",
		"LAST_UPDATE_DATE" : "10/02/2016",
		"ENTRY_DATE" : "31/10/2002",
		"BLPU_STATE_DATE" : "28/08/2013",
		"LANGUAGE" : "CY",
		"MATCH" : 0.2,
		"MATCH_DESCRIPTION" : "NO MATCH"
	}
}, {
	"DPA" : {
		"UPRN" : "10009180022",
		"UDPRN" : "21233518",
		"ADDRESS" : "1, DERLWYN, CASTELL-NEDD, SA10 7QU",
		"BUILDING_NUMBER" : "1",
		"THOROUGHFARE_NAME" : "DERLWYN",
		"POST_TOWN" : "CASTELL-NEDD",
		"POSTCODE" : "SA10 7QU",
		"RPC" : "2",
		"X_COORDINATE" : 274086.0,
		"Y_COORDINATE" : 198274.0,
		"STATUS" : "APPROVED",
		"LOGICAL_STATUS_CODE" : "1",
		"CLASSIFICATION_CODE" : "RD",
		"CLASSIFICATION_CODE_DESCRIPTION" : "Dwelling",
		"LOCAL_CUSTODIAN_CODE" : 6930,
		"LOCAL_CUSTODIAN_CODE_DESCRIPTION" : "NEATH PORT TALBOT",
		"POSTAL_ADDRESS_CODE" : "D",
		"POSTAL_ADDRESS_CODE_DESCRIPTION" : "A record which is linked to PAF",
		"BLPU_STATE_CODE" : "2",
		"BLPU_STATE_CODE_DESCRIPTION" : "In use",
		"TOPOGRAPHY_LAYER_TOID" : "osgb1000041956935",
		"LAST_UPDATE_DATE" : "10/02/2016",
		"ENTRY_DATE" : "05/05/2005",
		"BLPU_STATE_DATE" : "05/05/2005",
		"LANGUAGE" : "CY",
		"MATCH" : 0.2,
		"MATCH_DESCRIPTION" : "NO MATCH"
	}
}, {
	"DPA" : {
		"UPRN" : "10023167356",
		"UDPRN" : "50316895",
		"ADDRESS" : "1, BENTLEY PLACE, WRECSAM, LL13 8DQ",
		"BUILDING_NUMBER" : "1",
		"THOROUGHFARE_NAME" : "BENTLEY PLACE",
		"POST_TOWN" : "WRECSAM",
		"POSTCODE" : "LL13 8DQ",
		"RPC" : "2",
		"X_COORDINATE" : 334126.66,
		"Y_COORDINATE" : 349882.63,
		"STATUS" : "APPROVED",
		"LOGICAL_STATUS_CODE" : "1",
		"CLASSIFICATION_CODE" : "RD06",
		"CLASSIFICATION_CODE_DESCRIPTION" : "Self Contained Flat (Includes Maisonette / Apartment)",
		"LOCAL_CUSTODIAN_CODE" : 6955,
		"LOCAL_CUSTODIAN_CODE_DESCRIPTION" : "WREXHAM",
		"POSTAL_ADDRESS_CODE" : "D",
		"POSTAL_ADDRESS_CODE_DESCRIPTION" : "A record which is linked to PAF",
		"BLPU_STATE_CODE_DESCRIPTION" : "Unknown/Not applicable",
		"TOPOGRAPHY_LAYER_TOID" : "osgb1000002755046329",
		"LAST_UPDATE_DATE" : "10/02/2016",
		"ENTRY_DATE" : "14/04/2008",
		"LANGUAGE" : "CY",
		"MATCH" : 0.2,
		"MATCH_DESCRIPTION" : "NO MATCH"
	}
}, {
	"DPA" : {
		"UPRN" : "100100001967",
		"UDPRN" : "13682465",
		"ADDRESS" : "10, GARREGLWYD PARK, CAERGYBI, LL65 1NW",
		"BUILDING_NUMBER" : "10",
		"THOROUGHFARE_NAME" : "GARREGLWYD PARK",
		"POST_TOWN" : "CAERGYBI",
		"POSTCODE" : "LL65 1NW",
		"RPC" : "1",
		"X_COORDINATE" : 223898.0,
		"Y_COORDINATE" : 382515.0,
		"STATUS" : "APPROVED",
		"LOGICAL_STATUS_CODE" : "1",
		"CLASSIFICATION_CODE" : "RD",
		"CLASSIFICATION_CODE_DESCRIPTION" : "Dwelling",
		"LOCAL_CUSTODIAN_CODE" : 6805,
		"LOCAL_CUSTODIAN_CODE_DESCRIPTION" : "ISLE OF ANGLESEY",
		"POSTAL_ADDRESS_CODE" : "D",
		"POSTAL_ADDRESS_CODE_DESCRIPTION" : "A record which is linked to PAF",
		"BLPU_STATE_CODE_DESCRIPTION" : "Unknown/Not applicable",
		"TOPOGRAPHY_LAYER_TOID" : "osgb1000033999031",
		"LAST_UPDATE_DATE" : "10/02/2016",
		"ENTRY_DATE" : "30/05/2002",
		"LANGUAGE" : "CY",
		"MATCH" : 0.2,
		"MATCH_DESCRIPTION" : "NO MATCH"
	}
},{
	"DPA" : {
		"UPRN" : "10011744354",
		"UDPRN" : "13036886",
		"ADDRESS" : "1, RIVERSIDE, LLYSWEN, ABERHONDDU, LD3 0LJ",
		"BUILDING_NUMBER" : "1",
		"THOROUGHFARE_NAME" : "RIVERSIDE",
		"DEPENDENT_LOCALITY" : "LLYSWEN",
		"POST_TOWN" : "ABERHONDDU",
		"POSTCODE" : "LD3 0LJ",
		"RPC" : "1",
		"X_COORDINATE" : 312995.53,
		"Y_COORDINATE" : 238327.04,
		"STATUS" : "APPROVED",
		"LOGICAL_STATUS_CODE" : "1",
		"CLASSIFICATION_CODE" : "RD02",
		"CLASSIFICATION_CODE_DESCRIPTION" : "Detached",
		"LOCAL_CUSTODIAN_CODE" : 6850,
		"LOCAL_CUSTODIAN_CODE_DESCRIPTION" : "POWYS",
		"POSTAL_ADDRESS_CODE" : "D",
		"POSTAL_ADDRESS_CODE_DESCRIPTION" : "A record which is linked to PAF",
		"BLPU_STATE_CODE" : "2",
		"BLPU_STATE_CODE_DESCRIPTION" : "In use",
		"TOPOGRAPHY_LAYER_TOID" : "osgb1000020865533",
		"LAST_UPDATE_DATE" : "10/02/2016",
		"ENTRY_DATE" : "14/10/2004",
		"BLPU_STATE_DATE" : "02/05/2012",
		"LANGUAGE" : "CY",
		"MATCH" : 0.2,
		"MATCH_DESCRIPTION" : "NO MATCH"
	}
}]