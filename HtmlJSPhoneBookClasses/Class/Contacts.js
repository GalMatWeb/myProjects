function Contact(firstName , lastName , phoneNumbers ,id) {

    this.parent = null;
    this.firstName = firstName;
    this.lastName = lastName;
    this.phoneNumbers = phoneNumbers;
    if(id) {
        this.id = id;
    }

}

//Add Contact into Group
Contact.prototype.addItem = function(groupAddTo){

    if(!this.id) {
        this.id = phoneBook.PhoneBook.generateNextId();
    }
    this.parent = groupAddTo;
    groupAddTo.items.push(this);

};