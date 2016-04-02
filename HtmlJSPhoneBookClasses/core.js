var phoneBook = phoneBook || {};

phoneBook.Core = (function(){

// set all classes for the app
    var PB = new phoneBook.PhoneBook();
    var PbTree = new phoneBook.Tree();
    var PbUI = new phoneBook.UI();
    var LocalStorage = new phoneBook.LocalStorage();
    var newItem = null;
    //create root for phone book
    newItem = new Group("Root");
    PB.setCurrentGroup(newItem);

//check and display/hide back button Timer
    goUpInterval = window.setInterval(function(){

        var res = PB.compareRootAndCurrentGroup();
        PbUI.backButtonDisplay(res);

    },500);

//run search on key up
    dispatcher.on("search",function(args) {

        var res = [];
        if(args!="") {
            res = PB.findItemByName(args);
        }
        if(res.length > 0) {
            PbTree.printTree(res);
            $("#searchalert").html("");
        }
        else {
            PbTree.printTree(PB.getGroups(PB.getRoot()));
            $("#searchalert").html("No Results!");
        }

    });

//when item clicked display data
    dispatcher.on("treeElementClicked",function(args){

        newItem = PB.findItemById(args);
        if(  newItem.items ) {
            PB.setCurrentGroup(newItem);
            PbTree.printTree(PB.getGroups(newItem));
        }
        else {
            PbUI.showContact(newItem);
        }

    });

//when back button clicked display data
    dispatcher.on("goup",function(args) {

        var res;
        PB.goUp();
        res = PB.getGroups(PB.currentGroup);
        PbTree.printTree(res);

    });

 //del item clicked
    dispatcher.on("delitem",function(args){

        newItem = PB.delItem(args);
        PbTree.printTree(PB.getGroups(PB.currentGroup));

    });

//save button clicked save to localstorage
    dispatcher.on("saveemAll",function(args)  {

        LocalStorage.SavePhoneBook(PB.getRoot());

    });

//load button clicked load from localstorage
    dispatcher.on("loadPhoneBook",function(args) {

        newItem = new Group("Root");
        PB.setCurrentGroup(newItem);
        LocalStorage.loadPhoneBook();
        PbTree.printTree(PB.getGroups(PB.root));

    });

//when save button clicked create new group
    dispatcher.on("newgroup",function(args) {

        newItem = new Group(args.name , args.id);
        newItem.addItem(PB.currentGroup);
        PB.setLastGroup(newItem);
        PbTree.printTree(PB.getGroups(PB.currentGroup));
        phoneBook.events.hideall();
        return newItem;

    });

// set currgroup to prev group
    dispatcher.on("setCurrentGroupLastGroup" , function(args) {

        PB.setCurrentGroup(PB.lastGroup);

    });
//when save contact clicked on update state
    dispatcher.on("setRoot" , function(args) {

        PB.setCurrentGroup(PB.getRoot());

    });

//when sace contact clicked create new contact
// and hide forms
    dispatcher.on("newcontact",function(args) {

        newItem = new Contact(args.firstName , args.lastName , args.phoneNumber);
        newItem.addItem(PB.currentGroup);
        PbTree.printTree(PB.getGroups(PB.currentGroup));
        phoneBook.events.hideall();

    });

//when save contact clicked on update state
    dispatcher.on("updatecontact",function(args){

        newItem = PB.findItemById(args.id);
        newItem.firstName = args.firstName;
        newItem.lastName = args.lastName;
        newItem.phoneNumber = args.phoneNumber;
        PbTree.printTree(PB.getGroups(PB.currentGroup));
        phoneBook.events.hideall();

    });

//print tree on module load
    PbTree.printTree(PB.getGroups());

})();