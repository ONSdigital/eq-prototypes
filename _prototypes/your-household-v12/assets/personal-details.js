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

export const personalDetailsGenderMap = {
  'male': {
    description: 'Male'
  },
  'female': {
    description: 'Female'
  }
};

function changeDetailsFor(personId, mutation) {
  let details = getPersonalDetailsFor(personId);

  updatePersonalDetails(personId, {
    ...details,
    ...mutation(details || {})
  });

  return details;
}

export function addUpdatePersonalDetailsDOB(personId, day, month, year) {
  return changeDetailsFor(personId, () =>
    ({
      'dob': {
        day,
        month,
        year
      }
    }));
}

export function addUpdateMaritalStatus(personId, val) {
  return changeDetailsFor(personId, () =>
    ({
      'maritalStatus': val
    }));
}

export function addUpdateCountry(personId, val) {
  return changeDetailsFor(personId, () =>
    ({
      'country': {
        val
      }
    }));
}

export function addUpdateCountryOther(personId, otherText) {
  return changeDetailsFor(personId, details =>
    ({
      'country': {
        ...(details['country'] || {}),
        otherText
      }
    }));
}

export function addUpdateNationalIdentity(personId, collection, otherText) {
  return changeDetailsFor(personId, () =>
    ({
      'national-identity': {
        collection,
        ...(collection.find(val => val === 'other') ? { otherText } : {})
      }
    }));
}

export function addUpdateNationalIdentityOther(personId, otherText) {
  return changeDetailsFor(personId, details =>
    ({
      'national-identity': {
        ...(details['national-identity'] || {}),
        ...{ otherText }
      }
    }));
}

export function addUpdateEthnicGroup(personId, val) {
  return changeDetailsFor(personId, () =>
    ({
      'ethnic-group': {
        val
      }
    }));
}

export function addUpdateEthnicGroupDescription(personId, description) {
  return changeDetailsFor(personId, details =>
    ({
      'ethnic-group': {
        ...(details['ethnic-group'] || {}),
        ...{ description }
      }
    }));
}

export function addUpdateEthnicGroupOther(personId, otherText) {
  return changeDetailsFor(personId, details =>
    ({
      'ethnic-group': {
        ...(details['ethnic-group'] || {}),
        ...{ otherText }
      }
    }));
}

export function addUpdatePassportCountry(personId, countries) {
  return changeDetailsFor(personId, details =>
    ({
      'passport': {
        ...(details['passport'] || {}),
        countries
      }
    }));
}

export function addUpdatePassportCountryOther(personId, otherText) {
  return changeDetailsFor(personId, details =>
    ({
      'passport': {
        ...(details['passport'] || {}),
        otherText
      }
    }));
}

export function addUpdateOrientation(personId, val) {
  return changeDetailsFor(personId, () =>
    ({
      'orientation': val
    }));
}

export function addUpdateSalary(personId, val) {
  return changeDetailsFor(personId, () =>
    ({
      'salary': val
    }));
}

export function addUpdateSex(personId, val) {
  return changeDetailsFor(personId, () =>
    ({
      'sex': val
    }));
}

export function addUpdateAddressWhere(personId, val) {
  return changeDetailsFor(personId, () =>
    ({
      'address-where': val
    }));
}

export function addUpdateAge(personId, val, { isApproximate = false }) {
  return changeDetailsFor(personId, () =>
    ({
      'age': {
        val,
        isApproximate
      }
    }));
}

export function addUpdateAgeConfirm(personId, val) {
  return changeDetailsFor(personId, () =>
    ({
      'age-confirm': {
        val
      }
    }));
}

export function addUpdateAddressOutsideUK(personId, val) {
  return changeDetailsFor(personId, () =>
    ({
      'address-outside-uk': val
    }));
}

export function addUpdateAddressIndividual(personId, val) {
  return changeDetailsFor(personId, () =>
    ({
      'address': val
    }));
}

export function addUpdateApprenticeship(personId, hasApprenticeship) {
  return changeDetailsFor(personId, () =>
    ({
      'apprenticeship': {
        hasApprenticeship
      }
    }));
}

export function addUpdateHasQualificationAbove(personId, aboveDegree) {
  return changeDetailsFor(personId, details =>
    ({
      'qualifications': {
        ...(details['qualifications'] || {}),
        aboveDegree
      }
    }));
}

export function addUpdateQualificationsNvqEquivalent(personId, nvqEquivalent) {
  return changeDetailsFor(personId, details =>
    ({
      'qualifications': {
        ...(details['qualifications'] || {}),
        nvqEquivalent
      }
    }));
}

export function addUpdateQualificationsALevel(personId, aLevels) {
  return changeDetailsFor(personId, details =>
    ({
      'qualifications': {
        ...(details['qualifications'] || {}),
        aLevels
      }
    }));
}

export function addUpdateQualificationsGCSEs(personId, gcses) {
  return changeDetailsFor(personId, details =>
    ({
      'qualifications': {
        ...(details['qualifications'] || {}),
        gcses
      }
    }));
}

export function addUpdateQualificationsOtherWhere(personId, othersWhere) {
  return changeDetailsFor(personId, details =>
    ({
      'qualifications': {
        ...(details['qualifications'] || {}),
        othersWhere
      }
    }));
}

export function addUpdateEmploymentStatus(personId, val) {
  return changeDetailsFor(personId, () =>
    ({
      'employment-status': {
        val
      }
    }));
}

export function addUpdateJobTitle(personId, val) {
  return changeDetailsFor(personId, () =>
    ({
      'job-title': {
        val
      }
    }));
}

export function addUpdateJobDescribe(personId, val) {
  return changeDetailsFor(personId, () =>
    ({
      'job-describe': {
        val
      }
    }));
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

export function personalBookmark(personId, page) {
  return changeDetailsFor(personId, () =>
    ({
      '_bookmark': {
        page
      }
    }));
}

export function getBookmarkFor(personId) {
  return getPersonalDetailsFor(personId)['_bookmark'].page;
}

export function personalQuestionSubmitDecorator(personId, callback, e) {
  personalBookmark(personId, window.location.href);
  callback(e);
}
