export const PERSONAL_DETAILS_KEY = 'individual-details';
export const PERSONAL_PINS_KEY = 'individual-pins';

export const personalDetailsMaritalStatusMap = {
  'never': {
    description: 'Never married and never registered a same-sex civil' +
    ' partnership'
  },
  'married': {
    description: 'Married'
  },
  'registered': {
    description: 'In a registered same-sex civil partnership'
  },
  'separated-married': {
    description: 'Separated, but still legally married'
  },
  'divorced': {
    description: 'Divorced'
  },
  'former-partnership': {
    description: 'Formerly in a same-sex civil partnership which is now' +
    ' legally dissolved'
  },
  'widowed': {
    description: 'Widowed'
  },
  'surviving-partner': {
    description: 'Surviving partner from a same-sex civil partnership'
  },
  'separated-partnership': {
    description: 'Separated, but still legally in a same-sex civil partnership'
  }
};

export const personalDetailsCountryMap = {
  'england': {
    description: 'England'
  },
  'wales': {
    description: 'Wales'
  },
  'scotland': {
    description: 'Scotland'
  },
  'northern-ireland': {
    description: 'Northern Ireland'
  },
  'republic-ireland': {
    description: 'Republic of Ireland'
  },
  'elsewhere': {
    description: 'Elsewhere'
  }
};

export const personalDetailsOrientationMap = {
  'straight': {
    description: 'Straight or Heterosexual'
  },
  'gay': {
    description: 'Gay or Lesbian'
  },
  'bisexual': {
    description: 'Bisexual'
  },
  'other': {
    description: 'Other'
  },
  'no-say': {
    description: 'Prefer not to say'
  }
};

export function addUpdatePersonalDetailsDOB(personId, day, month, year) {
  let allDetails = getAllPersonalDetails(),
    details = allDetails[personId] || {};

  details['dob'] = {
    day,
    month,
    year
  };

  updatePersonalDetails(personId, details);

  return details;
}

export function addUpdatePersonalDetailsDOBUnknown(personId) {
  let allDetails = getAllPersonalDetails(),
    details = allDetails[personId] || {};

  console.log('unknown');

  details['dob'] = 'unknown';

  updatePersonalDetails(personId, details);

  return details;
}

export function addUpdateMaritalStatus(personId, val) {
  let allDetails = getAllPersonalDetails(),
    details = allDetails[personId] || {};

  details['maritalStatus'] = val;

  updatePersonalDetails(personId, details);

  return details;
}

export function addUpdateCountry(personId, val) {
  let allDetails = getAllPersonalDetails(),
    details = allDetails[personId] || {};

  details['country'] = val;

  updatePersonalDetails(personId, details);

  return details;
}

export function addUpdateOrientation(personId, val) {
  let allDetails = getAllPersonalDetails(),
    details = allDetails[personId] || {};

  details['orientation'] = val;

  updatePersonalDetails(personId, details);

  return details;
}

export function addUpdateSalary(personId, val) {
  let allDetails = getAllPersonalDetails(),
    details = allDetails[personId] || {};

  details['salary'] = val;

  updatePersonalDetails(personId, details);

  return details;
}

export function addUpdateSex(personId, val) {
  let allDetails = getAllPersonalDetails(),
    details = allDetails[personId] || {};

  details['sex'] = val;

  updatePersonalDetails(personId, details);

  return details;
}

export function addUpdateAddressWhere(personId, val) {
  let allDetails = getAllPersonalDetails(),
    details = allDetails[personId] || {};

  details['address-where'] = val;

  updatePersonalDetails(personId, details);

  return details;
}

export function addUpdateAddressIndividual(personId, val) {
  let allDetails = getAllPersonalDetails(),
    details = allDetails[personId] || {};

  details['address'] = val;

  updatePersonalDetails(personId, details);

  return details;
}

export function addUpdateAge(personId, val, { isApproximate = false }) {
  let allDetails = getAllPersonalDetails(),
    details = allDetails[personId] || {};

  details['age'] = {
    val,
    isApproximate
  };

  updatePersonalDetails(personId, details);

  return details;
}

export function getPins() {
  return JSON.parse(sessionStorage.getItem(PERSONAL_PINS_KEY)) || {};
}

export function createPinFor(personId, opts = {}) {
  let pins = getPins();

  pins[personId] = {
    pin: _.random(10000, 99999),
    exported: !!opts.exported
  };

  sessionStorage.setItem(PERSONAL_PINS_KEY, JSON.stringify(pins));

  return pins[personId];
}

export function getPinFor(personId) {
  return getPins()[personId];
}

export function unsetPinFor(personId) {
  let pins = getPins();

  delete pins[personId];

  sessionStorage.setItem(PERSONAL_PINS_KEY, JSON.stringify(pins));
}

export function updatePersonalDetails(personId, details) {
  sessionStorage.setItem(PERSONAL_DETAILS_KEY, JSON.stringify({
    ...getAllPersonalDetails(),
    [personId]: details
  }));

  return details;
}

export function getAllPersonalDetails() {
  return JSON.parse(sessionStorage.getItem(PERSONAL_DETAILS_KEY)) || {};
}

export function getPersonalDetailsFor(personId) {
  const storageObj = JSON.parse(sessionStorage.getItem(PERSONAL_DETAILS_KEY)) || {},
    personObj = storageObj[personId];

  if (!personObj) {
    console.log('Personal details for ' + personId + ' not found');
  }

  return personObj;
}
