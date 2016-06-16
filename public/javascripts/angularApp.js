var app = angular.module('crapperNews', ['ui.router']);

app.config([
'$stateProvider',
'$urlRouterProvider',
function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('home', {
      url: '/home',
      templateUrl: '/home.html',
      controller: 'MainCtrl'
    })

    .state('posts', {
      url: '/posts/:id',
      templateUrl: '/posts.html',
      controller: 'PostsCtrl'
    });

  $urlRouterProvider.otherwise('home');
}]);

app.factory('posts', [function() {
  var p = {
    posts: []
  };
  return p;
}]);


app.controller('MainCtrl', [
'$scope',
'posts',
function($scope, posts) {
  $scope.posts = posts.posts;
  // $scope.posts = [
  //   {title: 'post 1', upvotes: 5},
  //   {title: 'post 2', upvotes: 1},
  //   {title: 'post 3', upvotes: 25},
  //   {title: 'post 4', upvotes: 9},
  //   {title: 'post 5', upvotes: 4}
  // ];

  $scope.addPost = function() {
      $scope.posts.push({
        title: $scope.title,
        link: $scope.link,
        upvotes: 0,
        comments: [
          {author: 'Ujjwal', body: 'Me for president', upvotes: 2},
          {author: 'Blah', body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec accumsan, sem at tempus tempor', upvotes:3}
        ]
      });
      $scope.title='';
      $scope.link='';
  };

  $scope.incrementUpvotes = function(post) {
    post.upvotes += 1;
  }
}]);

app.controller('PostsCtrl', [
'$scope',
'$stateParams',
'posts',
function($scope, $stateParams, posts) {
  $scope.post = posts.posts[$stateParams.id];

  $scope.addComment = function() {
    $scope.post.comments.push({
      body: $scope.body,
      author: 'user',
      upvotes: 0
    });
    $scope.body = '';
  };

  //Broken - FIX!
  $scope.incrementUpvotes = function(comment) {
    comment.upvotes +=1;
  }
}]);
