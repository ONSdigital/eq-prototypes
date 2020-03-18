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

  userAsHouseholdMember ? updateHouseholdMember(_extends({}, userAsHouseholdMember['@person'], person), memberData) : addHouseholdMember(person, memberData, USER_HOUSEHOLD_MEMBER_ID);
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
  'perm-away': 'People who work away from home within the UK if this is their permanent or family home',
  'armed-forces': 'Members of the armed forces if this is their permanent or family home',
  'less-twelve': 'People who are temporarily outside the UK for less than 12 months',
  'usually-temp': 'People staying temporarily who usually live in the UK but' + ' do not have another UK address for example, relatives, friends',
  'other': 'Other people who usually live here but are temporarily away'
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

var personalDetailsGenderMap = {
  'male': {
    description: 'Male'
  },
  'female': {
    description: 'Female'
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

function addUpdateSex(personId, val) {
  var allDetails = getAllPersonalDetails(),
      details = allDetails[personId] || {};

  details['sex'] = val;

  updatePersonalDetails(personId, details);

  return details;
}

function addUpdateAddressWhere(personId, val) {
  var allDetails = getAllPersonalDetails(),
      details = allDetails[personId] || {};

  details['address-where'] = val;

  updatePersonalDetails(personId, details);

  return details;
}

function addUpdateAge(personId, val, _ref) {
  var _ref$isApproximate = _ref.isApproximate,
      isApproximate = _ref$isApproximate === undefined ? false : _ref$isApproximate;

  var allDetails = getAllPersonalDetails(),
      details = allDetails[personId] || {};

  details['age'] = {
    val: val,
    isApproximate: isApproximate
  };

  updatePersonalDetails(personId, details);

  return details;
}

function addUpdateAddressOutsideUK(personId, val) {
  var allDetails = getAllPersonalDetails(),
      details = allDetails[personId] || {};

  details['address-outside-uk'] = val;

  updatePersonalDetails(personId, details);

  return details;
}

function addUpdateAddressIndividual(personId, val) {
  var allDetails = getAllPersonalDetails(),
      details = allDetails[personId] || {};

  details['address'] = val;

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
  return '3 February 2019';
}

function updateSignificantDate() {
  $('.js-significant-date').html(getSignificant());
}

function personRecordTemplate() {
  return $('<li id="person-record-template" class="list__item">\n        <span class="list__item-name js-person-name"></span>\n        <div class="list__item-actions u-fr">\n            <span class="list__item-action">\n                <a class="js-record-edit" href="#">Change or remove</a>\n            </span>\n        </div>\n    </li>');
}

function createMemberItem(member) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { redirect: null },
      redirect = _ref.redirect;

  var $nodeEl = personRecordTemplate(),
      urlParams = new URLSearchParams(window.location.search),
      personNameText = member['@person'].fullName,
      memberIsUser = isMemberUser(member),
      surveyType = urlParams.get('survey'),
      altPage = surveyType && surveyType === 'lms' ? surveyType + '/' : '';

  if (memberIsUser) {
    personNameText += ' (You)';
  }

  $nodeEl.attr('id', '');
  $nodeEl.find('.js-person-name').html(personNameText);

  $nodeEl.find('.js-record-edit').attr('href', (memberIsUser ? '../' + altPage + 'what-is-your-name/?edit=true' : '../' + altPage + 'who-else-to-add/?edit=' + member['@person'].id + (isVisitor(member) ? '&journey=visitors' : '')) + (redirect ? '&redirect=' + encodeURIComponent(window.location.href) : ''));

  return $nodeEl;
}

function updateHouseholdSummary() {
  var members = getAllHouseholdMembers();

  $('.js-household-members-summary').each(function (i, el) {
    var $el = $(el);

    $.each([].concat(toConsumableArray(members.filter(isMemberUser)), toConsumableArray(members.filter(isOtherHouseholdMember))), function (i, member) {
      $el.append(createMemberItem(member, { redirect: $el.attr('data-redirect') }));
    });
  });
}

function updateVisitorsSummary() {
  var members = getAllHouseholdMembers();

  $('.js-visitors-summary').each(function (i, el) {
    var $el = $(el);

    $.each(members.filter(isVisitor), function (i, member) {
      $el.append(createMemberItem(member, { redirect: $el.attr('data-redirect') }));
    });
  });
}

function isMemberUser(member) {
  return member['@person'].id === window.ONS.storage.IDS.USER_HOUSEHOLD_MEMBER_ID;
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
  addUpdateSex: addUpdateSex,
  addUpdateAddressWhere: addUpdateAddressWhere,
  addUpdateAddressIndividual: addUpdateAddressIndividual,
  addUpdateAge: addUpdateAge,
  addUpdateAddressOutsideUK: addUpdateAddressOutsideUK,

  personalDetailsMaritalStatusMap: personalDetailsMaritalStatusMap,
  personalDetailsCountryMap: personalDetailsCountryMap,
  personalDetailsOrientationMap: personalDetailsOrientationMap,
  personalDetailsGenderMap: personalDetailsGenderMap,

  createPinFor: createPinFor,
  getPinFor: getPinFor,
  unsetPinFor: unsetPinFor,

  setAnsweringIndividualByProxy: setAnsweringIndividualByProxy,
  getAnsweringIndividualByProxy: getAnsweringIndividualByProxy,

  doILiveHere: doILiveHere,
  isMemberUser: isMemberUser,

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
$(updateHouseholdSummary);
$(updateVisitorsSummary);

exports.USER_STORAGE_KEY = USER_STORAGE_KEY;
exports.INDIVIDUAL_PROXY_STORAGE_KEY = INDIVIDUAL_PROXY_STORAGE_KEY;
exports.getAddress = getAddress;
exports.addUserPerson = addUserPerson;
exports.getUserPerson = getUserPerson;

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJfcHJvdG90eXBlcy95b3VyLWhvdXNlaG9sZC12MTEtY3kvYnVuZGxlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG5cbmZ1bmN0aW9uIGF1dG9JbmNyZW1lbnRJZChjb2xsZWN0aW9uKSB7XG4gIHZhciBrID0gY29sbGVjdGlvbiArICctaW5jcmVtZW50JyxcbiAgICAgIGlkID0gcGFyc2VJbnQoc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbShrKSkgfHwgMDtcblxuICBpZCsrO1xuXG4gIHNlc3Npb25TdG9yYWdlLnNldEl0ZW0oaywgSlNPTi5zdHJpbmdpZnkoaWQpKTtcblxuICByZXR1cm4gaWQ7XG59XG5cbmZ1bmN0aW9uIHJlbW92ZUZyb21MaXN0KGxpc3QsIHZhbCkge1xuXG4gIGZ1bmN0aW9uIGRvUmVtb3ZlKGl0ZW0pIHtcbiAgICB2YXIgZm91bmRJZCA9IGxpc3QuaW5kZXhPZihpdGVtKTtcblxuICAgIC8qKlxuICAgICAqIEd1YXJkXG4gICAgICovXG4gICAgaWYgKGZvdW5kSWQgPT09IC0xKSB7XG4gICAgICBjb25zb2xlLmxvZygnQXR0ZW1wdCB0byByZW1vdmUgZnJvbSBsaXN0IGZhaWxlZDogJywgbGlzdCwgdmFsKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBsaXN0LnNwbGljZShmb3VuZElkLCAxKTtcbiAgfVxuXG4gIGlmIChfLmlzQXJyYXkodmFsKSkge1xuICAgICQuZWFjaCh2YWwsIGZ1bmN0aW9uIChpLCBpdGVtKSB7XG4gICAgICBkb1JlbW92ZShpdGVtKTtcbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICBkb1JlbW92ZSh2YWwpO1xuICB9XG59XG5cbmZ1bmN0aW9uIHRyYWlsaW5nTmFtZVMobmFtZSkge1xuICByZXR1cm4gbmFtZVtuYW1lLmxlbmd0aCAtIDFdID09PSAncycgPyAnXFwmI3gyMDE5OycgOiAnXFwmI3gyMDE5O3MnO1xufVxuXG52YXIgZGVmaW5lUHJvcGVydHkgPSBmdW5jdGlvbiAob2JqLCBrZXksIHZhbHVlKSB7XG4gIGlmIChrZXkgaW4gb2JqKSB7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwga2V5LCB7XG4gICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgd3JpdGFibGU6IHRydWVcbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICBvYmpba2V5XSA9IHZhbHVlO1xuICB9XG5cbiAgcmV0dXJuIG9iajtcbn07XG5cbnZhciBfZXh0ZW5kcyA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gKHRhcmdldCkge1xuICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaV07XG5cbiAgICBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7XG4gICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHNvdXJjZSwga2V5KSkge1xuICAgICAgICB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0YXJnZXQ7XG59O1xuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cbnZhciB0b0NvbnN1bWFibGVBcnJheSA9IGZ1bmN0aW9uIChhcnIpIHtcbiAgaWYgKEFycmF5LmlzQXJyYXkoYXJyKSkge1xuICAgIGZvciAodmFyIGkgPSAwLCBhcnIyID0gQXJyYXkoYXJyLmxlbmd0aCk7IGkgPCBhcnIubGVuZ3RoOyBpKyspIGFycjJbaV0gPSBhcnJbaV07XG5cbiAgICByZXR1cm4gYXJyMjtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gQXJyYXkuZnJvbShhcnIpO1xuICB9XG59O1xuXG52YXIgSE9VU0VIT0xEX01FTUJFUlNfU1RPUkFHRV9LRVkgPSAnaG91c2Vob2xkLW1lbWJlcnMnO1xudmFyIFVTRVJfSE9VU0VIT0xEX01FTUJFUl9JRCA9ICdwZXJzb25fbWUnO1xudmFyIEhPVVNFSE9MRF9NRU1CRVJfVFlQRSA9ICdob3VzZWhvbGQtbWVtYmVyJztcbnZhciBWSVNJVE9SX1RZUEUgPSAndmlzaXRvcic7XG5cbi8qKlxuICogVHlwZXNcbiAqL1xuZnVuY3Rpb24gcGVyc29uKG9wdHMpIHtcbiAgaWYgKG9wdHMuZmlyc3ROYW1lID09PSAnJyB8fCBvcHRzLmxhc3ROYW1lID09PSAnJykge1xuICAgIGNvbnNvbGUubG9nKCdVbmFibGUgdG8gY3JlYXRlIHBlcnNvbiB3aXRoIGRhdGE6ICcsIG9wdHMuZmlyc3ROYW1lLCAhb3B0cy5taWRkbGVOYW1lLCAhb3B0cy5sYXN0TmFtZSk7XG4gIH1cblxuICB2YXIgbWlkZGxlTmFtZSA9IG9wdHMubWlkZGxlTmFtZSB8fCAnJztcblxuICByZXR1cm4ge1xuICAgIGZ1bGxOYW1lOiBvcHRzLmZpcnN0TmFtZSArICcgJyArIG1pZGRsZU5hbWUgKyAnICcgKyBvcHRzLmxhc3ROYW1lLFxuICAgIGZpcnN0TmFtZTogb3B0cy5maXJzdE5hbWUsXG4gICAgbWlkZGxlTmFtZTogbWlkZGxlTmFtZSxcbiAgICBsYXN0TmFtZTogb3B0cy5sYXN0TmFtZVxuICB9O1xufVxuXG4vKipcbiAqIFN0b3JhZ2VcbiAqL1xuZnVuY3Rpb24gZ2V0VXNlckFzSG91c2Vob2xkTWVtYmVyKCkge1xuICByZXR1cm4gZ2V0QWxsSG91c2Vob2xkTWVtYmVycygpLmZpbmQoZnVuY3Rpb24gKG1lbWJlcikge1xuICAgIHJldHVybiBtZW1iZXJbJ0BwZXJzb24nXS5pZCA9PT0gVVNFUl9IT1VTRUhPTERfTUVNQkVSX0lEO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gZGVsZXRlVXNlckFzSG91c2Vob2xkTWVtYmVyKCkge1xuICBkZWxldGVIb3VzZWhvbGRNZW1iZXIoVVNFUl9IT1VTRUhPTERfTUVNQkVSX0lEKTtcbn1cblxuZnVuY3Rpb24gZGVsZXRlSG91c2Vob2xkTWVtYmVyKHBlcnNvbklkKSB7XG4gIHZhciBtZW1iZXJzID0gZ2V0QWxsSG91c2Vob2xkTWVtYmVycygpLmZpbHRlcihmdW5jdGlvbiAobWVtYmVyKSB7XG4gICAgcmV0dXJuIG1lbWJlclsnQHBlcnNvbiddLmlkICE9PSBwZXJzb25JZDtcbiAgfSk7XG5cbiAgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbShIT1VTRUhPTERfTUVNQkVSU19TVE9SQUdFX0tFWSwgSlNPTi5zdHJpbmdpZnkobWVtYmVycykpO1xufVxuXG5mdW5jdGlvbiB1cGRhdGVVc2VyQXNIb3VzZWhvbGRNZW1iZXIocGVyc29uLCBtZW1iZXJEYXRhKSB7XG4gIHZhciB1c2VyQXNIb3VzZWhvbGRNZW1iZXIgPSBnZXRVc2VyQXNIb3VzZWhvbGRNZW1iZXIoKTtcblxuICB1c2VyQXNIb3VzZWhvbGRNZW1iZXIgPyB1cGRhdGVIb3VzZWhvbGRNZW1iZXIoX2V4dGVuZHMoe30sIHVzZXJBc0hvdXNlaG9sZE1lbWJlclsnQHBlcnNvbiddLCBwZXJzb24pLCBtZW1iZXJEYXRhKSA6IGFkZEhvdXNlaG9sZE1lbWJlcihwZXJzb24sIG1lbWJlckRhdGEsIFVTRVJfSE9VU0VIT0xEX01FTUJFUl9JRCk7XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZUhvdXNlaG9sZE1lbWJlcihwZXJzb24sIG1lbWJlckRhdGEpIHtcbiAgdmFyIG1lbWJlcnNVcGRhdGVkID0gZ2V0QWxsSG91c2Vob2xkTWVtYmVycygpLm1hcChmdW5jdGlvbiAobWVtYmVyKSB7XG4gICAgcmV0dXJuIG1lbWJlclsnQHBlcnNvbiddLmlkID09PSBwZXJzb24uaWQgPyBfZXh0ZW5kcyh7fSwgbWVtYmVyLCBtZW1iZXJEYXRhLCB7ICdAcGVyc29uJzogX2V4dGVuZHMoe30sIG1lbWJlclsnQHBlcnNvbiddLCBwZXJzb24pIH0pIDogbWVtYmVyO1xuICB9KTtcblxuICBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKEhPVVNFSE9MRF9NRU1CRVJTX1NUT1JBR0VfS0VZLCBKU09OLnN0cmluZ2lmeShtZW1iZXJzVXBkYXRlZCkpO1xufVxuXG5mdW5jdGlvbiBhZGRIb3VzZWhvbGRNZW1iZXIocGVyc29uLCBtZW1iZXJEYXRhLCBpZCkge1xuICB2YXIgcGVvcGxlID0gZ2V0QWxsSG91c2Vob2xkTWVtYmVycygpIHx8IFtdO1xuICBtZW1iZXJEYXRhID0gbWVtYmVyRGF0YSB8fCB7fTtcblxuICAvKipcbiAgICogVXNlciBpcyBhbHdheXMgZmlyc3QgaW4gdGhlIGhvdXNlaG9sZCBsaXN0XG4gICAqL1xuICBwZW9wbGVbaWQgPT09IFVTRVJfSE9VU0VIT0xEX01FTUJFUl9JRCA/ICd1bnNoaWZ0JyA6ICdwdXNoJ10oX2V4dGVuZHMoe30sIG1lbWJlckRhdGEsIHtcbiAgICB0eXBlOiBtZW1iZXJEYXRhLnR5cGUgfHwgSE9VU0VIT0xEX01FTUJFUl9UWVBFLFxuICAgICdAcGVyc29uJzogX2V4dGVuZHMoe30sIHBlcnNvbiwge1xuICAgICAgaWQ6IGlkIHx8ICdwZXJzb24nICsgYXV0b0luY3JlbWVudElkKCdob3VzZWhvbGQtbWVtYmVycycpXG4gICAgfSlcbiAgfSkpO1xuXG4gIHNlc3Npb25TdG9yYWdlLnNldEl0ZW0oSE9VU0VIT0xEX01FTUJFUlNfU1RPUkFHRV9LRVksIEpTT04uc3RyaW5naWZ5KHBlb3BsZSkpO1xufVxuXG5mdW5jdGlvbiBnZXRBbGxIb3VzZWhvbGRNZW1iZXJzKCkge1xuICByZXR1cm4gSlNPTi5wYXJzZShzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKEhPVVNFSE9MRF9NRU1CRVJTX1NUT1JBR0VfS0VZKSkgfHwgW107XG59XG5cbmZ1bmN0aW9uIGdldEhvdXNlaG9sZE1lbWJlckJ5UGVyc29uSWQoaWQpIHtcbiAgcmV0dXJuIGdldEFsbEhvdXNlaG9sZE1lbWJlcnMoKS5maW5kKGZ1bmN0aW9uIChtZW1iZXIpIHtcbiAgICByZXR1cm4gbWVtYmVyWydAcGVyc29uJ10uaWQgPT09IGlkO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gZ2V0TWVtYmVyUGVyc29uSWQobWVtYmVyKSB7XG4gIHJldHVybiBtZW1iZXJbJ0BwZXJzb24nXS5pZDtcbn1cblxuLyoqXG4gKiBDb21wYXJhdG9yc1xuICovXG5mdW5jdGlvbiBpc1Zpc2l0b3IobWVtYmVyKSB7XG4gIHJldHVybiBtZW1iZXIudHlwZSA9PT0gd2luZG93Lk9OUy5zdG9yYWdlLktFWVMuVklTSVRPUl9UWVBFO1xufVxuXG5mdW5jdGlvbiBpc0hvdXNlaG9sZE1lbWJlcihtZW1iZXIpIHtcbiAgcmV0dXJuIG1lbWJlci50eXBlID09PSB3aW5kb3cuT05TLnN0b3JhZ2UuS0VZUy5IT1VTRUhPTERfTUVNQkVSX1RZUEU7XG59XG5cbmZ1bmN0aW9uIGlzT3RoZXJIb3VzZWhvbGRNZW1iZXIobWVtYmVyKSB7XG4gIHJldHVybiBtZW1iZXIudHlwZSA9PT0gd2luZG93Lk9OUy5zdG9yYWdlLktFWVMuSE9VU0VIT0xEX01FTUJFUl9UWVBFICYmIG1lbWJlclsnQHBlcnNvbiddLmlkICE9PSB3aW5kb3cuT05TLnN0b3JhZ2UuSURTLlVTRVJfSE9VU0VIT0xEX01FTUJFUl9JRDtcbn1cblxudmFyIHRlbXBBd2F5UXVlc3Rpb25TZW50ZW5jZU1hcCA9IHtcbiAgJ3RocmVlLW1vcmUnOiAnUGVvcGxlIHdobyB1c3VhbGx5IGxpdmUgb3V0c2lkZSB0aGUgVUsgd2hvIGFyZSBzdGF5aW5nIGluIHRoZSBVSyBmb3IgMyBtb250aHMgb3IgbW9yZScsXG4gICdwZXJtLWF3YXknOiAnUGVvcGxlIHdobyB3b3JrIGF3YXkgZnJvbSBob21lIHdpdGhpbiB0aGUgVUsgaWYgdGhpcyBpcyB0aGVpciBwZXJtYW5lbnQgb3IgZmFtaWx5IGhvbWUnLFxuICAnYXJtZWQtZm9yY2VzJzogJ01lbWJlcnMgb2YgdGhlIGFybWVkIGZvcmNlcyBpZiB0aGlzIGlzIHRoZWlyIHBlcm1hbmVudCBvciBmYW1pbHkgaG9tZScsXG4gICdsZXNzLXR3ZWx2ZSc6ICdQZW9wbGUgd2hvIGFyZSB0ZW1wb3JhcmlseSBvdXRzaWRlIHRoZSBVSyBmb3IgbGVzcyB0aGFuIDEyIG1vbnRocycsXG4gICd1c3VhbGx5LXRlbXAnOiAnUGVvcGxlIHN0YXlpbmcgdGVtcG9yYXJpbHkgd2hvIHVzdWFsbHkgbGl2ZSBpbiB0aGUgVUsgYnV0JyArICcgZG8gbm90IGhhdmUgYW5vdGhlciBVSyBhZGRyZXNzIGZvciBleGFtcGxlLCByZWxhdGl2ZXMsIGZyaWVuZHMnLFxuICAnb3RoZXInOiAnT3RoZXIgcGVvcGxlIHdobyB1c3VhbGx5IGxpdmUgaGVyZSBidXQgYXJlIHRlbXBvcmFyaWx5IGF3YXknXG59O1xuXG52YXIgdmlzaXRvclF1ZXN0aW9uU2VudGVuY2VNYXAgPSB7XG4gICd1c3VhbGx5LWluLXVrJzogJ1Blb3BsZSB3aG8gdXN1YWxseSBsaXZlIHNvbWV3aGVyZSBlbHNlIGluIHRoZSBVSywgZm9yIGV4YW1wbGUgYm95L2dpcmxmcmllbmRzLCBmcmllbmRzIG9yIHJlbGF0aXZlcycsXG4gICdzZWNvbmQtYWRkcmVzcyc6ICdQZW9wbGUgc3RheWluZyBoZXJlIGJlY2F1c2UgaXQgaXMgdGhlaXIgc2Vjb25kIGFkZHJlc3MsIGZvciBleGFtcGxlLCBmb3Igd29yay4gVGhlaXIgcGVybWFuZW50IG9yIGZhbWlseSBob21lIGlzIGVsc2V3aGVyZScsXG4gICdsZXNzLXRocmVlJzogJ1Blb3BsZSB3aG8gdXN1YWxseSBsaXZlIG91dHNpZGUgdGhlIFVLIHdobyBhcmUgc3RheWluZyBpbiB0aGUgVUsgZm9yIGxlc3MgdGhhbiB0aHJlZSBtb250aHMnLFxuICAnb24taG9saWRheSc6ICdQZW9wbGUgaGVyZSBvbiBob2xpZGF5J1xufTtcblxuLyoqXG4gKiBBdWdtZW50IFVuZGVyc2NvcmUgbGlicmFyeVxuICovXG52YXIgXyQxID0gd2luZG93Ll8gfHwge307XG5cbnZhciBSRUxBVElPTlNISVBTX1NUT1JBR0VfS0VZID0gJ3JlbGF0aW9uc2hpcHMnO1xuXG52YXIgcmVsYXRpb25zaGlwVHlwZXMgPSB7XG4gICdzcG91c2UnOiB7IGlkOiAnc3BvdXNlJyB9LFxuICAnY2hpbGQtcGFyZW50JzogeyBpZDogJ2NoaWxkLXBhcmVudCcgfSxcbiAgJ3N0ZXAtY2hpbGQtcGFyZW50JzogeyBpZDogJ3N0ZXAtY2hpbGQtcGFyZW50JyB9LFxuICAnZ3JhbmRjaGlsZC1ncmFuZHBhcmVudCc6IHsgaWQ6ICdncmFuZGNoaWxkLWdyYW5kcGFyZW50JyB9LFxuICAnaGFsZi1zaWJsaW5nJzogeyBpZDogJ2hhbGYtc2libGluZycgfSxcbiAgJ3NpYmxpbmcnOiB7IGlkOiAnc2libGluZycgfSxcbiAgJ3N0ZXAtYnJvdGhlci1zaXN0ZXInOiB7IGlkOiAnc3RlcC1icm90aGVyLXNpc3RlcicgfSxcbiAgJ3BhcnRuZXInOiB7IGlkOiAncGFydG5lcicgfSxcbiAgJ3VucmVsYXRlZCc6IHsgaWQ6ICd1bnJlbGF0ZWQnIH0sXG4gICdvdGhlci1yZWxhdGlvbic6IHsgaWQ6ICdvdGhlci1yZWxhdGlvbicgfVxufTtcblxudmFyIHJlbGF0aW9uc2hpcERlc2NyaXB0aW9uTWFwID0ge1xuICAvLyBjb3ZlcmVkXG4gICdodXNiYW5kLXdpZmUnOiB7XG4gICAgc2VudGFuY2VMYWJlbDogJ2h1c2JhbmQgb3Igd2lmZScsXG4gICAgc3VtbWFyeUFkamVjdGl2ZTogJ2h1c2JhbmQgb3Igd2lmZScsXG4gICAgdHlwZTogcmVsYXRpb25zaGlwVHlwZXNbJ3Nwb3VzZSddXG4gIH0sXG4gIC8vIGNvdmVyZWRcbiAgJ21vdGhlci1mYXRoZXInOiB7XG4gICAgc2VudGFuY2VMYWJlbDogJ21vdGhlciBvciBmYXRoZXInLFxuICAgIHN1bW1hcnlBZGplY3RpdmU6ICdtb3RoZXIgb3IgZmF0aGVyJyxcbiAgICB0eXBlOiByZWxhdGlvbnNoaXBUeXBlc1snY2hpbGQtcGFyZW50J11cbiAgfSxcbiAgLy8gY292ZXJlZFxuICAnc3RlcC1tb3RoZXItZmF0aGVyJzoge1xuICAgIHNlbnRhbmNlTGFiZWw6ICdzdGVwbW90aGVyIG9yIHN0ZXBmYXRoZXInLFxuICAgIHN1bW1hcnlBZGplY3RpdmU6ICdzdGVwbW90aGVyIG9yIHN0ZXBmYXRoZXInLFxuICAgIHR5cGU6IHJlbGF0aW9uc2hpcFR5cGVzWydzdGVwLWNoaWxkLXBhcmVudCddXG4gIH0sXG4gIC8vIGNvdmVyZWRcbiAgJ3Nvbi1kYXVnaHRlcic6IHtcbiAgICBzZW50YW5jZUxhYmVsOiAnc29uIG9yIGRhdWdodGVyJyxcbiAgICBzdW1tYXJ5QWRqZWN0aXZlOiAnc29uIG9yIGRhdWdodGVyJyxcbiAgICB0eXBlOiByZWxhdGlvbnNoaXBUeXBlc1snY2hpbGQtcGFyZW50J11cbiAgfSxcbiAgLy8gY292ZXJlZFxuICAnaGFsZi1icm90aGVyLXNpc3Rlcic6IHtcbiAgICBzZW50YW5jZUxhYmVsOiAnaGFsZi1icm90aGVyIG9yIGhhbGYtc2lzdGVyJyxcbiAgICBzdW1tYXJ5QWRqZWN0aXZlOiAnaGFsZi1icm90aGVyIG9yIGhhbGYtc2lzdGVyJyxcbiAgICB0eXBlOiByZWxhdGlvbnNoaXBUeXBlc1snaGFsZi1zaWJsaW5nJ11cbiAgfSxcbiAgLy8gY292ZXJlZFxuICAnc3RlcC1jaGlsZCc6IHtcbiAgICBzZW50YW5jZUxhYmVsOiAnc3RlcGNoaWxkJyxcbiAgICBzdW1tYXJ5QWRqZWN0aXZlOiAnc3RlcGNoaWxkJyxcbiAgICB0eXBlOiByZWxhdGlvbnNoaXBUeXBlc1snc3RlcC1jaGlsZC1wYXJlbnQnXVxuICB9LFxuICAvLyBjb3ZlcmVkXG4gICdncmFuZHBhcmVudCc6IHtcbiAgICBzZW50YW5jZUxhYmVsOiAnZ3JhbmRwYXJlbnQnLFxuICAgIHN1bW1hcnlBZGplY3RpdmU6ICdncmFuZHBhcmVudCcsXG4gICAgdHlwZTogcmVsYXRpb25zaGlwVHlwZXNbJ2dyYW5kY2hpbGQtZ3JhbmRwYXJlbnQnXVxuICB9LFxuICAvLyBjb3ZlcmVkXG4gICdncmFuZGNoaWxkJzoge1xuICAgIHNlbnRhbmNlTGFiZWw6ICdncmFuZGNoaWxkJyxcbiAgICBzdW1tYXJ5QWRqZWN0aXZlOiAnZ3JhbmRjaGlsZCcsXG4gICAgdHlwZTogcmVsYXRpb25zaGlwVHlwZXNbJ2dyYW5kY2hpbGQtZ3JhbmRwYXJlbnQnXVxuICB9LFxuICAvLyBjb3ZlcmVkXG4gICdicm90aGVyLXNpc3Rlcic6IHtcbiAgICBzZW50YW5jZUxhYmVsOiAnYnJvdGhlciBvciBzaXN0ZXInLFxuICAgIHN1bW1hcnlBZGplY3RpdmU6ICdicm90aGVyIG9yIHNpc3RlcicsXG4gICAgdHlwZTogcmVsYXRpb25zaGlwVHlwZXNbJ3NpYmxpbmcnXVxuICB9LFxuICAvLyBjb3ZlcmVkXG4gICdzdGVwLWJyb3RoZXItc2lzdGVyJzoge1xuICAgIHNlbnRhbmNlTGFiZWw6ICdzdGVwYnJvdGhlciBvciBzdGVwc2lzdGVyJyxcbiAgICBzdW1tYXJ5QWRqZWN0aXZlOiAnc3RlcGJyb3RoZXIgb3Igc3RlcHNpc3RlcicsXG4gICAgdHlwZTogcmVsYXRpb25zaGlwVHlwZXNbJ3N0ZXAtYnJvdGhlci1zaXN0ZXInXVxuICB9LFxuICAvLyBjb3ZlcmVkXG4gICdvdGhlci1yZWxhdGlvbic6IHtcbiAgICBzZW50YW5jZUxhYmVsOiAnb3RoZXIgcmVsYXRpb24nLFxuICAgIHN1bW1hcnlBZGplY3RpdmU6ICdyZWxhdGVkJyxcbiAgICB0eXBlOiByZWxhdGlvbnNoaXBUeXBlc1snb3RoZXItcmVsYXRpb24nXVxuICB9LFxuICAvLyBjb3ZlcmVkXG4gICdwYXJ0bmVyJzoge1xuICAgIHNlbnRhbmNlTGFiZWw6ICdwYXJ0bmVyJyxcbiAgICBzdW1tYXJ5QWRqZWN0aXZlOiAncGFydG5lcicsXG4gICAgdHlwZTogcmVsYXRpb25zaGlwVHlwZXNbJ3BhcnRuZXInXVxuICB9LFxuICAnc2FtZS1zZXgtcGFydG5lcic6IHtcbiAgICBzZW50YW5jZUxhYmVsOiAnbGVnYWxseSByZWdpc3RlcmVkIGNpdmlsIHBhcnRuZXInLFxuICAgIHN1bW1hcnlBZGplY3RpdmU6ICdsZWdhbGx5IHJlZ2lzdGVyZWQgY2l2aWwgcGFydG5lcicsXG4gICAgdHlwZTogcmVsYXRpb25zaGlwVHlwZXNbJ3BhcnRuZXInXVxuICB9LFxuICAvLyBjb3ZlcmVkXG4gICd1bnJlbGF0ZWQnOiB7XG4gICAgc2VudGFuY2VMYWJlbDogJ3VucmVsYXRlZCcsXG4gICAgc3VtbWFyeUFkamVjdGl2ZTogJ3VucmVsYXRlZCcsXG4gICAgdHlwZTogcmVsYXRpb25zaGlwVHlwZXNbJ3VucmVsYXRlZCddXG4gIH1cbn07XG5cbmZ1bmN0aW9uIG5hbWVFbGVtZW50KG5hbWUpIHtcbiAgcmV0dXJuICc8c3Ryb25nPicgKyBuYW1lICsgJzwvc3Ryb25nPic7XG59XG5cbmZ1bmN0aW9uIHBlcnNvbkxpc3RTdHIocGVvcGxlQXJyKSB7XG4gIHZhciBvcHRzID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiB7fTtcblxuICBpZiAocGVvcGxlQXJyLmxlbmd0aCA8IDEpIHtcbiAgICBjb25zb2xlLmxvZyhwZW9wbGVBcnIsICdub3QgZW5vdWdoIHBlb3BsZSB0byBjcmVhdGUgYSBsaXN0IHN0cmluZycpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGlmIChwZW9wbGVBcnIubGVuZ3RoID09PSAxKSB7XG4gICAgcmV0dXJuIG5hbWVFbGVtZW50KHBlb3BsZUFyclswXS5mdWxsTmFtZSArIGZvcm1hdFBlcnNvbklmWW91KHBlb3BsZUFyclswXSkpO1xuICB9XG5cbiAgdmFyIHBlb3BsZUNvcHkgPSBbXS5jb25jYXQodG9Db25zdW1hYmxlQXJyYXkocGVvcGxlQXJyKSksXG4gICAgICBsYXN0UGVyc29uID0gcGVvcGxlQ29weS5wb3AoKTtcblxuICByZXR1cm4gcGVvcGxlQ29weS5tYXAoZnVuY3Rpb24gKHBlcnNvbiQkMSkge1xuICAgIHJldHVybiAnJyArIG5hbWVFbGVtZW50KHBlcnNvbiQkMS5mdWxsTmFtZSArIChvcHRzLmlzRmFtaWx5ID8gdHJhaWxpbmdOYW1lUyhwZXJzb24kJDEuZnVsbE5hbWUpIDogJycpICsgZm9ybWF0UGVyc29uSWZZb3UocGVyc29uJCQxKSk7XG4gIH0pLmpvaW4oJywgJykgKyAnIGFuZCAnICsgbmFtZUVsZW1lbnQobGFzdFBlcnNvbi5mdWxsTmFtZSArIChvcHRzLmlzRmFtaWx5ID8gdHJhaWxpbmdOYW1lUyhsYXN0UGVyc29uLmZ1bGxOYW1lKSA6ICcnKSArIGZvcm1hdFBlcnNvbklmWW91KGxhc3RQZXJzb24pKTtcbn1cblxuZnVuY3Rpb24gZm9ybWF0UGVyc29uSWZZb3UocGVyc29uJCQxKSB7XG4gIHJldHVybiBwZXJzb24kJDEuaWQgPT09IFVTRVJfSE9VU0VIT0xEX01FTUJFUl9JRCA/ICcgKFlvdSknIDogJyc7XG59XG5cbnZhciByZWxhdGlvbnNoaXBTdW1tYXJ5VGVtcGxhdGVzID0ge1xuICAncGFydG5lcnNoaXAnOiBmdW5jdGlvbiBwYXJ0bmVyc2hpcChwZXJzb24xLCBwZXJzb24yLCBkZXNjcmlwdGlvbikge1xuICAgIHJldHVybiBuYW1lRWxlbWVudChwZXJzb24xLmZ1bGxOYW1lICsgZm9ybWF0UGVyc29uSWZZb3UocGVyc29uMSkpICsgJyBpcyAnICsgbmFtZUVsZW1lbnQocGVyc29uMi5mdWxsTmFtZSArIHRyYWlsaW5nTmFtZVMocGVyc29uMi5mdWxsTmFtZSkgKyBmb3JtYXRQZXJzb25JZllvdShwZXJzb24yKSkgKyAnICcgKyBkZXNjcmlwdGlvbjtcbiAgfSxcbiAgJ3R3b0ZhbWlseU1lbWJlcnNUb01hbnknOiBmdW5jdGlvbiB0d29GYW1pbHlNZW1iZXJzVG9NYW55KHBhcmVudDEsIHBhcmVudDIsIGNoaWxkcmVuQXJyLCBkZXNjcmlwdGlvbikge1xuICAgIHJldHVybiBuYW1lRWxlbWVudChwYXJlbnQxLmZ1bGxOYW1lICsgZm9ybWF0UGVyc29uSWZZb3UocGFyZW50MSkpICsgJyBhbmQgJyArIG5hbWVFbGVtZW50KHBhcmVudDIuZnVsbE5hbWUgKyBmb3JtYXRQZXJzb25JZllvdShwYXJlbnQyKSkgKyAnIGFyZSAnICsgcGVyc29uTGlzdFN0cihjaGlsZHJlbkFyciwgeyBpc0ZhbWlseTogdHJ1ZSB9KSArICcgJyArIGRlc2NyaXB0aW9uO1xuICB9LFxuICAnb25lRmFtaWx5TWVtYmVyVG9NYW55JzogZnVuY3Rpb24gb25lRmFtaWx5TWVtYmVyVG9NYW55KHBhcmVudCwgY2hpbGRyZW5BcnIsIGRlc2NyaXB0aW9uKSB7XG4gICAgY29uc29sZS5sb2cocGFyZW50LCBjaGlsZHJlbkFyciwgZGVzY3JpcHRpb24pO1xuICAgIHJldHVybiBuYW1lRWxlbWVudChwYXJlbnQuZnVsbE5hbWUgKyBmb3JtYXRQZXJzb25JZllvdShwYXJlbnQpKSArICcgaXMgJyArIHBlcnNvbkxpc3RTdHIoY2hpbGRyZW5BcnIsIHsgaXNGYW1pbHk6IHRydWUgfSkgKyAnICcgKyBkZXNjcmlwdGlvbjtcbiAgfSxcbiAgJ21hbnlUb01hbnknOiBmdW5jdGlvbiBtYW55VG9NYW55KHBlb3BsZUFycjEsIHBlb3BsZUFycjIsIGRlc2NyaXB0aW9uKSB7XG4gICAgcmV0dXJuIHBlcnNvbkxpc3RTdHIocGVvcGxlQXJyMSkgKyAnICcgKyAocGVvcGxlQXJyMS5sZW5ndGggPiAxID8gJ2FyZScgOiAnaXMnKSArICcgJyArIGRlc2NyaXB0aW9uICsgJyB0byAnICsgcGVyc29uTGlzdFN0cihwZW9wbGVBcnIyKTtcbiAgfSxcbiAgJ2FsbE11dHVhbCc6IGZ1bmN0aW9uIGFsbE11dHVhbChwZW9wbGVBcnIsIGRlc2NyaXB0aW9uKSB7XG4gICAgcmV0dXJuIHBlcnNvbkxpc3RTdHIocGVvcGxlQXJyKSArICcgYXJlICcgKyBkZXNjcmlwdGlvbjtcbiAgfVxufTtcblxuLyoqXG4gKiBUeXBlc1xuICovXG5mdW5jdGlvbiByZWxhdGlvbnNoaXAoZGVzY3JpcHRpb24sIHBlcnNvbklzSWQsIHBlcnNvblRvSWQpIHtcbiAgdmFyIG9wdHMgPSBhcmd1bWVudHMubGVuZ3RoID4gMyAmJiBhcmd1bWVudHNbM10gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1szXSA6IHt9O1xuXG4gIHJldHVybiB7XG4gICAgcGVyc29uSXNEZXNjcmlwdGlvbjogZGVzY3JpcHRpb24sXG4gICAgcGVyc29uSXNJZDogcGVyc29uSXNJZCxcbiAgICBwZXJzb25Ub0lkOiBwZXJzb25Ub0lkLFxuICAgIGluZmVycmVkOiAhIW9wdHMuaW5mZXJyZWQsXG4gICAgaW5mZXJyZWRCeTogb3B0cy5pbmZlcnJlZEJ5XG4gIH07XG59XG5cbi8qKlxuICogU3RvcmFnZVxuICovXG5mdW5jdGlvbiBhZGRSZWxhdGlvbnNoaXAocmVsYXRpb25zaGlwT2JqKSB7XG4gIHZhciBob3VzZWhvbGRSZWxhdGlvbnNoaXBzID0gZ2V0QWxsUmVsYXRpb25zaGlwcygpIHx8IFtdLFxuICAgICAgaXRlbSA9IF9leHRlbmRzKHt9LCByZWxhdGlvbnNoaXBPYmosIHtcbiAgICBpZDogYXV0b0luY3JlbWVudElkKFJFTEFUSU9OU0hJUFNfU1RPUkFHRV9LRVkpXG4gIH0pO1xuXG4gIGhvdXNlaG9sZFJlbGF0aW9uc2hpcHMucHVzaChpdGVtKTtcblxuICBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKFJFTEFUSU9OU0hJUFNfU1RPUkFHRV9LRVksIEpTT04uc3RyaW5naWZ5KGhvdXNlaG9sZFJlbGF0aW9uc2hpcHMpKTtcblxuICByZXR1cm4gaXRlbTtcbn1cblxuZnVuY3Rpb24gZGVsZXRlUmVsYXRpb25zaGlwKHJlbGF0aW9uc2hpcE9iaikge1xuICB2YXIgaG91c2Vob2xkUmVsYXRpb25zaGlwcyA9IChnZXRBbGxSZWxhdGlvbnNoaXBzKCkgfHwgW10pLmZpbHRlcihmdW5jdGlvbiAocmVsYXRpb25zaGlwKSB7XG4gICAgcmV0dXJuIHJlbGF0aW9uc2hpcC5pZCAhPT0gcmVsYXRpb25zaGlwT2JqLmlkO1xuICB9KTtcblxuICBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKFJFTEFUSU9OU0hJUFNfU1RPUkFHRV9LRVksIEpTT04uc3RyaW5naWZ5KGhvdXNlaG9sZFJlbGF0aW9uc2hpcHMpKTtcbn1cblxuZnVuY3Rpb24gZWRpdFJlbGF0aW9uc2hpcChyZWxhdGlvbnNoaXBJZCwgdmFsdWVPYmplY3QpIHtcbiAgdmFyIGhvdXNlaG9sZFJlbGF0aW9uc2hpcHMgPSAoZ2V0QWxsUmVsYXRpb25zaGlwcygpIHx8IFtdKS5tYXAoZnVuY3Rpb24gKHJlbGF0aW9uc2hpcCkge1xuICAgIHJldHVybiByZWxhdGlvbnNoaXAuaWQgKyAnJyA9PT0gcmVsYXRpb25zaGlwSWQgKyAnJyA/IF9leHRlbmRzKHt9LCB2YWx1ZU9iamVjdCwge1xuICAgICAgaWQ6IHJlbGF0aW9uc2hpcElkXG4gICAgfSkgOiByZWxhdGlvbnNoaXA7XG4gIH0pO1xuXG4gIHNlc3Npb25TdG9yYWdlLnNldEl0ZW0oUkVMQVRJT05TSElQU19TVE9SQUdFX0tFWSwgSlNPTi5zdHJpbmdpZnkoaG91c2Vob2xkUmVsYXRpb25zaGlwcykpO1xufVxuXG5mdW5jdGlvbiBnZXRBbGxSZWxhdGlvbnNoaXBzKCkge1xuICByZXR1cm4gSlNPTi5wYXJzZShzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKFJFTEFUSU9OU0hJUFNfU1RPUkFHRV9LRVkpKSB8fCBbXTtcbn1cblxuZnVuY3Rpb24gZ2V0QWxsTWFudWFsUmVsYXRpb25zaGlwcygpIHtcbiAgcmV0dXJuIGdldEFsbFJlbGF0aW9uc2hpcHMoKS5maWx0ZXIoZnVuY3Rpb24gKHJlbGF0aW9uc2hpcCkge1xuICAgIHJldHVybiAhcmVsYXRpb25zaGlwLmluZmVycmVkO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gZGVsZXRlQWxsUmVsYXRpb25zaGlwc0Zvck1lbWJlcihwZXJzb25JZCkge1xuICB2YXIgaG91c2Vob2xkUmVsYXRpb25zaGlwcyA9IGdldEFsbFJlbGF0aW9uc2hpcHMoKS5maWx0ZXIoZnVuY3Rpb24gKHJlbGF0aW9uc2hpcCkge1xuICAgIHJldHVybiAhKHBlcnNvbklkID09PSByZWxhdGlvbnNoaXAucGVyc29uSXNJZCB8fCBwZXJzb25JZCA9PT0gcmVsYXRpb25zaGlwLnBlcnNvblRvSWQpO1xuICB9KTtcblxuICBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKFJFTEFUSU9OU0hJUFNfU1RPUkFHRV9LRVksIEpTT04uc3RyaW5naWZ5KGhvdXNlaG9sZFJlbGF0aW9uc2hpcHMpKTtcbn1cblxuLyoqXG4gKiBDb21wYXJhdG9yc1xuICovXG5mdW5jdGlvbiBpc0luUmVsYXRpb25zaGlwKHBlcnNvbklkLCByZWxhdGlvbnNoaXApIHtcbiAgcmV0dXJuIHJlbGF0aW9uc2hpcC5wZXJzb25Ub0lkID09PSBwZXJzb25JZCB8fCByZWxhdGlvbnNoaXAucGVyc29uSXNJZCA9PT0gcGVyc29uSWQ7XG59XG5cbmZ1bmN0aW9uIGlzQUNoaWxkSW5SZWxhdGlvbnNoaXAocGVyc29uSWQsIHJlbGF0aW9uc2hpcCkge1xuICAvKipcbiAgICogR3VhcmRcbiAgICovXG4gIGlmICghaXNJblJlbGF0aW9uc2hpcChwZXJzb25JZCwgcmVsYXRpb25zaGlwKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHJldHVybiByZWxhdGlvbnNoaXAucGVyc29uSXNEZXNjcmlwdGlvbiA9PT0gJ21vdGhlci1mYXRoZXInICYmIHJlbGF0aW9uc2hpcC5wZXJzb25Ub0lkID09PSBwZXJzb25JZCB8fCByZWxhdGlvbnNoaXAucGVyc29uSXNEZXNjcmlwdGlvbiA9PT0gJ3Nvbi1kYXVnaHRlcicgJiYgcmVsYXRpb25zaGlwLnBlcnNvbklzSWQgPT09IHBlcnNvbklkO1xufVxuXG5mdW5jdGlvbiBpc0FTaWJsaW5nSW5SZWxhdGlvbnNoaXAocGVyc29uSWQsIHJlbGF0aW9uc2hpcCkge1xuICByZXR1cm4gaXNJblJlbGF0aW9uc2hpcChwZXJzb25JZCwgcmVsYXRpb25zaGlwKSAmJiByZWxhdGlvbnNoaXBEZXNjcmlwdGlvbk1hcFtyZWxhdGlvbnNoaXAucGVyc29uSXNEZXNjcmlwdGlvbl0udHlwZS5pZCA9PT0gJ3NpYmxpbmcnO1xufVxuXG5mdW5jdGlvbiBpc0FQYXJlbnRJblJlbGF0aW9uc2hpcChwZXJzb25JZCwgcmVsYXRpb25zaGlwKSB7XG4gIC8qKlxuICAgKiBHdWFyZFxuICAgKi9cbiAgaWYgKCFpc0luUmVsYXRpb25zaGlwKHBlcnNvbklkLCByZWxhdGlvbnNoaXApKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcmV0dXJuIHJlbGF0aW9uc2hpcC5wZXJzb25Jc0Rlc2NyaXB0aW9uID09PSAnbW90aGVyLWZhdGhlcicgJiYgcmVsYXRpb25zaGlwLnBlcnNvbklzSWQgPT09IHBlcnNvbklkIHx8IHJlbGF0aW9uc2hpcC5wZXJzb25Jc0Rlc2NyaXB0aW9uID09PSAnc29uLWRhdWdodGVyJyAmJiByZWxhdGlvbnNoaXAucGVyc29uVG9JZCA9PT0gcGVyc29uSWQ7XG59XG5cbmZ1bmN0aW9uIGFyZUFueUNoaWxkcmVuSW5SZWxhdGlvbnNoaXBOb3RQYXJlbnQoY2hpbGRyZW5JZHMsIG5vdFBhcmVudElkLCByZWxhdGlvbnNoaXApIHtcbiAgLyoqXG4gICAqIEd1YXJkXG4gICAqIElmIHJlbGF0aW9uc2hpcCB0eXBlIGlzIG5vdCBjaGlsZC1wYXJlbnRcbiAgICovXG4gIGlmIChyZWxhdGlvbnNoaXBEZXNjcmlwdGlvbk1hcFtyZWxhdGlvbnNoaXAucGVyc29uSXNEZXNjcmlwdGlvbl0udHlwZS5pZCAhPT0gJ2NoaWxkLXBhcmVudCcpIHtcblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHZhciBjaGlsZEluZGV4QXNQZXJzb25JcyA9IGNoaWxkcmVuSWRzLmluZGV4T2YocmVsYXRpb25zaGlwLnBlcnNvbklzSWQpLFxuICAgICAgY2hpbGRJbmRleEFzUGVyc29uVG8gPSBjaGlsZHJlbklkcy5pbmRleE9mKHJlbGF0aW9uc2hpcC5wZXJzb25Ub0lkKTtcblxuICAvKipcbiAgICogRmluZCBwYXJlbnRzIHdpdGggdGhlIHNhbWUgY2hpbGRyZW5cbiAgICpcbiAgICogSWYgYSBwZXJzb25Jcy1jaGlsZCBpcyBub3QgaW4gcmVsYXRpb25zaGlwXG4gICAqIG9yIDIgY2hpbGRyZW4gYXJlIGZvdW5kIGluIHJlbGF0aW9uc2hpcFxuICAgKi9cbiAgaWYgKGNoaWxkSW5kZXhBc1BlcnNvbklzID09PSAtMSAmJiBjaGlsZEluZGV4QXNQZXJzb25UbyA9PT0gLTEgfHwgY2hpbGRJbmRleEFzUGVyc29uSXMgIT09IC0xICYmIGNoaWxkSW5kZXhBc1BlcnNvblRvICE9PSAtMSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGlsZCBtdXN0IGJlIGluIHJlbGF0aW9uc2hpcCwgZ2V0IGNoaWxkIGluZGV4XG4gICAqL1xuICB2YXIgY2hpbGRJbmRleCA9IGNoaWxkSW5kZXhBc1BlcnNvbklzICE9PSAtMSA/IGNoaWxkSW5kZXhBc1BlcnNvbklzIDogY2hpbGRJbmRleEFzUGVyc29uVG87XG5cbiAgLyoqXG4gICAqIElmIHBlcnNvbklzIGlzIG5vdCBpbiByZWxhdGlvbnNoaXBcbiAgICogYW5kIGNoaWxkIGZyb20gcHJldmlvdXMgcmVsYXRpb25zaGlwIGlzIGEgY2hpbGQgaW4gdGhpcyByZWxhdGlvbnNoaXBcbiAgICovXG4gIHJldHVybiAhaXNJblJlbGF0aW9uc2hpcChub3RQYXJlbnRJZCwgcmVsYXRpb25zaGlwKSAmJiBpc0FDaGlsZEluUmVsYXRpb25zaGlwKGNoaWxkcmVuSWRzW2NoaWxkSW5kZXhdLCByZWxhdGlvbnNoaXApO1xufVxuXG5mdW5jdGlvbiBpc1JlbGF0aW9uc2hpcFR5cGUocmVsYXRpb25zaGlwVHlwZSwgcmVsYXRpb25zaGlwKSB7XG4gIHZhciB0eXBlT2ZSZWxhdGlvbnNoaXAgPSByZWxhdGlvbnNoaXBEZXNjcmlwdGlvbk1hcFtyZWxhdGlvbnNoaXAucGVyc29uSXNEZXNjcmlwdGlvbl0udHlwZS5pZDtcblxuICAvKipcbiAgICogcmVsYXRpb25zaGlwVHlwZSBjYW4gYmUgYW4gYXJyYXkgb2YgdHlwZXNcbiAgICovXG4gIHJldHVybiBfJDEuaXNBcnJheShyZWxhdGlvbnNoaXBUeXBlKSA/ICEhXyQxLmZpbmQocmVsYXRpb25zaGlwVHlwZSwgZnVuY3Rpb24gKHJUeXBlKSB7XG4gICAgcmV0dXJuIHJUeXBlID09PSB0eXBlT2ZSZWxhdGlvbnNoaXA7XG4gIH0pIDogdHlwZU9mUmVsYXRpb25zaGlwID09PSByZWxhdGlvbnNoaXBUeXBlO1xufVxuXG5mdW5jdGlvbiBpc1JlbGF0aW9uc2hpcEluZmVycmVkKHJlbGF0aW9uc2hpcCkge1xuICByZXR1cm4gcmVsYXRpb25zaGlwLmluZmVycmVkO1xufVxuXG4vKipcbiAqIFJldHJpZXZlIHBlb3BsZSBieSByb2xlIGluIHJlbGF0aW9uc2hpcHNcbiAqL1xuZnVuY3Rpb24gZ2V0UGFyZW50SWRGcm9tUmVsYXRpb25zaGlwKHJlbGF0aW9uc2hpcCkge1xuICB2YXIgcGFyZW50SWQgPSB2b2lkIDA7XG5cbiAgaWYgKHJlbGF0aW9uc2hpcC5wZXJzb25Jc0Rlc2NyaXB0aW9uID09PSAnbW90aGVyLWZhdGhlcicpIHtcbiAgICBwYXJlbnRJZCA9IHJlbGF0aW9uc2hpcC5wZXJzb25Jc0lkO1xuICB9XG5cbiAgaWYgKHJlbGF0aW9uc2hpcC5wZXJzb25Jc0Rlc2NyaXB0aW9uID09PSAnc29uLWRhdWdodGVyJykge1xuICAgIHBhcmVudElkID0gcmVsYXRpb25zaGlwLnBlcnNvblRvSWQ7XG4gIH1cblxuICBpZiAoIXBhcmVudElkKSB7XG4gICAgY29uc29sZS5sb2coJ1BhcmVudCBub3QgZm91bmQgaW4gcmVsYXRpb25zaGlwOiAnLCByZWxhdGlvbnNoaXApO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHJldHVybiBwYXJlbnRJZDtcbn1cblxuZnVuY3Rpb24gZ2V0Q2hpbGRJZEZyb21SZWxhdGlvbnNoaXAocmVsYXRpb25zaGlwKSB7XG4gIHZhciBjaGlsZElkID0gdm9pZCAwO1xuXG4gIGlmIChyZWxhdGlvbnNoaXAucGVyc29uSXNEZXNjcmlwdGlvbiA9PT0gJ21vdGhlci1mYXRoZXInKSB7XG4gICAgY2hpbGRJZCA9IHJlbGF0aW9uc2hpcC5wZXJzb25Ub0lkO1xuICB9XG5cbiAgaWYgKHJlbGF0aW9uc2hpcC5wZXJzb25Jc0Rlc2NyaXB0aW9uID09PSAnc29uLWRhdWdodGVyJykge1xuICAgIGNoaWxkSWQgPSByZWxhdGlvbnNoaXAucGVyc29uSXNJZDtcbiAgfVxuXG4gIGlmICghY2hpbGRJZCkge1xuICAgIGNvbnNvbGUubG9nKCdDaGlsZCBub3QgZm91bmQgaW4gcmVsYXRpb25zaGlwOiAnLCByZWxhdGlvbnNoaXApO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHJldHVybiBjaGlsZElkO1xufVxuXG5mdW5jdGlvbiBnZXRTaWJsaW5nSWRGcm9tUmVsYXRpb25zaGlwKHBlcnNvbklkLCByZWxhdGlvbnNoaXApIHtcbiAgaWYgKCFpc0luUmVsYXRpb25zaGlwKHBlcnNvbklkLCByZWxhdGlvbnNoaXApKSB7XG4gICAgY29uc29sZS5sb2coJ1BlcnNvbiAnICsgcGVyc29uSWQgKyAnIG5vdCBmb3VuZCBpbiByZWxhdGlvbnNoaXA6ICcsIHJlbGF0aW9uc2hpcCk7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcmV0dXJuIHJlbGF0aW9uc2hpcFtyZWxhdGlvbnNoaXAucGVyc29uSXNJZCA9PT0gcGVyc29uSWQgPyAncGVyc29uVG9JZCcgOiAncGVyc29uSXNJZCddO1xufVxuXG5mdW5jdGlvbiBnZXRPdGhlclBlcnNvbklkRnJvbVJlbGF0aW9uc2hpcChwZXJzb25JZCwgcmVsYXRpb25zaGlwKSB7XG4gIHJldHVybiByZWxhdGlvbnNoaXAucGVyc29uSXNJZCA9PT0gcGVyc29uSWQgPyByZWxhdGlvbnNoaXAucGVyc29uVG9JZCA6IHJlbGF0aW9uc2hpcC5wZXJzb25Jc0lkO1xufVxuXG5mdW5jdGlvbiBnZXRBbGxQYXJlbnRzT2YocGVyc29uSWQpIHtcbiAgcmV0dXJuIGdldEFsbFJlbGF0aW9uc2hpcHMoKS5maWx0ZXIoaXNBQ2hpbGRJblJlbGF0aW9uc2hpcC5iaW5kKG51bGwsIHBlcnNvbklkKSkubWFwKGZ1bmN0aW9uIChyZWxhdGlvbnNoaXApIHtcbiAgICByZXR1cm4gZ2V0UGVyc29uRnJvbU1lbWJlcihnZXRIb3VzZWhvbGRNZW1iZXJCeVBlcnNvbklkKGdldFBhcmVudElkRnJvbVJlbGF0aW9uc2hpcChyZWxhdGlvbnNoaXApKSk7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBnZXRBbGxDaGlsZHJlbk9mKHBlcnNvbklkKSB7XG4gIHJldHVybiBnZXRBbGxSZWxhdGlvbnNoaXBzKCkuZmlsdGVyKGlzQVBhcmVudEluUmVsYXRpb25zaGlwLmJpbmQobnVsbCwgcGVyc29uSWQpKS5tYXAoZnVuY3Rpb24gKHJlbGF0aW9uc2hpcCkge1xuICAgIHJldHVybiBnZXRIb3VzZWhvbGRNZW1iZXJCeVBlcnNvbklkKGdldENoaWxkSWRGcm9tUmVsYXRpb25zaGlwKHJlbGF0aW9uc2hpcCkpWydAcGVyc29uJ107XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBnZXRQZXJzb25JZEZyb21QZXJzb24ocGVyc29uJCQxKSB7XG4gIHJldHVybiBwZXJzb24kJDEuaWQ7XG59XG5cbmZ1bmN0aW9uIGdldFBlcnNvbkZyb21NZW1iZXIobWVtYmVyKSB7XG4gIHJldHVybiBtZW1iZXJbJ0BwZXJzb24nXTtcbn1cblxuLyoqXG4gKiBNaXNzaW5nIHJlbGF0aW9uc2hpcCBpbmZlcmVuY2VcbiAqL1xudmFyIG1pc3NpbmdSZWxhdGlvbnNoaXBJbmZlcmVuY2UgPSB7XG4gIHNpYmxpbmdzT2Y6IGZ1bmN0aW9uIHNpYmxpbmdzT2Yoc3ViamVjdE1lbWJlcikge1xuXG4gICAgdmFyIG1pc3NpbmdSZWxhdGlvbnNoaXBzID0gW10sXG4gICAgICAgIGFsbFJlbGF0aW9uc2hpcHMgPSBnZXRBbGxSZWxhdGlvbnNoaXBzKCksXG4gICAgICAgIHBlcnNvbiQkMSA9IGdldFBlcnNvbkZyb21NZW1iZXIoc3ViamVjdE1lbWJlciksXG4gICAgICAgIHBlcnNvbklkID0gcGVyc29uJCQxLmlkLFxuICAgICAgICBwYXJlbnRzID0gZ2V0QWxsUGFyZW50c09mKHBlcnNvbklkKSxcbiAgICAgICAgc2libGluZ0lkcyA9IGFsbFJlbGF0aW9uc2hpcHMuZmlsdGVyKGlzQVNpYmxpbmdJblJlbGF0aW9uc2hpcC5iaW5kKG51bGwsIHBlcnNvbklkKSkubWFwKGdldFNpYmxpbmdJZEZyb21SZWxhdGlvbnNoaXAuYmluZChudWxsLCBwZXJzb25JZCkpO1xuXG4gICAgLyoqXG4gICAgICogSWYgMiBwYXJlbnQgcmVsYXRpb25zaGlwcyBvZiAncGVyc29uJyBhcmUgZm91bmQgd2UgY2FuIGF0dGVtcHQgdG8gaW5mZXJcbiAgICAgKiBzaWJsaW5nIHJlbGF0aW9uc2hpcHNcbiAgICAgKi9cbiAgICBpZiAocGFyZW50cy5sZW5ndGggPT09IDIpIHtcblxuICAgICAgZ2V0QWxsSG91c2Vob2xkTWVtYmVycygpLmZpbHRlcihpc0hvdXNlaG9sZE1lbWJlcikuZm9yRWFjaChmdW5jdGlvbiAobWVtYmVyKSB7XG5cbiAgICAgICAgdmFyIG1lbWJlclBlcnNvbklkID0gbWVtYmVyWydAcGVyc29uJ10uaWQ7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEd1YXJkXG4gICAgICAgICAqIElmIG1lbWJlciBpcyB0aGUgc3ViamVjdCBtZW1iZXJcbiAgICAgICAgICogb3IgbWVtYmVyIGlzIGEgcGFyZW50XG4gICAgICAgICAqIG9yIG1lbWJlciBhbHJlYWR5IGhhcyBhIHNpYmxpbmcgcmVsYXRpb25zaGlwIHdpdGggJ3BlcnNvbidcbiAgICAgICAgICogc2tpcCBtZW1iZXJcbiAgICAgICAgICovXG4gICAgICAgIGlmIChtZW1iZXJQZXJzb25JZCA9PT0gcGVyc29uSWQgfHwgbWVtYmVyUGVyc29uSWQgPT09IHBhcmVudHNbMF0uaWQgfHwgbWVtYmVyUGVyc29uSWQgPT09IHBhcmVudHNbMV0uaWQgfHwgc2libGluZ0lkcy5pbmRleE9mKG1lbWJlclBlcnNvbklkKSA+IC0xKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIG1lbWJlclBhcmVudHMgPSBnZXRBbGxQYXJlbnRzT2YobWVtYmVyUGVyc29uSWQpO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBJZiAyIHBhcmVudHMgb2YgJ21lbWJlcicgYXJlIGZvdW5kXG4gICAgICAgICAqIGFuZCB0aGV5IGFyZSB0aGUgc2FtZSBwYXJlbnRzIG9mICdwZXJzb24nXG4gICAgICAgICAqIHdlIGhhdmUgaWRlbnRpZmllZCBhIG1pc3NpbmcgaW5mZXJyZWQgcmVsYXRpb25zaGlwXG4gICAgICAgICAqL1xuICAgICAgICBpZiAobWVtYmVyUGFyZW50cy5sZW5ndGggPT09IDIgJiYgXyQxLmRpZmZlcmVuY2UocGFyZW50cy5tYXAoZ2V0UGVyc29uSWRGcm9tUGVyc29uKSwgbWVtYmVyUGFyZW50cy5tYXAoZ2V0UGVyc29uSWRGcm9tUGVyc29uKSkubGVuZ3RoID09PSAwKSB7XG5cbiAgICAgICAgICAvKipcbiAgICAgICAgICAgKiBBZGQgdG8gbWlzc2luZ1JlbGF0aW9uc2hpcHNcbiAgICAgICAgICAgKi9cbiAgICAgICAgICBtaXNzaW5nUmVsYXRpb25zaGlwcy5wdXNoKHJlbGF0aW9uc2hpcCgnYnJvdGhlci1zaXN0ZXInLCBwZXJzb25JZCwgbWVtYmVyUGVyc29uSWQsIHtcbiAgICAgICAgICAgIGluZmVycmVkOiB0cnVlLFxuICAgICAgICAgICAgaW5mZXJyZWRCeTogW1xuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBNdXN0IGJlIDQgcmVsYXRpb25zaGlwc1xuICAgICAgICAgICAgICogQ291bGQgaGF2ZSB1c2VkIG1lbWJlcidzIHBhcmVudHMgYnV0IHdlIGNhbiBhc3N1bWUgdGhleVxuICAgICAgICAgICAgICogbXVzdCBiZSB0aGUgc2FtZSBhdCB0aGlzIHBvaW50IG9yIHRoZSBpbmZlcnJlbmNlXG4gICAgICAgICAgICAgKiBjb3VsZG4ndCBoYXBwZW4uXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGdldFJlbGF0aW9uc2hpcE9mKHBlcnNvbklkLCBwYXJlbnRzWzBdLmlkKS5pZCwgZ2V0UmVsYXRpb25zaGlwT2YocGVyc29uSWQsIHBhcmVudHNbMV0uaWQpLmlkLCBnZXRSZWxhdGlvbnNoaXBPZihtZW1iZXJQZXJzb25JZCwgcGFyZW50c1swXS5pZCkuaWQsIGdldFJlbGF0aW9uc2hpcE9mKG1lbWJlclBlcnNvbklkLCBwYXJlbnRzWzFdLmlkKS5pZF1cbiAgICAgICAgICB9KSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiBtaXNzaW5nUmVsYXRpb25zaGlwcztcbiAgfVxufTtcblxuZnVuY3Rpb24gaW5mZXJSZWxhdGlvbnNoaXBzKHJlbGF0aW9uc2hpcCwgcGVyc29uSXMsIHBlcnNvblRvKSB7XG4gIHZhciBtaXNzaW5nUmVsYXRpb25zaGlwcyA9IFtdO1xuXG4gIGlmIChyZWxhdGlvbnNoaXAucGVyc29uSXNEZXNjcmlwdGlvbiA9PT0gJ21vdGhlci1mYXRoZXInKSB7XG4gICAgbWlzc2luZ1JlbGF0aW9uc2hpcHMgPSBtaXNzaW5nUmVsYXRpb25zaGlwcy5jb25jYXQobWlzc2luZ1JlbGF0aW9uc2hpcEluZmVyZW5jZS5zaWJsaW5nc09mKHBlcnNvblRvKSk7XG4gIH1cblxuICBpZiAocmVsYXRpb25zaGlwLnBlcnNvbklzRGVzY3JpcHRpb24gPT09ICdzb24tZGF1Z2h0ZXInKSB7XG4gICAgbWlzc2luZ1JlbGF0aW9uc2hpcHMgPSBtaXNzaW5nUmVsYXRpb25zaGlwcy5jb25jYXQobWlzc2luZ1JlbGF0aW9uc2hpcEluZmVyZW5jZS5zaWJsaW5nc09mKHBlcnNvbklzKSk7XG4gIH1cblxuICAkLmVhY2gobWlzc2luZ1JlbGF0aW9uc2hpcHMsIGZ1bmN0aW9uIChpLCByZWxhdGlvbnNoaXApIHtcbiAgICBhZGRSZWxhdGlvbnNoaXAocmVsYXRpb25zaGlwKTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGZpbmROZXh0TWlzc2luZ1JlbGF0aW9uc2hpcCgpIHtcbiAgdmFyIGhvdXNlaG9sZE1lbWJlcnMgPSBnZXRBbGxIb3VzZWhvbGRNZW1iZXJzKCkuZmlsdGVyKGlzSG91c2Vob2xkTWVtYmVyKSxcbiAgICAgIHJlbGF0aW9uc2hpcHMgPSBnZXRBbGxSZWxhdGlvbnNoaXBzKCksXG4gICAgICBtaXNzaW5nUmVsYXRpb25zaGlwTWVtYmVycyA9IFtdLFxuICAgICAgcGVyc29uSXMgPSBudWxsO1xuXG4gIC8qKlxuICAgKiBGaW5kIHRoZSBuZXh0IG1pc3NpbmcgcmVsYXRpb25zaGlwXG4gICAqL1xuICAkLmVhY2goaG91c2Vob2xkTWVtYmVycywgZnVuY3Rpb24gKGksIG1lbWJlcikge1xuICAgIHZhciBwZXJzb25JZCA9IG1lbWJlclsnQHBlcnNvbiddLmlkO1xuXG4gICAgLyoqXG4gICAgICogR2V0IGFsbCByZWxhdGlvbnNoaXBzIGZvciB0aGlzIG1lbWJlclxuICAgICAqL1xuICAgIHZhciBtZW1iZXJSZWxhdGlvbnNoaXBzID0gcmVsYXRpb25zaGlwcy5maWx0ZXIoZnVuY3Rpb24gKHJlbGF0aW9uc2hpcCkge1xuICAgICAgcmV0dXJuIHJlbGF0aW9uc2hpcC5wZXJzb25Jc0lkID09PSBwZXJzb25JZCB8fCByZWxhdGlvbnNoaXAucGVyc29uVG9JZCA9PT0gcGVyc29uSWQ7XG4gICAgfSksXG4gICAgICAgIG1lbWJlclJlbGF0aW9uc2hpcFRvSWRzID0gbWVtYmVyUmVsYXRpb25zaGlwcy5tYXAoZnVuY3Rpb24gKHJlbGF0aW9uc2hpcCkge1xuICAgICAgcmV0dXJuIHJlbGF0aW9uc2hpcC5wZXJzb25Jc0lkID09PSBwZXJzb25JZCA/IHJlbGF0aW9uc2hpcC5wZXJzb25Ub0lkIDogcmVsYXRpb25zaGlwLnBlcnNvbklzSWQ7XG4gICAgfSkgfHwgW107XG5cbiAgICAvKipcbiAgICAgKiBJZiB0b3RhbCByZWxhdGlvbnNoaXBzIHJlbGF0ZWQgdG8gdGhpcyBtZW1iZXIgaXNuJ3QgZXF1YWwgdG9cbiAgICAgKiB0b3RhbCBob3VzZWhvbGQgbWVtYmVycyAtMSwgaW5kaWNhdGVzIG1pc3NpbmcgcmVsYXRpb25zaGlwXG4gICAgICovXG4gICAgaWYgKG1lbWJlclJlbGF0aW9uc2hpcHMubGVuZ3RoIDwgaG91c2Vob2xkTWVtYmVycy5sZW5ndGggLSAxKSB7XG5cbiAgICAgIC8qKlxuICAgICAgICogQWxsIG1pc3NpbmcgcmVsYXRpb25zaGlwIG1lbWJlcnNcbiAgICAgICAqL1xuICAgICAgbWlzc2luZ1JlbGF0aW9uc2hpcE1lbWJlcnMgPSBob3VzZWhvbGRNZW1iZXJzLmZpbHRlcihmdW5jdGlvbiAobSkge1xuICAgICAgICByZXR1cm4gbWVtYmVyUmVsYXRpb25zaGlwVG9JZHMuaW5kZXhPZihtWydAcGVyc29uJ10uaWQpID09PSAtMSAmJiBtWydAcGVyc29uJ10uaWQgIT09IHBlcnNvbklkO1xuICAgICAgfSk7XG5cbiAgICAgIHBlcnNvbklzID0gbWVtYmVyO1xuXG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4gcGVyc29uSXMgPyB7XG4gICAgcGVyc29uSXM6IHBlcnNvbklzLFxuICAgIHBlcnNvblRvOiBtaXNzaW5nUmVsYXRpb25zaGlwTWVtYmVyc1swXVxuICB9IDogbnVsbDtcbn1cblxuZnVuY3Rpb24gZ2V0UGVvcGxlSWRzTWlzc2luZ1JlbGF0aW9uc2hpcHNXaXRoUGVyc29uKHBlcnNvbklkKSB7XG4gIHZhciByZW1haW5pbmdQZXJzb25JZHMgPSBnZXRBbGxIb3VzZWhvbGRNZW1iZXJzKCkuZmlsdGVyKGlzSG91c2Vob2xkTWVtYmVyKS5tYXAoZnVuY3Rpb24gKG1lbWJlcikge1xuICAgIHJldHVybiBtZW1iZXJbJ0BwZXJzb24nXS5pZDtcbiAgfSk7XG5cbiAgLyoqXG4gICAqIFJlbW92ZSB0aGlzIHBlcnNvbiBmcm9tIHRoZSBsaXN0XG4gICAqL1xuICByZW1vdmVGcm9tTGlzdChyZW1haW5pbmdQZXJzb25JZHMsIHBlcnNvbklkKTtcblxuICAkLmVhY2goZ2V0QWxsUmVsYXRpb25zaGlwcygpLCBmdW5jdGlvbiAoaSwgcmVsYXRpb25zaGlwKSB7XG4gICAgaWYgKCFpc0luUmVsYXRpb25zaGlwKHBlcnNvbklkLCByZWxhdGlvbnNoaXApKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVtb3ZlIHRoZSBvdGhlciBwZXJzb24gZnJvbSB0aGUgcmVtYWluaW5nUGVyc29uSWRzIGxpc3RcbiAgICAgKi9cbiAgICByZW1vdmVGcm9tTGlzdChyZW1haW5pbmdQZXJzb25JZHMsIGdldE90aGVyUGVyc29uSWRGcm9tUmVsYXRpb25zaGlwKHBlcnNvbklkLCByZWxhdGlvbnNoaXApKTtcbiAgfSk7XG5cbiAgcmV0dXJuIHJlbWFpbmluZ1BlcnNvbklkcztcbn1cblxuZnVuY3Rpb24gZ2V0UmVsYXRpb25zaGlwVHlwZShyZWxhdGlvbnNoaXApIHtcbiAgcmV0dXJuIHJlbGF0aW9uc2hpcERlc2NyaXB0aW9uTWFwW3JlbGF0aW9uc2hpcC5wZXJzb25Jc0Rlc2NyaXB0aW9uXS50eXBlO1xufVxuXG4vKipcbiAqIFJldHJpZXZlIGZyb20gcmVsYXRpb25zaGlwIGdyb3VwXG4gKi9cbmZ1bmN0aW9uIGdldFJlbGF0aW9uc2hpcHNXaXRoUGVyc29uSWRzKHJlbGF0aW9uc2hpcHMsIGlkQXJyKSB7XG4gIHJldHVybiByZWxhdGlvbnNoaXBzLmZpbHRlcihmdW5jdGlvbiAoY2hpbGRSZWxhdGlvbnNoaXApIHtcbiAgICByZXR1cm4gaWRBcnIuaW5kZXhPZihjaGlsZFJlbGF0aW9uc2hpcC5wZXJzb25Jc0lkKSAhPT0gLTEgfHwgaWRBcnIuaW5kZXhPZihjaGlsZFJlbGF0aW9uc2hpcC5wZXJzb25Ub0lkKSAhPT0gLTE7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBnZXRSZWxhdGlvbnNoaXBPZihwZXJzb24xLCBwZXJzb24yKSB7XG4gIHJldHVybiBnZXRBbGxSZWxhdGlvbnNoaXBzKCkuZmluZChmdW5jdGlvbiAocmVsYXRpb25zaGlwKSB7XG4gICAgcmV0dXJuIGlzSW5SZWxhdGlvbnNoaXAocGVyc29uMSwgcmVsYXRpb25zaGlwKSAmJiBpc0luUmVsYXRpb25zaGlwKHBlcnNvbjIsIHJlbGF0aW9uc2hpcCk7XG4gIH0pO1xufVxuXG52YXIgUEVSU09OQUxfREVUQUlMU19LRVkgPSAnaW5kaXZpZHVhbC1kZXRhaWxzJztcbnZhciBQRVJTT05BTF9QSU5TX0tFWSA9ICdpbmRpdmlkdWFsLXBpbnMnO1xuXG52YXIgcGVyc29uYWxEZXRhaWxzTWFyaXRhbFN0YXR1c01hcCA9IHtcbiAgJ25ldmVyJzoge1xuICAgIGRlc2NyaXB0aW9uOiAnTmV2ZXIgbWFycmllZCBhbmQgbmV2ZXIgcmVnaXN0ZXJlZCBhIHNhbWUtc2V4IGNpdmlsJyArICcgcGFydG5lcnNoaXAnXG4gIH0sXG4gICdtYXJyaWVkJzoge1xuICAgIGRlc2NyaXB0aW9uOiAnTWFycmllZCdcbiAgfSxcbiAgJ3JlZ2lzdGVyZWQnOiB7XG4gICAgZGVzY3JpcHRpb246ICdJbiBhIHJlZ2lzdGVyZWQgc2FtZS1zZXggY2l2aWwgcGFydG5lcnNoaXAnXG4gIH0sXG4gICdzZXBhcmF0ZWQtbWFycmllZCc6IHtcbiAgICBkZXNjcmlwdGlvbjogJ1NlcGFyYXRlZCwgYnV0IHN0aWxsIGxlZ2FsbHkgbWFycmllZCdcbiAgfSxcbiAgJ2Rpdm9yY2VkJzoge1xuICAgIGRlc2NyaXB0aW9uOiAnRGl2b3JjZWQnXG4gIH0sXG4gICdmb3JtZXItcGFydG5lcnNoaXAnOiB7XG4gICAgZGVzY3JpcHRpb246ICdGb3JtZXJseSBpbiBhIHNhbWUtc2V4IGNpdmlsIHBhcnRuZXJzaGlwIHdoaWNoIGlzIG5vdycgKyAnIGxlZ2FsbHkgZGlzc29sdmVkJ1xuICB9LFxuICAnd2lkb3dlZCc6IHtcbiAgICBkZXNjcmlwdGlvbjogJ1dpZG93ZWQnXG4gIH0sXG4gICdzdXJ2aXZpbmctcGFydG5lcic6IHtcbiAgICBkZXNjcmlwdGlvbjogJ1N1cnZpdmluZyBwYXJ0bmVyIGZyb20gYSBzYW1lLXNleCBjaXZpbCBwYXJ0bmVyc2hpcCdcbiAgfSxcbiAgJ3NlcGFyYXRlZC1wYXJ0bmVyc2hpcCc6IHtcbiAgICBkZXNjcmlwdGlvbjogJ1NlcGFyYXRlZCwgYnV0IHN0aWxsIGxlZ2FsbHkgaW4gYSBzYW1lLXNleCBjaXZpbCBwYXJ0bmVyc2hpcCdcbiAgfVxufTtcblxudmFyIHBlcnNvbmFsRGV0YWlsc0NvdW50cnlNYXAgPSB7XG4gICdlbmdsYW5kJzoge1xuICAgIGRlc2NyaXB0aW9uOiAnRW5nbGFuZCdcbiAgfSxcbiAgJ3dhbGVzJzoge1xuICAgIGRlc2NyaXB0aW9uOiAnV2FsZXMnXG4gIH0sXG4gICdzY290bGFuZCc6IHtcbiAgICBkZXNjcmlwdGlvbjogJ1Njb3RsYW5kJ1xuICB9LFxuICAnbm9ydGhlcm4taXJlbGFuZCc6IHtcbiAgICBkZXNjcmlwdGlvbjogJ05vcnRoZXJuIElyZWxhbmQnXG4gIH0sXG4gICdyZXB1YmxpYy1pcmVsYW5kJzoge1xuICAgIGRlc2NyaXB0aW9uOiAnUmVwdWJsaWMgb2YgSXJlbGFuZCdcbiAgfSxcbiAgJ2Vsc2V3aGVyZSc6IHtcbiAgICBkZXNjcmlwdGlvbjogJ0Vsc2V3aGVyZSdcbiAgfVxufTtcblxudmFyIHBlcnNvbmFsRGV0YWlsc09yaWVudGF0aW9uTWFwID0ge1xuICAnc3RyYWlnaHQnOiB7XG4gICAgZGVzY3JpcHRpb246ICdTdHJhaWdodCBvciBIZXRlcm9zZXh1YWwnXG4gIH0sXG4gICdnYXknOiB7XG4gICAgZGVzY3JpcHRpb246ICdHYXkgb3IgTGVzYmlhbidcbiAgfSxcbiAgJ2Jpc2V4dWFsJzoge1xuICAgIGRlc2NyaXB0aW9uOiAnQmlzZXh1YWwnXG4gIH0sXG4gICdvdGhlcic6IHtcbiAgICBkZXNjcmlwdGlvbjogJ090aGVyJ1xuICB9LFxuICAnbm8tc2F5Jzoge1xuICAgIGRlc2NyaXB0aW9uOiAnUHJlZmVyIG5vdCB0byBzYXknXG4gIH1cbn07XG5cbnZhciBwZXJzb25hbERldGFpbHNHZW5kZXJNYXAgPSB7XG4gICdtYWxlJzoge1xuICAgIGRlc2NyaXB0aW9uOiAnTWFsZSdcbiAgfSxcbiAgJ2ZlbWFsZSc6IHtcbiAgICBkZXNjcmlwdGlvbjogJ0ZlbWFsZSdcbiAgfVxufTtcblxuZnVuY3Rpb24gYWRkVXBkYXRlUGVyc29uYWxEZXRhaWxzRE9CKHBlcnNvbklkLCBkYXksIG1vbnRoLCB5ZWFyKSB7XG4gIHZhciBhbGxEZXRhaWxzID0gZ2V0QWxsUGVyc29uYWxEZXRhaWxzKCksXG4gICAgICBkZXRhaWxzID0gYWxsRGV0YWlsc1twZXJzb25JZF0gfHwge307XG5cbiAgZGV0YWlsc1snZG9iJ10gPSB7XG4gICAgZGF5OiBkYXksXG4gICAgbW9udGg6IG1vbnRoLFxuICAgIHllYXI6IHllYXJcbiAgfTtcblxuICB1cGRhdGVQZXJzb25hbERldGFpbHMocGVyc29uSWQsIGRldGFpbHMpO1xuXG4gIHJldHVybiBkZXRhaWxzO1xufVxuXG5mdW5jdGlvbiBhZGRVcGRhdGVNYXJpdGFsU3RhdHVzKHBlcnNvbklkLCB2YWwpIHtcbiAgdmFyIGFsbERldGFpbHMgPSBnZXRBbGxQZXJzb25hbERldGFpbHMoKSxcbiAgICAgIGRldGFpbHMgPSBhbGxEZXRhaWxzW3BlcnNvbklkXSB8fCB7fTtcblxuICBkZXRhaWxzWydtYXJpdGFsU3RhdHVzJ10gPSB2YWw7XG5cbiAgdXBkYXRlUGVyc29uYWxEZXRhaWxzKHBlcnNvbklkLCBkZXRhaWxzKTtcblxuICByZXR1cm4gZGV0YWlscztcbn1cblxuZnVuY3Rpb24gYWRkVXBkYXRlQ291bnRyeShwZXJzb25JZCwgdmFsKSB7XG4gIHZhciBhbGxEZXRhaWxzID0gZ2V0QWxsUGVyc29uYWxEZXRhaWxzKCksXG4gICAgICBkZXRhaWxzID0gYWxsRGV0YWlsc1twZXJzb25JZF0gfHwge307XG5cbiAgZGV0YWlsc1snY291bnRyeSddID0gdmFsO1xuXG4gIHVwZGF0ZVBlcnNvbmFsRGV0YWlscyhwZXJzb25JZCwgZGV0YWlscyk7XG5cbiAgcmV0dXJuIGRldGFpbHM7XG59XG5cbmZ1bmN0aW9uIGFkZFVwZGF0ZU9yaWVudGF0aW9uKHBlcnNvbklkLCB2YWwpIHtcbiAgdmFyIGFsbERldGFpbHMgPSBnZXRBbGxQZXJzb25hbERldGFpbHMoKSxcbiAgICAgIGRldGFpbHMgPSBhbGxEZXRhaWxzW3BlcnNvbklkXSB8fCB7fTtcblxuICBkZXRhaWxzWydvcmllbnRhdGlvbiddID0gdmFsO1xuXG4gIHVwZGF0ZVBlcnNvbmFsRGV0YWlscyhwZXJzb25JZCwgZGV0YWlscyk7XG5cbiAgcmV0dXJuIGRldGFpbHM7XG59XG5cbmZ1bmN0aW9uIGFkZFVwZGF0ZVNhbGFyeShwZXJzb25JZCwgdmFsKSB7XG4gIHZhciBhbGxEZXRhaWxzID0gZ2V0QWxsUGVyc29uYWxEZXRhaWxzKCksXG4gICAgICBkZXRhaWxzID0gYWxsRGV0YWlsc1twZXJzb25JZF0gfHwge307XG5cbiAgZGV0YWlsc1snc2FsYXJ5J10gPSB2YWw7XG5cbiAgdXBkYXRlUGVyc29uYWxEZXRhaWxzKHBlcnNvbklkLCBkZXRhaWxzKTtcblxuICByZXR1cm4gZGV0YWlscztcbn1cblxuZnVuY3Rpb24gYWRkVXBkYXRlU2V4KHBlcnNvbklkLCB2YWwpIHtcbiAgdmFyIGFsbERldGFpbHMgPSBnZXRBbGxQZXJzb25hbERldGFpbHMoKSxcbiAgICAgIGRldGFpbHMgPSBhbGxEZXRhaWxzW3BlcnNvbklkXSB8fCB7fTtcblxuICBkZXRhaWxzWydzZXgnXSA9IHZhbDtcblxuICB1cGRhdGVQZXJzb25hbERldGFpbHMocGVyc29uSWQsIGRldGFpbHMpO1xuXG4gIHJldHVybiBkZXRhaWxzO1xufVxuXG5mdW5jdGlvbiBhZGRVcGRhdGVBZGRyZXNzV2hlcmUocGVyc29uSWQsIHZhbCkge1xuICB2YXIgYWxsRGV0YWlscyA9IGdldEFsbFBlcnNvbmFsRGV0YWlscygpLFxuICAgICAgZGV0YWlscyA9IGFsbERldGFpbHNbcGVyc29uSWRdIHx8IHt9O1xuXG4gIGRldGFpbHNbJ2FkZHJlc3Mtd2hlcmUnXSA9IHZhbDtcblxuICB1cGRhdGVQZXJzb25hbERldGFpbHMocGVyc29uSWQsIGRldGFpbHMpO1xuXG4gIHJldHVybiBkZXRhaWxzO1xufVxuXG5mdW5jdGlvbiBhZGRVcGRhdGVBZ2UocGVyc29uSWQsIHZhbCwgX3JlZikge1xuICB2YXIgX3JlZiRpc0FwcHJveGltYXRlID0gX3JlZi5pc0FwcHJveGltYXRlLFxuICAgICAgaXNBcHByb3hpbWF0ZSA9IF9yZWYkaXNBcHByb3hpbWF0ZSA9PT0gdW5kZWZpbmVkID8gZmFsc2UgOiBfcmVmJGlzQXBwcm94aW1hdGU7XG5cbiAgdmFyIGFsbERldGFpbHMgPSBnZXRBbGxQZXJzb25hbERldGFpbHMoKSxcbiAgICAgIGRldGFpbHMgPSBhbGxEZXRhaWxzW3BlcnNvbklkXSB8fCB7fTtcblxuICBkZXRhaWxzWydhZ2UnXSA9IHtcbiAgICB2YWw6IHZhbCxcbiAgICBpc0FwcHJveGltYXRlOiBpc0FwcHJveGltYXRlXG4gIH07XG5cbiAgdXBkYXRlUGVyc29uYWxEZXRhaWxzKHBlcnNvbklkLCBkZXRhaWxzKTtcblxuICByZXR1cm4gZGV0YWlscztcbn1cblxuZnVuY3Rpb24gYWRkVXBkYXRlQWRkcmVzc091dHNpZGVVSyhwZXJzb25JZCwgdmFsKSB7XG4gIHZhciBhbGxEZXRhaWxzID0gZ2V0QWxsUGVyc29uYWxEZXRhaWxzKCksXG4gICAgICBkZXRhaWxzID0gYWxsRGV0YWlsc1twZXJzb25JZF0gfHwge307XG5cbiAgZGV0YWlsc1snYWRkcmVzcy1vdXRzaWRlLXVrJ10gPSB2YWw7XG5cbiAgdXBkYXRlUGVyc29uYWxEZXRhaWxzKHBlcnNvbklkLCBkZXRhaWxzKTtcblxuICByZXR1cm4gZGV0YWlscztcbn1cblxuZnVuY3Rpb24gYWRkVXBkYXRlQWRkcmVzc0luZGl2aWR1YWwocGVyc29uSWQsIHZhbCkge1xuICB2YXIgYWxsRGV0YWlscyA9IGdldEFsbFBlcnNvbmFsRGV0YWlscygpLFxuICAgICAgZGV0YWlscyA9IGFsbERldGFpbHNbcGVyc29uSWRdIHx8IHt9O1xuXG4gIGRldGFpbHNbJ2FkZHJlc3MnXSA9IHZhbDtcblxuICB1cGRhdGVQZXJzb25hbERldGFpbHMocGVyc29uSWQsIGRldGFpbHMpO1xuXG4gIHJldHVybiBkZXRhaWxzO1xufVxuXG5mdW5jdGlvbiBnZXRQaW5zKCkge1xuICByZXR1cm4gSlNPTi5wYXJzZShzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKFBFUlNPTkFMX1BJTlNfS0VZKSkgfHwge307XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVBpbkZvcihwZXJzb25JZCkge1xuICB2YXIgb3B0cyA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDoge307XG5cbiAgdmFyIHBpbnMgPSBnZXRQaW5zKCk7XG5cbiAgcGluc1twZXJzb25JZF0gPSB7XG4gICAgcGluOiBfLnJhbmRvbSgxMDAwMCwgOTk5OTkpLFxuICAgIGV4cG9ydGVkOiAhIW9wdHMuZXhwb3J0ZWRcbiAgfTtcblxuICBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKFBFUlNPTkFMX1BJTlNfS0VZLCBKU09OLnN0cmluZ2lmeShwaW5zKSk7XG5cbiAgcmV0dXJuIHBpbnNbcGVyc29uSWRdO1xufVxuXG5mdW5jdGlvbiBnZXRQaW5Gb3IocGVyc29uSWQpIHtcbiAgcmV0dXJuIGdldFBpbnMoKVtwZXJzb25JZF07XG59XG5cbmZ1bmN0aW9uIHVuc2V0UGluRm9yKHBlcnNvbklkKSB7XG4gIHZhciBwaW5zID0gZ2V0UGlucygpO1xuXG4gIGRlbGV0ZSBwaW5zW3BlcnNvbklkXTtcblxuICBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKFBFUlNPTkFMX1BJTlNfS0VZLCBKU09OLnN0cmluZ2lmeShwaW5zKSk7XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZVBlcnNvbmFsRGV0YWlscyhwZXJzb25JZCwgZGV0YWlscykge1xuICBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKFBFUlNPTkFMX0RFVEFJTFNfS0VZLCBKU09OLnN0cmluZ2lmeShfZXh0ZW5kcyh7fSwgZ2V0QWxsUGVyc29uYWxEZXRhaWxzKCksIGRlZmluZVByb3BlcnR5KHt9LCBwZXJzb25JZCwgZGV0YWlscykpKSk7XG5cbiAgcmV0dXJuIGRldGFpbHM7XG59XG5cbmZ1bmN0aW9uIGdldEFsbFBlcnNvbmFsRGV0YWlscygpIHtcbiAgcmV0dXJuIEpTT04ucGFyc2Uoc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbShQRVJTT05BTF9ERVRBSUxTX0tFWSkpIHx8IHt9O1xufVxuXG5mdW5jdGlvbiBnZXRQZXJzb25hbERldGFpbHNGb3IocGVyc29uSWQpIHtcbiAgdmFyIHN0b3JhZ2VPYmogPSBKU09OLnBhcnNlKHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oUEVSU09OQUxfREVUQUlMU19LRVkpKSB8fCB7fSxcbiAgICAgIHBlcnNvbk9iaiA9IHN0b3JhZ2VPYmpbcGVyc29uSWRdO1xuXG4gIGlmICghcGVyc29uT2JqKSB7XG4gICAgY29uc29sZS5sb2coJ1BlcnNvbmFsIGRldGFpbHMgZm9yICcgKyBwZXJzb25JZCArICcgbm90IGZvdW5kJyk7XG4gIH1cblxuICByZXR1cm4gcGVyc29uT2JqO1xufVxuXG4vKipcbiAqIENvcGllZCBmcm9tOlxuICogaHR0cHM6Ly9jb2RlcmV2aWV3LnN0YWNrZXhjaGFuZ2UuY29tL3F1ZXN0aW9ucy85MDM0OS9jaGFuZ2luZy1udW1iZXItdG8td29yZHMtaW4tamF2YXNjcmlwdFxuICogPT09PT09PT09PT09PT09XG4gKi9cbnZhciBPTkVfVE9fTklORVRFRU4gPSBbJ29uZScsICd0d28nLCAndGhyZWUnLCAnZm91cicsICdmaXZlJywgJ3NpeCcsICdzZXZlbicsICdlaWdodCcsICduaW5lJywgJ3RlbicsICdlbGV2ZW4nLCAndHdlbHZlJywgJ3RoaXJ0ZWVuJywgJ2ZvdXJ0ZWVuJywgJ2ZpZnRlZW4nLCAnc2l4dGVlbicsICdzZXZlbnRlZW4nLCAnZWlnaHRlZW4nLCAnbmluZXRlZW4nXTtcblxudmFyIFRFTlMgPSBbJ3RlbicsICd0d2VudHknLCAndGhpcnR5JywgJ2ZvcnR5JywgJ2ZpZnR5JywgJ3NpeHR5JywgJ3NldmVudHknLCAnZWlnaHR5JywgJ25pbmV0eSddO1xuXG52YXIgU0NBTEVTID0gWyd0aG91c2FuZCcsICdtaWxsaW9uJywgJ2JpbGxpb24nLCAndHJpbGxpb24nXTtcblxuLy8gaGVscGVyIGZ1bmN0aW9uIGZvciB1c2Ugd2l0aCBBcnJheS5maWx0ZXJcbmZ1bmN0aW9uIGlzVHJ1dGh5KGl0ZW0pIHtcbiAgcmV0dXJuICEhaXRlbTtcbn1cblxuLy8gY29udmVydCBhIG51bWJlciBpbnRvICdjaHVua3MnIG9mIDAtOTk5XG5mdW5jdGlvbiBjaHVuayhudW1iZXIpIHtcbiAgdmFyIHRob3VzYW5kcyA9IFtdO1xuXG4gIHdoaWxlIChudW1iZXIgPiAwKSB7XG4gICAgdGhvdXNhbmRzLnB1c2gobnVtYmVyICUgMTAwMCk7XG4gICAgbnVtYmVyID0gTWF0aC5mbG9vcihudW1iZXIgLyAxMDAwKTtcbiAgfVxuXG4gIHJldHVybiB0aG91c2FuZHM7XG59XG5cbi8vIHRyYW5zbGF0ZSBhIG51bWJlciBmcm9tIDEtOTk5IGludG8gRW5nbGlzaFxuZnVuY3Rpb24gaW5FbmdsaXNoKG51bWJlcikge1xuICB2YXIgdGhvdXNhbmRzLFxuICAgICAgaHVuZHJlZHMsXG4gICAgICB0ZW5zLFxuICAgICAgb25lcyxcbiAgICAgIHdvcmRzID0gW107XG5cbiAgaWYgKG51bWJlciA8IDIwKSB7XG4gICAgcmV0dXJuIE9ORV9UT19OSU5FVEVFTltudW1iZXIgLSAxXTsgLy8gbWF5IGJlIHVuZGVmaW5lZFxuICB9XG5cbiAgaWYgKG51bWJlciA8IDEwMCkge1xuICAgIG9uZXMgPSBudW1iZXIgJSAxMDtcbiAgICB0ZW5zID0gbnVtYmVyIC8gMTAgfCAwOyAvLyBlcXVpdmFsZW50IHRvIE1hdGguZmxvb3IobnVtYmVyIC8gMTApXG5cbiAgICB3b3Jkcy5wdXNoKFRFTlNbdGVucyAtIDFdKTtcbiAgICB3b3Jkcy5wdXNoKGluRW5nbGlzaChvbmVzKSk7XG5cbiAgICByZXR1cm4gd29yZHMuZmlsdGVyKGlzVHJ1dGh5KS5qb2luKCctJyk7XG4gIH1cblxuICBodW5kcmVkcyA9IG51bWJlciAvIDEwMCB8IDA7XG4gIHdvcmRzLnB1c2goaW5FbmdsaXNoKGh1bmRyZWRzKSk7XG4gIHdvcmRzLnB1c2goJ2h1bmRyZWQnKTtcbiAgd29yZHMucHVzaChpbkVuZ2xpc2gobnVtYmVyICUgMTAwKSk7XG5cbiAgcmV0dXJuIHdvcmRzLmZpbHRlcihpc1RydXRoeSkuam9pbignICcpO1xufVxuXG4vLyBhcHBlbmQgdGhlIHdvcmQgZm9yIGEgc2NhbGUuIE1hZGUgZm9yIHVzZSB3aXRoIEFycmF5Lm1hcFxuZnVuY3Rpb24gYXBwZW5kU2NhbGUoY2h1bmssIGV4cCkge1xuICB2YXIgc2NhbGU7XG4gIGlmICghY2h1bmspIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICBzY2FsZSA9IFNDQUxFU1tleHAgLSAxXTtcbiAgcmV0dXJuIFtjaHVuaywgc2NhbGVdLmZpbHRlcihpc1RydXRoeSkuam9pbignICcpO1xufVxuXG4vKipcbiAqID09PT09PT09PT09PT09PVxuICogRW5kIGNvcHlcbiAqL1xuXG4vKipcbiAqIE1vZGlmaWNhdGlvbiAtIGRlY29yYXRvclxuICovXG52YXIgTlVNQkVSX1RPX1BPU0lUSU9OX1RFWFRfTUFQID0ge1xuICAnb25lJzogJ2ZpcnN0JyxcbiAgJ3R3byc6ICdzZWNvbmQnLFxuICAndGhyZWUnOiAndGhpcmQnLFxuICAnZm91cic6ICdmb3VydGgnLFxuICAnZml2ZSc6ICdmaWZ0aCcsXG4gICdzaXgnOiAnc2l4dGgnLFxuICAnc2V2ZW4nOiAnc2V2ZW50aCcsXG4gICdlaWdodCc6ICdlaWdodGgnLFxuICAnbmluZSc6ICduaW50aCcsXG4gICd0ZW4nOiAndGVudGgnLFxuICAnZWxldmVuJzogJ2VsZXZlbnRoJyxcbiAgJ3R3ZWx2ZSc6ICd0d2VsZnRoJyxcbiAgJ3RoaXJ0ZWVuJzogJ3RoaXJ0ZWVudGgnLFxuICAnZm91cnRlZW4nOiAnZm91cnRlZW50aCcsXG4gICdmaWZ0ZWVuJzogJ2ZpZnRlZW50aCcsXG4gICdzaXh0ZWVuJzogJ3NpeHRlZW50aCcsXG4gICdzZXZlbnRlZW4nOiAnc2V2ZW50ZWVudGgnLFxuICAnZWlnaHRlZW4nOiAnZWlnaHRlZW50aCcsXG4gICduaW5ldGVlbic6ICduaW5ldGVlbnRoJyxcblxuICAndHdlbnR5JzogJ3R3ZW50aWV0aCcsXG4gICd0aGlydHknOiAndGhpcnRpZXRoJyxcbiAgJ2ZvcnR5JzogJ2ZvcnRpZXRoJyxcbiAgJ2ZpZnR5JzogJ2ZpZnRpZXRoJyxcbiAgJ3NpeHR5JzogJ3NpeHRpZXRoJyxcbiAgJ3NldmVudHknOiAnc2V2ZW50aWV0aCcsXG4gICdlaWdodHknOiAnZWlnaHRpZXRoJyxcbiAgJ25pbmV0eSc6ICduaW5ldGlldGgnLFxuICAnaHVuZHJlZCc6ICdodW5kcmVkdGgnLFxuXG4gICd0aG91c2FuZCc6ICd0aG91c2FuZHRoJyxcbiAgJ21pbGxpb24nOiAnbWlsbGlvbnRoJyxcbiAgJ2JpbGxpb24nOiAnYmlsbGlvbnRoJyxcbiAgJ3RyaWxsaW9uJzogJ3RyaWxsaW9udGgnXG59O1xuXG5mdW5jdGlvbiBudW1iZXJUb1Bvc2l0aW9uV29yZChudW0pIHtcbiAgdmFyIHN0ciA9IGNodW5rKG51bSkubWFwKGluRW5nbGlzaCkubWFwKGFwcGVuZFNjYWxlKS5maWx0ZXIoaXNUcnV0aHkpLnJldmVyc2UoKS5qb2luKCcgJyk7XG5cbiAgdmFyIHN1YiA9IHN0ci5zcGxpdCgnICcpLFxuICAgICAgbGFzdFdvcmREYXNoU3BsaXRBcnIgPSBzdWJbc3ViLmxlbmd0aCAtIDFdLnNwbGl0KCctJyksXG4gICAgICBsYXN0V29yZCA9IGxhc3RXb3JkRGFzaFNwbGl0QXJyW2xhc3RXb3JkRGFzaFNwbGl0QXJyLmxlbmd0aCAtIDFdLFxuICAgICAgbmV3TGFzdFdvcmQgPSAobGFzdFdvcmREYXNoU3BsaXRBcnIubGVuZ3RoID4gMSA/IGxhc3RXb3JkRGFzaFNwbGl0QXJyWzBdICsgJy0nIDogJycpICsgTlVNQkVSX1RPX1BPU0lUSU9OX1RFWFRfTUFQW2xhc3RXb3JkXTtcblxuICAvKmNvbnNvbGUubG9nKCdzdHI6Jywgc3RyKTtcbiAgY29uc29sZS5sb2coJ3N1YjonLCBzdWIpO1xuICBjb25zb2xlLmxvZygnbGFzdFdvcmREYXNoU3BsaXRBcnI6JywgbGFzdFdvcmREYXNoU3BsaXRBcnIpO1xuICBjb25zb2xlLmxvZygnbGFzdFdvcmQ6JywgbGFzdFdvcmQpO1xuICBjb25zb2xlLmxvZygnbmV3TGFzdFdvcmQ6JywgbmV3TGFzdFdvcmQpOyovXG5cbiAgdmFyIHN1YkNvcHkgPSBbXS5jb25jYXQoc3ViKTtcbiAgc3ViQ29weS5wb3AoKTtcbiAgdmFyIHByZWZpeCA9IHN1YkNvcHkuam9pbignICcpO1xuICB2YXIgcmVzdWx0ID0gKHByZWZpeCA/IHByZWZpeCArICcgJyA6ICcnKSArIG5ld0xhc3RXb3JkO1xuXG4gIC8vIGNvbnNvbGUubG9nKCdyZXN1bHQnLCAocHJlZml4ID8gcHJlZml4ICsgJyAnIDogJycpICsgbmV3TGFzdFdvcmQpO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG5mdW5jdGlvbiBudW1iZXJUb1dvcmRzU3R5bGVndWlkZShudW1iZXIpIHtcbiAgaWYgKG51bWJlciA+IDkpIHtcbiAgICByZXR1cm4gbnVtYmVyO1xuICB9XG5cbiAgcmV0dXJuIE9ORV9UT19OSU5FVEVFTltudW1iZXIgLSAxXTtcbn1cblxuZnVuY3Rpb24gdG9vbHMoKSB7XG5cbiAgdmFyICRsaXN0TGlua3MgPSAkKCcudGVzdC1kYXRhLWxpbmtzJyksXG4gICAgICAkY2xlYXJEYXRhID0gJCgnPGxpPjxhIGhyZWY9XCIjXCIgY2xhc3M9XFwnbW9jay1kYXRhLWZhbWlseVxcJz4nICsgJ0NsZWFyIGFsbCBkYXRhPC9hPjwvbGk+JyksXG4gICAgICAkY3JlYXRlRmFtaWx5SG91c2Vob2xkID0gJCgnPGxpPjxhIGhyZWY9XCIjXCIgY2xhc3M9XFwnbW9jay1kYXRhLWZhbWlseVxcJz4nICsgJ0NyZWF0ZSBmYW1pbHkgaG91c2Vob2xkPC9hPjwvbGk+JyksXG4gICAgICAkY3JlYXRlRmFtaWx5UmVsYXRpb25zaGlwcyA9ICQoJzxsaT48YSBocmVmPVwiI1wiJyArICcgY2xhc3M9XFwnbW9jay1kYXRhLWZhbWlseVxcJz4nICsgJ0NyZWF0ZSBmYW1pbHkgd2l0aCByZWxhdGlvbnNoaXBzPC9hPjwvbGk+JyksXG4gICAgICAkY3JlYXRlRmFtaWx5V2l0aFJlbGF0aW9uc2hpcHNBbmRWaXNpdG9ycyA9ICQoJzxsaT48YSBocmVmPVwiI1wiJyArICcgY2xhc3M9XFwnbW9jay1kYXRhLWZhbWlseVxcJz4nICsgJ0NyZWF0ZSBmYW1pbHkgd2l0aCByZWxhdGlvbnNoaXBzIGFuZCB2aXNpdG9yczwvYT48L2xpPicpLFxuICAgICAgJGNyZWF0ZUZhbWlseVdpdGhSZWxhdGlvbnNoaXBzUGVyc29uYWxEZXRhaWxzQW5kVmlzaXRvcnMgPSAkKCc8bGk+PGEnICsgJyBocmVmPVwiI1wiJyArICcgY2xhc3M9XFwnbW9jay1kYXRhLWZhbWlseVxcJz4nICsgJ0NyZWF0ZSBmYW1pbHkgd2l0aCByZWxhdGlvbnNoaXBzLCBqdXN0IGZhbWlseSBpbmRpdmlkdWFsIHJlc3BvbnNlcyBhbmQnICsgJyB2aXNpdG9yczwvYT48L2xpPicpLFxuICAgICAgJGNyZWF0ZUZhbWlseVdpdGhSZWxhdGlvbnNoaXBzUGVyc29uYWxEZXRhaWxzQW5kVmlzaXRvcnNQZXJzb25hbERldGFpbHMgPSAkKCc8bGk+PGEnICsgJyBocmVmPVwiI1wiJyArICcgY2xhc3M9XFwnbW9jay1kYXRhLWZhbWlseVxcJz4nICsgJ0NyZWF0ZSBmYW1pbHkgd2l0aCByZWxhdGlvbnNoaXBzLCBmYW1pbHkgaW5kaXZpZHVhbCByZXNwb25zZXMgYW5kJyArICcgdmlzaXRvcnMgaW5kaXZpZHVhbCByZXNwb25zZXM8L2E+PC9saT4nKSxcbiAgICAgIGZhbWlseUhvdXNlaG9sZE1lbWJlcnNEYXRhID0gW3tcbiAgICAndHlwZSc6ICdob3VzZWhvbGQtbWVtYmVyJyxcbiAgICAnQHBlcnNvbic6IHtcbiAgICAgICdmdWxsTmFtZSc6ICdEYXZlICBKb25lcycsXG4gICAgICAnZmlyc3ROYW1lJzogJ0RhdmUnLFxuICAgICAgJ21pZGRsZU5hbWUnOiAnJyxcbiAgICAgICdsYXN0TmFtZSc6ICdKb25lcycsXG4gICAgICAnaWQnOiAncGVyc29uX21lJ1xuICAgIH1cbiAgfSwge1xuICAgICd0eXBlJzogJ2hvdXNlaG9sZC1tZW1iZXInLFxuICAgICdAcGVyc29uJzoge1xuICAgICAgJ2Z1bGxOYW1lJzogJ1NhbGx5ICBKb25lcycsXG4gICAgICAnZmlyc3ROYW1lJzogJ1NhbGx5JyxcbiAgICAgICdtaWRkbGVOYW1lJzogJycsXG4gICAgICAnbGFzdE5hbWUnOiAnSm9uZXMnLFxuICAgICAgJ2lkJzogJ3BlcnNvbjEnXG4gICAgfVxuICB9LCB7XG4gICAgJ3R5cGUnOiAnaG91c2Vob2xkLW1lbWJlcicsXG4gICAgJ0BwZXJzb24nOiB7XG4gICAgICAnZnVsbE5hbWUnOiAnUmViZWNjYSAgSm9uZXMnLFxuICAgICAgJ2ZpcnN0TmFtZSc6ICdSZWJlY2NhJyxcbiAgICAgICdtaWRkbGVOYW1lJzogJycsXG4gICAgICAnbGFzdE5hbWUnOiAnSm9uZXMnLFxuICAgICAgJ2lkJzogJ3BlcnNvbjInXG4gICAgfVxuICB9LCB7XG4gICAgJ3R5cGUnOiAnaG91c2Vob2xkLW1lbWJlcicsXG4gICAgJ0BwZXJzb24nOiB7XG4gICAgICAnZnVsbE5hbWUnOiAnQW15IEpvbmVzJyxcbiAgICAgICdmaXJzdE5hbWUnOiAnQW15JyxcbiAgICAgICdtaWRkbGVOYW1lJzogJycsXG4gICAgICAnbGFzdE5hbWUnOiAnSm9uZXMnLFxuICAgICAgJ2lkJzogJ3BlcnNvbjMnXG4gICAgfVxuICB9XSxcbiAgICAgIHZpc2l0b3JzTWVtYmVyRGF0YSA9IFt7XG4gICAgJ3R5cGUnOiAndmlzaXRvcicsXG4gICAgJ0BwZXJzb24nOiB7XG4gICAgICAnZnVsbE5hbWUnOiAnR2FyZXRoIEpvaG5zb24nLFxuICAgICAgJ2ZpcnN0TmFtZSc6ICdHYXJldGgnLFxuICAgICAgJ21pZGRsZU5hbWUnOiAnJyxcbiAgICAgICdsYXN0TmFtZSc6ICdKb2huc29uJyxcbiAgICAgICdpZCc6ICdwZXJzb240J1xuICAgIH1cbiAgfSwge1xuICAgICd0eXBlJzogJ3Zpc2l0b3InLFxuICAgICdAcGVyc29uJzoge1xuICAgICAgJ2Z1bGxOYW1lJzogJ0pvaG4gSGFtaWx0b24nLFxuICAgICAgJ2ZpcnN0TmFtZSc6ICdKb2huJyxcbiAgICAgICdtaWRkbGVOYW1lJzogJycsXG4gICAgICAnbGFzdE5hbWUnOiAnSGFtaWx0b24nLFxuICAgICAgJ2lkJzogJ3BlcnNvbjUnXG4gICAgfVxuICB9XSxcbiAgICAgIGZhbWlseUhvdXNlaG9sZFJlbGF0aW9uc2hpcHNEYXRhID0gW3tcbiAgICAncGVyc29uSXNEZXNjcmlwdGlvbic6ICdodXNiYW5kLXdpZmUnLFxuICAgICdwZXJzb25Jc0lkJzogJ3BlcnNvbjEnLFxuICAgICdwZXJzb25Ub0lkJzogJ3BlcnNvbl9tZScsXG4gICAgJ2luZmVycmVkJzogZmFsc2UsXG4gICAgJ2lkJzogMVxuICB9LCB7XG4gICAgJ3BlcnNvbklzRGVzY3JpcHRpb24nOiAnc29uLWRhdWdodGVyJyxcbiAgICAncGVyc29uSXNJZCc6ICdwZXJzb24yJyxcbiAgICAncGVyc29uVG9JZCc6ICdwZXJzb25fbWUnLFxuICAgICdpbmZlcnJlZCc6IGZhbHNlLFxuICAgICdpZCc6IDJcbiAgfSwge1xuICAgICdwZXJzb25Jc0Rlc2NyaXB0aW9uJzogJ21vdGhlci1mYXRoZXInLFxuICAgICdwZXJzb25Jc0lkJzogJ3BlcnNvbl9tZScsXG4gICAgJ3BlcnNvblRvSWQnOiAncGVyc29uMycsXG4gICAgJ2luZmVycmVkJzogZmFsc2UsXG4gICAgJ2lkJzogM1xuICB9LCB7XG4gICAgJ3BlcnNvbklzRGVzY3JpcHRpb24nOiAnc29uLWRhdWdodGVyJyxcbiAgICAncGVyc29uSXNJZCc6ICdwZXJzb24yJyxcbiAgICAncGVyc29uVG9JZCc6ICdwZXJzb24xJyxcbiAgICAnaW5mZXJyZWQnOiBmYWxzZSxcbiAgICAnaWQnOiA0XG4gIH0sIHtcbiAgICAncGVyc29uSXNEZXNjcmlwdGlvbic6ICdtb3RoZXItZmF0aGVyJyxcbiAgICAncGVyc29uSXNJZCc6ICdwZXJzb24xJyxcbiAgICAncGVyc29uVG9JZCc6ICdwZXJzb24zJyxcbiAgICAnaW5mZXJyZWQnOiBmYWxzZSxcbiAgICAnaWQnOiA1XG4gIH0sIHtcbiAgICAncGVyc29uSXNEZXNjcmlwdGlvbic6ICdicm90aGVyLXNpc3RlcicsXG4gICAgJ3BlcnNvbklzSWQnOiAncGVyc29uMycsXG4gICAgJ3BlcnNvblRvSWQnOiAncGVyc29uMicsXG4gICAgJ2luZmVycmVkJzogdHJ1ZSxcbiAgICAnaW5mZXJyZWRCeSc6IFszLCA1LCAyLCA0XSxcbiAgICAnaWQnOiA2XG4gIH1dLFxuICAgICAgZmFtaWx5UGVyc29uYWxEZXRhaWxzID0ge1xuICAgICdwZXJzb25fbWUnOiB7XG4gICAgICAnZG9iJzoge1xuICAgICAgICAnZGF5JzogJzE3JyxcbiAgICAgICAgJ21vbnRoJzogJzQnLFxuICAgICAgICAneWVhcic6ICcxOTY3J1xuICAgICAgfSxcbiAgICAgICdtYXJpdGFsU3RhdHVzJzogJ21hcnJpZWQnLFxuICAgICAgJ2NvdW50cnknOiAnd2FsZXMnLFxuICAgICAgJ29yaWVudGF0aW9uJzogJ3N0cmFpZ2h0JyxcbiAgICAgICdzYWxhcnknOiAnNDAwMDAnXG4gICAgfSxcbiAgICAncGVyc29uMSc6IHtcbiAgICAgICdkb2InOiB7ICdkYXknOiAnMDInLCAnbW9udGgnOiAnMTAnLCAneWVhcic6ICcxOTY1JyB9LFxuICAgICAgJ21hcml0YWxTdGF0dXMnOiAnbWFycmllZCcsXG4gICAgICAnY291bnRyeSc6ICd3YWxlcycsXG4gICAgICAnb3JpZW50YXRpb24nOiAnc3RyYWlnaHQnLFxuICAgICAgJ3NhbGFyeSc6ICc0MDAwMCdcbiAgICB9LFxuICAgICdwZXJzb24yJzoge1xuICAgICAgJ2RvYic6IHsgJ2RheSc6ICcyMCcsICdtb250aCc6ICc1JywgJ3llYXInOiAnMTk4MScgfSxcbiAgICAgICdtYXJpdGFsU3RhdHVzJzogJ25ldmVyJyxcbiAgICAgICdjb3VudHJ5JzogJ3dhbGVzJyxcbiAgICAgICdvcmllbnRhdGlvbic6ICdzdHJhaWdodCcsXG4gICAgICAnc2FsYXJ5JzogJzIwMDAwJ1xuICAgIH0sXG4gICAgJ3BlcnNvbjMnOiB7XG4gICAgICAnZG9iJzogeyAnZGF5JzogJzExJywgJ21vbnRoJzogJzcnLCAneWVhcic6ICcxOTg0JyB9LFxuICAgICAgJ21hcml0YWxTdGF0dXMnOiAnbmV2ZXInLFxuICAgICAgJ2NvdW50cnknOiAnd2FsZXMnLFxuICAgICAgJ29yaWVudGF0aW9uJzogJ3N0cmFpZ2h0JyxcbiAgICAgICdzYWxhcnknOiAnMjAwMDAnXG4gICAgfVxuICB9LFxuICAgICAgdmlzaXRvcnNQZXJzb25hbERldGFpbHMgPSB7XG4gICAgJ3BlcnNvbjQnOiB7XG4gICAgICAnc2V4JzogJ21hbGUnLFxuICAgICAgJ2RvYic6IHsgJ2RheSc6ICcyMCcsICdtb250aCc6ICc3JywgJ3llYXInOiAnMTk5MCcgfSxcbiAgICAgICdhZGRyZXNzLXdoZXJlJzogJ2luLXVrJyxcbiAgICAgICdhZGRyZXNzJzoge1xuICAgICAgICAnYWRkcmVzcy1saW5lLTEnOiAnMTUnLFxuICAgICAgICAnYWRkcmVzcy1saW5lLTInOiAnU29tZXdoZXJlIG5lYXInLFxuICAgICAgICAndG93bi1jaXR5JzogJ0xsYW5kcmlkbm9kJyxcbiAgICAgICAgJ2NvdW50eSc6ICdQb3d5cycsXG4gICAgICAgICdwb3N0Y29kZSc6ICdMTDM0IEFONSdcbiAgICAgIH1cbiAgICB9LFxuICAgICdwZXJzb241Jzoge1xuICAgICAgJ3NleCc6ICdtYWxlJyxcbiAgICAgICdkb2InOiB7ICdkYXknOiAnMDInLCAnbW9udGgnOiAnNScsICd5ZWFyJzogJzE5OTEnIH0sXG4gICAgICAnYWRkcmVzcy13aGVyZSc6ICdvdXQtdWsnLFxuICAgICAgJ2FkZHJlc3MnOiB7XG4gICAgICAgICdhZGRyZXNzLWxpbmUtMSc6ICc5NCcsXG4gICAgICAgICdhZGRyZXNzLWxpbmUtMic6ICdTb21ld2hlcmUgRmFyJyxcbiAgICAgICAgJ3Rvd24tY2l0eSc6ICdTcHJpbmdmaWVsZCcsXG4gICAgICAgICdjb3VudHknOiAnTmV3IFlvcmsnLFxuICAgICAgICAncG9zdGNvZGUnOiAnTlkxMEEnXG4gICAgICB9XG4gICAgfVxuICB9LFxuICAgICAgdXNlckRhdGEgPSB7XG4gICAgJ2Z1bGxOYW1lJzogJ0RhdmUgIEpvbmVzJyxcbiAgICAnZmlyc3ROYW1lJzogJ0RhdmUnLFxuICAgICdtaWRkbGVOYW1lJzogJycsXG4gICAgJ2xhc3ROYW1lJzogJ0pvbmVzJ1xuICB9O1xuXG4gICRjcmVhdGVGYW1pbHlIb3VzZWhvbGQub24oJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgY2xlYXJTdG9yYWdlKCk7XG4gICAgcHJlcmVxdWlzaXRlcygpO1xuICAgIGNyZWF0ZUZhbWlseUhvdXNlaG9sZCgpO1xuICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gJy4uL3N1bW1hcnknO1xuICB9KTtcblxuICAkY3JlYXRlRmFtaWx5UmVsYXRpb25zaGlwcy5vbignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBjbGVhclN0b3JhZ2UoKTtcbiAgICBwcmVyZXF1aXNpdGVzKCk7XG4gICAgY3JlYXRlRmFtaWx5SG91c2Vob2xkKCk7XG4gICAgY3JlYXRlRmFtaWx5UmVsYXRpb25zaGlwcygpO1xuICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gJy4uL2h1Yic7XG4gIH0pO1xuXG4gICRjcmVhdGVGYW1pbHlXaXRoUmVsYXRpb25zaGlwc0FuZFZpc2l0b3JzLm9uKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGNsZWFyU3RvcmFnZSgpO1xuICAgIHByZXJlcXVpc2l0ZXMoKTtcbiAgICBjcmVhdGVGYW1pbHlIb3VzZWhvbGRXaXRoVmlzaXRvcnMoKTtcbiAgICBjcmVhdGVGYW1pbHlSZWxhdGlvbnNoaXBzKCk7XG4gICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSAnLi4vaHViJztcbiAgfSk7XG5cbiAgJGNyZWF0ZUZhbWlseVdpdGhSZWxhdGlvbnNoaXBzUGVyc29uYWxEZXRhaWxzQW5kVmlzaXRvcnMub24oJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgY2xlYXJTdG9yYWdlKCk7XG4gICAgcHJlcmVxdWlzaXRlcygpO1xuICAgIGNyZWF0ZUZhbWlseUhvdXNlaG9sZFdpdGhWaXNpdG9ycygpO1xuICAgIGNyZWF0ZUZhbWlseVJlbGF0aW9uc2hpcHMoKTtcbiAgICBjcmVhdGVGYW1pbHlQZXJzb25hbERldGFpbHMoKTtcbiAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9ICcuLi9odWInO1xuICB9KTtcblxuICAkY3JlYXRlRmFtaWx5V2l0aFJlbGF0aW9uc2hpcHNQZXJzb25hbERldGFpbHNBbmRWaXNpdG9yc1BlcnNvbmFsRGV0YWlscy5vbignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBjbGVhclN0b3JhZ2UoKTtcbiAgICBwcmVyZXF1aXNpdGVzKCk7XG4gICAgY3JlYXRlRmFtaWx5SG91c2Vob2xkV2l0aFZpc2l0b3JzKCk7XG4gICAgY3JlYXRlRmFtaWx5UmVsYXRpb25zaGlwcygpO1xuICAgIGNyZWF0ZUZhbWlseVZpc2l0b3JzUGVyc29uYWxEZXRhaWxzKCk7XG4gICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSAnLi4vaHViJztcbiAgfSk7XG5cbiAgJGNsZWFyRGF0YS5vbignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBjbGVhclN0b3JhZ2UoKTtcbiAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9ICcuLi90ZXN0LWFkZHJlc3MnO1xuICB9KTtcblxuICBmdW5jdGlvbiBwcmVyZXF1aXNpdGVzKCkge1xuICAgIHNlc3Npb25TdG9yYWdlLnNldEl0ZW0oJ2FkZHJlc3MnLCAnMTIgU29tZXdoZXJlIENsb3NlLCBOZXdwb3J0LCBDRjEyIDNBQicpO1xuICAgIHNlc3Npb25TdG9yYWdlLnNldEl0ZW0oJ2FkZHJlc3MtbGluZS0xJywgJzEyJyk7XG4gICAgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbSgnYWRkcmVzcy1saW5lLTInLCAnU29tZXdoZXJlIGNsb3NlJyk7XG4gICAgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbSgnY291bnR5JywgJ05ld3BvcnQnKTtcbiAgICBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKCdsaXZlcy1oZXJlJywgJ3llcycpO1xuICAgIHNlc3Npb25TdG9yYWdlLnNldEl0ZW0oJ3Bvc3Rjb2RlJywgJ0NGMTIgM0FCJyk7XG4gICAgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbSgndG93bi1jaXR5JywgJ05ld3BvcnQnKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNyZWF0ZUZhbWlseUhvdXNlaG9sZCgpIHtcbiAgICBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKCd1c2VyLWRldGFpbHMnLCBKU09OLnN0cmluZ2lmeSh1c2VyRGF0YSkpO1xuICAgIHNlc3Npb25TdG9yYWdlLnNldEl0ZW0od2luZG93Lk9OUy5zdG9yYWdlLktFWVMuSE9VU0VIT0xEX01FTUJFUlNfU1RPUkFHRV9LRVksIEpTT04uc3RyaW5naWZ5KGZhbWlseUhvdXNlaG9sZE1lbWJlcnNEYXRhKSk7XG4gICAgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbSgnaG91c2Vob2xkLW1lbWJlcnMtaW5jcmVtZW50JywgSlNPTi5zdHJpbmdpZnkoNCkpO1xuICB9XG5cbiAgZnVuY3Rpb24gY3JlYXRlRmFtaWx5SG91c2Vob2xkV2l0aFZpc2l0b3JzKCkge1xuICAgIHNlc3Npb25TdG9yYWdlLnNldEl0ZW0od2luZG93Lk9OUy5zdG9yYWdlLktFWVMuSE9VU0VIT0xEX01FTUJFUlNfU1RPUkFHRV9LRVksIEpTT04uc3RyaW5naWZ5KFtdLmNvbmNhdChmYW1pbHlIb3VzZWhvbGRNZW1iZXJzRGF0YSwgdmlzaXRvcnNNZW1iZXJEYXRhKSkpO1xuICB9XG5cbiAgZnVuY3Rpb24gY3JlYXRlRmFtaWx5UmVsYXRpb25zaGlwcygpIHtcbiAgICBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKHdpbmRvdy5PTlMuc3RvcmFnZS5LRVlTLlJFTEFUSU9OU0hJUFNfU1RPUkFHRV9LRVksIEpTT04uc3RyaW5naWZ5KGZhbWlseUhvdXNlaG9sZFJlbGF0aW9uc2hpcHNEYXRhKSk7XG4gICAgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbSgncmVsYXRpb25zaGlwcy1pbmNyZW1lbnQnLCBKU09OLnN0cmluZ2lmeSg2KSk7XG4gIH1cblxuICBmdW5jdGlvbiBjcmVhdGVGYW1pbHlQZXJzb25hbERldGFpbHMoKSB7XG4gICAgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbSh3aW5kb3cuT05TLnN0b3JhZ2UuS0VZUy5QRVJTT05BTF9ERVRBSUxTX0tFWSwgSlNPTi5zdHJpbmdpZnkoZmFtaWx5UGVyc29uYWxEZXRhaWxzKSk7XG4gIH1cblxuICBmdW5jdGlvbiBjcmVhdGVGYW1pbHlWaXNpdG9yc1BlcnNvbmFsRGV0YWlscygpIHtcbiAgICBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKHdpbmRvdy5PTlMuc3RvcmFnZS5LRVlTLlBFUlNPTkFMX0RFVEFJTFNfS0VZLCBKU09OLnN0cmluZ2lmeShfZXh0ZW5kcyh7fSwgZmFtaWx5UGVyc29uYWxEZXRhaWxzLCB2aXNpdG9yc1BlcnNvbmFsRGV0YWlscykpKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNsZWFyU3RvcmFnZSgpIHtcbiAgICBzZXNzaW9uU3RvcmFnZS5jbGVhcigpO1xuICB9XG5cbiAgJGxpc3RMaW5rcy5hcHBlbmQoJGNyZWF0ZUZhbWlseUhvdXNlaG9sZCk7XG4gICRsaXN0TGlua3MuYXBwZW5kKCRjcmVhdGVGYW1pbHlSZWxhdGlvbnNoaXBzKTtcbiAgJGxpc3RMaW5rcy5hcHBlbmQoJGNyZWF0ZUZhbWlseVdpdGhSZWxhdGlvbnNoaXBzQW5kVmlzaXRvcnMpO1xuICAkbGlzdExpbmtzLmFwcGVuZCgkY3JlYXRlRmFtaWx5V2l0aFJlbGF0aW9uc2hpcHNQZXJzb25hbERldGFpbHNBbmRWaXNpdG9ycyk7XG4gICRsaXN0TGlua3MuYXBwZW5kKCRjcmVhdGVGYW1pbHlXaXRoUmVsYXRpb25zaGlwc1BlcnNvbmFsRGV0YWlsc0FuZFZpc2l0b3JzUGVyc29uYWxEZXRhaWxzKTtcbiAgJGxpc3RMaW5rcy5hcHBlbmQoJGNsZWFyRGF0YSk7XG59XG5cbnZhciBVU0VSX1NUT1JBR0VfS0VZID0gJ3VzZXItZGV0YWlscyc7XG52YXIgSU5ESVZJRFVBTF9QUk9YWV9TVE9SQUdFX0tFWSA9ICdwcm94eS1wZXJzb24nO1xuXG5mdW5jdGlvbiBnZXRBZGRyZXNzKCkge1xuICB2YXIgYWRkcmVzc0xpbmVzID0gc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbSgnYWRkcmVzcycpLnNwbGl0KCcsJyk7XG5cbiAgcmV0dXJuIHtcbiAgICBhZGRyZXNzTGluZTE6IGFkZHJlc3NMaW5lc1swXSxcbiAgICBhZGRyZXNzTGluZTI6IGFkZHJlc3NMaW5lc1sxXSxcbiAgICBhZGRyZXNzTGluZTM6IGFkZHJlc3NMaW5lc1syXSxcbiAgICBhZGRyZXNzQ291bnR5OiBhZGRyZXNzTGluZXNbNF0sXG4gICAgYWRkcmVzc1Rvd25DaXR5OiBhZGRyZXNzTGluZXNbM10sXG4gICAgYWRkcmVzc1Bvc3Rjb2RlOiBhZGRyZXNzTGluZXNbNV1cbiAgfTtcbn1cblxuLyoqXG4gKiBVc2VyXG4gKi9cbmZ1bmN0aW9uIGFkZFVzZXJQZXJzb24ocGVyc29uJCQxKSB7XG4gIHNlc3Npb25TdG9yYWdlLnNldEl0ZW0oVVNFUl9TVE9SQUdFX0tFWSwgSlNPTi5zdHJpbmdpZnkocGVyc29uJCQxKSk7XG59XG5cbmZ1bmN0aW9uIGdldFVzZXJQZXJzb24oKSB7XG4gIHJldHVybiBKU09OLnBhcnNlKHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oVVNFUl9TVE9SQUdFX0tFWSkpO1xufVxuXG4vKipcbiAqIEhlbHBlcnNcbiAqL1xuZnVuY3Rpb24gY3JlYXRlTmF2SXRlbShtZW1iZXIpIHtcbiAgdmFyICRub2RlRWwgPSAkKCc8bGkgY2xhc3M9XCJqcy10ZW1wbGF0ZS1uYXYtaXRlbSBuYXZfX2l0ZW0gcGx1dG9cIj4nICsgJyAgPGEgY2xhc3M9XCJqcy10ZW1wbGF0ZS1uYXYtaXRlbS1sYWJlbCBuYXZfX2xpbmtcIiBocmVmPVwiI1wiPjwvYT4nICsgJzwvbGk+JyksXG4gICAgICAkbGlua0VsID0gJG5vZGVFbC5maW5kKCcuanMtdGVtcGxhdGUtbmF2LWl0ZW0tbGFiZWwnKTtcblxuICAkbGlua0VsLmh0bWwobWVtYmVyWydAcGVyc29uJ10uZnVsbE5hbWUpO1xuXG4gIGlmIChtZW1iZXJbJ0BwZXJzb24nXS5pZCA9PT0gVVNFUl9IT1VTRUhPTERfTUVNQkVSX0lEKSB7XG4gICAgJGxpbmtFbC5hdHRyKCdocmVmJywgJy4uL3doYXQtaXMteW91ci1uYW1lJyk7XG4gIH0gZWxzZSB7XG4gICAgJGxpbmtFbC5hdHRyKCdocmVmJywgJy4uL3doby1lbHNlLXRvLWFkZD9lZGl0PScgKyBtZW1iZXJbJ0BwZXJzb24nXS5pZCk7XG4gIH1cblxuICByZXR1cm4gJG5vZGVFbDtcbn1cblxuZnVuY3Rpb24gdXBkYXRlSG91c2Vob2xkVmlzaXRvcnNOYXZpZ2F0aW9uSXRlbXMoKSB7XG4gIHZhciBhbGxIb3VzZWhvbGRNZW1iZXJzID0gd2luZG93Lk9OUy5zdG9yYWdlLmdldEFsbEhvdXNlaG9sZE1lbWJlcnMoKSxcbiAgICAgIGhvdXNlaG9sZE1lbWJlcnMgPSBhbGxIb3VzZWhvbGRNZW1iZXJzLmZpbHRlcih3aW5kb3cuT05TLnN0b3JhZ2UuaXNIb3VzZWhvbGRNZW1iZXIpLFxuICAgICAgdmlzaXRvcnMgPSBhbGxIb3VzZWhvbGRNZW1iZXJzLmZpbHRlcih3aW5kb3cuT05TLnN0b3JhZ2UuaXNWaXNpdG9yKTtcblxuICB2YXIgJG5hdmlnYXRpb25Ib3VzZWhvbGRNZW1iZXJzRWwgPSAkKCcjbmF2aWdhdGlvbi1ob3VzZWhvbGQtbWVtYmVycycpLFxuICAgICAgJG5hdmlnYXRpb25WaXNpdG9yc0VsID0gJCgnI25hdmlnYXRpb24tdmlzaXRvcnMnKTtcblxuICBpZiAoaG91c2Vob2xkTWVtYmVycy5sZW5ndGgpIHtcbiAgICAkLmVhY2goaG91c2Vob2xkTWVtYmVycywgZnVuY3Rpb24gKGksIG1lbWJlcikge1xuICAgICAgJG5hdmlnYXRpb25Ib3VzZWhvbGRNZW1iZXJzRWwuYXBwZW5kKGNyZWF0ZU5hdkl0ZW0obWVtYmVyKSk7XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgJG5hdmlnYXRpb25Ib3VzZWhvbGRNZW1iZXJzRWwucGFyZW50KCkuaGlkZSgpO1xuICB9XG5cbiAgaWYgKHZpc2l0b3JzLmxlbmd0aCkge1xuICAgICQuZWFjaCh2aXNpdG9ycywgZnVuY3Rpb24gKGksIG1lbWJlcikge1xuICAgICAgJG5hdmlnYXRpb25WaXNpdG9yc0VsLmFwcGVuZChjcmVhdGVOYXZJdGVtKG1lbWJlcikpO1xuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgICRuYXZpZ2F0aW9uVmlzaXRvcnNFbC5wYXJlbnQoKS5oaWRlKCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gY3JlYXRlTGlzdEl0ZW1QZXJzb24obWVtYmVyKSB7XG4gIHJldHVybiAkKCc8bGkgY2xhc3M9XCJsaXN0X19pdGVtXCI+JykuYWRkQ2xhc3MoJ21hcnMnKS5odG1sKCc8c3BhbiBjbGFzcz1cImxpc3RfX2l0ZW0tbmFtZVwiPicgKyBtZW1iZXJbJ0BwZXJzb24nXS5mdWxsTmFtZSArIChtZW1iZXJbJ0BwZXJzb24nXS5pZCA9PT0gVVNFUl9IT1VTRUhPTERfTUVNQkVSX0lEID8gJyAoWW91KScgOiAnJykgKyAnPC9zcGFuPicpO1xufVxuXG5mdW5jdGlvbiBwb3B1bGF0ZUxpc3QoJGVsLCBtZW1iZXJUeXBlKSB7XG4gIGlmICghJGVsLmxlbmd0aCkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHZhciBtZW1iZXJzID0gZ2V0QWxsSG91c2Vob2xkTWVtYmVycygpIHx8IFtdO1xuXG4gICRlbC5lbXB0eSgpLmFwcGVuZChtZW1iZXJzLmZpbHRlcihmdW5jdGlvbiAobWVtYmVyKSB7XG4gICAgcmV0dXJuIG1lbWJlci50eXBlID09PSBtZW1iZXJUeXBlO1xuICB9KS5tYXAoY3JlYXRlTGlzdEl0ZW1QZXJzb24pKTtcblxuICAkZWwuYWRkQ2xhc3MoJ2xpc3QgbGlzdC0tcGVvcGxlLXBsYWluJyk7XG59XG5cbmZ1bmN0aW9uIHBvcHVsYXRlSG91c2Vob2xkTGlzdCgpIHtcbiAgcG9wdWxhdGVMaXN0KCQoJyNob3VzZWhvbGQtbWVtYmVycycpLCBIT1VTRUhPTERfTUVNQkVSX1RZUEUpO1xufVxuXG5mdW5jdGlvbiBwb3B1bGF0ZVZpc2l0b3JMaXN0KCkge1xuICBwb3B1bGF0ZUxpc3QoJCgnI3Zpc2l0b3JzLWxpc3QnKSwgVklTSVRPUl9UWVBFKTtcbn1cblxuZnVuY3Rpb24gdXBkYXRlQWRkcmVzc2VzKCkge1xuICB2YXIgYWRkcmVzc0xpbmVzID0gKHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oJ2FkZHJlc3MnKSB8fCAnJykuc3BsaXQoJywnKSxcbiAgICAgIGFkZHJlc3NMaW5lMSA9IGFkZHJlc3NMaW5lc1swXSxcbiAgICAgIGFkZHJlc3NMaW5lMiA9IGFkZHJlc3NMaW5lc1sxXTtcblxuICAkKCcjc2VjdGlvbi1hZGRyZXNzJykuaHRtbChhZGRyZXNzTGluZTEgfHwgJzxhJyArICcgaHJlZj1cIi4uL3Rlc3QtYWRkcmVzc1wiPkFkZHJlc3Mgbm90JyArICcgZm91bmQ8L2E+Jyk7XG4gICQoJy5hZGRyZXNzLXRleHQnKS5odG1sKGFkZHJlc3NMaW5lMSAmJiBhZGRyZXNzTGluZTIgPyBhZGRyZXNzTGluZTEgKyAoYWRkcmVzc0xpbmUyID8gJywgJyArIGFkZHJlc3NMaW5lMiA6ICcnKSA6ICc8YSBocmVmPVwiLi4vdGVzdC1hZGRyZXNzXCI+QWRkcmVzcyBub3QgZm91bmQ8L2E+Jyk7XG5cbiAgJCgnLmFkZHJlc3MtdGV4dC1saW5lMScpLmh0bWwoYWRkcmVzc0xpbmUxKTtcblxuICB2YXIgcGVyc29uSWQgPSBuZXcgVVJMU2VhcmNoUGFyYW1zKHdpbmRvdy5sb2NhdGlvbi5zZWFyY2gpLmdldCgncGVyc29uJyksXG4gICAgICBwZXJzb24kJDEgPSB2b2lkIDA7XG5cbiAgaWYgKHBlcnNvbklkKSB7XG4gICAgcGVyc29uJCQxID0gZ2V0SG91c2Vob2xkTWVtYmVyQnlQZXJzb25JZChwZXJzb25JZClbJ0BwZXJzb24nXTtcbiAgICAkKCcjc2VjdGlvbi1pbmRpdmlkdWFsJykuaHRtbChwZXJzb24kJDEuZnVsbE5hbWUpO1xuXG4gICAgJCgnLmpzLXBlcnNvbi1mdWxsbmFtZS1mcm9tLXVybC1pZCcpLmh0bWwocGVyc29uJCQxLmZ1bGxOYW1lKTtcbiAgfVxufVxuXG52YXIgc2VjdXJlTGlua1RleHRNYXAgPSB7XG4gICdxdWVzdGlvbi15b3UnOiB7XG4gICAgZGVzY3JpcHRpb246ICdXYW50IHRvIGtlZXAgeW91ciBhbnN3ZXJzIHNlY3VyZSBmcm9tIG90aGVyIHBlb3BsZSBhdCB0aGlzJyArICcgYWRkcmVzcz8nLFxuICAgIGxpbmtUZXh0OiAnR2V0IGEgc2VwYXJhdGUgYWNjZXNzIGNvZGUgdG8gc3VibWl0IGFuIGluZGl2aWR1YWwgcmVzcG9uc2UnLFxuICAgIGxpbms6ICcuLi9pbmRpdmlkdWFsLWRlY2lzaW9uLXNlY3VyZSdcbiAgfSxcbiAgJ3Bpbi15b3UnOiB7XG4gICAgZGVzY3JpcHRpb246ICdZb3VcXCd2ZSBjaG9zZW4gdG8ga2VlcCB5b3VyIGFuc3dlcnMgc2VjdXJlJyxcbiAgICBsaW5rVGV4dDogJ0NhbmNlbCB0aGlzIGFuZCBtYWtlIGFuc3dlcnMgYXZhaWxhYmxlIHRvIHRoZSByZXN0IG9mIHRoZScgKyAnIGhvdXNlaG9sZCcsXG4gICAgbGluazogJy4uL2luZGl2aWR1YWwtZGVjaXNpb24tc2VjdXJlJ1xuICB9LFxuICAncXVlc3Rpb24tcHJveHknOiB7XG4gICAgZGVzY3JpcHRpb246ICdOb3QgaGFwcHkgdG8gY29udGludWUgYW5zd2VyaW5nIGZvciAkW05BTUVdPycsXG4gICAgbGlua1RleHQ6ICdSZXF1ZXN0IGFuIGluZGl2aWR1YWwgYWNjZXNzIGNvZGUgdG8gYmUgc2VudCB0byB0aGVtJyxcbiAgICBsaW5rOiAnLi4vaW5kaXZpZHVhbC1kZWNpc2lvbi1vdGhlci1zZWN1cmUnXG4gIH1cbn07XG5cbmZ1bmN0aW9uIHVwZGF0ZUFsbFByZXZpb3VzTGlua3MoKSB7XG4gICQoJy5qcy1wcmV2aW91cy1saW5rJykuYXR0cignaHJlZicsIGRvY3VtZW50LnJlZmVycmVyKTtcbn1cblxuZnVuY3Rpb24gdXBkYXRlUGVyc29uTGluaygpIHtcbiAgdmFyIHBlcnNvbklkID0gbmV3IFVSTFNlYXJjaFBhcmFtcyh3aW5kb3cubG9jYXRpb24uc2VhcmNoKS5nZXQoJ3BlcnNvbicpO1xuXG4gIGlmIChwZXJzb25JZCkge1xuICAgIHZhciB1cmxQYXJhbSA9IG5ldyBVUkxTZWFyY2hQYXJhbXMod2luZG93LmxvY2F0aW9uLnNlYXJjaCksXG4gICAgICAgIF9wZXJzb24gPSBnZXRIb3VzZWhvbGRNZW1iZXJCeVBlcnNvbklkKHBlcnNvbklkKVsnQHBlcnNvbiddLFxuICAgICAgICBwaW5PYmogPSBnZXRQaW5Gb3IocGVyc29uSWQpLFxuICAgICAgICBzZWN1cmVMaW5rVGV4dENvbmZpZyA9IHNlY3VyZUxpbmtUZXh0TWFwW2dldEFuc3dlcmluZ0luZGl2aWR1YWxCeVByb3h5KCkgPyAncXVlc3Rpb24tcHJveHknIDogcGluT2JqICYmIHBpbk9iai5waW4gPyAncGluLXlvdScgOiAncXVlc3Rpb24teW91J10sXG4gICAgICAgIGxpbmtIcmVmID0gc2VjdXJlTGlua1RleHRDb25maWcubGluayArICc/cGVyc29uPScgKyBwZXJzb25JZCArICcmcmV0dXJudXJsPScgKyB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUsXG4gICAgICAgIHN1cnZleVR5cGUgPSB1cmxQYXJhbS5nZXQoJ3N1cnZleScpO1xuXG4gICAgbGlua0hyZWYgKz0gc3VydmV5VHlwZSA/ICcmc3VydmV5PScgKyBzdXJ2ZXlUeXBlIDogJyc7XG5cbiAgICB2YXIgJHNlY3VyZUxpbmsgPSAkKCcuanMtbGluay1zZWN1cmUnKTtcbiAgICAkc2VjdXJlTGluay5hdHRyKCdocmVmJywgbGlua0hyZWYpO1xuXG4gICAgJHNlY3VyZUxpbmsuaHRtbChzZWN1cmVMaW5rVGV4dENvbmZpZy5saW5rVGV4dCk7XG4gICAgJCgnLmpzLWxpbmstc2VjdXJlLWxhYmVsJykuaHRtbChzZWN1cmVMaW5rVGV4dENvbmZpZy5kZXNjcmlwdGlvbi5yZXBsYWNlKCckW05BTUVdJywgX3BlcnNvbi5mdWxsTmFtZSkpO1xuXG4gICAgdmFyIHBlcnNvbkxpbmsgPSAkKCcuanMtbGluay1wZXJzb24nKTtcbiAgICBwZXJzb25MaW5rLmF0dHIoJ2hyZWYnLCBwZXJzb25MaW5rLmF0dHIoJ2hyZWYnKSArICc/cGVyc29uPScgKyBwZXJzb25JZCArIChzdXJ2ZXlUeXBlID8gJyZzdXJ2ZXk9JyArIHN1cnZleVR5cGUgOiAnJykpO1xuICB9XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZUJ5U3VydmV5VHlwZSgpIHtcbiAgdmFyIHVybFBhcmFtcyA9IG5ldyBVUkxTZWFyY2hQYXJhbXMod2luZG93LmxvY2F0aW9uLnNlYXJjaCksXG4gICAgICBzdXJ2ZXlUeXBlID0gdXJsUGFyYW1zLmdldCgnc3VydmV5Jyk7XG5cbiAgaWYgKHN1cnZleVR5cGUpIHtcbiAgICAkKCcuanMtaGVhZGVyLXRpdGxlJykuaHRtbChzdXJ2ZXlUeXBlQ29uZmlnW3N1cnZleVR5cGVdLnRpdGxlKTtcbiAgICAkKCcjcGVvcGxlLWxpdmluZy1oZXJlJykuaHRtbChzdXJ2ZXlUeXBlQ29uZmlnW3N1cnZleVR5cGVdLmhvdXNlaG9sZFNlY3Rpb25UaXRsZSk7XG4gICAgJCgnI3Blb3BsZS1saXZpbmctaGVyZScpLmF0dHIoJ2hyZWYnLCBzdXJ2ZXlUeXBlQ29uZmlnW3N1cnZleVR5cGVdLmhvdXNlaG9sZFNlY3Rpb25MaW5rKTtcbiAgICAkKCcjcmVsYXRpb25zaGlwcy1zZWN0aW9uJykuYXR0cignaHJlZicsIHN1cnZleVR5cGVDb25maWdbc3VydmV5VHlwZV0ucmVsYXRpb25zaGlwc1NlY3Rpb24pO1xuICAgICQoJ3RpdGxlJykuaHRtbChzdXJ2ZXlUeXBlQ29uZmlnW3N1cnZleVR5cGVdLnRpdGxlKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBzZXRBbnN3ZXJpbmdJbmRpdmlkdWFsQnlQcm94eShib29sKSB7XG4gIHNlc3Npb25TdG9yYWdlLnNldEl0ZW0oSU5ESVZJRFVBTF9QUk9YWV9TVE9SQUdFX0tFWSwgSlNPTi5zdHJpbmdpZnkoYm9vbCkpO1xufVxuXG5mdW5jdGlvbiBnZXRBbnN3ZXJpbmdJbmRpdmlkdWFsQnlQcm94eSgpIHtcbiAgcmV0dXJuIEpTT04ucGFyc2Uoc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbShJTkRJVklEVUFMX1BST1hZX1NUT1JBR0VfS0VZKSk7XG59XG5cbnZhciBzdXJ2ZXlUeXBlQ29uZmlnID0ge1xuICBsbXM6IHtcbiAgICB0aXRsZTogJ09ubGluZSBIb3VzZWhvbGQgU3R1ZHknLFxuICAgIGhvdXNlaG9sZFNlY3Rpb25UaXRsZTogJ0Fib3V0IHlvdXIgaG91c2Vob2xkJyxcbiAgICBob3VzZWhvbGRTZWN0aW9uTGluazogJy4uL3N1bW1hcnkvP3N1cnZleT1sbXMnLFxuICAgIHJlbGF0aW9uc2hpcHNTZWN0aW9uOiAnLi4vcmVsYXRpb25zaGlwcy8/c3VydmV5PWxtcydcbiAgfVxufTtcblxuZnVuY3Rpb24gZG9JTGl2ZUhlcmUoKSB7XG4gIHJldHVybiBzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKCdsaXZlcy1oZXJlJykgPT09ICd5ZXMnO1xufVxuXG5mdW5jdGlvbiBnZXRTaWduaWZpY2FudCgpIHtcbiAgcmV0dXJuICczIEZlYnJ1YXJ5IDIwMTknO1xufVxuXG5mdW5jdGlvbiB1cGRhdGVTaWduaWZpY2FudERhdGUoKSB7XG4gICQoJy5qcy1zaWduaWZpY2FudC1kYXRlJykuaHRtbChnZXRTaWduaWZpY2FudCgpKTtcbn1cblxuZnVuY3Rpb24gcGVyc29uUmVjb3JkVGVtcGxhdGUoKSB7XG4gIHJldHVybiAkKCc8bGkgaWQ9XCJwZXJzb24tcmVjb3JkLXRlbXBsYXRlXCIgY2xhc3M9XCJsaXN0X19pdGVtXCI+XFxuICAgICAgICA8c3BhbiBjbGFzcz1cImxpc3RfX2l0ZW0tbmFtZSBqcy1wZXJzb24tbmFtZVwiPjwvc3Bhbj5cXG4gICAgICAgIDxkaXYgY2xhc3M9XCJsaXN0X19pdGVtLWFjdGlvbnMgdS1mclwiPlxcbiAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwibGlzdF9faXRlbS1hY3Rpb25cIj5cXG4gICAgICAgICAgICAgICAgPGEgY2xhc3M9XCJqcy1yZWNvcmQtZWRpdFwiIGhyZWY9XCIjXCI+Q2hhbmdlIG9yIHJlbW92ZTwvYT5cXG4gICAgICAgICAgICA8L3NwYW4+XFxuICAgICAgICA8L2Rpdj5cXG4gICAgPC9saT4nKTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlTWVtYmVySXRlbShtZW1iZXIpIHtcbiAgdmFyIF9yZWYgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IHsgcmVkaXJlY3Q6IG51bGwgfSxcbiAgICAgIHJlZGlyZWN0ID0gX3JlZi5yZWRpcmVjdDtcblxuICB2YXIgJG5vZGVFbCA9IHBlcnNvblJlY29yZFRlbXBsYXRlKCksXG4gICAgICB1cmxQYXJhbXMgPSBuZXcgVVJMU2VhcmNoUGFyYW1zKHdpbmRvdy5sb2NhdGlvbi5zZWFyY2gpLFxuICAgICAgcGVyc29uTmFtZVRleHQgPSBtZW1iZXJbJ0BwZXJzb24nXS5mdWxsTmFtZSxcbiAgICAgIG1lbWJlcklzVXNlciA9IGlzTWVtYmVyVXNlcihtZW1iZXIpLFxuICAgICAgc3VydmV5VHlwZSA9IHVybFBhcmFtcy5nZXQoJ3N1cnZleScpLFxuICAgICAgYWx0UGFnZSA9IHN1cnZleVR5cGUgJiYgc3VydmV5VHlwZSA9PT0gJ2xtcycgPyBzdXJ2ZXlUeXBlICsgJy8nIDogJyc7XG5cbiAgaWYgKG1lbWJlcklzVXNlcikge1xuICAgIHBlcnNvbk5hbWVUZXh0ICs9ICcgKFlvdSknO1xuICB9XG5cbiAgJG5vZGVFbC5hdHRyKCdpZCcsICcnKTtcbiAgJG5vZGVFbC5maW5kKCcuanMtcGVyc29uLW5hbWUnKS5odG1sKHBlcnNvbk5hbWVUZXh0KTtcblxuICAkbm9kZUVsLmZpbmQoJy5qcy1yZWNvcmQtZWRpdCcpLmF0dHIoJ2hyZWYnLCAobWVtYmVySXNVc2VyID8gJy4uLycgKyBhbHRQYWdlICsgJ3doYXQtaXMteW91ci1uYW1lLz9lZGl0PXRydWUnIDogJy4uLycgKyBhbHRQYWdlICsgJ3doby1lbHNlLXRvLWFkZC8/ZWRpdD0nICsgbWVtYmVyWydAcGVyc29uJ10uaWQgKyAoaXNWaXNpdG9yKG1lbWJlcikgPyAnJmpvdXJuZXk9dmlzaXRvcnMnIDogJycpKSArIChyZWRpcmVjdCA/ICcmcmVkaXJlY3Q9JyArIGVuY29kZVVSSUNvbXBvbmVudCh3aW5kb3cubG9jYXRpb24uaHJlZikgOiAnJykpO1xuXG4gIHJldHVybiAkbm9kZUVsO1xufVxuXG5mdW5jdGlvbiB1cGRhdGVIb3VzZWhvbGRTdW1tYXJ5KCkge1xuICB2YXIgbWVtYmVycyA9IGdldEFsbEhvdXNlaG9sZE1lbWJlcnMoKTtcblxuICAkKCcuanMtaG91c2Vob2xkLW1lbWJlcnMtc3VtbWFyeScpLmVhY2goZnVuY3Rpb24gKGksIGVsKSB7XG4gICAgdmFyICRlbCA9ICQoZWwpO1xuXG4gICAgJC5lYWNoKFtdLmNvbmNhdCh0b0NvbnN1bWFibGVBcnJheShtZW1iZXJzLmZpbHRlcihpc01lbWJlclVzZXIpKSwgdG9Db25zdW1hYmxlQXJyYXkobWVtYmVycy5maWx0ZXIoaXNPdGhlckhvdXNlaG9sZE1lbWJlcikpKSwgZnVuY3Rpb24gKGksIG1lbWJlcikge1xuICAgICAgJGVsLmFwcGVuZChjcmVhdGVNZW1iZXJJdGVtKG1lbWJlciwgeyByZWRpcmVjdDogJGVsLmF0dHIoJ2RhdGEtcmVkaXJlY3QnKSB9KSk7XG4gICAgfSk7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiB1cGRhdGVWaXNpdG9yc1N1bW1hcnkoKSB7XG4gIHZhciBtZW1iZXJzID0gZ2V0QWxsSG91c2Vob2xkTWVtYmVycygpO1xuXG4gICQoJy5qcy12aXNpdG9ycy1zdW1tYXJ5JykuZWFjaChmdW5jdGlvbiAoaSwgZWwpIHtcbiAgICB2YXIgJGVsID0gJChlbCk7XG5cbiAgICAkLmVhY2gobWVtYmVycy5maWx0ZXIoaXNWaXNpdG9yKSwgZnVuY3Rpb24gKGksIG1lbWJlcikge1xuICAgICAgJGVsLmFwcGVuZChjcmVhdGVNZW1iZXJJdGVtKG1lbWJlciwgeyByZWRpcmVjdDogJGVsLmF0dHIoJ2RhdGEtcmVkaXJlY3QnKSB9KSk7XG4gICAgfSk7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBpc01lbWJlclVzZXIobWVtYmVyKSB7XG4gIHJldHVybiBtZW1iZXJbJ0BwZXJzb24nXS5pZCA9PT0gd2luZG93Lk9OUy5zdG9yYWdlLklEUy5VU0VSX0hPVVNFSE9MRF9NRU1CRVJfSUQ7XG59XG5cbndpbmRvdy5PTlMgPSB3aW5kb3cuT05TIHx8IHt9O1xud2luZG93Lk9OUy5zdG9yYWdlID0ge1xuICBnZXRBZGRyZXNzOiBnZXRBZGRyZXNzLFxuICBhZGRIb3VzZWhvbGRNZW1iZXI6IGFkZEhvdXNlaG9sZE1lbWJlcixcbiAgdXBkYXRlSG91c2Vob2xkTWVtYmVyOiB1cGRhdGVIb3VzZWhvbGRNZW1iZXIsXG4gIGRlbGV0ZUhvdXNlaG9sZE1lbWJlcjogZGVsZXRlSG91c2Vob2xkTWVtYmVyLFxuICBnZXRBbGxIb3VzZWhvbGRNZW1iZXJzOiBnZXRBbGxIb3VzZWhvbGRNZW1iZXJzLFxuICBhZGRVc2VyUGVyc29uOiBhZGRVc2VyUGVyc29uLFxuICBnZXRVc2VyUGVyc29uOiBnZXRVc2VyUGVyc29uLFxuICBnZXRVc2VyQXNIb3VzZWhvbGRNZW1iZXI6IGdldFVzZXJBc0hvdXNlaG9sZE1lbWJlcixcbiAgZ2V0SG91c2Vob2xkTWVtYmVyQnlQZXJzb25JZDogZ2V0SG91c2Vob2xkTWVtYmVyQnlQZXJzb25JZCxcbiAgZ2V0TWVtYmVyUGVyc29uSWQ6IGdldE1lbWJlclBlcnNvbklkLFxuICB1cGRhdGVVc2VyQXNIb3VzZWhvbGRNZW1iZXI6IHVwZGF0ZVVzZXJBc0hvdXNlaG9sZE1lbWJlcixcbiAgZGVsZXRlVXNlckFzSG91c2Vob2xkTWVtYmVyOiBkZWxldGVVc2VyQXNIb3VzZWhvbGRNZW1iZXIsXG4gIHRlbXBBd2F5UXVlc3Rpb25TZW50ZW5jZU1hcDogdGVtcEF3YXlRdWVzdGlvblNlbnRlbmNlTWFwLFxuICB2aXNpdG9yUXVlc3Rpb25TZW50ZW5jZU1hcDogdmlzaXRvclF1ZXN0aW9uU2VudGVuY2VNYXAsXG5cbiAgaXNWaXNpdG9yOiBpc1Zpc2l0b3IsXG4gIGlzT3RoZXJIb3VzZWhvbGRNZW1iZXI6IGlzT3RoZXJIb3VzZWhvbGRNZW1iZXIsXG4gIGlzSG91c2Vob2xkTWVtYmVyOiBpc0hvdXNlaG9sZE1lbWJlcixcblxuICBhZGRSZWxhdGlvbnNoaXA6IGFkZFJlbGF0aW9uc2hpcCxcbiAgZGVsZXRlUmVsYXRpb25zaGlwOiBkZWxldGVSZWxhdGlvbnNoaXAsXG4gIGVkaXRSZWxhdGlvbnNoaXA6IGVkaXRSZWxhdGlvbnNoaXAsXG4gIGdldEFsbFJlbGF0aW9uc2hpcHM6IGdldEFsbFJlbGF0aW9uc2hpcHMsXG4gIGdldEFsbE1hbnVhbFJlbGF0aW9uc2hpcHM6IGdldEFsbE1hbnVhbFJlbGF0aW9uc2hpcHMsXG4gIGRlbGV0ZUFsbFJlbGF0aW9uc2hpcHNGb3JNZW1iZXI6IGRlbGV0ZUFsbFJlbGF0aW9uc2hpcHNGb3JNZW1iZXIsXG5cbiAgZ2V0QWxsUGFyZW50c09mOiBnZXRBbGxQYXJlbnRzT2YsXG4gIGdldEFsbENoaWxkcmVuT2Y6IGdldEFsbENoaWxkcmVuT2YsXG4gIGdldFBhcmVudElkRnJvbVJlbGF0aW9uc2hpcDogZ2V0UGFyZW50SWRGcm9tUmVsYXRpb25zaGlwLFxuICBnZXRDaGlsZElkRnJvbVJlbGF0aW9uc2hpcDogZ2V0Q2hpbGRJZEZyb21SZWxhdGlvbnNoaXAsXG4gIGdldE90aGVyUGVyc29uSWRGcm9tUmVsYXRpb25zaGlwOiBnZXRPdGhlclBlcnNvbklkRnJvbVJlbGF0aW9uc2hpcCxcbiAgaXNBUGFyZW50SW5SZWxhdGlvbnNoaXA6IGlzQVBhcmVudEluUmVsYXRpb25zaGlwLFxuICBpc0FDaGlsZEluUmVsYXRpb25zaGlwOiBpc0FDaGlsZEluUmVsYXRpb25zaGlwLFxuICBpc0luUmVsYXRpb25zaGlwOiBpc0luUmVsYXRpb25zaGlwLFxuICBhcmVBbnlDaGlsZHJlbkluUmVsYXRpb25zaGlwTm90UGFyZW50OiBhcmVBbnlDaGlsZHJlbkluUmVsYXRpb25zaGlwTm90UGFyZW50LFxuICBpc1JlbGF0aW9uc2hpcFR5cGU6IGlzUmVsYXRpb25zaGlwVHlwZSxcbiAgaXNSZWxhdGlvbnNoaXBJbmZlcnJlZDogaXNSZWxhdGlvbnNoaXBJbmZlcnJlZCxcbiAgZ2V0UmVsYXRpb25zaGlwT2Y6IGdldFJlbGF0aW9uc2hpcE9mLFxuXG4gIHJlbGF0aW9uc2hpcERlc2NyaXB0aW9uTWFwOiByZWxhdGlvbnNoaXBEZXNjcmlwdGlvbk1hcCxcbiAgcmVsYXRpb25zaGlwU3VtbWFyeVRlbXBsYXRlczogcmVsYXRpb25zaGlwU3VtbWFyeVRlbXBsYXRlcyxcbiAgbWlzc2luZ1JlbGF0aW9uc2hpcEluZmVyZW5jZTogbWlzc2luZ1JlbGF0aW9uc2hpcEluZmVyZW5jZSxcbiAgaW5mZXJSZWxhdGlvbnNoaXBzOiBpbmZlclJlbGF0aW9uc2hpcHMsXG4gIGdldFJlbGF0aW9uc2hpcHNXaXRoUGVyc29uSWRzOiBnZXRSZWxhdGlvbnNoaXBzV2l0aFBlcnNvbklkcyxcbiAgZ2V0UGVvcGxlSWRzTWlzc2luZ1JlbGF0aW9uc2hpcHNXaXRoUGVyc29uOiBnZXRQZW9wbGVJZHNNaXNzaW5nUmVsYXRpb25zaGlwc1dpdGhQZXJzb24sXG4gIGdldFJlbGF0aW9uc2hpcFR5cGU6IGdldFJlbGF0aW9uc2hpcFR5cGUsXG4gIGZpbmROZXh0TWlzc2luZ1JlbGF0aW9uc2hpcDogZmluZE5leHRNaXNzaW5nUmVsYXRpb25zaGlwLFxuXG4gIGFkZFVwZGF0ZVBlcnNvbmFsRGV0YWlsc0RPQjogYWRkVXBkYXRlUGVyc29uYWxEZXRhaWxzRE9CLFxuICBnZXRQZXJzb25hbERldGFpbHNGb3I6IGdldFBlcnNvbmFsRGV0YWlsc0ZvcixcbiAgYWRkVXBkYXRlTWFyaXRhbFN0YXR1czogYWRkVXBkYXRlTWFyaXRhbFN0YXR1cyxcbiAgYWRkVXBkYXRlQ291bnRyeTogYWRkVXBkYXRlQ291bnRyeSxcbiAgYWRkVXBkYXRlT3JpZW50YXRpb246IGFkZFVwZGF0ZU9yaWVudGF0aW9uLFxuICBhZGRVcGRhdGVTYWxhcnk6IGFkZFVwZGF0ZVNhbGFyeSxcbiAgYWRkVXBkYXRlU2V4OiBhZGRVcGRhdGVTZXgsXG4gIGFkZFVwZGF0ZUFkZHJlc3NXaGVyZTogYWRkVXBkYXRlQWRkcmVzc1doZXJlLFxuICBhZGRVcGRhdGVBZGRyZXNzSW5kaXZpZHVhbDogYWRkVXBkYXRlQWRkcmVzc0luZGl2aWR1YWwsXG4gIGFkZFVwZGF0ZUFnZTogYWRkVXBkYXRlQWdlLFxuICBhZGRVcGRhdGVBZGRyZXNzT3V0c2lkZVVLOiBhZGRVcGRhdGVBZGRyZXNzT3V0c2lkZVVLLFxuXG4gIHBlcnNvbmFsRGV0YWlsc01hcml0YWxTdGF0dXNNYXA6IHBlcnNvbmFsRGV0YWlsc01hcml0YWxTdGF0dXNNYXAsXG4gIHBlcnNvbmFsRGV0YWlsc0NvdW50cnlNYXA6IHBlcnNvbmFsRGV0YWlsc0NvdW50cnlNYXAsXG4gIHBlcnNvbmFsRGV0YWlsc09yaWVudGF0aW9uTWFwOiBwZXJzb25hbERldGFpbHNPcmllbnRhdGlvbk1hcCxcbiAgcGVyc29uYWxEZXRhaWxzR2VuZGVyTWFwOiBwZXJzb25hbERldGFpbHNHZW5kZXJNYXAsXG5cbiAgY3JlYXRlUGluRm9yOiBjcmVhdGVQaW5Gb3IsXG4gIGdldFBpbkZvcjogZ2V0UGluRm9yLFxuICB1bnNldFBpbkZvcjogdW5zZXRQaW5Gb3IsXG5cbiAgc2V0QW5zd2VyaW5nSW5kaXZpZHVhbEJ5UHJveHk6IHNldEFuc3dlcmluZ0luZGl2aWR1YWxCeVByb3h5LFxuICBnZXRBbnN3ZXJpbmdJbmRpdmlkdWFsQnlQcm94eTogZ2V0QW5zd2VyaW5nSW5kaXZpZHVhbEJ5UHJveHksXG5cbiAgZG9JTGl2ZUhlcmU6IGRvSUxpdmVIZXJlLFxuICBpc01lbWJlclVzZXI6IGlzTWVtYmVyVXNlcixcblxuICBLRVlTOiB7XG4gICAgSE9VU0VIT0xEX01FTUJFUlNfU1RPUkFHRV9LRVk6IEhPVVNFSE9MRF9NRU1CRVJTX1NUT1JBR0VfS0VZLFxuICAgIFVTRVJfU1RPUkFHRV9LRVk6IFVTRVJfU1RPUkFHRV9LRVksXG4gICAgSU5ESVZJRFVBTF9QUk9YWV9TVE9SQUdFX0tFWTogSU5ESVZJRFVBTF9QUk9YWV9TVE9SQUdFX0tFWSxcbiAgICBIT1VTRUhPTERfTUVNQkVSX1RZUEU6IEhPVVNFSE9MRF9NRU1CRVJfVFlQRSxcbiAgICBWSVNJVE9SX1RZUEU6IFZJU0lUT1JfVFlQRSxcbiAgICBSRUxBVElPTlNISVBTX1NUT1JBR0VfS0VZOiBSRUxBVElPTlNISVBTX1NUT1JBR0VfS0VZLFxuICAgIFBFUlNPTkFMX0RFVEFJTFNfS0VZOiBQRVJTT05BTF9ERVRBSUxTX0tFWVxuICB9LFxuXG4gIElEUzoge1xuICAgIFVTRVJfSE9VU0VIT0xEX01FTUJFUl9JRDogVVNFUl9IT1VTRUhPTERfTUVNQkVSX0lEXG4gIH0sXG5cbiAgVFlQRVM6IHtcbiAgICBwZXJzb246IHBlcnNvbixcbiAgICByZWxhdGlvbnNoaXA6IHJlbGF0aW9uc2hpcFxuICB9XG59O1xuXG53aW5kb3cuT05TLmhlbHBlcnMgPSB7XG4gIHBvcHVsYXRlSG91c2Vob2xkTGlzdDogcG9wdWxhdGVIb3VzZWhvbGRMaXN0LFxuICBwb3B1bGF0ZVZpc2l0b3JMaXN0OiBwb3B1bGF0ZVZpc2l0b3JMaXN0XG59O1xuXG53aW5kb3cuT05TLnV0aWxzID0ge1xuICByZW1vdmVGcm9tTGlzdDogcmVtb3ZlRnJvbUxpc3QsXG4gIHRyYWlsaW5nTmFtZVM6IHRyYWlsaW5nTmFtZVMsXG4gIG51bWJlclRvUG9zaXRpb25Xb3JkOiBudW1iZXJUb1Bvc2l0aW9uV29yZCxcbiAgbnVtYmVyVG9Xb3Jkc1N0eWxlZ3VpZGU6IG51bWJlclRvV29yZHNTdHlsZWd1aWRlLFxuICBnZXRTaWduaWZpY2FudDogZ2V0U2lnbmlmaWNhbnRcbn07XG5cbiQocG9wdWxhdGVIb3VzZWhvbGRMaXN0KTtcbiQocG9wdWxhdGVWaXNpdG9yTGlzdCk7XG4kKHVwZGF0ZUhvdXNlaG9sZFZpc2l0b3JzTmF2aWdhdGlvbkl0ZW1zKTtcbiQodXBkYXRlQWRkcmVzc2VzKTtcbiQodXBkYXRlUGVyc29uTGluayk7XG4kKHRvb2xzKTtcbiQodXBkYXRlQWxsUHJldmlvdXNMaW5rcyk7XG4kKHVwZGF0ZUJ5U3VydmV5VHlwZSk7XG4kKHVwZGF0ZVNpZ25pZmljYW50RGF0ZSk7XG4kKHVwZGF0ZUhvdXNlaG9sZFN1bW1hcnkpO1xuJCh1cGRhdGVWaXNpdG9yc1N1bW1hcnkpO1xuXG5leHBvcnRzLlVTRVJfU1RPUkFHRV9LRVkgPSBVU0VSX1NUT1JBR0VfS0VZO1xuZXhwb3J0cy5JTkRJVklEVUFMX1BST1hZX1NUT1JBR0VfS0VZID0gSU5ESVZJRFVBTF9QUk9YWV9TVE9SQUdFX0tFWTtcbmV4cG9ydHMuZ2V0QWRkcmVzcyA9IGdldEFkZHJlc3M7XG5leHBvcnRzLmFkZFVzZXJQZXJzb24gPSBhZGRVc2VyUGVyc29uO1xuZXhwb3J0cy5nZXRVc2VyUGVyc29uID0gZ2V0VXNlclBlcnNvbjtcbiJdfQ==
