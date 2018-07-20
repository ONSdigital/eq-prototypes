import {
  relationshipDescriptionMap,
  addRelationship,
  editRelationship,
  getAllRelationships,
  getAllManualRelationships,
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
  isRelationshipType,
  getRelationshipOf,
  getRelationshipsWithPersonIds,
  getPeopleIdsMissingRelationshipsWithPerson,
  getRelationshipType,
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
  getMemberPersonId,
  updateUserAsHouseholdMember,
  deleteUserAsHouseholdMember,
  isVisitor,
  isOtherHouseholdMember,
  isHouseholdMember,
  person,
  tempAwayQuestionSentenceMap
} from './assets/household';
import {
  addUpdatePersonalDetailsDOB,
  getPersonalDetailsFor,
  addUpdateMaritalStatus,
  addUpdateCountry,
  addUpdateOrientation,
  addUpdateSalary,

  personalDetailsMaritalStatusMap,
  personalDetailsCountryMap,
  personalDetailsOrientationMap,

  createPinFor,
  getPinFor,
  unsetPinFor
} from './assets/personal-details';
import {removeFromList, trailingNameS} from './assets/utils';

import { numberToPositionWord } from './assets/numbers-to-words';

export const USER_STORAGE_KEY = 'user-details';
export const INDIVIDUAL_PROXY_STORAGE_KEY = 'proxy-person';

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

function populateList($el, memberType) {
  if (!$el.length) {
    return;
  }

  let members = getAllHouseholdMembers() || [];

  $el.empty().append(members.filter((member) => {
    return member.type === memberType;
  }).map(createListItemPerson));

  $el.addClass('list list--people-plain');
}

function populateHouseholdList() {
  populateList($('#household-members'), HOUSEHOLD_MEMBER_TYPE);
}

function populateVisitorList() {
  populateList($('#visitors-list'), VISITOR_TYPE);
}

function updateAddresses() {
  let addressLines = (sessionStorage.getItem('address') || '').split(','),
    addressLine1 = addressLines[0],
    addressLine2 = addressLines[1];

  $('#section-address').html(addressLine1 || '<a' +
    ' href="../test-address">Address not' +
    ' found</a>');
  $('.address-text').html(
    addressLine1 && addressLine2
      ? (
        addressLine1 + (addressLine2 ? ', ' + addressLine2 : '')
      )
      : '<a href="../test-address">Address not found</a>'
  );

  $('.address-text-line1').html(addressLine1);

  let personId = new URLSearchParams(window.location.search).get('person'),
    person;

  if (personId) {
    person = getHouseholdMemberByPersonId(personId)['@person'];
    $('#section-individual').html(person.fullName);

    $('.js-person-fullname-from-url-id').html(person.fullName);
  }
}

const secureLinkTextMap = {
  'question-you': {
    description: 'Want to keep your answers secure from other people at this' +
    ' address?',
    linkText: 'Get a separate access code to submit an individual response',
    link: '../individual-decision-secure'
  },
  'pin-you': {
    description: 'You\'ve chosen to keep your answers secure',
    linkText: 'Cancel this and make answers available to the rest of the' +
    ' household',
    link: '../individual-decision-secure'
  },
  'question-proxy': {
    description: 'Not happy to continue answering for $[NAME]?',
    linkText: 'Request an individual access code to be sent to them',
    link: '../individual-decision-other-secure'
  }
};

function updatePersonLink() {
  const personId = new URLSearchParams(window.location.search).get('person');

  if (personId) {
    const person = getHouseholdMemberByPersonId(personId)['@person'],
      pinObj = getPinFor(personId),
      secureLinkTextConfig = secureLinkTextMap[
        (getAnsweringIndividualByProxy() ? 'question-proxy' : (pinObj && pinObj.pin ? 'pin-you' : 'question-you'))
      ];

    let $secureLink = $('.js-link-secure');
    $secureLink.attr('href', secureLinkTextConfig.link + '?person=' + personId +
      '&returnurl=' + window.location.pathname);

    $secureLink.html(secureLinkTextConfig.linkText);
    $('.js-link-secure-label').html(secureLinkTextConfig.description.replace('$[NAME]', person.fullName));

    let personLink = $('.js-link-person');
    personLink.attr('href', personLink.attr('href') + '?person=' + personId);
  }
}

function setAnsweringIndividualByProxy(bool) {
  sessionStorage.setItem(INDIVIDUAL_PROXY_STORAGE_KEY, JSON.stringify(bool));
}

function getAnsweringIndividualByProxy() {
  return JSON.parse(sessionStorage.getItem(INDIVIDUAL_PROXY_STORAGE_KEY));
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
  getMemberPersonId,
  updateUserAsHouseholdMember,
  deleteUserAsHouseholdMember,
  tempAwayQuestionSentenceMap,

  isVisitor,
  isOtherHouseholdMember,
  isHouseholdMember,

  addRelationship,
  editRelationship,
  getAllRelationships,
  getAllManualRelationships,
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
  isRelationshipType,
  getRelationshipOf,

  relationshipDescriptionMap,
  relationshipSummaryTemplates,
  missingRelationshipInference,
  inferRelationships,
  getRelationshipsWithPersonIds,
  getPeopleIdsMissingRelationshipsWithPerson,
  getRelationshipType,
  findNextMissingRelationship,

  addUpdatePersonalDetailsDOB,
  getPersonalDetailsFor,
  addUpdateMaritalStatus,
  addUpdateCountry,
  addUpdateOrientation,
  addUpdateSalary,

  personalDetailsMaritalStatusMap,
  personalDetailsCountryMap,
  personalDetailsOrientationMap,

  createPinFor,
  getPinFor,
  unsetPinFor,

  setAnsweringIndividualByProxy,
  getAnsweringIndividualByProxy,

  KEYS: {
    HOUSEHOLD_MEMBERS_STORAGE_KEY,
    USER_STORAGE_KEY,
    INDIVIDUAL_PROXY_STORAGE_KEY,
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
  removeFromList,
  trailingNameS,
  numberToPositionWord
};

$(populateHouseholdList);
$(populateVisitorList);
$(updateHouseholdVisitorsNavigationItems);
$(updateAddresses);
$(updatePersonLink);
