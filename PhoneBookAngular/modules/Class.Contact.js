var phoneBook = phoneBook || {};
(function(){

    phoneBook.Contact = (function(){

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
        Contact.prototype.addItem = function(groupAddTo,id){

            if(!this.id) {
                this.id = id;
            }
            this.parent = groupAddTo.id;
            groupAddTo.items.push(this);

        };

        return Contact;

    })();

})();