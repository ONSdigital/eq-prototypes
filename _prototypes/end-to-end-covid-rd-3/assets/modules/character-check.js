const inputClassLimitReached = 'input--limit-reached';
const remainingClassLimitReached = 'input__limit--reached';
const attrCharCheckRef = 'data-char-check-ref';
const attrCharCheckVal = 'data-char-check-num';

class CharCheck {
  constructor(context) {
    this.context = context;
    this.input = this.context.querySelector('input');
    this.checkElement = document.getElementById(this.input.getAttribute(attrCharCheckRef));
    this.checkVal = this.input.getAttribute(attrCharCheckVal);

    this.charLimitSingularMessage = this.checkElement.getAttribute('data-charcount-limit-singular');
    this.charLimitPluralMessage = this.checkElement.getAttribute('data-charcount-limit-plural');

    this.updateCheckReadout(null, true);
    this.input.addEventListener('input', this.updateCheckReadout.bind(this));
  }

  updateCheckReadout(event, firstRun) {
    const value = this.input.value;
    const remaining = this.checkVal - value.length;
    // Prevent aria live announcement when component initialises
    if (!firstRun && event.inputType) {
      this.checkElement.setAttribute('aria-live', 'polite');
    } else {
      this.checkElement.removeAttribute('aria-live');
    }

    this.checkRemaining(remaining);
    this.setCheckClass(remaining, this.input, inputClassLimitReached);
    this.setCheckClass(remaining, this.checkElement, remainingClassLimitReached);
  }

  checkRemaining(remaining) {
    let message;
    if (remaining === -1) {
      message = this.charLimitSingularMessage;
      this.checkElement.innerText = message.replace('{x}', Math.abs(remaining));
    } else if (remaining < -1) {
      message = this.charLimitPluralMessage;
      this.checkElement.innerText = message.replace('{x}', Math.abs(remaining));
    }
    this.setShowMessage(remaining);
  }

  setShowMessage(remaining) {
    this.checkElement.classList[remaining < 0 ? 'remove' : 'add']('u-d-no');
  }

  setCheckClass(remaining, element, setClass) {
    element.classList[remaining < 0 ? 'add' : 'remove'](setClass);
  }
}

const checkedWrapper = [...document.querySelectorAll('.js-char-check')];
if (checkedWrapper.length) {
  checkedWrapper.forEach(input => new CharCheck(input));
}