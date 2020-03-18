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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJfcHJvdG90eXBlcy95b3VyLWhvdXNlaG9sZC12Ni9idW5kbGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcblxuZnVuY3Rpb24gYXV0b0luY3JlbWVudElkKGNvbGxlY3Rpb24pIHtcbiAgdmFyIGsgPSBjb2xsZWN0aW9uICsgJy1pbmNyZW1lbnQnLFxuICAgICAgaWQgPSBwYXJzZUludChzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKGspKSB8fCAwO1xuXG4gIGlkKys7XG5cbiAgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbShrLCBKU09OLnN0cmluZ2lmeShpZCkpO1xuXG4gIHJldHVybiBpZDtcbn1cblxuZnVuY3Rpb24gcmVtb3ZlRnJvbUxpc3QobGlzdCwgdmFsKSB7XG5cbiAgZnVuY3Rpb24gZG9SZW1vdmUoaXRlbSkge1xuICAgIHZhciBmb3VuZElkID0gbGlzdC5pbmRleE9mKGl0ZW0pO1xuXG4gICAgLyoqXG4gICAgICogR3VhcmRcbiAgICAgKi9cbiAgICBpZiAoZm91bmRJZCA9PT0gLTEpIHtcbiAgICAgIGNvbnNvbGUubG9nKCdBdHRlbXB0IHRvIHJlbW92ZSBmcm9tIGxpc3QgZmFpbGVkOiAnLCBsaXN0LCB2YWwpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGxpc3Quc3BsaWNlKGZvdW5kSWQsIDEpO1xuICB9XG5cbiAgaWYgKF8uaXNBcnJheSh2YWwpKSB7XG4gICAgJC5lYWNoKHZhbCwgZnVuY3Rpb24gKGksIGl0ZW0pIHtcbiAgICAgIGRvUmVtb3ZlKGl0ZW0pO1xuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIGRvUmVtb3ZlKHZhbCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gdHJhaWxpbmdOYW1lUyhuYW1lKSB7XG4gIHJldHVybiBuYW1lW25hbWUubGVuZ3RoIC0gMV0gPT09ICdzJyA/ICdcXCYjeDIwMTk7JyA6ICdcXCYjeDIwMTk7cyc7XG59XG5cbnZhciBkZWZpbmVQcm9wZXJ0eSA9IGZ1bmN0aW9uIChvYmosIGtleSwgdmFsdWUpIHtcbiAgaWYgKGtleSBpbiBvYmopIHtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHtcbiAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICB3cml0YWJsZTogdHJ1ZVxuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIG9ialtrZXldID0gdmFsdWU7XG4gIH1cblxuICByZXR1cm4gb2JqO1xufTtcblxudmFyIF9leHRlbmRzID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiAodGFyZ2V0KSB7XG4gIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXTtcblxuICAgIGZvciAodmFyIGtleSBpbiBzb3VyY2UpIHtcbiAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoc291cmNlLCBrZXkpKSB7XG4gICAgICAgIHRhcmdldFtrZXldID0gc291cmNlW2tleV07XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRhcmdldDtcbn07XG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxudmFyIHRvQ29uc3VtYWJsZUFycmF5ID0gZnVuY3Rpb24gKGFycikge1xuICBpZiAoQXJyYXkuaXNBcnJheShhcnIpKSB7XG4gICAgZm9yICh2YXIgaSA9IDAsIGFycjIgPSBBcnJheShhcnIubGVuZ3RoKTsgaSA8IGFyci5sZW5ndGg7IGkrKykgYXJyMltpXSA9IGFycltpXTtcblxuICAgIHJldHVybiBhcnIyO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBBcnJheS5mcm9tKGFycik7XG4gIH1cbn07XG5cbnZhciBIT1VTRUhPTERfTUVNQkVSU19TVE9SQUdFX0tFWSA9ICdob3VzZWhvbGQtbWVtYmVycyc7XG52YXIgVVNFUl9IT1VTRUhPTERfTUVNQkVSX0lEID0gJ3BlcnNvbl9tZSc7XG52YXIgSE9VU0VIT0xEX01FTUJFUl9UWVBFID0gJ2hvdXNlaG9sZC1tZW1iZXInO1xudmFyIFZJU0lUT1JfVFlQRSA9ICd2aXNpdG9yJztcblxuLyoqXG4gKiBUeXBlc1xuICovXG5mdW5jdGlvbiBwZXJzb24ob3B0cykge1xuICBpZiAob3B0cy5maXJzdE5hbWUgPT09ICcnIHx8IG9wdHMubGFzdE5hbWUgPT09ICcnKSB7XG4gICAgY29uc29sZS5sb2coJ1VuYWJsZSB0byBjcmVhdGUgcGVyc29uIHdpdGggZGF0YTogJywgb3B0cy5maXJzdE5hbWUsICFvcHRzLm1pZGRsZU5hbWUsICFvcHRzLmxhc3ROYW1lKTtcbiAgfVxuXG4gIHZhciBtaWRkbGVOYW1lID0gb3B0cy5taWRkbGVOYW1lIHx8ICcnO1xuXG4gIHJldHVybiB7XG4gICAgZnVsbE5hbWU6IG9wdHMuZmlyc3ROYW1lICsgJyAnICsgbWlkZGxlTmFtZSArICcgJyArIG9wdHMubGFzdE5hbWUsXG4gICAgZmlyc3ROYW1lOiBvcHRzLmZpcnN0TmFtZSxcbiAgICBtaWRkbGVOYW1lOiBtaWRkbGVOYW1lLFxuICAgIGxhc3ROYW1lOiBvcHRzLmxhc3ROYW1lXG4gIH07XG59XG5cbi8qKlxuICogU3RvcmFnZVxuICovXG5mdW5jdGlvbiBnZXRVc2VyQXNIb3VzZWhvbGRNZW1iZXIoKSB7XG4gIHJldHVybiBnZXRBbGxIb3VzZWhvbGRNZW1iZXJzKCkuZmluZChmdW5jdGlvbiAobWVtYmVyKSB7XG4gICAgcmV0dXJuIG1lbWJlclsnQHBlcnNvbiddLmlkID09PSBVU0VSX0hPVVNFSE9MRF9NRU1CRVJfSUQ7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBkZWxldGVVc2VyQXNIb3VzZWhvbGRNZW1iZXIoKSB7XG4gIGRlbGV0ZUhvdXNlaG9sZE1lbWJlcihVU0VSX0hPVVNFSE9MRF9NRU1CRVJfSUQpO1xufVxuXG5mdW5jdGlvbiBkZWxldGVIb3VzZWhvbGRNZW1iZXIocGVyc29uSWQpIHtcbiAgdmFyIG1lbWJlcnMgPSBnZXRBbGxIb3VzZWhvbGRNZW1iZXJzKCkuZmlsdGVyKGZ1bmN0aW9uIChtZW1iZXIpIHtcbiAgICByZXR1cm4gbWVtYmVyWydAcGVyc29uJ10uaWQgIT09IHBlcnNvbklkO1xuICB9KTtcblxuICBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKEhPVVNFSE9MRF9NRU1CRVJTX1NUT1JBR0VfS0VZLCBKU09OLnN0cmluZ2lmeShtZW1iZXJzKSk7XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZVVzZXJBc0hvdXNlaG9sZE1lbWJlcihwZXJzb24sIG1lbWJlckRhdGEpIHtcbiAgdmFyIHVzZXJBc0hvdXNlaG9sZE1lbWJlciA9IGdldFVzZXJBc0hvdXNlaG9sZE1lbWJlcigpO1xuXG4gIHVzZXJBc0hvdXNlaG9sZE1lbWJlciA/IHVwZGF0ZUhvdXNlaG9sZE1lbWJlcih1c2VyQXNIb3VzZWhvbGRNZW1iZXJbJ0BwZXJzb24nXSwgbWVtYmVyRGF0YSkgOiBhZGRIb3VzZWhvbGRNZW1iZXIocGVyc29uLCBtZW1iZXJEYXRhLCBVU0VSX0hPVVNFSE9MRF9NRU1CRVJfSUQpO1xufVxuXG5mdW5jdGlvbiB1cGRhdGVIb3VzZWhvbGRNZW1iZXIocGVyc29uLCBtZW1iZXJEYXRhKSB7XG4gIHZhciBtZW1iZXJzVXBkYXRlZCA9IGdldEFsbEhvdXNlaG9sZE1lbWJlcnMoKS5tYXAoZnVuY3Rpb24gKG1lbWJlcikge1xuICAgIHJldHVybiBtZW1iZXJbJ0BwZXJzb24nXS5pZCA9PT0gcGVyc29uLmlkID8gX2V4dGVuZHMoe30sIG1lbWJlciwgbWVtYmVyRGF0YSwgeyAnQHBlcnNvbic6IF9leHRlbmRzKHt9LCBtZW1iZXJbJ0BwZXJzb24nXSwgcGVyc29uKSB9KSA6IG1lbWJlcjtcbiAgfSk7XG5cbiAgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbShIT1VTRUhPTERfTUVNQkVSU19TVE9SQUdFX0tFWSwgSlNPTi5zdHJpbmdpZnkobWVtYmVyc1VwZGF0ZWQpKTtcbn1cblxuZnVuY3Rpb24gYWRkSG91c2Vob2xkTWVtYmVyKHBlcnNvbiwgbWVtYmVyRGF0YSwgaWQpIHtcbiAgdmFyIHBlb3BsZSA9IGdldEFsbEhvdXNlaG9sZE1lbWJlcnMoKSB8fCBbXTtcbiAgbWVtYmVyRGF0YSA9IG1lbWJlckRhdGEgfHwge307XG5cbiAgLyoqXG4gICAqIFVzZXIgaXMgYWx3YXlzIGZpcnN0IGluIHRoZSBob3VzZWhvbGQgbGlzdFxuICAgKi9cbiAgcGVvcGxlW2lkID09PSBVU0VSX0hPVVNFSE9MRF9NRU1CRVJfSUQgPyAndW5zaGlmdCcgOiAncHVzaCddKF9leHRlbmRzKHt9LCBtZW1iZXJEYXRhLCB7XG4gICAgdHlwZTogbWVtYmVyRGF0YS50eXBlIHx8IEhPVVNFSE9MRF9NRU1CRVJfVFlQRSxcbiAgICAnQHBlcnNvbic6IF9leHRlbmRzKHt9LCBwZXJzb24sIHtcbiAgICAgIGlkOiBpZCB8fCAncGVyc29uJyArIGF1dG9JbmNyZW1lbnRJZCgnaG91c2Vob2xkLW1lbWJlcnMnKVxuICAgIH0pXG4gIH0pKTtcblxuICBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKEhPVVNFSE9MRF9NRU1CRVJTX1NUT1JBR0VfS0VZLCBKU09OLnN0cmluZ2lmeShwZW9wbGUpKTtcbn1cblxuZnVuY3Rpb24gZ2V0QWxsSG91c2Vob2xkTWVtYmVycygpIHtcbiAgcmV0dXJuIEpTT04ucGFyc2Uoc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbShIT1VTRUhPTERfTUVNQkVSU19TVE9SQUdFX0tFWSkpIHx8IFtdO1xufVxuXG5mdW5jdGlvbiBnZXRIb3VzZWhvbGRNZW1iZXJCeVBlcnNvbklkKGlkKSB7XG4gIHJldHVybiBnZXRBbGxIb3VzZWhvbGRNZW1iZXJzKCkuZmluZChmdW5jdGlvbiAobWVtYmVyKSB7XG4gICAgcmV0dXJuIG1lbWJlclsnQHBlcnNvbiddLmlkID09PSBpZDtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGdldE1lbWJlclBlcnNvbklkKG1lbWJlcikge1xuICByZXR1cm4gbWVtYmVyWydAcGVyc29uJ10uaWQ7XG59XG5cbi8qKlxuICogQ29tcGFyYXRvcnNcbiAqL1xuZnVuY3Rpb24gaXNWaXNpdG9yKG1lbWJlcikge1xuICByZXR1cm4gbWVtYmVyLnR5cGUgPT09IHdpbmRvdy5PTlMuc3RvcmFnZS5LRVlTLlZJU0lUT1JfVFlQRTtcbn1cblxuZnVuY3Rpb24gaXNIb3VzZWhvbGRNZW1iZXIobWVtYmVyKSB7XG4gIHJldHVybiBtZW1iZXIudHlwZSA9PT0gd2luZG93Lk9OUy5zdG9yYWdlLktFWVMuSE9VU0VIT0xEX01FTUJFUl9UWVBFO1xufVxuXG5mdW5jdGlvbiBpc090aGVySG91c2Vob2xkTWVtYmVyKG1lbWJlcikge1xuICByZXR1cm4gbWVtYmVyLnR5cGUgPT09IHdpbmRvdy5PTlMuc3RvcmFnZS5LRVlTLkhPVVNFSE9MRF9NRU1CRVJfVFlQRSAmJiBtZW1iZXJbJ0BwZXJzb24nXS5pZCAhPT0gd2luZG93Lk9OUy5zdG9yYWdlLklEUy5VU0VSX0hPVVNFSE9MRF9NRU1CRVJfSUQ7XG59XG5cbnZhciB0ZW1wQXdheVF1ZXN0aW9uU2VudGVuY2VNYXAgPSB7XG4gICd0aHJlZS1tb3JlJzogJ1Blb3BsZSB3aG8gdXN1YWxseSBsaXZlIG91dHNpZGUgdGhlIFVLIHdobyBhcmUgc3RheWluZyBpbiB0aGUgVUsgZm9yIDMgbW9udGhzIG9yIG1vcmUnLFxuICAncGVybS1hd2F5JzogJ1Blb3BsZSB3aG8gd29yayBhd2F5IGZyb20gaG9tZSB3aXRoaW4gdGhlIFVLLCBpZiB0aGlzIGlzJyArICcgdGhlaXIgcGVybWFuZW50IG9yIGZhbWlseSBob21lJyxcbiAgJ2FybWVkLWZvcmNlcyc6ICdNZW1iZXJzIG9mIHRoZSBhcm1lZCBmb3JjZXMsIGlmIHRoaXMgaXMgdGhlaXIgcGVybWFuZW50IG9yJyArICcgZmFtaWx5IGhvbWUnLFxuICAnbGVzcy10d2VsdmUnOiAnUGVvcGxlIHdobyBhcmUgdGVtcG9yYXJpbHkgb3V0c2lkZSB0aGUgVUsgZm9yIGxlc3MgdGhhbiAxMicgKyAnIG1vbnRocycsXG4gICd1c3VhbGx5LXRlbXAnOiAnUGVvcGxlIHN0YXlpbmcgdGVtcG9yYXJpbHkgd2hvIHVzdWFsbHkgbGl2ZSBpbiB0aGUgVUsgYnV0JyArICcgZG8gbm90IGhhdmUgYW5vdGhlciBVSyBhZGRyZXNzLCBmb3IgZXhhbXBsZSwgcmVsYXRpdmVzLCBmcmllbmRzJyxcbiAgJ290aGVyJzogJ090aGVyIHBlb3BsZSB3aG8gdXN1YWxseSBsaXZlIGhlcmUsIGluY2x1ZGluZyBhbnlvbmUgdGVtcG9yYXJpbHknICsgJyBhd2F5IGZyb20gaG9tZSdcbn07XG5cbi8qKlxuICogQXVnbWVudCBVbmRlcnNjb3JlIGxpYnJhcnlcbiAqL1xudmFyIF8kMSA9IHdpbmRvdy5fIHx8IHt9O1xuXG52YXIgUkVMQVRJT05TSElQU19TVE9SQUdFX0tFWSA9ICdyZWxhdGlvbnNoaXBzJztcblxudmFyIHJlbGF0aW9uc2hpcFR5cGVzID0ge1xuICAnc3BvdXNlJzogeyBpZDogJ3Nwb3VzZScgfSxcbiAgJ2NoaWxkLXBhcmVudCc6IHsgaWQ6ICdjaGlsZC1wYXJlbnQnIH0sXG4gICdzdGVwLWNoaWxkLXBhcmVudCc6IHsgaWQ6ICdzdGVwLWNoaWxkLXBhcmVudCcgfSxcbiAgJ2dyYW5kY2hpbGQtZ3JhbmRwYXJlbnQnOiB7IGlkOiAnZ3JhbmRjaGlsZC1ncmFuZHBhcmVudCcgfSxcbiAgJ2hhbGYtc2libGluZyc6IHsgaWQ6ICdoYWxmLXNpYmxpbmcnIH0sXG4gICdzaWJsaW5nJzogeyBpZDogJ3NpYmxpbmcnIH0sXG4gICdzdGVwLWJyb3RoZXItc2lzdGVyJzogeyBpZDogJ3N0ZXAtYnJvdGhlci1zaXN0ZXInIH0sXG4gICdwYXJ0bmVyJzogeyBpZDogJ3BhcnRuZXInIH0sXG4gICd1bnJlbGF0ZWQnOiB7IGlkOiAndW5yZWxhdGVkJyB9LFxuICAnb3RoZXItcmVsYXRpb24nOiB7IGlkOiAnb3RoZXItcmVsYXRpb24nIH1cbn07XG5cbnZhciByZWxhdGlvbnNoaXBEZXNjcmlwdGlvbk1hcCA9IHtcbiAgLy8gY292ZXJlZFxuICAnaHVzYmFuZC13aWZlJzoge1xuICAgIHNlbnRhbmNlTGFiZWw6ICdodXNiYW5kIG9yIHdpZmUnLFxuICAgIHN1bW1hcnlBZGplY3RpdmU6ICdodXNiYW5kIG9yIHdpZmUnLFxuICAgIHR5cGU6IHJlbGF0aW9uc2hpcFR5cGVzWydzcG91c2UnXVxuICB9LFxuICAvLyBjb3ZlcmVkXG4gICdtb3RoZXItZmF0aGVyJzoge1xuICAgIHNlbnRhbmNlTGFiZWw6ICdtb3RoZXIgb3IgZmF0aGVyJyxcbiAgICBzdW1tYXJ5QWRqZWN0aXZlOiAnbW90aGVyIG9yIGZhdGhlcicsXG4gICAgdHlwZTogcmVsYXRpb25zaGlwVHlwZXNbJ2NoaWxkLXBhcmVudCddXG4gIH0sXG4gIC8vIGNvdmVyZWRcbiAgJ3N0ZXAtbW90aGVyLWZhdGhlcic6IHtcbiAgICBzZW50YW5jZUxhYmVsOiAnc3RlcG1vdGhlciBvciBzdGVwZmF0aGVyJyxcbiAgICBzdW1tYXJ5QWRqZWN0aXZlOiAnc3RlcG1vdGhlciBvciBzdGVwZmF0aGVyJyxcbiAgICB0eXBlOiByZWxhdGlvbnNoaXBUeXBlc1snc3RlcC1jaGlsZC1wYXJlbnQnXVxuICB9LFxuICAvLyBjb3ZlcmVkXG4gICdzb24tZGF1Z2h0ZXInOiB7XG4gICAgc2VudGFuY2VMYWJlbDogJ3NvbiBvciBkYXVnaHRlcicsXG4gICAgc3VtbWFyeUFkamVjdGl2ZTogJ3NvbiBvciBkYXVnaHRlcicsXG4gICAgdHlwZTogcmVsYXRpb25zaGlwVHlwZXNbJ2NoaWxkLXBhcmVudCddXG4gIH0sXG4gIC8vIGNvdmVyZWRcbiAgJ2hhbGYtYnJvdGhlci1zaXN0ZXInOiB7XG4gICAgc2VudGFuY2VMYWJlbDogJ2hhbGYtYnJvdGhlciBvciBoYWxmLXNpc3RlcicsXG4gICAgc3VtbWFyeUFkamVjdGl2ZTogJ2hhbGYtYnJvdGhlciBvciBoYWxmLXNpc3RlcicsXG4gICAgdHlwZTogcmVsYXRpb25zaGlwVHlwZXNbJ2hhbGYtc2libGluZyddXG4gIH0sXG4gIC8vIGNvdmVyZWRcbiAgJ3N0ZXAtY2hpbGQnOiB7XG4gICAgc2VudGFuY2VMYWJlbDogJ3N0ZXBjaGlsZCcsXG4gICAgc3VtbWFyeUFkamVjdGl2ZTogJ3N0ZXBjaGlsZCcsXG4gICAgdHlwZTogcmVsYXRpb25zaGlwVHlwZXNbJ3N0ZXAtY2hpbGQtcGFyZW50J11cbiAgfSxcbiAgLy8gY292ZXJlZFxuICAnZ3JhbmRwYXJlbnQnOiB7XG4gICAgc2VudGFuY2VMYWJlbDogJ2dyYW5kcGFyZW50JyxcbiAgICBzdW1tYXJ5QWRqZWN0aXZlOiAnZ3JhbmRwYXJlbnQnLFxuICAgIHR5cGU6IHJlbGF0aW9uc2hpcFR5cGVzWydncmFuZGNoaWxkLWdyYW5kcGFyZW50J11cbiAgfSxcbiAgLy8gY292ZXJlZFxuICAnZ3JhbmRjaGlsZCc6IHtcbiAgICBzZW50YW5jZUxhYmVsOiAnZ3JhbmRjaGlsZCcsXG4gICAgc3VtbWFyeUFkamVjdGl2ZTogJ2dyYW5kY2hpbGQnLFxuICAgIHR5cGU6IHJlbGF0aW9uc2hpcFR5cGVzWydncmFuZGNoaWxkLWdyYW5kcGFyZW50J11cbiAgfSxcbiAgLy8gY292ZXJlZFxuICAnYnJvdGhlci1zaXN0ZXInOiB7XG4gICAgc2VudGFuY2VMYWJlbDogJ2Jyb3RoZXIgb3Igc2lzdGVyJyxcbiAgICBzdW1tYXJ5QWRqZWN0aXZlOiAnYnJvdGhlciBvciBzaXN0ZXInLFxuICAgIHR5cGU6IHJlbGF0aW9uc2hpcFR5cGVzWydzaWJsaW5nJ11cbiAgfSxcbiAgLy8gY292ZXJlZFxuICAnc3RlcC1icm90aGVyLXNpc3Rlcic6IHtcbiAgICBzZW50YW5jZUxhYmVsOiAnc3RlcGJyb3RoZXIgb3Igc3RlcHNpc3RlcicsXG4gICAgc3VtbWFyeUFkamVjdGl2ZTogJ3N0ZXBicm90aGVyIG9yIHN0ZXBzaXN0ZXInLFxuICAgIHR5cGU6IHJlbGF0aW9uc2hpcFR5cGVzWydzdGVwLWJyb3RoZXItc2lzdGVyJ11cbiAgfSxcbiAgLy8gY292ZXJlZFxuICAnb3RoZXItcmVsYXRpb24nOiB7XG4gICAgc2VudGFuY2VMYWJlbDogJ290aGVyIHJlbGF0aW9uJyxcbiAgICBzdW1tYXJ5QWRqZWN0aXZlOiAncmVsYXRlZCcsXG4gICAgdHlwZTogcmVsYXRpb25zaGlwVHlwZXNbJ290aGVyLXJlbGF0aW9uJ11cbiAgfSxcbiAgLy8gY292ZXJlZFxuICAncGFydG5lcic6IHtcbiAgICBzZW50YW5jZUxhYmVsOiAncGFydG5lcicsXG4gICAgc3VtbWFyeUFkamVjdGl2ZTogJ3BhcnRuZXInLFxuICAgIHR5cGU6IHJlbGF0aW9uc2hpcFR5cGVzWydwYXJ0bmVyJ11cbiAgfSxcbiAgJ3NhbWUtc2V4LXBhcnRuZXInOiB7XG4gICAgc2VudGFuY2VMYWJlbDogJ2xlZ2FsbHkgcmVnaXN0ZXJlZCBjaXZpbCBwYXJ0bmVyJyxcbiAgICBzdW1tYXJ5QWRqZWN0aXZlOiAnbGVnYWxseSByZWdpc3RlcmVkIGNpdmlsIHBhcnRuZXInLFxuICAgIHR5cGU6IHJlbGF0aW9uc2hpcFR5cGVzWydwYXJ0bmVyJ11cbiAgfSxcbiAgLy8gY292ZXJlZFxuICAndW5yZWxhdGVkJzoge1xuICAgIHNlbnRhbmNlTGFiZWw6ICd1bnJlbGF0ZWQnLFxuICAgIHN1bW1hcnlBZGplY3RpdmU6ICd1bnJlbGF0ZWQnLFxuICAgIHR5cGU6IHJlbGF0aW9uc2hpcFR5cGVzWyd1bnJlbGF0ZWQnXVxuICB9XG59O1xuXG5mdW5jdGlvbiBuYW1lRWxlbWVudChuYW1lKSB7XG4gIHJldHVybiAnPHN0cm9uZz4nICsgbmFtZSArICc8L3N0cm9uZz4nO1xufVxuXG5mdW5jdGlvbiBwZXJzb25MaXN0U3RyKHBlb3BsZUFycikge1xuICB2YXIgb3B0cyA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDoge307XG5cbiAgaWYgKHBlb3BsZUFyci5sZW5ndGggPCAxKSB7XG4gICAgY29uc29sZS5sb2cocGVvcGxlQXJyLCAnbm90IGVub3VnaCBwZW9wbGUgdG8gY3JlYXRlIGEgbGlzdCBzdHJpbmcnKTtcbiAgICByZXR1cm47XG4gIH1cblxuICBpZiAocGVvcGxlQXJyLmxlbmd0aCA9PT0gMSkge1xuICAgIHJldHVybiBuYW1lRWxlbWVudChwZW9wbGVBcnJbMF0uZnVsbE5hbWUgKyBmb3JtYXRQZXJzb25JZllvdShwZW9wbGVBcnJbMF0pKTtcbiAgfVxuXG4gIHZhciBwZW9wbGVDb3B5ID0gW10uY29uY2F0KHRvQ29uc3VtYWJsZUFycmF5KHBlb3BsZUFycikpLFxuICAgICAgbGFzdFBlcnNvbiA9IHBlb3BsZUNvcHkucG9wKCk7XG5cbiAgcmV0dXJuIHBlb3BsZUNvcHkubWFwKGZ1bmN0aW9uIChwZXJzb24kJDEpIHtcbiAgICByZXR1cm4gJycgKyBuYW1lRWxlbWVudChwZXJzb24kJDEuZnVsbE5hbWUgKyAob3B0cy5pc0ZhbWlseSA/IHRyYWlsaW5nTmFtZVMocGVyc29uJCQxLmZ1bGxOYW1lKSA6ICcnKSArIGZvcm1hdFBlcnNvbklmWW91KHBlcnNvbiQkMSkpO1xuICB9KS5qb2luKCcsICcpICsgJyBhbmQgJyArIG5hbWVFbGVtZW50KGxhc3RQZXJzb24uZnVsbE5hbWUgKyAob3B0cy5pc0ZhbWlseSA/IHRyYWlsaW5nTmFtZVMobGFzdFBlcnNvbi5mdWxsTmFtZSkgOiAnJykgKyBmb3JtYXRQZXJzb25JZllvdShsYXN0UGVyc29uKSk7XG59XG5cbmZ1bmN0aW9uIGZvcm1hdFBlcnNvbklmWW91KHBlcnNvbiQkMSkge1xuICByZXR1cm4gcGVyc29uJCQxLmlkID09PSBVU0VSX0hPVVNFSE9MRF9NRU1CRVJfSUQgPyAnIChZb3UpJyA6ICcnO1xufVxuXG52YXIgcmVsYXRpb25zaGlwU3VtbWFyeVRlbXBsYXRlcyA9IHtcbiAgJ3BhcnRuZXJzaGlwJzogZnVuY3Rpb24gcGFydG5lcnNoaXAocGVyc29uMSwgcGVyc29uMiwgZGVzY3JpcHRpb24pIHtcbiAgICByZXR1cm4gbmFtZUVsZW1lbnQocGVyc29uMS5mdWxsTmFtZSArIGZvcm1hdFBlcnNvbklmWW91KHBlcnNvbjEpKSArICcgaXMgJyArIG5hbWVFbGVtZW50KHBlcnNvbjIuZnVsbE5hbWUgKyB0cmFpbGluZ05hbWVTKHBlcnNvbjIuZnVsbE5hbWUpICsgZm9ybWF0UGVyc29uSWZZb3UocGVyc29uMikpICsgJyAnICsgZGVzY3JpcHRpb247XG4gIH0sXG4gICd0d29GYW1pbHlNZW1iZXJzVG9NYW55JzogZnVuY3Rpb24gdHdvRmFtaWx5TWVtYmVyc1RvTWFueShwYXJlbnQxLCBwYXJlbnQyLCBjaGlsZHJlbkFyciwgZGVzY3JpcHRpb24pIHtcbiAgICByZXR1cm4gbmFtZUVsZW1lbnQocGFyZW50MS5mdWxsTmFtZSArIGZvcm1hdFBlcnNvbklmWW91KHBhcmVudDEpKSArICcgYW5kICcgKyBuYW1lRWxlbWVudChwYXJlbnQyLmZ1bGxOYW1lICsgZm9ybWF0UGVyc29uSWZZb3UocGFyZW50MikpICsgJyBhcmUgJyArIHBlcnNvbkxpc3RTdHIoY2hpbGRyZW5BcnIsIHsgaXNGYW1pbHk6IHRydWUgfSkgKyAnICcgKyBkZXNjcmlwdGlvbjtcbiAgfSxcbiAgJ29uZUZhbWlseU1lbWJlclRvTWFueSc6IGZ1bmN0aW9uIG9uZUZhbWlseU1lbWJlclRvTWFueShwYXJlbnQsIGNoaWxkcmVuQXJyLCBkZXNjcmlwdGlvbikge1xuICAgIGNvbnNvbGUubG9nKHBhcmVudCwgY2hpbGRyZW5BcnIsIGRlc2NyaXB0aW9uKTtcbiAgICByZXR1cm4gbmFtZUVsZW1lbnQocGFyZW50LmZ1bGxOYW1lICsgZm9ybWF0UGVyc29uSWZZb3UocGFyZW50KSkgKyAnIGlzICcgKyBwZXJzb25MaXN0U3RyKGNoaWxkcmVuQXJyLCB7IGlzRmFtaWx5OiB0cnVlIH0pICsgJyAnICsgZGVzY3JpcHRpb247XG4gIH0sXG4gICdtYW55VG9NYW55JzogZnVuY3Rpb24gbWFueVRvTWFueShwZW9wbGVBcnIxLCBwZW9wbGVBcnIyLCBkZXNjcmlwdGlvbikge1xuICAgIHJldHVybiBwZXJzb25MaXN0U3RyKHBlb3BsZUFycjEpICsgJyAnICsgKHBlb3BsZUFycjEubGVuZ3RoID4gMSA/ICdhcmUnIDogJ2lzJykgKyAnICcgKyBkZXNjcmlwdGlvbiArICcgdG8gJyArIHBlcnNvbkxpc3RTdHIocGVvcGxlQXJyMik7XG4gIH0sXG4gICdhbGxNdXR1YWwnOiBmdW5jdGlvbiBhbGxNdXR1YWwocGVvcGxlQXJyLCBkZXNjcmlwdGlvbikge1xuICAgIHJldHVybiBwZXJzb25MaXN0U3RyKHBlb3BsZUFycikgKyAnIGFyZSAnICsgZGVzY3JpcHRpb247XG4gIH1cbn07XG5cbi8qKlxuICogVHlwZXNcbiAqL1xuZnVuY3Rpb24gcmVsYXRpb25zaGlwKGRlc2NyaXB0aW9uLCBwZXJzb25Jc0lkLCBwZXJzb25Ub0lkKSB7XG4gIHZhciBvcHRzID0gYXJndW1lbnRzLmxlbmd0aCA+IDMgJiYgYXJndW1lbnRzWzNdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbM10gOiB7fTtcblxuICByZXR1cm4ge1xuICAgIHBlcnNvbklzRGVzY3JpcHRpb246IGRlc2NyaXB0aW9uLFxuICAgIHBlcnNvbklzSWQ6IHBlcnNvbklzSWQsXG4gICAgcGVyc29uVG9JZDogcGVyc29uVG9JZCxcbiAgICBpbmZlcnJlZDogISFvcHRzLmluZmVycmVkLFxuICAgIGluZmVycmVkQnk6IG9wdHMuaW5mZXJyZWRCeVxuICB9O1xufVxuXG4vKipcbiAqIFN0b3JhZ2VcbiAqL1xuZnVuY3Rpb24gYWRkUmVsYXRpb25zaGlwKHJlbGF0aW9uc2hpcE9iaikge1xuICB2YXIgaG91c2Vob2xkUmVsYXRpb25zaGlwcyA9IGdldEFsbFJlbGF0aW9uc2hpcHMoKSB8fCBbXSxcbiAgICAgIGl0ZW0gPSBfZXh0ZW5kcyh7fSwgcmVsYXRpb25zaGlwT2JqLCB7XG4gICAgaWQ6IGF1dG9JbmNyZW1lbnRJZChSRUxBVElPTlNISVBTX1NUT1JBR0VfS0VZKVxuICB9KTtcblxuICBob3VzZWhvbGRSZWxhdGlvbnNoaXBzLnB1c2goaXRlbSk7XG5cbiAgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbShSRUxBVElPTlNISVBTX1NUT1JBR0VfS0VZLCBKU09OLnN0cmluZ2lmeShob3VzZWhvbGRSZWxhdGlvbnNoaXBzKSk7XG5cbiAgcmV0dXJuIGl0ZW07XG59XG5cbmZ1bmN0aW9uIGRlbGV0ZVJlbGF0aW9uc2hpcChyZWxhdGlvbnNoaXBPYmopIHtcbiAgdmFyIGhvdXNlaG9sZFJlbGF0aW9uc2hpcHMgPSAoZ2V0QWxsUmVsYXRpb25zaGlwcygpIHx8IFtdKS5maWx0ZXIoZnVuY3Rpb24gKHJlbGF0aW9uc2hpcCkge1xuICAgIHJldHVybiByZWxhdGlvbnNoaXAuaWQgIT09IHJlbGF0aW9uc2hpcE9iai5pZDtcbiAgfSk7XG5cbiAgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbShSRUxBVElPTlNISVBTX1NUT1JBR0VfS0VZLCBKU09OLnN0cmluZ2lmeShob3VzZWhvbGRSZWxhdGlvbnNoaXBzKSk7XG59XG5cbmZ1bmN0aW9uIGVkaXRSZWxhdGlvbnNoaXAocmVsYXRpb25zaGlwSWQsIHZhbHVlT2JqZWN0KSB7XG4gIHZhciBob3VzZWhvbGRSZWxhdGlvbnNoaXBzID0gKGdldEFsbFJlbGF0aW9uc2hpcHMoKSB8fCBbXSkubWFwKGZ1bmN0aW9uIChyZWxhdGlvbnNoaXApIHtcbiAgICByZXR1cm4gcmVsYXRpb25zaGlwLmlkICsgJycgPT09IHJlbGF0aW9uc2hpcElkICsgJycgPyBfZXh0ZW5kcyh7fSwgdmFsdWVPYmplY3QsIHtcbiAgICAgIGlkOiByZWxhdGlvbnNoaXBJZFxuICAgIH0pIDogcmVsYXRpb25zaGlwO1xuICB9KTtcblxuICBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKFJFTEFUSU9OU0hJUFNfU1RPUkFHRV9LRVksIEpTT04uc3RyaW5naWZ5KGhvdXNlaG9sZFJlbGF0aW9uc2hpcHMpKTtcbn1cblxuZnVuY3Rpb24gZ2V0QWxsUmVsYXRpb25zaGlwcygpIHtcbiAgcmV0dXJuIEpTT04ucGFyc2Uoc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbShSRUxBVElPTlNISVBTX1NUT1JBR0VfS0VZKSkgfHwgW107XG59XG5cbmZ1bmN0aW9uIGdldEFsbE1hbnVhbFJlbGF0aW9uc2hpcHMoKSB7XG4gIHJldHVybiBnZXRBbGxSZWxhdGlvbnNoaXBzKCkuZmlsdGVyKGZ1bmN0aW9uIChyZWxhdGlvbnNoaXApIHtcbiAgICByZXR1cm4gIXJlbGF0aW9uc2hpcC5pbmZlcnJlZDtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGRlbGV0ZUFsbFJlbGF0aW9uc2hpcHNGb3JNZW1iZXIocGVyc29uSWQpIHtcbiAgdmFyIGhvdXNlaG9sZFJlbGF0aW9uc2hpcHMgPSBnZXRBbGxSZWxhdGlvbnNoaXBzKCkuZmlsdGVyKGZ1bmN0aW9uIChyZWxhdGlvbnNoaXApIHtcbiAgICByZXR1cm4gIShwZXJzb25JZCA9PT0gcmVsYXRpb25zaGlwLnBlcnNvbklzSWQgfHwgcGVyc29uSWQgPT09IHJlbGF0aW9uc2hpcC5wZXJzb25Ub0lkKTtcbiAgfSk7XG5cbiAgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbShSRUxBVElPTlNISVBTX1NUT1JBR0VfS0VZLCBKU09OLnN0cmluZ2lmeShob3VzZWhvbGRSZWxhdGlvbnNoaXBzKSk7XG59XG5cbi8qKlxuICogQ29tcGFyYXRvcnNcbiAqL1xuZnVuY3Rpb24gaXNJblJlbGF0aW9uc2hpcChwZXJzb25JZCwgcmVsYXRpb25zaGlwKSB7XG4gIHJldHVybiByZWxhdGlvbnNoaXAucGVyc29uVG9JZCA9PT0gcGVyc29uSWQgfHwgcmVsYXRpb25zaGlwLnBlcnNvbklzSWQgPT09IHBlcnNvbklkO1xufVxuXG5mdW5jdGlvbiBpc0FDaGlsZEluUmVsYXRpb25zaGlwKHBlcnNvbklkLCByZWxhdGlvbnNoaXApIHtcbiAgLyoqXG4gICAqIEd1YXJkXG4gICAqL1xuICBpZiAoIWlzSW5SZWxhdGlvbnNoaXAocGVyc29uSWQsIHJlbGF0aW9uc2hpcCkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICByZXR1cm4gcmVsYXRpb25zaGlwLnBlcnNvbklzRGVzY3JpcHRpb24gPT09ICdtb3RoZXItZmF0aGVyJyAmJiByZWxhdGlvbnNoaXAucGVyc29uVG9JZCA9PT0gcGVyc29uSWQgfHwgcmVsYXRpb25zaGlwLnBlcnNvbklzRGVzY3JpcHRpb24gPT09ICdzb24tZGF1Z2h0ZXInICYmIHJlbGF0aW9uc2hpcC5wZXJzb25Jc0lkID09PSBwZXJzb25JZDtcbn1cblxuZnVuY3Rpb24gaXNBU2libGluZ0luUmVsYXRpb25zaGlwKHBlcnNvbklkLCByZWxhdGlvbnNoaXApIHtcbiAgcmV0dXJuIGlzSW5SZWxhdGlvbnNoaXAocGVyc29uSWQsIHJlbGF0aW9uc2hpcCkgJiYgcmVsYXRpb25zaGlwRGVzY3JpcHRpb25NYXBbcmVsYXRpb25zaGlwLnBlcnNvbklzRGVzY3JpcHRpb25dLnR5cGUuaWQgPT09ICdzaWJsaW5nJztcbn1cblxuZnVuY3Rpb24gaXNBUGFyZW50SW5SZWxhdGlvbnNoaXAocGVyc29uSWQsIHJlbGF0aW9uc2hpcCkge1xuICAvKipcbiAgICogR3VhcmRcbiAgICovXG4gIGlmICghaXNJblJlbGF0aW9uc2hpcChwZXJzb25JZCwgcmVsYXRpb25zaGlwKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHJldHVybiByZWxhdGlvbnNoaXAucGVyc29uSXNEZXNjcmlwdGlvbiA9PT0gJ21vdGhlci1mYXRoZXInICYmIHJlbGF0aW9uc2hpcC5wZXJzb25Jc0lkID09PSBwZXJzb25JZCB8fCByZWxhdGlvbnNoaXAucGVyc29uSXNEZXNjcmlwdGlvbiA9PT0gJ3Nvbi1kYXVnaHRlcicgJiYgcmVsYXRpb25zaGlwLnBlcnNvblRvSWQgPT09IHBlcnNvbklkO1xufVxuXG5mdW5jdGlvbiBhcmVBbnlDaGlsZHJlbkluUmVsYXRpb25zaGlwTm90UGFyZW50KGNoaWxkcmVuSWRzLCBub3RQYXJlbnRJZCwgcmVsYXRpb25zaGlwKSB7XG4gIC8qKlxuICAgKiBHdWFyZFxuICAgKiBJZiByZWxhdGlvbnNoaXAgdHlwZSBpcyBub3QgY2hpbGQtcGFyZW50XG4gICAqL1xuICBpZiAocmVsYXRpb25zaGlwRGVzY3JpcHRpb25NYXBbcmVsYXRpb25zaGlwLnBlcnNvbklzRGVzY3JpcHRpb25dLnR5cGUuaWQgIT09ICdjaGlsZC1wYXJlbnQnKSB7XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICB2YXIgY2hpbGRJbmRleEFzUGVyc29uSXMgPSBjaGlsZHJlbklkcy5pbmRleE9mKHJlbGF0aW9uc2hpcC5wZXJzb25Jc0lkKSxcbiAgICAgIGNoaWxkSW5kZXhBc1BlcnNvblRvID0gY2hpbGRyZW5JZHMuaW5kZXhPZihyZWxhdGlvbnNoaXAucGVyc29uVG9JZCk7XG5cbiAgLyoqXG4gICAqIEZpbmQgcGFyZW50cyB3aXRoIHRoZSBzYW1lIGNoaWxkcmVuXG4gICAqXG4gICAqIElmIGEgcGVyc29uSXMtY2hpbGQgaXMgbm90IGluIHJlbGF0aW9uc2hpcFxuICAgKiBvciAyIGNoaWxkcmVuIGFyZSBmb3VuZCBpbiByZWxhdGlvbnNoaXBcbiAgICovXG4gIGlmIChjaGlsZEluZGV4QXNQZXJzb25JcyA9PT0gLTEgJiYgY2hpbGRJbmRleEFzUGVyc29uVG8gPT09IC0xIHx8IGNoaWxkSW5kZXhBc1BlcnNvbklzICE9PSAtMSAmJiBjaGlsZEluZGV4QXNQZXJzb25UbyAhPT0gLTEpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvKipcbiAgICogQ2hpbGQgbXVzdCBiZSBpbiByZWxhdGlvbnNoaXAsIGdldCBjaGlsZCBpbmRleFxuICAgKi9cbiAgdmFyIGNoaWxkSW5kZXggPSBjaGlsZEluZGV4QXNQZXJzb25JcyAhPT0gLTEgPyBjaGlsZEluZGV4QXNQZXJzb25JcyA6IGNoaWxkSW5kZXhBc1BlcnNvblRvO1xuXG4gIC8qKlxuICAgKiBJZiBwZXJzb25JcyBpcyBub3QgaW4gcmVsYXRpb25zaGlwXG4gICAqIGFuZCBjaGlsZCBmcm9tIHByZXZpb3VzIHJlbGF0aW9uc2hpcCBpcyBhIGNoaWxkIGluIHRoaXMgcmVsYXRpb25zaGlwXG4gICAqL1xuICByZXR1cm4gIWlzSW5SZWxhdGlvbnNoaXAobm90UGFyZW50SWQsIHJlbGF0aW9uc2hpcCkgJiYgaXNBQ2hpbGRJblJlbGF0aW9uc2hpcChjaGlsZHJlbklkc1tjaGlsZEluZGV4XSwgcmVsYXRpb25zaGlwKTtcbn1cblxuZnVuY3Rpb24gaXNSZWxhdGlvbnNoaXBUeXBlKHJlbGF0aW9uc2hpcFR5cGUsIHJlbGF0aW9uc2hpcCkge1xuICB2YXIgdHlwZU9mUmVsYXRpb25zaGlwID0gcmVsYXRpb25zaGlwRGVzY3JpcHRpb25NYXBbcmVsYXRpb25zaGlwLnBlcnNvbklzRGVzY3JpcHRpb25dLnR5cGUuaWQ7XG5cbiAgLyoqXG4gICAqIHJlbGF0aW9uc2hpcFR5cGUgY2FuIGJlIGFuIGFycmF5IG9mIHR5cGVzXG4gICAqL1xuICByZXR1cm4gXyQxLmlzQXJyYXkocmVsYXRpb25zaGlwVHlwZSkgPyAhIV8kMS5maW5kKHJlbGF0aW9uc2hpcFR5cGUsIGZ1bmN0aW9uIChyVHlwZSkge1xuICAgIHJldHVybiByVHlwZSA9PT0gdHlwZU9mUmVsYXRpb25zaGlwO1xuICB9KSA6IHR5cGVPZlJlbGF0aW9uc2hpcCA9PT0gcmVsYXRpb25zaGlwVHlwZTtcbn1cblxuZnVuY3Rpb24gaXNSZWxhdGlvbnNoaXBJbmZlcnJlZChyZWxhdGlvbnNoaXApIHtcbiAgcmV0dXJuIHJlbGF0aW9uc2hpcC5pbmZlcnJlZDtcbn1cblxuLyoqXG4gKiBSZXRyaWV2ZSBwZW9wbGUgYnkgcm9sZSBpbiByZWxhdGlvbnNoaXBzXG4gKi9cbmZ1bmN0aW9uIGdldFBhcmVudElkRnJvbVJlbGF0aW9uc2hpcChyZWxhdGlvbnNoaXApIHtcbiAgdmFyIHBhcmVudElkID0gdm9pZCAwO1xuXG4gIGlmIChyZWxhdGlvbnNoaXAucGVyc29uSXNEZXNjcmlwdGlvbiA9PT0gJ21vdGhlci1mYXRoZXInKSB7XG4gICAgcGFyZW50SWQgPSByZWxhdGlvbnNoaXAucGVyc29uSXNJZDtcbiAgfVxuXG4gIGlmIChyZWxhdGlvbnNoaXAucGVyc29uSXNEZXNjcmlwdGlvbiA9PT0gJ3Nvbi1kYXVnaHRlcicpIHtcbiAgICBwYXJlbnRJZCA9IHJlbGF0aW9uc2hpcC5wZXJzb25Ub0lkO1xuICB9XG5cbiAgaWYgKCFwYXJlbnRJZCkge1xuICAgIGNvbnNvbGUubG9nKCdQYXJlbnQgbm90IGZvdW5kIGluIHJlbGF0aW9uc2hpcDogJywgcmVsYXRpb25zaGlwKTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICByZXR1cm4gcGFyZW50SWQ7XG59XG5cbmZ1bmN0aW9uIGdldENoaWxkSWRGcm9tUmVsYXRpb25zaGlwKHJlbGF0aW9uc2hpcCkge1xuICB2YXIgY2hpbGRJZCA9IHZvaWQgMDtcblxuICBpZiAocmVsYXRpb25zaGlwLnBlcnNvbklzRGVzY3JpcHRpb24gPT09ICdtb3RoZXItZmF0aGVyJykge1xuICAgIGNoaWxkSWQgPSByZWxhdGlvbnNoaXAucGVyc29uVG9JZDtcbiAgfVxuXG4gIGlmIChyZWxhdGlvbnNoaXAucGVyc29uSXNEZXNjcmlwdGlvbiA9PT0gJ3Nvbi1kYXVnaHRlcicpIHtcbiAgICBjaGlsZElkID0gcmVsYXRpb25zaGlwLnBlcnNvbklzSWQ7XG4gIH1cblxuICBpZiAoIWNoaWxkSWQpIHtcbiAgICBjb25zb2xlLmxvZygnQ2hpbGQgbm90IGZvdW5kIGluIHJlbGF0aW9uc2hpcDogJywgcmVsYXRpb25zaGlwKTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICByZXR1cm4gY2hpbGRJZDtcbn1cblxuZnVuY3Rpb24gZ2V0U2libGluZ0lkRnJvbVJlbGF0aW9uc2hpcChwZXJzb25JZCwgcmVsYXRpb25zaGlwKSB7XG4gIGlmICghaXNJblJlbGF0aW9uc2hpcChwZXJzb25JZCwgcmVsYXRpb25zaGlwKSkge1xuICAgIGNvbnNvbGUubG9nKCdQZXJzb24gJyArIHBlcnNvbklkICsgJyBub3QgZm91bmQgaW4gcmVsYXRpb25zaGlwOiAnLCByZWxhdGlvbnNoaXApO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHJldHVybiByZWxhdGlvbnNoaXBbcmVsYXRpb25zaGlwLnBlcnNvbklzSWQgPT09IHBlcnNvbklkID8gJ3BlcnNvblRvSWQnIDogJ3BlcnNvbklzSWQnXTtcbn1cblxuZnVuY3Rpb24gZ2V0T3RoZXJQZXJzb25JZEZyb21SZWxhdGlvbnNoaXAocGVyc29uSWQsIHJlbGF0aW9uc2hpcCkge1xuICByZXR1cm4gcmVsYXRpb25zaGlwLnBlcnNvbklzSWQgPT09IHBlcnNvbklkID8gcmVsYXRpb25zaGlwLnBlcnNvblRvSWQgOiByZWxhdGlvbnNoaXAucGVyc29uSXNJZDtcbn1cblxuZnVuY3Rpb24gZ2V0QWxsUGFyZW50c09mKHBlcnNvbklkKSB7XG4gIHJldHVybiBnZXRBbGxSZWxhdGlvbnNoaXBzKCkuZmlsdGVyKGlzQUNoaWxkSW5SZWxhdGlvbnNoaXAuYmluZChudWxsLCBwZXJzb25JZCkpLm1hcChmdW5jdGlvbiAocmVsYXRpb25zaGlwKSB7XG4gICAgcmV0dXJuIGdldFBlcnNvbkZyb21NZW1iZXIoZ2V0SG91c2Vob2xkTWVtYmVyQnlQZXJzb25JZChnZXRQYXJlbnRJZEZyb21SZWxhdGlvbnNoaXAocmVsYXRpb25zaGlwKSkpO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gZ2V0QWxsQ2hpbGRyZW5PZihwZXJzb25JZCkge1xuICByZXR1cm4gZ2V0QWxsUmVsYXRpb25zaGlwcygpLmZpbHRlcihpc0FQYXJlbnRJblJlbGF0aW9uc2hpcC5iaW5kKG51bGwsIHBlcnNvbklkKSkubWFwKGZ1bmN0aW9uIChyZWxhdGlvbnNoaXApIHtcbiAgICByZXR1cm4gZ2V0SG91c2Vob2xkTWVtYmVyQnlQZXJzb25JZChnZXRDaGlsZElkRnJvbVJlbGF0aW9uc2hpcChyZWxhdGlvbnNoaXApKVsnQHBlcnNvbiddO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gZ2V0UGVyc29uSWRGcm9tUGVyc29uKHBlcnNvbiQkMSkge1xuICByZXR1cm4gcGVyc29uJCQxLmlkO1xufVxuXG5mdW5jdGlvbiBnZXRQZXJzb25Gcm9tTWVtYmVyKG1lbWJlcikge1xuICByZXR1cm4gbWVtYmVyWydAcGVyc29uJ107XG59XG5cbi8qKlxuICogTWlzc2luZyByZWxhdGlvbnNoaXAgaW5mZXJlbmNlXG4gKi9cbnZhciBtaXNzaW5nUmVsYXRpb25zaGlwSW5mZXJlbmNlID0ge1xuICBzaWJsaW5nc09mOiBmdW5jdGlvbiBzaWJsaW5nc09mKHN1YmplY3RNZW1iZXIpIHtcblxuICAgIHZhciBtaXNzaW5nUmVsYXRpb25zaGlwcyA9IFtdLFxuICAgICAgICBhbGxSZWxhdGlvbnNoaXBzID0gZ2V0QWxsUmVsYXRpb25zaGlwcygpLFxuICAgICAgICBwZXJzb24kJDEgPSBnZXRQZXJzb25Gcm9tTWVtYmVyKHN1YmplY3RNZW1iZXIpLFxuICAgICAgICBwZXJzb25JZCA9IHBlcnNvbiQkMS5pZCxcbiAgICAgICAgcGFyZW50cyA9IGdldEFsbFBhcmVudHNPZihwZXJzb25JZCksXG4gICAgICAgIHNpYmxpbmdJZHMgPSBhbGxSZWxhdGlvbnNoaXBzLmZpbHRlcihpc0FTaWJsaW5nSW5SZWxhdGlvbnNoaXAuYmluZChudWxsLCBwZXJzb25JZCkpLm1hcChnZXRTaWJsaW5nSWRGcm9tUmVsYXRpb25zaGlwLmJpbmQobnVsbCwgcGVyc29uSWQpKTtcblxuICAgIC8qKlxuICAgICAqIElmIDIgcGFyZW50IHJlbGF0aW9uc2hpcHMgb2YgJ3BlcnNvbicgYXJlIGZvdW5kIHdlIGNhbiBhdHRlbXB0IHRvIGluZmVyXG4gICAgICogc2libGluZyByZWxhdGlvbnNoaXBzXG4gICAgICovXG4gICAgaWYgKHBhcmVudHMubGVuZ3RoID09PSAyKSB7XG5cbiAgICAgIGdldEFsbEhvdXNlaG9sZE1lbWJlcnMoKS5maWx0ZXIoaXNIb3VzZWhvbGRNZW1iZXIpLmZvckVhY2goZnVuY3Rpb24gKG1lbWJlcikge1xuXG4gICAgICAgIHZhciBtZW1iZXJQZXJzb25JZCA9IG1lbWJlclsnQHBlcnNvbiddLmlkO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBHdWFyZFxuICAgICAgICAgKiBJZiBtZW1iZXIgaXMgdGhlIHN1YmplY3QgbWVtYmVyXG4gICAgICAgICAqIG9yIG1lbWJlciBpcyBhIHBhcmVudFxuICAgICAgICAgKiBvciBtZW1iZXIgYWxyZWFkeSBoYXMgYSBzaWJsaW5nIHJlbGF0aW9uc2hpcCB3aXRoICdwZXJzb24nXG4gICAgICAgICAqIHNraXAgbWVtYmVyXG4gICAgICAgICAqL1xuICAgICAgICBpZiAobWVtYmVyUGVyc29uSWQgPT09IHBlcnNvbklkIHx8IG1lbWJlclBlcnNvbklkID09PSBwYXJlbnRzWzBdLmlkIHx8IG1lbWJlclBlcnNvbklkID09PSBwYXJlbnRzWzFdLmlkIHx8IHNpYmxpbmdJZHMuaW5kZXhPZihtZW1iZXJQZXJzb25JZCkgPiAtMSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBtZW1iZXJQYXJlbnRzID0gZ2V0QWxsUGFyZW50c09mKG1lbWJlclBlcnNvbklkKTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogSWYgMiBwYXJlbnRzIG9mICdtZW1iZXInIGFyZSBmb3VuZFxuICAgICAgICAgKiBhbmQgdGhleSBhcmUgdGhlIHNhbWUgcGFyZW50cyBvZiAncGVyc29uJ1xuICAgICAgICAgKiB3ZSBoYXZlIGlkZW50aWZpZWQgYSBtaXNzaW5nIGluZmVycmVkIHJlbGF0aW9uc2hpcFxuICAgICAgICAgKi9cbiAgICAgICAgaWYgKG1lbWJlclBhcmVudHMubGVuZ3RoID09PSAyICYmIF8kMS5kaWZmZXJlbmNlKHBhcmVudHMubWFwKGdldFBlcnNvbklkRnJvbVBlcnNvbiksIG1lbWJlclBhcmVudHMubWFwKGdldFBlcnNvbklkRnJvbVBlcnNvbikpLmxlbmd0aCA9PT0gMCkge1xuXG4gICAgICAgICAgLyoqXG4gICAgICAgICAgICogQWRkIHRvIG1pc3NpbmdSZWxhdGlvbnNoaXBzXG4gICAgICAgICAgICovXG4gICAgICAgICAgbWlzc2luZ1JlbGF0aW9uc2hpcHMucHVzaChyZWxhdGlvbnNoaXAoJ2Jyb3RoZXItc2lzdGVyJywgcGVyc29uSWQsIG1lbWJlclBlcnNvbklkLCB7XG4gICAgICAgICAgICBpbmZlcnJlZDogdHJ1ZSxcbiAgICAgICAgICAgIGluZmVycmVkQnk6IFtcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogTXVzdCBiZSA0IHJlbGF0aW9uc2hpcHNcbiAgICAgICAgICAgICAqIENvdWxkIGhhdmUgdXNlZCBtZW1iZXIncyBwYXJlbnRzIGJ1dCB3ZSBjYW4gYXNzdW1lIHRoZXlcbiAgICAgICAgICAgICAqIG11c3QgYmUgdGhlIHNhbWUgYXQgdGhpcyBwb2ludCBvciB0aGUgaW5mZXJyZW5jZVxuICAgICAgICAgICAgICogY291bGRuJ3QgaGFwcGVuLlxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBnZXRSZWxhdGlvbnNoaXBPZihwZXJzb25JZCwgcGFyZW50c1swXS5pZCkuaWQsIGdldFJlbGF0aW9uc2hpcE9mKHBlcnNvbklkLCBwYXJlbnRzWzFdLmlkKS5pZCwgZ2V0UmVsYXRpb25zaGlwT2YobWVtYmVyUGVyc29uSWQsIHBhcmVudHNbMF0uaWQpLmlkLCBnZXRSZWxhdGlvbnNoaXBPZihtZW1iZXJQZXJzb25JZCwgcGFyZW50c1sxXS5pZCkuaWRdXG4gICAgICAgICAgfSkpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gbWlzc2luZ1JlbGF0aW9uc2hpcHM7XG4gIH1cbn07XG5cbmZ1bmN0aW9uIGluZmVyUmVsYXRpb25zaGlwcyhyZWxhdGlvbnNoaXAsIHBlcnNvbklzLCBwZXJzb25Ubykge1xuICB2YXIgbWlzc2luZ1JlbGF0aW9uc2hpcHMgPSBbXTtcblxuICBpZiAocmVsYXRpb25zaGlwLnBlcnNvbklzRGVzY3JpcHRpb24gPT09ICdtb3RoZXItZmF0aGVyJykge1xuICAgIG1pc3NpbmdSZWxhdGlvbnNoaXBzID0gbWlzc2luZ1JlbGF0aW9uc2hpcHMuY29uY2F0KG1pc3NpbmdSZWxhdGlvbnNoaXBJbmZlcmVuY2Uuc2libGluZ3NPZihwZXJzb25UbykpO1xuICB9XG5cbiAgaWYgKHJlbGF0aW9uc2hpcC5wZXJzb25Jc0Rlc2NyaXB0aW9uID09PSAnc29uLWRhdWdodGVyJykge1xuICAgIG1pc3NpbmdSZWxhdGlvbnNoaXBzID0gbWlzc2luZ1JlbGF0aW9uc2hpcHMuY29uY2F0KG1pc3NpbmdSZWxhdGlvbnNoaXBJbmZlcmVuY2Uuc2libGluZ3NPZihwZXJzb25JcykpO1xuICB9XG5cbiAgJC5lYWNoKG1pc3NpbmdSZWxhdGlvbnNoaXBzLCBmdW5jdGlvbiAoaSwgcmVsYXRpb25zaGlwKSB7XG4gICAgYWRkUmVsYXRpb25zaGlwKHJlbGF0aW9uc2hpcCk7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBmaW5kTmV4dE1pc3NpbmdSZWxhdGlvbnNoaXAoKSB7XG4gIHZhciBob3VzZWhvbGRNZW1iZXJzID0gZ2V0QWxsSG91c2Vob2xkTWVtYmVycygpLmZpbHRlcihpc0hvdXNlaG9sZE1lbWJlciksXG4gICAgICByZWxhdGlvbnNoaXBzID0gZ2V0QWxsUmVsYXRpb25zaGlwcygpLFxuICAgICAgbWlzc2luZ1JlbGF0aW9uc2hpcE1lbWJlcnMgPSBbXSxcbiAgICAgIHBlcnNvbklzID0gbnVsbDtcblxuICAvKipcbiAgICogRmluZCB0aGUgbmV4dCBtaXNzaW5nIHJlbGF0aW9uc2hpcFxuICAgKi9cbiAgJC5lYWNoKGhvdXNlaG9sZE1lbWJlcnMsIGZ1bmN0aW9uIChpLCBtZW1iZXIpIHtcbiAgICB2YXIgcGVyc29uSWQgPSBtZW1iZXJbJ0BwZXJzb24nXS5pZDtcblxuICAgIC8qKlxuICAgICAqIEdldCBhbGwgcmVsYXRpb25zaGlwcyBmb3IgdGhpcyBtZW1iZXJcbiAgICAgKi9cbiAgICB2YXIgbWVtYmVyUmVsYXRpb25zaGlwcyA9IHJlbGF0aW9uc2hpcHMuZmlsdGVyKGZ1bmN0aW9uIChyZWxhdGlvbnNoaXApIHtcbiAgICAgIHJldHVybiByZWxhdGlvbnNoaXAucGVyc29uSXNJZCA9PT0gcGVyc29uSWQgfHwgcmVsYXRpb25zaGlwLnBlcnNvblRvSWQgPT09IHBlcnNvbklkO1xuICAgIH0pLFxuICAgICAgICBtZW1iZXJSZWxhdGlvbnNoaXBUb0lkcyA9IG1lbWJlclJlbGF0aW9uc2hpcHMubWFwKGZ1bmN0aW9uIChyZWxhdGlvbnNoaXApIHtcbiAgICAgIHJldHVybiByZWxhdGlvbnNoaXAucGVyc29uSXNJZCA9PT0gcGVyc29uSWQgPyByZWxhdGlvbnNoaXAucGVyc29uVG9JZCA6IHJlbGF0aW9uc2hpcC5wZXJzb25Jc0lkO1xuICAgIH0pIHx8IFtdO1xuXG4gICAgLyoqXG4gICAgICogSWYgdG90YWwgcmVsYXRpb25zaGlwcyByZWxhdGVkIHRvIHRoaXMgbWVtYmVyIGlzbid0IGVxdWFsIHRvXG4gICAgICogdG90YWwgaG91c2Vob2xkIG1lbWJlcnMgLTEsIGluZGljYXRlcyBtaXNzaW5nIHJlbGF0aW9uc2hpcFxuICAgICAqL1xuICAgIGlmIChtZW1iZXJSZWxhdGlvbnNoaXBzLmxlbmd0aCA8IGhvdXNlaG9sZE1lbWJlcnMubGVuZ3RoIC0gMSkge1xuXG4gICAgICAvKipcbiAgICAgICAqIEFsbCBtaXNzaW5nIHJlbGF0aW9uc2hpcCBtZW1iZXJzXG4gICAgICAgKi9cbiAgICAgIG1pc3NpbmdSZWxhdGlvbnNoaXBNZW1iZXJzID0gaG91c2Vob2xkTWVtYmVycy5maWx0ZXIoZnVuY3Rpb24gKG0pIHtcbiAgICAgICAgcmV0dXJuIG1lbWJlclJlbGF0aW9uc2hpcFRvSWRzLmluZGV4T2YobVsnQHBlcnNvbiddLmlkKSA9PT0gLTEgJiYgbVsnQHBlcnNvbiddLmlkICE9PSBwZXJzb25JZDtcbiAgICAgIH0pO1xuXG4gICAgICBwZXJzb25JcyA9IG1lbWJlcjtcblxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIHBlcnNvbklzID8ge1xuICAgIHBlcnNvbklzOiBwZXJzb25JcyxcbiAgICBwZXJzb25UbzogbWlzc2luZ1JlbGF0aW9uc2hpcE1lbWJlcnNbMF1cbiAgfSA6IG51bGw7XG59XG5cbmZ1bmN0aW9uIGdldFBlb3BsZUlkc01pc3NpbmdSZWxhdGlvbnNoaXBzV2l0aFBlcnNvbihwZXJzb25JZCkge1xuICB2YXIgcmVtYWluaW5nUGVyc29uSWRzID0gZ2V0QWxsSG91c2Vob2xkTWVtYmVycygpLmZpbHRlcihpc0hvdXNlaG9sZE1lbWJlcikubWFwKGZ1bmN0aW9uIChtZW1iZXIpIHtcbiAgICByZXR1cm4gbWVtYmVyWydAcGVyc29uJ10uaWQ7XG4gIH0pO1xuXG4gIC8qKlxuICAgKiBSZW1vdmUgdGhpcyBwZXJzb24gZnJvbSB0aGUgbGlzdFxuICAgKi9cbiAgcmVtb3ZlRnJvbUxpc3QocmVtYWluaW5nUGVyc29uSWRzLCBwZXJzb25JZCk7XG5cbiAgJC5lYWNoKGdldEFsbFJlbGF0aW9uc2hpcHMoKSwgZnVuY3Rpb24gKGksIHJlbGF0aW9uc2hpcCkge1xuICAgIGlmICghaXNJblJlbGF0aW9uc2hpcChwZXJzb25JZCwgcmVsYXRpb25zaGlwKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlbW92ZSB0aGUgb3RoZXIgcGVyc29uIGZyb20gdGhlIHJlbWFpbmluZ1BlcnNvbklkcyBsaXN0XG4gICAgICovXG4gICAgcmVtb3ZlRnJvbUxpc3QocmVtYWluaW5nUGVyc29uSWRzLCBnZXRPdGhlclBlcnNvbklkRnJvbVJlbGF0aW9uc2hpcChwZXJzb25JZCwgcmVsYXRpb25zaGlwKSk7XG4gIH0pO1xuXG4gIHJldHVybiByZW1haW5pbmdQZXJzb25JZHM7XG59XG5cbmZ1bmN0aW9uIGdldFJlbGF0aW9uc2hpcFR5cGUocmVsYXRpb25zaGlwKSB7XG4gIHJldHVybiByZWxhdGlvbnNoaXBEZXNjcmlwdGlvbk1hcFtyZWxhdGlvbnNoaXAucGVyc29uSXNEZXNjcmlwdGlvbl0udHlwZTtcbn1cblxuLyoqXG4gKiBSZXRyaWV2ZSBmcm9tIHJlbGF0aW9uc2hpcCBncm91cFxuICovXG5mdW5jdGlvbiBnZXRSZWxhdGlvbnNoaXBzV2l0aFBlcnNvbklkcyhyZWxhdGlvbnNoaXBzLCBpZEFycikge1xuICByZXR1cm4gcmVsYXRpb25zaGlwcy5maWx0ZXIoZnVuY3Rpb24gKGNoaWxkUmVsYXRpb25zaGlwKSB7XG4gICAgcmV0dXJuIGlkQXJyLmluZGV4T2YoY2hpbGRSZWxhdGlvbnNoaXAucGVyc29uSXNJZCkgIT09IC0xIHx8IGlkQXJyLmluZGV4T2YoY2hpbGRSZWxhdGlvbnNoaXAucGVyc29uVG9JZCkgIT09IC0xO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gZ2V0UmVsYXRpb25zaGlwT2YocGVyc29uMSwgcGVyc29uMikge1xuICByZXR1cm4gZ2V0QWxsUmVsYXRpb25zaGlwcygpLmZpbmQoZnVuY3Rpb24gKHJlbGF0aW9uc2hpcCkge1xuICAgIHJldHVybiBpc0luUmVsYXRpb25zaGlwKHBlcnNvbjEsIHJlbGF0aW9uc2hpcCkgJiYgaXNJblJlbGF0aW9uc2hpcChwZXJzb24yLCByZWxhdGlvbnNoaXApO1xuICB9KTtcbn1cblxudmFyIFBFUlNPTkFMX0RFVEFJTFNfS0VZID0gJ2luZGl2aWR1YWwtZGV0YWlscyc7XG52YXIgUEVSU09OQUxfUElOU19LRVkgPSAnaW5kaXZpZHVhbC1waW5zJztcblxudmFyIHBlcnNvbmFsRGV0YWlsc01hcml0YWxTdGF0dXNNYXAgPSB7XG4gICduZXZlcic6IHtcbiAgICBkZXNjcmlwdGlvbjogJ05ldmVyIG1hcnJpZWQgYW5kIG5ldmVyIHJlZ2lzdGVyZWQgYSBzYW1lLXNleCBjaXZpbCcgKyAnIHBhcnRuZXJzaGlwJ1xuICB9LFxuICAnbWFycmllZCc6IHtcbiAgICBkZXNjcmlwdGlvbjogJ01hcnJpZWQnXG4gIH0sXG4gICdyZWdpc3RlcmVkJzoge1xuICAgIGRlc2NyaXB0aW9uOiAnSW4gYSByZWdpc3RlcmVkIHNhbWUtc2V4IGNpdmlsIHBhcnRuZXJzaGlwJ1xuICB9LFxuICAnc2VwYXJhdGVkLW1hcnJpZWQnOiB7XG4gICAgZGVzY3JpcHRpb246ICdTZXBhcmF0ZWQsIGJ1dCBzdGlsbCBsZWdhbGx5IG1hcnJpZWQnXG4gIH0sXG4gICdkaXZvcmNlZCc6IHtcbiAgICBkZXNjcmlwdGlvbjogJ0Rpdm9yY2VkJ1xuICB9LFxuICAnZm9ybWVyLXBhcnRuZXJzaGlwJzoge1xuICAgIGRlc2NyaXB0aW9uOiAnRm9ybWVybHkgaW4gYSBzYW1lLXNleCBjaXZpbCBwYXJ0bmVyc2hpcCB3aGljaCBpcyBub3cnICsgJyBsZWdhbGx5IGRpc3NvbHZlZCdcbiAgfSxcbiAgJ3dpZG93ZWQnOiB7XG4gICAgZGVzY3JpcHRpb246ICdXaWRvd2VkJ1xuICB9LFxuICAnc3Vydml2aW5nLXBhcnRuZXInOiB7XG4gICAgZGVzY3JpcHRpb246ICdTdXJ2aXZpbmcgcGFydG5lciBmcm9tIGEgc2FtZS1zZXggY2l2aWwgcGFydG5lcnNoaXAnXG4gIH0sXG4gICdzZXBhcmF0ZWQtcGFydG5lcnNoaXAnOiB7XG4gICAgZGVzY3JpcHRpb246ICdTZXBhcmF0ZWQsIGJ1dCBzdGlsbCBsZWdhbGx5IGluIGEgc2FtZS1zZXggY2l2aWwgcGFydG5lcnNoaXAnXG4gIH1cbn07XG5cbnZhciBwZXJzb25hbERldGFpbHNDb3VudHJ5TWFwID0ge1xuICAnZW5nbGFuZCc6IHtcbiAgICBkZXNjcmlwdGlvbjogJ0VuZ2xhbmQnXG4gIH0sXG4gICd3YWxlcyc6IHtcbiAgICBkZXNjcmlwdGlvbjogJ1dhbGVzJ1xuICB9LFxuICAnc2NvdGxhbmQnOiB7XG4gICAgZGVzY3JpcHRpb246ICdTY290bGFuZCdcbiAgfSxcbiAgJ25vcnRoZXJuLWlyZWxhbmQnOiB7XG4gICAgZGVzY3JpcHRpb246ICdOb3J0aGVybiBJcmVsYW5kJ1xuICB9LFxuICAncmVwdWJsaWMtaXJlbGFuZCc6IHtcbiAgICBkZXNjcmlwdGlvbjogJ1JlcHVibGljIG9mIElyZWxhbmQnXG4gIH0sXG4gICdlbHNld2hlcmUnOiB7XG4gICAgZGVzY3JpcHRpb246ICdFbHNld2hlcmUnXG4gIH1cbn07XG5cbnZhciBwZXJzb25hbERldGFpbHNPcmllbnRhdGlvbk1hcCA9IHtcbiAgJ3N0cmFpZ2h0Jzoge1xuICAgIGRlc2NyaXB0aW9uOiAnU3RyYWlnaHQgb3IgSGV0ZXJvc2V4dWFsJ1xuICB9LFxuICAnZ2F5Jzoge1xuICAgIGRlc2NyaXB0aW9uOiAnR2F5IG9yIExlc2JpYW4nXG4gIH0sXG4gICdiaXNleHVhbCc6IHtcbiAgICBkZXNjcmlwdGlvbjogJ0Jpc2V4dWFsJ1xuICB9LFxuICAnb3RoZXInOiB7XG4gICAgZGVzY3JpcHRpb246ICdPdGhlcidcbiAgfSxcbiAgJ25vLXNheSc6IHtcbiAgICBkZXNjcmlwdGlvbjogJ1ByZWZlciBub3QgdG8gc2F5J1xuICB9XG59O1xuXG5mdW5jdGlvbiBhZGRVcGRhdGVQZXJzb25hbERldGFpbHNET0IocGVyc29uSWQsIGRheSwgbW9udGgsIHllYXIpIHtcbiAgdmFyIGFsbERldGFpbHMgPSBnZXRBbGxQZXJzb25hbERldGFpbHMoKSxcbiAgICAgIGRldGFpbHMgPSBhbGxEZXRhaWxzW3BlcnNvbklkXSB8fCB7fTtcblxuICBkZXRhaWxzWydkb2InXSA9IHtcbiAgICBkYXk6IGRheSxcbiAgICBtb250aDogbW9udGgsXG4gICAgeWVhcjogeWVhclxuICB9O1xuXG4gIHVwZGF0ZVBlcnNvbmFsRGV0YWlscyhwZXJzb25JZCwgZGV0YWlscyk7XG5cbiAgcmV0dXJuIGRldGFpbHM7XG59XG5cbmZ1bmN0aW9uIGFkZFVwZGF0ZU1hcml0YWxTdGF0dXMocGVyc29uSWQsIHZhbCkge1xuICB2YXIgYWxsRGV0YWlscyA9IGdldEFsbFBlcnNvbmFsRGV0YWlscygpLFxuICAgICAgZGV0YWlscyA9IGFsbERldGFpbHNbcGVyc29uSWRdIHx8IHt9O1xuXG4gIGRldGFpbHNbJ21hcml0YWxTdGF0dXMnXSA9IHZhbDtcblxuICB1cGRhdGVQZXJzb25hbERldGFpbHMocGVyc29uSWQsIGRldGFpbHMpO1xuXG4gIHJldHVybiBkZXRhaWxzO1xufVxuXG5mdW5jdGlvbiBhZGRVcGRhdGVDb3VudHJ5KHBlcnNvbklkLCB2YWwpIHtcbiAgdmFyIGFsbERldGFpbHMgPSBnZXRBbGxQZXJzb25hbERldGFpbHMoKSxcbiAgICAgIGRldGFpbHMgPSBhbGxEZXRhaWxzW3BlcnNvbklkXSB8fCB7fTtcblxuICBkZXRhaWxzWydjb3VudHJ5J10gPSB2YWw7XG5cbiAgdXBkYXRlUGVyc29uYWxEZXRhaWxzKHBlcnNvbklkLCBkZXRhaWxzKTtcblxuICByZXR1cm4gZGV0YWlscztcbn1cblxuZnVuY3Rpb24gYWRkVXBkYXRlT3JpZW50YXRpb24ocGVyc29uSWQsIHZhbCkge1xuICB2YXIgYWxsRGV0YWlscyA9IGdldEFsbFBlcnNvbmFsRGV0YWlscygpLFxuICAgICAgZGV0YWlscyA9IGFsbERldGFpbHNbcGVyc29uSWRdIHx8IHt9O1xuXG4gIGRldGFpbHNbJ29yaWVudGF0aW9uJ10gPSB2YWw7XG5cbiAgdXBkYXRlUGVyc29uYWxEZXRhaWxzKHBlcnNvbklkLCBkZXRhaWxzKTtcblxuICByZXR1cm4gZGV0YWlscztcbn1cblxuZnVuY3Rpb24gYWRkVXBkYXRlU2FsYXJ5KHBlcnNvbklkLCB2YWwpIHtcbiAgdmFyIGFsbERldGFpbHMgPSBnZXRBbGxQZXJzb25hbERldGFpbHMoKSxcbiAgICAgIGRldGFpbHMgPSBhbGxEZXRhaWxzW3BlcnNvbklkXSB8fCB7fTtcblxuICBkZXRhaWxzWydzYWxhcnknXSA9IHZhbDtcblxuICB1cGRhdGVQZXJzb25hbERldGFpbHMocGVyc29uSWQsIGRldGFpbHMpO1xuXG4gIHJldHVybiBkZXRhaWxzO1xufVxuXG5mdW5jdGlvbiBnZXRQaW5zKCkge1xuICByZXR1cm4gSlNPTi5wYXJzZShzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKFBFUlNPTkFMX1BJTlNfS0VZKSkgfHwge307XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVBpbkZvcihwZXJzb25JZCkge1xuICB2YXIgb3B0cyA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDoge307XG5cbiAgdmFyIHBpbnMgPSBnZXRQaW5zKCk7XG5cbiAgcGluc1twZXJzb25JZF0gPSB7XG4gICAgcGluOiBfLnJhbmRvbSgxMDAwMCwgOTk5OTkpLFxuICAgIGV4cG9ydGVkOiAhIW9wdHMuZXhwb3J0ZWRcbiAgfTtcblxuICBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKFBFUlNPTkFMX1BJTlNfS0VZLCBKU09OLnN0cmluZ2lmeShwaW5zKSk7XG5cbiAgcmV0dXJuIHBpbnNbcGVyc29uSWRdO1xufVxuXG5mdW5jdGlvbiBnZXRQaW5Gb3IocGVyc29uSWQpIHtcbiAgcmV0dXJuIGdldFBpbnMoKVtwZXJzb25JZF07XG59XG5cbmZ1bmN0aW9uIHVuc2V0UGluRm9yKHBlcnNvbklkKSB7XG4gIHZhciBwaW5zID0gZ2V0UGlucygpO1xuXG4gIGRlbGV0ZSBwaW5zW3BlcnNvbklkXTtcblxuICBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKFBFUlNPTkFMX1BJTlNfS0VZLCBKU09OLnN0cmluZ2lmeShwaW5zKSk7XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZVBlcnNvbmFsRGV0YWlscyhwZXJzb25JZCwgZGV0YWlscykge1xuICBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKFBFUlNPTkFMX0RFVEFJTFNfS0VZLCBKU09OLnN0cmluZ2lmeShfZXh0ZW5kcyh7fSwgZ2V0QWxsUGVyc29uYWxEZXRhaWxzKCksIGRlZmluZVByb3BlcnR5KHt9LCBwZXJzb25JZCwgZGV0YWlscykpKSk7XG5cbiAgcmV0dXJuIGRldGFpbHM7XG59XG5cbmZ1bmN0aW9uIGdldEFsbFBlcnNvbmFsRGV0YWlscygpIHtcbiAgcmV0dXJuIEpTT04ucGFyc2Uoc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbShQRVJTT05BTF9ERVRBSUxTX0tFWSkpIHx8IHt9O1xufVxuXG5mdW5jdGlvbiBnZXRQZXJzb25hbERldGFpbHNGb3IocGVyc29uSWQpIHtcbiAgdmFyIHN0b3JhZ2VPYmogPSBKU09OLnBhcnNlKHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oUEVSU09OQUxfREVUQUlMU19LRVkpKSB8fCB7fSxcbiAgICAgIHBlcnNvbk9iaiA9IHN0b3JhZ2VPYmpbcGVyc29uSWRdO1xuXG4gIGlmICghcGVyc29uT2JqKSB7XG4gICAgY29uc29sZS5sb2coJ1BlcnNvbmFsIGRldGFpbHMgZm9yICcgKyBwZXJzb25JZCArICcgbm90IGZvdW5kJyk7XG4gIH1cblxuICByZXR1cm4gcGVyc29uT2JqO1xufVxuXG4vKipcbiAqIENvcGllZCBmcm9tOlxuICogaHR0cHM6Ly9jb2RlcmV2aWV3LnN0YWNrZXhjaGFuZ2UuY29tL3F1ZXN0aW9ucy85MDM0OS9jaGFuZ2luZy1udW1iZXItdG8td29yZHMtaW4tamF2YXNjcmlwdFxuICogPT09PT09PT09PT09PT09XG4gKi9cbnZhciBPTkVfVE9fTklORVRFRU4gPSBbJ29uZScsICd0d28nLCAndGhyZWUnLCAnZm91cicsICdmaXZlJywgJ3NpeCcsICdzZXZlbicsICdlaWdodCcsICduaW5lJywgJ3RlbicsICdlbGV2ZW4nLCAndHdlbHZlJywgJ3RoaXJ0ZWVuJywgJ2ZvdXJ0ZWVuJywgJ2ZpZnRlZW4nLCAnc2l4dGVlbicsICdzZXZlbnRlZW4nLCAnZWlnaHRlZW4nLCAnbmluZXRlZW4nXTtcblxudmFyIFRFTlMgPSBbJ3RlbicsICd0d2VudHknLCAndGhpcnR5JywgJ2ZvcnR5JywgJ2ZpZnR5JywgJ3NpeHR5JywgJ3NldmVudHknLCAnZWlnaHR5JywgJ25pbmV0eSddO1xuXG52YXIgU0NBTEVTID0gWyd0aG91c2FuZCcsICdtaWxsaW9uJywgJ2JpbGxpb24nLCAndHJpbGxpb24nXTtcblxuLy8gaGVscGVyIGZ1bmN0aW9uIGZvciB1c2Ugd2l0aCBBcnJheS5maWx0ZXJcbmZ1bmN0aW9uIGlzVHJ1dGh5KGl0ZW0pIHtcbiAgcmV0dXJuICEhaXRlbTtcbn1cblxuLy8gY29udmVydCBhIG51bWJlciBpbnRvICdjaHVua3MnIG9mIDAtOTk5XG5mdW5jdGlvbiBjaHVuayhudW1iZXIpIHtcbiAgdmFyIHRob3VzYW5kcyA9IFtdO1xuXG4gIHdoaWxlIChudW1iZXIgPiAwKSB7XG4gICAgdGhvdXNhbmRzLnB1c2gobnVtYmVyICUgMTAwMCk7XG4gICAgbnVtYmVyID0gTWF0aC5mbG9vcihudW1iZXIgLyAxMDAwKTtcbiAgfVxuXG4gIHJldHVybiB0aG91c2FuZHM7XG59XG5cbi8vIHRyYW5zbGF0ZSBhIG51bWJlciBmcm9tIDEtOTk5IGludG8gRW5nbGlzaFxuZnVuY3Rpb24gaW5FbmdsaXNoKG51bWJlcikge1xuICB2YXIgdGhvdXNhbmRzLFxuICAgICAgaHVuZHJlZHMsXG4gICAgICB0ZW5zLFxuICAgICAgb25lcyxcbiAgICAgIHdvcmRzID0gW107XG5cbiAgaWYgKG51bWJlciA8IDIwKSB7XG4gICAgcmV0dXJuIE9ORV9UT19OSU5FVEVFTltudW1iZXIgLSAxXTsgLy8gbWF5IGJlIHVuZGVmaW5lZFxuICB9XG5cbiAgaWYgKG51bWJlciA8IDEwMCkge1xuICAgIG9uZXMgPSBudW1iZXIgJSAxMDtcbiAgICB0ZW5zID0gbnVtYmVyIC8gMTAgfCAwOyAvLyBlcXVpdmFsZW50IHRvIE1hdGguZmxvb3IobnVtYmVyIC8gMTApXG5cbiAgICB3b3Jkcy5wdXNoKFRFTlNbdGVucyAtIDFdKTtcbiAgICB3b3Jkcy5wdXNoKGluRW5nbGlzaChvbmVzKSk7XG5cbiAgICByZXR1cm4gd29yZHMuZmlsdGVyKGlzVHJ1dGh5KS5qb2luKCctJyk7XG4gIH1cblxuICBodW5kcmVkcyA9IG51bWJlciAvIDEwMCB8IDA7XG4gIHdvcmRzLnB1c2goaW5FbmdsaXNoKGh1bmRyZWRzKSk7XG4gIHdvcmRzLnB1c2goJ2h1bmRyZWQnKTtcbiAgd29yZHMucHVzaChpbkVuZ2xpc2gobnVtYmVyICUgMTAwKSk7XG5cbiAgcmV0dXJuIHdvcmRzLmZpbHRlcihpc1RydXRoeSkuam9pbignICcpO1xufVxuXG4vLyBhcHBlbmQgdGhlIHdvcmQgZm9yIGEgc2NhbGUuIE1hZGUgZm9yIHVzZSB3aXRoIEFycmF5Lm1hcFxuZnVuY3Rpb24gYXBwZW5kU2NhbGUoY2h1bmssIGV4cCkge1xuICB2YXIgc2NhbGU7XG4gIGlmICghY2h1bmspIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICBzY2FsZSA9IFNDQUxFU1tleHAgLSAxXTtcbiAgcmV0dXJuIFtjaHVuaywgc2NhbGVdLmZpbHRlcihpc1RydXRoeSkuam9pbignICcpO1xufVxuXG4vKipcbiAqID09PT09PT09PT09PT09PVxuICogRW5kIGNvcHlcbiAqL1xuXG4vKipcbiAqIE1vZGlmaWNhdGlvbiAtIGRlY29yYXRvclxuICovXG52YXIgTlVNQkVSX1RPX1BPU0lUSU9OX1RFWFRfTUFQID0ge1xuICAnb25lJzogJ2ZpcnN0JyxcbiAgJ3R3byc6ICdzZWNvbmQnLFxuICAndGhyZWUnOiAndGhpcmQnLFxuICAnZm91cic6ICdmb3VydGgnLFxuICAnZml2ZSc6ICdmaWZ0aCcsXG4gICdzaXgnOiAnc2l4dGgnLFxuICAnc2V2ZW4nOiAnc2V2ZW50aCcsXG4gICdlaWdodCc6ICdlaWdodGgnLFxuICAnbmluZSc6ICduaW50aCcsXG4gICd0ZW4nOiAndGVudGgnLFxuICAnZWxldmVuJzogJ2VsZXZlbnRoJyxcbiAgJ3R3ZWx2ZSc6ICd0d2VsZnRoJyxcbiAgJ3RoaXJ0ZWVuJzogJ3RoaXJ0ZWVudGgnLFxuICAnZm91cnRlZW4nOiAnZm91cnRlZW50aCcsXG4gICdmaWZ0ZWVuJzogJ2ZpZnRlZW50aCcsXG4gICdzaXh0ZWVuJzogJ3NpeHRlZW50aCcsXG4gICdzZXZlbnRlZW4nOiAnc2V2ZW50ZWVudGgnLFxuICAnZWlnaHRlZW4nOiAnZWlnaHRlZW50aCcsXG4gICduaW5ldGVlbic6ICduaW5ldGVlbnRoJyxcblxuICAndHdlbnR5JzogJ3R3ZW50aWV0aCcsXG4gICd0aGlydHknOiAndGhpcnRpZXRoJyxcbiAgJ2ZvcnR5JzogJ2ZvcnRpZXRoJyxcbiAgJ2ZpZnR5JzogJ2ZpZnRpZXRoJyxcbiAgJ3NpeHR5JzogJ3NpeHRpZXRoJyxcbiAgJ3NldmVudHknOiAnc2V2ZW50aWV0aCcsXG4gICdlaWdodHknOiAnZWlnaHRpZXRoJyxcbiAgJ25pbmV0eSc6ICduaW5ldGlldGgnLFxuICAnaHVuZHJlZCc6ICdodW5kcmVkdGgnLFxuXG4gICd0aG91c2FuZCc6ICd0aG91c2FuZHRoJyxcbiAgJ21pbGxpb24nOiAnbWlsbGlvbnRoJyxcbiAgJ2JpbGxpb24nOiAnYmlsbGlvbnRoJyxcbiAgJ3RyaWxsaW9uJzogJ3RyaWxsaW9udGgnXG59O1xuXG5mdW5jdGlvbiBudW1iZXJUb1Bvc2l0aW9uV29yZChudW0pIHtcbiAgdmFyIHN0ciA9IGNodW5rKG51bSkubWFwKGluRW5nbGlzaCkubWFwKGFwcGVuZFNjYWxlKS5maWx0ZXIoaXNUcnV0aHkpLnJldmVyc2UoKS5qb2luKCcgJyk7XG5cbiAgdmFyIHN1YiA9IHN0ci5zcGxpdCgnICcpLFxuICAgICAgbGFzdFdvcmREYXNoU3BsaXRBcnIgPSBzdWJbc3ViLmxlbmd0aCAtIDFdLnNwbGl0KCctJyksXG4gICAgICBsYXN0V29yZCA9IGxhc3RXb3JkRGFzaFNwbGl0QXJyW2xhc3RXb3JkRGFzaFNwbGl0QXJyLmxlbmd0aCAtIDFdLFxuICAgICAgbmV3TGFzdFdvcmQgPSAobGFzdFdvcmREYXNoU3BsaXRBcnIubGVuZ3RoID4gMSA/IGxhc3RXb3JkRGFzaFNwbGl0QXJyWzBdICsgJy0nIDogJycpICsgTlVNQkVSX1RPX1BPU0lUSU9OX1RFWFRfTUFQW2xhc3RXb3JkXTtcblxuICAvKmNvbnNvbGUubG9nKCdzdHI6Jywgc3RyKTtcbiAgY29uc29sZS5sb2coJ3N1YjonLCBzdWIpO1xuICBjb25zb2xlLmxvZygnbGFzdFdvcmREYXNoU3BsaXRBcnI6JywgbGFzdFdvcmREYXNoU3BsaXRBcnIpO1xuICBjb25zb2xlLmxvZygnbGFzdFdvcmQ6JywgbGFzdFdvcmQpO1xuICBjb25zb2xlLmxvZygnbmV3TGFzdFdvcmQ6JywgbmV3TGFzdFdvcmQpOyovXG5cbiAgdmFyIHN1YkNvcHkgPSBbXS5jb25jYXQoc3ViKTtcbiAgc3ViQ29weS5wb3AoKTtcbiAgdmFyIHByZWZpeCA9IHN1YkNvcHkuam9pbignICcpO1xuICB2YXIgcmVzdWx0ID0gKHByZWZpeCA/IHByZWZpeCArICcgJyA6ICcnKSArIG5ld0xhc3RXb3JkO1xuXG4gIC8vIGNvbnNvbGUubG9nKCdyZXN1bHQnLCAocHJlZml4ID8gcHJlZml4ICsgJyAnIDogJycpICsgbmV3TGFzdFdvcmQpO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG5mdW5jdGlvbiB0b29scygpIHtcblxuICB2YXIgJGxpc3RMaW5rcyA9ICQoJy50ZXN0LWRhdGEtbGlua3MnKSxcbiAgICAgICRjcmVhdGVGYW1pbHlIb3VzZWhvbGQgPSAkKCc8bGk+PGEgaHJlZj1cIiNcIiBjbGFzcz1cXCdtb2NrLWRhdGEtZmFtaWx5XFwnPicgKyAnQ3JlYXRlIGZhbWlseSBob3VzZWhvbGQ8L2E+PC9saT4nKSxcbiAgICAgICRjcmVhdGVGYW1pbHlSZWxhdGlvbnNoaXBzID0gJCgnPGxpPjxhIGhyZWY9XCIjXCInICsgJyBjbGFzcz1cXCdtb2NrLWRhdGEtZmFtaWx5XFwnPicgKyAnQ3JlYXRlIGZhbWlseSByZWxhdGlvbnNoaXBzPC9hPjwvbGk+JyksXG4gICAgICBmYW1pbHlIb3VzZWhvbGRNZW1iZXJzRGF0YSA9IFt7XG4gICAgJ3R5cGUnOiAnaG91c2Vob2xkLW1lbWJlcicsXG4gICAgJ0BwZXJzb24nOiB7XG4gICAgICAnZnVsbE5hbWUnOiAnRGF2ZSAgSm9uZXMnLFxuICAgICAgJ2ZpcnN0TmFtZSc6ICdEYXZlJyxcbiAgICAgICdtaWRkbGVOYW1lJzogJycsXG4gICAgICAnbGFzdE5hbWUnOiAnSm9uZXMnLFxuICAgICAgJ2lkJzogJ3BlcnNvbl9tZSdcbiAgICB9XG4gIH0sIHtcbiAgICAndHlwZSc6ICdob3VzZWhvbGQtbWVtYmVyJyxcbiAgICAnQHBlcnNvbic6IHtcbiAgICAgICdmdWxsTmFtZSc6ICdTYWxseSAgSm9uZXMnLFxuICAgICAgJ2ZpcnN0TmFtZSc6ICdTYWxseScsXG4gICAgICAnbWlkZGxlTmFtZSc6ICcnLFxuICAgICAgJ2xhc3ROYW1lJzogJ0pvbmVzJyxcbiAgICAgICdpZCc6ICdwZXJzb24xJ1xuICAgIH1cbiAgfSwge1xuICAgICd0eXBlJzogJ2hvdXNlaG9sZC1tZW1iZXInLFxuICAgICdAcGVyc29uJzoge1xuICAgICAgJ2Z1bGxOYW1lJzogJ1JlYmVjY2EgIEpvbmVzJyxcbiAgICAgICdmaXJzdE5hbWUnOiAnUmViZWNjYScsXG4gICAgICAnbWlkZGxlTmFtZSc6ICcnLFxuICAgICAgJ2xhc3ROYW1lJzogJ0pvbmVzJyxcbiAgICAgICdpZCc6ICdwZXJzb24yJ1xuICAgIH1cbiAgfSwge1xuICAgICd0eXBlJzogJ2hvdXNlaG9sZC1tZW1iZXInLFxuICAgICdAcGVyc29uJzoge1xuICAgICAgJ2Z1bGxOYW1lJzogJ0FteSBKb25lcycsXG4gICAgICAnZmlyc3ROYW1lJzogJ0FteScsXG4gICAgICAnbWlkZGxlTmFtZSc6ICcnLFxuICAgICAgJ2xhc3ROYW1lJzogJ0pvbmVzJyxcbiAgICAgICdpZCc6ICdwZXJzb24zJ1xuICAgIH1cbiAgfV0sXG4gICAgICBmYW1pbHlIb3VzZWhvbGRSZWxhdGlvbnNoaXBzRGF0YSA9IFt7XG4gICAgJ3BlcnNvbklzRGVzY3JpcHRpb24nOiAnaHVzYmFuZC13aWZlJyxcbiAgICAncGVyc29uSXNJZCc6ICdwZXJzb24xJyxcbiAgICAncGVyc29uVG9JZCc6ICdwZXJzb25fbWUnLFxuICAgICdpbmZlcnJlZCc6IGZhbHNlLFxuICAgICdpZCc6IDFcbiAgfSwge1xuICAgICdwZXJzb25Jc0Rlc2NyaXB0aW9uJzogJ3Nvbi1kYXVnaHRlcicsXG4gICAgJ3BlcnNvbklzSWQnOiAncGVyc29uMicsXG4gICAgJ3BlcnNvblRvSWQnOiAncGVyc29uX21lJyxcbiAgICAnaW5mZXJyZWQnOiBmYWxzZSxcbiAgICAnaWQnOiAyXG4gIH0sIHtcbiAgICAncGVyc29uSXNEZXNjcmlwdGlvbic6ICdtb3RoZXItZmF0aGVyJyxcbiAgICAncGVyc29uSXNJZCc6ICdwZXJzb25fbWUnLFxuICAgICdwZXJzb25Ub0lkJzogJ3BlcnNvbjMnLFxuICAgICdpbmZlcnJlZCc6IGZhbHNlLFxuICAgICdpZCc6IDNcbiAgfSwge1xuICAgICdwZXJzb25Jc0Rlc2NyaXB0aW9uJzogJ3Nvbi1kYXVnaHRlcicsXG4gICAgJ3BlcnNvbklzSWQnOiAncGVyc29uMicsXG4gICAgJ3BlcnNvblRvSWQnOiAncGVyc29uMScsXG4gICAgJ2luZmVycmVkJzogZmFsc2UsXG4gICAgJ2lkJzogNFxuICB9LCB7XG4gICAgJ3BlcnNvbklzRGVzY3JpcHRpb24nOiAnbW90aGVyLWZhdGhlcicsXG4gICAgJ3BlcnNvbklzSWQnOiAncGVyc29uMScsXG4gICAgJ3BlcnNvblRvSWQnOiAncGVyc29uMycsXG4gICAgJ2luZmVycmVkJzogZmFsc2UsXG4gICAgJ2lkJzogNVxuICB9LCB7XG4gICAgJ3BlcnNvbklzRGVzY3JpcHRpb24nOiAnYnJvdGhlci1zaXN0ZXInLFxuICAgICdwZXJzb25Jc0lkJzogJ3BlcnNvbjMnLFxuICAgICdwZXJzb25Ub0lkJzogJ3BlcnNvbjInLFxuICAgICdpbmZlcnJlZCc6IHRydWUsXG4gICAgJ2luZmVycmVkQnknOiBbMywgNSwgMiwgNF0sXG4gICAgJ2lkJzogNlxuICB9XSxcbiAgICAgIHVzZXJEYXRhID0ge1xuICAgICdmdWxsTmFtZSc6ICdEYXZlICBKb25lcycsXG4gICAgJ2ZpcnN0TmFtZSc6ICdEYXZlJyxcbiAgICAnbWlkZGxlTmFtZSc6ICcnLFxuICAgICdsYXN0TmFtZSc6ICdKb25lcydcbiAgfTtcblxuICAkY3JlYXRlRmFtaWx5SG91c2Vob2xkLm9uKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGNsZWFyU3RvcmFnZSgpO1xuICAgIGNyZWF0ZUZhbWlseUhvdXNlaG9sZCgpO1xuICB9KTtcblxuICAkY3JlYXRlRmFtaWx5UmVsYXRpb25zaGlwcy5vbignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBjbGVhclN0b3JhZ2UoKTtcbiAgICBjcmVhdGVGYW1pbHlIb3VzZWhvbGQoKTtcbiAgICBjcmVhdGVGYW1pbHlSZWxhdGlvbnNoaXBzKCk7XG4gIH0pO1xuXG4gIGZ1bmN0aW9uIHByZXJlcXVpc2l0ZXMoKSB7XG4gICAgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbSgnYWRkcmVzcycsICcxMiBTb21ld2hlcmUgQ2xvc2UsIE5ld3BvcnQsIENGMTIgM0FCJyk7XG4gICAgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbSgnYWRkcmVzcy1saW5lLTEnLCAnMTInKTtcbiAgICBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKCdhZGRyZXNzLWxpbmUtMicsICdTb21ld2hlcmUgY2xvc2UnKTtcbiAgICBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKCdjb3VudHknLCAnTmV3cG9ydCcpO1xuICAgIHNlc3Npb25TdG9yYWdlLnNldEl0ZW0oJ2xpdmVzLWhlcmUnLCAneWVzJyk7XG4gICAgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbSgncG9zdGNvZGUnLCAnQ0YxMiAzQUInKTtcbiAgICBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKCd0b3duLWNpdHknLCAnTmV3cG9ydCcpO1xuICB9XG5cbiAgZnVuY3Rpb24gY3JlYXRlRmFtaWx5SG91c2Vob2xkKCkge1xuICAgIHByZXJlcXVpc2l0ZXMoKTtcbiAgICBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKCd1c2VyLWRldGFpbHMnLCBKU09OLnN0cmluZ2lmeSh1c2VyRGF0YSkpO1xuICAgIHNlc3Npb25TdG9yYWdlLnNldEl0ZW0od2luZG93Lk9OUy5zdG9yYWdlLktFWVMuSE9VU0VIT0xEX01FTUJFUlNfU1RPUkFHRV9LRVksIEpTT04uc3RyaW5naWZ5KGZhbWlseUhvdXNlaG9sZE1lbWJlcnNEYXRhKSk7XG4gICAgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbSgnaG91c2Vob2xkLW1lbWJlcnMtaW5jcmVtZW50JywgSlNPTi5zdHJpbmdpZnkoNCkpO1xuICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gJy4uL3N1bW1hcnknO1xuICB9XG5cbiAgZnVuY3Rpb24gY3JlYXRlRmFtaWx5UmVsYXRpb25zaGlwcygpIHtcbiAgICBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKHdpbmRvdy5PTlMuc3RvcmFnZS5LRVlTLlJFTEFUSU9OU0hJUFNfU1RPUkFHRV9LRVksIEpTT04uc3RyaW5naWZ5KGZhbWlseUhvdXNlaG9sZFJlbGF0aW9uc2hpcHNEYXRhKSk7XG4gICAgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbSgncmVsYXRpb25zaGlwcy1pbmNyZW1lbnQnLCBKU09OLnN0cmluZ2lmeSg2KSk7XG4gICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSAnLi4vcmVsYXRpb25zaGlwcy1zdW1tYXJ5JztcbiAgfVxuXG4gIGZ1bmN0aW9uIGNsZWFyU3RvcmFnZSgpIHtcbiAgICBzZXNzaW9uU3RvcmFnZS5jbGVhcigpO1xuICB9XG5cbiAgJGxpc3RMaW5rcy5hcHBlbmQoJGNyZWF0ZUZhbWlseUhvdXNlaG9sZCk7XG4gICRsaXN0TGlua3MuYXBwZW5kKCRjcmVhdGVGYW1pbHlSZWxhdGlvbnNoaXBzKTtcbn1cblxudmFyIFVTRVJfU1RPUkFHRV9LRVkgPSAndXNlci1kZXRhaWxzJztcbnZhciBJTkRJVklEVUFMX1BST1hZX1NUT1JBR0VfS0VZID0gJ3Byb3h5LXBlcnNvbic7XG5cbmZ1bmN0aW9uIGdldEFkZHJlc3MoKSB7XG4gIHZhciBhZGRyZXNzTGluZXMgPSBzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKCdhZGRyZXNzJykuc3BsaXQoJywnKTtcblxuICByZXR1cm4ge1xuICAgIGFkZHJlc3NMaW5lMTogYWRkcmVzc0xpbmVzWzBdLFxuICAgIGFkZHJlc3NMaW5lMjogYWRkcmVzc0xpbmVzWzFdLFxuICAgIGFkZHJlc3NMaW5lMzogYWRkcmVzc0xpbmVzWzJdLFxuICAgIGFkZHJlc3NDb3VudHk6IGFkZHJlc3NMaW5lc1s0XSxcbiAgICBhZGRyZXNzVG93bkNpdHk6IGFkZHJlc3NMaW5lc1szXSxcbiAgICBhZGRyZXNzUG9zdGNvZGU6IGFkZHJlc3NMaW5lc1s1XVxuICB9O1xufVxuXG4vKipcbiAqIFVzZXJcbiAqL1xuZnVuY3Rpb24gYWRkVXNlclBlcnNvbihwZXJzb24kJDEpIHtcbiAgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbShVU0VSX1NUT1JBR0VfS0VZLCBKU09OLnN0cmluZ2lmeShwZXJzb24kJDEpKTtcbn1cblxuZnVuY3Rpb24gZ2V0VXNlclBlcnNvbigpIHtcbiAgcmV0dXJuIEpTT04ucGFyc2Uoc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbShVU0VSX1NUT1JBR0VfS0VZKSk7XG59XG5cbi8qKlxuICogSGVscGVyc1xuICovXG5mdW5jdGlvbiBjcmVhdGVOYXZJdGVtKG1lbWJlcikge1xuICB2YXIgJG5vZGVFbCA9ICQoJzxsaSBjbGFzcz1cImpzLXRlbXBsYXRlLW5hdi1pdGVtIG5hdl9faXRlbSBwbHV0b1wiPicgKyAnICA8YSBjbGFzcz1cImpzLXRlbXBsYXRlLW5hdi1pdGVtLWxhYmVsIG5hdl9fbGlua1wiIGhyZWY9XCIjXCI+PC9hPicgKyAnPC9saT4nKSxcbiAgICAgICRsaW5rRWwgPSAkbm9kZUVsLmZpbmQoJy5qcy10ZW1wbGF0ZS1uYXYtaXRlbS1sYWJlbCcpO1xuXG4gICRsaW5rRWwuaHRtbChtZW1iZXJbJ0BwZXJzb24nXS5mdWxsTmFtZSk7XG5cbiAgaWYgKG1lbWJlclsnQHBlcnNvbiddLmlkID09PSBVU0VSX0hPVVNFSE9MRF9NRU1CRVJfSUQpIHtcbiAgICAkbGlua0VsLmF0dHIoJ2hyZWYnLCAnLi4vd2hhdC1pcy15b3VyLW5hbWUnKTtcbiAgfSBlbHNlIHtcbiAgICAkbGlua0VsLmF0dHIoJ2hyZWYnLCAnLi4vd2hvLWVsc2UtdG8tYWRkP2VkaXQ9JyArIG1lbWJlclsnQHBlcnNvbiddLmlkKTtcbiAgfVxuXG4gIHJldHVybiAkbm9kZUVsO1xufVxuXG5mdW5jdGlvbiB1cGRhdGVIb3VzZWhvbGRWaXNpdG9yc05hdmlnYXRpb25JdGVtcygpIHtcbiAgdmFyIGFsbEhvdXNlaG9sZE1lbWJlcnMgPSB3aW5kb3cuT05TLnN0b3JhZ2UuZ2V0QWxsSG91c2Vob2xkTWVtYmVycygpLFxuICAgICAgaG91c2Vob2xkTWVtYmVycyA9IGFsbEhvdXNlaG9sZE1lbWJlcnMuZmlsdGVyKHdpbmRvdy5PTlMuc3RvcmFnZS5pc0hvdXNlaG9sZE1lbWJlciksXG4gICAgICB2aXNpdG9ycyA9IGFsbEhvdXNlaG9sZE1lbWJlcnMuZmlsdGVyKHdpbmRvdy5PTlMuc3RvcmFnZS5pc1Zpc2l0b3IpO1xuXG4gIHZhciAkbmF2aWdhdGlvbkhvdXNlaG9sZE1lbWJlcnNFbCA9ICQoJyNuYXZpZ2F0aW9uLWhvdXNlaG9sZC1tZW1iZXJzJyksXG4gICAgICAkbmF2aWdhdGlvblZpc2l0b3JzRWwgPSAkKCcjbmF2aWdhdGlvbi12aXNpdG9ycycpO1xuXG4gIGlmIChob3VzZWhvbGRNZW1iZXJzLmxlbmd0aCkge1xuICAgICQuZWFjaChob3VzZWhvbGRNZW1iZXJzLCBmdW5jdGlvbiAoaSwgbWVtYmVyKSB7XG4gICAgICAkbmF2aWdhdGlvbkhvdXNlaG9sZE1lbWJlcnNFbC5hcHBlbmQoY3JlYXRlTmF2SXRlbShtZW1iZXIpKTtcbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICAkbmF2aWdhdGlvbkhvdXNlaG9sZE1lbWJlcnNFbC5wYXJlbnQoKS5oaWRlKCk7XG4gIH1cblxuICBpZiAodmlzaXRvcnMubGVuZ3RoKSB7XG4gICAgJC5lYWNoKHZpc2l0b3JzLCBmdW5jdGlvbiAoaSwgbWVtYmVyKSB7XG4gICAgICAkbmF2aWdhdGlvblZpc2l0b3JzRWwuYXBwZW5kKGNyZWF0ZU5hdkl0ZW0obWVtYmVyKSk7XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgJG5hdmlnYXRpb25WaXNpdG9yc0VsLnBhcmVudCgpLmhpZGUoKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBjcmVhdGVMaXN0SXRlbVBlcnNvbihtZW1iZXIpIHtcbiAgcmV0dXJuICQoJzxsaSBjbGFzcz1cImxpc3RfX2l0ZW1cIj4nKS5hZGRDbGFzcygnbWFycycpLmh0bWwoJzxzcGFuIGNsYXNzPVwibGlzdF9faXRlbS1uYW1lXCI+JyArIG1lbWJlclsnQHBlcnNvbiddLmZ1bGxOYW1lICsgKG1lbWJlclsnQHBlcnNvbiddLmlkID09PSBVU0VSX0hPVVNFSE9MRF9NRU1CRVJfSUQgPyAnIChZb3UpJyA6ICcnKSArICc8L3NwYW4+Jyk7XG59XG5cbmZ1bmN0aW9uIHBvcHVsYXRlTGlzdCgkZWwsIG1lbWJlclR5cGUpIHtcbiAgaWYgKCEkZWwubGVuZ3RoKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgdmFyIG1lbWJlcnMgPSBnZXRBbGxIb3VzZWhvbGRNZW1iZXJzKCkgfHwgW107XG5cbiAgJGVsLmVtcHR5KCkuYXBwZW5kKG1lbWJlcnMuZmlsdGVyKGZ1bmN0aW9uIChtZW1iZXIpIHtcbiAgICByZXR1cm4gbWVtYmVyLnR5cGUgPT09IG1lbWJlclR5cGU7XG4gIH0pLm1hcChjcmVhdGVMaXN0SXRlbVBlcnNvbikpO1xuXG4gICRlbC5hZGRDbGFzcygnbGlzdCBsaXN0LS1wZW9wbGUtcGxhaW4nKTtcbn1cblxuZnVuY3Rpb24gcG9wdWxhdGVIb3VzZWhvbGRMaXN0KCkge1xuICBwb3B1bGF0ZUxpc3QoJCgnI2hvdXNlaG9sZC1tZW1iZXJzJyksIEhPVVNFSE9MRF9NRU1CRVJfVFlQRSk7XG59XG5cbmZ1bmN0aW9uIHBvcHVsYXRlVmlzaXRvckxpc3QoKSB7XG4gIHBvcHVsYXRlTGlzdCgkKCcjdmlzaXRvcnMtbGlzdCcpLCBWSVNJVE9SX1RZUEUpO1xufVxuXG5mdW5jdGlvbiB1cGRhdGVBZGRyZXNzZXMoKSB7XG4gIHZhciBhZGRyZXNzTGluZXMgPSAoc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbSgnYWRkcmVzcycpIHx8ICcnKS5zcGxpdCgnLCcpLFxuICAgICAgYWRkcmVzc0xpbmUxID0gYWRkcmVzc0xpbmVzWzBdLFxuICAgICAgYWRkcmVzc0xpbmUyID0gYWRkcmVzc0xpbmVzWzFdO1xuXG4gICQoJyNzZWN0aW9uLWFkZHJlc3MnKS5odG1sKGFkZHJlc3NMaW5lMSB8fCAnPGEnICsgJyBocmVmPVwiLi4vdGVzdC1hZGRyZXNzXCI+QWRkcmVzcyBub3QnICsgJyBmb3VuZDwvYT4nKTtcbiAgJCgnLmFkZHJlc3MtdGV4dCcpLmh0bWwoYWRkcmVzc0xpbmUxICYmIGFkZHJlc3NMaW5lMiA/IGFkZHJlc3NMaW5lMSArIChhZGRyZXNzTGluZTIgPyAnLCAnICsgYWRkcmVzc0xpbmUyIDogJycpIDogJzxhIGhyZWY9XCIuLi90ZXN0LWFkZHJlc3NcIj5BZGRyZXNzIG5vdCBmb3VuZDwvYT4nKTtcblxuICAkKCcuYWRkcmVzcy10ZXh0LWxpbmUxJykuaHRtbChhZGRyZXNzTGluZTEpO1xuXG4gIHZhciBwZXJzb25JZCA9IG5ldyBVUkxTZWFyY2hQYXJhbXMod2luZG93LmxvY2F0aW9uLnNlYXJjaCkuZ2V0KCdwZXJzb24nKSxcbiAgICAgIHBlcnNvbiQkMSA9IHZvaWQgMDtcblxuICBpZiAocGVyc29uSWQpIHtcbiAgICBwZXJzb24kJDEgPSBnZXRIb3VzZWhvbGRNZW1iZXJCeVBlcnNvbklkKHBlcnNvbklkKVsnQHBlcnNvbiddO1xuICAgICQoJyNzZWN0aW9uLWluZGl2aWR1YWwnKS5odG1sKHBlcnNvbiQkMS5mdWxsTmFtZSk7XG5cbiAgICAkKCcuanMtcGVyc29uLWZ1bGxuYW1lLWZyb20tdXJsLWlkJykuaHRtbChwZXJzb24kJDEuZnVsbE5hbWUpO1xuICB9XG59XG5cbnZhciBzZWN1cmVMaW5rVGV4dE1hcCA9IHtcbiAgJ3F1ZXN0aW9uLXlvdSc6IHtcbiAgICBkZXNjcmlwdGlvbjogJ1dhbnQgdG8ga2VlcCB5b3VyIGFuc3dlcnMgc2VjdXJlIGZyb20gb3RoZXIgcGVvcGxlIGF0IHRoaXMnICsgJyBhZGRyZXNzPycsXG4gICAgbGlua1RleHQ6ICdHZXQgYSBzZXBhcmF0ZSBhY2Nlc3MgY29kZSB0byBzdWJtaXQgYW4gaW5kaXZpZHVhbCByZXNwb25zZScsXG4gICAgbGluazogJy4uL2luZGl2aWR1YWwtZGVjaXNpb24tc2VjdXJlJ1xuICB9LFxuICAncGluLXlvdSc6IHtcbiAgICBkZXNjcmlwdGlvbjogJ1lvdVxcJ3ZlIGNob3NlbiB0byBrZWVwIHlvdXIgYW5zd2VycyBzZWN1cmUnLFxuICAgIGxpbmtUZXh0OiAnQ2FuY2VsIHRoaXMgYW5kIG1ha2UgYW5zd2VycyBhdmFpbGFibGUgdG8gdGhlIHJlc3Qgb2YgdGhlJyArICcgaG91c2Vob2xkJyxcbiAgICBsaW5rOiAnLi4vaW5kaXZpZHVhbC1kZWNpc2lvbi1zZWN1cmUnXG4gIH0sXG4gICdxdWVzdGlvbi1wcm94eSc6IHtcbiAgICBkZXNjcmlwdGlvbjogJ05vdCBoYXBweSB0byBjb250aW51ZSBhbnN3ZXJpbmcgZm9yICRbTkFNRV0/JyxcbiAgICBsaW5rVGV4dDogJ1JlcXVlc3QgYW4gaW5kaXZpZHVhbCBhY2Nlc3MgY29kZSB0byBiZSBzZW50IHRvIHRoZW0nLFxuICAgIGxpbms6ICcuLi9pbmRpdmlkdWFsLWRlY2lzaW9uLW90aGVyLXNlY3VyZSdcbiAgfVxufTtcblxuZnVuY3Rpb24gdXBkYXRlQWxsUHJldmlvdXNMaW5rcygpIHtcbiAgJCgnLmpzLXByZXZpb3VzLWxpbmsnKS5hdHRyKCdocmVmJywgZG9jdW1lbnQucmVmZXJyZXIpO1xufVxuXG5mdW5jdGlvbiB1cGRhdGVQZXJzb25MaW5rKCkge1xuICB2YXIgcGVyc29uSWQgPSBuZXcgVVJMU2VhcmNoUGFyYW1zKHdpbmRvdy5sb2NhdGlvbi5zZWFyY2gpLmdldCgncGVyc29uJyk7XG5cbiAgaWYgKHBlcnNvbklkKSB7XG4gICAgdmFyIHVybFBhcmFtID0gbmV3IFVSTFNlYXJjaFBhcmFtcyh3aW5kb3cubG9jYXRpb24uc2VhcmNoKSxcbiAgICAgICAgX3BlcnNvbiA9IGdldEhvdXNlaG9sZE1lbWJlckJ5UGVyc29uSWQocGVyc29uSWQpWydAcGVyc29uJ10sXG4gICAgICAgIHBpbk9iaiA9IGdldFBpbkZvcihwZXJzb25JZCksXG4gICAgICAgIHNlY3VyZUxpbmtUZXh0Q29uZmlnID0gc2VjdXJlTGlua1RleHRNYXBbZ2V0QW5zd2VyaW5nSW5kaXZpZHVhbEJ5UHJveHkoKSA/ICdxdWVzdGlvbi1wcm94eScgOiBwaW5PYmogJiYgcGluT2JqLnBpbiA/ICdwaW4teW91JyA6ICdxdWVzdGlvbi15b3UnXSxcbiAgICAgICAgbGlua0hyZWYgPSBzZWN1cmVMaW5rVGV4dENvbmZpZy5saW5rICsgJz9wZXJzb249JyArIHBlcnNvbklkICsgJyZyZXR1cm51cmw9JyArIHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZSxcbiAgICAgICAgc3VydmV5VHlwZSA9IHVybFBhcmFtLmdldCgnc3VydmV5Jyk7XG5cbiAgICBsaW5rSHJlZiArPSBzdXJ2ZXlUeXBlID8gJyZzdXJ2ZXk9JyArIHN1cnZleVR5cGUgOiAnJztcblxuICAgIHZhciAkc2VjdXJlTGluayA9ICQoJy5qcy1saW5rLXNlY3VyZScpO1xuICAgICRzZWN1cmVMaW5rLmF0dHIoJ2hyZWYnLCBsaW5rSHJlZik7XG5cbiAgICAkc2VjdXJlTGluay5odG1sKHNlY3VyZUxpbmtUZXh0Q29uZmlnLmxpbmtUZXh0KTtcbiAgICAkKCcuanMtbGluay1zZWN1cmUtbGFiZWwnKS5odG1sKHNlY3VyZUxpbmtUZXh0Q29uZmlnLmRlc2NyaXB0aW9uLnJlcGxhY2UoJyRbTkFNRV0nLCBfcGVyc29uLmZ1bGxOYW1lKSk7XG5cbiAgICB2YXIgcGVyc29uTGluayA9ICQoJy5qcy1saW5rLXBlcnNvbicpO1xuICAgIHBlcnNvbkxpbmsuYXR0cignaHJlZicsIHBlcnNvbkxpbmsuYXR0cignaHJlZicpICsgJz9wZXJzb249JyArIHBlcnNvbklkICsgKHN1cnZleVR5cGUgPyAnJnN1cnZleT0nICsgc3VydmV5VHlwZSA6ICcnKSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gdXBkYXRlQnlTdXJ2ZXlUeXBlKCkge1xuICB2YXIgdXJsUGFyYW1zID0gbmV3IFVSTFNlYXJjaFBhcmFtcyh3aW5kb3cubG9jYXRpb24uc2VhcmNoKSxcbiAgICAgIHN1cnZleVR5cGUgPSB1cmxQYXJhbXMuZ2V0KCdzdXJ2ZXknKTtcblxuICBpZiAoc3VydmV5VHlwZSkge1xuICAgICQoJy5qcy1oZWFkZXItdGl0bGUnKS5odG1sKHN1cnZleVR5cGVDb25maWdbc3VydmV5VHlwZV0udGl0bGUpO1xuICAgICQoJyNwZW9wbGUtbGl2aW5nLWhlcmUnKS5odG1sKHN1cnZleVR5cGVDb25maWdbc3VydmV5VHlwZV0uaG91c2Vob2xkU2VjdGlvblRpdGxlKTtcbiAgICAkKCcjcGVvcGxlLWxpdmluZy1oZXJlJykuYXR0cignaHJlZicsIHN1cnZleVR5cGVDb25maWdbc3VydmV5VHlwZV0uaG91c2Vob2xkU2VjdGlvbkxpbmspO1xuICAgICQoJyNyZWxhdGlvbnNoaXBzLXNlY3Rpb24nKS5hdHRyKCdocmVmJywgc3VydmV5VHlwZUNvbmZpZ1tzdXJ2ZXlUeXBlXS5yZWxhdGlvbnNoaXBzU2VjdGlvbik7XG4gICAgJCgndGl0bGUnKS5odG1sKHN1cnZleVR5cGVDb25maWdbc3VydmV5VHlwZV0udGl0bGUpO1xuICB9XG59XG5cbmZ1bmN0aW9uIHNldEFuc3dlcmluZ0luZGl2aWR1YWxCeVByb3h5KGJvb2wpIHtcbiAgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbShJTkRJVklEVUFMX1BST1hZX1NUT1JBR0VfS0VZLCBKU09OLnN0cmluZ2lmeShib29sKSk7XG59XG5cbmZ1bmN0aW9uIGdldEFuc3dlcmluZ0luZGl2aWR1YWxCeVByb3h5KCkge1xuICByZXR1cm4gSlNPTi5wYXJzZShzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKElORElWSURVQUxfUFJPWFlfU1RPUkFHRV9LRVkpKTtcbn1cblxudmFyIHN1cnZleVR5cGVDb25maWcgPSB7XG4gIGxtczoge1xuICAgIHRpdGxlOiAnT25saW5lIEhvdXNlaG9sZCBTdHVkeScsXG4gICAgaG91c2Vob2xkU2VjdGlvblRpdGxlOiAnQWJvdXQgeW91ciBob3VzZWhvbGQnLFxuICAgIGhvdXNlaG9sZFNlY3Rpb25MaW5rOiAnLi4vc3VtbWFyeS8/c3VydmV5PWxtcycsXG4gICAgcmVsYXRpb25zaGlwc1NlY3Rpb246ICcuLi9yZWxhdGlvbnNoaXBzLz9zdXJ2ZXk9bG1zJ1xuICB9XG59O1xuXG5mdW5jdGlvbiBkb0lMaXZlSGVyZSgpIHtcbiAgcmV0dXJuIHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oJ2xpdmVzLWhlcmUnKSA9PT0gJ3llcyc7XG59XG5cbndpbmRvdy5PTlMgPSB3aW5kb3cuT05TIHx8IHt9O1xud2luZG93Lk9OUy5zdG9yYWdlID0ge1xuICBnZXRBZGRyZXNzOiBnZXRBZGRyZXNzLFxuICBhZGRIb3VzZWhvbGRNZW1iZXI6IGFkZEhvdXNlaG9sZE1lbWJlcixcbiAgdXBkYXRlSG91c2Vob2xkTWVtYmVyOiB1cGRhdGVIb3VzZWhvbGRNZW1iZXIsXG4gIGRlbGV0ZUhvdXNlaG9sZE1lbWJlcjogZGVsZXRlSG91c2Vob2xkTWVtYmVyLFxuICBnZXRBbGxIb3VzZWhvbGRNZW1iZXJzOiBnZXRBbGxIb3VzZWhvbGRNZW1iZXJzLFxuICBhZGRVc2VyUGVyc29uOiBhZGRVc2VyUGVyc29uLFxuICBnZXRVc2VyUGVyc29uOiBnZXRVc2VyUGVyc29uLFxuICBnZXRVc2VyQXNIb3VzZWhvbGRNZW1iZXI6IGdldFVzZXJBc0hvdXNlaG9sZE1lbWJlcixcbiAgZ2V0SG91c2Vob2xkTWVtYmVyQnlQZXJzb25JZDogZ2V0SG91c2Vob2xkTWVtYmVyQnlQZXJzb25JZCxcbiAgZ2V0TWVtYmVyUGVyc29uSWQ6IGdldE1lbWJlclBlcnNvbklkLFxuICB1cGRhdGVVc2VyQXNIb3VzZWhvbGRNZW1iZXI6IHVwZGF0ZVVzZXJBc0hvdXNlaG9sZE1lbWJlcixcbiAgZGVsZXRlVXNlckFzSG91c2Vob2xkTWVtYmVyOiBkZWxldGVVc2VyQXNIb3VzZWhvbGRNZW1iZXIsXG4gIHRlbXBBd2F5UXVlc3Rpb25TZW50ZW5jZU1hcDogdGVtcEF3YXlRdWVzdGlvblNlbnRlbmNlTWFwLFxuXG4gIGlzVmlzaXRvcjogaXNWaXNpdG9yLFxuICBpc090aGVySG91c2Vob2xkTWVtYmVyOiBpc090aGVySG91c2Vob2xkTWVtYmVyLFxuICBpc0hvdXNlaG9sZE1lbWJlcjogaXNIb3VzZWhvbGRNZW1iZXIsXG5cbiAgYWRkUmVsYXRpb25zaGlwOiBhZGRSZWxhdGlvbnNoaXAsXG4gIGRlbGV0ZVJlbGF0aW9uc2hpcDogZGVsZXRlUmVsYXRpb25zaGlwLFxuICBlZGl0UmVsYXRpb25zaGlwOiBlZGl0UmVsYXRpb25zaGlwLFxuICBnZXRBbGxSZWxhdGlvbnNoaXBzOiBnZXRBbGxSZWxhdGlvbnNoaXBzLFxuICBnZXRBbGxNYW51YWxSZWxhdGlvbnNoaXBzOiBnZXRBbGxNYW51YWxSZWxhdGlvbnNoaXBzLFxuICBkZWxldGVBbGxSZWxhdGlvbnNoaXBzRm9yTWVtYmVyOiBkZWxldGVBbGxSZWxhdGlvbnNoaXBzRm9yTWVtYmVyLFxuXG4gIGdldEFsbFBhcmVudHNPZjogZ2V0QWxsUGFyZW50c09mLFxuICBnZXRBbGxDaGlsZHJlbk9mOiBnZXRBbGxDaGlsZHJlbk9mLFxuICBnZXRQYXJlbnRJZEZyb21SZWxhdGlvbnNoaXA6IGdldFBhcmVudElkRnJvbVJlbGF0aW9uc2hpcCxcbiAgZ2V0Q2hpbGRJZEZyb21SZWxhdGlvbnNoaXA6IGdldENoaWxkSWRGcm9tUmVsYXRpb25zaGlwLFxuICBnZXRPdGhlclBlcnNvbklkRnJvbVJlbGF0aW9uc2hpcDogZ2V0T3RoZXJQZXJzb25JZEZyb21SZWxhdGlvbnNoaXAsXG4gIGlzQVBhcmVudEluUmVsYXRpb25zaGlwOiBpc0FQYXJlbnRJblJlbGF0aW9uc2hpcCxcbiAgaXNBQ2hpbGRJblJlbGF0aW9uc2hpcDogaXNBQ2hpbGRJblJlbGF0aW9uc2hpcCxcbiAgaXNJblJlbGF0aW9uc2hpcDogaXNJblJlbGF0aW9uc2hpcCxcbiAgYXJlQW55Q2hpbGRyZW5JblJlbGF0aW9uc2hpcE5vdFBhcmVudDogYXJlQW55Q2hpbGRyZW5JblJlbGF0aW9uc2hpcE5vdFBhcmVudCxcbiAgaXNSZWxhdGlvbnNoaXBUeXBlOiBpc1JlbGF0aW9uc2hpcFR5cGUsXG4gIGlzUmVsYXRpb25zaGlwSW5mZXJyZWQ6IGlzUmVsYXRpb25zaGlwSW5mZXJyZWQsXG4gIGdldFJlbGF0aW9uc2hpcE9mOiBnZXRSZWxhdGlvbnNoaXBPZixcblxuICByZWxhdGlvbnNoaXBEZXNjcmlwdGlvbk1hcDogcmVsYXRpb25zaGlwRGVzY3JpcHRpb25NYXAsXG4gIHJlbGF0aW9uc2hpcFN1bW1hcnlUZW1wbGF0ZXM6IHJlbGF0aW9uc2hpcFN1bW1hcnlUZW1wbGF0ZXMsXG4gIG1pc3NpbmdSZWxhdGlvbnNoaXBJbmZlcmVuY2U6IG1pc3NpbmdSZWxhdGlvbnNoaXBJbmZlcmVuY2UsXG4gIGluZmVyUmVsYXRpb25zaGlwczogaW5mZXJSZWxhdGlvbnNoaXBzLFxuICBnZXRSZWxhdGlvbnNoaXBzV2l0aFBlcnNvbklkczogZ2V0UmVsYXRpb25zaGlwc1dpdGhQZXJzb25JZHMsXG4gIGdldFBlb3BsZUlkc01pc3NpbmdSZWxhdGlvbnNoaXBzV2l0aFBlcnNvbjogZ2V0UGVvcGxlSWRzTWlzc2luZ1JlbGF0aW9uc2hpcHNXaXRoUGVyc29uLFxuICBnZXRSZWxhdGlvbnNoaXBUeXBlOiBnZXRSZWxhdGlvbnNoaXBUeXBlLFxuICBmaW5kTmV4dE1pc3NpbmdSZWxhdGlvbnNoaXA6IGZpbmROZXh0TWlzc2luZ1JlbGF0aW9uc2hpcCxcblxuICBhZGRVcGRhdGVQZXJzb25hbERldGFpbHNET0I6IGFkZFVwZGF0ZVBlcnNvbmFsRGV0YWlsc0RPQixcbiAgZ2V0UGVyc29uYWxEZXRhaWxzRm9yOiBnZXRQZXJzb25hbERldGFpbHNGb3IsXG4gIGFkZFVwZGF0ZU1hcml0YWxTdGF0dXM6IGFkZFVwZGF0ZU1hcml0YWxTdGF0dXMsXG4gIGFkZFVwZGF0ZUNvdW50cnk6IGFkZFVwZGF0ZUNvdW50cnksXG4gIGFkZFVwZGF0ZU9yaWVudGF0aW9uOiBhZGRVcGRhdGVPcmllbnRhdGlvbixcbiAgYWRkVXBkYXRlU2FsYXJ5OiBhZGRVcGRhdGVTYWxhcnksXG5cbiAgcGVyc29uYWxEZXRhaWxzTWFyaXRhbFN0YXR1c01hcDogcGVyc29uYWxEZXRhaWxzTWFyaXRhbFN0YXR1c01hcCxcbiAgcGVyc29uYWxEZXRhaWxzQ291bnRyeU1hcDogcGVyc29uYWxEZXRhaWxzQ291bnRyeU1hcCxcbiAgcGVyc29uYWxEZXRhaWxzT3JpZW50YXRpb25NYXA6IHBlcnNvbmFsRGV0YWlsc09yaWVudGF0aW9uTWFwLFxuXG4gIGNyZWF0ZVBpbkZvcjogY3JlYXRlUGluRm9yLFxuICBnZXRQaW5Gb3I6IGdldFBpbkZvcixcbiAgdW5zZXRQaW5Gb3I6IHVuc2V0UGluRm9yLFxuXG4gIHNldEFuc3dlcmluZ0luZGl2aWR1YWxCeVByb3h5OiBzZXRBbnN3ZXJpbmdJbmRpdmlkdWFsQnlQcm94eSxcbiAgZ2V0QW5zd2VyaW5nSW5kaXZpZHVhbEJ5UHJveHk6IGdldEFuc3dlcmluZ0luZGl2aWR1YWxCeVByb3h5LFxuXG4gIGRvSUxpdmVIZXJlOiBkb0lMaXZlSGVyZSxcblxuICBLRVlTOiB7XG4gICAgSE9VU0VIT0xEX01FTUJFUlNfU1RPUkFHRV9LRVk6IEhPVVNFSE9MRF9NRU1CRVJTX1NUT1JBR0VfS0VZLFxuICAgIFVTRVJfU1RPUkFHRV9LRVk6IFVTRVJfU1RPUkFHRV9LRVksXG4gICAgSU5ESVZJRFVBTF9QUk9YWV9TVE9SQUdFX0tFWTogSU5ESVZJRFVBTF9QUk9YWV9TVE9SQUdFX0tFWSxcbiAgICBIT1VTRUhPTERfTUVNQkVSX1RZUEU6IEhPVVNFSE9MRF9NRU1CRVJfVFlQRSxcbiAgICBWSVNJVE9SX1RZUEU6IFZJU0lUT1JfVFlQRSxcbiAgICBSRUxBVElPTlNISVBTX1NUT1JBR0VfS0VZOiBSRUxBVElPTlNISVBTX1NUT1JBR0VfS0VZXG4gIH0sXG5cbiAgSURTOiB7XG4gICAgVVNFUl9IT1VTRUhPTERfTUVNQkVSX0lEOiBVU0VSX0hPVVNFSE9MRF9NRU1CRVJfSURcbiAgfSxcblxuICBUWVBFUzoge1xuICAgIHBlcnNvbjogcGVyc29uLFxuICAgIHJlbGF0aW9uc2hpcDogcmVsYXRpb25zaGlwXG4gIH1cbn07XG5cbndpbmRvdy5PTlMuaGVscGVycyA9IHtcbiAgcG9wdWxhdGVIb3VzZWhvbGRMaXN0OiBwb3B1bGF0ZUhvdXNlaG9sZExpc3QsXG4gIHBvcHVsYXRlVmlzaXRvckxpc3Q6IHBvcHVsYXRlVmlzaXRvckxpc3Rcbn07XG5cbndpbmRvdy5PTlMudXRpbHMgPSB7XG4gIHJlbW92ZUZyb21MaXN0OiByZW1vdmVGcm9tTGlzdCxcbiAgdHJhaWxpbmdOYW1lUzogdHJhaWxpbmdOYW1lUyxcbiAgbnVtYmVyVG9Qb3NpdGlvbldvcmQ6IG51bWJlclRvUG9zaXRpb25Xb3JkXG59O1xuXG4kKHBvcHVsYXRlSG91c2Vob2xkTGlzdCk7XG4kKHBvcHVsYXRlVmlzaXRvckxpc3QpO1xuJCh1cGRhdGVIb3VzZWhvbGRWaXNpdG9yc05hdmlnYXRpb25JdGVtcyk7XG4kKHVwZGF0ZUFkZHJlc3Nlcyk7XG4kKHVwZGF0ZVBlcnNvbkxpbmspO1xuJCh0b29scyk7XG4kKHVwZGF0ZUFsbFByZXZpb3VzTGlua3MpO1xuJCh1cGRhdGVCeVN1cnZleVR5cGUpO1xuXG5leHBvcnRzLlVTRVJfU1RPUkFHRV9LRVkgPSBVU0VSX1NUT1JBR0VfS0VZO1xuZXhwb3J0cy5JTkRJVklEVUFMX1BST1hZX1NUT1JBR0VfS0VZID0gSU5ESVZJRFVBTF9QUk9YWV9TVE9SQUdFX0tFWTtcbmV4cG9ydHMuZ2V0QWRkcmVzcyA9IGdldEFkZHJlc3M7XG5leHBvcnRzLmFkZFVzZXJQZXJzb24gPSBhZGRVc2VyUGVyc29uO1xuZXhwb3J0cy5nZXRVc2VyUGVyc29uID0gZ2V0VXNlclBlcnNvbjtcbiJdfQ==
