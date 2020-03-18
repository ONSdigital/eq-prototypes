(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function autoIncrementId(collection) {
  var k = collection + '-increment',
      id = parseInt(sessionStorage.getItem(k)) || 0;

  id++;

  sessionStorage.setItem(k, JSON.stringify(id));

  return id;
}

function removeFromList(list, val) {

  function doRemove(item) {
    var foundId = list.indexOf(item);

    /**
     * Guard
     */
    if (foundId === -1) {
      console.log('Attempt to remove from list failed: ', list, val);
      return;
    }

    list.splice(foundId, 1);
  }

  if (_.isArray(val)) {
    $.each(val, function (i, item) {
      doRemove(item);
    });
  } else {
    doRemove(val);
  }
}

function trailingNameS(name) {
  return name[name.length - 1] === 's' ? '\&#x2019;' : '\&#x2019;s';
}

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



































var toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};

var HOUSEHOLD_MEMBERS_STORAGE_KEY = 'household-members';
var USER_HOUSEHOLD_MEMBER_ID = 'person_me';
var HOUSEHOLD_MEMBER_TYPE = 'household-member';
var VISITOR_TYPE = 'visitor';

/**
 * Types
 */
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

/**
 * Storage
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

function getMemberPersonId(member) {
  return member['@person'].id;
}

/**
 * Comparators
 */
function isVisitor(member) {
  return member.type === window.ONS.storage.KEYS.VISITOR_TYPE;
}

function isHouseholdMember(member) {
  return member.type === window.ONS.storage.KEYS.HOUSEHOLD_MEMBER_TYPE;
}

function isOtherHouseholdMember(member) {
  return member.type === window.ONS.storage.KEYS.HOUSEHOLD_MEMBER_TYPE && member['@person'].id !== window.ONS.storage.IDS.USER_HOUSEHOLD_MEMBER_ID;
}

var tempAwayQuestionSentenceMap = {
  'studying-away': 'who is working or studying away from home',
  'armed-forces': 'who is a member of the armed forces',
  'outside-uk': 'who is staying outside the UK for 12 months'
};

/**
 * Augment Underscore library
 */
var _$1 = window._ || {};

var RELATIONSHIPS_STORAGE_KEY = 'relationships';

var relationshipTypes = {
  'spouse': { id: 'spouse' },
  'child-parent': { id: 'child-parent' },
  'step-child-parent': { id: 'step-child-parent' },
  'grandchild-grandparent': { id: 'grandchild-grandparent' },
  'half-sibling': { id: 'half-sibling' },
  'sibling': { id: 'sibling' },
  'step-brother-sister': { id: 'step-brother-sister' },
  'partner': { id: 'partner' },
  'unrelated': { id: 'unrelated' },
  'other-relation': { id: 'other-relation' }
};

var relationshipDescriptionMap = {
  // covered
  'husband-wife': {
    sentanceLabel: 'husband or wife',
    summaryAdjective: 'husband or wife',
    type: relationshipTypes['spouse']
  },
  // covered
  'mother-father': {
    sentanceLabel: 'mother or father',
    summaryAdjective: 'mother or father',
    type: relationshipTypes['child-parent']
  },
  // covered
  'step-mother-father': {
    sentanceLabel: 'stepmother or stepfather',
    summaryAdjective: 'stepmother or stepfather',
    type: relationshipTypes['step-child-parent']
  },
  // covered
  'son-daughter': {
    sentanceLabel: 'son or daughter',
    summaryAdjective: 'son or daughter',
    type: relationshipTypes['child-parent']
  },
  // covered
  'half-brother-sister': {
    sentanceLabel: 'half-brother or half-sister',
    summaryAdjective: 'half-brother or half-sister',
    type: relationshipTypes['half-sibling']
  },
  // covered
  'step-child': {
    sentanceLabel: 'stepchild',
    summaryAdjective: 'stepchild',
    type: relationshipTypes['step-child-parent']
  },
  // covered
  'grandparent': {
    sentanceLabel: 'grandparent',
    summaryAdjective: 'grandparent',
    type: relationshipTypes['grandchild-grandparent']
  },
  // covered
  'grandchild': {
    sentanceLabel: 'grandchild',
    summaryAdjective: 'grandchild',
    type: relationshipTypes['grandchild-grandparent']
  },
  // covered
  'brother-sister': {
    sentanceLabel: 'brother or sister',
    summaryAdjective: 'brother or sister',
    type: relationshipTypes['sibling']
  },
  // covered
  'step-brother-sister': {
    sentanceLabel: 'stepbrother or stepsister',
    summaryAdjective: 'stepbrother or stepsister',
    type: relationshipTypes['step-brother-sister']
  },
  // covered
  'other-relation': {
    sentanceLabel: 'other relation',
    summaryAdjective: 'related',
    type: relationshipTypes['other-relation']
  },
  // covered
  'partner': {
    sentanceLabel: 'partner',
    summaryAdjective: 'partner',
    type: relationshipTypes['partner']
  },
  'same-sex-partner': {
    sentanceLabel: 'same sex civil partner',
    summaryAdjective: 'same sex civil partner',
    type: relationshipTypes['partner']
  },
  // covered
  'unrelated': {
    sentanceLabel: 'unrelated',
    summaryAdjective: 'unrelated',
    type: relationshipTypes['unrelated']
  }
};

function nameElement(name) {
  return '<strong>' + name + '</strong>';
}

function personListStr(peopleArr) {
  if (peopleArr.length < 1) {
    console.log(peopleArr, 'not enough people to create a list string');
    return;
  }

  if (peopleArr.length === 1) {
    return nameElement(peopleArr[0]);
  }

  var peopleCopy = [].concat(toConsumableArray(peopleArr)),
      lastPerson = peopleCopy.pop();

  return peopleCopy.map(nameElement).join(', ') + ' and ' + nameElement(lastPerson);
}

var relationshipSummaryTemplates = {
  'partnership': function partnership(person1, person2, description) {
    return nameElement(person1) + ' is ' + nameElement(person2 + trailingNameS(person2)) + ' ' + description;
  },
  'twoFamilyMembersToMany': function twoFamilyMembersToMany(parent1, parent2, childrenArr, description) {
    return nameElement(parent1) + ' and ' + nameElement(parent2) + ' are ' + personListStr(childrenArr.map(function (name) {
      return name + trailingNameS(name);
    })) + ' ' + description;
  },
  'oneFamilyMemberToMany': function oneFamilyMemberToMany(parent, childrenArr, description) {
    return nameElement(parent) + ' is ' + personListStr(childrenArr.map(function (name) {
      return name + trailingNameS(name);
    })) + ' ' + description;
  },
  'manyToMany': function manyToMany(peopleArr1, peopleArr2, description) {
    return personListStr(peopleArr1) + ' ' + (peopleArr1.length > 1 ? 'are' : 'is') + ' ' + description + ' to ' + personListStr(peopleArr2);
  },
  'allMutual': function allMutual(peopleArr, description) {
    return personListStr(peopleArr) + ' are ' + description;
  }
};

/**
 * Types
 */
function relationship(description, personIsId, personToId) {
  var opts = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  return {
    personIsDescription: description,
    personIsId: personIsId,
    personToId: personToId,
    inferred: !!opts.inferred
  };
}

/**
 * Storage
 */
