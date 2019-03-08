export const modalTpl = () => `
  <div id="modal" class="modal" style="display: none;">
    <div class="modal__window">
        <h1 class="u-fs-l">Are you sure you want to remove <span
            class="js-person-name"></span>?</h1>
        <p class="u-mb-m">All of the data associated with this person will be
            deleted</p>

        <div class="modal__buttons btn-group">
            <div class="u-mb-xs">
                <button class="btn btn-group__btn btn--danger remove-member-button">
                    Yes, remove this person
                </button>
            </div>
            <div>
                <button class="btn btn-group__btn btn--secondary close-modal-button">
                    No, cancel this
                </button>
            </div>
        </div>
    </div>
</div>
`;

export const fieldErrorTpl = () => `
  <div id="field-error-template"
       class="panel panel--simple panel--error u-mb-s"
       data-qa="error"
       style="display:none;">
    <!--<div class="panel__header">
        <ul class="list list&#45;&#45;bare list&#45;&#45;errors">
            <li class="list__item u-fs-r&#45;&#45;b" data-ga-action="Enter an answer to continue." data-ga="error" data-ga-category="Error" data-ga-label="change-comment-question">Enter an answer to continue.</li>
        </ul>
    </div>-->
    <div class="panel__body" data-qa="error-body">
      <div class="js-transclude"></div>
    </div>
  </div>
`;
