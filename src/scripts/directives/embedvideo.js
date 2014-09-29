angular.module('videosharing-embed')
	.directive('embedVideo', function ($filter, RegisteredPlayers, $sce) {
		'use strict';
		return {
			restrict: 'E',
			replace: true,
			template: '<div class="fluid-iframe"><iframe ng-src="{{trustedVideoSrc}}" frameborder="0"></iframe></div>',
			scope: {},
			link: function (scope, element, attrs) {
				element[0].style.paddingTop = '56.25%'; // Default is 1920 x 1080 Ratio

				function process() {
					var url = attrs.url;
					if (url === undefined) {
						return;
					}
					var player = null;
					//search for the right player in the list of registered players
					angular.forEach(RegisteredPlayers, function (value) {
						if (value.isPlayerFromURL(url)) {
							player = value;
						}
					});
					if (player === null) {
						return; //haven't found a match for a valid registered player
					}
					//get the videoID
					var videoID = url.match(player.playerRegExp)[2];

					//copy configuration from player
					var config = player.config;
					//get the protocol
					var protocol = url.match(player.playerRegExp)[1] || '';

					//overwrite playback options
					angular.forEach($filter('whitelist')(attrs, player.whitelist), function (value, key) {
						config.options[key] = value;

					});
					//build and trust the video URL
					var untrustedVideoSrc = protocol + '//' + config.playerID + videoID + $filter('videoOptions')(config.options);
					scope.trustedVideoSrc = $sce.trustAsResourceUrl(untrustedVideoSrc);
				}

				scope.$watch(attrs.attrs, function (value) {
					if (angular.isObject(value)) {
						// Remove all attrs from element
						angular.forEach(element[1].attributes, function (v) {
							if (!/(ng-src|frameborder)/.test(v.name)) {
								element.removeAttribute(v.name);
							}
						});
						var width, height;

						scope.trustedVideoSrc = null;
						angular.forEach(value, function (value, key) {
							if (key === 'width') {
								width = value;
							} else if (key === 'height') {
								height = value;
							} else {
								attrs.$set(key, value);
							}
						});
						if (width && height) {
							var ratio = (height / width) * 100;
							element[0].style.paddingTop = ratio + '%';
						}
						process();
					}
				}, true);
				//handle the use of both ng-src and src
				attrs.$observe('url', process);
			}
		};
	});