var http = require('http'),
  CustomOAuth = require('./custom-oauth.js'),
  encodeToHex = require('./encode-image').encodeToHex;

var apiHost = 'api.tumblr.com';
var apiVersion = '/v2';
var apiUrl = 'http://' + apiHost + apiVersion;

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

tumblr.prototype.get = function (url, params, callback){
  if (params && !callback) callback = params;

  var host = this._getHostName(params);

  var body = "";

  if (_needOAuth(url)){
    if (this._isUserAPI(url)){
      var req = this.oa.get(apiUrl + url + '?' + this._getParamsString(params), this.accessToken, this.accessSecret);  
    }else{
      var req = this.oa.get(apiUrl + '/blog/' + host + url + '?' + this._getParamsString(params), this.accessToken, this.accessSecret);
    }

    req.addListener('response', function (res) {
      res.setEncoding('utf8');
      res.addListener('data', function (chunk) {
        body += chunk;
      });
      res.addListener('end', function () {
        if(res.statusCode == 200){
          var json = JSON.parse(body);
          if (callback) callback(json.response);
        }else{
          throw new Error(body);
        }
      });
    });

    req.end();    
  }else{

    if(_needApiKey){
      var path = apiVersion + '/blog/' + host + url + '?api_key=' + this.consumerKey + '&' + this._getParamsString(params);
    }else{
      var path = apiVersion + '/blog/' + host + url + '?' + this._getParamsString(params);
    }

    var options = {
      host: apiHost,
      port: 80,
      path: path,
      method: 'GET'
    };

    var req = http.request(options, function(res) {
      res.setEncoding('utf8');
      res.on('data', function (chunk) {
        body += chunk;
      });

      res.on('end', function(){
        if(res.statusCode == 200 || res.statusCode == 301){
          var json = JSON.parse(body);
          if (callback) callback(json.response);
        }else{
          throw new Error(body);
        }
      });

    });

    req.on('error', function(e) {
      console.log('problem with request: ' + e.message);
    }).end();    
  }

  function _needOAuth(url){
    if (tumblr.prototype._isUserAPI(url)) return true;

    var actionsNeedOAuth = ['/followers', '/posts/queue', '/posts/draft', '/posts/submission'];
    return actionsNeedOAuth.indexOf(url) > -1;
  }

  function _needApiKey(url){
    var actionsNeedApi = ['/info', '/posts'];

    return actionsNeedApi.indexOf(url) > -1;
  }

};


tumblr.prototype.post = function (url, params, callback){
  if (params && !callback) callback = params;
  
  var host = this._getHostName(params);
  
  var body = "";
  
  if(params.data){
    this.oa.originalBody = {};
    if (Array.isArray(params.data)) {
      var _ref = params.data;
      for (var i = 0; i < _ref.length; i++) {
        var d = _ref[i];
        params["data[" + i + "]"] = encodeToHex(d);
        this.oa.originalBody["data[" + i + "]"] = encodeToHex(d);
      }
      delete params.data;
    } else {
      params['data[0]'] = encodeToHex(params.data);
      this.oa.originalBody["data[0]"] = encodeToHex(params.data);
      delete params.data;
    }    
  }
  if (this._isUserAPI(url)){
    var req = this.oa.post(apiUrl + url, this.accessToken, this.accessSecret, params);
  }else{
    var req = this.oa.post(apiUrl + '/blog/' + host + url, this.accessToken, this.accessSecret, params);
  }

  req.addListener('response', function (res) {
    res.setEncoding('utf8');
    res.addListener('data', function (chunk) {
      body += chunk;
    });
    res.addListener('end', function () {
      if(res.statusCode == 200 || res.statusCode == 201){
        var json = JSON.parse(body);
        if (callback) callback(json.response);
      }else{
       throw new Error(body);
      }
    });
  });

  req.end();    
};

tumblr.prototype._getParamsString = function (params){
  if(!params || params instanceof Function ) return '';

  var paramsString = "";
  var paramArray = [];

  for(var k in params){
    paramArray.push(k + '=' + params[k]);
  }
  return paramsString + paramArray.join('&');
};

tumblr.prototype._getHostName = function (params) {
  if(params.hostname){
    var host = params.hostname;
    delete params['hostname'];
  }else{
    var host = this.hostname;  
  }
  
  return host;
}

// all the user methods need OAuth
tumblr.prototype._isUserAPI = function (url){
  return url.indexOf('/user/') == 0;
};

module.exports = tumblr;