var app = angular.module('crackerNews', ['ui.router']);

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
		})

		.state('register', {
			url: '/register',
			templateUrl: '/register.html',
			controller: 'AuthCtrl',
			onEnter: ['$state', 'auth', function($state, auth) {
				if(auth.isLoggedIn()) {
					$state.go('home');
				}
			}]
		})

		.state('login', {
			url: '/login',
			templateUrl: '/login.html',
			controller: 'AuthCtrl',
			onEnter: ['$state', 'auth', function($state, auth) {
				if(auth.isLoggedIn()) {
					$state.go('home');
				}
			}]
		});

		$urlRouterProvider.otherwise('home');
	}
]);

app.factory('auth', ['$http', '$window', function($http, $window) {
	var auth = {};

	auth.saveToken = function(token) {
		$window.localStorage['cracker-news-token'] = token;
	};

	auth.getToken = function() {
		return $window.localStorage['cracker-news-token'];
	};

	auth.isLoggedIn = function() {
		var token = auth.getToken();

		if(token) {
			var payload = JSON.parse($window.atob(token.split('.')[1]));

			return payload.exp > Date.now() / 1000;
		} else {
			return false;
		}
	};

	auth.currentUser = function() {
		if(auth.isLoggedIn()) {
			var token = auth.getToken();

			var payload = JSON.parse($window.atob(token.split('.')[1]));
			return payload.username;
		}
	};

	auth.register = function(user) {
		return $http.post('/register', user).success(function(data) {
			auth.saveToken(data.token);
		});
	};

	auth.logIn = function(user) {
		return $http.post('/login', user).success(function(data) {
			auth.saveToken(data.token);
		});
	};

	auth.logOut = function() {
		$window.localStorage.removeItem('cracker-news-token');
	};

	return auth;
}]);

app.factory('posts', ['$http', 'auth', function($http, auth) {
	var p = {
		posts: []
	};

	p.getAll = function() {
		return $http.get('/posts').success(function(data) {
			angular.copy(data, p.posts);
		});
	};

	p.create = function(post) {
		return $http.post('/posts', post, {
			headers: {
				Authorization: 'Bearer ' + auth.getToken()
			}
		}).success(function(data) {
			p.posts.push(data);
		});
	};

	p.upvote = function(post) {
		return $http.put('/posts/' + post._id + '/upvote', null, {
			headers: {
				Authorization: 'Bearer ' + auth.getToken()
			}
		}).success(function(data) {
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
		return $http.post('/posts/' + post._id + '/comments', comment, {
			headers: {
				Authorization: 'Bearer ' + auth.getToken()
			}
		}).success(function(comment) {
			post.comments.push(comment);
		});
	};

	p.upvoteComment = function(post, comment) {
		return $http.put('/posts/' + post._id + '/comments/' + comment._id + '/upvote', null,  {
			headers: {
				Authorization: 'Bearer ' + auth.getToken()
			}
		}).success(function(data) {
			comment.upvotes += 1;
		});
	};


	return p;
}]);

app.controller('AuthCtrl', [
	'$scope',
	'$state',
	'auth',
	function($scope, $state, auth) {
		$scope.user = {};

		$scope.register = function() {
			auth.register($scope.user).error(function(error) {
				$scope.error = error;
			}).then(function() {
				$state.go('home');
			});
		};

		$scope.logIn = function() {
			auth.logIn($scope.user).error(function(error) {
				$scope.error = error;
			}).then(function() {
				$state.go('home');
			});
		};
	}
]);

app.controller('NavCtrl', [
	'$scope',
	'auth',
	function($scope, auth) {
		$scope.isLoggedIn = auth.isLoggedIn;
		$scope.currentUser = auth.currentUser;
		$scope.logOut = auth.logOut;
	}
]);

app.controller('MainCtrl', [
	'$scope',
	'posts',
	'auth',
	function($scope, posts, auth) {
		$scope.posts = posts.posts;

		$scope.isLoggedIn = auth.isLoggedIn;

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
	'auth',
	function($scope, posts, post, auth) {
		$scope.post = post;

		$scope.isLoggedIn = auth.isLoggedIn;

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
