import TypeaheadUI from '../typeahead/typeahead.ui';
import { sanitiseTypeaheadText } from '../typeahead/typeahead.helpers';

import triggerChange from '../trigger-change-event';
import AbortableFetch from './abortable-fetch';

const classAddress = 'js-address';
const baseClass = 'js-address-typeahead';
const classOrganisation = 'js-address-organisation';
const classLine1 = 'js-address-line-1';
const classLine2 = 'js-address-line-2';
const classTown = 'js-address-town';
const classPostcode = 'js-address-postcode';
const classSearchButtonContainer = 'js-address-search-btn-container';
const classSearchButton = 'js-address-search-btn';
const classManualButton = 'js-address-manual-btn';
const classNotEditable = 'js-address-not-editable';
const classRHLookup = 'js-rh-address-lookup';

class AddressInput {
  constructor(context) {
    this.context = context;
    this.organisation = context.querySelector(`.${classOrganisation}`);
    this.line1 = context.querySelector(`.${classLine1}`);
    this.line2 = context.querySelector(`.${classLine2}`);
    this.town = context.querySelector(`.${classTown}`);
    this.postcode = context.querySelector(`.${classPostcode}`);
    this.manualInputs = [this.line1, this.line2, this.town, this.postcode];
    this.searchButtonContainer = context.querySelector(`.${classSearchButtonContainer}`);
    this.searchButton = context.querySelector(`.${classSearchButton}`);
    this.manualButton = context.querySelector(`.${classManualButton}`);
    this.form = context.closest('form');
    this.lang = document.documentElement.getAttribute('lang').toLowerCase();
    this.addressReplaceChars = [','];
    this.sanitisedQuerySplitNumsChars = true;

    // State
    this.manualMode = true;
    this.currentQuery = null;
    this.fetch = null;
    this.currentResults = [];
    this.totalResults = 0;
    this.errored = false;
    this.addressSelected = false;
    this.isEditable = context.querySelector(`.${classNotEditable}`) ? false : true;
    this.isRhLookup = context.querySelector(`.${classRHLookup}`) ? true : false;

    // Initialise typeahead
    this.typeahead = new TypeaheadUI({
      context: context.querySelector(`.${baseClass}`),
      onSelect: this.onAddressSelect.bind(this),
      onUnsetResult: this.onUnsetAddress.bind(this),
      suggestionFunction: this.suggestAddresses.bind(this),
      onError: this.onError.bind(this),
      sanitisedQueryReplaceChars: this.addressReplaceChars,
      sanitisedQuerySplitNumsChars: this.sanitisedQuerySplitNumsChars,
      minChars: 5,
      suggestOnBoot: true,
      handleUpdate: true
    });

    // Bind Event Listeners
    if (this.searchButton) {
      this.searchButton.addEventListener('click', this.toggleMode.bind(this));
    }
    
    if (this.manualButton) {
      this.manualButton.addEventListener('click', this.toggleMode.bind(this));
    }

    if (this.form) {
      this.form.addEventListener('submit', this.handleSubmit.bind(this));
    }

    if (!(this.line1.value || this.line2.value || this.town.value)) {
      this.toggleMode();
    }

    this.searchButtonContainer.classList.remove('u-d-no');
    
    this.baseURL = 'https://whitelodge-ai-api.census-gcp.onsdigital.uk/addresses/';
    this.lookupURL = `${this.baseURL}eq?input=`;
    this.retrieveURL = `${this.baseURL}rh/uprn/`;
    
    this.user = 'equser';
    this.password = '$4c@ec1zLBu';
    this.auth = btoa(this.user + ':' + this.password);
    this.headers = new Headers({
      'Authorization': 'Basic ' + this.auth,
    }); 
  }

  toggleMode(clearInputs = true) {
    this.setManualMode(!this.manualMode, clearInputs);
  }

  setManualMode(manual, clearInputs) {
    this.context.classList[manual ? 'remove' : 'add']('address-input--search');

    if (clearInputs) {
      this.typeahead.unsetResults();
    }

    if (manual) {
      this.typeahead.input.value = '';
    }

    this.manualMode = manual;
  }

  suggestAddresses(query) {
    return new Promise((resolve, reject) => {
      if (this.currentQuery === query && this.currentQuery.length && this.currentResults.length) {
        resolve({
          results: this.currentResults,
          totalResults: this.currentResults.length
        });
      } else {
        this.currentQuery = query;
        this.currentResults = [];

        if (this.fetch && this.fetch.status !== 'DONE') {
          this.fetch.abort();
        }

        this.reject = reject;
        this.findAddress(query)
          .then(resolve)
          .catch(reject);
      }
    });
  }

  findAddress(text) {
    return new Promise((resolve, reject) => {
      const testInput = this.testFullPostcodeQuery(text);
      let limit = testInput ? 100 : 10;
      const queryUrl = this.lookupURL + text + '&limit=' + limit;
      this.fetch = new AbortableFetch(queryUrl, {
        method: 'GET',
        headers: this.headers
      });
      this.fetch
        .send()
        .then(async response => {
          const data = (await response.json()).response;
          resolve(this.mapFindResults(data));
        })
        .catch(reject);
    });
  }

