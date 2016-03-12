var phoneBook = phoneBook || {};

phoneBook.localStorage = (function(){


    function reBuildChilds(newData , index ,numchilds) {
        var newitem = {};
        for(var x=index+1 ; x < numchilds ; x++ ) {
            if(newData[x].type == "group") {
                newitem = phoneBook.phoneBookManager.createGroup(
                    newData[x].name ,
                    newData[x].id ,
                    newData[x].level);
                phoneBook.phoneBookManager.addItem(newitem);
                x = reBuildChilds(newData , x , newData[x].numchilds);
                currentGroup = newitem;
            }
            else {
                newitem = phoneBook.phoneBookManager.createContact(
                    newData[x].firstname ,
                    newData[x].lastname ,
                    newData[x].phonenumbers ,
                    newData[x].id );
                phoneBook.phoneBookManager.addItem(newitem);
            }
        }
        return x-1;
    }


    function reBuildData(newDataArr) {
        var newitem = {};
        var nextId = -1;
        for(var x=0 ; x< newDataArr.length ; x++) {
            if(newDataArr[x].type == "group") {
                newitem = phoneBook.phoneBookManager.createGroup(
                    newDataArr[x].name ,
                    newDataArr[x].id ,
                    newDataArr[x].level);
                phoneBook.phoneBookManager.addItem(newitem);
                x = reBuildChilds(newDataArr , x , newDataArr[x].numchilds);
                currentGroup = newitem;
            }
            else {
                newitem = phoneBook.phoneBookManager.createContact(
                    newDataArr[x].firstname ,
                    newDataArr[x].lastname ,
                    newDataArr[x].phonenumbers ,
                    newDataArr[x].id );
                phoneBook.phoneBookManager.addItem(newitem);
            }

        }
    }

    function LoadPhoneBook() {
        var  myPhoneBookData = localStorage;
        var newData = myPhoneBookData.getItem("myPhoneBookData");
        newData = JSON.parse(newData);
        phoneBook.phoneBookManager.restoreDefault();
        reBuildData(newData);
        var groupArr = phoneBook.phoneBookManager.getAllGroups();
        phoneBook.GUI.printGrouops(groupArr);
        phoneBook.GUI.printContacts();
    }

    function removeParent(StartPoint){
        for(var i=0 ; i<StartPoint.items.length ; i++) {
            StartPoint.items[i].parent = {};
            if(StartPoint.items[i].items != undefined) {
                removeParent(StartPoint.items[i]);
            }
        }

    }

    function CreateFlatArray(StartPoint ,flatArray) {

        if( StartPoint.items ) {
            StartPoint = StartPoint.items;
            for(var i=0 ; i< StartPoint.length ; i++) {
                if(StartPoint[i].type == "group") {
                    flatArray.push({
                        type: StartPoint[i].type,
                        id: StartPoint[i].id,
                        name: StartPoint[i].name,
                        level: StartPoint[i].level,
                        numchilds: StartPoint[i].items.length,
                    });
                    CreateFlatArray(StartPoint[i] , flatArray);
                }
                else {
                    flatArray.push({
                        type: StartPoint[i].type,
                        id: StartPoint[i].id,
                        firstname: StartPoint[i].firstName,
                        lastname: StartPoint[i].lastName,
                        phonenumbers:StartPoint[i].phoneNumbers
                    });
                }
            }
        }

    }


    function SavePhoneBook() {
        var flatArray = [];
        var globalRoot = phoneBook.phoneBookManager.getRoot();
        removeParent(globalRoot);
        CreateFlatArray(globalRoot , flatArray);
        var  myPhoneBookData = localStorage;
        myPhoneBookData.setItem("myPhoneBookData",JSON.stringify(flatArray));
        alert("You Contacts & Groups had been Saved!");
    }


    return {
        LoadPhoneBook: LoadPhoneBook,
        SavePhoneBook: SavePhoneBook,
    }

})();