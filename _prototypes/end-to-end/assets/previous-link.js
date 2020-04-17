import domready from '../../../_js/modules/domready';

domready(() => {
  let previousURL;
  const urlParams = new URLSearchParams(window.location.search);
  const personID = urlParams.get('person_id');

  const pathName = window.location.pathname;
  const pageData = JSON.parse(sessionStorage.getItem('pageData'));

  if (pageData[pathName]) {
    previousURL = pageData[pathName];
  }

  if (previousURL) {
    const previousLinks = [...document.querySelectorAll('.js-previous-link')];

    previousLinks.forEach(link => {
      link.setAttribute('href', previousURL + (personID ? '?person_id=' + personID : ''));
    });
  }
});
