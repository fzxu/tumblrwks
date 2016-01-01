var http = require('http'),
  CustomOAuth = require('./custom-oauth.js'),
  encodeToHex = require('./encode-image').encodeToHex;

var apiHost = 'api.tumblr.com';
var apiVersion = '/v2';
var apiUrl = 'http://' + apiHost + apiVersion;

function checkForDeprecatedCallbacks(functionName, url, params, callback){
  callback = callback || function (err, data) {};

  if (callback && callback.length !== 2) {
    console.log("Warning: detected old-style callback in call:");
    console.log(functionName, "(", url, params, ")");
    console.log("Callbacks should now have the signature (err, json).");
    return function(err, json) {
      callback(json);
    };
  }
  else {
    return callback;
  }
}

function tumblr(options, hostname){
  this.consumerKey = options.consumerKey;
  this.consumerSecret = options.consumerSecret;
  this.accessToken = options.accessToken;
  this.accessSecret = options.accessSecret;
  this.hostname = hostname;

  if(this.consumerKey && this.consumerSecret){
    this.oa = new CustomOAuth('http://www.tumblr.com/oauth/request_token',
                        'http://www.tumblr.com/oauth/access_token',
                        this.consumerKey, this.consumerSecret, '1.0A',
                        null, 'HMAC-SHA1');
  }
}

function handleError(callback, error) {
    callback(error);
}

function handleResponse (options, callback, response) {
    callback = callback || function () {};
    options = options || {}
    options.expectedStatusCodes = options.expectedStatusCodes || [200];

    var body = '';
    response.setEncoding('utf8');
    response.addListener('data', function (chunk) {
        body += chunk;
    });

    return new Promise(function (resolve, reject) {
        response.addListener('end', function () {
            if (options.expectedStatusCodes.indexOf(response.statusCode) !== -1) {
                var parsedResponse = JSON.parse(body).response;
                callback(null, parsedResponse);
                resolve(parsedResponse);
            } else {
                var error = new Error(body);
                handleError(callback, error);
                reject(error);
            }
        });
    });
}

function performOauthQuery(request, options, callback) {
    return new Promise(function (resolve, reject) {
        request.addListener('response', function (response) {
            handleResponse(options, callback, response)
                .catch(reject)
                .then(resolve);
        });

        request.on('error', function (error) {
            handleError(callback, error);
            reject(error);
        });

        request.end();
    });
}

function performHttpQuery(options, callback) {
    options = options || {
        host : '',
        port : 80,
        path : '',
        method : 'GET'
    };

    return new Promise(function (resolve, reject) {
        var request = http.request(options, function (response) {
            handleResponse(options, callback, response)
                .catch(reject)
                .then(resolve);
        });

        request.on('error', function (error) {
            handleError(callback, error);
            reject(error);
        });

        request.end();
    });
}

tumblr.prototype.get = function (url, params, callback){
  function _needOAuth(url){
    if (tumblr.prototype._isUserAPI(url)) return true;

    var actionsNeedOAuth = ['/followers', '/posts/queue', '/posts/draft', '/posts/submission'];
    return actionsNeedOAuth.indexOf(url) > -1;
  }

  function _needApiKey(url){
    var actionsNeedApi = ['/info', '/posts'];

    return actionsNeedApi.indexOf(url) > -1;
  }

  params = params || {};
  if (params instanceof Function && !callback) callback = params;
  callback = checkForDeprecatedCallbacks('tumblr.get', url, params, callback);

  var host = this._getHostName(params),
    path = '';

  if (_needOAuth(url)){
    if (this._isUserAPI(url)){
      path = apiUrl + url + '?' + this._getParamsString(params);
    } else {
      path = apiUrl + '/blog/' + host + url + '?' + this._getParamsString(params);
    }

    return performOauthQuery(this.oa.get(path, this.accessToken, this.accessSecret), {
        expectedStatusCodes : [200]
    }, callback);
  } else {
    var prefix = this._isTaggedAPI(url) ? ('') : ('/blog/' + host);

    if (_needApiKey(url)) {
      path = apiVersion + prefix + url + '?api_key=' + this.consumerKey + '&' + this._getParamsString(params);
    } else {
      path = apiVersion + prefix + url + '?' + this._getParamsString(params);
    }

    return performHttpQuery({
      host: apiHost,
      port: 80,
      path: path,
      method: 'GET',
      expectedStatusCodes : [200, 301]
    }, callback)
  }
};


tumblr.prototype.post = function (url, params, callback){
  params = params || {};
  if (params instanceof Function && !callback) callback = params;
  callback = checkForDeprecatedCallbacks('tumblr.post', url, params, callback);

  var host = this._getHostName(params);

  if (params.data) {
    this.oa.originalBody = {};

    if (Array.isArray(params.data)) {
      params.data.forEach(function (ref, index) {
        params["data[" + index + "]"] = encodeToHex(ref);
        this.oa.originalBody["data[" + index + "]"] = encodeToHex(ref);
      }, this);
      delete params.data;
    } else {
      params['data[0]'] = encodeToHex(params.data);
      this.oa.originalBody["data[0]"] = encodeToHex(params.data);
      delete params.data;
    }
  }
  var request = null;
  if (this._isUserAPI(url)){
    request = this.oa.post(apiUrl + url, this.accessToken, this.accessSecret, params);
  }else{
    request = this.oa.post(apiUrl + '/blog/' + host + url, this.accessToken, this.accessSecret, params);
  }

  return performOauthQuery(request, {
    expectedStatusCodes : [200, 201]
  }, callback);
};

tumblr.prototype._getParamsString = function (params){
  if (!params || params instanceof Function ) return '';

  var paramsString = "";
  var paramArray = [];

  for (var k in params) {
    if (params.hasOwnProperty(k)) {
      paramArray.push(k + '=' + params[k]);
    }
  }
  return paramsString + paramArray.join('&');
};

tumblr.prototype._getHostName = function (params) {
  var host = '';

  if (params.hostname) {
    host = params.hostname;
    delete params['hostname'];
  } else {
    host = this.hostname;
  }

  return host;
}

// all the user methods need OAuth
tumblr.prototype._isUserAPI = function (url){
  return url.indexOf('/user/') === 0;
};

tumblr.prototype._isTaggedAPI = function (url){
  return url.indexOf('/tagged') === 0;
};

module.exports = tumblr;
