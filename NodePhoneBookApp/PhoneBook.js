var rl = require("readline-sync");
var fs = require('fs');

var Groups = [];
var Contacts = [];
var currentGroupId = null;
var uniqId = 0;
var nastedTreeGroup = "";

var menuList = [
    "1. Add New Contact",
    "2. Add New Group",
    "3. Change Current Group",
    "4. Print Current Group",
    "5. Print All Groups",
    "6. Find Item By Name",
    "7. Delete Item",
    "8. Exit App"
];

var ROOT_GROUP_ID = 1;

var MENU_ADD_NEW_CONTACT = 1;
var MENU_ADD_NEW_GROUP = 2;
var MENU_CHANGE_CURRENT_GROUP = 3;
var MENU_PRINT_CURRENT_GROUP = 4;
var MENU_PRINT_ALL_GROUPS = 5;
var MENU_FIND_ITEM = 6;
var MENU_DELETE_ITEM = 7;
var MENU_EXIT_APP = 8;

var TREE_MARKUP = "-";
var PHONEBOOK_FILE_NAME = "PhoneBook.txt";

function createUniqId() {
    ++uniqId;
    return uniqId;
}

function addNewGroup(groupId,groupName,groupParentId) {
    var groupObj = {
        groupId: groupId,
        groupName: groupName,
        groupParentId: groupParentId
    };

    Groups.push(groupObj);
    return groupId;
}

function addNewContact(contactId ,firstName ,lastName ,groupId, phoneNumbersArr) {
    var groupObj = {
        contactId: contactId,
        firstName: firstName,
        lastName: lastName,
        groupId: groupId,
        phoneNumbersArr: phoneNumbersArr
    };

    Contacts.push(groupObj);
    return true;
}

function findItem(findstring) {
    var totalMuches = 0;
    for(var i=0 ; i< Contacts.length ; i++) {
        if(Contacts[i].firstName.toLowerCase() === findstring.toLowerCase()
            ||
            Contacts[i].lastName.toLowerCase() === findstring.toLowerCase()) {
            console.log("Found Much in Contacts: " + Contacts[i].firstName + " " + Contacts[i].lastName);
            PrintArray(Contacts[i].phoneNumbersArr);
            totalMuches++;
        }
    }
    for(var i=0 ; i< Groups.length ; i++) {
        if(Groups[i].groupName.toLowerCase() === findstring.toLowerCase()) {
            console.log("Found Much in Groups: " + Groups[i].groupName);
            totalMuches++;
        }
    }
    if(totalMuches > 0) {
        console.log("Total: " + totalMuches + " Results");
    }
    else {
        console.log("The Item you Searched Could Not Be Found in all Phone Book Records");
    }
}

function removeContact(itemId) {
    var returnValue = false;
    for(var i=0 ; i<Contacts.length ; i++) {
        if(Contacts[i].contactId === itemId) {
            Contacts.splice(i,1);
            returnValue = true;
            break;
        }
    }
    return returnValue;
}

function removeGroup(itemId) {
    var returnValue = false;
    var DelChild;
    for(var i=0 ; i<Groups.length ; i++) {
        if(Groups[i].groupId === itemId) {
            DelChild = Groups[i].groupId;
            Groups.splice(i,1);
            removeGroup(DelChild);
            --i;
            returnValue = true;
        }
    }
    return returnValue;
}

function deleteItem(itemId) {
    var deleteId = parseInt(itemId);
    if(deleteId != NaN) {
        if(removeContact(deleteId)) {
            console.log("Contact No. "+deleteId+" Deleted!");
            clickAnyKey();
        }
        else {
            if(removeGroup(deleteId)) {
                console.log("Group No. " + deleteId + " Deleted!");
            }
            else {
                console.log("Item No." + deleteId + " Was Not Found in Phone Book!");
            }
        }
    }
    else {
        console.log("Delete item uses only Numeric Characters!");
        clickAnyKey();
    }
}

function promptDeleteItem() {
    var itemId = rl.question("Please Enter Item Id To Be Deleted: ");
    deleteItem(itemId);
}

function promptFindItem(){
    var itemName = rl.question("Please Enter Item Name To Search(e.g First or Last Name, Or Group Name): ");
    findItem(itemName);
}

function changeCurrentGroup(changeTo) {
    var returnValue = false;
    if(changeTo === "..") {
        if(Groups[getGroupIndex(currentGroupId)].groupParentId !== ROOT_GROUP_ID) {
            currentGroupId = Groups[getGroupIndex(currentGroupId)].groupParentId;
            returnValue = true;
        }
    }
    else {
        for(var i=0 ; i<Groups.length ; i ++) {
            if(Groups[i].groupParentId === currentGroupId) {
                if(changeTo.toLowerCase() === Groups[i].groupName.toLowerCase()) {
                    currentGroupId = Groups[i].groupId;
                    returnValue = true;
                    break;
                }
            }
        }
    }
    return returnValue;
}

function PrintArray(Arr){
    for(var i=0 ; i< Arr.length ; i++) {
        console.log(Arr[i]);
    }
}

function replaceAll(str, find, replace) {
    var returnStr = str;
    for(var i=0 ; i< str.length ; i++) {
        if(str[i] === find) {
            returnStr = returnStr.replace(find, replace);
        }
    }
    return returnStr;
}

function printGroupContacts(GroupId) {
    var ContactList = [];
    for(var i=0 ; i<Contacts.length ; i++) {
        if(Contacts[i].groupId === GroupId) {
            contactData = replaceAll(nastedTreeGroup, TREE_MARKUP, " ");
            contactData = contactData + Contacts[i].firstName + " " + Contacts[i].lastName;
            for(var pNumbers=0 ; pNumbers < Contacts[i].phoneNumbersArr.length ; pNumbers++) {
                contactData = contactData + " " + Contacts[i].phoneNumbersArr[pNumbers];
                if(pNumbers !== Contacts[i].phoneNumbersArr.length - 1) {
                    contactData = contactData + " ,";
                }
            }
            ContactList.push(contactData);
        }
    }
    if(ContactList.length > 0) {
        PrintArray(ContactList);
    }
    else {
        console.log("No Contacts Found");
    }
}

