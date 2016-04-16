(function(){
    'use strict'

    angular.module("app").directive('menu', function() {
        return {
            templateUrl: 'Views/directives/menu.html'
        };
    });

    angular.module("app").directive('tabs', function($compile) {

        return {
            restrict: 'E',
            link: function(scope, element, attrs,ctrl) {
                scope.getContentUrl = function() {
                    return "Views/directives/"+scope.item.directiveFile+".html";
                };
            },
            template: '<div ng-include="getContentUrl()"></div>'
        }
    });


})();