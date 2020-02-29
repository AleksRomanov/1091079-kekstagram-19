'use strict';

(function () {
  var XHR_SERVER = {
    STATUS: 200,
    TIMEOUT: 10000,
  };
  var backend = {
    load: function (url, onSuccess, onError) {
      createRequest('GET', url, onSuccess, onError);
    },

    save: function (url, data, onSuccess, onError) {
      createRequest('POST', url, onSuccess, onError, data);
    },
  };

  var createRequest = function (method, url, onSuccess, onError, data) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === XHR_SERVER.STATUS) {
        onSuccess(xhr.response);
      } else {
        onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });
    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });
    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });
    xhr.timeout = XHR_SERVER.TIMEOUT;
    xhr.open(method, url);
    xhr.send(data);
  };


  window.backend = backend;
})();
