var phoneBook = phoneBook || {};

phoneBook.UI = (function(){

    function UI() {

    }

//show contact on edit mode
    UI.prototype.showContact = function(obj) {

        $("#firstname").val(obj.firstName);
        $("#lastname").val(obj.lastName);
        obj.phoneNumbers.forEach(function(phone,index){
            $(".phonenumber:eq("+index+")").val(phone);
        });
        $("#id").val(obj.id);
        $("#contactForm input[type=text]").addClass("hideinputview");
        $("#contactForm input[type=button]").hide();
        $("#addnewcontact").click();

    };

//hide/show back button
    UI.prototype.backButtonDisplay = function(act) {

        if(act==true) {
            $("#back").show();
        }
        else {
            $("#back").hide();
        }

    };

    return UI;

})();