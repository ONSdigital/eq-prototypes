import {autoIncrementId} from './utils';
import {
  isHouseholdMember,
  getAllHouseholdMembers,
  getHouseholdMemberByPersonId
} from './household';

/**
 * Augment Underscore library
 */
const _ = window._ || {};

export const RELATIONSHIPS_STORAGE_KEY = 'relationships';

export const relationshipTypes = {
  'spouse': {id: 'spouse'},
  'child-parent': {id: 'child-parent'},
  'step-child-parent': {id: 'step-child-parent'},
  'grandchild-grandparent': {id: 'grandchild-grandparent'},
  'half-sibling': {id: 'half-sibling'},
  'sibling': {id: 'sibling'},
  'step-brother-sister': {id: 'step-brother-sister'},
  'partner': {id: 'partner'},
  'unrelated': {id: 'unrelated'},
  'other-relation': {id: 'other-relation'}
};

export const relationshipDescriptionMap = {
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
    sentanceLabel: 'other type of relation',
    summaryAdjective: 'related',
    type: relationshipTypes['other-relation']
  },
  // covered
  'partner': {
    sentanceLabel: 'partner',
    summaryAdjective: 'partners',
    type: relationshipTypes['partner']
  },
  // covered
  'unrelated': {
    sentanceLabel: 'no relation',
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

  let peopleCopy = [...peopleArr],
    lastPerson = peopleCopy.pop();

  return peopleCopy
    .map(nameElement).join(', ') + ' and ' + nameElement(lastPerson)
}

export const relationshipSummaryTemplates = {
  'partnership': (person1, person2, description) => {
    return `${personListStr([person1, person2])} are ${description}`;
  },
  /**
   * Summary can only be inferred
   */
  'twoFamilyMembersToMany': (parent1, parent2, childrenArr, description) => {
    return `<strong>${parent1}</strong> and <strong>${parent2}</strong> are the ${description} of ${personListStr(childrenArr)}`;
  },
  'oneFamilyMemberToMany': (parent, childrenArr, description) => {
    return `<strong>${parent}</strong> is the ${description} of ${personListStr(childrenArr)}`;
  },
  'allMutual': (peopleArr, description) => {
    return `${personListStr(peopleArr)} are ${description}`;
  }

  /**
   * TODO
   * Missing many to one template
   */
};

/**
 * Types
 */
