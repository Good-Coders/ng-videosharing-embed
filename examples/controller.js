'use strict';
/**
 * @ngdoc function
 * @name rollerCoasterCoreApp.controller:RcBackgroundControlBarThreeCtrl
 * @description
 * # RcBackgroundControlBarThreeCtrl
 * Controller of the rollerCoasterCoreApp
 */
angular.module('videosharing-embed')
  .controller('testCtrl', function ($scope) {

    $scope.toggleVideo = function () {
      $scope.video = ($scope.video === 'https://youtu.be/LOKyEt36Kjc') ? 'http://vimeo.com/53881651' : 'https://youtu.be/LOKyEt36Kjc';
    };
    $scope.toggleVideo();

  });
