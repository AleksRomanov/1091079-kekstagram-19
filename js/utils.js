'use strict';

(function () {

  var KEY_CODE = {
    ESC: 27,
    SPACE: 32,
  };

  var pageBody = document.querySelector('body');
  var closeOnPressKey = function (evt, imageEditor, closingKeyCode) {
    if (evt.keyCode === closingKeyCode) {
      window.form.closeImageEditorPopup(imageEditor, closingKeyCode);
    }
  };

  var isEscEvent = function (evt, action) {
    if (evt.keyCode === KEY_CODE.ESC) {
      action();
    }
  };

  function showElement(element) {
    element.classList.remove('hidden');
  }

  function hideElement(element) {
    element.classList.add('hidden');
  }

  window.utils = {
    pageBody: pageBody,
    closeOnPressKey: closeOnPressKey,
    KEY_CODE: KEY_CODE,
    isEscEvent: isEscEvent,
    showElement: showElement,
    hideElement: hideElement,
  };
})();
