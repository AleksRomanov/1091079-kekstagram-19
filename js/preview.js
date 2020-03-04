'use strict';

(function () {
  var COMMENTS_COUNT = 5;

  var ESC_KEY = 'Escape';
  var bigPicture = window.form.pageBody.querySelector('.big-picture');
  var socialCommentTemplate = window.form.pageBody.querySelector('.social__comments');
  var socialComment = window.form.pageBody.querySelector('.social__comment');
  var pictureClose = document.querySelector('#picture-cancel');
  var commentsLoaderButton = bigPicture.querySelector('.comments-loader');
  var comments;
  var commentIndex = 0;


  function getCommentElement(element) {
    var commentItemCopy = socialComment.cloneNode(true);
    var socialCommentImg = commentItemCopy.querySelector('img');
    var socialText = commentItemCopy.querySelector('.social__text');
    socialCommentImg.src = element.avatar;
    socialCommentImg.alt = element.name;
    socialText.textContent = element.message;

    return commentItemCopy;
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
    resetIndex();
  };

  var getCommentListFragment = function (commentsFragment) {
    var fragment = document.createDocumentFragment();
    var counter = 0;

    while (commentIndex < commentsFragment.length && counter < COMMENTS_COUNT) {
      fragment.appendChild(getCommentElement(commentsFragment[commentIndex]));
      commentIndex++;
      counter++;
    }
    if (commentIndex < commentsFragment.length) {
      commentsLoaderButton.classList.remove('hidden');
    } else {
      commentsLoaderButton.classList.add('hidden');
    }
    insertCommentsCounter(commentsFragment.length);
    return fragment;
  };

  var insertCommentsCounter = function (commentsCount) {
    var commentCountElement = bigPicture.querySelector('.social__comment-count');
    var stringCountCommentElement = commentCountElement.innerHTML = commentIndex + ' из <span class="comments-count">' + commentsCount + '</span> комментариев';

    return stringCountCommentElement;
  };

  var onLoaderCommentsClick = function () {
    var fragmentCommentList = getCommentListFragment(comments);

    socialCommentTemplate.appendChild(fragmentCommentList);
  };

  var clearCommentsList = function () {
    var commentsElements = bigPicture.querySelectorAll('.social__comment');

    commentsElements.forEach(function (comment) {
      comment.remove();
    });
  };

  function showBigPicture(element) {
    var bigPictureImg = bigPicture.querySelector('img');
    var likesCount = bigPicture.querySelector('.likes-count');
    var socialCaption = window.form.pageBody.querySelector('.social__caption');
    commentsLoaderButton.addEventListener('click', onLoaderCommentsClick);
    comments = element.comments;

    var firstLoadCommentList = getCommentListFragment(comments);
    clearCommentsList();
    socialCommentTemplate.appendChild(firstLoadCommentList);

    bigPictureImg.src = element.url;
    likesCount.textContent = element.likes;
    socialCaption.textContent = element.description;

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

  var resetIndex = function () {
    commentIndex = 0;
  };


  pictureClose.addEventListener('click', onPictureCloseClick);
  window.preview = {
    setBigPictureBehavior: setBigPictureBehavior,
  };
})();
