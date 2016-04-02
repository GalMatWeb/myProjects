/*
events binding and controller
 */

var phoneBook = phoneBook || {};

phoneBook.events = (function(){

//hide black screen and forms,and clear inputs vals
    function hideall() {

        $("#blackout").hide();
        $("#groupForm").hide();
        $("#contactForm").hide();
        $("input[type=text]").val("");

    }

//bind delete button must run each time new element create
    function bind() {

        $("a.del").bind("click",function(){
            var itemid = $(this).parent().data("id");
            dispatcher.emit("delitem",itemid);
        });

    }

    bind();

//up level click = go to parent group
    $("#back").bind("click",function(){

        dispatcher.emit("goup",null);

    });

//key up on search input srart sarching
    $("#searchbox").bind("keyup",function(e){

        dispatcher.emit("search",$(this).val());

    });

//save phone book to localstorage
    $("#savepb").bind("click",function(){

        dispatcher.emit("saveemAll",null);

    });

//load phone book from localstorage
    $("#load").bind("click",function(){

        dispatcher.emit("loadPhoneBook",null);

    });

/*
    hide floating elemnts on load
     */
    $("#blackout").hide();
    $("#groupForm").hide();
    $("#contactForm").hide();

//add new group link
    $("#addnewgroup").bind("click",function(){

        $("#blackout").show();
        $("#groupForm").show();

    });

//add new contact link
    $("#addnewcontact").bind("click",function(){

        $("#blackout").show();
        $("#contactForm").show();

    });

//blackout overlay screen clicked hide all floating elements
    $("#blackout").bind("click",function(){

        $("#blackout").hide();
        $("#groupForm").hide();
        $("#contactForm").hide();

    });

//save group button click validate and create new group
    $("#savegroup").bind("click",function(){

        var groupObj = {};
        var groupname = $("#groupname").val();
        groupObj.name = groupname;
        groupObj.id = null;
        if(groupname!="") {
            dispatcher.emit("newgroup",groupObj);
        }
        else {
            alert("Please Fill in Group Name!");
        }

    });

//save contact when save contact button clicked validate check for update or save
    $("#savecontact").bind("click",function(){

        var id;
        id = $("#id").val();
        var contactObj = {
            id: id,
            firstName: $("#firstname").val(),
            lastName: $("#lastname").val(),
            phoneNumber: []
        };

        $(".phonenumber").each(function(){
            contactObj.phoneNumber.push($(this).val());
        });

        if(contactObj.firstName != "" && contactObj.lastName != "" ) {
            if(id!="") {
                dispatcher.emit("updatecontact",contactObj);
            }
            else {
                dispatcher.emit("newcontact",contactObj);
            }
            $("#contactForm input[type=text]").val("");
            $("#id").val("");
        }
        else {
            alert("Please Fill in Group Name!");
        }

    });

//on update contact when focus into any text box show edit
    $("#contactForm input[type=text]").bind("focus",function(){

        $("#contactForm input[type=text]").removeClass("hideinputview");
        $("#contactForm input[type=button]").show();

    });

    return {
        bind: bind,
        hideall: hideall
    }

})();