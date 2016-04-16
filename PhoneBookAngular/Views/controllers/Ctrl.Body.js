(function(){
    'use strict'

    angular.module("app").controller("BodyCtrl",BodyCtrl);
    //Body Controller uses for genral items in app
    function BodyCtrl(Alerts,$scope,$rootScope,Main){

        var self=this;
        this.rootScope = $rootScope;
        this.Alerts = Alerts;
        this.showBlackOut = false;
        this.mainService = Main;
        this.scope = $scope;

        $scope.$on('menuStatus', function(event, value) {

            if( value[0].tabOpen !== false || value[1].tabOpen !== false ) {
                self.showBlackOut = true;
            }
            else {
                self.showBlackOut = false;
            }

        });


    }

    BodyCtrl.prototype.hideAll = function($rootScope) {

        this.rootScope.$broadcast("hideTabs");
        this.showBlackOut = false;

    };



    BodyCtrl.prototype.getCurrentGroupName = function(){
        var Group = this.mainService.currentGroup;
        return Group.name;
    };


})();