/**
 * Libraries
 */
import './assets/lib/FileSaver';
import './assets/lib/array-from-polyfill';
import './assets/lib/url-search-params-polyfill';
import './assets/lib/array-find-polyfill';
import './assets/lib/CustomEvent-polyfill';
import './assets/lib/fetch-polyfill';
import './assets/lib/abortcontroller-polyfill';
import "regenerator-runtime/runtime";

/**
 * DOM modules
 */
import './assets/modules/typeahead/typeahead';
import './assets/modules/address-input/address-input';
import './assets/modules/uac/uac';
import './assets/modules/character-check';
import './assets/previous-link';
import './assets/inpagelink';

import {
  RELATIONSHIPS_STORAGE_KEY,
  relationshipDescriptionMap,
  addRelationship,
  deleteRelationship,
  editRelationship,
  getAllRelationships,
  getAllManualRelationships,
  getNextPersonId,
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
  removePersonalDetailsFor,
  addUpdateMaritalStatus,
  addUpdate30DayAddressUk,
  addUpdate30DayAddressType,
  addUpdate30DayCountry,
  addUpdateCountry,
  addUpdateCountryOther,
  addUpdateCountryOtherArrive,
  addUpdateCountryOtherArriveCensus,
  addUpdateCountryOtherStay,
  addUpdateSchool,
  addUpdateStudent,
  addUpdateStudentAddress,
  addUpdateStudentAddaddressInUK,
  addUpdateStudentAddressUk,
  addUpdateStudentAddressCountry,
  addUpdateYearAgoAddress,
  addUpdateYearAgoAddressUk,
  addUpdateYearAgoAddressCountry,
  addUpdateNationalIdentity,
  addUpdateNationalIdentityOther,
  addUpdateEthnicGroup,
  addUpdateEthnicGroupDescription,
  addUpdateEthnicGroupOther,
  addUpdateReligion,
  addUpdateReligionOther,
  addUpdateLanguage,
  addUpdateLanguageOther,
  addUpdateLanguageEnglish,
  addUpdatePassportCountry,
  addUpdatePassportCountryOther,
  addUpdateHealth,
  addUpdateHealthConditions,
  addUpdateHealthConditionsAbilities,
  addUpdateHealthSupport,
  addUpdateOrientation,
  addUpdateIdentity,
  addUpdateSalary,
  addUpdateSex,
  addUpdateAddressWhere,
  addUpdateAddressIndividual,
  addUpdateAge,
  addUpdateAgeConfirm,
  addUpdateAddressOutsideUK,
  addUpdateApprenticeship,
  addUpdateHasQualificationAbove,
  addUpdateQualificationsNvqEquivalent,
  addUpdateQualificationsALevel,
  addUpdateQualificationsGCSEs,
  addUpdateQualificationsOtherWhere,
  addUpdateArmedForces,
  addUpdateLastSevenDays,
  addUpdateLastSevenDaysDescription,
  addUpdateEmploymentFourWeeks,
  addUpdateEmploymentPaidWorkConfirm,
  addUpdateEmploymentAcceptedJob,
  addUpdateEmploymentStatus,
  addUpdateEmploymentName,
  addUpdateEmploymentJobTitle,
  addUpdateEmploymentJobDescription,
  addUpdateEmploymentBusinessActivity,
  addUpdateEmploymentResponsibilities,
  addUpdateEmploymentHoursWorked,
  addUpdateEmploymentTravel,
  addUpdateEmploymentMainlyWork,
  addUpdateEmploymentWorkUK,
  addUpdateEmploymentOutsideUK,
  addUpdateEmploymentWorkplaceAddress,
  addUpdateEmploymentAvailableTwoWeeks,

  personalDetailsMaritalStatusMap,
  personalDetailsCountryMap,
  personalDetailsOrientationMap,
  personalDetailsGenderMap,
  personalDetailsNationalIdentityMap,
  personalDetailsEthnicGroupMap,
  personalDetailsPassportCountriesMap,
  personalDetailsApprenticeshipMap,
  personalDetailsDegreeAboveMap,
  personalDetailsNVQMap,
  personalDetailsALevelMap,
  personalDetailsGCSEMap,
  personalDetailsOtherWhere,
  personalDetailsEmploymentStatus,

  PERSONAL_DETAILS_KEY,

  createPinFor,
  getPinFor,
  unsetPinFor,
  personalBookmark,
  getBookmarkFor,
  clearPersonalBookmark,
  personalQuestionSubmitDecorator,
  setProxy,
  getProxyFor,
  clearProxy
} from './assets/personal-details';

