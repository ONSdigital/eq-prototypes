export const HOUSEHOLD_MEMBERS_STORAGE_KEY = 'household-members';
export const USER_STORAGE_KEY = 'user-details';
export const USER_HOUSEHOLD_MEMBER_ID = 'person_me';
export const HOUSEHOLD_MEMBER_TYPE = 'household-member';
export const RELATIONSHIPS_STORAGE_KEY = 'relationships';
export const VISITOR_TYPE = 'visitor';

var relationshipTypes = {
  'spouse': {},
  'child-parent': {},
  'grandchild-grandparent': {},
  'sibling': {},
  'partner': {},
  'unrelated': {},
  'other-relation': {}
};

var relationshipDescriptionMap = {
  'husband-wife': {
    sentanceLabel: 'husband or wife',
    type: relationshipTypes['spouse']
  },
  'mother-father': {
    sentanceLabel: 'mother or father',
    type: relationshipTypes['child-parent']
  },
  'son-daughter': {
    sentanceLabel: 'son or daughter',
    type: relationshipTypes['child-parent']
  },
  'grandparent': {
    sentanceLabel: 'grandparent',
    type: relationshipTypes['grandchild-grandparent']
  },
  'grandchild': {
    sentanceLabel: 'grandchild',
    type: relationshipTypes['grandchild-grandparent']
  },
  'brother-sister': {
    sentanceLabel: 'brother or sister',
    type: relationshipTypes['sibling']
  },
  'other-relation': {
    sentanceLabel: 'other type of relation',
    type: relationshipTypes['other-relation']
  },
  'partner': {
    sentanceLabel: 'partner',
    type: relationshipTypes['partner']
  },
  'unrelated': {
    sentanceLabel: 'not related',
    type: relationshipTypes['unrelated']
  }
};

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

  userAsHouseholdMember ? updateHouseholdMember(userAsHouseholdMember['@person'], memberData) : addHouseholdMember(person, memberData, USER_HOUSEHOLD_MEMBER_ID);
}

export function updateHouseholdMember(person, memberData) {
  let membersUpdated = getAllHouseholdMembers().map((member) => {
    return member['@person'].id === person.id
      ? {...member, ...memberData, '@person': {...member['@person'], ...person}}
      : member;
  });

  localStorage.setItem(HOUSEHOLD_MEMBERS_STORAGE_KEY, JSON.stringify(membersUpdated));
}

export function addHouseholdMember(person, memberData, id) {
  let people = getAllHouseholdMembers() || [];
  memberData = memberData || {};

  people.push({
    ...memberData,
    type: memberData.type || HOUSEHOLD_MEMBER_TYPE,
    '@person': {
      ...person,
      id: id || 'person' + autoIncrementId('household-members')
    }
  });

  localStorage.setItem(HOUSEHOLD_MEMBERS_STORAGE_KEY, JSON.stringify(people));
}

function autoIncrementId(collection) {
  let k = collection + '-increment',
    id = parseInt(localStorage.getItem(k)) || 0;

  id++;

  localStorage.setItem(k, JSON.stringify(id));

  return id;
}

export function getAllHouseholdMembers() {
  return JSON.parse(localStorage.getItem(HOUSEHOLD_MEMBERS_STORAGE_KEY)) || [];
}

