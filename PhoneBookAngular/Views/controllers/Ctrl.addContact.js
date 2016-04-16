(function(){
    'use strict';

    angular.module("app").controller("addContactCtrl",addContactCtrl);
    //simple Contact Controller Class use Main Serivce
    function addContactCtrl(Main,$rootScope) {

        this.firstName = "";
        this.lastName = "";
        this.phoneNumbers = [""];
        this.MainService = Main;
        this.rootScope = $rootScope;
    }

    addContactCtrl.prototype.validName = function(){

        return (this.firstName == "" && this.lastName == "");

    };




    addContactCtrl.prototype.addnumber = function() {
        this.phoneNumbers.push("");
        console.log(this.phoneNumbers);
    };

    //validate and create new contact
    addContactCtrl.prototype.saveContact = function(){

        var newId = 0;
        var newContact = null;
        if(this.validName() == false) {
            newContact = new phoneBook.Contact(this.firstName,
                                                    this.lastName,this.phoneNumbers);
            newId = this.MainService.NewPhoneBook.generateNextId();
            newContact.addItem(this.MainService.currentGroup,newId);
            this.rootScope.$broadcast('hideTabs', false);
            this.MainService.saveData();

        }
        else {
            alert("First Name , Last Name Are Mandatory!");
        }

    };


})();