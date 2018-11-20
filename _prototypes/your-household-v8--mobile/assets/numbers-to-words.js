/**
 * Copied from:
 * https://codereview.stackexchange.com/questions/90349/changing-number-to-words-in-javascript
 * ===============
 */
var ONE_TO_NINETEEN = [
  'one', 'two', 'three', 'four', 'five',
  'six', 'seven', 'eight', 'nine', 'ten',
  'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen',
  'sixteen', 'seventeen', 'eighteen', 'nineteen'
];

var TENS = [
  'ten', 'twenty', 'thirty', 'forty', 'fifty',
  'sixty', 'seventy', 'eighty', 'ninety'
];

var SCALES = ['thousand', 'million', 'billion', 'trillion'];

// helper function for use with Array.filter
function isTruthy(item) {
  return !!item;
}

// convert a number into 'chunks' of 0-999
function chunk(number) {
  var thousands = [];

  while(number > 0) {
    thousands.push(number % 1000);
    number = Math.floor(number / 1000);
  }

  return thousands;
}

// translate a number from 1-999 into English
function inEnglish(number) {
  var thousands, hundreds, tens, ones, words = [];

  if(number < 20) {
    return ONE_TO_NINETEEN[number - 1]; // may be undefined
  }

  if(number < 100) {
    ones = number % 10;
    tens = number / 10 | 0; // equivalent to Math.floor(number / 10)

    words.push(TENS[tens - 1]);
    words.push(inEnglish(ones));

    return words.filter(isTruthy).join('-');
  }

  hundreds = number / 100 | 0;
  words.push(inEnglish(hundreds));
  words.push('hundred');
  words.push(inEnglish(number % 100));

  return words.filter(isTruthy).join(' ');
}

// append the word for a scale. Made for use with Array.map
function appendScale(chunk, exp) {
  var scale;
  if (!chunk) {
    return null;
  }
  scale = SCALES[exp - 1];
  return [chunk, scale].filter(isTruthy).join(' ');
}

/**
 * ===============
 * End copy
 */

/**
 * Modification - decorator
 */
var NUMBER_TO_POSITION_TEXT_MAP = {
  'one': 'first',
  'two': 'second',
  'three': 'third',
  'four': 'fourth',
  'five': 'fifth',
  'six': 'sixth',
  'seven': 'seventh',
  'eight': 'eighth',
  'nine': 'nineth',
  'ten': 'tenth',
  'eleven': 'eleventh',
  'twelve': 'twelveth',
  'thirteen': 'thirteenth',
  'fourteen': 'fourteenth',
  'fifteen': 'fifteenth',
  'sixteen': 'sixteenth',
  'seventeen': 'seventeenth',
  'eighteen': 'eighteenth',
  'nineteen': 'nineteenth',

  'twenty': 'twentieth',
  'thirty': 'thirtieth',
  'forty': 'fortieth',
  'fifty': 'fiftieth',
  'sixty': 'sixtieth',
  'seventy': 'seventieth',
  'eighty': 'eightieth',
  'ninety': 'ninetieth',
  'hundred': 'hundredth',

  'thousand': 'thousandth',
  'million': 'millionth',
  'billion': 'billionth',
  'trillion': 'trillionth'
};

export function numberToPositionWord(num) {
  const str = chunk(num)
    .map(inEnglish)
    .map(appendScale)
    .filter(isTruthy)
    .reverse()
    .join(' ');

  const sub = str.split(' '),
    lastWordDashSplitArr = sub[sub.length - 1].split('-'),
    lastWord = lastWordDashSplitArr[lastWordDashSplitArr.length - 1],

    newLastWord = (lastWordDashSplitArr.length > 1? lastWordDashSplitArr[0] + '-' : '') +
      NUMBER_TO_POSITION_TEXT_MAP[lastWord];

  /*console.log('str:', str);
  console.log('sub:', sub);
  console.log('lastWordDashSplitArr:', lastWordDashSplitArr);
  console.log('lastWord:', lastWord);
  console.log('newLastWord:', newLastWord);*/

  const subCopy = [].concat(sub);
  subCopy.pop();
  const prefix = subCopy.join(' ');
  const result = (prefix ? prefix + ' ' : '') + newLastWord;

  // console.log('result', (prefix ? prefix + ' ' : '') + newLastWord);
  return result;
}
