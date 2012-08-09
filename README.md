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
  }//, "arktest.tumblr.com"
  // specify the blog url now or the time you want to use
);

tumblr.get('/info', {hostname: 'arktest.tumblr.com'}, function(json){
  console.log(json);
});

```

### Want to post blog? Need to specify more parameters!

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

### Upload a photo from local disk

``` javascript
// upload local photo can work but can not upload multiple photos in a single blog
// most of the code for this are from ntumblr

// in general, tumblr api sucks
var photo = fs.readFileSync('./test/img/P1010486.jpg');

tumblr.post('/post', {type: 'photo', data: [photo]}, function(json){
  console.log(json);
});

```


## Tests

    $ mocha

You can find all the test cases in /test/all_test.js

The real test results are here: http://arktest.tumblr.com

## License

(The MIT License)

Copyright (c) 2012 Fangzhou Ark Xu

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

