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

  person.id = USER_HOUSEHOLD_MEMBER_ID;

  userAsHouseholdMember ? updateHouseholdMember(person, memberData) : addHouseholdMember(person, memberData, USER_HOUSEHOLD_MEMBER_ID);
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
  'usually-temp': 'People staying temporarily who usually live in the UK but' + ' do not have another UK address',
  'other': 'Other people who usually live here, including anyone temporarily' + ' away from home'
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

function addUpdatePersonalDetailsDOBUnknown(personId) {
  var allDetails = getAllPersonalDetails(),
      details = allDetails[personId] || {};

  console.log('unknown');

  details['dob'] = 'unknown';

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

function addUpdateAddressIndividual(personId, val) {
  var allDetails = getAllPersonalDetails(),
      details = allDetails[personId] || {};

  details['address'] = val;

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
  'nine': 'nineth',
  'ten': 'tenth',
  'eleven': 'eleventh',
  'twelve': 'twelveth',
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
      'sex': 'male',
      'dob': {
        'day': '12',
        'month': '5',
        'year': '1986'
      },
      'age': {
        'val': '32',
        'isApproximate': false
      }
    },
    'person1': {
      'sex': 'female',
      'dob': {
        'day': '02',
        'month': '7',
        'year': '1984'
      },
      'age': {
        'val': '34',
        'isApproximate': false
      }
    },
    'person2': {
      'sex': 'female',
      'dob': {
        'day': '10',
        'month': '11',
        'year': '2008'
      },
      'age': {
        'val': '10',
        'isApproximate': false
      }
    },
    'person3': {
      'sex': 'female',
      'dob': {
        'day': '14',
        'month': '3',
        'year': '2009'
      },
      'age': {
        'val': '9',
        'isApproximate': false
      }
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
  return 'Sunday 13 October 2019';
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
  addUpdatePersonalDetailsDOBUnknown: addUpdatePersonalDetailsDOBUnknown,
  getPersonalDetailsFor: getPersonalDetailsFor,
  addUpdateMaritalStatus: addUpdateMaritalStatus,
  addUpdateCountry: addUpdateCountry,
  addUpdateOrientation: addUpdateOrientation,
  addUpdateSalary: addUpdateSalary,
  addUpdateSex: addUpdateSex,
  addUpdateAddressWhere: addUpdateAddressWhere,
  addUpdateAddressIndividual: addUpdateAddressIndividual,
  addUpdateAge: addUpdateAge,

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJfcHJvdG90eXBlcy95b3VyLWhvdXNlaG9sZC1pbnRlcnZpZXctbGVkL2J1bmRsZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcblxuZnVuY3Rpb24gYXV0b0luY3JlbWVudElkKGNvbGxlY3Rpb24pIHtcbiAgdmFyIGsgPSBjb2xsZWN0aW9uICsgJy1pbmNyZW1lbnQnLFxuICAgICAgaWQgPSBwYXJzZUludChzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKGspKSB8fCAwO1xuXG4gIGlkKys7XG5cbiAgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbShrLCBKU09OLnN0cmluZ2lmeShpZCkpO1xuXG4gIHJldHVybiBpZDtcbn1cblxuZnVuY3Rpb24gcmVtb3ZlRnJvbUxpc3QobGlzdCwgdmFsKSB7XG5cbiAgZnVuY3Rpb24gZG9SZW1vdmUoaXRlbSkge1xuICAgIHZhciBmb3VuZElkID0gbGlzdC5pbmRleE9mKGl0ZW0pO1xuXG4gICAgLyoqXG4gICAgICogR3VhcmRcbiAgICAgKi9cbiAgICBpZiAoZm91bmRJZCA9PT0gLTEpIHtcbiAgICAgIGNvbnNvbGUubG9nKCdBdHRlbXB0IHRvIHJlbW92ZSBmcm9tIGxpc3QgZmFpbGVkOiAnLCBsaXN0LCB2YWwpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGxpc3Quc3BsaWNlKGZvdW5kSWQsIDEpO1xuICB9XG5cbiAgaWYgKF8uaXNBcnJheSh2YWwpKSB7XG4gICAgJC5lYWNoKHZhbCwgZnVuY3Rpb24gKGksIGl0ZW0pIHtcbiAgICAgIGRvUmVtb3ZlKGl0ZW0pO1xuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIGRvUmVtb3ZlKHZhbCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gdHJhaWxpbmdOYW1lUyhuYW1lKSB7XG4gIHJldHVybiBuYW1lW25hbWUubGVuZ3RoIC0gMV0gPT09ICdzJyA/ICdcXCYjeDIwMTk7JyA6ICdcXCYjeDIwMTk7cyc7XG59XG5cbnZhciBkZWZpbmVQcm9wZXJ0eSA9IGZ1bmN0aW9uIChvYmosIGtleSwgdmFsdWUpIHtcbiAgaWYgKGtleSBpbiBvYmopIHtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHtcbiAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICB3cml0YWJsZTogdHJ1ZVxuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIG9ialtrZXldID0gdmFsdWU7XG4gIH1cblxuICByZXR1cm4gb2JqO1xufTtcblxudmFyIF9leHRlbmRzID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiAodGFyZ2V0KSB7XG4gIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXTtcblxuICAgIGZvciAodmFyIGtleSBpbiBzb3VyY2UpIHtcbiAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoc291cmNlLCBrZXkpKSB7XG4gICAgICAgIHRhcmdldFtrZXldID0gc291cmNlW2tleV07XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRhcmdldDtcbn07XG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxudmFyIHRvQ29uc3VtYWJsZUFycmF5ID0gZnVuY3Rpb24gKGFycikge1xuICBpZiAoQXJyYXkuaXNBcnJheShhcnIpKSB7XG4gICAgZm9yICh2YXIgaSA9IDAsIGFycjIgPSBBcnJheShhcnIubGVuZ3RoKTsgaSA8IGFyci5sZW5ndGg7IGkrKykgYXJyMltpXSA9IGFycltpXTtcblxuICAgIHJldHVybiBhcnIyO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBBcnJheS5mcm9tKGFycik7XG4gIH1cbn07XG5cbnZhciBIT1VTRUhPTERfTUVNQkVSU19TVE9SQUdFX0tFWSA9ICdob3VzZWhvbGQtbWVtYmVycyc7XG52YXIgVVNFUl9IT1VTRUhPTERfTUVNQkVSX0lEID0gJ3BlcnNvbl9tZSc7XG52YXIgSE9VU0VIT0xEX01FTUJFUl9UWVBFID0gJ2hvdXNlaG9sZC1tZW1iZXInO1xudmFyIFZJU0lUT1JfVFlQRSA9ICd2aXNpdG9yJztcblxuLyoqXG4gKiBUeXBlc1xuICovXG5mdW5jdGlvbiBwZXJzb24ob3B0cykge1xuICBpZiAob3B0cy5maXJzdE5hbWUgPT09ICcnIHx8IG9wdHMubGFzdE5hbWUgPT09ICcnKSB7XG4gICAgY29uc29sZS5sb2coJ1VuYWJsZSB0byBjcmVhdGUgcGVyc29uIHdpdGggZGF0YTogJywgb3B0cy5maXJzdE5hbWUsICFvcHRzLm1pZGRsZU5hbWUsICFvcHRzLmxhc3ROYW1lKTtcbiAgfVxuXG4gIHZhciBtaWRkbGVOYW1lID0gb3B0cy5taWRkbGVOYW1lIHx8ICcnO1xuXG4gIHJldHVybiB7XG4gICAgZnVsbE5hbWU6IG9wdHMuZmlyc3ROYW1lICsgJyAnICsgbWlkZGxlTmFtZSArICcgJyArIG9wdHMubGFzdE5hbWUsXG4gICAgZmlyc3ROYW1lOiBvcHRzLmZpcnN0TmFtZSxcbiAgICBtaWRkbGVOYW1lOiBtaWRkbGVOYW1lLFxuICAgIGxhc3ROYW1lOiBvcHRzLmxhc3ROYW1lXG4gIH07XG59XG5cbi8qKlxuICogU3RvcmFnZVxuICovXG5mdW5jdGlvbiBnZXRVc2VyQXNIb3VzZWhvbGRNZW1iZXIoKSB7XG4gIHJldHVybiBnZXRBbGxIb3VzZWhvbGRNZW1iZXJzKCkuZmluZChmdW5jdGlvbiAobWVtYmVyKSB7XG4gICAgcmV0dXJuIG1lbWJlclsnQHBlcnNvbiddLmlkID09PSBVU0VSX0hPVVNFSE9MRF9NRU1CRVJfSUQ7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBkZWxldGVVc2VyQXNIb3VzZWhvbGRNZW1iZXIoKSB7XG4gIGRlbGV0ZUhvdXNlaG9sZE1lbWJlcihVU0VSX0hPVVNFSE9MRF9NRU1CRVJfSUQpO1xufVxuXG5mdW5jdGlvbiBkZWxldGVIb3VzZWhvbGRNZW1iZXIocGVyc29uSWQpIHtcbiAgdmFyIG1lbWJlcnMgPSBnZXRBbGxIb3VzZWhvbGRNZW1iZXJzKCkuZmlsdGVyKGZ1bmN0aW9uIChtZW1iZXIpIHtcbiAgICByZXR1cm4gbWVtYmVyWydAcGVyc29uJ10uaWQgIT09IHBlcnNvbklkO1xuICB9KTtcblxuICBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKEhPVVNFSE9MRF9NRU1CRVJTX1NUT1JBR0VfS0VZLCBKU09OLnN0cmluZ2lmeShtZW1iZXJzKSk7XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZVVzZXJBc0hvdXNlaG9sZE1lbWJlcihwZXJzb24sIG1lbWJlckRhdGEpIHtcbiAgdmFyIHVzZXJBc0hvdXNlaG9sZE1lbWJlciA9IGdldFVzZXJBc0hvdXNlaG9sZE1lbWJlcigpO1xuXG4gIHBlcnNvbi5pZCA9IFVTRVJfSE9VU0VIT0xEX01FTUJFUl9JRDtcblxuICB1c2VyQXNIb3VzZWhvbGRNZW1iZXIgPyB1cGRhdGVIb3VzZWhvbGRNZW1iZXIocGVyc29uLCBtZW1iZXJEYXRhKSA6IGFkZEhvdXNlaG9sZE1lbWJlcihwZXJzb24sIG1lbWJlckRhdGEsIFVTRVJfSE9VU0VIT0xEX01FTUJFUl9JRCk7XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZUhvdXNlaG9sZE1lbWJlcihwZXJzb24sIG1lbWJlckRhdGEpIHtcbiAgdmFyIG1lbWJlcnNVcGRhdGVkID0gZ2V0QWxsSG91c2Vob2xkTWVtYmVycygpLm1hcChmdW5jdGlvbiAobWVtYmVyKSB7XG4gICAgcmV0dXJuIG1lbWJlclsnQHBlcnNvbiddLmlkID09PSBwZXJzb24uaWQgPyBfZXh0ZW5kcyh7fSwgbWVtYmVyLCBtZW1iZXJEYXRhLCB7ICdAcGVyc29uJzogX2V4dGVuZHMoe30sIG1lbWJlclsnQHBlcnNvbiddLCBwZXJzb24pIH0pIDogbWVtYmVyO1xuICB9KTtcblxuICBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKEhPVVNFSE9MRF9NRU1CRVJTX1NUT1JBR0VfS0VZLCBKU09OLnN0cmluZ2lmeShtZW1iZXJzVXBkYXRlZCkpO1xufVxuXG5mdW5jdGlvbiBhZGRIb3VzZWhvbGRNZW1iZXIocGVyc29uLCBtZW1iZXJEYXRhLCBpZCkge1xuICB2YXIgcGVvcGxlID0gZ2V0QWxsSG91c2Vob2xkTWVtYmVycygpIHx8IFtdO1xuICBtZW1iZXJEYXRhID0gbWVtYmVyRGF0YSB8fCB7fTtcblxuICAvKipcbiAgICogVXNlciBpcyBhbHdheXMgZmlyc3QgaW4gdGhlIGhvdXNlaG9sZCBsaXN0XG4gICAqL1xuICBwZW9wbGVbaWQgPT09IFVTRVJfSE9VU0VIT0xEX01FTUJFUl9JRCA/ICd1bnNoaWZ0JyA6ICdwdXNoJ10oX2V4dGVuZHMoe30sIG1lbWJlckRhdGEsIHtcbiAgICB0eXBlOiBtZW1iZXJEYXRhLnR5cGUgfHwgSE9VU0VIT0xEX01FTUJFUl9UWVBFLFxuICAgICdAcGVyc29uJzogX2V4dGVuZHMoe30sIHBlcnNvbiwge1xuICAgICAgaWQ6IGlkIHx8ICdwZXJzb24nICsgYXV0b0luY3JlbWVudElkKCdob3VzZWhvbGQtbWVtYmVycycpXG4gICAgfSlcbiAgfSkpO1xuXG4gIHNlc3Npb25TdG9yYWdlLnNldEl0ZW0oSE9VU0VIT0xEX01FTUJFUlNfU1RPUkFHRV9LRVksIEpTT04uc3RyaW5naWZ5KHBlb3BsZSkpO1xufVxuXG5mdW5jdGlvbiBnZXRBbGxIb3VzZWhvbGRNZW1iZXJzKCkge1xuICByZXR1cm4gSlNPTi5wYXJzZShzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKEhPVVNFSE9MRF9NRU1CRVJTX1NUT1JBR0VfS0VZKSkgfHwgW107XG59XG5cbmZ1bmN0aW9uIGdldEhvdXNlaG9sZE1lbWJlckJ5UGVyc29uSWQoaWQpIHtcbiAgcmV0dXJuIGdldEFsbEhvdXNlaG9sZE1lbWJlcnMoKS5maW5kKGZ1bmN0aW9uIChtZW1iZXIpIHtcbiAgICByZXR1cm4gbWVtYmVyWydAcGVyc29uJ10uaWQgPT09IGlkO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gZ2V0TWVtYmVyUGVyc29uSWQobWVtYmVyKSB7XG4gIHJldHVybiBtZW1iZXJbJ0BwZXJzb24nXS5pZDtcbn1cblxuLyoqXG4gKiBDb21wYXJhdG9yc1xuICovXG5mdW5jdGlvbiBpc1Zpc2l0b3IobWVtYmVyKSB7XG4gIHJldHVybiBtZW1iZXIudHlwZSA9PT0gd2luZG93Lk9OUy5zdG9yYWdlLktFWVMuVklTSVRPUl9UWVBFO1xufVxuXG5mdW5jdGlvbiBpc0hvdXNlaG9sZE1lbWJlcihtZW1iZXIpIHtcbiAgcmV0dXJuIG1lbWJlci50eXBlID09PSB3aW5kb3cuT05TLnN0b3JhZ2UuS0VZUy5IT1VTRUhPTERfTUVNQkVSX1RZUEU7XG59XG5cbmZ1bmN0aW9uIGlzT3RoZXJIb3VzZWhvbGRNZW1iZXIobWVtYmVyKSB7XG4gIHJldHVybiBtZW1iZXIudHlwZSA9PT0gd2luZG93Lk9OUy5zdG9yYWdlLktFWVMuSE9VU0VIT0xEX01FTUJFUl9UWVBFICYmIG1lbWJlclsnQHBlcnNvbiddLmlkICE9PSB3aW5kb3cuT05TLnN0b3JhZ2UuSURTLlVTRVJfSE9VU0VIT0xEX01FTUJFUl9JRDtcbn1cblxudmFyIHRlbXBBd2F5UXVlc3Rpb25TZW50ZW5jZU1hcCA9IHtcbiAgJ3RocmVlLW1vcmUnOiAnUGVvcGxlIHdobyB1c3VhbGx5IGxpdmUgb3V0c2lkZSB0aGUgVUsgd2hvIGFyZSBzdGF5aW5nIGluIHRoZSBVSyBmb3IgMyBtb250aHMgb3IgbW9yZScsXG4gICdwZXJtLWF3YXknOiAnUGVvcGxlIHdobyB3b3JrIGF3YXkgZnJvbSBob21lIHdpdGhpbiB0aGUgVUssIGlmIHRoaXMgaXMnICsgJyB0aGVpciBwZXJtYW5lbnQgb3IgZmFtaWx5IGhvbWUnLFxuICAnYXJtZWQtZm9yY2VzJzogJ01lbWJlcnMgb2YgdGhlIGFybWVkIGZvcmNlcywgaWYgdGhpcyBpcyB0aGVpciBwZXJtYW5lbnQgb3InICsgJyBmYW1pbHkgaG9tZScsXG4gICdsZXNzLXR3ZWx2ZSc6ICdQZW9wbGUgd2hvIGFyZSB0ZW1wb3JhcmlseSBvdXRzaWRlIHRoZSBVSyBmb3IgbGVzcyB0aGFuIDEyJyArICcgbW9udGhzJyxcbiAgJ3VzdWFsbHktdGVtcCc6ICdQZW9wbGUgc3RheWluZyB0ZW1wb3JhcmlseSB3aG8gdXN1YWxseSBsaXZlIGluIHRoZSBVSyBidXQnICsgJyBkbyBub3QgaGF2ZSBhbm90aGVyIFVLIGFkZHJlc3MnLFxuICAnb3RoZXInOiAnT3RoZXIgcGVvcGxlIHdobyB1c3VhbGx5IGxpdmUgaGVyZSwgaW5jbHVkaW5nIGFueW9uZSB0ZW1wb3JhcmlseScgKyAnIGF3YXkgZnJvbSBob21lJ1xufTtcblxuLyoqXG4gKiBBdWdtZW50IFVuZGVyc2NvcmUgbGlicmFyeVxuICovXG52YXIgXyQxID0gd2luZG93Ll8gfHwge307XG5cbnZhciBSRUxBVElPTlNISVBTX1NUT1JBR0VfS0VZID0gJ3JlbGF0aW9uc2hpcHMnO1xuXG52YXIgcmVsYXRpb25zaGlwVHlwZXMgPSB7XG4gICdzcG91c2UnOiB7IGlkOiAnc3BvdXNlJyB9LFxuICAnY2hpbGQtcGFyZW50JzogeyBpZDogJ2NoaWxkLXBhcmVudCcgfSxcbiAgJ3N0ZXAtY2hpbGQtcGFyZW50JzogeyBpZDogJ3N0ZXAtY2hpbGQtcGFyZW50JyB9LFxuICAnZ3JhbmRjaGlsZC1ncmFuZHBhcmVudCc6IHsgaWQ6ICdncmFuZGNoaWxkLWdyYW5kcGFyZW50JyB9LFxuICAnaGFsZi1zaWJsaW5nJzogeyBpZDogJ2hhbGYtc2libGluZycgfSxcbiAgJ3NpYmxpbmcnOiB7IGlkOiAnc2libGluZycgfSxcbiAgJ3N0ZXAtYnJvdGhlci1zaXN0ZXInOiB7IGlkOiAnc3RlcC1icm90aGVyLXNpc3RlcicgfSxcbiAgJ3BhcnRuZXInOiB7IGlkOiAncGFydG5lcicgfSxcbiAgJ3VucmVsYXRlZCc6IHsgaWQ6ICd1bnJlbGF0ZWQnIH0sXG4gICdvdGhlci1yZWxhdGlvbic6IHsgaWQ6ICdvdGhlci1yZWxhdGlvbicgfVxufTtcblxudmFyIHJlbGF0aW9uc2hpcERlc2NyaXB0aW9uTWFwID0ge1xuICAvLyBjb3ZlcmVkXG4gICdodXNiYW5kLXdpZmUnOiB7XG4gICAgc2VudGFuY2VMYWJlbDogJ2h1c2JhbmQgb3Igd2lmZScsXG4gICAgc3VtbWFyeUFkamVjdGl2ZTogJ2h1c2JhbmQgb3Igd2lmZScsXG4gICAgdHlwZTogcmVsYXRpb25zaGlwVHlwZXNbJ3Nwb3VzZSddXG4gIH0sXG4gIC8vIGNvdmVyZWRcbiAgJ21vdGhlci1mYXRoZXInOiB7XG4gICAgc2VudGFuY2VMYWJlbDogJ21vdGhlciBvciBmYXRoZXInLFxuICAgIHN1bW1hcnlBZGplY3RpdmU6ICdtb3RoZXIgb3IgZmF0aGVyJyxcbiAgICB0eXBlOiByZWxhdGlvbnNoaXBUeXBlc1snY2hpbGQtcGFyZW50J11cbiAgfSxcbiAgLy8gY292ZXJlZFxuICAnc3RlcC1tb3RoZXItZmF0aGVyJzoge1xuICAgIHNlbnRhbmNlTGFiZWw6ICdzdGVwbW90aGVyIG9yIHN0ZXBmYXRoZXInLFxuICAgIHN1bW1hcnlBZGplY3RpdmU6ICdzdGVwbW90aGVyIG9yIHN0ZXBmYXRoZXInLFxuICAgIHR5cGU6IHJlbGF0aW9uc2hpcFR5cGVzWydzdGVwLWNoaWxkLXBhcmVudCddXG4gIH0sXG4gIC8vIGNvdmVyZWRcbiAgJ3Nvbi1kYXVnaHRlcic6IHtcbiAgICBzZW50YW5jZUxhYmVsOiAnc29uIG9yIGRhdWdodGVyJyxcbiAgICBzdW1tYXJ5QWRqZWN0aXZlOiAnc29uIG9yIGRhdWdodGVyJyxcbiAgICB0eXBlOiByZWxhdGlvbnNoaXBUeXBlc1snY2hpbGQtcGFyZW50J11cbiAgfSxcbiAgLy8gY292ZXJlZFxuICAnaGFsZi1icm90aGVyLXNpc3Rlcic6IHtcbiAgICBzZW50YW5jZUxhYmVsOiAnaGFsZi1icm90aGVyIG9yIGhhbGYtc2lzdGVyJyxcbiAgICBzdW1tYXJ5QWRqZWN0aXZlOiAnaGFsZi1icm90aGVyIG9yIGhhbGYtc2lzdGVyJyxcbiAgICB0eXBlOiByZWxhdGlvbnNoaXBUeXBlc1snaGFsZi1zaWJsaW5nJ11cbiAgfSxcbiAgLy8gY292ZXJlZFxuICAnc3RlcC1jaGlsZCc6IHtcbiAgICBzZW50YW5jZUxhYmVsOiAnc3RlcGNoaWxkJyxcbiAgICBzdW1tYXJ5QWRqZWN0aXZlOiAnc3RlcGNoaWxkJyxcbiAgICB0eXBlOiByZWxhdGlvbnNoaXBUeXBlc1snc3RlcC1jaGlsZC1wYXJlbnQnXVxuICB9LFxuICAvLyBjb3ZlcmVkXG4gICdncmFuZHBhcmVudCc6IHtcbiAgICBzZW50YW5jZUxhYmVsOiAnZ3JhbmRwYXJlbnQnLFxuICAgIHN1bW1hcnlBZGplY3RpdmU6ICdncmFuZHBhcmVudCcsXG4gICAgdHlwZTogcmVsYXRpb25zaGlwVHlwZXNbJ2dyYW5kY2hpbGQtZ3JhbmRwYXJlbnQnXVxuICB9LFxuICAvLyBjb3ZlcmVkXG4gICdncmFuZGNoaWxkJzoge1xuICAgIHNlbnRhbmNlTGFiZWw6ICdncmFuZGNoaWxkJyxcbiAgICBzdW1tYXJ5QWRqZWN0aXZlOiAnZ3JhbmRjaGlsZCcsXG4gICAgdHlwZTogcmVsYXRpb25zaGlwVHlwZXNbJ2dyYW5kY2hpbGQtZ3JhbmRwYXJlbnQnXVxuICB9LFxuICAvLyBjb3ZlcmVkXG4gICdicm90aGVyLXNpc3Rlcic6IHtcbiAgICBzZW50YW5jZUxhYmVsOiAnYnJvdGhlciBvciBzaXN0ZXInLFxuICAgIHN1bW1hcnlBZGplY3RpdmU6ICdicm90aGVyIG9yIHNpc3RlcicsXG4gICAgdHlwZTogcmVsYXRpb25zaGlwVHlwZXNbJ3NpYmxpbmcnXVxuICB9LFxuICAvLyBjb3ZlcmVkXG4gICdzdGVwLWJyb3RoZXItc2lzdGVyJzoge1xuICAgIHNlbnRhbmNlTGFiZWw6ICdzdGVwYnJvdGhlciBvciBzdGVwc2lzdGVyJyxcbiAgICBzdW1tYXJ5QWRqZWN0aXZlOiAnc3RlcGJyb3RoZXIgb3Igc3RlcHNpc3RlcicsXG4gICAgdHlwZTogcmVsYXRpb25zaGlwVHlwZXNbJ3N0ZXAtYnJvdGhlci1zaXN0ZXInXVxuICB9LFxuICAvLyBjb3ZlcmVkXG4gICdvdGhlci1yZWxhdGlvbic6IHtcbiAgICBzZW50YW5jZUxhYmVsOiAnb3RoZXIgcmVsYXRpb24nLFxuICAgIHN1bW1hcnlBZGplY3RpdmU6ICdyZWxhdGVkJyxcbiAgICB0eXBlOiByZWxhdGlvbnNoaXBUeXBlc1snb3RoZXItcmVsYXRpb24nXVxuICB9LFxuICAvLyBjb3ZlcmVkXG4gICdwYXJ0bmVyJzoge1xuICAgIHNlbnRhbmNlTGFiZWw6ICdwYXJ0bmVyJyxcbiAgICBzdW1tYXJ5QWRqZWN0aXZlOiAncGFydG5lcicsXG4gICAgdHlwZTogcmVsYXRpb25zaGlwVHlwZXNbJ3BhcnRuZXInXVxuICB9LFxuICAnc2FtZS1zZXgtcGFydG5lcic6IHtcbiAgICBzZW50YW5jZUxhYmVsOiAnbGVnYWxseSByZWdpc3RlcmVkIGNpdmlsIHBhcnRuZXInLFxuICAgIHN1bW1hcnlBZGplY3RpdmU6ICdsZWdhbGx5IHJlZ2lzdGVyZWQgY2l2aWwgcGFydG5lcicsXG4gICAgdHlwZTogcmVsYXRpb25zaGlwVHlwZXNbJ3BhcnRuZXInXVxuICB9LFxuICAvLyBjb3ZlcmVkXG4gICd1bnJlbGF0ZWQnOiB7XG4gICAgc2VudGFuY2VMYWJlbDogJ3VucmVsYXRlZCcsXG4gICAgc3VtbWFyeUFkamVjdGl2ZTogJ3VucmVsYXRlZCcsXG4gICAgdHlwZTogcmVsYXRpb25zaGlwVHlwZXNbJ3VucmVsYXRlZCddXG4gIH1cbn07XG5cbmZ1bmN0aW9uIG5hbWVFbGVtZW50KG5hbWUpIHtcbiAgcmV0dXJuICc8c3Ryb25nPicgKyBuYW1lICsgJzwvc3Ryb25nPic7XG59XG5cbmZ1bmN0aW9uIHBlcnNvbkxpc3RTdHIocGVvcGxlQXJyKSB7XG4gIHZhciBvcHRzID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiB7fTtcblxuICBpZiAocGVvcGxlQXJyLmxlbmd0aCA8IDEpIHtcbiAgICBjb25zb2xlLmxvZyhwZW9wbGVBcnIsICdub3QgZW5vdWdoIHBlb3BsZSB0byBjcmVhdGUgYSBsaXN0IHN0cmluZycpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGlmIChwZW9wbGVBcnIubGVuZ3RoID09PSAxKSB7XG4gICAgcmV0dXJuIG5hbWVFbGVtZW50KHBlb3BsZUFyclswXS5mdWxsTmFtZSArIGZvcm1hdFBlcnNvbklmWW91KHBlb3BsZUFyclswXSkpO1xuICB9XG5cbiAgdmFyIHBlb3BsZUNvcHkgPSBbXS5jb25jYXQodG9Db25zdW1hYmxlQXJyYXkocGVvcGxlQXJyKSksXG4gICAgICBsYXN0UGVyc29uID0gcGVvcGxlQ29weS5wb3AoKTtcblxuICByZXR1cm4gcGVvcGxlQ29weS5tYXAoZnVuY3Rpb24gKHBlcnNvbiQkMSkge1xuICAgIHJldHVybiAnJyArIG5hbWVFbGVtZW50KHBlcnNvbiQkMS5mdWxsTmFtZSArIChvcHRzLmlzRmFtaWx5ID8gdHJhaWxpbmdOYW1lUyhwZXJzb24kJDEuZnVsbE5hbWUpIDogJycpICsgZm9ybWF0UGVyc29uSWZZb3UocGVyc29uJCQxKSk7XG4gIH0pLmpvaW4oJywgJykgKyAnIGFuZCAnICsgbmFtZUVsZW1lbnQobGFzdFBlcnNvbi5mdWxsTmFtZSArIChvcHRzLmlzRmFtaWx5ID8gdHJhaWxpbmdOYW1lUyhsYXN0UGVyc29uLmZ1bGxOYW1lKSA6ICcnKSArIGZvcm1hdFBlcnNvbklmWW91KGxhc3RQZXJzb24pKTtcbn1cblxuZnVuY3Rpb24gZm9ybWF0UGVyc29uSWZZb3UocGVyc29uJCQxKSB7XG4gIHJldHVybiBwZXJzb24kJDEuaWQgPT09IFVTRVJfSE9VU0VIT0xEX01FTUJFUl9JRCA/ICcgKFlvdSknIDogJyc7XG59XG5cbnZhciByZWxhdGlvbnNoaXBTdW1tYXJ5VGVtcGxhdGVzID0ge1xuICAncGFydG5lcnNoaXAnOiBmdW5jdGlvbiBwYXJ0bmVyc2hpcChwZXJzb24xLCBwZXJzb24yLCBkZXNjcmlwdGlvbikge1xuICAgIHJldHVybiBuYW1lRWxlbWVudChwZXJzb24xLmZ1bGxOYW1lICsgZm9ybWF0UGVyc29uSWZZb3UocGVyc29uMSkpICsgJyBpcyAnICsgbmFtZUVsZW1lbnQocGVyc29uMi5mdWxsTmFtZSArIHRyYWlsaW5nTmFtZVMocGVyc29uMi5mdWxsTmFtZSkgKyBmb3JtYXRQZXJzb25JZllvdShwZXJzb24yKSkgKyAnICcgKyBkZXNjcmlwdGlvbjtcbiAgfSxcbiAgJ3R3b0ZhbWlseU1lbWJlcnNUb01hbnknOiBmdW5jdGlvbiB0d29GYW1pbHlNZW1iZXJzVG9NYW55KHBhcmVudDEsIHBhcmVudDIsIGNoaWxkcmVuQXJyLCBkZXNjcmlwdGlvbikge1xuICAgIHJldHVybiBuYW1lRWxlbWVudChwYXJlbnQxLmZ1bGxOYW1lICsgZm9ybWF0UGVyc29uSWZZb3UocGFyZW50MSkpICsgJyBhbmQgJyArIG5hbWVFbGVtZW50KHBhcmVudDIuZnVsbE5hbWUgKyBmb3JtYXRQZXJzb25JZllvdShwYXJlbnQyKSkgKyAnIGFyZSAnICsgcGVyc29uTGlzdFN0cihjaGlsZHJlbkFyciwgeyBpc0ZhbWlseTogdHJ1ZSB9KSArICcgJyArIGRlc2NyaXB0aW9uO1xuICB9LFxuICAnb25lRmFtaWx5TWVtYmVyVG9NYW55JzogZnVuY3Rpb24gb25lRmFtaWx5TWVtYmVyVG9NYW55KHBhcmVudCwgY2hpbGRyZW5BcnIsIGRlc2NyaXB0aW9uKSB7XG4gICAgY29uc29sZS5sb2cocGFyZW50LCBjaGlsZHJlbkFyciwgZGVzY3JpcHRpb24pO1xuICAgIHJldHVybiBuYW1lRWxlbWVudChwYXJlbnQuZnVsbE5hbWUgKyBmb3JtYXRQZXJzb25JZllvdShwYXJlbnQpKSArICcgaXMgJyArIHBlcnNvbkxpc3RTdHIoY2hpbGRyZW5BcnIsIHsgaXNGYW1pbHk6IHRydWUgfSkgKyAnICcgKyBkZXNjcmlwdGlvbjtcbiAgfSxcbiAgJ21hbnlUb01hbnknOiBmdW5jdGlvbiBtYW55VG9NYW55KHBlb3BsZUFycjEsIHBlb3BsZUFycjIsIGRlc2NyaXB0aW9uKSB7XG4gICAgcmV0dXJuIHBlcnNvbkxpc3RTdHIocGVvcGxlQXJyMSkgKyAnICcgKyAocGVvcGxlQXJyMS5sZW5ndGggPiAxID8gJ2FyZScgOiAnaXMnKSArICcgJyArIGRlc2NyaXB0aW9uICsgJyB0byAnICsgcGVyc29uTGlzdFN0cihwZW9wbGVBcnIyKTtcbiAgfSxcbiAgJ2FsbE11dHVhbCc6IGZ1bmN0aW9uIGFsbE11dHVhbChwZW9wbGVBcnIsIGRlc2NyaXB0aW9uKSB7XG4gICAgcmV0dXJuIHBlcnNvbkxpc3RTdHIocGVvcGxlQXJyKSArICcgYXJlICcgKyBkZXNjcmlwdGlvbjtcbiAgfVxufTtcblxuLyoqXG4gKiBUeXBlc1xuICovXG5mdW5jdGlvbiByZWxhdGlvbnNoaXAoZGVzY3JpcHRpb24sIHBlcnNvbklzSWQsIHBlcnNvblRvSWQpIHtcbiAgdmFyIG9wdHMgPSBhcmd1bWVudHMubGVuZ3RoID4gMyAmJiBhcmd1bWVudHNbM10gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1szXSA6IHt9O1xuXG4gIHJldHVybiB7XG4gICAgcGVyc29uSXNEZXNjcmlwdGlvbjogZGVzY3JpcHRpb24sXG4gICAgcGVyc29uSXNJZDogcGVyc29uSXNJZCxcbiAgICBwZXJzb25Ub0lkOiBwZXJzb25Ub0lkLFxuICAgIGluZmVycmVkOiAhIW9wdHMuaW5mZXJyZWQsXG4gICAgaW5mZXJyZWRCeTogb3B0cy5pbmZlcnJlZEJ5XG4gIH07XG59XG5cbi8qKlxuICogU3RvcmFnZVxuICovXG5mdW5jdGlvbiBhZGRSZWxhdGlvbnNoaXAocmVsYXRpb25zaGlwT2JqKSB7XG4gIHZhciBob3VzZWhvbGRSZWxhdGlvbnNoaXBzID0gZ2V0QWxsUmVsYXRpb25zaGlwcygpIHx8IFtdLFxuICAgICAgaXRlbSA9IF9leHRlbmRzKHt9LCByZWxhdGlvbnNoaXBPYmosIHtcbiAgICBpZDogYXV0b0luY3JlbWVudElkKFJFTEFUSU9OU0hJUFNfU1RPUkFHRV9LRVkpXG4gIH0pO1xuXG4gIGhvdXNlaG9sZFJlbGF0aW9uc2hpcHMucHVzaChpdGVtKTtcblxuICBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKFJFTEFUSU9OU0hJUFNfU1RPUkFHRV9LRVksIEpTT04uc3RyaW5naWZ5KGhvdXNlaG9sZFJlbGF0aW9uc2hpcHMpKTtcblxuICByZXR1cm4gaXRlbTtcbn1cblxuZnVuY3Rpb24gZGVsZXRlUmVsYXRpb25zaGlwKHJlbGF0aW9uc2hpcE9iaikge1xuICB2YXIgaG91c2Vob2xkUmVsYXRpb25zaGlwcyA9IChnZXRBbGxSZWxhdGlvbnNoaXBzKCkgfHwgW10pLmZpbHRlcihmdW5jdGlvbiAocmVsYXRpb25zaGlwKSB7XG4gICAgcmV0dXJuIHJlbGF0aW9uc2hpcC5pZCAhPT0gcmVsYXRpb25zaGlwT2JqLmlkO1xuICB9KTtcblxuICBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKFJFTEFUSU9OU0hJUFNfU1RPUkFHRV9LRVksIEpTT04uc3RyaW5naWZ5KGhvdXNlaG9sZFJlbGF0aW9uc2hpcHMpKTtcbn1cblxuZnVuY3Rpb24gZWRpdFJlbGF0aW9uc2hpcChyZWxhdGlvbnNoaXBJZCwgdmFsdWVPYmplY3QpIHtcbiAgdmFyIGhvdXNlaG9sZFJlbGF0aW9uc2hpcHMgPSAoZ2V0QWxsUmVsYXRpb25zaGlwcygpIHx8IFtdKS5tYXAoZnVuY3Rpb24gKHJlbGF0aW9uc2hpcCkge1xuICAgIHJldHVybiByZWxhdGlvbnNoaXAuaWQgKyAnJyA9PT0gcmVsYXRpb25zaGlwSWQgKyAnJyA/IF9leHRlbmRzKHt9LCB2YWx1ZU9iamVjdCwge1xuICAgICAgaWQ6IHJlbGF0aW9uc2hpcElkXG4gICAgfSkgOiByZWxhdGlvbnNoaXA7XG4gIH0pO1xuXG4gIHNlc3Npb25TdG9yYWdlLnNldEl0ZW0oUkVMQVRJT05TSElQU19TVE9SQUdFX0tFWSwgSlNPTi5zdHJpbmdpZnkoaG91c2Vob2xkUmVsYXRpb25zaGlwcykpO1xufVxuXG5mdW5jdGlvbiBnZXRBbGxSZWxhdGlvbnNoaXBzKCkge1xuICByZXR1cm4gSlNPTi5wYXJzZShzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKFJFTEFUSU9OU0hJUFNfU1RPUkFHRV9LRVkpKSB8fCBbXTtcbn1cblxuZnVuY3Rpb24gZ2V0QWxsTWFudWFsUmVsYXRpb25zaGlwcygpIHtcbiAgcmV0dXJuIGdldEFsbFJlbGF0aW9uc2hpcHMoKS5maWx0ZXIoZnVuY3Rpb24gKHJlbGF0aW9uc2hpcCkge1xuICAgIHJldHVybiAhcmVsYXRpb25zaGlwLmluZmVycmVkO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gZGVsZXRlQWxsUmVsYXRpb25zaGlwc0Zvck1lbWJlcihwZXJzb25JZCkge1xuICB2YXIgaG91c2Vob2xkUmVsYXRpb25zaGlwcyA9IGdldEFsbFJlbGF0aW9uc2hpcHMoKS5maWx0ZXIoZnVuY3Rpb24gKHJlbGF0aW9uc2hpcCkge1xuICAgIHJldHVybiAhKHBlcnNvbklkID09PSByZWxhdGlvbnNoaXAucGVyc29uSXNJZCB8fCBwZXJzb25JZCA9PT0gcmVsYXRpb25zaGlwLnBlcnNvblRvSWQpO1xuICB9KTtcblxuICBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKFJFTEFUSU9OU0hJUFNfU1RPUkFHRV9LRVksIEpTT04uc3RyaW5naWZ5KGhvdXNlaG9sZFJlbGF0aW9uc2hpcHMpKTtcbn1cblxuLyoqXG4gKiBDb21wYXJhdG9yc1xuICovXG5mdW5jdGlvbiBpc0luUmVsYXRpb25zaGlwKHBlcnNvbklkLCByZWxhdGlvbnNoaXApIHtcbiAgcmV0dXJuIHJlbGF0aW9uc2hpcC5wZXJzb25Ub0lkID09PSBwZXJzb25JZCB8fCByZWxhdGlvbnNoaXAucGVyc29uSXNJZCA9PT0gcGVyc29uSWQ7XG59XG5cbmZ1bmN0aW9uIGlzQUNoaWxkSW5SZWxhdGlvbnNoaXAocGVyc29uSWQsIHJlbGF0aW9uc2hpcCkge1xuICAvKipcbiAgICogR3VhcmRcbiAgICovXG4gIGlmICghaXNJblJlbGF0aW9uc2hpcChwZXJzb25JZCwgcmVsYXRpb25zaGlwKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHJldHVybiByZWxhdGlvbnNoaXAucGVyc29uSXNEZXNjcmlwdGlvbiA9PT0gJ21vdGhlci1mYXRoZXInICYmIHJlbGF0aW9uc2hpcC5wZXJzb25Ub0lkID09PSBwZXJzb25JZCB8fCByZWxhdGlvbnNoaXAucGVyc29uSXNEZXNjcmlwdGlvbiA9PT0gJ3Nvbi1kYXVnaHRlcicgJiYgcmVsYXRpb25zaGlwLnBlcnNvbklzSWQgPT09IHBlcnNvbklkO1xufVxuXG5mdW5jdGlvbiBpc0FTaWJsaW5nSW5SZWxhdGlvbnNoaXAocGVyc29uSWQsIHJlbGF0aW9uc2hpcCkge1xuICByZXR1cm4gaXNJblJlbGF0aW9uc2hpcChwZXJzb25JZCwgcmVsYXRpb25zaGlwKSAmJiByZWxhdGlvbnNoaXBEZXNjcmlwdGlvbk1hcFtyZWxhdGlvbnNoaXAucGVyc29uSXNEZXNjcmlwdGlvbl0udHlwZS5pZCA9PT0gJ3NpYmxpbmcnO1xufVxuXG5mdW5jdGlvbiBpc0FQYXJlbnRJblJlbGF0aW9uc2hpcChwZXJzb25JZCwgcmVsYXRpb25zaGlwKSB7XG4gIC8qKlxuICAgKiBHdWFyZFxuICAgKi9cbiAgaWYgKCFpc0luUmVsYXRpb25zaGlwKHBlcnNvbklkLCByZWxhdGlvbnNoaXApKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcmV0dXJuIHJlbGF0aW9uc2hpcC5wZXJzb25Jc0Rlc2NyaXB0aW9uID09PSAnbW90aGVyLWZhdGhlcicgJiYgcmVsYXRpb25zaGlwLnBlcnNvbklzSWQgPT09IHBlcnNvbklkIHx8IHJlbGF0aW9uc2hpcC5wZXJzb25Jc0Rlc2NyaXB0aW9uID09PSAnc29uLWRhdWdodGVyJyAmJiByZWxhdGlvbnNoaXAucGVyc29uVG9JZCA9PT0gcGVyc29uSWQ7XG59XG5cbmZ1bmN0aW9uIGFyZUFueUNoaWxkcmVuSW5SZWxhdGlvbnNoaXBOb3RQYXJlbnQoY2hpbGRyZW5JZHMsIG5vdFBhcmVudElkLCByZWxhdGlvbnNoaXApIHtcbiAgLyoqXG4gICAqIEd1YXJkXG4gICAqIElmIHJlbGF0aW9uc2hpcCB0eXBlIGlzIG5vdCBjaGlsZC1wYXJlbnRcbiAgICovXG4gIGlmIChyZWxhdGlvbnNoaXBEZXNjcmlwdGlvbk1hcFtyZWxhdGlvbnNoaXAucGVyc29uSXNEZXNjcmlwdGlvbl0udHlwZS5pZCAhPT0gJ2NoaWxkLXBhcmVudCcpIHtcblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHZhciBjaGlsZEluZGV4QXNQZXJzb25JcyA9IGNoaWxkcmVuSWRzLmluZGV4T2YocmVsYXRpb25zaGlwLnBlcnNvbklzSWQpLFxuICAgICAgY2hpbGRJbmRleEFzUGVyc29uVG8gPSBjaGlsZHJlbklkcy5pbmRleE9mKHJlbGF0aW9uc2hpcC5wZXJzb25Ub0lkKTtcblxuICAvKipcbiAgICogRmluZCBwYXJlbnRzIHdpdGggdGhlIHNhbWUgY2hpbGRyZW5cbiAgICpcbiAgICogSWYgYSBwZXJzb25Jcy1jaGlsZCBpcyBub3QgaW4gcmVsYXRpb25zaGlwXG4gICAqIG9yIDIgY2hpbGRyZW4gYXJlIGZvdW5kIGluIHJlbGF0aW9uc2hpcFxuICAgKi9cbiAgaWYgKGNoaWxkSW5kZXhBc1BlcnNvbklzID09PSAtMSAmJiBjaGlsZEluZGV4QXNQZXJzb25UbyA9PT0gLTEgfHwgY2hpbGRJbmRleEFzUGVyc29uSXMgIT09IC0xICYmIGNoaWxkSW5kZXhBc1BlcnNvblRvICE9PSAtMSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGlsZCBtdXN0IGJlIGluIHJlbGF0aW9uc2hpcCwgZ2V0IGNoaWxkIGluZGV4XG4gICAqL1xuICB2YXIgY2hpbGRJbmRleCA9IGNoaWxkSW5kZXhBc1BlcnNvbklzICE9PSAtMSA/IGNoaWxkSW5kZXhBc1BlcnNvbklzIDogY2hpbGRJbmRleEFzUGVyc29uVG87XG5cbiAgLyoqXG4gICAqIElmIHBlcnNvbklzIGlzIG5vdCBpbiByZWxhdGlvbnNoaXBcbiAgICogYW5kIGNoaWxkIGZyb20gcHJldmlvdXMgcmVsYXRpb25zaGlwIGlzIGEgY2hpbGQgaW4gdGhpcyByZWxhdGlvbnNoaXBcbiAgICovXG4gIHJldHVybiAhaXNJblJlbGF0aW9uc2hpcChub3RQYXJlbnRJZCwgcmVsYXRpb25zaGlwKSAmJiBpc0FDaGlsZEluUmVsYXRpb25zaGlwKGNoaWxkcmVuSWRzW2NoaWxkSW5kZXhdLCByZWxhdGlvbnNoaXApO1xufVxuXG5mdW5jdGlvbiBpc1JlbGF0aW9uc2hpcFR5cGUocmVsYXRpb25zaGlwVHlwZSwgcmVsYXRpb25zaGlwKSB7XG4gIHZhciB0eXBlT2ZSZWxhdGlvbnNoaXAgPSByZWxhdGlvbnNoaXBEZXNjcmlwdGlvbk1hcFtyZWxhdGlvbnNoaXAucGVyc29uSXNEZXNjcmlwdGlvbl0udHlwZS5pZDtcblxuICAvKipcbiAgICogcmVsYXRpb25zaGlwVHlwZSBjYW4gYmUgYW4gYXJyYXkgb2YgdHlwZXNcbiAgICovXG4gIHJldHVybiBfJDEuaXNBcnJheShyZWxhdGlvbnNoaXBUeXBlKSA/ICEhXyQxLmZpbmQocmVsYXRpb25zaGlwVHlwZSwgZnVuY3Rpb24gKHJUeXBlKSB7XG4gICAgcmV0dXJuIHJUeXBlID09PSB0eXBlT2ZSZWxhdGlvbnNoaXA7XG4gIH0pIDogdHlwZU9mUmVsYXRpb25zaGlwID09PSByZWxhdGlvbnNoaXBUeXBlO1xufVxuXG5mdW5jdGlvbiBpc1JlbGF0aW9uc2hpcEluZmVycmVkKHJlbGF0aW9uc2hpcCkge1xuICByZXR1cm4gcmVsYXRpb25zaGlwLmluZmVycmVkO1xufVxuXG4vKipcbiAqIFJldHJpZXZlIHBlb3BsZSBieSByb2xlIGluIHJlbGF0aW9uc2hpcHNcbiAqL1xuZnVuY3Rpb24gZ2V0UGFyZW50SWRGcm9tUmVsYXRpb25zaGlwKHJlbGF0aW9uc2hpcCkge1xuICB2YXIgcGFyZW50SWQgPSB2b2lkIDA7XG5cbiAgaWYgKHJlbGF0aW9uc2hpcC5wZXJzb25Jc0Rlc2NyaXB0aW9uID09PSAnbW90aGVyLWZhdGhlcicpIHtcbiAgICBwYXJlbnRJZCA9IHJlbGF0aW9uc2hpcC5wZXJzb25Jc0lkO1xuICB9XG5cbiAgaWYgKHJlbGF0aW9uc2hpcC5wZXJzb25Jc0Rlc2NyaXB0aW9uID09PSAnc29uLWRhdWdodGVyJykge1xuICAgIHBhcmVudElkID0gcmVsYXRpb25zaGlwLnBlcnNvblRvSWQ7XG4gIH1cblxuICBpZiAoIXBhcmVudElkKSB7XG4gICAgY29uc29sZS5sb2coJ1BhcmVudCBub3QgZm91bmQgaW4gcmVsYXRpb25zaGlwOiAnLCByZWxhdGlvbnNoaXApO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHJldHVybiBwYXJlbnRJZDtcbn1cblxuZnVuY3Rpb24gZ2V0Q2hpbGRJZEZyb21SZWxhdGlvbnNoaXAocmVsYXRpb25zaGlwKSB7XG4gIHZhciBjaGlsZElkID0gdm9pZCAwO1xuXG4gIGlmIChyZWxhdGlvbnNoaXAucGVyc29uSXNEZXNjcmlwdGlvbiA9PT0gJ21vdGhlci1mYXRoZXInKSB7XG4gICAgY2hpbGRJZCA9IHJlbGF0aW9uc2hpcC5wZXJzb25Ub0lkO1xuICB9XG5cbiAgaWYgKHJlbGF0aW9uc2hpcC5wZXJzb25Jc0Rlc2NyaXB0aW9uID09PSAnc29uLWRhdWdodGVyJykge1xuICAgIGNoaWxkSWQgPSByZWxhdGlvbnNoaXAucGVyc29uSXNJZDtcbiAgfVxuXG4gIGlmICghY2hpbGRJZCkge1xuICAgIGNvbnNvbGUubG9nKCdDaGlsZCBub3QgZm91bmQgaW4gcmVsYXRpb25zaGlwOiAnLCByZWxhdGlvbnNoaXApO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHJldHVybiBjaGlsZElkO1xufVxuXG5mdW5jdGlvbiBnZXRTaWJsaW5nSWRGcm9tUmVsYXRpb25zaGlwKHBlcnNvbklkLCByZWxhdGlvbnNoaXApIHtcbiAgaWYgKCFpc0luUmVsYXRpb25zaGlwKHBlcnNvbklkLCByZWxhdGlvbnNoaXApKSB7XG4gICAgY29uc29sZS5sb2coJ1BlcnNvbiAnICsgcGVyc29uSWQgKyAnIG5vdCBmb3VuZCBpbiByZWxhdGlvbnNoaXA6ICcsIHJlbGF0aW9uc2hpcCk7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcmV0dXJuIHJlbGF0aW9uc2hpcFtyZWxhdGlvbnNoaXAucGVyc29uSXNJZCA9PT0gcGVyc29uSWQgPyAncGVyc29uVG9JZCcgOiAncGVyc29uSXNJZCddO1xufVxuXG5mdW5jdGlvbiBnZXRPdGhlclBlcnNvbklkRnJvbVJlbGF0aW9uc2hpcChwZXJzb25JZCwgcmVsYXRpb25zaGlwKSB7XG4gIHJldHVybiByZWxhdGlvbnNoaXAucGVyc29uSXNJZCA9PT0gcGVyc29uSWQgPyByZWxhdGlvbnNoaXAucGVyc29uVG9JZCA6IHJlbGF0aW9uc2hpcC5wZXJzb25Jc0lkO1xufVxuXG5mdW5jdGlvbiBnZXRBbGxQYXJlbnRzT2YocGVyc29uSWQpIHtcbiAgcmV0dXJuIGdldEFsbFJlbGF0aW9uc2hpcHMoKS5maWx0ZXIoaXNBQ2hpbGRJblJlbGF0aW9uc2hpcC5iaW5kKG51bGwsIHBlcnNvbklkKSkubWFwKGZ1bmN0aW9uIChyZWxhdGlvbnNoaXApIHtcbiAgICByZXR1cm4gZ2V0UGVyc29uRnJvbU1lbWJlcihnZXRIb3VzZWhvbGRNZW1iZXJCeVBlcnNvbklkKGdldFBhcmVudElkRnJvbVJlbGF0aW9uc2hpcChyZWxhdGlvbnNoaXApKSk7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBnZXRBbGxDaGlsZHJlbk9mKHBlcnNvbklkKSB7XG4gIHJldHVybiBnZXRBbGxSZWxhdGlvbnNoaXBzKCkuZmlsdGVyKGlzQVBhcmVudEluUmVsYXRpb25zaGlwLmJpbmQobnVsbCwgcGVyc29uSWQpKS5tYXAoZnVuY3Rpb24gKHJlbGF0aW9uc2hpcCkge1xuICAgIHJldHVybiBnZXRIb3VzZWhvbGRNZW1iZXJCeVBlcnNvbklkKGdldENoaWxkSWRGcm9tUmVsYXRpb25zaGlwKHJlbGF0aW9uc2hpcCkpWydAcGVyc29uJ107XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBnZXRQZXJzb25JZEZyb21QZXJzb24ocGVyc29uJCQxKSB7XG4gIHJldHVybiBwZXJzb24kJDEuaWQ7XG59XG5cbmZ1bmN0aW9uIGdldFBlcnNvbkZyb21NZW1iZXIobWVtYmVyKSB7XG4gIHJldHVybiBtZW1iZXJbJ0BwZXJzb24nXTtcbn1cblxuLyoqXG4gKiBNaXNzaW5nIHJlbGF0aW9uc2hpcCBpbmZlcmVuY2VcbiAqL1xudmFyIG1pc3NpbmdSZWxhdGlvbnNoaXBJbmZlcmVuY2UgPSB7XG4gIHNpYmxpbmdzT2Y6IGZ1bmN0aW9uIHNpYmxpbmdzT2Yoc3ViamVjdE1lbWJlcikge1xuXG4gICAgdmFyIG1pc3NpbmdSZWxhdGlvbnNoaXBzID0gW10sXG4gICAgICAgIGFsbFJlbGF0aW9uc2hpcHMgPSBnZXRBbGxSZWxhdGlvbnNoaXBzKCksXG4gICAgICAgIHBlcnNvbiQkMSA9IGdldFBlcnNvbkZyb21NZW1iZXIoc3ViamVjdE1lbWJlciksXG4gICAgICAgIHBlcnNvbklkID0gcGVyc29uJCQxLmlkLFxuICAgICAgICBwYXJlbnRzID0gZ2V0QWxsUGFyZW50c09mKHBlcnNvbklkKSxcbiAgICAgICAgc2libGluZ0lkcyA9IGFsbFJlbGF0aW9uc2hpcHMuZmlsdGVyKGlzQVNpYmxpbmdJblJlbGF0aW9uc2hpcC5iaW5kKG51bGwsIHBlcnNvbklkKSkubWFwKGdldFNpYmxpbmdJZEZyb21SZWxhdGlvbnNoaXAuYmluZChudWxsLCBwZXJzb25JZCkpO1xuXG4gICAgLyoqXG4gICAgICogSWYgMiBwYXJlbnQgcmVsYXRpb25zaGlwcyBvZiAncGVyc29uJyBhcmUgZm91bmQgd2UgY2FuIGF0dGVtcHQgdG8gaW5mZXJcbiAgICAgKiBzaWJsaW5nIHJlbGF0aW9uc2hpcHNcbiAgICAgKi9cbiAgICBpZiAocGFyZW50cy5sZW5ndGggPT09IDIpIHtcblxuICAgICAgZ2V0QWxsSG91c2Vob2xkTWVtYmVycygpLmZpbHRlcihpc0hvdXNlaG9sZE1lbWJlcikuZm9yRWFjaChmdW5jdGlvbiAobWVtYmVyKSB7XG5cbiAgICAgICAgdmFyIG1lbWJlclBlcnNvbklkID0gbWVtYmVyWydAcGVyc29uJ10uaWQ7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEd1YXJkXG4gICAgICAgICAqIElmIG1lbWJlciBpcyB0aGUgc3ViamVjdCBtZW1iZXJcbiAgICAgICAgICogb3IgbWVtYmVyIGlzIGEgcGFyZW50XG4gICAgICAgICAqIG9yIG1lbWJlciBhbHJlYWR5IGhhcyBhIHNpYmxpbmcgcmVsYXRpb25zaGlwIHdpdGggJ3BlcnNvbidcbiAgICAgICAgICogc2tpcCBtZW1iZXJcbiAgICAgICAgICovXG4gICAgICAgIGlmIChtZW1iZXJQZXJzb25JZCA9PT0gcGVyc29uSWQgfHwgbWVtYmVyUGVyc29uSWQgPT09IHBhcmVudHNbMF0uaWQgfHwgbWVtYmVyUGVyc29uSWQgPT09IHBhcmVudHNbMV0uaWQgfHwgc2libGluZ0lkcy5pbmRleE9mKG1lbWJlclBlcnNvbklkKSA+IC0xKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIG1lbWJlclBhcmVudHMgPSBnZXRBbGxQYXJlbnRzT2YobWVtYmVyUGVyc29uSWQpO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBJZiAyIHBhcmVudHMgb2YgJ21lbWJlcicgYXJlIGZvdW5kXG4gICAgICAgICAqIGFuZCB0aGV5IGFyZSB0aGUgc2FtZSBwYXJlbnRzIG9mICdwZXJzb24nXG4gICAgICAgICAqIHdlIGhhdmUgaWRlbnRpZmllZCBhIG1pc3NpbmcgaW5mZXJyZWQgcmVsYXRpb25zaGlwXG4gICAgICAgICAqL1xuICAgICAgICBpZiAobWVtYmVyUGFyZW50cy5sZW5ndGggPT09IDIgJiYgXyQxLmRpZmZlcmVuY2UocGFyZW50cy5tYXAoZ2V0UGVyc29uSWRGcm9tUGVyc29uKSwgbWVtYmVyUGFyZW50cy5tYXAoZ2V0UGVyc29uSWRGcm9tUGVyc29uKSkubGVuZ3RoID09PSAwKSB7XG5cbiAgICAgICAgICAvKipcbiAgICAgICAgICAgKiBBZGQgdG8gbWlzc2luZ1JlbGF0aW9uc2hpcHNcbiAgICAgICAgICAgKi9cbiAgICAgICAgICBtaXNzaW5nUmVsYXRpb25zaGlwcy5wdXNoKHJlbGF0aW9uc2hpcCgnYnJvdGhlci1zaXN0ZXInLCBwZXJzb25JZCwgbWVtYmVyUGVyc29uSWQsIHtcbiAgICAgICAgICAgIGluZmVycmVkOiB0cnVlLFxuICAgICAgICAgICAgaW5mZXJyZWRCeTogW1xuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBNdXN0IGJlIDQgcmVsYXRpb25zaGlwc1xuICAgICAgICAgICAgICogQ291bGQgaGF2ZSB1c2VkIG1lbWJlcidzIHBhcmVudHMgYnV0IHdlIGNhbiBhc3N1bWUgdGhleVxuICAgICAgICAgICAgICogbXVzdCBiZSB0aGUgc2FtZSBhdCB0aGlzIHBvaW50IG9yIHRoZSBpbmZlcnJlbmNlXG4gICAgICAgICAgICAgKiBjb3VsZG4ndCBoYXBwZW4uXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGdldFJlbGF0aW9uc2hpcE9mKHBlcnNvbklkLCBwYXJlbnRzWzBdLmlkKS5pZCwgZ2V0UmVsYXRpb25zaGlwT2YocGVyc29uSWQsIHBhcmVudHNbMV0uaWQpLmlkLCBnZXRSZWxhdGlvbnNoaXBPZihtZW1iZXJQZXJzb25JZCwgcGFyZW50c1swXS5pZCkuaWQsIGdldFJlbGF0aW9uc2hpcE9mKG1lbWJlclBlcnNvbklkLCBwYXJlbnRzWzFdLmlkKS5pZF1cbiAgICAgICAgICB9KSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiBtaXNzaW5nUmVsYXRpb25zaGlwcztcbiAgfVxufTtcblxuZnVuY3Rpb24gaW5mZXJSZWxhdGlvbnNoaXBzKHJlbGF0aW9uc2hpcCwgcGVyc29uSXMsIHBlcnNvblRvKSB7XG4gIHZhciBtaXNzaW5nUmVsYXRpb25zaGlwcyA9IFtdO1xuXG4gIGlmIChyZWxhdGlvbnNoaXAucGVyc29uSXNEZXNjcmlwdGlvbiA9PT0gJ21vdGhlci1mYXRoZXInKSB7XG4gICAgbWlzc2luZ1JlbGF0aW9uc2hpcHMgPSBtaXNzaW5nUmVsYXRpb25zaGlwcy5jb25jYXQobWlzc2luZ1JlbGF0aW9uc2hpcEluZmVyZW5jZS5zaWJsaW5nc09mKHBlcnNvblRvKSk7XG4gIH1cblxuICBpZiAocmVsYXRpb25zaGlwLnBlcnNvbklzRGVzY3JpcHRpb24gPT09ICdzb24tZGF1Z2h0ZXInKSB7XG4gICAgbWlzc2luZ1JlbGF0aW9uc2hpcHMgPSBtaXNzaW5nUmVsYXRpb25zaGlwcy5jb25jYXQobWlzc2luZ1JlbGF0aW9uc2hpcEluZmVyZW5jZS5zaWJsaW5nc09mKHBlcnNvbklzKSk7XG4gIH1cblxuICAkLmVhY2gobWlzc2luZ1JlbGF0aW9uc2hpcHMsIGZ1bmN0aW9uIChpLCByZWxhdGlvbnNoaXApIHtcbiAgICBhZGRSZWxhdGlvbnNoaXAocmVsYXRpb25zaGlwKTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGZpbmROZXh0TWlzc2luZ1JlbGF0aW9uc2hpcCgpIHtcbiAgdmFyIGhvdXNlaG9sZE1lbWJlcnMgPSBnZXRBbGxIb3VzZWhvbGRNZW1iZXJzKCkuZmlsdGVyKGlzSG91c2Vob2xkTWVtYmVyKSxcbiAgICAgIHJlbGF0aW9uc2hpcHMgPSBnZXRBbGxSZWxhdGlvbnNoaXBzKCksXG4gICAgICBtaXNzaW5nUmVsYXRpb25zaGlwTWVtYmVycyA9IFtdLFxuICAgICAgcGVyc29uSXMgPSBudWxsO1xuXG4gIC8qKlxuICAgKiBGaW5kIHRoZSBuZXh0IG1pc3NpbmcgcmVsYXRpb25zaGlwXG4gICAqL1xuICAkLmVhY2goaG91c2Vob2xkTWVtYmVycywgZnVuY3Rpb24gKGksIG1lbWJlcikge1xuICAgIHZhciBwZXJzb25JZCA9IG1lbWJlclsnQHBlcnNvbiddLmlkO1xuXG4gICAgLyoqXG4gICAgICogR2V0IGFsbCByZWxhdGlvbnNoaXBzIGZvciB0aGlzIG1lbWJlclxuICAgICAqL1xuICAgIHZhciBtZW1iZXJSZWxhdGlvbnNoaXBzID0gcmVsYXRpb25zaGlwcy5maWx0ZXIoZnVuY3Rpb24gKHJlbGF0aW9uc2hpcCkge1xuICAgICAgcmV0dXJuIHJlbGF0aW9uc2hpcC5wZXJzb25Jc0lkID09PSBwZXJzb25JZCB8fCByZWxhdGlvbnNoaXAucGVyc29uVG9JZCA9PT0gcGVyc29uSWQ7XG4gICAgfSksXG4gICAgICAgIG1lbWJlclJlbGF0aW9uc2hpcFRvSWRzID0gbWVtYmVyUmVsYXRpb25zaGlwcy5tYXAoZnVuY3Rpb24gKHJlbGF0aW9uc2hpcCkge1xuICAgICAgcmV0dXJuIHJlbGF0aW9uc2hpcC5wZXJzb25Jc0lkID09PSBwZXJzb25JZCA/IHJlbGF0aW9uc2hpcC5wZXJzb25Ub0lkIDogcmVsYXRpb25zaGlwLnBlcnNvbklzSWQ7XG4gICAgfSkgfHwgW107XG5cbiAgICAvKipcbiAgICAgKiBJZiB0b3RhbCByZWxhdGlvbnNoaXBzIHJlbGF0ZWQgdG8gdGhpcyBtZW1iZXIgaXNuJ3QgZXF1YWwgdG9cbiAgICAgKiB0b3RhbCBob3VzZWhvbGQgbWVtYmVycyAtMSwgaW5kaWNhdGVzIG1pc3NpbmcgcmVsYXRpb25zaGlwXG4gICAgICovXG4gICAgaWYgKG1lbWJlclJlbGF0aW9uc2hpcHMubGVuZ3RoIDwgaG91c2Vob2xkTWVtYmVycy5sZW5ndGggLSAxKSB7XG5cbiAgICAgIC8qKlxuICAgICAgICogQWxsIG1pc3NpbmcgcmVsYXRpb25zaGlwIG1lbWJlcnNcbiAgICAgICAqL1xuICAgICAgbWlzc2luZ1JlbGF0aW9uc2hpcE1lbWJlcnMgPSBob3VzZWhvbGRNZW1iZXJzLmZpbHRlcihmdW5jdGlvbiAobSkge1xuICAgICAgICByZXR1cm4gbWVtYmVyUmVsYXRpb25zaGlwVG9JZHMuaW5kZXhPZihtWydAcGVyc29uJ10uaWQpID09PSAtMSAmJiBtWydAcGVyc29uJ10uaWQgIT09IHBlcnNvbklkO1xuICAgICAgfSk7XG5cbiAgICAgIHBlcnNvbklzID0gbWVtYmVyO1xuXG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4gcGVyc29uSXMgPyB7XG4gICAgcGVyc29uSXM6IHBlcnNvbklzLFxuICAgIHBlcnNvblRvOiBtaXNzaW5nUmVsYXRpb25zaGlwTWVtYmVyc1swXVxuICB9IDogbnVsbDtcbn1cblxuZnVuY3Rpb24gZ2V0UGVvcGxlSWRzTWlzc2luZ1JlbGF0aW9uc2hpcHNXaXRoUGVyc29uKHBlcnNvbklkKSB7XG4gIHZhciByZW1haW5pbmdQZXJzb25JZHMgPSBnZXRBbGxIb3VzZWhvbGRNZW1iZXJzKCkuZmlsdGVyKGlzSG91c2Vob2xkTWVtYmVyKS5tYXAoZnVuY3Rpb24gKG1lbWJlcikge1xuICAgIHJldHVybiBtZW1iZXJbJ0BwZXJzb24nXS5pZDtcbiAgfSk7XG5cbiAgLyoqXG4gICAqIFJlbW92ZSB0aGlzIHBlcnNvbiBmcm9tIHRoZSBsaXN0XG4gICAqL1xuICByZW1vdmVGcm9tTGlzdChyZW1haW5pbmdQZXJzb25JZHMsIHBlcnNvbklkKTtcblxuICAkLmVhY2goZ2V0QWxsUmVsYXRpb25zaGlwcygpLCBmdW5jdGlvbiAoaSwgcmVsYXRpb25zaGlwKSB7XG4gICAgaWYgKCFpc0luUmVsYXRpb25zaGlwKHBlcnNvbklkLCByZWxhdGlvbnNoaXApKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVtb3ZlIHRoZSBvdGhlciBwZXJzb24gZnJvbSB0aGUgcmVtYWluaW5nUGVyc29uSWRzIGxpc3RcbiAgICAgKi9cbiAgICByZW1vdmVGcm9tTGlzdChyZW1haW5pbmdQZXJzb25JZHMsIGdldE90aGVyUGVyc29uSWRGcm9tUmVsYXRpb25zaGlwKHBlcnNvbklkLCByZWxhdGlvbnNoaXApKTtcbiAgfSk7XG5cbiAgcmV0dXJuIHJlbWFpbmluZ1BlcnNvbklkcztcbn1cblxuZnVuY3Rpb24gZ2V0UmVsYXRpb25zaGlwVHlwZShyZWxhdGlvbnNoaXApIHtcbiAgcmV0dXJuIHJlbGF0aW9uc2hpcERlc2NyaXB0aW9uTWFwW3JlbGF0aW9uc2hpcC5wZXJzb25Jc0Rlc2NyaXB0aW9uXS50eXBlO1xufVxuXG4vKipcbiAqIFJldHJpZXZlIGZyb20gcmVsYXRpb25zaGlwIGdyb3VwXG4gKi9cbmZ1bmN0aW9uIGdldFJlbGF0aW9uc2hpcHNXaXRoUGVyc29uSWRzKHJlbGF0aW9uc2hpcHMsIGlkQXJyKSB7XG4gIHJldHVybiByZWxhdGlvbnNoaXBzLmZpbHRlcihmdW5jdGlvbiAoY2hpbGRSZWxhdGlvbnNoaXApIHtcbiAgICByZXR1cm4gaWRBcnIuaW5kZXhPZihjaGlsZFJlbGF0aW9uc2hpcC5wZXJzb25Jc0lkKSAhPT0gLTEgfHwgaWRBcnIuaW5kZXhPZihjaGlsZFJlbGF0aW9uc2hpcC5wZXJzb25Ub0lkKSAhPT0gLTE7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBnZXRSZWxhdGlvbnNoaXBPZihwZXJzb24xLCBwZXJzb24yKSB7XG4gIHJldHVybiBnZXRBbGxSZWxhdGlvbnNoaXBzKCkuZmluZChmdW5jdGlvbiAocmVsYXRpb25zaGlwKSB7XG4gICAgcmV0dXJuIGlzSW5SZWxhdGlvbnNoaXAocGVyc29uMSwgcmVsYXRpb25zaGlwKSAmJiBpc0luUmVsYXRpb25zaGlwKHBlcnNvbjIsIHJlbGF0aW9uc2hpcCk7XG4gIH0pO1xufVxuXG52YXIgUEVSU09OQUxfREVUQUlMU19LRVkgPSAnaW5kaXZpZHVhbC1kZXRhaWxzJztcbnZhciBQRVJTT05BTF9QSU5TX0tFWSA9ICdpbmRpdmlkdWFsLXBpbnMnO1xuXG52YXIgcGVyc29uYWxEZXRhaWxzTWFyaXRhbFN0YXR1c01hcCA9IHtcbiAgJ25ldmVyJzoge1xuICAgIGRlc2NyaXB0aW9uOiAnTmV2ZXIgbWFycmllZCBhbmQgbmV2ZXIgcmVnaXN0ZXJlZCBhIHNhbWUtc2V4IGNpdmlsJyArICcgcGFydG5lcnNoaXAnXG4gIH0sXG4gICdtYXJyaWVkJzoge1xuICAgIGRlc2NyaXB0aW9uOiAnTWFycmllZCdcbiAgfSxcbiAgJ3JlZ2lzdGVyZWQnOiB7XG4gICAgZGVzY3JpcHRpb246ICdJbiBhIHJlZ2lzdGVyZWQgc2FtZS1zZXggY2l2aWwgcGFydG5lcnNoaXAnXG4gIH0sXG4gICdzZXBhcmF0ZWQtbWFycmllZCc6IHtcbiAgICBkZXNjcmlwdGlvbjogJ1NlcGFyYXRlZCwgYnV0IHN0aWxsIGxlZ2FsbHkgbWFycmllZCdcbiAgfSxcbiAgJ2Rpdm9yY2VkJzoge1xuICAgIGRlc2NyaXB0aW9uOiAnRGl2b3JjZWQnXG4gIH0sXG4gICdmb3JtZXItcGFydG5lcnNoaXAnOiB7XG4gICAgZGVzY3JpcHRpb246ICdGb3JtZXJseSBpbiBhIHNhbWUtc2V4IGNpdmlsIHBhcnRuZXJzaGlwIHdoaWNoIGlzIG5vdycgKyAnIGxlZ2FsbHkgZGlzc29sdmVkJ1xuICB9LFxuICAnd2lkb3dlZCc6IHtcbiAgICBkZXNjcmlwdGlvbjogJ1dpZG93ZWQnXG4gIH0sXG4gICdzdXJ2aXZpbmctcGFydG5lcic6IHtcbiAgICBkZXNjcmlwdGlvbjogJ1N1cnZpdmluZyBwYXJ0bmVyIGZyb20gYSBzYW1lLXNleCBjaXZpbCBwYXJ0bmVyc2hpcCdcbiAgfSxcbiAgJ3NlcGFyYXRlZC1wYXJ0bmVyc2hpcCc6IHtcbiAgICBkZXNjcmlwdGlvbjogJ1NlcGFyYXRlZCwgYnV0IHN0aWxsIGxlZ2FsbHkgaW4gYSBzYW1lLXNleCBjaXZpbCBwYXJ0bmVyc2hpcCdcbiAgfVxufTtcblxudmFyIHBlcnNvbmFsRGV0YWlsc0NvdW50cnlNYXAgPSB7XG4gICdlbmdsYW5kJzoge1xuICAgIGRlc2NyaXB0aW9uOiAnRW5nbGFuZCdcbiAgfSxcbiAgJ3dhbGVzJzoge1xuICAgIGRlc2NyaXB0aW9uOiAnV2FsZXMnXG4gIH0sXG4gICdzY290bGFuZCc6IHtcbiAgICBkZXNjcmlwdGlvbjogJ1Njb3RsYW5kJ1xuICB9LFxuICAnbm9ydGhlcm4taXJlbGFuZCc6IHtcbiAgICBkZXNjcmlwdGlvbjogJ05vcnRoZXJuIElyZWxhbmQnXG4gIH0sXG4gICdyZXB1YmxpYy1pcmVsYW5kJzoge1xuICAgIGRlc2NyaXB0aW9uOiAnUmVwdWJsaWMgb2YgSXJlbGFuZCdcbiAgfSxcbiAgJ2Vsc2V3aGVyZSc6IHtcbiAgICBkZXNjcmlwdGlvbjogJ0Vsc2V3aGVyZSdcbiAgfVxufTtcblxudmFyIHBlcnNvbmFsRGV0YWlsc09yaWVudGF0aW9uTWFwID0ge1xuICAnc3RyYWlnaHQnOiB7XG4gICAgZGVzY3JpcHRpb246ICdTdHJhaWdodCBvciBIZXRlcm9zZXh1YWwnXG4gIH0sXG4gICdnYXknOiB7XG4gICAgZGVzY3JpcHRpb246ICdHYXkgb3IgTGVzYmlhbidcbiAgfSxcbiAgJ2Jpc2V4dWFsJzoge1xuICAgIGRlc2NyaXB0aW9uOiAnQmlzZXh1YWwnXG4gIH0sXG4gICdvdGhlcic6IHtcbiAgICBkZXNjcmlwdGlvbjogJ090aGVyJ1xuICB9LFxuICAnbm8tc2F5Jzoge1xuICAgIGRlc2NyaXB0aW9uOiAnUHJlZmVyIG5vdCB0byBzYXknXG4gIH1cbn07XG5cbnZhciBwZXJzb25hbERldGFpbHNHZW5kZXJNYXAgPSB7XG4gICdtYWxlJzoge1xuICAgIGRlc2NyaXB0aW9uOiAnTWFsZSdcbiAgfSxcbiAgJ2ZlbWFsZSc6IHtcbiAgICBkZXNjcmlwdGlvbjogJ0ZlbWFsZSdcbiAgfVxufTtcblxuZnVuY3Rpb24gYWRkVXBkYXRlUGVyc29uYWxEZXRhaWxzRE9CKHBlcnNvbklkLCBkYXksIG1vbnRoLCB5ZWFyKSB7XG4gIHZhciBhbGxEZXRhaWxzID0gZ2V0QWxsUGVyc29uYWxEZXRhaWxzKCksXG4gICAgICBkZXRhaWxzID0gYWxsRGV0YWlsc1twZXJzb25JZF0gfHwge307XG5cbiAgZGV0YWlsc1snZG9iJ10gPSB7XG4gICAgZGF5OiBkYXksXG4gICAgbW9udGg6IG1vbnRoLFxuICAgIHllYXI6IHllYXJcbiAgfTtcblxuICB1cGRhdGVQZXJzb25hbERldGFpbHMocGVyc29uSWQsIGRldGFpbHMpO1xuXG4gIHJldHVybiBkZXRhaWxzO1xufVxuXG5mdW5jdGlvbiBhZGRVcGRhdGVQZXJzb25hbERldGFpbHNET0JVbmtub3duKHBlcnNvbklkKSB7XG4gIHZhciBhbGxEZXRhaWxzID0gZ2V0QWxsUGVyc29uYWxEZXRhaWxzKCksXG4gICAgICBkZXRhaWxzID0gYWxsRGV0YWlsc1twZXJzb25JZF0gfHwge307XG5cbiAgY29uc29sZS5sb2coJ3Vua25vd24nKTtcblxuICBkZXRhaWxzWydkb2InXSA9ICd1bmtub3duJztcblxuICB1cGRhdGVQZXJzb25hbERldGFpbHMocGVyc29uSWQsIGRldGFpbHMpO1xuXG4gIHJldHVybiBkZXRhaWxzO1xufVxuXG5mdW5jdGlvbiBhZGRVcGRhdGVNYXJpdGFsU3RhdHVzKHBlcnNvbklkLCB2YWwpIHtcbiAgdmFyIGFsbERldGFpbHMgPSBnZXRBbGxQZXJzb25hbERldGFpbHMoKSxcbiAgICAgIGRldGFpbHMgPSBhbGxEZXRhaWxzW3BlcnNvbklkXSB8fCB7fTtcblxuICBkZXRhaWxzWydtYXJpdGFsU3RhdHVzJ10gPSB2YWw7XG5cbiAgdXBkYXRlUGVyc29uYWxEZXRhaWxzKHBlcnNvbklkLCBkZXRhaWxzKTtcblxuICByZXR1cm4gZGV0YWlscztcbn1cblxuZnVuY3Rpb24gYWRkVXBkYXRlQ291bnRyeShwZXJzb25JZCwgdmFsKSB7XG4gIHZhciBhbGxEZXRhaWxzID0gZ2V0QWxsUGVyc29uYWxEZXRhaWxzKCksXG4gICAgICBkZXRhaWxzID0gYWxsRGV0YWlsc1twZXJzb25JZF0gfHwge307XG5cbiAgZGV0YWlsc1snY291bnRyeSddID0gdmFsO1xuXG4gIHVwZGF0ZVBlcnNvbmFsRGV0YWlscyhwZXJzb25JZCwgZGV0YWlscyk7XG5cbiAgcmV0dXJuIGRldGFpbHM7XG59XG5cbmZ1bmN0aW9uIGFkZFVwZGF0ZU9yaWVudGF0aW9uKHBlcnNvbklkLCB2YWwpIHtcbiAgdmFyIGFsbERldGFpbHMgPSBnZXRBbGxQZXJzb25hbERldGFpbHMoKSxcbiAgICAgIGRldGFpbHMgPSBhbGxEZXRhaWxzW3BlcnNvbklkXSB8fCB7fTtcblxuICBkZXRhaWxzWydvcmllbnRhdGlvbiddID0gdmFsO1xuXG4gIHVwZGF0ZVBlcnNvbmFsRGV0YWlscyhwZXJzb25JZCwgZGV0YWlscyk7XG5cbiAgcmV0dXJuIGRldGFpbHM7XG59XG5cbmZ1bmN0aW9uIGFkZFVwZGF0ZVNhbGFyeShwZXJzb25JZCwgdmFsKSB7XG4gIHZhciBhbGxEZXRhaWxzID0gZ2V0QWxsUGVyc29uYWxEZXRhaWxzKCksXG4gICAgICBkZXRhaWxzID0gYWxsRGV0YWlsc1twZXJzb25JZF0gfHwge307XG5cbiAgZGV0YWlsc1snc2FsYXJ5J10gPSB2YWw7XG5cbiAgdXBkYXRlUGVyc29uYWxEZXRhaWxzKHBlcnNvbklkLCBkZXRhaWxzKTtcblxuICByZXR1cm4gZGV0YWlscztcbn1cblxuZnVuY3Rpb24gYWRkVXBkYXRlU2V4KHBlcnNvbklkLCB2YWwpIHtcbiAgdmFyIGFsbERldGFpbHMgPSBnZXRBbGxQZXJzb25hbERldGFpbHMoKSxcbiAgICAgIGRldGFpbHMgPSBhbGxEZXRhaWxzW3BlcnNvbklkXSB8fCB7fTtcblxuICBkZXRhaWxzWydzZXgnXSA9IHZhbDtcblxuICB1cGRhdGVQZXJzb25hbERldGFpbHMocGVyc29uSWQsIGRldGFpbHMpO1xuXG4gIHJldHVybiBkZXRhaWxzO1xufVxuXG5mdW5jdGlvbiBhZGRVcGRhdGVBZGRyZXNzV2hlcmUocGVyc29uSWQsIHZhbCkge1xuICB2YXIgYWxsRGV0YWlscyA9IGdldEFsbFBlcnNvbmFsRGV0YWlscygpLFxuICAgICAgZGV0YWlscyA9IGFsbERldGFpbHNbcGVyc29uSWRdIHx8IHt9O1xuXG4gIGRldGFpbHNbJ2FkZHJlc3Mtd2hlcmUnXSA9IHZhbDtcblxuICB1cGRhdGVQZXJzb25hbERldGFpbHMocGVyc29uSWQsIGRldGFpbHMpO1xuXG4gIHJldHVybiBkZXRhaWxzO1xufVxuXG5mdW5jdGlvbiBhZGRVcGRhdGVBZGRyZXNzSW5kaXZpZHVhbChwZXJzb25JZCwgdmFsKSB7XG4gIHZhciBhbGxEZXRhaWxzID0gZ2V0QWxsUGVyc29uYWxEZXRhaWxzKCksXG4gICAgICBkZXRhaWxzID0gYWxsRGV0YWlsc1twZXJzb25JZF0gfHwge307XG5cbiAgZGV0YWlsc1snYWRkcmVzcyddID0gdmFsO1xuXG4gIHVwZGF0ZVBlcnNvbmFsRGV0YWlscyhwZXJzb25JZCwgZGV0YWlscyk7XG5cbiAgcmV0dXJuIGRldGFpbHM7XG59XG5cbmZ1bmN0aW9uIGFkZFVwZGF0ZUFnZShwZXJzb25JZCwgdmFsLCBfcmVmKSB7XG4gIHZhciBfcmVmJGlzQXBwcm94aW1hdGUgPSBfcmVmLmlzQXBwcm94aW1hdGUsXG4gICAgICBpc0FwcHJveGltYXRlID0gX3JlZiRpc0FwcHJveGltYXRlID09PSB1bmRlZmluZWQgPyBmYWxzZSA6IF9yZWYkaXNBcHByb3hpbWF0ZTtcblxuICB2YXIgYWxsRGV0YWlscyA9IGdldEFsbFBlcnNvbmFsRGV0YWlscygpLFxuICAgICAgZGV0YWlscyA9IGFsbERldGFpbHNbcGVyc29uSWRdIHx8IHt9O1xuXG4gIGRldGFpbHNbJ2FnZSddID0ge1xuICAgIHZhbDogdmFsLFxuICAgIGlzQXBwcm94aW1hdGU6IGlzQXBwcm94aW1hdGVcbiAgfTtcblxuICB1cGRhdGVQZXJzb25hbERldGFpbHMocGVyc29uSWQsIGRldGFpbHMpO1xuXG4gIHJldHVybiBkZXRhaWxzO1xufVxuXG5mdW5jdGlvbiBnZXRQaW5zKCkge1xuICByZXR1cm4gSlNPTi5wYXJzZShzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKFBFUlNPTkFMX1BJTlNfS0VZKSkgfHwge307XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVBpbkZvcihwZXJzb25JZCkge1xuICB2YXIgb3B0cyA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDoge307XG5cbiAgdmFyIHBpbnMgPSBnZXRQaW5zKCk7XG5cbiAgcGluc1twZXJzb25JZF0gPSB7XG4gICAgcGluOiBfLnJhbmRvbSgxMDAwMCwgOTk5OTkpLFxuICAgIGV4cG9ydGVkOiAhIW9wdHMuZXhwb3J0ZWRcbiAgfTtcblxuICBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKFBFUlNPTkFMX1BJTlNfS0VZLCBKU09OLnN0cmluZ2lmeShwaW5zKSk7XG5cbiAgcmV0dXJuIHBpbnNbcGVyc29uSWRdO1xufVxuXG5mdW5jdGlvbiBnZXRQaW5Gb3IocGVyc29uSWQpIHtcbiAgcmV0dXJuIGdldFBpbnMoKVtwZXJzb25JZF07XG59XG5cbmZ1bmN0aW9uIHVuc2V0UGluRm9yKHBlcnNvbklkKSB7XG4gIHZhciBwaW5zID0gZ2V0UGlucygpO1xuXG4gIGRlbGV0ZSBwaW5zW3BlcnNvbklkXTtcblxuICBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKFBFUlNPTkFMX1BJTlNfS0VZLCBKU09OLnN0cmluZ2lmeShwaW5zKSk7XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZVBlcnNvbmFsRGV0YWlscyhwZXJzb25JZCwgZGV0YWlscykge1xuICBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKFBFUlNPTkFMX0RFVEFJTFNfS0VZLCBKU09OLnN0cmluZ2lmeShfZXh0ZW5kcyh7fSwgZ2V0QWxsUGVyc29uYWxEZXRhaWxzKCksIGRlZmluZVByb3BlcnR5KHt9LCBwZXJzb25JZCwgZGV0YWlscykpKSk7XG5cbiAgcmV0dXJuIGRldGFpbHM7XG59XG5cbmZ1bmN0aW9uIGdldEFsbFBlcnNvbmFsRGV0YWlscygpIHtcbiAgcmV0dXJuIEpTT04ucGFyc2Uoc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbShQRVJTT05BTF9ERVRBSUxTX0tFWSkpIHx8IHt9O1xufVxuXG5mdW5jdGlvbiBnZXRQZXJzb25hbERldGFpbHNGb3IocGVyc29uSWQpIHtcbiAgdmFyIHN0b3JhZ2VPYmogPSBKU09OLnBhcnNlKHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oUEVSU09OQUxfREVUQUlMU19LRVkpKSB8fCB7fSxcbiAgICAgIHBlcnNvbk9iaiA9IHN0b3JhZ2VPYmpbcGVyc29uSWRdO1xuXG4gIGlmICghcGVyc29uT2JqKSB7XG4gICAgY29uc29sZS5sb2coJ1BlcnNvbmFsIGRldGFpbHMgZm9yICcgKyBwZXJzb25JZCArICcgbm90IGZvdW5kJyk7XG4gIH1cblxuICByZXR1cm4gcGVyc29uT2JqO1xufVxuXG4vKipcbiAqIENvcGllZCBmcm9tOlxuICogaHR0cHM6Ly9jb2RlcmV2aWV3LnN0YWNrZXhjaGFuZ2UuY29tL3F1ZXN0aW9ucy85MDM0OS9jaGFuZ2luZy1udW1iZXItdG8td29yZHMtaW4tamF2YXNjcmlwdFxuICogPT09PT09PT09PT09PT09XG4gKi9cbnZhciBPTkVfVE9fTklORVRFRU4gPSBbJ29uZScsICd0d28nLCAndGhyZWUnLCAnZm91cicsICdmaXZlJywgJ3NpeCcsICdzZXZlbicsICdlaWdodCcsICduaW5lJywgJ3RlbicsICdlbGV2ZW4nLCAndHdlbHZlJywgJ3RoaXJ0ZWVuJywgJ2ZvdXJ0ZWVuJywgJ2ZpZnRlZW4nLCAnc2l4dGVlbicsICdzZXZlbnRlZW4nLCAnZWlnaHRlZW4nLCAnbmluZXRlZW4nXTtcblxudmFyIFRFTlMgPSBbJ3RlbicsICd0d2VudHknLCAndGhpcnR5JywgJ2ZvcnR5JywgJ2ZpZnR5JywgJ3NpeHR5JywgJ3NldmVudHknLCAnZWlnaHR5JywgJ25pbmV0eSddO1xuXG52YXIgU0NBTEVTID0gWyd0aG91c2FuZCcsICdtaWxsaW9uJywgJ2JpbGxpb24nLCAndHJpbGxpb24nXTtcblxuLy8gaGVscGVyIGZ1bmN0aW9uIGZvciB1c2Ugd2l0aCBBcnJheS5maWx0ZXJcbmZ1bmN0aW9uIGlzVHJ1dGh5KGl0ZW0pIHtcbiAgcmV0dXJuICEhaXRlbTtcbn1cblxuLy8gY29udmVydCBhIG51bWJlciBpbnRvICdjaHVua3MnIG9mIDAtOTk5XG5mdW5jdGlvbiBjaHVuayhudW1iZXIpIHtcbiAgdmFyIHRob3VzYW5kcyA9IFtdO1xuXG4gIHdoaWxlIChudW1iZXIgPiAwKSB7XG4gICAgdGhvdXNhbmRzLnB1c2gobnVtYmVyICUgMTAwMCk7XG4gICAgbnVtYmVyID0gTWF0aC5mbG9vcihudW1iZXIgLyAxMDAwKTtcbiAgfVxuXG4gIHJldHVybiB0aG91c2FuZHM7XG59XG5cbi8vIHRyYW5zbGF0ZSBhIG51bWJlciBmcm9tIDEtOTk5IGludG8gRW5nbGlzaFxuZnVuY3Rpb24gaW5FbmdsaXNoKG51bWJlcikge1xuICB2YXIgdGhvdXNhbmRzLFxuICAgICAgaHVuZHJlZHMsXG4gICAgICB0ZW5zLFxuICAgICAgb25lcyxcbiAgICAgIHdvcmRzID0gW107XG5cbiAgaWYgKG51bWJlciA8IDIwKSB7XG4gICAgcmV0dXJuIE9ORV9UT19OSU5FVEVFTltudW1iZXIgLSAxXTsgLy8gbWF5IGJlIHVuZGVmaW5lZFxuICB9XG5cbiAgaWYgKG51bWJlciA8IDEwMCkge1xuICAgIG9uZXMgPSBudW1iZXIgJSAxMDtcbiAgICB0ZW5zID0gbnVtYmVyIC8gMTAgfCAwOyAvLyBlcXVpdmFsZW50IHRvIE1hdGguZmxvb3IobnVtYmVyIC8gMTApXG5cbiAgICB3b3Jkcy5wdXNoKFRFTlNbdGVucyAtIDFdKTtcbiAgICB3b3Jkcy5wdXNoKGluRW5nbGlzaChvbmVzKSk7XG5cbiAgICByZXR1cm4gd29yZHMuZmlsdGVyKGlzVHJ1dGh5KS5qb2luKCctJyk7XG4gIH1cblxuICBodW5kcmVkcyA9IG51bWJlciAvIDEwMCB8IDA7XG4gIHdvcmRzLnB1c2goaW5FbmdsaXNoKGh1bmRyZWRzKSk7XG4gIHdvcmRzLnB1c2goJ2h1bmRyZWQnKTtcbiAgd29yZHMucHVzaChpbkVuZ2xpc2gobnVtYmVyICUgMTAwKSk7XG5cbiAgcmV0dXJuIHdvcmRzLmZpbHRlcihpc1RydXRoeSkuam9pbignICcpO1xufVxuXG4vLyBhcHBlbmQgdGhlIHdvcmQgZm9yIGEgc2NhbGUuIE1hZGUgZm9yIHVzZSB3aXRoIEFycmF5Lm1hcFxuZnVuY3Rpb24gYXBwZW5kU2NhbGUoY2h1bmssIGV4cCkge1xuICB2YXIgc2NhbGU7XG4gIGlmICghY2h1bmspIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICBzY2FsZSA9IFNDQUxFU1tleHAgLSAxXTtcbiAgcmV0dXJuIFtjaHVuaywgc2NhbGVdLmZpbHRlcihpc1RydXRoeSkuam9pbignICcpO1xufVxuXG4vKipcbiAqID09PT09PT09PT09PT09PVxuICogRW5kIGNvcHlcbiAqL1xuXG4vKipcbiAqIE1vZGlmaWNhdGlvbiAtIGRlY29yYXRvclxuICovXG52YXIgTlVNQkVSX1RPX1BPU0lUSU9OX1RFWFRfTUFQID0ge1xuICAnb25lJzogJ2ZpcnN0JyxcbiAgJ3R3byc6ICdzZWNvbmQnLFxuICAndGhyZWUnOiAndGhpcmQnLFxuICAnZm91cic6ICdmb3VydGgnLFxuICAnZml2ZSc6ICdmaWZ0aCcsXG4gICdzaXgnOiAnc2l4dGgnLFxuICAnc2V2ZW4nOiAnc2V2ZW50aCcsXG4gICdlaWdodCc6ICdlaWdodGgnLFxuICAnbmluZSc6ICduaW5ldGgnLFxuICAndGVuJzogJ3RlbnRoJyxcbiAgJ2VsZXZlbic6ICdlbGV2ZW50aCcsXG4gICd0d2VsdmUnOiAndHdlbHZldGgnLFxuICAndGhpcnRlZW4nOiAndGhpcnRlZW50aCcsXG4gICdmb3VydGVlbic6ICdmb3VydGVlbnRoJyxcbiAgJ2ZpZnRlZW4nOiAnZmlmdGVlbnRoJyxcbiAgJ3NpeHRlZW4nOiAnc2l4dGVlbnRoJyxcbiAgJ3NldmVudGVlbic6ICdzZXZlbnRlZW50aCcsXG4gICdlaWdodGVlbic6ICdlaWdodGVlbnRoJyxcbiAgJ25pbmV0ZWVuJzogJ25pbmV0ZWVudGgnLFxuXG4gICd0d2VudHknOiAndHdlbnRpZXRoJyxcbiAgJ3RoaXJ0eSc6ICd0aGlydGlldGgnLFxuICAnZm9ydHknOiAnZm9ydGlldGgnLFxuICAnZmlmdHknOiAnZmlmdGlldGgnLFxuICAnc2l4dHknOiAnc2l4dGlldGgnLFxuICAnc2V2ZW50eSc6ICdzZXZlbnRpZXRoJyxcbiAgJ2VpZ2h0eSc6ICdlaWdodGlldGgnLFxuICAnbmluZXR5JzogJ25pbmV0aWV0aCcsXG4gICdodW5kcmVkJzogJ2h1bmRyZWR0aCcsXG5cbiAgJ3Rob3VzYW5kJzogJ3Rob3VzYW5kdGgnLFxuICAnbWlsbGlvbic6ICdtaWxsaW9udGgnLFxuICAnYmlsbGlvbic6ICdiaWxsaW9udGgnLFxuICAndHJpbGxpb24nOiAndHJpbGxpb250aCdcbn07XG5cbmZ1bmN0aW9uIG51bWJlclRvUG9zaXRpb25Xb3JkKG51bSkge1xuICB2YXIgc3RyID0gY2h1bmsobnVtKS5tYXAoaW5FbmdsaXNoKS5tYXAoYXBwZW5kU2NhbGUpLmZpbHRlcihpc1RydXRoeSkucmV2ZXJzZSgpLmpvaW4oJyAnKTtcblxuICB2YXIgc3ViID0gc3RyLnNwbGl0KCcgJyksXG4gICAgICBsYXN0V29yZERhc2hTcGxpdEFyciA9IHN1YltzdWIubGVuZ3RoIC0gMV0uc3BsaXQoJy0nKSxcbiAgICAgIGxhc3RXb3JkID0gbGFzdFdvcmREYXNoU3BsaXRBcnJbbGFzdFdvcmREYXNoU3BsaXRBcnIubGVuZ3RoIC0gMV0sXG4gICAgICBuZXdMYXN0V29yZCA9IChsYXN0V29yZERhc2hTcGxpdEFyci5sZW5ndGggPiAxID8gbGFzdFdvcmREYXNoU3BsaXRBcnJbMF0gKyAnLScgOiAnJykgKyBOVU1CRVJfVE9fUE9TSVRJT05fVEVYVF9NQVBbbGFzdFdvcmRdO1xuXG4gIC8qY29uc29sZS5sb2coJ3N0cjonLCBzdHIpO1xuICBjb25zb2xlLmxvZygnc3ViOicsIHN1Yik7XG4gIGNvbnNvbGUubG9nKCdsYXN0V29yZERhc2hTcGxpdEFycjonLCBsYXN0V29yZERhc2hTcGxpdEFycik7XG4gIGNvbnNvbGUubG9nKCdsYXN0V29yZDonLCBsYXN0V29yZCk7XG4gIGNvbnNvbGUubG9nKCduZXdMYXN0V29yZDonLCBuZXdMYXN0V29yZCk7Ki9cblxuICB2YXIgc3ViQ29weSA9IFtdLmNvbmNhdChzdWIpO1xuICBzdWJDb3B5LnBvcCgpO1xuICB2YXIgcHJlZml4ID0gc3ViQ29weS5qb2luKCcgJyk7XG4gIHZhciByZXN1bHQgPSAocHJlZml4ID8gcHJlZml4ICsgJyAnIDogJycpICsgbmV3TGFzdFdvcmQ7XG5cbiAgLy8gY29uc29sZS5sb2coJ3Jlc3VsdCcsIChwcmVmaXggPyBwcmVmaXggKyAnICcgOiAnJykgKyBuZXdMYXN0V29yZCk7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbmZ1bmN0aW9uIHRvb2xzKCkge1xuXG4gIHZhciAkbGlzdExpbmtzID0gJCgnLnRlc3QtZGF0YS1saW5rcycpLFxuICAgICAgJGNsZWFyRGF0YSA9ICQoJzxsaT48YSBocmVmPVwiI1wiIGNsYXNzPVxcJ21vY2stZGF0YS1mYW1pbHlcXCc+JyArICdDbGVhciBhbGwgZGF0YTwvYT48L2xpPicpLFxuICAgICAgJGNyZWF0ZUZhbWlseUhvdXNlaG9sZCA9ICQoJzxsaT48YSBocmVmPVwiI1wiIGNsYXNzPVxcJ21vY2stZGF0YS1mYW1pbHlcXCc+JyArICdDcmVhdGUgZmFtaWx5IGhvdXNlaG9sZDwvYT48L2xpPicpLFxuICAgICAgJGNyZWF0ZUZhbWlseVJlbGF0aW9uc2hpcHMgPSAkKCc8bGk+PGEgaHJlZj1cIiNcIicgKyAnIGNsYXNzPVxcJ21vY2stZGF0YS1mYW1pbHlcXCc+JyArICdDcmVhdGUgZmFtaWx5IHdpdGggcmVsYXRpb25zaGlwczwvYT48L2xpPicpLFxuICAgICAgJGNyZWF0ZUZhbWlseVdpdGhSZWxhdGlvbnNoaXBzQW5kVmlzaXRvcnMgPSAkKCc8bGk+PGEgaHJlZj1cIiNcIicgKyAnIGNsYXNzPVxcJ21vY2stZGF0YS1mYW1pbHlcXCc+JyArICdDcmVhdGUgZmFtaWx5IHdpdGggcmVsYXRpb25zaGlwcyBhbmQgdmlzaXRvcnM8L2E+PC9saT4nKSxcbiAgICAgICRjcmVhdGVGYW1pbHlXaXRoUmVsYXRpb25zaGlwc1BlcnNvbmFsRGV0YWlsc0FuZFZpc2l0b3JzID0gJCgnPGxpPjxhJyArICcgaHJlZj1cIiNcIicgKyAnIGNsYXNzPVxcJ21vY2stZGF0YS1mYW1pbHlcXCc+JyArICdDcmVhdGUgZmFtaWx5IHdpdGggcmVsYXRpb25zaGlwcywganVzdCBmYW1pbHkgaW5kaXZpZHVhbCByZXNwb25zZXMgYW5kJyArICcgdmlzaXRvcnM8L2E+PC9saT4nKSxcbiAgICAgICRjcmVhdGVGYW1pbHlXaXRoUmVsYXRpb25zaGlwc1BlcnNvbmFsRGV0YWlsc0FuZFZpc2l0b3JzUGVyc29uYWxEZXRhaWxzID0gJCgnPGxpPjxhJyArICcgaHJlZj1cIiNcIicgKyAnIGNsYXNzPVxcJ21vY2stZGF0YS1mYW1pbHlcXCc+JyArICdDcmVhdGUgZmFtaWx5IHdpdGggcmVsYXRpb25zaGlwcywgZmFtaWx5IGluZGl2aWR1YWwgcmVzcG9uc2VzIGFuZCcgKyAnIHZpc2l0b3JzIGluZGl2aWR1YWwgcmVzcG9uc2VzPC9hPjwvbGk+JyksXG4gICAgICBmYW1pbHlIb3VzZWhvbGRNZW1iZXJzRGF0YSA9IFt7XG4gICAgJ3R5cGUnOiAnaG91c2Vob2xkLW1lbWJlcicsXG4gICAgJ0BwZXJzb24nOiB7XG4gICAgICAnZnVsbE5hbWUnOiAnRGF2ZSAgSm9uZXMnLFxuICAgICAgJ2ZpcnN0TmFtZSc6ICdEYXZlJyxcbiAgICAgICdtaWRkbGVOYW1lJzogJycsXG4gICAgICAnbGFzdE5hbWUnOiAnSm9uZXMnLFxuICAgICAgJ2lkJzogJ3BlcnNvbl9tZSdcbiAgICB9XG4gIH0sIHtcbiAgICAndHlwZSc6ICdob3VzZWhvbGQtbWVtYmVyJyxcbiAgICAnQHBlcnNvbic6IHtcbiAgICAgICdmdWxsTmFtZSc6ICdTYWxseSAgSm9uZXMnLFxuICAgICAgJ2ZpcnN0TmFtZSc6ICdTYWxseScsXG4gICAgICAnbWlkZGxlTmFtZSc6ICcnLFxuICAgICAgJ2xhc3ROYW1lJzogJ0pvbmVzJyxcbiAgICAgICdpZCc6ICdwZXJzb24xJ1xuICAgIH1cbiAgfSwge1xuICAgICd0eXBlJzogJ2hvdXNlaG9sZC1tZW1iZXInLFxuICAgICdAcGVyc29uJzoge1xuICAgICAgJ2Z1bGxOYW1lJzogJ1JlYmVjY2EgIEpvbmVzJyxcbiAgICAgICdmaXJzdE5hbWUnOiAnUmViZWNjYScsXG4gICAgICAnbWlkZGxlTmFtZSc6ICcnLFxuICAgICAgJ2xhc3ROYW1lJzogJ0pvbmVzJyxcbiAgICAgICdpZCc6ICdwZXJzb24yJ1xuICAgIH1cbiAgfSwge1xuICAgICd0eXBlJzogJ2hvdXNlaG9sZC1tZW1iZXInLFxuICAgICdAcGVyc29uJzoge1xuICAgICAgJ2Z1bGxOYW1lJzogJ0FteSBKb25lcycsXG4gICAgICAnZmlyc3ROYW1lJzogJ0FteScsXG4gICAgICAnbWlkZGxlTmFtZSc6ICcnLFxuICAgICAgJ2xhc3ROYW1lJzogJ0pvbmVzJyxcbiAgICAgICdpZCc6ICdwZXJzb24zJ1xuICAgIH1cbiAgfV0sXG4gICAgICB2aXNpdG9yc01lbWJlckRhdGEgPSBbe1xuICAgICd0eXBlJzogJ3Zpc2l0b3InLFxuICAgICdAcGVyc29uJzoge1xuICAgICAgJ2Z1bGxOYW1lJzogJ0dhcmV0aCBKb2huc29uJyxcbiAgICAgICdmaXJzdE5hbWUnOiAnR2FyZXRoJyxcbiAgICAgICdtaWRkbGVOYW1lJzogJycsXG4gICAgICAnbGFzdE5hbWUnOiAnSm9obnNvbicsXG4gICAgICAnaWQnOiAncGVyc29uNCdcbiAgICB9XG4gIH0sIHtcbiAgICAndHlwZSc6ICd2aXNpdG9yJyxcbiAgICAnQHBlcnNvbic6IHtcbiAgICAgICdmdWxsTmFtZSc6ICdKb2huIEhhbWlsdG9uJyxcbiAgICAgICdmaXJzdE5hbWUnOiAnSm9obicsXG4gICAgICAnbWlkZGxlTmFtZSc6ICcnLFxuICAgICAgJ2xhc3ROYW1lJzogJ0hhbWlsdG9uJyxcbiAgICAgICdpZCc6ICdwZXJzb241J1xuICAgIH1cbiAgfV0sXG4gICAgICBmYW1pbHlIb3VzZWhvbGRSZWxhdGlvbnNoaXBzRGF0YSA9IFt7XG4gICAgJ3BlcnNvbklzRGVzY3JpcHRpb24nOiAnaHVzYmFuZC13aWZlJyxcbiAgICAncGVyc29uSXNJZCc6ICdwZXJzb24xJyxcbiAgICAncGVyc29uVG9JZCc6ICdwZXJzb25fbWUnLFxuICAgICdpbmZlcnJlZCc6IGZhbHNlLFxuICAgICdpZCc6IDFcbiAgfSwge1xuICAgICdwZXJzb25Jc0Rlc2NyaXB0aW9uJzogJ3Nvbi1kYXVnaHRlcicsXG4gICAgJ3BlcnNvbklzSWQnOiAncGVyc29uMicsXG4gICAgJ3BlcnNvblRvSWQnOiAncGVyc29uX21lJyxcbiAgICAnaW5mZXJyZWQnOiBmYWxzZSxcbiAgICAnaWQnOiAyXG4gIH0sIHtcbiAgICAncGVyc29uSXNEZXNjcmlwdGlvbic6ICdtb3RoZXItZmF0aGVyJyxcbiAgICAncGVyc29uSXNJZCc6ICdwZXJzb25fbWUnLFxuICAgICdwZXJzb25Ub0lkJzogJ3BlcnNvbjMnLFxuICAgICdpbmZlcnJlZCc6IGZhbHNlLFxuICAgICdpZCc6IDNcbiAgfSwge1xuICAgICdwZXJzb25Jc0Rlc2NyaXB0aW9uJzogJ3Nvbi1kYXVnaHRlcicsXG4gICAgJ3BlcnNvbklzSWQnOiAncGVyc29uMicsXG4gICAgJ3BlcnNvblRvSWQnOiAncGVyc29uMScsXG4gICAgJ2luZmVycmVkJzogZmFsc2UsXG4gICAgJ2lkJzogNFxuICB9LCB7XG4gICAgJ3BlcnNvbklzRGVzY3JpcHRpb24nOiAnbW90aGVyLWZhdGhlcicsXG4gICAgJ3BlcnNvbklzSWQnOiAncGVyc29uMScsXG4gICAgJ3BlcnNvblRvSWQnOiAncGVyc29uMycsXG4gICAgJ2luZmVycmVkJzogZmFsc2UsXG4gICAgJ2lkJzogNVxuICB9LCB7XG4gICAgJ3BlcnNvbklzRGVzY3JpcHRpb24nOiAnYnJvdGhlci1zaXN0ZXInLFxuICAgICdwZXJzb25Jc0lkJzogJ3BlcnNvbjMnLFxuICAgICdwZXJzb25Ub0lkJzogJ3BlcnNvbjInLFxuICAgICdpbmZlcnJlZCc6IHRydWUsXG4gICAgJ2luZmVycmVkQnknOiBbMywgNSwgMiwgNF0sXG4gICAgJ2lkJzogNlxuICB9XSxcbiAgICAgIGZhbWlseVBlcnNvbmFsRGV0YWlscyA9IHtcbiAgICAncGVyc29uX21lJzoge1xuICAgICAgJ3NleCc6ICdtYWxlJyxcbiAgICAgICdkb2InOiB7XG4gICAgICAgICdkYXknOiAnMTInLFxuICAgICAgICAnbW9udGgnOiAnNScsXG4gICAgICAgICd5ZWFyJzogJzE5ODYnXG4gICAgICB9LFxuICAgICAgJ2FnZSc6IHtcbiAgICAgICAgJ3ZhbCc6ICczMicsXG4gICAgICAgICdpc0FwcHJveGltYXRlJzogZmFsc2VcbiAgICAgIH1cbiAgICB9LFxuICAgICdwZXJzb24xJzoge1xuICAgICAgJ3NleCc6ICdmZW1hbGUnLFxuICAgICAgJ2RvYic6IHtcbiAgICAgICAgJ2RheSc6ICcwMicsXG4gICAgICAgICdtb250aCc6ICc3JyxcbiAgICAgICAgJ3llYXInOiAnMTk4NCdcbiAgICAgIH0sXG4gICAgICAnYWdlJzoge1xuICAgICAgICAndmFsJzogJzM0JyxcbiAgICAgICAgJ2lzQXBwcm94aW1hdGUnOiBmYWxzZVxuICAgICAgfVxuICAgIH0sXG4gICAgJ3BlcnNvbjInOiB7XG4gICAgICAnc2V4JzogJ2ZlbWFsZScsXG4gICAgICAnZG9iJzoge1xuICAgICAgICAnZGF5JzogJzEwJyxcbiAgICAgICAgJ21vbnRoJzogJzExJyxcbiAgICAgICAgJ3llYXInOiAnMjAwOCdcbiAgICAgIH0sXG4gICAgICAnYWdlJzoge1xuICAgICAgICAndmFsJzogJzEwJyxcbiAgICAgICAgJ2lzQXBwcm94aW1hdGUnOiBmYWxzZVxuICAgICAgfVxuICAgIH0sXG4gICAgJ3BlcnNvbjMnOiB7XG4gICAgICAnc2V4JzogJ2ZlbWFsZScsXG4gICAgICAnZG9iJzoge1xuICAgICAgICAnZGF5JzogJzE0JyxcbiAgICAgICAgJ21vbnRoJzogJzMnLFxuICAgICAgICAneWVhcic6ICcyMDA5J1xuICAgICAgfSxcbiAgICAgICdhZ2UnOiB7XG4gICAgICAgICd2YWwnOiAnOScsXG4gICAgICAgICdpc0FwcHJveGltYXRlJzogZmFsc2VcbiAgICAgIH1cbiAgICB9XG4gIH0sXG4gICAgICB2aXNpdG9yc1BlcnNvbmFsRGV0YWlscyA9IHtcbiAgICAncGVyc29uNCc6IHtcbiAgICAgICdzZXgnOiAnbWFsZScsXG4gICAgICAnZG9iJzogeyAnZGF5JzogJzIwJywgJ21vbnRoJzogJzcnLCAneWVhcic6ICcxOTkwJyB9LFxuICAgICAgJ2FkZHJlc3Mtd2hlcmUnOiAnaW4tdWsnLFxuICAgICAgJ2FkZHJlc3MnOiB7XG4gICAgICAgICdhZGRyZXNzLWxpbmUtMSc6ICcxNScsXG4gICAgICAgICdhZGRyZXNzLWxpbmUtMic6ICdTb21ld2hlcmUgbmVhcicsXG4gICAgICAgICd0b3duLWNpdHknOiAnTGxhbmRyaWRub2QnLFxuICAgICAgICAnY291bnR5JzogJ1Bvd3lzJyxcbiAgICAgICAgJ3Bvc3Rjb2RlJzogJ0xMMzQgQU41J1xuICAgICAgfVxuICAgIH0sXG4gICAgJ3BlcnNvbjUnOiB7XG4gICAgICAnc2V4JzogJ21hbGUnLFxuICAgICAgJ2RvYic6IHsgJ2RheSc6ICcwMicsICdtb250aCc6ICc1JywgJ3llYXInOiAnMTk5MScgfSxcbiAgICAgICdhZGRyZXNzLXdoZXJlJzogJ291dC11aycsXG4gICAgICAnYWRkcmVzcyc6IHtcbiAgICAgICAgJ2FkZHJlc3MtbGluZS0xJzogJzk0JyxcbiAgICAgICAgJ2FkZHJlc3MtbGluZS0yJzogJ1NvbWV3aGVyZSBGYXInLFxuICAgICAgICAndG93bi1jaXR5JzogJ1NwcmluZ2ZpZWxkJyxcbiAgICAgICAgJ2NvdW50eSc6ICdOZXcgWW9yaycsXG4gICAgICAgICdwb3N0Y29kZSc6ICdOWTEwQSdcbiAgICAgIH1cbiAgICB9XG4gIH0sXG4gICAgICB1c2VyRGF0YSA9IHtcbiAgICAnZnVsbE5hbWUnOiAnRGF2ZSAgSm9uZXMnLFxuICAgICdmaXJzdE5hbWUnOiAnRGF2ZScsXG4gICAgJ21pZGRsZU5hbWUnOiAnJyxcbiAgICAnbGFzdE5hbWUnOiAnSm9uZXMnXG4gIH07XG5cbiAgJGNyZWF0ZUZhbWlseUhvdXNlaG9sZC5vbignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBjbGVhclN0b3JhZ2UoKTtcbiAgICBwcmVyZXF1aXNpdGVzKCk7XG4gICAgY3JlYXRlRmFtaWx5SG91c2Vob2xkKCk7XG4gICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSAnLi4vc3VtbWFyeSc7XG4gIH0pO1xuXG4gICRjcmVhdGVGYW1pbHlSZWxhdGlvbnNoaXBzLm9uKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGNsZWFyU3RvcmFnZSgpO1xuICAgIHByZXJlcXVpc2l0ZXMoKTtcbiAgICBjcmVhdGVGYW1pbHlIb3VzZWhvbGQoKTtcbiAgICBjcmVhdGVGYW1pbHlSZWxhdGlvbnNoaXBzKCk7XG4gICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSAnLi4vaHViJztcbiAgfSk7XG5cbiAgJGNyZWF0ZUZhbWlseVdpdGhSZWxhdGlvbnNoaXBzQW5kVmlzaXRvcnMub24oJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgY2xlYXJTdG9yYWdlKCk7XG4gICAgcHJlcmVxdWlzaXRlcygpO1xuICAgIGNyZWF0ZUZhbWlseUhvdXNlaG9sZFdpdGhWaXNpdG9ycygpO1xuICAgIGNyZWF0ZUZhbWlseVJlbGF0aW9uc2hpcHMoKTtcbiAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9ICcuLi9odWInO1xuICB9KTtcblxuICAkY3JlYXRlRmFtaWx5V2l0aFJlbGF0aW9uc2hpcHNQZXJzb25hbERldGFpbHNBbmRWaXNpdG9ycy5vbignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBjbGVhclN0b3JhZ2UoKTtcbiAgICBwcmVyZXF1aXNpdGVzKCk7XG4gICAgY3JlYXRlRmFtaWx5SG91c2Vob2xkV2l0aFZpc2l0b3JzKCk7XG4gICAgY3JlYXRlRmFtaWx5UmVsYXRpb25zaGlwcygpO1xuICAgIGNyZWF0ZUZhbWlseVBlcnNvbmFsRGV0YWlscygpO1xuICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gJy4uL2h1Yic7XG4gIH0pO1xuXG4gICRjcmVhdGVGYW1pbHlXaXRoUmVsYXRpb25zaGlwc1BlcnNvbmFsRGV0YWlsc0FuZFZpc2l0b3JzUGVyc29uYWxEZXRhaWxzLm9uKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGNsZWFyU3RvcmFnZSgpO1xuICAgIHByZXJlcXVpc2l0ZXMoKTtcbiAgICBjcmVhdGVGYW1pbHlIb3VzZWhvbGRXaXRoVmlzaXRvcnMoKTtcbiAgICBjcmVhdGVGYW1pbHlSZWxhdGlvbnNoaXBzKCk7XG4gICAgY3JlYXRlRmFtaWx5VmlzaXRvcnNQZXJzb25hbERldGFpbHMoKTtcbiAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9ICcuLi9odWInO1xuICB9KTtcblxuICAkY2xlYXJEYXRhLm9uKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGNsZWFyU3RvcmFnZSgpO1xuICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gJy4uL3Rlc3QtYWRkcmVzcyc7XG4gIH0pO1xuXG4gIGZ1bmN0aW9uIHByZXJlcXVpc2l0ZXMoKSB7XG4gICAgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbSgnYWRkcmVzcycsICcxMiBTb21ld2hlcmUgQ2xvc2UsIE5ld3BvcnQsIENGMTIgM0FCJyk7XG4gICAgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbSgnYWRkcmVzcy1saW5lLTEnLCAnMTInKTtcbiAgICBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKCdhZGRyZXNzLWxpbmUtMicsICdTb21ld2hlcmUgY2xvc2UnKTtcbiAgICBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKCdjb3VudHknLCAnTmV3cG9ydCcpO1xuICAgIHNlc3Npb25TdG9yYWdlLnNldEl0ZW0oJ2xpdmVzLWhlcmUnLCAneWVzJyk7XG4gICAgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbSgncG9zdGNvZGUnLCAnQ0YxMiAzQUInKTtcbiAgICBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKCd0b3duLWNpdHknLCAnTmV3cG9ydCcpO1xuICB9XG5cbiAgZnVuY3Rpb24gY3JlYXRlRmFtaWx5SG91c2Vob2xkKCkge1xuICAgIHNlc3Npb25TdG9yYWdlLnNldEl0ZW0oJ3VzZXItZGV0YWlscycsIEpTT04uc3RyaW5naWZ5KHVzZXJEYXRhKSk7XG4gICAgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbSh3aW5kb3cuT05TLnN0b3JhZ2UuS0VZUy5IT1VTRUhPTERfTUVNQkVSU19TVE9SQUdFX0tFWSwgSlNPTi5zdHJpbmdpZnkoZmFtaWx5SG91c2Vob2xkTWVtYmVyc0RhdGEpKTtcbiAgICBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKCdob3VzZWhvbGQtbWVtYmVycy1pbmNyZW1lbnQnLCBKU09OLnN0cmluZ2lmeSg0KSk7XG4gIH1cblxuICBmdW5jdGlvbiBjcmVhdGVGYW1pbHlIb3VzZWhvbGRXaXRoVmlzaXRvcnMoKSB7XG4gICAgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbSh3aW5kb3cuT05TLnN0b3JhZ2UuS0VZUy5IT1VTRUhPTERfTUVNQkVSU19TVE9SQUdFX0tFWSwgSlNPTi5zdHJpbmdpZnkoW10uY29uY2F0KGZhbWlseUhvdXNlaG9sZE1lbWJlcnNEYXRhLCB2aXNpdG9yc01lbWJlckRhdGEpKSk7XG4gIH1cblxuICBmdW5jdGlvbiBjcmVhdGVGYW1pbHlSZWxhdGlvbnNoaXBzKCkge1xuICAgIHNlc3Npb25TdG9yYWdlLnNldEl0ZW0od2luZG93Lk9OUy5zdG9yYWdlLktFWVMuUkVMQVRJT05TSElQU19TVE9SQUdFX0tFWSwgSlNPTi5zdHJpbmdpZnkoZmFtaWx5SG91c2Vob2xkUmVsYXRpb25zaGlwc0RhdGEpKTtcbiAgICBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKCdyZWxhdGlvbnNoaXBzLWluY3JlbWVudCcsIEpTT04uc3RyaW5naWZ5KDYpKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNyZWF0ZUZhbWlseVBlcnNvbmFsRGV0YWlscygpIHtcbiAgICBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKHdpbmRvdy5PTlMuc3RvcmFnZS5LRVlTLlBFUlNPTkFMX0RFVEFJTFNfS0VZLCBKU09OLnN0cmluZ2lmeShmYW1pbHlQZXJzb25hbERldGFpbHMpKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNyZWF0ZUZhbWlseVZpc2l0b3JzUGVyc29uYWxEZXRhaWxzKCkge1xuICAgIHNlc3Npb25TdG9yYWdlLnNldEl0ZW0od2luZG93Lk9OUy5zdG9yYWdlLktFWVMuUEVSU09OQUxfREVUQUlMU19LRVksIEpTT04uc3RyaW5naWZ5KF9leHRlbmRzKHt9LCBmYW1pbHlQZXJzb25hbERldGFpbHMsIHZpc2l0b3JzUGVyc29uYWxEZXRhaWxzKSkpO1xuICB9XG5cbiAgZnVuY3Rpb24gY2xlYXJTdG9yYWdlKCkge1xuICAgIHNlc3Npb25TdG9yYWdlLmNsZWFyKCk7XG4gIH1cblxuICAkbGlzdExpbmtzLmFwcGVuZCgkY3JlYXRlRmFtaWx5SG91c2Vob2xkKTtcbiAgJGxpc3RMaW5rcy5hcHBlbmQoJGNyZWF0ZUZhbWlseVJlbGF0aW9uc2hpcHMpO1xuICAkbGlzdExpbmtzLmFwcGVuZCgkY3JlYXRlRmFtaWx5V2l0aFJlbGF0aW9uc2hpcHNBbmRWaXNpdG9ycyk7XG4gICRsaXN0TGlua3MuYXBwZW5kKCRjcmVhdGVGYW1pbHlXaXRoUmVsYXRpb25zaGlwc1BlcnNvbmFsRGV0YWlsc0FuZFZpc2l0b3JzKTtcbiAgJGxpc3RMaW5rcy5hcHBlbmQoJGNyZWF0ZUZhbWlseVdpdGhSZWxhdGlvbnNoaXBzUGVyc29uYWxEZXRhaWxzQW5kVmlzaXRvcnNQZXJzb25hbERldGFpbHMpO1xuICAkbGlzdExpbmtzLmFwcGVuZCgkY2xlYXJEYXRhKTtcbn1cblxudmFyIFVTRVJfU1RPUkFHRV9LRVkgPSAndXNlci1kZXRhaWxzJztcbnZhciBJTkRJVklEVUFMX1BST1hZX1NUT1JBR0VfS0VZID0gJ3Byb3h5LXBlcnNvbic7XG5cbmZ1bmN0aW9uIGdldEFkZHJlc3MoKSB7XG4gIHZhciBhZGRyZXNzTGluZXMgPSBzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKCdhZGRyZXNzJykuc3BsaXQoJywnKTtcblxuICByZXR1cm4ge1xuICAgIGFkZHJlc3NMaW5lMTogYWRkcmVzc0xpbmVzWzBdLFxuICAgIGFkZHJlc3NMaW5lMjogYWRkcmVzc0xpbmVzWzFdLFxuICAgIGFkZHJlc3NMaW5lMzogYWRkcmVzc0xpbmVzWzJdLFxuICAgIGFkZHJlc3NDb3VudHk6IGFkZHJlc3NMaW5lc1s0XSxcbiAgICBhZGRyZXNzVG93bkNpdHk6IGFkZHJlc3NMaW5lc1szXSxcbiAgICBhZGRyZXNzUG9zdGNvZGU6IGFkZHJlc3NMaW5lc1s1XVxuICB9O1xufVxuXG4vKipcbiAqIFVzZXJcbiAqL1xuZnVuY3Rpb24gYWRkVXNlclBlcnNvbihwZXJzb24kJDEpIHtcbiAgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbShVU0VSX1NUT1JBR0VfS0VZLCBKU09OLnN0cmluZ2lmeShwZXJzb24kJDEpKTtcbn1cblxuZnVuY3Rpb24gZ2V0VXNlclBlcnNvbigpIHtcbiAgcmV0dXJuIEpTT04ucGFyc2Uoc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbShVU0VSX1NUT1JBR0VfS0VZKSk7XG59XG5cbi8qKlxuICogSGVscGVyc1xuICovXG5mdW5jdGlvbiBjcmVhdGVOYXZJdGVtKG1lbWJlcikge1xuICB2YXIgJG5vZGVFbCA9ICQoJzxsaSBjbGFzcz1cImpzLXRlbXBsYXRlLW5hdi1pdGVtIG5hdl9faXRlbSBwbHV0b1wiPicgKyAnICA8YSBjbGFzcz1cImpzLXRlbXBsYXRlLW5hdi1pdGVtLWxhYmVsIG5hdl9fbGlua1wiIGhyZWY9XCIjXCI+PC9hPicgKyAnPC9saT4nKSxcbiAgICAgICRsaW5rRWwgPSAkbm9kZUVsLmZpbmQoJy5qcy10ZW1wbGF0ZS1uYXYtaXRlbS1sYWJlbCcpO1xuXG4gICRsaW5rRWwuaHRtbChtZW1iZXJbJ0BwZXJzb24nXS5mdWxsTmFtZSk7XG5cbiAgaWYgKG1lbWJlclsnQHBlcnNvbiddLmlkID09PSBVU0VSX0hPVVNFSE9MRF9NRU1CRVJfSUQpIHtcbiAgICAkbGlua0VsLmF0dHIoJ2hyZWYnLCAnLi4vd2hhdC1pcy15b3VyLW5hbWUnKTtcbiAgfSBlbHNlIHtcbiAgICAkbGlua0VsLmF0dHIoJ2hyZWYnLCAnLi4vd2hvLWVsc2UtdG8tYWRkP2VkaXQ9JyArIG1lbWJlclsnQHBlcnNvbiddLmlkKTtcbiAgfVxuXG4gIHJldHVybiAkbm9kZUVsO1xufVxuXG5mdW5jdGlvbiB1cGRhdGVIb3VzZWhvbGRWaXNpdG9yc05hdmlnYXRpb25JdGVtcygpIHtcbiAgdmFyIGFsbEhvdXNlaG9sZE1lbWJlcnMgPSB3aW5kb3cuT05TLnN0b3JhZ2UuZ2V0QWxsSG91c2Vob2xkTWVtYmVycygpLFxuICAgICAgaG91c2Vob2xkTWVtYmVycyA9IGFsbEhvdXNlaG9sZE1lbWJlcnMuZmlsdGVyKHdpbmRvdy5PTlMuc3RvcmFnZS5pc0hvdXNlaG9sZE1lbWJlciksXG4gICAgICB2aXNpdG9ycyA9IGFsbEhvdXNlaG9sZE1lbWJlcnMuZmlsdGVyKHdpbmRvdy5PTlMuc3RvcmFnZS5pc1Zpc2l0b3IpO1xuXG4gIHZhciAkbmF2aWdhdGlvbkhvdXNlaG9sZE1lbWJlcnNFbCA9ICQoJyNuYXZpZ2F0aW9uLWhvdXNlaG9sZC1tZW1iZXJzJyksXG4gICAgICAkbmF2aWdhdGlvblZpc2l0b3JzRWwgPSAkKCcjbmF2aWdhdGlvbi12aXNpdG9ycycpO1xuXG4gIGlmIChob3VzZWhvbGRNZW1iZXJzLmxlbmd0aCkge1xuICAgICQuZWFjaChob3VzZWhvbGRNZW1iZXJzLCBmdW5jdGlvbiAoaSwgbWVtYmVyKSB7XG4gICAgICAkbmF2aWdhdGlvbkhvdXNlaG9sZE1lbWJlcnNFbC5hcHBlbmQoY3JlYXRlTmF2SXRlbShtZW1iZXIpKTtcbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICAkbmF2aWdhdGlvbkhvdXNlaG9sZE1lbWJlcnNFbC5wYXJlbnQoKS5oaWRlKCk7XG4gIH1cblxuICBpZiAodmlzaXRvcnMubGVuZ3RoKSB7XG4gICAgJC5lYWNoKHZpc2l0b3JzLCBmdW5jdGlvbiAoaSwgbWVtYmVyKSB7XG4gICAgICAkbmF2aWdhdGlvblZpc2l0b3JzRWwuYXBwZW5kKGNyZWF0ZU5hdkl0ZW0obWVtYmVyKSk7XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgJG5hdmlnYXRpb25WaXNpdG9yc0VsLnBhcmVudCgpLmhpZGUoKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBjcmVhdGVMaXN0SXRlbVBlcnNvbihtZW1iZXIpIHtcbiAgcmV0dXJuICQoJzxsaSBjbGFzcz1cImxpc3RfX2l0ZW1cIj4nKS5hZGRDbGFzcygnbWFycycpLmh0bWwoJzxzcGFuIGNsYXNzPVwibGlzdF9faXRlbS1uYW1lXCI+JyArIG1lbWJlclsnQHBlcnNvbiddLmZ1bGxOYW1lICsgKG1lbWJlclsnQHBlcnNvbiddLmlkID09PSBVU0VSX0hPVVNFSE9MRF9NRU1CRVJfSUQgPyAnIChZb3UpJyA6ICcnKSArICc8L3NwYW4+Jyk7XG59XG5cbmZ1bmN0aW9uIHBvcHVsYXRlTGlzdCgkZWwsIG1lbWJlclR5cGUpIHtcbiAgaWYgKCEkZWwubGVuZ3RoKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgdmFyIG1lbWJlcnMgPSBnZXRBbGxIb3VzZWhvbGRNZW1iZXJzKCkgfHwgW107XG5cbiAgJGVsLmVtcHR5KCkuYXBwZW5kKG1lbWJlcnMuZmlsdGVyKGZ1bmN0aW9uIChtZW1iZXIpIHtcbiAgICByZXR1cm4gbWVtYmVyLnR5cGUgPT09IG1lbWJlclR5cGU7XG4gIH0pLm1hcChjcmVhdGVMaXN0SXRlbVBlcnNvbikpO1xuXG4gICRlbC5hZGRDbGFzcygnbGlzdCBsaXN0LS1wZW9wbGUtcGxhaW4nKTtcbn1cblxuZnVuY3Rpb24gcG9wdWxhdGVIb3VzZWhvbGRMaXN0KCkge1xuICBwb3B1bGF0ZUxpc3QoJCgnI2hvdXNlaG9sZC1tZW1iZXJzJyksIEhPVVNFSE9MRF9NRU1CRVJfVFlQRSk7XG59XG5cbmZ1bmN0aW9uIHBvcHVsYXRlVmlzaXRvckxpc3QoKSB7XG4gIHBvcHVsYXRlTGlzdCgkKCcjdmlzaXRvcnMtbGlzdCcpLCBWSVNJVE9SX1RZUEUpO1xufVxuXG5mdW5jdGlvbiB1cGRhdGVBZGRyZXNzZXMoKSB7XG4gIHZhciBhZGRyZXNzTGluZXMgPSAoc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbSgnYWRkcmVzcycpIHx8ICcnKS5zcGxpdCgnLCcpLFxuICAgICAgYWRkcmVzc0xpbmUxID0gYWRkcmVzc0xpbmVzWzBdLFxuICAgICAgYWRkcmVzc0xpbmUyID0gYWRkcmVzc0xpbmVzWzFdO1xuXG4gICQoJyNzZWN0aW9uLWFkZHJlc3MnKS5odG1sKGFkZHJlc3NMaW5lMSB8fCAnPGEnICsgJyBocmVmPVwiLi4vdGVzdC1hZGRyZXNzXCI+QWRkcmVzcyBub3QnICsgJyBmb3VuZDwvYT4nKTtcbiAgJCgnLmFkZHJlc3MtdGV4dCcpLmh0bWwoYWRkcmVzc0xpbmUxICYmIGFkZHJlc3NMaW5lMiA/IGFkZHJlc3NMaW5lMSArIChhZGRyZXNzTGluZTIgPyAnLCAnICsgYWRkcmVzc0xpbmUyIDogJycpIDogJzxhIGhyZWY9XCIuLi90ZXN0LWFkZHJlc3NcIj5BZGRyZXNzIG5vdCBmb3VuZDwvYT4nKTtcblxuICAkKCcuYWRkcmVzcy10ZXh0LWxpbmUxJykuaHRtbChhZGRyZXNzTGluZTEpO1xuXG4gIHZhciBwZXJzb25JZCA9IG5ldyBVUkxTZWFyY2hQYXJhbXMod2luZG93LmxvY2F0aW9uLnNlYXJjaCkuZ2V0KCdwZXJzb24nKSxcbiAgICAgIHBlcnNvbiQkMSA9IHZvaWQgMDtcblxuICBpZiAocGVyc29uSWQpIHtcbiAgICBwZXJzb24kJDEgPSBnZXRIb3VzZWhvbGRNZW1iZXJCeVBlcnNvbklkKHBlcnNvbklkKVsnQHBlcnNvbiddO1xuICAgICQoJyNzZWN0aW9uLWluZGl2aWR1YWwnKS5odG1sKHBlcnNvbiQkMS5mdWxsTmFtZSk7XG5cbiAgICAkKCcuanMtcGVyc29uLWZ1bGxuYW1lLWZyb20tdXJsLWlkJykuaHRtbChwZXJzb24kJDEuZnVsbE5hbWUpO1xuICB9XG59XG5cbnZhciBzZWN1cmVMaW5rVGV4dE1hcCA9IHtcbiAgJ3F1ZXN0aW9uLXlvdSc6IHtcbiAgICBkZXNjcmlwdGlvbjogJ1dhbnQgdG8ga2VlcCB5b3VyIGFuc3dlcnMgc2VjdXJlIGZyb20gb3RoZXIgcGVvcGxlIGF0IHRoaXMnICsgJyBhZGRyZXNzPycsXG4gICAgbGlua1RleHQ6ICdHZXQgYSBzZXBhcmF0ZSBhY2Nlc3MgY29kZSB0byBzdWJtaXQgYW4gaW5kaXZpZHVhbCByZXNwb25zZScsXG4gICAgbGluazogJy4uL2luZGl2aWR1YWwtZGVjaXNpb24tc2VjdXJlJ1xuICB9LFxuICAncGluLXlvdSc6IHtcbiAgICBkZXNjcmlwdGlvbjogJ1lvdVxcJ3ZlIGNob3NlbiB0byBrZWVwIHlvdXIgYW5zd2VycyBzZWN1cmUnLFxuICAgIGxpbmtUZXh0OiAnQ2FuY2VsIHRoaXMgYW5kIG1ha2UgYW5zd2VycyBhdmFpbGFibGUgdG8gdGhlIHJlc3Qgb2YgdGhlJyArICcgaG91c2Vob2xkJyxcbiAgICBsaW5rOiAnLi4vaW5kaXZpZHVhbC1kZWNpc2lvbi1zZWN1cmUnXG4gIH0sXG4gICdxdWVzdGlvbi1wcm94eSc6IHtcbiAgICBkZXNjcmlwdGlvbjogJ05vdCBoYXBweSB0byBjb250aW51ZSBhbnN3ZXJpbmcgZm9yICRbTkFNRV0/JyxcbiAgICBsaW5rVGV4dDogJ1JlcXVlc3QgYW4gaW5kaXZpZHVhbCBhY2Nlc3MgY29kZSB0byBiZSBzZW50IHRvIHRoZW0nLFxuICAgIGxpbms6ICcuLi9pbmRpdmlkdWFsLWRlY2lzaW9uLW90aGVyLXNlY3VyZSdcbiAgfVxufTtcblxuZnVuY3Rpb24gdXBkYXRlQWxsUHJldmlvdXNMaW5rcygpIHtcbiAgJCgnLmpzLXByZXZpb3VzLWxpbmsnKS5hdHRyKCdocmVmJywgZG9jdW1lbnQucmVmZXJyZXIpO1xufVxuXG5mdW5jdGlvbiB1cGRhdGVQZXJzb25MaW5rKCkge1xuICB2YXIgcGVyc29uSWQgPSBuZXcgVVJMU2VhcmNoUGFyYW1zKHdpbmRvdy5sb2NhdGlvbi5zZWFyY2gpLmdldCgncGVyc29uJyk7XG5cbiAgaWYgKHBlcnNvbklkKSB7XG4gICAgdmFyIHVybFBhcmFtID0gbmV3IFVSTFNlYXJjaFBhcmFtcyh3aW5kb3cubG9jYXRpb24uc2VhcmNoKSxcbiAgICAgICAgX3BlcnNvbiA9IGdldEhvdXNlaG9sZE1lbWJlckJ5UGVyc29uSWQocGVyc29uSWQpWydAcGVyc29uJ10sXG4gICAgICAgIHBpbk9iaiA9IGdldFBpbkZvcihwZXJzb25JZCksXG4gICAgICAgIHNlY3VyZUxpbmtUZXh0Q29uZmlnID0gc2VjdXJlTGlua1RleHRNYXBbZ2V0QW5zd2VyaW5nSW5kaXZpZHVhbEJ5UHJveHkoKSA/ICdxdWVzdGlvbi1wcm94eScgOiBwaW5PYmogJiYgcGluT2JqLnBpbiA/ICdwaW4teW91JyA6ICdxdWVzdGlvbi15b3UnXSxcbiAgICAgICAgbGlua0hyZWYgPSBzZWN1cmVMaW5rVGV4dENvbmZpZy5saW5rICsgJz9wZXJzb249JyArIHBlcnNvbklkICsgJyZyZXR1cm51cmw9JyArIHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZSxcbiAgICAgICAgc3VydmV5VHlwZSA9IHVybFBhcmFtLmdldCgnc3VydmV5Jyk7XG5cbiAgICBsaW5rSHJlZiArPSBzdXJ2ZXlUeXBlID8gJyZzdXJ2ZXk9JyArIHN1cnZleVR5cGUgOiAnJztcblxuICAgIHZhciAkc2VjdXJlTGluayA9ICQoJy5qcy1saW5rLXNlY3VyZScpO1xuICAgICRzZWN1cmVMaW5rLmF0dHIoJ2hyZWYnLCBsaW5rSHJlZik7XG5cbiAgICAkc2VjdXJlTGluay5odG1sKHNlY3VyZUxpbmtUZXh0Q29uZmlnLmxpbmtUZXh0KTtcbiAgICAkKCcuanMtbGluay1zZWN1cmUtbGFiZWwnKS5odG1sKHNlY3VyZUxpbmtUZXh0Q29uZmlnLmRlc2NyaXB0aW9uLnJlcGxhY2UoJyRbTkFNRV0nLCBfcGVyc29uLmZ1bGxOYW1lKSk7XG5cbiAgICB2YXIgcGVyc29uTGluayA9ICQoJy5qcy1saW5rLXBlcnNvbicpO1xuICAgIHBlcnNvbkxpbmsuYXR0cignaHJlZicsIHBlcnNvbkxpbmsuYXR0cignaHJlZicpICsgJz9wZXJzb249JyArIHBlcnNvbklkICsgKHN1cnZleVR5cGUgPyAnJnN1cnZleT0nICsgc3VydmV5VHlwZSA6ICcnKSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gdXBkYXRlQnlTdXJ2ZXlUeXBlKCkge1xuICB2YXIgdXJsUGFyYW1zID0gbmV3IFVSTFNlYXJjaFBhcmFtcyh3aW5kb3cubG9jYXRpb24uc2VhcmNoKSxcbiAgICAgIHN1cnZleVR5cGUgPSB1cmxQYXJhbXMuZ2V0KCdzdXJ2ZXknKTtcblxuICBpZiAoc3VydmV5VHlwZSkge1xuICAgICQoJy5qcy1oZWFkZXItdGl0bGUnKS5odG1sKHN1cnZleVR5cGVDb25maWdbc3VydmV5VHlwZV0udGl0bGUpO1xuICAgICQoJyNwZW9wbGUtbGl2aW5nLWhlcmUnKS5odG1sKHN1cnZleVR5cGVDb25maWdbc3VydmV5VHlwZV0uaG91c2Vob2xkU2VjdGlvblRpdGxlKTtcbiAgICAkKCcjcGVvcGxlLWxpdmluZy1oZXJlJykuYXR0cignaHJlZicsIHN1cnZleVR5cGVDb25maWdbc3VydmV5VHlwZV0uaG91c2Vob2xkU2VjdGlvbkxpbmspO1xuICAgICQoJyNyZWxhdGlvbnNoaXBzLXNlY3Rpb24nKS5hdHRyKCdocmVmJywgc3VydmV5VHlwZUNvbmZpZ1tzdXJ2ZXlUeXBlXS5yZWxhdGlvbnNoaXBzU2VjdGlvbik7XG4gICAgJCgndGl0bGUnKS5odG1sKHN1cnZleVR5cGVDb25maWdbc3VydmV5VHlwZV0udGl0bGUpO1xuICB9XG59XG5cbmZ1bmN0aW9uIHNldEFuc3dlcmluZ0luZGl2aWR1YWxCeVByb3h5KGJvb2wpIHtcbiAgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbShJTkRJVklEVUFMX1BST1hZX1NUT1JBR0VfS0VZLCBKU09OLnN0cmluZ2lmeShib29sKSk7XG59XG5cbmZ1bmN0aW9uIGdldEFuc3dlcmluZ0luZGl2aWR1YWxCeVByb3h5KCkge1xuICByZXR1cm4gSlNPTi5wYXJzZShzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKElORElWSURVQUxfUFJPWFlfU1RPUkFHRV9LRVkpKTtcbn1cblxudmFyIHN1cnZleVR5cGVDb25maWcgPSB7XG4gIGxtczoge1xuICAgIHRpdGxlOiAnT25saW5lIEhvdXNlaG9sZCBTdHVkeScsXG4gICAgaG91c2Vob2xkU2VjdGlvblRpdGxlOiAnQWJvdXQgeW91ciBob3VzZWhvbGQnLFxuICAgIGhvdXNlaG9sZFNlY3Rpb25MaW5rOiAnLi4vc3VtbWFyeS8/c3VydmV5PWxtcycsXG4gICAgcmVsYXRpb25zaGlwc1NlY3Rpb246ICcuLi9yZWxhdGlvbnNoaXBzLz9zdXJ2ZXk9bG1zJ1xuICB9XG59O1xuXG5mdW5jdGlvbiBkb0lMaXZlSGVyZSgpIHtcbiAgcmV0dXJuIHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oJ2xpdmVzLWhlcmUnKSA9PT0gJ3llcyc7XG59XG5cbmZ1bmN0aW9uIGdldFNpZ25pZmljYW50KCkge1xuICByZXR1cm4gJ1N1bmRheSAxMyBPY3RvYmVyIDIwMTknO1xufVxuXG5mdW5jdGlvbiB1cGRhdGVTaWduaWZpY2FudERhdGUoKSB7XG4gICQoJy5qcy1zaWduaWZpY2FudC1kYXRlJykuaHRtbChnZXRTaWduaWZpY2FudCgpKTtcbn1cblxud2luZG93Lk9OUyA9IHdpbmRvdy5PTlMgfHwge307XG53aW5kb3cuT05TLnN0b3JhZ2UgPSB7XG4gIGdldEFkZHJlc3M6IGdldEFkZHJlc3MsXG4gIGFkZEhvdXNlaG9sZE1lbWJlcjogYWRkSG91c2Vob2xkTWVtYmVyLFxuICB1cGRhdGVIb3VzZWhvbGRNZW1iZXI6IHVwZGF0ZUhvdXNlaG9sZE1lbWJlcixcbiAgZGVsZXRlSG91c2Vob2xkTWVtYmVyOiBkZWxldGVIb3VzZWhvbGRNZW1iZXIsXG4gIGdldEFsbEhvdXNlaG9sZE1lbWJlcnM6IGdldEFsbEhvdXNlaG9sZE1lbWJlcnMsXG4gIGFkZFVzZXJQZXJzb246IGFkZFVzZXJQZXJzb24sXG4gIGdldFVzZXJQZXJzb246IGdldFVzZXJQZXJzb24sXG4gIGdldFVzZXJBc0hvdXNlaG9sZE1lbWJlcjogZ2V0VXNlckFzSG91c2Vob2xkTWVtYmVyLFxuICBnZXRIb3VzZWhvbGRNZW1iZXJCeVBlcnNvbklkOiBnZXRIb3VzZWhvbGRNZW1iZXJCeVBlcnNvbklkLFxuICBnZXRNZW1iZXJQZXJzb25JZDogZ2V0TWVtYmVyUGVyc29uSWQsXG4gIHVwZGF0ZVVzZXJBc0hvdXNlaG9sZE1lbWJlcjogdXBkYXRlVXNlckFzSG91c2Vob2xkTWVtYmVyLFxuICBkZWxldGVVc2VyQXNIb3VzZWhvbGRNZW1iZXI6IGRlbGV0ZVVzZXJBc0hvdXNlaG9sZE1lbWJlcixcbiAgdGVtcEF3YXlRdWVzdGlvblNlbnRlbmNlTWFwOiB0ZW1wQXdheVF1ZXN0aW9uU2VudGVuY2VNYXAsXG5cbiAgaXNWaXNpdG9yOiBpc1Zpc2l0b3IsXG4gIGlzT3RoZXJIb3VzZWhvbGRNZW1iZXI6IGlzT3RoZXJIb3VzZWhvbGRNZW1iZXIsXG4gIGlzSG91c2Vob2xkTWVtYmVyOiBpc0hvdXNlaG9sZE1lbWJlcixcblxuICBhZGRSZWxhdGlvbnNoaXA6IGFkZFJlbGF0aW9uc2hpcCxcbiAgZGVsZXRlUmVsYXRpb25zaGlwOiBkZWxldGVSZWxhdGlvbnNoaXAsXG4gIGVkaXRSZWxhdGlvbnNoaXA6IGVkaXRSZWxhdGlvbnNoaXAsXG4gIGdldEFsbFJlbGF0aW9uc2hpcHM6IGdldEFsbFJlbGF0aW9uc2hpcHMsXG4gIGdldEFsbE1hbnVhbFJlbGF0aW9uc2hpcHM6IGdldEFsbE1hbnVhbFJlbGF0aW9uc2hpcHMsXG4gIGRlbGV0ZUFsbFJlbGF0aW9uc2hpcHNGb3JNZW1iZXI6IGRlbGV0ZUFsbFJlbGF0aW9uc2hpcHNGb3JNZW1iZXIsXG5cbiAgZ2V0QWxsUGFyZW50c09mOiBnZXRBbGxQYXJlbnRzT2YsXG4gIGdldEFsbENoaWxkcmVuT2Y6IGdldEFsbENoaWxkcmVuT2YsXG4gIGdldFBhcmVudElkRnJvbVJlbGF0aW9uc2hpcDogZ2V0UGFyZW50SWRGcm9tUmVsYXRpb25zaGlwLFxuICBnZXRDaGlsZElkRnJvbVJlbGF0aW9uc2hpcDogZ2V0Q2hpbGRJZEZyb21SZWxhdGlvbnNoaXAsXG4gIGdldE90aGVyUGVyc29uSWRGcm9tUmVsYXRpb25zaGlwOiBnZXRPdGhlclBlcnNvbklkRnJvbVJlbGF0aW9uc2hpcCxcbiAgaXNBUGFyZW50SW5SZWxhdGlvbnNoaXA6IGlzQVBhcmVudEluUmVsYXRpb25zaGlwLFxuICBpc0FDaGlsZEluUmVsYXRpb25zaGlwOiBpc0FDaGlsZEluUmVsYXRpb25zaGlwLFxuICBpc0luUmVsYXRpb25zaGlwOiBpc0luUmVsYXRpb25zaGlwLFxuICBhcmVBbnlDaGlsZHJlbkluUmVsYXRpb25zaGlwTm90UGFyZW50OiBhcmVBbnlDaGlsZHJlbkluUmVsYXRpb25zaGlwTm90UGFyZW50LFxuICBpc1JlbGF0aW9uc2hpcFR5cGU6IGlzUmVsYXRpb25zaGlwVHlwZSxcbiAgaXNSZWxhdGlvbnNoaXBJbmZlcnJlZDogaXNSZWxhdGlvbnNoaXBJbmZlcnJlZCxcbiAgZ2V0UmVsYXRpb25zaGlwT2Y6IGdldFJlbGF0aW9uc2hpcE9mLFxuXG4gIHJlbGF0aW9uc2hpcERlc2NyaXB0aW9uTWFwOiByZWxhdGlvbnNoaXBEZXNjcmlwdGlvbk1hcCxcbiAgcmVsYXRpb25zaGlwU3VtbWFyeVRlbXBsYXRlczogcmVsYXRpb25zaGlwU3VtbWFyeVRlbXBsYXRlcyxcbiAgbWlzc2luZ1JlbGF0aW9uc2hpcEluZmVyZW5jZTogbWlzc2luZ1JlbGF0aW9uc2hpcEluZmVyZW5jZSxcbiAgaW5mZXJSZWxhdGlvbnNoaXBzOiBpbmZlclJlbGF0aW9uc2hpcHMsXG4gIGdldFJlbGF0aW9uc2hpcHNXaXRoUGVyc29uSWRzOiBnZXRSZWxhdGlvbnNoaXBzV2l0aFBlcnNvbklkcyxcbiAgZ2V0UGVvcGxlSWRzTWlzc2luZ1JlbGF0aW9uc2hpcHNXaXRoUGVyc29uOiBnZXRQZW9wbGVJZHNNaXNzaW5nUmVsYXRpb25zaGlwc1dpdGhQZXJzb24sXG4gIGdldFJlbGF0aW9uc2hpcFR5cGU6IGdldFJlbGF0aW9uc2hpcFR5cGUsXG4gIGZpbmROZXh0TWlzc2luZ1JlbGF0aW9uc2hpcDogZmluZE5leHRNaXNzaW5nUmVsYXRpb25zaGlwLFxuXG4gIGFkZFVwZGF0ZVBlcnNvbmFsRGV0YWlsc0RPQjogYWRkVXBkYXRlUGVyc29uYWxEZXRhaWxzRE9CLFxuICBhZGRVcGRhdGVQZXJzb25hbERldGFpbHNET0JVbmtub3duOiBhZGRVcGRhdGVQZXJzb25hbERldGFpbHNET0JVbmtub3duLFxuICBnZXRQZXJzb25hbERldGFpbHNGb3I6IGdldFBlcnNvbmFsRGV0YWlsc0ZvcixcbiAgYWRkVXBkYXRlTWFyaXRhbFN0YXR1czogYWRkVXBkYXRlTWFyaXRhbFN0YXR1cyxcbiAgYWRkVXBkYXRlQ291bnRyeTogYWRkVXBkYXRlQ291bnRyeSxcbiAgYWRkVXBkYXRlT3JpZW50YXRpb246IGFkZFVwZGF0ZU9yaWVudGF0aW9uLFxuICBhZGRVcGRhdGVTYWxhcnk6IGFkZFVwZGF0ZVNhbGFyeSxcbiAgYWRkVXBkYXRlU2V4OiBhZGRVcGRhdGVTZXgsXG4gIGFkZFVwZGF0ZUFkZHJlc3NXaGVyZTogYWRkVXBkYXRlQWRkcmVzc1doZXJlLFxuICBhZGRVcGRhdGVBZGRyZXNzSW5kaXZpZHVhbDogYWRkVXBkYXRlQWRkcmVzc0luZGl2aWR1YWwsXG4gIGFkZFVwZGF0ZUFnZTogYWRkVXBkYXRlQWdlLFxuXG4gIHBlcnNvbmFsRGV0YWlsc01hcml0YWxTdGF0dXNNYXA6IHBlcnNvbmFsRGV0YWlsc01hcml0YWxTdGF0dXNNYXAsXG4gIHBlcnNvbmFsRGV0YWlsc0NvdW50cnlNYXA6IHBlcnNvbmFsRGV0YWlsc0NvdW50cnlNYXAsXG4gIHBlcnNvbmFsRGV0YWlsc09yaWVudGF0aW9uTWFwOiBwZXJzb25hbERldGFpbHNPcmllbnRhdGlvbk1hcCxcbiAgcGVyc29uYWxEZXRhaWxzR2VuZGVyTWFwOiBwZXJzb25hbERldGFpbHNHZW5kZXJNYXAsXG5cbiAgY3JlYXRlUGluRm9yOiBjcmVhdGVQaW5Gb3IsXG4gIGdldFBpbkZvcjogZ2V0UGluRm9yLFxuICB1bnNldFBpbkZvcjogdW5zZXRQaW5Gb3IsXG5cbiAgc2V0QW5zd2VyaW5nSW5kaXZpZHVhbEJ5UHJveHk6IHNldEFuc3dlcmluZ0luZGl2aWR1YWxCeVByb3h5LFxuICBnZXRBbnN3ZXJpbmdJbmRpdmlkdWFsQnlQcm94eTogZ2V0QW5zd2VyaW5nSW5kaXZpZHVhbEJ5UHJveHksXG5cbiAgZG9JTGl2ZUhlcmU6IGRvSUxpdmVIZXJlLFxuXG4gIEtFWVM6IHtcbiAgICBIT1VTRUhPTERfTUVNQkVSU19TVE9SQUdFX0tFWTogSE9VU0VIT0xEX01FTUJFUlNfU1RPUkFHRV9LRVksXG4gICAgVVNFUl9TVE9SQUdFX0tFWTogVVNFUl9TVE9SQUdFX0tFWSxcbiAgICBJTkRJVklEVUFMX1BST1hZX1NUT1JBR0VfS0VZOiBJTkRJVklEVUFMX1BST1hZX1NUT1JBR0VfS0VZLFxuICAgIEhPVVNFSE9MRF9NRU1CRVJfVFlQRTogSE9VU0VIT0xEX01FTUJFUl9UWVBFLFxuICAgIFZJU0lUT1JfVFlQRTogVklTSVRPUl9UWVBFLFxuICAgIFJFTEFUSU9OU0hJUFNfU1RPUkFHRV9LRVk6IFJFTEFUSU9OU0hJUFNfU1RPUkFHRV9LRVksXG4gICAgUEVSU09OQUxfREVUQUlMU19LRVk6IFBFUlNPTkFMX0RFVEFJTFNfS0VZXG4gIH0sXG5cbiAgSURTOiB7XG4gICAgVVNFUl9IT1VTRUhPTERfTUVNQkVSX0lEOiBVU0VSX0hPVVNFSE9MRF9NRU1CRVJfSURcbiAgfSxcblxuICBUWVBFUzoge1xuICAgIHBlcnNvbjogcGVyc29uLFxuICAgIHJlbGF0aW9uc2hpcDogcmVsYXRpb25zaGlwXG4gIH1cbn07XG5cbndpbmRvdy5PTlMuaGVscGVycyA9IHtcbiAgcG9wdWxhdGVIb3VzZWhvbGRMaXN0OiBwb3B1bGF0ZUhvdXNlaG9sZExpc3QsXG4gIHBvcHVsYXRlVmlzaXRvckxpc3Q6IHBvcHVsYXRlVmlzaXRvckxpc3Rcbn07XG5cbndpbmRvdy5PTlMudXRpbHMgPSB7XG4gIHJlbW92ZUZyb21MaXN0OiByZW1vdmVGcm9tTGlzdCxcbiAgdHJhaWxpbmdOYW1lUzogdHJhaWxpbmdOYW1lUyxcbiAgbnVtYmVyVG9Qb3NpdGlvbldvcmQ6IG51bWJlclRvUG9zaXRpb25Xb3JkLFxuICBnZXRTaWduaWZpY2FudDogZ2V0U2lnbmlmaWNhbnRcbn07XG5cbiQocG9wdWxhdGVIb3VzZWhvbGRMaXN0KTtcbiQocG9wdWxhdGVWaXNpdG9yTGlzdCk7XG4kKHVwZGF0ZUhvdXNlaG9sZFZpc2l0b3JzTmF2aWdhdGlvbkl0ZW1zKTtcbiQodXBkYXRlQWRkcmVzc2VzKTtcbiQodXBkYXRlUGVyc29uTGluayk7XG4kKHRvb2xzKTtcbiQodXBkYXRlQWxsUHJldmlvdXNMaW5rcyk7XG4kKHVwZGF0ZUJ5U3VydmV5VHlwZSk7XG4kKHVwZGF0ZVNpZ25pZmljYW50RGF0ZSk7XG5cbmV4cG9ydHMuVVNFUl9TVE9SQUdFX0tFWSA9IFVTRVJfU1RPUkFHRV9LRVk7XG5leHBvcnRzLklORElWSURVQUxfUFJPWFlfU1RPUkFHRV9LRVkgPSBJTkRJVklEVUFMX1BST1hZX1NUT1JBR0VfS0VZO1xuZXhwb3J0cy5nZXRBZGRyZXNzID0gZ2V0QWRkcmVzcztcbmV4cG9ydHMuYWRkVXNlclBlcnNvbiA9IGFkZFVzZXJQZXJzb247XG5leHBvcnRzLmdldFVzZXJQZXJzb24gPSBnZXRVc2VyUGVyc29uO1xuIl19
