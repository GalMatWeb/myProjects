/*
main PhoneBook data handle and manage methods
 */

var phoneBook = phoneBook || {};

phoneBook.PhoneBook = (function(){

    function PhoneBook() {

        this.name = "Phone Book";
        this.items = [];
        this.root = null;
        this.currentGroup = null;
        this.GroupsArr = [];
        this.level = 0;
        this.grouppointer = null;
        this.lastGroup = null; //use for rebuilding data from LocalStorage
    }

    PhoneBook.nextID = 1;

//return root to other class/modules
    PhoneBook.prototype.getRoot = function() {

      return this.root;

    };

//static return next id
    PhoneBook.generateNextId = function() {

        return PhoneBook.nextID++;

    };

//save last group for future uses
    PhoneBook.prototype.setLastGroup = function(group) {
        this.lastGroup = group;
    };

//check if current root equles root mostly for hiding back to parent button
    PhoneBook.prototype.compareRootAndCurrentGroup = function(){

        var res=false;
        if(this.root == null) { //if no root return false
            res = false;
        }
        else {
            if(this.root.items.length) {
                res =  (this.currentGroup != this.root);
            }
        }
        return res;

    };

//loads array to GroupsArr property of this class to export out of the class
    PhoneBook.prototype.getGroupArr = function(currPointer) {

        var obj = {};
        for(var i=0 ; i<currPointer.items.length ; i++) {
            obj = {};
            obj.id = currPointer.items[i].id;
            if(currPointer.items[i].items) { //if has property items then its group
                obj.title = currPointer.items[i].name;
                obj.type = "grp";
            } else {
                obj.title = currPointer.items[i].firstName +
                    " " + currPointer.items[i].lastName;
                obj.type = "cnt";
            }
            this.GroupsArr.push(obj);
        }

    };

//will call GroupsArr and return array to client
    PhoneBook.prototype.getGroups = function(fromPos) {

        this.GroupsArr = [];
        if(!fromPos) {
            fromPos = this.root;
        }
        this.getGroupArr(fromPos);
        return this.GroupsArr;

    };

//search item by name from given location/pointer/group
    PhoneBook.prototype.searchForItem = function(namestring,currPosition) {

        for(var i=0 ; i<currPosition.items.length ; i++) {
            if(currPosition.items[i].items) {
                if(currPosition.items[i].name.toLowerCase().indexOf(namestring)!=-1) {
                    this.GroupsArr.push({
                        id: currPosition.items[i].id ,
                        title: currPosition.items[i].name,
                        type: "grp"
                    });
                }
            }
            else {
                if(currPosition.items[i].firstName.toLowerCase().indexOf(namestring) != -1 ||
                    currPosition.items[i].lastName.toLowerCase().indexOf(namestring) != -1
                  ) {
                    this.GroupsArr.push({
                        id: currPosition.items[i].id ,
                        title: currPosition.items[i].firstName + " " + currPosition.items[i].lastName ,
                        type: "cnt"
                    });
                }
            }
            if(currPosition.items[i].items) {
                this.searchForItem(namestring,currPosition.items[i])
            }
        }

    };
//call recursive func searchForItem aqnd return array of results
    PhoneBook.prototype.findItemByName = function(namestring) {

        this.GroupsArr = [];
        this.searchForItem(namestring,this.root);
        return this.GroupsArr;

    };

//findItem by id recursive method return object of location index
    PhoneBook.prototype.findItem = function(iId,currPosition) {

        for(var i=0 ; i<currPosition.items.length ; i++) {
            this.grouppointer = {
                pointer: currPosition.items,
                index: i,
                found: false
            };
            if(currPosition.items[i].id == iId) {

                this.grouppointer.found  = true;
                return currPosition.items[i];
            }
            if(currPosition.items[i].items) {
                this.findItem(iId ,currPosition.items[i])
            }
        }

    };
//call find item method and return results
    PhoneBook.prototype.findItemById = function(iId) {

        var item;
        item = this.findItem(iId,this.currentGroup);
        return item;

    };

//change current group to parent root
    PhoneBook.prototype.goUp = function() {

        if(this.currentGroup.parent) { // not losing current group
            this.currentGroup = this.currentGroup.parent;
        }


    };

//set currentgroup to new position
    PhoneBook.prototype.setCurrentGroup = function(group) {

        this.currentGroup = group;
        if(!this.root) { //if new group set root point to it
            this.root = this.currentGroup;
        }

    };

//del item method uses findItemById
    PhoneBook.prototype.delItem = function(id){

        this.grouppointer = null;//set results object to null
        var item = this.findItemById(id,this.root);

        if(this.grouppointer.found == true) { //if found result will be update in grouppointer object
            this.grouppointer.pointer.splice(this.grouppointer.index , 1);
        }

    };



    return PhoneBook;

})();



