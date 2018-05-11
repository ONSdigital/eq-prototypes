import {
  relationshipDescriptionMap,
  addRelationship,
  editRelationship,
  getAllRelationships,
  deleteAllRelationshipsForMember,
  relationshipSummaryTemplates,
  missingRelationshipInference,
  inferRelationships,
  getAllParentsOf,
  getAllChildrenOf,
  getParentIdFromRelationship,
  getChildIdFromRelationship,
  getOtherPersonIdFromRelationship,
  isAChildInRelationship,
  isAParentInRelationship,
  isInRelationship,
  areAnyChildrenInRelationshipNotParent,
  getRelationshipsWithPersonIds,
  getPeopleIdsMissingRelationshipsWithPerson,
  findNextMissingRelationship,
  relationship
} from './assets/relationships';
import {
  HOUSEHOLD_MEMBER_TYPE,
  VISITOR_TYPE,
  USER_HOUSEHOLD_MEMBER_ID,
  HOUSEHOLD_MEMBERS_STORAGE_KEY,
  addHouseholdMember,
  updateHouseholdMember,
  deleteHouseholdMember,
  getAllHouseholdMembers,
  getUserAsHouseholdMember,
  getHouseholdMemberByPersonId,
  updateUserAsHouseholdMember,
  deleteUserAsHouseholdMember,
  isVisitor,
  isOtherHouseholdMember,
  isHouseholdMember,
  person
} from './assets/household';
import {removeFromList} from './assets/utils';

export const USER_STORAGE_KEY = 'user-details';

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

window.ONS = window.ONS || {};
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

  getAllParentsOf,
  getAllChildrenOf,
  getParentIdFromRelationship,
  getChildIdFromRelationship,
  getOtherPersonIdFromRelationship,
  isAParentInRelationship,
  isAChildInRelationship,
  isInRelationship,
  areAnyChildrenInRelationshipNotParent,

  relationshipDescriptionMap,
  relationshipSummaryTemplates,
  missingRelationshipInference,
  inferRelationships,
  getRelationshipsWithPersonIds,
  getPeopleIdsMissingRelationshipsWithPerson,
  findNextMissingRelationship,

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

window.ONS.utils = {
  removeFromList
};

$(populateHouseholdList);
$(populateVisitorList);
$(updateHouseholdVisitorsNavigationItems);
$(updateAddresses);
