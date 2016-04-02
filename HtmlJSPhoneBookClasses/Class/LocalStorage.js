var phoneBook = phoneBook || {};

phoneBook.LocalStorage = (function(){

    function LocalStorage() {

    }

    LocalStorage.prototype.reBuildChilds = function(newData , index ,numchilds) {

        var newItem = {};
        var newCurrent = {};
        for(var x=index+1 ; x < numchilds ; x++ ) {
            if(newData[x].type == "group") {
                newItem = {
                    name: newData[x].name ,
                    id: newData[x].id
                };
                dispatcher.emit("newgroup",newItem);
                if(newData[x].numchilds > 0) {
                    dispatcher.emit("setCurrentGroupLastGroup",null);
                    x = this.reBuildChilds(newData , x , newData[x].numchilds);
                }

            }
            else {
                newItem = {
                    firstName: newData[x].firstname,
                    lastName: newData[x].lastname,
                    phoneNumbers: newData[x].phonenumbers,
                    id: newData[x].id
                };
                dispatcher.emit("newcontact",newItem);
            }
        }
        return x-1;
    };

/*
 functions reBuildData and rebuildchild create objects Tree from Json String
     */
    LocalStorage.prototype.reBuildData = function(newDataArr) {

        var newItem = {};
        var newCurrent = {};
        for(var x=0 ; x< newDataArr.length ; x++) {
            if(newDataArr[x].type == "group") {
                newItem = {
                    name: newDataArr[x].name ,
                    id: newDataArr[x].id
                };
                dispatcher.emit("newgroup",newItem);
                if(newDataArr[x].numchilds > 0) {
                    dispatcher.emit("setCurrentGroupLastGroup",null);
                    x = this.reBuildChilds(newDataArr , x , newDataArr[x].numchilds);
                }

            }
            else {
                newItem = {
                    firstName: newDataArr[x].firstname,
                    lastName: newDataArr[x].lastname,
                    phoneNumbers: newDataArr[x].phonenumbers,
                    id: newDataArr[x].id
                };
                dispatcher.emit("newcontact",newItem);
            }

        }

    };

//Load Data from localstorage validate data exist if so and emit set root
    LocalStorage.prototype.loadPhoneBook = function(){

        var  myPhoneBookData = localStorage;
        var newData = myPhoneBookData.getItem("myPhoneBookData");
        if(newData!=null && newData!="") {
            newData = JSON.parse(newData);
            this.reBuildData(newData);
            dispatcher.emit("setRoot",null);
        }
        else {
            alert("No Data Found");
        }

    };

    //LocalStorage.prototype.removeParent = function() {
    //    for(var i=0 ; i<StartPoint.items.length ; i++) {
    //        StartPoint.items[i].parent = {};
    //        if(StartPoint.items[i].items != undefined) {
    //            this.removeParent(StartPoint.items[i]);
    //        }
    //    }
    //};

//Create Flat Array From Object Data Structure in order to save as Json to LocalStorage
    LocalStorage.prototype.CreateFlatArray = function(StartPoint ,flatArray) {

        if( StartPoint.items ) {
            StartPoint = StartPoint.items;
            for(var i=0 ; i< StartPoint.length ; i++) {
                if(StartPoint[i].items ) {
                    flatArray.push({
                        type: "group",
                        id: StartPoint[i].id,
                        name: StartPoint[i].name,
                        level: StartPoint[i].level,
                        numchilds: StartPoint[i].items.length,
                    });
                    this.CreateFlatArray(StartPoint[i] , flatArray);
                }
                else {
                    flatArray.push({
                        type: "contact",
                        id: StartPoint[i].id,
                        firstname: StartPoint[i].firstName,
                        lastname: StartPoint[i].lastName,
                        phonenumbers:StartPoint[i].phoneNumbers
                    });
                }
            }
        }

    };

//Run All Actions To Save Data To LocalStorage
    LocalStorage.prototype.SavePhoneBook = function(pbRoot) {

        var flatArray = [];
        this.CreateFlatArray(pbRoot , flatArray);
        var  myPhoneBookData = localStorage;
        myPhoneBookData.setItem("myPhoneBookData",JSON.stringify(flatArray));
        alert("Your Contacts & Groups had been Saved!");

    };


    return LocalStorage;

})();