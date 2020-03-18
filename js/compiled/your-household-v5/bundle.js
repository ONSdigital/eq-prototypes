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
      $createFamilyHousehold = $('<li><a href="#" class=\'mock-data-family\'>' + 'Create family household</a></li>'),
      $createFamilyRelationships = $('<li><a href="#"' + ' class=\'mock-data-family\'>' + 'Create family relationships</a></li>'),
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
      userData = {
    'fullName': 'Dave  Jones',
    'firstName': 'Dave',
    'middleName': '',
    'lastName': 'Jones'
  };

  $createFamilyHousehold.on('click', function (e) {
    e.preventDefault();
    clearStorage();
    createFamilyHousehold();
  });

  $createFamilyRelationships.on('click', function (e) {
    e.preventDefault();
    clearStorage();
    createFamilyHousehold();
    createFamilyRelationships();
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
    prerequisites();
    sessionStorage.setItem('user-details', JSON.stringify(userData));
    sessionStorage.setItem(window.ONS.storage.KEYS.HOUSEHOLD_MEMBERS_STORAGE_KEY, JSON.stringify(familyHouseholdMembersData));
    sessionStorage.setItem('household-members-increment', JSON.stringify(4));
    window.location.href = '../summary';
  }

  function createFamilyRelationships() {
    sessionStorage.setItem(window.ONS.storage.KEYS.RELATIONSHIPS_STORAGE_KEY, JSON.stringify(familyHouseholdRelationshipsData));
    sessionStorage.setItem('relationships-increment', JSON.stringify(6));
    window.location.href = '../relationships-summary';
  }

  function clearStorage() {
    sessionStorage.clear();
  }

  $listLinks.append($createFamilyHousehold);
  $listLinks.append($createFamilyRelationships);
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
    RELATIONSHIPS_STORAGE_KEY: RELATIONSHIPS_STORAGE_KEY
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
  numberToPositionWord: numberToPositionWord
};

$(populateHouseholdList);
$(populateVisitorList);
$(updateHouseholdVisitorsNavigationItems);
$(updateAddresses);
$(updatePersonLink);
$(tools);
$(updateAllPreviousLinks);
$(updateBySurveyType);

