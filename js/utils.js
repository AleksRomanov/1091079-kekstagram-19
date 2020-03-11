'use strict';

(function () {

  var KEY_CODE = {
    ESC: 27,
    SPACE: 32,
  };

  var pageBody = document.querySelector('body');

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
    KEY_CODE: KEY_CODE,
    isEscEvent: isEscEvent,
    showElement: showElement,
    hideElement: hideElement,
  };
})();
