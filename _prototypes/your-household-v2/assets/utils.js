export function autoIncrementId(collection) {
  let k = collection + '-increment',
    id = parseInt(sessionStorage.getItem(k)) || 0;

  id++;

  sessionStorage.setItem(k, JSON.stringify(id));

  return id;
}