exports.USER_STORAGE_KEY = USER_STORAGE_KEY;
exports.INDIVIDUAL_PROXY_STORAGE_KEY = INDIVIDUAL_PROXY_STORAGE_KEY;
exports.getAddress = getAddress;
exports.addUserPerson = addUserPerson;
exports.getUserPerson = getUserPerson;

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJfcHJvdG90eXBlcy95b3VyLWhvdXNlaG9sZC12NS9idW5kbGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcblxuZnVuY3Rpb24gYXV0b0luY3JlbWVudElkKGNvbGxlY3Rpb24pIHtcbiAgdmFyIGsgPSBjb2xsZWN0aW9uICsgJy1pbmNyZW1lbnQnLFxuICAgICAgaWQgPSBwYXJzZUludChzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKGspKSB8fCAwO1xuXG4gIGlkKys7XG5cbiAgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbShrLCBKU09OLnN0cmluZ2lmeShpZCkpO1xuXG4gIHJldHVybiBpZDtcbn1cblxuZnVuY3Rpb24gcmVtb3ZlRnJvbUxpc3QobGlzdCwgdmFsKSB7XG5cbiAgZnVuY3Rpb24gZG9SZW1vdmUoaXRlbSkge1xuICAgIHZhciBmb3VuZElkID0gbGlzdC5pbmRleE9mKGl0ZW0pO1xuXG4gICAgLyoqXG4gICAgICogR3VhcmRcbiAgICAgKi9cbiAgICBpZiAoZm91bmRJZCA9PT0gLTEpIHtcbiAgICAgIGNvbnNvbGUubG9nKCdBdHRlbXB0IHRvIHJlbW92ZSBmcm9tIGxpc3QgZmFpbGVkOiAnLCBsaXN0LCB2YWwpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGxpc3Quc3BsaWNlKGZvdW5kSWQsIDEpO1xuICB9XG5cbiAgaWYgKF8uaXNBcnJheSh2YWwpKSB7XG4gICAgJC5lYWNoKHZhbCwgZnVuY3Rpb24gKGksIGl0ZW0pIHtcbiAgICAgIGRvUmVtb3ZlKGl0ZW0pO1xuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIGRvUmVtb3ZlKHZhbCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gdHJhaWxpbmdOYW1lUyhuYW1lKSB7XG4gIHJldHVybiBuYW1lW25hbWUubGVuZ3RoIC0gMV0gPT09ICdzJyA/ICdcXCYjeDIwMTk7JyA6ICdcXCYjeDIwMTk7cyc7XG59XG5cbnZhciBkZWZpbmVQcm9wZXJ0eSA9IGZ1bmN0aW9uIChvYmosIGtleSwgdmFsdWUpIHtcbiAgaWYgKGtleSBpbiBvYmopIHtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHtcbiAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICB3cml0YWJsZTogdHJ1ZVxuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIG9ialtrZXldID0gdmFsdWU7XG4gIH1cblxuICByZXR1cm4gb2JqO1xufTtcblxudmFyIF9leHRlbmRzID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiAodGFyZ2V0KSB7XG4gIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXTtcblxuICAgIGZvciAodmFyIGtleSBpbiBzb3VyY2UpIHtcbiAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoc291cmNlLCBrZXkpKSB7XG4gICAgICAgIHRhcmdldFtrZXldID0gc291cmNlW2tleV07XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRhcmdldDtcbn07XG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxudmFyIHRvQ29uc3VtYWJsZUFycmF5ID0gZnVuY3Rpb24gKGFycikge1xuICBpZiAoQXJyYXkuaXNBcnJheShhcnIpKSB7XG4gICAgZm9yICh2YXIgaSA9IDAsIGFycjIgPSBBcnJheShhcnIubGVuZ3RoKTsgaSA8IGFyci5sZW5ndGg7IGkrKykgYXJyMltpXSA9IGFycltpXTtcblxuICAgIHJldHVybiBhcnIyO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBBcnJheS5mcm9tKGFycik7XG4gIH1cbn07XG5cbnZhciBIT1VTRUhPTERfTUVNQkVSU19TVE9SQUdFX0tFWSA9ICdob3VzZWhvbGQtbWVtYmVycyc7XG52YXIgVVNFUl9IT1VTRUhPTERfTUVNQkVSX0lEID0gJ3BlcnNvbl9tZSc7XG52YXIgSE9VU0VIT0xEX01FTUJFUl9UWVBFID0gJ2hvdXNlaG9sZC1tZW1iZXInO1xudmFyIFZJU0lUT1JfVFlQRSA9ICd2aXNpdG9yJztcblxuLyoqXG4gKiBUeXBlc1xuICovXG5mdW5jdGlvbiBwZXJzb24ob3B0cykge1xuICBpZiAob3B0cy5maXJzdE5hbWUgPT09ICcnIHx8IG9wdHMubGFzdE5hbWUgPT09ICcnKSB7XG4gICAgY29uc29sZS5sb2coJ1VuYWJsZSB0byBjcmVhdGUgcGVyc29uIHdpdGggZGF0YTogJywgb3B0cy5maXJzdE5hbWUsICFvcHRzLm1pZGRsZU5hbWUsICFvcHRzLmxhc3ROYW1lKTtcbiAgfVxuXG4gIHZhciBtaWRkbGVOYW1lID0gb3B0cy5taWRkbGVOYW1lIHx8ICcnO1xuXG4gIHJldHVybiB7XG4gICAgZnVsbE5hbWU6IG9wdHMuZmlyc3ROYW1lICsgJyAnICsgbWlkZGxlTmFtZSArICcgJyArIG9wdHMubGFzdE5hbWUsXG4gICAgZmlyc3ROYW1lOiBvcHRzLmZpcnN0TmFtZSxcbiAgICBtaWRkbGVOYW1lOiBtaWRkbGVOYW1lLFxuICAgIGxhc3ROYW1lOiBvcHRzLmxhc3ROYW1lXG4gIH07XG59XG5cbi8qKlxuICogU3RvcmFnZVxuICovXG5mdW5jdGlvbiBnZXRVc2VyQXNIb3VzZWhvbGRNZW1iZXIoKSB7XG4gIHJldHVybiBnZXRBbGxIb3VzZWhvbGRNZW1iZXJzKCkuZmluZChmdW5jdGlvbiAobWVtYmVyKSB7XG4gICAgcmV0dXJuIG1lbWJlclsnQHBlcnNvbiddLmlkID09PSBVU0VSX0hPVVNFSE9MRF9NRU1CRVJfSUQ7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBkZWxldGVVc2VyQXNIb3VzZWhvbGRNZW1iZXIoKSB7XG4gIGRlbGV0ZUhvdXNlaG9sZE1lbWJlcihVU0VSX0hPVVNFSE9MRF9NRU1CRVJfSUQpO1xufVxuXG5mdW5jdGlvbiBkZWxldGVIb3VzZWhvbGRNZW1iZXIocGVyc29uSWQpIHtcbiAgdmFyIG1lbWJlcnMgPSBnZXRBbGxIb3VzZWhvbGRNZW1iZXJzKCkuZmlsdGVyKGZ1bmN0aW9uIChtZW1iZXIpIHtcbiAgICByZXR1cm4gbWVtYmVyWydAcGVyc29uJ10uaWQgIT09IHBlcnNvbklkO1xuICB9KTtcblxuICBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKEhPVVNFSE9MRF9NRU1CRVJTX1NUT1JBR0VfS0VZLCBKU09OLnN0cmluZ2lmeShtZW1iZXJzKSk7XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZVVzZXJBc0hvdXNlaG9sZE1lbWJlcihwZXJzb24sIG1lbWJlckRhdGEpIHtcbiAgdmFyIHVzZXJBc0hvdXNlaG9sZE1lbWJlciA9IGdldFVzZXJBc0hvdXNlaG9sZE1lbWJlcigpO1xuXG4gIHVzZXJBc0hvdXNlaG9sZE1lbWJlciA/IHVwZGF0ZUhvdXNlaG9sZE1lbWJlcih1c2VyQXNIb3VzZWhvbGRNZW1iZXJbJ0BwZXJzb24nXSwgbWVtYmVyRGF0YSkgOiBhZGRIb3VzZWhvbGRNZW1iZXIocGVyc29uLCBtZW1iZXJEYXRhLCBVU0VSX0hPVVNFSE9MRF9NRU1CRVJfSUQpO1xufVxuXG5mdW5jdGlvbiB1cGRhdGVIb3VzZWhvbGRNZW1iZXIocGVyc29uLCBtZW1iZXJEYXRhKSB7XG4gIHZhciBtZW1iZXJzVXBkYXRlZCA9IGdldEFsbEhvdXNlaG9sZE1lbWJlcnMoKS5tYXAoZnVuY3Rpb24gKG1lbWJlcikge1xuICAgIHJldHVybiBtZW1iZXJbJ0BwZXJzb24nXS5pZCA9PT0gcGVyc29uLmlkID8gX2V4dGVuZHMoe30sIG1lbWJlciwgbWVtYmVyRGF0YSwgeyAnQHBlcnNvbic6IF9leHRlbmRzKHt9LCBtZW1iZXJbJ0BwZXJzb24nXSwgcGVyc29uKSB9KSA6IG1lbWJlcjtcbiAgfSk7XG5cbiAgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbShIT1VTRUhPTERfTUVNQkVSU19TVE9SQUdFX0tFWSwgSlNPTi5zdHJpbmdpZnkobWVtYmVyc1VwZGF0ZWQpKTtcbn1cblxuZnVuY3Rpb24gYWRkSG91c2Vob2xkTWVtYmVyKHBlcnNvbiwgbWVtYmVyRGF0YSwgaWQpIHtcbiAgdmFyIHBlb3BsZSA9IGdldEFsbEhvdXNlaG9sZE1lbWJlcnMoKSB8fCBbXTtcbiAgbWVtYmVyRGF0YSA9IG1lbWJlckRhdGEgfHwge307XG5cbiAgLyoqXG4gICAqIFVzZXIgaXMgYWx3YXlzIGZpcnN0IGluIHRoZSBob3VzZWhvbGQgbGlzdFxuICAgKi9cbiAgcGVvcGxlW2lkID09PSBVU0VSX0hPVVNFSE9MRF9NRU1CRVJfSUQgPyAndW5zaGlmdCcgOiAncHVzaCddKF9leHRlbmRzKHt9LCBtZW1iZXJEYXRhLCB7XG4gICAgdHlwZTogbWVtYmVyRGF0YS50eXBlIHx8IEhPVVNFSE9MRF9NRU1CRVJfVFlQRSxcbiAgICAnQHBlcnNvbic6IF9leHRlbmRzKHt9LCBwZXJzb24sIHtcbiAgICAgIGlkOiBpZCB8fCAncGVyc29uJyArIGF1dG9JbmNyZW1lbnRJZCgnaG91c2Vob2xkLW1lbWJlcnMnKVxuICAgIH0pXG4gIH0pKTtcblxuICBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKEhPVVNFSE9MRF9NRU1CRVJTX1NUT1JBR0VfS0VZLCBKU09OLnN0cmluZ2lmeShwZW9wbGUpKTtcbn1cblxuZnVuY3Rpb24gZ2V0QWxsSG91c2Vob2xkTWVtYmVycygpIHtcbiAgcmV0dXJuIEpTT04ucGFyc2Uoc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbShIT1VTRUhPTERfTUVNQkVSU19TVE9SQUdFX0tFWSkpIHx8IFtdO1xufVxuXG5mdW5jdGlvbiBnZXRIb3VzZWhvbGRNZW1iZXJCeVBlcnNvbklkKGlkKSB7XG4gIHJldHVybiBnZXRBbGxIb3VzZWhvbGRNZW1iZXJzKCkuZmluZChmdW5jdGlvbiAobWVtYmVyKSB7XG4gICAgcmV0dXJuIG1lbWJlclsnQHBlcnNvbiddLmlkID09PSBpZDtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGdldE1lbWJlclBlcnNvbklkKG1lbWJlcikge1xuICByZXR1cm4gbWVtYmVyWydAcGVyc29uJ10uaWQ7XG59XG5cbi8qKlxuICogQ29tcGFyYXRvcnNcbiAqL1xuZnVuY3Rpb24gaXNWaXNpdG9yKG1lbWJlcikge1xuICByZXR1cm4gbWVtYmVyLnR5cGUgPT09IHdpbmRvdy5PTlMuc3RvcmFnZS5LRVlTLlZJU0lUT1JfVFlQRTtcbn1cblxuZnVuY3Rpb24gaXNIb3VzZWhvbGRNZW1iZXIobWVtYmVyKSB7XG4gIHJldHVybiBtZW1iZXIudHlwZSA9PT0gd2luZG93Lk9OUy5zdG9yYWdlLktFWVMuSE9VU0VIT0xEX01FTUJFUl9UWVBFO1xufVxuXG5mdW5jdGlvbiBpc090aGVySG91c2Vob2xkTWVtYmVyKG1lbWJlcikge1xuICByZXR1cm4gbWVtYmVyLnR5cGUgPT09IHdpbmRvdy5PTlMuc3RvcmFnZS5LRVlTLkhPVVNFSE9MRF9NRU1CRVJfVFlQRSAmJiBtZW1iZXJbJ0BwZXJzb24nXS5pZCAhPT0gd2luZG93Lk9OUy5zdG9yYWdlLklEUy5VU0VSX0hPVVNFSE9MRF9NRU1CRVJfSUQ7XG59XG5cbnZhciB0ZW1wQXdheVF1ZXN0aW9uU2VudGVuY2VNYXAgPSB7XG4gICdzdHVkeWluZy1hd2F5JzogJ3dobyBpcyB3b3JraW5nIG9yIHN0dWR5aW5nIGF3YXkgZnJvbSBob21lJyxcbiAgJ2FybWVkLWZvcmNlcyc6ICd3aG8gaXMgYSBtZW1iZXIgb2YgdGhlIGFybWVkIGZvcmNlcycsXG4gICdvdXRzaWRlLXVrJzogJ3dobyBpcyBzdGF5aW5nIG91dHNpZGUgdGhlIFVLIGZvciAxMiBtb250aHMnXG59O1xuXG4vKipcbiAqIEF1Z21lbnQgVW5kZXJzY29yZSBsaWJyYXJ5XG4gKi9cbnZhciBfJDEgPSB3aW5kb3cuXyB8fCB7fTtcblxudmFyIFJFTEFUSU9OU0hJUFNfU1RPUkFHRV9LRVkgPSAncmVsYXRpb25zaGlwcyc7XG5cbnZhciByZWxhdGlvbnNoaXBUeXBlcyA9IHtcbiAgJ3Nwb3VzZSc6IHsgaWQ6ICdzcG91c2UnIH0sXG4gICdjaGlsZC1wYXJlbnQnOiB7IGlkOiAnY2hpbGQtcGFyZW50JyB9LFxuICAnc3RlcC1jaGlsZC1wYXJlbnQnOiB7IGlkOiAnc3RlcC1jaGlsZC1wYXJlbnQnIH0sXG4gICdncmFuZGNoaWxkLWdyYW5kcGFyZW50JzogeyBpZDogJ2dyYW5kY2hpbGQtZ3JhbmRwYXJlbnQnIH0sXG4gICdoYWxmLXNpYmxpbmcnOiB7IGlkOiAnaGFsZi1zaWJsaW5nJyB9LFxuICAnc2libGluZyc6IHsgaWQ6ICdzaWJsaW5nJyB9LFxuICAnc3RlcC1icm90aGVyLXNpc3Rlcic6IHsgaWQ6ICdzdGVwLWJyb3RoZXItc2lzdGVyJyB9LFxuICAncGFydG5lcic6IHsgaWQ6ICdwYXJ0bmVyJyB9LFxuICAndW5yZWxhdGVkJzogeyBpZDogJ3VucmVsYXRlZCcgfSxcbiAgJ290aGVyLXJlbGF0aW9uJzogeyBpZDogJ290aGVyLXJlbGF0aW9uJyB9XG59O1xuXG52YXIgcmVsYXRpb25zaGlwRGVzY3JpcHRpb25NYXAgPSB7XG4gIC8vIGNvdmVyZWRcbiAgJ2h1c2JhbmQtd2lmZSc6IHtcbiAgICBzZW50YW5jZUxhYmVsOiAnaHVzYmFuZCBvciB3aWZlJyxcbiAgICBzdW1tYXJ5QWRqZWN0aXZlOiAnaHVzYmFuZCBvciB3aWZlJyxcbiAgICB0eXBlOiByZWxhdGlvbnNoaXBUeXBlc1snc3BvdXNlJ11cbiAgfSxcbiAgLy8gY292ZXJlZFxuICAnbW90aGVyLWZhdGhlcic6IHtcbiAgICBzZW50YW5jZUxhYmVsOiAnbW90aGVyIG9yIGZhdGhlcicsXG4gICAgc3VtbWFyeUFkamVjdGl2ZTogJ21vdGhlciBvciBmYXRoZXInLFxuICAgIHR5cGU6IHJlbGF0aW9uc2hpcFR5cGVzWydjaGlsZC1wYXJlbnQnXVxuICB9LFxuICAvLyBjb3ZlcmVkXG4gICdzdGVwLW1vdGhlci1mYXRoZXInOiB7XG4gICAgc2VudGFuY2VMYWJlbDogJ3N0ZXBtb3RoZXIgb3Igc3RlcGZhdGhlcicsXG4gICAgc3VtbWFyeUFkamVjdGl2ZTogJ3N0ZXBtb3RoZXIgb3Igc3RlcGZhdGhlcicsXG4gICAgdHlwZTogcmVsYXRpb25zaGlwVHlwZXNbJ3N0ZXAtY2hpbGQtcGFyZW50J11cbiAgfSxcbiAgLy8gY292ZXJlZFxuICAnc29uLWRhdWdodGVyJzoge1xuICAgIHNlbnRhbmNlTGFiZWw6ICdzb24gb3IgZGF1Z2h0ZXInLFxuICAgIHN1bW1hcnlBZGplY3RpdmU6ICdzb24gb3IgZGF1Z2h0ZXInLFxuICAgIHR5cGU6IHJlbGF0aW9uc2hpcFR5cGVzWydjaGlsZC1wYXJlbnQnXVxuICB9LFxuICAvLyBjb3ZlcmVkXG4gICdoYWxmLWJyb3RoZXItc2lzdGVyJzoge1xuICAgIHNlbnRhbmNlTGFiZWw6ICdoYWxmLWJyb3RoZXIgb3IgaGFsZi1zaXN0ZXInLFxuICAgIHN1bW1hcnlBZGplY3RpdmU6ICdoYWxmLWJyb3RoZXIgb3IgaGFsZi1zaXN0ZXInLFxuICAgIHR5cGU6IHJlbGF0aW9uc2hpcFR5cGVzWydoYWxmLXNpYmxpbmcnXVxuICB9LFxuICAvLyBjb3ZlcmVkXG4gICdzdGVwLWNoaWxkJzoge1xuICAgIHNlbnRhbmNlTGFiZWw6ICdzdGVwY2hpbGQnLFxuICAgIHN1bW1hcnlBZGplY3RpdmU6ICdzdGVwY2hpbGQnLFxuICAgIHR5cGU6IHJlbGF0aW9uc2hpcFR5cGVzWydzdGVwLWNoaWxkLXBhcmVudCddXG4gIH0sXG4gIC8vIGNvdmVyZWRcbiAgJ2dyYW5kcGFyZW50Jzoge1xuICAgIHNlbnRhbmNlTGFiZWw6ICdncmFuZHBhcmVudCcsXG4gICAgc3VtbWFyeUFkamVjdGl2ZTogJ2dyYW5kcGFyZW50JyxcbiAgICB0eXBlOiByZWxhdGlvbnNoaXBUeXBlc1snZ3JhbmRjaGlsZC1ncmFuZHBhcmVudCddXG4gIH0sXG4gIC8vIGNvdmVyZWRcbiAgJ2dyYW5kY2hpbGQnOiB7XG4gICAgc2VudGFuY2VMYWJlbDogJ2dyYW5kY2hpbGQnLFxuICAgIHN1bW1hcnlBZGplY3RpdmU6ICdncmFuZGNoaWxkJyxcbiAgICB0eXBlOiByZWxhdGlvbnNoaXBUeXBlc1snZ3JhbmRjaGlsZC1ncmFuZHBhcmVudCddXG4gIH0sXG4gIC8vIGNvdmVyZWRcbiAgJ2Jyb3RoZXItc2lzdGVyJzoge1xuICAgIHNlbnRhbmNlTGFiZWw6ICdicm90aGVyIG9yIHNpc3RlcicsXG4gICAgc3VtbWFyeUFkamVjdGl2ZTogJ2Jyb3RoZXIgb3Igc2lzdGVyJyxcbiAgICB0eXBlOiByZWxhdGlvbnNoaXBUeXBlc1snc2libGluZyddXG4gIH0sXG4gIC8vIGNvdmVyZWRcbiAgJ3N0ZXAtYnJvdGhlci1zaXN0ZXInOiB7XG4gICAgc2VudGFuY2VMYWJlbDogJ3N0ZXBicm90aGVyIG9yIHN0ZXBzaXN0ZXInLFxuICAgIHN1bW1hcnlBZGplY3RpdmU6ICdzdGVwYnJvdGhlciBvciBzdGVwc2lzdGVyJyxcbiAgICB0eXBlOiByZWxhdGlvbnNoaXBUeXBlc1snc3RlcC1icm90aGVyLXNpc3RlciddXG4gIH0sXG4gIC8vIGNvdmVyZWRcbiAgJ290aGVyLXJlbGF0aW9uJzoge1xuICAgIHNlbnRhbmNlTGFiZWw6ICdvdGhlciByZWxhdGlvbicsXG4gICAgc3VtbWFyeUFkamVjdGl2ZTogJ3JlbGF0ZWQnLFxuICAgIHR5cGU6IHJlbGF0aW9uc2hpcFR5cGVzWydvdGhlci1yZWxhdGlvbiddXG4gIH0sXG4gIC8vIGNvdmVyZWRcbiAgJ3BhcnRuZXInOiB7XG4gICAgc2VudGFuY2VMYWJlbDogJ3BhcnRuZXInLFxuICAgIHN1bW1hcnlBZGplY3RpdmU6ICdwYXJ0bmVyJyxcbiAgICB0eXBlOiByZWxhdGlvbnNoaXBUeXBlc1sncGFydG5lciddXG4gIH0sXG4gICdzYW1lLXNleC1wYXJ0bmVyJzoge1xuICAgIHNlbnRhbmNlTGFiZWw6ICdsZWdhbGx5IHJlZ2lzdGVyZWQgY2l2aWwgcGFydG5lcicsXG4gICAgc3VtbWFyeUFkamVjdGl2ZTogJ2xlZ2FsbHkgcmVnaXN0ZXJlZCBjaXZpbCBwYXJ0bmVyJyxcbiAgICB0eXBlOiByZWxhdGlvbnNoaXBUeXBlc1sncGFydG5lciddXG4gIH0sXG4gIC8vIGNvdmVyZWRcbiAgJ3VucmVsYXRlZCc6IHtcbiAgICBzZW50YW5jZUxhYmVsOiAndW5yZWxhdGVkJyxcbiAgICBzdW1tYXJ5QWRqZWN0aXZlOiAndW5yZWxhdGVkJyxcbiAgICB0eXBlOiByZWxhdGlvbnNoaXBUeXBlc1sndW5yZWxhdGVkJ11cbiAgfVxufTtcblxuZnVuY3Rpb24gbmFtZUVsZW1lbnQobmFtZSkge1xuICByZXR1cm4gJzxzdHJvbmc+JyArIG5hbWUgKyAnPC9zdHJvbmc+Jztcbn1cblxuZnVuY3Rpb24gcGVyc29uTGlzdFN0cihwZW9wbGVBcnIpIHtcbiAgdmFyIG9wdHMgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IHt9O1xuXG4gIGlmIChwZW9wbGVBcnIubGVuZ3RoIDwgMSkge1xuICAgIGNvbnNvbGUubG9nKHBlb3BsZUFyciwgJ25vdCBlbm91Z2ggcGVvcGxlIHRvIGNyZWF0ZSBhIGxpc3Qgc3RyaW5nJyk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgaWYgKHBlb3BsZUFyci5sZW5ndGggPT09IDEpIHtcbiAgICByZXR1cm4gbmFtZUVsZW1lbnQocGVvcGxlQXJyWzBdLmZ1bGxOYW1lICsgZm9ybWF0UGVyc29uSWZZb3UocGVvcGxlQXJyWzBdKSk7XG4gIH1cblxuICB2YXIgcGVvcGxlQ29weSA9IFtdLmNvbmNhdCh0b0NvbnN1bWFibGVBcnJheShwZW9wbGVBcnIpKSxcbiAgICAgIGxhc3RQZXJzb24gPSBwZW9wbGVDb3B5LnBvcCgpO1xuXG4gIHJldHVybiBwZW9wbGVDb3B5Lm1hcChmdW5jdGlvbiAocGVyc29uJCQxKSB7XG4gICAgcmV0dXJuICcnICsgbmFtZUVsZW1lbnQocGVyc29uJCQxLmZ1bGxOYW1lICsgKG9wdHMuaXNGYW1pbHkgPyB0cmFpbGluZ05hbWVTKHBlcnNvbiQkMS5mdWxsTmFtZSkgOiAnJykgKyBmb3JtYXRQZXJzb25JZllvdShwZXJzb24kJDEpKTtcbiAgfSkuam9pbignLCAnKSArICcgYW5kICcgKyBuYW1lRWxlbWVudChsYXN0UGVyc29uLmZ1bGxOYW1lICsgKG9wdHMuaXNGYW1pbHkgPyB0cmFpbGluZ05hbWVTKGxhc3RQZXJzb24uZnVsbE5hbWUpIDogJycpICsgZm9ybWF0UGVyc29uSWZZb3UobGFzdFBlcnNvbikpO1xufVxuXG5mdW5jdGlvbiBmb3JtYXRQZXJzb25JZllvdShwZXJzb24kJDEpIHtcbiAgcmV0dXJuIHBlcnNvbiQkMS5pZCA9PT0gVVNFUl9IT1VTRUhPTERfTUVNQkVSX0lEID8gJyAoWW91KScgOiAnJztcbn1cblxudmFyIHJlbGF0aW9uc2hpcFN1bW1hcnlUZW1wbGF0ZXMgPSB7XG4gICdwYXJ0bmVyc2hpcCc6IGZ1bmN0aW9uIHBhcnRuZXJzaGlwKHBlcnNvbjEsIHBlcnNvbjIsIGRlc2NyaXB0aW9uKSB7XG4gICAgcmV0dXJuIG5hbWVFbGVtZW50KHBlcnNvbjEuZnVsbE5hbWUgKyBmb3JtYXRQZXJzb25JZllvdShwZXJzb24xKSkgKyAnIGlzICcgKyBuYW1lRWxlbWVudChwZXJzb24yLmZ1bGxOYW1lICsgdHJhaWxpbmdOYW1lUyhwZXJzb24yLmZ1bGxOYW1lKSArIGZvcm1hdFBlcnNvbklmWW91KHBlcnNvbjIpKSArICcgJyArIGRlc2NyaXB0aW9uO1xuICB9LFxuICAndHdvRmFtaWx5TWVtYmVyc1RvTWFueSc6IGZ1bmN0aW9uIHR3b0ZhbWlseU1lbWJlcnNUb01hbnkocGFyZW50MSwgcGFyZW50MiwgY2hpbGRyZW5BcnIsIGRlc2NyaXB0aW9uKSB7XG4gICAgcmV0dXJuIG5hbWVFbGVtZW50KHBhcmVudDEuZnVsbE5hbWUgKyBmb3JtYXRQZXJzb25JZllvdShwYXJlbnQxKSkgKyAnIGFuZCAnICsgbmFtZUVsZW1lbnQocGFyZW50Mi5mdWxsTmFtZSArIGZvcm1hdFBlcnNvbklmWW91KHBhcmVudDIpKSArICcgYXJlICcgKyBwZXJzb25MaXN0U3RyKGNoaWxkcmVuQXJyLCB7IGlzRmFtaWx5OiB0cnVlIH0pICsgJyAnICsgZGVzY3JpcHRpb247XG4gIH0sXG4gICdvbmVGYW1pbHlNZW1iZXJUb01hbnknOiBmdW5jdGlvbiBvbmVGYW1pbHlNZW1iZXJUb01hbnkocGFyZW50LCBjaGlsZHJlbkFyciwgZGVzY3JpcHRpb24pIHtcbiAgICBjb25zb2xlLmxvZyhwYXJlbnQsIGNoaWxkcmVuQXJyLCBkZXNjcmlwdGlvbik7XG4gICAgcmV0dXJuIG5hbWVFbGVtZW50KHBhcmVudC5mdWxsTmFtZSArIGZvcm1hdFBlcnNvbklmWW91KHBhcmVudCkpICsgJyBpcyAnICsgcGVyc29uTGlzdFN0cihjaGlsZHJlbkFyciwgeyBpc0ZhbWlseTogdHJ1ZSB9KSArICcgJyArIGRlc2NyaXB0aW9uO1xuICB9LFxuICAnbWFueVRvTWFueSc6IGZ1bmN0aW9uIG1hbnlUb01hbnkocGVvcGxlQXJyMSwgcGVvcGxlQXJyMiwgZGVzY3JpcHRpb24pIHtcbiAgICByZXR1cm4gcGVyc29uTGlzdFN0cihwZW9wbGVBcnIxKSArICcgJyArIChwZW9wbGVBcnIxLmxlbmd0aCA+IDEgPyAnYXJlJyA6ICdpcycpICsgJyAnICsgZGVzY3JpcHRpb24gKyAnIHRvICcgKyBwZXJzb25MaXN0U3RyKHBlb3BsZUFycjIpO1xuICB9LFxuICAnYWxsTXV0dWFsJzogZnVuY3Rpb24gYWxsTXV0dWFsKHBlb3BsZUFyciwgZGVzY3JpcHRpb24pIHtcbiAgICByZXR1cm4gcGVyc29uTGlzdFN0cihwZW9wbGVBcnIpICsgJyBhcmUgJyArIGRlc2NyaXB0aW9uO1xuICB9XG59O1xuXG4vKipcbiAqIFR5cGVzXG4gKi9cbmZ1bmN0aW9uIHJlbGF0aW9uc2hpcChkZXNjcmlwdGlvbiwgcGVyc29uSXNJZCwgcGVyc29uVG9JZCkge1xuICB2YXIgb3B0cyA9IGFyZ3VtZW50cy5sZW5ndGggPiAzICYmIGFyZ3VtZW50c1szXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzNdIDoge307XG5cbiAgcmV0dXJuIHtcbiAgICBwZXJzb25Jc0Rlc2NyaXB0aW9uOiBkZXNjcmlwdGlvbixcbiAgICBwZXJzb25Jc0lkOiBwZXJzb25Jc0lkLFxuICAgIHBlcnNvblRvSWQ6IHBlcnNvblRvSWQsXG4gICAgaW5mZXJyZWQ6ICEhb3B0cy5pbmZlcnJlZCxcbiAgICBpbmZlcnJlZEJ5OiBvcHRzLmluZmVycmVkQnlcbiAgfTtcbn1cblxuLyoqXG4gKiBTdG9yYWdlXG4gKi9cbmZ1bmN0aW9uIGFkZFJlbGF0aW9uc2hpcChyZWxhdGlvbnNoaXBPYmopIHtcbiAgdmFyIGhvdXNlaG9sZFJlbGF0aW9uc2hpcHMgPSBnZXRBbGxSZWxhdGlvbnNoaXBzKCkgfHwgW10sXG4gICAgICBpdGVtID0gX2V4dGVuZHMoe30sIHJlbGF0aW9uc2hpcE9iaiwge1xuICAgIGlkOiBhdXRvSW5jcmVtZW50SWQoUkVMQVRJT05TSElQU19TVE9SQUdFX0tFWSlcbiAgfSk7XG5cbiAgaG91c2Vob2xkUmVsYXRpb25zaGlwcy5wdXNoKGl0ZW0pO1xuXG4gIHNlc3Npb25TdG9yYWdlLnNldEl0ZW0oUkVMQVRJT05TSElQU19TVE9SQUdFX0tFWSwgSlNPTi5zdHJpbmdpZnkoaG91c2Vob2xkUmVsYXRpb25zaGlwcykpO1xuXG4gIHJldHVybiBpdGVtO1xufVxuXG5mdW5jdGlvbiBkZWxldGVSZWxhdGlvbnNoaXAocmVsYXRpb25zaGlwT2JqKSB7XG4gIHZhciBob3VzZWhvbGRSZWxhdGlvbnNoaXBzID0gKGdldEFsbFJlbGF0aW9uc2hpcHMoKSB8fCBbXSkuZmlsdGVyKGZ1bmN0aW9uIChyZWxhdGlvbnNoaXApIHtcbiAgICByZXR1cm4gcmVsYXRpb25zaGlwLmlkICE9PSByZWxhdGlvbnNoaXBPYmouaWQ7XG4gIH0pO1xuXG4gIHNlc3Npb25TdG9yYWdlLnNldEl0ZW0oUkVMQVRJT05TSElQU19TVE9SQUdFX0tFWSwgSlNPTi5zdHJpbmdpZnkoaG91c2Vob2xkUmVsYXRpb25zaGlwcykpO1xufVxuXG5mdW5jdGlvbiBlZGl0UmVsYXRpb25zaGlwKHJlbGF0aW9uc2hpcElkLCB2YWx1ZU9iamVjdCkge1xuICB2YXIgaG91c2Vob2xkUmVsYXRpb25zaGlwcyA9IChnZXRBbGxSZWxhdGlvbnNoaXBzKCkgfHwgW10pLm1hcChmdW5jdGlvbiAocmVsYXRpb25zaGlwKSB7XG4gICAgcmV0dXJuIHJlbGF0aW9uc2hpcC5pZCArICcnID09PSByZWxhdGlvbnNoaXBJZCArICcnID8gX2V4dGVuZHMoe30sIHZhbHVlT2JqZWN0LCB7XG4gICAgICBpZDogcmVsYXRpb25zaGlwSWRcbiAgICB9KSA6IHJlbGF0aW9uc2hpcDtcbiAgfSk7XG5cbiAgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbShSRUxBVElPTlNISVBTX1NUT1JBR0VfS0VZLCBKU09OLnN0cmluZ2lmeShob3VzZWhvbGRSZWxhdGlvbnNoaXBzKSk7XG59XG5cbmZ1bmN0aW9uIGdldEFsbFJlbGF0aW9uc2hpcHMoKSB7XG4gIHJldHVybiBKU09OLnBhcnNlKHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oUkVMQVRJT05TSElQU19TVE9SQUdFX0tFWSkpIHx8IFtdO1xufVxuXG5mdW5jdGlvbiBnZXRBbGxNYW51YWxSZWxhdGlvbnNoaXBzKCkge1xuICByZXR1cm4gZ2V0QWxsUmVsYXRpb25zaGlwcygpLmZpbHRlcihmdW5jdGlvbiAocmVsYXRpb25zaGlwKSB7XG4gICAgcmV0dXJuICFyZWxhdGlvbnNoaXAuaW5mZXJyZWQ7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBkZWxldGVBbGxSZWxhdGlvbnNoaXBzRm9yTWVtYmVyKHBlcnNvbklkKSB7XG4gIHZhciBob3VzZWhvbGRSZWxhdGlvbnNoaXBzID0gZ2V0QWxsUmVsYXRpb25zaGlwcygpLmZpbHRlcihmdW5jdGlvbiAocmVsYXRpb25zaGlwKSB7XG4gICAgcmV0dXJuICEocGVyc29uSWQgPT09IHJlbGF0aW9uc2hpcC5wZXJzb25Jc0lkIHx8IHBlcnNvbklkID09PSByZWxhdGlvbnNoaXAucGVyc29uVG9JZCk7XG4gIH0pO1xuXG4gIHNlc3Npb25TdG9yYWdlLnNldEl0ZW0oUkVMQVRJT05TSElQU19TVE9SQUdFX0tFWSwgSlNPTi5zdHJpbmdpZnkoaG91c2Vob2xkUmVsYXRpb25zaGlwcykpO1xufVxuXG4vKipcbiAqIENvbXBhcmF0b3JzXG4gKi9cbmZ1bmN0aW9uIGlzSW5SZWxhdGlvbnNoaXAocGVyc29uSWQsIHJlbGF0aW9uc2hpcCkge1xuICByZXR1cm4gcmVsYXRpb25zaGlwLnBlcnNvblRvSWQgPT09IHBlcnNvbklkIHx8IHJlbGF0aW9uc2hpcC5wZXJzb25Jc0lkID09PSBwZXJzb25JZDtcbn1cblxuZnVuY3Rpb24gaXNBQ2hpbGRJblJlbGF0aW9uc2hpcChwZXJzb25JZCwgcmVsYXRpb25zaGlwKSB7XG4gIC8qKlxuICAgKiBHdWFyZFxuICAgKi9cbiAgaWYgKCFpc0luUmVsYXRpb25zaGlwKHBlcnNvbklkLCByZWxhdGlvbnNoaXApKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcmV0dXJuIHJlbGF0aW9uc2hpcC5wZXJzb25Jc0Rlc2NyaXB0aW9uID09PSAnbW90aGVyLWZhdGhlcicgJiYgcmVsYXRpb25zaGlwLnBlcnNvblRvSWQgPT09IHBlcnNvbklkIHx8IHJlbGF0aW9uc2hpcC5wZXJzb25Jc0Rlc2NyaXB0aW9uID09PSAnc29uLWRhdWdodGVyJyAmJiByZWxhdGlvbnNoaXAucGVyc29uSXNJZCA9PT0gcGVyc29uSWQ7XG59XG5cbmZ1bmN0aW9uIGlzQVNpYmxpbmdJblJlbGF0aW9uc2hpcChwZXJzb25JZCwgcmVsYXRpb25zaGlwKSB7XG4gIHJldHVybiBpc0luUmVsYXRpb25zaGlwKHBlcnNvbklkLCByZWxhdGlvbnNoaXApICYmIHJlbGF0aW9uc2hpcERlc2NyaXB0aW9uTWFwW3JlbGF0aW9uc2hpcC5wZXJzb25Jc0Rlc2NyaXB0aW9uXS50eXBlLmlkID09PSAnc2libGluZyc7XG59XG5cbmZ1bmN0aW9uIGlzQVBhcmVudEluUmVsYXRpb25zaGlwKHBlcnNvbklkLCByZWxhdGlvbnNoaXApIHtcbiAgLyoqXG4gICAqIEd1YXJkXG4gICAqL1xuICBpZiAoIWlzSW5SZWxhdGlvbnNoaXAocGVyc29uSWQsIHJlbGF0aW9uc2hpcCkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICByZXR1cm4gcmVsYXRpb25zaGlwLnBlcnNvbklzRGVzY3JpcHRpb24gPT09ICdtb3RoZXItZmF0aGVyJyAmJiByZWxhdGlvbnNoaXAucGVyc29uSXNJZCA9PT0gcGVyc29uSWQgfHwgcmVsYXRpb25zaGlwLnBlcnNvbklzRGVzY3JpcHRpb24gPT09ICdzb24tZGF1Z2h0ZXInICYmIHJlbGF0aW9uc2hpcC5wZXJzb25Ub0lkID09PSBwZXJzb25JZDtcbn1cblxuZnVuY3Rpb24gYXJlQW55Q2hpbGRyZW5JblJlbGF0aW9uc2hpcE5vdFBhcmVudChjaGlsZHJlbklkcywgbm90UGFyZW50SWQsIHJlbGF0aW9uc2hpcCkge1xuICAvKipcbiAgICogR3VhcmRcbiAgICogSWYgcmVsYXRpb25zaGlwIHR5cGUgaXMgbm90IGNoaWxkLXBhcmVudFxuICAgKi9cbiAgaWYgKHJlbGF0aW9uc2hpcERlc2NyaXB0aW9uTWFwW3JlbGF0aW9uc2hpcC5wZXJzb25Jc0Rlc2NyaXB0aW9uXS50eXBlLmlkICE9PSAnY2hpbGQtcGFyZW50Jykge1xuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgdmFyIGNoaWxkSW5kZXhBc1BlcnNvbklzID0gY2hpbGRyZW5JZHMuaW5kZXhPZihyZWxhdGlvbnNoaXAucGVyc29uSXNJZCksXG4gICAgICBjaGlsZEluZGV4QXNQZXJzb25UbyA9IGNoaWxkcmVuSWRzLmluZGV4T2YocmVsYXRpb25zaGlwLnBlcnNvblRvSWQpO1xuXG4gIC8qKlxuICAgKiBGaW5kIHBhcmVudHMgd2l0aCB0aGUgc2FtZSBjaGlsZHJlblxuICAgKlxuICAgKiBJZiBhIHBlcnNvbklzLWNoaWxkIGlzIG5vdCBpbiByZWxhdGlvbnNoaXBcbiAgICogb3IgMiBjaGlsZHJlbiBhcmUgZm91bmQgaW4gcmVsYXRpb25zaGlwXG4gICAqL1xuICBpZiAoY2hpbGRJbmRleEFzUGVyc29uSXMgPT09IC0xICYmIGNoaWxkSW5kZXhBc1BlcnNvblRvID09PSAtMSB8fCBjaGlsZEluZGV4QXNQZXJzb25JcyAhPT0gLTEgJiYgY2hpbGRJbmRleEFzUGVyc29uVG8gIT09IC0xKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLyoqXG4gICAqIENoaWxkIG11c3QgYmUgaW4gcmVsYXRpb25zaGlwLCBnZXQgY2hpbGQgaW5kZXhcbiAgICovXG4gIHZhciBjaGlsZEluZGV4ID0gY2hpbGRJbmRleEFzUGVyc29uSXMgIT09IC0xID8gY2hpbGRJbmRleEFzUGVyc29uSXMgOiBjaGlsZEluZGV4QXNQZXJzb25UbztcblxuICAvKipcbiAgICogSWYgcGVyc29uSXMgaXMgbm90IGluIHJlbGF0aW9uc2hpcFxuICAgKiBhbmQgY2hpbGQgZnJvbSBwcmV2aW91cyByZWxhdGlvbnNoaXAgaXMgYSBjaGlsZCBpbiB0aGlzIHJlbGF0aW9uc2hpcFxuICAgKi9cbiAgcmV0dXJuICFpc0luUmVsYXRpb25zaGlwKG5vdFBhcmVudElkLCByZWxhdGlvbnNoaXApICYmIGlzQUNoaWxkSW5SZWxhdGlvbnNoaXAoY2hpbGRyZW5JZHNbY2hpbGRJbmRleF0sIHJlbGF0aW9uc2hpcCk7XG59XG5cbmZ1bmN0aW9uIGlzUmVsYXRpb25zaGlwVHlwZShyZWxhdGlvbnNoaXBUeXBlLCByZWxhdGlvbnNoaXApIHtcbiAgdmFyIHR5cGVPZlJlbGF0aW9uc2hpcCA9IHJlbGF0aW9uc2hpcERlc2NyaXB0aW9uTWFwW3JlbGF0aW9uc2hpcC5wZXJzb25Jc0Rlc2NyaXB0aW9uXS50eXBlLmlkO1xuXG4gIC8qKlxuICAgKiByZWxhdGlvbnNoaXBUeXBlIGNhbiBiZSBhbiBhcnJheSBvZiB0eXBlc1xuICAgKi9cbiAgcmV0dXJuIF8kMS5pc0FycmF5KHJlbGF0aW9uc2hpcFR5cGUpID8gISFfJDEuZmluZChyZWxhdGlvbnNoaXBUeXBlLCBmdW5jdGlvbiAoclR5cGUpIHtcbiAgICByZXR1cm4gclR5cGUgPT09IHR5cGVPZlJlbGF0aW9uc2hpcDtcbiAgfSkgOiB0eXBlT2ZSZWxhdGlvbnNoaXAgPT09IHJlbGF0aW9uc2hpcFR5cGU7XG59XG5cbmZ1bmN0aW9uIGlzUmVsYXRpb25zaGlwSW5mZXJyZWQocmVsYXRpb25zaGlwKSB7XG4gIHJldHVybiByZWxhdGlvbnNoaXAuaW5mZXJyZWQ7XG59XG5cbi8qKlxuICogUmV0cmlldmUgcGVvcGxlIGJ5IHJvbGUgaW4gcmVsYXRpb25zaGlwc1xuICovXG5mdW5jdGlvbiBnZXRQYXJlbnRJZEZyb21SZWxhdGlvbnNoaXAocmVsYXRpb25zaGlwKSB7XG4gIHZhciBwYXJlbnRJZCA9IHZvaWQgMDtcblxuICBpZiAocmVsYXRpb25zaGlwLnBlcnNvbklzRGVzY3JpcHRpb24gPT09ICdtb3RoZXItZmF0aGVyJykge1xuICAgIHBhcmVudElkID0gcmVsYXRpb25zaGlwLnBlcnNvbklzSWQ7XG4gIH1cblxuICBpZiAocmVsYXRpb25zaGlwLnBlcnNvbklzRGVzY3JpcHRpb24gPT09ICdzb24tZGF1Z2h0ZXInKSB7XG4gICAgcGFyZW50SWQgPSByZWxhdGlvbnNoaXAucGVyc29uVG9JZDtcbiAgfVxuXG4gIGlmICghcGFyZW50SWQpIHtcbiAgICBjb25zb2xlLmxvZygnUGFyZW50IG5vdCBmb3VuZCBpbiByZWxhdGlvbnNoaXA6ICcsIHJlbGF0aW9uc2hpcCk7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcmV0dXJuIHBhcmVudElkO1xufVxuXG5mdW5jdGlvbiBnZXRDaGlsZElkRnJvbVJlbGF0aW9uc2hpcChyZWxhdGlvbnNoaXApIHtcbiAgdmFyIGNoaWxkSWQgPSB2b2lkIDA7XG5cbiAgaWYgKHJlbGF0aW9uc2hpcC5wZXJzb25Jc0Rlc2NyaXB0aW9uID09PSAnbW90aGVyLWZhdGhlcicpIHtcbiAgICBjaGlsZElkID0gcmVsYXRpb25zaGlwLnBlcnNvblRvSWQ7XG4gIH1cblxuICBpZiAocmVsYXRpb25zaGlwLnBlcnNvbklzRGVzY3JpcHRpb24gPT09ICdzb24tZGF1Z2h0ZXInKSB7XG4gICAgY2hpbGRJZCA9IHJlbGF0aW9uc2hpcC5wZXJzb25Jc0lkO1xuICB9XG5cbiAgaWYgKCFjaGlsZElkKSB7XG4gICAgY29uc29sZS5sb2coJ0NoaWxkIG5vdCBmb3VuZCBpbiByZWxhdGlvbnNoaXA6ICcsIHJlbGF0aW9uc2hpcCk7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcmV0dXJuIGNoaWxkSWQ7XG59XG5cbmZ1bmN0aW9uIGdldFNpYmxpbmdJZEZyb21SZWxhdGlvbnNoaXAocGVyc29uSWQsIHJlbGF0aW9uc2hpcCkge1xuICBpZiAoIWlzSW5SZWxhdGlvbnNoaXAocGVyc29uSWQsIHJlbGF0aW9uc2hpcCkpIHtcbiAgICBjb25zb2xlLmxvZygnUGVyc29uICcgKyBwZXJzb25JZCArICcgbm90IGZvdW5kIGluIHJlbGF0aW9uc2hpcDogJywgcmVsYXRpb25zaGlwKTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICByZXR1cm4gcmVsYXRpb25zaGlwW3JlbGF0aW9uc2hpcC5wZXJzb25Jc0lkID09PSBwZXJzb25JZCA/ICdwZXJzb25Ub0lkJyA6ICdwZXJzb25Jc0lkJ107XG59XG5cbmZ1bmN0aW9uIGdldE90aGVyUGVyc29uSWRGcm9tUmVsYXRpb25zaGlwKHBlcnNvbklkLCByZWxhdGlvbnNoaXApIHtcbiAgcmV0dXJuIHJlbGF0aW9uc2hpcC5wZXJzb25Jc0lkID09PSBwZXJzb25JZCA/IHJlbGF0aW9uc2hpcC5wZXJzb25Ub0lkIDogcmVsYXRpb25zaGlwLnBlcnNvbklzSWQ7XG59XG5cbmZ1bmN0aW9uIGdldEFsbFBhcmVudHNPZihwZXJzb25JZCkge1xuICByZXR1cm4gZ2V0QWxsUmVsYXRpb25zaGlwcygpLmZpbHRlcihpc0FDaGlsZEluUmVsYXRpb25zaGlwLmJpbmQobnVsbCwgcGVyc29uSWQpKS5tYXAoZnVuY3Rpb24gKHJlbGF0aW9uc2hpcCkge1xuICAgIHJldHVybiBnZXRQZXJzb25Gcm9tTWVtYmVyKGdldEhvdXNlaG9sZE1lbWJlckJ5UGVyc29uSWQoZ2V0UGFyZW50SWRGcm9tUmVsYXRpb25zaGlwKHJlbGF0aW9uc2hpcCkpKTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGdldEFsbENoaWxkcmVuT2YocGVyc29uSWQpIHtcbiAgcmV0dXJuIGdldEFsbFJlbGF0aW9uc2hpcHMoKS5maWx0ZXIoaXNBUGFyZW50SW5SZWxhdGlvbnNoaXAuYmluZChudWxsLCBwZXJzb25JZCkpLm1hcChmdW5jdGlvbiAocmVsYXRpb25zaGlwKSB7XG4gICAgcmV0dXJuIGdldEhvdXNlaG9sZE1lbWJlckJ5UGVyc29uSWQoZ2V0Q2hpbGRJZEZyb21SZWxhdGlvbnNoaXAocmVsYXRpb25zaGlwKSlbJ0BwZXJzb24nXTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGdldFBlcnNvbklkRnJvbVBlcnNvbihwZXJzb24kJDEpIHtcbiAgcmV0dXJuIHBlcnNvbiQkMS5pZDtcbn1cblxuZnVuY3Rpb24gZ2V0UGVyc29uRnJvbU1lbWJlcihtZW1iZXIpIHtcbiAgcmV0dXJuIG1lbWJlclsnQHBlcnNvbiddO1xufVxuXG4vKipcbiAqIE1pc3NpbmcgcmVsYXRpb25zaGlwIGluZmVyZW5jZVxuICovXG52YXIgbWlzc2luZ1JlbGF0aW9uc2hpcEluZmVyZW5jZSA9IHtcbiAgc2libGluZ3NPZjogZnVuY3Rpb24gc2libGluZ3NPZihzdWJqZWN0TWVtYmVyKSB7XG5cbiAgICB2YXIgbWlzc2luZ1JlbGF0aW9uc2hpcHMgPSBbXSxcbiAgICAgICAgYWxsUmVsYXRpb25zaGlwcyA9IGdldEFsbFJlbGF0aW9uc2hpcHMoKSxcbiAgICAgICAgcGVyc29uJCQxID0gZ2V0UGVyc29uRnJvbU1lbWJlcihzdWJqZWN0TWVtYmVyKSxcbiAgICAgICAgcGVyc29uSWQgPSBwZXJzb24kJDEuaWQsXG4gICAgICAgIHBhcmVudHMgPSBnZXRBbGxQYXJlbnRzT2YocGVyc29uSWQpLFxuICAgICAgICBzaWJsaW5nSWRzID0gYWxsUmVsYXRpb25zaGlwcy5maWx0ZXIoaXNBU2libGluZ0luUmVsYXRpb25zaGlwLmJpbmQobnVsbCwgcGVyc29uSWQpKS5tYXAoZ2V0U2libGluZ0lkRnJvbVJlbGF0aW9uc2hpcC5iaW5kKG51bGwsIHBlcnNvbklkKSk7XG5cbiAgICAvKipcbiAgICAgKiBJZiAyIHBhcmVudCByZWxhdGlvbnNoaXBzIG9mICdwZXJzb24nIGFyZSBmb3VuZCB3ZSBjYW4gYXR0ZW1wdCB0byBpbmZlclxuICAgICAqIHNpYmxpbmcgcmVsYXRpb25zaGlwc1xuICAgICAqL1xuICAgIGlmIChwYXJlbnRzLmxlbmd0aCA9PT0gMikge1xuXG4gICAgICBnZXRBbGxIb3VzZWhvbGRNZW1iZXJzKCkuZmlsdGVyKGlzSG91c2Vob2xkTWVtYmVyKS5mb3JFYWNoKGZ1bmN0aW9uIChtZW1iZXIpIHtcblxuICAgICAgICB2YXIgbWVtYmVyUGVyc29uSWQgPSBtZW1iZXJbJ0BwZXJzb24nXS5pZDtcblxuICAgICAgICAvKipcbiAgICAgICAgICogR3VhcmRcbiAgICAgICAgICogSWYgbWVtYmVyIGlzIHRoZSBzdWJqZWN0IG1lbWJlclxuICAgICAgICAgKiBvciBtZW1iZXIgaXMgYSBwYXJlbnRcbiAgICAgICAgICogb3IgbWVtYmVyIGFscmVhZHkgaGFzIGEgc2libGluZyByZWxhdGlvbnNoaXAgd2l0aCAncGVyc29uJ1xuICAgICAgICAgKiBza2lwIG1lbWJlclxuICAgICAgICAgKi9cbiAgICAgICAgaWYgKG1lbWJlclBlcnNvbklkID09PSBwZXJzb25JZCB8fCBtZW1iZXJQZXJzb25JZCA9PT0gcGFyZW50c1swXS5pZCB8fCBtZW1iZXJQZXJzb25JZCA9PT0gcGFyZW50c1sxXS5pZCB8fCBzaWJsaW5nSWRzLmluZGV4T2YobWVtYmVyUGVyc29uSWQpID4gLTEpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgbWVtYmVyUGFyZW50cyA9IGdldEFsbFBhcmVudHNPZihtZW1iZXJQZXJzb25JZCk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIElmIDIgcGFyZW50cyBvZiAnbWVtYmVyJyBhcmUgZm91bmRcbiAgICAgICAgICogYW5kIHRoZXkgYXJlIHRoZSBzYW1lIHBhcmVudHMgb2YgJ3BlcnNvbidcbiAgICAgICAgICogd2UgaGF2ZSBpZGVudGlmaWVkIGEgbWlzc2luZyBpbmZlcnJlZCByZWxhdGlvbnNoaXBcbiAgICAgICAgICovXG4gICAgICAgIGlmIChtZW1iZXJQYXJlbnRzLmxlbmd0aCA9PT0gMiAmJiBfJDEuZGlmZmVyZW5jZShwYXJlbnRzLm1hcChnZXRQZXJzb25JZEZyb21QZXJzb24pLCBtZW1iZXJQYXJlbnRzLm1hcChnZXRQZXJzb25JZEZyb21QZXJzb24pKS5sZW5ndGggPT09IDApIHtcblxuICAgICAgICAgIC8qKlxuICAgICAgICAgICAqIEFkZCB0byBtaXNzaW5nUmVsYXRpb25zaGlwc1xuICAgICAgICAgICAqL1xuICAgICAgICAgIG1pc3NpbmdSZWxhdGlvbnNoaXBzLnB1c2gocmVsYXRpb25zaGlwKCdicm90aGVyLXNpc3RlcicsIHBlcnNvbklkLCBtZW1iZXJQZXJzb25JZCwge1xuICAgICAgICAgICAgaW5mZXJyZWQ6IHRydWUsXG4gICAgICAgICAgICBpbmZlcnJlZEJ5OiBbXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIE11c3QgYmUgNCByZWxhdGlvbnNoaXBzXG4gICAgICAgICAgICAgKiBDb3VsZCBoYXZlIHVzZWQgbWVtYmVyJ3MgcGFyZW50cyBidXQgd2UgY2FuIGFzc3VtZSB0aGV5XG4gICAgICAgICAgICAgKiBtdXN0IGJlIHRoZSBzYW1lIGF0IHRoaXMgcG9pbnQgb3IgdGhlIGluZmVycmVuY2VcbiAgICAgICAgICAgICAqIGNvdWxkbid0IGhhcHBlbi5cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgZ2V0UmVsYXRpb25zaGlwT2YocGVyc29uSWQsIHBhcmVudHNbMF0uaWQpLmlkLCBnZXRSZWxhdGlvbnNoaXBPZihwZXJzb25JZCwgcGFyZW50c1sxXS5pZCkuaWQsIGdldFJlbGF0aW9uc2hpcE9mKG1lbWJlclBlcnNvbklkLCBwYXJlbnRzWzBdLmlkKS5pZCwgZ2V0UmVsYXRpb25zaGlwT2YobWVtYmVyUGVyc29uSWQsIHBhcmVudHNbMV0uaWQpLmlkXVxuICAgICAgICAgIH0pKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG1pc3NpbmdSZWxhdGlvbnNoaXBzO1xuICB9XG59O1xuXG5mdW5jdGlvbiBpbmZlclJlbGF0aW9uc2hpcHMocmVsYXRpb25zaGlwLCBwZXJzb25JcywgcGVyc29uVG8pIHtcbiAgdmFyIG1pc3NpbmdSZWxhdGlvbnNoaXBzID0gW107XG5cbiAgaWYgKHJlbGF0aW9uc2hpcC5wZXJzb25Jc0Rlc2NyaXB0aW9uID09PSAnbW90aGVyLWZhdGhlcicpIHtcbiAgICBtaXNzaW5nUmVsYXRpb25zaGlwcyA9IG1pc3NpbmdSZWxhdGlvbnNoaXBzLmNvbmNhdChtaXNzaW5nUmVsYXRpb25zaGlwSW5mZXJlbmNlLnNpYmxpbmdzT2YocGVyc29uVG8pKTtcbiAgfVxuXG4gIGlmIChyZWxhdGlvbnNoaXAucGVyc29uSXNEZXNjcmlwdGlvbiA9PT0gJ3Nvbi1kYXVnaHRlcicpIHtcbiAgICBtaXNzaW5nUmVsYXRpb25zaGlwcyA9IG1pc3NpbmdSZWxhdGlvbnNoaXBzLmNvbmNhdChtaXNzaW5nUmVsYXRpb25zaGlwSW5mZXJlbmNlLnNpYmxpbmdzT2YocGVyc29uSXMpKTtcbiAgfVxuXG4gICQuZWFjaChtaXNzaW5nUmVsYXRpb25zaGlwcywgZnVuY3Rpb24gKGksIHJlbGF0aW9uc2hpcCkge1xuICAgIGFkZFJlbGF0aW9uc2hpcChyZWxhdGlvbnNoaXApO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gZmluZE5leHRNaXNzaW5nUmVsYXRpb25zaGlwKCkge1xuICB2YXIgaG91c2Vob2xkTWVtYmVycyA9IGdldEFsbEhvdXNlaG9sZE1lbWJlcnMoKS5maWx0ZXIoaXNIb3VzZWhvbGRNZW1iZXIpLFxuICAgICAgcmVsYXRpb25zaGlwcyA9IGdldEFsbFJlbGF0aW9uc2hpcHMoKSxcbiAgICAgIG1pc3NpbmdSZWxhdGlvbnNoaXBNZW1iZXJzID0gW10sXG4gICAgICBwZXJzb25JcyA9IG51bGw7XG5cbiAgLyoqXG4gICAqIEZpbmQgdGhlIG5leHQgbWlzc2luZyByZWxhdGlvbnNoaXBcbiAgICovXG4gICQuZWFjaChob3VzZWhvbGRNZW1iZXJzLCBmdW5jdGlvbiAoaSwgbWVtYmVyKSB7XG4gICAgdmFyIHBlcnNvbklkID0gbWVtYmVyWydAcGVyc29uJ10uaWQ7XG5cbiAgICAvKipcbiAgICAgKiBHZXQgYWxsIHJlbGF0aW9uc2hpcHMgZm9yIHRoaXMgbWVtYmVyXG4gICAgICovXG4gICAgdmFyIG1lbWJlclJlbGF0aW9uc2hpcHMgPSByZWxhdGlvbnNoaXBzLmZpbHRlcihmdW5jdGlvbiAocmVsYXRpb25zaGlwKSB7XG4gICAgICByZXR1cm4gcmVsYXRpb25zaGlwLnBlcnNvbklzSWQgPT09IHBlcnNvbklkIHx8IHJlbGF0aW9uc2hpcC5wZXJzb25Ub0lkID09PSBwZXJzb25JZDtcbiAgICB9KSxcbiAgICAgICAgbWVtYmVyUmVsYXRpb25zaGlwVG9JZHMgPSBtZW1iZXJSZWxhdGlvbnNoaXBzLm1hcChmdW5jdGlvbiAocmVsYXRpb25zaGlwKSB7XG4gICAgICByZXR1cm4gcmVsYXRpb25zaGlwLnBlcnNvbklzSWQgPT09IHBlcnNvbklkID8gcmVsYXRpb25zaGlwLnBlcnNvblRvSWQgOiByZWxhdGlvbnNoaXAucGVyc29uSXNJZDtcbiAgICB9KSB8fCBbXTtcblxuICAgIC8qKlxuICAgICAqIElmIHRvdGFsIHJlbGF0aW9uc2hpcHMgcmVsYXRlZCB0byB0aGlzIG1lbWJlciBpc24ndCBlcXVhbCB0b1xuICAgICAqIHRvdGFsIGhvdXNlaG9sZCBtZW1iZXJzIC0xLCBpbmRpY2F0ZXMgbWlzc2luZyByZWxhdGlvbnNoaXBcbiAgICAgKi9cbiAgICBpZiAobWVtYmVyUmVsYXRpb25zaGlwcy5sZW5ndGggPCBob3VzZWhvbGRNZW1iZXJzLmxlbmd0aCAtIDEpIHtcblxuICAgICAgLyoqXG4gICAgICAgKiBBbGwgbWlzc2luZyByZWxhdGlvbnNoaXAgbWVtYmVyc1xuICAgICAgICovXG4gICAgICBtaXNzaW5nUmVsYXRpb25zaGlwTWVtYmVycyA9IGhvdXNlaG9sZE1lbWJlcnMuZmlsdGVyKGZ1bmN0aW9uIChtKSB7XG4gICAgICAgIHJldHVybiBtZW1iZXJSZWxhdGlvbnNoaXBUb0lkcy5pbmRleE9mKG1bJ0BwZXJzb24nXS5pZCkgPT09IC0xICYmIG1bJ0BwZXJzb24nXS5pZCAhPT0gcGVyc29uSWQ7XG4gICAgICB9KTtcblxuICAgICAgcGVyc29uSXMgPSBtZW1iZXI7XG5cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiBwZXJzb25JcyA/IHtcbiAgICBwZXJzb25JczogcGVyc29uSXMsXG4gICAgcGVyc29uVG86IG1pc3NpbmdSZWxhdGlvbnNoaXBNZW1iZXJzWzBdXG4gIH0gOiBudWxsO1xufVxuXG5mdW5jdGlvbiBnZXRQZW9wbGVJZHNNaXNzaW5nUmVsYXRpb25zaGlwc1dpdGhQZXJzb24ocGVyc29uSWQpIHtcbiAgdmFyIHJlbWFpbmluZ1BlcnNvbklkcyA9IGdldEFsbEhvdXNlaG9sZE1lbWJlcnMoKS5maWx0ZXIoaXNIb3VzZWhvbGRNZW1iZXIpLm1hcChmdW5jdGlvbiAobWVtYmVyKSB7XG4gICAgcmV0dXJuIG1lbWJlclsnQHBlcnNvbiddLmlkO1xuICB9KTtcblxuICAvKipcbiAgICogUmVtb3ZlIHRoaXMgcGVyc29uIGZyb20gdGhlIGxpc3RcbiAgICovXG4gIHJlbW92ZUZyb21MaXN0KHJlbWFpbmluZ1BlcnNvbklkcywgcGVyc29uSWQpO1xuXG4gICQuZWFjaChnZXRBbGxSZWxhdGlvbnNoaXBzKCksIGZ1bmN0aW9uIChpLCByZWxhdGlvbnNoaXApIHtcbiAgICBpZiAoIWlzSW5SZWxhdGlvbnNoaXAocGVyc29uSWQsIHJlbGF0aW9uc2hpcCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZW1vdmUgdGhlIG90aGVyIHBlcnNvbiBmcm9tIHRoZSByZW1haW5pbmdQZXJzb25JZHMgbGlzdFxuICAgICAqL1xuICAgIHJlbW92ZUZyb21MaXN0KHJlbWFpbmluZ1BlcnNvbklkcywgZ2V0T3RoZXJQZXJzb25JZEZyb21SZWxhdGlvbnNoaXAocGVyc29uSWQsIHJlbGF0aW9uc2hpcCkpO1xuICB9KTtcblxuICByZXR1cm4gcmVtYWluaW5nUGVyc29uSWRzO1xufVxuXG5mdW5jdGlvbiBnZXRSZWxhdGlvbnNoaXBUeXBlKHJlbGF0aW9uc2hpcCkge1xuICByZXR1cm4gcmVsYXRpb25zaGlwRGVzY3JpcHRpb25NYXBbcmVsYXRpb25zaGlwLnBlcnNvbklzRGVzY3JpcHRpb25dLnR5cGU7XG59XG5cbi8qKlxuICogUmV0cmlldmUgZnJvbSByZWxhdGlvbnNoaXAgZ3JvdXBcbiAqL1xuZnVuY3Rpb24gZ2V0UmVsYXRpb25zaGlwc1dpdGhQZXJzb25JZHMocmVsYXRpb25zaGlwcywgaWRBcnIpIHtcbiAgcmV0dXJuIHJlbGF0aW9uc2hpcHMuZmlsdGVyKGZ1bmN0aW9uIChjaGlsZFJlbGF0aW9uc2hpcCkge1xuICAgIHJldHVybiBpZEFyci5pbmRleE9mKGNoaWxkUmVsYXRpb25zaGlwLnBlcnNvbklzSWQpICE9PSAtMSB8fCBpZEFyci5pbmRleE9mKGNoaWxkUmVsYXRpb25zaGlwLnBlcnNvblRvSWQpICE9PSAtMTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGdldFJlbGF0aW9uc2hpcE9mKHBlcnNvbjEsIHBlcnNvbjIpIHtcbiAgcmV0dXJuIGdldEFsbFJlbGF0aW9uc2hpcHMoKS5maW5kKGZ1bmN0aW9uIChyZWxhdGlvbnNoaXApIHtcbiAgICByZXR1cm4gaXNJblJlbGF0aW9uc2hpcChwZXJzb24xLCByZWxhdGlvbnNoaXApICYmIGlzSW5SZWxhdGlvbnNoaXAocGVyc29uMiwgcmVsYXRpb25zaGlwKTtcbiAgfSk7XG59XG5cbnZhciBQRVJTT05BTF9ERVRBSUxTX0tFWSA9ICdpbmRpdmlkdWFsLWRldGFpbHMnO1xudmFyIFBFUlNPTkFMX1BJTlNfS0VZID0gJ2luZGl2aWR1YWwtcGlucyc7XG5cbnZhciBwZXJzb25hbERldGFpbHNNYXJpdGFsU3RhdHVzTWFwID0ge1xuICAnbmV2ZXInOiB7XG4gICAgZGVzY3JpcHRpb246ICdOZXZlciBtYXJyaWVkIGFuZCBuZXZlciByZWdpc3RlcmVkIGEgc2FtZS1zZXggY2l2aWwnICsgJyBwYXJ0bmVyc2hpcCdcbiAgfSxcbiAgJ21hcnJpZWQnOiB7XG4gICAgZGVzY3JpcHRpb246ICdNYXJyaWVkJ1xuICB9LFxuICAncmVnaXN0ZXJlZCc6IHtcbiAgICBkZXNjcmlwdGlvbjogJ0luIGEgcmVnaXN0ZXJlZCBzYW1lLXNleCBjaXZpbCBwYXJ0bmVyc2hpcCdcbiAgfSxcbiAgJ3NlcGFyYXRlZC1tYXJyaWVkJzoge1xuICAgIGRlc2NyaXB0aW9uOiAnU2VwYXJhdGVkLCBidXQgc3RpbGwgbGVnYWxseSBtYXJyaWVkJ1xuICB9LFxuICAnZGl2b3JjZWQnOiB7XG4gICAgZGVzY3JpcHRpb246ICdEaXZvcmNlZCdcbiAgfSxcbiAgJ2Zvcm1lci1wYXJ0bmVyc2hpcCc6IHtcbiAgICBkZXNjcmlwdGlvbjogJ0Zvcm1lcmx5IGluIGEgc2FtZS1zZXggY2l2aWwgcGFydG5lcnNoaXAgd2hpY2ggaXMgbm93JyArICcgbGVnYWxseSBkaXNzb2x2ZWQnXG4gIH0sXG4gICd3aWRvd2VkJzoge1xuICAgIGRlc2NyaXB0aW9uOiAnV2lkb3dlZCdcbiAgfSxcbiAgJ3N1cnZpdmluZy1wYXJ0bmVyJzoge1xuICAgIGRlc2NyaXB0aW9uOiAnU3Vydml2aW5nIHBhcnRuZXIgZnJvbSBhIHNhbWUtc2V4IGNpdmlsIHBhcnRuZXJzaGlwJ1xuICB9LFxuICAnc2VwYXJhdGVkLXBhcnRuZXJzaGlwJzoge1xuICAgIGRlc2NyaXB0aW9uOiAnU2VwYXJhdGVkLCBidXQgc3RpbGwgbGVnYWxseSBpbiBhIHNhbWUtc2V4IGNpdmlsIHBhcnRuZXJzaGlwJ1xuICB9XG59O1xuXG52YXIgcGVyc29uYWxEZXRhaWxzQ291bnRyeU1hcCA9IHtcbiAgJ2VuZ2xhbmQnOiB7XG4gICAgZGVzY3JpcHRpb246ICdFbmdsYW5kJ1xuICB9LFxuICAnd2FsZXMnOiB7XG4gICAgZGVzY3JpcHRpb246ICdXYWxlcydcbiAgfSxcbiAgJ3Njb3RsYW5kJzoge1xuICAgIGRlc2NyaXB0aW9uOiAnU2NvdGxhbmQnXG4gIH0sXG4gICdub3J0aGVybi1pcmVsYW5kJzoge1xuICAgIGRlc2NyaXB0aW9uOiAnTm9ydGhlcm4gSXJlbGFuZCdcbiAgfSxcbiAgJ3JlcHVibGljLWlyZWxhbmQnOiB7XG4gICAgZGVzY3JpcHRpb246ICdSZXB1YmxpYyBvZiBJcmVsYW5kJ1xuICB9LFxuICAnZWxzZXdoZXJlJzoge1xuICAgIGRlc2NyaXB0aW9uOiAnRWxzZXdoZXJlJ1xuICB9XG59O1xuXG52YXIgcGVyc29uYWxEZXRhaWxzT3JpZW50YXRpb25NYXAgPSB7XG4gICdzdHJhaWdodCc6IHtcbiAgICBkZXNjcmlwdGlvbjogJ1N0cmFpZ2h0IG9yIEhldGVyb3NleHVhbCdcbiAgfSxcbiAgJ2dheSc6IHtcbiAgICBkZXNjcmlwdGlvbjogJ0dheSBvciBMZXNiaWFuJ1xuICB9LFxuICAnYmlzZXh1YWwnOiB7XG4gICAgZGVzY3JpcHRpb246ICdCaXNleHVhbCdcbiAgfSxcbiAgJ290aGVyJzoge1xuICAgIGRlc2NyaXB0aW9uOiAnT3RoZXInXG4gIH0sXG4gICduby1zYXknOiB7XG4gICAgZGVzY3JpcHRpb246ICdQcmVmZXIgbm90IHRvIHNheSdcbiAgfVxufTtcblxuZnVuY3Rpb24gYWRkVXBkYXRlUGVyc29uYWxEZXRhaWxzRE9CKHBlcnNvbklkLCBkYXksIG1vbnRoLCB5ZWFyKSB7XG4gIHZhciBhbGxEZXRhaWxzID0gZ2V0QWxsUGVyc29uYWxEZXRhaWxzKCksXG4gICAgICBkZXRhaWxzID0gYWxsRGV0YWlsc1twZXJzb25JZF0gfHwge307XG5cbiAgZGV0YWlsc1snZG9iJ10gPSB7XG4gICAgZGF5OiBkYXksXG4gICAgbW9udGg6IG1vbnRoLFxuICAgIHllYXI6IHllYXJcbiAgfTtcblxuICB1cGRhdGVQZXJzb25hbERldGFpbHMocGVyc29uSWQsIGRldGFpbHMpO1xuXG4gIHJldHVybiBkZXRhaWxzO1xufVxuXG5mdW5jdGlvbiBhZGRVcGRhdGVNYXJpdGFsU3RhdHVzKHBlcnNvbklkLCB2YWwpIHtcbiAgdmFyIGFsbERldGFpbHMgPSBnZXRBbGxQZXJzb25hbERldGFpbHMoKSxcbiAgICAgIGRldGFpbHMgPSBhbGxEZXRhaWxzW3BlcnNvbklkXSB8fCB7fTtcblxuICBkZXRhaWxzWydtYXJpdGFsU3RhdHVzJ10gPSB2YWw7XG5cbiAgdXBkYXRlUGVyc29uYWxEZXRhaWxzKHBlcnNvbklkLCBkZXRhaWxzKTtcblxuICByZXR1cm4gZGV0YWlscztcbn1cblxuZnVuY3Rpb24gYWRkVXBkYXRlQ291bnRyeShwZXJzb25JZCwgdmFsKSB7XG4gIHZhciBhbGxEZXRhaWxzID0gZ2V0QWxsUGVyc29uYWxEZXRhaWxzKCksXG4gICAgICBkZXRhaWxzID0gYWxsRGV0YWlsc1twZXJzb25JZF0gfHwge307XG5cbiAgZGV0YWlsc1snY291bnRyeSddID0gdmFsO1xuXG4gIHVwZGF0ZVBlcnNvbmFsRGV0YWlscyhwZXJzb25JZCwgZGV0YWlscyk7XG5cbiAgcmV0dXJuIGRldGFpbHM7XG59XG5cbmZ1bmN0aW9uIGFkZFVwZGF0ZU9yaWVudGF0aW9uKHBlcnNvbklkLCB2YWwpIHtcbiAgdmFyIGFsbERldGFpbHMgPSBnZXRBbGxQZXJzb25hbERldGFpbHMoKSxcbiAgICAgIGRldGFpbHMgPSBhbGxEZXRhaWxzW3BlcnNvbklkXSB8fCB7fTtcblxuICBkZXRhaWxzWydvcmllbnRhdGlvbiddID0gdmFsO1xuXG4gIHVwZGF0ZVBlcnNvbmFsRGV0YWlscyhwZXJzb25JZCwgZGV0YWlscyk7XG5cbiAgcmV0dXJuIGRldGFpbHM7XG59XG5cbmZ1bmN0aW9uIGFkZFVwZGF0ZVNhbGFyeShwZXJzb25JZCwgdmFsKSB7XG4gIHZhciBhbGxEZXRhaWxzID0gZ2V0QWxsUGVyc29uYWxEZXRhaWxzKCksXG4gICAgICBkZXRhaWxzID0gYWxsRGV0YWlsc1twZXJzb25JZF0gfHwge307XG5cbiAgZGV0YWlsc1snc2FsYXJ5J10gPSB2YWw7XG5cbiAgdXBkYXRlUGVyc29uYWxEZXRhaWxzKHBlcnNvbklkLCBkZXRhaWxzKTtcblxuICByZXR1cm4gZGV0YWlscztcbn1cblxuZnVuY3Rpb24gZ2V0UGlucygpIHtcbiAgcmV0dXJuIEpTT04ucGFyc2Uoc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbShQRVJTT05BTF9QSU5TX0tFWSkpIHx8IHt9O1xufVxuXG5mdW5jdGlvbiBjcmVhdGVQaW5Gb3IocGVyc29uSWQpIHtcbiAgdmFyIG9wdHMgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IHt9O1xuXG4gIHZhciBwaW5zID0gZ2V0UGlucygpO1xuXG4gIHBpbnNbcGVyc29uSWRdID0ge1xuICAgIHBpbjogXy5yYW5kb20oMTAwMDAsIDk5OTk5KSxcbiAgICBleHBvcnRlZDogISFvcHRzLmV4cG9ydGVkXG4gIH07XG5cbiAgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbShQRVJTT05BTF9QSU5TX0tFWSwgSlNPTi5zdHJpbmdpZnkocGlucykpO1xuXG4gIHJldHVybiBwaW5zW3BlcnNvbklkXTtcbn1cblxuZnVuY3Rpb24gZ2V0UGluRm9yKHBlcnNvbklkKSB7XG4gIHJldHVybiBnZXRQaW5zKClbcGVyc29uSWRdO1xufVxuXG5mdW5jdGlvbiB1bnNldFBpbkZvcihwZXJzb25JZCkge1xuICB2YXIgcGlucyA9IGdldFBpbnMoKTtcblxuICBkZWxldGUgcGluc1twZXJzb25JZF07XG5cbiAgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbShQRVJTT05BTF9QSU5TX0tFWSwgSlNPTi5zdHJpbmdpZnkocGlucykpO1xufVxuXG5mdW5jdGlvbiB1cGRhdGVQZXJzb25hbERldGFpbHMocGVyc29uSWQsIGRldGFpbHMpIHtcbiAgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbShQRVJTT05BTF9ERVRBSUxTX0tFWSwgSlNPTi5zdHJpbmdpZnkoX2V4dGVuZHMoe30sIGdldEFsbFBlcnNvbmFsRGV0YWlscygpLCBkZWZpbmVQcm9wZXJ0eSh7fSwgcGVyc29uSWQsIGRldGFpbHMpKSkpO1xuXG4gIHJldHVybiBkZXRhaWxzO1xufVxuXG5mdW5jdGlvbiBnZXRBbGxQZXJzb25hbERldGFpbHMoKSB7XG4gIHJldHVybiBKU09OLnBhcnNlKHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oUEVSU09OQUxfREVUQUlMU19LRVkpKSB8fCB7fTtcbn1cblxuZnVuY3Rpb24gZ2V0UGVyc29uYWxEZXRhaWxzRm9yKHBlcnNvbklkKSB7XG4gIHZhciBzdG9yYWdlT2JqID0gSlNPTi5wYXJzZShzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKFBFUlNPTkFMX0RFVEFJTFNfS0VZKSkgfHwge30sXG4gICAgICBwZXJzb25PYmogPSBzdG9yYWdlT2JqW3BlcnNvbklkXTtcblxuICBpZiAoIXBlcnNvbk9iaikge1xuICAgIGNvbnNvbGUubG9nKCdQZXJzb25hbCBkZXRhaWxzIGZvciAnICsgcGVyc29uSWQgKyAnIG5vdCBmb3VuZCcpO1xuICB9XG5cbiAgcmV0dXJuIHBlcnNvbk9iajtcbn1cblxuLyoqXG4gKiBDb3BpZWQgZnJvbTpcbiAqIGh0dHBzOi8vY29kZXJldmlldy5zdGFja2V4Y2hhbmdlLmNvbS9xdWVzdGlvbnMvOTAzNDkvY2hhbmdpbmctbnVtYmVyLXRvLXdvcmRzLWluLWphdmFzY3JpcHRcbiAqID09PT09PT09PT09PT09PVxuICovXG52YXIgT05FX1RPX05JTkVURUVOID0gWydvbmUnLCAndHdvJywgJ3RocmVlJywgJ2ZvdXInLCAnZml2ZScsICdzaXgnLCAnc2V2ZW4nLCAnZWlnaHQnLCAnbmluZScsICd0ZW4nLCAnZWxldmVuJywgJ3R3ZWx2ZScsICd0aGlydGVlbicsICdmb3VydGVlbicsICdmaWZ0ZWVuJywgJ3NpeHRlZW4nLCAnc2V2ZW50ZWVuJywgJ2VpZ2h0ZWVuJywgJ25pbmV0ZWVuJ107XG5cbnZhciBURU5TID0gWyd0ZW4nLCAndHdlbnR5JywgJ3RoaXJ0eScsICdmb3J0eScsICdmaWZ0eScsICdzaXh0eScsICdzZXZlbnR5JywgJ2VpZ2h0eScsICduaW5ldHknXTtcblxudmFyIFNDQUxFUyA9IFsndGhvdXNhbmQnLCAnbWlsbGlvbicsICdiaWxsaW9uJywgJ3RyaWxsaW9uJ107XG5cbi8vIGhlbHBlciBmdW5jdGlvbiBmb3IgdXNlIHdpdGggQXJyYXkuZmlsdGVyXG5mdW5jdGlvbiBpc1RydXRoeShpdGVtKSB7XG4gIHJldHVybiAhIWl0ZW07XG59XG5cbi8vIGNvbnZlcnQgYSBudW1iZXIgaW50byAnY2h1bmtzJyBvZiAwLTk5OVxuZnVuY3Rpb24gY2h1bmsobnVtYmVyKSB7XG4gIHZhciB0aG91c2FuZHMgPSBbXTtcblxuICB3aGlsZSAobnVtYmVyID4gMCkge1xuICAgIHRob3VzYW5kcy5wdXNoKG51bWJlciAlIDEwMDApO1xuICAgIG51bWJlciA9IE1hdGguZmxvb3IobnVtYmVyIC8gMTAwMCk7XG4gIH1cblxuICByZXR1cm4gdGhvdXNhbmRzO1xufVxuXG4vLyB0cmFuc2xhdGUgYSBudW1iZXIgZnJvbSAxLTk5OSBpbnRvIEVuZ2xpc2hcbmZ1bmN0aW9uIGluRW5nbGlzaChudW1iZXIpIHtcbiAgdmFyIHRob3VzYW5kcyxcbiAgICAgIGh1bmRyZWRzLFxuICAgICAgdGVucyxcbiAgICAgIG9uZXMsXG4gICAgICB3b3JkcyA9IFtdO1xuXG4gIGlmIChudW1iZXIgPCAyMCkge1xuICAgIHJldHVybiBPTkVfVE9fTklORVRFRU5bbnVtYmVyIC0gMV07IC8vIG1heSBiZSB1bmRlZmluZWRcbiAgfVxuXG4gIGlmIChudW1iZXIgPCAxMDApIHtcbiAgICBvbmVzID0gbnVtYmVyICUgMTA7XG4gICAgdGVucyA9IG51bWJlciAvIDEwIHwgMDsgLy8gZXF1aXZhbGVudCB0byBNYXRoLmZsb29yKG51bWJlciAvIDEwKVxuXG4gICAgd29yZHMucHVzaChURU5TW3RlbnMgLSAxXSk7XG4gICAgd29yZHMucHVzaChpbkVuZ2xpc2gob25lcykpO1xuXG4gICAgcmV0dXJuIHdvcmRzLmZpbHRlcihpc1RydXRoeSkuam9pbignLScpO1xuICB9XG5cbiAgaHVuZHJlZHMgPSBudW1iZXIgLyAxMDAgfCAwO1xuICB3b3Jkcy5wdXNoKGluRW5nbGlzaChodW5kcmVkcykpO1xuICB3b3Jkcy5wdXNoKCdodW5kcmVkJyk7XG4gIHdvcmRzLnB1c2goaW5FbmdsaXNoKG51bWJlciAlIDEwMCkpO1xuXG4gIHJldHVybiB3b3Jkcy5maWx0ZXIoaXNUcnV0aHkpLmpvaW4oJyAnKTtcbn1cblxuLy8gYXBwZW5kIHRoZSB3b3JkIGZvciBhIHNjYWxlLiBNYWRlIGZvciB1c2Ugd2l0aCBBcnJheS5tYXBcbmZ1bmN0aW9uIGFwcGVuZFNjYWxlKGNodW5rLCBleHApIHtcbiAgdmFyIHNjYWxlO1xuICBpZiAoIWNodW5rKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgc2NhbGUgPSBTQ0FMRVNbZXhwIC0gMV07XG4gIHJldHVybiBbY2h1bmssIHNjYWxlXS5maWx0ZXIoaXNUcnV0aHkpLmpvaW4oJyAnKTtcbn1cblxuLyoqXG4gKiA9PT09PT09PT09PT09PT1cbiAqIEVuZCBjb3B5XG4gKi9cblxuLyoqXG4gKiBNb2RpZmljYXRpb24gLSBkZWNvcmF0b3JcbiAqL1xudmFyIE5VTUJFUl9UT19QT1NJVElPTl9URVhUX01BUCA9IHtcbiAgJ29uZSc6ICdmaXJzdCcsXG4gICd0d28nOiAnc2Vjb25kJyxcbiAgJ3RocmVlJzogJ3RoaXJkJyxcbiAgJ2ZvdXInOiAnZm91cnRoJyxcbiAgJ2ZpdmUnOiAnZmlmdGgnLFxuICAnc2l4JzogJ3NpeHRoJyxcbiAgJ3NldmVuJzogJ3NldmVudGgnLFxuICAnZWlnaHQnOiAnZWlnaHRoJyxcbiAgJ25pbmUnOiAnbmluZXRoJyxcbiAgJ3Rlbic6ICd0ZW50aCcsXG4gICdlbGV2ZW4nOiAnZWxldmVudGgnLFxuICAndHdlbHZlJzogJ3R3ZWx2ZXRoJyxcbiAgJ3RoaXJ0ZWVuJzogJ3RoaXJ0ZWVudGgnLFxuICAnZm91cnRlZW4nOiAnZm91cnRlZW50aCcsXG4gICdmaWZ0ZWVuJzogJ2ZpZnRlZW50aCcsXG4gICdzaXh0ZWVuJzogJ3NpeHRlZW50aCcsXG4gICdzZXZlbnRlZW4nOiAnc2V2ZW50ZWVudGgnLFxuICAnZWlnaHRlZW4nOiAnZWlnaHRlZW50aCcsXG4gICduaW5ldGVlbic6ICduaW5ldGVlbnRoJyxcblxuICAndHdlbnR5JzogJ3R3ZW50aWV0aCcsXG4gICd0aGlydHknOiAndGhpcnRpZXRoJyxcbiAgJ2ZvcnR5JzogJ2ZvcnRpZXRoJyxcbiAgJ2ZpZnR5JzogJ2ZpZnRpZXRoJyxcbiAgJ3NpeHR5JzogJ3NpeHRpZXRoJyxcbiAgJ3NldmVudHknOiAnc2V2ZW50aWV0aCcsXG4gICdlaWdodHknOiAnZWlnaHRpZXRoJyxcbiAgJ25pbmV0eSc6ICduaW5ldGlldGgnLFxuICAnaHVuZHJlZCc6ICdodW5kcmVkdGgnLFxuXG4gICd0aG91c2FuZCc6ICd0aG91c2FuZHRoJyxcbiAgJ21pbGxpb24nOiAnbWlsbGlvbnRoJyxcbiAgJ2JpbGxpb24nOiAnYmlsbGlvbnRoJyxcbiAgJ3RyaWxsaW9uJzogJ3RyaWxsaW9udGgnXG59O1xuXG5mdW5jdGlvbiBudW1iZXJUb1Bvc2l0aW9uV29yZChudW0pIHtcbiAgdmFyIHN0ciA9IGNodW5rKG51bSkubWFwKGluRW5nbGlzaCkubWFwKGFwcGVuZFNjYWxlKS5maWx0ZXIoaXNUcnV0aHkpLnJldmVyc2UoKS5qb2luKCcgJyk7XG5cbiAgdmFyIHN1YiA9IHN0ci5zcGxpdCgnICcpLFxuICAgICAgbGFzdFdvcmREYXNoU3BsaXRBcnIgPSBzdWJbc3ViLmxlbmd0aCAtIDFdLnNwbGl0KCctJyksXG4gICAgICBsYXN0V29yZCA9IGxhc3RXb3JkRGFzaFNwbGl0QXJyW2xhc3RXb3JkRGFzaFNwbGl0QXJyLmxlbmd0aCAtIDFdLFxuICAgICAgbmV3TGFzdFdvcmQgPSAobGFzdFdvcmREYXNoU3BsaXRBcnIubGVuZ3RoID4gMSA/IGxhc3RXb3JkRGFzaFNwbGl0QXJyWzBdICsgJy0nIDogJycpICsgTlVNQkVSX1RPX1BPU0lUSU9OX1RFWFRfTUFQW2xhc3RXb3JkXTtcblxuICAvKmNvbnNvbGUubG9nKCdzdHI6Jywgc3RyKTtcbiAgY29uc29sZS5sb2coJ3N1YjonLCBzdWIpO1xuICBjb25zb2xlLmxvZygnbGFzdFdvcmREYXNoU3BsaXRBcnI6JywgbGFzdFdvcmREYXNoU3BsaXRBcnIpO1xuICBjb25zb2xlLmxvZygnbGFzdFdvcmQ6JywgbGFzdFdvcmQpO1xuICBjb25zb2xlLmxvZygnbmV3TGFzdFdvcmQ6JywgbmV3TGFzdFdvcmQpOyovXG5cbiAgdmFyIHN1YkNvcHkgPSBbXS5jb25jYXQoc3ViKTtcbiAgc3ViQ29weS5wb3AoKTtcbiAgdmFyIHByZWZpeCA9IHN1YkNvcHkuam9pbignICcpO1xuICB2YXIgcmVzdWx0ID0gKHByZWZpeCA/IHByZWZpeCArICcgJyA6ICcnKSArIG5ld0xhc3RXb3JkO1xuXG4gIC8vIGNvbnNvbGUubG9nKCdyZXN1bHQnLCAocHJlZml4ID8gcHJlZml4ICsgJyAnIDogJycpICsgbmV3TGFzdFdvcmQpO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG5mdW5jdGlvbiB0b29scygpIHtcblxuICB2YXIgJGxpc3RMaW5rcyA9ICQoJy50ZXN0LWRhdGEtbGlua3MnKSxcbiAgICAgICRjcmVhdGVGYW1pbHlIb3VzZWhvbGQgPSAkKCc8bGk+PGEgaHJlZj1cIiNcIiBjbGFzcz1cXCdtb2NrLWRhdGEtZmFtaWx5XFwnPicgKyAnQ3JlYXRlIGZhbWlseSBob3VzZWhvbGQ8L2E+PC9saT4nKSxcbiAgICAgICRjcmVhdGVGYW1pbHlSZWxhdGlvbnNoaXBzID0gJCgnPGxpPjxhIGhyZWY9XCIjXCInICsgJyBjbGFzcz1cXCdtb2NrLWRhdGEtZmFtaWx5XFwnPicgKyAnQ3JlYXRlIGZhbWlseSByZWxhdGlvbnNoaXBzPC9hPjwvbGk+JyksXG4gICAgICBmYW1pbHlIb3VzZWhvbGRNZW1iZXJzRGF0YSA9IFt7XG4gICAgJ3R5cGUnOiAnaG91c2Vob2xkLW1lbWJlcicsXG4gICAgJ0BwZXJzb24nOiB7XG4gICAgICAnZnVsbE5hbWUnOiAnRGF2ZSAgSm9uZXMnLFxuICAgICAgJ2ZpcnN0TmFtZSc6ICdEYXZlJyxcbiAgICAgICdtaWRkbGVOYW1lJzogJycsXG4gICAgICAnbGFzdE5hbWUnOiAnSm9uZXMnLFxuICAgICAgJ2lkJzogJ3BlcnNvbl9tZSdcbiAgICB9XG4gIH0sIHtcbiAgICAndHlwZSc6ICdob3VzZWhvbGQtbWVtYmVyJyxcbiAgICAnQHBlcnNvbic6IHtcbiAgICAgICdmdWxsTmFtZSc6ICdTYWxseSAgSm9uZXMnLFxuICAgICAgJ2ZpcnN0TmFtZSc6ICdTYWxseScsXG4gICAgICAnbWlkZGxlTmFtZSc6ICcnLFxuICAgICAgJ2xhc3ROYW1lJzogJ0pvbmVzJyxcbiAgICAgICdpZCc6ICdwZXJzb24xJ1xuICAgIH1cbiAgfSwge1xuICAgICd0eXBlJzogJ2hvdXNlaG9sZC1tZW1iZXInLFxuICAgICdAcGVyc29uJzoge1xuICAgICAgJ2Z1bGxOYW1lJzogJ1JlYmVjY2EgIEpvbmVzJyxcbiAgICAgICdmaXJzdE5hbWUnOiAnUmViZWNjYScsXG4gICAgICAnbWlkZGxlTmFtZSc6ICcnLFxuICAgICAgJ2xhc3ROYW1lJzogJ0pvbmVzJyxcbiAgICAgICdpZCc6ICdwZXJzb24yJ1xuICAgIH1cbiAgfSwge1xuICAgICd0eXBlJzogJ2hvdXNlaG9sZC1tZW1iZXInLFxuICAgICdAcGVyc29uJzoge1xuICAgICAgJ2Z1bGxOYW1lJzogJ0FteSBKb25lcycsXG4gICAgICAnZmlyc3ROYW1lJzogJ0FteScsXG4gICAgICAnbWlkZGxlTmFtZSc6ICcnLFxuICAgICAgJ2xhc3ROYW1lJzogJ0pvbmVzJyxcbiAgICAgICdpZCc6ICdwZXJzb24zJ1xuICAgIH1cbiAgfV0sXG4gICAgICBmYW1pbHlIb3VzZWhvbGRSZWxhdGlvbnNoaXBzRGF0YSA9IFt7XG4gICAgJ3BlcnNvbklzRGVzY3JpcHRpb24nOiAnaHVzYmFuZC13aWZlJyxcbiAgICAncGVyc29uSXNJZCc6ICdwZXJzb24xJyxcbiAgICAncGVyc29uVG9JZCc6ICdwZXJzb25fbWUnLFxuICAgICdpbmZlcnJlZCc6IGZhbHNlLFxuICAgICdpZCc6IDFcbiAgfSwge1xuICAgICdwZXJzb25Jc0Rlc2NyaXB0aW9uJzogJ3Nvbi1kYXVnaHRlcicsXG4gICAgJ3BlcnNvbklzSWQnOiAncGVyc29uMicsXG4gICAgJ3BlcnNvblRvSWQnOiAncGVyc29uX21lJyxcbiAgICAnaW5mZXJyZWQnOiBmYWxzZSxcbiAgICAnaWQnOiAyXG4gIH0sIHtcbiAgICAncGVyc29uSXNEZXNjcmlwdGlvbic6ICdtb3RoZXItZmF0aGVyJyxcbiAgICAncGVyc29uSXNJZCc6ICdwZXJzb25fbWUnLFxuICAgICdwZXJzb25Ub0lkJzogJ3BlcnNvbjMnLFxuICAgICdpbmZlcnJlZCc6IGZhbHNlLFxuICAgICdpZCc6IDNcbiAgfSwge1xuICAgICdwZXJzb25Jc0Rlc2NyaXB0aW9uJzogJ3Nvbi1kYXVnaHRlcicsXG4gICAgJ3BlcnNvbklzSWQnOiAncGVyc29uMicsXG4gICAgJ3BlcnNvblRvSWQnOiAncGVyc29uMScsXG4gICAgJ2luZmVycmVkJzogZmFsc2UsXG4gICAgJ2lkJzogNFxuICB9LCB7XG4gICAgJ3BlcnNvbklzRGVzY3JpcHRpb24nOiAnbW90aGVyLWZhdGhlcicsXG4gICAgJ3BlcnNvbklzSWQnOiAncGVyc29uMScsXG4gICAgJ3BlcnNvblRvSWQnOiAncGVyc29uMycsXG4gICAgJ2luZmVycmVkJzogZmFsc2UsXG4gICAgJ2lkJzogNVxuICB9LCB7XG4gICAgJ3BlcnNvbklzRGVzY3JpcHRpb24nOiAnYnJvdGhlci1zaXN0ZXInLFxuICAgICdwZXJzb25Jc0lkJzogJ3BlcnNvbjMnLFxuICAgICdwZXJzb25Ub0lkJzogJ3BlcnNvbjInLFxuICAgICdpbmZlcnJlZCc6IHRydWUsXG4gICAgJ2luZmVycmVkQnknOiBbMywgNSwgMiwgNF0sXG4gICAgJ2lkJzogNlxuICB9XSxcbiAgICAgIHVzZXJEYXRhID0ge1xuICAgICdmdWxsTmFtZSc6ICdEYXZlICBKb25lcycsXG4gICAgJ2ZpcnN0TmFtZSc6ICdEYXZlJyxcbiAgICAnbWlkZGxlTmFtZSc6ICcnLFxuICAgICdsYXN0TmFtZSc6ICdKb25lcydcbiAgfTtcblxuICAkY3JlYXRlRmFtaWx5SG91c2Vob2xkLm9uKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGNsZWFyU3RvcmFnZSgpO1xuICAgIGNyZWF0ZUZhbWlseUhvdXNlaG9sZCgpO1xuICB9KTtcblxuICAkY3JlYXRlRmFtaWx5UmVsYXRpb25zaGlwcy5vbignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBjbGVhclN0b3JhZ2UoKTtcbiAgICBjcmVhdGVGYW1pbHlIb3VzZWhvbGQoKTtcbiAgICBjcmVhdGVGYW1pbHlSZWxhdGlvbnNoaXBzKCk7XG4gIH0pO1xuXG4gIGZ1bmN0aW9uIHByZXJlcXVpc2l0ZXMoKSB7XG4gICAgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbSgnYWRkcmVzcycsICcxMiBTb21ld2hlcmUgQ2xvc2UsIE5ld3BvcnQsIENGMTIgM0FCJyk7XG4gICAgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbSgnYWRkcmVzcy1saW5lLTEnLCAnMTInKTtcbiAgICBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKCdhZGRyZXNzLWxpbmUtMicsICdTb21ld2hlcmUgY2xvc2UnKTtcbiAgICBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKCdjb3VudHknLCAnTmV3cG9ydCcpO1xuICAgIHNlc3Npb25TdG9yYWdlLnNldEl0ZW0oJ2xpdmVzLWhlcmUnLCAneWVzJyk7XG4gICAgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbSgncG9zdGNvZGUnLCAnQ0YxMiAzQUInKTtcbiAgICBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKCd0b3duLWNpdHknLCAnTmV3cG9ydCcpO1xuICB9XG5cbiAgZnVuY3Rpb24gY3JlYXRlRmFtaWx5SG91c2Vob2xkKCkge1xuICAgIHByZXJlcXVpc2l0ZXMoKTtcbiAgICBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKCd1c2VyLWRldGFpbHMnLCBKU09OLnN0cmluZ2lmeSh1c2VyRGF0YSkpO1xuICAgIHNlc3Npb25TdG9yYWdlLnNldEl0ZW0od2luZG93Lk9OUy5zdG9yYWdlLktFWVMuSE9VU0VIT0xEX01FTUJFUlNfU1RPUkFHRV9LRVksIEpTT04uc3RyaW5naWZ5KGZhbWlseUhvdXNlaG9sZE1lbWJlcnNEYXRhKSk7XG4gICAgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbSgnaG91c2Vob2xkLW1lbWJlcnMtaW5jcmVtZW50JywgSlNPTi5zdHJpbmdpZnkoNCkpO1xuICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gJy4uL3N1bW1hcnknO1xuICB9XG5cbiAgZnVuY3Rpb24gY3JlYXRlRmFtaWx5UmVsYXRpb25zaGlwcygpIHtcbiAgICBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKHdpbmRvdy5PTlMuc3RvcmFnZS5LRVlTLlJFTEFUSU9OU0hJUFNfU1RPUkFHRV9LRVksIEpTT04uc3RyaW5naWZ5KGZhbWlseUhvdXNlaG9sZFJlbGF0aW9uc2hpcHNEYXRhKSk7XG4gICAgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbSgncmVsYXRpb25zaGlwcy1pbmNyZW1lbnQnLCBKU09OLnN0cmluZ2lmeSg2KSk7XG4gICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSAnLi4vcmVsYXRpb25zaGlwcy1zdW1tYXJ5JztcbiAgfVxuXG4gIGZ1bmN0aW9uIGNsZWFyU3RvcmFnZSgpIHtcbiAgICBzZXNzaW9uU3RvcmFnZS5jbGVhcigpO1xuICB9XG5cbiAgJGxpc3RMaW5rcy5hcHBlbmQoJGNyZWF0ZUZhbWlseUhvdXNlaG9sZCk7XG4gICRsaXN0TGlua3MuYXBwZW5kKCRjcmVhdGVGYW1pbHlSZWxhdGlvbnNoaXBzKTtcbn1cblxudmFyIFVTRVJfU1RPUkFHRV9LRVkgPSAndXNlci1kZXRhaWxzJztcbnZhciBJTkRJVklEVUFMX1BST1hZX1NUT1JBR0VfS0VZID0gJ3Byb3h5LXBlcnNvbic7XG5cbmZ1bmN0aW9uIGdldEFkZHJlc3MoKSB7XG4gIHZhciBhZGRyZXNzTGluZXMgPSBzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKCdhZGRyZXNzJykuc3BsaXQoJywnKTtcblxuICByZXR1cm4ge1xuICAgIGFkZHJlc3NMaW5lMTogYWRkcmVzc0xpbmVzWzBdLFxuICAgIGFkZHJlc3NMaW5lMjogYWRkcmVzc0xpbmVzWzFdLFxuICAgIGFkZHJlc3NMaW5lMzogYWRkcmVzc0xpbmVzWzJdLFxuICAgIGFkZHJlc3NDb3VudHk6IGFkZHJlc3NMaW5lc1s0XSxcbiAgICBhZGRyZXNzVG93bkNpdHk6IGFkZHJlc3NMaW5lc1szXSxcbiAgICBhZGRyZXNzUG9zdGNvZGU6IGFkZHJlc3NMaW5lc1s1XVxuICB9O1xufVxuXG4vKipcbiAqIFVzZXJcbiAqL1xuZnVuY3Rpb24gYWRkVXNlclBlcnNvbihwZXJzb24kJDEpIHtcbiAgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbShVU0VSX1NUT1JBR0VfS0VZLCBKU09OLnN0cmluZ2lmeShwZXJzb24kJDEpKTtcbn1cblxuZnVuY3Rpb24gZ2V0VXNlclBlcnNvbigpIHtcbiAgcmV0dXJuIEpTT04ucGFyc2Uoc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbShVU0VSX1NUT1JBR0VfS0VZKSk7XG59XG5cbi8qKlxuICogSGVscGVyc1xuICovXG5mdW5jdGlvbiBjcmVhdGVOYXZJdGVtKG1lbWJlcikge1xuICB2YXIgJG5vZGVFbCA9ICQoJzxsaSBjbGFzcz1cImpzLXRlbXBsYXRlLW5hdi1pdGVtIG5hdl9faXRlbSBwbHV0b1wiPicgKyAnICA8YSBjbGFzcz1cImpzLXRlbXBsYXRlLW5hdi1pdGVtLWxhYmVsIG5hdl9fbGlua1wiIGhyZWY9XCIjXCI+PC9hPicgKyAnPC9saT4nKSxcbiAgICAgICRsaW5rRWwgPSAkbm9kZUVsLmZpbmQoJy5qcy10ZW1wbGF0ZS1uYXYtaXRlbS1sYWJlbCcpO1xuXG4gICRsaW5rRWwuaHRtbChtZW1iZXJbJ0BwZXJzb24nXS5mdWxsTmFtZSk7XG5cbiAgaWYgKG1lbWJlclsnQHBlcnNvbiddLmlkID09PSBVU0VSX0hPVVNFSE9MRF9NRU1CRVJfSUQpIHtcbiAgICAkbGlua0VsLmF0dHIoJ2hyZWYnLCAnLi4vd2hhdC1pcy15b3VyLW5hbWUnKTtcbiAgfSBlbHNlIHtcbiAgICAkbGlua0VsLmF0dHIoJ2hyZWYnLCAnLi4vd2hvLWVsc2UtdG8tYWRkP2VkaXQ9JyArIG1lbWJlclsnQHBlcnNvbiddLmlkKTtcbiAgfVxuXG4gIHJldHVybiAkbm9kZUVsO1xufVxuXG5mdW5jdGlvbiB1cGRhdGVIb3VzZWhvbGRWaXNpdG9yc05hdmlnYXRpb25JdGVtcygpIHtcbiAgdmFyIGFsbEhvdXNlaG9sZE1lbWJlcnMgPSB3aW5kb3cuT05TLnN0b3JhZ2UuZ2V0QWxsSG91c2Vob2xkTWVtYmVycygpLFxuICAgICAgaG91c2Vob2xkTWVtYmVycyA9IGFsbEhvdXNlaG9sZE1lbWJlcnMuZmlsdGVyKHdpbmRvdy5PTlMuc3RvcmFnZS5pc0hvdXNlaG9sZE1lbWJlciksXG4gICAgICB2aXNpdG9ycyA9IGFsbEhvdXNlaG9sZE1lbWJlcnMuZmlsdGVyKHdpbmRvdy5PTlMuc3RvcmFnZS5pc1Zpc2l0b3IpO1xuXG4gIHZhciAkbmF2aWdhdGlvbkhvdXNlaG9sZE1lbWJlcnNFbCA9ICQoJyNuYXZpZ2F0aW9uLWhvdXNlaG9sZC1tZW1iZXJzJyksXG4gICAgICAkbmF2aWdhdGlvblZpc2l0b3JzRWwgPSAkKCcjbmF2aWdhdGlvbi12aXNpdG9ycycpO1xuXG4gIGlmIChob3VzZWhvbGRNZW1iZXJzLmxlbmd0aCkge1xuICAgICQuZWFjaChob3VzZWhvbGRNZW1iZXJzLCBmdW5jdGlvbiAoaSwgbWVtYmVyKSB7XG4gICAgICAkbmF2aWdhdGlvbkhvdXNlaG9sZE1lbWJlcnNFbC5hcHBlbmQoY3JlYXRlTmF2SXRlbShtZW1iZXIpKTtcbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICAkbmF2aWdhdGlvbkhvdXNlaG9sZE1lbWJlcnNFbC5wYXJlbnQoKS5oaWRlKCk7XG4gIH1cblxuICBpZiAodmlzaXRvcnMubGVuZ3RoKSB7XG4gICAgJC5lYWNoKHZpc2l0b3JzLCBmdW5jdGlvbiAoaSwgbWVtYmVyKSB7XG4gICAgICAkbmF2aWdhdGlvblZpc2l0b3JzRWwuYXBwZW5kKGNyZWF0ZU5hdkl0ZW0obWVtYmVyKSk7XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgJG5hdmlnYXRpb25WaXNpdG9yc0VsLnBhcmVudCgpLmhpZGUoKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBjcmVhdGVMaXN0SXRlbVBlcnNvbihtZW1iZXIpIHtcbiAgcmV0dXJuICQoJzxsaSBjbGFzcz1cImxpc3RfX2l0ZW1cIj4nKS5hZGRDbGFzcygnbWFycycpLmh0bWwoJzxzcGFuIGNsYXNzPVwibGlzdF9faXRlbS1uYW1lXCI+JyArIG1lbWJlclsnQHBlcnNvbiddLmZ1bGxOYW1lICsgKG1lbWJlclsnQHBlcnNvbiddLmlkID09PSBVU0VSX0hPVVNFSE9MRF9NRU1CRVJfSUQgPyAnIChZb3UpJyA6ICcnKSArICc8L3NwYW4+Jyk7XG59XG5cbmZ1bmN0aW9uIHBvcHVsYXRlTGlzdCgkZWwsIG1lbWJlclR5cGUpIHtcbiAgaWYgKCEkZWwubGVuZ3RoKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgdmFyIG1lbWJlcnMgPSBnZXRBbGxIb3VzZWhvbGRNZW1iZXJzKCkgfHwgW107XG5cbiAgJGVsLmVtcHR5KCkuYXBwZW5kKG1lbWJlcnMuZmlsdGVyKGZ1bmN0aW9uIChtZW1iZXIpIHtcbiAgICByZXR1cm4gbWVtYmVyLnR5cGUgPT09IG1lbWJlclR5cGU7XG4gIH0pLm1hcChjcmVhdGVMaXN0SXRlbVBlcnNvbikpO1xuXG4gICRlbC5hZGRDbGFzcygnbGlzdCBsaXN0LS1wZW9wbGUtcGxhaW4nKTtcbn1cblxuZnVuY3Rpb24gcG9wdWxhdGVIb3VzZWhvbGRMaXN0KCkge1xuICBwb3B1bGF0ZUxpc3QoJCgnI2hvdXNlaG9sZC1tZW1iZXJzJyksIEhPVVNFSE9MRF9NRU1CRVJfVFlQRSk7XG59XG5cbmZ1bmN0aW9uIHBvcHVsYXRlVmlzaXRvckxpc3QoKSB7XG4gIHBvcHVsYXRlTGlzdCgkKCcjdmlzaXRvcnMtbGlzdCcpLCBWSVNJVE9SX1RZUEUpO1xufVxuXG5mdW5jdGlvbiB1cGRhdGVBZGRyZXNzZXMoKSB7XG4gIHZhciBhZGRyZXNzTGluZXMgPSAoc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbSgnYWRkcmVzcycpIHx8ICcnKS5zcGxpdCgnLCcpLFxuICAgICAgYWRkcmVzc0xpbmUxID0gYWRkcmVzc0xpbmVzWzBdLFxuICAgICAgYWRkcmVzc0xpbmUyID0gYWRkcmVzc0xpbmVzWzFdO1xuXG4gICQoJyNzZWN0aW9uLWFkZHJlc3MnKS5odG1sKGFkZHJlc3NMaW5lMSB8fCAnPGEnICsgJyBocmVmPVwiLi4vdGVzdC1hZGRyZXNzXCI+QWRkcmVzcyBub3QnICsgJyBmb3VuZDwvYT4nKTtcbiAgJCgnLmFkZHJlc3MtdGV4dCcpLmh0bWwoYWRkcmVzc0xpbmUxICYmIGFkZHJlc3NMaW5lMiA/IGFkZHJlc3NMaW5lMSArIChhZGRyZXNzTGluZTIgPyAnLCAnICsgYWRkcmVzc0xpbmUyIDogJycpIDogJzxhIGhyZWY9XCIuLi90ZXN0LWFkZHJlc3NcIj5BZGRyZXNzIG5vdCBmb3VuZDwvYT4nKTtcblxuICAkKCcuYWRkcmVzcy10ZXh0LWxpbmUxJykuaHRtbChhZGRyZXNzTGluZTEpO1xuXG4gIHZhciBwZXJzb25JZCA9IG5ldyBVUkxTZWFyY2hQYXJhbXMod2luZG93LmxvY2F0aW9uLnNlYXJjaCkuZ2V0KCdwZXJzb24nKSxcbiAgICAgIHBlcnNvbiQkMSA9IHZvaWQgMDtcblxuICBpZiAocGVyc29uSWQpIHtcbiAgICBwZXJzb24kJDEgPSBnZXRIb3VzZWhvbGRNZW1iZXJCeVBlcnNvbklkKHBlcnNvbklkKVsnQHBlcnNvbiddO1xuICAgICQoJyNzZWN0aW9uLWluZGl2aWR1YWwnKS5odG1sKHBlcnNvbiQkMS5mdWxsTmFtZSk7XG5cbiAgICAkKCcuanMtcGVyc29uLWZ1bGxuYW1lLWZyb20tdXJsLWlkJykuaHRtbChwZXJzb24kJDEuZnVsbE5hbWUpO1xuICB9XG59XG5cbnZhciBzZWN1cmVMaW5rVGV4dE1hcCA9IHtcbiAgJ3F1ZXN0aW9uLXlvdSc6IHtcbiAgICBkZXNjcmlwdGlvbjogJ1dhbnQgdG8ga2VlcCB5b3VyIGFuc3dlcnMgc2VjdXJlIGZyb20gb3RoZXIgcGVvcGxlIGF0IHRoaXMnICsgJyBhZGRyZXNzPycsXG4gICAgbGlua1RleHQ6ICdHZXQgYSBzZXBhcmF0ZSBhY2Nlc3MgY29kZSB0byBzdWJtaXQgYW4gaW5kaXZpZHVhbCByZXNwb25zZScsXG4gICAgbGluazogJy4uL2luZGl2aWR1YWwtZGVjaXNpb24tc2VjdXJlJ1xuICB9LFxuICAncGluLXlvdSc6IHtcbiAgICBkZXNjcmlwdGlvbjogJ1lvdVxcJ3ZlIGNob3NlbiB0byBrZWVwIHlvdXIgYW5zd2VycyBzZWN1cmUnLFxuICAgIGxpbmtUZXh0OiAnQ2FuY2VsIHRoaXMgYW5kIG1ha2UgYW5zd2VycyBhdmFpbGFibGUgdG8gdGhlIHJlc3Qgb2YgdGhlJyArICcgaG91c2Vob2xkJyxcbiAgICBsaW5rOiAnLi4vaW5kaXZpZHVhbC1kZWNpc2lvbi1zZWN1cmUnXG4gIH0sXG4gICdxdWVzdGlvbi1wcm94eSc6IHtcbiAgICBkZXNjcmlwdGlvbjogJ05vdCBoYXBweSB0byBjb250aW51ZSBhbnN3ZXJpbmcgZm9yICRbTkFNRV0/JyxcbiAgICBsaW5rVGV4dDogJ1JlcXVlc3QgYW4gaW5kaXZpZHVhbCBhY2Nlc3MgY29kZSB0byBiZSBzZW50IHRvIHRoZW0nLFxuICAgIGxpbms6ICcuLi9pbmRpdmlkdWFsLWRlY2lzaW9uLW90aGVyLXNlY3VyZSdcbiAgfVxufTtcblxuZnVuY3Rpb24gdXBkYXRlQWxsUHJldmlvdXNMaW5rcygpIHtcbiAgJCgnLmpzLXByZXZpb3VzLWxpbmsnKS5hdHRyKCdocmVmJywgZG9jdW1lbnQucmVmZXJyZXIpO1xufVxuXG5mdW5jdGlvbiB1cGRhdGVQZXJzb25MaW5rKCkge1xuICB2YXIgcGVyc29uSWQgPSBuZXcgVVJMU2VhcmNoUGFyYW1zKHdpbmRvdy5sb2NhdGlvbi5zZWFyY2gpLmdldCgncGVyc29uJyk7XG5cbiAgaWYgKHBlcnNvbklkKSB7XG4gICAgdmFyIHVybFBhcmFtID0gbmV3IFVSTFNlYXJjaFBhcmFtcyh3aW5kb3cubG9jYXRpb24uc2VhcmNoKSxcbiAgICAgICAgX3BlcnNvbiA9IGdldEhvdXNlaG9sZE1lbWJlckJ5UGVyc29uSWQocGVyc29uSWQpWydAcGVyc29uJ10sXG4gICAgICAgIHBpbk9iaiA9IGdldFBpbkZvcihwZXJzb25JZCksXG4gICAgICAgIHNlY3VyZUxpbmtUZXh0Q29uZmlnID0gc2VjdXJlTGlua1RleHRNYXBbZ2V0QW5zd2VyaW5nSW5kaXZpZHVhbEJ5UHJveHkoKSA/ICdxdWVzdGlvbi1wcm94eScgOiBwaW5PYmogJiYgcGluT2JqLnBpbiA/ICdwaW4teW91JyA6ICdxdWVzdGlvbi15b3UnXSxcbiAgICAgICAgbGlua0hyZWYgPSBzZWN1cmVMaW5rVGV4dENvbmZpZy5saW5rICsgJz9wZXJzb249JyArIHBlcnNvbklkICsgJyZyZXR1cm51cmw9JyArIHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZSxcbiAgICAgICAgc3VydmV5VHlwZSA9IHVybFBhcmFtLmdldCgnc3VydmV5Jyk7XG5cbiAgICBsaW5rSHJlZiArPSBzdXJ2ZXlUeXBlID8gJyZzdXJ2ZXk9JyArIHN1cnZleVR5cGUgOiAnJztcblxuICAgIHZhciAkc2VjdXJlTGluayA9ICQoJy5qcy1saW5rLXNlY3VyZScpO1xuICAgICRzZWN1cmVMaW5rLmF0dHIoJ2hyZWYnLCBsaW5rSHJlZik7XG5cbiAgICAkc2VjdXJlTGluay5odG1sKHNlY3VyZUxpbmtUZXh0Q29uZmlnLmxpbmtUZXh0KTtcbiAgICAkKCcuanMtbGluay1zZWN1cmUtbGFiZWwnKS5odG1sKHNlY3VyZUxpbmtUZXh0Q29uZmlnLmRlc2NyaXB0aW9uLnJlcGxhY2UoJyRbTkFNRV0nLCBfcGVyc29uLmZ1bGxOYW1lKSk7XG5cbiAgICB2YXIgcGVyc29uTGluayA9ICQoJy5qcy1saW5rLXBlcnNvbicpO1xuICAgIHBlcnNvbkxpbmsuYXR0cignaHJlZicsIHBlcnNvbkxpbmsuYXR0cignaHJlZicpICsgJz9wZXJzb249JyArIHBlcnNvbklkICsgKHN1cnZleVR5cGUgPyAnJnN1cnZleT0nICsgc3VydmV5VHlwZSA6ICcnKSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gdXBkYXRlQnlTdXJ2ZXlUeXBlKCkge1xuICB2YXIgdXJsUGFyYW1zID0gbmV3IFVSTFNlYXJjaFBhcmFtcyh3aW5kb3cubG9jYXRpb24uc2VhcmNoKSxcbiAgICAgIHN1cnZleVR5cGUgPSB1cmxQYXJhbXMuZ2V0KCdzdXJ2ZXknKTtcblxuICBpZiAoc3VydmV5VHlwZSkge1xuICAgICQoJy5qcy1oZWFkZXItdGl0bGUnKS5odG1sKHN1cnZleVR5cGVDb25maWdbc3VydmV5VHlwZV0udGl0bGUpO1xuICAgICQoJyNwZW9wbGUtbGl2aW5nLWhlcmUnKS5odG1sKHN1cnZleVR5cGVDb25maWdbc3VydmV5VHlwZV0uaG91c2Vob2xkU2VjdGlvblRpdGxlKTtcbiAgICAkKCcjcGVvcGxlLWxpdmluZy1oZXJlJykuYXR0cignaHJlZicsIHN1cnZleVR5cGVDb25maWdbc3VydmV5VHlwZV0uaG91c2Vob2xkU2VjdGlvbkxpbmspO1xuICAgICQoJyNyZWxhdGlvbnNoaXBzLXNlY3Rpb24nKS5hdHRyKCdocmVmJywgc3VydmV5VHlwZUNvbmZpZ1tzdXJ2ZXlUeXBlXS5yZWxhdGlvbnNoaXBzU2VjdGlvbik7XG4gICAgJCgndGl0bGUnKS5odG1sKHN1cnZleVR5cGVDb25maWdbc3VydmV5VHlwZV0udGl0bGUpO1xuICB9XG59XG5cbmZ1bmN0aW9uIHNldEFuc3dlcmluZ0luZGl2aWR1YWxCeVByb3h5KGJvb2wpIHtcbiAgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbShJTkRJVklEVUFMX1BST1hZX1NUT1JBR0VfS0VZLCBKU09OLnN0cmluZ2lmeShib29sKSk7XG59XG5cbmZ1bmN0aW9uIGdldEFuc3dlcmluZ0luZGl2aWR1YWxCeVByb3h5KCkge1xuICByZXR1cm4gSlNPTi5wYXJzZShzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKElORElWSURVQUxfUFJPWFlfU1RPUkFHRV9LRVkpKTtcbn1cblxudmFyIHN1cnZleVR5cGVDb25maWcgPSB7XG4gIGxtczoge1xuICAgIHRpdGxlOiAnT25saW5lIEhvdXNlaG9sZCBTdHVkeScsXG4gICAgaG91c2Vob2xkU2VjdGlvblRpdGxlOiAnQWJvdXQgeW91ciBob3VzZWhvbGQnLFxuICAgIGhvdXNlaG9sZFNlY3Rpb25MaW5rOiAnLi4vc3VtbWFyeS8/c3VydmV5PWxtcycsXG4gICAgcmVsYXRpb25zaGlwc1NlY3Rpb246ICcuLi9yZWxhdGlvbnNoaXBzLz9zdXJ2ZXk9bG1zJ1xuICB9XG59O1xuXG5mdW5jdGlvbiBkb0lMaXZlSGVyZSgpIHtcbiAgcmV0dXJuIHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oJ2xpdmVzLWhlcmUnKSA9PT0gJ3llcyc7XG59XG5cbndpbmRvdy5PTlMgPSB3aW5kb3cuT05TIHx8IHt9O1xud2luZG93Lk9OUy5zdG9yYWdlID0ge1xuICBnZXRBZGRyZXNzOiBnZXRBZGRyZXNzLFxuICBhZGRIb3VzZWhvbGRNZW1iZXI6IGFkZEhvdXNlaG9sZE1lbWJlcixcbiAgdXBkYXRlSG91c2Vob2xkTWVtYmVyOiB1cGRhdGVIb3VzZWhvbGRNZW1iZXIsXG4gIGRlbGV0ZUhvdXNlaG9sZE1lbWJlcjogZGVsZXRlSG91c2Vob2xkTWVtYmVyLFxuICBnZXRBbGxIb3VzZWhvbGRNZW1iZXJzOiBnZXRBbGxIb3VzZWhvbGRNZW1iZXJzLFxuICBhZGRVc2VyUGVyc29uOiBhZGRVc2VyUGVyc29uLFxuICBnZXRVc2VyUGVyc29uOiBnZXRVc2VyUGVyc29uLFxuICBnZXRVc2VyQXNIb3VzZWhvbGRNZW1iZXI6IGdldFVzZXJBc0hvdXNlaG9sZE1lbWJlcixcbiAgZ2V0SG91c2Vob2xkTWVtYmVyQnlQZXJzb25JZDogZ2V0SG91c2Vob2xkTWVtYmVyQnlQZXJzb25JZCxcbiAgZ2V0TWVtYmVyUGVyc29uSWQ6IGdldE1lbWJlclBlcnNvbklkLFxuICB1cGRhdGVVc2VyQXNIb3VzZWhvbGRNZW1iZXI6IHVwZGF0ZVVzZXJBc0hvdXNlaG9sZE1lbWJlcixcbiAgZGVsZXRlVXNlckFzSG91c2Vob2xkTWVtYmVyOiBkZWxldGVVc2VyQXNIb3VzZWhvbGRNZW1iZXIsXG4gIHRlbXBBd2F5UXVlc3Rpb25TZW50ZW5jZU1hcDogdGVtcEF3YXlRdWVzdGlvblNlbnRlbmNlTWFwLFxuXG4gIGlzVmlzaXRvcjogaXNWaXNpdG9yLFxuICBpc090aGVySG91c2Vob2xkTWVtYmVyOiBpc090aGVySG91c2Vob2xkTWVtYmVyLFxuICBpc0hvdXNlaG9sZE1lbWJlcjogaXNIb3VzZWhvbGRNZW1iZXIsXG5cbiAgYWRkUmVsYXRpb25zaGlwOiBhZGRSZWxhdGlvbnNoaXAsXG4gIGRlbGV0ZVJlbGF0aW9uc2hpcDogZGVsZXRlUmVsYXRpb25zaGlwLFxuICBlZGl0UmVsYXRpb25zaGlwOiBlZGl0UmVsYXRpb25zaGlwLFxuICBnZXRBbGxSZWxhdGlvbnNoaXBzOiBnZXRBbGxSZWxhdGlvbnNoaXBzLFxuICBnZXRBbGxNYW51YWxSZWxhdGlvbnNoaXBzOiBnZXRBbGxNYW51YWxSZWxhdGlvbnNoaXBzLFxuICBkZWxldGVBbGxSZWxhdGlvbnNoaXBzRm9yTWVtYmVyOiBkZWxldGVBbGxSZWxhdGlvbnNoaXBzRm9yTWVtYmVyLFxuXG4gIGdldEFsbFBhcmVudHNPZjogZ2V0QWxsUGFyZW50c09mLFxuICBnZXRBbGxDaGlsZHJlbk9mOiBnZXRBbGxDaGlsZHJlbk9mLFxuICBnZXRQYXJlbnRJZEZyb21SZWxhdGlvbnNoaXA6IGdldFBhcmVudElkRnJvbVJlbGF0aW9uc2hpcCxcbiAgZ2V0Q2hpbGRJZEZyb21SZWxhdGlvbnNoaXA6IGdldENoaWxkSWRGcm9tUmVsYXRpb25zaGlwLFxuICBnZXRPdGhlclBlcnNvbklkRnJvbVJlbGF0aW9uc2hpcDogZ2V0T3RoZXJQZXJzb25JZEZyb21SZWxhdGlvbnNoaXAsXG4gIGlzQVBhcmVudEluUmVsYXRpb25zaGlwOiBpc0FQYXJlbnRJblJlbGF0aW9uc2hpcCxcbiAgaXNBQ2hpbGRJblJlbGF0aW9uc2hpcDogaXNBQ2hpbGRJblJlbGF0aW9uc2hpcCxcbiAgaXNJblJlbGF0aW9uc2hpcDogaXNJblJlbGF0aW9uc2hpcCxcbiAgYXJlQW55Q2hpbGRyZW5JblJlbGF0aW9uc2hpcE5vdFBhcmVudDogYXJlQW55Q2hpbGRyZW5JblJlbGF0aW9uc2hpcE5vdFBhcmVudCxcbiAgaXNSZWxhdGlvbnNoaXBUeXBlOiBpc1JlbGF0aW9uc2hpcFR5cGUsXG4gIGlzUmVsYXRpb25zaGlwSW5mZXJyZWQ6IGlzUmVsYXRpb25zaGlwSW5mZXJyZWQsXG4gIGdldFJlbGF0aW9uc2hpcE9mOiBnZXRSZWxhdGlvbnNoaXBPZixcblxuICByZWxhdGlvbnNoaXBEZXNjcmlwdGlvbk1hcDogcmVsYXRpb25zaGlwRGVzY3JpcHRpb25NYXAsXG4gIHJlbGF0aW9uc2hpcFN1bW1hcnlUZW1wbGF0ZXM6IHJlbGF0aW9uc2hpcFN1bW1hcnlUZW1wbGF0ZXMsXG4gIG1pc3NpbmdSZWxhdGlvbnNoaXBJbmZlcmVuY2U6IG1pc3NpbmdSZWxhdGlvbnNoaXBJbmZlcmVuY2UsXG4gIGluZmVyUmVsYXRpb25zaGlwczogaW5mZXJSZWxhdGlvbnNoaXBzLFxuICBnZXRSZWxhdGlvbnNoaXBzV2l0aFBlcnNvbklkczogZ2V0UmVsYXRpb25zaGlwc1dpdGhQZXJzb25JZHMsXG4gIGdldFBlb3BsZUlkc01pc3NpbmdSZWxhdGlvbnNoaXBzV2l0aFBlcnNvbjogZ2V0UGVvcGxlSWRzTWlzc2luZ1JlbGF0aW9uc2hpcHNXaXRoUGVyc29uLFxuICBnZXRSZWxhdGlvbnNoaXBUeXBlOiBnZXRSZWxhdGlvbnNoaXBUeXBlLFxuICBmaW5kTmV4dE1pc3NpbmdSZWxhdGlvbnNoaXA6IGZpbmROZXh0TWlzc2luZ1JlbGF0aW9uc2hpcCxcblxuICBhZGRVcGRhdGVQZXJzb25hbERldGFpbHNET0I6IGFkZFVwZGF0ZVBlcnNvbmFsRGV0YWlsc0RPQixcbiAgZ2V0UGVyc29uYWxEZXRhaWxzRm9yOiBnZXRQZXJzb25hbERldGFpbHNGb3IsXG4gIGFkZFVwZGF0ZU1hcml0YWxTdGF0dXM6IGFkZFVwZGF0ZU1hcml0YWxTdGF0dXMsXG4gIGFkZFVwZGF0ZUNvdW50cnk6IGFkZFVwZGF0ZUNvdW50cnksXG4gIGFkZFVwZGF0ZU9yaWVudGF0aW9uOiBhZGRVcGRhdGVPcmllbnRhdGlvbixcbiAgYWRkVXBkYXRlU2FsYXJ5OiBhZGRVcGRhdGVTYWxhcnksXG5cbiAgcGVyc29uYWxEZXRhaWxzTWFyaXRhbFN0YXR1c01hcDogcGVyc29uYWxEZXRhaWxzTWFyaXRhbFN0YXR1c01hcCxcbiAgcGVyc29uYWxEZXRhaWxzQ291bnRyeU1hcDogcGVyc29uYWxEZXRhaWxzQ291bnRyeU1hcCxcbiAgcGVyc29uYWxEZXRhaWxzT3JpZW50YXRpb25NYXA6IHBlcnNvbmFsRGV0YWlsc09yaWVudGF0aW9uTWFwLFxuXG4gIGNyZWF0ZVBpbkZvcjogY3JlYXRlUGluRm9yLFxuICBnZXRQaW5Gb3I6IGdldFBpbkZvcixcbiAgdW5zZXRQaW5Gb3I6IHVuc2V0UGluRm9yLFxuXG4gIHNldEFuc3dlcmluZ0luZGl2aWR1YWxCeVByb3h5OiBzZXRBbnN3ZXJpbmdJbmRpdmlkdWFsQnlQcm94eSxcbiAgZ2V0QW5zd2VyaW5nSW5kaXZpZHVhbEJ5UHJveHk6IGdldEFuc3dlcmluZ0luZGl2aWR1YWxCeVByb3h5LFxuXG4gIGRvSUxpdmVIZXJlOiBkb0lMaXZlSGVyZSxcblxuICBLRVlTOiB7XG4gICAgSE9VU0VIT0xEX01FTUJFUlNfU1RPUkFHRV9LRVk6IEhPVVNFSE9MRF9NRU1CRVJTX1NUT1JBR0VfS0VZLFxuICAgIFVTRVJfU1RPUkFHRV9LRVk6IFVTRVJfU1RPUkFHRV9LRVksXG4gICAgSU5ESVZJRFVBTF9QUk9YWV9TVE9SQUdFX0tFWTogSU5ESVZJRFVBTF9QUk9YWV9TVE9SQUdFX0tFWSxcbiAgICBIT1VTRUhPTERfTUVNQkVSX1RZUEU6IEhPVVNFSE9MRF9NRU1CRVJfVFlQRSxcbiAgICBWSVNJVE9SX1RZUEU6IFZJU0lUT1JfVFlQRSxcbiAgICBSRUxBVElPTlNISVBTX1NUT1JBR0VfS0VZOiBSRUxBVElPTlNISVBTX1NUT1JBR0VfS0VZXG4gIH0sXG5cbiAgSURTOiB7XG4gICAgVVNFUl9IT1VTRUhPTERfTUVNQkVSX0lEOiBVU0VSX0hPVVNFSE9MRF9NRU1CRVJfSURcbiAgfSxcblxuICBUWVBFUzoge1xuICAgIHBlcnNvbjogcGVyc29uLFxuICAgIHJlbGF0aW9uc2hpcDogcmVsYXRpb25zaGlwXG4gIH1cbn07XG5cbndpbmRvdy5PTlMuaGVscGVycyA9IHtcbiAgcG9wdWxhdGVIb3VzZWhvbGRMaXN0OiBwb3B1bGF0ZUhvdXNlaG9sZExpc3QsXG4gIHBvcHVsYXRlVmlzaXRvckxpc3Q6IHBvcHVsYXRlVmlzaXRvckxpc3Rcbn07XG5cbndpbmRvdy5PTlMudXRpbHMgPSB7XG4gIHJlbW92ZUZyb21MaXN0OiByZW1vdmVGcm9tTGlzdCxcbiAgdHJhaWxpbmdOYW1lUzogdHJhaWxpbmdOYW1lUyxcbiAgbnVtYmVyVG9Qb3NpdGlvbldvcmQ6IG51bWJlclRvUG9zaXRpb25Xb3JkXG59O1xuXG4kKHBvcHVsYXRlSG91c2Vob2xkTGlzdCk7XG4kKHBvcHVsYXRlVmlzaXRvckxpc3QpO1xuJCh1cGRhdGVIb3VzZWhvbGRWaXNpdG9yc05hdmlnYXRpb25JdGVtcyk7XG4kKHVwZGF0ZUFkZHJlc3Nlcyk7XG4kKHVwZGF0ZVBlcnNvbkxpbmspO1xuJCh0b29scyk7XG4kKHVwZGF0ZUFsbFByZXZpb3VzTGlua3MpO1xuJCh1cGRhdGVCeVN1cnZleVR5cGUpO1xuXG5leHBvcnRzLlVTRVJfU1RPUkFHRV9LRVkgPSBVU0VSX1NUT1JBR0VfS0VZO1xuZXhwb3J0cy5JTkRJVklEVUFMX1BST1hZX1NUT1JBR0VfS0VZID0gSU5ESVZJRFVBTF9QUk9YWV9TVE9SQUdFX0tFWTtcbmV4cG9ydHMuZ2V0QWRkcmVzcyA9IGdldEFkZHJlc3M7XG5leHBvcnRzLmFkZFVzZXJQZXJzb24gPSBhZGRVc2VyUGVyc29uO1xuZXhwb3J0cy5nZXRVc2VyUGVyc29uID0gZ2V0VXNlclBlcnNvbjtcbiJdfQ==
