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

export const personalDetailsNationalIdentityMap = {
  'english': {
    description: 'English'
  },
  'welsh': {
    description: 'Welsh'
  },
  'scottish': {
    description: 'Scottish'
  },
  'northern-irish': {
    description: 'Northern Irish'
  },
  'british': {
    description: 'British'
  }
};

export const personalDetailsPassportCountriesMap = {
  'united-kingdom': {
    description: 'United Kingdom'
  },
  'ireland': {
    description: 'Ireland'
  }
};

export const personalDetailsEthnicGroupMap = {
  'white': {
    'question': 'White',
    'options': [
      {
        val: 'british',
        label: 'English, Welsh, Scottish, Northern Irish or British'
      },
      {
        val: 'irish',
        label: 'Irish'
      },
      {
        val: 'gypsy',
        label: 'Gypsy or Irish Traveler'
      },
      {
        val: 'roma',
        label: 'Roma'
      },
      {
        val: 'other',
        label: 'Other White ethnic group or background'
      }
    ]
  },
  'mixed': {
    'question': 'Mixed or Multiple',
    'options': [
      {
        val: 'white-black-caribbean',
        label: 'White and Black Caribbean'
      },
      {
        val: 'white-black-african',
        label: 'White and Black African'
      },
      {
        val: 'white-asian',
        label: 'White and Asian'
      },
      {
        val: 'other',
        label: 'Any other Mixed or Multiple background'
      }
    ]
  },
  'asian': {
    'question': 'Asian or Asian British',
    'options': [
      {
        val: 'indian',
        label: 'Indian'
      },
      {
        val: 'pakistani',
        label: 'Pakistani'
      },
      {
        val: 'bangladeshi',
        label: 'Bangladeshi'
      },
      {
        val: 'chinese',
        label: 'Chinese'
      },
      {
        val: 'other',
        label: 'Other Asian ethnic group or background'
      }
    ]
  },
  'black': {
    'question': 'Black, African, Caribbean or Black British',
    'options': [
      {
        val: 'african',
        label: 'African'
      },
      {
        val: 'caribbean',
        label: 'Caribbean'
      },
      {
        val: 'other',
        label: 'Any other Black, African or Caribbean background'
      }
    ]
  },
  'other': {
    'question': 'Other',
    'options': [
      {
        val: 'arab',
        label: 'Arab'
      },
      {
        val: 'other',
        label: 'Any other ethnic group'
      }
    ]
  }
};

export const personalDetailsApprenticeshipMap = {
  'yes': {
    description: 'Yes'
  },
  'no': {
    description: 'No'
  }
};

export const personalDetailsDegreeAboveMap = {
  'yes': {
    description: 'Yes'
  },
  'no': {
    description: 'No'
  }
};

export const personalDetailsNVQMap = {
  'nvq-level-1': {
    description: 'NVQ level 1 or equivalent'
  },
  'nvq-level-2': {
    description: 'NVQ level 2 or equivalent'
  },
  'nvq-level-3': {
    description: 'NVQ level 3 or equivalent'
  },
  'none': {
    description: 'None'
  }
};

export const personalDetailsALevelMap = {
  'a-level-2': {
    description: '2 or more A levels'
  },
  'a-level-1-btec': {
    description: '1 A level'
  },
  'a-level-1': {
    description: '1 AS level'
  },
  'baccalaureate': {
    description: 'Advanced Welsh Baccalaureate'
  },
  'none': {
    description: 'None'
  }
};

export const personalDetailsGCSEMap = {
  'gcse-5': {
    description: '5 or more GCSEs grades A* to C or 9 to 4'
  },
  'other-gcses': {
    description: 'Any other GCSEs'
  },
  'basic-skills': {
    description: 'Basic skills course'
  },
  'national-baccalaureate': {
    description: 'National Welsh Baccalaureate'
  },
  'foundation-baccalaureate': {
    description: 'Foundation Welsh Baccalaureate'
  },
  'none': {
    description: 'None of these apply'
  }
};

export const personalDetailsOtherWhere = {
  'in-england-wales': {
    description: 'Yes, in England or Wales'
  },
  'outside-england-wales': {
    description: 'Yes, anywhere outside of England and Wales'
  },
  'none': {
    description: 'No qualifications'
  }
};

export const personalDetailsEmploymentStatus = {
  'employee': {
    description: 'Employee'
  },
  'freelance-without-employees': {
    description: 'Self-employed or freelance without employees'
  },
  'freelance-with-employees': {
    description: 'Self-employed with employees'
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
  const urlParams = new URLSearchParams(window.location.search),
    isEditing = urlParams.get('edit');

  !isEditing
    ? personalBookmark(personId, window.location.href)
    : clearPersonalBookmark(personId);

  callback(e);
}

export function clearPersonalBookmark(personId) {
  let details = getPersonalDetailsFor(personId);

  delete details._bookmark;

  updatePersonalDetails(personId, {
    ...details
  });

  return details;
}
