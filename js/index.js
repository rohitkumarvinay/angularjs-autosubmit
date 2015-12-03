var myApp = angular.module('submitTest', ['ngMaterial','ngAnimate','ngAria']);

myApp.controller('myController', function($scope, $filter) {
  $scope.myText = "";
  
  $scope.setText = function() {
    $scope.outsideText = $scope.autoForm.theText.$modelValue;
  }
});

myApp.directive('autoSubmit', function($timeout) {
  return {
    require: 'form',
    restrict: 'A',
    scope: {
      "ngSubmit": '&',
      "autoSubmit": '@',
      "timeoutShow": '='
    },
    link: function(scope, iElement, iAttrs, iCtrl) {
      var autoSubmit = parseInt(scope.autoSubmit, 10);
      
      var submitTimeout = $timeout(function() {}, 0);
      var showTimeTimeout = $timeout(function() {}, 0);
      
      var showTime = function() {
        scope.timeoutShow = scope.autoSubmit / 1000;
        showTimeTimeout = $timeout(function theFull() {
          scope.timeoutShow = scope.timeoutShow - 1;
          if (scope.timeoutShow <= 0) {
            scope.timeoutShow = null;
          } else {
            $timeout(theFull, 1000);
          }
        }, 1000);
      }
        
      
      scope.$watch(function() { 
        return iCtrl.$valid && iCtrl.$dirty; 
      }, function(val, oldVal) {
        if(val !== oldVal && val) {
          iCtrl.$setPristine();
          $timeout.cancel(submitTimeout);
          $timeout.cancel(showTimeTimeout);
        
          showTime();
          submitTimeout = $timeout(function() {
            if (iCtrl.$valid) {
              scope.ngSubmit({});
              iCtrl.$setPristine();
            }
          }, autoSubmit);
        }
      });
    }
  };
});