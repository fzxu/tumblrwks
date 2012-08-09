var Tumblr = require('../lib/tumblrwks.js');
var assert = require('assert');

var tumblr = new Tumblr({
  consumerKey: 'Qf6HlZz8NCBwUcMSP6PS99b2kUCqzj2J4Aecs91U25hRabgkzB'
});

describe('SIMPLE TESTS', function (){
  it('should get blog info', function(done){
    // you can specify the hostname when calling
    tumblr.get('/info', {hostname: 'arktest.tumblr.com'}, function(json){
      assert.equal(json.blog.name, 'arktest');
      done();
    });
  });
});