  mapFindResults(results) {
    let updatedResults, mappedResults, limit;
    const addresses = results.addresses;
    const total = results.total;
    const originalLimit = 10;
    if (results.partpostcode) {
      const postcodeGroups = results.postcodes;
      mappedResults = postcodeGroups.map(({ postcode, streetName, townName, addressCount, firstUprn }) => {
        const addressText = addressCount === 1 ? 'address' : 'addresses';
        return {
          'en-gb': streetName + ', ' + townName  + ', ' + postcode + ' (<span class="group-text">' + addressCount + ' ' + addressText + '</span>)',
          postcode,
          firstUprn,
          addressCount,
        };
      });

      limit = originalLimit;
      this.currentResults = mappedResults.sort();

    } else if (addresses[0]) {
      if (addresses[0] && addresses[0].bestMatchAddress) {
        updatedResults = addresses.map(({ uprn, bestMatchAddress }) => ({ uprn: uprn, address: bestMatchAddress }));
        limit = originalLimit;

      } else if (addresses[0] && addresses[0].formattedAddress) {
        updatedResults = addresses.map(({ uprn, formattedAddress }) => ({ uprn: uprn, address: formattedAddress }));
        limit = 100;
      }  

      mappedResults = updatedResults.map(({ uprn, address }) => {
        const sanitisedText = sanitiseTypeaheadText(address, this.addressReplaceChars);
        return {
          'en-gb': address,
          sanitisedText,
          uprn,
        };
      });
    
      this.currentResults = mappedResults.sort();

    } else {
      this.currentResults = addresses;
      limit = originalLimit;
    }

    return {
      results: this.currentResults,
      totalResults: total,
      limit: limit
    };
  }

  retrieveAddress(id) {
    return new Promise((resolve, reject) => {
      const queryUrl = this.retrieveURL + id + '?addresstype=paf';
      this.fetch = new AbortableFetch(queryUrl, {
        method: 'GET',
        headers: this.headers
      });

      this.fetch
        .send()
        .then(async response => {
          const data = await response.json();
          resolve(data);
        })
        .catch(reject);
    });
  }

  testFullPostcodeQuery(input) {
    const fullPostcodeRegex = /\b((?:(?:gir)|(?:[a-pr-uwyz])(?:(?:[0-9](?:[a-hjkpstuw]|[0-9])?)|(?:[a-hk-y][0-9](?:[0-9]|[abehmnprv-y])?)))) ?([0-9][abd-hjlnp-uw-z]{2})\b/i;
    const testFullPostcode = fullPostcodeRegex.test(input);
    if (testFullPostcode) {
      return true;
    }
  }

  onAddressSelect(selectedResult) {
    return new Promise((resolve, reject) => {
      if (selectedResult.uprn && !selectedResult.addressCount) {
        this.retrieveAddress(selectedResult.uprn)
          .then(data => {
            if (this.isEditable) {
              this.setAddress(data, resolve);
            } else {
              this.typeahead.input.value = selectedResult.displayText;
            }
            if (data.response.address.censusAddressType) {
              const rhAddressTypeInput = this.context.querySelector('.js-rh-address-type');
              const rhAddressCountryInput = this.context.querySelector('.js-rh-address-country');
              rhAddressTypeInput.value = data.response.address.censusAddressType;
              rhAddressCountryInput.value = data.response.address.countryCode;
            }
          })
          .catch(reject);
      } else if (selectedResult.postcode && selectedResult.addressCount > 0) {
        const event = new Event('input', {
          'bubbles': true,
          'cancelable': true
        });
        this.typeahead.input.value = selectedResult.postcode;
        this.typeahead.input.focus();
        this.typeahead.input.dispatchEvent(event);

      }
    });
  }

  setAddress(data, resolve) {
    this.clearManualInputs(false);
    const value = data.response.address;
    if (value.addressLine3) {
      this.line1.value = value.addressLine1 + ', ' + value.addressLine2;
      this.line2.value = value.addressLine3;
    } else {
      this.line1.value = value.addressLine1;
      this.line2.value = value.addressLine2;
    }
    
    this.town.value = value.townName;
    this.postcode.value = value.postcode;

    this.triggerManualInputsChanges();

    this.addressSelected = true;

    this.setManualMode(true, false);

    resolve();
  }

  clearManualInputs(triggerChange = true) {
    this.manualInputs.forEach(input => {
      input.value = '';
    });

    if (triggerChange) {
      this.triggerManualInputsChanges();
    }

    this.addressSelected = false;
  } 

  triggerManualInputsChanges() {
    this.manualInputs.forEach(triggerChange);
  }

  onUnsetAddress() {
    this.clearManualInputs();
  }

  onError() {
    if (this.fetch) {
      this.fetch.abort();
    }

    // Prevent error message from firing twice
    if (!this.errored) {
      this.errored = true;
      console.log('error');
      setTimeout(() => {
        this.errored = false;
      });
    }
  }

  handleSubmit(event) {
    if (!this.manualMode && this.typeahead.input.value.trim() && !this.addressSelected) {
      event.preventDefault();

      window.DONT_SUBMIT = true;

      this.typeahead.showErrorPanel();
      this.typeahead.setAriaStatus('There is an error. Select an address');
    } else {
      window.DONT_SUBMIT = false;
    }
  }
}

function addressInput() {
  const addressInputs = [...document.querySelectorAll(`.${classAddress}`)];

  addressInputs.forEach(addressInput => new AddressInput(addressInput));
}

addressInput();
