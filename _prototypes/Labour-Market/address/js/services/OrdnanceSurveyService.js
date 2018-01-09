/**
 * Ordnance Survey service singleton
 */
window.ordnanceSurveyService = (function () {

	var baseUrl = 'https://api.ordnancesurvey.co.uk',
		apiKey = 'PunU5kFvV1EmoEVJndgESV8Q5isVRTnt',
		apiKeyPath = '?key=' + apiKey,
		queryParams = {},
		request,
		languages = {
			'CY': true,
			'EN': true
		};

	function createRequest () {

		var queryParamString = '',
			param,

			url = baseUrl +
				service.places._path +
				service.places._findAddressPath +
				apiKeyPath;

		for (param in queryParams) {
			queryParamString += '&' + param + '=' + queryParams[param];
		}

		url += queryParamString;

		/**
		 * Convert to promise
		 */
		return new Promise(function (resolve, reject) {

			service.request.isInflight = true;

			request = $.getJSON(url)
				.done(function (res) {
					service.request.isInflight = false;
					resolve(res);
				})
				.fail(function (res) {
					service.request.isInflight = false;
					reject(res);
				})
		});
	}

	var service = {
		places: {
			_path: '/places/v1',
			_findAddressPath: '/addresses/find',

			findAddress: function (addressStr) {

				queryParams['query'] = addressStr;

				return createRequest();
			}
		},

		responseAdaptor: function (data) {
			if (!data.results || !data.results.length) {
				return [];
			}

			return data.results.map(function (item) {
				var addressObj = item['DPA'] || {};

				return {
					fullAddress: addressObj['ADDRESS'],
					houseNumber: addressObj['BUILDING_NUMBER'],
					houseNameOrNumber: addressObj['BUILDING_NUMBER'] ||
					addressObj['BUILDING_NAME'],
					organisationName: addressObj['ORGANISATION_NAME'],
					streetAddress: addressObj['THOROUGHFARE_NAME'],
					cityTown: addressObj['POST_TOWN'],
					county: '',
					postCode: addressObj['POSTCODE'],
					country: '',
					secondaryText: ''
				};
			});
		},

		setLanguage: function (languageSymbol) {

			if (languages[languageSymbol]) {
				queryParams['lr'] = languageSymbol;
			}
		},

		request: {
			isInflight: false,
			cancel: function () {
				request.abort();
			}
		}
	};

	return service;
}());
