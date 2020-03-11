'use strict';

(function () {
  var RANDOM_PHOTO = 10;
  var filterButtons = document.querySelectorAll('.img-filters button');
  var filterActive;

  var showPhoto = function (dataArray) {
    window.data.renderDataList(dataArray);

    window.preview.setBigPictureBehavior(dataArray);
  };

  var getRandomPhoto = function (photos) {
    var images = [];
    for (var i = 0; i < RANDOM_PHOTO; i++) {
      var j = Math.floor(Math.random() * (photos.length - 1));

      images[i] = photos.splice(j, 1)[0];
    }

    return images;
  };

  var onFilterClick = window.debounce(function (evt) {
    var picturesListing = document.querySelector('.pictures');
    var target = evt.target;

    if (!target.classList.contains('img-filters__button--active')) {
      filterActive = document.querySelector('.img-filters__button--active');
      filterActive.classList.remove('img-filters__button--active');
      target.classList.add('img-filters__button--active');
      var picturesAll = picturesListing.querySelectorAll('.picture');
      picturesAll.forEach(function (picture) {
        picture.remove();
      });
      // picturesListing.innerHTML = '';

      var dataCopy = window.pictures.slice();

      if (target.textContent === 'Случайные') {
        dataCopy = getRandomPhoto(dataCopy);
      } else if (target.textContent === 'Обсуждаемые') {
        dataCopy = dataCopy.sort(function (a, b) {
          return b.comments.length - a.comments.length;
        });
      }

      showPhoto(dataCopy);
    }
  });

  filterButtons.forEach(function (button) {
    button.addEventListener('click', onFilterClick);
  });
})();
