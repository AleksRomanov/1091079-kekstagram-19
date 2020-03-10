'use strict';

(function () {
  var DEFAULT_VALUE = 100;
  var DEFAULT_ZERO = 0;

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

  var FILTER_EFFECTS = {
    none: '',
    chrome: 'effects__preview--chrome',
    sepia: 'effects__preview--sepia',
    marvin: 'effects__preview--marvin',
    phobos: 'effects__preview--phobos',
    heat: 'effects__preview--heat',
  };

  var selectedFilter = null;
  var currentEffectLevel = DEFAULT_VALUE;
  var imagePreview = window.form.imageUploadBlock.children[0];
  var effectLevelBlock = window.utils.pageBody.querySelector('.effect-level');
  var effectLevelValue = window.utils.pageBody.querySelector('.effect-level__value');
  var depthEffectLine = window.utils.pageBody.querySelector('.effect-level__depth');
  var pinElement = window.utils.pageBody.querySelector('.effect-level__pin');
  var startPosition = null;
  var levelPinCoordinates = null;
  var levelLineCoordinates = null;
  var effectLevelLine = window.utils.pageBody.querySelector('.effect-level__line');
  var levelLineWidth = 0;
  var currentScaleValue = DEFAULT_VALUE;
  var scaleUpButton = window.utils.pageBody.querySelector('.scale__control--bigger');
  var scaleDownButton = window.utils.pageBody.querySelector('.scale__control--smaller');


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
    if (evt.keyCode === window.utils.KEY_CODE.SPACE && currentScaleValue > SCALE.MIN) {
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
    if (evt.keyCode === window.utils.KEY_CODE.SPACE && currentScaleValue < SCALE.MAX) {
      onZoomIn(currentScaleValue, SCALE.STEP);
      currentScaleValue += SCALE.STEP;
    }
  });

  scaleUpButton.addEventListener('keydown', function (evt) {
    if (evt.keyCode === window.utils.KEY_CODE.SPACE && currentScaleValue < SCALE.MAX) {
      onZoomIn(currentScaleValue, SCALE.STEP);
      currentScaleValue += SCALE.STEP;
    }
  });

  var onSliderMouseUp = function () {
    document.removeEventListener('mousemove', onSliderMouseMove);
    document.removeEventListener('mouseup', onSliderMouseUp);
  };

  var getPercentsByCoordinates = function (total, current) {
    return Math.round(DEFAULT_VALUE / total * current);
  };

  var onSliderMouseMove = function (evt) {
    var newPosition = evt.pageX - startPosition - levelLineCoordinates.left;

    if (newPosition < DEFAULT_ZERO) {
      newPosition = DEFAULT_ZERO;
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
    image.style.transform = 'scale(' + value / DEFAULT_VALUE + ')';
  };

  var resetSettings = function () {
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
      var value = FILTER_STYLES[chosenFilter].max / DEFAULT_VALUE * currentEffectLevel;
      var type = FILTER_STYLES[chosenFilter].type;
      imagePreview.style.filter = name + '(' + value + type + ')';
    } else {
      imagePreview.style.filter = '';
    }
  };

  var setFilterVisible = function (isVisible) {
    if (isVisible) {
      window.utils.showElement(effectLevelBlock);
      resetFilterDuration();
    } else {
      window.utils.hideElement(effectLevelBlock);
    }
  };
  var onFilterChange = function (filter) {
    selectedFilter = filter.value;

    if (selectedFilter === 'none') {
      resetSettings();
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

  window.filters = {
    resetSettings: resetSettings,
    // showElement: showElement,
    // hideElement: hideElement,
  };
})();

