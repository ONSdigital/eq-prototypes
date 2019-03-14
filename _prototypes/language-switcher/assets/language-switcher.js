import domReady from './domready';
export class LanguageSelector {
  constructor(context) {
    this.context = context;
    this.link = context.querySelector('.js-language-switcher-link');
    this.button = context.querySelector('.js-language-switcher-button');
    this.itemsContainer = context.querySelector('.js-language-switcher-items');
    this.items = [...this.itemsContainer.querySelectorAll('.js-language-switcher-item')];
    this.switchMouseDown = false;
    this.isOpen = false;

    this.setAriaAttributes();

    /**
     * Handle events
     */
    this.button.addEventListener('click', event => {
      event.stopPropagation();
      this.switchMouseDown = false;
      this.toggle();
    });

    this.button.addEventListener('focus', () => !this.switchMouseDown && this.setOpen(true));

    this.button.addEventListener('mousedown', () => { this.switchMouseDown = true });

    document.body.addEventListener('click', () => {
      this.switchMouseDown = false;
      this.setOpen(false);
    });

    this.setDisplay();
  }

  setAriaAttributes() {
    this.button.setAttribute('aria-haspopup', true);
    this.button.setAttribute('aria-expanded', false);
    this.button.setAttribute('aria-controls', this.itemsContainer.getAttribute('id'));

    this.itemsContainer.setAttribute('role', 'menu');
    this.items.forEach(item => item.setAttribute('role', 'menuitem'));
  }

  setDisplay() {
    this.link.classList.add('u-d-no');
    this.button.classList.remove('u-d-no');
    this.itemsContainer.classList.remove('u-d-no');
  }

  toggle() {
    this.setOpen(!this.isOpen);
  }

  setOpen(open) {
    this.button.setAttribute('aria-expanded', open);

    this.context.classList[open ? 'add' : 'remove']('language-switcher--open');
    this.items.forEach(item => item.setAttribute('tabindex', open ? 0 : -1));

    this.isOpen = open;
  }
}

export default function languageSelector() {
  const context = document.querySelector('.js-language-switcher');

  if (context) {
    return new LanguageSelector(context);
  }
}

domReady(languageSelector);
