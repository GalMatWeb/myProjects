(function(){
    'use strict';

    angular.module("app").controller("MenuCtrl",MenuCtrl);
    /*
    * all menu item controll Class*/
    function MenuCtrl($rootScope,$scope,SimpleUiService,Main){

        var self = this;
        this.keyWord = "";
        this.mainService = Main;
        this.SimpleUiService = SimpleUiService;
        $rootScope.showBlackOut = false;

        this.menuitems = [
            {
                title:"Add Group" ,
                elementId: "groupTab",
                tabOpen: false,
                directiveFile: "directive.group",
                className:"group-holder",
                method: this.addNewGroup
            },
            {
                title:"Add Contact",
                elementId: "contactTab",
                tabOpen: false,
                directiveFile: "directive.contact",
                className:"contact-holder",
                method: this.addNewContact
            }
        ];

        $scope.menuState = this.menuitems;
        //watch changes on menu
        $scope.$watch( function () {
                return $scope.menuState;
            } , function(newValue, oldValue) {
            $rootScope.$broadcast('menuStatus', newValue);
        }, true);

        //when broadcast everyone hide tabs
        $scope.$on("hideTabs",function(){

            self.closeTabs();
            self.SimpleUiService.ClearInputs();

        });
        // display results again after del within search results
        $scope.$on("displayResult",function(){
            self.searchItems();
        });

    }

    /*
    * validate key word and lunch search if keyword ok*/
    MenuCtrl.prototype.searchItems = function(){

        if(this.keyWord!="") {
            this.mainService.searchmod = true;
            this.mainService.searchItems(this.keyWord);

        }
        else {
            alert("Please Enter Search Value");
        }

    };

    /*
    * display tab when click and hide other tabs*/
    MenuCtrl.prototype.toggleTab = function(item) {

        this.menuitems.forEach(function(menuItem){
            menuItem.tabOpen = false;
        });
        item.tabOpen = !item.tabOpen;


    };

    /*just close all tabs*/
    MenuCtrl.prototype.closeTabs = function() {

        this.menuitems.forEach(function(menuItem){
            menuItem.tabOpen = false;
        });

    };




})();