import { removeFromList, trailingNameS } from './assets/utils';

import { numberToPositionWord, numberToWordsStyleguide, precedingOrdinalWord } from './assets/numbers-to-words';

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
      (member['@person'].id === USER_HOUSEHOLD_MEMBER_ID ? '' : '') +
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

function cleanHTMLPlaceholderStringReplacment(el, val) {
  const $el = $(el),
    $parent = $el.parent();

  $el.before(val);
  $el.remove();

  $parent.html($parent.html().replace(/[\s]+/g, ' ').trim());
}

function updateAddresses() {
  let addressLines = (sessionStorage.getItem('address') || '').split(','),
    addressLine1 = addressLines[0],
    addressLine2 = addressLines[1];

  $('.address-text').each((i, el) => cleanHTMLPlaceholderStringReplacment(el,
    addressLine1 && addressLine2
      ? (
        addressLine1 + (addressLine2 ? ', ' + addressLine2 : '')
      )
      : '<a href="../test-address">Address not found</a>'
  ));

  $('.address-text-line1').each((i, el) => cleanHTMLPlaceholderStringReplacment(el, addressLine1));

  const personId = new URLSearchParams(window.location.search).get('person_id');

  if (personId) {
    const person = getHouseholdMemberByPersonId(personId)['@person'],
      $sectionIndividualEl = $('#section-individual'),
      $nameEl = $('.js-person-fullname-from-url-id');

    $sectionIndividualEl.length && cleanHTMLPlaceholderStringReplacment($sectionIndividualEl, person.fullName);
    $nameEl.length && cleanHTMLPlaceholderStringReplacment($nameEl, person.fullName);
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

function updateAllLinks() {
  $('.js-previous-link').attr('href', document.referrer);
}

function updatePersonLink() {
  const personId = new URLSearchParams(window.location.search).get('person_id');

  if (personId) {
    let urlParam = new URLSearchParams(window.location.search),
      person = getHouseholdMemberByPersonId(personId)['@person'],
      pinObj = getPinFor(personId),
      secureLinkTextConfig = secureLinkTextMap[
        (getProxyFor(personId) ? 'question-proxy' : (pinObj && pinObj.pin ? 'pin-you' : 'question-you'))
      ],
      linkHref = secureLinkTextConfig.link + '?person_id=' + personId +
        '&returnurl=' + window.location.pathname,
      surveyType = urlParam.get('survey');

    linkHref += (surveyType ? '&survey=' + surveyType : '');

    let $secureLink = $('.js-link-secure');
    $secureLink.attr('href', linkHref);

    $secureLink.html(secureLinkTextConfig.linkText);
    $('.js-link-secure-label').html(secureLinkTextConfig.description.replace('$[NAME]', person.fullName));

    let personLink = $('.js-link-person');
    personLink.attr('href', personLink.attr('href') + '?person_id=' + personId +
      (surveyType ? '&survey=' + surveyType : ''));
  }
}

function doILiveHere() {
  return sessionStorage.getItem('lives-here') === 'yes';
}

function getSignificant() {
  return 'Sunday 5 April 2020';
}

function updateSignificantDate() {
  $('.js-significant-date').each((i, el) => cleanHTMLPlaceholderStringReplacment(el, getSignificant()));
}

function personRecordTemplate() {
  return $(`<li id="person-record-template" class="list__item">
        <span class="list__item-name js-person-name"></span>
        <div class="list__item-actions u-fr">
            <span class="list__item-action">
                <a class="js-record-edit" href="#">Change</a>
                <span class="js-spacer">|</span>
                <a class="js-record-remove" href="#">Remove</a>
            </span>
        </div>
    </li>`);
}

function createMemberItem(member, { redirect } = { redirect: null }, noEdit) {
  var $nodeEl = personRecordTemplate(),
    $editLink = $nodeEl.find('.js-record-edit'),
    $removeLink = $nodeEl.find('.js-record-remove'),
    $spacer = $nodeEl.find('.js-spacer'),
    urlParams = new URLSearchParams(window.location.search),
    personNameText = member['@person'].fullName,
    memberIsUser = isMemberUser(member),
    surveyType = urlParams.get('survey'),
    altPage = surveyType && surveyType === 'lms' ? surveyType + '/' : '',
    redirectTo = (redirect ? '&redirect=' + encodeURIComponent(window.location.href) : '');
    
  if (noEdit) {
    $editLink.hide();
    $removeLink.hide();
    $spacer.hide();
  } 
  else if (!noEdit && memberIsUser) {
    $editLink.html('Change');
    $removeLink.hide();
    $spacer.hide();
  }

  $nodeEl.attr('id', '');
  $nodeEl.find('.js-person-name').html(personNameText);

  $editLink.attr('href', (
    (memberIsUser
      ? '../' + altPage + 'what-is-your-name/?edit=true'
      : '../' + altPage + 'who-else-to-add/?edit=' + member['@person'].id +
        (isVisitor(member) ? '&journey=visitors' : '')) +
    redirectTo
  ));

  $removeLink.attr('href', (
    '../remove-household-member/?person_id=' + member['@person'].id +
    redirectTo
  ));

  return $nodeEl;
}

function updateHouseholdSummary() {
  const members = getAllHouseholdMembers();

  $('.js-household-members-summary').each(function(i, el) {
    const $el = $(el);

    $.each([
      ...members.filter(isMemberUser),
      ...members.filter(isOtherHouseholdMember)
    ], function(i, member) {
      $el.append(createMemberItem(member, { redirect: $el.attr('data-redirect') }));
    });
  });
}

function updateVisitorsSummary() {
  const members = getAllHouseholdMembers();

  $('.js-visitors-summary').each(function(i, el) {
    const $el = $(el);

    $.each(members.filter(isVisitor), (i, member) => {
      $el.append(createMemberItem(member, { redirect: $el.attr('data-redirect') }));
    });
  });
}

function updateContinueNotice() {
  const urlParams = new URLSearchParams(window.location.search),
    isContinuing = urlParams.get('continuing'),
    personId = urlParams.get('person_id');

  if (!isContinuing) {
    return false;
  }
  
  const member = storageAPI.getAllHouseholdMembers().filter(storageAPI.isVisitor);
  const link = isVisitor(member) ? '../visitor-intro/' : '../individual-intro/';
  const template = `<div class="panel panel--simple panel--info u-mb-s">
      <div class="panel__body">
          <strong>This was the last unanswered question
              in the section</strong>
          <p>
              <a href="${link}?person_id=${personId}">Go to the start 
              of this section</a>
          </p>
      </div>
  </div>`;

  $('.js-heading').closest('.question').prepend(template);
}

function updateSaveAndCompleteLater() {
  $('.complete-later').on('click', function(e) {
    e.preventDefault();

    window.location.href = '../post-submission/?redirect=../hub';
  });
}

function updateFoortListCol() {
  $('.js-footer-list-col').append('<li><a href="../test-data"' +
    ' class="footer__link footer__link--inline ghost-link u-fr">Test' +
    ' data</a></li>');
}

function isMemberUser(member) {
  return member['@person'].id === window.ONS.storage.IDS.USER_HOUSEHOLD_MEMBER_ID;
}

function sessionBookmark() {
  var pieces = window.location.href
    .replace(window.location.pathname, '[delimeter]')
    .split('[delimeter]');

  pieces.shift();

  if (window.location.pathname.match(/test-data/g)) {
    console.log('match');
    return;
  }

  sessionStorage.setItem('_session_bookmark', [].concat(window.location.pathname, pieces).join(''));
}

function fieldItemDisplayHack() {
  $('.field__item').after('<br />');
}

function validateInputs(testFails, selector, address) {
  var input = document.querySelector(selector),
      errorBox = document.querySelector('.js-error-box'),
      listItem = document.querySelector('.js-' + input.id),
      answer = input.closest('.question__answer'),
      field = input.closest('.fieldgroup') ? input.closest('.fieldgroup') : input.closest('.field'),
      fieldGroup = document.querySelector('.fieldgroup') ? true : false,
      errorMsg = input.getAttribute('data-error-msg');

  if (input.value === testFails || testFails === true) {
    window.scrollTo(0, 0);
    hasErrors = true;
    input.classList.add('input--error');
    if (!listItem.classList.contains('js-visible')) {
      errorBox.classList.remove('u-d-no');
      listItem.classList.remove('u-d-no');
      listItem.classList.add('js-visible');
      var inputErrorPanel = document.createElement('DIV'),
          inputErrorBody = document.createElement('DIV'),
          inputErrorP = document.createElement('P'),
          inputErrorStrong = document.createElement('STRONG');

      inputErrorPanel.className = 'panel panel--error panel--simple';
      inputErrorBody.className = 'panel__body';
      inputErrorP.className = 'panel__error';
      if (address) {
        var errors = Array.from(document.querySelectorAll('.js-visible')).length;
        inputErrorP.id = 'error-message-' + errors;
      } else {
        inputErrorP.id = 'error-message-' + input.id;
      }
      inputErrorStrong.innerText = errorMsg;
      inputErrorP.appendChild(inputErrorStrong);
      inputErrorBody.appendChild(inputErrorP);
      inputErrorBody.appendChild(field);
      inputErrorPanel.appendChild(inputErrorBody);
      answer.appendChild(inputErrorPanel);
    }
  } else if (!fieldGroup) {
    var errorPanel = input.closest('.panel');
    if (errorPanel) {
      listItem.classList.add('u-d-no'), 
      listItem.classList.remove('js-visible');
      input.classList.remove('input--error');
      answer.appendChild(field);
      answer.removeChild(errorPanel);
    }
  } else {
    input.classList.remove('input--error');
  }
}

function calcErrors() {
  var errors = Array.from(document.querySelectorAll('.js-visible')).length,
    pipingDestinations = document.querySelectorAll('.js-piping');

  pipingDestinations.forEach(function(pipingDestination) {
    if (errors === 1) {
      pipingDestination.innerText = pipingDestination.innerText
        .replace('{x}', '')
        .replace('{s}', '')
        .replace('2', "1")
        .replace('are', "is a")
        .replace('problems', "problem")
        .replace('1 ', "");
    } else if (errors > 1) {
      pipingDestination.innerText = pipingDestination.innerText
        .replace('{x}', '2')
        .replace('is a', 'are')
        .replace('{s}', 's')
        .replace('1', "2")
        .replace('are problem', "are 2 problems");
    }
  });
}

function storePageData(url, previousUrl) {
  let pageDataContents = JSON.parse(sessionStorage.getItem('pageData')) || {};
  sessionStorage.setItem('pageData', JSON.stringify({
      ...(pageDataContents || {}),
      [url]: previousUrl
  }));
}

window.ONS = window.ONS || {};
window.ONS.storage = {
  storePageData,
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
  getNextPersonId,
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
  removePersonalDetailsFor,
  addUpdateMaritalStatus,
  addUpdate30DayAddressType,
  addUpdate30DayAddressUk,
  addUpdate30DayCountry,
  addUpdateSchool,
  addUpdateStudent,
  addUpdateStudentAddress,
  addUpdateStudentAddaddressInUK,
  addUpdateStudentAddressUk,
  addUpdateStudentAddressCountry,
  addUpdateCountry,
  addUpdateCountryOther,
  addUpdateCountryOtherArrive,
  addUpdateCountryOtherArriveCensus,
  addUpdateCountryOtherStay,
  addUpdateYearAgoAddress,
  addUpdateYearAgoAddressUk,
  addUpdateYearAgoAddressCountry,
  addUpdateNationalIdentity,
  addUpdateNationalIdentityOther,
  addUpdateEthnicGroup,
  addUpdateEthnicGroupDescription,
  addUpdateEthnicGroupOther,
  addUpdateReligion,
  addUpdateReligionOther,
  addUpdateLanguage,
  addUpdateLanguageOther,
  addUpdateLanguageEnglish,
  addUpdatePassportCountry,
  addUpdatePassportCountryOther,
  addUpdateHealth,
  addUpdateHealthConditions,
  addUpdateHealthConditionsAbilities,
  addUpdateHealthSupport,
  addUpdateOrientation,
  addUpdateIdentity,
  addUpdateSalary,
  addUpdateSex,
  addUpdateAddressWhere,
  addUpdateAddressIndividual,
  addUpdateAge,
  addUpdateAgeConfirm,
  addUpdateAddressOutsideUK,
  addUpdateApprenticeship,
  addUpdateHasQualificationAbove,
  addUpdateQualificationsNvqEquivalent,
  addUpdateQualificationsALevel,
  addUpdateQualificationsGCSEs,
  addUpdateQualificationsOtherWhere,
  addUpdateArmedForces,
  addUpdateLastSevenDays,
  addUpdateLastSevenDaysDescription,
  addUpdateEmploymentFourWeeks,
  addUpdateEmploymentPaidWorkConfirm,
  addUpdateEmploymentAcceptedJob,
  addUpdateEmploymentStatus,
  addUpdateEmploymentName,
  addUpdateEmploymentJobTitle,
  addUpdateEmploymentJobDescription,
  addUpdateEmploymentBusinessActivity,
  addUpdateEmploymentResponsibilities,
  addUpdateEmploymentHoursWorked,
  addUpdateEmploymentTravel,
  addUpdateEmploymentMainlyWork,
  addUpdateEmploymentWorkUK,
  addUpdateEmploymentOutsideUK,
  addUpdateEmploymentWorkplaceAddress,
  addUpdateEmploymentAvailableTwoWeeks,

  personalDetailsMaritalStatusMap,
  personalDetailsCountryMap,
  personalDetailsOrientationMap,
  personalDetailsGenderMap,
  personalDetailsNationalIdentityMap,
  personalDetailsEthnicGroupMap,
  personalDetailsPassportCountriesMap,
  personalDetailsApprenticeshipMap,
  personalDetailsDegreeAboveMap,
  personalDetailsNVQMap,
  personalDetailsALevelMap,
  personalDetailsGCSEMap,
  personalDetailsOtherWhere,
  personalDetailsEmploymentStatus,

  createPinFor,
  getPinFor,
  unsetPinFor,
  personalBookmark,
  getBookmarkFor,
  clearPersonalBookmark,
  personalQuestionSubmitDecorator,

  setProxy,
  getProxyFor,
  clearProxy,

  doILiveHere,
  isMemberUser,

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
  precedingOrdinalWord,
  getSignificant,
  cleanHTMLPlaceholderStringReplacment,
  validateInputs,
  calcErrors
};

$(populateHouseholdList);
$(populateVisitorList);
$(updateHouseholdVisitorsNavigationItems);
$(updateAddresses);
$(updatePersonLink);
$(tools);
$(updateAllLinks);
$(updateSignificantDate);
$(updateHouseholdSummary);
$(updateVisitorsSummary);
$(updateContinueNotice);
$(updateSaveAndCompleteLater);
$(updateFoortListCol);
$(sessionBookmark);
$(fieldItemDisplayHack);
