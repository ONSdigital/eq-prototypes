import domready from '../../../_js/modules/domready';

domready(() => {
  let previousURL;
  const pathName = window.location.pathname;
  const pageData = JSON.parse(sessionStorage.getItem('pageData'));

  if (pageData[pathName]) {
    previousURL = pageData[pathName];
  }

  if (previousURL) {
    const previousLinks = [...document.querySelectorAll('.js-previous-link')];

    previousLinks.forEach(link => {
      link.setAttribute('href', previousURL);
    });
  }
});
