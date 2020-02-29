'use strict';

(function () {
  var ESC_KEY = 'Escape';
  var bigPicture = window.form.pageBody.querySelector('.big-picture');
  var socialCommentTemplate = window.form.pageBody.querySelector('.social__comments');
  var socialComment = window.form.pageBody.querySelector('.social__comment');
  var pictureClose = document.querySelector('#picture-cancel');

  function getCommentElement(element) {
    var commentItemCopy = socialComment.cloneNode(true);
    var socialCommentImg = commentItemCopy.querySelector('img');
    var socialText = commentItemCopy.querySelector('.social__text');
    socialCommentImg.src = element.avatar;
    socialCommentImg.alt = element.name;
    socialText.textContent = element.message;

    return commentItemCopy;
  }

  function showNewComments(element) {
    var commentsCount = bigPicture.querySelector('.comments-count');

    commentsCount.textContent = element.comments.length;
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < element.comments.length; i++) {
      fragment.appendChild(getCommentElement(element.comments[i]));
    }
    socialCommentTemplate.innerHTML = '';
    socialCommentTemplate.appendChild(fragment);
  }

  var onPictureEscPress = function (evt) {
    if (evt.key === ESC_KEY) {
      closeBigPicture();
    }
  };

  var closeBigPicture = function () {
    document.removeEventListener('keydown', onPictureEscPress);
    bigPicture.classList.add('hidden');
    window.form.pageBody.classList.remove('modal-open');
  };

  function showBigPicture(element) {
    var bigPictureImg = bigPicture.querySelector('img');
    var likesCount = bigPicture.querySelector('.likes-count');
    var socialCaption = window.form.pageBody.querySelector('.social__caption');
    var socialCommentCount = window.form.pageBody.querySelector('.social__comment-count');
    var commentsLoader = window.form.pageBody.querySelector('.comments-loader');


    bigPictureImg.src = element.url;
    likesCount.textContent = element.likes;
    showNewComments(element);
    socialCaption.textContent = element.description;
    socialCommentCount.classList.add('hidden');
    commentsLoader.classList.add('hidden');

    bigPicture.classList.remove('hidden');
    window.form.pageBody.classList.add('modal-open');
    window.form.pageBody.addEventListener('keydown', onPictureEscPress);
  }

  function setBigPictureBehavior(data) {
    var smallPictures = document.querySelectorAll('.picture');

    smallPictures.forEach(function (picture, index) {
      picture.addEventListener('click', function () {
        showBigPicture(data[index]);
      });
    });
  }

  function onPictureCloseClick() {
    closeBigPicture();
  }


  pictureClose.addEventListener('click', onPictureCloseClick);
  window.preview = {
    setBigPictureBehavior: setBigPictureBehavior,
  };
})();
