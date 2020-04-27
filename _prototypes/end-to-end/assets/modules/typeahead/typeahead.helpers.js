export function sanitiseTypeaheadText(string, sanitisedQueryRemoveChars = [], sanitisedQuerySplitNumsChars = false, trimEnd = true) {
  let sanitisedString = string.toLowerCase();

  sanitisedQueryRemoveChars.forEach(char => {
    sanitisedString = sanitisedString.replace(new RegExp(char.toLowerCase(), 'g'), '');
  });

  sanitisedString = sanitisedString.replace(/\s\s+/g, ' ');

  if (sanitisedQuerySplitNumsChars) {
    sanitisedString = sanitisedString.replace(/\d(?=[a-z]{2,})/gi, '$& ');
  }

  sanitisedString = trimEnd ? sanitisedString.trim() : sanitisedString.trimStart();

  return sanitisedString;
}
