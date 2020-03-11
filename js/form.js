'use strict';

(function () {
  var HASH_TAGS_LENGTH = 5;
  var HASH_TAGS_LENGTH_INDEX = 20;

  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

  var INVALID_STYLE = '0 0 3px 2px #FF0000';

  var SAVE_URL = 'https://js.dump.academy/kekstagram';
  var mainContainer = window.utils.pageBody.querySelector('main');
  var imageUploadBlock = window.utils.pageBody.querySelector('.img-upload__preview');
  var imgPreviewElement = imageUploadBlock.querySelector('img');
  var imageUploadForm = window.utils.pageBody.querySelector('.img-upload__form');
  var uploadFileArea = window.utils.pageBody.querySelector('#upload-file');
  var imageEditorPopup = window.utils.pageBody.querySelector('.img-upload__overlay');
  var elementPopupClose = window.utils.pageBody.querySelector('#upload-cancel');
  var hashTagsInput = window.utils.pageBody.querySelector('.text__hashtags');


  function closeImageEditor() {
    window.utils.hideElement(imageEditorPopup);
    imageUploadForm.reset();
    window.filters.resetSettings();
    clearUploadFileData();
    document.removeEventListener('keydown', onImageEditorEscPress);
  }

  function onImageEditorEscPress(evt) {
    window.utils.isEscEvent(evt, closeImageEditor);
  }

  function openImageEditorPopup() {
    window.utils.showElement(imageEditorPopup);
    document.addEventListener('keydown', onImageEditorEscPress);
    elementPopupClose.addEventListener('click', function () {
      window.utils.hideElement(imageEditorPopup);
    });
  }

  function clearUploadFileData() {
    uploadFileArea.value = '';
  }

  function showUploadStatusMessage(classNameMessage) {
    var messageTemplate = window.utils.pageBody.querySelector('#' + classNameMessage)
      .content.querySelector('.' + classNameMessage)
      .cloneNode(true);
    mainContainer.appendChild(messageTemplate);
  }

  var isClickOutside = function (evt, cssSelector) {
    var target = evt.target;
    var element = target.closest(cssSelector);

    return !element;
  };

  function onSuccessWindowOutsideCLick(evt) {
    if (isClickOutside(evt, '.success__inner')) {
      removeWindowSuccessUpload();
    }
    mainContainer.removeEventListener('click', onSuccessWindowOutsideCLick);
  }

  function removeWindowSuccessUpload() {
    var successMessage = window.utils.pageBody.querySelector('.success');

    successMessage.remove();

    mainContainer.removeEventListener('click', onSuccessWindowOutsideCLick);
    document.removeEventListener('keydown', onSuccessMessageEscPress);
  }

  function onSuccessMessageEscPress(evt) {
    window.utils.isEscEvent(evt, removeWindowSuccessUpload);
  }


  function addValidationHashTags() {
    var hashTags = [];
    hashTagsInput.value
      .split(' ')
      .forEach(function (hashTag) {
        if (hashTag !== '') {
          hashTags.push(hashTag.toLowerCase());
        }
      });

    var message = '';

    if (hashTags.length === 0) {
      message = '';
    } else if (hashTags.length > HASH_TAGS_LENGTH) {
      message = 'Нельзя указать больше пяти хэш-тегов';
    } else {

      hashTags.forEach(function (tag, index) {
        message = getValidationHashTagsErrorMessage(hashTags, index);
        return !!message;
      });
    }
    hashTagsInput.setCustomValidity(message);
  }

  function getValidationHashTagsErrorMessage(hashTags, i) {
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
  }

  function onSuccess() {
    closeImageEditor();
    imageUploadForm.reset();
    showUploadStatusMessage('success');
    var successButton = window.utils.pageBody.querySelector('.success__button');
    mainContainer.addEventListener('click', onSuccessWindowOutsideCLick);
    successButton.addEventListener('click', removeWindowSuccessUpload);
    document.addEventListener('keydown', onSuccessMessageEscPress);
  }

  function onErrorWindowOutsideCLick(evt) {
    if (isClickOutside(evt, '.error__inner')) {
      removeWindowErrorUpload();
      imageUploadForm.reset();
      mainContainer.removeEventListener('click', onErrorWindowOutsideCLick);
    }

    mainContainer.removeEventListener('click', onErrorWindowOutsideCLick);
  }

  function removeWindowErrorUpload() {
    var errorMessage = document.querySelector('.error');

    errorMessage.remove();
    mainContainer.removeEventListener('click', onErrorWindowOutsideCLick);
    document.removeEventListener('keydown', onSuccessMessageEscPress);
  }

  function onErrorMessageEscPress(evt) {
    window.utils.isEscEvent(evt, removeWindowErrorUpload);
    imageUploadForm.reset();
  }

  function onError() {
    window.utils.hideElement(imageEditorPopup);
    showUploadStatusMessage('error');
    var errorButton = document.querySelector('.error__button');
    var errorOverlay = document.querySelector('.error');

    mainContainer.addEventListener('click', onErrorWindowOutsideCLick);
    document.addEventListener('keydown', onErrorMessageEscPress);
    errorButton.addEventListener('click', function () {
      openImageEditorPopup();
      errorOverlay.remove();
    });
  }


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

    openImageEditorPopup();

    return true;
  });

  hashTagsInput.addEventListener('input', function () {
    addValidationHashTags();
  });

  hashTagsInput.addEventListener('invalid', function (evt) {
    evt.target.style.boxShadow = INVALID_STYLE;
  });

  imageUploadForm.addEventListener('submit', function (evt) {
    evt.preventDefault();
    var data = new FormData(imageUploadForm);
    window.backend.save(SAVE_URL, data, onSuccess, onError);
  });

  window.form = {
    imageUploadBlock: imageUploadBlock,
  };
})();
