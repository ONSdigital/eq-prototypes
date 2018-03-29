export const HOUSEHOLD_MEMBERS_STORAGE_KEY = 'household-members';
export const USER_STORAGE_KEY = 'user-details';
export const USER_HOUSEHOLD_MEMBER_ID = 'person_me';
export const HOUSEHOLD_MEMBER_TYPE = 'household-member';
export const VISITOR_TYPE = 'visitor';

export function populateList() {
  if (!$('#household-members').length) {
    return;
  }

  let members = getAllHouseholdMembers() || [];

  $('#household-members').empty().append(members.map(function(member) {
    return $('<li>').addClass('mars').text(member['@person'].fullName);
  }));
}

export function getAddress() {
  let addressLines = localStorage.getItem('address').split(',');

  return {
    addressLine1: addressLines[0],
    addressLine2: addressLines[1],
    addressLine3: addressLines[2],
    addressCounty: addressLines[4],
    addressTownCity: addressLines[3],
    addressPostcode: addressLines[5]
  }
}

/**
 * User
 */
export function addUserPerson(person) {
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(person));
}

export function getUserPerson() {
  return JSON.parse(localStorage.getItem(USER_STORAGE_KEY));
}

/**
 * Household
 */
export function getUserAsHouseholdMember() {
  return getAllHouseholdMembers().find((member) => {
    return member['@person'].id === USER_HOUSEHOLD_MEMBER_ID;
  });
}

export function deleteUserAsHouseholdMember() {
  deleteHouseholdMember(USER_HOUSEHOLD_MEMBER_ID);
}

export function deleteHouseholdMember(personId) {
  let members = getAllHouseholdMembers().filter((member) => {
    return member['@person'].id !== personId;
  });

  localStorage.setItem(HOUSEHOLD_MEMBERS_STORAGE_KEY, JSON.stringify(members));
}

export function updateUserAsHouseholdMember(person, memberData) {
  let userAsHouseholdMember = getUserAsHouseholdMember();

  userAsHouseholdMember ? updateHouseholdMember(person, memberData) : addHouseholdMember(person, memberData, USER_HOUSEHOLD_MEMBER_ID);
}

export function updateHouseholdMember(person, memberData) {
  let members = getAllHouseholdMembers().map((member) => {
    return member['@person'].id === USER_HOUSEHOLD_MEMBER_ID
      ? {...member, ...memberData, '@person': {...member['@person'], ...person}}
      : member;
  });

  localStorage.setItem(HOUSEHOLD_MEMBERS_STORAGE_KEY, JSON.stringify(members));
}

export function addHouseholdMember(person, memberData, id) {
  let people = getAllHouseholdMembers() || [];
  memberData = memberData || {};

  people.push({
    ...memberData,
    type: memberData.type || HOUSEHOLD_MEMBER_TYPE,
    '@person': {
      ...person,
      id: id || 'person' + people.length
    }
  });

  localStorage.setItem(HOUSEHOLD_MEMBERS_STORAGE_KEY, JSON.stringify(people));
}

export function getAllHouseholdMembers() {
  return JSON.parse(localStorage.getItem(HOUSEHOLD_MEMBERS_STORAGE_KEY)) || [];
}

export function person(opts) {
  if (opts.firstName === '' || opts.lastName === '') {
    console.log('Unable to create person with data: ', opts.firstName, !opts.middleName, !opts.lastName);
  }

  let middleName = opts.middleName || '';

  return {
    fullName: opts.firstName + ' ' + middleName + ' ' + opts.lastName,
    firstName: opts.firstName,
    middleName,
    lastName: opts.lastName
  };
}

window.ONS = {};
window.ONS.storage = {
  getAddress,
  addHouseholdMember,
  getAllHouseholdMembers,
  addUserPerson,
  getUserPerson,
  getUserAsHouseholdMember,
  updateUserAsHouseholdMember,
  deleteUserAsHouseholdMember,

  KEYS: {
    HOUSEHOLD_MEMBERS_STORAGE_KEY,
    USER_STORAGE_KEY,
    HOUSEHOLD_MEMBER_TYPE,
    VISITOR_TYPE
  },

  IDS: {
    USER_HOUSEHOLD_MEMBER_ID
  },

  TYPES: {
    person
  }
};

$(populateList);
