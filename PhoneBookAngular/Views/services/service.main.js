(function(){
    'use strict';
    /*
    * Main Service Mange Data and set Array for displaying Delete and search*/
    function Main($interval,$http) {
        var self = this;
        this.searchmod = false;
        this.NewPhoneBook = new phoneBook.Main();
        var id = this.NewPhoneBook.generateNextId();
        this.http = $http;
        this.NewRoot = new phoneBook.Group("Home",id);
        this.NewPhoneBook.setCurrentGroup(this.NewRoot);
        this.currentGroup = this.NewRoot;
        this.ResultGroup = {};
        this.loadData(this);

    }
    //call server and load data only when app loads
    Main.prototype.loadData = function(self){
        var flatarry = [];
        var newData = "";
        this.http({
            method: 'GET',
            url: '/loadData'
        }).then(function successCallback(response) {
            newData = response.data;
            flatarry = self.reBuildData(newData);
            self.currentGroup = self.NewRoot;
        }, function errorCallback(response) {
            console.log(response);
        });
    };
    //save data after delete or new item added
    Main.prototype.saveData = function(){
        var flatarry = [];
        this.CreateFlatArray(this.NewRoot,flatarry);
        this.http({
            method: 'POST',
            url: '/saveData',
            data: flatarry,
        }).then(function successCallback(response) {
            console.log("ok");
        }, function errorCallback(response) {
            console.log(response);
        });

    };
    //set flat array for saving
    Main.prototype.CreateFlatArray = function(StartPoint ,flatArray) {

        if( StartPoint.items ) {
            StartPoint = StartPoint.items;
            for(var i=0 ; i< StartPoint.length ; i++) {
                if(StartPoint[i].items ) {
                    flatArray.push({
                        type: "group",
                        id: StartPoint[i].id,
                        name: StartPoint[i].name,
                        parent: StartPoint[i].parent,
                        numchilds: StartPoint[i].items.length
                    });
                    if(StartPoint[i].items.length > 0) {
                        this.CreateFlatArray(StartPoint[i] , flatArray);
                    }
                }
                else {
                    flatArray.push({
                        type: "contact",
                        id: StartPoint[i].id,
                        parent: StartPoint[i].parent,
                        firstname: StartPoint[i].firstName,
                        lastname: StartPoint[i].lastName,
                        phonenumbers:StartPoint[i].phoneNumbers
                    });
                }
            }
        }

    };

    //look down on rebuildData
    Main.prototype.reBuildChilds = function(newData , index ,numchilds,insertToGroup) {

        var newItem = {};
        for(var x=index ; x < (index+numchilds) ; x++ ) {
            if(this.NewPhoneBook.nextid < newData[x].id) {
                this.NewPhoneBook.nextid = newData[x].id;
            }
            if(newData[x].type == "group") {
                newItem = new phoneBook.Group(newData[x].name,newData[x].id);
                newItem.addItem(insertToGroup);
                if(newData[x].numchilds > 0) {
                    x = this.reBuildChilds(newData , x+1 , newData[x].numchilds,newItem);
                }
            }
            else {
                newItem = new phoneBook.Contact(
                    newData[x].firstname,
                    newData[x].lastname,
                    newData[x].phonenumbers,
                    newData[x].id);
                newItem.addItem(insertToGroup);
            }
        }

        return x-1;
    };

    /*
     functions reBuildData and rebuildchild create objects Tree from Server String Data
     reBuildData start building at currentGroup
     */
    Main.prototype.reBuildData = function(newDataArr) {
        var newItem;
        for(var x=0 ; x< newDataArr.length ; x++) {
            if(this.NewPhoneBook.nextid < newDataArr[x].id) {
                this.NewPhoneBook.nextid = newDataArr[x].id;
            }
            if(newDataArr[x].type == "group") {
                newItem = new phoneBook.Group(newDataArr[x].name,newDataArr[x].id);
                newItem.addItem(this.currentGroup);
                if(newDataArr[x].numchilds > 0) {
                    x = this.reBuildChilds(newDataArr ,x+1, newDataArr[x].numchilds,newItem);
                }
            }
            else {
                newItem = new phoneBook.Contact(
                    newDataArr[x].firstname,
                    newDataArr[x].lastname,
                    newDataArr[x].phonenumbers,
                    newDataArr[x].id);
                newItem.addItem(this.currentGroup);
            }

        }
        this.currentGroup = this.NewRoot;
    };

    //recursive search for item by id
    Main.prototype.finditemById = function(parentID,Pointer) {

        for(var i=0 ; i<Pointer.items.length ; i++) {
            if(Pointer.items[i].id == parentID) {
                return Pointer.items[i];
            }
            else {
                if(Pointer.items[i].items) {
                    this.finditemById(parentID,Pointer.items[i]);
                }
            }
        }

    };
    //recursice search for keyword (group name,contact names)
    Main.prototype.findItems = function(ResultGroup,StartPoint,keyWord){
        for(var i=0 ; i<StartPoint.items.length ; i++) {
            if((StartPoint.items[i].name + "").toLowerCase()
                    .indexOf(keyWord.toLowerCase())!=-1 ||
                (StartPoint.items[i].firstName + "").toLowerCase()
                    .indexOf(keyWord.toLowerCase())!=-1 ||
                (StartPoint.items[i].lastName +"").toLowerCase()
                    .indexOf(keyWord.toLowerCase())!=-1) {
                ResultGroup.items.push(StartPoint.items[i]);
            }
            if(StartPoint.items[i].items) {
                this.findItems(ResultGroup,StartPoint.items[i],keyWord);
            }
        }
    };

    //recursive search and delete item by id
    Main.prototype.findItemByIdAndDelete = function(itemId,RootPosition){
        var StartPoint;
        if(RootPosition != undefined) {
            StartPoint = RootPosition;
        }
        else {
            StartPoint = this.NewRoot;
        }
        for(var i=0; i < StartPoint.items.length ; i++) {
            if(StartPoint.items[i].id == itemId) {
                StartPoint.items.splice(i,1);
                return;
            }
            if(StartPoint.items[i].items && StartPoint.items[i].items.length > 0) {
                this.findItemByIdAndDelete(itemId,StartPoint.items[i]);
            }
        }

    };
    //create/sets result Group and lunch findItems method
    Main.prototype.searchItems = function(keyWord){
        var StartPoint = this.NewRoot;
        this.ResultGroup = {
            name: "Search Result",
            id:-99,
            parent:null,
            items: [],
            lastCurrentGroup: this.currentGroup
        };
        this.findItems(this.ResultGroup,StartPoint,keyWord);
        this.currentGroup = this.ResultGroup;

    };

    angular.module("app").service("Main",Main);

})();