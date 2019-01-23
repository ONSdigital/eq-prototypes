export function tools () {

  const $listLinks = $('.test-data-links'),

    $clearData =
      $('<li><a href="#" class=\'mock-data-family\'>' +
        'Clear all data</a></li>'),

    $createFamilyHousehold =
      $('<li><a href="#" class=\'mock-data-family\'>' +
      'Create family household</a></li>'),

    $createFamilyRelationships =
      $('<li><a href="#"' +
      ' class=\'mock-data-family\'>' +
      'Create family with relationships</a></li>'),

    $createFamilyWithRelationshipsAndVisitors =
      $('<li><a href="#"' +
      ' class=\'mock-data-family\'>' +
      'Create family with relationships and visitors</a></li>'),

    $createFamilyWithRelationshipsPersonalDetailsAndVisitors =
      $('<li><a' +
      ' href="#"' +
      ' class=\'mock-data-family\'>' +
      'Create family with relationships, just family individual responses and' +
      ' visitors</a></li>'),

    $createFamilyWithRelationshipsPersonalDetailsAndVisitorsPersonalDetails =
      $('<li><a' +
      ' href="#"' +
      ' class=\'mock-data-family\'>' +
      'Create family with relationships, family individual responses and' +
      ' visitors individual responses</a></li>'),

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
      'type':
        'household-member',
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
    },
    {
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
        'dob': {'day': '02', 'month': '10', 'year': '1965'},
        'maritalStatus': 'married',
        'country': 'wales',
        'orientation': 'straight',
        'salary': '40000'
      },
      'person2': {
        'dob': {'day': '20', 'month': '5', 'year': '1981'},
        'maritalStatus': 'never',
        'country': 'wales',
        'orientation': 'straight',
        'salary': '20000'
      },
      'person3': {
        'dob': {'day': '11', 'month': '7', 'year': '1984'},
        'maritalStatus': 'never',
        'country': 'wales',
        'orientation': 'straight',
        'salary': '20000'
      }
    },

    visitorsPersonalDetails = {
      'person4': {
        'sex': 'male',
        'dob': {'day': '20', 'month': '7', 'year': '1990'},
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
        'dob': {'day': '02', 'month': '5', 'year': '1991'},
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

  $createFamilyHousehold.on('click', function(e) {
    e.preventDefault();
    clearStorage();
    prerequisites();
    createFamilyHousehold();
    window.location.href = '../summary';
  });

  $createFamilyRelationships.on('click', function(e) {
    e.preventDefault();
    clearStorage();
    prerequisites();
    createFamilyHousehold();
    createFamilyRelationships();
    window.location.href = '../hub';
  });

  $createFamilyWithRelationshipsAndVisitors.on('click', function(e) {
    e.preventDefault();
    clearStorage();
    prerequisites();
    createFamilyHouseholdWithVisitors();
    createFamilyRelationships();
    window.location.href = '../hub';
  });

  $createFamilyWithRelationshipsPersonalDetailsAndVisitors.on('click', function(e) {
    e.preventDefault();
    clearStorage();
    prerequisites();
    createFamilyHouseholdWithVisitors();
    createFamilyRelationships();
    createFamilyPersonalDetails();
    window.location.href = '../hub';
  });

  $createFamilyWithRelationshipsPersonalDetailsAndVisitorsPersonalDetails.on('click', function(e) {
    e.preventDefault();
    clearStorage();
    prerequisites();
    createFamilyHouseholdWithVisitors();
    createFamilyRelationships();
    createFamilyVisitorsPersonalDetails();
    window.location.href = '../hub';
  });

  $clearData.on('click', function(e) {
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
    sessionStorage.setItem(window.ONS.storage.KEYS.HOUSEHOLD_MEMBERS_STORAGE_KEY, JSON.stringify([
      ...familyHouseholdMembersData,
      ...visitorsMemberData
    ]));
  }

  function createFamilyRelationships() {
    sessionStorage.setItem(window.ONS.storage.KEYS.RELATIONSHIPS_STORAGE_KEY, JSON.stringify(familyHouseholdRelationshipsData));
    sessionStorage.setItem('relationships-increment', JSON.stringify(6));
  }

  function createFamilyPersonalDetails() {
    sessionStorage.setItem(window.ONS.storage.KEYS.PERSONAL_DETAILS_KEY, JSON.stringify(familyPersonalDetails));
  }

  function createFamilyVisitorsPersonalDetails() {
    sessionStorage.setItem(window.ONS.storage.KEYS.PERSONAL_DETAILS_KEY, JSON.stringify({
      ...familyPersonalDetails,
      ...visitorsPersonalDetails
    }));
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