function getGroupIndex(GroupId) {
    var returnIndex = -1;
    for(var i=0 ; i<Groups.length ; i++) {
        if(Groups[i].groupId === GroupId) {
            returnIndex = i;
            break;
        }
    }
    return returnIndex;
}

function printCurrentGroup(GroupId) {
    var currentGroupIndex = getGroupIndex(GroupId);
    if(!currentGroupIndex) {
        console.log("Error: Group Not Found Error ID:0001");
        return false;
    }
    console.log("Current Group: #" + Groups[currentGroupIndex].groupId + " " + Groups[currentGroupIndex].groupName);
    printGroupContacts(GroupId);
    for(var i=0 ; i<Groups.length ; i++) {
        if(Groups[i].groupParentId == GroupId) {
            console.log("#" + Groups[i].groupId + " " + Groups[i].groupName);
            printGroupContacts(Groups[i].groupId);
        }
    }
}

function printAllGroups(GroupId) {
    nastedTreeGroup = nastedTreeGroup + TREE_MARKUP;
    for(var i=0 ; i<Groups.length ; i++) {
        if(Groups[i].groupParentId == GroupId) {
            console.log(nastedTreeGroup + "#" + Groups[i].groupId + " "  + Groups[i].groupName + " PA:" + Groups[i].groupParentId);
            printGroupContacts(Groups[i].groupId);
            printAllGroups(Groups[i].groupId);
            nastedTreeGroup = nastedTreeGroup.substr(0,nastedTreeGroup.length - 1);
        }
    }
}

function exitApp() {
    savePhoneBook();
    process.exit();
}

function savePhoneBook(){
    var fileObj = {
        groups: Groups,
        contacts: Contacts,
        uniqID: createUniqId(),
        currentGroupId: currentGroupId
    }
    fs.writeFileSync(PHONEBOOK_FILE_NAME, JSON.stringify(fileObj), 'utf8', function(){
        console.log("PhoneBook Saved To File!");
    });
}

function loadPhoneBookFromFile() {
    var data = fs.readFileSync(PHONEBOOK_FILE_NAME,'utf-8');
    fileObj = JSON.parse(data);
    Groups = fileObj.groups;
    Contacts = fileObj.contacts;
    uniqId  = fileObj.uniqID;
    currentGroupId = fileObj.currentGroupId;
}

function promptNewcontact(){
    var firstName,lastName;
    var yesno = "y";
    var PhoneNumbersArr = [];
    var phonenumber = "";
    firstName = rl.question("Please Enter Contact First Name: ");
    lastName = rl.question("Please Enter Contact Last Name: ");
    while(yesno.toLowerCase() === "y") {
        phonenumber = rl.question("Please Enter Contact Phone Number: ");
        PhoneNumbersArr.push(phonenumber);
        yesno = rl.question("Do You Want To Add Another Number(Y/N): ");
    }
    addNewContact(createUniqId() ,firstName ,lastName ,currentGroupId, PhoneNumbersArr);
    console.log("New Contact Was Creayed Under: " + Groups[getGroupIndex(currentGroupId)].groupName);
    clickAnyKey();
}

function promptNewGroup(){
    var newGroupName;
    newGroupName = rl.question("Please Enter New Group Name: ");
    var currentGroupName = Groups[getGroupIndex(currentGroupId)].groupName;
    currentGroupId = addNewGroup(createUniqId(),newGroupName,currentGroupId);
    console.log("The Group " + newGroupName + " was created under "
        + currentGroupName + " current group changed to " + newGroupName);
    clickAnyKey();
}

function promptchangeGroup() {
    var userAnswer;
    userAnswer = rl.question("Enter Group Name To Find. or '..' For Parent Group: ");
    if( !changeCurrentGroup(userAnswer) ) {
        console.log("Group Not Found! No Action Was Made");
    }
    console.log("Current Group: #"
        + currentGroupId + " " + Groups[getGroupIndex(currentGroupId)].groupName);
}

function processMenuCommand(actionId) {
    switch (actionId) {
        case MENU_ADD_NEW_CONTACT:
            promptNewcontact();
            break;
        case MENU_ADD_NEW_GROUP:
            promptNewGroup();
            break;
        case MENU_CHANGE_CURRENT_GROUP:
            promptchangeGroup();
            clickAnyKey();
            break;
        case MENU_PRINT_CURRENT_GROUP:
            printCurrentGroup(currentGroupId);
            clickAnyKey();
            break;
        case MENU_PRINT_ALL_GROUPS:
            printAllGroups(0);
            clickAnyKey();
            break;
        case MENU_FIND_ITEM:
            promptFindItem();
            clickAnyKey();
            break;
        case MENU_DELETE_ITEM:
            promptDeleteItem();
            clickAnyKey();
            break;
        case MENU_EXIT_APP:
            exitApp();
            break;
        default: //do nothing
            break;
    }
    printMenu();
}

function printMenu() {
    for(var i=0 ; i<menuList.length ; i++) {
        console.log(menuList[i]);
    }
    var action = rl.question("What Would you like to do?");
    if(Number(action) === NaN) {
        PrintMenu();
    }
    else {
        processMenuCommand(Number(action));
    }
}

function clickAnyKey(){
    rl.question("Click Enter To Continue");
}

function initApp() {
    loadPhoneBookFromFile();
    printMenu();
}

initApp();