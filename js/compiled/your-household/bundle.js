(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

var HOUSEHOLD_MEMBERS_STORAGE_KEY = 'household-members';
var USER_STORAGE_KEY = 'user-details';
var USER_HOUSEHOLD_MEMBER_ID = 'person_me';
var HOUSEHOLD_MEMBER_TYPE = 'household-member';
var RELATIONSHIPS_STORAGE_KEY = 'relationships';
var VISITOR_TYPE = 'visitor';

var relationshipTypes = {
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

var relationshipDescriptionMap = {
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

function getAddress() {
  var addressLines = sessionStorage.getItem('address').split(',');

  return {
    addressLine1: addressLines[0],
    addressLine2: addressLines[1],
    addressLine3: addressLines[2],
    addressCounty: addressLines[4],
    addressTownCity: addressLines[3],
    addressPostcode: addressLines[5]
  };
}

/**
 * User
 */
function addUserPerson(person) {
  sessionStorage.setItem(USER_STORAGE_KEY, JSON.stringify(person));
}

function getUserPerson() {
  return JSON.parse(sessionStorage.getItem(USER_STORAGE_KEY));
}

/**
 * Household
 */
function getUserAsHouseholdMember() {
  return getAllHouseholdMembers().find(function (member) {
    return member['@person'].id === USER_HOUSEHOLD_MEMBER_ID;
  });
}

function deleteUserAsHouseholdMember() {
  deleteHouseholdMember(USER_HOUSEHOLD_MEMBER_ID);
}

function deleteHouseholdMember(personId) {
  var members = getAllHouseholdMembers().filter(function (member) {
    return member['@person'].id !== personId;
  });

  sessionStorage.setItem(HOUSEHOLD_MEMBERS_STORAGE_KEY, JSON.stringify(members));
}

function updateUserAsHouseholdMember(person, memberData) {
  var userAsHouseholdMember = getUserAsHouseholdMember();

  userAsHouseholdMember ? updateHouseholdMember(userAsHouseholdMember['@person'], memberData) : addHouseholdMember(person, memberData, USER_HOUSEHOLD_MEMBER_ID);
}

function updateHouseholdMember(person, memberData) {
  var membersUpdated = getAllHouseholdMembers().map(function (member) {
    return member['@person'].id === person.id ? _extends({}, member, memberData, { '@person': _extends({}, member['@person'], person) }) : member;
  });

  sessionStorage.setItem(HOUSEHOLD_MEMBERS_STORAGE_KEY, JSON.stringify(membersUpdated));
}

function addHouseholdMember(person, memberData, id) {
  var people = getAllHouseholdMembers() || [];
  memberData = memberData || {};

  people.push(_extends({}, memberData, {
    type: memberData.type || HOUSEHOLD_MEMBER_TYPE,
    '@person': _extends({}, person, {
      id: id || 'person' + autoIncrementId('household-members')
    })
  }));

  sessionStorage.setItem(HOUSEHOLD_MEMBERS_STORAGE_KEY, JSON.stringify(people));
}

function getAllHouseholdMembers() {
  return JSON.parse(sessionStorage.getItem(HOUSEHOLD_MEMBERS_STORAGE_KEY)) || [];
}

function getHouseholdMemberByPersonId(id) {
  return getAllHouseholdMembers().find(function (member) {
    return member['@person'].id === id;
  });
}

function person(opts) {
  if (opts.firstName === '' || opts.lastName === '') {
    console.log('Unable to create person with data: ', opts.firstName, !opts.middleName, !opts.lastName);
  }

  var middleName = opts.middleName || '';

  return {
    fullName: opts.firstName + ' ' + middleName + ' ' + opts.lastName,
    firstName: opts.firstName,
    middleName: middleName,
    lastName: opts.lastName
  };
}

function isVisitor(member) {
  return member.type === window.ONS.storage.KEYS.VISITOR_TYPE;
}

function isHouseholdMember(member) {
  return member.type === window.ONS.storage.KEYS.HOUSEHOLD_MEMBER_TYPE;
}

function isOtherHouseholdMember(member) {
  return member.type === window.ONS.storage.KEYS.HOUSEHOLD_MEMBER_TYPE && member['@person'].id !== window.ONS.storage.IDS.USER_HOUSEHOLD_MEMBER_ID;
}

/**
 * Relationships
 */
function addRelationship(relationshipObj) {
  var householdRelationships = getAllRelationships() || [],
      item = _extends({}, relationshipObj, {
    id: autoIncrementId('relationships')
  });

  householdRelationships.push(item);

  sessionStorage.setItem(RELATIONSHIPS_STORAGE_KEY, JSON.stringify(householdRelationships));

  return item;
}

function editRelationship(relationshipId, valueObject) {
  var householdRelationships = (getAllRelationships() || []).map(function (relationship) {
    return relationship.id + '' === relationshipId + '' ? _extends({}, valueObject, {
      id: relationshipId
    }) : relationship;
  });

  sessionStorage.setItem(RELATIONSHIPS_STORAGE_KEY, JSON.stringify(householdRelationships));
}

function getAllRelationships() {
  return JSON.parse(sessionStorage.getItem(RELATIONSHIPS_STORAGE_KEY)) || [];
}

function deleteAllRelationshipsForMember(memberId) {
  var householdRelationships = getAllRelationships().filter(function (relationship) {
    return !(memberId === relationship.personIsId || memberId === relationship.personToId);
  });

  sessionStorage.setItem(RELATIONSHIPS_STORAGE_KEY, JSON.stringify(householdRelationships));
}

function relationship(description, personIsId, personToId) {
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
  var $nodeEl = $('<li class="js-template-nav-item nav__item pluto">' + '  <a class="js-template-nav-item-label nav__link" href="#"></a>' + '</li>'),
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
  var allHouseholdMembers = window.ONS.storage.getAllHouseholdMembers(),
      householdMembers = allHouseholdMembers.filter(window.ONS.storage.isHouseholdMember),
      visitors = allHouseholdMembers.filter(window.ONS.storage.isVisitor);

  var $navigationHouseholdMembersEl = $('#navigation-household-members'),
      $navigationVisitorsEl = $('#navigation-visitors');

  if (householdMembers.length) {
    $.each(householdMembers, function (i, member) {
      $navigationHouseholdMembersEl.append(createNavItem(member));
    });
  } else {
    $navigationHouseholdMembersEl.parent().hide();
  }

  if (visitors.length) {
    $.each(visitors, function (i, member) {
      $navigationVisitorsEl.append(createNavItem(member));
    });
  } else {
    $navigationVisitorsEl.parent().hide();
  }
}

function createListItemPerson(member) {
  return $('<li class="list__item">').addClass('mars').html('<span class="list__item-name">' + member['@person'].fullName + '</span>');
}

function populateHouseholdList() {
  var $el = $('#household-members');

  if (!$el.length) {
    return;
  }

  var members = getAllHouseholdMembers() || [];

  $el.empty().append(members.filter(function (member) {
    return member.type === HOUSEHOLD_MEMBER_TYPE;
  }).map(createListItemPerson));

  $el.addClass('list list--people-plain');
}

function populateVisitorList() {
  var $el = $('#visitors-list');

  if (!$el.length) {
    return;
  }

  var members = getAllHouseholdMembers() || [];

  $el.empty().append(members.filter(function (member) {
    return member.type === VISITOR_TYPE;
  }).map(createListItemPerson));

  $el.addClass('list list--people-plain');
}

function updateAddresses() {
  var addressLines = (sessionStorage.getItem('address') || '').split(','),
      addressLine1 = addressLines[0],
      addressLine2 = addressLines[1];

  $('#section-address').html(addressLine1);
  $('.address-text').html(addressLine1 + ', ' + addressLine2);
}

function autoIncrementId(collection) {
  var k = collection + '-increment',
      id = parseInt(sessionStorage.getItem(k)) || 0;

  id++;

  sessionStorage.setItem(k, JSON.stringify(id));

  return id;
}

window.ONS = {};
window.ONS.storage = {
  getAddress: getAddress,
  addHouseholdMember: addHouseholdMember,
  updateHouseholdMember: updateHouseholdMember,
  deleteHouseholdMember: deleteHouseholdMember,
  getAllHouseholdMembers: getAllHouseholdMembers,
  addUserPerson: addUserPerson,
  getUserPerson: getUserPerson,
  getUserAsHouseholdMember: getUserAsHouseholdMember,
  getHouseholdMemberByPersonId: getHouseholdMemberByPersonId,
  updateUserAsHouseholdMember: updateUserAsHouseholdMember,
  deleteUserAsHouseholdMember: deleteUserAsHouseholdMember,

  isVisitor: isVisitor,
  isOtherHouseholdMember: isOtherHouseholdMember,
  isHouseholdMember: isHouseholdMember,

  addRelationship: addRelationship,
  editRelationship: editRelationship,
  getAllRelationships: getAllRelationships,
  deleteAllRelationshipsForMember: deleteAllRelationshipsForMember,

  relationshipDescriptionMap: relationshipDescriptionMap,

  KEYS: {
    HOUSEHOLD_MEMBERS_STORAGE_KEY: HOUSEHOLD_MEMBERS_STORAGE_KEY,
    USER_STORAGE_KEY: USER_STORAGE_KEY,
    HOUSEHOLD_MEMBER_TYPE: HOUSEHOLD_MEMBER_TYPE,
    VISITOR_TYPE: VISITOR_TYPE
  },

  IDS: {
    USER_HOUSEHOLD_MEMBER_ID: USER_HOUSEHOLD_MEMBER_ID
  },

  TYPES: {
    person: person,
    relationship: relationship
  }
};

window.ONS.helpers = {
  populateHouseholdList: populateHouseholdList,
  populateVisitorList: populateVisitorList
};

$(populateHouseholdList);
$(populateVisitorList);
$(updateHouseholdVisitorsNavigationItems);
$(updateAddresses);

exports.HOUSEHOLD_MEMBERS_STORAGE_KEY = HOUSEHOLD_MEMBERS_STORAGE_KEY;
exports.USER_STORAGE_KEY = USER_STORAGE_KEY;
exports.USER_HOUSEHOLD_MEMBER_ID = USER_HOUSEHOLD_MEMBER_ID;
exports.HOUSEHOLD_MEMBER_TYPE = HOUSEHOLD_MEMBER_TYPE;
exports.RELATIONSHIPS_STORAGE_KEY = RELATIONSHIPS_STORAGE_KEY;
exports.VISITOR_TYPE = VISITOR_TYPE;
exports.getAddress = getAddress;
exports.addUserPerson = addUserPerson;
exports.getUserPerson = getUserPerson;
exports.getUserAsHouseholdMember = getUserAsHouseholdMember;
exports.deleteUserAsHouseholdMember = deleteUserAsHouseholdMember;
exports.deleteHouseholdMember = deleteHouseholdMember;
exports.updateUserAsHouseholdMember = updateUserAsHouseholdMember;
exports.updateHouseholdMember = updateHouseholdMember;
exports.addHouseholdMember = addHouseholdMember;
exports.getAllHouseholdMembers = getAllHouseholdMembers;
exports.getHouseholdMemberByPersonId = getHouseholdMemberByPersonId;
exports.person = person;
exports.isVisitor = isVisitor;
exports.isHouseholdMember = isHouseholdMember;
exports.isOtherHouseholdMember = isOtherHouseholdMember;
exports.addRelationship = addRelationship;
exports.editRelationship = editRelationship;
exports.getAllRelationships = getAllRelationships;
exports.deleteAllRelationshipsForMember = deleteAllRelationshipsForMember;
exports.relationship = relationship;

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJfcHJvdG90eXBlcy95b3VyLWhvdXNlaG9sZC9idW5kbGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuXG52YXIgX2V4dGVuZHMgPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uICh0YXJnZXQpIHtcbiAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldO1xuXG4gICAgZm9yICh2YXIga2V5IGluIHNvdXJjZSkge1xuICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzb3VyY2UsIGtleSkpIHtcbiAgICAgICAgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gdGFyZ2V0O1xufTtcblxudmFyIEhPVVNFSE9MRF9NRU1CRVJTX1NUT1JBR0VfS0VZID0gJ2hvdXNlaG9sZC1tZW1iZXJzJztcbnZhciBVU0VSX1NUT1JBR0VfS0VZID0gJ3VzZXItZGV0YWlscyc7XG52YXIgVVNFUl9IT1VTRUhPTERfTUVNQkVSX0lEID0gJ3BlcnNvbl9tZSc7XG52YXIgSE9VU0VIT0xEX01FTUJFUl9UWVBFID0gJ2hvdXNlaG9sZC1tZW1iZXInO1xudmFyIFJFTEFUSU9OU0hJUFNfU1RPUkFHRV9LRVkgPSAncmVsYXRpb25zaGlwcyc7XG52YXIgVklTSVRPUl9UWVBFID0gJ3Zpc2l0b3InO1xuXG52YXIgcmVsYXRpb25zaGlwVHlwZXMgPSB7XG4gICdzcG91c2UnOiB7fSxcbiAgJ2NoaWxkLXBhcmVudCc6IHt9LFxuICAnc3RlcC1jaGlsZC1wYXJlbnQnOiB7fSxcbiAgJ2dyYW5kY2hpbGQtZ3JhbmRwYXJlbnQnOiB7fSxcbiAgJ3NpYmxpbmcnOiB7fSxcbiAgJ3N0ZXAtYnJvdGhlci1zaXN0ZXInOiB7fSxcbiAgJ3BhcnRuZXInOiB7fSxcbiAgJ3VucmVsYXRlZCc6IHt9LFxuICAnb3RoZXItcmVsYXRpb24nOiB7fVxufTtcblxudmFyIHJlbGF0aW9uc2hpcERlc2NyaXB0aW9uTWFwID0ge1xuICAnaHVzYmFuZC13aWZlJzoge1xuICAgIHNlbnRhbmNlTGFiZWw6ICdodXNiYW5kIG9yIHdpZmUnLFxuICAgIHR5cGU6IHJlbGF0aW9uc2hpcFR5cGVzWydzcG91c2UnXVxuICB9LFxuICAnbW90aGVyLWZhdGhlcic6IHtcbiAgICBzZW50YW5jZUxhYmVsOiAnbW90aGVyIG9yIGZhdGhlcicsXG4gICAgdHlwZTogcmVsYXRpb25zaGlwVHlwZXNbJ2NoaWxkLXBhcmVudCddXG4gIH0sXG4gICdzdGVwLW1vdGhlci1mYXRoZXInOiB7XG4gICAgc2VudGFuY2VMYWJlbDogJ3N0ZXAtbW90aGVyIG9yIHN0ZXAtZmF0aGVyJyxcbiAgICB0eXBlOiByZWxhdGlvbnNoaXBUeXBlc1snc3RlcC1jaGlsZC1wYXJlbnQnXVxuICB9LFxuICAnc29uLWRhdWdodGVyJzoge1xuICAgIHNlbnRhbmNlTGFiZWw6ICdzb24gb3IgZGF1Z2h0ZXInLFxuICAgIHR5cGU6IHJlbGF0aW9uc2hpcFR5cGVzWydjaGlsZC1wYXJlbnQnXVxuICB9LFxuICAnc3RlcC1jaGlsZCc6IHtcbiAgICBzZW50YW5jZUxhYmVsOiAnc3RlcC1jaGlsZCcsXG4gICAgdHlwZTogcmVsYXRpb25zaGlwVHlwZXNbJ3N0ZXAtY2hpbGQtcGFyZW50J11cbiAgfSxcbiAgJ2dyYW5kcGFyZW50Jzoge1xuICAgIHNlbnRhbmNlTGFiZWw6ICdncmFuZHBhcmVudCcsXG4gICAgdHlwZTogcmVsYXRpb25zaGlwVHlwZXNbJ2dyYW5kY2hpbGQtZ3JhbmRwYXJlbnQnXVxuICB9LFxuICAnZ3JhbmRjaGlsZCc6IHtcbiAgICBzZW50YW5jZUxhYmVsOiAnZ3JhbmRjaGlsZCcsXG4gICAgdHlwZTogcmVsYXRpb25zaGlwVHlwZXNbJ2dyYW5kY2hpbGQtZ3JhbmRwYXJlbnQnXVxuICB9LFxuICAnYnJvdGhlci1zaXN0ZXInOiB7XG4gICAgc2VudGFuY2VMYWJlbDogJ2Jyb3RoZXIgb3Igc2lzdGVyJyxcbiAgICB0eXBlOiByZWxhdGlvbnNoaXBUeXBlc1snc2libGluZyddXG4gIH0sXG4gICdzdGVwLWJyb3RoZXItc2lzdGVyJzoge1xuICAgIHNlbnRhbmNlTGFiZWw6ICdzdGVwLWJyb3RoZXIgb3Igc3RlcC1zaXN0ZXInLFxuICAgIHR5cGU6IHJlbGF0aW9uc2hpcFR5cGVzWydzdGVwLWJyb3RoZXItc2lzdGVyJ11cbiAgfSxcbiAgJ290aGVyLXJlbGF0aW9uJzoge1xuICAgIHNlbnRhbmNlTGFiZWw6ICdvdGhlciB0eXBlIG9mIHJlbGF0aW9uJyxcbiAgICB0eXBlOiByZWxhdGlvbnNoaXBUeXBlc1snb3RoZXItcmVsYXRpb24nXVxuICB9LFxuICAncGFydG5lcic6IHtcbiAgICBzZW50YW5jZUxhYmVsOiAncGFydG5lcicsXG4gICAgdHlwZTogcmVsYXRpb25zaGlwVHlwZXNbJ3BhcnRuZXInXVxuICB9LFxuICAndW5yZWxhdGVkJzoge1xuICAgIHNlbnRhbmNlTGFiZWw6ICdub3QgcmVsYXRlZCcsXG4gICAgdHlwZTogcmVsYXRpb25zaGlwVHlwZXNbJ3VucmVsYXRlZCddXG4gIH1cbn07XG5cbmZ1bmN0aW9uIGdldEFkZHJlc3MoKSB7XG4gIHZhciBhZGRyZXNzTGluZXMgPSBzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKCdhZGRyZXNzJykuc3BsaXQoJywnKTtcblxuICByZXR1cm4ge1xuICAgIGFkZHJlc3NMaW5lMTogYWRkcmVzc0xpbmVzWzBdLFxuICAgIGFkZHJlc3NMaW5lMjogYWRkcmVzc0xpbmVzWzFdLFxuICAgIGFkZHJlc3NMaW5lMzogYWRkcmVzc0xpbmVzWzJdLFxuICAgIGFkZHJlc3NDb3VudHk6IGFkZHJlc3NMaW5lc1s0XSxcbiAgICBhZGRyZXNzVG93bkNpdHk6IGFkZHJlc3NMaW5lc1szXSxcbiAgICBhZGRyZXNzUG9zdGNvZGU6IGFkZHJlc3NMaW5lc1s1XVxuICB9O1xufVxuXG4vKipcbiAqIFVzZXJcbiAqL1xuZnVuY3Rpb24gYWRkVXNlclBlcnNvbihwZXJzb24pIHtcbiAgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbShVU0VSX1NUT1JBR0VfS0VZLCBKU09OLnN0cmluZ2lmeShwZXJzb24pKTtcbn1cblxuZnVuY3Rpb24gZ2V0VXNlclBlcnNvbigpIHtcbiAgcmV0dXJuIEpTT04ucGFyc2Uoc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbShVU0VSX1NUT1JBR0VfS0VZKSk7XG59XG5cbi8qKlxuICogSG91c2Vob2xkXG4gKi9cbmZ1bmN0aW9uIGdldFVzZXJBc0hvdXNlaG9sZE1lbWJlcigpIHtcbiAgcmV0dXJuIGdldEFsbEhvdXNlaG9sZE1lbWJlcnMoKS5maW5kKGZ1bmN0aW9uIChtZW1iZXIpIHtcbiAgICByZXR1cm4gbWVtYmVyWydAcGVyc29uJ10uaWQgPT09IFVTRVJfSE9VU0VIT0xEX01FTUJFUl9JRDtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGRlbGV0ZVVzZXJBc0hvdXNlaG9sZE1lbWJlcigpIHtcbiAgZGVsZXRlSG91c2Vob2xkTWVtYmVyKFVTRVJfSE9VU0VIT0xEX01FTUJFUl9JRCk7XG59XG5cbmZ1bmN0aW9uIGRlbGV0ZUhvdXNlaG9sZE1lbWJlcihwZXJzb25JZCkge1xuICB2YXIgbWVtYmVycyA9IGdldEFsbEhvdXNlaG9sZE1lbWJlcnMoKS5maWx0ZXIoZnVuY3Rpb24gKG1lbWJlcikge1xuICAgIHJldHVybiBtZW1iZXJbJ0BwZXJzb24nXS5pZCAhPT0gcGVyc29uSWQ7XG4gIH0pO1xuXG4gIHNlc3Npb25TdG9yYWdlLnNldEl0ZW0oSE9VU0VIT0xEX01FTUJFUlNfU1RPUkFHRV9LRVksIEpTT04uc3RyaW5naWZ5KG1lbWJlcnMpKTtcbn1cblxuZnVuY3Rpb24gdXBkYXRlVXNlckFzSG91c2Vob2xkTWVtYmVyKHBlcnNvbiwgbWVtYmVyRGF0YSkge1xuICB2YXIgdXNlckFzSG91c2Vob2xkTWVtYmVyID0gZ2V0VXNlckFzSG91c2Vob2xkTWVtYmVyKCk7XG5cbiAgdXNlckFzSG91c2Vob2xkTWVtYmVyID8gdXBkYXRlSG91c2Vob2xkTWVtYmVyKHVzZXJBc0hvdXNlaG9sZE1lbWJlclsnQHBlcnNvbiddLCBtZW1iZXJEYXRhKSA6IGFkZEhvdXNlaG9sZE1lbWJlcihwZXJzb24sIG1lbWJlckRhdGEsIFVTRVJfSE9VU0VIT0xEX01FTUJFUl9JRCk7XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZUhvdXNlaG9sZE1lbWJlcihwZXJzb24sIG1lbWJlckRhdGEpIHtcbiAgdmFyIG1lbWJlcnNVcGRhdGVkID0gZ2V0QWxsSG91c2Vob2xkTWVtYmVycygpLm1hcChmdW5jdGlvbiAobWVtYmVyKSB7XG4gICAgcmV0dXJuIG1lbWJlclsnQHBlcnNvbiddLmlkID09PSBwZXJzb24uaWQgPyBfZXh0ZW5kcyh7fSwgbWVtYmVyLCBtZW1iZXJEYXRhLCB7ICdAcGVyc29uJzogX2V4dGVuZHMoe30sIG1lbWJlclsnQHBlcnNvbiddLCBwZXJzb24pIH0pIDogbWVtYmVyO1xuICB9KTtcblxuICBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKEhPVVNFSE9MRF9NRU1CRVJTX1NUT1JBR0VfS0VZLCBKU09OLnN0cmluZ2lmeShtZW1iZXJzVXBkYXRlZCkpO1xufVxuXG5mdW5jdGlvbiBhZGRIb3VzZWhvbGRNZW1iZXIocGVyc29uLCBtZW1iZXJEYXRhLCBpZCkge1xuICB2YXIgcGVvcGxlID0gZ2V0QWxsSG91c2Vob2xkTWVtYmVycygpIHx8IFtdO1xuICBtZW1iZXJEYXRhID0gbWVtYmVyRGF0YSB8fCB7fTtcblxuICBwZW9wbGUucHVzaChfZXh0ZW5kcyh7fSwgbWVtYmVyRGF0YSwge1xuICAgIHR5cGU6IG1lbWJlckRhdGEudHlwZSB8fCBIT1VTRUhPTERfTUVNQkVSX1RZUEUsXG4gICAgJ0BwZXJzb24nOiBfZXh0ZW5kcyh7fSwgcGVyc29uLCB7XG4gICAgICBpZDogaWQgfHwgJ3BlcnNvbicgKyBhdXRvSW5jcmVtZW50SWQoJ2hvdXNlaG9sZC1tZW1iZXJzJylcbiAgICB9KVxuICB9KSk7XG5cbiAgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbShIT1VTRUhPTERfTUVNQkVSU19TVE9SQUdFX0tFWSwgSlNPTi5zdHJpbmdpZnkocGVvcGxlKSk7XG59XG5cbmZ1bmN0aW9uIGdldEFsbEhvdXNlaG9sZE1lbWJlcnMoKSB7XG4gIHJldHVybiBKU09OLnBhcnNlKHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oSE9VU0VIT0xEX01FTUJFUlNfU1RPUkFHRV9LRVkpKSB8fCBbXTtcbn1cblxuZnVuY3Rpb24gZ2V0SG91c2Vob2xkTWVtYmVyQnlQZXJzb25JZChpZCkge1xuICByZXR1cm4gZ2V0QWxsSG91c2Vob2xkTWVtYmVycygpLmZpbmQoZnVuY3Rpb24gKG1lbWJlcikge1xuICAgIHJldHVybiBtZW1iZXJbJ0BwZXJzb24nXS5pZCA9PT0gaWQ7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBwZXJzb24ob3B0cykge1xuICBpZiAob3B0cy5maXJzdE5hbWUgPT09ICcnIHx8IG9wdHMubGFzdE5hbWUgPT09ICcnKSB7XG4gICAgY29uc29sZS5sb2coJ1VuYWJsZSB0byBjcmVhdGUgcGVyc29uIHdpdGggZGF0YTogJywgb3B0cy5maXJzdE5hbWUsICFvcHRzLm1pZGRsZU5hbWUsICFvcHRzLmxhc3ROYW1lKTtcbiAgfVxuXG4gIHZhciBtaWRkbGVOYW1lID0gb3B0cy5taWRkbGVOYW1lIHx8ICcnO1xuXG4gIHJldHVybiB7XG4gICAgZnVsbE5hbWU6IG9wdHMuZmlyc3ROYW1lICsgJyAnICsgbWlkZGxlTmFtZSArICcgJyArIG9wdHMubGFzdE5hbWUsXG4gICAgZmlyc3ROYW1lOiBvcHRzLmZpcnN0TmFtZSxcbiAgICBtaWRkbGVOYW1lOiBtaWRkbGVOYW1lLFxuICAgIGxhc3ROYW1lOiBvcHRzLmxhc3ROYW1lXG4gIH07XG59XG5cbmZ1bmN0aW9uIGlzVmlzaXRvcihtZW1iZXIpIHtcbiAgcmV0dXJuIG1lbWJlci50eXBlID09PSB3aW5kb3cuT05TLnN0b3JhZ2UuS0VZUy5WSVNJVE9SX1RZUEU7XG59XG5cbmZ1bmN0aW9uIGlzSG91c2Vob2xkTWVtYmVyKG1lbWJlcikge1xuICByZXR1cm4gbWVtYmVyLnR5cGUgPT09IHdpbmRvdy5PTlMuc3RvcmFnZS5LRVlTLkhPVVNFSE9MRF9NRU1CRVJfVFlQRTtcbn1cblxuZnVuY3Rpb24gaXNPdGhlckhvdXNlaG9sZE1lbWJlcihtZW1iZXIpIHtcbiAgcmV0dXJuIG1lbWJlci50eXBlID09PSB3aW5kb3cuT05TLnN0b3JhZ2UuS0VZUy5IT1VTRUhPTERfTUVNQkVSX1RZUEUgJiYgbWVtYmVyWydAcGVyc29uJ10uaWQgIT09IHdpbmRvdy5PTlMuc3RvcmFnZS5JRFMuVVNFUl9IT1VTRUhPTERfTUVNQkVSX0lEO1xufVxuXG4vKipcbiAqIFJlbGF0aW9uc2hpcHNcbiAqL1xuZnVuY3Rpb24gYWRkUmVsYXRpb25zaGlwKHJlbGF0aW9uc2hpcE9iaikge1xuICB2YXIgaG91c2Vob2xkUmVsYXRpb25zaGlwcyA9IGdldEFsbFJlbGF0aW9uc2hpcHMoKSB8fCBbXSxcbiAgICAgIGl0ZW0gPSBfZXh0ZW5kcyh7fSwgcmVsYXRpb25zaGlwT2JqLCB7XG4gICAgaWQ6IGF1dG9JbmNyZW1lbnRJZCgncmVsYXRpb25zaGlwcycpXG4gIH0pO1xuXG4gIGhvdXNlaG9sZFJlbGF0aW9uc2hpcHMucHVzaChpdGVtKTtcblxuICBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKFJFTEFUSU9OU0hJUFNfU1RPUkFHRV9LRVksIEpTT04uc3RyaW5naWZ5KGhvdXNlaG9sZFJlbGF0aW9uc2hpcHMpKTtcblxuICByZXR1cm4gaXRlbTtcbn1cblxuZnVuY3Rpb24gZWRpdFJlbGF0aW9uc2hpcChyZWxhdGlvbnNoaXBJZCwgdmFsdWVPYmplY3QpIHtcbiAgdmFyIGhvdXNlaG9sZFJlbGF0aW9uc2hpcHMgPSAoZ2V0QWxsUmVsYXRpb25zaGlwcygpIHx8IFtdKS5tYXAoZnVuY3Rpb24gKHJlbGF0aW9uc2hpcCkge1xuICAgIHJldHVybiByZWxhdGlvbnNoaXAuaWQgKyAnJyA9PT0gcmVsYXRpb25zaGlwSWQgKyAnJyA/IF9leHRlbmRzKHt9LCB2YWx1ZU9iamVjdCwge1xuICAgICAgaWQ6IHJlbGF0aW9uc2hpcElkXG4gICAgfSkgOiByZWxhdGlvbnNoaXA7XG4gIH0pO1xuXG4gIHNlc3Npb25TdG9yYWdlLnNldEl0ZW0oUkVMQVRJT05TSElQU19TVE9SQUdFX0tFWSwgSlNPTi5zdHJpbmdpZnkoaG91c2Vob2xkUmVsYXRpb25zaGlwcykpO1xufVxuXG5mdW5jdGlvbiBnZXRBbGxSZWxhdGlvbnNoaXBzKCkge1xuICByZXR1cm4gSlNPTi5wYXJzZShzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKFJFTEFUSU9OU0hJUFNfU1RPUkFHRV9LRVkpKSB8fCBbXTtcbn1cblxuZnVuY3Rpb24gZGVsZXRlQWxsUmVsYXRpb25zaGlwc0Zvck1lbWJlcihtZW1iZXJJZCkge1xuICB2YXIgaG91c2Vob2xkUmVsYXRpb25zaGlwcyA9IGdldEFsbFJlbGF0aW9uc2hpcHMoKS5maWx0ZXIoZnVuY3Rpb24gKHJlbGF0aW9uc2hpcCkge1xuICAgIHJldHVybiAhKG1lbWJlcklkID09PSByZWxhdGlvbnNoaXAucGVyc29uSXNJZCB8fCBtZW1iZXJJZCA9PT0gcmVsYXRpb25zaGlwLnBlcnNvblRvSWQpO1xuICB9KTtcblxuICBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKFJFTEFUSU9OU0hJUFNfU1RPUkFHRV9LRVksIEpTT04uc3RyaW5naWZ5KGhvdXNlaG9sZFJlbGF0aW9uc2hpcHMpKTtcbn1cblxuZnVuY3Rpb24gcmVsYXRpb25zaGlwKGRlc2NyaXB0aW9uLCBwZXJzb25Jc0lkLCBwZXJzb25Ub0lkKSB7XG4gIHJldHVybiB7XG4gICAgcGVyc29uSXNEZXNjcmlwdGlvbjogZGVzY3JpcHRpb24sXG4gICAgcGVyc29uSXNJZDogcGVyc29uSXNJZCxcbiAgICBwZXJzb25Ub0lkOiBwZXJzb25Ub0lkXG4gIH07XG59XG5cbi8qKlxuICogSGVscGVyc1xuICovXG5mdW5jdGlvbiBjcmVhdGVOYXZJdGVtKG1lbWJlcikge1xuICB2YXIgJG5vZGVFbCA9ICQoJzxsaSBjbGFzcz1cImpzLXRlbXBsYXRlLW5hdi1pdGVtIG5hdl9faXRlbSBwbHV0b1wiPicgKyAnICA8YSBjbGFzcz1cImpzLXRlbXBsYXRlLW5hdi1pdGVtLWxhYmVsIG5hdl9fbGlua1wiIGhyZWY9XCIjXCI+PC9hPicgKyAnPC9saT4nKSxcbiAgICAgICRsaW5rRWwgPSAkbm9kZUVsLmZpbmQoJy5qcy10ZW1wbGF0ZS1uYXYtaXRlbS1sYWJlbCcpO1xuXG4gICRsaW5rRWwuaHRtbChtZW1iZXJbJ0BwZXJzb24nXS5mdWxsTmFtZSk7XG5cbiAgaWYgKG1lbWJlclsnQHBlcnNvbiddLmlkID09PSBVU0VSX0hPVVNFSE9MRF9NRU1CRVJfSUQpIHtcbiAgICAkbGlua0VsLmF0dHIoJ2hyZWYnLCAnLi4vd2hhdC1pcy15b3VyLW5hbWUnKTtcbiAgfSBlbHNlIHtcbiAgICAkbGlua0VsLmF0dHIoJ2hyZWYnLCAnLi4vd2hvLWVsc2UtdG8tYWRkP2VkaXQ9JyArIG1lbWJlclsnQHBlcnNvbiddLmlkKTtcbiAgfVxuXG4gIHJldHVybiAkbm9kZUVsO1xufVxuXG5mdW5jdGlvbiB1cGRhdGVIb3VzZWhvbGRWaXNpdG9yc05hdmlnYXRpb25JdGVtcygpIHtcbiAgdmFyIGFsbEhvdXNlaG9sZE1lbWJlcnMgPSB3aW5kb3cuT05TLnN0b3JhZ2UuZ2V0QWxsSG91c2Vob2xkTWVtYmVycygpLFxuICAgICAgaG91c2Vob2xkTWVtYmVycyA9IGFsbEhvdXNlaG9sZE1lbWJlcnMuZmlsdGVyKHdpbmRvdy5PTlMuc3RvcmFnZS5pc0hvdXNlaG9sZE1lbWJlciksXG4gICAgICB2aXNpdG9ycyA9IGFsbEhvdXNlaG9sZE1lbWJlcnMuZmlsdGVyKHdpbmRvdy5PTlMuc3RvcmFnZS5pc1Zpc2l0b3IpO1xuXG4gIHZhciAkbmF2aWdhdGlvbkhvdXNlaG9sZE1lbWJlcnNFbCA9ICQoJyNuYXZpZ2F0aW9uLWhvdXNlaG9sZC1tZW1iZXJzJyksXG4gICAgICAkbmF2aWdhdGlvblZpc2l0b3JzRWwgPSAkKCcjbmF2aWdhdGlvbi12aXNpdG9ycycpO1xuXG4gIGlmIChob3VzZWhvbGRNZW1iZXJzLmxlbmd0aCkge1xuICAgICQuZWFjaChob3VzZWhvbGRNZW1iZXJzLCBmdW5jdGlvbiAoaSwgbWVtYmVyKSB7XG4gICAgICAkbmF2aWdhdGlvbkhvdXNlaG9sZE1lbWJlcnNFbC5hcHBlbmQoY3JlYXRlTmF2SXRlbShtZW1iZXIpKTtcbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICAkbmF2aWdhdGlvbkhvdXNlaG9sZE1lbWJlcnNFbC5wYXJlbnQoKS5oaWRlKCk7XG4gIH1cblxuICBpZiAodmlzaXRvcnMubGVuZ3RoKSB7XG4gICAgJC5lYWNoKHZpc2l0b3JzLCBmdW5jdGlvbiAoaSwgbWVtYmVyKSB7XG4gICAgICAkbmF2aWdhdGlvblZpc2l0b3JzRWwuYXBwZW5kKGNyZWF0ZU5hdkl0ZW0obWVtYmVyKSk7XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgJG5hdmlnYXRpb25WaXNpdG9yc0VsLnBhcmVudCgpLmhpZGUoKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBjcmVhdGVMaXN0SXRlbVBlcnNvbihtZW1iZXIpIHtcbiAgcmV0dXJuICQoJzxsaSBjbGFzcz1cImxpc3RfX2l0ZW1cIj4nKS5hZGRDbGFzcygnbWFycycpLmh0bWwoJzxzcGFuIGNsYXNzPVwibGlzdF9faXRlbS1uYW1lXCI+JyArIG1lbWJlclsnQHBlcnNvbiddLmZ1bGxOYW1lICsgJzwvc3Bhbj4nKTtcbn1cblxuZnVuY3Rpb24gcG9wdWxhdGVIb3VzZWhvbGRMaXN0KCkge1xuICB2YXIgJGVsID0gJCgnI2hvdXNlaG9sZC1tZW1iZXJzJyk7XG5cbiAgaWYgKCEkZWwubGVuZ3RoKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgdmFyIG1lbWJlcnMgPSBnZXRBbGxIb3VzZWhvbGRNZW1iZXJzKCkgfHwgW107XG5cbiAgJGVsLmVtcHR5KCkuYXBwZW5kKG1lbWJlcnMuZmlsdGVyKGZ1bmN0aW9uIChtZW1iZXIpIHtcbiAgICByZXR1cm4gbWVtYmVyLnR5cGUgPT09IEhPVVNFSE9MRF9NRU1CRVJfVFlQRTtcbiAgfSkubWFwKGNyZWF0ZUxpc3RJdGVtUGVyc29uKSk7XG5cbiAgJGVsLmFkZENsYXNzKCdsaXN0IGxpc3QtLXBlb3BsZS1wbGFpbicpO1xufVxuXG5mdW5jdGlvbiBwb3B1bGF0ZVZpc2l0b3JMaXN0KCkge1xuICB2YXIgJGVsID0gJCgnI3Zpc2l0b3JzLWxpc3QnKTtcblxuICBpZiAoISRlbC5sZW5ndGgpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICB2YXIgbWVtYmVycyA9IGdldEFsbEhvdXNlaG9sZE1lbWJlcnMoKSB8fCBbXTtcblxuICAkZWwuZW1wdHkoKS5hcHBlbmQobWVtYmVycy5maWx0ZXIoZnVuY3Rpb24gKG1lbWJlcikge1xuICAgIHJldHVybiBtZW1iZXIudHlwZSA9PT0gVklTSVRPUl9UWVBFO1xuICB9KS5tYXAoY3JlYXRlTGlzdEl0ZW1QZXJzb24pKTtcblxuICAkZWwuYWRkQ2xhc3MoJ2xpc3QgbGlzdC0tcGVvcGxlLXBsYWluJyk7XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZUFkZHJlc3NlcygpIHtcbiAgdmFyIGFkZHJlc3NMaW5lcyA9IChzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKCdhZGRyZXNzJykgfHwgJycpLnNwbGl0KCcsJyksXG4gICAgICBhZGRyZXNzTGluZTEgPSBhZGRyZXNzTGluZXNbMF0sXG4gICAgICBhZGRyZXNzTGluZTIgPSBhZGRyZXNzTGluZXNbMV07XG5cbiAgJCgnI3NlY3Rpb24tYWRkcmVzcycpLmh0bWwoYWRkcmVzc0xpbmUxKTtcbiAgJCgnLmFkZHJlc3MtdGV4dCcpLmh0bWwoYWRkcmVzc0xpbmUxICsgJywgJyArIGFkZHJlc3NMaW5lMik7XG59XG5cbmZ1bmN0aW9uIGF1dG9JbmNyZW1lbnRJZChjb2xsZWN0aW9uKSB7XG4gIHZhciBrID0gY29sbGVjdGlvbiArICctaW5jcmVtZW50JyxcbiAgICAgIGlkID0gcGFyc2VJbnQoc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbShrKSkgfHwgMDtcblxuICBpZCsrO1xuXG4gIHNlc3Npb25TdG9yYWdlLnNldEl0ZW0oaywgSlNPTi5zdHJpbmdpZnkoaWQpKTtcblxuICByZXR1cm4gaWQ7XG59XG5cbndpbmRvdy5PTlMgPSB7fTtcbndpbmRvdy5PTlMuc3RvcmFnZSA9IHtcbiAgZ2V0QWRkcmVzczogZ2V0QWRkcmVzcyxcbiAgYWRkSG91c2Vob2xkTWVtYmVyOiBhZGRIb3VzZWhvbGRNZW1iZXIsXG4gIHVwZGF0ZUhvdXNlaG9sZE1lbWJlcjogdXBkYXRlSG91c2Vob2xkTWVtYmVyLFxuICBkZWxldGVIb3VzZWhvbGRNZW1iZXI6IGRlbGV0ZUhvdXNlaG9sZE1lbWJlcixcbiAgZ2V0QWxsSG91c2Vob2xkTWVtYmVyczogZ2V0QWxsSG91c2Vob2xkTWVtYmVycyxcbiAgYWRkVXNlclBlcnNvbjogYWRkVXNlclBlcnNvbixcbiAgZ2V0VXNlclBlcnNvbjogZ2V0VXNlclBlcnNvbixcbiAgZ2V0VXNlckFzSG91c2Vob2xkTWVtYmVyOiBnZXRVc2VyQXNIb3VzZWhvbGRNZW1iZXIsXG4gIGdldEhvdXNlaG9sZE1lbWJlckJ5UGVyc29uSWQ6IGdldEhvdXNlaG9sZE1lbWJlckJ5UGVyc29uSWQsXG4gIHVwZGF0ZVVzZXJBc0hvdXNlaG9sZE1lbWJlcjogdXBkYXRlVXNlckFzSG91c2Vob2xkTWVtYmVyLFxuICBkZWxldGVVc2VyQXNIb3VzZWhvbGRNZW1iZXI6IGRlbGV0ZVVzZXJBc0hvdXNlaG9sZE1lbWJlcixcblxuICBpc1Zpc2l0b3I6IGlzVmlzaXRvcixcbiAgaXNPdGhlckhvdXNlaG9sZE1lbWJlcjogaXNPdGhlckhvdXNlaG9sZE1lbWJlcixcbiAgaXNIb3VzZWhvbGRNZW1iZXI6IGlzSG91c2Vob2xkTWVtYmVyLFxuXG4gIGFkZFJlbGF0aW9uc2hpcDogYWRkUmVsYXRpb25zaGlwLFxuICBlZGl0UmVsYXRpb25zaGlwOiBlZGl0UmVsYXRpb25zaGlwLFxuICBnZXRBbGxSZWxhdGlvbnNoaXBzOiBnZXRBbGxSZWxhdGlvbnNoaXBzLFxuICBkZWxldGVBbGxSZWxhdGlvbnNoaXBzRm9yTWVtYmVyOiBkZWxldGVBbGxSZWxhdGlvbnNoaXBzRm9yTWVtYmVyLFxuXG4gIHJlbGF0aW9uc2hpcERlc2NyaXB0aW9uTWFwOiByZWxhdGlvbnNoaXBEZXNjcmlwdGlvbk1hcCxcblxuICBLRVlTOiB7XG4gICAgSE9VU0VIT0xEX01FTUJFUlNfU1RPUkFHRV9LRVk6IEhPVVNFSE9MRF9NRU1CRVJTX1NUT1JBR0VfS0VZLFxuICAgIFVTRVJfU1RPUkFHRV9LRVk6IFVTRVJfU1RPUkFHRV9LRVksXG4gICAgSE9VU0VIT0xEX01FTUJFUl9UWVBFOiBIT1VTRUhPTERfTUVNQkVSX1RZUEUsXG4gICAgVklTSVRPUl9UWVBFOiBWSVNJVE9SX1RZUEVcbiAgfSxcblxuICBJRFM6IHtcbiAgICBVU0VSX0hPVVNFSE9MRF9NRU1CRVJfSUQ6IFVTRVJfSE9VU0VIT0xEX01FTUJFUl9JRFxuICB9LFxuXG4gIFRZUEVTOiB7XG4gICAgcGVyc29uOiBwZXJzb24sXG4gICAgcmVsYXRpb25zaGlwOiByZWxhdGlvbnNoaXBcbiAgfVxufTtcblxud2luZG93Lk9OUy5oZWxwZXJzID0ge1xuICBwb3B1bGF0ZUhvdXNlaG9sZExpc3Q6IHBvcHVsYXRlSG91c2Vob2xkTGlzdCxcbiAgcG9wdWxhdGVWaXNpdG9yTGlzdDogcG9wdWxhdGVWaXNpdG9yTGlzdFxufTtcblxuJChwb3B1bGF0ZUhvdXNlaG9sZExpc3QpO1xuJChwb3B1bGF0ZVZpc2l0b3JMaXN0KTtcbiQodXBkYXRlSG91c2Vob2xkVmlzaXRvcnNOYXZpZ2F0aW9uSXRlbXMpO1xuJCh1cGRhdGVBZGRyZXNzZXMpO1xuXG5leHBvcnRzLkhPVVNFSE9MRF9NRU1CRVJTX1NUT1JBR0VfS0VZID0gSE9VU0VIT0xEX01FTUJFUlNfU1RPUkFHRV9LRVk7XG5leHBvcnRzLlVTRVJfU1RPUkFHRV9LRVkgPSBVU0VSX1NUT1JBR0VfS0VZO1xuZXhwb3J0cy5VU0VSX0hPVVNFSE9MRF9NRU1CRVJfSUQgPSBVU0VSX0hPVVNFSE9MRF9NRU1CRVJfSUQ7XG5leHBvcnRzLkhPVVNFSE9MRF9NRU1CRVJfVFlQRSA9IEhPVVNFSE9MRF9NRU1CRVJfVFlQRTtcbmV4cG9ydHMuUkVMQVRJT05TSElQU19TVE9SQUdFX0tFWSA9IFJFTEFUSU9OU0hJUFNfU1RPUkFHRV9LRVk7XG5leHBvcnRzLlZJU0lUT1JfVFlQRSA9IFZJU0lUT1JfVFlQRTtcbmV4cG9ydHMuZ2V0QWRkcmVzcyA9IGdldEFkZHJlc3M7XG5leHBvcnRzLmFkZFVzZXJQZXJzb24gPSBhZGRVc2VyUGVyc29uO1xuZXhwb3J0cy5nZXRVc2VyUGVyc29uID0gZ2V0VXNlclBlcnNvbjtcbmV4cG9ydHMuZ2V0VXNlckFzSG91c2Vob2xkTWVtYmVyID0gZ2V0VXNlckFzSG91c2Vob2xkTWVtYmVyO1xuZXhwb3J0cy5kZWxldGVVc2VyQXNIb3VzZWhvbGRNZW1iZXIgPSBkZWxldGVVc2VyQXNIb3VzZWhvbGRNZW1iZXI7XG5leHBvcnRzLmRlbGV0ZUhvdXNlaG9sZE1lbWJlciA9IGRlbGV0ZUhvdXNlaG9sZE1lbWJlcjtcbmV4cG9ydHMudXBkYXRlVXNlckFzSG91c2Vob2xkTWVtYmVyID0gdXBkYXRlVXNlckFzSG91c2Vob2xkTWVtYmVyO1xuZXhwb3J0cy51cGRhdGVIb3VzZWhvbGRNZW1iZXIgPSB1cGRhdGVIb3VzZWhvbGRNZW1iZXI7XG5leHBvcnRzLmFkZEhvdXNlaG9sZE1lbWJlciA9IGFkZEhvdXNlaG9sZE1lbWJlcjtcbmV4cG9ydHMuZ2V0QWxsSG91c2Vob2xkTWVtYmVycyA9IGdldEFsbEhvdXNlaG9sZE1lbWJlcnM7XG5leHBvcnRzLmdldEhvdXNlaG9sZE1lbWJlckJ5UGVyc29uSWQgPSBnZXRIb3VzZWhvbGRNZW1iZXJCeVBlcnNvbklkO1xuZXhwb3J0cy5wZXJzb24gPSBwZXJzb247XG5leHBvcnRzLmlzVmlzaXRvciA9IGlzVmlzaXRvcjtcbmV4cG9ydHMuaXNIb3VzZWhvbGRNZW1iZXIgPSBpc0hvdXNlaG9sZE1lbWJlcjtcbmV4cG9ydHMuaXNPdGhlckhvdXNlaG9sZE1lbWJlciA9IGlzT3RoZXJIb3VzZWhvbGRNZW1iZXI7XG5leHBvcnRzLmFkZFJlbGF0aW9uc2hpcCA9IGFkZFJlbGF0aW9uc2hpcDtcbmV4cG9ydHMuZWRpdFJlbGF0aW9uc2hpcCA9IGVkaXRSZWxhdGlvbnNoaXA7XG5leHBvcnRzLmdldEFsbFJlbGF0aW9uc2hpcHMgPSBnZXRBbGxSZWxhdGlvbnNoaXBzO1xuZXhwb3J0cy5kZWxldGVBbGxSZWxhdGlvbnNoaXBzRm9yTWVtYmVyID0gZGVsZXRlQWxsUmVsYXRpb25zaGlwc0Zvck1lbWJlcjtcbmV4cG9ydHMucmVsYXRpb25zaGlwID0gcmVsYXRpb25zaGlwO1xuIl19
