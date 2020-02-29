'use strict';

(function () {
  var picturesTemplate = document.querySelector('#picture').content;

  function getPicture(image) {
    var picturesElement = picturesTemplate.cloneNode(true);
    picturesElement.querySelector('.picture__img').src = image.url;
    picturesElement.querySelector('.picture__likes').textContent = image.likes;
    picturesElement.querySelector('.picture__comments').textContent = image.comments.length;
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

  var pictures = [];

  var errorHandler = function (errorMessage) {
    var errorBlock = document.createElement('div');
    errorBlock.style = 'z-index: 100; margin: 0 auto; text-align: center; background-color: red;';
    errorBlock.style.position = 'absolute';
    errorBlock.style.left = 0;
    errorBlock.style.right = 0;
    errorBlock.style.fontSize = '30px';
    errorBlock.style.height = '30px';
    errorBlock.style.borderBottom = '4px solid yellow';
    errorBlock.textContent = errorMessage;
    document.body.insertAdjacentElement('afterbegin', errorBlock);
  };

  var successHandler = function (data) {
    pictures = data;
    renderDataList(pictures);
    window.preview.setBigPictureBehavior(pictures);
  };

  window.backend.load(successHandler, errorHandler);

  window.data = {
    pictures: pictures,
  };
})();
