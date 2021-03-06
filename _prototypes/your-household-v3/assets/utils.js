export function autoIncrementId(collection) {
  let k = collection + '-increment',
    id = parseInt(sessionStorage.getItem(k)) || 0;

  id++;

  sessionStorage.setItem(k, JSON.stringify(id));

  return id;
}

export function removeFromList(list, val) {

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
    $.each(val, function(i, item) {
      doRemove(item);
    });
  } else {
    doRemove(val);
  }
}

export function trailingNameS(name) {
  return name[name.length - 1] === 's' ? '\&#x2019;' : '\&#x2019;s';
}
