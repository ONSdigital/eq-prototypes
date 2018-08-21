export function tools () {

  const $listLinks = $('.test-data-links'),

    $createFamilyHousehold = $('<li><a href="#" class=\'mock-data-family\'>' +
      'Create family household</a></li>'),

    $createFamilyRelationships = $('<li><a href="#"' +
      ' class=\'mock-data-family\'>' +
      'Create family relationships</a></li>'),

    familyHouseholdMembersData = [{
      'type': 'household-member',
      '@person': {
        'fullName': 'Dave  Jones',
        'firstName': 'Dave',
        'middleName': '',
        'lastName': 'Jones',
        'id': 'person_me',
        'gender': 'male'
      }
    }, {
      'type':
        'household-member',
      '@person': {
        'fullName': 'Sally  Jones',
        'firstName': 'Sally',
        'middleName': '',
        'lastName': 'Jones',
        'id': 'person1',
        'gender': 'female'
      }
    }, {
      'type': 'household-member',
      '@person': {
        'fullName': 'Rebecca  Jones',
        'firstName': 'Rebecca',
        'middleName': '',
        'lastName': 'Jones',
        'id': 'person2',
        'gender': 'female'
      }
    }, {
      'type': 'household-member',
      '@person': {
        'fullName': 'Amy Jones',
        'firstName': 'Amy',
        'middleName': '',
        'lastName': 'Jones',
        'id': 'person3',
        'gender': 'female'
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
      'id': 6
    }],

    userData = {
      'fullName': 'Dave  Jones',
      'firstName': 'Dave',
      'middleName': '',
      'lastName': 'Jones'
    };

  $createFamilyHousehold.on('click', function(e) {
    e.preventDefault();
    clearStorage();
    createFamilyHousehold();
  });

  $createFamilyRelationships.on('click', function(e) {
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
