export const HOUSEHOLD_MEMBERS_STORAGE_KEY = 'household-members';
export const USER_STORAGE_KEY = 'user-details';
export const USER_HOUSEHOLD_MEMBER_ID = 'person_me';

export function populateList() {
  if (!$('#household-members').length) {
    return;
  }

  let members = getAllHouseholdMembers() || [];

  $('#household-members').empty().append(members.map(function(member) {
    return $('<li>').addClass('mars').text(member.fullName);
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
  return getAllHouseholdMembers().find((person) => {
    return person.id === USER_HOUSEHOLD_MEMBER_ID;
  });
}

export function deleteUserAsHouseholdMember() {
  deleteHouseholdMember(USER_HOUSEHOLD_MEMBER_ID);
}

export function deleteHouseholdMember(personId) {
  let members = getAllHouseholdMembers().filter((member) => {
    return member.id !== personId;
  });

  localStorage.setItem(HOUSEHOLD_MEMBERS_STORAGE_KEY, JSON.stringify(members));
}

export function updateUserAsHouseholdMember(person) {
  let userAsHouseholdMember = getUserAsHouseholdMember();

  userAsHouseholdMember ? updateHouseholdMember(person) : addHouseholdMember(person, USER_HOUSEHOLD_MEMBER_ID);
}

export function updateHouseholdMember(person) {
  let members = getAllHouseholdMembers().map((member) => {
    return member.id === USER_HOUSEHOLD_MEMBER_ID ? { ...member, ...person } : member;
  });

  localStorage.setItem(HOUSEHOLD_MEMBERS_STORAGE_KEY, JSON.stringify(members));
}

export function addHouseholdMember(person, id) {
	var people = getAllHouseholdMembers() || [];

	people.push({
		id: id || 'person' + people.length,
		...person
	});

	localStorage.setItem(HOUSEHOLD_MEMBERS_STORAGE_KEY, JSON.stringify(people));
}

export function getAllHouseholdMembers() {
  return JSON.parse(localStorage.getItem(HOUSEHOLD_MEMBERS_STORAGE_KEY)) || [];
}

export function person(opts) {
  if (opts.firstName === '' || opts.lastName === '') {
    throw Error('Unable to create person with data: ', opts.firstName, !opts.middleName, !opts.lastName);
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
    USER_STORAGE_KEY
  },

  IDS: {
    USER_HOUSEHOLD_MEMBER_ID
  },

  TYPES: {
    person
  }
};

$(populateList);
