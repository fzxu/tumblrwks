Tumblr Works!
=========

One node.js package lib talks to tumblr API v2 that really works.

## Installation

The recommended way is through the excellent [NPM](http://www.npmjs.org/):

    $ npm install tumblrwks

## How to use

``` javascript
var Tumblr = require('tumblrwks');

/*
  You can get the consumerKey and consumerSecret by registing a tumblr app: http://www.tumblr.com/oauth/apps
*/

var tumblr = new Tumblr(
  {
    consumerKey: 'your consumer key'
  }
);

tumblr.get('/info', {hostname: 'arktest.tumblr.com'}, function(json){
  console.log(json);
});

```

### If want to post that requires OAuth, Need to specify more parameters.

``` javascript
var Tumblr = require('tumblrwks');

/*
  For accessToken and accessSecret, user need to grant access of your app. I recommend to use: https://github.com/jaredhanson/passport-tumblr
*/

var tumblr = new Tumblr(
  {
    consumerKey: 'your consumer key',
    consumerSecret: 'your consumer secret',
    accessToken: 'access token',
    accessSecret: 'access secret'
  }, "arktest.tumblr.com"
  // specify the blog url now or the time you want to use
);

tumblr.post('/post', {type: 'text', title: 'tumblrwkstesting', body: '<h3>should work!! </h3>'}, function(json){
  console.log(json);
});

```

You can find all the test cases in /test/all_test.js

The real test results are here: http://arktest.tumblr.com
