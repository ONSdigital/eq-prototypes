import {sanitiseTypeaheadText} from './typeahead-helpers';

export default function suggestionsServiceDataMap(state, data) {
  return data.map(item => {
    const newItem = {
      sanitisedText: sanitiseTypeaheadText(item[state.lang], state.sanitisedQueryReplaceChars)
    };

    if (state.lang !== 'en-gb') {
      const english = newItem['en-gb'];
      const sanitisedAlternative = sanitiseTypeaheadText(english, state.sanitisedQueryReplaceChars);

      if (sanitisedAlternative.match(state.sanitisedQuery)) {
        newItem.alternatives = [english];
        newItem.sanitisedAlternatives = [sanitisedAlternative];
      }
    } else {
      newItem.alternatives = [];
      newItem.sanitisedAlternatives = [];
    }

    return {
      ...item,
      ...newItem
    };
  });
}
