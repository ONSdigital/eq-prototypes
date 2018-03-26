const HOUSEHOLD_MEMBERS_STORAGE_KEY = 'household-members';

export function populateList() {
  var members = getAllHouseholdMembers() || [];

  $('#household-members').empty().append(members.map(function(member) {
    return $('<li>').addClass('mars').text(member.fullName);
  }));
}

export function getAddress() {
  let addressLines = localStorage.getItem('address').split(',');

  return {
    addressLine1: addressLines[0],
    addressLine2: addressLines[1],
    addressLine3: addressLines[2],
    addressCounty: addressLines[4],
    addressTownCity: addressLines[3],
    addressPostcode: addressLines[5]
  }
}

export function addHouseholdMember(person) {
  var people = getAllHouseholdMembers() || [];

  people.push({
    id: 'person' + people.length,
    ...person
  });

  localStorage.setItem(HOUSEHOLD_MEMBERS_STORAGE_KEY, JSON.stringify(people));
}

export function getAllHouseholdMembers() {
  return JSON.parse(localStorage.getItem(HOUSEHOLD_MEMBERS_STORAGE_KEY));
}

export function person(opts) {
  if (opts.firstName === '' || opts.lastName === '') {
    throw Error('Unable to create person with data: ', opts.firstName, !opts.middleName, !opts.lastName);
  }

  let middleName = opts.middleName || '';

  return {
    fullName: opts.firstName + ' ' + middleName + ' ' + opts.lastName,
    firstName: opts.firstName,
    middleName,
    lastName: opts.lastName
  };
}

window.ONS = {};
window.ONS.getAddress = getAddress;
window.ONS.addHouseholdMember = addHouseholdMember;
window.ONS.getAllHouseholdMembers = getAllHouseholdMembers;
window.ONS.person = person;

$(populateList);

/*if (yesbox.checked) {
    e.preventDefault();
    var members = localStorage.getItem('household-members') || '';
    var comma = members ? ',' : '';
    localStorage.setItem('household-members', members + comma + newName);
    window.location.reload();

} else {
    if (window.location.search.match(/addnew=1/)) {
        document.trav.action = "../summary";
    } else if (localStorage.getItem('lives-here') === 'no') {
        document.trav.action = "../are-you-sure";
    } else {
        document.trav.action = "../temp-away-from-home";
    }
}*/
