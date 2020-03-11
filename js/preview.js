'use strict';

(function () {
  var COMMENTS_COUNT = 5;
  var bigPicture = window.utils.pageBody.querySelector('.big-picture');
  var socialCommentTemplate = window.utils.pageBody.querySelector('.social__comments');
  var socialComment = window.utils.pageBody.querySelector('.social__comment');
  var pictureClose = document.querySelector('#picture-cancel');
  var commentsLoaderButton = bigPicture.querySelector('.comments-loader');
  var comments;
  var commentIndex = 0;


  function getCommentListFragment(commentsFragment) {
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
  }

  function getCommentElement(element) {
    var commentItemCopy = socialComment.cloneNode(true);
    var socialCommentImg = commentItemCopy.querySelector('img');
    var socialText = commentItemCopy.querySelector('.social__text');
    socialCommentImg.src = element.avatar;
    socialCommentImg.alt = element.name;
    socialText.textContent = element.message;
    return commentItemCopy;
  }

  function insertCommentsCounter(commentsCount) {
    var commentCountElement = bigPicture.querySelector('.social__comment-count');
    commentCountElement.innerHTML = commentIndex + ' из <span class="comments-count">' + commentsCount + '</span> комментариев';
  }

  function onLoaderCommentsClick() {
    var fragmentCommentList = getCommentListFragment(comments);
    socialCommentTemplate.appendChild(fragmentCommentList);
  }

  function clearCommentsList() {
    var commentsElements = bigPicture.querySelectorAll('.social__comment');
    commentsElements.forEach(function (comment) {
      comment.remove();
    });
  }

  function resetIndex() {
    commentIndex = 0;
  }

  function showBigPicture() {
    bigPicture.classList.remove('hidden');
    window.utils.pageBody.classList.add('modal-open');
  }

  function closeBigPicture() {
    document.removeEventListener('keydown', onPictureEscPress);
    bigPicture.classList.add('hidden');
    window.utils.pageBody.classList.remove('modal-open');
    resetIndex();
  }

  function onPictureCloseClick() {
    closeBigPicture();
  }

  function onPictureEscPress(evt) {
    window.utils.isEscEvent(evt, closeBigPicture);
  }

  function showBigPicturePopup(element) {
    var bigPictureImg = bigPicture.querySelector('img');
    var likesCount = bigPicture.querySelector('.likes-count');
    var socialCaption = window.utils.pageBody.querySelector('.social__caption');
    clearCommentsList();
    commentsLoaderButton.addEventListener('click', onLoaderCommentsClick);
    comments = element.comments;
    var firstLoadCommentList = getCommentListFragment(comments);
    socialCommentTemplate.appendChild(firstLoadCommentList);
    bigPictureImg.src = element.url;
    likesCount.textContent = element.likes;
    socialCaption.textContent = element.description;
    showBigPicture();

    window.utils.pageBody.addEventListener('keydown', onPictureEscPress);
    pictureClose.addEventListener('click', onPictureCloseClick);
  }

  function setBigPictureBehavior(data) {
    var smallPictures = document.querySelectorAll('.picture');

    smallPictures.forEach(function (picture, index) {
      picture.addEventListener('click', function () {
        showBigPicturePopup(data[index]);
      });
    });
  }

  window.preview = {
    setBigPictureBehavior: setBigPictureBehavior,
  };
})();
