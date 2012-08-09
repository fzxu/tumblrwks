var Tumblr = require('../lib/tumblrwks.js');
var assert = require('assert');
var fs = require('fs');

var tumblr = new Tumblr({
    consumerKey: 'your consumer key',
    consumerSecret: 'your consumer secret',
    accessToken: 'access token',
    accessSecret: 'access secret'
  }, "arktest.tumblr.com"
);

describe('SAMPLE POST PHOTO', function (){
  it('should post one photo blog get form flickr ', function(done){
    tumblr.post('/post', {
      type: 'photo',
      caption: 'Flickr', 
      source: 'http://farm9.staticflickr.com/8294/7733962082_11a1834801.jpg'
    }, function(json){
      console.log(json);
      done();
    });
  });

  it('should post one photo from local fs ', function(done){
    // upload local photo can work but can not upload multiple photos in a single blog
    // most of the code for this are from ntumblr

    // in general, tumblr api sucks
    var photo = fs.readFileSync('./test/img/P1010486.jpg');

    tumblr.post('/post', {
      type: 'photo',
      data: [photo]
    }, function(json){
      console.log(json);
      done();
    });
  });
});