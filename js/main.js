
'use strict';

var constant = {
  NUMBERS_OBJECTS: 25,
  MESSAGES: [
    'Всё отлично!',
    'В целом всё неплохо. Но не всё.',
    'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
    'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
    'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
    'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!',
  ],
  USER_NAMES: ['Стас', 'Фёкла', 'Василий', 'Ашот', 'Лиза', 'Алексей'],
};

var dataRandomConfiguration = {
  LIKES: {
    MIN: 15,
    MAX: 200,
  },
  AVATARS_COUNT: {
    MIN: 1,
    MAX: 6,
  },
};

var pageBody = document.querySelector('body');
var picturesTemplate = pageBody.querySelector('#picture').content; // Ищем шаблон который мы будем копировать.
// var socialCommentTemplate = pageBody.querySelector('.social__comments');
var socialComment = pageBody.querySelector('.social__comment');
// var bigPicture = pageBody.querySelector('.big-picture');

// Генерация и отрисовка картинок при загрузке страницы (3.6)

function generateMessages(minAvatarsCount, maxAvatarsCount) {
  var messages = [];

  var countComments = getRandomNumber(minAvatarsCount, maxAvatarsCount - 1);

  for (var j = 0; j < countComments; j++) {
    messages.push({
      avatar: generateSrcImage(minAvatarsCount, maxAvatarsCount),
      name: getRandomElement(constant.USER_NAMES),
      message: getRandomElement(constant.MESSAGES),
    });
  }
  return messages;
}

function generateSrcImage(min, max) {
  return 'img/avatar-' + getRandomNumber(min, max) + '.svg';
}

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomElement(array) {
  var randomIndex = getRandomNumber(1, array.length - 1);
  var randomElement = array[randomIndex];
  return randomElement;
}

function generateData(objectsCount) {
  var data = [];
  for (var i = 1; i < objectsCount + 1; i++) {
    data.push({
      url: 'photos/' + i + '.jpg',
      likes: getRandomNumber(dataRandomConfiguration.LIKES.MIN, dataRandomConfiguration.LIKES.MAX),
      messages: generateMessages(dataRandomConfiguration.AVATARS_COUNT.MIN, dataRandomConfiguration.AVATARS_COUNT.MAX),
      description: getRandomElement(constant.MESSAGES),
    });
  }
  return data;
}

function getPicture(image) {
  var picturesElement = picturesTemplate.cloneNode(true);

  picturesElement.querySelector('.picture__img').src = image.url;
  picturesElement.querySelector('.picture__likes').textContent = image.likes;
  picturesElement.querySelector('.picture__comments').textContent = image.messages.length;
  return picturesElement;
}

function renderDataList(arrayPictures) {
  var picturesList = document.querySelector('.pictures');
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < arrayPictures.length; i++) {
    fragment.appendChild(getPicture(arrayPictures[i]));
  }
  return picturesList.appendChild(fragment);
}

// function getCommentElement(element) {
//   var commentItemCopy = socialComment.cloneNode(true);
//   var socialCommentImg = commentItemCopy.querySelector('img');
//   var socialText = commentItemCopy.querySelector('.social__text');
//   socialCommentImg.src = element.avatar;
//   socialCommentImg.alt = element.name;
//   socialText.textContent = element.message;
//
//   return commentItemCopy;
// }

// Генерация и отрисовка попапа с большим изображением при загрузке страницы: (3.7)

// function showNewComments(element) {
//   var commentsCount = bigPicture.querySelector('.comments-count');
//
//   commentsCount.textContent = element.messages.length;
//   var fragment = document.createDocumentFragment();
//   for (var i = 0; i < element.messages.length; i++) {
//     fragment.appendChild(getCommentElement(element.messages[i]));
//   }
//   socialCommentTemplate.innerHTML = '';
//   socialCommentTemplate.appendChild(fragment);
// }

// function showBigPicture(element) {
//   var bigPictureImg = bigPicture.querySelector('img');
//   var likesCount = bigPicture.querySelector('.likes-count');
//   var socialCaption = pageBody.querySelector('.social__caption');
//   var socialCommentCount = pageBody.querySelector('.social__comment-count');
//   var commentsLoader = pageBody.querySelector('.comments-loader');
//
//
//   bigPictureImg.src = element.url;
//   likesCount.textContent = element.likes;
//   showNewComments(element);
//   socialCaption.textContent = element.description;
//   socialCommentCount.classList.add('hidden');
//   commentsLoader.classList.add('hidden');
//
//   bigPicture.classList.remove('hidden');
//   pageBody.classList.add('modal-open');
// }

var data = generateData(constant.NUMBERS_OBJECTS);
renderDataList(data);

// showBigPicture(data[1);

// 4.9.

var KEY_CODE = {
  ESC: 27,
  SPACE: 32
};

var MIN_SCALE = 25;
var MAX_SCALE = 100;
var SCALE_STEP = 25;
var FILTER_EFFECTS = {
  none: '',
  chrome: 'effects__preview--chrome',
  sepia: 'effects__preview--sepia',
  marvin: 'effects__preview--marvin',
  phobos: 'effects__preview--phobos',
  heat: 'effects__preview--heat',
};
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

