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
    summaryAdjective: 'married',
    type: relationshipTypes['spouse']
  },
  // covered
  'mother-father': {
    sentanceLabel: 'mother or father',
    summaryAdjective: 'parent',
    type: relationshipTypes['child-parent']
  },
  // covered
  'step-mother-father': {
    sentanceLabel: 'step-mother or step-father',
    summaryAdjective: 'step-parent',
    type: relationshipTypes['step-child-parent']
  },
  // covered
  'son-daughter': {
    sentanceLabel: 'son or daughter',
    summaryAdjective: 'child',
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
    sentanceLabel: 'step-child',
    summaryAdjective: 'step-child',
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
    sentanceLabel: 'step-brother or step-sister',
    summaryAdjective: 'step-brother or step-sister',
    type: relationshipTypes['step-brother-sister']
  },
  // covered
  'other-relation': {
    sentanceLabel: 'relation - other',
    summaryAdjective: 'related',
    type: relationshipTypes['other-relation']
  },
  // covered
  'partner': {
    sentanceLabel: 'partner',
    summaryAdjective: 'partners',
    type: relationshipTypes['partner']
  },
  'same-sex-partner': {
    sentanceLabel: 'same sex civil partner',
    summaryAdjective: 'same sex civil partners',
    type: relationshipTypes['partner']
  },
  // covered
  'unrelated': {
    sentanceLabel: 'unrelated',
    summaryAdjective: 'not related',
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
    return personListStr([person1, person2]) + ' are ' + description;
  },
  'twoFamilyMembersToMany': function twoFamilyMembersToMany(parent1, parent2, childrenArr, description) {
    return nameElement(parent1) + ' and ' + nameElement(parent2) + ' are the ' + description + ' of ' + personListStr(childrenArr);
  },
  'oneFamilyMemberToMany': function oneFamilyMemberToMany(parent, childrenArr, description) {
    return nameElement(parent) + ' is the ' + description + ' of ' + personListStr(childrenArr);
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

      getAllHouseholdMembers().forEach(function (member) {

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
  var remainingPersonIds = getAllHouseholdMembers().map(function (member) {
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

  $('#section-address').html(addressLine1);
  $('.address-text').html(addressLine1 + (addressLine2 ? ', ' + addressLine2 : ''));
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
  removeFromList: removeFromList
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJfcHJvdG90eXBlcy95b3VyLWhvdXNlaG9sZC12Mi9idW5kbGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcblxuZnVuY3Rpb24gYXV0b0luY3JlbWVudElkKGNvbGxlY3Rpb24pIHtcblx0dmFyIGsgPSBjb2xsZWN0aW9uICsgJy1pbmNyZW1lbnQnLFxuXHQgICAgaWQgPSBwYXJzZUludChzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKGspKSB8fCAwO1xuXG5cdGlkKys7XG5cblx0c2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbShrLCBKU09OLnN0cmluZ2lmeShpZCkpO1xuXG5cdHJldHVybiBpZDtcbn1cblxuZnVuY3Rpb24gcmVtb3ZlRnJvbUxpc3QobGlzdCwgdmFsKSB7XG5cblx0ZnVuY3Rpb24gZG9SZW1vdmUoaXRlbSkge1xuXHRcdHZhciBmb3VuZElkID0gbGlzdC5pbmRleE9mKGl0ZW0pO1xuXG5cdFx0LyoqXG4gICAqIEd1YXJkXG4gICAqL1xuXHRcdGlmIChmb3VuZElkID09PSAtMSkge1xuXHRcdFx0Y29uc29sZS5sb2coJ0F0dGVtcHQgdG8gcmVtb3ZlIGZyb20gbGlzdCBmYWlsZWQ6ICcsIGxpc3QsIHZhbCk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0bGlzdC5zcGxpY2UoZm91bmRJZCwgMSk7XG5cdH1cblxuXHRpZiAoXy5pc0FycmF5KHZhbCkpIHtcblx0XHQkLmVhY2godmFsLCBmdW5jdGlvbiAoaSwgaXRlbSkge1xuXHRcdFx0ZG9SZW1vdmUoaXRlbSk7XG5cdFx0fSk7XG5cdH0gZWxzZSB7XG5cdFx0ZG9SZW1vdmUodmFsKTtcblx0fVxufVxuXG52YXIgX2V4dGVuZHMgPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uICh0YXJnZXQpIHtcbiAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldO1xuXG4gICAgZm9yICh2YXIga2V5IGluIHNvdXJjZSkge1xuICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzb3VyY2UsIGtleSkpIHtcbiAgICAgICAgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gdGFyZ2V0O1xufTtcblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG52YXIgdG9Db25zdW1hYmxlQXJyYXkgPSBmdW5jdGlvbiAoYXJyKSB7XG4gIGlmIChBcnJheS5pc0FycmF5KGFycikpIHtcbiAgICBmb3IgKHZhciBpID0gMCwgYXJyMiA9IEFycmF5KGFyci5sZW5ndGgpOyBpIDwgYXJyLmxlbmd0aDsgaSsrKSBhcnIyW2ldID0gYXJyW2ldO1xuXG4gICAgcmV0dXJuIGFycjI7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIEFycmF5LmZyb20oYXJyKTtcbiAgfVxufTtcblxudmFyIEhPVVNFSE9MRF9NRU1CRVJTX1NUT1JBR0VfS0VZID0gJ2hvdXNlaG9sZC1tZW1iZXJzJztcbnZhciBVU0VSX0hPVVNFSE9MRF9NRU1CRVJfSUQgPSAncGVyc29uX21lJztcbnZhciBIT1VTRUhPTERfTUVNQkVSX1RZUEUgPSAnaG91c2Vob2xkLW1lbWJlcic7XG52YXIgVklTSVRPUl9UWVBFID0gJ3Zpc2l0b3InO1xuXG4vKipcbiAqIFR5cGVzXG4gKi9cbmZ1bmN0aW9uIHBlcnNvbihvcHRzKSB7XG4gIGlmIChvcHRzLmZpcnN0TmFtZSA9PT0gJycgfHwgb3B0cy5sYXN0TmFtZSA9PT0gJycpIHtcbiAgICBjb25zb2xlLmxvZygnVW5hYmxlIHRvIGNyZWF0ZSBwZXJzb24gd2l0aCBkYXRhOiAnLCBvcHRzLmZpcnN0TmFtZSwgIW9wdHMubWlkZGxlTmFtZSwgIW9wdHMubGFzdE5hbWUpO1xuICB9XG5cbiAgdmFyIG1pZGRsZU5hbWUgPSBvcHRzLm1pZGRsZU5hbWUgfHwgJyc7XG5cbiAgcmV0dXJuIHtcbiAgICBmdWxsTmFtZTogb3B0cy5maXJzdE5hbWUgKyAnICcgKyBtaWRkbGVOYW1lICsgJyAnICsgb3B0cy5sYXN0TmFtZSxcbiAgICBmaXJzdE5hbWU6IG9wdHMuZmlyc3ROYW1lLFxuICAgIG1pZGRsZU5hbWU6IG1pZGRsZU5hbWUsXG4gICAgbGFzdE5hbWU6IG9wdHMubGFzdE5hbWVcbiAgfTtcbn1cblxuLyoqXG4gKiBTdG9yYWdlXG4gKi9cbmZ1bmN0aW9uIGdldFVzZXJBc0hvdXNlaG9sZE1lbWJlcigpIHtcbiAgcmV0dXJuIGdldEFsbEhvdXNlaG9sZE1lbWJlcnMoKS5maW5kKGZ1bmN0aW9uIChtZW1iZXIpIHtcbiAgICByZXR1cm4gbWVtYmVyWydAcGVyc29uJ10uaWQgPT09IFVTRVJfSE9VU0VIT0xEX01FTUJFUl9JRDtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGRlbGV0ZVVzZXJBc0hvdXNlaG9sZE1lbWJlcigpIHtcbiAgZGVsZXRlSG91c2Vob2xkTWVtYmVyKFVTRVJfSE9VU0VIT0xEX01FTUJFUl9JRCk7XG59XG5cbmZ1bmN0aW9uIGRlbGV0ZUhvdXNlaG9sZE1lbWJlcihwZXJzb25JZCkge1xuICB2YXIgbWVtYmVycyA9IGdldEFsbEhvdXNlaG9sZE1lbWJlcnMoKS5maWx0ZXIoZnVuY3Rpb24gKG1lbWJlcikge1xuICAgIHJldHVybiBtZW1iZXJbJ0BwZXJzb24nXS5pZCAhPT0gcGVyc29uSWQ7XG4gIH0pO1xuXG4gIHNlc3Npb25TdG9yYWdlLnNldEl0ZW0oSE9VU0VIT0xEX01FTUJFUlNfU1RPUkFHRV9LRVksIEpTT04uc3RyaW5naWZ5KG1lbWJlcnMpKTtcbn1cblxuZnVuY3Rpb24gdXBkYXRlVXNlckFzSG91c2Vob2xkTWVtYmVyKHBlcnNvbiwgbWVtYmVyRGF0YSkge1xuICB2YXIgdXNlckFzSG91c2Vob2xkTWVtYmVyID0gZ2V0VXNlckFzSG91c2Vob2xkTWVtYmVyKCk7XG5cbiAgdXNlckFzSG91c2Vob2xkTWVtYmVyID8gdXBkYXRlSG91c2Vob2xkTWVtYmVyKHVzZXJBc0hvdXNlaG9sZE1lbWJlclsnQHBlcnNvbiddLCBtZW1iZXJEYXRhKSA6IGFkZEhvdXNlaG9sZE1lbWJlcihwZXJzb24sIG1lbWJlckRhdGEsIFVTRVJfSE9VU0VIT0xEX01FTUJFUl9JRCk7XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZUhvdXNlaG9sZE1lbWJlcihwZXJzb24sIG1lbWJlckRhdGEpIHtcbiAgdmFyIG1lbWJlcnNVcGRhdGVkID0gZ2V0QWxsSG91c2Vob2xkTWVtYmVycygpLm1hcChmdW5jdGlvbiAobWVtYmVyKSB7XG4gICAgcmV0dXJuIG1lbWJlclsnQHBlcnNvbiddLmlkID09PSBwZXJzb24uaWQgPyBfZXh0ZW5kcyh7fSwgbWVtYmVyLCBtZW1iZXJEYXRhLCB7ICdAcGVyc29uJzogX2V4dGVuZHMoe30sIG1lbWJlclsnQHBlcnNvbiddLCBwZXJzb24pIH0pIDogbWVtYmVyO1xuICB9KTtcblxuICBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKEhPVVNFSE9MRF9NRU1CRVJTX1NUT1JBR0VfS0VZLCBKU09OLnN0cmluZ2lmeShtZW1iZXJzVXBkYXRlZCkpO1xufVxuXG5mdW5jdGlvbiBhZGRIb3VzZWhvbGRNZW1iZXIocGVyc29uLCBtZW1iZXJEYXRhLCBpZCkge1xuICB2YXIgcGVvcGxlID0gZ2V0QWxsSG91c2Vob2xkTWVtYmVycygpIHx8IFtdO1xuICBtZW1iZXJEYXRhID0gbWVtYmVyRGF0YSB8fCB7fTtcblxuICBwZW9wbGUucHVzaChfZXh0ZW5kcyh7fSwgbWVtYmVyRGF0YSwge1xuICAgIHR5cGU6IG1lbWJlckRhdGEudHlwZSB8fCBIT1VTRUhPTERfTUVNQkVSX1RZUEUsXG4gICAgJ0BwZXJzb24nOiBfZXh0ZW5kcyh7fSwgcGVyc29uLCB7XG4gICAgICBpZDogaWQgfHwgJ3BlcnNvbicgKyBhdXRvSW5jcmVtZW50SWQoJ2hvdXNlaG9sZC1tZW1iZXJzJylcbiAgICB9KVxuICB9KSk7XG5cbiAgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbShIT1VTRUhPTERfTUVNQkVSU19TVE9SQUdFX0tFWSwgSlNPTi5zdHJpbmdpZnkocGVvcGxlKSk7XG59XG5cbmZ1bmN0aW9uIGdldEFsbEhvdXNlaG9sZE1lbWJlcnMoKSB7XG4gIHJldHVybiBKU09OLnBhcnNlKHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oSE9VU0VIT0xEX01FTUJFUlNfU1RPUkFHRV9LRVkpKSB8fCBbXTtcbn1cblxuZnVuY3Rpb24gZ2V0SG91c2Vob2xkTWVtYmVyQnlQZXJzb25JZChpZCkge1xuICByZXR1cm4gZ2V0QWxsSG91c2Vob2xkTWVtYmVycygpLmZpbmQoZnVuY3Rpb24gKG1lbWJlcikge1xuICAgIHJldHVybiBtZW1iZXJbJ0BwZXJzb24nXS5pZCA9PT0gaWQ7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBnZXRNZW1iZXJQZXJzb25JZChtZW1iZXIpIHtcbiAgcmV0dXJuIG1lbWJlclsnQHBlcnNvbiddLmlkO1xufVxuXG4vKipcbiAqIENvbXBhcmF0b3JzXG4gKi9cbmZ1bmN0aW9uIGlzVmlzaXRvcihtZW1iZXIpIHtcbiAgcmV0dXJuIG1lbWJlci50eXBlID09PSB3aW5kb3cuT05TLnN0b3JhZ2UuS0VZUy5WSVNJVE9SX1RZUEU7XG59XG5cbmZ1bmN0aW9uIGlzSG91c2Vob2xkTWVtYmVyKG1lbWJlcikge1xuICByZXR1cm4gbWVtYmVyLnR5cGUgPT09IHdpbmRvdy5PTlMuc3RvcmFnZS5LRVlTLkhPVVNFSE9MRF9NRU1CRVJfVFlQRTtcbn1cblxuZnVuY3Rpb24gaXNPdGhlckhvdXNlaG9sZE1lbWJlcihtZW1iZXIpIHtcbiAgcmV0dXJuIG1lbWJlci50eXBlID09PSB3aW5kb3cuT05TLnN0b3JhZ2UuS0VZUy5IT1VTRUhPTERfTUVNQkVSX1RZUEUgJiYgbWVtYmVyWydAcGVyc29uJ10uaWQgIT09IHdpbmRvdy5PTlMuc3RvcmFnZS5JRFMuVVNFUl9IT1VTRUhPTERfTUVNQkVSX0lEO1xufVxuXG4vKipcbiAqIEF1Z21lbnQgVW5kZXJzY29yZSBsaWJyYXJ5XG4gKi9cbnZhciBfJDEgPSB3aW5kb3cuXyB8fCB7fTtcblxudmFyIFJFTEFUSU9OU0hJUFNfU1RPUkFHRV9LRVkgPSAncmVsYXRpb25zaGlwcyc7XG5cbnZhciByZWxhdGlvbnNoaXBUeXBlcyA9IHtcbiAgJ3Nwb3VzZSc6IHsgaWQ6ICdzcG91c2UnIH0sXG4gICdjaGlsZC1wYXJlbnQnOiB7IGlkOiAnY2hpbGQtcGFyZW50JyB9LFxuICAnc3RlcC1jaGlsZC1wYXJlbnQnOiB7IGlkOiAnc3RlcC1jaGlsZC1wYXJlbnQnIH0sXG4gICdncmFuZGNoaWxkLWdyYW5kcGFyZW50JzogeyBpZDogJ2dyYW5kY2hpbGQtZ3JhbmRwYXJlbnQnIH0sXG4gICdoYWxmLXNpYmxpbmcnOiB7IGlkOiAnaGFsZi1zaWJsaW5nJyB9LFxuICAnc2libGluZyc6IHsgaWQ6ICdzaWJsaW5nJyB9LFxuICAnc3RlcC1icm90aGVyLXNpc3Rlcic6IHsgaWQ6ICdzdGVwLWJyb3RoZXItc2lzdGVyJyB9LFxuICAncGFydG5lcic6IHsgaWQ6ICdwYXJ0bmVyJyB9LFxuICAndW5yZWxhdGVkJzogeyBpZDogJ3VucmVsYXRlZCcgfSxcbiAgJ290aGVyLXJlbGF0aW9uJzogeyBpZDogJ290aGVyLXJlbGF0aW9uJyB9XG59O1xuXG52YXIgcmVsYXRpb25zaGlwRGVzY3JpcHRpb25NYXAgPSB7XG4gIC8vIGNvdmVyZWRcbiAgJ2h1c2JhbmQtd2lmZSc6IHtcbiAgICBzZW50YW5jZUxhYmVsOiAnaHVzYmFuZCBvciB3aWZlJyxcbiAgICBzdW1tYXJ5QWRqZWN0aXZlOiAnbWFycmllZCcsXG4gICAgdHlwZTogcmVsYXRpb25zaGlwVHlwZXNbJ3Nwb3VzZSddXG4gIH0sXG4gIC8vIGNvdmVyZWRcbiAgJ21vdGhlci1mYXRoZXInOiB7XG4gICAgc2VudGFuY2VMYWJlbDogJ21vdGhlciBvciBmYXRoZXInLFxuICAgIHN1bW1hcnlBZGplY3RpdmU6ICdwYXJlbnQnLFxuICAgIHR5cGU6IHJlbGF0aW9uc2hpcFR5cGVzWydjaGlsZC1wYXJlbnQnXVxuICB9LFxuICAvLyBjb3ZlcmVkXG4gICdzdGVwLW1vdGhlci1mYXRoZXInOiB7XG4gICAgc2VudGFuY2VMYWJlbDogJ3N0ZXAtbW90aGVyIG9yIHN0ZXAtZmF0aGVyJyxcbiAgICBzdW1tYXJ5QWRqZWN0aXZlOiAnc3RlcC1wYXJlbnQnLFxuICAgIHR5cGU6IHJlbGF0aW9uc2hpcFR5cGVzWydzdGVwLWNoaWxkLXBhcmVudCddXG4gIH0sXG4gIC8vIGNvdmVyZWRcbiAgJ3Nvbi1kYXVnaHRlcic6IHtcbiAgICBzZW50YW5jZUxhYmVsOiAnc29uIG9yIGRhdWdodGVyJyxcbiAgICBzdW1tYXJ5QWRqZWN0aXZlOiAnY2hpbGQnLFxuICAgIHR5cGU6IHJlbGF0aW9uc2hpcFR5cGVzWydjaGlsZC1wYXJlbnQnXVxuICB9LFxuICAvLyBjb3ZlcmVkXG4gICdoYWxmLWJyb3RoZXItc2lzdGVyJzoge1xuICAgIHNlbnRhbmNlTGFiZWw6ICdoYWxmLWJyb3RoZXIgb3IgaGFsZi1zaXN0ZXInLFxuICAgIHN1bW1hcnlBZGplY3RpdmU6ICdoYWxmLWJyb3RoZXIgb3IgaGFsZi1zaXN0ZXInLFxuICAgIHR5cGU6IHJlbGF0aW9uc2hpcFR5cGVzWydoYWxmLXNpYmxpbmcnXVxuICB9LFxuICAvLyBjb3ZlcmVkXG4gICdzdGVwLWNoaWxkJzoge1xuICAgIHNlbnRhbmNlTGFiZWw6ICdzdGVwLWNoaWxkJyxcbiAgICBzdW1tYXJ5QWRqZWN0aXZlOiAnc3RlcC1jaGlsZCcsXG4gICAgdHlwZTogcmVsYXRpb25zaGlwVHlwZXNbJ3N0ZXAtY2hpbGQtcGFyZW50J11cbiAgfSxcbiAgLy8gY292ZXJlZFxuICAnZ3JhbmRwYXJlbnQnOiB7XG4gICAgc2VudGFuY2VMYWJlbDogJ2dyYW5kcGFyZW50JyxcbiAgICBzdW1tYXJ5QWRqZWN0aXZlOiAnZ3JhbmRwYXJlbnQnLFxuICAgIHR5cGU6IHJlbGF0aW9uc2hpcFR5cGVzWydncmFuZGNoaWxkLWdyYW5kcGFyZW50J11cbiAgfSxcbiAgLy8gY292ZXJlZFxuICAnZ3JhbmRjaGlsZCc6IHtcbiAgICBzZW50YW5jZUxhYmVsOiAnZ3JhbmRjaGlsZCcsXG4gICAgc3VtbWFyeUFkamVjdGl2ZTogJ2dyYW5kY2hpbGQnLFxuICAgIHR5cGU6IHJlbGF0aW9uc2hpcFR5cGVzWydncmFuZGNoaWxkLWdyYW5kcGFyZW50J11cbiAgfSxcbiAgLy8gY292ZXJlZFxuICAnYnJvdGhlci1zaXN0ZXInOiB7XG4gICAgc2VudGFuY2VMYWJlbDogJ2Jyb3RoZXIgb3Igc2lzdGVyJyxcbiAgICBzdW1tYXJ5QWRqZWN0aXZlOiAnYnJvdGhlciBvciBzaXN0ZXInLFxuICAgIHR5cGU6IHJlbGF0aW9uc2hpcFR5cGVzWydzaWJsaW5nJ11cbiAgfSxcbiAgLy8gY292ZXJlZFxuICAnc3RlcC1icm90aGVyLXNpc3Rlcic6IHtcbiAgICBzZW50YW5jZUxhYmVsOiAnc3RlcC1icm90aGVyIG9yIHN0ZXAtc2lzdGVyJyxcbiAgICBzdW1tYXJ5QWRqZWN0aXZlOiAnc3RlcC1icm90aGVyIG9yIHN0ZXAtc2lzdGVyJyxcbiAgICB0eXBlOiByZWxhdGlvbnNoaXBUeXBlc1snc3RlcC1icm90aGVyLXNpc3RlciddXG4gIH0sXG4gIC8vIGNvdmVyZWRcbiAgJ290aGVyLXJlbGF0aW9uJzoge1xuICAgIHNlbnRhbmNlTGFiZWw6ICdyZWxhdGlvbiAtIG90aGVyJyxcbiAgICBzdW1tYXJ5QWRqZWN0aXZlOiAncmVsYXRlZCcsXG4gICAgdHlwZTogcmVsYXRpb25zaGlwVHlwZXNbJ290aGVyLXJlbGF0aW9uJ11cbiAgfSxcbiAgLy8gY292ZXJlZFxuICAncGFydG5lcic6IHtcbiAgICBzZW50YW5jZUxhYmVsOiAncGFydG5lcicsXG4gICAgc3VtbWFyeUFkamVjdGl2ZTogJ3BhcnRuZXJzJyxcbiAgICB0eXBlOiByZWxhdGlvbnNoaXBUeXBlc1sncGFydG5lciddXG4gIH0sXG4gICdzYW1lLXNleC1wYXJ0bmVyJzoge1xuICAgIHNlbnRhbmNlTGFiZWw6ICdzYW1lIHNleCBjaXZpbCBwYXJ0bmVyJyxcbiAgICBzdW1tYXJ5QWRqZWN0aXZlOiAnc2FtZSBzZXggY2l2aWwgcGFydG5lcnMnLFxuICAgIHR5cGU6IHJlbGF0aW9uc2hpcFR5cGVzWydwYXJ0bmVyJ11cbiAgfSxcbiAgLy8gY292ZXJlZFxuICAndW5yZWxhdGVkJzoge1xuICAgIHNlbnRhbmNlTGFiZWw6ICd1bnJlbGF0ZWQnLFxuICAgIHN1bW1hcnlBZGplY3RpdmU6ICdub3QgcmVsYXRlZCcsXG4gICAgdHlwZTogcmVsYXRpb25zaGlwVHlwZXNbJ3VucmVsYXRlZCddXG4gIH1cbn07XG5cbmZ1bmN0aW9uIG5hbWVFbGVtZW50KG5hbWUpIHtcbiAgcmV0dXJuICc8c3Ryb25nPicgKyBuYW1lICsgJzwvc3Ryb25nPic7XG59XG5cbmZ1bmN0aW9uIHBlcnNvbkxpc3RTdHIocGVvcGxlQXJyKSB7XG4gIGlmIChwZW9wbGVBcnIubGVuZ3RoIDwgMSkge1xuICAgIGNvbnNvbGUubG9nKHBlb3BsZUFyciwgJ25vdCBlbm91Z2ggcGVvcGxlIHRvIGNyZWF0ZSBhIGxpc3Qgc3RyaW5nJyk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgaWYgKHBlb3BsZUFyci5sZW5ndGggPT09IDEpIHtcbiAgICByZXR1cm4gbmFtZUVsZW1lbnQocGVvcGxlQXJyWzBdKTtcbiAgfVxuXG4gIHZhciBwZW9wbGVDb3B5ID0gW10uY29uY2F0KHRvQ29uc3VtYWJsZUFycmF5KHBlb3BsZUFycikpLFxuICAgICAgbGFzdFBlcnNvbiA9IHBlb3BsZUNvcHkucG9wKCk7XG5cbiAgcmV0dXJuIHBlb3BsZUNvcHkubWFwKG5hbWVFbGVtZW50KS5qb2luKCcsICcpICsgJyBhbmQgJyArIG5hbWVFbGVtZW50KGxhc3RQZXJzb24pO1xufVxuXG52YXIgcmVsYXRpb25zaGlwU3VtbWFyeVRlbXBsYXRlcyA9IHtcbiAgJ3BhcnRuZXJzaGlwJzogZnVuY3Rpb24gcGFydG5lcnNoaXAocGVyc29uMSwgcGVyc29uMiwgZGVzY3JpcHRpb24pIHtcbiAgICByZXR1cm4gcGVyc29uTGlzdFN0cihbcGVyc29uMSwgcGVyc29uMl0pICsgJyBhcmUgJyArIGRlc2NyaXB0aW9uO1xuICB9LFxuICAndHdvRmFtaWx5TWVtYmVyc1RvTWFueSc6IGZ1bmN0aW9uIHR3b0ZhbWlseU1lbWJlcnNUb01hbnkocGFyZW50MSwgcGFyZW50MiwgY2hpbGRyZW5BcnIsIGRlc2NyaXB0aW9uKSB7XG4gICAgcmV0dXJuIG5hbWVFbGVtZW50KHBhcmVudDEpICsgJyBhbmQgJyArIG5hbWVFbGVtZW50KHBhcmVudDIpICsgJyBhcmUgdGhlICcgKyBkZXNjcmlwdGlvbiArICcgb2YgJyArIHBlcnNvbkxpc3RTdHIoY2hpbGRyZW5BcnIpO1xuICB9LFxuICAnb25lRmFtaWx5TWVtYmVyVG9NYW55JzogZnVuY3Rpb24gb25lRmFtaWx5TWVtYmVyVG9NYW55KHBhcmVudCwgY2hpbGRyZW5BcnIsIGRlc2NyaXB0aW9uKSB7XG4gICAgcmV0dXJuIG5hbWVFbGVtZW50KHBhcmVudCkgKyAnIGlzIHRoZSAnICsgZGVzY3JpcHRpb24gKyAnIG9mICcgKyBwZXJzb25MaXN0U3RyKGNoaWxkcmVuQXJyKTtcbiAgfSxcbiAgJ21hbnlUb01hbnknOiBmdW5jdGlvbiBtYW55VG9NYW55KHBlb3BsZUFycjEsIHBlb3BsZUFycjIsIGRlc2NyaXB0aW9uKSB7XG4gICAgcmV0dXJuIHBlcnNvbkxpc3RTdHIocGVvcGxlQXJyMSkgKyAnICcgKyAocGVvcGxlQXJyMS5sZW5ndGggPiAxID8gJ2FyZScgOiAnaXMnKSArICcgJyArIGRlc2NyaXB0aW9uICsgJyB0byAnICsgcGVyc29uTGlzdFN0cihwZW9wbGVBcnIyKTtcbiAgfSxcbiAgJ2FsbE11dHVhbCc6IGZ1bmN0aW9uIGFsbE11dHVhbChwZW9wbGVBcnIsIGRlc2NyaXB0aW9uKSB7XG4gICAgcmV0dXJuIHBlcnNvbkxpc3RTdHIocGVvcGxlQXJyKSArICcgYXJlICcgKyBkZXNjcmlwdGlvbjtcbiAgfVxufTtcblxuLyoqXG4gKiBUeXBlc1xuICovXG5mdW5jdGlvbiByZWxhdGlvbnNoaXAoZGVzY3JpcHRpb24sIHBlcnNvbklzSWQsIHBlcnNvblRvSWQpIHtcbiAgdmFyIG9wdHMgPSBhcmd1bWVudHMubGVuZ3RoID4gMyAmJiBhcmd1bWVudHNbM10gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1szXSA6IHt9O1xuXG4gIHJldHVybiB7XG4gICAgcGVyc29uSXNEZXNjcmlwdGlvbjogZGVzY3JpcHRpb24sXG4gICAgcGVyc29uSXNJZDogcGVyc29uSXNJZCxcbiAgICBwZXJzb25Ub0lkOiBwZXJzb25Ub0lkLFxuICAgIGluZmVycmVkOiAhIW9wdHMuaW5mZXJyZWRcbiAgfTtcbn1cblxuLyoqXG4gKiBTdG9yYWdlXG4gKi9cbmZ1bmN0aW9uIGFkZFJlbGF0aW9uc2hpcChyZWxhdGlvbnNoaXBPYmopIHtcbiAgdmFyIGhvdXNlaG9sZFJlbGF0aW9uc2hpcHMgPSBnZXRBbGxSZWxhdGlvbnNoaXBzKCkgfHwgW10sXG4gICAgICBpdGVtID0gX2V4dGVuZHMoe30sIHJlbGF0aW9uc2hpcE9iaiwge1xuICAgIGlkOiBhdXRvSW5jcmVtZW50SWQoUkVMQVRJT05TSElQU19TVE9SQUdFX0tFWSlcbiAgfSk7XG5cbiAgaG91c2Vob2xkUmVsYXRpb25zaGlwcy5wdXNoKGl0ZW0pO1xuXG4gIHNlc3Npb25TdG9yYWdlLnNldEl0ZW0oUkVMQVRJT05TSElQU19TVE9SQUdFX0tFWSwgSlNPTi5zdHJpbmdpZnkoaG91c2Vob2xkUmVsYXRpb25zaGlwcykpO1xuXG4gIHJldHVybiBpdGVtO1xufVxuXG5mdW5jdGlvbiBlZGl0UmVsYXRpb25zaGlwKHJlbGF0aW9uc2hpcElkLCB2YWx1ZU9iamVjdCkge1xuICB2YXIgaG91c2Vob2xkUmVsYXRpb25zaGlwcyA9IChnZXRBbGxSZWxhdGlvbnNoaXBzKCkgfHwgW10pLm1hcChmdW5jdGlvbiAocmVsYXRpb25zaGlwKSB7XG4gICAgcmV0dXJuIHJlbGF0aW9uc2hpcC5pZCArICcnID09PSByZWxhdGlvbnNoaXBJZCArICcnID8gX2V4dGVuZHMoe30sIHZhbHVlT2JqZWN0LCB7XG4gICAgICBpZDogcmVsYXRpb25zaGlwSWRcbiAgICB9KSA6IHJlbGF0aW9uc2hpcDtcbiAgfSk7XG5cbiAgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbShSRUxBVElPTlNISVBTX1NUT1JBR0VfS0VZLCBKU09OLnN0cmluZ2lmeShob3VzZWhvbGRSZWxhdGlvbnNoaXBzKSk7XG59XG5cbmZ1bmN0aW9uIGdldEFsbFJlbGF0aW9uc2hpcHMoKSB7XG4gIHJldHVybiBKU09OLnBhcnNlKHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oUkVMQVRJT05TSElQU19TVE9SQUdFX0tFWSkpIHx8IFtdO1xufVxuXG5mdW5jdGlvbiBnZXRBbGxNYW51YWxSZWxhdGlvbnNoaXBzKCkge1xuICByZXR1cm4gZ2V0QWxsUmVsYXRpb25zaGlwcygpLmZpbHRlcihmdW5jdGlvbiAocmVsYXRpb25zaGlwKSB7XG4gICAgcmV0dXJuICFyZWxhdGlvbnNoaXAuaW5mZXJyZWQ7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBkZWxldGVBbGxSZWxhdGlvbnNoaXBzRm9yTWVtYmVyKHBlcnNvbklkKSB7XG4gIHZhciBob3VzZWhvbGRSZWxhdGlvbnNoaXBzID0gZ2V0QWxsUmVsYXRpb25zaGlwcygpLmZpbHRlcihmdW5jdGlvbiAocmVsYXRpb25zaGlwKSB7XG4gICAgcmV0dXJuICEocGVyc29uSWQgPT09IHJlbGF0aW9uc2hpcC5wZXJzb25Jc0lkIHx8IHBlcnNvbklkID09PSByZWxhdGlvbnNoaXAucGVyc29uVG9JZCk7XG4gIH0pO1xuXG4gIHNlc3Npb25TdG9yYWdlLnNldEl0ZW0oUkVMQVRJT05TSElQU19TVE9SQUdFX0tFWSwgSlNPTi5zdHJpbmdpZnkoaG91c2Vob2xkUmVsYXRpb25zaGlwcykpO1xufVxuXG4vKipcbiAqIENvbXBhcmF0b3JzXG4gKi9cbmZ1bmN0aW9uIGlzSW5SZWxhdGlvbnNoaXAocGVyc29uSWQsIHJlbGF0aW9uc2hpcCkge1xuICByZXR1cm4gcmVsYXRpb25zaGlwLnBlcnNvblRvSWQgPT09IHBlcnNvbklkIHx8IHJlbGF0aW9uc2hpcC5wZXJzb25Jc0lkID09PSBwZXJzb25JZDtcbn1cblxuZnVuY3Rpb24gaXNBQ2hpbGRJblJlbGF0aW9uc2hpcChwZXJzb25JZCwgcmVsYXRpb25zaGlwKSB7XG4gIC8qKlxuICAgKiBHdWFyZFxuICAgKi9cbiAgaWYgKCFpc0luUmVsYXRpb25zaGlwKHBlcnNvbklkLCByZWxhdGlvbnNoaXApKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcmV0dXJuIHJlbGF0aW9uc2hpcC5wZXJzb25Jc0Rlc2NyaXB0aW9uID09PSAnbW90aGVyLWZhdGhlcicgJiYgcmVsYXRpb25zaGlwLnBlcnNvblRvSWQgPT09IHBlcnNvbklkIHx8IHJlbGF0aW9uc2hpcC5wZXJzb25Jc0Rlc2NyaXB0aW9uID09PSAnc29uLWRhdWdodGVyJyAmJiByZWxhdGlvbnNoaXAucGVyc29uSXNJZCA9PT0gcGVyc29uSWQ7XG59XG5cbmZ1bmN0aW9uIGlzQVNpYmxpbmdJblJlbGF0aW9uc2hpcChwZXJzb25JZCwgcmVsYXRpb25zaGlwKSB7XG4gIHJldHVybiBpc0luUmVsYXRpb25zaGlwKHBlcnNvbklkLCByZWxhdGlvbnNoaXApICYmIHJlbGF0aW9uc2hpcERlc2NyaXB0aW9uTWFwW3JlbGF0aW9uc2hpcC5wZXJzb25Jc0Rlc2NyaXB0aW9uXS50eXBlLmlkID09PSAnc2libGluZyc7XG59XG5cbmZ1bmN0aW9uIGlzQVBhcmVudEluUmVsYXRpb25zaGlwKHBlcnNvbklkLCByZWxhdGlvbnNoaXApIHtcbiAgLyoqXG4gICAqIEd1YXJkXG4gICAqL1xuICBpZiAoIWlzSW5SZWxhdGlvbnNoaXAocGVyc29uSWQsIHJlbGF0aW9uc2hpcCkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICByZXR1cm4gcmVsYXRpb25zaGlwLnBlcnNvbklzRGVzY3JpcHRpb24gPT09ICdtb3RoZXItZmF0aGVyJyAmJiByZWxhdGlvbnNoaXAucGVyc29uSXNJZCA9PT0gcGVyc29uSWQgfHwgcmVsYXRpb25zaGlwLnBlcnNvbklzRGVzY3JpcHRpb24gPT09ICdzb24tZGF1Z2h0ZXInICYmIHJlbGF0aW9uc2hpcC5wZXJzb25Ub0lkID09PSBwZXJzb25JZDtcbn1cblxuZnVuY3Rpb24gYXJlQW55Q2hpbGRyZW5JblJlbGF0aW9uc2hpcE5vdFBhcmVudChjaGlsZHJlbklkcywgbm90UGFyZW50SWQsIHJlbGF0aW9uc2hpcCkge1xuICAvKipcbiAgICogR3VhcmRcbiAgICogSWYgcmVsYXRpb25zaGlwIHR5cGUgaXMgbm90IGNoaWxkLXBhcmVudFxuICAgKi9cbiAgaWYgKHJlbGF0aW9uc2hpcERlc2NyaXB0aW9uTWFwW3JlbGF0aW9uc2hpcC5wZXJzb25Jc0Rlc2NyaXB0aW9uXS50eXBlLmlkICE9PSAnY2hpbGQtcGFyZW50Jykge1xuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgdmFyIGNoaWxkSW5kZXhBc1BlcnNvbklzID0gY2hpbGRyZW5JZHMuaW5kZXhPZihyZWxhdGlvbnNoaXAucGVyc29uSXNJZCksXG4gICAgICBjaGlsZEluZGV4QXNQZXJzb25UbyA9IGNoaWxkcmVuSWRzLmluZGV4T2YocmVsYXRpb25zaGlwLnBlcnNvblRvSWQpO1xuXG4gIC8qKlxuICAgKiBGaW5kIHBhcmVudHMgd2l0aCB0aGUgc2FtZSBjaGlsZHJlblxuICAgKlxuICAgKiBJZiBhIHBlcnNvbklzLWNoaWxkIGlzIG5vdCBpbiByZWxhdGlvbnNoaXBcbiAgICogb3IgMiBjaGlsZHJlbiBhcmUgZm91bmQgaW4gcmVsYXRpb25zaGlwXG4gICAqL1xuICBpZiAoY2hpbGRJbmRleEFzUGVyc29uSXMgPT09IC0xICYmIGNoaWxkSW5kZXhBc1BlcnNvblRvID09PSAtMSB8fCBjaGlsZEluZGV4QXNQZXJzb25JcyAhPT0gLTEgJiYgY2hpbGRJbmRleEFzUGVyc29uVG8gIT09IC0xKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLyoqXG4gICAqIENoaWxkIG11c3QgYmUgaW4gcmVsYXRpb25zaGlwLCBnZXQgY2hpbGQgaW5kZXhcbiAgICovXG4gIHZhciBjaGlsZEluZGV4ID0gY2hpbGRJbmRleEFzUGVyc29uSXMgIT09IC0xID8gY2hpbGRJbmRleEFzUGVyc29uSXMgOiBjaGlsZEluZGV4QXNQZXJzb25UbztcblxuICAvKipcbiAgICogSWYgcGVyc29uSXMgaXMgbm90IGluIHJlbGF0aW9uc2hpcFxuICAgKiBhbmQgY2hpbGQgZnJvbSBwcmV2aW91cyByZWxhdGlvbnNoaXAgaXMgYSBjaGlsZCBpbiB0aGlzIHJlbGF0aW9uc2hpcFxuICAgKi9cbiAgcmV0dXJuICFpc0luUmVsYXRpb25zaGlwKG5vdFBhcmVudElkLCByZWxhdGlvbnNoaXApICYmIGlzQUNoaWxkSW5SZWxhdGlvbnNoaXAoY2hpbGRyZW5JZHNbY2hpbGRJbmRleF0sIHJlbGF0aW9uc2hpcCk7XG59XG5cbmZ1bmN0aW9uIGlzUmVsYXRpb25zaGlwVHlwZShyZWxhdGlvbnNoaXBUeXBlLCByZWxhdGlvbnNoaXApIHtcbiAgdmFyIHR5cGVPZlJlbGF0aW9uc2hpcCA9IHJlbGF0aW9uc2hpcERlc2NyaXB0aW9uTWFwW3JlbGF0aW9uc2hpcC5wZXJzb25Jc0Rlc2NyaXB0aW9uXS50eXBlLmlkO1xuXG4gIC8qKlxuICAgKiByZWxhdGlvbnNoaXBUeXBlIGNhbiBiZSBhbiBhcnJheSBvZiB0eXBlc1xuICAgKi9cbiAgcmV0dXJuIF8kMS5pc0FycmF5KHJlbGF0aW9uc2hpcFR5cGUpID8gISFfJDEuZmluZChyZWxhdGlvbnNoaXBUeXBlLCBmdW5jdGlvbiAoclR5cGUpIHtcbiAgICByZXR1cm4gclR5cGUgPT09IHR5cGVPZlJlbGF0aW9uc2hpcDtcbiAgfSkgOiB0eXBlT2ZSZWxhdGlvbnNoaXAgPT09IHJlbGF0aW9uc2hpcFR5cGU7XG59XG5cbi8qKlxuICogUmV0cmlldmUgcGVvcGxlIGJ5IHJvbGUgaW4gcmVsYXRpb25zaGlwc1xuICovXG5mdW5jdGlvbiBnZXRQYXJlbnRJZEZyb21SZWxhdGlvbnNoaXAocmVsYXRpb25zaGlwKSB7XG4gIHZhciBwYXJlbnRJZCA9IHZvaWQgMDtcblxuICBpZiAocmVsYXRpb25zaGlwLnBlcnNvbklzRGVzY3JpcHRpb24gPT09ICdtb3RoZXItZmF0aGVyJykge1xuICAgIHBhcmVudElkID0gcmVsYXRpb25zaGlwLnBlcnNvbklzSWQ7XG4gIH1cblxuICBpZiAocmVsYXRpb25zaGlwLnBlcnNvbklzRGVzY3JpcHRpb24gPT09ICdzb24tZGF1Z2h0ZXInKSB7XG4gICAgcGFyZW50SWQgPSByZWxhdGlvbnNoaXAucGVyc29uVG9JZDtcbiAgfVxuXG4gIGlmICghcGFyZW50SWQpIHtcbiAgICBjb25zb2xlLmxvZygnUGFyZW50IG5vdCBmb3VuZCBpbiByZWxhdGlvbnNoaXA6ICcsIHJlbGF0aW9uc2hpcCk7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcmV0dXJuIHBhcmVudElkO1xufVxuXG5mdW5jdGlvbiBnZXRDaGlsZElkRnJvbVJlbGF0aW9uc2hpcChyZWxhdGlvbnNoaXApIHtcbiAgdmFyIGNoaWxkSWQgPSB2b2lkIDA7XG5cbiAgaWYgKHJlbGF0aW9uc2hpcC5wZXJzb25Jc0Rlc2NyaXB0aW9uID09PSAnbW90aGVyLWZhdGhlcicpIHtcbiAgICBjaGlsZElkID0gcmVsYXRpb25zaGlwLnBlcnNvblRvSWQ7XG4gIH1cblxuICBpZiAocmVsYXRpb25zaGlwLnBlcnNvbklzRGVzY3JpcHRpb24gPT09ICdzb24tZGF1Z2h0ZXInKSB7XG4gICAgY2hpbGRJZCA9IHJlbGF0aW9uc2hpcC5wZXJzb25Jc0lkO1xuICB9XG5cbiAgaWYgKCFjaGlsZElkKSB7XG4gICAgY29uc29sZS5sb2coJ0NoaWxkIG5vdCBmb3VuZCBpbiByZWxhdGlvbnNoaXA6ICcsIHJlbGF0aW9uc2hpcCk7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcmV0dXJuIGNoaWxkSWQ7XG59XG5cbmZ1bmN0aW9uIGdldFNpYmxpbmdJZEZyb21SZWxhdGlvbnNoaXAocGVyc29uSWQsIHJlbGF0aW9uc2hpcCkge1xuICBpZiAoIWlzSW5SZWxhdGlvbnNoaXAocGVyc29uSWQsIHJlbGF0aW9uc2hpcCkpIHtcbiAgICBjb25zb2xlLmxvZygnUGVyc29uICcgKyBwZXJzb25JZCArICcgbm90IGZvdW5kIGluIHJlbGF0aW9uc2hpcDogJywgcmVsYXRpb25zaGlwKTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICByZXR1cm4gcmVsYXRpb25zaGlwW3JlbGF0aW9uc2hpcC5wZXJzb25Jc0lkID09PSBwZXJzb25JZCA/ICdwZXJzb25Ub0lkJyA6ICdwZXJzb25Jc0lkJ107XG59XG5cbmZ1bmN0aW9uIGdldE90aGVyUGVyc29uSWRGcm9tUmVsYXRpb25zaGlwKHBlcnNvbklkLCByZWxhdGlvbnNoaXApIHtcbiAgcmV0dXJuIHJlbGF0aW9uc2hpcC5wZXJzb25Jc0lkID09PSBwZXJzb25JZCA/IHJlbGF0aW9uc2hpcC5wZXJzb25Ub0lkIDogcmVsYXRpb25zaGlwLnBlcnNvbklzSWQ7XG59XG5cbmZ1bmN0aW9uIGdldEFsbFBhcmVudHNPZihwZXJzb25JZCkge1xuICByZXR1cm4gZ2V0QWxsUmVsYXRpb25zaGlwcygpLmZpbHRlcihpc0FDaGlsZEluUmVsYXRpb25zaGlwLmJpbmQobnVsbCwgcGVyc29uSWQpKS5tYXAoZnVuY3Rpb24gKHJlbGF0aW9uc2hpcCkge1xuICAgIHJldHVybiBnZXRQZXJzb25Gcm9tTWVtYmVyKGdldEhvdXNlaG9sZE1lbWJlckJ5UGVyc29uSWQoZ2V0UGFyZW50SWRGcm9tUmVsYXRpb25zaGlwKHJlbGF0aW9uc2hpcCkpKTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGdldEFsbENoaWxkcmVuT2YocGVyc29uSWQpIHtcbiAgcmV0dXJuIGdldEFsbFJlbGF0aW9uc2hpcHMoKS5maWx0ZXIoaXNBUGFyZW50SW5SZWxhdGlvbnNoaXAuYmluZChudWxsLCBwZXJzb25JZCkpLm1hcChmdW5jdGlvbiAocmVsYXRpb25zaGlwKSB7XG4gICAgcmV0dXJuIGdldEhvdXNlaG9sZE1lbWJlckJ5UGVyc29uSWQoZ2V0Q2hpbGRJZEZyb21SZWxhdGlvbnNoaXAocmVsYXRpb25zaGlwKSlbJ0BwZXJzb24nXTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGdldFBlcnNvbklkRnJvbVBlcnNvbihwZXJzb24kJDEpIHtcbiAgcmV0dXJuIHBlcnNvbiQkMS5pZDtcbn1cblxuZnVuY3Rpb24gZ2V0UGVyc29uRnJvbU1lbWJlcihtZW1iZXIpIHtcbiAgcmV0dXJuIG1lbWJlclsnQHBlcnNvbiddO1xufVxuXG4vKipcbiAqIE1pc3NpbmcgcmVsYXRpb25zaGlwIGluZmVyZW5jZVxuICovXG52YXIgbWlzc2luZ1JlbGF0aW9uc2hpcEluZmVyZW5jZSA9IHtcbiAgc2libGluZ3NPZjogZnVuY3Rpb24gc2libGluZ3NPZihzdWJqZWN0TWVtYmVyKSB7XG5cbiAgICB2YXIgbWlzc2luZ1JlbGF0aW9uc2hpcHMgPSBbXSxcbiAgICAgICAgYWxsUmVsYXRpb25zaGlwcyA9IGdldEFsbFJlbGF0aW9uc2hpcHMoKSxcbiAgICAgICAgcGVyc29uJCQxID0gZ2V0UGVyc29uRnJvbU1lbWJlcihzdWJqZWN0TWVtYmVyKSxcbiAgICAgICAgcGVyc29uSWQgPSBwZXJzb24kJDEuaWQsXG4gICAgICAgIHBhcmVudHMgPSBnZXRBbGxQYXJlbnRzT2YocGVyc29uSWQpLFxuICAgICAgICBzaWJsaW5nSWRzID0gYWxsUmVsYXRpb25zaGlwcy5maWx0ZXIoaXNBU2libGluZ0luUmVsYXRpb25zaGlwLmJpbmQobnVsbCwgcGVyc29uSWQpKS5tYXAoZ2V0U2libGluZ0lkRnJvbVJlbGF0aW9uc2hpcC5iaW5kKG51bGwsIHBlcnNvbklkKSk7XG5cbiAgICAvKipcbiAgICAgKiBJZiAyIHBhcmVudCByZWxhdGlvbnNoaXBzIG9mICdwZXJzb24nIGFyZSBmb3VuZCB3ZSBjYW4gYXR0ZW1wdCB0byBpbmZlclxuICAgICAqIHNpYmxpbmcgcmVsYXRpb25zaGlwc1xuICAgICAqL1xuICAgIGlmIChwYXJlbnRzLmxlbmd0aCA9PT0gMikge1xuXG4gICAgICBnZXRBbGxIb3VzZWhvbGRNZW1iZXJzKCkuZm9yRWFjaChmdW5jdGlvbiAobWVtYmVyKSB7XG5cbiAgICAgICAgdmFyIG1lbWJlclBlcnNvbklkID0gbWVtYmVyWydAcGVyc29uJ10uaWQ7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEd1YXJkXG4gICAgICAgICAqIElmIG1lbWJlciBpcyB0aGUgc3ViamVjdCBtZW1iZXJcbiAgICAgICAgICogb3IgbWVtYmVyIGlzIGEgcGFyZW50XG4gICAgICAgICAqIG9yIG1lbWJlciBhbHJlYWR5IGhhcyBhIHNpYmxpbmcgcmVsYXRpb25zaGlwIHdpdGggJ3BlcnNvbidcbiAgICAgICAgICogc2tpcCBtZW1iZXJcbiAgICAgICAgICovXG4gICAgICAgIGlmIChtZW1iZXJQZXJzb25JZCA9PT0gcGVyc29uSWQgfHwgbWVtYmVyUGVyc29uSWQgPT09IHBhcmVudHNbMF0uaWQgfHwgbWVtYmVyUGVyc29uSWQgPT09IHBhcmVudHNbMV0uaWQgfHwgc2libGluZ0lkcy5pbmRleE9mKG1lbWJlclBlcnNvbklkKSA+IC0xKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIG1lbWJlclBhcmVudHMgPSBnZXRBbGxQYXJlbnRzT2YobWVtYmVyUGVyc29uSWQpO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBJZiAyIHBhcmVudHMgb2YgJ21lbWJlcicgYXJlIGZvdW5kXG4gICAgICAgICAqIGFuZCB0aGV5IGFyZSB0aGUgc2FtZSBwYXJlbnRzIG9mICdwZXJzb24nXG4gICAgICAgICAqIHdlIGhhdmUgaWRlbnRpZmllZCBhIG1pc3NpbmcgaW5mZXJyZWQgcmVsYXRpb25zaGlwXG4gICAgICAgICAqL1xuICAgICAgICBpZiAobWVtYmVyUGFyZW50cy5sZW5ndGggPT09IDIgJiYgXyQxLmRpZmZlcmVuY2UocGFyZW50cy5tYXAoZ2V0UGVyc29uSWRGcm9tUGVyc29uKSwgbWVtYmVyUGFyZW50cy5tYXAoZ2V0UGVyc29uSWRGcm9tUGVyc29uKSkubGVuZ3RoID09PSAwKSB7XG5cbiAgICAgICAgICAvKipcbiAgICAgICAgICAgKiBBZGQgdG8gbWlzc2luZ1JlbGF0aW9uc2hpcHNcbiAgICAgICAgICAgKi9cbiAgICAgICAgICBtaXNzaW5nUmVsYXRpb25zaGlwcy5wdXNoKHJlbGF0aW9uc2hpcCgnYnJvdGhlci1zaXN0ZXInLCBwZXJzb24kJDEuaWQsIG1lbWJlclBlcnNvbklkLCB7IGluZmVycmVkOiB0cnVlIH0pKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG1pc3NpbmdSZWxhdGlvbnNoaXBzO1xuICB9XG59O1xuXG5mdW5jdGlvbiBpbmZlclJlbGF0aW9uc2hpcHMocmVsYXRpb25zaGlwLCBwZXJzb25JcywgcGVyc29uVG8pIHtcbiAgdmFyIG1pc3NpbmdSZWxhdGlvbnNoaXBzID0gW107XG5cbiAgaWYgKHJlbGF0aW9uc2hpcC5wZXJzb25Jc0Rlc2NyaXB0aW9uID09PSAnbW90aGVyLWZhdGhlcicpIHtcbiAgICBtaXNzaW5nUmVsYXRpb25zaGlwcyA9IG1pc3NpbmdSZWxhdGlvbnNoaXBzLmNvbmNhdChtaXNzaW5nUmVsYXRpb25zaGlwSW5mZXJlbmNlLnNpYmxpbmdzT2YocGVyc29uVG8pKTtcbiAgfVxuXG4gIGlmIChyZWxhdGlvbnNoaXAucGVyc29uSXNEZXNjcmlwdGlvbiA9PT0gJ3Nvbi1kYXVnaHRlcicpIHtcbiAgICBtaXNzaW5nUmVsYXRpb25zaGlwcyA9IG1pc3NpbmdSZWxhdGlvbnNoaXBzLmNvbmNhdChtaXNzaW5nUmVsYXRpb25zaGlwSW5mZXJlbmNlLnNpYmxpbmdzT2YocGVyc29uSXMpKTtcbiAgfVxuXG4gICQuZWFjaChtaXNzaW5nUmVsYXRpb25zaGlwcywgZnVuY3Rpb24gKGksIHJlbGF0aW9uc2hpcCkge1xuICAgIGFkZFJlbGF0aW9uc2hpcChyZWxhdGlvbnNoaXApO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gZmluZE5leHRNaXNzaW5nUmVsYXRpb25zaGlwKCkge1xuICB2YXIgaG91c2Vob2xkTWVtYmVycyA9IGdldEFsbEhvdXNlaG9sZE1lbWJlcnMoKS5maWx0ZXIoaXNIb3VzZWhvbGRNZW1iZXIpLFxuICAgICAgcmVsYXRpb25zaGlwcyA9IGdldEFsbFJlbGF0aW9uc2hpcHMoKSxcbiAgICAgIG1pc3NpbmdSZWxhdGlvbnNoaXBNZW1iZXJzID0gW10sXG4gICAgICBwZXJzb25JcyA9IG51bGw7XG5cbiAgLyoqXG4gICAqIEZpbmQgdGhlIG5leHQgbWlzc2luZyByZWxhdGlvbnNoaXBcbiAgICovXG4gICQuZWFjaChob3VzZWhvbGRNZW1iZXJzLCBmdW5jdGlvbiAoaSwgbWVtYmVyKSB7XG4gICAgdmFyIHBlcnNvbklkID0gbWVtYmVyWydAcGVyc29uJ10uaWQ7XG5cbiAgICAvKipcbiAgICAgKiBHZXQgYWxsIHJlbGF0aW9uc2hpcHMgZm9yIHRoaXMgbWVtYmVyXG4gICAgICovXG4gICAgdmFyIG1lbWJlclJlbGF0aW9uc2hpcHMgPSByZWxhdGlvbnNoaXBzLmZpbHRlcihmdW5jdGlvbiAocmVsYXRpb25zaGlwKSB7XG4gICAgICByZXR1cm4gcmVsYXRpb25zaGlwLnBlcnNvbklzSWQgPT09IHBlcnNvbklkIHx8IHJlbGF0aW9uc2hpcC5wZXJzb25Ub0lkID09PSBwZXJzb25JZDtcbiAgICB9KSxcbiAgICAgICAgbWVtYmVyUmVsYXRpb25zaGlwVG9JZHMgPSBtZW1iZXJSZWxhdGlvbnNoaXBzLm1hcChmdW5jdGlvbiAocmVsYXRpb25zaGlwKSB7XG4gICAgICByZXR1cm4gcmVsYXRpb25zaGlwLnBlcnNvbklzSWQgPT09IHBlcnNvbklkID8gcmVsYXRpb25zaGlwLnBlcnNvblRvSWQgOiByZWxhdGlvbnNoaXAucGVyc29uSXNJZDtcbiAgICB9KSB8fCBbXTtcblxuICAgIC8qKlxuICAgICAqIElmIHRvdGFsIHJlbGF0aW9uc2hpcHMgcmVsYXRlZCB0byB0aGlzIG1lbWJlciBpc24ndCBlcXVhbCB0b1xuICAgICAqIHRvdGFsIGhvdXNlaG9sZCBtZW1iZXJzIC0xLCBpbmRpY2F0ZXMgbWlzc2luZyByZWxhdGlvbnNoaXBcbiAgICAgKi9cbiAgICBpZiAobWVtYmVyUmVsYXRpb25zaGlwcy5sZW5ndGggPCBob3VzZWhvbGRNZW1iZXJzLmxlbmd0aCAtIDEpIHtcblxuICAgICAgLyoqXG4gICAgICAgKiBBbGwgbWlzc2luZyByZWxhdGlvbnNoaXAgbWVtYmVyc1xuICAgICAgICovXG4gICAgICBtaXNzaW5nUmVsYXRpb25zaGlwTWVtYmVycyA9IGhvdXNlaG9sZE1lbWJlcnMuZmlsdGVyKGZ1bmN0aW9uIChtKSB7XG4gICAgICAgIHJldHVybiBtZW1iZXJSZWxhdGlvbnNoaXBUb0lkcy5pbmRleE9mKG1bJ0BwZXJzb24nXS5pZCkgPT09IC0xICYmIG1bJ0BwZXJzb24nXS5pZCAhPT0gcGVyc29uSWQ7XG4gICAgICB9KTtcblxuICAgICAgcGVyc29uSXMgPSBtZW1iZXI7XG5cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiBwZXJzb25JcyA/IHtcbiAgICBwZXJzb25JczogcGVyc29uSXMsXG4gICAgcGVyc29uVG86IG1pc3NpbmdSZWxhdGlvbnNoaXBNZW1iZXJzWzBdXG4gIH0gOiBudWxsO1xufVxuXG5mdW5jdGlvbiBnZXRQZW9wbGVJZHNNaXNzaW5nUmVsYXRpb25zaGlwc1dpdGhQZXJzb24ocGVyc29uSWQpIHtcbiAgdmFyIHJlbWFpbmluZ1BlcnNvbklkcyA9IGdldEFsbEhvdXNlaG9sZE1lbWJlcnMoKS5tYXAoZnVuY3Rpb24gKG1lbWJlcikge1xuICAgIHJldHVybiBtZW1iZXJbJ0BwZXJzb24nXS5pZDtcbiAgfSk7XG5cbiAgLyoqXG4gICAqIFJlbW92ZSB0aGlzIHBlcnNvbiBmcm9tIHRoZSBsaXN0XG4gICAqL1xuICByZW1vdmVGcm9tTGlzdChyZW1haW5pbmdQZXJzb25JZHMsIHBlcnNvbklkKTtcblxuICAkLmVhY2goZ2V0QWxsUmVsYXRpb25zaGlwcygpLCBmdW5jdGlvbiAoaSwgcmVsYXRpb25zaGlwKSB7XG4gICAgaWYgKCFpc0luUmVsYXRpb25zaGlwKHBlcnNvbklkLCByZWxhdGlvbnNoaXApKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVtb3ZlIHRoZSBvdGhlciBwZXJzb24gZnJvbSB0aGUgcmVtYWluaW5nUGVyc29uSWRzIGxpc3RcbiAgICAgKi9cbiAgICByZW1vdmVGcm9tTGlzdChyZW1haW5pbmdQZXJzb25JZHMsIGdldE90aGVyUGVyc29uSWRGcm9tUmVsYXRpb25zaGlwKHBlcnNvbklkLCByZWxhdGlvbnNoaXApKTtcbiAgfSk7XG5cbiAgcmV0dXJuIHJlbWFpbmluZ1BlcnNvbklkcztcbn1cblxuZnVuY3Rpb24gZ2V0UmVsYXRpb25zaGlwVHlwZShyZWxhdGlvbnNoaXApIHtcbiAgcmV0dXJuIHJlbGF0aW9uc2hpcERlc2NyaXB0aW9uTWFwW3JlbGF0aW9uc2hpcC5wZXJzb25Jc0Rlc2NyaXB0aW9uXS50eXBlO1xufVxuXG4vKipcbiAqIFJldHJpZXZlIGZyb20gcmVsYXRpb25zaGlwIGdyb3VwXG4gKi9cbmZ1bmN0aW9uIGdldFJlbGF0aW9uc2hpcHNXaXRoUGVyc29uSWRzKHJlbGF0aW9uc2hpcHMsIGlkQXJyKSB7XG4gIHJldHVybiByZWxhdGlvbnNoaXBzLmZpbHRlcihmdW5jdGlvbiAoY2hpbGRSZWxhdGlvbnNoaXApIHtcbiAgICByZXR1cm4gaWRBcnIuaW5kZXhPZihjaGlsZFJlbGF0aW9uc2hpcC5wZXJzb25Jc0lkKSAhPT0gLTEgfHwgaWRBcnIuaW5kZXhPZihjaGlsZFJlbGF0aW9uc2hpcC5wZXJzb25Ub0lkKSAhPT0gLTE7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBnZXRSZWxhdGlvbnNoaXBPZihwZXJzb24xLCBwZXJzb24yKSB7XG4gIHJldHVybiBnZXRBbGxSZWxhdGlvbnNoaXBzKCkuZmluZChmdW5jdGlvbiAocmVsYXRpb25zaGlwKSB7XG4gICAgcmV0dXJuIGlzSW5SZWxhdGlvbnNoaXAocGVyc29uMSwgcmVsYXRpb25zaGlwKSAmJiBpc0luUmVsYXRpb25zaGlwKHBlcnNvbjIsIHJlbGF0aW9uc2hpcCk7XG4gIH0pO1xufVxuXG52YXIgVVNFUl9TVE9SQUdFX0tFWSA9ICd1c2VyLWRldGFpbHMnO1xuXG5mdW5jdGlvbiBnZXRBZGRyZXNzKCkge1xuICB2YXIgYWRkcmVzc0xpbmVzID0gc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbSgnYWRkcmVzcycpLnNwbGl0KCcsJyk7XG5cbiAgcmV0dXJuIHtcbiAgICBhZGRyZXNzTGluZTE6IGFkZHJlc3NMaW5lc1swXSxcbiAgICBhZGRyZXNzTGluZTI6IGFkZHJlc3NMaW5lc1sxXSxcbiAgICBhZGRyZXNzTGluZTM6IGFkZHJlc3NMaW5lc1syXSxcbiAgICBhZGRyZXNzQ291bnR5OiBhZGRyZXNzTGluZXNbNF0sXG4gICAgYWRkcmVzc1Rvd25DaXR5OiBhZGRyZXNzTGluZXNbM10sXG4gICAgYWRkcmVzc1Bvc3Rjb2RlOiBhZGRyZXNzTGluZXNbNV1cbiAgfTtcbn1cblxuLyoqXG4gKiBVc2VyXG4gKi9cbmZ1bmN0aW9uIGFkZFVzZXJQZXJzb24ocGVyc29uJCQxKSB7XG4gIHNlc3Npb25TdG9yYWdlLnNldEl0ZW0oVVNFUl9TVE9SQUdFX0tFWSwgSlNPTi5zdHJpbmdpZnkocGVyc29uJCQxKSk7XG59XG5cbmZ1bmN0aW9uIGdldFVzZXJQZXJzb24oKSB7XG4gIHJldHVybiBKU09OLnBhcnNlKHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oVVNFUl9TVE9SQUdFX0tFWSkpO1xufVxuXG4vKipcbiAqIEhlbHBlcnNcbiAqL1xuZnVuY3Rpb24gY3JlYXRlTmF2SXRlbShtZW1iZXIpIHtcbiAgdmFyICRub2RlRWwgPSAkKCc8bGkgY2xhc3M9XCJqcy10ZW1wbGF0ZS1uYXYtaXRlbSBuYXZfX2l0ZW0gcGx1dG9cIj4nICsgJyAgPGEgY2xhc3M9XCJqcy10ZW1wbGF0ZS1uYXYtaXRlbS1sYWJlbCBuYXZfX2xpbmtcIiBocmVmPVwiI1wiPjwvYT4nICsgJzwvbGk+JyksXG4gICAgICAkbGlua0VsID0gJG5vZGVFbC5maW5kKCcuanMtdGVtcGxhdGUtbmF2LWl0ZW0tbGFiZWwnKTtcblxuICAkbGlua0VsLmh0bWwobWVtYmVyWydAcGVyc29uJ10uZnVsbE5hbWUpO1xuXG4gIGlmIChtZW1iZXJbJ0BwZXJzb24nXS5pZCA9PT0gVVNFUl9IT1VTRUhPTERfTUVNQkVSX0lEKSB7XG4gICAgJGxpbmtFbC5hdHRyKCdocmVmJywgJy4uL3doYXQtaXMteW91ci1uYW1lJyk7XG4gIH0gZWxzZSB7XG4gICAgJGxpbmtFbC5hdHRyKCdocmVmJywgJy4uL3doby1lbHNlLXRvLWFkZD9lZGl0PScgKyBtZW1iZXJbJ0BwZXJzb24nXS5pZCk7XG4gIH1cblxuICByZXR1cm4gJG5vZGVFbDtcbn1cblxuZnVuY3Rpb24gdXBkYXRlSG91c2Vob2xkVmlzaXRvcnNOYXZpZ2F0aW9uSXRlbXMoKSB7XG4gIHZhciBhbGxIb3VzZWhvbGRNZW1iZXJzID0gd2luZG93Lk9OUy5zdG9yYWdlLmdldEFsbEhvdXNlaG9sZE1lbWJlcnMoKSxcbiAgICAgIGhvdXNlaG9sZE1lbWJlcnMgPSBhbGxIb3VzZWhvbGRNZW1iZXJzLmZpbHRlcih3aW5kb3cuT05TLnN0b3JhZ2UuaXNIb3VzZWhvbGRNZW1iZXIpLFxuICAgICAgdmlzaXRvcnMgPSBhbGxIb3VzZWhvbGRNZW1iZXJzLmZpbHRlcih3aW5kb3cuT05TLnN0b3JhZ2UuaXNWaXNpdG9yKTtcblxuICB2YXIgJG5hdmlnYXRpb25Ib3VzZWhvbGRNZW1iZXJzRWwgPSAkKCcjbmF2aWdhdGlvbi1ob3VzZWhvbGQtbWVtYmVycycpLFxuICAgICAgJG5hdmlnYXRpb25WaXNpdG9yc0VsID0gJCgnI25hdmlnYXRpb24tdmlzaXRvcnMnKTtcblxuICBpZiAoaG91c2Vob2xkTWVtYmVycy5sZW5ndGgpIHtcbiAgICAkLmVhY2goaG91c2Vob2xkTWVtYmVycywgZnVuY3Rpb24gKGksIG1lbWJlcikge1xuICAgICAgJG5hdmlnYXRpb25Ib3VzZWhvbGRNZW1iZXJzRWwuYXBwZW5kKGNyZWF0ZU5hdkl0ZW0obWVtYmVyKSk7XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgJG5hdmlnYXRpb25Ib3VzZWhvbGRNZW1iZXJzRWwucGFyZW50KCkuaGlkZSgpO1xuICB9XG5cbiAgaWYgKHZpc2l0b3JzLmxlbmd0aCkge1xuICAgICQuZWFjaCh2aXNpdG9ycywgZnVuY3Rpb24gKGksIG1lbWJlcikge1xuICAgICAgJG5hdmlnYXRpb25WaXNpdG9yc0VsLmFwcGVuZChjcmVhdGVOYXZJdGVtKG1lbWJlcikpO1xuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgICRuYXZpZ2F0aW9uVmlzaXRvcnNFbC5wYXJlbnQoKS5oaWRlKCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gY3JlYXRlTGlzdEl0ZW1QZXJzb24obWVtYmVyKSB7XG4gIHJldHVybiAkKCc8bGkgY2xhc3M9XCJsaXN0X19pdGVtXCI+JykuYWRkQ2xhc3MoJ21hcnMnKS5odG1sKCc8c3BhbiBjbGFzcz1cImxpc3RfX2l0ZW0tbmFtZVwiPicgKyBtZW1iZXJbJ0BwZXJzb24nXS5mdWxsTmFtZSArICc8L3NwYW4+Jyk7XG59XG5cbmZ1bmN0aW9uIHBvcHVsYXRlTGlzdCgkZWwsIG1lbWJlclR5cGUpIHtcbiAgaWYgKCEkZWwubGVuZ3RoKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgdmFyIG1lbWJlcnMgPSBnZXRBbGxIb3VzZWhvbGRNZW1iZXJzKCkgfHwgW107XG5cbiAgJGVsLmVtcHR5KCkuYXBwZW5kKG1lbWJlcnMuZmlsdGVyKGZ1bmN0aW9uIChtZW1iZXIpIHtcbiAgICByZXR1cm4gbWVtYmVyLnR5cGUgPT09IG1lbWJlclR5cGU7XG4gIH0pLm1hcChjcmVhdGVMaXN0SXRlbVBlcnNvbikpO1xuXG4gICRlbC5hZGRDbGFzcygnbGlzdCBsaXN0LS1wZW9wbGUtcGxhaW4nKTtcbn1cblxuZnVuY3Rpb24gcG9wdWxhdGVIb3VzZWhvbGRMaXN0KCkge1xuICBwb3B1bGF0ZUxpc3QoJCgnI2hvdXNlaG9sZC1tZW1iZXJzJyksIEhPVVNFSE9MRF9NRU1CRVJfVFlQRSk7XG59XG5cbmZ1bmN0aW9uIHBvcHVsYXRlVmlzaXRvckxpc3QoKSB7XG4gIHBvcHVsYXRlTGlzdCgkKCcjdmlzaXRvcnMtbGlzdCcpLCBWSVNJVE9SX1RZUEUpO1xufVxuXG5mdW5jdGlvbiB1cGRhdGVBZGRyZXNzZXMoKSB7XG4gIHZhciBhZGRyZXNzTGluZXMgPSAoc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbSgnYWRkcmVzcycpIHx8ICcnKS5zcGxpdCgnLCcpLFxuICAgICAgYWRkcmVzc0xpbmUxID0gYWRkcmVzc0xpbmVzWzBdLFxuICAgICAgYWRkcmVzc0xpbmUyID0gYWRkcmVzc0xpbmVzWzFdO1xuXG4gICQoJyNzZWN0aW9uLWFkZHJlc3MnKS5odG1sKGFkZHJlc3NMaW5lMSk7XG4gICQoJy5hZGRyZXNzLXRleHQnKS5odG1sKGFkZHJlc3NMaW5lMSArIChhZGRyZXNzTGluZTIgPyAnLCAnICsgYWRkcmVzc0xpbmUyIDogJycpKTtcbn1cblxud2luZG93Lk9OUyA9IHdpbmRvdy5PTlMgfHwge307XG53aW5kb3cuT05TLnN0b3JhZ2UgPSB7XG4gIGdldEFkZHJlc3M6IGdldEFkZHJlc3MsXG4gIGFkZEhvdXNlaG9sZE1lbWJlcjogYWRkSG91c2Vob2xkTWVtYmVyLFxuICB1cGRhdGVIb3VzZWhvbGRNZW1iZXI6IHVwZGF0ZUhvdXNlaG9sZE1lbWJlcixcbiAgZGVsZXRlSG91c2Vob2xkTWVtYmVyOiBkZWxldGVIb3VzZWhvbGRNZW1iZXIsXG4gIGdldEFsbEhvdXNlaG9sZE1lbWJlcnM6IGdldEFsbEhvdXNlaG9sZE1lbWJlcnMsXG4gIGFkZFVzZXJQZXJzb246IGFkZFVzZXJQZXJzb24sXG4gIGdldFVzZXJQZXJzb246IGdldFVzZXJQZXJzb24sXG4gIGdldFVzZXJBc0hvdXNlaG9sZE1lbWJlcjogZ2V0VXNlckFzSG91c2Vob2xkTWVtYmVyLFxuICBnZXRIb3VzZWhvbGRNZW1iZXJCeVBlcnNvbklkOiBnZXRIb3VzZWhvbGRNZW1iZXJCeVBlcnNvbklkLFxuICBnZXRNZW1iZXJQZXJzb25JZDogZ2V0TWVtYmVyUGVyc29uSWQsXG4gIHVwZGF0ZVVzZXJBc0hvdXNlaG9sZE1lbWJlcjogdXBkYXRlVXNlckFzSG91c2Vob2xkTWVtYmVyLFxuICBkZWxldGVVc2VyQXNIb3VzZWhvbGRNZW1iZXI6IGRlbGV0ZVVzZXJBc0hvdXNlaG9sZE1lbWJlcixcblxuICBpc1Zpc2l0b3I6IGlzVmlzaXRvcixcbiAgaXNPdGhlckhvdXNlaG9sZE1lbWJlcjogaXNPdGhlckhvdXNlaG9sZE1lbWJlcixcbiAgaXNIb3VzZWhvbGRNZW1iZXI6IGlzSG91c2Vob2xkTWVtYmVyLFxuXG4gIGFkZFJlbGF0aW9uc2hpcDogYWRkUmVsYXRpb25zaGlwLFxuICBlZGl0UmVsYXRpb25zaGlwOiBlZGl0UmVsYXRpb25zaGlwLFxuICBnZXRBbGxSZWxhdGlvbnNoaXBzOiBnZXRBbGxSZWxhdGlvbnNoaXBzLFxuICBnZXRBbGxNYW51YWxSZWxhdGlvbnNoaXBzOiBnZXRBbGxNYW51YWxSZWxhdGlvbnNoaXBzLFxuICBkZWxldGVBbGxSZWxhdGlvbnNoaXBzRm9yTWVtYmVyOiBkZWxldGVBbGxSZWxhdGlvbnNoaXBzRm9yTWVtYmVyLFxuXG4gIGdldEFsbFBhcmVudHNPZjogZ2V0QWxsUGFyZW50c09mLFxuICBnZXRBbGxDaGlsZHJlbk9mOiBnZXRBbGxDaGlsZHJlbk9mLFxuICBnZXRQYXJlbnRJZEZyb21SZWxhdGlvbnNoaXA6IGdldFBhcmVudElkRnJvbVJlbGF0aW9uc2hpcCxcbiAgZ2V0Q2hpbGRJZEZyb21SZWxhdGlvbnNoaXA6IGdldENoaWxkSWRGcm9tUmVsYXRpb25zaGlwLFxuICBnZXRPdGhlclBlcnNvbklkRnJvbVJlbGF0aW9uc2hpcDogZ2V0T3RoZXJQZXJzb25JZEZyb21SZWxhdGlvbnNoaXAsXG4gIGlzQVBhcmVudEluUmVsYXRpb25zaGlwOiBpc0FQYXJlbnRJblJlbGF0aW9uc2hpcCxcbiAgaXNBQ2hpbGRJblJlbGF0aW9uc2hpcDogaXNBQ2hpbGRJblJlbGF0aW9uc2hpcCxcbiAgaXNJblJlbGF0aW9uc2hpcDogaXNJblJlbGF0aW9uc2hpcCxcbiAgYXJlQW55Q2hpbGRyZW5JblJlbGF0aW9uc2hpcE5vdFBhcmVudDogYXJlQW55Q2hpbGRyZW5JblJlbGF0aW9uc2hpcE5vdFBhcmVudCxcbiAgaXNSZWxhdGlvbnNoaXBUeXBlOiBpc1JlbGF0aW9uc2hpcFR5cGUsXG4gIGdldFJlbGF0aW9uc2hpcE9mOiBnZXRSZWxhdGlvbnNoaXBPZixcblxuICByZWxhdGlvbnNoaXBEZXNjcmlwdGlvbk1hcDogcmVsYXRpb25zaGlwRGVzY3JpcHRpb25NYXAsXG4gIHJlbGF0aW9uc2hpcFN1bW1hcnlUZW1wbGF0ZXM6IHJlbGF0aW9uc2hpcFN1bW1hcnlUZW1wbGF0ZXMsXG4gIG1pc3NpbmdSZWxhdGlvbnNoaXBJbmZlcmVuY2U6IG1pc3NpbmdSZWxhdGlvbnNoaXBJbmZlcmVuY2UsXG4gIGluZmVyUmVsYXRpb25zaGlwczogaW5mZXJSZWxhdGlvbnNoaXBzLFxuICBnZXRSZWxhdGlvbnNoaXBzV2l0aFBlcnNvbklkczogZ2V0UmVsYXRpb25zaGlwc1dpdGhQZXJzb25JZHMsXG4gIGdldFBlb3BsZUlkc01pc3NpbmdSZWxhdGlvbnNoaXBzV2l0aFBlcnNvbjogZ2V0UGVvcGxlSWRzTWlzc2luZ1JlbGF0aW9uc2hpcHNXaXRoUGVyc29uLFxuICBnZXRSZWxhdGlvbnNoaXBUeXBlOiBnZXRSZWxhdGlvbnNoaXBUeXBlLFxuICBmaW5kTmV4dE1pc3NpbmdSZWxhdGlvbnNoaXA6IGZpbmROZXh0TWlzc2luZ1JlbGF0aW9uc2hpcCxcblxuICBLRVlTOiB7XG4gICAgSE9VU0VIT0xEX01FTUJFUlNfU1RPUkFHRV9LRVk6IEhPVVNFSE9MRF9NRU1CRVJTX1NUT1JBR0VfS0VZLFxuICAgIFVTRVJfU1RPUkFHRV9LRVk6IFVTRVJfU1RPUkFHRV9LRVksXG4gICAgSE9VU0VIT0xEX01FTUJFUl9UWVBFOiBIT1VTRUhPTERfTUVNQkVSX1RZUEUsXG4gICAgVklTSVRPUl9UWVBFOiBWSVNJVE9SX1RZUEVcbiAgfSxcblxuICBJRFM6IHtcbiAgICBVU0VSX0hPVVNFSE9MRF9NRU1CRVJfSUQ6IFVTRVJfSE9VU0VIT0xEX01FTUJFUl9JRFxuICB9LFxuXG4gIFRZUEVTOiB7XG4gICAgcGVyc29uOiBwZXJzb24sXG4gICAgcmVsYXRpb25zaGlwOiByZWxhdGlvbnNoaXBcbiAgfVxufTtcblxud2luZG93Lk9OUy5oZWxwZXJzID0ge1xuICBwb3B1bGF0ZUhvdXNlaG9sZExpc3Q6IHBvcHVsYXRlSG91c2Vob2xkTGlzdCxcbiAgcG9wdWxhdGVWaXNpdG9yTGlzdDogcG9wdWxhdGVWaXNpdG9yTGlzdFxufTtcblxud2luZG93Lk9OUy51dGlscyA9IHtcbiAgcmVtb3ZlRnJvbUxpc3Q6IHJlbW92ZUZyb21MaXN0XG59O1xuXG4kKHBvcHVsYXRlSG91c2Vob2xkTGlzdCk7XG4kKHBvcHVsYXRlVmlzaXRvckxpc3QpO1xuJCh1cGRhdGVIb3VzZWhvbGRWaXNpdG9yc05hdmlnYXRpb25JdGVtcyk7XG4kKHVwZGF0ZUFkZHJlc3Nlcyk7XG5cbmV4cG9ydHMuVVNFUl9TVE9SQUdFX0tFWSA9IFVTRVJfU1RPUkFHRV9LRVk7XG5leHBvcnRzLmdldEFkZHJlc3MgPSBnZXRBZGRyZXNzO1xuZXhwb3J0cy5hZGRVc2VyUGVyc29uID0gYWRkVXNlclBlcnNvbjtcbmV4cG9ydHMuZ2V0VXNlclBlcnNvbiA9IGdldFVzZXJQZXJzb247XG4iXX0=
