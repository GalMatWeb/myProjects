var rl = require('readline-sync');
var fs = require('fs');

var root = createGroup("~");
var currentGroup = root;
var nextId = 0;
var searchType = null;

var COMPARE_ID = 1;
var COMPARE_NAMES = 2;

var Menu = {
    ADD_NEW_CONTACT: 1,
    ADD_NEW_GROUP: 2,
    CHANGE_CURRENT_GROUP: 3,
    PRINT: 4,
    PRINT_ALL: 5,
    FIND: 6,
    DELETE: 7,
    EXIT: 8
};

function printMenu() {
    while (true) {
        console.log();
        console.log("1) Add new contact");
        console.log("2) Add new group");
        console.log("3) Change current group");
        console.log("4) Print");
        console.log("5) Print All");
        console.log("6) Find");
        console.log("7) Delete");
        console.log("8) Exit");
        handleCommand(readNonEmptyString("Please Choose Mneu Item: "));
    }
}


function reBuildData(newData) {
    var newitem = {};
    for(var i=0 ; i<newData.length ; i++) {
        if(newData[i].type == "group") {
            newitem = createGroup(newData[i].name , newData[i].id);
        }
        else {
            newitem = createContact(newData[i].firstname , newData[i].lastname , newData[i].phonenumbers ,newData[i].id );
        }
        addItem(newitem);
        for(var x=i ; x < newData[i].numchilds ; x++ ) {
            if(newData[x].type == "group") {
                newitem = createGroup(newData[x].name , newData[i].id);
            }
            else {
                newitem = createContact(newData[x].firstname , newData[x].lastname , newData[x].phonenumbers ,newData[x].id );
            }
            addItem(newitem);
            i++;
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

function WritePhoneBookToFile() {
    var flatArray = [];
    root.parent = null;
    removeParent(root);
    CreateFlatArray(root , flatArray);

    fs.writeFileSync("phonebook.txt", JSON.stringify(flatArray), 'utf8', function(){
        console.log("PhoneBook Saved To File!");
    });
}


function LoadPhoneBookFromFile() {
    var newData = fs.readFileSync("phonebook.txt",'utf-8');
    newData = JSON.parse(newData);
    reBuildData(newData);
}



function run(){
    LoadPhoneBookFromFile();
    printMenu();
}

function handleCommand(line) {
    var command = parseInt(line);

    if (command == Menu.ADD_NEW_CONTACT) {
        addNewContact();
    }
    else if(command == Menu.ADD_NEW_GROUP) {
        addNewGroup();
    }
    else if(command == Menu.CHANGE_CURRENT_GROUP) {

        changeCurrentGroup();
    }
    else if(command == Menu.PRINT) {
        printGroup(currentGroup);
        print(currentGroup.items);
    }
    else if(command == Menu.PRINT_ALL) {
        print(root.items);
    }
    else if(command == Menu.FIND) {
        find();
    }
    else if(command == Menu.DELETE) {
        deleteItem();
    }
    else if(command == Menu.EXIT) {
        exit();
    }
}

function addNewContact(){
    var firstName = readNonEmptyString("First Name: ");
    var lastName = readNonEmptyString("Last Name: ");

    var phoneNumbers = [];
    while(true){
        var phoneNumber = rl.question("Phone Number (press enter when done): ");
        if(!phoneNumber){
            break;
        }

        phoneNumbers.push(phoneNumber);
    }

    var contact = createContact(firstName, lastName, phoneNumbers , generateNextId());
    addItem(contact);
}

function addNewGroup(){
    var name = readNonEmptyString("Name: ");
    var group = createGroup(name,generateNextId());
    addItem(group);
}

function changeCurrentGroup(){
    console.log("Current Group: " + currentGroup.name);
    var name = readNonEmptyString("Name: ");
    if(name == ".."){
        if(!currentGroup.parent){
            return;
        }

        currentGroup = currentGroup.parent;
    }
    else {
        searchType = 1;
        var sunGroup = findItem(currentGroup, name , COMPARE_NAMES);
        searchType = null;
        if(!sunGroup){
            console.log("Group with name " + name + " was not found")
        }
        else {
            currentGroup = sunGroup;
            console.log("Group with name " + name + " was found currentGroup is " + name);
        }
    }}

function print(items) {
        for(var i=0 ; i<items.length ; i++) {
            if(items[i].type == "group"){
                printGroup(items[i]);
            }
            else{
                printContact(items[i]);
            }
            if(items[i].items) {
                print(items[i].items);
            }

        }
}

function find(){
    var itemtoFind = readNonEmptyString("Enter Group Name or Contact First/Last Name To Find: ");
    var resItem;
    resItem = findItem(root , itemtoFind ,COMPARE_NAMES );
    if(resItem) {
        if(resItem.type == "group") {
            printGroup(resItem);
        }
        else {
            printContact(resItem);
        }
    }
    else {
        console.log("group not found");
    }
}

function findItem(startPoint , itemToSearch , compareType) {

    for(var i=0 ; i<startPoint.items.length ; i++) {
               if(compareType == COMPARE_ID) {
                   if(startPoint.items[i].id == itemToSearch) {
                       return startPoint.items[i];
                   }
               }
               else {
                   if(startPoint.items[i].type == "group"){
                       if(startPoint.items[i].name.toLowerCase() == itemToSearch.toLowerCase()) {
                           return startPoint.items[i];
                       }
                   }
                   else{
                       if(startPoint.items[i].firstName.toLowerCase() == itemToSearch.toLowerCase()
                           || startPoint.items[i].lastName.toLowerCase() == itemToSearch.toLowerCase()) {
                           return startPoint.items[i];
                       }
                   }
               }
                if(startPoint.items[i].length > 0 && searchType) {
                    findItem(startPoint.items[i] , itemToSearch , compareType );
                }
                else
                {
                    return null;
                }

            }

        }


function deleteItem(){
  var itemTofind = readNonEmptyString("Please Eneter item ID to Delete - ITEM WILL DELETE ALL RELATED OBJECTS!!!: ");
  var itemToDeltype = "", name = "";
  var itemToDel = findItem(root , +itemTofind , COMPARE_ID);
  if(itemToDel) {
      itemToDeltype  = itemToDel.type;
      if(itemToDeltype=="group") {
          name = itemToDel.name;
      }
      else {
          name = itemToDel.firstName + " " + itemToDel.lastName;
      }
      itemToDelP = itemToDel.parent;
      for(var i=0 ; i< itemToDelP.items.length ; i++) {
          if(itemToDelP.items[i] == itemToDel ) {
              itemToDelP.items.splice(i,1) ;
              break;
          }
      }
      //delete itemToDel;
      console.log("Item of type "+itemToDeltype+": " + name +" was Found And Deleted");
  }
    else {
      console.log("Item " + itemTofind + " was Not Found");
  }
}

function removeParent(StartPoint){
    for(var i=0 ; i<StartPoint.items.length ; i++) {
        StartPoint.items[i].parent = {};
        if(StartPoint.items[i].items != undefined) {
            removeParent(StartPoint.items[i]);
        }
    }

}

function exit(){
    WritePhoneBookToFile();
    process.exit(0);
}

function createContact(firstName, lastName, phoneNumbers , id) {
    var contact = {
        id: id,
        firstName: firstName,
        lastName: lastName,
        phoneNumbers: phoneNumbers,
        parent: currentGroup,
        type: "contact",
    };

    return contact;
}

function createGroup(name,id) {
    var group = {
        id: id,
        name: name,
        items: [],
        parent: currentGroup,
        type: "group",
    };

    return group;
}

function addItem(item) {
    if(currentGroup === item){
        throw Error("Item with id " + item.id + " was already added to group: " + currentGroup.id);
    }

    currentGroup.items.push(item);

    item.parent = currentGroup;

    if(item.type == "group") {
        currentGroup = item;
    }
}

function generateNextId(){
    return nextId++;
}

function printGroup(group){
    console.log("Group Name: " + group.name + " ,Parent Name: " + (group.parent ? group.parent.name : "root"));
}

function printContact(contact){
    var consoleStrong;
    consoleStrong = "#" + contact.id + " " +contact.firstName + " " + contact.lastName;
    for(var i=0 ; i< contact.phoneNumbers.length ; i++) {
        consoleStrong = consoleStrong + " " + contact.phoneNumbers[i];
        if(i < contact.phoneNumbers.length - 1) {
            consoleStrong = consoleStrong + " ,";
        }
    }
    console.log(consoleStrong);
}

function readNonEmptyString(message) {
    while(true) {
        var line = rl.question(message).trim();
        if(line){
            return line;
        }
    }
}

run();
