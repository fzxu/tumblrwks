var Tumblr = require('../lib/tumblrwks.js');
var assert = require('assert');

var tumblr = new Tumblr({
    consumerKey: 'your consumer key',
    consumerSecret: 'your consumer secret',
    accessToken: 'access token',
    accessSecret: 'access secret'
  }, "arktest.tumblr.com"
  // you can specify the blog url now or the time you want to use
);

describe('GET METHOD TESTS', function (){
  before(function (done){
    done();
  });

  beforeEach(function (done){
    done();
  });

  it('should get blog info', function(done){
    tumblr.get('/info', function(json){
      assert.equal(json.blog.name, 'arktest');
      done();
    });
  });


  it('should get blog info', function(done){
    tumblr.hostname = "www.arkxu.com";
    tumblr.get('/avatar/512', function(json){
      assert(json.avatar_url.indexOf('512.png') > 0);
      done();
    });
  });

  it('should get followers', function(done){
    tumblr.get('/followers', function(json){
      assert(json.users.length > 2);
      done();
    });
  });

  it('should get followers, only 2 of them', function(done){
    tumblr.get('/followers', {limit:2, offset:1}, function(json){
      assert(json.users.length == 2);
      done();
    });
  });

  it('should get posts', function(done){
    tumblr.hostname = "arktest.tumblr.com";
    tumblr.get('/posts', function(json){
      assert(json.blog.name == 'arktest');
      assert(json.posts.length > 10);
      done();
    });
  });

  it('should get photo posts', function(done){
    tumblr.get('/posts', {limit:1, type: 'photo'}, function(json){
      assert(json.posts.length == 1);
      assert(json.posts[0].type == 'photo');
      assert(json.posts[0].photos.length == 1);
      done();
    });
  });

  it('should get posts in queue', function(done){
    tumblr.get('/posts/queue', function(json){
      console.log(json);
      done();
    });
  });

  it('should get draft posts', function(done){
    tumblr.get('/posts/draft', function(json){
      assert(json.posts.length > 0);
      done();
    });
  });

  it('should get submission', function(done){
    tumblr.get('/posts/submission', function(json){
      console.log(json);
      done();
    });
  });

  it('should get user dashboard', function(done){
    tumblr.get('/user/dashboard', {limit:1}, function(json){
      assert(json.posts.length == 1);
      done();
    });
  });

  it('should get user likes', function(done){
    tumblr.get('/user/likes', {limit:2}, function(json){
      assert(json.liked_posts.length < 2);
      done();
    });
  });

  it('should get user following', function(done){
    tumblr.get('/user/following', {limit:2}, function(json){
      assert(json.blogs.length > 0);
      assert(json.blogs.length < 3);
      done();
    });
  });

  afterEach(function (done){
    done();
  });

  after(function (done){
    done();
  });
});







describe('POST METHOD TESTS', function (){
  before(function (done){
    done();
  });

  beforeEach(function (done){
    done();
  });

  it('post one text blog', function(done){
    tumblr.post('/post', {type: 'text', title: 'tumblrwkstesting', body: '<h3>should work!! 还有中文</h3>'}, function(json){
      assert(json.id);
      done();
    });
  });

  // it('post one text blog when specifying blog hostname', function(done){
  //   tumblr.post('/post', {hostname: 'www.arkxu.com', type: 'text', title: 'tumblrwkstesting', body: '<h3>should work!! </h3>'}, function(json){
  //     assert(json.id);
  //     done();
  //   });
  // });

  it('post one link blog', function(done){
    tumblr.post('/post', {type: 'link', title: 'tumblrwks link', url: 'www.arkxu.com'}, function(json){
      assert(json.id);
      done();
    });
  });

  it('edit one text blog', function(done){
    tumblr.post('/post', {type: 'text', title: 'tumblrwkstesting', body: '<h3>should work!! </h3>'}, function(json){
      var blog_id = json.id;
      tumblr.post('/post/edit', {id: blog_id, title: 'modified' + new Date().getTime(), body: '<h3>should work!! </h3>'}, function(json){
        assert(json.id == blog_id);
        done();
      });
    });
  });

  it('repost one photo blog', function(done){
    tumblr.post('/post/reblog', {id: 28968597543, reblog_key: 'eHl5721e', comment: new Date().getTime()}, function(json){
      assert(json.id);
      done();
    });
  });

  it('delete one text blog', function(done){
    tumblr.post('/post', {type: 'text', title: 'tobedeleted', body: '<h3>You should never seen this!!</h3>'}, function(json){
      var blog_id = json.id;
      tumblr.post('/post/delete', {id: blog_id}, function(json){
        assert(json.id == blog_id);
        done();
      });
    });
  });

  it('get user info', function(done){
    tumblr.post('/user/info', function(json){
      assert(json.user.name == 'arkxu');
      done();
    });
  });

  it('follow a blog', function(done){
    tumblr.post('/user/follow', {url: 'http://staff.tumblr.com/'}, function(json){
      done();
    });
  });

  it('unfollow a blog', function(done){
    tumblr.post('/user/unfollow', {url: 'http://staff.tumblr.com/'}, function(json){
      done();
    });
  });

  it('like a post', function(done){
    tumblr.post('/user/like', {id: 28968597543, reblog_key: 'eHl5721e'}, function(json){
      done();
    });
  });

  it('unlike a post', function(done){
    tumblr.post('/user/unlike', {id: 28968597543, reblog_key: 'eHl5721e'}, function(json){
      done();
    });
  });


  afterEach(function (done){
    done();
  });

  after(function (done){
    done();
  });
});
