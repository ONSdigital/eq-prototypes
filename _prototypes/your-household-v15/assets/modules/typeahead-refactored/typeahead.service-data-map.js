import {sanitiseTypeaheadText} from './typeahead-helpers';

export default function typeaheadDataMap(opts, response) {

  /**
   * Required parameter validation needed
   */

  return response.json()
    .then(data => {
      const results = data.results;

      results.forEach(result => {
        result.sanitisedText = sanitiseTypeaheadText(result[opts.lang], opts.sanitisedQueryReplaceChars);

        if (opts.lang !== 'en-gb') {
          const english = result['en-gb'];
          const sanitisedAlternative = sanitiseTypeaheadText(english, this.sanitisedQueryReplaceChars);

          if (sanitisedAlternative.match(opts.query)) {
            result.alternatives = [english];
            result.sanitisedAlternatives = [sanitisedAlternative];
          }
        } else {
          result.alternatives = [];
          result.sanitisedAlternatives = [];
        }
      });

      return {
        results,
        totalResults: data.totalResults
      };
    });
}
