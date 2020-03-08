'use strict';

(function () {
  var HASH_TAGS_LENGTH = 5;
  var HASH_TAGS_LENGTH_INDEX = 20;

  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

  var INVALID_STYLE = '0 0 3px 2px #FF0000';

  var saveUrl = 'https://js.dump.academy/kekstagram';
  var mainContainer = window.utils.pageBody.querySelector('main');
  var imageUploadBlock = window.utils.pageBody.querySelector('.img-upload__preview');
  var imgPreviewElement = imageUploadBlock.querySelector('img');
  var imageUploadForm = window.utils.pageBody.querySelector('.img-upload__form');
  var uploadFileArea = window.utils.pageBody.querySelector('#upload-file');
  var imageEditorPopup = window.utils.pageBody.querySelector('.img-upload__overlay');
  var elementPopupClose = window.utils.pageBody.querySelector('#upload-cancel');
  var hashTagsInput = window.utils.pageBody.querySelector('.text__hashtags');

  var addValidationHashTags = function () {
    var hashTags = hashTagsInput.value
      .split(' ')

      .filter(function (hashTag) {
        return hashTag !== '';
      })
      .map(function (hashTag) {
        return hashTag.toLowerCase();
      });

    var message = '';

    if (hashTags.length === 0) {
      message = '';
    } else if (hashTags.length > HASH_TAGS_LENGTH) {
      message = 'Нельзя указать больше пяти хэш-тегов';
    } else {
      for (var i = 0; i < hashTags.length; i++) {
        message = getValidationHashTagsErrorMessage(hashTags, i);
        if (message) {
          break;
        }
      }
    }

    hashTagsInput.setCustomValidity(message);
  };

  var getValidationHashTagsErrorMessage = function (hashTags, i) {
    var message = '';
    if (hashTags[i].charAt(0) === '') {
      message = '';
    } else if (hashTags[i].charAt(0) !== '#') {
      message = 'Хеш-теги должны начинаться с "#"';
    } else if (hashTags[i].length === 1) {
      message = 'Хеш-теги должны состоять хотя бы из одного символа';
    } else if (!hashTags[i].match(/^#[0-9a-zA-Zа-яА-Я]+$/)) {
      message = 'Строка после решётки должна состоять из букв и чисел.';
    } else if (hashTags[i].indexOf('#', 1) > 0) {
      message = 'Хеш-теги должны разделяться пробелами';
    } else if (hashTags.indexOf(hashTags[i], i + 1) > 0) {
      message = 'Один и тот же хэш-тег не может быть использован дважды';
    } else if (hashTags[i].length > HASH_TAGS_LENGTH_INDEX) {
      message = 'Максимальная длина одного хэш-тега 20 символов';
    }
    return message;
  };
  elementPopupClose.addEventListener('click', function () {
    closeImageEditorPopup(imageEditorPopup, window.utils.isEscEvent);
  });

  elementPopupClose.addEventListener('keydown', function (evt) {
    if (evt.keyCode === window.utils.KEY_CODE.SPACE) {
      closeImageEditorPopup(imageEditorPopup, window.utils.isEscEvent);
    }
  });

  var closeImageEditorPopup = function (imageEditor, closingKeyCode) {
    window.utils.hideElement(imageEditor);
    document.removeEventListener('keydown', function (evt) {
      window.utils.closeOnPressKey(evt, imageEditor, closingKeyCode);
    });
    window.filters.resetSettings();
    clearForm();
  };

  var openImageEditorPopup = function (imageEditor, closingKeyCode) {
    window.utils.showElement(imageEditor);
    document.addEventListener('keydown', function (evt) {
      window.utils.closeOnPressKey(evt, imageEditor, closingKeyCode);
    });
  };

  var clearForm = function () {
    uploadFileArea.value = '';
  };
  var showUploadStatusMessage = function (classNameMessage) {
    var messageTemplate = window.utils.pageBody.querySelector('#' + classNameMessage)
      .content.querySelector('.' + classNameMessage)
      .cloneNode(true);
    mainContainer.appendChild(messageTemplate);
  };
  var isClickOutside = function (evt, cssSelector) {
    var target = evt.target;
    var element = target.closest(cssSelector);

    return !element;
  };

  var onSuccessWindowOutsideCLick = function (evt) {
    if (isClickOutside(evt, '.success__inner')) {
      removeWindowSuccessUpload();
    }
    mainContainer.removeEventListener('click', onSuccessWindowOutsideCLick);
  };

  var removeWindowSuccessUpload = function () {
    var successMessage = window.utils.pageBody.querySelector('.success');

    successMessage.remove();

    mainContainer.removeEventListener('click', onSuccessWindowOutsideCLick);
    document.removeEventListener('keydown', onSuccessMessageEscPress);
  };

  var onSuccessMessageEscPress = function (evt) {
    var successMessage = window.utils.pageBody.querySelector('.success');
    window.utils.closeOnPressKey(evt, successMessage, window.utils.isEscEvent);
    window.utils.isEscEvent(evt, removeWindowSuccessUpload);
  };

  var onSuccess = function () {
    closeImageEditorPopup(imageEditorPopup, window.utils.isEscEvent);
    imageUploadForm.reset();
    showUploadStatusMessage('success');
    var successButton = window.utils.pageBody.querySelector('.success__button');
    mainContainer.addEventListener('click', onSuccessWindowOutsideCLick);
    successButton.addEventListener('click', removeWindowSuccessUpload);
    document.addEventListener('keydown', onSuccessMessageEscPress);
  };

  var onErrorWindowOutsideCLick = function (evt) {
    if (isClickOutside(evt, '.error__inner')) {
      removeWindowErrorUpload();
      imageUploadForm.reset();
      mainContainer.removeEventListener('click', onErrorWindowOutsideCLick);
    }

    mainContainer.removeEventListener('click', onErrorWindowOutsideCLick);
  };

  var removeWindowErrorUpload = function () {
    var errorMessage = document.querySelector('.error');

    errorMessage.remove();
    mainContainer.removeEventListener('click', onErrorWindowOutsideCLick);
    document.removeEventListener('keydown', onSuccessMessageEscPress);
  };

  var onErrorMessageEscPress = function (evt) {
    window.utils.isEscEvent(evt, removeWindowErrorUpload);
    imageUploadForm.reset();
  };

  var onError = function () {
    closeImageEditorPopup(imageEditorPopup, window.utils.isEscEvent);
    showUploadStatusMessage('error');
    var errorButton = document.querySelector('.error__button');
    var errorOverlay = document.querySelector('.error');

    mainContainer.addEventListener('click', onErrorWindowOutsideCLick);
    document.addEventListener('keydown', onErrorMessageEscPress);
    errorButton.addEventListener('click', function () {
      openImageEditorPopup(imageEditorPopup, window.utils.isEscEvent);
      errorOverlay.remove();
    });
  };
  hashTagsInput.addEventListener('input', function () {
    addValidationHashTags();
  });

  hashTagsInput.addEventListener('invalid', function (evt) {
    evt.target.style.boxShadow = INVALID_STYLE;
  });

  uploadFileArea.addEventListener('change', function (evt) {
    var fileName = evt.target.value.toLowerCase();
    var file = uploadFileArea.files[0];


    var fileFormatMatches = FILE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });

    if (!fileFormatMatches) {
      return false;
    } else {
      var reader = new FileReader();

      reader.addEventListener('load', function () {
        imgPreviewElement.src = reader.result;
      });

      reader.readAsDataURL(file);
    }
    openImageEditorPopup(imageEditorPopup, window.utils.isEscEvent);

    return true;
  });

  imageUploadForm.addEventListener('submit', function (evt) {
    evt.preventDefault();
    var data = new FormData(imageUploadForm);
    window.backend.save(saveUrl, data, onSuccess, onError);
  });

  window.form = {
    imageUploadBlock: imageUploadBlock,
    closeImageEditorPopup: closeImageEditorPopup,
  };
})();
