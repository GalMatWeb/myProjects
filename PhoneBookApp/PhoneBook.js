var rl = require("readline-sync");
var fs = require('fs');
var Contacts = [];
var Groups = [];
var TotalLength = 0;
var CurrentGroup = 0;
var FirstGroupID = 0;
var ResultArray = new Array(1,1); // id For Action , Type Group(1) Or Contact(2)
var menu = ["1.Add New Group","2.Add New Contact","3.Change Current Group","4.Print Curent Group","5.Print All","6.Find","7.Delete Item","8.Exit", "9.load file" , "10.Write To File"];

// ****** Objects
function GroupObj(){
    this.id=0;
    this.GroupName = "Phone Book";
    this.ParentId = 0;
}
function PersonObj(){
    this.id = 0;
    this.FirstName = "";
    this.LastName = "";
    this.PhoneNumbers = [];
    this.GroupId = 0;
}

function IncreassId(){
    TotalLength++;
}

function addNewGroup(GroupId,GroupName,ParentID){
    var obj = new GroupObj();
    obj.GroupName = GroupName;
    obj.ParentId = ParentID;
    obj.id = GroupId;
    Groups.push(obj);
    CurrentGroup = GroupId;
}


function addNewContact(FirstName, LastName, PhoneNumbers,ContactId , GroupId){
    var obj = new PersonObj();
    obj.FirstName = FirstName;
    obj.LastName = LastName;
    obj.id = ContactId;
    obj.GroupId = GroupId;
    obj.PhoneNumbers = PhoneNumbers;
    Contacts.push(obj);
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
    if(typeof GroupId === 'string') {
        if(GroupId == "..") {
            CurrentGroup = Groups[GetGroupIndex(CurrentGroup)].ParentId;
        }
        else{
            ResGroupId = GetGroupIdByName(GroupId.toLowerCase());
            if(ResGroupId===0) {
                console.log("No mach Found...");
            }
            else {
                CurrentGroup = ResGroupId;
            }
        }

    }
    else {
        CurrentGroup = GroupId;
    }
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
    ResultArray.push(GroupId,2);
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
    Contacts.splice(DeleteContactIndex,1);
}

function DeleteItem(ItemId){
    var delType = 0;
    for(var i=0;i<Groups.length;i++) {
        if( Groups[i].id == ItemId ) {
            delType = 1;
        }
    }
    if(delType==0) {
        RemoveContact(ItemId);
    }
    else {
        RemoveGroup(ItemId,0);
    }
}

