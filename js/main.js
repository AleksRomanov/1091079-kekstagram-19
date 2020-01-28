'use strict';

var NUMBERS_OBJECTS = 25;
var MIN_LIKES = 15;
var MAX_LIKES = 200;
var MIN_COMMENTS = 1;
var MAX_COMMENTS = 8;
// var AVATARS_MAX = 6;
var DESCRIPTION_STRING = 1;

/* ------------------------------------------------------------------------------------------------------ */

var photosArray = [];

var COMMENTS = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!',
];

var MESSAGE = [
  'Тестим новую камеру!',
  'Затусили с друзьями на море',
  'Как же круто тут кормят',
  'Отдыхаем...',
  'Цените каждое мгновенье. Цените тех, кто рядом с вами и отгоняйте все сомненья. Не обижайте всех словами......',
  'Вот это тачка!',
];

/* ------------------------------------------------------------------------------------------------------ */
/* Функция генерации случайного числа */
var getRandomNumber = function (min, max) {
  return Math.round(Math.random() * (max - min) + min);
};
/* Создаем массив однотипных обьектов */
var getArrayOfPhoto = function (ObjectSample, count) {
  for (var i = 0; i < count; i++) {
    photosArray.push(new ObjectSample(i));
  }
  return photosArray;
};

/* ------------------------------------------------------------------------------------------------------ */

var getPhoto = function (k) {
  var photo = {};
  photo.url = 'photos/' + (k + 1) + '.jpg';
  photo.likes = getRandomNumber(MIN_LIKES, MAX_LIKES);
  var commentsUsers = getRandomNumber(MIN_COMMENTS, MAX_COMMENTS);
  // photo.comments = [];
  photo.comments = getRandomNumber(COMMENTS, commentsUsers);
  photo.description = getRandomNumber(MESSAGE, DESCRIPTION_STRING);

  return photo;
};

/* ------------------------------------------------------------------------------------------------------ */


var photoList = document.querySelector('.pictures');
var photoTemplate = document.querySelector('#picture').content.querySelector('.picture__link');

var createPhotoElements = function (photoObject) {
  var photoElement = photoTemplate.cloneNode(true);
  photoElement.querySelector('.picture__img').src = photoObject.url;
  photoElement.querySelector('.picture__likes').textContent = photoObject.likes;
  photoElement.querySelector('.picture__comments').textContent = photoObject.comments;

  return photoElement;
};

var photosFragment = document.createDocumentFragment();

for (var i = 0; i < photosArray.length; i++) {
  photosFragment.appendChild(createPhotoElements(photosArray[i]));
}

document.querySelector('.pictures').appendChild(photosFragment);


/* ------------------------------------------------------------------------------------------------------ */

var readyPhotos = getArrayOfPhoto(getPhoto, photoList, createPhotoElements, NUMBERS_OBJECTS);
photosFragment(readyPhotos, photoList);
