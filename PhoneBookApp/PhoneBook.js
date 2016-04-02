/* Link To Git:
    https://github.com/GalMatWeb/myProjects/tree/master/PhoneBookApp
 */

var rl = require("readline-sync");
var fs = require('fs');
var Contacts = [];
var Groups = [];
var TotalLength = 0;
var CurrentGroup = 0;
var TreeDisplay = "";
var menu = [
    "1.Add New Contact",
    "2.Add New Group",
    "3.Change Current Group",
    "4.Print Curent Group",
    "5.Print All",
    "6.Find",
    "7.Delete Item",
    "8.Exit"
    ];
var GROUPS_FILENAME = "PhoneBookGroups.txt";
var CONTACTS_FILENAME = "PhoneBookContact.txt";

var MENU_ITEM_ADDNEWGROUP = 1;
var MENU_ITEM_ADDNEWCONTACT = 2;
var MENU_ITEM_CHANGECURENTGROUP = 3;
var MENU_ITEM_PRINTCURENTGROUP = 4;
var MENU_ITEM_PRINTALL = 5;
var MENU_ITEM_FIND = 6;
var MENU_ITEM_DELETEITEM = 7;
var MENU_ITEM_EXIT = 8;

var PRINTALL = "ALL";
var PRINTKIDS = "KIDS";


function IncreassId(){
    TotalLength++;
}

function CreateSPaceString(strString) {
    var retVal = "";
    for(var i=0;i<strString.length;i++) {
        retVal = retVal + " ";
    }
    return retVal;
}

function addNewGroup(GroupId,GroupName,ParentID){
    var Obj = {
        GroupName: ParentID,
        ParentId: ParentID,
        id: GroupId
    };
    Groups.push(Obj);
    CurrentGroup = GroupId;
}

function addNewContact(FirstName, LastName, PhoneNumbers,ContactId , GroupId){
    var Obj = {
        FirstName: FirstName,
        LastName: LastName,
        ContactId: ContactId,
        GroupId: GroupId,
        PhoneNumbers: PhoneNumbers
    };
    Contacts.push(Obj);
}

function GetGroupIdByName(GroupName) {
    var i = 0;
    var retVal=0;
    for(i = 0 ; i < Groups.length ;i++) {
        if (Groups[i].GroupName == GroupName){
            retVal = Groups[i].id;
            break;
        }

    }
    return retVal;
}

function GetGroupIndex(GroupId) {
    var i = 0;
    var retVal = -1;
    for(i = 0 ; i < Groups.length ;i++) {
        if (Groups[i].id == GroupId) {
            retVal = i;
            break;
        }
    }
    return retVal;
}


function ChangeGroup(GroupId) {
    var ResGroupId = -1;
    if( parseInt(GroupId) === NaN) {
        if(GroupId === "..") {
            CurrentGroup = Groups[GetGroupIndex(CurrentGroup)].ParentId;
        }
        else{
            for(var searchIndex=0;searchIndex < Groups.length;searchIndex++){
                if((Groups[searchIndex].GroupName).toLowerCase()===GroupId.toLowerCase()){
                    CurrentGroup = Groups[searchIndex].id;
                    return 1;
                }
            }
        }

    }
    else {
        for(var searchIndex=0;searchIndex < Groups.length;searchIndex++){
            if(Groups[searchIndex].id === +GroupId){
                ResGroupId = Groups[searchIndex].id;
            }
        }
    }
    CurrentGroup = ResGroupId;
    return ResGroupId;
}

function RemoveGroupContacts(GroupId){
    for(var c=0;c<Contacts.length;c++){
        if(Contacts[c].GroupId == GroupId){
            RemoveContact(Contacts[c].id);
        }
    }
}

function RemoveGroup(GroupId,StartIndex){
    var DeleteGroupIndex = "";
    var tempID;
    DeleteGroupIndex = GetGroupIndex(GroupId);
    tempID = Groups[DeleteGroupIndex].id;
    Groups.splice(DeleteGroupIndex,1);
    for(var i=StartIndex;i<Groups.length;i++) {
        if(Groups[i].ParentId == tempID) {
            RemoveGroupContacts(GroupId);
            RemoveGroup(Groups[i].id);
            i--;
        }
    }


}

function RemoveContact(ContactId){

    var DeleteContactIndex = GetContactIndex(ContactId);
    if(DeleteContactIndex)
        Contacts.splice(DeleteContactIndex,1);
}

