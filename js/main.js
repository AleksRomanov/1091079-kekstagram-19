'use strict';

var ObjectsData = {
  NUMBERS_OBJECTS: 25,
  MIN_LIKES: 15,
  MAX_LIKES: 200,
  MIN_AVATARS_COUNT: 1,
  MAX_AVATARS_COUNT: 6,
  MESSAGES: [
    'Всё отлично!',
    'В целом всё неплохо. Но не всё.',
    'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
    'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
    'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
    'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
  ],
  USER_NAMES: ['Стас', 'Фёкла', 'Василий', 'Ашот', 'Лиза', 'Алексей']
};

// Функция, возвращает массив объектов записей
function generateData() {
  var data = [];
  for (var i = 1; i < ObjectsData.NUMBERS_OBJECTS + 1; i++) {
    data.push({
      url: 'photos/' + i + '.jpg',
      likes: getRandomNumber(ObjectsData.MIN_LIKES, ObjectsData.MAX_LIKES),
      messages: generateMessages(),
      description: getRandomElement(ObjectsData.MESSAGES)
    });
  }
  return data;

  // Функция, возвращает массив объектов записей
  function generateMessages() {
    var messages = [];

    var countComments = getRandomNumber(ObjectsData.MIN_AVATARS_COUNT, ObjectsData.MAX_AVATARS_COUNT - 1);

    for (var j = 0; j < countComments; j++) {
      messages.push({
        avatar: generateSrcImage(ObjectsData.MIN_AVATARS_COUNT, ObjectsData.MAX_AVATARS_COUNT),
        name: getRandomElement(ObjectsData.USER_NAMES),
        message: getRandomElement(ObjectsData.MESSAGES)
      });
    }
    return messages;
  }
  // Функция, возвращает url аватара
  function generateSrcImage(min, max) {
    return 'img/avatar-' + getRandomNumber(min, max) + '.svg';
  }

  // Функция, возвращает случайное число в диапазоне
  function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // Функция, возвращает случайный элемемент массива
  function getRandomElement(array) {
    var randomIndex = getRandomNumber(1, array.length - 1);
    var randomElement = array[randomIndex];
    return randomElement;
  }
}

var listData = generateData();

// Галерея
// Клонируем фотографии
function renderDataList(arrayPictures) {
  var picturesList = document.querySelector('.pictures'); // Ищем элемент в который мы будем вставлять наши изображения
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < arrayPictures.length; i++) {
    fragment.appendChild(renderPicture(arrayPictures[i]));
  }
  picturesList.appendChild(fragment);

  // Генерируем наш шаблон в документ
  function renderPicture(image) {
    var picturesTemplate = document.querySelector('#picture').content; // Ищем шаблон который мы будем копировать.
    var picturesElement = picturesTemplate.cloneNode(true);

    picturesElement.querySelector('.picture__img').src = image.url;
    picturesElement.querySelector('.picture__likes').textContent = image.likes;
    picturesElement.querySelector('.picture__comments').textContent = image.messages.length;
    return picturesElement;
  }
}

renderDataList(listData);
