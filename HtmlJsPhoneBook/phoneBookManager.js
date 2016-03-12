var phoneBook = phoneBook || {};

phoneBook.phoneBookManager = (function(){

    var root = createGroup("~",-1);
    var currentGroup = root;
    var nextId = 0;
    var groupsArr = [];
    var contactsArr = [];

    function getRoot() {
        return root;
    }

    function restoreDefault() {
        root = createGroup("~",-1);
        currentGroup = root;
    }

    function createPhoneBook(){
        addNewGroup("PhoneBook");
        groupsArr = getAllGroups();
        phoneBook.GUI.printGrouops(groupsArr);
    }

    function setCurrentGroup(gid) {

        findGroupAndChangeCurrentGroup(root,+gid);
        setCurrentGroupTitle();
        phoneBook.GUI.printContacts();

    }

    function findGroupAndChangeCurrentGroup(startPoint,gid) {
        for(var i=0 ; i<startPoint.items.length ; i++) {
            if(startPoint.items[i].type == "group") {
                if(startPoint.items[i].id == gid) {
                    currentGroup = startPoint.items[i];
                }
                else {
                    findGroupAndChangeCurrentGroup(startPoint.items[i] , gid  );
                }
            }
        }
    }



    function findItemAndDelete(startPoint,gid) {

        for(var i=0 ; i<startPoint.items.length ; i++) {
            if(startPoint.items[i].id == gid) {
                startPoint.items.splice(i,1);
                return;
            }
            else {
                if(startPoint.items[i].items) {
                    findItemAndDelete(startPoint.items[i] , gid  );
                }
            }
        }
    }

    function findItem(startPoint , itemToSearch) {

        for(var i=0 ; i<startPoint.items.length ; i++) {

            if(startPoint.items[i].type == "contact") {
                if(startPoint.items[i].firstName.toLowerCase() == itemToSearch.toLowerCase()
                    || startPoint.items[i].lastName.toLowerCase() == itemToSearch.toLowerCase()) {
                    contactsArr.push(startPoint.items[i]);
                }
            }

            if(startPoint.items[i].items) {
                findItem(startPoint.items[i] , itemToSearch );
            }
        }

    }

    function find(findValue) {
        contactsArr = [];
        findItem(root , findValue );
        setCurrentGroupTitle("results");
        return contactsArr;

    }

    function DeleteItem(iId){
        findItemAndDelete(root,iId);
        currentGroup = root.items[0];
    }

    function addNewContact(firstName,lastName,phoneNumbers){

        var contact = createContact(firstName, lastName, phoneNumbers , generateNextId());
        addItem(contact);

    }

    function addNewGroup(name){

        var group = createGroup(name,generateNextId());
        addItem(group);

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

    function createGroup(name,id,level) {
        var setLevel = level ? level : (currentGroup ? currentGroup.level + 1 : 1) ;
        var group = {
            id: id,
            name: name,
            items: [],
            parent: currentGroup,
            type: "group",
            level: setLevel
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
            setCurrentGroupTitle();
        }
    }

    function setNextId(nid){
        nextId = nid;
    }
    function generateNextId(){
        return nextId++;
    }

    function getGroups(item){
        for(var i=0; i < item.items.length ; i++) {
            if(item.items[i].type=="group") {
                groupsArr.push(item.items[i]);
                getGroups(item.items[i]);
            }
        }
    }

    function getAllGroups() {
        groupsArr = [];
        getGroups(root);
        return groupsArr;
    }

    function setCurrentGroupTitle(res) {
        if(res) {
            document.querySelector("#right h2").innerHTML = "Contacts > Search Result" ;
        }
        else {
            document.querySelector("#right h2").innerHTML = "Contacts > " + currentGroup.name;
        }

    }


    function getCurrentGroupContacts() {
        contactsArr = [];

        for(i=0 ; i<currentGroup.items.length ; i++) {
            if(currentGroup.items[i].type=="contact") {
                contactsArr.push(currentGroup.items[i]);
            }
        }

        return contactsArr;

    }



    return {
        addNewGroup: addNewGroup,
        getAllGroups: getAllGroups,
        setCurrentGroup: setCurrentGroup,
        setCurrentGroupTitle: setCurrentGroupTitle,
        addNewContact: addNewContact,
        getCurrentGroupContacts: getCurrentGroupContacts,
        createPhoneBook: createPhoneBook,
        DeleteItem: DeleteItem,
        find: find,
        restoreDefault: restoreDefault,
        createGroup: createGroup,
        addItem: addItem,
        getRoot: getRoot,
        createContact: createContact,
        setNextId: setNextId,
    }

})();