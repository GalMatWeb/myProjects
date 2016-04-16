(function(){
    'use strict';

    angular.module("app").controller("addGroupCtrl",addGroupCtrl);
    //simple Group Controller Class use Main Serivce
    function addGroupCtrl(Main,$rootScope) {

        this.name = "";
        this.MainService = Main;
        this.groupName  = "";
        this.rootScope = $rootScope;

    }

    addGroupCtrl.prototype.validName = function(){

        return this.groupName == "";

    };
    //validate and create new Group
    addGroupCtrl.prototype.saveGroup = function(){
        var newId = 0;
        var newGroup = null;
        if(this.validName() == false) {

            newGroup = new phoneBook.Group(this.groupName);
            newId = this.MainService.NewPhoneBook.generateNextId();
            newGroup.addItem(this.MainService.currentGroup,newId);
            this.rootScope.$broadcast('hideTabs', false);
            this.MainService.saveData();
        }
        else {
            alert("Group Name Is  Mandatory!");
        }

    };


})();