export function getHouseholdMemberByPersonId(id) {
  return getAllHouseholdMembers().find(function(member) {
    return member['@person'].id === id;
  });
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

export function isVisitor(member) {
  return member.type === window.ONS.storage.KEYS.VISITOR_TYPE;
}

export function isHouseholdMember(member) {
  return member.type === window.ONS.storage.KEYS.HOUSEHOLD_MEMBER_TYPE;
}

export function isOtherHouseholdMember(member) {
  return member.type === window.ONS.storage.KEYS.HOUSEHOLD_MEMBER_TYPE &&
    member['@person'].id !== window.ONS.storage.IDS.USER_HOUSEHOLD_MEMBER_ID;
}

/**
 * Relationships
 */
export function addRelationship(relationshipObj) {
  let householdRelationships = getAllRelationships() || [],
    item = {
      ...relationshipObj,
      id: autoIncrementId('relationships')
    };

  householdRelationships.push(item);

  localStorage.setItem(RELATIONSHIPS_STORAGE_KEY, JSON.stringify(householdRelationships));

  return item;
}

export function editRelationship(relationshipId, valueObject) {
  let householdRelationships = (getAllRelationships() || []).map(function(relationship) {
    return (relationship.id + '') === (relationshipId + '') ? {
      ...valueObject,
      id: relationshipId
    } : relationship;
  });

  localStorage.setItem(RELATIONSHIPS_STORAGE_KEY, JSON.stringify(householdRelationships));
}

export function getAllRelationships() {
  return JSON.parse(localStorage.getItem(RELATIONSHIPS_STORAGE_KEY)) || [];
}

export function deleteAllRelationshipsForMember(memberId) {
  let householdRelationships = getAllRelationships().filter((relationship) => {
    return !(memberId === relationship.personIsId || memberId === relationship.personToId);
  });

  console.log(householdRelationships);

  localStorage.setItem(RELATIONSHIPS_STORAGE_KEY, JSON.stringify(householdRelationships));
}

export function relationship(description, personIsId, personToId) {
  return {
    personIsDescription: description,
    personIsId: personIsId,
    personToId: personToId
  };
}

/**
 * Helpers
 */
function createNavItem(member) {
  var $nodeEl = $('<li class="js-template-nav-item nav__item pluto">' +
    '  <a class="js-template-nav-item-label nav__link" href="#"></a>' +
    '</li>'),
    $linkEl = $nodeEl.find('.js-template-nav-item-label');

  $linkEl.html(member['@person'].fullName);

  if (member['@person'].id === USER_HOUSEHOLD_MEMBER_ID) {
    $linkEl.attr('href', '../what-is-your-name');
  } else {
    $linkEl.attr('href', '../who-else-to-add?edit=' + member['@person'].id);
  }

  return $nodeEl;
}

function updateHouseholdVisitorsNavigationItems() {
  let allHouseholdMembers = window.ONS.storage.getAllHouseholdMembers(),
    householdMembers = allHouseholdMembers.filter(window.ONS.storage.isHouseholdMember),
    visitors = allHouseholdMembers.filter(window.ONS.storage.isVisitor);

  if (householdMembers.length) {
    $.each(householdMembers, function(i, member) {
      $('#navigation-household-members').append(createNavItem(member));
    });
  } else {
    $('#navigation-household-members').parent().hide();
  }

  if (visitors.length) {
    $.each(visitors, function(i, member) {
      $('#navigation-visitors').append(createNavItem(member));
    });
  } else {
    $('#navigation-visitors').parent().hide();
  }
}

function populateList() {
  if (!$('#household-members').length) {
    return;
  }

  let members = getAllHouseholdMembers() || [];

  $('#household-members').empty().append(members.map(function(member) {
    return $('<li>').addClass('mars').text(member['@person'].fullName);
  }));
}

function updateAddresses() {
  let addressLines = (localStorage.getItem('address') || '').split(','),
    addressLine1 = addressLines[0],
    addressLine2 = addressLines[1];

  $('#section-address').html(addressLine1);
  $('.address-text').html(addressLine1 + ', ' + addressLine2);
}

window.ONS = {};
window.ONS.storage = {
  getAddress,
  addHouseholdMember,
  updateHouseholdMember,
  deleteHouseholdMember,
  getAllHouseholdMembers,
  addUserPerson,
  getUserPerson,
  getUserAsHouseholdMember,
  getHouseholdMemberByPersonId,
  updateUserAsHouseholdMember,
  deleteUserAsHouseholdMember,

  isVisitor,
  isOtherHouseholdMember,
  isHouseholdMember,

  addRelationship,
  editRelationship,
  getAllRelationships,
  deleteAllRelationshipsForMember,

  relationshipDescriptionMap,

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
    person,
    relationship
  }
};

$(populateList);
$(updateHouseholdVisitorsNavigationItems);
$(updateAddresses);
