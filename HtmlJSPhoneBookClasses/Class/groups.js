function Group(name,id) {

    this.parent = null;
    this.name = name;
    this.items = [];
    if(id) {
        this.id = id;
    }

}

//Add group into this
Group.prototype.addItem = function(groupAddTo){

    if(!this.id) {
        this.id = phoneBook.PhoneBook.generateNextId();
    }
    this.parent = groupAddTo;
    groupAddTo.items.push(this);

};
