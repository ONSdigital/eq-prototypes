import {
  RELATIONSHIPS_STORAGE_KEY,
  relationshipDescriptionMap,
  addRelationship,
  deleteRelationship,
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
  isRelationshipInferred,
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
  tempAwayQuestionSentenceMap,
  visitorQuestionSentenceMap
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

  PERSONAL_DETAILS_KEY,

  createPinFor,
  getPinFor,
  unsetPinFor
} from './assets/personal-details';
import {removeFromList, trailingNameS} from './assets/utils';

import { numberToPositionWord, numberToWordsStyleguide } from './assets/numbers-to-words';

import { tools } from './assets/prototype-tools';

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
    '<span class="list__item-name">' +
      member['@person'].fullName +
      (member['@person'].id === USER_HOUSEHOLD_MEMBER_ID ? ' (You)' : '') +
    '</span>'
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

function updateAllPreviousLinks() {
  $('.js-previous-link').attr('href', document.referrer);
}

function updatePersonLink() {
  const personId = new URLSearchParams(window.location.search).get('person');

  if (personId) {
    let urlParam = new URLSearchParams(window.location.search),
      person = getHouseholdMemberByPersonId(personId)['@person'],
      pinObj = getPinFor(personId),
      secureLinkTextConfig = secureLinkTextMap[
        (getAnsweringIndividualByProxy() ? 'question-proxy' : (pinObj && pinObj.pin ? 'pin-you' : 'question-you'))
      ],
      linkHref = secureLinkTextConfig.link + '?person=' + personId +
        '&returnurl=' + window.location.pathname,
      surveyType = urlParam.get('survey');

    linkHref += (surveyType ? '&survey=' + surveyType : '');

    let $secureLink = $('.js-link-secure');
    $secureLink.attr('href', linkHref);

    $secureLink.html(secureLinkTextConfig.linkText);
    $('.js-link-secure-label').html(secureLinkTextConfig.description.replace('$[NAME]', person.fullName));

    let personLink = $('.js-link-person');
    personLink.attr('href', personLink.attr('href') + '?person=' + personId +
      (surveyType ? '&survey=' + surveyType : ''));
  }
}

function updateBySurveyType() {
  const urlParams = new URLSearchParams(window.location.search),
    surveyType = urlParams.get('survey');

  if (surveyType) {
    $('.js-header-title').html(surveyTypeConfig[surveyType].title);
    $('#people-living-here').html(surveyTypeConfig[surveyType].householdSectionTitle);
    $('#people-living-here').attr('href', surveyTypeConfig[surveyType].householdSectionLink);
    $('#relationships-section').attr('href', surveyTypeConfig[surveyType].relationshipsSection);
    $('title').html(surveyTypeConfig[surveyType].title);
  }
}

function setAnsweringIndividualByProxy(bool) {
  sessionStorage.setItem(INDIVIDUAL_PROXY_STORAGE_KEY, JSON.stringify(bool));
}

function getAnsweringIndividualByProxy() {
  return JSON.parse(sessionStorage.getItem(INDIVIDUAL_PROXY_STORAGE_KEY));
}

const surveyTypeConfig = {
  lms: {
    title: 'Online Household Study',
    householdSectionTitle: 'About your household',
    householdSectionLink: '../summary/?survey=lms',
    relationshipsSection: '../relationships/?survey=lms'
  }
};

function doILiveHere() {
  return sessionStorage.getItem('lives-here') === 'yes';
}

function getSignificant() {
  return '3 February 2019';
}

function updateSignificantDate() {
  $('.js-significant-date').html(getSignificant());
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
  visitorQuestionSentenceMap,

  isVisitor,
  isOtherHouseholdMember,
  isHouseholdMember,

  addRelationship,
  deleteRelationship,
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
  isRelationshipInferred,
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

  doILiveHere,

  KEYS: {
    HOUSEHOLD_MEMBERS_STORAGE_KEY,
    USER_STORAGE_KEY,
    INDIVIDUAL_PROXY_STORAGE_KEY,
    HOUSEHOLD_MEMBER_TYPE,
    VISITOR_TYPE,
    RELATIONSHIPS_STORAGE_KEY,
    PERSONAL_DETAILS_KEY
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
  numberToPositionWord,
  numberToWordsStyleguide,
  getSignificant
};

$(populateHouseholdList);
$(populateVisitorList);
$(updateHouseholdVisitorsNavigationItems);
$(updateAddresses);
$(updatePersonLink);
$(tools);
$(updateAllPreviousLinks);
$(updateBySurveyType);
$(updateSignificantDate);