export function relationship(description, personIsId, personToId, opts = {}) {
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
export function addRelationship(relationshipObj, opts = {}) {
  let householdRelationships = getAllRelationships() || [],
    item = {
      ...relationshipObj,
      id: autoIncrementId(RELATIONSHIPS_STORAGE_KEY)
    };

  householdRelationships.push(item);

  sessionStorage.setItem(RELATIONSHIPS_STORAGE_KEY,
    JSON.stringify(householdRelationships));

  return item;
}

export function editRelationship(relationshipId, valueObject) {
  let householdRelationships = (getAllRelationships() || []).map(function(relationship) {
    return (relationship.id + '') === (relationshipId + '') ? {
      ...valueObject,
      id: relationshipId
    } : relationship;
  });

  sessionStorage.setItem(RELATIONSHIPS_STORAGE_KEY,
    JSON.stringify(householdRelationships));
}

export function getAllRelationships() {
  return JSON.parse(sessionStorage.getItem(RELATIONSHIPS_STORAGE_KEY)) || [];
}

export function deleteAllRelationshipsForMember(memberId) {
  const householdRelationships = getAllRelationships()
    .filter((relationship) => {
      return !(memberId === relationship.personIsId || memberId === relationship.personToId);
    });

  sessionStorage.setItem(RELATIONSHIPS_STORAGE_KEY,
    JSON.stringify(householdRelationships));
}

/**
 * Comparators
 */
export function isInRelationship(personId, relationship) {
  return relationship.personToId === personId || relationship.personIsId === personId;
}

export function isAChildInRelationship(personId, relationship) {
  /**
   * Guard
   */
  if (!isInRelationship(personId, relationship)) {
    return false;
  }

  return (
    relationship.personIsDescription === 'mother-father' &&
    relationship.personToId === personId
  ) || (
    relationship.personIsDescription === 'son-daughter' &&
    relationship.personIsId === personId
  );
}

export function isASiblingInRelationship(personId, relationship) {
  return isInRelationship(personId, relationship) &&
    relationshipDescriptionMap[relationship.personIsDescription].type.id === 'sibling';
}

export function isAParentInRelationship(personId, relationship) {
  /**
   * Guard
   */
  if (!isInRelationship(personId, relationship)) {
    return false;
  }

  return (
    relationship.personIsDescription === 'mother-father' &&
    relationship.personIsId === personId
  ) || (
    relationship.personIsDescription === 'son-daughter' &&
    relationship.personToId === personId
  );
}

export function areAnyChildrenInRelationshipNotParent(childrenIds, notParentId, relationship) {
  /**
   * Guard
   * If relationship type is not child-parent
   */
  if (relationshipDescriptionMap[relationship.personIsDescription]
    .type.id !== 'child-parent') {

    return false;
  }

  /**
   * Find parents with the same children
   *
   * If personIs-child is in relationship
   */
  if ((
    childrenIds.indexOf(relationship.personIsId) === -1 &&
    childrenIds.indexOf(relationship.personToId) === -1
  )) {
    return false;
  }

  /**
   * If personIs is not in relationship
   */
  return !isInRelationship(notParentId, relationship);
}

/**
 * Retrieve people by role in relationships
 */
export function getParentIdFromRelationship(relationship) {
  let parentId;

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

export function getChildIdFromRelationship(relationship) {
  let childId;

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

export function getSiblingIdFromRelationship(personId, relationship) {
  if (!isInRelationship(personId, relationship)) {
    console.log('Person ' + personId + ' not found in relationship: ', relationship);
    return false;
  }

  return relationship[relationship.personIsId === personId ? 'personToId' : 'personIsId'];
}

export function getOtherPersonIdFromRelationship(personId, relationship) {
  return relationship.personIsId === personId
    ? relationship.personToId : relationship.personIsId;
}

export function getAllParentsOf(personId) {
  return getAllRelationships()
    .filter(isAChildInRelationship.bind(null, personId))
    .map(relationship => getHouseholdMemberByPersonId(getParentIdFromRelationship(relationship))['@person']);
}

export function getAllChildrenOf(personId) {
  return getAllRelationships()
    .filter(isAParentInRelationship.bind(null, personId))
    .map(relationship => getHouseholdMemberByPersonId(getChildIdFromRelationship(relationship))['@person']);
}

export function getParentIdFromPerson(person) {
  return person.id;
}

/**
 * Missing relationship inference
 */
export const missingRelationshipInference = {
  siblingsOf(subjectMember) {

    const missingRelationships = [],
      allRelationships = getAllRelationships(),
      person = subjectMember['@person'],
      personId = person.id,

      parents = getAllParentsOf(personId),

      siblingIds = allRelationships
        .filter(isASiblingInRelationship.bind(null, personId))
        .map(getSiblingIdFromRelationship.bind(null, personId));

    /**
     * If 2 parent relationships of 'person' are found we can attempt to infer
     * sibling relationships
     */
    if (parents.length === 2) {

      getAllHouseholdMembers().forEach((member) => {

        const memberPersonId = member['@person'].id;

        /**
         * Guard
         * If member is the subject member
         * or member is a parent
         * or member already has a sibling relationship with 'person'
         * skip member
         */
        if (memberPersonId === personId ||
          memberPersonId === parents[0].id || memberPersonId === parents[1].id ||
          siblingIds.indexOf(memberPersonId) > -1) {
          return;
        }

        const memberParents = getAllParentsOf(memberPersonId);

        /**
         * If 2 parents of 'member' are found
         * and they are the same parents of 'person'
         * we have identified a missing inferred relationship
         */
        if (memberParents.length === 2 &&
          _.difference(
            parents.map(getParentIdFromPerson),
            memberParents.map(getParentIdFromPerson)
          ).length === 0) {

          /**
           * Add to missingRelationships
           */
          missingRelationships.push(relationship(
            'brother-sister',
            person.id,
            memberPersonId,
            {inferred: true}
          ));
        }
      });
    }

    return missingRelationships;
  }
};

export function inferRelationships(relationship, personIs, personTo) {
  var missingRelationships = [];

  if (relationship.personIsDescription === 'mother-father') {
    missingRelationships = missingRelationships.concat(
      missingRelationshipInference.siblingsOf(personTo)
    );
  }

  if (relationship.personIsDescription === 'son-daughter') {
    missingRelationships = missingRelationships.concat(
      missingRelationshipInference.siblingsOf(personIs)
    );
  }

  $.each(missingRelationships, function(i, relationship) {
    addRelationship(relationship);
  });
}

export function findNextMissingRelationship() {
  var householdMembers = getAllHouseholdMembers().filter(isHouseholdMember),
    relationships = getAllRelationships(),
    missingRelationshipMembers = [],
    personIs = null;

  /**
   * Find the next missing relationship
   */
  $.each(householdMembers, function(i, member) {
    var personId = member['@person'].id;

    /**
     * Get all relationships for this member
     */
    var memberRelationships = relationships.filter(function(relationship) {
        return relationship.personIsId === personId || relationship.personToId === personId;
      }),

      memberRelationshipToIds = memberRelationships.map(function(relationship) {
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
      missingRelationshipMembers = householdMembers.filter(function(m) {
        return memberRelationshipToIds.indexOf(m['@person'].id) === -1 &&
          m['@person'].id !== personId;
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

export function getPeopleIdsMissingRelationshipsWithPerson(personId) {
  var remainingPersonIds = getAllHouseholdMembers().map(function(member) {
    return member['@person'].id;
  });

  /**
   * Remove this person from the list
   */
  removeFromList(remainingPersonIds, personId);

  $.each(getAllRelationships(), function(i, relationship) {
    if (!isInRelationship(personId, relationship)) {
      return;
    }

    /**
     * Remove the other person from the remainingPersonIds list
     */
    removeFromList(
      remainingPersonIds,
      getOtherPersonIdFromRelationship(personId, relationship)
    );
  });

  return remainingPersonIds;
}

/**
 * Retrieve from relationship group
 */
export function getRelationshipsWithPersonIds(relationships, idArr) {
  return relationships.filter(function(childRelationship) {
    return idArr.indexOf(childRelationship.personIsId) !== -1 ||
      idArr.indexOf(childRelationship.personToId) !== -1;
  });
}

/**
 * Utils
 */
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

  if(_.isArray(val)) {
    $.each(val, function (i, item) {
      doRemove(item);
    });
  }
  else {
    doRemove(val);
  }
}
