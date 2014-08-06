angular.module('App.directives', ['ngAnimate'])
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
  }])
  .directive("ngEnter", [function() {
    return function (scope, $el, attrs) {
      $el.bind("keydown keypress", function (event) {
        if(event.which === 13) {
          $target = angular.element(event.target);
          
          if ($target.val() != '') {
            $target.next()[0].select();
            event.preventDefault();
          }
        }
      });

    };
  }])


;
