export const HOUSEHOLD_MEMBERS_STORAGE_KEY = 'household-members';
export const USER_STORAGE_KEY = 'user-details';
export const USER_HOUSEHOLD_MEMBER_ID = 'person_me';
export const HOUSEHOLD_MEMBER_TYPE = 'household-member';
export const RELATIONSHIPS_STORAGE_KEY = 'relationships';
export const VISITOR_TYPE = 'visitor';

let relationshipTypes = {
  'spouse': {},
  'child-parent': {},
  'step-child-parent': {},
  'grandchild-grandparent': {},
  'sibling': {},
  'step-brother-sister': {},
  'partner': {},
  'unrelated': {},
  'other-relation': {}
};

let relationshipDescriptionMap = {
  'husband-wife': {
    sentanceLabel: 'husband or wife',
    type: relationshipTypes['spouse']
  },
  'mother-father': {
    sentanceLabel: 'mother or father',
    type: relationshipTypes['child-parent']
  },
  'step-mother-father': {
    sentanceLabel: 'step-mother or step-father',
    type: relationshipTypes['step-child-parent']
  },
  'son-daughter': {
    sentanceLabel: 'son or daughter',
    type: relationshipTypes['child-parent']
  },
  'step-child': {
    sentanceLabel: 'step-child',
    type: relationshipTypes['step-child-parent']
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
  'step-brother-sister': {
    sentanceLabel: 'step-brother or step-sister',
    type: relationshipTypes['step-brother-sister']
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
  let addressLines = sessionStorage.getItem('address').split(',');

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
  sessionStorage.setItem(USER_STORAGE_KEY, JSON.stringify(person));
}

export function getUserPerson() {
  return JSON.parse(sessionStorage.getItem(USER_STORAGE_KEY));
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

  sessionStorage.setItem(HOUSEHOLD_MEMBERS_STORAGE_KEY,
    JSON.stringify(members));
}

export function updateUserAsHouseholdMember(person, memberData) {
  let userAsHouseholdMember = getUserAsHouseholdMember();

  userAsHouseholdMember
    ? updateHouseholdMember(userAsHouseholdMember['@person'], memberData)
    : addHouseholdMember(person, memberData, USER_HOUSEHOLD_MEMBER_ID);
}

export function updateHouseholdMember(person, memberData) {
  let membersUpdated = getAllHouseholdMembers().map((member) => {
    return member['@person'].id === person.id
      ? {...member, ...memberData, '@person': {...member['@person'], ...person}}
      : member;
  });

  sessionStorage.setItem(HOUSEHOLD_MEMBERS_STORAGE_KEY,
    JSON.stringify(membersUpdated));
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

  sessionStorage.setItem(HOUSEHOLD_MEMBERS_STORAGE_KEY, JSON.stringify(people));
}

export function getAllHouseholdMembers() {
  return JSON.parse(sessionStorage.getItem(HOUSEHOLD_MEMBERS_STORAGE_KEY)) || [];
}

export function getHouseholdMemberByPersonId(id) {
  return getAllHouseholdMembers().find(function(member) {
    return member['@person'].id === id;
  });
}

export function person(opts) {
  if (opts.firstName === '' || opts.lastName === '') {
    console.log('Unable to create person with data: ',
      opts.firstName,
      !opts.middleName,
      !opts.lastName);
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

  sessionStorage.setItem(RELATIONSHIPS_STORAGE_KEY,
    JSON.stringify(householdRelationships));

  return item;
}

export function editRelationship(relationshipId, valueObject) {
  let householdRelationships = (getAllRelationships() || []).map(function(relationship) {
    return (relationship.id + '') === (relationshipId + '') ? {
      ...valueObject,
      id: relationshipId
    } : relationship;
  });

  sessionStorage.setItem(RELATIONSHIPS_STORAGE_KEY,
    JSON.stringify(householdRelationships));
}

export function getAllRelationships() {
  return JSON.parse(sessionStorage.getItem(RELATIONSHIPS_STORAGE_KEY)) || [];
}

export function deleteAllRelationshipsForMember(memberId) {
  const householdRelationships = getAllRelationships()
    .filter((relationship) => {
      return !(memberId === relationship.personIsId || memberId === relationship.personToId);
    });

  sessionStorage.setItem(RELATIONSHIPS_STORAGE_KEY,
    JSON.stringify(householdRelationships));
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
  let $nodeEl = $('<li class="js-template-nav-item nav__item pluto">' +
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

  const $navigationHouseholdMembersEl = $('#navigation-household-members'),
    $navigationVisitorsEl = $('#navigation-visitors');

  if (householdMembers.length) {
    $.each(householdMembers, function(i, member) {
      $navigationHouseholdMembersEl.append(createNavItem(member));
    });
  } else {
    $navigationHouseholdMembersEl.parent().hide();
  }

  if (visitors.length) {
    $.each(visitors, function(i, member) {
      $navigationVisitorsEl.append(createNavItem(member));
    });
  } else {
    $navigationVisitorsEl.parent().hide();
  }
}

function createListItemPerson(member) {
  return $('<li class="list__item">').addClass('mars').html(
    '<span class="list__item-name">' + member['@person'].fullName + '</span>'
  );
}

function populateHouseholdList() {
  const $el = $('#household-members');

  if (!$el.length) {
    return;
  }

  let members = getAllHouseholdMembers() || [];

  $el.empty().append(members.filter((member) => {
    return member.type === HOUSEHOLD_MEMBER_TYPE;
  }).map(createListItemPerson));

  $el.addClass('list list--people-plain');
}

function populateVisitorList() {
  const $el = $('#visitors-list');

  if (!$el.length) {
    return;
  }

  let members = getAllHouseholdMembers() || [];

  $el.empty().append(members.filter((member) => {
    return member.type === VISITOR_TYPE;
  }).map(createListItemPerson));

  $el.addClass('list list--people-plain');
}

function updateAddresses() {
  let addressLines = (sessionStorage.getItem('address') || '').split(','),
    addressLine1 = addressLines[0],
    addressLine2 = addressLines[1];

  $('#section-address').html(addressLine1);
  $('.address-text').html(addressLine1 + ', ' + addressLine2);
}

function autoIncrementId(collection) {
  let k = collection + '-increment',
    id = parseInt(sessionStorage.getItem(k)) || 0;

  id++;

  sessionStorage.setItem(k, JSON.stringify(id));

  return id;
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

window.ONS.helpers = {
  populateHouseholdList,
  populateVisitorList
};

$(populateHouseholdList);
$(populateVisitorList);
$(updateHouseholdVisitorsNavigationItems);
$(updateAddresses);
