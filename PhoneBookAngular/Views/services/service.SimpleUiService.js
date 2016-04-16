(function(){
    'use strict';
    //simmple usage for reset inputs and hide blackout overlay
    function SimpleUiService($rootScope) {

        this.rootScope = $rootScope;

    }

    SimpleUiService.prototype.ClearInputs = function() {

        this.rootScope.showBlackOut = false;
        $("input[type=text]").val("");

    };

    angular.module("app").service("SimpleUiService",SimpleUiService);

})();