function PrintAllContacts(GroupId){
    var consoleString = "";
    var Arr;
    for(var x = 0 ; x < Contacts.length ;x++) {
        if(Contacts[x].GroupId==GroupId){
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

function PrintAllGroups(currIndex){
    var TempCurrGroup = Groups[currIndex].id;
    var i = 0;
    var printVal = "";
    for(i = 0 ; i < Groups.length ;i++) {
        if(Groups[i].ParentId == TempCurrGroup ){
            printVal = printVal + GetGroup(i) + "\n";
            printVal = printVal + PrintAllContacts(Groups[i].id) + "\n";
            printVal = printVal  + PrintAllGroups(i);
        }
    }
    return printVal;
}

function findItem(StringKey,actionType) {
    var retVal= false;
    for(var i=0;i<Groups.length;i++) {
        if(Groups[i].GroupName.toLowerCase() == StringKey){
            if(actionType==1) {
                console.log(Groups[i].GroupName);
                retVal = true;
            }
        }
        if(actionType==0) {
            if(Groups[i].id==StringKey)
                retVal = true;
        }
    }

    for(i=0;i<Contacts.length;i++) {
        if (Contacts[i].FirstName.toLowerCase() == StringKey
            || Contacts[i].LastName.toLowerCase() == StringKey) {
            if (actionType == 0) {
                console.log(Contacts[i].FirstName + " " + Contacts[i].LastName);
                retVal = true;
            }
        }
        if (actionType == 0) {
            if (Contacts[i].id == StringKey)
                retVal = true;
        }
    }
    return retVal;
}

function ClickAnyKey(){
    rl.question("Click Enter To Continue ");
}



function CreateFiles(){
    fs.writeFileSync('PhoneBookGroups.txt', JSON.stringify(Groups), 'utf8', function(){
        //..
    });
    fs.writeFileSync('PhoneBookContact.txt', JSON.stringify(Contacts), 'utf8', function(){
        //..
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



function TakeAction(ActionId){
    var fname="",lname="";
    var numbers = [];
    var newnumber = "";
    var yn = false;
    var gname = "";
    var findkey = "";
    switch(ActionId) {
        case 1:
            fname = rl.question("Please Enter Contacts First Name: ");
            lname = rl.question("Please Enter Contacts Last Name: ");
            newnumber = rl.question("Please Enter Contacts Phone Number: ");
            numbers.push(newnumber);
            newnumber = rl.question("Do You Want To Add another number? (Y/N) ");
            if(newnumber.toLowerCase()=="y") {
                newnumber = rl.question("Please Enter Contacts Phone Number: ");
                numbers.push(newnumber);
                IncreassId();
                addNewContact(fname,lname,numbers,TotalLength,CurrentGroup);
                console.log("New Contact Added!");
                ClickAnyKey();
            }
            else {
                IncreassId();
                addNewContact(fname,lname,numbers,TotalLength,CurrentGroup);
                console.log("New Contact Added!");
                ClickAnyKey();
            }
            break;
        case 2:
            gname = rl.question("Please Enter Group Name: ");
            IncreassId();
            addNewGroup(TotalLength,gname,CurrentGroup);
            console.log("Group '"+gname+"' Added");
            ClickAnyKey();
            break;
        case 3:
            gid = rl.question("Please Enter Group Id or Group Name or '..' for Parent: ");
            ChangeGroup(gid);
            console.log("Current Group Change To: " + Groups[GetGroupIndex(CurrentGroup)].GroupName);
            ClickAnyKey();
            break;
        case 4:
            console.log(PrintAllGroups(GetGroupIndex(CurrentGroup)));
            ClickAnyKey();
            break;
        case 5:
            console.log( GetGroup(0));
            console.log(PrintAllGroups(0));
            ClickAnyKey();
            break;
        case 6:
            findkey = rl.question("Please Enter Contact First name OR Last Name OR Group Name ToSearch: ");
            if(!findItem(findkey.toLowerCase(),1)) {
                console.log("No Mach Found");
            }
            ClickAnyKey();
            break;
        case 7:
            findkey = rl.question("Please Enter Item Id To Delete: ");
            findkey = parseInt(findkey);
            if(findItem(findkey,0)) {
                DeleteItem(findkey);
            }
            else {
                console.log("No Much Found");
            }
            break;
        case 8:
            process.exit();
        case 9:
            break;
        case 10:
            CreateFiles();
            break;
        default:
            console.log("no Such Action ");
            ClickAnyKey();
            break;
    }
    PrintMenu();
}

function PrintMenu(){
    //console.log('\033[2J');
    for(var i=0;i<menu.length;i++) {
        console.log(menu[i]);
    }
    var action = rl.question("What Would you like to do?");
    if(Number(action)==NaN) {
        PrintMenu();
    }
    else {
        TakeAction(Number(action));
    }
}

function AutoRun(){
    addContact("PhoneBook-Gal1","matheys",["0502770953","048110082"]);
    addContact("PhoneBook-Gal2","matheys",["0502770953","048110082"]);

    addGroup("Sub1"); // Create Root Static
    addContact("Sub1-Gal1","matheys",["0502770953","048110082"]);
    addContact("Sub1-Gal2","matheys",["0502770953","048110082"]);

    addGroup("Sub2"); // Create Root Static
    addContact("Sub2-Gal1","matheys",["0502770953","048110082"]);
    addContact("Sub2-Gal2","matheys",["0502770953","048110082"]);

    addGroup("Sub3"); // Create Root Static
    addContact("Sub3-Gal1","matheys",["0502770953","048110082"]);
    addContact("Sub3-Gal2","matheys",["0502770953","048110082"]);

    addGroup("Sub4"); // Create Root Static
    addContact("Sub4-Gal1","matheys",["0502770953","048110082"]);
    addContact("Sub4-Gal2","matheys",["0502770953","048110082"]);
    //PrintMenu();
    //CreateFiles();
}

function StartApp(){
    console.log("Loading Group Data Files....\n");
    LoadGroupFile("PhoneBookGroups.txt");
    console.log("Group Data Files Loaded!\n");
    console.log("Loading Contacts Data Files....\n");
    LoadContactFile("PhoneBookContact.txt");
    console.log("Contacts Data Files Loaded!\n");
    PrintAllGroups(0);
    PrintMenu();
}

StartApp();