function DeleteItem(ItemId){
    var tmpCurrentGroup = 0;
    var delType = 0;
    for(var i=0;i<Groups.length;i++) {
        if( Groups[i].id == ItemId ) {
            delType = 1;
            tmpCurrentGroup = Groups[i].ParentId;
        }
    }
    if(delType==0) {
        RemoveContact(ItemId);
    }
    else {
        RemoveGroup(ItemId,0);
        CurrentGroup = tmpCurrentGroup;
    }
}

function PrintAllContacts(GroupId){
    var consoleString = "";
    var Arr;
    for(var x = 0 ; x < Contacts.length ;x++) {
        if(Contacts[x].GroupId==GroupId){
            consoleString = consoleString + CreateSPaceString(TreeDisplay);
            consoleString = consoleString +" " + Contacts[x].FirstName;
            consoleString = consoleString + " " + Contacts[x].LastName;
            consoleString = consoleString + " id=" + Contacts[x].id;
            consoleString = consoleString + " ";
            Arr = Contacts[x].PhoneNumbers;
            for(var z = 0; z < Arr.length ; z++){
                consoleString = consoleString  + Arr[z] + ",";
            }
            consoleString = consoleString + "\n";
        }

    }
    if(consoleString=="") {
        consoleString = "No contact Found";
    }
    return consoleString;
}

function GetGroup(Groupindex) {
    return "Group Name:"  + Groups[Groupindex].GroupName + ", Id:" + Groups[Groupindex].id + ", Parent: " + Groups[Groupindex].ParentId;
}

function GetContactIndex(ContactId) {
    var i = 0;
    for(i = 0 ; i < Contacts.length ;i++) {
        if (Contacts[i].id == ContactId)
            break;
    }
    return i;
}

function PrintAllGroups(currIndex,printType){
    var TempCurrGroup = Groups[currIndex].id;
    var i = 0;
    var printVal = "";
    if(printType === PRINTALL) {
        TreeDisplay = TreeDisplay + "-";
    }
    else {
        TreeDisplay =  "-";
    }

    for(i = 0 ; i < Groups.length ;i++) {
        if(Groups[i].ParentId == TempCurrGroup ){
            printVal = printVal + TreeDisplay;
            printVal = printVal + GetGroup(i) + "\n";
            printVal = printVal + PrintAllContacts(Groups[i].id) + "\n";
            if(printType===PRINTALL) {
                printVal = printVal  + PrintAllGroups(i,printType);
                TreeDisplay = TreeDisplay.substring(0,TreeDisplay.length - 1);
            }

        }
    }

    return printVal;
}

function findItem(StringKey) {
    var retVal= false;
    for(var i=0;i<Groups.length;i++) {
        if(Groups[i].GroupName.toLowerCase() === StringKey.toLocaleLowerCase()){
            console.log("Group Found:" + Groups[i].GroupName);
            retVal = true;
        }
    }

    for(var i=0;i<Contacts.length;i++) {
        if (Contacts[i].FirstName.toLowerCase() === StringKey
            || Contacts[i].LastName.toLowerCase() === StringKey) {
            console.log("Contact Found: " + Contacts[i].FirstName + " " + Contacts[i].LastName);
            retVal = true;
        }
    }
    return retVal;
}

function ClickAnyKey(){
    rl.question("Click Enter To Continue ");
}

function UpdateFiles(){
    fs.writeFileSync(GROUPS_FILENAME, JSON.stringify(Groups), 'utf8', function(){
        console.log("Group File Updated!");
    });
    fs.writeFileSync(CONTACTS_FILENAME, JSON.stringify(Contacts), 'utf8', function(){
        console.log("Contact File Updated!");
    });
}



function LoadGroupFile(FileName){
    var ObjectL = [];
    var data;
    data = fs.readFileSync(FileName,'utf-8');
    ObjectL = JSON.parse(data);
    for(var ReBuildGroupIndex=0;ReBuildGroupIndex < ObjectL.length;ReBuildGroupIndex++) {
        addNewGroup(ObjectL[ReBuildGroupIndex].id ,ObjectL[ReBuildGroupIndex].GroupName,ObjectL[ReBuildGroupIndex].ParentId );
        if(ObjectL[ReBuildGroupIndex].id > TotalLength)
            TotalLength = ObjectL[ReBuildGroupIndex].id;
    }
}

