tumblrwks
=========

One node.js package lib talks to tumblr API that really works.

``` javascript
var Tumblr = require('../lib/tumblrwks.js');

/*
  You can get the consumerKey and consumerSecret by registing a tumblr app: http://www.tumblr.com/oauth/apps
  For accessToken and accessSecret, user need to grant access of your app. I recommend to use: https://github.com/jaredhanson/passport-tumblr
*/

var tumblr = new Tumblr(
  {
    consumerKey: 'your consumer key',
    consumerSecret: 'your consumer secret',
    accessToken: 'access token',
    accessSecret: 'access secret'
  }, "arktest.tumblr.com"
  // you can specify the blog url now or the time you want to use
);

tumblr.get('/posts', {limit:1, type: 'photo'}, function(json){
  console.log(json);
});

```

You can find all the test cases in /test/all_test.js

The real test results are here: http://arktest.tumblr.com