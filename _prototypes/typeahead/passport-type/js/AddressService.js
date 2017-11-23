/**
 * Address service facade for components
 */
window.addressService = {

	/**
	 * @returns {Promise} Promise object with return data
	 */
	findAddress: ordnanceSurveyService.places.findAddress,

	responseAdaptor: ordnanceSurveyService.responseAdaptor,
	request: ordnanceSurveyService.request,
	setLanguage: ordnanceSurveyService.setLanguage
};