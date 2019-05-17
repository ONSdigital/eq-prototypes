import {autoIncrementId} from './utils';

export const HOUSEHOLD_MEMBERS_STORAGE_KEY = 'household-members';
export const USER_HOUSEHOLD_MEMBER_ID = 'person_me';
export const HOUSEHOLD_MEMBER_TYPE = 'household-member';
export const VISITOR_TYPE = 'visitor';

/**
 * Types
 */
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

/**
 * Storage
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
    ? updateHouseholdMember({
      ...userAsHouseholdMember['@person'],
      ...person
    }, memberData)
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

  /**
   * User is always first in the household list
   */
  people[id === USER_HOUSEHOLD_MEMBER_ID ? 'unshift' : 'push']({
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

export function getMemberPersonId(member) {
  return member['@person'].id;
}

/**
 * Comparators
 */
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

export const tempAwayQuestionSentenceMap = {
  'three-more': 'Pobl sy\'n byw y tu allan i\'r Deyrnas Unedig fel arfer, ond sy\'n aros yn y Deyrnas Unedig am 3 mis neu fwy',
  'perm-away': 'Pobl sy\'n gweithio oddi cartref yn y Deyrnas Unedig, os mai hwn yw eu cartref parhaol neu gartref y teulu',
  'armed-forces': 'Aelodau o\'r lluoedd arfog (er enghraifft, y fyddin), os mai hwn yw eu cartref' +
    ' parhaol neu gartref y teulu',
  'less-twelve': 'Pobl sydd y tu allan i\'r Deyrnas UnAelodau o\'r lluoedd arfogedig dros dro am lai na 12 mis',
  'usually-temp': 'Pobl sy\'n aros dros dro, sy\'n byw yn y Deyrnas Unedig' +
    ' fel arfer, ond sydd heb gyfeiriad arall yn y Deyrnas Unedig, er enghraifft perthnasau, ffrindiau',
  'other': 'Pobl eraill sy\'n byw yma fel arfer, ond sydd i ffwrdd dros dos dros dro'
};

export const visitorQuestionSentenceMap = {
  'usually-in-uk': 'Pobl sydd fel arfer yn byw rywle arall yn y Deyrnas' +
    ' Unedig, er enghraifft, cariadon, ffrindiau neu berthnasau',
  'second-address': 'Pobl sy’n aros yma gan mai dyma eu hail gyfeiriad, er enghraifft, oherwydd gwaith.\n' +
    'Mae eu cartref parhaol neu gartref y teulu rywle arall',
  'less-three': 'Pobl sy’n byw y tu allan i’r Deyrnas Unedig fel arfer, ond' +
    ' sy’n aros yn y Deyrnas Unedig am lai na 3 mis',
  'on-holiday': 'Pobl sydd ar wyliau yma\n' +
    'Neu'
};
