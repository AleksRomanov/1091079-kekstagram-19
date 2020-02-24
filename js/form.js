'use strict';

(function () {
  var DEFAULT_VALUE = 100;
  var HASH_TAGS_LENGTH = 5;
  var HASH_TAGS_LENGTH_INDEX = 20;
  var FILTER_STYLES = {
    none: '',
    chrome: {
      name: 'grayscale',
      max: 1,
      type: '',
    },
    sepia: {
      name: 'sepia',
      max: 1,
      type: '',
    },
    marvin: {
      name: 'invert',
      max: 100,
      type: '%',
    },
    phobos: {
      name: 'blur',
      max: 3,
      type: 'px',
    },
    heat: {
      name: 'brightness',
      max: 3,
      type: '',
    },
  };

  var SCALE = {
    MIN: 25,
    MAX: 100,
    STEP: 25,
  };

  var KEY_CODE = {
    ESC: 27,
    SPACE: 32,
  };
  var FILTER_EFFECTS = {
    none: '',
    chrome: 'effects__preview--chrome',
    sepia: 'effects__preview--sepia',
    marvin: 'effects__preview--marvin',
    phobos: 'effects__preview--phobos',
    heat: 'effects__preview--heat',
  };
  var pageBody = document.querySelector('body');
  var selectedFilter = null;
  var currentEffectLevel = DEFAULT_VALUE;
  var imageBlock = pageBody.querySelector('.img-upload__preview');
  var imagePreview = imageBlock.children[0];
  var effectLevelBlock = pageBody.querySelector('.effect-level');
  var effectLevelValue = pageBody.querySelector('.effect-level__value');
  var depthEffectLine = pageBody.querySelector('.effect-level__depth');
  var pinElement = pageBody.querySelector('.effect-level__pin');
  var startPosition = null;
  var levelPinCoordinates = null;
  var levelLineCoordinates = null;
  var effectLevelLine = pageBody.querySelector('.effect-level__line');
  var levelLineWidth = 0;
  var currentScaleValue = DEFAULT_VALUE;
  var uploadFileArea = pageBody.querySelector('#upload-file');
  var scaleUpButton = pageBody.querySelector('.scale__control--bigger');
  var scaleDownButton = pageBody.querySelector('.scale__control--smaller');
  var imageEditorForm = pageBody.querySelector('.img-upload__overlay');
  var elementPopupClose = pageBody.querySelector('#upload-cancel');
  var hashTagsInput = pageBody.querySelector('.text__hashtags');

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
    } else if (hashTags[i].indexOf('#', 1) > 0) {
      message = 'Хеш-теги должны разделяться пробелами';
    } else if (hashTags.indexOf(hashTags[i], i + 1) > 0) {
      message = 'Один и тот же хэш-тег не может быть использован дважды';
    } else if (hashTags[i].length > HASH_TAGS_LENGTH_INDEX) {
      message = 'Максимальная длина одного хэш-тега 20 символов';
    }
    return message;
  };

  var openImageEditorPopup = function (imageEditor, closingKeyCode) {
    showElement(imageEditor);
    document.addEventListener('keydown', function (evt) {
      closeOnPressKey(evt, imageEditor, closingKeyCode);
    });
  };

  elementPopupClose.addEventListener('click', function () {
    closeImageEditorPopup(imageEditorForm, KEY_CODE.ESC);
  });

  elementPopupClose.addEventListener('keydown', function (evt) {
    if (evt.keyCode === KEY_CODE.SPACE) {
      closeImageEditorPopup(imageEditorForm, KEY_CODE.ESC);
    }
  });

  var closeOnPressKey = function (evt, imageEditor, closingKeyCode) {
    if (evt.keyCode === closingKeyCode) {
      closeImageEditorPopup(imageEditor, closingKeyCode);
    }
  };

  var closeImageEditorPopup = function (imageEditor, closingKeyCode) {
    hideElement(imageEditor);
    document.removeEventListener('keydown', function (evt) {
      closeOnPressKey(evt, imageEditor, closingKeyCode);
    });
    resetFilters();
    clearForm();
  };

  var clearForm = function () {
    uploadFileArea.value = '';
  };

  var onZoomOut = function (value, scaleStep) {
    value -= scaleStep;
    renderScaledImage(value);
  };

  var onZoomIn = function (value, scaleStep) {
    value += scaleStep;
    renderScaledImage(value);
  };

  scaleDownButton.addEventListener('click', function () {
    if (currentScaleValue > SCALE.MIN) {
      onZoomOut(currentScaleValue, SCALE.STEP);
      currentScaleValue -= SCALE.STEP;
    }
  });

  scaleDownButton.addEventListener('keydown', function (evt) {
    if (evt.keyCode === KEY_CODE.SPACE && currentScaleValue > SCALE.MIN) {
      onZoomOut(currentScaleValue, SCALE.STEP);
      currentScaleValue -= SCALE.STEP;
    }
  });

  scaleUpButton.addEventListener('click', function () {
    if (currentScaleValue < SCALE.MAX) {
      onZoomIn(currentScaleValue, SCALE.STEP);
      currentScaleValue += SCALE.STEP;
    }
  });

  scaleUpButton.addEventListener('keydown', function (evt) {
    if (evt.keyCode === KEY_CODE.SPACE && currentScaleValue < SCALE.MAX) {
      onZoomIn(currentScaleValue, SCALE.STEP);
      currentScaleValue += SCALE.STEP;
    }
  });

  scaleUpButton.addEventListener('keydown', function (evt) {
    if (evt.keyCode === KEY_CODE.SPACE && currentScaleValue < SCALE.MAX) {
      onZoomIn(currentScaleValue, SCALE.STEP);
      currentScaleValue += SCALE.STEP;
    }
  });

  var onSliderMouseUp = function () {
    document.removeEventListener('mousemove', onSliderMouseMove);
    document.removeEventListener('mouseup', onSliderMouseUp);
  };

  var getPercentsByCoordinates = function (total, current) {
    return Math.round(100 / total * current);
  };

  var onSliderMouseMove = function (evt) {
    var newPosition = evt.pageX - startPosition - levelLineCoordinates.left;

    if (newPosition < 0) {
      newPosition = 0;
    } else if (newPosition > levelLineWidth) {
      newPosition = levelLineWidth;
    }

    pinElement.style.left = newPosition + 'px';
    currentEffectLevel = getPercentsByCoordinates(levelLineWidth, newPosition);
    depthEffectLine.style.width = currentEffectLevel + '%';
    effectLevelValue.value = currentEffectLevel;
    renderFilteredImage(selectedFilter);
  };

  var renderScaledImage = function (value) {
    var scaleValueElement = document.querySelector('.scale__control--value');
    var image = document.querySelector('.img-upload__preview');
    scaleValueElement.value = value + '%';
    image.style.transform = 'scale(' + value / 100 + ')';
  };

  var resetFilters = function () {
    selectedFilter = null;
    imagePreview.className = '';
    currentScaleValue = DEFAULT_VALUE;
    currentEffectLevel = DEFAULT_VALUE;
    renderScaledImage(currentScaleValue);
    resetFilterDuration();
    renderFilteredImage(selectedFilter);
    setFilterVisible(false);
  };

  var resetFilterDuration = function () {
    levelLineWidth = effectLevelLine.offsetWidth;
    currentEffectLevel = DEFAULT_VALUE;
    pinElement.style.left = levelLineWidth + 'px';
    depthEffectLine.style.width = currentEffectLevel + '%';
    effectLevelValue.value = currentEffectLevel;
  };

  var renderFilteredImage = function (chosenFilter) {
    if (FILTER_STYLES[chosenFilter]) {
      var name = FILTER_STYLES[chosenFilter].name;
      var value = FILTER_STYLES[chosenFilter].max / 100 * currentEffectLevel;
      var type = FILTER_STYLES[chosenFilter].type;
      imagePreview.style.filter = name + '(' + value + type + ')';
    } else {
      imagePreview.style.filter = '';
    }
  };

  function showElement(element) {
    element.classList.remove('hidden');
  }

  function hideElement(element) {
    element.classList.add('hidden');
  }

  var setFilterVisible = function (isVisible) {
    if (isVisible) {
      showElement(effectLevelBlock);
      resetFilterDuration();
    } else {
      hideElement(effectLevelBlock);
    }
  };

  var onFilterChange = function (filter) {
    selectedFilter = filter.value;

    if (selectedFilter === 'none') {
      resetFilters();
      setFilterVisible(false);
    } else {
      setFilterVisible(true);
      renderFilteredImage(selectedFilter);
    }

    imagePreview.className = FILTER_EFFECTS[selectedFilter];
    currentEffectLevel = DEFAULT_VALUE;
  };

  var setFilterPanelBehavior = function () {
    setFilterVisible(false);
    var filtersRadioElements = document.querySelectorAll('.effects__radio');
    filtersRadioElements.forEach(function (filter) {
      filter.addEventListener('change', function () {
        onFilterChange(filter);
      });
    });
  };

  var getElementCoordinates = function (elem) {
    var box = elem.getBoundingClientRect();

    return {
      top: box.top + pageYOffset,
      left: box.left + pageXOffset,
    };
  };

  var onSliderMouseDown = function (evt) {
    levelPinCoordinates = getElementCoordinates(pinElement);
    levelLineCoordinates = getElementCoordinates(effectLevelLine);
    startPosition = evt.pageX - levelPinCoordinates.left;

    document.addEventListener('mousemove', onSliderMouseMove);
    document.addEventListener('mouseup', onSliderMouseUp);
    return false;
  };

  setFilterPanelBehavior();

  pinElement.addEventListener('mousedown', onSliderMouseDown);

  pinElement.addEventListener('dragstart', function () {
    return false;
  });

  hashTagsInput.addEventListener('input', function () {
    addValidationHashTags();
  });
  uploadFileArea.addEventListener('change', function () {
    openImageEditorPopup(imageEditorForm, KEY_CODE.ESC);
  });

  window.form = {
    pageBody: pageBody,
  };
})();

