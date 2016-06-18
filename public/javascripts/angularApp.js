var app = angular.module('crapperNews', ['ui.router']);

app.config([
	'$stateProvider',
	'$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		$stateProvider
			.state('home', {
				url: '/home',
				templateUrl: '/home.html',
				controller: 'MainCtrl',
        resolve: {
          postPromise: ['posts', function(posts) {
            return posts.getAll();
          }]
        }
			})

		.state('posts', {
			url: '/posts/:id',
			templateUrl: '/posts.html',
			controller: 'PostsCtrl'
		});

		$urlRouterProvider.otherwise('home');
	}
]);

app.factory('posts', ['$http', function($http) {
	var p = {
		posts: []
	};

  p.getAll = function() {
    return $http.get('/posts').success(function(data) {
      angular.copy(data, p.posts);
    });
  };

  p.create = function(post) {
    return $http.post('/posts', post).success(function(data) {
      p.posts.push(data);
    });
  };

	return p;
}]);

app.controller('MainCtrl', [
	'$scope',
	'posts',
	function($scope, posts) {
		$scope.posts = posts.posts;

		$scope.addPost = function() {
      posts.create({
        title: $scope.title,
        body: $scope.link
      });
			$scope.title = '';
			$scope.link = '';
		};

		$scope.incrementUpvotes = function(post) {
			post.upvotes += 1;
		};
	}
]);

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
			comment.upvotes += 1;
		};
	}
]);
