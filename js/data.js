'use strict';

(function () {
  var loadUrl = 'https://js.dump.academy/kekstagram/data';
  var picturesTemplate = document.querySelector('#picture').content;
  var picturesList = document.querySelector('.pictures');
  var filterSection = document.querySelector('.img-filters');

  function getPicture(image) {
    var picturesElement = picturesTemplate.cloneNode(true);
    picturesElement.querySelector('.picture__img').src = image.url;
    picturesElement.querySelector('.picture__likes').textContent = image.likes;
    picturesElement.querySelector('.picture__comments').textContent = image.comments.length;
    return picturesElement;
  }

  function renderDataList(arrayPictures) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < arrayPictures.length; i++) {
      fragment.appendChild(getPicture(arrayPictures[i]));
    }
    return picturesList.appendChild(fragment);
  }

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
    window.pictures = data;
    renderDataList(window.pictures);
    window.preview.setBigPictureBehavior(window.pictures);
    filterSection.classList.remove('img-filters--inactive');
  };

  window.backend.load(loadUrl, successHandler, errorHandler);

  window.data = {
    renderDataList: renderDataList,
    picturesList: picturesList,
  };
})();
