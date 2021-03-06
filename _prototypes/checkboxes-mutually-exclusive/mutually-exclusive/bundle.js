(function(context) {
  const namespace = context.NAMESPACE = (context.NAMESPACE || {});

  namespace.CheckboxGroup = function(opts) {
    opts = opts || {};

    if (!opts.name) {
      throw Error('Checkbox group name required');
    }

    let nameGroup = opts.name,
      mutullyExclusiveGroupsByValue = opts.mutullyExclusiveGroupsByValue;

    function getSelectedMutullyExclusiveGroupIndexForCheckbox($checkBox) {
      let index;

      $.each(mutullyExclusiveGroupsByValue, function (i, relatedGroup) {
        let found = relatedGroup.indexOf($checkBox.val());

        if (found !== -1) {
          index = i;
        }
      });

      return index;
    }

    $('input:checkbox[name=' + nameGroup + ']').on('change', function(e) {
      let $otherCheckboxes = $('input:checkbox[name=' + nameGroup + ']:checked').not(this),
        selectedGroupIndex = getSelectedMutullyExclusiveGroupIndexForCheckbox($(this));

      $(this).attr('aria-checked', true);

      if (selectedGroupIndex === undefined) {
        console.log('Checkbox not found in group: ', $(this));
      }
      else {
      $('#input-alert').text("");
        $otherCheckboxes.each(function(i, checkboxEl) {
          setTimeout(function () {
            let $checkBox = $(checkboxEl),
              groupIndex = getSelectedMutullyExclusiveGroupIndexForCheckbox($checkBox);

            if (groupIndex !== selectedGroupIndex) {
              $checkBox.attr('checked', false);
              $checkBox.attr('aria-checked', false);
              $checkBox.parent().removeClass('is-checked');
              $('#input-alert').append(checkboxEl.value + " deselected. ");
            }
          }, 0);
        });
      }
    });
  }
}(window));
