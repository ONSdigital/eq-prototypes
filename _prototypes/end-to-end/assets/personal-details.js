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
  },
  'none': {
    description: 'None'
  }
};

export const personalDetailsEthnicGroupMap = {
  'White': {
    'question': 'White',
    'options': [
      {
        val: 'British',
        label: 'English, Welsh, Scottish, Northern Irish or British'
      },
      {
        val: 'Irish',
        label: 'Irish'
      },
      {
        val: 'Gypsy',
        label: 'Gypsy or Irish Traveler'
      },
      {
        val: 'Roma',
        label: 'Roma'
      },
      {
        val: 'Other',
        label: 'Any other White background',
        description: 'You can enter your ethnic group or background on the next question'
      }
    ]
  },
  'Mixed': {
    'question': 'Mixed or Multiple',
    'options': [
      {
        val: 'White and Black Caribbean',
        label: 'White and Black Caribbean'
      },
      {
        val: 'White and Black African',
        label: 'White and Black African'
      },
      {
        val: 'White and Asian',
        label: 'White and Asian'
      },
      {
        val: 'Other',
        label: 'Any other Mixed or Multiple background',
        description: 'You can enter your ethnic group or background on the next question'
      }
    ]
  },
  'Asian': {
    'question': 'Asian or Asian British',
    'options': [
      {
        val: 'Indian',
        label: 'Indian'
      },
      {
        val: 'Pakistani',
        label: 'Pakistani'
      },
      {
        val: 'Bangladeshi',
        label: 'Bangladeshi'
      },
      {
        val: 'Chinese',
        label: 'Chinese'
      },
      {
        val: 'Other',
        label: 'Any other Asian ethnic group or background',
        description: 'You can enter your ethnic group or background on the next question'
      }
    ]
  },
  'Black': {
    'question': 'Black, Black British, Caribbean or African',
    'questionAfrican': 'African',
    'questionWithoutAfrican': 'Black, Black British or Caribbean',
    'options': [
      {
        val: 'Caribbean',
        label: 'Caribbean'
      },
      {
        val: 'African',
        label: 'African',
        description: 'You can enter your ethnic group or background on the next question'
      },
      {
        val: 'Other',
        label: 'Any other Black, Black British or Caribbean background',
        description: 'You can enter your ethnic group or background on the next question'
      }
    ]
  },
  'Other': {
    'question': 'other',
    'options': [
      {
        val: 'Arab',
        label: 'Arab'
      },
      {
        val: 'Other',
        label: 'Any other ethnic group',
        description: 'You can enter your ethnic group or background on the next question'
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
  },
  'not-employed': {
    description: 'Not employed'
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

export function addUpdatePersonalDetailsDOB(personId, day, month, year, question, url) {
  let fullDate = day + "/" + month + "/" + year
  return changeDetailsFor(personId, () =>
    ({
      'dob': {
        day,
        month,
        year,
        fullDate,
        question,
        url
      }
    }));
}

export function addUpdateMaritalStatus(personId, val, question, url) {
  return changeDetailsFor(personId, () =>
    ({
      'maritalStatus': {
        val,
        question,
        url
      }
    }));
}

export function addUpdate30DayAddressUk(personId, val, question, url) {
  let address = val.address
  return changeDetailsFor(personId, () =>
    ({
      'Address30DayUK': {
        address,
        val,
        question,
        url
      }
    }));
}

export function addUpdate30DayAddressType(personId, val, question, url) {
  return changeDetailsFor(personId, () =>
    ({
      'Address30DayType': {
        val,
        question,
        url
      }
    }));
}

export function addUpdate30DayCountry(personId, value, question, url) {
  return changeDetailsFor(personId, details =>
    ({
      'Address30DayCountry': {
        ...(details['Address30DayCountry'] || {}),
        value,
        question,
        url
      }
    }));
}

export function addUpdateCountry(personId, val, question, url) {
  return changeDetailsFor(personId, details =>
    ({
      'country': {
        ...(details['country'] || {}),
        val,
        question,
        url
      }
    }));
}

export function addUpdateCountryOther(personId, valOther, questionOther, urlOther) {
  return changeDetailsFor(personId, details =>
    ({
      'country': {
        ...(details['country'] || {}),
        valOther,
        questionOther,
        urlOther
      }
    }));
}

export function addUpdateCountryOtherArrive(personId, month, year, question, url) {
  let fullDate = month + "/" + year
  return changeDetailsFor(personId, () =>
    ({
      'dateArriveUk': {
        month,
        year,
        fullDate,
        question,
        url
      }
    }));
}

export function addUpdateCountryOtherArriveCensus(personId, val, question, url) {
  return changeDetailsFor(personId, () =>
    ({
      'arriveCensusDay': {
        val,
        question,
        url
      }
    }));
}

export function addUpdateCountryOtherStay(personId, val, question, url) {
  return changeDetailsFor(personId, () =>
    ({
      'stayInUk': {
        val,
        question,
        url
      }
    }));
}

export function addUpdateNationalIdentity(personId, collection, question, url) {
  return changeDetailsFor(personId, () =>
    ({
      'nationalIdentity': {
        collection,
        question,
        url
      }
    }));
}

export function addUpdateNationalIdentityOther(personId, niOther, questionOther, urlOther) {
  return changeDetailsFor(personId, details =>
  ({
    'nationalIdentity': {
      ...(details['nationalIdentity'] || {}),
      niOther,
      questionOther,
      urlOther
    }
  }));
}

export function addUpdateEthnicGroup(personId, val, question, url) {
  return changeDetailsFor(personId, () =>
    ({
      'ethnicGroup': {
        val,
        question,
        url
      }
    }));
}

export function addUpdateEthnicGroupDescription(personId, description, questionDescription, urlDescription) {
  return changeDetailsFor(personId, details =>
  ({
    'ethnicGroup': {
      ...(details['ethnicGroup'] || {}),
      description,
      questionDescription,
      urlDescription
    }
  }));
}

export function addUpdateEthnicGroupOther(personId, otherText, questionOther, urlOther) {
  return changeDetailsFor(personId, details =>
    ({
      'ethnicGroup': {
        ...(details['ethnicGroup'] || {}),
        otherText,
        questionOther,
        urlOther
      }
    }));
}

export function addUpdateReligion(personId, description, question, url) {
  return changeDetailsFor(personId, details =>
    ({
      'religion': {
        ...(details['religion'] || {}),
        ...{ description },
        question,
        url
      }
    }));
}

export function addUpdateReligionOther(personId, descriptionOther, questionOther, urlOther) {
  return changeDetailsFor(personId, details =>
    ({
      'religion': {
        ...(details['religion'] || {}),
        ...{ descriptionOther },
        questionOther,
        urlOther
      }
    }));
}

export function addUpdateLanguage(personId, lang, question, url) {
  return changeDetailsFor(personId, details =>
  ({
    'language': {
      ...(details['language'] || {}),
      ...{ lang },
      question,
      url
    }
  }));
}

export function addUpdateLanguageOther(personId, other, questionOther, urlOther) {
  return changeDetailsFor(personId, details =>
  ({
    'language': {
      ...(details['language'] || {}),
      ...{ other },
      questionOther,
      urlOther
    }
  }));
}

export function addUpdateLanguageEnglish(personId, english, questionEnglishLevel, urlEnglishLevel) {
  return changeDetailsFor(personId, details =>
  ({
    'language': {
      ...(details['language'] || {}),
      ...{ english },
      questionEnglishLevel,
      urlEnglishLevel
    }
  }));
}

export function addUpdatePassportCountry(personId, countries, question, url) {
  return changeDetailsFor(personId, details =>
    ({
      'passport': {
        ...(details['passport'] || {}),
        countries,
        question,
        url
      }
    }));
}

export function addUpdatePassportCountryOther(personId, otherText, questionOther, urlOther) {
  return changeDetailsFor(personId, details =>
    ({
      'passport': {
        ...(details['passport'] || {}),
        otherText,
        questionOther,
        urlOther
      }
    }));
}

export function addUpdateHealth(personId, val, question, url) {
  return changeDetailsFor(personId, details =>
    ({
      'health': {
        ...(details['health'] || {}),
        val,
        question,
        url
      }
    }));
}

export function addUpdateHealthConditions(personId, conditions, questionConditions, urlConditions) {
  return changeDetailsFor(personId, details =>
    ({
      'health': {
        ...(details['health'] || {}),
        conditions,
        questionConditions,
        urlConditions
      }
    }));
}

export function addUpdateHealthConditionsAbilities(personId, abilities, questionAbilities, urlAbilities) {
  return changeDetailsFor(personId, details =>
    ({
      'health': {
        ...(details['health'] || {}),
        abilities,
        questionAbilities,
        urlAbilities
      }
    }));
}

export function addUpdateHealthSupport(personId, amount, questionSupport, urlSupport) {
  return changeDetailsFor(personId, details =>
    ({
      'health': {
        ...(details['health'] || {}),
        amount,
        questionSupport,
        urlSupport
      }
    }));
}

export function addUpdateOrientation(personId, val, question, url) {
  return changeDetailsFor(personId, () =>
    ({
      'orientation': {
        val,
        question,
        url
      }
    }));
}

export function addUpdateIdentity(personId, val, question, url) {
  return changeDetailsFor(personId, () =>
    ({
      'identity': {
        val,
        question,
        url
      }
    }));
}

export function addUpdateSalary(personId, val, question, url) {
  return changeDetailsFor(personId, () =>
    ({
      'salary': {
        val,
        question,
        url
      }
    }));
}

export function addUpdateSex(personId, val, question, url) {
  return changeDetailsFor(personId, () =>
    ({
      'sex': {
        val,
        question,
        url
      }
    }));
}

export function addUpdateSchool(personId, val, question, url) {
  return changeDetailsFor(personId, () =>
    ({
      'school': {
        val,
        question,
        url
      }
    }));
}

export function addUpdateStudent(personId, val, question, url) {
  return changeDetailsFor(personId, () =>
    ({
      'student': {
        val,
        question,
        url
      }
    }));
}

export function addUpdateStudentAddaddressInUK(personId, val, question, url) {
  return changeDetailsFor(personId, () =>
    ({
      'studentAddressInUK': {
        val,
        question,
        url
      }
    }));
}

export function addUpdateStudentAddress(personId, val, question, url) {
  return changeDetailsFor(personId, () =>
    ({
      'studentAddress': {
        val,
        question,
        url
      }
    }));
}

export function addUpdateStudentAddressUk(personId, val, question, url) {
  let address = val.addressLine1 + ', ' + val.addressLine2
  return changeDetailsFor(personId, () =>
    ({
      'AddressStudentUK': {
        address,
        val,
        question,
        url
      }
    }));
}

export function addUpdateStudentAddressCountry(personId, val, question, url) {
  return changeDetailsFor(personId, details =>
    ({
      'AddressStudentCountry': {
        ...(details['AddressStudentCountry'] || {}),
        val,
        question,
        url
      }
    }));
}

export function addUpdateAddressWhere(personId, val, question, url) {
  return changeDetailsFor(personId, () =>
    ({
      'addressWhere': {
        val,
        question,
        url
      }
    }));
}

export function addUpdateYearAgoAddress(personId, val, question, url) {
  return changeDetailsFor(personId, () =>
    ({
      'yearAgoAddress': {
        val,
        question,
        url
      }
    }));
}

export function addUpdateYearAgoAddressUk(personId, val, question, url) {
  return changeDetailsFor(personId, () =>
    ({
      'yearAgoAddressUK': {
        val,
        question,
        url
      }
    }));
}

export function addUpdateYearAgoAddressCountry(personId, value, question, url) {
  return changeDetailsFor(personId, details =>
    ({
      'yearAgoAddressCountry': {
        ...(details['yearAgoAddressCountry'] || {}),
        value,
        question,
        url
      }
    }));
}

export function addUpdateAge(personId, age) {
  return changeDetailsFor(personId, () =>
    ({
      'age': age
    }));
}

export function addUpdateAgeConfirm(personId, val, question, url) {
  return changeDetailsFor(personId, () =>
    ({
      'ageConfirm': {
        val,
        question,
        url
      }
    }));
}

export function addUpdateAddressOutsideUK(personId, val, question, url) {
  return changeDetailsFor(personId, () =>
    ({
      'addressOutsideUk': {
        val,
        question,
        url
      }
    }));
}

export function addUpdateAddressIndividual(personId, val, question, url) {
  return changeDetailsFor(personId, () =>
    ({
      'address': {
        val,
        question,
        url
      }
    }));
}

export function addUpdateApprenticeship(personId, hasApprenticeship, question, url) {
  return changeDetailsFor(personId, () =>
    ({
      'apprenticeship': {
        hasApprenticeship,
        question,
        url
      }
    }));
}

export function addUpdateHasQualificationAbove(personId, aboveDegree, questionAbove, urlAbove) {
  return changeDetailsFor(personId, details =>
    ({
      'qualifications': {
        ...(details['qualifications'] || {}),
        aboveDegree,
        questionAbove,
        urlAbove
      }
    }));
}

export function addUpdateQualificationsNvqEquivalent(personId, nvqEquivalent, questionNvqEquivalent, urlNvqEquivalent) {
  return changeDetailsFor(personId, details =>
    ({
      'qualifications': {
        ...(details['qualifications'] || {}),
        nvqEquivalent,
        questionNvqEquivalent,
        urlNvqEquivalent
      }
    }));
}

export function addUpdateQualificationsALevel(personId, aLevels, questionALevel, urlALevel) {
  return changeDetailsFor(personId, details =>
    ({
      'qualifications': {
        ...(details['qualifications'] || {}),
        aLevels,
        questionALevel,
        urlALevel
      }
    }));
}

export function addUpdateQualificationsGCSEs(personId, gcses, questionGCSEs, urlGCSEs) {
  return changeDetailsFor(personId, details =>
    ({
      'qualifications': {
        ...(details['qualifications'] || {}),
        gcses,
        questionGCSEs,
        urlGCSEs
      }
    }));
}

export function addUpdateQualificationsOtherWhere(personId, othersWhere, questionOtherWhere, urlOtherWhere) {
  return changeDetailsFor(personId, details =>
    ({
      'qualifications': {
        ...(details['qualifications'] || {}),
        othersWhere,
        questionOtherWhere,
        urlOtherWhere
      }
    }));
}

export function addUpdateArmedForces(personId, val, question, url) {
  return changeDetailsFor(personId, () =>
    ({
      'armedForces': {
        val,
        question,
        url
      }
    }));
}

export function addUpdateLastSevenDays(personId, sevenDaysAgo, question, url) {
  return changeDetailsFor(personId, details =>
    ({
      'employment': {
        ...(details['employment'] || {}),
        sevenDaysAgo,
        question,
        url
      }
    }));
}

export function addUpdateLastSevenDaysDescription(personId, description, questionSevenDaysDescription, urlSevenDaysDescription) {
  return changeDetailsFor(personId, details =>
    ({
      'employment': {
        ...(details['employment'] || {}),
        description,
        questionSevenDaysDescription,
        urlSevenDaysDescription
      }
    }));
}

export function addUpdateEmploymentFourWeeks(personId, fourWeeksAgo, questionFourWeeks, urlFourWeeks) {
  return changeDetailsFor(personId, details =>
    ({
      'employment': {
        ...(details['employment'] || {}),
        fourWeeksAgo,
        questionFourWeeks,
        urlFourWeeks
      }
    }));
}

export function addUpdateEmploymentAvailableTwoWeeks(personId, availableInTwoWeeks, questionAvailableTwoWeeks, urlAvailableTwoWeeks) {
  return changeDetailsFor(personId, details =>
    ({
      'employment': {
        ...(details['employment'] || {}),
        availableInTwoWeeks,
        questionAvailableTwoWeeks,
        urlAvailableTwoWeeks
      }
    }));
}

export function addUpdateEmploymentPaidWorkConfirm(personId, paidWorkConfirm, questionPaidWorkConfirm, urlPaidWorkConfirm) {
  return changeDetailsFor(personId, details =>
    ({
      'employment': {
        ...(details['employment'] || {}),
        paidWorkConfirm,
        questionPaidWorkConfirm,
        urlPaidWorkConfirm
      }
    }));
}

export function addUpdateEmploymentAcceptedJob(personId, acceptedJob, questionAcceptedJob, urlAcceptedJob) {
  return changeDetailsFor(personId, details =>
    ({
      'employment': {
        ...(details['employment'] || {}),
        acceptedJob,
        questionAcceptedJob,
        urlAcceptedJob
      }
    }));
}

export function addUpdateEmploymentStatus(personId, status, questionStatus, urlStatus) {
  return changeDetailsFor(personId, details =>
    ({
      'employment': {
        ...(details['employment'] || {}),
        status,
        questionStatus,
        urlStatus
      }
    }));
}

export function addUpdateEmploymentName(personId, name, questionName, urlName) {
  return changeDetailsFor(personId, details =>
    ({
      'employment': {
        ...(details['employment'] || {}),
        name,
        questionName,
        urlName
      }
    }));
}

export function addUpdateEmploymentJobTitle(personId, jobTitle, questionJobTitle, urlJobTitle) {
  return changeDetailsFor(personId, details =>
    ({
      'employment': {
        ...(details['employment'] || {}),
        jobTitle,
        questionJobTitle,
        urlJobTitle
      }
    }));
}

export function addUpdateEmploymentJobDescription(personId, jobDescription, questionJobDescription, urlJobDescription) {
  return changeDetailsFor(personId, details =>
    ({
      'employment': {
        ...(details['employment'] || {}),
        jobDescription,
        questionJobDescription,
        urlJobDescription
      }
    }));
}

export function addUpdateEmploymentBusinessActivity(personId, businessActivity, questionBusinessActivity, urlBusinessActivity) {
  return changeDetailsFor(personId, details =>
    ({
      'employment': {
        ...(details['employment'] || {}),
        businessActivity,
        questionBusinessActivity,
        urlBusinessActivity
      }
    }));
}

export function addUpdateEmploymentResponsibilities(personId, responsibilities, questionResponsibilities, urlResponsibilities) {
  return changeDetailsFor(personId, details =>
    ({
      'employment': {
        ...(details['employment'] || {}),
        responsibilities,
        questionResponsibilities,
        urlResponsibilities
      }
    }));
}

export function addUpdateEmploymentHoursWorked(personId, hours, questionHoursWorked, urlHoursWorked) {
  return changeDetailsFor(personId, details =>
    ({
      'employment': {
        ...(details['employment'] || {}),
        hours,
        questionHoursWorked,
        urlHoursWorked
      }
    }));
}

export function addUpdateEmploymentTravel(personId, modeOfTravel, questionEmploymentTravel, urlEmploymentTravel) {
  return changeDetailsFor(personId, details =>
    ({
      'employment': {
        ...(details['employment'] || {}),
        modeOfTravel,
        questionEmploymentTravel,
        urlEmploymentTravel
      }
    }));
}

export function addUpdateEmploymentMainlyWork(personId, mainlyWork, questionMainlyWork, urlMainlyWork) {
  return changeDetailsFor(personId, details =>
    ({
      'employment': {
        ...(details['employment'] || {}),
        mainlyWork,
        questionMainlyWork,
        urlMainlyWork
      }
    }));
    
}

export function addUpdateEmploymentWorkUK(personId, workUK, questionWorkUK, urlWorkUK) {
  return changeDetailsFor(personId, details =>
    ({
      'employment': {
        ...(details['employment'] || {}),
        workUK,
        questionWorkUK,
        urlWorkUK
      }
    }));
}

export function addUpdateEmploymentOutsideUK(personId, workOutsideUK, questionWorkOutsideUK, urlWorkOutsideUK) {
  return changeDetailsFor(personId, details =>
    ({
      'employment': {
        ...(details['employment'] || {}),
        workOutsideUK,
        questionWorkOutsideUK,
        urlWorkOutsideUK
      }
    }));
}

export function addUpdateEmploymentWorkplaceAddress(personId, workAddress, questionWorkplaceAddress, urlWorkplaceAddress) {
  return changeDetailsFor(personId, details =>
    ({
      'employment': {
        ...(details['employment'] || {}),
        workAddress,
        questionWorkplaceAddress,
        urlWorkplaceAddress
      }
    }));
}

export function addUpdateVisitorComplete(personId, val) {
  return changeDetailsFor(personId, () =>
    ({
      'complete': {
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
  const storageObj = getAllPersonalDetails(),
    personObj = storageObj[personId];

  if (!personObj) {
    console.log('Personal details for ' + personId + ' not found');
  }

  return personObj;
}

export function removePersonalDetailsFor(personId) {
  const storageObj = getAllPersonalDetails();

  delete storageObj[personId];

  sessionStorage.setItem(PERSONAL_DETAILS_KEY, JSON.stringify(storageObj));
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

export function setProxy(personId, proxy) {
  return changeDetailsFor(personId, () =>
    ({
      proxy
    }));
}

export function getProxyFor(personId) {
  if (getPersonalDetailsFor(personId)) {
    return getPersonalDetailsFor(personId)['proxy'];
  }
}

export function clearProxy(personId) {
  let details = getPersonalDetailsFor(personId);

  delete details.proxy;

  updatePersonalDetails(personId, {
    ...details
  });

  return details;
}
