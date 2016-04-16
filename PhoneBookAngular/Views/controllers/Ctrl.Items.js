(function(){
    'use strict';

    /*
    * Item Controller Class action on Item List uses Main service and Alerts Service*/
    function ItemsCtrl(Main,$rootScope,Alerts){

        this.mainService = Main;
        this.rootScope = $rootScope;
        this.Alerts = Alerts;
    }

    ItemsCtrl.prototype.isRoot = function(){

        return this.mainService.currentGroup.id != 1;

    };

    /*
    * Del Item validate search mode or regular display mode*/
    ItemsCtrl.prototype.delItem = function(index) {
        var itemID = this.mainService.currentGroup.items[index].id;
        var lastCurrentGroup;
        var askDel = this.Alerts.Ask("Are You Sure?");
        if(askDel == true) {
                this.mainService.findItemByIdAndDelete(itemID);
                 //must delete from result array as well
                if(this.mainService.searchmod == true) {
                this.mainService.currentGroup.items.splice(index,1);
                lastCurrentGroup = this.mainService.ResultGroup.lastCurrentGroup;
                this.rootScope.$broadcast("displayResult",null);
                this.mainService.ResultGroup.lastCurrentGroup = lastCurrentGroup;
            }
            this.mainService.saveData();
        }


    };

    /*
    * up folder or back from search result to last group status*/
    ItemsCtrl.prototype.up = function(){

        var parentGroup;

        if(this.mainService.searchmod == true) {
            parentGroup = this.mainService.currentGroup.lastCurrentGroup;
        }
        else {
            parentGroup = this.mainService
                .finditemById(this.mainService.currentGroup.parent,this.mainService.NewRoot);
        }

        if(!parentGroup) {
            parentGroup = this.mainService.NewRoot;
        }
        this.mainService.currentGroup = parentGroup ;
        this.mainService.searchmod = false;


    };

    /*
    * Display items inside group actually when clicking eye button on item list*/
    ItemsCtrl.prototype.ShowGroup = function(index) {

        this.mainService.searchmod = false;
        this.mainService.currentGroup = this.mainService.currentGroup.items[index];

    };

    angular.module("app").controller("ItemsCtrl",ItemsCtrl);

})();