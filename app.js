var app = angular.module('crapperNews', []);

app.controller('MainCtrl', [
  '$scope',
  function($scope) {

    $scope.posts = [
      {title: 'post 1', upvotes: 5},
      {title: 'post 2', upvotes: 1},
      {title: 'post 3', upvotes: 25},
      {title: 'post 4', upvotes: 9},
      {title: 'post 5', upvotes: 4}
    ];

    $scope.addPost = function() {
      // if($scope.title) {
        $scope.posts.push({
          title: $scope.title,
          link: $scope.link,
          upvotes: 0});
        $scope.title='';
        $scope.link='';
      // }
    };

    $scope.incrementUpvotes = function(post) {
      post.upvotes += 1;
    }

  }
]);