function addRelationship(relationshipObj) {
  var householdRelationships = getAllRelationships() || [],
      item = _extends({}, relationshipObj, {
    id: autoIncrementId(RELATIONSHIPS_STORAGE_KEY)
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

function getAllManualRelationships() {
  return getAllRelationships().filter(function (relationship) {
    return !relationship.inferred;
  });
}

function deleteAllRelationshipsForMember(personId) {
  var householdRelationships = getAllRelationships().filter(function (relationship) {
    return !(personId === relationship.personIsId || personId === relationship.personToId);
  });

  sessionStorage.setItem(RELATIONSHIPS_STORAGE_KEY, JSON.stringify(householdRelationships));
}

/**
 * Comparators
 */
function isInRelationship(personId, relationship) {
  return relationship.personToId === personId || relationship.personIsId === personId;
}

function isAChildInRelationship(personId, relationship) {
  /**
   * Guard
   */
  if (!isInRelationship(personId, relationship)) {
    return false;
  }

  return relationship.personIsDescription === 'mother-father' && relationship.personToId === personId || relationship.personIsDescription === 'son-daughter' && relationship.personIsId === personId;
}

function isASiblingInRelationship(personId, relationship) {
  return isInRelationship(personId, relationship) && relationshipDescriptionMap[relationship.personIsDescription].type.id === 'sibling';
}

function isAParentInRelationship(personId, relationship) {
  /**
   * Guard
   */
  if (!isInRelationship(personId, relationship)) {
    return false;
  }

  return relationship.personIsDescription === 'mother-father' && relationship.personIsId === personId || relationship.personIsDescription === 'son-daughter' && relationship.personToId === personId;
}

function areAnyChildrenInRelationshipNotParent(childrenIds, notParentId, relationship) {
  /**
   * Guard
   * If relationship type is not child-parent
   */
  if (relationshipDescriptionMap[relationship.personIsDescription].type.id !== 'child-parent') {

    return false;
  }

  var childIndexAsPersonIs = childrenIds.indexOf(relationship.personIsId),
      childIndexAsPersonTo = childrenIds.indexOf(relationship.personToId);

  /**
   * Find parents with the same children
   *
   * If a personIs-child is not in relationship
   * or 2 children are found in relationship
   */
  if (childIndexAsPersonIs === -1 && childIndexAsPersonTo === -1 || childIndexAsPersonIs !== -1 && childIndexAsPersonTo !== -1) {
    return false;
  }

  /**
   * Child must be in relationship, get child index
   */
  var childIndex = childIndexAsPersonIs !== -1 ? childIndexAsPersonIs : childIndexAsPersonTo;

  /**
   * If personIs is not in relationship
   * and child from previous relationship is a child in this relationship
   */
  return !isInRelationship(notParentId, relationship) && isAChildInRelationship(childrenIds[childIndex], relationship);
}

function isRelationshipType(relationshipType, relationship) {
  var typeOfRelationship = relationshipDescriptionMap[relationship.personIsDescription].type.id;

  /**
   * relationshipType can be an array of types
   */
  return _$1.isArray(relationshipType) ? !!_$1.find(relationshipType, function (rType) {
    return rType === typeOfRelationship;
  }) : typeOfRelationship === relationshipType;
}

/**
 * Retrieve people by role in relationships
 */
function getParentIdFromRelationship(relationship) {
  var parentId = void 0;

  if (relationship.personIsDescription === 'mother-father') {
    parentId = relationship.personIsId;
  }

  if (relationship.personIsDescription === 'son-daughter') {
    parentId = relationship.personToId;
  }

  if (!parentId) {
    console.log('Parent not found in relationship: ', relationship);
    return false;
  }

  return parentId;
}

function getChildIdFromRelationship(relationship) {
  var childId = void 0;

  if (relationship.personIsDescription === 'mother-father') {
    childId = relationship.personToId;
  }

  if (relationship.personIsDescription === 'son-daughter') {
    childId = relationship.personIsId;
  }

  if (!childId) {
    console.log('Child not found in relationship: ', relationship);
    return false;
  }

  return childId;
}

function getSiblingIdFromRelationship(personId, relationship) {
  if (!isInRelationship(personId, relationship)) {
    console.log('Person ' + personId + ' not found in relationship: ', relationship);
    return false;
  }

  return relationship[relationship.personIsId === personId ? 'personToId' : 'personIsId'];
}

function getOtherPersonIdFromRelationship(personId, relationship) {
  return relationship.personIsId === personId ? relationship.personToId : relationship.personIsId;
}

function getAllParentsOf(personId) {
  return getAllRelationships().filter(isAChildInRelationship.bind(null, personId)).map(function (relationship) {
    return getPersonFromMember(getHouseholdMemberByPersonId(getParentIdFromRelationship(relationship)));
  });
}

function getAllChildrenOf(personId) {
  return getAllRelationships().filter(isAParentInRelationship.bind(null, personId)).map(function (relationship) {
    return getHouseholdMemberByPersonId(getChildIdFromRelationship(relationship))['@person'];
  });
}

function getPersonIdFromPerson(person$$1) {
  return person$$1.id;
}

function getPersonFromMember(member) {
  return member['@person'];
}

/**
 * Missing relationship inference
 */
var missingRelationshipInference = {
  siblingsOf: function siblingsOf(subjectMember) {

    var missingRelationships = [],
        allRelationships = getAllRelationships(),
        person$$1 = getPersonFromMember(subjectMember),
        personId = person$$1.id,
        parents = getAllParentsOf(personId),
        siblingIds = allRelationships.filter(isASiblingInRelationship.bind(null, personId)).map(getSiblingIdFromRelationship.bind(null, personId));

    /**
     * If 2 parent relationships of 'person' are found we can attempt to infer
     * sibling relationships
     */
    if (parents.length === 2) {

      getAllHouseholdMembers().filter(isHouseholdMember).forEach(function (member) {

        var memberPersonId = member['@person'].id;

        /**
         * Guard
         * If member is the subject member
         * or member is a parent
         * or member already has a sibling relationship with 'person'
         * skip member
         */
        if (memberPersonId === personId || memberPersonId === parents[0].id || memberPersonId === parents[1].id || siblingIds.indexOf(memberPersonId) > -1) {
          return;
        }

        var memberParents = getAllParentsOf(memberPersonId);

        /**
         * If 2 parents of 'member' are found
         * and they are the same parents of 'person'
         * we have identified a missing inferred relationship
         */
        if (memberParents.length === 2 && _$1.difference(parents.map(getPersonIdFromPerson), memberParents.map(getPersonIdFromPerson)).length === 0) {

          /**
           * Add to missingRelationships
           */
          missingRelationships.push(relationship('brother-sister', person$$1.id, memberPersonId, { inferred: true }));
        }
      });
    }

    return missingRelationships;
  }
};

function inferRelationships(relationship, personIs, personTo) {
  var missingRelationships = [];

  if (relationship.personIsDescription === 'mother-father') {
    missingRelationships = missingRelationships.concat(missingRelationshipInference.siblingsOf(personTo));
  }

  if (relationship.personIsDescription === 'son-daughter') {
    missingRelationships = missingRelationships.concat(missingRelationshipInference.siblingsOf(personIs));
  }

  $.each(missingRelationships, function (i, relationship) {
    addRelationship(relationship);
  });
}

function findNextMissingRelationship() {
  var householdMembers = getAllHouseholdMembers().filter(isHouseholdMember),
      relationships = getAllRelationships(),
      missingRelationshipMembers = [],
      personIs = null;

  /**
   * Find the next missing relationship
   */
  $.each(householdMembers, function (i, member) {
    var personId = member['@person'].id;

    /**
     * Get all relationships for this member
     */
    var memberRelationships = relationships.filter(function (relationship) {
      return relationship.personIsId === personId || relationship.personToId === personId;
    }),
        memberRelationshipToIds = memberRelationships.map(function (relationship) {
      return relationship.personIsId === personId ? relationship.personToId : relationship.personIsId;
    }) || [];

    /**
     * If total relationships related to this member isn't equal to
     * total household members -1, indicates missing relationship
     */
    if (memberRelationships.length < householdMembers.length - 1) {

      /**
       * All missing relationship members
       */
      missingRelationshipMembers = householdMembers.filter(function (m) {
        return memberRelationshipToIds.indexOf(m['@person'].id) === -1 && m['@person'].id !== personId;
      });

      personIs = member;

      return false;
    }
  });

  return personIs ? {
    personIs: personIs,
    personTo: missingRelationshipMembers[0]
  } : null;
}

function getPeopleIdsMissingRelationshipsWithPerson(personId) {
  var remainingPersonIds = getAllHouseholdMembers().filter(isHouseholdMember).map(function (member) {
    return member['@person'].id;
  });

  /**
   * Remove this person from the list
   */
  removeFromList(remainingPersonIds, personId);

  $.each(getAllRelationships(), function (i, relationship) {
    if (!isInRelationship(personId, relationship)) {
      return;
    }

    /**
     * Remove the other person from the remainingPersonIds list
     */
    removeFromList(remainingPersonIds, getOtherPersonIdFromRelationship(personId, relationship));
  });

  return remainingPersonIds;
}

function getRelationshipType(relationship) {
  return relationshipDescriptionMap[relationship.personIsDescription].type;
}

/**
 * Retrieve from relationship group
 */
function getRelationshipsWithPersonIds(relationships, idArr) {
  return relationships.filter(function (childRelationship) {
    return idArr.indexOf(childRelationship.personIsId) !== -1 || idArr.indexOf(childRelationship.personToId) !== -1;
  });
}

function getRelationshipOf(person1, person2) {
  return getAllRelationships().find(function (relationship) {
    return isInRelationship(person1, relationship) && isInRelationship(person2, relationship);
  });
}

var USER_STORAGE_KEY = 'user-details';

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
function addUserPerson(person$$1) {
  sessionStorage.setItem(USER_STORAGE_KEY, JSON.stringify(person$$1));
}

function getUserPerson() {
  return JSON.parse(sessionStorage.getItem(USER_STORAGE_KEY));
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

function populateList($el, memberType) {
  if (!$el.length) {
    return;
  }

  var members = getAllHouseholdMembers() || [];

  $el.empty().append(members.filter(function (member) {
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
  var addressLines = (sessionStorage.getItem('address') || '').split(','),
      addressLine1 = addressLines[0],
      addressLine2 = addressLines[1];

  $('#section-address').html(addressLine1 || '<a' + ' href="../test-address">Address not' + ' found</a>');
  $('.address-text').html(addressLine1 && addressLine2 ? addressLine1 + (addressLine2 ? ', ' + addressLine2 : '') : '<a href="../test-address">Address not found</a>');
}

window.ONS = window.ONS || {};
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
  getMemberPersonId: getMemberPersonId,
  updateUserAsHouseholdMember: updateUserAsHouseholdMember,
  deleteUserAsHouseholdMember: deleteUserAsHouseholdMember,
  tempAwayQuestionSentenceMap: tempAwayQuestionSentenceMap,

  isVisitor: isVisitor,
  isOtherHouseholdMember: isOtherHouseholdMember,
  isHouseholdMember: isHouseholdMember,

  addRelationship: addRelationship,
  editRelationship: editRelationship,
  getAllRelationships: getAllRelationships,
  getAllManualRelationships: getAllManualRelationships,
  deleteAllRelationshipsForMember: deleteAllRelationshipsForMember,

  getAllParentsOf: getAllParentsOf,
  getAllChildrenOf: getAllChildrenOf,
  getParentIdFromRelationship: getParentIdFromRelationship,
  getChildIdFromRelationship: getChildIdFromRelationship,
  getOtherPersonIdFromRelationship: getOtherPersonIdFromRelationship,
  isAParentInRelationship: isAParentInRelationship,
  isAChildInRelationship: isAChildInRelationship,
  isInRelationship: isInRelationship,
  areAnyChildrenInRelationshipNotParent: areAnyChildrenInRelationshipNotParent,
  isRelationshipType: isRelationshipType,
  getRelationshipOf: getRelationshipOf,

  relationshipDescriptionMap: relationshipDescriptionMap,
  relationshipSummaryTemplates: relationshipSummaryTemplates,
  missingRelationshipInference: missingRelationshipInference,
  inferRelationships: inferRelationships,
  getRelationshipsWithPersonIds: getRelationshipsWithPersonIds,
  getPeopleIdsMissingRelationshipsWithPerson: getPeopleIdsMissingRelationshipsWithPerson,
  getRelationshipType: getRelationshipType,
  findNextMissingRelationship: findNextMissingRelationship,

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

window.ONS.utils = {
  removeFromList: removeFromList,
  trailingNameS: trailingNameS
};

$(populateHouseholdList);
$(populateVisitorList);
$(updateHouseholdVisitorsNavigationItems);
$(updateAddresses);

exports.USER_STORAGE_KEY = USER_STORAGE_KEY;
exports.getAddress = getAddress;
exports.addUserPerson = addUserPerson;
exports.getUserPerson = getUserPerson;

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJfcHJvdG90eXBlcy95b3VyLWhvdXNlaG9sZC12My9idW5kbGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuXG5mdW5jdGlvbiBhdXRvSW5jcmVtZW50SWQoY29sbGVjdGlvbikge1xuICB2YXIgayA9IGNvbGxlY3Rpb24gKyAnLWluY3JlbWVudCcsXG4gICAgICBpZCA9IHBhcnNlSW50KHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oaykpIHx8IDA7XG5cbiAgaWQrKztcblxuICBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKGssIEpTT04uc3RyaW5naWZ5KGlkKSk7XG5cbiAgcmV0dXJuIGlkO1xufVxuXG5mdW5jdGlvbiByZW1vdmVGcm9tTGlzdChsaXN0LCB2YWwpIHtcblxuICBmdW5jdGlvbiBkb1JlbW92ZShpdGVtKSB7XG4gICAgdmFyIGZvdW5kSWQgPSBsaXN0LmluZGV4T2YoaXRlbSk7XG5cbiAgICAvKipcbiAgICAgKiBHdWFyZFxuICAgICAqL1xuICAgIGlmIChmb3VuZElkID09PSAtMSkge1xuICAgICAgY29uc29sZS5sb2coJ0F0dGVtcHQgdG8gcmVtb3ZlIGZyb20gbGlzdCBmYWlsZWQ6ICcsIGxpc3QsIHZhbCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgbGlzdC5zcGxpY2UoZm91bmRJZCwgMSk7XG4gIH1cblxuICBpZiAoXy5pc0FycmF5KHZhbCkpIHtcbiAgICAkLmVhY2godmFsLCBmdW5jdGlvbiAoaSwgaXRlbSkge1xuICAgICAgZG9SZW1vdmUoaXRlbSk7XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgZG9SZW1vdmUodmFsKTtcbiAgfVxufVxuXG5mdW5jdGlvbiB0cmFpbGluZ05hbWVTKG5hbWUpIHtcbiAgcmV0dXJuIG5hbWVbbmFtZS5sZW5ndGggLSAxXSA9PT0gJ3MnID8gJ1xcJiN4MjAxOTsnIDogJ1xcJiN4MjAxOTtzJztcbn1cblxudmFyIF9leHRlbmRzID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiAodGFyZ2V0KSB7XG4gIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXTtcblxuICAgIGZvciAodmFyIGtleSBpbiBzb3VyY2UpIHtcbiAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoc291cmNlLCBrZXkpKSB7XG4gICAgICAgIHRhcmdldFtrZXldID0gc291cmNlW2tleV07XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRhcmdldDtcbn07XG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxudmFyIHRvQ29uc3VtYWJsZUFycmF5ID0gZnVuY3Rpb24gKGFycikge1xuICBpZiAoQXJyYXkuaXNBcnJheShhcnIpKSB7XG4gICAgZm9yICh2YXIgaSA9IDAsIGFycjIgPSBBcnJheShhcnIubGVuZ3RoKTsgaSA8IGFyci5sZW5ndGg7IGkrKykgYXJyMltpXSA9IGFycltpXTtcblxuICAgIHJldHVybiBhcnIyO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBBcnJheS5mcm9tKGFycik7XG4gIH1cbn07XG5cbnZhciBIT1VTRUhPTERfTUVNQkVSU19TVE9SQUdFX0tFWSA9ICdob3VzZWhvbGQtbWVtYmVycyc7XG52YXIgVVNFUl9IT1VTRUhPTERfTUVNQkVSX0lEID0gJ3BlcnNvbl9tZSc7XG52YXIgSE9VU0VIT0xEX01FTUJFUl9UWVBFID0gJ2hvdXNlaG9sZC1tZW1iZXInO1xudmFyIFZJU0lUT1JfVFlQRSA9ICd2aXNpdG9yJztcblxuLyoqXG4gKiBUeXBlc1xuICovXG5mdW5jdGlvbiBwZXJzb24ob3B0cykge1xuICBpZiAob3B0cy5maXJzdE5hbWUgPT09ICcnIHx8IG9wdHMubGFzdE5hbWUgPT09ICcnKSB7XG4gICAgY29uc29sZS5sb2coJ1VuYWJsZSB0byBjcmVhdGUgcGVyc29uIHdpdGggZGF0YTogJywgb3B0cy5maXJzdE5hbWUsICFvcHRzLm1pZGRsZU5hbWUsICFvcHRzLmxhc3ROYW1lKTtcbiAgfVxuXG4gIHZhciBtaWRkbGVOYW1lID0gb3B0cy5taWRkbGVOYW1lIHx8ICcnO1xuXG4gIHJldHVybiB7XG4gICAgZnVsbE5hbWU6IG9wdHMuZmlyc3ROYW1lICsgJyAnICsgbWlkZGxlTmFtZSArICcgJyArIG9wdHMubGFzdE5hbWUsXG4gICAgZmlyc3ROYW1lOiBvcHRzLmZpcnN0TmFtZSxcbiAgICBtaWRkbGVOYW1lOiBtaWRkbGVOYW1lLFxuICAgIGxhc3ROYW1lOiBvcHRzLmxhc3ROYW1lXG4gIH07XG59XG5cbi8qKlxuICogU3RvcmFnZVxuICovXG5mdW5jdGlvbiBnZXRVc2VyQXNIb3VzZWhvbGRNZW1iZXIoKSB7XG4gIHJldHVybiBnZXRBbGxIb3VzZWhvbGRNZW1iZXJzKCkuZmluZChmdW5jdGlvbiAobWVtYmVyKSB7XG4gICAgcmV0dXJuIG1lbWJlclsnQHBlcnNvbiddLmlkID09PSBVU0VSX0hPVVNFSE9MRF9NRU1CRVJfSUQ7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBkZWxldGVVc2VyQXNIb3VzZWhvbGRNZW1iZXIoKSB7XG4gIGRlbGV0ZUhvdXNlaG9sZE1lbWJlcihVU0VSX0hPVVNFSE9MRF9NRU1CRVJfSUQpO1xufVxuXG5mdW5jdGlvbiBkZWxldGVIb3VzZWhvbGRNZW1iZXIocGVyc29uSWQpIHtcbiAgdmFyIG1lbWJlcnMgPSBnZXRBbGxIb3VzZWhvbGRNZW1iZXJzKCkuZmlsdGVyKGZ1bmN0aW9uIChtZW1iZXIpIHtcbiAgICByZXR1cm4gbWVtYmVyWydAcGVyc29uJ10uaWQgIT09IHBlcnNvbklkO1xuICB9KTtcblxuICBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKEhPVVNFSE9MRF9NRU1CRVJTX1NUT1JBR0VfS0VZLCBKU09OLnN0cmluZ2lmeShtZW1iZXJzKSk7XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZVVzZXJBc0hvdXNlaG9sZE1lbWJlcihwZXJzb24sIG1lbWJlckRhdGEpIHtcbiAgdmFyIHVzZXJBc0hvdXNlaG9sZE1lbWJlciA9IGdldFVzZXJBc0hvdXNlaG9sZE1lbWJlcigpO1xuXG4gIHVzZXJBc0hvdXNlaG9sZE1lbWJlciA/IHVwZGF0ZUhvdXNlaG9sZE1lbWJlcih1c2VyQXNIb3VzZWhvbGRNZW1iZXJbJ0BwZXJzb24nXSwgbWVtYmVyRGF0YSkgOiBhZGRIb3VzZWhvbGRNZW1iZXIocGVyc29uLCBtZW1iZXJEYXRhLCBVU0VSX0hPVVNFSE9MRF9NRU1CRVJfSUQpO1xufVxuXG5mdW5jdGlvbiB1cGRhdGVIb3VzZWhvbGRNZW1iZXIocGVyc29uLCBtZW1iZXJEYXRhKSB7XG4gIHZhciBtZW1iZXJzVXBkYXRlZCA9IGdldEFsbEhvdXNlaG9sZE1lbWJlcnMoKS5tYXAoZnVuY3Rpb24gKG1lbWJlcikge1xuICAgIHJldHVybiBtZW1iZXJbJ0BwZXJzb24nXS5pZCA9PT0gcGVyc29uLmlkID8gX2V4dGVuZHMoe30sIG1lbWJlciwgbWVtYmVyRGF0YSwgeyAnQHBlcnNvbic6IF9leHRlbmRzKHt9LCBtZW1iZXJbJ0BwZXJzb24nXSwgcGVyc29uKSB9KSA6IG1lbWJlcjtcbiAgfSk7XG5cbiAgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbShIT1VTRUhPTERfTUVNQkVSU19TVE9SQUdFX0tFWSwgSlNPTi5zdHJpbmdpZnkobWVtYmVyc1VwZGF0ZWQpKTtcbn1cblxuZnVuY3Rpb24gYWRkSG91c2Vob2xkTWVtYmVyKHBlcnNvbiwgbWVtYmVyRGF0YSwgaWQpIHtcbiAgdmFyIHBlb3BsZSA9IGdldEFsbEhvdXNlaG9sZE1lbWJlcnMoKSB8fCBbXTtcbiAgbWVtYmVyRGF0YSA9IG1lbWJlckRhdGEgfHwge307XG5cbiAgcGVvcGxlLnB1c2goX2V4dGVuZHMoe30sIG1lbWJlckRhdGEsIHtcbiAgICB0eXBlOiBtZW1iZXJEYXRhLnR5cGUgfHwgSE9VU0VIT0xEX01FTUJFUl9UWVBFLFxuICAgICdAcGVyc29uJzogX2V4dGVuZHMoe30sIHBlcnNvbiwge1xuICAgICAgaWQ6IGlkIHx8ICdwZXJzb24nICsgYXV0b0luY3JlbWVudElkKCdob3VzZWhvbGQtbWVtYmVycycpXG4gICAgfSlcbiAgfSkpO1xuXG4gIHNlc3Npb25TdG9yYWdlLnNldEl0ZW0oSE9VU0VIT0xEX01FTUJFUlNfU1RPUkFHRV9LRVksIEpTT04uc3RyaW5naWZ5KHBlb3BsZSkpO1xufVxuXG5mdW5jdGlvbiBnZXRBbGxIb3VzZWhvbGRNZW1iZXJzKCkge1xuICByZXR1cm4gSlNPTi5wYXJzZShzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKEhPVVNFSE9MRF9NRU1CRVJTX1NUT1JBR0VfS0VZKSkgfHwgW107XG59XG5cbmZ1bmN0aW9uIGdldEhvdXNlaG9sZE1lbWJlckJ5UGVyc29uSWQoaWQpIHtcbiAgcmV0dXJuIGdldEFsbEhvdXNlaG9sZE1lbWJlcnMoKS5maW5kKGZ1bmN0aW9uIChtZW1iZXIpIHtcbiAgICByZXR1cm4gbWVtYmVyWydAcGVyc29uJ10uaWQgPT09IGlkO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gZ2V0TWVtYmVyUGVyc29uSWQobWVtYmVyKSB7XG4gIHJldHVybiBtZW1iZXJbJ0BwZXJzb24nXS5pZDtcbn1cblxuLyoqXG4gKiBDb21wYXJhdG9yc1xuICovXG5mdW5jdGlvbiBpc1Zpc2l0b3IobWVtYmVyKSB7XG4gIHJldHVybiBtZW1iZXIudHlwZSA9PT0gd2luZG93Lk9OUy5zdG9yYWdlLktFWVMuVklTSVRPUl9UWVBFO1xufVxuXG5mdW5jdGlvbiBpc0hvdXNlaG9sZE1lbWJlcihtZW1iZXIpIHtcbiAgcmV0dXJuIG1lbWJlci50eXBlID09PSB3aW5kb3cuT05TLnN0b3JhZ2UuS0VZUy5IT1VTRUhPTERfTUVNQkVSX1RZUEU7XG59XG5cbmZ1bmN0aW9uIGlzT3RoZXJIb3VzZWhvbGRNZW1iZXIobWVtYmVyKSB7XG4gIHJldHVybiBtZW1iZXIudHlwZSA9PT0gd2luZG93Lk9OUy5zdG9yYWdlLktFWVMuSE9VU0VIT0xEX01FTUJFUl9UWVBFICYmIG1lbWJlclsnQHBlcnNvbiddLmlkICE9PSB3aW5kb3cuT05TLnN0b3JhZ2UuSURTLlVTRVJfSE9VU0VIT0xEX01FTUJFUl9JRDtcbn1cblxudmFyIHRlbXBBd2F5UXVlc3Rpb25TZW50ZW5jZU1hcCA9IHtcbiAgJ3N0dWR5aW5nLWF3YXknOiAnd2hvIGlzIHdvcmtpbmcgb3Igc3R1ZHlpbmcgYXdheSBmcm9tIGhvbWUnLFxuICAnYXJtZWQtZm9yY2VzJzogJ3dobyBpcyBhIG1lbWJlciBvZiB0aGUgYXJtZWQgZm9yY2VzJyxcbiAgJ291dHNpZGUtdWsnOiAnd2hvIGlzIHN0YXlpbmcgb3V0c2lkZSB0aGUgVUsgZm9yIDEyIG1vbnRocydcbn07XG5cbi8qKlxuICogQXVnbWVudCBVbmRlcnNjb3JlIGxpYnJhcnlcbiAqL1xudmFyIF8kMSA9IHdpbmRvdy5fIHx8IHt9O1xuXG52YXIgUkVMQVRJT05TSElQU19TVE9SQUdFX0tFWSA9ICdyZWxhdGlvbnNoaXBzJztcblxudmFyIHJlbGF0aW9uc2hpcFR5cGVzID0ge1xuICAnc3BvdXNlJzogeyBpZDogJ3Nwb3VzZScgfSxcbiAgJ2NoaWxkLXBhcmVudCc6IHsgaWQ6ICdjaGlsZC1wYXJlbnQnIH0sXG4gICdzdGVwLWNoaWxkLXBhcmVudCc6IHsgaWQ6ICdzdGVwLWNoaWxkLXBhcmVudCcgfSxcbiAgJ2dyYW5kY2hpbGQtZ3JhbmRwYXJlbnQnOiB7IGlkOiAnZ3JhbmRjaGlsZC1ncmFuZHBhcmVudCcgfSxcbiAgJ2hhbGYtc2libGluZyc6IHsgaWQ6ICdoYWxmLXNpYmxpbmcnIH0sXG4gICdzaWJsaW5nJzogeyBpZDogJ3NpYmxpbmcnIH0sXG4gICdzdGVwLWJyb3RoZXItc2lzdGVyJzogeyBpZDogJ3N0ZXAtYnJvdGhlci1zaXN0ZXInIH0sXG4gICdwYXJ0bmVyJzogeyBpZDogJ3BhcnRuZXInIH0sXG4gICd1bnJlbGF0ZWQnOiB7IGlkOiAndW5yZWxhdGVkJyB9LFxuICAnb3RoZXItcmVsYXRpb24nOiB7IGlkOiAnb3RoZXItcmVsYXRpb24nIH1cbn07XG5cbnZhciByZWxhdGlvbnNoaXBEZXNjcmlwdGlvbk1hcCA9IHtcbiAgLy8gY292ZXJlZFxuICAnaHVzYmFuZC13aWZlJzoge1xuICAgIHNlbnRhbmNlTGFiZWw6ICdodXNiYW5kIG9yIHdpZmUnLFxuICAgIHN1bW1hcnlBZGplY3RpdmU6ICdodXNiYW5kIG9yIHdpZmUnLFxuICAgIHR5cGU6IHJlbGF0aW9uc2hpcFR5cGVzWydzcG91c2UnXVxuICB9LFxuICAvLyBjb3ZlcmVkXG4gICdtb3RoZXItZmF0aGVyJzoge1xuICAgIHNlbnRhbmNlTGFiZWw6ICdtb3RoZXIgb3IgZmF0aGVyJyxcbiAgICBzdW1tYXJ5QWRqZWN0aXZlOiAnbW90aGVyIG9yIGZhdGhlcicsXG4gICAgdHlwZTogcmVsYXRpb25zaGlwVHlwZXNbJ2NoaWxkLXBhcmVudCddXG4gIH0sXG4gIC8vIGNvdmVyZWRcbiAgJ3N0ZXAtbW90aGVyLWZhdGhlcic6IHtcbiAgICBzZW50YW5jZUxhYmVsOiAnc3RlcG1vdGhlciBvciBzdGVwZmF0aGVyJyxcbiAgICBzdW1tYXJ5QWRqZWN0aXZlOiAnc3RlcG1vdGhlciBvciBzdGVwZmF0aGVyJyxcbiAgICB0eXBlOiByZWxhdGlvbnNoaXBUeXBlc1snc3RlcC1jaGlsZC1wYXJlbnQnXVxuICB9LFxuICAvLyBjb3ZlcmVkXG4gICdzb24tZGF1Z2h0ZXInOiB7XG4gICAgc2VudGFuY2VMYWJlbDogJ3NvbiBvciBkYXVnaHRlcicsXG4gICAgc3VtbWFyeUFkamVjdGl2ZTogJ3NvbiBvciBkYXVnaHRlcicsXG4gICAgdHlwZTogcmVsYXRpb25zaGlwVHlwZXNbJ2NoaWxkLXBhcmVudCddXG4gIH0sXG4gIC8vIGNvdmVyZWRcbiAgJ2hhbGYtYnJvdGhlci1zaXN0ZXInOiB7XG4gICAgc2VudGFuY2VMYWJlbDogJ2hhbGYtYnJvdGhlciBvciBoYWxmLXNpc3RlcicsXG4gICAgc3VtbWFyeUFkamVjdGl2ZTogJ2hhbGYtYnJvdGhlciBvciBoYWxmLXNpc3RlcicsXG4gICAgdHlwZTogcmVsYXRpb25zaGlwVHlwZXNbJ2hhbGYtc2libGluZyddXG4gIH0sXG4gIC8vIGNvdmVyZWRcbiAgJ3N0ZXAtY2hpbGQnOiB7XG4gICAgc2VudGFuY2VMYWJlbDogJ3N0ZXBjaGlsZCcsXG4gICAgc3VtbWFyeUFkamVjdGl2ZTogJ3N0ZXBjaGlsZCcsXG4gICAgdHlwZTogcmVsYXRpb25zaGlwVHlwZXNbJ3N0ZXAtY2hpbGQtcGFyZW50J11cbiAgfSxcbiAgLy8gY292ZXJlZFxuICAnZ3JhbmRwYXJlbnQnOiB7XG4gICAgc2VudGFuY2VMYWJlbDogJ2dyYW5kcGFyZW50JyxcbiAgICBzdW1tYXJ5QWRqZWN0aXZlOiAnZ3JhbmRwYXJlbnQnLFxuICAgIHR5cGU6IHJlbGF0aW9uc2hpcFR5cGVzWydncmFuZGNoaWxkLWdyYW5kcGFyZW50J11cbiAgfSxcbiAgLy8gY292ZXJlZFxuICAnZ3JhbmRjaGlsZCc6IHtcbiAgICBzZW50YW5jZUxhYmVsOiAnZ3JhbmRjaGlsZCcsXG4gICAgc3VtbWFyeUFkamVjdGl2ZTogJ2dyYW5kY2hpbGQnLFxuICAgIHR5cGU6IHJlbGF0aW9uc2hpcFR5cGVzWydncmFuZGNoaWxkLWdyYW5kcGFyZW50J11cbiAgfSxcbiAgLy8gY292ZXJlZFxuICAnYnJvdGhlci1zaXN0ZXInOiB7XG4gICAgc2VudGFuY2VMYWJlbDogJ2Jyb3RoZXIgb3Igc2lzdGVyJyxcbiAgICBzdW1tYXJ5QWRqZWN0aXZlOiAnYnJvdGhlciBvciBzaXN0ZXInLFxuICAgIHR5cGU6IHJlbGF0aW9uc2hpcFR5cGVzWydzaWJsaW5nJ11cbiAgfSxcbiAgLy8gY292ZXJlZFxuICAnc3RlcC1icm90aGVyLXNpc3Rlcic6IHtcbiAgICBzZW50YW5jZUxhYmVsOiAnc3RlcGJyb3RoZXIgb3Igc3RlcHNpc3RlcicsXG4gICAgc3VtbWFyeUFkamVjdGl2ZTogJ3N0ZXBicm90aGVyIG9yIHN0ZXBzaXN0ZXInLFxuICAgIHR5cGU6IHJlbGF0aW9uc2hpcFR5cGVzWydzdGVwLWJyb3RoZXItc2lzdGVyJ11cbiAgfSxcbiAgLy8gY292ZXJlZFxuICAnb3RoZXItcmVsYXRpb24nOiB7XG4gICAgc2VudGFuY2VMYWJlbDogJ290aGVyIHJlbGF0aW9uJyxcbiAgICBzdW1tYXJ5QWRqZWN0aXZlOiAncmVsYXRlZCcsXG4gICAgdHlwZTogcmVsYXRpb25zaGlwVHlwZXNbJ290aGVyLXJlbGF0aW9uJ11cbiAgfSxcbiAgLy8gY292ZXJlZFxuICAncGFydG5lcic6IHtcbiAgICBzZW50YW5jZUxhYmVsOiAncGFydG5lcicsXG4gICAgc3VtbWFyeUFkamVjdGl2ZTogJ3BhcnRuZXInLFxuICAgIHR5cGU6IHJlbGF0aW9uc2hpcFR5cGVzWydwYXJ0bmVyJ11cbiAgfSxcbiAgJ3NhbWUtc2V4LXBhcnRuZXInOiB7XG4gICAgc2VudGFuY2VMYWJlbDogJ3NhbWUgc2V4IGNpdmlsIHBhcnRuZXInLFxuICAgIHN1bW1hcnlBZGplY3RpdmU6ICdzYW1lIHNleCBjaXZpbCBwYXJ0bmVyJyxcbiAgICB0eXBlOiByZWxhdGlvbnNoaXBUeXBlc1sncGFydG5lciddXG4gIH0sXG4gIC8vIGNvdmVyZWRcbiAgJ3VucmVsYXRlZCc6IHtcbiAgICBzZW50YW5jZUxhYmVsOiAndW5yZWxhdGVkJyxcbiAgICBzdW1tYXJ5QWRqZWN0aXZlOiAndW5yZWxhdGVkJyxcbiAgICB0eXBlOiByZWxhdGlvbnNoaXBUeXBlc1sndW5yZWxhdGVkJ11cbiAgfVxufTtcblxuZnVuY3Rpb24gbmFtZUVsZW1lbnQobmFtZSkge1xuICByZXR1cm4gJzxzdHJvbmc+JyArIG5hbWUgKyAnPC9zdHJvbmc+Jztcbn1cblxuZnVuY3Rpb24gcGVyc29uTGlzdFN0cihwZW9wbGVBcnIpIHtcbiAgaWYgKHBlb3BsZUFyci5sZW5ndGggPCAxKSB7XG4gICAgY29uc29sZS5sb2cocGVvcGxlQXJyLCAnbm90IGVub3VnaCBwZW9wbGUgdG8gY3JlYXRlIGEgbGlzdCBzdHJpbmcnKTtcbiAgICByZXR1cm47XG4gIH1cblxuICBpZiAocGVvcGxlQXJyLmxlbmd0aCA9PT0gMSkge1xuICAgIHJldHVybiBuYW1lRWxlbWVudChwZW9wbGVBcnJbMF0pO1xuICB9XG5cbiAgdmFyIHBlb3BsZUNvcHkgPSBbXS5jb25jYXQodG9Db25zdW1hYmxlQXJyYXkocGVvcGxlQXJyKSksXG4gICAgICBsYXN0UGVyc29uID0gcGVvcGxlQ29weS5wb3AoKTtcblxuICByZXR1cm4gcGVvcGxlQ29weS5tYXAobmFtZUVsZW1lbnQpLmpvaW4oJywgJykgKyAnIGFuZCAnICsgbmFtZUVsZW1lbnQobGFzdFBlcnNvbik7XG59XG5cbnZhciByZWxhdGlvbnNoaXBTdW1tYXJ5VGVtcGxhdGVzID0ge1xuICAncGFydG5lcnNoaXAnOiBmdW5jdGlvbiBwYXJ0bmVyc2hpcChwZXJzb24xLCBwZXJzb24yLCBkZXNjcmlwdGlvbikge1xuICAgIHJldHVybiBuYW1lRWxlbWVudChwZXJzb24xKSArICcgaXMgJyArIG5hbWVFbGVtZW50KHBlcnNvbjIgKyB0cmFpbGluZ05hbWVTKHBlcnNvbjIpKSArICcgJyArIGRlc2NyaXB0aW9uO1xuICB9LFxuICAndHdvRmFtaWx5TWVtYmVyc1RvTWFueSc6IGZ1bmN0aW9uIHR3b0ZhbWlseU1lbWJlcnNUb01hbnkocGFyZW50MSwgcGFyZW50MiwgY2hpbGRyZW5BcnIsIGRlc2NyaXB0aW9uKSB7XG4gICAgcmV0dXJuIG5hbWVFbGVtZW50KHBhcmVudDEpICsgJyBhbmQgJyArIG5hbWVFbGVtZW50KHBhcmVudDIpICsgJyBhcmUgJyArIHBlcnNvbkxpc3RTdHIoY2hpbGRyZW5BcnIubWFwKGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgICByZXR1cm4gbmFtZSArIHRyYWlsaW5nTmFtZVMobmFtZSk7XG4gICAgfSkpICsgJyAnICsgZGVzY3JpcHRpb247XG4gIH0sXG4gICdvbmVGYW1pbHlNZW1iZXJUb01hbnknOiBmdW5jdGlvbiBvbmVGYW1pbHlNZW1iZXJUb01hbnkocGFyZW50LCBjaGlsZHJlbkFyciwgZGVzY3JpcHRpb24pIHtcbiAgICByZXR1cm4gbmFtZUVsZW1lbnQocGFyZW50KSArICcgaXMgJyArIHBlcnNvbkxpc3RTdHIoY2hpbGRyZW5BcnIubWFwKGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgICByZXR1cm4gbmFtZSArIHRyYWlsaW5nTmFtZVMobmFtZSk7XG4gICAgfSkpICsgJyAnICsgZGVzY3JpcHRpb247XG4gIH0sXG4gICdtYW55VG9NYW55JzogZnVuY3Rpb24gbWFueVRvTWFueShwZW9wbGVBcnIxLCBwZW9wbGVBcnIyLCBkZXNjcmlwdGlvbikge1xuICAgIHJldHVybiBwZXJzb25MaXN0U3RyKHBlb3BsZUFycjEpICsgJyAnICsgKHBlb3BsZUFycjEubGVuZ3RoID4gMSA/ICdhcmUnIDogJ2lzJykgKyAnICcgKyBkZXNjcmlwdGlvbiArICcgdG8gJyArIHBlcnNvbkxpc3RTdHIocGVvcGxlQXJyMik7XG4gIH0sXG4gICdhbGxNdXR1YWwnOiBmdW5jdGlvbiBhbGxNdXR1YWwocGVvcGxlQXJyLCBkZXNjcmlwdGlvbikge1xuICAgIHJldHVybiBwZXJzb25MaXN0U3RyKHBlb3BsZUFycikgKyAnIGFyZSAnICsgZGVzY3JpcHRpb247XG4gIH1cbn07XG5cbi8qKlxuICogVHlwZXNcbiAqL1xuZnVuY3Rpb24gcmVsYXRpb25zaGlwKGRlc2NyaXB0aW9uLCBwZXJzb25Jc0lkLCBwZXJzb25Ub0lkKSB7XG4gIHZhciBvcHRzID0gYXJndW1lbnRzLmxlbmd0aCA+IDMgJiYgYXJndW1lbnRzWzNdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbM10gOiB7fTtcblxuICByZXR1cm4ge1xuICAgIHBlcnNvbklzRGVzY3JpcHRpb246IGRlc2NyaXB0aW9uLFxuICAgIHBlcnNvbklzSWQ6IHBlcnNvbklzSWQsXG4gICAgcGVyc29uVG9JZDogcGVyc29uVG9JZCxcbiAgICBpbmZlcnJlZDogISFvcHRzLmluZmVycmVkXG4gIH07XG59XG5cbi8qKlxuICogU3RvcmFnZVxuICovXG5mdW5jdGlvbiBhZGRSZWxhdGlvbnNoaXAocmVsYXRpb25zaGlwT2JqKSB7XG4gIHZhciBob3VzZWhvbGRSZWxhdGlvbnNoaXBzID0gZ2V0QWxsUmVsYXRpb25zaGlwcygpIHx8IFtdLFxuICAgICAgaXRlbSA9IF9leHRlbmRzKHt9LCByZWxhdGlvbnNoaXBPYmosIHtcbiAgICBpZDogYXV0b0luY3JlbWVudElkKFJFTEFUSU9OU0hJUFNfU1RPUkFHRV9LRVkpXG4gIH0pO1xuXG4gIGhvdXNlaG9sZFJlbGF0aW9uc2hpcHMucHVzaChpdGVtKTtcblxuICBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKFJFTEFUSU9OU0hJUFNfU1RPUkFHRV9LRVksIEpTT04uc3RyaW5naWZ5KGhvdXNlaG9sZFJlbGF0aW9uc2hpcHMpKTtcblxuICByZXR1cm4gaXRlbTtcbn1cblxuZnVuY3Rpb24gZWRpdFJlbGF0aW9uc2hpcChyZWxhdGlvbnNoaXBJZCwgdmFsdWVPYmplY3QpIHtcbiAgdmFyIGhvdXNlaG9sZFJlbGF0aW9uc2hpcHMgPSAoZ2V0QWxsUmVsYXRpb25zaGlwcygpIHx8IFtdKS5tYXAoZnVuY3Rpb24gKHJlbGF0aW9uc2hpcCkge1xuICAgIHJldHVybiByZWxhdGlvbnNoaXAuaWQgKyAnJyA9PT0gcmVsYXRpb25zaGlwSWQgKyAnJyA/IF9leHRlbmRzKHt9LCB2YWx1ZU9iamVjdCwge1xuICAgICAgaWQ6IHJlbGF0aW9uc2hpcElkXG4gICAgfSkgOiByZWxhdGlvbnNoaXA7XG4gIH0pO1xuXG4gIHNlc3Npb25TdG9yYWdlLnNldEl0ZW0oUkVMQVRJT05TSElQU19TVE9SQUdFX0tFWSwgSlNPTi5zdHJpbmdpZnkoaG91c2Vob2xkUmVsYXRpb25zaGlwcykpO1xufVxuXG5mdW5jdGlvbiBnZXRBbGxSZWxhdGlvbnNoaXBzKCkge1xuICByZXR1cm4gSlNPTi5wYXJzZShzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKFJFTEFUSU9OU0hJUFNfU1RPUkFHRV9LRVkpKSB8fCBbXTtcbn1cblxuZnVuY3Rpb24gZ2V0QWxsTWFudWFsUmVsYXRpb25zaGlwcygpIHtcbiAgcmV0dXJuIGdldEFsbFJlbGF0aW9uc2hpcHMoKS5maWx0ZXIoZnVuY3Rpb24gKHJlbGF0aW9uc2hpcCkge1xuICAgIHJldHVybiAhcmVsYXRpb25zaGlwLmluZmVycmVkO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gZGVsZXRlQWxsUmVsYXRpb25zaGlwc0Zvck1lbWJlcihwZXJzb25JZCkge1xuICB2YXIgaG91c2Vob2xkUmVsYXRpb25zaGlwcyA9IGdldEFsbFJlbGF0aW9uc2hpcHMoKS5maWx0ZXIoZnVuY3Rpb24gKHJlbGF0aW9uc2hpcCkge1xuICAgIHJldHVybiAhKHBlcnNvbklkID09PSByZWxhdGlvbnNoaXAucGVyc29uSXNJZCB8fCBwZXJzb25JZCA9PT0gcmVsYXRpb25zaGlwLnBlcnNvblRvSWQpO1xuICB9KTtcblxuICBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKFJFTEFUSU9OU0hJUFNfU1RPUkFHRV9LRVksIEpTT04uc3RyaW5naWZ5KGhvdXNlaG9sZFJlbGF0aW9uc2hpcHMpKTtcbn1cblxuLyoqXG4gKiBDb21wYXJhdG9yc1xuICovXG5mdW5jdGlvbiBpc0luUmVsYXRpb25zaGlwKHBlcnNvbklkLCByZWxhdGlvbnNoaXApIHtcbiAgcmV0dXJuIHJlbGF0aW9uc2hpcC5wZXJzb25Ub0lkID09PSBwZXJzb25JZCB8fCByZWxhdGlvbnNoaXAucGVyc29uSXNJZCA9PT0gcGVyc29uSWQ7XG59XG5cbmZ1bmN0aW9uIGlzQUNoaWxkSW5SZWxhdGlvbnNoaXAocGVyc29uSWQsIHJlbGF0aW9uc2hpcCkge1xuICAvKipcbiAgICogR3VhcmRcbiAgICovXG4gIGlmICghaXNJblJlbGF0aW9uc2hpcChwZXJzb25JZCwgcmVsYXRpb25zaGlwKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHJldHVybiByZWxhdGlvbnNoaXAucGVyc29uSXNEZXNjcmlwdGlvbiA9PT0gJ21vdGhlci1mYXRoZXInICYmIHJlbGF0aW9uc2hpcC5wZXJzb25Ub0lkID09PSBwZXJzb25JZCB8fCByZWxhdGlvbnNoaXAucGVyc29uSXNEZXNjcmlwdGlvbiA9PT0gJ3Nvbi1kYXVnaHRlcicgJiYgcmVsYXRpb25zaGlwLnBlcnNvbklzSWQgPT09IHBlcnNvbklkO1xufVxuXG5mdW5jdGlvbiBpc0FTaWJsaW5nSW5SZWxhdGlvbnNoaXAocGVyc29uSWQsIHJlbGF0aW9uc2hpcCkge1xuICByZXR1cm4gaXNJblJlbGF0aW9uc2hpcChwZXJzb25JZCwgcmVsYXRpb25zaGlwKSAmJiByZWxhdGlvbnNoaXBEZXNjcmlwdGlvbk1hcFtyZWxhdGlvbnNoaXAucGVyc29uSXNEZXNjcmlwdGlvbl0udHlwZS5pZCA9PT0gJ3NpYmxpbmcnO1xufVxuXG5mdW5jdGlvbiBpc0FQYXJlbnRJblJlbGF0aW9uc2hpcChwZXJzb25JZCwgcmVsYXRpb25zaGlwKSB7XG4gIC8qKlxuICAgKiBHdWFyZFxuICAgKi9cbiAgaWYgKCFpc0luUmVsYXRpb25zaGlwKHBlcnNvbklkLCByZWxhdGlvbnNoaXApKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcmV0dXJuIHJlbGF0aW9uc2hpcC5wZXJzb25Jc0Rlc2NyaXB0aW9uID09PSAnbW90aGVyLWZhdGhlcicgJiYgcmVsYXRpb25zaGlwLnBlcnNvbklzSWQgPT09IHBlcnNvbklkIHx8IHJlbGF0aW9uc2hpcC5wZXJzb25Jc0Rlc2NyaXB0aW9uID09PSAnc29uLWRhdWdodGVyJyAmJiByZWxhdGlvbnNoaXAucGVyc29uVG9JZCA9PT0gcGVyc29uSWQ7XG59XG5cbmZ1bmN0aW9uIGFyZUFueUNoaWxkcmVuSW5SZWxhdGlvbnNoaXBOb3RQYXJlbnQoY2hpbGRyZW5JZHMsIG5vdFBhcmVudElkLCByZWxhdGlvbnNoaXApIHtcbiAgLyoqXG4gICAqIEd1YXJkXG4gICAqIElmIHJlbGF0aW9uc2hpcCB0eXBlIGlzIG5vdCBjaGlsZC1wYXJlbnRcbiAgICovXG4gIGlmIChyZWxhdGlvbnNoaXBEZXNjcmlwdGlvbk1hcFtyZWxhdGlvbnNoaXAucGVyc29uSXNEZXNjcmlwdGlvbl0udHlwZS5pZCAhPT0gJ2NoaWxkLXBhcmVudCcpIHtcblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHZhciBjaGlsZEluZGV4QXNQZXJzb25JcyA9IGNoaWxkcmVuSWRzLmluZGV4T2YocmVsYXRpb25zaGlwLnBlcnNvbklzSWQpLFxuICAgICAgY2hpbGRJbmRleEFzUGVyc29uVG8gPSBjaGlsZHJlbklkcy5pbmRleE9mKHJlbGF0aW9uc2hpcC5wZXJzb25Ub0lkKTtcblxuICAvKipcbiAgICogRmluZCBwYXJlbnRzIHdpdGggdGhlIHNhbWUgY2hpbGRyZW5cbiAgICpcbiAgICogSWYgYSBwZXJzb25Jcy1jaGlsZCBpcyBub3QgaW4gcmVsYXRpb25zaGlwXG4gICAqIG9yIDIgY2hpbGRyZW4gYXJlIGZvdW5kIGluIHJlbGF0aW9uc2hpcFxuICAgKi9cbiAgaWYgKGNoaWxkSW5kZXhBc1BlcnNvbklzID09PSAtMSAmJiBjaGlsZEluZGV4QXNQZXJzb25UbyA9PT0gLTEgfHwgY2hpbGRJbmRleEFzUGVyc29uSXMgIT09IC0xICYmIGNoaWxkSW5kZXhBc1BlcnNvblRvICE9PSAtMSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGlsZCBtdXN0IGJlIGluIHJlbGF0aW9uc2hpcCwgZ2V0IGNoaWxkIGluZGV4XG4gICAqL1xuICB2YXIgY2hpbGRJbmRleCA9IGNoaWxkSW5kZXhBc1BlcnNvbklzICE9PSAtMSA/IGNoaWxkSW5kZXhBc1BlcnNvbklzIDogY2hpbGRJbmRleEFzUGVyc29uVG87XG5cbiAgLyoqXG4gICAqIElmIHBlcnNvbklzIGlzIG5vdCBpbiByZWxhdGlvbnNoaXBcbiAgICogYW5kIGNoaWxkIGZyb20gcHJldmlvdXMgcmVsYXRpb25zaGlwIGlzIGEgY2hpbGQgaW4gdGhpcyByZWxhdGlvbnNoaXBcbiAgICovXG4gIHJldHVybiAhaXNJblJlbGF0aW9uc2hpcChub3RQYXJlbnRJZCwgcmVsYXRpb25zaGlwKSAmJiBpc0FDaGlsZEluUmVsYXRpb25zaGlwKGNoaWxkcmVuSWRzW2NoaWxkSW5kZXhdLCByZWxhdGlvbnNoaXApO1xufVxuXG5mdW5jdGlvbiBpc1JlbGF0aW9uc2hpcFR5cGUocmVsYXRpb25zaGlwVHlwZSwgcmVsYXRpb25zaGlwKSB7XG4gIHZhciB0eXBlT2ZSZWxhdGlvbnNoaXAgPSByZWxhdGlvbnNoaXBEZXNjcmlwdGlvbk1hcFtyZWxhdGlvbnNoaXAucGVyc29uSXNEZXNjcmlwdGlvbl0udHlwZS5pZDtcblxuICAvKipcbiAgICogcmVsYXRpb25zaGlwVHlwZSBjYW4gYmUgYW4gYXJyYXkgb2YgdHlwZXNcbiAgICovXG4gIHJldHVybiBfJDEuaXNBcnJheShyZWxhdGlvbnNoaXBUeXBlKSA/ICEhXyQxLmZpbmQocmVsYXRpb25zaGlwVHlwZSwgZnVuY3Rpb24gKHJUeXBlKSB7XG4gICAgcmV0dXJuIHJUeXBlID09PSB0eXBlT2ZSZWxhdGlvbnNoaXA7XG4gIH0pIDogdHlwZU9mUmVsYXRpb25zaGlwID09PSByZWxhdGlvbnNoaXBUeXBlO1xufVxuXG4vKipcbiAqIFJldHJpZXZlIHBlb3BsZSBieSByb2xlIGluIHJlbGF0aW9uc2hpcHNcbiAqL1xuZnVuY3Rpb24gZ2V0UGFyZW50SWRGcm9tUmVsYXRpb25zaGlwKHJlbGF0aW9uc2hpcCkge1xuICB2YXIgcGFyZW50SWQgPSB2b2lkIDA7XG5cbiAgaWYgKHJlbGF0aW9uc2hpcC5wZXJzb25Jc0Rlc2NyaXB0aW9uID09PSAnbW90aGVyLWZhdGhlcicpIHtcbiAgICBwYXJlbnRJZCA9IHJlbGF0aW9uc2hpcC5wZXJzb25Jc0lkO1xuICB9XG5cbiAgaWYgKHJlbGF0aW9uc2hpcC5wZXJzb25Jc0Rlc2NyaXB0aW9uID09PSAnc29uLWRhdWdodGVyJykge1xuICAgIHBhcmVudElkID0gcmVsYXRpb25zaGlwLnBlcnNvblRvSWQ7XG4gIH1cblxuICBpZiAoIXBhcmVudElkKSB7XG4gICAgY29uc29sZS5sb2coJ1BhcmVudCBub3QgZm91bmQgaW4gcmVsYXRpb25zaGlwOiAnLCByZWxhdGlvbnNoaXApO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHJldHVybiBwYXJlbnRJZDtcbn1cblxuZnVuY3Rpb24gZ2V0Q2hpbGRJZEZyb21SZWxhdGlvbnNoaXAocmVsYXRpb25zaGlwKSB7XG4gIHZhciBjaGlsZElkID0gdm9pZCAwO1xuXG4gIGlmIChyZWxhdGlvbnNoaXAucGVyc29uSXNEZXNjcmlwdGlvbiA9PT0gJ21vdGhlci1mYXRoZXInKSB7XG4gICAgY2hpbGRJZCA9IHJlbGF0aW9uc2hpcC5wZXJzb25Ub0lkO1xuICB9XG5cbiAgaWYgKHJlbGF0aW9uc2hpcC5wZXJzb25Jc0Rlc2NyaXB0aW9uID09PSAnc29uLWRhdWdodGVyJykge1xuICAgIGNoaWxkSWQgPSByZWxhdGlvbnNoaXAucGVyc29uSXNJZDtcbiAgfVxuXG4gIGlmICghY2hpbGRJZCkge1xuICAgIGNvbnNvbGUubG9nKCdDaGlsZCBub3QgZm91bmQgaW4gcmVsYXRpb25zaGlwOiAnLCByZWxhdGlvbnNoaXApO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHJldHVybiBjaGlsZElkO1xufVxuXG5mdW5jdGlvbiBnZXRTaWJsaW5nSWRGcm9tUmVsYXRpb25zaGlwKHBlcnNvbklkLCByZWxhdGlvbnNoaXApIHtcbiAgaWYgKCFpc0luUmVsYXRpb25zaGlwKHBlcnNvbklkLCByZWxhdGlvbnNoaXApKSB7XG4gICAgY29uc29sZS5sb2coJ1BlcnNvbiAnICsgcGVyc29uSWQgKyAnIG5vdCBmb3VuZCBpbiByZWxhdGlvbnNoaXA6ICcsIHJlbGF0aW9uc2hpcCk7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcmV0dXJuIHJlbGF0aW9uc2hpcFtyZWxhdGlvbnNoaXAucGVyc29uSXNJZCA9PT0gcGVyc29uSWQgPyAncGVyc29uVG9JZCcgOiAncGVyc29uSXNJZCddO1xufVxuXG5mdW5jdGlvbiBnZXRPdGhlclBlcnNvbklkRnJvbVJlbGF0aW9uc2hpcChwZXJzb25JZCwgcmVsYXRpb25zaGlwKSB7XG4gIHJldHVybiByZWxhdGlvbnNoaXAucGVyc29uSXNJZCA9PT0gcGVyc29uSWQgPyByZWxhdGlvbnNoaXAucGVyc29uVG9JZCA6IHJlbGF0aW9uc2hpcC5wZXJzb25Jc0lkO1xufVxuXG5mdW5jdGlvbiBnZXRBbGxQYXJlbnRzT2YocGVyc29uSWQpIHtcbiAgcmV0dXJuIGdldEFsbFJlbGF0aW9uc2hpcHMoKS5maWx0ZXIoaXNBQ2hpbGRJblJlbGF0aW9uc2hpcC5iaW5kKG51bGwsIHBlcnNvbklkKSkubWFwKGZ1bmN0aW9uIChyZWxhdGlvbnNoaXApIHtcbiAgICByZXR1cm4gZ2V0UGVyc29uRnJvbU1lbWJlcihnZXRIb3VzZWhvbGRNZW1iZXJCeVBlcnNvbklkKGdldFBhcmVudElkRnJvbVJlbGF0aW9uc2hpcChyZWxhdGlvbnNoaXApKSk7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBnZXRBbGxDaGlsZHJlbk9mKHBlcnNvbklkKSB7XG4gIHJldHVybiBnZXRBbGxSZWxhdGlvbnNoaXBzKCkuZmlsdGVyKGlzQVBhcmVudEluUmVsYXRpb25zaGlwLmJpbmQobnVsbCwgcGVyc29uSWQpKS5tYXAoZnVuY3Rpb24gKHJlbGF0aW9uc2hpcCkge1xuICAgIHJldHVybiBnZXRIb3VzZWhvbGRNZW1iZXJCeVBlcnNvbklkKGdldENoaWxkSWRGcm9tUmVsYXRpb25zaGlwKHJlbGF0aW9uc2hpcCkpWydAcGVyc29uJ107XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBnZXRQZXJzb25JZEZyb21QZXJzb24ocGVyc29uJCQxKSB7XG4gIHJldHVybiBwZXJzb24kJDEuaWQ7XG59XG5cbmZ1bmN0aW9uIGdldFBlcnNvbkZyb21NZW1iZXIobWVtYmVyKSB7XG4gIHJldHVybiBtZW1iZXJbJ0BwZXJzb24nXTtcbn1cblxuLyoqXG4gKiBNaXNzaW5nIHJlbGF0aW9uc2hpcCBpbmZlcmVuY2VcbiAqL1xudmFyIG1pc3NpbmdSZWxhdGlvbnNoaXBJbmZlcmVuY2UgPSB7XG4gIHNpYmxpbmdzT2Y6IGZ1bmN0aW9uIHNpYmxpbmdzT2Yoc3ViamVjdE1lbWJlcikge1xuXG4gICAgdmFyIG1pc3NpbmdSZWxhdGlvbnNoaXBzID0gW10sXG4gICAgICAgIGFsbFJlbGF0aW9uc2hpcHMgPSBnZXRBbGxSZWxhdGlvbnNoaXBzKCksXG4gICAgICAgIHBlcnNvbiQkMSA9IGdldFBlcnNvbkZyb21NZW1iZXIoc3ViamVjdE1lbWJlciksXG4gICAgICAgIHBlcnNvbklkID0gcGVyc29uJCQxLmlkLFxuICAgICAgICBwYXJlbnRzID0gZ2V0QWxsUGFyZW50c09mKHBlcnNvbklkKSxcbiAgICAgICAgc2libGluZ0lkcyA9IGFsbFJlbGF0aW9uc2hpcHMuZmlsdGVyKGlzQVNpYmxpbmdJblJlbGF0aW9uc2hpcC5iaW5kKG51bGwsIHBlcnNvbklkKSkubWFwKGdldFNpYmxpbmdJZEZyb21SZWxhdGlvbnNoaXAuYmluZChudWxsLCBwZXJzb25JZCkpO1xuXG4gICAgLyoqXG4gICAgICogSWYgMiBwYXJlbnQgcmVsYXRpb25zaGlwcyBvZiAncGVyc29uJyBhcmUgZm91bmQgd2UgY2FuIGF0dGVtcHQgdG8gaW5mZXJcbiAgICAgKiBzaWJsaW5nIHJlbGF0aW9uc2hpcHNcbiAgICAgKi9cbiAgICBpZiAocGFyZW50cy5sZW5ndGggPT09IDIpIHtcblxuICAgICAgZ2V0QWxsSG91c2Vob2xkTWVtYmVycygpLmZpbHRlcihpc0hvdXNlaG9sZE1lbWJlcikuZm9yRWFjaChmdW5jdGlvbiAobWVtYmVyKSB7XG5cbiAgICAgICAgdmFyIG1lbWJlclBlcnNvbklkID0gbWVtYmVyWydAcGVyc29uJ10uaWQ7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEd1YXJkXG4gICAgICAgICAqIElmIG1lbWJlciBpcyB0aGUgc3ViamVjdCBtZW1iZXJcbiAgICAgICAgICogb3IgbWVtYmVyIGlzIGEgcGFyZW50XG4gICAgICAgICAqIG9yIG1lbWJlciBhbHJlYWR5IGhhcyBhIHNpYmxpbmcgcmVsYXRpb25zaGlwIHdpdGggJ3BlcnNvbidcbiAgICAgICAgICogc2tpcCBtZW1iZXJcbiAgICAgICAgICovXG4gICAgICAgIGlmIChtZW1iZXJQZXJzb25JZCA9PT0gcGVyc29uSWQgfHwgbWVtYmVyUGVyc29uSWQgPT09IHBhcmVudHNbMF0uaWQgfHwgbWVtYmVyUGVyc29uSWQgPT09IHBhcmVudHNbMV0uaWQgfHwgc2libGluZ0lkcy5pbmRleE9mKG1lbWJlclBlcnNvbklkKSA+IC0xKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIG1lbWJlclBhcmVudHMgPSBnZXRBbGxQYXJlbnRzT2YobWVtYmVyUGVyc29uSWQpO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBJZiAyIHBhcmVudHMgb2YgJ21lbWJlcicgYXJlIGZvdW5kXG4gICAgICAgICAqIGFuZCB0aGV5IGFyZSB0aGUgc2FtZSBwYXJlbnRzIG9mICdwZXJzb24nXG4gICAgICAgICAqIHdlIGhhdmUgaWRlbnRpZmllZCBhIG1pc3NpbmcgaW5mZXJyZWQgcmVsYXRpb25zaGlwXG4gICAgICAgICAqL1xuICAgICAgICBpZiAobWVtYmVyUGFyZW50cy5sZW5ndGggPT09IDIgJiYgXyQxLmRpZmZlcmVuY2UocGFyZW50cy5tYXAoZ2V0UGVyc29uSWRGcm9tUGVyc29uKSwgbWVtYmVyUGFyZW50cy5tYXAoZ2V0UGVyc29uSWRGcm9tUGVyc29uKSkubGVuZ3RoID09PSAwKSB7XG5cbiAgICAgICAgICAvKipcbiAgICAgICAgICAgKiBBZGQgdG8gbWlzc2luZ1JlbGF0aW9uc2hpcHNcbiAgICAgICAgICAgKi9cbiAgICAgICAgICBtaXNzaW5nUmVsYXRpb25zaGlwcy5wdXNoKHJlbGF0aW9uc2hpcCgnYnJvdGhlci1zaXN0ZXInLCBwZXJzb24kJDEuaWQsIG1lbWJlclBlcnNvbklkLCB7IGluZmVycmVkOiB0cnVlIH0pKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG1pc3NpbmdSZWxhdGlvbnNoaXBzO1xuICB9XG59O1xuXG5mdW5jdGlvbiBpbmZlclJlbGF0aW9uc2hpcHMocmVsYXRpb25zaGlwLCBwZXJzb25JcywgcGVyc29uVG8pIHtcbiAgdmFyIG1pc3NpbmdSZWxhdGlvbnNoaXBzID0gW107XG5cbiAgaWYgKHJlbGF0aW9uc2hpcC5wZXJzb25Jc0Rlc2NyaXB0aW9uID09PSAnbW90aGVyLWZhdGhlcicpIHtcbiAgICBtaXNzaW5nUmVsYXRpb25zaGlwcyA9IG1pc3NpbmdSZWxhdGlvbnNoaXBzLmNvbmNhdChtaXNzaW5nUmVsYXRpb25zaGlwSW5mZXJlbmNlLnNpYmxpbmdzT2YocGVyc29uVG8pKTtcbiAgfVxuXG4gIGlmIChyZWxhdGlvbnNoaXAucGVyc29uSXNEZXNjcmlwdGlvbiA9PT0gJ3Nvbi1kYXVnaHRlcicpIHtcbiAgICBtaXNzaW5nUmVsYXRpb25zaGlwcyA9IG1pc3NpbmdSZWxhdGlvbnNoaXBzLmNvbmNhdChtaXNzaW5nUmVsYXRpb25zaGlwSW5mZXJlbmNlLnNpYmxpbmdzT2YocGVyc29uSXMpKTtcbiAgfVxuXG4gICQuZWFjaChtaXNzaW5nUmVsYXRpb25zaGlwcywgZnVuY3Rpb24gKGksIHJlbGF0aW9uc2hpcCkge1xuICAgIGFkZFJlbGF0aW9uc2hpcChyZWxhdGlvbnNoaXApO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gZmluZE5leHRNaXNzaW5nUmVsYXRpb25zaGlwKCkge1xuICB2YXIgaG91c2Vob2xkTWVtYmVycyA9IGdldEFsbEhvdXNlaG9sZE1lbWJlcnMoKS5maWx0ZXIoaXNIb3VzZWhvbGRNZW1iZXIpLFxuICAgICAgcmVsYXRpb25zaGlwcyA9IGdldEFsbFJlbGF0aW9uc2hpcHMoKSxcbiAgICAgIG1pc3NpbmdSZWxhdGlvbnNoaXBNZW1iZXJzID0gW10sXG4gICAgICBwZXJzb25JcyA9IG51bGw7XG5cbiAgLyoqXG4gICAqIEZpbmQgdGhlIG5leHQgbWlzc2luZyByZWxhdGlvbnNoaXBcbiAgICovXG4gICQuZWFjaChob3VzZWhvbGRNZW1iZXJzLCBmdW5jdGlvbiAoaSwgbWVtYmVyKSB7XG4gICAgdmFyIHBlcnNvbklkID0gbWVtYmVyWydAcGVyc29uJ10uaWQ7XG5cbiAgICAvKipcbiAgICAgKiBHZXQgYWxsIHJlbGF0aW9uc2hpcHMgZm9yIHRoaXMgbWVtYmVyXG4gICAgICovXG4gICAgdmFyIG1lbWJlclJlbGF0aW9uc2hpcHMgPSByZWxhdGlvbnNoaXBzLmZpbHRlcihmdW5jdGlvbiAocmVsYXRpb25zaGlwKSB7XG4gICAgICByZXR1cm4gcmVsYXRpb25zaGlwLnBlcnNvbklzSWQgPT09IHBlcnNvbklkIHx8IHJlbGF0aW9uc2hpcC5wZXJzb25Ub0lkID09PSBwZXJzb25JZDtcbiAgICB9KSxcbiAgICAgICAgbWVtYmVyUmVsYXRpb25zaGlwVG9JZHMgPSBtZW1iZXJSZWxhdGlvbnNoaXBzLm1hcChmdW5jdGlvbiAocmVsYXRpb25zaGlwKSB7XG4gICAgICByZXR1cm4gcmVsYXRpb25zaGlwLnBlcnNvbklzSWQgPT09IHBlcnNvbklkID8gcmVsYXRpb25zaGlwLnBlcnNvblRvSWQgOiByZWxhdGlvbnNoaXAucGVyc29uSXNJZDtcbiAgICB9KSB8fCBbXTtcblxuICAgIC8qKlxuICAgICAqIElmIHRvdGFsIHJlbGF0aW9uc2hpcHMgcmVsYXRlZCB0byB0aGlzIG1lbWJlciBpc24ndCBlcXVhbCB0b1xuICAgICAqIHRvdGFsIGhvdXNlaG9sZCBtZW1iZXJzIC0xLCBpbmRpY2F0ZXMgbWlzc2luZyByZWxhdGlvbnNoaXBcbiAgICAgKi9cbiAgICBpZiAobWVtYmVyUmVsYXRpb25zaGlwcy5sZW5ndGggPCBob3VzZWhvbGRNZW1iZXJzLmxlbmd0aCAtIDEpIHtcblxuICAgICAgLyoqXG4gICAgICAgKiBBbGwgbWlzc2luZyByZWxhdGlvbnNoaXAgbWVtYmVyc1xuICAgICAgICovXG4gICAgICBtaXNzaW5nUmVsYXRpb25zaGlwTWVtYmVycyA9IGhvdXNlaG9sZE1lbWJlcnMuZmlsdGVyKGZ1bmN0aW9uIChtKSB7XG4gICAgICAgIHJldHVybiBtZW1iZXJSZWxhdGlvbnNoaXBUb0lkcy5pbmRleE9mKG1bJ0BwZXJzb24nXS5pZCkgPT09IC0xICYmIG1bJ0BwZXJzb24nXS5pZCAhPT0gcGVyc29uSWQ7XG4gICAgICB9KTtcblxuICAgICAgcGVyc29uSXMgPSBtZW1iZXI7XG5cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiBwZXJzb25JcyA/IHtcbiAgICBwZXJzb25JczogcGVyc29uSXMsXG4gICAgcGVyc29uVG86IG1pc3NpbmdSZWxhdGlvbnNoaXBNZW1iZXJzWzBdXG4gIH0gOiBudWxsO1xufVxuXG5mdW5jdGlvbiBnZXRQZW9wbGVJZHNNaXNzaW5nUmVsYXRpb25zaGlwc1dpdGhQZXJzb24ocGVyc29uSWQpIHtcbiAgdmFyIHJlbWFpbmluZ1BlcnNvbklkcyA9IGdldEFsbEhvdXNlaG9sZE1lbWJlcnMoKS5maWx0ZXIoaXNIb3VzZWhvbGRNZW1iZXIpLm1hcChmdW5jdGlvbiAobWVtYmVyKSB7XG4gICAgcmV0dXJuIG1lbWJlclsnQHBlcnNvbiddLmlkO1xuICB9KTtcblxuICAvKipcbiAgICogUmVtb3ZlIHRoaXMgcGVyc29uIGZyb20gdGhlIGxpc3RcbiAgICovXG4gIHJlbW92ZUZyb21MaXN0KHJlbWFpbmluZ1BlcnNvbklkcywgcGVyc29uSWQpO1xuXG4gICQuZWFjaChnZXRBbGxSZWxhdGlvbnNoaXBzKCksIGZ1bmN0aW9uIChpLCByZWxhdGlvbnNoaXApIHtcbiAgICBpZiAoIWlzSW5SZWxhdGlvbnNoaXAocGVyc29uSWQsIHJlbGF0aW9uc2hpcCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZW1vdmUgdGhlIG90aGVyIHBlcnNvbiBmcm9tIHRoZSByZW1haW5pbmdQZXJzb25JZHMgbGlzdFxuICAgICAqL1xuICAgIHJlbW92ZUZyb21MaXN0KHJlbWFpbmluZ1BlcnNvbklkcywgZ2V0T3RoZXJQZXJzb25JZEZyb21SZWxhdGlvbnNoaXAocGVyc29uSWQsIHJlbGF0aW9uc2hpcCkpO1xuICB9KTtcblxuICByZXR1cm4gcmVtYWluaW5nUGVyc29uSWRzO1xufVxuXG5mdW5jdGlvbiBnZXRSZWxhdGlvbnNoaXBUeXBlKHJlbGF0aW9uc2hpcCkge1xuICByZXR1cm4gcmVsYXRpb25zaGlwRGVzY3JpcHRpb25NYXBbcmVsYXRpb25zaGlwLnBlcnNvbklzRGVzY3JpcHRpb25dLnR5cGU7XG59XG5cbi8qKlxuICogUmV0cmlldmUgZnJvbSByZWxhdGlvbnNoaXAgZ3JvdXBcbiAqL1xuZnVuY3Rpb24gZ2V0UmVsYXRpb25zaGlwc1dpdGhQZXJzb25JZHMocmVsYXRpb25zaGlwcywgaWRBcnIpIHtcbiAgcmV0dXJuIHJlbGF0aW9uc2hpcHMuZmlsdGVyKGZ1bmN0aW9uIChjaGlsZFJlbGF0aW9uc2hpcCkge1xuICAgIHJldHVybiBpZEFyci5pbmRleE9mKGNoaWxkUmVsYXRpb25zaGlwLnBlcnNvbklzSWQpICE9PSAtMSB8fCBpZEFyci5pbmRleE9mKGNoaWxkUmVsYXRpb25zaGlwLnBlcnNvblRvSWQpICE9PSAtMTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGdldFJlbGF0aW9uc2hpcE9mKHBlcnNvbjEsIHBlcnNvbjIpIHtcbiAgcmV0dXJuIGdldEFsbFJlbGF0aW9uc2hpcHMoKS5maW5kKGZ1bmN0aW9uIChyZWxhdGlvbnNoaXApIHtcbiAgICByZXR1cm4gaXNJblJlbGF0aW9uc2hpcChwZXJzb24xLCByZWxhdGlvbnNoaXApICYmIGlzSW5SZWxhdGlvbnNoaXAocGVyc29uMiwgcmVsYXRpb25zaGlwKTtcbiAgfSk7XG59XG5cbnZhciBVU0VSX1NUT1JBR0VfS0VZID0gJ3VzZXItZGV0YWlscyc7XG5cbmZ1bmN0aW9uIGdldEFkZHJlc3MoKSB7XG4gIHZhciBhZGRyZXNzTGluZXMgPSBzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKCdhZGRyZXNzJykuc3BsaXQoJywnKTtcblxuICByZXR1cm4ge1xuICAgIGFkZHJlc3NMaW5lMTogYWRkcmVzc0xpbmVzWzBdLFxuICAgIGFkZHJlc3NMaW5lMjogYWRkcmVzc0xpbmVzWzFdLFxuICAgIGFkZHJlc3NMaW5lMzogYWRkcmVzc0xpbmVzWzJdLFxuICAgIGFkZHJlc3NDb3VudHk6IGFkZHJlc3NMaW5lc1s0XSxcbiAgICBhZGRyZXNzVG93bkNpdHk6IGFkZHJlc3NMaW5lc1szXSxcbiAgICBhZGRyZXNzUG9zdGNvZGU6IGFkZHJlc3NMaW5lc1s1XVxuICB9O1xufVxuXG4vKipcbiAqIFVzZXJcbiAqL1xuZnVuY3Rpb24gYWRkVXNlclBlcnNvbihwZXJzb24kJDEpIHtcbiAgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbShVU0VSX1NUT1JBR0VfS0VZLCBKU09OLnN0cmluZ2lmeShwZXJzb24kJDEpKTtcbn1cblxuZnVuY3Rpb24gZ2V0VXNlclBlcnNvbigpIHtcbiAgcmV0dXJuIEpTT04ucGFyc2Uoc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbShVU0VSX1NUT1JBR0VfS0VZKSk7XG59XG5cbi8qKlxuICogSGVscGVyc1xuICovXG5mdW5jdGlvbiBjcmVhdGVOYXZJdGVtKG1lbWJlcikge1xuICB2YXIgJG5vZGVFbCA9ICQoJzxsaSBjbGFzcz1cImpzLXRlbXBsYXRlLW5hdi1pdGVtIG5hdl9faXRlbSBwbHV0b1wiPicgKyAnICA8YSBjbGFzcz1cImpzLXRlbXBsYXRlLW5hdi1pdGVtLWxhYmVsIG5hdl9fbGlua1wiIGhyZWY9XCIjXCI+PC9hPicgKyAnPC9saT4nKSxcbiAgICAgICRsaW5rRWwgPSAkbm9kZUVsLmZpbmQoJy5qcy10ZW1wbGF0ZS1uYXYtaXRlbS1sYWJlbCcpO1xuXG4gICRsaW5rRWwuaHRtbChtZW1iZXJbJ0BwZXJzb24nXS5mdWxsTmFtZSk7XG5cbiAgaWYgKG1lbWJlclsnQHBlcnNvbiddLmlkID09PSBVU0VSX0hPVVNFSE9MRF9NRU1CRVJfSUQpIHtcbiAgICAkbGlua0VsLmF0dHIoJ2hyZWYnLCAnLi4vd2hhdC1pcy15b3VyLW5hbWUnKTtcbiAgfSBlbHNlIHtcbiAgICAkbGlua0VsLmF0dHIoJ2hyZWYnLCAnLi4vd2hvLWVsc2UtdG8tYWRkP2VkaXQ9JyArIG1lbWJlclsnQHBlcnNvbiddLmlkKTtcbiAgfVxuXG4gIHJldHVybiAkbm9kZUVsO1xufVxuXG5mdW5jdGlvbiB1cGRhdGVIb3VzZWhvbGRWaXNpdG9yc05hdmlnYXRpb25JdGVtcygpIHtcbiAgdmFyIGFsbEhvdXNlaG9sZE1lbWJlcnMgPSB3aW5kb3cuT05TLnN0b3JhZ2UuZ2V0QWxsSG91c2Vob2xkTWVtYmVycygpLFxuICAgICAgaG91c2Vob2xkTWVtYmVycyA9IGFsbEhvdXNlaG9sZE1lbWJlcnMuZmlsdGVyKHdpbmRvdy5PTlMuc3RvcmFnZS5pc0hvdXNlaG9sZE1lbWJlciksXG4gICAgICB2aXNpdG9ycyA9IGFsbEhvdXNlaG9sZE1lbWJlcnMuZmlsdGVyKHdpbmRvdy5PTlMuc3RvcmFnZS5pc1Zpc2l0b3IpO1xuXG4gIHZhciAkbmF2aWdhdGlvbkhvdXNlaG9sZE1lbWJlcnNFbCA9ICQoJyNuYXZpZ2F0aW9uLWhvdXNlaG9sZC1tZW1iZXJzJyksXG4gICAgICAkbmF2aWdhdGlvblZpc2l0b3JzRWwgPSAkKCcjbmF2aWdhdGlvbi12aXNpdG9ycycpO1xuXG4gIGlmIChob3VzZWhvbGRNZW1iZXJzLmxlbmd0aCkge1xuICAgICQuZWFjaChob3VzZWhvbGRNZW1iZXJzLCBmdW5jdGlvbiAoaSwgbWVtYmVyKSB7XG4gICAgICAkbmF2aWdhdGlvbkhvdXNlaG9sZE1lbWJlcnNFbC5hcHBlbmQoY3JlYXRlTmF2SXRlbShtZW1iZXIpKTtcbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICAkbmF2aWdhdGlvbkhvdXNlaG9sZE1lbWJlcnNFbC5wYXJlbnQoKS5oaWRlKCk7XG4gIH1cblxuICBpZiAodmlzaXRvcnMubGVuZ3RoKSB7XG4gICAgJC5lYWNoKHZpc2l0b3JzLCBmdW5jdGlvbiAoaSwgbWVtYmVyKSB7XG4gICAgICAkbmF2aWdhdGlvblZpc2l0b3JzRWwuYXBwZW5kKGNyZWF0ZU5hdkl0ZW0obWVtYmVyKSk7XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgJG5hdmlnYXRpb25WaXNpdG9yc0VsLnBhcmVudCgpLmhpZGUoKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBjcmVhdGVMaXN0SXRlbVBlcnNvbihtZW1iZXIpIHtcbiAgcmV0dXJuICQoJzxsaSBjbGFzcz1cImxpc3RfX2l0ZW1cIj4nKS5hZGRDbGFzcygnbWFycycpLmh0bWwoJzxzcGFuIGNsYXNzPVwibGlzdF9faXRlbS1uYW1lXCI+JyArIG1lbWJlclsnQHBlcnNvbiddLmZ1bGxOYW1lICsgJzwvc3Bhbj4nKTtcbn1cblxuZnVuY3Rpb24gcG9wdWxhdGVMaXN0KCRlbCwgbWVtYmVyVHlwZSkge1xuICBpZiAoISRlbC5sZW5ndGgpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICB2YXIgbWVtYmVycyA9IGdldEFsbEhvdXNlaG9sZE1lbWJlcnMoKSB8fCBbXTtcblxuICAkZWwuZW1wdHkoKS5hcHBlbmQobWVtYmVycy5maWx0ZXIoZnVuY3Rpb24gKG1lbWJlcikge1xuICAgIHJldHVybiBtZW1iZXIudHlwZSA9PT0gbWVtYmVyVHlwZTtcbiAgfSkubWFwKGNyZWF0ZUxpc3RJdGVtUGVyc29uKSk7XG5cbiAgJGVsLmFkZENsYXNzKCdsaXN0IGxpc3QtLXBlb3BsZS1wbGFpbicpO1xufVxuXG5mdW5jdGlvbiBwb3B1bGF0ZUhvdXNlaG9sZExpc3QoKSB7XG4gIHBvcHVsYXRlTGlzdCgkKCcjaG91c2Vob2xkLW1lbWJlcnMnKSwgSE9VU0VIT0xEX01FTUJFUl9UWVBFKTtcbn1cblxuZnVuY3Rpb24gcG9wdWxhdGVWaXNpdG9yTGlzdCgpIHtcbiAgcG9wdWxhdGVMaXN0KCQoJyN2aXNpdG9ycy1saXN0JyksIFZJU0lUT1JfVFlQRSk7XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZUFkZHJlc3NlcygpIHtcbiAgdmFyIGFkZHJlc3NMaW5lcyA9IChzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKCdhZGRyZXNzJykgfHwgJycpLnNwbGl0KCcsJyksXG4gICAgICBhZGRyZXNzTGluZTEgPSBhZGRyZXNzTGluZXNbMF0sXG4gICAgICBhZGRyZXNzTGluZTIgPSBhZGRyZXNzTGluZXNbMV07XG5cbiAgJCgnI3NlY3Rpb24tYWRkcmVzcycpLmh0bWwoYWRkcmVzc0xpbmUxIHx8ICc8YScgKyAnIGhyZWY9XCIuLi90ZXN0LWFkZHJlc3NcIj5BZGRyZXNzIG5vdCcgKyAnIGZvdW5kPC9hPicpO1xuICAkKCcuYWRkcmVzcy10ZXh0JykuaHRtbChhZGRyZXNzTGluZTEgJiYgYWRkcmVzc0xpbmUyID8gYWRkcmVzc0xpbmUxICsgKGFkZHJlc3NMaW5lMiA/ICcsICcgKyBhZGRyZXNzTGluZTIgOiAnJykgOiAnPGEgaHJlZj1cIi4uL3Rlc3QtYWRkcmVzc1wiPkFkZHJlc3Mgbm90IGZvdW5kPC9hPicpO1xufVxuXG53aW5kb3cuT05TID0gd2luZG93Lk9OUyB8fCB7fTtcbndpbmRvdy5PTlMuc3RvcmFnZSA9IHtcbiAgZ2V0QWRkcmVzczogZ2V0QWRkcmVzcyxcbiAgYWRkSG91c2Vob2xkTWVtYmVyOiBhZGRIb3VzZWhvbGRNZW1iZXIsXG4gIHVwZGF0ZUhvdXNlaG9sZE1lbWJlcjogdXBkYXRlSG91c2Vob2xkTWVtYmVyLFxuICBkZWxldGVIb3VzZWhvbGRNZW1iZXI6IGRlbGV0ZUhvdXNlaG9sZE1lbWJlcixcbiAgZ2V0QWxsSG91c2Vob2xkTWVtYmVyczogZ2V0QWxsSG91c2Vob2xkTWVtYmVycyxcbiAgYWRkVXNlclBlcnNvbjogYWRkVXNlclBlcnNvbixcbiAgZ2V0VXNlclBlcnNvbjogZ2V0VXNlclBlcnNvbixcbiAgZ2V0VXNlckFzSG91c2Vob2xkTWVtYmVyOiBnZXRVc2VyQXNIb3VzZWhvbGRNZW1iZXIsXG4gIGdldEhvdXNlaG9sZE1lbWJlckJ5UGVyc29uSWQ6IGdldEhvdXNlaG9sZE1lbWJlckJ5UGVyc29uSWQsXG4gIGdldE1lbWJlclBlcnNvbklkOiBnZXRNZW1iZXJQZXJzb25JZCxcbiAgdXBkYXRlVXNlckFzSG91c2Vob2xkTWVtYmVyOiB1cGRhdGVVc2VyQXNIb3VzZWhvbGRNZW1iZXIsXG4gIGRlbGV0ZVVzZXJBc0hvdXNlaG9sZE1lbWJlcjogZGVsZXRlVXNlckFzSG91c2Vob2xkTWVtYmVyLFxuICB0ZW1wQXdheVF1ZXN0aW9uU2VudGVuY2VNYXA6IHRlbXBBd2F5UXVlc3Rpb25TZW50ZW5jZU1hcCxcblxuICBpc1Zpc2l0b3I6IGlzVmlzaXRvcixcbiAgaXNPdGhlckhvdXNlaG9sZE1lbWJlcjogaXNPdGhlckhvdXNlaG9sZE1lbWJlcixcbiAgaXNIb3VzZWhvbGRNZW1iZXI6IGlzSG91c2Vob2xkTWVtYmVyLFxuXG4gIGFkZFJlbGF0aW9uc2hpcDogYWRkUmVsYXRpb25zaGlwLFxuICBlZGl0UmVsYXRpb25zaGlwOiBlZGl0UmVsYXRpb25zaGlwLFxuICBnZXRBbGxSZWxhdGlvbnNoaXBzOiBnZXRBbGxSZWxhdGlvbnNoaXBzLFxuICBnZXRBbGxNYW51YWxSZWxhdGlvbnNoaXBzOiBnZXRBbGxNYW51YWxSZWxhdGlvbnNoaXBzLFxuICBkZWxldGVBbGxSZWxhdGlvbnNoaXBzRm9yTWVtYmVyOiBkZWxldGVBbGxSZWxhdGlvbnNoaXBzRm9yTWVtYmVyLFxuXG4gIGdldEFsbFBhcmVudHNPZjogZ2V0QWxsUGFyZW50c09mLFxuICBnZXRBbGxDaGlsZHJlbk9mOiBnZXRBbGxDaGlsZHJlbk9mLFxuICBnZXRQYXJlbnRJZEZyb21SZWxhdGlvbnNoaXA6IGdldFBhcmVudElkRnJvbVJlbGF0aW9uc2hpcCxcbiAgZ2V0Q2hpbGRJZEZyb21SZWxhdGlvbnNoaXA6IGdldENoaWxkSWRGcm9tUmVsYXRpb25zaGlwLFxuICBnZXRPdGhlclBlcnNvbklkRnJvbVJlbGF0aW9uc2hpcDogZ2V0T3RoZXJQZXJzb25JZEZyb21SZWxhdGlvbnNoaXAsXG4gIGlzQVBhcmVudEluUmVsYXRpb25zaGlwOiBpc0FQYXJlbnRJblJlbGF0aW9uc2hpcCxcbiAgaXNBQ2hpbGRJblJlbGF0aW9uc2hpcDogaXNBQ2hpbGRJblJlbGF0aW9uc2hpcCxcbiAgaXNJblJlbGF0aW9uc2hpcDogaXNJblJlbGF0aW9uc2hpcCxcbiAgYXJlQW55Q2hpbGRyZW5JblJlbGF0aW9uc2hpcE5vdFBhcmVudDogYXJlQW55Q2hpbGRyZW5JblJlbGF0aW9uc2hpcE5vdFBhcmVudCxcbiAgaXNSZWxhdGlvbnNoaXBUeXBlOiBpc1JlbGF0aW9uc2hpcFR5cGUsXG4gIGdldFJlbGF0aW9uc2hpcE9mOiBnZXRSZWxhdGlvbnNoaXBPZixcblxuICByZWxhdGlvbnNoaXBEZXNjcmlwdGlvbk1hcDogcmVsYXRpb25zaGlwRGVzY3JpcHRpb25NYXAsXG4gIHJlbGF0aW9uc2hpcFN1bW1hcnlUZW1wbGF0ZXM6IHJlbGF0aW9uc2hpcFN1bW1hcnlUZW1wbGF0ZXMsXG4gIG1pc3NpbmdSZWxhdGlvbnNoaXBJbmZlcmVuY2U6IG1pc3NpbmdSZWxhdGlvbnNoaXBJbmZlcmVuY2UsXG4gIGluZmVyUmVsYXRpb25zaGlwczogaW5mZXJSZWxhdGlvbnNoaXBzLFxuICBnZXRSZWxhdGlvbnNoaXBzV2l0aFBlcnNvbklkczogZ2V0UmVsYXRpb25zaGlwc1dpdGhQZXJzb25JZHMsXG4gIGdldFBlb3BsZUlkc01pc3NpbmdSZWxhdGlvbnNoaXBzV2l0aFBlcnNvbjogZ2V0UGVvcGxlSWRzTWlzc2luZ1JlbGF0aW9uc2hpcHNXaXRoUGVyc29uLFxuICBnZXRSZWxhdGlvbnNoaXBUeXBlOiBnZXRSZWxhdGlvbnNoaXBUeXBlLFxuICBmaW5kTmV4dE1pc3NpbmdSZWxhdGlvbnNoaXA6IGZpbmROZXh0TWlzc2luZ1JlbGF0aW9uc2hpcCxcblxuICBLRVlTOiB7XG4gICAgSE9VU0VIT0xEX01FTUJFUlNfU1RPUkFHRV9LRVk6IEhPVVNFSE9MRF9NRU1CRVJTX1NUT1JBR0VfS0VZLFxuICAgIFVTRVJfU1RPUkFHRV9LRVk6IFVTRVJfU1RPUkFHRV9LRVksXG4gICAgSE9VU0VIT0xEX01FTUJFUl9UWVBFOiBIT1VTRUhPTERfTUVNQkVSX1RZUEUsXG4gICAgVklTSVRPUl9UWVBFOiBWSVNJVE9SX1RZUEVcbiAgfSxcblxuICBJRFM6IHtcbiAgICBVU0VSX0hPVVNFSE9MRF9NRU1CRVJfSUQ6IFVTRVJfSE9VU0VIT0xEX01FTUJFUl9JRFxuICB9LFxuXG4gIFRZUEVTOiB7XG4gICAgcGVyc29uOiBwZXJzb24sXG4gICAgcmVsYXRpb25zaGlwOiByZWxhdGlvbnNoaXBcbiAgfVxufTtcblxud2luZG93Lk9OUy5oZWxwZXJzID0ge1xuICBwb3B1bGF0ZUhvdXNlaG9sZExpc3Q6IHBvcHVsYXRlSG91c2Vob2xkTGlzdCxcbiAgcG9wdWxhdGVWaXNpdG9yTGlzdDogcG9wdWxhdGVWaXNpdG9yTGlzdFxufTtcblxud2luZG93Lk9OUy51dGlscyA9IHtcbiAgcmVtb3ZlRnJvbUxpc3Q6IHJlbW92ZUZyb21MaXN0LFxuICB0cmFpbGluZ05hbWVTOiB0cmFpbGluZ05hbWVTXG59O1xuXG4kKHBvcHVsYXRlSG91c2Vob2xkTGlzdCk7XG4kKHBvcHVsYXRlVmlzaXRvckxpc3QpO1xuJCh1cGRhdGVIb3VzZWhvbGRWaXNpdG9yc05hdmlnYXRpb25JdGVtcyk7XG4kKHVwZGF0ZUFkZHJlc3Nlcyk7XG5cbmV4cG9ydHMuVVNFUl9TVE9SQUdFX0tFWSA9IFVTRVJfU1RPUkFHRV9LRVk7XG5leHBvcnRzLmdldEFkZHJlc3MgPSBnZXRBZGRyZXNzO1xuZXhwb3J0cy5hZGRVc2VyUGVyc29uID0gYWRkVXNlclBlcnNvbjtcbmV4cG9ydHMuZ2V0VXNlclBlcnNvbiA9IGdldFVzZXJQZXJzb247XG4iXX0=
