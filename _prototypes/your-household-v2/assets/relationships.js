import {autoIncrementId} from './utils';
import {
  getAllHouseholdMembers,
  getHouseholdMemberByPersonId
} from '../household';

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
  'sibling': {id: 'sibling'},
  'step-brother-sister': {id: 'step-brother-sister'},
  'partner': {id: 'partner'},
  'unrelated': {id: 'unrelated'},
  'other-relation': {id: 'other-relation'}
};

export const relationshipDescriptionMap = {
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

/**
 * Types
 */
export function relationship(description, personIsId, personToId) {
  return {
    personIsDescription: description,
    personIsId: personIsId,
    personToId: personToId
  };
}

/**
 * Storage
 */
export function addRelationship(relationshipObj, opts) {
  let options = opts || {},
    householdRelationships = getAllRelationships() || [],
    item = {
      ...relationshipObj,
      id: autoIncrementId('relationships')
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

export function getSiblingIdFromRelationship(personId, relationship) {
  if (!isInRelationship(personId, relationship)) {
    console.log('Person ' + personId + ' not found in relationship: ', relationship);
    return false;
  }

  return relationship[relationship.personIsId === personId ? 'personToId' : 'personIsId'];
}

export function getAllParentsOf(personId) {
  return getAllRelationships()
    .filter(isAChildInRelationship.bind(null, personId))
    .map(relationship => getHouseholdMemberByPersonId(getParentIdFromRelationship(relationship))['@person']);
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
            memberPersonId
          ));
        }
      });
    }

    return missingRelationships;
  }
};
