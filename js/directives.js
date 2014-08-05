angular.module('App.directives', [])
  .directive("mySelect", [function() {
    return function (scope, $el, attrs) {
      scope.$watch(attrs.mySelect, function (val) {
        if (val) {
          $el[0].select();
        }
      });
    };
  }])
  .directive("myFocus", [function() {
    return function (scope, $el, attrs) {
      scope.$watch("newTitle", function (val) {
        if (val == '') {
          $el[0].focus();
        }
      });
    };
  }]);

