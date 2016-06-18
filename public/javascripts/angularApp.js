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
			controller: 'PostsCtrl',
			resolve: {
				post: ['$stateParams', 'posts', function($stateParams, posts) {
					return posts.get($stateParams.id);
				}]
			}
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

	p.upvote = function(post) {
		return $http.put('/posts/' + post._id + '/upvote')
			.success(function(data) {
				post.upvotes += 1;
			});
	};

	/* I can use success() here too instead of a promise */
	p.get = function(id) {
		return $http.get('/posts/' + id).then(function(res) {
			return res.data;
		});
	};

	p.addComment = function(post, comment) {
		return $http.post('/posts/' + post._id + '/comments', comment).success(function(comment) {
      post.comments.push(comment);
    });
	};

  p.upvoteComment = function(post, comment) {
    return $http.put('/posts/' + post._id + '/comments/' + comment._id + '/upvote').success(function(data) {
      comment.upvotes += 1;
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
			posts.upvote(post);
		};
	}
]);

app.controller('PostsCtrl', [
	'$scope',
	'posts',
	'post',
	function($scope, posts, post) {
		$scope.post = post;

		$scope.addComment = function() {
			posts.addComment(post, {
				body: $scope.body,
				author: 'user'
			});
			$scope.body = '';
		};

		$scope.incrementUpvotes = function(comment) {
			posts.upvoteComment(post, comment);
		};
	}
]);
