'use strict';

(function () {
  var loadUrl = 'https://js.dump.academy/kekstagram/data';
  var picturesTemplate = document.querySelector('#picture').content;
  var picturesList = document.querySelector('.pictures');


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

  // var successHandler = function (data) {
  //   pictures = data;
  //   renderDataList(pictures);
  //   window.preview.setBigPictureBehavior(pictures);
  // };

  var successHandler = function (data) {
    var filters = document.querySelector('.img-filters');

    pictures = data;
    renderDataList(pictures);
    window.preview.setBigPictureBehavior(pictures);
    filters.classList.remove('img-filters--inactive');
    setSortingButtonsBehavior();
    picturesList.addEventListener('click', onPicturesClick);
    // renderDataList.picturesList.addEventListener('click', onPicturesClick);
  };

  var onPicturesClick = function (evt) {
    var target = evt.target;
    var pictureElement = target.closest('.picture');

    if (!pictureElement) {
      return;
    }

    var imageElement = pictureElement.querySelector('.picture__img');
    var imageSrc = imageElement.getAttribute('src');
    var imageData = getPictureData(imageSrc);

    window.picture.showBigPicture(imageData);
  };

  var getPictureData = function (imageSrc) {
    var pictureIndex = pictures.map(function (picture) {
      return picture.url;
    }).indexOf(imageSrc);

    return pictures[pictureIndex];
  };

  var setSortingButtonsBehavior = function () {
    var sortingButtons = document.querySelectorAll('.img-filters__button');
    var sortingActiveAttribute = 'img-filters__button--active';

    var sortTypes = {
      'filter-popular': pictures,
      'filter-new': getImagesForSortingNew(),
      'filter-discussed': getImagesForSortingDiscussed(),
    };

    sortingButtons.forEach(function (button) {
      button.addEventListener('click', function (evt) {
        sortingButtons.forEach(function (btn) {
          btn.classList.remove(sortingActiveAttribute);
        });
        evt.target.classList.add(sortingActiveAttribute);

        sortAndRenderImages(sortTypes[evt.target.id]);
      });
    });
  };

  var renderImages = function (images) {
    var fragment = document.createDocumentFragment();

    document.querySelectorAll('.picture').forEach(function (item) {
      item.remove();
    });
    images.forEach(function (item) {
      fragment.appendChild(renderDataList(item));
    });
    picturesList.appendChild(fragment);
  };

  var getImagesForSortingNew = function () {
    return pictures.slice().sort(compareRandom).slice(0, 9);
  };

  var compareRandom = function () {
    return Math.random() - 0.5;
  };

  var getImagesForSortingDiscussed = function () {
    return pictures.slice().sort(function (value1, value2) {
      return value2.comments.length - value1.comments.length;
    });
  };

  var sortAndRenderImages = window.debfunction.debounce(function (sortedArr) {
    renderDataList(sortedArr);
  });

  window.backend.load(loadUrl, successHandler, errorHandler);

  window.data = {
    pictures: pictures,
  };
})();
