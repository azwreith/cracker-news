var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Post  = mongoose.model('Post');
var Comment = mongoose.model('Comment');

/* GET all Posts */
router.get('/posts', function(req, res, next) {
  Post.find(function(err, posts) {
    if(err) { return next(err) };

    res.json(posts);
  });
});

/* POST a post */
router.post('/posts', function(req, res, next) {
  var post = new Post(req.body);

  post.save(function(err, post) {
    if(err) { return next(err) };

    res.json(post);
  });
});

/* PARAM for loading pre-loading post */
router.param('post', function(req, res, next, id) {
  var query = Post.findById(id);

  query.exec(function(err, post) {
    if(err) { return next(err) };
    if(!post) { return next(new Error("Can't find post")) };

    req.post = post;
    return next();
  })
})

/* GET a particular post */
router.get('/posts/:post', function(req, res) {
  res.json(req.post);
});




/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
