import {autoIncrementId, removeFromList, trailingNameS} from './utils';
import {
  isHouseholdMember,
  getAllHouseholdMembers,
  getHouseholdMemberByPersonId,
  USER_HOUSEHOLD_MEMBER_ID
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
    sentanceLabel: 'gŵr neu wraig',
    summaryAdjective: 'gŵr neu wraig',
    type: relationshipTypes['spouse']
  },
  // covered
  'mother-father': {
    sentanceLabel: 'mam neu dad',
    summaryAdjective: 'mam neu dad',
    type: relationshipTypes['child-parent']
  },
  // covered
  'step-mother-father': {
    sentanceLabel: 'llysfam neu lystad',
    summaryAdjective: 'llysfam neu lystad',
    type: relationshipTypes['step-child-parent']
  },
  // covered
  'son-daughter': {
    sentanceLabel: 'mab neu ferch',
    summaryAdjective: 'mab neu ferch',
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
    sentanceLabel: 'llysblentyn',
    summaryAdjective: 'llysblentyn',
    type: relationshipTypes['step-child-parent']
  },
  // covered
  'grandparent': {
    sentanceLabel: 'nain/mam-gu neu daid/tad-cu',
    summaryAdjective: 'nain/mam-gu neu daid/tad-cu',
    type: relationshipTypes['grandchild-grandparent']
  },
  // covered
  'grandchild': {
    sentanceLabel: 'ŵyr neu wyres',
    summaryAdjective: 'ŵyr neu wyres',
    type: relationshipTypes['grandchild-grandparent']
  },
  // covered
  'brother-sister': {
    sentanceLabel: 'brawd neu chwaer',
    summaryAdjective: 'brawd neu chwaer',
    type: relationshipTypes['sibling']
  },
  // covered
  'step-brother-sister': {
    sentanceLabel: 'llysfrawd neu lyschwaer',
    summaryAdjective: 'llysfrawd neu lyschwaer',
    type: relationshipTypes['step-brother-sister']
  },
  // covered
  'other-relation': {
    sentanceLabel: 'perthynas arall',
    summaryAdjective: 'perthynas arall',
    type: relationshipTypes['other-relation']
  },
  // covered
  'partner': {
    sentanceLabel: 'partner',
    summaryAdjective: 'partner',
    type: relationshipTypes['partner']
  },
  'same-sex-partner': {
    sentanceLabel: 'partner sifil cofrestredig cyfreithiol',
    summaryAdjective: 'partner sifil cofrestredig cyfreithiol',
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

function personListStr(peopleArr, opts = {}) {
  if (peopleArr.length < 1) {
    console.log(peopleArr, 'not enough people to create a list string');
    return;
  }

  if (peopleArr.length === 1) {
    return nameElement(peopleArr[0].fullName + formatPersonIfYou(peopleArr[0]));
  }

  let peopleCopy = [...peopleArr],
    lastPerson = peopleCopy.pop();

  return peopleCopy
    .map((person) => `${nameElement(person.fullName +
      (opts.isFamily ? trailingNameS(person.fullName) : '') +
      formatPersonIfYou(person))}`)
    .join(', ') + ' and ' + nameElement(lastPerson.fullName +
      (opts.isFamily ? trailingNameS(lastPerson.fullName) : '') +
      formatPersonIfYou(lastPerson))
}

function formatPersonIfYou(person) {
  return person.id === USER_HOUSEHOLD_MEMBER_ID ? ' (You)' : '';
}

export const relationshipSummaryTemplates = {
  'partnership': (person1, person2, description) => {
    return `${nameElement(person1.fullName + formatPersonIfYou(person1))} is ${nameElement(person2.fullName + trailingNameS(person2.fullName) + formatPersonIfYou(person2))} ${description}`;
  },
  'twoFamilyMembersToMany': (parent1, parent2, childrenArr, description) => {
    return `${nameElement(parent1.fullName + formatPersonIfYou(parent1))} and ${nameElement(parent2.fullName + formatPersonIfYou(parent2))} are ${personListStr(childrenArr, {isFamily: true})} ${description}`;
  },
  'oneFamilyMemberToMany': (parent, childrenArr, description) => {
    console.log(parent, childrenArr, description);
    return `${nameElement(parent.fullName + formatPersonIfYou(parent))} is ${personListStr(childrenArr, {isFamily: true})} ${description}`;
  },
  'manyToMany': (peopleArr1, peopleArr2, description) => {
    return `${personListStr(peopleArr1)} ${peopleArr1.length > 1 ? 'are' : 'is'} ${description} to ${personListStr(peopleArr2)}`;
  },
  'allMutual': (peopleArr, description) => {
    return `${personListStr(peopleArr)} are ${description}`;
  }
};

/**
 * Types
 */
export function relationship(description, personIsId, personToId, opts = {}) {
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
export function addRelationship(relationshipObj) {
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

export function deleteRelationship(relationshipObj) {
  let householdRelationships = (getAllRelationships() || [])
    .filter(relationship => relationship.id !== relationshipObj.id);

  sessionStorage.setItem(RELATIONSHIPS_STORAGE_KEY,
    JSON.stringify(householdRelationships));
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

export function getAllManualRelationships() {
  return getAllRelationships().filter((relationship) => {
    return !relationship.inferred;
  });
}

export function deleteAllRelationshipsForMember(personId) {
  const householdRelationships = getAllRelationships()
    .filter((relationship) => {
      return !(personId === relationship.personIsId || personId === relationship.personToId);
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

  let childIndexAsPersonIs = childrenIds.indexOf(relationship.personIsId),
    childIndexAsPersonTo = childrenIds.indexOf(relationship.personToId);

  /**
   * Find parents with the same children
   *
   * If a personIs-child is not in relationship
   * or 2 children are found in relationship
   */
  if (
    (childIndexAsPersonIs === -1 && childIndexAsPersonTo === -1) ||
    (childIndexAsPersonIs !== -1 && childIndexAsPersonTo !== -1)
  ) {
    return false;
  }

  /**
   * Child must be in relationship, get child index
   */
  let childIndex = childIndexAsPersonIs !== -1
    ? childIndexAsPersonIs
    : childIndexAsPersonTo;

  /**
   * If personIs is not in relationship
   * and child from previous relationship is a child in this relationship
   */
  return !isInRelationship(notParentId, relationship) &&
    isAChildInRelationship(childrenIds[childIndex], relationship);
}

export function isRelationshipType(relationshipType, relationship) {
  const typeOfRelationship = relationshipDescriptionMap[relationship.personIsDescription]
    .type.id;

  /**
   * relationshipType can be an array of types
   */
  return _.isArray(relationshipType)
    ? !!_.find(relationshipType, function(rType) {
      return rType === typeOfRelationship;
    })
    : typeOfRelationship === relationshipType;
}

export function isRelationshipInferred(relationship) {
  return relationship.inferred;
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
    .map(relationship => getPersonFromMember(getHouseholdMemberByPersonId(getParentIdFromRelationship(relationship))));
}

export function getAllChildrenOf(personId) {
  return getAllRelationships()
    .filter(isAParentInRelationship.bind(null, personId))
    .map(relationship => getHouseholdMemberByPersonId(getChildIdFromRelationship(relationship))['@person']);
}

export function getPersonIdFromPerson(person) {
  return person.id;
}

export function getPersonFromMember(member) {
  return member['@person'];
}

/**
 * Missing relationship inference
 */
export const missingRelationshipInference = {
  siblingsOf(subjectMember) {

    const missingRelationships = [],
      allRelationships = getAllRelationships(),
      person = getPersonFromMember(subjectMember),
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

      getAllHouseholdMembers()
        .filter(isHouseholdMember)
        .forEach((member) => {

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
              parents.map(getPersonIdFromPerson),
              memberParents.map(getPersonIdFromPerson)
            ).length === 0) {

            /**
             * Add to missingRelationships
             */
            missingRelationships.push(relationship(
              'brother-sister',
              personId,
              memberPersonId,
              {
                inferred: true,
                inferredBy: [
                  /**
                   * Must be 4 relationships
                   * Could have used member's parents but we can assume they
                   * must be the same at this point or the inferrence
                   * couldn't happen.
                   */
                  getRelationshipOf(personId, parents[0].id).id,
                  getRelationshipOf(personId, parents[1].id).id,
                  getRelationshipOf(memberPersonId, parents[0].id).id,
                  getRelationshipOf(memberPersonId, parents[1].id).id
                ]
              }
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
  let householdMembers = getAllHouseholdMembers().filter(isHouseholdMember),
    relationships = getAllRelationships(),
    missingRelationshipMembers = [],
    personIs = null;

  /**
   * Find the next missing relationship
   */
  $.each(householdMembers, function(i, member) {
    const personId = member['@person'].id;

    /**
     * Get all relationships for this member
     */
    const memberRelationships = relationships.filter(function(relationship) {
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
  const remainingPersonIds = getAllHouseholdMembers()
    .filter(isHouseholdMember)
    .map(function(member) {
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

export function getRelationshipType(relationship) {
  return relationshipDescriptionMap[relationship.personIsDescription].type;
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

export function getRelationshipOf(person1, person2) {
  return getAllRelationships().find(function(relationship) {
    return isInRelationship(person1, relationship) &&
      isInRelationship(person2, relationship);
  });
}
