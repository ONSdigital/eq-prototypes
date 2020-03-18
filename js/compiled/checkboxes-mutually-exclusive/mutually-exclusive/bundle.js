(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

(function (context) {
  var namespace = context.NAMESPACE = context.NAMESPACE || {};

  namespace.CheckboxGroup = function (opts) {
    opts = opts || {};

    if (!opts.name) {
      throw Error('Checkbox group name required');
    }

    var nameGroup = opts.name,
        mutullyExclusiveGroupsByValue = opts.mutullyExclusiveGroupsByValue;

    function getSelectedMutullyExclusiveGroupIndexForCheckbox($checkBox) {
      var index = void 0;

      $.each(mutullyExclusiveGroupsByValue, function (i, relatedGroup) {
        var found = relatedGroup.indexOf($checkBox.val());

        if (found !== -1) {
          index = i;
        }
      });

      return index;
    }

    $('input:checkbox[name=' + nameGroup + ']').on('change', function (e) {
      var $otherCheckboxes = $('input:checkbox[name=' + nameGroup + ']:checked').not(this),
          selectedGroupIndex = getSelectedMutullyExclusiveGroupIndexForCheckbox($(this));

      $(this).attr('aria-checked', true);

      if (selectedGroupIndex === undefined) {
        console.log('Checkbox not found in group: ', $(this));
      } else {
        $('#input-alert').text("");
        $otherCheckboxes.each(function (i, checkboxEl) {
          setTimeout(function () {
            var $checkBox = $(checkboxEl),
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
  };
})(window);

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJfcHJvdG90eXBlcy9jaGVja2JveGVzLW11dHVhbGx5LWV4Y2x1c2l2ZS9tdXR1YWxseS1leGNsdXNpdmUvYnVuZGxlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiJ3VzZSBzdHJpY3QnO1xuXG4oZnVuY3Rpb24gKGNvbnRleHQpIHtcbiAgdmFyIG5hbWVzcGFjZSA9IGNvbnRleHQuTkFNRVNQQUNFID0gY29udGV4dC5OQU1FU1BBQ0UgfHwge307XG5cbiAgbmFtZXNwYWNlLkNoZWNrYm94R3JvdXAgPSBmdW5jdGlvbiAob3B0cykge1xuICAgIG9wdHMgPSBvcHRzIHx8IHt9O1xuXG4gICAgaWYgKCFvcHRzLm5hbWUpIHtcbiAgICAgIHRocm93IEVycm9yKCdDaGVja2JveCBncm91cCBuYW1lIHJlcXVpcmVkJyk7XG4gICAgfVxuXG4gICAgdmFyIG5hbWVHcm91cCA9IG9wdHMubmFtZSxcbiAgICAgICAgbXV0dWxseUV4Y2x1c2l2ZUdyb3Vwc0J5VmFsdWUgPSBvcHRzLm11dHVsbHlFeGNsdXNpdmVHcm91cHNCeVZhbHVlO1xuXG4gICAgZnVuY3Rpb24gZ2V0U2VsZWN0ZWRNdXR1bGx5RXhjbHVzaXZlR3JvdXBJbmRleEZvckNoZWNrYm94KCRjaGVja0JveCkge1xuICAgICAgdmFyIGluZGV4ID0gdm9pZCAwO1xuXG4gICAgICAkLmVhY2gobXV0dWxseUV4Y2x1c2l2ZUdyb3Vwc0J5VmFsdWUsIGZ1bmN0aW9uIChpLCByZWxhdGVkR3JvdXApIHtcbiAgICAgICAgdmFyIGZvdW5kID0gcmVsYXRlZEdyb3VwLmluZGV4T2YoJGNoZWNrQm94LnZhbCgpKTtcblxuICAgICAgICBpZiAoZm91bmQgIT09IC0xKSB7XG4gICAgICAgICAgaW5kZXggPSBpO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgcmV0dXJuIGluZGV4O1xuICAgIH1cblxuICAgICQoJ2lucHV0OmNoZWNrYm94W25hbWU9JyArIG5hbWVHcm91cCArICddJykub24oJ2NoYW5nZScsIGZ1bmN0aW9uIChlKSB7XG4gICAgICB2YXIgJG90aGVyQ2hlY2tib3hlcyA9ICQoJ2lucHV0OmNoZWNrYm94W25hbWU9JyArIG5hbWVHcm91cCArICddOmNoZWNrZWQnKS5ub3QodGhpcyksXG4gICAgICAgICAgc2VsZWN0ZWRHcm91cEluZGV4ID0gZ2V0U2VsZWN0ZWRNdXR1bGx5RXhjbHVzaXZlR3JvdXBJbmRleEZvckNoZWNrYm94KCQodGhpcykpO1xuXG4gICAgICAkKHRoaXMpLmF0dHIoJ2FyaWEtY2hlY2tlZCcsIHRydWUpO1xuXG4gICAgICBpZiAoc2VsZWN0ZWRHcm91cEluZGV4ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ0NoZWNrYm94IG5vdCBmb3VuZCBpbiBncm91cDogJywgJCh0aGlzKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAkKCcjaW5wdXQtYWxlcnQnKS50ZXh0KFwiXCIpO1xuICAgICAgICAkb3RoZXJDaGVja2JveGVzLmVhY2goZnVuY3Rpb24gKGksIGNoZWNrYm94RWwpIHtcbiAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciAkY2hlY2tCb3ggPSAkKGNoZWNrYm94RWwpLFxuICAgICAgICAgICAgICAgIGdyb3VwSW5kZXggPSBnZXRTZWxlY3RlZE11dHVsbHlFeGNsdXNpdmVHcm91cEluZGV4Rm9yQ2hlY2tib3goJGNoZWNrQm94KTtcblxuICAgICAgICAgICAgaWYgKGdyb3VwSW5kZXggIT09IHNlbGVjdGVkR3JvdXBJbmRleCkge1xuICAgICAgICAgICAgICAkY2hlY2tCb3guYXR0cignY2hlY2tlZCcsIGZhbHNlKTtcbiAgICAgICAgICAgICAgJGNoZWNrQm94LmF0dHIoJ2FyaWEtY2hlY2tlZCcsIGZhbHNlKTtcbiAgICAgICAgICAgICAgJGNoZWNrQm94LnBhcmVudCgpLnJlbW92ZUNsYXNzKCdpcy1jaGVja2VkJyk7XG4gICAgICAgICAgICAgICQoJyNpbnB1dC1hbGVydCcpLmFwcGVuZChjaGVja2JveEVsLnZhbHVlICsgXCIgZGVzZWxlY3RlZC4gXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sIDApO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcbn0pKHdpbmRvdyk7XG4iXX0=
