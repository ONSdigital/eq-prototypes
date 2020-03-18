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

var defineProperty = function (obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
};

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

  /**
   * User is always first in the household list
   */
  people[id === USER_HOUSEHOLD_MEMBER_ID ? 'unshift' : 'push'](_extends({}, memberData, {
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
  'three-more': 'People who usually live outside the UK who are staying in the UK for 3 months or more',
  'perm-away': 'People who work away from home within the UK, if this is' + ' their permanent or family home',
  'armed-forces': 'Members of the armed forces, if this is their permanent or' + ' family home',
  'less-twelve': 'People who are temporarily outside the UK for less than 12' + ' months',
  'usually-temp': 'People staying temporarily who usually live in the UK but' + ' do not have another UK address, for example, relatives, friends',
  'other': 'Other people who usually live here, including anyone temporarily' + ' away from home'
};

var visitorQuestionSentenceMap = {
  'usually-in-uk': 'People who usually live somewhere else in the UK, for example boy/girlfriends, friends or relatives',
  'second-address': 'People staying here because it is their second address, for example, for work. Their permanent or family home is elsewhere',
  'less-three': 'People who usually live outside the UK who are staying in the UK for less than three months',
  'on-holiday': 'People here on holiday'
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
    sentanceLabel: 'legally registered civil partner',
    summaryAdjective: 'legally registered civil partner',
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
  var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  if (peopleArr.length < 1) {
    console.log(peopleArr, 'not enough people to create a list string');
    return;
  }

  if (peopleArr.length === 1) {
    return nameElement(peopleArr[0].fullName + formatPersonIfYou(peopleArr[0]));
  }

  var peopleCopy = [].concat(toConsumableArray(peopleArr)),
      lastPerson = peopleCopy.pop();

  return peopleCopy.map(function (person$$1) {
    return '' + nameElement(person$$1.fullName + (opts.isFamily ? trailingNameS(person$$1.fullName) : '') + formatPersonIfYou(person$$1));
  }).join(', ') + ' and ' + nameElement(lastPerson.fullName + (opts.isFamily ? trailingNameS(lastPerson.fullName) : '') + formatPersonIfYou(lastPerson));
}

function formatPersonIfYou(person$$1) {
  return person$$1.id === USER_HOUSEHOLD_MEMBER_ID ? ' (You)' : '';
}

var relationshipSummaryTemplates = {
  'partnership': function partnership(person1, person2, description) {
    return nameElement(person1.fullName + formatPersonIfYou(person1)) + ' is ' + nameElement(person2.fullName + trailingNameS(person2.fullName) + formatPersonIfYou(person2)) + ' ' + description;
  },
  'twoFamilyMembersToMany': function twoFamilyMembersToMany(parent1, parent2, childrenArr, description) {
    return nameElement(parent1.fullName + formatPersonIfYou(parent1)) + ' and ' + nameElement(parent2.fullName + formatPersonIfYou(parent2)) + ' are ' + personListStr(childrenArr, { isFamily: true }) + ' ' + description;
  },
  'oneFamilyMemberToMany': function oneFamilyMemberToMany(parent, childrenArr, description) {
    console.log(parent, childrenArr, description);
    return nameElement(parent.fullName + formatPersonIfYou(parent)) + ' is ' + personListStr(childrenArr, { isFamily: true }) + ' ' + description;
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
    inferred: !!opts.inferred,
    inferredBy: opts.inferredBy
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

function deleteRelationship(relationshipObj) {
  var householdRelationships = (getAllRelationships() || []).filter(function (relationship) {
    return relationship.id !== relationshipObj.id;
  });

  sessionStorage.setItem(RELATIONSHIPS_STORAGE_KEY, JSON.stringify(householdRelationships));
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

function isRelationshipInferred(relationship) {
  return relationship.inferred;
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
          missingRelationships.push(relationship('brother-sister', personId, memberPersonId, {
            inferred: true,
            inferredBy: [
            /**
             * Must be 4 relationships
             * Could have used member's parents but we can assume they
             * must be the same at this point or the inferrence
             * couldn't happen.
             */
            getRelationshipOf(personId, parents[0].id).id, getRelationshipOf(personId, parents[1].id).id, getRelationshipOf(memberPersonId, parents[0].id).id, getRelationshipOf(memberPersonId, parents[1].id).id]
          }));
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

var PERSONAL_DETAILS_KEY = 'individual-details';
var PERSONAL_PINS_KEY = 'individual-pins';

var personalDetailsMaritalStatusMap = {
  'never': {
    description: 'Never married and never registered a same-sex civil' + ' partnership'
  },
  'married': {
    description: 'Married'
  },
  'registered': {
    description: 'In a registered same-sex civil partnership'
  },
  'separated-married': {
    description: 'Separated, but still legally married'
  },
  'divorced': {
    description: 'Divorced'
  },
  'former-partnership': {
    description: 'Formerly in a same-sex civil partnership which is now' + ' legally dissolved'
  },
  'widowed': {
    description: 'Widowed'
  },
  'surviving-partner': {
    description: 'Surviving partner from a same-sex civil partnership'
  },
  'separated-partnership': {
    description: 'Separated, but still legally in a same-sex civil partnership'
  }
};

var personalDetailsCountryMap = {
  'england': {
    description: 'England'
  },
  'wales': {
    description: 'Wales'
  },
  'scotland': {
    description: 'Scotland'
  },
  'northern-ireland': {
    description: 'Northern Ireland'
  },
  'republic-ireland': {
    description: 'Republic of Ireland'
  },
  'elsewhere': {
    description: 'Elsewhere'
  }
};

var personalDetailsOrientationMap = {
  'straight': {
    description: 'Straight or Heterosexual'
  },
  'gay': {
    description: 'Gay or Lesbian'
  },
  'bisexual': {
    description: 'Bisexual'
  },
  'other': {
    description: 'Other'
  },
  'no-say': {
    description: 'Prefer not to say'
  }
};

function addUpdatePersonalDetailsDOB(personId, day, month, year) {
  var allDetails = getAllPersonalDetails(),
      details = allDetails[personId] || {};

  details['dob'] = {
    day: day,
    month: month,
    year: year
  };

  updatePersonalDetails(personId, details);

  return details;
}

function addUpdateMaritalStatus(personId, val) {
  var allDetails = getAllPersonalDetails(),
      details = allDetails[personId] || {};

  details['maritalStatus'] = val;

  updatePersonalDetails(personId, details);

  return details;
}

function addUpdateCountry(personId, val) {
  var allDetails = getAllPersonalDetails(),
      details = allDetails[personId] || {};

  details['country'] = val;

  updatePersonalDetails(personId, details);

  return details;
}

function addUpdateOrientation(personId, val) {
  var allDetails = getAllPersonalDetails(),
      details = allDetails[personId] || {};

  details['orientation'] = val;

  updatePersonalDetails(personId, details);

  return details;
}

function addUpdateSalary(personId, val) {
  var allDetails = getAllPersonalDetails(),
      details = allDetails[personId] || {};

  details['salary'] = val;

  updatePersonalDetails(personId, details);

  return details;
}

function getPins() {
  return JSON.parse(sessionStorage.getItem(PERSONAL_PINS_KEY)) || {};
}

function createPinFor(personId) {
  var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var pins = getPins();

  pins[personId] = {
    pin: _.random(10000, 99999),
    exported: !!opts.exported
  };

  sessionStorage.setItem(PERSONAL_PINS_KEY, JSON.stringify(pins));

  return pins[personId];
}

function getPinFor(personId) {
  return getPins()[personId];
}

function unsetPinFor(personId) {
  var pins = getPins();

  delete pins[personId];

  sessionStorage.setItem(PERSONAL_PINS_KEY, JSON.stringify(pins));
}

function updatePersonalDetails(personId, details) {
  sessionStorage.setItem(PERSONAL_DETAILS_KEY, JSON.stringify(_extends({}, getAllPersonalDetails(), defineProperty({}, personId, details))));

  return details;
}

function getAllPersonalDetails() {
  return JSON.parse(sessionStorage.getItem(PERSONAL_DETAILS_KEY)) || {};
}

function getPersonalDetailsFor(personId) {
  var storageObj = JSON.parse(sessionStorage.getItem(PERSONAL_DETAILS_KEY)) || {},
      personObj = storageObj[personId];

  if (!personObj) {
    console.log('Personal details for ' + personId + ' not found');
  }

  return personObj;
}

/**
 * Copied from:
 * https://codereview.stackexchange.com/questions/90349/changing-number-to-words-in-javascript
 * ===============
 */
var ONE_TO_NINETEEN = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];

var TENS = ['ten', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

var SCALES = ['thousand', 'million', 'billion', 'trillion'];

// helper function for use with Array.filter
function isTruthy(item) {
  return !!item;
}

// convert a number into 'chunks' of 0-999
function chunk(number) {
  var thousands = [];

  while (number > 0) {
    thousands.push(number % 1000);
    number = Math.floor(number / 1000);
  }

  return thousands;
}

// translate a number from 1-999 into English
function inEnglish(number) {
  var thousands,
      hundreds,
      tens,
      ones,
      words = [];

  if (number < 20) {
    return ONE_TO_NINETEEN[number - 1]; // may be undefined
  }

  if (number < 100) {
    ones = number % 10;
    tens = number / 10 | 0; // equivalent to Math.floor(number / 10)

    words.push(TENS[tens - 1]);
    words.push(inEnglish(ones));

    return words.filter(isTruthy).join('-');
  }

  hundreds = number / 100 | 0;
  words.push(inEnglish(hundreds));
  words.push('hundred');
  words.push(inEnglish(number % 100));

  return words.filter(isTruthy).join(' ');
}

// append the word for a scale. Made for use with Array.map
function appendScale(chunk, exp) {
  var scale;
  if (!chunk) {
    return null;
  }
  scale = SCALES[exp - 1];
  return [chunk, scale].filter(isTruthy).join(' ');
}

/**
 * ===============
 * End copy
 */

/**
 * Modification - decorator
 */
var NUMBER_TO_POSITION_TEXT_MAP = {
  'one': 'first',
  'two': 'second',
  'three': 'third',
  'four': 'fourth',
  'five': 'fifth',
  'six': 'sixth',
  'seven': 'seventh',
  'eight': 'eighth',
  'nine': 'ninth',
  'ten': 'tenth',
  'eleven': 'eleventh',
  'twelve': 'twelfth',
  'thirteen': 'thirteenth',
  'fourteen': 'fourteenth',
  'fifteen': 'fifteenth',
  'sixteen': 'sixteenth',
  'seventeen': 'seventeenth',
  'eighteen': 'eighteenth',
  'nineteen': 'nineteenth',

  'twenty': 'twentieth',
  'thirty': 'thirtieth',
  'forty': 'fortieth',
  'fifty': 'fiftieth',
  'sixty': 'sixtieth',
  'seventy': 'seventieth',
  'eighty': 'eightieth',
  'ninety': 'ninetieth',
  'hundred': 'hundredth',

  'thousand': 'thousandth',
  'million': 'millionth',
  'billion': 'billionth',
  'trillion': 'trillionth'
};

function numberToPositionWord(num) {
  var str = chunk(num).map(inEnglish).map(appendScale).filter(isTruthy).reverse().join(' ');

  var sub = str.split(' '),
      lastWordDashSplitArr = sub[sub.length - 1].split('-'),
      lastWord = lastWordDashSplitArr[lastWordDashSplitArr.length - 1],
      newLastWord = (lastWordDashSplitArr.length > 1 ? lastWordDashSplitArr[0] + '-' : '') + NUMBER_TO_POSITION_TEXT_MAP[lastWord];

  /*console.log('str:', str);
  console.log('sub:', sub);
  console.log('lastWordDashSplitArr:', lastWordDashSplitArr);
  console.log('lastWord:', lastWord);
  console.log('newLastWord:', newLastWord);*/

  var subCopy = [].concat(sub);
  subCopy.pop();
  var prefix = subCopy.join(' ');
  var result = (prefix ? prefix + ' ' : '') + newLastWord;

  // console.log('result', (prefix ? prefix + ' ' : '') + newLastWord);
  return result;
}

function numberToWordsStyleguide(number) {
  if (number > 9) {
    return number;
  }

  return ONE_TO_NINETEEN[number - 1];
}

function tools() {

  var $listLinks = $('.test-data-links'),
      $clearData = $('<li><a href="#" class=\'mock-data-family\'>' + 'Clear all data</a></li>'),
      $createFamilyHousehold = $('<li><a href="#" class=\'mock-data-family\'>' + 'Create family household</a></li>'),
      $createFamilyRelationships = $('<li><a href="#"' + ' class=\'mock-data-family\'>' + 'Create family with relationships</a></li>'),
      $createFamilyWithRelationshipsAndVisitors = $('<li><a href="#"' + ' class=\'mock-data-family\'>' + 'Create family with relationships and visitors</a></li>'),
      $createFamilyWithRelationshipsPersonalDetailsAndVisitors = $('<li><a' + ' href="#"' + ' class=\'mock-data-family\'>' + 'Create family with relationships, just family individual responses and' + ' visitors</a></li>'),
      $createFamilyWithRelationshipsPersonalDetailsAndVisitorsPersonalDetails = $('<li><a' + ' href="#"' + ' class=\'mock-data-family\'>' + 'Create family with relationships, family individual responses and' + ' visitors individual responses</a></li>'),
      familyHouseholdMembersData = [{
    'type': 'household-member',
    '@person': {
      'fullName': 'Dave  Jones',
      'firstName': 'Dave',
      'middleName': '',
      'lastName': 'Jones',
      'id': 'person_me'
    }
  }, {
    'type': 'household-member',
    '@person': {
      'fullName': 'Sally  Jones',
      'firstName': 'Sally',
      'middleName': '',
      'lastName': 'Jones',
      'id': 'person1'
    }
  }, {
    'type': 'household-member',
    '@person': {
      'fullName': 'Rebecca  Jones',
      'firstName': 'Rebecca',
      'middleName': '',
      'lastName': 'Jones',
      'id': 'person2'
    }
  }, {
    'type': 'household-member',
    '@person': {
      'fullName': 'Amy Jones',
      'firstName': 'Amy',
      'middleName': '',
      'lastName': 'Jones',
      'id': 'person3'
    }
  }],
      visitorsMemberData = [{
    'type': 'visitor',
    '@person': {
      'fullName': 'Gareth Johnson',
      'firstName': 'Gareth',
      'middleName': '',
      'lastName': 'Johnson',
      'id': 'person4'
    }
  }, {
    'type': 'visitor',
    '@person': {
      'fullName': 'John Hamilton',
      'firstName': 'John',
      'middleName': '',
      'lastName': 'Hamilton',
      'id': 'person5'
    }
  }],
      familyHouseholdRelationshipsData = [{
    'personIsDescription': 'husband-wife',
    'personIsId': 'person1',
    'personToId': 'person_me',
    'inferred': false,
    'id': 1
  }, {
    'personIsDescription': 'son-daughter',
    'personIsId': 'person2',
    'personToId': 'person_me',
    'inferred': false,
    'id': 2
  }, {
    'personIsDescription': 'mother-father',
    'personIsId': 'person_me',
    'personToId': 'person3',
    'inferred': false,
    'id': 3
  }, {
    'personIsDescription': 'son-daughter',
    'personIsId': 'person2',
    'personToId': 'person1',
    'inferred': false,
    'id': 4
  }, {
    'personIsDescription': 'mother-father',
    'personIsId': 'person1',
    'personToId': 'person3',
    'inferred': false,
    'id': 5
  }, {
    'personIsDescription': 'brother-sister',
    'personIsId': 'person3',
    'personToId': 'person2',
    'inferred': true,
    'inferredBy': [3, 5, 2, 4],
    'id': 6
  }],
      familyPersonalDetails = {
    'person_me': {
      'dob': {
        'day': '17',
        'month': '4',
        'year': '1967'
      },
      'maritalStatus': 'married',
      'country': 'wales',
      'orientation': 'straight',
      'salary': '40000'
    },
    'person1': {
      'dob': { 'day': '02', 'month': '10', 'year': '1965' },
      'maritalStatus': 'married',
      'country': 'wales',
      'orientation': 'straight',
      'salary': '40000'
    },
    'person2': {
      'dob': { 'day': '20', 'month': '5', 'year': '1981' },
      'maritalStatus': 'never',
      'country': 'wales',
      'orientation': 'straight',
      'salary': '20000'
    },
    'person3': {
      'dob': { 'day': '11', 'month': '7', 'year': '1984' },
      'maritalStatus': 'never',
      'country': 'wales',
      'orientation': 'straight',
      'salary': '20000'
    }
  },
      visitorsPersonalDetails = {
    'person4': {
      'sex': 'male',
      'dob': { 'day': '20', 'month': '7', 'year': '1990' },
      'address-where': 'in-uk',
      'address': {
        'address-line-1': '15',
        'address-line-2': 'Somewhere near',
        'town-city': 'Llandridnod',
        'county': 'Powys',
        'postcode': 'LL34 AN5'
      }
    },
    'person5': {
      'sex': 'male',
      'dob': { 'day': '02', 'month': '5', 'year': '1991' },
      'address-where': 'out-uk',
      'address': {
        'address-line-1': '94',
        'address-line-2': 'Somewhere Far',
        'town-city': 'Springfield',
        'county': 'New York',
        'postcode': 'NY10A'
      }
    }
  },
      userData = {
    'fullName': 'Dave  Jones',
    'firstName': 'Dave',
    'middleName': '',
    'lastName': 'Jones'
  };

  $createFamilyHousehold.on('click', function (e) {
    e.preventDefault();
    clearStorage();
    prerequisites();
    createFamilyHousehold();
    window.location.href = '../summary';
  });

  $createFamilyRelationships.on('click', function (e) {
    e.preventDefault();
    clearStorage();
    prerequisites();
    createFamilyHousehold();
    createFamilyRelationships();
    window.location.href = '../hub';
  });

  $createFamilyWithRelationshipsAndVisitors.on('click', function (e) {
    e.preventDefault();
    clearStorage();
    prerequisites();
    createFamilyHouseholdWithVisitors();
    createFamilyRelationships();
    window.location.href = '../hub';
  });

  $createFamilyWithRelationshipsPersonalDetailsAndVisitors.on('click', function (e) {
    e.preventDefault();
    clearStorage();
    prerequisites();
    createFamilyHouseholdWithVisitors();
    createFamilyRelationships();
    createFamilyPersonalDetails();
    window.location.href = '../hub';
  });

  $createFamilyWithRelationshipsPersonalDetailsAndVisitorsPersonalDetails.on('click', function (e) {
    e.preventDefault();
    clearStorage();
    prerequisites();
    createFamilyHouseholdWithVisitors();
    createFamilyRelationships();
    createFamilyVisitorsPersonalDetails();
    window.location.href = '../hub';
  });

  $clearData.on('click', function (e) {
    e.preventDefault();
    clearStorage();
    window.location.href = '../test-address';
  });

  function prerequisites() {
    sessionStorage.setItem('address', '12 Somewhere Close, Newport, CF12 3AB');
    sessionStorage.setItem('address-line-1', '12');
    sessionStorage.setItem('address-line-2', 'Somewhere close');
    sessionStorage.setItem('county', 'Newport');
    sessionStorage.setItem('lives-here', 'yes');
    sessionStorage.setItem('postcode', 'CF12 3AB');
    sessionStorage.setItem('town-city', 'Newport');
  }

  function createFamilyHousehold() {
    sessionStorage.setItem('user-details', JSON.stringify(userData));
    sessionStorage.setItem(window.ONS.storage.KEYS.HOUSEHOLD_MEMBERS_STORAGE_KEY, JSON.stringify(familyHouseholdMembersData));
    sessionStorage.setItem('household-members-increment', JSON.stringify(4));
  }

  function createFamilyHouseholdWithVisitors() {
    sessionStorage.setItem(window.ONS.storage.KEYS.HOUSEHOLD_MEMBERS_STORAGE_KEY, JSON.stringify([].concat(familyHouseholdMembersData, visitorsMemberData)));
  }

  function createFamilyRelationships() {
    sessionStorage.setItem(window.ONS.storage.KEYS.RELATIONSHIPS_STORAGE_KEY, JSON.stringify(familyHouseholdRelationshipsData));
    sessionStorage.setItem('relationships-increment', JSON.stringify(6));
  }

  function createFamilyPersonalDetails() {
    sessionStorage.setItem(window.ONS.storage.KEYS.PERSONAL_DETAILS_KEY, JSON.stringify(familyPersonalDetails));
  }

  function createFamilyVisitorsPersonalDetails() {
    sessionStorage.setItem(window.ONS.storage.KEYS.PERSONAL_DETAILS_KEY, JSON.stringify(_extends({}, familyPersonalDetails, visitorsPersonalDetails)));
  }

  function clearStorage() {
    sessionStorage.clear();
  }

  $listLinks.append($createFamilyHousehold);
  $listLinks.append($createFamilyRelationships);
  $listLinks.append($createFamilyWithRelationshipsAndVisitors);
  $listLinks.append($createFamilyWithRelationshipsPersonalDetailsAndVisitors);
  $listLinks.append($createFamilyWithRelationshipsPersonalDetailsAndVisitorsPersonalDetails);
  $listLinks.append($clearData);
}

var USER_STORAGE_KEY = 'user-details';
var INDIVIDUAL_PROXY_STORAGE_KEY = 'proxy-person';

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
  return $('<li class="list__item">').addClass('mars').html('<span class="list__item-name">' + member['@person'].fullName + (member['@person'].id === USER_HOUSEHOLD_MEMBER_ID ? ' (You)' : '') + '</span>');
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

  $('.address-text-line1').html(addressLine1);

  var personId = new URLSearchParams(window.location.search).get('person'),
      person$$1 = void 0;

  if (personId) {
    person$$1 = getHouseholdMemberByPersonId(personId)['@person'];
    $('#section-individual').html(person$$1.fullName);

    $('.js-person-fullname-from-url-id').html(person$$1.fullName);
  }
}

var secureLinkTextMap = {
  'question-you': {
    description: 'Want to keep your answers secure from other people at this' + ' address?',
    linkText: 'Get a separate access code to submit an individual response',
    link: '../individual-decision-secure'
  },
  'pin-you': {
    description: 'You\'ve chosen to keep your answers secure',
    linkText: 'Cancel this and make answers available to the rest of the' + ' household',
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
  var personId = new URLSearchParams(window.location.search).get('person');

  if (personId) {
    var urlParam = new URLSearchParams(window.location.search),
        _person = getHouseholdMemberByPersonId(personId)['@person'],
        pinObj = getPinFor(personId),
        secureLinkTextConfig = secureLinkTextMap[getAnsweringIndividualByProxy() ? 'question-proxy' : pinObj && pinObj.pin ? 'pin-you' : 'question-you'],
        linkHref = secureLinkTextConfig.link + '?person=' + personId + '&returnurl=' + window.location.pathname,
        surveyType = urlParam.get('survey');

    linkHref += surveyType ? '&survey=' + surveyType : '';

    var $secureLink = $('.js-link-secure');
    $secureLink.attr('href', linkHref);

    $secureLink.html(secureLinkTextConfig.linkText);
    $('.js-link-secure-label').html(secureLinkTextConfig.description.replace('$[NAME]', _person.fullName));

    var personLink = $('.js-link-person');
    personLink.attr('href', personLink.attr('href') + '?person=' + personId + (surveyType ? '&survey=' + surveyType : ''));
  }
}

function updateBySurveyType() {
  var urlParams = new URLSearchParams(window.location.search),
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

var surveyTypeConfig = {
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
  return '11 November 2018';
}

function updateSignificantDate() {
  $('.js-significant-date').html(getSignificant());
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
  visitorQuestionSentenceMap: visitorQuestionSentenceMap,

  isVisitor: isVisitor,
  isOtherHouseholdMember: isOtherHouseholdMember,
  isHouseholdMember: isHouseholdMember,

  addRelationship: addRelationship,
  deleteRelationship: deleteRelationship,
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
  isRelationshipInferred: isRelationshipInferred,
  getRelationshipOf: getRelationshipOf,

  relationshipDescriptionMap: relationshipDescriptionMap,
  relationshipSummaryTemplates: relationshipSummaryTemplates,
  missingRelationshipInference: missingRelationshipInference,
  inferRelationships: inferRelationships,
  getRelationshipsWithPersonIds: getRelationshipsWithPersonIds,
  getPeopleIdsMissingRelationshipsWithPerson: getPeopleIdsMissingRelationshipsWithPerson,
  getRelationshipType: getRelationshipType,
  findNextMissingRelationship: findNextMissingRelationship,

  addUpdatePersonalDetailsDOB: addUpdatePersonalDetailsDOB,
  getPersonalDetailsFor: getPersonalDetailsFor,
  addUpdateMaritalStatus: addUpdateMaritalStatus,
  addUpdateCountry: addUpdateCountry,
  addUpdateOrientation: addUpdateOrientation,
  addUpdateSalary: addUpdateSalary,

  personalDetailsMaritalStatusMap: personalDetailsMaritalStatusMap,
  personalDetailsCountryMap: personalDetailsCountryMap,
  personalDetailsOrientationMap: personalDetailsOrientationMap,

  createPinFor: createPinFor,
  getPinFor: getPinFor,
  unsetPinFor: unsetPinFor,

  setAnsweringIndividualByProxy: setAnsweringIndividualByProxy,
  getAnsweringIndividualByProxy: getAnsweringIndividualByProxy,

  doILiveHere: doILiveHere,

  KEYS: {
    HOUSEHOLD_MEMBERS_STORAGE_KEY: HOUSEHOLD_MEMBERS_STORAGE_KEY,
    USER_STORAGE_KEY: USER_STORAGE_KEY,
    INDIVIDUAL_PROXY_STORAGE_KEY: INDIVIDUAL_PROXY_STORAGE_KEY,
    HOUSEHOLD_MEMBER_TYPE: HOUSEHOLD_MEMBER_TYPE,
    VISITOR_TYPE: VISITOR_TYPE,
    RELATIONSHIPS_STORAGE_KEY: RELATIONSHIPS_STORAGE_KEY,
    PERSONAL_DETAILS_KEY: PERSONAL_DETAILS_KEY
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
  trailingNameS: trailingNameS,
  numberToPositionWord: numberToPositionWord,
  numberToWordsStyleguide: numberToWordsStyleguide,
  getSignificant: getSignificant
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

exports.USER_STORAGE_KEY = USER_STORAGE_KEY;
exports.INDIVIDUAL_PROXY_STORAGE_KEY = INDIVIDUAL_PROXY_STORAGE_KEY;
exports.getAddress = getAddress;
exports.addUserPerson = addUserPerson;
exports.getUserPerson = getUserPerson;

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJfcHJvdG90eXBlcy95b3VyLWhvdXNlaG9sZC12OS9idW5kbGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuXG5mdW5jdGlvbiBhdXRvSW5jcmVtZW50SWQoY29sbGVjdGlvbikge1xuICB2YXIgayA9IGNvbGxlY3Rpb24gKyAnLWluY3JlbWVudCcsXG4gICAgICBpZCA9IHBhcnNlSW50KHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oaykpIHx8IDA7XG5cbiAgaWQrKztcblxuICBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKGssIEpTT04uc3RyaW5naWZ5KGlkKSk7XG5cbiAgcmV0dXJuIGlkO1xufVxuXG5mdW5jdGlvbiByZW1vdmVGcm9tTGlzdChsaXN0LCB2YWwpIHtcblxuICBmdW5jdGlvbiBkb1JlbW92ZShpdGVtKSB7XG4gICAgdmFyIGZvdW5kSWQgPSBsaXN0LmluZGV4T2YoaXRlbSk7XG5cbiAgICAvKipcbiAgICAgKiBHdWFyZFxuICAgICAqL1xuICAgIGlmIChmb3VuZElkID09PSAtMSkge1xuICAgICAgY29uc29sZS5sb2coJ0F0dGVtcHQgdG8gcmVtb3ZlIGZyb20gbGlzdCBmYWlsZWQ6ICcsIGxpc3QsIHZhbCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgbGlzdC5zcGxpY2UoZm91bmRJZCwgMSk7XG4gIH1cblxuICBpZiAoXy5pc0FycmF5KHZhbCkpIHtcbiAgICAkLmVhY2godmFsLCBmdW5jdGlvbiAoaSwgaXRlbSkge1xuICAgICAgZG9SZW1vdmUoaXRlbSk7XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgZG9SZW1vdmUodmFsKTtcbiAgfVxufVxuXG5mdW5jdGlvbiB0cmFpbGluZ05hbWVTKG5hbWUpIHtcbiAgcmV0dXJuIG5hbWVbbmFtZS5sZW5ndGggLSAxXSA9PT0gJ3MnID8gJ1xcJiN4MjAxOTsnIDogJ1xcJiN4MjAxOTtzJztcbn1cblxudmFyIGRlZmluZVByb3BlcnR5ID0gZnVuY3Rpb24gKG9iaiwga2V5LCB2YWx1ZSkge1xuICBpZiAoa2V5IGluIG9iaikge1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwge1xuICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgIHdyaXRhYmxlOiB0cnVlXG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgb2JqW2tleV0gPSB2YWx1ZTtcbiAgfVxuXG4gIHJldHVybiBvYmo7XG59O1xuXG52YXIgX2V4dGVuZHMgPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uICh0YXJnZXQpIHtcbiAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldO1xuXG4gICAgZm9yICh2YXIga2V5IGluIHNvdXJjZSkge1xuICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzb3VyY2UsIGtleSkpIHtcbiAgICAgICAgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gdGFyZ2V0O1xufTtcblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG52YXIgdG9Db25zdW1hYmxlQXJyYXkgPSBmdW5jdGlvbiAoYXJyKSB7XG4gIGlmIChBcnJheS5pc0FycmF5KGFycikpIHtcbiAgICBmb3IgKHZhciBpID0gMCwgYXJyMiA9IEFycmF5KGFyci5sZW5ndGgpOyBpIDwgYXJyLmxlbmd0aDsgaSsrKSBhcnIyW2ldID0gYXJyW2ldO1xuXG4gICAgcmV0dXJuIGFycjI7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIEFycmF5LmZyb20oYXJyKTtcbiAgfVxufTtcblxudmFyIEhPVVNFSE9MRF9NRU1CRVJTX1NUT1JBR0VfS0VZID0gJ2hvdXNlaG9sZC1tZW1iZXJzJztcbnZhciBVU0VSX0hPVVNFSE9MRF9NRU1CRVJfSUQgPSAncGVyc29uX21lJztcbnZhciBIT1VTRUhPTERfTUVNQkVSX1RZUEUgPSAnaG91c2Vob2xkLW1lbWJlcic7XG52YXIgVklTSVRPUl9UWVBFID0gJ3Zpc2l0b3InO1xuXG4vKipcbiAqIFR5cGVzXG4gKi9cbmZ1bmN0aW9uIHBlcnNvbihvcHRzKSB7XG4gIGlmIChvcHRzLmZpcnN0TmFtZSA9PT0gJycgfHwgb3B0cy5sYXN0TmFtZSA9PT0gJycpIHtcbiAgICBjb25zb2xlLmxvZygnVW5hYmxlIHRvIGNyZWF0ZSBwZXJzb24gd2l0aCBkYXRhOiAnLCBvcHRzLmZpcnN0TmFtZSwgIW9wdHMubWlkZGxlTmFtZSwgIW9wdHMubGFzdE5hbWUpO1xuICB9XG5cbiAgdmFyIG1pZGRsZU5hbWUgPSBvcHRzLm1pZGRsZU5hbWUgfHwgJyc7XG5cbiAgcmV0dXJuIHtcbiAgICBmdWxsTmFtZTogb3B0cy5maXJzdE5hbWUgKyAnICcgKyBtaWRkbGVOYW1lICsgJyAnICsgb3B0cy5sYXN0TmFtZSxcbiAgICBmaXJzdE5hbWU6IG9wdHMuZmlyc3ROYW1lLFxuICAgIG1pZGRsZU5hbWU6IG1pZGRsZU5hbWUsXG4gICAgbGFzdE5hbWU6IG9wdHMubGFzdE5hbWVcbiAgfTtcbn1cblxuLyoqXG4gKiBTdG9yYWdlXG4gKi9cbmZ1bmN0aW9uIGdldFVzZXJBc0hvdXNlaG9sZE1lbWJlcigpIHtcbiAgcmV0dXJuIGdldEFsbEhvdXNlaG9sZE1lbWJlcnMoKS5maW5kKGZ1bmN0aW9uIChtZW1iZXIpIHtcbiAgICByZXR1cm4gbWVtYmVyWydAcGVyc29uJ10uaWQgPT09IFVTRVJfSE9VU0VIT0xEX01FTUJFUl9JRDtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGRlbGV0ZVVzZXJBc0hvdXNlaG9sZE1lbWJlcigpIHtcbiAgZGVsZXRlSG91c2Vob2xkTWVtYmVyKFVTRVJfSE9VU0VIT0xEX01FTUJFUl9JRCk7XG59XG5cbmZ1bmN0aW9uIGRlbGV0ZUhvdXNlaG9sZE1lbWJlcihwZXJzb25JZCkge1xuICB2YXIgbWVtYmVycyA9IGdldEFsbEhvdXNlaG9sZE1lbWJlcnMoKS5maWx0ZXIoZnVuY3Rpb24gKG1lbWJlcikge1xuICAgIHJldHVybiBtZW1iZXJbJ0BwZXJzb24nXS5pZCAhPT0gcGVyc29uSWQ7XG4gIH0pO1xuXG4gIHNlc3Npb25TdG9yYWdlLnNldEl0ZW0oSE9VU0VIT0xEX01FTUJFUlNfU1RPUkFHRV9LRVksIEpTT04uc3RyaW5naWZ5KG1lbWJlcnMpKTtcbn1cblxuZnVuY3Rpb24gdXBkYXRlVXNlckFzSG91c2Vob2xkTWVtYmVyKHBlcnNvbiwgbWVtYmVyRGF0YSkge1xuICB2YXIgdXNlckFzSG91c2Vob2xkTWVtYmVyID0gZ2V0VXNlckFzSG91c2Vob2xkTWVtYmVyKCk7XG5cbiAgdXNlckFzSG91c2Vob2xkTWVtYmVyID8gdXBkYXRlSG91c2Vob2xkTWVtYmVyKHVzZXJBc0hvdXNlaG9sZE1lbWJlclsnQHBlcnNvbiddLCBtZW1iZXJEYXRhKSA6IGFkZEhvdXNlaG9sZE1lbWJlcihwZXJzb24sIG1lbWJlckRhdGEsIFVTRVJfSE9VU0VIT0xEX01FTUJFUl9JRCk7XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZUhvdXNlaG9sZE1lbWJlcihwZXJzb24sIG1lbWJlckRhdGEpIHtcbiAgdmFyIG1lbWJlcnNVcGRhdGVkID0gZ2V0QWxsSG91c2Vob2xkTWVtYmVycygpLm1hcChmdW5jdGlvbiAobWVtYmVyKSB7XG4gICAgcmV0dXJuIG1lbWJlclsnQHBlcnNvbiddLmlkID09PSBwZXJzb24uaWQgPyBfZXh0ZW5kcyh7fSwgbWVtYmVyLCBtZW1iZXJEYXRhLCB7ICdAcGVyc29uJzogX2V4dGVuZHMoe30sIG1lbWJlclsnQHBlcnNvbiddLCBwZXJzb24pIH0pIDogbWVtYmVyO1xuICB9KTtcblxuICBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKEhPVVNFSE9MRF9NRU1CRVJTX1NUT1JBR0VfS0VZLCBKU09OLnN0cmluZ2lmeShtZW1iZXJzVXBkYXRlZCkpO1xufVxuXG5mdW5jdGlvbiBhZGRIb3VzZWhvbGRNZW1iZXIocGVyc29uLCBtZW1iZXJEYXRhLCBpZCkge1xuICB2YXIgcGVvcGxlID0gZ2V0QWxsSG91c2Vob2xkTWVtYmVycygpIHx8IFtdO1xuICBtZW1iZXJEYXRhID0gbWVtYmVyRGF0YSB8fCB7fTtcblxuICAvKipcbiAgICogVXNlciBpcyBhbHdheXMgZmlyc3QgaW4gdGhlIGhvdXNlaG9sZCBsaXN0XG4gICAqL1xuICBwZW9wbGVbaWQgPT09IFVTRVJfSE9VU0VIT0xEX01FTUJFUl9JRCA/ICd1bnNoaWZ0JyA6ICdwdXNoJ10oX2V4dGVuZHMoe30sIG1lbWJlckRhdGEsIHtcbiAgICB0eXBlOiBtZW1iZXJEYXRhLnR5cGUgfHwgSE9VU0VIT0xEX01FTUJFUl9UWVBFLFxuICAgICdAcGVyc29uJzogX2V4dGVuZHMoe30sIHBlcnNvbiwge1xuICAgICAgaWQ6IGlkIHx8ICdwZXJzb24nICsgYXV0b0luY3JlbWVudElkKCdob3VzZWhvbGQtbWVtYmVycycpXG4gICAgfSlcbiAgfSkpO1xuXG4gIHNlc3Npb25TdG9yYWdlLnNldEl0ZW0oSE9VU0VIT0xEX01FTUJFUlNfU1RPUkFHRV9LRVksIEpTT04uc3RyaW5naWZ5KHBlb3BsZSkpO1xufVxuXG5mdW5jdGlvbiBnZXRBbGxIb3VzZWhvbGRNZW1iZXJzKCkge1xuICByZXR1cm4gSlNPTi5wYXJzZShzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKEhPVVNFSE9MRF9NRU1CRVJTX1NUT1JBR0VfS0VZKSkgfHwgW107XG59XG5cbmZ1bmN0aW9uIGdldEhvdXNlaG9sZE1lbWJlckJ5UGVyc29uSWQoaWQpIHtcbiAgcmV0dXJuIGdldEFsbEhvdXNlaG9sZE1lbWJlcnMoKS5maW5kKGZ1bmN0aW9uIChtZW1iZXIpIHtcbiAgICByZXR1cm4gbWVtYmVyWydAcGVyc29uJ10uaWQgPT09IGlkO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gZ2V0TWVtYmVyUGVyc29uSWQobWVtYmVyKSB7XG4gIHJldHVybiBtZW1iZXJbJ0BwZXJzb24nXS5pZDtcbn1cblxuLyoqXG4gKiBDb21wYXJhdG9yc1xuICovXG5mdW5jdGlvbiBpc1Zpc2l0b3IobWVtYmVyKSB7XG4gIHJldHVybiBtZW1iZXIudHlwZSA9PT0gd2luZG93Lk9OUy5zdG9yYWdlLktFWVMuVklTSVRPUl9UWVBFO1xufVxuXG5mdW5jdGlvbiBpc0hvdXNlaG9sZE1lbWJlcihtZW1iZXIpIHtcbiAgcmV0dXJuIG1lbWJlci50eXBlID09PSB3aW5kb3cuT05TLnN0b3JhZ2UuS0VZUy5IT1VTRUhPTERfTUVNQkVSX1RZUEU7XG59XG5cbmZ1bmN0aW9uIGlzT3RoZXJIb3VzZWhvbGRNZW1iZXIobWVtYmVyKSB7XG4gIHJldHVybiBtZW1iZXIudHlwZSA9PT0gd2luZG93Lk9OUy5zdG9yYWdlLktFWVMuSE9VU0VIT0xEX01FTUJFUl9UWVBFICYmIG1lbWJlclsnQHBlcnNvbiddLmlkICE9PSB3aW5kb3cuT05TLnN0b3JhZ2UuSURTLlVTRVJfSE9VU0VIT0xEX01FTUJFUl9JRDtcbn1cblxudmFyIHRlbXBBd2F5UXVlc3Rpb25TZW50ZW5jZU1hcCA9IHtcbiAgJ3RocmVlLW1vcmUnOiAnUGVvcGxlIHdobyB1c3VhbGx5IGxpdmUgb3V0c2lkZSB0aGUgVUsgd2hvIGFyZSBzdGF5aW5nIGluIHRoZSBVSyBmb3IgMyBtb250aHMgb3IgbW9yZScsXG4gICdwZXJtLWF3YXknOiAnUGVvcGxlIHdobyB3b3JrIGF3YXkgZnJvbSBob21lIHdpdGhpbiB0aGUgVUssIGlmIHRoaXMgaXMnICsgJyB0aGVpciBwZXJtYW5lbnQgb3IgZmFtaWx5IGhvbWUnLFxuICAnYXJtZWQtZm9yY2VzJzogJ01lbWJlcnMgb2YgdGhlIGFybWVkIGZvcmNlcywgaWYgdGhpcyBpcyB0aGVpciBwZXJtYW5lbnQgb3InICsgJyBmYW1pbHkgaG9tZScsXG4gICdsZXNzLXR3ZWx2ZSc6ICdQZW9wbGUgd2hvIGFyZSB0ZW1wb3JhcmlseSBvdXRzaWRlIHRoZSBVSyBmb3IgbGVzcyB0aGFuIDEyJyArICcgbW9udGhzJyxcbiAgJ3VzdWFsbHktdGVtcCc6ICdQZW9wbGUgc3RheWluZyB0ZW1wb3JhcmlseSB3aG8gdXN1YWxseSBsaXZlIGluIHRoZSBVSyBidXQnICsgJyBkbyBub3QgaGF2ZSBhbm90aGVyIFVLIGFkZHJlc3MsIGZvciBleGFtcGxlLCByZWxhdGl2ZXMsIGZyaWVuZHMnLFxuICAnb3RoZXInOiAnT3RoZXIgcGVvcGxlIHdobyB1c3VhbGx5IGxpdmUgaGVyZSwgaW5jbHVkaW5nIGFueW9uZSB0ZW1wb3JhcmlseScgKyAnIGF3YXkgZnJvbSBob21lJ1xufTtcblxudmFyIHZpc2l0b3JRdWVzdGlvblNlbnRlbmNlTWFwID0ge1xuICAndXN1YWxseS1pbi11ayc6ICdQZW9wbGUgd2hvIHVzdWFsbHkgbGl2ZSBzb21ld2hlcmUgZWxzZSBpbiB0aGUgVUssIGZvciBleGFtcGxlIGJveS9naXJsZnJpZW5kcywgZnJpZW5kcyBvciByZWxhdGl2ZXMnLFxuICAnc2Vjb25kLWFkZHJlc3MnOiAnUGVvcGxlIHN0YXlpbmcgaGVyZSBiZWNhdXNlIGl0IGlzIHRoZWlyIHNlY29uZCBhZGRyZXNzLCBmb3IgZXhhbXBsZSwgZm9yIHdvcmsuIFRoZWlyIHBlcm1hbmVudCBvciBmYW1pbHkgaG9tZSBpcyBlbHNld2hlcmUnLFxuICAnbGVzcy10aHJlZSc6ICdQZW9wbGUgd2hvIHVzdWFsbHkgbGl2ZSBvdXRzaWRlIHRoZSBVSyB3aG8gYXJlIHN0YXlpbmcgaW4gdGhlIFVLIGZvciBsZXNzIHRoYW4gdGhyZWUgbW9udGhzJyxcbiAgJ29uLWhvbGlkYXknOiAnUGVvcGxlIGhlcmUgb24gaG9saWRheSdcbn07XG5cbi8qKlxuICogQXVnbWVudCBVbmRlcnNjb3JlIGxpYnJhcnlcbiAqL1xudmFyIF8kMSA9IHdpbmRvdy5fIHx8IHt9O1xuXG52YXIgUkVMQVRJT05TSElQU19TVE9SQUdFX0tFWSA9ICdyZWxhdGlvbnNoaXBzJztcblxudmFyIHJlbGF0aW9uc2hpcFR5cGVzID0ge1xuICAnc3BvdXNlJzogeyBpZDogJ3Nwb3VzZScgfSxcbiAgJ2NoaWxkLXBhcmVudCc6IHsgaWQ6ICdjaGlsZC1wYXJlbnQnIH0sXG4gICdzdGVwLWNoaWxkLXBhcmVudCc6IHsgaWQ6ICdzdGVwLWNoaWxkLXBhcmVudCcgfSxcbiAgJ2dyYW5kY2hpbGQtZ3JhbmRwYXJlbnQnOiB7IGlkOiAnZ3JhbmRjaGlsZC1ncmFuZHBhcmVudCcgfSxcbiAgJ2hhbGYtc2libGluZyc6IHsgaWQ6ICdoYWxmLXNpYmxpbmcnIH0sXG4gICdzaWJsaW5nJzogeyBpZDogJ3NpYmxpbmcnIH0sXG4gICdzdGVwLWJyb3RoZXItc2lzdGVyJzogeyBpZDogJ3N0ZXAtYnJvdGhlci1zaXN0ZXInIH0sXG4gICdwYXJ0bmVyJzogeyBpZDogJ3BhcnRuZXInIH0sXG4gICd1bnJlbGF0ZWQnOiB7IGlkOiAndW5yZWxhdGVkJyB9LFxuICAnb3RoZXItcmVsYXRpb24nOiB7IGlkOiAnb3RoZXItcmVsYXRpb24nIH1cbn07XG5cbnZhciByZWxhdGlvbnNoaXBEZXNjcmlwdGlvbk1hcCA9IHtcbiAgLy8gY292ZXJlZFxuICAnaHVzYmFuZC13aWZlJzoge1xuICAgIHNlbnRhbmNlTGFiZWw6ICdodXNiYW5kIG9yIHdpZmUnLFxuICAgIHN1bW1hcnlBZGplY3RpdmU6ICdodXNiYW5kIG9yIHdpZmUnLFxuICAgIHR5cGU6IHJlbGF0aW9uc2hpcFR5cGVzWydzcG91c2UnXVxuICB9LFxuICAvLyBjb3ZlcmVkXG4gICdtb3RoZXItZmF0aGVyJzoge1xuICAgIHNlbnRhbmNlTGFiZWw6ICdtb3RoZXIgb3IgZmF0aGVyJyxcbiAgICBzdW1tYXJ5QWRqZWN0aXZlOiAnbW90aGVyIG9yIGZhdGhlcicsXG4gICAgdHlwZTogcmVsYXRpb25zaGlwVHlwZXNbJ2NoaWxkLXBhcmVudCddXG4gIH0sXG4gIC8vIGNvdmVyZWRcbiAgJ3N0ZXAtbW90aGVyLWZhdGhlcic6IHtcbiAgICBzZW50YW5jZUxhYmVsOiAnc3RlcG1vdGhlciBvciBzdGVwZmF0aGVyJyxcbiAgICBzdW1tYXJ5QWRqZWN0aXZlOiAnc3RlcG1vdGhlciBvciBzdGVwZmF0aGVyJyxcbiAgICB0eXBlOiByZWxhdGlvbnNoaXBUeXBlc1snc3RlcC1jaGlsZC1wYXJlbnQnXVxuICB9LFxuICAvLyBjb3ZlcmVkXG4gICdzb24tZGF1Z2h0ZXInOiB7XG4gICAgc2VudGFuY2VMYWJlbDogJ3NvbiBvciBkYXVnaHRlcicsXG4gICAgc3VtbWFyeUFkamVjdGl2ZTogJ3NvbiBvciBkYXVnaHRlcicsXG4gICAgdHlwZTogcmVsYXRpb25zaGlwVHlwZXNbJ2NoaWxkLXBhcmVudCddXG4gIH0sXG4gIC8vIGNvdmVyZWRcbiAgJ2hhbGYtYnJvdGhlci1zaXN0ZXInOiB7XG4gICAgc2VudGFuY2VMYWJlbDogJ2hhbGYtYnJvdGhlciBvciBoYWxmLXNpc3RlcicsXG4gICAgc3VtbWFyeUFkamVjdGl2ZTogJ2hhbGYtYnJvdGhlciBvciBoYWxmLXNpc3RlcicsXG4gICAgdHlwZTogcmVsYXRpb25zaGlwVHlwZXNbJ2hhbGYtc2libGluZyddXG4gIH0sXG4gIC8vIGNvdmVyZWRcbiAgJ3N0ZXAtY2hpbGQnOiB7XG4gICAgc2VudGFuY2VMYWJlbDogJ3N0ZXBjaGlsZCcsXG4gICAgc3VtbWFyeUFkamVjdGl2ZTogJ3N0ZXBjaGlsZCcsXG4gICAgdHlwZTogcmVsYXRpb25zaGlwVHlwZXNbJ3N0ZXAtY2hpbGQtcGFyZW50J11cbiAgfSxcbiAgLy8gY292ZXJlZFxuICAnZ3JhbmRwYXJlbnQnOiB7XG4gICAgc2VudGFuY2VMYWJlbDogJ2dyYW5kcGFyZW50JyxcbiAgICBzdW1tYXJ5QWRqZWN0aXZlOiAnZ3JhbmRwYXJlbnQnLFxuICAgIHR5cGU6IHJlbGF0aW9uc2hpcFR5cGVzWydncmFuZGNoaWxkLWdyYW5kcGFyZW50J11cbiAgfSxcbiAgLy8gY292ZXJlZFxuICAnZ3JhbmRjaGlsZCc6IHtcbiAgICBzZW50YW5jZUxhYmVsOiAnZ3JhbmRjaGlsZCcsXG4gICAgc3VtbWFyeUFkamVjdGl2ZTogJ2dyYW5kY2hpbGQnLFxuICAgIHR5cGU6IHJlbGF0aW9uc2hpcFR5cGVzWydncmFuZGNoaWxkLWdyYW5kcGFyZW50J11cbiAgfSxcbiAgLy8gY292ZXJlZFxuICAnYnJvdGhlci1zaXN0ZXInOiB7XG4gICAgc2VudGFuY2VMYWJlbDogJ2Jyb3RoZXIgb3Igc2lzdGVyJyxcbiAgICBzdW1tYXJ5QWRqZWN0aXZlOiAnYnJvdGhlciBvciBzaXN0ZXInLFxuICAgIHR5cGU6IHJlbGF0aW9uc2hpcFR5cGVzWydzaWJsaW5nJ11cbiAgfSxcbiAgLy8gY292ZXJlZFxuICAnc3RlcC1icm90aGVyLXNpc3Rlcic6IHtcbiAgICBzZW50YW5jZUxhYmVsOiAnc3RlcGJyb3RoZXIgb3Igc3RlcHNpc3RlcicsXG4gICAgc3VtbWFyeUFkamVjdGl2ZTogJ3N0ZXBicm90aGVyIG9yIHN0ZXBzaXN0ZXInLFxuICAgIHR5cGU6IHJlbGF0aW9uc2hpcFR5cGVzWydzdGVwLWJyb3RoZXItc2lzdGVyJ11cbiAgfSxcbiAgLy8gY292ZXJlZFxuICAnb3RoZXItcmVsYXRpb24nOiB7XG4gICAgc2VudGFuY2VMYWJlbDogJ290aGVyIHJlbGF0aW9uJyxcbiAgICBzdW1tYXJ5QWRqZWN0aXZlOiAncmVsYXRlZCcsXG4gICAgdHlwZTogcmVsYXRpb25zaGlwVHlwZXNbJ290aGVyLXJlbGF0aW9uJ11cbiAgfSxcbiAgLy8gY292ZXJlZFxuICAncGFydG5lcic6IHtcbiAgICBzZW50YW5jZUxhYmVsOiAncGFydG5lcicsXG4gICAgc3VtbWFyeUFkamVjdGl2ZTogJ3BhcnRuZXInLFxuICAgIHR5cGU6IHJlbGF0aW9uc2hpcFR5cGVzWydwYXJ0bmVyJ11cbiAgfSxcbiAgJ3NhbWUtc2V4LXBhcnRuZXInOiB7XG4gICAgc2VudGFuY2VMYWJlbDogJ2xlZ2FsbHkgcmVnaXN0ZXJlZCBjaXZpbCBwYXJ0bmVyJyxcbiAgICBzdW1tYXJ5QWRqZWN0aXZlOiAnbGVnYWxseSByZWdpc3RlcmVkIGNpdmlsIHBhcnRuZXInLFxuICAgIHR5cGU6IHJlbGF0aW9uc2hpcFR5cGVzWydwYXJ0bmVyJ11cbiAgfSxcbiAgLy8gY292ZXJlZFxuICAndW5yZWxhdGVkJzoge1xuICAgIHNlbnRhbmNlTGFiZWw6ICd1bnJlbGF0ZWQnLFxuICAgIHN1bW1hcnlBZGplY3RpdmU6ICd1bnJlbGF0ZWQnLFxuICAgIHR5cGU6IHJlbGF0aW9uc2hpcFR5cGVzWyd1bnJlbGF0ZWQnXVxuICB9XG59O1xuXG5mdW5jdGlvbiBuYW1lRWxlbWVudChuYW1lKSB7XG4gIHJldHVybiAnPHN0cm9uZz4nICsgbmFtZSArICc8L3N0cm9uZz4nO1xufVxuXG5mdW5jdGlvbiBwZXJzb25MaXN0U3RyKHBlb3BsZUFycikge1xuICB2YXIgb3B0cyA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDoge307XG5cbiAgaWYgKHBlb3BsZUFyci5sZW5ndGggPCAxKSB7XG4gICAgY29uc29sZS5sb2cocGVvcGxlQXJyLCAnbm90IGVub3VnaCBwZW9wbGUgdG8gY3JlYXRlIGEgbGlzdCBzdHJpbmcnKTtcbiAgICByZXR1cm47XG4gIH1cblxuICBpZiAocGVvcGxlQXJyLmxlbmd0aCA9PT0gMSkge1xuICAgIHJldHVybiBuYW1lRWxlbWVudChwZW9wbGVBcnJbMF0uZnVsbE5hbWUgKyBmb3JtYXRQZXJzb25JZllvdShwZW9wbGVBcnJbMF0pKTtcbiAgfVxuXG4gIHZhciBwZW9wbGVDb3B5ID0gW10uY29uY2F0KHRvQ29uc3VtYWJsZUFycmF5KHBlb3BsZUFycikpLFxuICAgICAgbGFzdFBlcnNvbiA9IHBlb3BsZUNvcHkucG9wKCk7XG5cbiAgcmV0dXJuIHBlb3BsZUNvcHkubWFwKGZ1bmN0aW9uIChwZXJzb24kJDEpIHtcbiAgICByZXR1cm4gJycgKyBuYW1lRWxlbWVudChwZXJzb24kJDEuZnVsbE5hbWUgKyAob3B0cy5pc0ZhbWlseSA/IHRyYWlsaW5nTmFtZVMocGVyc29uJCQxLmZ1bGxOYW1lKSA6ICcnKSArIGZvcm1hdFBlcnNvbklmWW91KHBlcnNvbiQkMSkpO1xuICB9KS5qb2luKCcsICcpICsgJyBhbmQgJyArIG5hbWVFbGVtZW50KGxhc3RQZXJzb24uZnVsbE5hbWUgKyAob3B0cy5pc0ZhbWlseSA/IHRyYWlsaW5nTmFtZVMobGFzdFBlcnNvbi5mdWxsTmFtZSkgOiAnJykgKyBmb3JtYXRQZXJzb25JZllvdShsYXN0UGVyc29uKSk7XG59XG5cbmZ1bmN0aW9uIGZvcm1hdFBlcnNvbklmWW91KHBlcnNvbiQkMSkge1xuICByZXR1cm4gcGVyc29uJCQxLmlkID09PSBVU0VSX0hPVVNFSE9MRF9NRU1CRVJfSUQgPyAnIChZb3UpJyA6ICcnO1xufVxuXG52YXIgcmVsYXRpb25zaGlwU3VtbWFyeVRlbXBsYXRlcyA9IHtcbiAgJ3BhcnRuZXJzaGlwJzogZnVuY3Rpb24gcGFydG5lcnNoaXAocGVyc29uMSwgcGVyc29uMiwgZGVzY3JpcHRpb24pIHtcbiAgICByZXR1cm4gbmFtZUVsZW1lbnQocGVyc29uMS5mdWxsTmFtZSArIGZvcm1hdFBlcnNvbklmWW91KHBlcnNvbjEpKSArICcgaXMgJyArIG5hbWVFbGVtZW50KHBlcnNvbjIuZnVsbE5hbWUgKyB0cmFpbGluZ05hbWVTKHBlcnNvbjIuZnVsbE5hbWUpICsgZm9ybWF0UGVyc29uSWZZb3UocGVyc29uMikpICsgJyAnICsgZGVzY3JpcHRpb247XG4gIH0sXG4gICd0d29GYW1pbHlNZW1iZXJzVG9NYW55JzogZnVuY3Rpb24gdHdvRmFtaWx5TWVtYmVyc1RvTWFueShwYXJlbnQxLCBwYXJlbnQyLCBjaGlsZHJlbkFyciwgZGVzY3JpcHRpb24pIHtcbiAgICByZXR1cm4gbmFtZUVsZW1lbnQocGFyZW50MS5mdWxsTmFtZSArIGZvcm1hdFBlcnNvbklmWW91KHBhcmVudDEpKSArICcgYW5kICcgKyBuYW1lRWxlbWVudChwYXJlbnQyLmZ1bGxOYW1lICsgZm9ybWF0UGVyc29uSWZZb3UocGFyZW50MikpICsgJyBhcmUgJyArIHBlcnNvbkxpc3RTdHIoY2hpbGRyZW5BcnIsIHsgaXNGYW1pbHk6IHRydWUgfSkgKyAnICcgKyBkZXNjcmlwdGlvbjtcbiAgfSxcbiAgJ29uZUZhbWlseU1lbWJlclRvTWFueSc6IGZ1bmN0aW9uIG9uZUZhbWlseU1lbWJlclRvTWFueShwYXJlbnQsIGNoaWxkcmVuQXJyLCBkZXNjcmlwdGlvbikge1xuICAgIGNvbnNvbGUubG9nKHBhcmVudCwgY2hpbGRyZW5BcnIsIGRlc2NyaXB0aW9uKTtcbiAgICByZXR1cm4gbmFtZUVsZW1lbnQocGFyZW50LmZ1bGxOYW1lICsgZm9ybWF0UGVyc29uSWZZb3UocGFyZW50KSkgKyAnIGlzICcgKyBwZXJzb25MaXN0U3RyKGNoaWxkcmVuQXJyLCB7IGlzRmFtaWx5OiB0cnVlIH0pICsgJyAnICsgZGVzY3JpcHRpb247XG4gIH0sXG4gICdtYW55VG9NYW55JzogZnVuY3Rpb24gbWFueVRvTWFueShwZW9wbGVBcnIxLCBwZW9wbGVBcnIyLCBkZXNjcmlwdGlvbikge1xuICAgIHJldHVybiBwZXJzb25MaXN0U3RyKHBlb3BsZUFycjEpICsgJyAnICsgKHBlb3BsZUFycjEubGVuZ3RoID4gMSA/ICdhcmUnIDogJ2lzJykgKyAnICcgKyBkZXNjcmlwdGlvbiArICcgdG8gJyArIHBlcnNvbkxpc3RTdHIocGVvcGxlQXJyMik7XG4gIH0sXG4gICdhbGxNdXR1YWwnOiBmdW5jdGlvbiBhbGxNdXR1YWwocGVvcGxlQXJyLCBkZXNjcmlwdGlvbikge1xuICAgIHJldHVybiBwZXJzb25MaXN0U3RyKHBlb3BsZUFycikgKyAnIGFyZSAnICsgZGVzY3JpcHRpb247XG4gIH1cbn07XG5cbi8qKlxuICogVHlwZXNcbiAqL1xuZnVuY3Rpb24gcmVsYXRpb25zaGlwKGRlc2NyaXB0aW9uLCBwZXJzb25Jc0lkLCBwZXJzb25Ub0lkKSB7XG4gIHZhciBvcHRzID0gYXJndW1lbnRzLmxlbmd0aCA+IDMgJiYgYXJndW1lbnRzWzNdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbM10gOiB7fTtcblxuICByZXR1cm4ge1xuICAgIHBlcnNvbklzRGVzY3JpcHRpb246IGRlc2NyaXB0aW9uLFxuICAgIHBlcnNvbklzSWQ6IHBlcnNvbklzSWQsXG4gICAgcGVyc29uVG9JZDogcGVyc29uVG9JZCxcbiAgICBpbmZlcnJlZDogISFvcHRzLmluZmVycmVkLFxuICAgIGluZmVycmVkQnk6IG9wdHMuaW5mZXJyZWRCeVxuICB9O1xufVxuXG4vKipcbiAqIFN0b3JhZ2VcbiAqL1xuZnVuY3Rpb24gYWRkUmVsYXRpb25zaGlwKHJlbGF0aW9uc2hpcE9iaikge1xuICB2YXIgaG91c2Vob2xkUmVsYXRpb25zaGlwcyA9IGdldEFsbFJlbGF0aW9uc2hpcHMoKSB8fCBbXSxcbiAgICAgIGl0ZW0gPSBfZXh0ZW5kcyh7fSwgcmVsYXRpb25zaGlwT2JqLCB7XG4gICAgaWQ6IGF1dG9JbmNyZW1lbnRJZChSRUxBVElPTlNISVBTX1NUT1JBR0VfS0VZKVxuICB9KTtcblxuICBob3VzZWhvbGRSZWxhdGlvbnNoaXBzLnB1c2goaXRlbSk7XG5cbiAgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbShSRUxBVElPTlNISVBTX1NUT1JBR0VfS0VZLCBKU09OLnN0cmluZ2lmeShob3VzZWhvbGRSZWxhdGlvbnNoaXBzKSk7XG5cbiAgcmV0dXJuIGl0ZW07XG59XG5cbmZ1bmN0aW9uIGRlbGV0ZVJlbGF0aW9uc2hpcChyZWxhdGlvbnNoaXBPYmopIHtcbiAgdmFyIGhvdXNlaG9sZFJlbGF0aW9uc2hpcHMgPSAoZ2V0QWxsUmVsYXRpb25zaGlwcygpIHx8IFtdKS5maWx0ZXIoZnVuY3Rpb24gKHJlbGF0aW9uc2hpcCkge1xuICAgIHJldHVybiByZWxhdGlvbnNoaXAuaWQgIT09IHJlbGF0aW9uc2hpcE9iai5pZDtcbiAgfSk7XG5cbiAgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbShSRUxBVElPTlNISVBTX1NUT1JBR0VfS0VZLCBKU09OLnN0cmluZ2lmeShob3VzZWhvbGRSZWxhdGlvbnNoaXBzKSk7XG59XG5cbmZ1bmN0aW9uIGVkaXRSZWxhdGlvbnNoaXAocmVsYXRpb25zaGlwSWQsIHZhbHVlT2JqZWN0KSB7XG4gIHZhciBob3VzZWhvbGRSZWxhdGlvbnNoaXBzID0gKGdldEFsbFJlbGF0aW9uc2hpcHMoKSB8fCBbXSkubWFwKGZ1bmN0aW9uIChyZWxhdGlvbnNoaXApIHtcbiAgICByZXR1cm4gcmVsYXRpb25zaGlwLmlkICsgJycgPT09IHJlbGF0aW9uc2hpcElkICsgJycgPyBfZXh0ZW5kcyh7fSwgdmFsdWVPYmplY3QsIHtcbiAgICAgIGlkOiByZWxhdGlvbnNoaXBJZFxuICAgIH0pIDogcmVsYXRpb25zaGlwO1xuICB9KTtcblxuICBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKFJFTEFUSU9OU0hJUFNfU1RPUkFHRV9LRVksIEpTT04uc3RyaW5naWZ5KGhvdXNlaG9sZFJlbGF0aW9uc2hpcHMpKTtcbn1cblxuZnVuY3Rpb24gZ2V0QWxsUmVsYXRpb25zaGlwcygpIHtcbiAgcmV0dXJuIEpTT04ucGFyc2Uoc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbShSRUxBVElPTlNISVBTX1NUT1JBR0VfS0VZKSkgfHwgW107XG59XG5cbmZ1bmN0aW9uIGdldEFsbE1hbnVhbFJlbGF0aW9uc2hpcHMoKSB7XG4gIHJldHVybiBnZXRBbGxSZWxhdGlvbnNoaXBzKCkuZmlsdGVyKGZ1bmN0aW9uIChyZWxhdGlvbnNoaXApIHtcbiAgICByZXR1cm4gIXJlbGF0aW9uc2hpcC5pbmZlcnJlZDtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGRlbGV0ZUFsbFJlbGF0aW9uc2hpcHNGb3JNZW1iZXIocGVyc29uSWQpIHtcbiAgdmFyIGhvdXNlaG9sZFJlbGF0aW9uc2hpcHMgPSBnZXRBbGxSZWxhdGlvbnNoaXBzKCkuZmlsdGVyKGZ1bmN0aW9uIChyZWxhdGlvbnNoaXApIHtcbiAgICByZXR1cm4gIShwZXJzb25JZCA9PT0gcmVsYXRpb25zaGlwLnBlcnNvbklzSWQgfHwgcGVyc29uSWQgPT09IHJlbGF0aW9uc2hpcC5wZXJzb25Ub0lkKTtcbiAgfSk7XG5cbiAgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbShSRUxBVElPTlNISVBTX1NUT1JBR0VfS0VZLCBKU09OLnN0cmluZ2lmeShob3VzZWhvbGRSZWxhdGlvbnNoaXBzKSk7XG59XG5cbi8qKlxuICogQ29tcGFyYXRvcnNcbiAqL1xuZnVuY3Rpb24gaXNJblJlbGF0aW9uc2hpcChwZXJzb25JZCwgcmVsYXRpb25zaGlwKSB7XG4gIHJldHVybiByZWxhdGlvbnNoaXAucGVyc29uVG9JZCA9PT0gcGVyc29uSWQgfHwgcmVsYXRpb25zaGlwLnBlcnNvbklzSWQgPT09IHBlcnNvbklkO1xufVxuXG5mdW5jdGlvbiBpc0FDaGlsZEluUmVsYXRpb25zaGlwKHBlcnNvbklkLCByZWxhdGlvbnNoaXApIHtcbiAgLyoqXG4gICAqIEd1YXJkXG4gICAqL1xuICBpZiAoIWlzSW5SZWxhdGlvbnNoaXAocGVyc29uSWQsIHJlbGF0aW9uc2hpcCkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICByZXR1cm4gcmVsYXRpb25zaGlwLnBlcnNvbklzRGVzY3JpcHRpb24gPT09ICdtb3RoZXItZmF0aGVyJyAmJiByZWxhdGlvbnNoaXAucGVyc29uVG9JZCA9PT0gcGVyc29uSWQgfHwgcmVsYXRpb25zaGlwLnBlcnNvbklzRGVzY3JpcHRpb24gPT09ICdzb24tZGF1Z2h0ZXInICYmIHJlbGF0aW9uc2hpcC5wZXJzb25Jc0lkID09PSBwZXJzb25JZDtcbn1cblxuZnVuY3Rpb24gaXNBU2libGluZ0luUmVsYXRpb25zaGlwKHBlcnNvbklkLCByZWxhdGlvbnNoaXApIHtcbiAgcmV0dXJuIGlzSW5SZWxhdGlvbnNoaXAocGVyc29uSWQsIHJlbGF0aW9uc2hpcCkgJiYgcmVsYXRpb25zaGlwRGVzY3JpcHRpb25NYXBbcmVsYXRpb25zaGlwLnBlcnNvbklzRGVzY3JpcHRpb25dLnR5cGUuaWQgPT09ICdzaWJsaW5nJztcbn1cblxuZnVuY3Rpb24gaXNBUGFyZW50SW5SZWxhdGlvbnNoaXAocGVyc29uSWQsIHJlbGF0aW9uc2hpcCkge1xuICAvKipcbiAgICogR3VhcmRcbiAgICovXG4gIGlmICghaXNJblJlbGF0aW9uc2hpcChwZXJzb25JZCwgcmVsYXRpb25zaGlwKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHJldHVybiByZWxhdGlvbnNoaXAucGVyc29uSXNEZXNjcmlwdGlvbiA9PT0gJ21vdGhlci1mYXRoZXInICYmIHJlbGF0aW9uc2hpcC5wZXJzb25Jc0lkID09PSBwZXJzb25JZCB8fCByZWxhdGlvbnNoaXAucGVyc29uSXNEZXNjcmlwdGlvbiA9PT0gJ3Nvbi1kYXVnaHRlcicgJiYgcmVsYXRpb25zaGlwLnBlcnNvblRvSWQgPT09IHBlcnNvbklkO1xufVxuXG5mdW5jdGlvbiBhcmVBbnlDaGlsZHJlbkluUmVsYXRpb25zaGlwTm90UGFyZW50KGNoaWxkcmVuSWRzLCBub3RQYXJlbnRJZCwgcmVsYXRpb25zaGlwKSB7XG4gIC8qKlxuICAgKiBHdWFyZFxuICAgKiBJZiByZWxhdGlvbnNoaXAgdHlwZSBpcyBub3QgY2hpbGQtcGFyZW50XG4gICAqL1xuICBpZiAocmVsYXRpb25zaGlwRGVzY3JpcHRpb25NYXBbcmVsYXRpb25zaGlwLnBlcnNvbklzRGVzY3JpcHRpb25dLnR5cGUuaWQgIT09ICdjaGlsZC1wYXJlbnQnKSB7XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICB2YXIgY2hpbGRJbmRleEFzUGVyc29uSXMgPSBjaGlsZHJlbklkcy5pbmRleE9mKHJlbGF0aW9uc2hpcC5wZXJzb25Jc0lkKSxcbiAgICAgIGNoaWxkSW5kZXhBc1BlcnNvblRvID0gY2hpbGRyZW5JZHMuaW5kZXhPZihyZWxhdGlvbnNoaXAucGVyc29uVG9JZCk7XG5cbiAgLyoqXG4gICAqIEZpbmQgcGFyZW50cyB3aXRoIHRoZSBzYW1lIGNoaWxkcmVuXG4gICAqXG4gICAqIElmIGEgcGVyc29uSXMtY2hpbGQgaXMgbm90IGluIHJlbGF0aW9uc2hpcFxuICAgKiBvciAyIGNoaWxkcmVuIGFyZSBmb3VuZCBpbiByZWxhdGlvbnNoaXBcbiAgICovXG4gIGlmIChjaGlsZEluZGV4QXNQZXJzb25JcyA9PT0gLTEgJiYgY2hpbGRJbmRleEFzUGVyc29uVG8gPT09IC0xIHx8IGNoaWxkSW5kZXhBc1BlcnNvbklzICE9PSAtMSAmJiBjaGlsZEluZGV4QXNQZXJzb25UbyAhPT0gLTEpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvKipcbiAgICogQ2hpbGQgbXVzdCBiZSBpbiByZWxhdGlvbnNoaXAsIGdldCBjaGlsZCBpbmRleFxuICAgKi9cbiAgdmFyIGNoaWxkSW5kZXggPSBjaGlsZEluZGV4QXNQZXJzb25JcyAhPT0gLTEgPyBjaGlsZEluZGV4QXNQZXJzb25JcyA6IGNoaWxkSW5kZXhBc1BlcnNvblRvO1xuXG4gIC8qKlxuICAgKiBJZiBwZXJzb25JcyBpcyBub3QgaW4gcmVsYXRpb25zaGlwXG4gICAqIGFuZCBjaGlsZCBmcm9tIHByZXZpb3VzIHJlbGF0aW9uc2hpcCBpcyBhIGNoaWxkIGluIHRoaXMgcmVsYXRpb25zaGlwXG4gICAqL1xuICByZXR1cm4gIWlzSW5SZWxhdGlvbnNoaXAobm90UGFyZW50SWQsIHJlbGF0aW9uc2hpcCkgJiYgaXNBQ2hpbGRJblJlbGF0aW9uc2hpcChjaGlsZHJlbklkc1tjaGlsZEluZGV4XSwgcmVsYXRpb25zaGlwKTtcbn1cblxuZnVuY3Rpb24gaXNSZWxhdGlvbnNoaXBUeXBlKHJlbGF0aW9uc2hpcFR5cGUsIHJlbGF0aW9uc2hpcCkge1xuICB2YXIgdHlwZU9mUmVsYXRpb25zaGlwID0gcmVsYXRpb25zaGlwRGVzY3JpcHRpb25NYXBbcmVsYXRpb25zaGlwLnBlcnNvbklzRGVzY3JpcHRpb25dLnR5cGUuaWQ7XG5cbiAgLyoqXG4gICAqIHJlbGF0aW9uc2hpcFR5cGUgY2FuIGJlIGFuIGFycmF5IG9mIHR5cGVzXG4gICAqL1xuICByZXR1cm4gXyQxLmlzQXJyYXkocmVsYXRpb25zaGlwVHlwZSkgPyAhIV8kMS5maW5kKHJlbGF0aW9uc2hpcFR5cGUsIGZ1bmN0aW9uIChyVHlwZSkge1xuICAgIHJldHVybiByVHlwZSA9PT0gdHlwZU9mUmVsYXRpb25zaGlwO1xuICB9KSA6IHR5cGVPZlJlbGF0aW9uc2hpcCA9PT0gcmVsYXRpb25zaGlwVHlwZTtcbn1cblxuZnVuY3Rpb24gaXNSZWxhdGlvbnNoaXBJbmZlcnJlZChyZWxhdGlvbnNoaXApIHtcbiAgcmV0dXJuIHJlbGF0aW9uc2hpcC5pbmZlcnJlZDtcbn1cblxuLyoqXG4gKiBSZXRyaWV2ZSBwZW9wbGUgYnkgcm9sZSBpbiByZWxhdGlvbnNoaXBzXG4gKi9cbmZ1bmN0aW9uIGdldFBhcmVudElkRnJvbVJlbGF0aW9uc2hpcChyZWxhdGlvbnNoaXApIHtcbiAgdmFyIHBhcmVudElkID0gdm9pZCAwO1xuXG4gIGlmIChyZWxhdGlvbnNoaXAucGVyc29uSXNEZXNjcmlwdGlvbiA9PT0gJ21vdGhlci1mYXRoZXInKSB7XG4gICAgcGFyZW50SWQgPSByZWxhdGlvbnNoaXAucGVyc29uSXNJZDtcbiAgfVxuXG4gIGlmIChyZWxhdGlvbnNoaXAucGVyc29uSXNEZXNjcmlwdGlvbiA9PT0gJ3Nvbi1kYXVnaHRlcicpIHtcbiAgICBwYXJlbnRJZCA9IHJlbGF0aW9uc2hpcC5wZXJzb25Ub0lkO1xuICB9XG5cbiAgaWYgKCFwYXJlbnRJZCkge1xuICAgIGNvbnNvbGUubG9nKCdQYXJlbnQgbm90IGZvdW5kIGluIHJlbGF0aW9uc2hpcDogJywgcmVsYXRpb25zaGlwKTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICByZXR1cm4gcGFyZW50SWQ7XG59XG5cbmZ1bmN0aW9uIGdldENoaWxkSWRGcm9tUmVsYXRpb25zaGlwKHJlbGF0aW9uc2hpcCkge1xuICB2YXIgY2hpbGRJZCA9IHZvaWQgMDtcblxuICBpZiAocmVsYXRpb25zaGlwLnBlcnNvbklzRGVzY3JpcHRpb24gPT09ICdtb3RoZXItZmF0aGVyJykge1xuICAgIGNoaWxkSWQgPSByZWxhdGlvbnNoaXAucGVyc29uVG9JZDtcbiAgfVxuXG4gIGlmIChyZWxhdGlvbnNoaXAucGVyc29uSXNEZXNjcmlwdGlvbiA9PT0gJ3Nvbi1kYXVnaHRlcicpIHtcbiAgICBjaGlsZElkID0gcmVsYXRpb25zaGlwLnBlcnNvbklzSWQ7XG4gIH1cblxuICBpZiAoIWNoaWxkSWQpIHtcbiAgICBjb25zb2xlLmxvZygnQ2hpbGQgbm90IGZvdW5kIGluIHJlbGF0aW9uc2hpcDogJywgcmVsYXRpb25zaGlwKTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICByZXR1cm4gY2hpbGRJZDtcbn1cblxuZnVuY3Rpb24gZ2V0U2libGluZ0lkRnJvbVJlbGF0aW9uc2hpcChwZXJzb25JZCwgcmVsYXRpb25zaGlwKSB7XG4gIGlmICghaXNJblJlbGF0aW9uc2hpcChwZXJzb25JZCwgcmVsYXRpb25zaGlwKSkge1xuICAgIGNvbnNvbGUubG9nKCdQZXJzb24gJyArIHBlcnNvbklkICsgJyBub3QgZm91bmQgaW4gcmVsYXRpb25zaGlwOiAnLCByZWxhdGlvbnNoaXApO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHJldHVybiByZWxhdGlvbnNoaXBbcmVsYXRpb25zaGlwLnBlcnNvbklzSWQgPT09IHBlcnNvbklkID8gJ3BlcnNvblRvSWQnIDogJ3BlcnNvbklzSWQnXTtcbn1cblxuZnVuY3Rpb24gZ2V0T3RoZXJQZXJzb25JZEZyb21SZWxhdGlvbnNoaXAocGVyc29uSWQsIHJlbGF0aW9uc2hpcCkge1xuICByZXR1cm4gcmVsYXRpb25zaGlwLnBlcnNvbklzSWQgPT09IHBlcnNvbklkID8gcmVsYXRpb25zaGlwLnBlcnNvblRvSWQgOiByZWxhdGlvbnNoaXAucGVyc29uSXNJZDtcbn1cblxuZnVuY3Rpb24gZ2V0QWxsUGFyZW50c09mKHBlcnNvbklkKSB7XG4gIHJldHVybiBnZXRBbGxSZWxhdGlvbnNoaXBzKCkuZmlsdGVyKGlzQUNoaWxkSW5SZWxhdGlvbnNoaXAuYmluZChudWxsLCBwZXJzb25JZCkpLm1hcChmdW5jdGlvbiAocmVsYXRpb25zaGlwKSB7XG4gICAgcmV0dXJuIGdldFBlcnNvbkZyb21NZW1iZXIoZ2V0SG91c2Vob2xkTWVtYmVyQnlQZXJzb25JZChnZXRQYXJlbnRJZEZyb21SZWxhdGlvbnNoaXAocmVsYXRpb25zaGlwKSkpO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gZ2V0QWxsQ2hpbGRyZW5PZihwZXJzb25JZCkge1xuICByZXR1cm4gZ2V0QWxsUmVsYXRpb25zaGlwcygpLmZpbHRlcihpc0FQYXJlbnRJblJlbGF0aW9uc2hpcC5iaW5kKG51bGwsIHBlcnNvbklkKSkubWFwKGZ1bmN0aW9uIChyZWxhdGlvbnNoaXApIHtcbiAgICByZXR1cm4gZ2V0SG91c2Vob2xkTWVtYmVyQnlQZXJzb25JZChnZXRDaGlsZElkRnJvbVJlbGF0aW9uc2hpcChyZWxhdGlvbnNoaXApKVsnQHBlcnNvbiddO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gZ2V0UGVyc29uSWRGcm9tUGVyc29uKHBlcnNvbiQkMSkge1xuICByZXR1cm4gcGVyc29uJCQxLmlkO1xufVxuXG5mdW5jdGlvbiBnZXRQZXJzb25Gcm9tTWVtYmVyKG1lbWJlcikge1xuICByZXR1cm4gbWVtYmVyWydAcGVyc29uJ107XG59XG5cbi8qKlxuICogTWlzc2luZyByZWxhdGlvbnNoaXAgaW5mZXJlbmNlXG4gKi9cbnZhciBtaXNzaW5nUmVsYXRpb25zaGlwSW5mZXJlbmNlID0ge1xuICBzaWJsaW5nc09mOiBmdW5jdGlvbiBzaWJsaW5nc09mKHN1YmplY3RNZW1iZXIpIHtcblxuICAgIHZhciBtaXNzaW5nUmVsYXRpb25zaGlwcyA9IFtdLFxuICAgICAgICBhbGxSZWxhdGlvbnNoaXBzID0gZ2V0QWxsUmVsYXRpb25zaGlwcygpLFxuICAgICAgICBwZXJzb24kJDEgPSBnZXRQZXJzb25Gcm9tTWVtYmVyKHN1YmplY3RNZW1iZXIpLFxuICAgICAgICBwZXJzb25JZCA9IHBlcnNvbiQkMS5pZCxcbiAgICAgICAgcGFyZW50cyA9IGdldEFsbFBhcmVudHNPZihwZXJzb25JZCksXG4gICAgICAgIHNpYmxpbmdJZHMgPSBhbGxSZWxhdGlvbnNoaXBzLmZpbHRlcihpc0FTaWJsaW5nSW5SZWxhdGlvbnNoaXAuYmluZChudWxsLCBwZXJzb25JZCkpLm1hcChnZXRTaWJsaW5nSWRGcm9tUmVsYXRpb25zaGlwLmJpbmQobnVsbCwgcGVyc29uSWQpKTtcblxuICAgIC8qKlxuICAgICAqIElmIDIgcGFyZW50IHJlbGF0aW9uc2hpcHMgb2YgJ3BlcnNvbicgYXJlIGZvdW5kIHdlIGNhbiBhdHRlbXB0IHRvIGluZmVyXG4gICAgICogc2libGluZyByZWxhdGlvbnNoaXBzXG4gICAgICovXG4gICAgaWYgKHBhcmVudHMubGVuZ3RoID09PSAyKSB7XG5cbiAgICAgIGdldEFsbEhvdXNlaG9sZE1lbWJlcnMoKS5maWx0ZXIoaXNIb3VzZWhvbGRNZW1iZXIpLmZvckVhY2goZnVuY3Rpb24gKG1lbWJlcikge1xuXG4gICAgICAgIHZhciBtZW1iZXJQZXJzb25JZCA9IG1lbWJlclsnQHBlcnNvbiddLmlkO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBHdWFyZFxuICAgICAgICAgKiBJZiBtZW1iZXIgaXMgdGhlIHN1YmplY3QgbWVtYmVyXG4gICAgICAgICAqIG9yIG1lbWJlciBpcyBhIHBhcmVudFxuICAgICAgICAgKiBvciBtZW1iZXIgYWxyZWFkeSBoYXMgYSBzaWJsaW5nIHJlbGF0aW9uc2hpcCB3aXRoICdwZXJzb24nXG4gICAgICAgICAqIHNraXAgbWVtYmVyXG4gICAgICAgICAqL1xuICAgICAgICBpZiAobWVtYmVyUGVyc29uSWQgPT09IHBlcnNvbklkIHx8IG1lbWJlclBlcnNvbklkID09PSBwYXJlbnRzWzBdLmlkIHx8IG1lbWJlclBlcnNvbklkID09PSBwYXJlbnRzWzFdLmlkIHx8IHNpYmxpbmdJZHMuaW5kZXhPZihtZW1iZXJQZXJzb25JZCkgPiAtMSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBtZW1iZXJQYXJlbnRzID0gZ2V0QWxsUGFyZW50c09mKG1lbWJlclBlcnNvbklkKTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogSWYgMiBwYXJlbnRzIG9mICdtZW1iZXInIGFyZSBmb3VuZFxuICAgICAgICAgKiBhbmQgdGhleSBhcmUgdGhlIHNhbWUgcGFyZW50cyBvZiAncGVyc29uJ1xuICAgICAgICAgKiB3ZSBoYXZlIGlkZW50aWZpZWQgYSBtaXNzaW5nIGluZmVycmVkIHJlbGF0aW9uc2hpcFxuICAgICAgICAgKi9cbiAgICAgICAgaWYgKG1lbWJlclBhcmVudHMubGVuZ3RoID09PSAyICYmIF8kMS5kaWZmZXJlbmNlKHBhcmVudHMubWFwKGdldFBlcnNvbklkRnJvbVBlcnNvbiksIG1lbWJlclBhcmVudHMubWFwKGdldFBlcnNvbklkRnJvbVBlcnNvbikpLmxlbmd0aCA9PT0gMCkge1xuXG4gICAgICAgICAgLyoqXG4gICAgICAgICAgICogQWRkIHRvIG1pc3NpbmdSZWxhdGlvbnNoaXBzXG4gICAgICAgICAgICovXG4gICAgICAgICAgbWlzc2luZ1JlbGF0aW9uc2hpcHMucHVzaChyZWxhdGlvbnNoaXAoJ2Jyb3RoZXItc2lzdGVyJywgcGVyc29uSWQsIG1lbWJlclBlcnNvbklkLCB7XG4gICAgICAgICAgICBpbmZlcnJlZDogdHJ1ZSxcbiAgICAgICAgICAgIGluZmVycmVkQnk6IFtcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogTXVzdCBiZSA0IHJlbGF0aW9uc2hpcHNcbiAgICAgICAgICAgICAqIENvdWxkIGhhdmUgdXNlZCBtZW1iZXIncyBwYXJlbnRzIGJ1dCB3ZSBjYW4gYXNzdW1lIHRoZXlcbiAgICAgICAgICAgICAqIG11c3QgYmUgdGhlIHNhbWUgYXQgdGhpcyBwb2ludCBvciB0aGUgaW5mZXJyZW5jZVxuICAgICAgICAgICAgICogY291bGRuJ3QgaGFwcGVuLlxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBnZXRSZWxhdGlvbnNoaXBPZihwZXJzb25JZCwgcGFyZW50c1swXS5pZCkuaWQsIGdldFJlbGF0aW9uc2hpcE9mKHBlcnNvbklkLCBwYXJlbnRzWzFdLmlkKS5pZCwgZ2V0UmVsYXRpb25zaGlwT2YobWVtYmVyUGVyc29uSWQsIHBhcmVudHNbMF0uaWQpLmlkLCBnZXRSZWxhdGlvbnNoaXBPZihtZW1iZXJQZXJzb25JZCwgcGFyZW50c1sxXS5pZCkuaWRdXG4gICAgICAgICAgfSkpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gbWlzc2luZ1JlbGF0aW9uc2hpcHM7XG4gIH1cbn07XG5cbmZ1bmN0aW9uIGluZmVyUmVsYXRpb25zaGlwcyhyZWxhdGlvbnNoaXAsIHBlcnNvbklzLCBwZXJzb25Ubykge1xuICB2YXIgbWlzc2luZ1JlbGF0aW9uc2hpcHMgPSBbXTtcblxuICBpZiAocmVsYXRpb25zaGlwLnBlcnNvbklzRGVzY3JpcHRpb24gPT09ICdtb3RoZXItZmF0aGVyJykge1xuICAgIG1pc3NpbmdSZWxhdGlvbnNoaXBzID0gbWlzc2luZ1JlbGF0aW9uc2hpcHMuY29uY2F0KG1pc3NpbmdSZWxhdGlvbnNoaXBJbmZlcmVuY2Uuc2libGluZ3NPZihwZXJzb25UbykpO1xuICB9XG5cbiAgaWYgKHJlbGF0aW9uc2hpcC5wZXJzb25Jc0Rlc2NyaXB0aW9uID09PSAnc29uLWRhdWdodGVyJykge1xuICAgIG1pc3NpbmdSZWxhdGlvbnNoaXBzID0gbWlzc2luZ1JlbGF0aW9uc2hpcHMuY29uY2F0KG1pc3NpbmdSZWxhdGlvbnNoaXBJbmZlcmVuY2Uuc2libGluZ3NPZihwZXJzb25JcykpO1xuICB9XG5cbiAgJC5lYWNoKG1pc3NpbmdSZWxhdGlvbnNoaXBzLCBmdW5jdGlvbiAoaSwgcmVsYXRpb25zaGlwKSB7XG4gICAgYWRkUmVsYXRpb25zaGlwKHJlbGF0aW9uc2hpcCk7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBmaW5kTmV4dE1pc3NpbmdSZWxhdGlvbnNoaXAoKSB7XG4gIHZhciBob3VzZWhvbGRNZW1iZXJzID0gZ2V0QWxsSG91c2Vob2xkTWVtYmVycygpLmZpbHRlcihpc0hvdXNlaG9sZE1lbWJlciksXG4gICAgICByZWxhdGlvbnNoaXBzID0gZ2V0QWxsUmVsYXRpb25zaGlwcygpLFxuICAgICAgbWlzc2luZ1JlbGF0aW9uc2hpcE1lbWJlcnMgPSBbXSxcbiAgICAgIHBlcnNvbklzID0gbnVsbDtcblxuICAvKipcbiAgICogRmluZCB0aGUgbmV4dCBtaXNzaW5nIHJlbGF0aW9uc2hpcFxuICAgKi9cbiAgJC5lYWNoKGhvdXNlaG9sZE1lbWJlcnMsIGZ1bmN0aW9uIChpLCBtZW1iZXIpIHtcbiAgICB2YXIgcGVyc29uSWQgPSBtZW1iZXJbJ0BwZXJzb24nXS5pZDtcblxuICAgIC8qKlxuICAgICAqIEdldCBhbGwgcmVsYXRpb25zaGlwcyBmb3IgdGhpcyBtZW1iZXJcbiAgICAgKi9cbiAgICB2YXIgbWVtYmVyUmVsYXRpb25zaGlwcyA9IHJlbGF0aW9uc2hpcHMuZmlsdGVyKGZ1bmN0aW9uIChyZWxhdGlvbnNoaXApIHtcbiAgICAgIHJldHVybiByZWxhdGlvbnNoaXAucGVyc29uSXNJZCA9PT0gcGVyc29uSWQgfHwgcmVsYXRpb25zaGlwLnBlcnNvblRvSWQgPT09IHBlcnNvbklkO1xuICAgIH0pLFxuICAgICAgICBtZW1iZXJSZWxhdGlvbnNoaXBUb0lkcyA9IG1lbWJlclJlbGF0aW9uc2hpcHMubWFwKGZ1bmN0aW9uIChyZWxhdGlvbnNoaXApIHtcbiAgICAgIHJldHVybiByZWxhdGlvbnNoaXAucGVyc29uSXNJZCA9PT0gcGVyc29uSWQgPyByZWxhdGlvbnNoaXAucGVyc29uVG9JZCA6IHJlbGF0aW9uc2hpcC5wZXJzb25Jc0lkO1xuICAgIH0pIHx8IFtdO1xuXG4gICAgLyoqXG4gICAgICogSWYgdG90YWwgcmVsYXRpb25zaGlwcyByZWxhdGVkIHRvIHRoaXMgbWVtYmVyIGlzbid0IGVxdWFsIHRvXG4gICAgICogdG90YWwgaG91c2Vob2xkIG1lbWJlcnMgLTEsIGluZGljYXRlcyBtaXNzaW5nIHJlbGF0aW9uc2hpcFxuICAgICAqL1xuICAgIGlmIChtZW1iZXJSZWxhdGlvbnNoaXBzLmxlbmd0aCA8IGhvdXNlaG9sZE1lbWJlcnMubGVuZ3RoIC0gMSkge1xuXG4gICAgICAvKipcbiAgICAgICAqIEFsbCBtaXNzaW5nIHJlbGF0aW9uc2hpcCBtZW1iZXJzXG4gICAgICAgKi9cbiAgICAgIG1pc3NpbmdSZWxhdGlvbnNoaXBNZW1iZXJzID0gaG91c2Vob2xkTWVtYmVycy5maWx0ZXIoZnVuY3Rpb24gKG0pIHtcbiAgICAgICAgcmV0dXJuIG1lbWJlclJlbGF0aW9uc2hpcFRvSWRzLmluZGV4T2YobVsnQHBlcnNvbiddLmlkKSA9PT0gLTEgJiYgbVsnQHBlcnNvbiddLmlkICE9PSBwZXJzb25JZDtcbiAgICAgIH0pO1xuXG4gICAgICBwZXJzb25JcyA9IG1lbWJlcjtcblxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIHBlcnNvbklzID8ge1xuICAgIHBlcnNvbklzOiBwZXJzb25JcyxcbiAgICBwZXJzb25UbzogbWlzc2luZ1JlbGF0aW9uc2hpcE1lbWJlcnNbMF1cbiAgfSA6IG51bGw7XG59XG5cbmZ1bmN0aW9uIGdldFBlb3BsZUlkc01pc3NpbmdSZWxhdGlvbnNoaXBzV2l0aFBlcnNvbihwZXJzb25JZCkge1xuICB2YXIgcmVtYWluaW5nUGVyc29uSWRzID0gZ2V0QWxsSG91c2Vob2xkTWVtYmVycygpLmZpbHRlcihpc0hvdXNlaG9sZE1lbWJlcikubWFwKGZ1bmN0aW9uIChtZW1iZXIpIHtcbiAgICByZXR1cm4gbWVtYmVyWydAcGVyc29uJ10uaWQ7XG4gIH0pO1xuXG4gIC8qKlxuICAgKiBSZW1vdmUgdGhpcyBwZXJzb24gZnJvbSB0aGUgbGlzdFxuICAgKi9cbiAgcmVtb3ZlRnJvbUxpc3QocmVtYWluaW5nUGVyc29uSWRzLCBwZXJzb25JZCk7XG5cbiAgJC5lYWNoKGdldEFsbFJlbGF0aW9uc2hpcHMoKSwgZnVuY3Rpb24gKGksIHJlbGF0aW9uc2hpcCkge1xuICAgIGlmICghaXNJblJlbGF0aW9uc2hpcChwZXJzb25JZCwgcmVsYXRpb25zaGlwKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlbW92ZSB0aGUgb3RoZXIgcGVyc29uIGZyb20gdGhlIHJlbWFpbmluZ1BlcnNvbklkcyBsaXN0XG4gICAgICovXG4gICAgcmVtb3ZlRnJvbUxpc3QocmVtYWluaW5nUGVyc29uSWRzLCBnZXRPdGhlclBlcnNvbklkRnJvbVJlbGF0aW9uc2hpcChwZXJzb25JZCwgcmVsYXRpb25zaGlwKSk7XG4gIH0pO1xuXG4gIHJldHVybiByZW1haW5pbmdQZXJzb25JZHM7XG59XG5cbmZ1bmN0aW9uIGdldFJlbGF0aW9uc2hpcFR5cGUocmVsYXRpb25zaGlwKSB7XG4gIHJldHVybiByZWxhdGlvbnNoaXBEZXNjcmlwdGlvbk1hcFtyZWxhdGlvbnNoaXAucGVyc29uSXNEZXNjcmlwdGlvbl0udHlwZTtcbn1cblxuLyoqXG4gKiBSZXRyaWV2ZSBmcm9tIHJlbGF0aW9uc2hpcCBncm91cFxuICovXG5mdW5jdGlvbiBnZXRSZWxhdGlvbnNoaXBzV2l0aFBlcnNvbklkcyhyZWxhdGlvbnNoaXBzLCBpZEFycikge1xuICByZXR1cm4gcmVsYXRpb25zaGlwcy5maWx0ZXIoZnVuY3Rpb24gKGNoaWxkUmVsYXRpb25zaGlwKSB7XG4gICAgcmV0dXJuIGlkQXJyLmluZGV4T2YoY2hpbGRSZWxhdGlvbnNoaXAucGVyc29uSXNJZCkgIT09IC0xIHx8IGlkQXJyLmluZGV4T2YoY2hpbGRSZWxhdGlvbnNoaXAucGVyc29uVG9JZCkgIT09IC0xO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gZ2V0UmVsYXRpb25zaGlwT2YocGVyc29uMSwgcGVyc29uMikge1xuICByZXR1cm4gZ2V0QWxsUmVsYXRpb25zaGlwcygpLmZpbmQoZnVuY3Rpb24gKHJlbGF0aW9uc2hpcCkge1xuICAgIHJldHVybiBpc0luUmVsYXRpb25zaGlwKHBlcnNvbjEsIHJlbGF0aW9uc2hpcCkgJiYgaXNJblJlbGF0aW9uc2hpcChwZXJzb24yLCByZWxhdGlvbnNoaXApO1xuICB9KTtcbn1cblxudmFyIFBFUlNPTkFMX0RFVEFJTFNfS0VZID0gJ2luZGl2aWR1YWwtZGV0YWlscyc7XG52YXIgUEVSU09OQUxfUElOU19LRVkgPSAnaW5kaXZpZHVhbC1waW5zJztcblxudmFyIHBlcnNvbmFsRGV0YWlsc01hcml0YWxTdGF0dXNNYXAgPSB7XG4gICduZXZlcic6IHtcbiAgICBkZXNjcmlwdGlvbjogJ05ldmVyIG1hcnJpZWQgYW5kIG5ldmVyIHJlZ2lzdGVyZWQgYSBzYW1lLXNleCBjaXZpbCcgKyAnIHBhcnRuZXJzaGlwJ1xuICB9LFxuICAnbWFycmllZCc6IHtcbiAgICBkZXNjcmlwdGlvbjogJ01hcnJpZWQnXG4gIH0sXG4gICdyZWdpc3RlcmVkJzoge1xuICAgIGRlc2NyaXB0aW9uOiAnSW4gYSByZWdpc3RlcmVkIHNhbWUtc2V4IGNpdmlsIHBhcnRuZXJzaGlwJ1xuICB9LFxuICAnc2VwYXJhdGVkLW1hcnJpZWQnOiB7XG4gICAgZGVzY3JpcHRpb246ICdTZXBhcmF0ZWQsIGJ1dCBzdGlsbCBsZWdhbGx5IG1hcnJpZWQnXG4gIH0sXG4gICdkaXZvcmNlZCc6IHtcbiAgICBkZXNjcmlwdGlvbjogJ0Rpdm9yY2VkJ1xuICB9LFxuICAnZm9ybWVyLXBhcnRuZXJzaGlwJzoge1xuICAgIGRlc2NyaXB0aW9uOiAnRm9ybWVybHkgaW4gYSBzYW1lLXNleCBjaXZpbCBwYXJ0bmVyc2hpcCB3aGljaCBpcyBub3cnICsgJyBsZWdhbGx5IGRpc3NvbHZlZCdcbiAgfSxcbiAgJ3dpZG93ZWQnOiB7XG4gICAgZGVzY3JpcHRpb246ICdXaWRvd2VkJ1xuICB9LFxuICAnc3Vydml2aW5nLXBhcnRuZXInOiB7XG4gICAgZGVzY3JpcHRpb246ICdTdXJ2aXZpbmcgcGFydG5lciBmcm9tIGEgc2FtZS1zZXggY2l2aWwgcGFydG5lcnNoaXAnXG4gIH0sXG4gICdzZXBhcmF0ZWQtcGFydG5lcnNoaXAnOiB7XG4gICAgZGVzY3JpcHRpb246ICdTZXBhcmF0ZWQsIGJ1dCBzdGlsbCBsZWdhbGx5IGluIGEgc2FtZS1zZXggY2l2aWwgcGFydG5lcnNoaXAnXG4gIH1cbn07XG5cbnZhciBwZXJzb25hbERldGFpbHNDb3VudHJ5TWFwID0ge1xuICAnZW5nbGFuZCc6IHtcbiAgICBkZXNjcmlwdGlvbjogJ0VuZ2xhbmQnXG4gIH0sXG4gICd3YWxlcyc6IHtcbiAgICBkZXNjcmlwdGlvbjogJ1dhbGVzJ1xuICB9LFxuICAnc2NvdGxhbmQnOiB7XG4gICAgZGVzY3JpcHRpb246ICdTY290bGFuZCdcbiAgfSxcbiAgJ25vcnRoZXJuLWlyZWxhbmQnOiB7XG4gICAgZGVzY3JpcHRpb246ICdOb3J0aGVybiBJcmVsYW5kJ1xuICB9LFxuICAncmVwdWJsaWMtaXJlbGFuZCc6IHtcbiAgICBkZXNjcmlwdGlvbjogJ1JlcHVibGljIG9mIElyZWxhbmQnXG4gIH0sXG4gICdlbHNld2hlcmUnOiB7XG4gICAgZGVzY3JpcHRpb246ICdFbHNld2hlcmUnXG4gIH1cbn07XG5cbnZhciBwZXJzb25hbERldGFpbHNPcmllbnRhdGlvbk1hcCA9IHtcbiAgJ3N0cmFpZ2h0Jzoge1xuICAgIGRlc2NyaXB0aW9uOiAnU3RyYWlnaHQgb3IgSGV0ZXJvc2V4dWFsJ1xuICB9LFxuICAnZ2F5Jzoge1xuICAgIGRlc2NyaXB0aW9uOiAnR2F5IG9yIExlc2JpYW4nXG4gIH0sXG4gICdiaXNleHVhbCc6IHtcbiAgICBkZXNjcmlwdGlvbjogJ0Jpc2V4dWFsJ1xuICB9LFxuICAnb3RoZXInOiB7XG4gICAgZGVzY3JpcHRpb246ICdPdGhlcidcbiAgfSxcbiAgJ25vLXNheSc6IHtcbiAgICBkZXNjcmlwdGlvbjogJ1ByZWZlciBub3QgdG8gc2F5J1xuICB9XG59O1xuXG5mdW5jdGlvbiBhZGRVcGRhdGVQZXJzb25hbERldGFpbHNET0IocGVyc29uSWQsIGRheSwgbW9udGgsIHllYXIpIHtcbiAgdmFyIGFsbERldGFpbHMgPSBnZXRBbGxQZXJzb25hbERldGFpbHMoKSxcbiAgICAgIGRldGFpbHMgPSBhbGxEZXRhaWxzW3BlcnNvbklkXSB8fCB7fTtcblxuICBkZXRhaWxzWydkb2InXSA9IHtcbiAgICBkYXk6IGRheSxcbiAgICBtb250aDogbW9udGgsXG4gICAgeWVhcjogeWVhclxuICB9O1xuXG4gIHVwZGF0ZVBlcnNvbmFsRGV0YWlscyhwZXJzb25JZCwgZGV0YWlscyk7XG5cbiAgcmV0dXJuIGRldGFpbHM7XG59XG5cbmZ1bmN0aW9uIGFkZFVwZGF0ZU1hcml0YWxTdGF0dXMocGVyc29uSWQsIHZhbCkge1xuICB2YXIgYWxsRGV0YWlscyA9IGdldEFsbFBlcnNvbmFsRGV0YWlscygpLFxuICAgICAgZGV0YWlscyA9IGFsbERldGFpbHNbcGVyc29uSWRdIHx8IHt9O1xuXG4gIGRldGFpbHNbJ21hcml0YWxTdGF0dXMnXSA9IHZhbDtcblxuICB1cGRhdGVQZXJzb25hbERldGFpbHMocGVyc29uSWQsIGRldGFpbHMpO1xuXG4gIHJldHVybiBkZXRhaWxzO1xufVxuXG5mdW5jdGlvbiBhZGRVcGRhdGVDb3VudHJ5KHBlcnNvbklkLCB2YWwpIHtcbiAgdmFyIGFsbERldGFpbHMgPSBnZXRBbGxQZXJzb25hbERldGFpbHMoKSxcbiAgICAgIGRldGFpbHMgPSBhbGxEZXRhaWxzW3BlcnNvbklkXSB8fCB7fTtcblxuICBkZXRhaWxzWydjb3VudHJ5J10gPSB2YWw7XG5cbiAgdXBkYXRlUGVyc29uYWxEZXRhaWxzKHBlcnNvbklkLCBkZXRhaWxzKTtcblxuICByZXR1cm4gZGV0YWlscztcbn1cblxuZnVuY3Rpb24gYWRkVXBkYXRlT3JpZW50YXRpb24ocGVyc29uSWQsIHZhbCkge1xuICB2YXIgYWxsRGV0YWlscyA9IGdldEFsbFBlcnNvbmFsRGV0YWlscygpLFxuICAgICAgZGV0YWlscyA9IGFsbERldGFpbHNbcGVyc29uSWRdIHx8IHt9O1xuXG4gIGRldGFpbHNbJ29yaWVudGF0aW9uJ10gPSB2YWw7XG5cbiAgdXBkYXRlUGVyc29uYWxEZXRhaWxzKHBlcnNvbklkLCBkZXRhaWxzKTtcblxuICByZXR1cm4gZGV0YWlscztcbn1cblxuZnVuY3Rpb24gYWRkVXBkYXRlU2FsYXJ5KHBlcnNvbklkLCB2YWwpIHtcbiAgdmFyIGFsbERldGFpbHMgPSBnZXRBbGxQZXJzb25hbERldGFpbHMoKSxcbiAgICAgIGRldGFpbHMgPSBhbGxEZXRhaWxzW3BlcnNvbklkXSB8fCB7fTtcblxuICBkZXRhaWxzWydzYWxhcnknXSA9IHZhbDtcblxuICB1cGRhdGVQZXJzb25hbERldGFpbHMocGVyc29uSWQsIGRldGFpbHMpO1xuXG4gIHJldHVybiBkZXRhaWxzO1xufVxuXG5mdW5jdGlvbiBnZXRQaW5zKCkge1xuICByZXR1cm4gSlNPTi5wYXJzZShzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKFBFUlNPTkFMX1BJTlNfS0VZKSkgfHwge307XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVBpbkZvcihwZXJzb25JZCkge1xuICB2YXIgb3B0cyA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDoge307XG5cbiAgdmFyIHBpbnMgPSBnZXRQaW5zKCk7XG5cbiAgcGluc1twZXJzb25JZF0gPSB7XG4gICAgcGluOiBfLnJhbmRvbSgxMDAwMCwgOTk5OTkpLFxuICAgIGV4cG9ydGVkOiAhIW9wdHMuZXhwb3J0ZWRcbiAgfTtcblxuICBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKFBFUlNPTkFMX1BJTlNfS0VZLCBKU09OLnN0cmluZ2lmeShwaW5zKSk7XG5cbiAgcmV0dXJuIHBpbnNbcGVyc29uSWRdO1xufVxuXG5mdW5jdGlvbiBnZXRQaW5Gb3IocGVyc29uSWQpIHtcbiAgcmV0dXJuIGdldFBpbnMoKVtwZXJzb25JZF07XG59XG5cbmZ1bmN0aW9uIHVuc2V0UGluRm9yKHBlcnNvbklkKSB7XG4gIHZhciBwaW5zID0gZ2V0UGlucygpO1xuXG4gIGRlbGV0ZSBwaW5zW3BlcnNvbklkXTtcblxuICBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKFBFUlNPTkFMX1BJTlNfS0VZLCBKU09OLnN0cmluZ2lmeShwaW5zKSk7XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZVBlcnNvbmFsRGV0YWlscyhwZXJzb25JZCwgZGV0YWlscykge1xuICBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKFBFUlNPTkFMX0RFVEFJTFNfS0VZLCBKU09OLnN0cmluZ2lmeShfZXh0ZW5kcyh7fSwgZ2V0QWxsUGVyc29uYWxEZXRhaWxzKCksIGRlZmluZVByb3BlcnR5KHt9LCBwZXJzb25JZCwgZGV0YWlscykpKSk7XG5cbiAgcmV0dXJuIGRldGFpbHM7XG59XG5cbmZ1bmN0aW9uIGdldEFsbFBlcnNvbmFsRGV0YWlscygpIHtcbiAgcmV0dXJuIEpTT04ucGFyc2Uoc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbShQRVJTT05BTF9ERVRBSUxTX0tFWSkpIHx8IHt9O1xufVxuXG5mdW5jdGlvbiBnZXRQZXJzb25hbERldGFpbHNGb3IocGVyc29uSWQpIHtcbiAgdmFyIHN0b3JhZ2VPYmogPSBKU09OLnBhcnNlKHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oUEVSU09OQUxfREVUQUlMU19LRVkpKSB8fCB7fSxcbiAgICAgIHBlcnNvbk9iaiA9IHN0b3JhZ2VPYmpbcGVyc29uSWRdO1xuXG4gIGlmICghcGVyc29uT2JqKSB7XG4gICAgY29uc29sZS5sb2coJ1BlcnNvbmFsIGRldGFpbHMgZm9yICcgKyBwZXJzb25JZCArICcgbm90IGZvdW5kJyk7XG4gIH1cblxuICByZXR1cm4gcGVyc29uT2JqO1xufVxuXG4vKipcbiAqIENvcGllZCBmcm9tOlxuICogaHR0cHM6Ly9jb2RlcmV2aWV3LnN0YWNrZXhjaGFuZ2UuY29tL3F1ZXN0aW9ucy85MDM0OS9jaGFuZ2luZy1udW1iZXItdG8td29yZHMtaW4tamF2YXNjcmlwdFxuICogPT09PT09PT09PT09PT09XG4gKi9cbnZhciBPTkVfVE9fTklORVRFRU4gPSBbJ29uZScsICd0d28nLCAndGhyZWUnLCAnZm91cicsICdmaXZlJywgJ3NpeCcsICdzZXZlbicsICdlaWdodCcsICduaW5lJywgJ3RlbicsICdlbGV2ZW4nLCAndHdlbHZlJywgJ3RoaXJ0ZWVuJywgJ2ZvdXJ0ZWVuJywgJ2ZpZnRlZW4nLCAnc2l4dGVlbicsICdzZXZlbnRlZW4nLCAnZWlnaHRlZW4nLCAnbmluZXRlZW4nXTtcblxudmFyIFRFTlMgPSBbJ3RlbicsICd0d2VudHknLCAndGhpcnR5JywgJ2ZvcnR5JywgJ2ZpZnR5JywgJ3NpeHR5JywgJ3NldmVudHknLCAnZWlnaHR5JywgJ25pbmV0eSddO1xuXG52YXIgU0NBTEVTID0gWyd0aG91c2FuZCcsICdtaWxsaW9uJywgJ2JpbGxpb24nLCAndHJpbGxpb24nXTtcblxuLy8gaGVscGVyIGZ1bmN0aW9uIGZvciB1c2Ugd2l0aCBBcnJheS5maWx0ZXJcbmZ1bmN0aW9uIGlzVHJ1dGh5KGl0ZW0pIHtcbiAgcmV0dXJuICEhaXRlbTtcbn1cblxuLy8gY29udmVydCBhIG51bWJlciBpbnRvICdjaHVua3MnIG9mIDAtOTk5XG5mdW5jdGlvbiBjaHVuayhudW1iZXIpIHtcbiAgdmFyIHRob3VzYW5kcyA9IFtdO1xuXG4gIHdoaWxlIChudW1iZXIgPiAwKSB7XG4gICAgdGhvdXNhbmRzLnB1c2gobnVtYmVyICUgMTAwMCk7XG4gICAgbnVtYmVyID0gTWF0aC5mbG9vcihudW1iZXIgLyAxMDAwKTtcbiAgfVxuXG4gIHJldHVybiB0aG91c2FuZHM7XG59XG5cbi8vIHRyYW5zbGF0ZSBhIG51bWJlciBmcm9tIDEtOTk5IGludG8gRW5nbGlzaFxuZnVuY3Rpb24gaW5FbmdsaXNoKG51bWJlcikge1xuICB2YXIgdGhvdXNhbmRzLFxuICAgICAgaHVuZHJlZHMsXG4gICAgICB0ZW5zLFxuICAgICAgb25lcyxcbiAgICAgIHdvcmRzID0gW107XG5cbiAgaWYgKG51bWJlciA8IDIwKSB7XG4gICAgcmV0dXJuIE9ORV9UT19OSU5FVEVFTltudW1iZXIgLSAxXTsgLy8gbWF5IGJlIHVuZGVmaW5lZFxuICB9XG5cbiAgaWYgKG51bWJlciA8IDEwMCkge1xuICAgIG9uZXMgPSBudW1iZXIgJSAxMDtcbiAgICB0ZW5zID0gbnVtYmVyIC8gMTAgfCAwOyAvLyBlcXVpdmFsZW50IHRvIE1hdGguZmxvb3IobnVtYmVyIC8gMTApXG5cbiAgICB3b3Jkcy5wdXNoKFRFTlNbdGVucyAtIDFdKTtcbiAgICB3b3Jkcy5wdXNoKGluRW5nbGlzaChvbmVzKSk7XG5cbiAgICByZXR1cm4gd29yZHMuZmlsdGVyKGlzVHJ1dGh5KS5qb2luKCctJyk7XG4gIH1cblxuICBodW5kcmVkcyA9IG51bWJlciAvIDEwMCB8IDA7XG4gIHdvcmRzLnB1c2goaW5FbmdsaXNoKGh1bmRyZWRzKSk7XG4gIHdvcmRzLnB1c2goJ2h1bmRyZWQnKTtcbiAgd29yZHMucHVzaChpbkVuZ2xpc2gobnVtYmVyICUgMTAwKSk7XG5cbiAgcmV0dXJuIHdvcmRzLmZpbHRlcihpc1RydXRoeSkuam9pbignICcpO1xufVxuXG4vLyBhcHBlbmQgdGhlIHdvcmQgZm9yIGEgc2NhbGUuIE1hZGUgZm9yIHVzZSB3aXRoIEFycmF5Lm1hcFxuZnVuY3Rpb24gYXBwZW5kU2NhbGUoY2h1bmssIGV4cCkge1xuICB2YXIgc2NhbGU7XG4gIGlmICghY2h1bmspIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICBzY2FsZSA9IFNDQUxFU1tleHAgLSAxXTtcbiAgcmV0dXJuIFtjaHVuaywgc2NhbGVdLmZpbHRlcihpc1RydXRoeSkuam9pbignICcpO1xufVxuXG4vKipcbiAqID09PT09PT09PT09PT09PVxuICogRW5kIGNvcHlcbiAqL1xuXG4vKipcbiAqIE1vZGlmaWNhdGlvbiAtIGRlY29yYXRvclxuICovXG52YXIgTlVNQkVSX1RPX1BPU0lUSU9OX1RFWFRfTUFQID0ge1xuICAnb25lJzogJ2ZpcnN0JyxcbiAgJ3R3byc6ICdzZWNvbmQnLFxuICAndGhyZWUnOiAndGhpcmQnLFxuICAnZm91cic6ICdmb3VydGgnLFxuICAnZml2ZSc6ICdmaWZ0aCcsXG4gICdzaXgnOiAnc2l4dGgnLFxuICAnc2V2ZW4nOiAnc2V2ZW50aCcsXG4gICdlaWdodCc6ICdlaWdodGgnLFxuICAnbmluZSc6ICduaW50aCcsXG4gICd0ZW4nOiAndGVudGgnLFxuICAnZWxldmVuJzogJ2VsZXZlbnRoJyxcbiAgJ3R3ZWx2ZSc6ICd0d2VsZnRoJyxcbiAgJ3RoaXJ0ZWVuJzogJ3RoaXJ0ZWVudGgnLFxuICAnZm91cnRlZW4nOiAnZm91cnRlZW50aCcsXG4gICdmaWZ0ZWVuJzogJ2ZpZnRlZW50aCcsXG4gICdzaXh0ZWVuJzogJ3NpeHRlZW50aCcsXG4gICdzZXZlbnRlZW4nOiAnc2V2ZW50ZWVudGgnLFxuICAnZWlnaHRlZW4nOiAnZWlnaHRlZW50aCcsXG4gICduaW5ldGVlbic6ICduaW5ldGVlbnRoJyxcblxuICAndHdlbnR5JzogJ3R3ZW50aWV0aCcsXG4gICd0aGlydHknOiAndGhpcnRpZXRoJyxcbiAgJ2ZvcnR5JzogJ2ZvcnRpZXRoJyxcbiAgJ2ZpZnR5JzogJ2ZpZnRpZXRoJyxcbiAgJ3NpeHR5JzogJ3NpeHRpZXRoJyxcbiAgJ3NldmVudHknOiAnc2V2ZW50aWV0aCcsXG4gICdlaWdodHknOiAnZWlnaHRpZXRoJyxcbiAgJ25pbmV0eSc6ICduaW5ldGlldGgnLFxuICAnaHVuZHJlZCc6ICdodW5kcmVkdGgnLFxuXG4gICd0aG91c2FuZCc6ICd0aG91c2FuZHRoJyxcbiAgJ21pbGxpb24nOiAnbWlsbGlvbnRoJyxcbiAgJ2JpbGxpb24nOiAnYmlsbGlvbnRoJyxcbiAgJ3RyaWxsaW9uJzogJ3RyaWxsaW9udGgnXG59O1xuXG5mdW5jdGlvbiBudW1iZXJUb1Bvc2l0aW9uV29yZChudW0pIHtcbiAgdmFyIHN0ciA9IGNodW5rKG51bSkubWFwKGluRW5nbGlzaCkubWFwKGFwcGVuZFNjYWxlKS5maWx0ZXIoaXNUcnV0aHkpLnJldmVyc2UoKS5qb2luKCcgJyk7XG5cbiAgdmFyIHN1YiA9IHN0ci5zcGxpdCgnICcpLFxuICAgICAgbGFzdFdvcmREYXNoU3BsaXRBcnIgPSBzdWJbc3ViLmxlbmd0aCAtIDFdLnNwbGl0KCctJyksXG4gICAgICBsYXN0V29yZCA9IGxhc3RXb3JkRGFzaFNwbGl0QXJyW2xhc3RXb3JkRGFzaFNwbGl0QXJyLmxlbmd0aCAtIDFdLFxuICAgICAgbmV3TGFzdFdvcmQgPSAobGFzdFdvcmREYXNoU3BsaXRBcnIubGVuZ3RoID4gMSA/IGxhc3RXb3JkRGFzaFNwbGl0QXJyWzBdICsgJy0nIDogJycpICsgTlVNQkVSX1RPX1BPU0lUSU9OX1RFWFRfTUFQW2xhc3RXb3JkXTtcblxuICAvKmNvbnNvbGUubG9nKCdzdHI6Jywgc3RyKTtcbiAgY29uc29sZS5sb2coJ3N1YjonLCBzdWIpO1xuICBjb25zb2xlLmxvZygnbGFzdFdvcmREYXNoU3BsaXRBcnI6JywgbGFzdFdvcmREYXNoU3BsaXRBcnIpO1xuICBjb25zb2xlLmxvZygnbGFzdFdvcmQ6JywgbGFzdFdvcmQpO1xuICBjb25zb2xlLmxvZygnbmV3TGFzdFdvcmQ6JywgbmV3TGFzdFdvcmQpOyovXG5cbiAgdmFyIHN1YkNvcHkgPSBbXS5jb25jYXQoc3ViKTtcbiAgc3ViQ29weS5wb3AoKTtcbiAgdmFyIHByZWZpeCA9IHN1YkNvcHkuam9pbignICcpO1xuICB2YXIgcmVzdWx0ID0gKHByZWZpeCA/IHByZWZpeCArICcgJyA6ICcnKSArIG5ld0xhc3RXb3JkO1xuXG4gIC8vIGNvbnNvbGUubG9nKCdyZXN1bHQnLCAocHJlZml4ID8gcHJlZml4ICsgJyAnIDogJycpICsgbmV3TGFzdFdvcmQpO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG5mdW5jdGlvbiBudW1iZXJUb1dvcmRzU3R5bGVndWlkZShudW1iZXIpIHtcbiAgaWYgKG51bWJlciA+IDkpIHtcbiAgICByZXR1cm4gbnVtYmVyO1xuICB9XG5cbiAgcmV0dXJuIE9ORV9UT19OSU5FVEVFTltudW1iZXIgLSAxXTtcbn1cblxuZnVuY3Rpb24gdG9vbHMoKSB7XG5cbiAgdmFyICRsaXN0TGlua3MgPSAkKCcudGVzdC1kYXRhLWxpbmtzJyksXG4gICAgICAkY2xlYXJEYXRhID0gJCgnPGxpPjxhIGhyZWY9XCIjXCIgY2xhc3M9XFwnbW9jay1kYXRhLWZhbWlseVxcJz4nICsgJ0NsZWFyIGFsbCBkYXRhPC9hPjwvbGk+JyksXG4gICAgICAkY3JlYXRlRmFtaWx5SG91c2Vob2xkID0gJCgnPGxpPjxhIGhyZWY9XCIjXCIgY2xhc3M9XFwnbW9jay1kYXRhLWZhbWlseVxcJz4nICsgJ0NyZWF0ZSBmYW1pbHkgaG91c2Vob2xkPC9hPjwvbGk+JyksXG4gICAgICAkY3JlYXRlRmFtaWx5UmVsYXRpb25zaGlwcyA9ICQoJzxsaT48YSBocmVmPVwiI1wiJyArICcgY2xhc3M9XFwnbW9jay1kYXRhLWZhbWlseVxcJz4nICsgJ0NyZWF0ZSBmYW1pbHkgd2l0aCByZWxhdGlvbnNoaXBzPC9hPjwvbGk+JyksXG4gICAgICAkY3JlYXRlRmFtaWx5V2l0aFJlbGF0aW9uc2hpcHNBbmRWaXNpdG9ycyA9ICQoJzxsaT48YSBocmVmPVwiI1wiJyArICcgY2xhc3M9XFwnbW9jay1kYXRhLWZhbWlseVxcJz4nICsgJ0NyZWF0ZSBmYW1pbHkgd2l0aCByZWxhdGlvbnNoaXBzIGFuZCB2aXNpdG9yczwvYT48L2xpPicpLFxuICAgICAgJGNyZWF0ZUZhbWlseVdpdGhSZWxhdGlvbnNoaXBzUGVyc29uYWxEZXRhaWxzQW5kVmlzaXRvcnMgPSAkKCc8bGk+PGEnICsgJyBocmVmPVwiI1wiJyArICcgY2xhc3M9XFwnbW9jay1kYXRhLWZhbWlseVxcJz4nICsgJ0NyZWF0ZSBmYW1pbHkgd2l0aCByZWxhdGlvbnNoaXBzLCBqdXN0IGZhbWlseSBpbmRpdmlkdWFsIHJlc3BvbnNlcyBhbmQnICsgJyB2aXNpdG9yczwvYT48L2xpPicpLFxuICAgICAgJGNyZWF0ZUZhbWlseVdpdGhSZWxhdGlvbnNoaXBzUGVyc29uYWxEZXRhaWxzQW5kVmlzaXRvcnNQZXJzb25hbERldGFpbHMgPSAkKCc8bGk+PGEnICsgJyBocmVmPVwiI1wiJyArICcgY2xhc3M9XFwnbW9jay1kYXRhLWZhbWlseVxcJz4nICsgJ0NyZWF0ZSBmYW1pbHkgd2l0aCByZWxhdGlvbnNoaXBzLCBmYW1pbHkgaW5kaXZpZHVhbCByZXNwb25zZXMgYW5kJyArICcgdmlzaXRvcnMgaW5kaXZpZHVhbCByZXNwb25zZXM8L2E+PC9saT4nKSxcbiAgICAgIGZhbWlseUhvdXNlaG9sZE1lbWJlcnNEYXRhID0gW3tcbiAgICAndHlwZSc6ICdob3VzZWhvbGQtbWVtYmVyJyxcbiAgICAnQHBlcnNvbic6IHtcbiAgICAgICdmdWxsTmFtZSc6ICdEYXZlICBKb25lcycsXG4gICAgICAnZmlyc3ROYW1lJzogJ0RhdmUnLFxuICAgICAgJ21pZGRsZU5hbWUnOiAnJyxcbiAgICAgICdsYXN0TmFtZSc6ICdKb25lcycsXG4gICAgICAnaWQnOiAncGVyc29uX21lJ1xuICAgIH1cbiAgfSwge1xuICAgICd0eXBlJzogJ2hvdXNlaG9sZC1tZW1iZXInLFxuICAgICdAcGVyc29uJzoge1xuICAgICAgJ2Z1bGxOYW1lJzogJ1NhbGx5ICBKb25lcycsXG4gICAgICAnZmlyc3ROYW1lJzogJ1NhbGx5JyxcbiAgICAgICdtaWRkbGVOYW1lJzogJycsXG4gICAgICAnbGFzdE5hbWUnOiAnSm9uZXMnLFxuICAgICAgJ2lkJzogJ3BlcnNvbjEnXG4gICAgfVxuICB9LCB7XG4gICAgJ3R5cGUnOiAnaG91c2Vob2xkLW1lbWJlcicsXG4gICAgJ0BwZXJzb24nOiB7XG4gICAgICAnZnVsbE5hbWUnOiAnUmViZWNjYSAgSm9uZXMnLFxuICAgICAgJ2ZpcnN0TmFtZSc6ICdSZWJlY2NhJyxcbiAgICAgICdtaWRkbGVOYW1lJzogJycsXG4gICAgICAnbGFzdE5hbWUnOiAnSm9uZXMnLFxuICAgICAgJ2lkJzogJ3BlcnNvbjInXG4gICAgfVxuICB9LCB7XG4gICAgJ3R5cGUnOiAnaG91c2Vob2xkLW1lbWJlcicsXG4gICAgJ0BwZXJzb24nOiB7XG4gICAgICAnZnVsbE5hbWUnOiAnQW15IEpvbmVzJyxcbiAgICAgICdmaXJzdE5hbWUnOiAnQW15JyxcbiAgICAgICdtaWRkbGVOYW1lJzogJycsXG4gICAgICAnbGFzdE5hbWUnOiAnSm9uZXMnLFxuICAgICAgJ2lkJzogJ3BlcnNvbjMnXG4gICAgfVxuICB9XSxcbiAgICAgIHZpc2l0b3JzTWVtYmVyRGF0YSA9IFt7XG4gICAgJ3R5cGUnOiAndmlzaXRvcicsXG4gICAgJ0BwZXJzb24nOiB7XG4gICAgICAnZnVsbE5hbWUnOiAnR2FyZXRoIEpvaG5zb24nLFxuICAgICAgJ2ZpcnN0TmFtZSc6ICdHYXJldGgnLFxuICAgICAgJ21pZGRsZU5hbWUnOiAnJyxcbiAgICAgICdsYXN0TmFtZSc6ICdKb2huc29uJyxcbiAgICAgICdpZCc6ICdwZXJzb240J1xuICAgIH1cbiAgfSwge1xuICAgICd0eXBlJzogJ3Zpc2l0b3InLFxuICAgICdAcGVyc29uJzoge1xuICAgICAgJ2Z1bGxOYW1lJzogJ0pvaG4gSGFtaWx0b24nLFxuICAgICAgJ2ZpcnN0TmFtZSc6ICdKb2huJyxcbiAgICAgICdtaWRkbGVOYW1lJzogJycsXG4gICAgICAnbGFzdE5hbWUnOiAnSGFtaWx0b24nLFxuICAgICAgJ2lkJzogJ3BlcnNvbjUnXG4gICAgfVxuICB9XSxcbiAgICAgIGZhbWlseUhvdXNlaG9sZFJlbGF0aW9uc2hpcHNEYXRhID0gW3tcbiAgICAncGVyc29uSXNEZXNjcmlwdGlvbic6ICdodXNiYW5kLXdpZmUnLFxuICAgICdwZXJzb25Jc0lkJzogJ3BlcnNvbjEnLFxuICAgICdwZXJzb25Ub0lkJzogJ3BlcnNvbl9tZScsXG4gICAgJ2luZmVycmVkJzogZmFsc2UsXG4gICAgJ2lkJzogMVxuICB9LCB7XG4gICAgJ3BlcnNvbklzRGVzY3JpcHRpb24nOiAnc29uLWRhdWdodGVyJyxcbiAgICAncGVyc29uSXNJZCc6ICdwZXJzb24yJyxcbiAgICAncGVyc29uVG9JZCc6ICdwZXJzb25fbWUnLFxuICAgICdpbmZlcnJlZCc6IGZhbHNlLFxuICAgICdpZCc6IDJcbiAgfSwge1xuICAgICdwZXJzb25Jc0Rlc2NyaXB0aW9uJzogJ21vdGhlci1mYXRoZXInLFxuICAgICdwZXJzb25Jc0lkJzogJ3BlcnNvbl9tZScsXG4gICAgJ3BlcnNvblRvSWQnOiAncGVyc29uMycsXG4gICAgJ2luZmVycmVkJzogZmFsc2UsXG4gICAgJ2lkJzogM1xuICB9LCB7XG4gICAgJ3BlcnNvbklzRGVzY3JpcHRpb24nOiAnc29uLWRhdWdodGVyJyxcbiAgICAncGVyc29uSXNJZCc6ICdwZXJzb24yJyxcbiAgICAncGVyc29uVG9JZCc6ICdwZXJzb24xJyxcbiAgICAnaW5mZXJyZWQnOiBmYWxzZSxcbiAgICAnaWQnOiA0XG4gIH0sIHtcbiAgICAncGVyc29uSXNEZXNjcmlwdGlvbic6ICdtb3RoZXItZmF0aGVyJyxcbiAgICAncGVyc29uSXNJZCc6ICdwZXJzb24xJyxcbiAgICAncGVyc29uVG9JZCc6ICdwZXJzb24zJyxcbiAgICAnaW5mZXJyZWQnOiBmYWxzZSxcbiAgICAnaWQnOiA1XG4gIH0sIHtcbiAgICAncGVyc29uSXNEZXNjcmlwdGlvbic6ICdicm90aGVyLXNpc3RlcicsXG4gICAgJ3BlcnNvbklzSWQnOiAncGVyc29uMycsXG4gICAgJ3BlcnNvblRvSWQnOiAncGVyc29uMicsXG4gICAgJ2luZmVycmVkJzogdHJ1ZSxcbiAgICAnaW5mZXJyZWRCeSc6IFszLCA1LCAyLCA0XSxcbiAgICAnaWQnOiA2XG4gIH1dLFxuICAgICAgZmFtaWx5UGVyc29uYWxEZXRhaWxzID0ge1xuICAgICdwZXJzb25fbWUnOiB7XG4gICAgICAnZG9iJzoge1xuICAgICAgICAnZGF5JzogJzE3JyxcbiAgICAgICAgJ21vbnRoJzogJzQnLFxuICAgICAgICAneWVhcic6ICcxOTY3J1xuICAgICAgfSxcbiAgICAgICdtYXJpdGFsU3RhdHVzJzogJ21hcnJpZWQnLFxuICAgICAgJ2NvdW50cnknOiAnd2FsZXMnLFxuICAgICAgJ29yaWVudGF0aW9uJzogJ3N0cmFpZ2h0JyxcbiAgICAgICdzYWxhcnknOiAnNDAwMDAnXG4gICAgfSxcbiAgICAncGVyc29uMSc6IHtcbiAgICAgICdkb2InOiB7ICdkYXknOiAnMDInLCAnbW9udGgnOiAnMTAnLCAneWVhcic6ICcxOTY1JyB9LFxuICAgICAgJ21hcml0YWxTdGF0dXMnOiAnbWFycmllZCcsXG4gICAgICAnY291bnRyeSc6ICd3YWxlcycsXG4gICAgICAnb3JpZW50YXRpb24nOiAnc3RyYWlnaHQnLFxuICAgICAgJ3NhbGFyeSc6ICc0MDAwMCdcbiAgICB9LFxuICAgICdwZXJzb24yJzoge1xuICAgICAgJ2RvYic6IHsgJ2RheSc6ICcyMCcsICdtb250aCc6ICc1JywgJ3llYXInOiAnMTk4MScgfSxcbiAgICAgICdtYXJpdGFsU3RhdHVzJzogJ25ldmVyJyxcbiAgICAgICdjb3VudHJ5JzogJ3dhbGVzJyxcbiAgICAgICdvcmllbnRhdGlvbic6ICdzdHJhaWdodCcsXG4gICAgICAnc2FsYXJ5JzogJzIwMDAwJ1xuICAgIH0sXG4gICAgJ3BlcnNvbjMnOiB7XG4gICAgICAnZG9iJzogeyAnZGF5JzogJzExJywgJ21vbnRoJzogJzcnLCAneWVhcic6ICcxOTg0JyB9LFxuICAgICAgJ21hcml0YWxTdGF0dXMnOiAnbmV2ZXInLFxuICAgICAgJ2NvdW50cnknOiAnd2FsZXMnLFxuICAgICAgJ29yaWVudGF0aW9uJzogJ3N0cmFpZ2h0JyxcbiAgICAgICdzYWxhcnknOiAnMjAwMDAnXG4gICAgfVxuICB9LFxuICAgICAgdmlzaXRvcnNQZXJzb25hbERldGFpbHMgPSB7XG4gICAgJ3BlcnNvbjQnOiB7XG4gICAgICAnc2V4JzogJ21hbGUnLFxuICAgICAgJ2RvYic6IHsgJ2RheSc6ICcyMCcsICdtb250aCc6ICc3JywgJ3llYXInOiAnMTk5MCcgfSxcbiAgICAgICdhZGRyZXNzLXdoZXJlJzogJ2luLXVrJyxcbiAgICAgICdhZGRyZXNzJzoge1xuICAgICAgICAnYWRkcmVzcy1saW5lLTEnOiAnMTUnLFxuICAgICAgICAnYWRkcmVzcy1saW5lLTInOiAnU29tZXdoZXJlIG5lYXInLFxuICAgICAgICAndG93bi1jaXR5JzogJ0xsYW5kcmlkbm9kJyxcbiAgICAgICAgJ2NvdW50eSc6ICdQb3d5cycsXG4gICAgICAgICdwb3N0Y29kZSc6ICdMTDM0IEFONSdcbiAgICAgIH1cbiAgICB9LFxuICAgICdwZXJzb241Jzoge1xuICAgICAgJ3NleCc6ICdtYWxlJyxcbiAgICAgICdkb2InOiB7ICdkYXknOiAnMDInLCAnbW9udGgnOiAnNScsICd5ZWFyJzogJzE5OTEnIH0sXG4gICAgICAnYWRkcmVzcy13aGVyZSc6ICdvdXQtdWsnLFxuICAgICAgJ2FkZHJlc3MnOiB7XG4gICAgICAgICdhZGRyZXNzLWxpbmUtMSc6ICc5NCcsXG4gICAgICAgICdhZGRyZXNzLWxpbmUtMic6ICdTb21ld2hlcmUgRmFyJyxcbiAgICAgICAgJ3Rvd24tY2l0eSc6ICdTcHJpbmdmaWVsZCcsXG4gICAgICAgICdjb3VudHknOiAnTmV3IFlvcmsnLFxuICAgICAgICAncG9zdGNvZGUnOiAnTlkxMEEnXG4gICAgICB9XG4gICAgfVxuICB9LFxuICAgICAgdXNlckRhdGEgPSB7XG4gICAgJ2Z1bGxOYW1lJzogJ0RhdmUgIEpvbmVzJyxcbiAgICAnZmlyc3ROYW1lJzogJ0RhdmUnLFxuICAgICdtaWRkbGVOYW1lJzogJycsXG4gICAgJ2xhc3ROYW1lJzogJ0pvbmVzJ1xuICB9O1xuXG4gICRjcmVhdGVGYW1pbHlIb3VzZWhvbGQub24oJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgY2xlYXJTdG9yYWdlKCk7XG4gICAgcHJlcmVxdWlzaXRlcygpO1xuICAgIGNyZWF0ZUZhbWlseUhvdXNlaG9sZCgpO1xuICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gJy4uL3N1bW1hcnknO1xuICB9KTtcblxuICAkY3JlYXRlRmFtaWx5UmVsYXRpb25zaGlwcy5vbignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBjbGVhclN0b3JhZ2UoKTtcbiAgICBwcmVyZXF1aXNpdGVzKCk7XG4gICAgY3JlYXRlRmFtaWx5SG91c2Vob2xkKCk7XG4gICAgY3JlYXRlRmFtaWx5UmVsYXRpb25zaGlwcygpO1xuICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gJy4uL2h1Yic7XG4gIH0pO1xuXG4gICRjcmVhdGVGYW1pbHlXaXRoUmVsYXRpb25zaGlwc0FuZFZpc2l0b3JzLm9uKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGNsZWFyU3RvcmFnZSgpO1xuICAgIHByZXJlcXVpc2l0ZXMoKTtcbiAgICBjcmVhdGVGYW1pbHlIb3VzZWhvbGRXaXRoVmlzaXRvcnMoKTtcbiAgICBjcmVhdGVGYW1pbHlSZWxhdGlvbnNoaXBzKCk7XG4gICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSAnLi4vaHViJztcbiAgfSk7XG5cbiAgJGNyZWF0ZUZhbWlseVdpdGhSZWxhdGlvbnNoaXBzUGVyc29uYWxEZXRhaWxzQW5kVmlzaXRvcnMub24oJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgY2xlYXJTdG9yYWdlKCk7XG4gICAgcHJlcmVxdWlzaXRlcygpO1xuICAgIGNyZWF0ZUZhbWlseUhvdXNlaG9sZFdpdGhWaXNpdG9ycygpO1xuICAgIGNyZWF0ZUZhbWlseVJlbGF0aW9uc2hpcHMoKTtcbiAgICBjcmVhdGVGYW1pbHlQZXJzb25hbERldGFpbHMoKTtcbiAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9ICcuLi9odWInO1xuICB9KTtcblxuICAkY3JlYXRlRmFtaWx5V2l0aFJlbGF0aW9uc2hpcHNQZXJzb25hbERldGFpbHNBbmRWaXNpdG9yc1BlcnNvbmFsRGV0YWlscy5vbignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBjbGVhclN0b3JhZ2UoKTtcbiAgICBwcmVyZXF1aXNpdGVzKCk7XG4gICAgY3JlYXRlRmFtaWx5SG91c2Vob2xkV2l0aFZpc2l0b3JzKCk7XG4gICAgY3JlYXRlRmFtaWx5UmVsYXRpb25zaGlwcygpO1xuICAgIGNyZWF0ZUZhbWlseVZpc2l0b3JzUGVyc29uYWxEZXRhaWxzKCk7XG4gICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSAnLi4vaHViJztcbiAgfSk7XG5cbiAgJGNsZWFyRGF0YS5vbignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBjbGVhclN0b3JhZ2UoKTtcbiAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9ICcuLi90ZXN0LWFkZHJlc3MnO1xuICB9KTtcblxuICBmdW5jdGlvbiBwcmVyZXF1aXNpdGVzKCkge1xuICAgIHNlc3Npb25TdG9yYWdlLnNldEl0ZW0oJ2FkZHJlc3MnLCAnMTIgU29tZXdoZXJlIENsb3NlLCBOZXdwb3J0LCBDRjEyIDNBQicpO1xuICAgIHNlc3Npb25TdG9yYWdlLnNldEl0ZW0oJ2FkZHJlc3MtbGluZS0xJywgJzEyJyk7XG4gICAgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbSgnYWRkcmVzcy1saW5lLTInLCAnU29tZXdoZXJlIGNsb3NlJyk7XG4gICAgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbSgnY291bnR5JywgJ05ld3BvcnQnKTtcbiAgICBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKCdsaXZlcy1oZXJlJywgJ3llcycpO1xuICAgIHNlc3Npb25TdG9yYWdlLnNldEl0ZW0oJ3Bvc3Rjb2RlJywgJ0NGMTIgM0FCJyk7XG4gICAgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbSgndG93bi1jaXR5JywgJ05ld3BvcnQnKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNyZWF0ZUZhbWlseUhvdXNlaG9sZCgpIHtcbiAgICBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKCd1c2VyLWRldGFpbHMnLCBKU09OLnN0cmluZ2lmeSh1c2VyRGF0YSkpO1xuICAgIHNlc3Npb25TdG9yYWdlLnNldEl0ZW0od2luZG93Lk9OUy5zdG9yYWdlLktFWVMuSE9VU0VIT0xEX01FTUJFUlNfU1RPUkFHRV9LRVksIEpTT04uc3RyaW5naWZ5KGZhbWlseUhvdXNlaG9sZE1lbWJlcnNEYXRhKSk7XG4gICAgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbSgnaG91c2Vob2xkLW1lbWJlcnMtaW5jcmVtZW50JywgSlNPTi5zdHJpbmdpZnkoNCkpO1xuICB9XG5cbiAgZnVuY3Rpb24gY3JlYXRlRmFtaWx5SG91c2Vob2xkV2l0aFZpc2l0b3JzKCkge1xuICAgIHNlc3Npb25TdG9yYWdlLnNldEl0ZW0od2luZG93Lk9OUy5zdG9yYWdlLktFWVMuSE9VU0VIT0xEX01FTUJFUlNfU1RPUkFHRV9LRVksIEpTT04uc3RyaW5naWZ5KFtdLmNvbmNhdChmYW1pbHlIb3VzZWhvbGRNZW1iZXJzRGF0YSwgdmlzaXRvcnNNZW1iZXJEYXRhKSkpO1xuICB9XG5cbiAgZnVuY3Rpb24gY3JlYXRlRmFtaWx5UmVsYXRpb25zaGlwcygpIHtcbiAgICBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKHdpbmRvdy5PTlMuc3RvcmFnZS5LRVlTLlJFTEFUSU9OU0hJUFNfU1RPUkFHRV9LRVksIEpTT04uc3RyaW5naWZ5KGZhbWlseUhvdXNlaG9sZFJlbGF0aW9uc2hpcHNEYXRhKSk7XG4gICAgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbSgncmVsYXRpb25zaGlwcy1pbmNyZW1lbnQnLCBKU09OLnN0cmluZ2lmeSg2KSk7XG4gIH1cblxuICBmdW5jdGlvbiBjcmVhdGVGYW1pbHlQZXJzb25hbERldGFpbHMoKSB7XG4gICAgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbSh3aW5kb3cuT05TLnN0b3JhZ2UuS0VZUy5QRVJTT05BTF9ERVRBSUxTX0tFWSwgSlNPTi5zdHJpbmdpZnkoZmFtaWx5UGVyc29uYWxEZXRhaWxzKSk7XG4gIH1cblxuICBmdW5jdGlvbiBjcmVhdGVGYW1pbHlWaXNpdG9yc1BlcnNvbmFsRGV0YWlscygpIHtcbiAgICBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKHdpbmRvdy5PTlMuc3RvcmFnZS5LRVlTLlBFUlNPTkFMX0RFVEFJTFNfS0VZLCBKU09OLnN0cmluZ2lmeShfZXh0ZW5kcyh7fSwgZmFtaWx5UGVyc29uYWxEZXRhaWxzLCB2aXNpdG9yc1BlcnNvbmFsRGV0YWlscykpKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNsZWFyU3RvcmFnZSgpIHtcbiAgICBzZXNzaW9uU3RvcmFnZS5jbGVhcigpO1xuICB9XG5cbiAgJGxpc3RMaW5rcy5hcHBlbmQoJGNyZWF0ZUZhbWlseUhvdXNlaG9sZCk7XG4gICRsaXN0TGlua3MuYXBwZW5kKCRjcmVhdGVGYW1pbHlSZWxhdGlvbnNoaXBzKTtcbiAgJGxpc3RMaW5rcy5hcHBlbmQoJGNyZWF0ZUZhbWlseVdpdGhSZWxhdGlvbnNoaXBzQW5kVmlzaXRvcnMpO1xuICAkbGlzdExpbmtzLmFwcGVuZCgkY3JlYXRlRmFtaWx5V2l0aFJlbGF0aW9uc2hpcHNQZXJzb25hbERldGFpbHNBbmRWaXNpdG9ycyk7XG4gICRsaXN0TGlua3MuYXBwZW5kKCRjcmVhdGVGYW1pbHlXaXRoUmVsYXRpb25zaGlwc1BlcnNvbmFsRGV0YWlsc0FuZFZpc2l0b3JzUGVyc29uYWxEZXRhaWxzKTtcbiAgJGxpc3RMaW5rcy5hcHBlbmQoJGNsZWFyRGF0YSk7XG59XG5cbnZhciBVU0VSX1NUT1JBR0VfS0VZID0gJ3VzZXItZGV0YWlscyc7XG52YXIgSU5ESVZJRFVBTF9QUk9YWV9TVE9SQUdFX0tFWSA9ICdwcm94eS1wZXJzb24nO1xuXG5mdW5jdGlvbiBnZXRBZGRyZXNzKCkge1xuICB2YXIgYWRkcmVzc0xpbmVzID0gc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbSgnYWRkcmVzcycpLnNwbGl0KCcsJyk7XG5cbiAgcmV0dXJuIHtcbiAgICBhZGRyZXNzTGluZTE6IGFkZHJlc3NMaW5lc1swXSxcbiAgICBhZGRyZXNzTGluZTI6IGFkZHJlc3NMaW5lc1sxXSxcbiAgICBhZGRyZXNzTGluZTM6IGFkZHJlc3NMaW5lc1syXSxcbiAgICBhZGRyZXNzQ291bnR5OiBhZGRyZXNzTGluZXNbNF0sXG4gICAgYWRkcmVzc1Rvd25DaXR5OiBhZGRyZXNzTGluZXNbM10sXG4gICAgYWRkcmVzc1Bvc3Rjb2RlOiBhZGRyZXNzTGluZXNbNV1cbiAgfTtcbn1cblxuLyoqXG4gKiBVc2VyXG4gKi9cbmZ1bmN0aW9uIGFkZFVzZXJQZXJzb24ocGVyc29uJCQxKSB7XG4gIHNlc3Npb25TdG9yYWdlLnNldEl0ZW0oVVNFUl9TVE9SQUdFX0tFWSwgSlNPTi5zdHJpbmdpZnkocGVyc29uJCQxKSk7XG59XG5cbmZ1bmN0aW9uIGdldFVzZXJQZXJzb24oKSB7XG4gIHJldHVybiBKU09OLnBhcnNlKHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oVVNFUl9TVE9SQUdFX0tFWSkpO1xufVxuXG4vKipcbiAqIEhlbHBlcnNcbiAqL1xuZnVuY3Rpb24gY3JlYXRlTmF2SXRlbShtZW1iZXIpIHtcbiAgdmFyICRub2RlRWwgPSAkKCc8bGkgY2xhc3M9XCJqcy10ZW1wbGF0ZS1uYXYtaXRlbSBuYXZfX2l0ZW0gcGx1dG9cIj4nICsgJyAgPGEgY2xhc3M9XCJqcy10ZW1wbGF0ZS1uYXYtaXRlbS1sYWJlbCBuYXZfX2xpbmtcIiBocmVmPVwiI1wiPjwvYT4nICsgJzwvbGk+JyksXG4gICAgICAkbGlua0VsID0gJG5vZGVFbC5maW5kKCcuanMtdGVtcGxhdGUtbmF2LWl0ZW0tbGFiZWwnKTtcblxuICAkbGlua0VsLmh0bWwobWVtYmVyWydAcGVyc29uJ10uZnVsbE5hbWUpO1xuXG4gIGlmIChtZW1iZXJbJ0BwZXJzb24nXS5pZCA9PT0gVVNFUl9IT1VTRUhPTERfTUVNQkVSX0lEKSB7XG4gICAgJGxpbmtFbC5hdHRyKCdocmVmJywgJy4uL3doYXQtaXMteW91ci1uYW1lJyk7XG4gIH0gZWxzZSB7XG4gICAgJGxpbmtFbC5hdHRyKCdocmVmJywgJy4uL3doby1lbHNlLXRvLWFkZD9lZGl0PScgKyBtZW1iZXJbJ0BwZXJzb24nXS5pZCk7XG4gIH1cblxuICByZXR1cm4gJG5vZGVFbDtcbn1cblxuZnVuY3Rpb24gdXBkYXRlSG91c2Vob2xkVmlzaXRvcnNOYXZpZ2F0aW9uSXRlbXMoKSB7XG4gIHZhciBhbGxIb3VzZWhvbGRNZW1iZXJzID0gd2luZG93Lk9OUy5zdG9yYWdlLmdldEFsbEhvdXNlaG9sZE1lbWJlcnMoKSxcbiAgICAgIGhvdXNlaG9sZE1lbWJlcnMgPSBhbGxIb3VzZWhvbGRNZW1iZXJzLmZpbHRlcih3aW5kb3cuT05TLnN0b3JhZ2UuaXNIb3VzZWhvbGRNZW1iZXIpLFxuICAgICAgdmlzaXRvcnMgPSBhbGxIb3VzZWhvbGRNZW1iZXJzLmZpbHRlcih3aW5kb3cuT05TLnN0b3JhZ2UuaXNWaXNpdG9yKTtcblxuICB2YXIgJG5hdmlnYXRpb25Ib3VzZWhvbGRNZW1iZXJzRWwgPSAkKCcjbmF2aWdhdGlvbi1ob3VzZWhvbGQtbWVtYmVycycpLFxuICAgICAgJG5hdmlnYXRpb25WaXNpdG9yc0VsID0gJCgnI25hdmlnYXRpb24tdmlzaXRvcnMnKTtcblxuICBpZiAoaG91c2Vob2xkTWVtYmVycy5sZW5ndGgpIHtcbiAgICAkLmVhY2goaG91c2Vob2xkTWVtYmVycywgZnVuY3Rpb24gKGksIG1lbWJlcikge1xuICAgICAgJG5hdmlnYXRpb25Ib3VzZWhvbGRNZW1iZXJzRWwuYXBwZW5kKGNyZWF0ZU5hdkl0ZW0obWVtYmVyKSk7XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgJG5hdmlnYXRpb25Ib3VzZWhvbGRNZW1iZXJzRWwucGFyZW50KCkuaGlkZSgpO1xuICB9XG5cbiAgaWYgKHZpc2l0b3JzLmxlbmd0aCkge1xuICAgICQuZWFjaCh2aXNpdG9ycywgZnVuY3Rpb24gKGksIG1lbWJlcikge1xuICAgICAgJG5hdmlnYXRpb25WaXNpdG9yc0VsLmFwcGVuZChjcmVhdGVOYXZJdGVtKG1lbWJlcikpO1xuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgICRuYXZpZ2F0aW9uVmlzaXRvcnNFbC5wYXJlbnQoKS5oaWRlKCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gY3JlYXRlTGlzdEl0ZW1QZXJzb24obWVtYmVyKSB7XG4gIHJldHVybiAkKCc8bGkgY2xhc3M9XCJsaXN0X19pdGVtXCI+JykuYWRkQ2xhc3MoJ21hcnMnKS5odG1sKCc8c3BhbiBjbGFzcz1cImxpc3RfX2l0ZW0tbmFtZVwiPicgKyBtZW1iZXJbJ0BwZXJzb24nXS5mdWxsTmFtZSArIChtZW1iZXJbJ0BwZXJzb24nXS5pZCA9PT0gVVNFUl9IT1VTRUhPTERfTUVNQkVSX0lEID8gJyAoWW91KScgOiAnJykgKyAnPC9zcGFuPicpO1xufVxuXG5mdW5jdGlvbiBwb3B1bGF0ZUxpc3QoJGVsLCBtZW1iZXJUeXBlKSB7XG4gIGlmICghJGVsLmxlbmd0aCkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHZhciBtZW1iZXJzID0gZ2V0QWxsSG91c2Vob2xkTWVtYmVycygpIHx8IFtdO1xuXG4gICRlbC5lbXB0eSgpLmFwcGVuZChtZW1iZXJzLmZpbHRlcihmdW5jdGlvbiAobWVtYmVyKSB7XG4gICAgcmV0dXJuIG1lbWJlci50eXBlID09PSBtZW1iZXJUeXBlO1xuICB9KS5tYXAoY3JlYXRlTGlzdEl0ZW1QZXJzb24pKTtcblxuICAkZWwuYWRkQ2xhc3MoJ2xpc3QgbGlzdC0tcGVvcGxlLXBsYWluJyk7XG59XG5cbmZ1bmN0aW9uIHBvcHVsYXRlSG91c2Vob2xkTGlzdCgpIHtcbiAgcG9wdWxhdGVMaXN0KCQoJyNob3VzZWhvbGQtbWVtYmVycycpLCBIT1VTRUhPTERfTUVNQkVSX1RZUEUpO1xufVxuXG5mdW5jdGlvbiBwb3B1bGF0ZVZpc2l0b3JMaXN0KCkge1xuICBwb3B1bGF0ZUxpc3QoJCgnI3Zpc2l0b3JzLWxpc3QnKSwgVklTSVRPUl9UWVBFKTtcbn1cblxuZnVuY3Rpb24gdXBkYXRlQWRkcmVzc2VzKCkge1xuICB2YXIgYWRkcmVzc0xpbmVzID0gKHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oJ2FkZHJlc3MnKSB8fCAnJykuc3BsaXQoJywnKSxcbiAgICAgIGFkZHJlc3NMaW5lMSA9IGFkZHJlc3NMaW5lc1swXSxcbiAgICAgIGFkZHJlc3NMaW5lMiA9IGFkZHJlc3NMaW5lc1sxXTtcblxuICAkKCcjc2VjdGlvbi1hZGRyZXNzJykuaHRtbChhZGRyZXNzTGluZTEgfHwgJzxhJyArICcgaHJlZj1cIi4uL3Rlc3QtYWRkcmVzc1wiPkFkZHJlc3Mgbm90JyArICcgZm91bmQ8L2E+Jyk7XG4gICQoJy5hZGRyZXNzLXRleHQnKS5odG1sKGFkZHJlc3NMaW5lMSAmJiBhZGRyZXNzTGluZTIgPyBhZGRyZXNzTGluZTEgKyAoYWRkcmVzc0xpbmUyID8gJywgJyArIGFkZHJlc3NMaW5lMiA6ICcnKSA6ICc8YSBocmVmPVwiLi4vdGVzdC1hZGRyZXNzXCI+QWRkcmVzcyBub3QgZm91bmQ8L2E+Jyk7XG5cbiAgJCgnLmFkZHJlc3MtdGV4dC1saW5lMScpLmh0bWwoYWRkcmVzc0xpbmUxKTtcblxuICB2YXIgcGVyc29uSWQgPSBuZXcgVVJMU2VhcmNoUGFyYW1zKHdpbmRvdy5sb2NhdGlvbi5zZWFyY2gpLmdldCgncGVyc29uJyksXG4gICAgICBwZXJzb24kJDEgPSB2b2lkIDA7XG5cbiAgaWYgKHBlcnNvbklkKSB7XG4gICAgcGVyc29uJCQxID0gZ2V0SG91c2Vob2xkTWVtYmVyQnlQZXJzb25JZChwZXJzb25JZClbJ0BwZXJzb24nXTtcbiAgICAkKCcjc2VjdGlvbi1pbmRpdmlkdWFsJykuaHRtbChwZXJzb24kJDEuZnVsbE5hbWUpO1xuXG4gICAgJCgnLmpzLXBlcnNvbi1mdWxsbmFtZS1mcm9tLXVybC1pZCcpLmh0bWwocGVyc29uJCQxLmZ1bGxOYW1lKTtcbiAgfVxufVxuXG52YXIgc2VjdXJlTGlua1RleHRNYXAgPSB7XG4gICdxdWVzdGlvbi15b3UnOiB7XG4gICAgZGVzY3JpcHRpb246ICdXYW50IHRvIGtlZXAgeW91ciBhbnN3ZXJzIHNlY3VyZSBmcm9tIG90aGVyIHBlb3BsZSBhdCB0aGlzJyArICcgYWRkcmVzcz8nLFxuICAgIGxpbmtUZXh0OiAnR2V0IGEgc2VwYXJhdGUgYWNjZXNzIGNvZGUgdG8gc3VibWl0IGFuIGluZGl2aWR1YWwgcmVzcG9uc2UnLFxuICAgIGxpbms6ICcuLi9pbmRpdmlkdWFsLWRlY2lzaW9uLXNlY3VyZSdcbiAgfSxcbiAgJ3Bpbi15b3UnOiB7XG4gICAgZGVzY3JpcHRpb246ICdZb3VcXCd2ZSBjaG9zZW4gdG8ga2VlcCB5b3VyIGFuc3dlcnMgc2VjdXJlJyxcbiAgICBsaW5rVGV4dDogJ0NhbmNlbCB0aGlzIGFuZCBtYWtlIGFuc3dlcnMgYXZhaWxhYmxlIHRvIHRoZSByZXN0IG9mIHRoZScgKyAnIGhvdXNlaG9sZCcsXG4gICAgbGluazogJy4uL2luZGl2aWR1YWwtZGVjaXNpb24tc2VjdXJlJ1xuICB9LFxuICAncXVlc3Rpb24tcHJveHknOiB7XG4gICAgZGVzY3JpcHRpb246ICdOb3QgaGFwcHkgdG8gY29udGludWUgYW5zd2VyaW5nIGZvciAkW05BTUVdPycsXG4gICAgbGlua1RleHQ6ICdSZXF1ZXN0IGFuIGluZGl2aWR1YWwgYWNjZXNzIGNvZGUgdG8gYmUgc2VudCB0byB0aGVtJyxcbiAgICBsaW5rOiAnLi4vaW5kaXZpZHVhbC1kZWNpc2lvbi1vdGhlci1zZWN1cmUnXG4gIH1cbn07XG5cbmZ1bmN0aW9uIHVwZGF0ZUFsbFByZXZpb3VzTGlua3MoKSB7XG4gICQoJy5qcy1wcmV2aW91cy1saW5rJykuYXR0cignaHJlZicsIGRvY3VtZW50LnJlZmVycmVyKTtcbn1cblxuZnVuY3Rpb24gdXBkYXRlUGVyc29uTGluaygpIHtcbiAgdmFyIHBlcnNvbklkID0gbmV3IFVSTFNlYXJjaFBhcmFtcyh3aW5kb3cubG9jYXRpb24uc2VhcmNoKS5nZXQoJ3BlcnNvbicpO1xuXG4gIGlmIChwZXJzb25JZCkge1xuICAgIHZhciB1cmxQYXJhbSA9IG5ldyBVUkxTZWFyY2hQYXJhbXMod2luZG93LmxvY2F0aW9uLnNlYXJjaCksXG4gICAgICAgIF9wZXJzb24gPSBnZXRIb3VzZWhvbGRNZW1iZXJCeVBlcnNvbklkKHBlcnNvbklkKVsnQHBlcnNvbiddLFxuICAgICAgICBwaW5PYmogPSBnZXRQaW5Gb3IocGVyc29uSWQpLFxuICAgICAgICBzZWN1cmVMaW5rVGV4dENvbmZpZyA9IHNlY3VyZUxpbmtUZXh0TWFwW2dldEFuc3dlcmluZ0luZGl2aWR1YWxCeVByb3h5KCkgPyAncXVlc3Rpb24tcHJveHknIDogcGluT2JqICYmIHBpbk9iai5waW4gPyAncGluLXlvdScgOiAncXVlc3Rpb24teW91J10sXG4gICAgICAgIGxpbmtIcmVmID0gc2VjdXJlTGlua1RleHRDb25maWcubGluayArICc/cGVyc29uPScgKyBwZXJzb25JZCArICcmcmV0dXJudXJsPScgKyB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUsXG4gICAgICAgIHN1cnZleVR5cGUgPSB1cmxQYXJhbS5nZXQoJ3N1cnZleScpO1xuXG4gICAgbGlua0hyZWYgKz0gc3VydmV5VHlwZSA/ICcmc3VydmV5PScgKyBzdXJ2ZXlUeXBlIDogJyc7XG5cbiAgICB2YXIgJHNlY3VyZUxpbmsgPSAkKCcuanMtbGluay1zZWN1cmUnKTtcbiAgICAkc2VjdXJlTGluay5hdHRyKCdocmVmJywgbGlua0hyZWYpO1xuXG4gICAgJHNlY3VyZUxpbmsuaHRtbChzZWN1cmVMaW5rVGV4dENvbmZpZy5saW5rVGV4dCk7XG4gICAgJCgnLmpzLWxpbmstc2VjdXJlLWxhYmVsJykuaHRtbChzZWN1cmVMaW5rVGV4dENvbmZpZy5kZXNjcmlwdGlvbi5yZXBsYWNlKCckW05BTUVdJywgX3BlcnNvbi5mdWxsTmFtZSkpO1xuXG4gICAgdmFyIHBlcnNvbkxpbmsgPSAkKCcuanMtbGluay1wZXJzb24nKTtcbiAgICBwZXJzb25MaW5rLmF0dHIoJ2hyZWYnLCBwZXJzb25MaW5rLmF0dHIoJ2hyZWYnKSArICc/cGVyc29uPScgKyBwZXJzb25JZCArIChzdXJ2ZXlUeXBlID8gJyZzdXJ2ZXk9JyArIHN1cnZleVR5cGUgOiAnJykpO1xuICB9XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZUJ5U3VydmV5VHlwZSgpIHtcbiAgdmFyIHVybFBhcmFtcyA9IG5ldyBVUkxTZWFyY2hQYXJhbXMod2luZG93LmxvY2F0aW9uLnNlYXJjaCksXG4gICAgICBzdXJ2ZXlUeXBlID0gdXJsUGFyYW1zLmdldCgnc3VydmV5Jyk7XG5cbiAgaWYgKHN1cnZleVR5cGUpIHtcbiAgICAkKCcuanMtaGVhZGVyLXRpdGxlJykuaHRtbChzdXJ2ZXlUeXBlQ29uZmlnW3N1cnZleVR5cGVdLnRpdGxlKTtcbiAgICAkKCcjcGVvcGxlLWxpdmluZy1oZXJlJykuaHRtbChzdXJ2ZXlUeXBlQ29uZmlnW3N1cnZleVR5cGVdLmhvdXNlaG9sZFNlY3Rpb25UaXRsZSk7XG4gICAgJCgnI3Blb3BsZS1saXZpbmctaGVyZScpLmF0dHIoJ2hyZWYnLCBzdXJ2ZXlUeXBlQ29uZmlnW3N1cnZleVR5cGVdLmhvdXNlaG9sZFNlY3Rpb25MaW5rKTtcbiAgICAkKCcjcmVsYXRpb25zaGlwcy1zZWN0aW9uJykuYXR0cignaHJlZicsIHN1cnZleVR5cGVDb25maWdbc3VydmV5VHlwZV0ucmVsYXRpb25zaGlwc1NlY3Rpb24pO1xuICAgICQoJ3RpdGxlJykuaHRtbChzdXJ2ZXlUeXBlQ29uZmlnW3N1cnZleVR5cGVdLnRpdGxlKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBzZXRBbnN3ZXJpbmdJbmRpdmlkdWFsQnlQcm94eShib29sKSB7XG4gIHNlc3Npb25TdG9yYWdlLnNldEl0ZW0oSU5ESVZJRFVBTF9QUk9YWV9TVE9SQUdFX0tFWSwgSlNPTi5zdHJpbmdpZnkoYm9vbCkpO1xufVxuXG5mdW5jdGlvbiBnZXRBbnN3ZXJpbmdJbmRpdmlkdWFsQnlQcm94eSgpIHtcbiAgcmV0dXJuIEpTT04ucGFyc2Uoc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbShJTkRJVklEVUFMX1BST1hZX1NUT1JBR0VfS0VZKSk7XG59XG5cbnZhciBzdXJ2ZXlUeXBlQ29uZmlnID0ge1xuICBsbXM6IHtcbiAgICB0aXRsZTogJ09ubGluZSBIb3VzZWhvbGQgU3R1ZHknLFxuICAgIGhvdXNlaG9sZFNlY3Rpb25UaXRsZTogJ0Fib3V0IHlvdXIgaG91c2Vob2xkJyxcbiAgICBob3VzZWhvbGRTZWN0aW9uTGluazogJy4uL3N1bW1hcnkvP3N1cnZleT1sbXMnLFxuICAgIHJlbGF0aW9uc2hpcHNTZWN0aW9uOiAnLi4vcmVsYXRpb25zaGlwcy8/c3VydmV5PWxtcydcbiAgfVxufTtcblxuZnVuY3Rpb24gZG9JTGl2ZUhlcmUoKSB7XG4gIHJldHVybiBzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKCdsaXZlcy1oZXJlJykgPT09ICd5ZXMnO1xufVxuXG5mdW5jdGlvbiBnZXRTaWduaWZpY2FudCgpIHtcbiAgcmV0dXJuICcxMSBOb3ZlbWJlciAyMDE4Jztcbn1cblxuZnVuY3Rpb24gdXBkYXRlU2lnbmlmaWNhbnREYXRlKCkge1xuICAkKCcuanMtc2lnbmlmaWNhbnQtZGF0ZScpLmh0bWwoZ2V0U2lnbmlmaWNhbnQoKSk7XG59XG5cbndpbmRvdy5PTlMgPSB3aW5kb3cuT05TIHx8IHt9O1xud2luZG93Lk9OUy5zdG9yYWdlID0ge1xuICBnZXRBZGRyZXNzOiBnZXRBZGRyZXNzLFxuICBhZGRIb3VzZWhvbGRNZW1iZXI6IGFkZEhvdXNlaG9sZE1lbWJlcixcbiAgdXBkYXRlSG91c2Vob2xkTWVtYmVyOiB1cGRhdGVIb3VzZWhvbGRNZW1iZXIsXG4gIGRlbGV0ZUhvdXNlaG9sZE1lbWJlcjogZGVsZXRlSG91c2Vob2xkTWVtYmVyLFxuICBnZXRBbGxIb3VzZWhvbGRNZW1iZXJzOiBnZXRBbGxIb3VzZWhvbGRNZW1iZXJzLFxuICBhZGRVc2VyUGVyc29uOiBhZGRVc2VyUGVyc29uLFxuICBnZXRVc2VyUGVyc29uOiBnZXRVc2VyUGVyc29uLFxuICBnZXRVc2VyQXNIb3VzZWhvbGRNZW1iZXI6IGdldFVzZXJBc0hvdXNlaG9sZE1lbWJlcixcbiAgZ2V0SG91c2Vob2xkTWVtYmVyQnlQZXJzb25JZDogZ2V0SG91c2Vob2xkTWVtYmVyQnlQZXJzb25JZCxcbiAgZ2V0TWVtYmVyUGVyc29uSWQ6IGdldE1lbWJlclBlcnNvbklkLFxuICB1cGRhdGVVc2VyQXNIb3VzZWhvbGRNZW1iZXI6IHVwZGF0ZVVzZXJBc0hvdXNlaG9sZE1lbWJlcixcbiAgZGVsZXRlVXNlckFzSG91c2Vob2xkTWVtYmVyOiBkZWxldGVVc2VyQXNIb3VzZWhvbGRNZW1iZXIsXG4gIHRlbXBBd2F5UXVlc3Rpb25TZW50ZW5jZU1hcDogdGVtcEF3YXlRdWVzdGlvblNlbnRlbmNlTWFwLFxuICB2aXNpdG9yUXVlc3Rpb25TZW50ZW5jZU1hcDogdmlzaXRvclF1ZXN0aW9uU2VudGVuY2VNYXAsXG5cbiAgaXNWaXNpdG9yOiBpc1Zpc2l0b3IsXG4gIGlzT3RoZXJIb3VzZWhvbGRNZW1iZXI6IGlzT3RoZXJIb3VzZWhvbGRNZW1iZXIsXG4gIGlzSG91c2Vob2xkTWVtYmVyOiBpc0hvdXNlaG9sZE1lbWJlcixcblxuICBhZGRSZWxhdGlvbnNoaXA6IGFkZFJlbGF0aW9uc2hpcCxcbiAgZGVsZXRlUmVsYXRpb25zaGlwOiBkZWxldGVSZWxhdGlvbnNoaXAsXG4gIGVkaXRSZWxhdGlvbnNoaXA6IGVkaXRSZWxhdGlvbnNoaXAsXG4gIGdldEFsbFJlbGF0aW9uc2hpcHM6IGdldEFsbFJlbGF0aW9uc2hpcHMsXG4gIGdldEFsbE1hbnVhbFJlbGF0aW9uc2hpcHM6IGdldEFsbE1hbnVhbFJlbGF0aW9uc2hpcHMsXG4gIGRlbGV0ZUFsbFJlbGF0aW9uc2hpcHNGb3JNZW1iZXI6IGRlbGV0ZUFsbFJlbGF0aW9uc2hpcHNGb3JNZW1iZXIsXG5cbiAgZ2V0QWxsUGFyZW50c09mOiBnZXRBbGxQYXJlbnRzT2YsXG4gIGdldEFsbENoaWxkcmVuT2Y6IGdldEFsbENoaWxkcmVuT2YsXG4gIGdldFBhcmVudElkRnJvbVJlbGF0aW9uc2hpcDogZ2V0UGFyZW50SWRGcm9tUmVsYXRpb25zaGlwLFxuICBnZXRDaGlsZElkRnJvbVJlbGF0aW9uc2hpcDogZ2V0Q2hpbGRJZEZyb21SZWxhdGlvbnNoaXAsXG4gIGdldE90aGVyUGVyc29uSWRGcm9tUmVsYXRpb25zaGlwOiBnZXRPdGhlclBlcnNvbklkRnJvbVJlbGF0aW9uc2hpcCxcbiAgaXNBUGFyZW50SW5SZWxhdGlvbnNoaXA6IGlzQVBhcmVudEluUmVsYXRpb25zaGlwLFxuICBpc0FDaGlsZEluUmVsYXRpb25zaGlwOiBpc0FDaGlsZEluUmVsYXRpb25zaGlwLFxuICBpc0luUmVsYXRpb25zaGlwOiBpc0luUmVsYXRpb25zaGlwLFxuICBhcmVBbnlDaGlsZHJlbkluUmVsYXRpb25zaGlwTm90UGFyZW50OiBhcmVBbnlDaGlsZHJlbkluUmVsYXRpb25zaGlwTm90UGFyZW50LFxuICBpc1JlbGF0aW9uc2hpcFR5cGU6IGlzUmVsYXRpb25zaGlwVHlwZSxcbiAgaXNSZWxhdGlvbnNoaXBJbmZlcnJlZDogaXNSZWxhdGlvbnNoaXBJbmZlcnJlZCxcbiAgZ2V0UmVsYXRpb25zaGlwT2Y6IGdldFJlbGF0aW9uc2hpcE9mLFxuXG4gIHJlbGF0aW9uc2hpcERlc2NyaXB0aW9uTWFwOiByZWxhdGlvbnNoaXBEZXNjcmlwdGlvbk1hcCxcbiAgcmVsYXRpb25zaGlwU3VtbWFyeVRlbXBsYXRlczogcmVsYXRpb25zaGlwU3VtbWFyeVRlbXBsYXRlcyxcbiAgbWlzc2luZ1JlbGF0aW9uc2hpcEluZmVyZW5jZTogbWlzc2luZ1JlbGF0aW9uc2hpcEluZmVyZW5jZSxcbiAgaW5mZXJSZWxhdGlvbnNoaXBzOiBpbmZlclJlbGF0aW9uc2hpcHMsXG4gIGdldFJlbGF0aW9uc2hpcHNXaXRoUGVyc29uSWRzOiBnZXRSZWxhdGlvbnNoaXBzV2l0aFBlcnNvbklkcyxcbiAgZ2V0UGVvcGxlSWRzTWlzc2luZ1JlbGF0aW9uc2hpcHNXaXRoUGVyc29uOiBnZXRQZW9wbGVJZHNNaXNzaW5nUmVsYXRpb25zaGlwc1dpdGhQZXJzb24sXG4gIGdldFJlbGF0aW9uc2hpcFR5cGU6IGdldFJlbGF0aW9uc2hpcFR5cGUsXG4gIGZpbmROZXh0TWlzc2luZ1JlbGF0aW9uc2hpcDogZmluZE5leHRNaXNzaW5nUmVsYXRpb25zaGlwLFxuXG4gIGFkZFVwZGF0ZVBlcnNvbmFsRGV0YWlsc0RPQjogYWRkVXBkYXRlUGVyc29uYWxEZXRhaWxzRE9CLFxuICBnZXRQZXJzb25hbERldGFpbHNGb3I6IGdldFBlcnNvbmFsRGV0YWlsc0ZvcixcbiAgYWRkVXBkYXRlTWFyaXRhbFN0YXR1czogYWRkVXBkYXRlTWFyaXRhbFN0YXR1cyxcbiAgYWRkVXBkYXRlQ291bnRyeTogYWRkVXBkYXRlQ291bnRyeSxcbiAgYWRkVXBkYXRlT3JpZW50YXRpb246IGFkZFVwZGF0ZU9yaWVudGF0aW9uLFxuICBhZGRVcGRhdGVTYWxhcnk6IGFkZFVwZGF0ZVNhbGFyeSxcblxuICBwZXJzb25hbERldGFpbHNNYXJpdGFsU3RhdHVzTWFwOiBwZXJzb25hbERldGFpbHNNYXJpdGFsU3RhdHVzTWFwLFxuICBwZXJzb25hbERldGFpbHNDb3VudHJ5TWFwOiBwZXJzb25hbERldGFpbHNDb3VudHJ5TWFwLFxuICBwZXJzb25hbERldGFpbHNPcmllbnRhdGlvbk1hcDogcGVyc29uYWxEZXRhaWxzT3JpZW50YXRpb25NYXAsXG5cbiAgY3JlYXRlUGluRm9yOiBjcmVhdGVQaW5Gb3IsXG4gIGdldFBpbkZvcjogZ2V0UGluRm9yLFxuICB1bnNldFBpbkZvcjogdW5zZXRQaW5Gb3IsXG5cbiAgc2V0QW5zd2VyaW5nSW5kaXZpZHVhbEJ5UHJveHk6IHNldEFuc3dlcmluZ0luZGl2aWR1YWxCeVByb3h5LFxuICBnZXRBbnN3ZXJpbmdJbmRpdmlkdWFsQnlQcm94eTogZ2V0QW5zd2VyaW5nSW5kaXZpZHVhbEJ5UHJveHksXG5cbiAgZG9JTGl2ZUhlcmU6IGRvSUxpdmVIZXJlLFxuXG4gIEtFWVM6IHtcbiAgICBIT1VTRUhPTERfTUVNQkVSU19TVE9SQUdFX0tFWTogSE9VU0VIT0xEX01FTUJFUlNfU1RPUkFHRV9LRVksXG4gICAgVVNFUl9TVE9SQUdFX0tFWTogVVNFUl9TVE9SQUdFX0tFWSxcbiAgICBJTkRJVklEVUFMX1BST1hZX1NUT1JBR0VfS0VZOiBJTkRJVklEVUFMX1BST1hZX1NUT1JBR0VfS0VZLFxuICAgIEhPVVNFSE9MRF9NRU1CRVJfVFlQRTogSE9VU0VIT0xEX01FTUJFUl9UWVBFLFxuICAgIFZJU0lUT1JfVFlQRTogVklTSVRPUl9UWVBFLFxuICAgIFJFTEFUSU9OU0hJUFNfU1RPUkFHRV9LRVk6IFJFTEFUSU9OU0hJUFNfU1RPUkFHRV9LRVksXG4gICAgUEVSU09OQUxfREVUQUlMU19LRVk6IFBFUlNPTkFMX0RFVEFJTFNfS0VZXG4gIH0sXG5cbiAgSURTOiB7XG4gICAgVVNFUl9IT1VTRUhPTERfTUVNQkVSX0lEOiBVU0VSX0hPVVNFSE9MRF9NRU1CRVJfSURcbiAgfSxcblxuICBUWVBFUzoge1xuICAgIHBlcnNvbjogcGVyc29uLFxuICAgIHJlbGF0aW9uc2hpcDogcmVsYXRpb25zaGlwXG4gIH1cbn07XG5cbndpbmRvdy5PTlMuaGVscGVycyA9IHtcbiAgcG9wdWxhdGVIb3VzZWhvbGRMaXN0OiBwb3B1bGF0ZUhvdXNlaG9sZExpc3QsXG4gIHBvcHVsYXRlVmlzaXRvckxpc3Q6IHBvcHVsYXRlVmlzaXRvckxpc3Rcbn07XG5cbndpbmRvdy5PTlMudXRpbHMgPSB7XG4gIHJlbW92ZUZyb21MaXN0OiByZW1vdmVGcm9tTGlzdCxcbiAgdHJhaWxpbmdOYW1lUzogdHJhaWxpbmdOYW1lUyxcbiAgbnVtYmVyVG9Qb3NpdGlvbldvcmQ6IG51bWJlclRvUG9zaXRpb25Xb3JkLFxuICBudW1iZXJUb1dvcmRzU3R5bGVndWlkZTogbnVtYmVyVG9Xb3Jkc1N0eWxlZ3VpZGUsXG4gIGdldFNpZ25pZmljYW50OiBnZXRTaWduaWZpY2FudFxufTtcblxuJChwb3B1bGF0ZUhvdXNlaG9sZExpc3QpO1xuJChwb3B1bGF0ZVZpc2l0b3JMaXN0KTtcbiQodXBkYXRlSG91c2Vob2xkVmlzaXRvcnNOYXZpZ2F0aW9uSXRlbXMpO1xuJCh1cGRhdGVBZGRyZXNzZXMpO1xuJCh1cGRhdGVQZXJzb25MaW5rKTtcbiQodG9vbHMpO1xuJCh1cGRhdGVBbGxQcmV2aW91c0xpbmtzKTtcbiQodXBkYXRlQnlTdXJ2ZXlUeXBlKTtcbiQodXBkYXRlU2lnbmlmaWNhbnREYXRlKTtcblxuZXhwb3J0cy5VU0VSX1NUT1JBR0VfS0VZID0gVVNFUl9TVE9SQUdFX0tFWTtcbmV4cG9ydHMuSU5ESVZJRFVBTF9QUk9YWV9TVE9SQUdFX0tFWSA9IElORElWSURVQUxfUFJPWFlfU1RPUkFHRV9LRVk7XG5leHBvcnRzLmdldEFkZHJlc3MgPSBnZXRBZGRyZXNzO1xuZXhwb3J0cy5hZGRVc2VyUGVyc29uID0gYWRkVXNlclBlcnNvbjtcbmV4cG9ydHMuZ2V0VXNlclBlcnNvbiA9IGdldFVzZXJQZXJzb247XG4iXX0=