function LoadContactFile(FileName){
    var ObjectL = [];
    var LocalPhoneNembers =[];
    data = fs.readFileSync(FileName,'utf-8');
    ObjectL = JSON.parse(data);
    for(var NewContactIndex=0;NewContactIndex < ObjectL.length;NewContactIndex++) {
                LocalPhoneNembers  = ObjectL[NewContactIndex].PhoneNumbers;
        addNewContact(ObjectL[NewContactIndex].FirstName ,ObjectL[NewContactIndex].LastName,LocalPhoneNembers,ObjectL[NewContactIndex].id , ObjectL[NewContactIndex].GroupId);
        if(ObjectL[NewContactIndex].id > TotalLength)
            TotalLength = ObjectL[NewContactIndex].id;
        }
}

function ProccessMenuCommand(ActionId){
    var firstName="",lastName="";
    var numbersArr = [];
    var newNumber = "";
    var newGroupName = "";
    var findKey = "";
    var changeGroupResult=0;
    switch(ActionId) {
        case MENU_ITEM_ADDNEWGROUP:
            firstName = rl.question("Please Enter Contacts First Name: ");
            lastName = rl.question("Please Enter Contacts Last Name: ");
            newNumber = rl.question("Please Enter Contacts Phone Number: ");
            numbersArr.push(newNumber);
            addnewNumber = "Y";
            while(addnewNumber.toLowerCase()=="y") {
                addnewNumber = rl.question("Do You Want To Add another number? (Y/N) ");
                if(addnewNumber.toLowerCase()=="y") {
                    newNumber = rl.question("Please Enter Contacts Phone Number: ");
                    numbersArr.push(newNumber);
                }
            }
            IncreassId();
            addNewContact(firstName,lastName,numbersArr,TotalLength,CurrentGroup);
            console.log("New Contact Added!");
            UpdateFiles();
            ClickAnyKey();
            break;
        case MENU_ITEM_ADDNEWCONTACT:
            newGroupName = rl.question("Please Enter Group Name: ");
            IncreassId();
            addNewGroup(TotalLength,newGroupName,CurrentGroup);
            console.log("Group '"+newGroupName+"' Added");
            UpdateFiles();
            ClickAnyKey();
            break;
        case MENU_ITEM_CHANGECURENTGROUP:
            gid = rl.question("Please Enter Group Id or Group Name or '..' for Parent: ");
            changeGroupResult = ChangeGroup(gid);
            if(changeGroupResult) {
                console.log("Current Group Change To: " + Groups[GetGroupIndex(CurrentGroup)].GroupName);
            }
            else {
                console.log("Group Was Not Found!");
            }
            ClickAnyKey();
            break;
        case MENU_ITEM_PRINTCURENTGROUP:
            console.log(PrintAllGroups(GetGroupIndex(CurrentGroup),PRINTKIDS));
            ClickAnyKey();
            break;
        case MENU_ITEM_PRINTALL:
            console.log( GetGroup(0));
            console.log(PrintAllGroups(0,PRINTALL));
            ClickAnyKey();
            break;
        case MENU_ITEM_FIND:
            findKey = rl.question("Please Enter Contact First name OR Last Name OR Group Name ToSearch: ");
            if(!findItem(findKey.toLowerCase())) {
                console.log("No Mach Found");
            }
            ClickAnyKey();
            break;
        case MENU_ITEM_DELETEITEM:
            findKey = rl.question("Please Enter Item Id To Delete: ");
            DeleteItem(+findKey);
            UpdateFiles();
            break;
        case MENU_ITEM_EXIT:
            process.exit();
        default:
            console.log("no Such Action ");
            ClickAnyKey();
            break;
    }
    PrintMenu();
}

function PrintMenu(){
    console.log('\033[2J');
    for(var i=0;i<menu.length;i++) {
        console.log(menu[i]);
    }
    var action = rl.question("What Would you like to do?");
    if(Number(action)==NaN) {
        PrintMenu();
    }
    else {
        ProccessMenuCommand(Number(action));
    }
}

function StartApp(){
    console.log("Loading Group Data Files....\n");
    LoadGroupFile(GROUPS_FILENAME);
    console.log("Group Data Files Loaded!\n");
    console.log("Loading Contacts Data Files....\n");
    LoadContactFile(CONTACTS_FILENAME);
    console.log("Contacts Data Files Loaded!\n");
    PrintMenu();
}

StartApp();