var DEFAULT_VALUE = 100;
var hashTagsLength = 5;
var hashTagsLengthIndex = 20;
var uploadFileArea = document.getElementById('upload-file');
var imageEditorForm = document.querySelector('.img-upload__overlay');
var imageBlock = document.querySelector('.img-upload__preview');
var imagePreview = imageBlock.children[0];
var elementPopupClose = document.getElementById('upload-cancel');
var scaleDownButton = document.querySelector('.scale__control--smaller');
var scaleUpButton = document.querySelector('.scale__control--bigger');
var effectLevelLine = document.querySelector('.effect-level__line');
var pinElement = document.querySelector('.effect-level__pin');
// var effectLevel = document.querySelector('effect-level')
var depthEffectLine = document.querySelector('.effect-level__depth');
var effectLevelValue = document.querySelector('.effect-level__value');
var hashTagsInput = document.querySelector('.text__hashtags');

var currentScaleValue = DEFAULT_VALUE;
var currentEffectLevel = DEFAULT_VALUE;
var selectedFilter = null;
var levelLineWidth = 0;
var levelPinCoordinates = null;
var levelLineCoordinates = null;
var startPosition = null;
var effectLevelBlock = document.querySelector('.effect-level');

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
  } else if (hashTags[i].length > hashTagsLengthIndex) {
    message = 'Максимальная длина одного хэш-тега 20 символов';
  }
  return message;
};

var addValidationHashTags = function () {
  var hashTags = hashTagsInput.value
    .split(' ')
    .map(function (hashTag) {
      return hashTag.toLowerCase();
    });
  var message = '';

  if (hashTags.length === 0) {
    message = '';
  } else if (hashTags.length === hashTagsLength) {
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

hashTagsInput.addEventListener('input', function () {
  addValidationHashTags();
});

function showElement(element) {
  element.classList.remove('hidden');
}

function hideElement(element) {
  element.classList.add('hidden');
}

var openImageEditorPopup = function (imageEditor, closingKeyCode) {
  showElement(imageEditor);
  document.addEventListener('keydown', function (evt) {
    closeOnPressKey(evt, imageEditor, closingKeyCode);
  });
};

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

var setFilterVisible = function (isVisible) {
  if (isVisible) {
    showElement(effectLevelBlock);
    resetFilterDuration();
  } else {
    hideElement(effectLevelBlock);
  }
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

var renderScaledImage = function (value) {
  var scaleValueElement = document.querySelector('.scale__control--value');
  var image = document.querySelector('.img-upload__preview');
  scaleValueElement.value = value + '%';
  image.style.transform = 'scale(' + value / 100 + ')';
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

var getElementCoordinates = function (elem) {
  var box = elem.getBoundingClientRect();

  return {
    top: box.top + pageYOffset,
    left: box.left + pageXOffset,
  };
};

var getPercentsByCoordinates = function (total, current) {
  return Math.round(100 / total * current);
};

var onSliderMouseDown = function (evt) {
  levelPinCoordinates = getElementCoordinates(pinElement);
  levelLineCoordinates = getElementCoordinates(effectLevelLine);
  startPosition = evt.pageX - levelPinCoordinates.left;

  document.addEventListener('mousemove', onSliderMouseMove);
  document.addEventListener('mouseup', onSliderMouseUp);
  return false;
};

var onSliderMouseUp = function () {
  document.removeEventListener('mousemove', onSliderMouseMove);
  document.removeEventListener('mouseup', onSliderMouseUp);
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


uploadFileArea.addEventListener('change', function () {
  openImageEditorPopup(imageEditorForm, KEY_CODE.ESC);
});

elementPopupClose.addEventListener('click', function () {
  closeImageEditorPopup(imageEditorForm, KEY_CODE.ESC);
});
elementPopupClose.addEventListener('keydown', function (evt) {
  if (evt.keyCode === KEY_CODE.SPACE) {
    closeImageEditorPopup(imageEditorForm, KEY_CODE.ESC);
  }
});

scaleDownButton.addEventListener('click', function () {
  if (currentScaleValue > MIN_SCALE) {
    onZoomOut(currentScaleValue, SCALE_STEP);
    currentScaleValue -= SCALE_STEP;
  }
});

scaleDownButton.addEventListener('keydown', function (evt) {
  if (evt.keyCode === KEY_CODE.SPACE && currentScaleValue > MIN_SCALE) {
    onZoomOut(currentScaleValue, SCALE_STEP);
    currentScaleValue -= SCALE_STEP;
  }
});

scaleUpButton.addEventListener('click', function () {
  if (currentScaleValue < MAX_SCALE) {
    onZoomIn(currentScaleValue, SCALE_STEP);
    currentScaleValue += SCALE_STEP;
  }
});

scaleUpButton.addEventListener('keydown', function (evt) {
  if (evt.keyCode === KEY_CODE.SPACE && currentScaleValue < MAX_SCALE) {
    onZoomIn(currentScaleValue, SCALE_STEP);
    currentScaleValue += SCALE_STEP;
  }
});

pinElement.addEventListener('mousedown', onSliderMouseDown);

// Блокирует нативный браузерный dragDrop
pinElement.addEventListener('dragstart', function () {
  return false;
});

scaleUpButton.addEventListener('keydown', function (evt) {
  if (evt.keyCode === KEY_CODE.SPACE && currentScaleValue < MAX_SCALE) {
    onZoomIn(currentScaleValue, SCALE_STEP);
    currentScaleValue += SCALE_STEP;
  }
});

setFilterPanelBehavior();
