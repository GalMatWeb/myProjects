var phoneBook = phoneBook || {};

phoneBook.init = (function(){

    var phonebook = [];
    var container = null;
    var blackout = null;

    var CONTAINER_ELEM_ID = "main";
    var HEADER_ELEM_ID = "head";
    var LEFT_SIDE_ELEM_ID = "left";
    var RIGHT_SIDE_ELEM_ID = "right";
    var FOOTER_ELEM_ID = "footer";
    var TREE_ELEM_ID = "grouplist";
    var ADD_GROUP_ELEM_ID = "addnewgroup";
    var CONTACT_TABLE_ELEM_ID = "contacttable";
    var ADD_NEW_CONTACT_ELEM_ID = "addnewcontact";
    var BLACKOUT_ELEM_ID = "blackout";
    var GROUP_NAME_INPUT_ID = "groupName";
    var ADD_GROUP_FORM_ID = "addNewGroup";
    var ADD_CONTACT_FORM_ID = "addNewContact";
    var FIRST_NAME_INPUT_ID = "firstName";
    var LAST_NAME_INPUT_ID = "lastName";
    var PHONE_NUMBERS_INPUT_ID = "phoneNumber";

    var tableHeader = ["ID","First Name" , "Last Name" , "Phone Number" , ""];

    function createscreenBlocker(){
        blackout = document.createElement("div");
        blackout.id = BLACKOUT_ELEM_ID;
        blackout.onclick = function(){
            document.getElementById(ADD_GROUP_FORM_ID).style.display="none";
            document.getElementById(ADD_CONTACT_FORM_ID).style.display="none";
            blackout.style.display = "none";

        };
        document.body.appendChild(blackout);
    }

    function getContactFormValues(){
        var phonesArr = [];
        Array.prototype.forEach.call(document.getElementsByClassName("phones"), function (el) {
            phonesArr.push(el.value);
        });
        return {
            firstName: document.getElementById(FIRST_NAME_INPUT_ID).value,
            lastName: document.getElementById(LAST_NAME_INPUT_ID).value,
            phonenumbers: phonesArr
            }
    }



    function CreateAddContactForm() {

        var newForm = document.createElement("div");
        newForm.id = ADD_CONTACT_FORM_ID;
        newForm.style.display = "none";
        document.body.appendChild(newForm);

        var newElem = document.createElement("h4");
        newElem.innerHTML = "Add New Contact";
        newForm.appendChild(newElem);

        newElem = document.createElement("input");
        newElem.id = FIRST_NAME_INPUT_ID;
        newElem.setAttribute("type","text");
        newElem.setAttribute("placeholder","First Name");
        newForm.appendChild(newElem);

        newElem = document.createElement("input");
        newElem.id = LAST_NAME_INPUT_ID;
        newElem.setAttribute("type","text");
        newElem.setAttribute("placeholder","Last Name");
        newForm.appendChild(newElem);

        newElem = document.createElement("input");
        newElem.id = PHONE_NUMBERS_INPUT_ID;
        newElem.setAttribute("type","text");
        newElem.setAttribute("placeholder","Phone Number");
        newElem.className = "phones";
        newElem.onblur = function(){
            var ans=window.confirm("Do You Want To Add Another Number?");
            if(ans==true) {
                var paForm = document.getElementById(ADD_CONTACT_FORM_ID);
                var subelement = this.cloneNode(true);
                paForm.insertBefore(subelement,document.getElementById(PHONE_NUMBERS_INPUT_ID));
            }
        };
        newForm.appendChild(newElem);

        newElem = document.createElement("input");
        newElem.id = "submitcontact";
        newElem.setAttribute("type","button");
        newElem.onclick = function(){
            var newContact = getContactFormValues();
            phoneBook.phoneBookManager.addNewContact(newContact.firstName,newContact.lastName,newContact.phonenumbers);
            phoneBook.GUI.HideAll();
            phoneBook.GUI.printContacts();
        };
        newElem.value = "Add";
        newForm.appendChild(newElem);

    }

    function searchAction() {
        return function(){
            var searchValue = document.getElementById("searchbox").value;
            if(searchValue=="") {
                alert("Pleas Enter a Value To Search");
                return;
            }
            contactArr = phoneBook.phoneBookManager.find(searchValue);
            phoneBook.GUI.printGroupContacts(contactArr);
        }
    }

    function saveClicked() {
        return function(){
            phoneBook.localStorage.SavePhoneBook();
        }
    }

    function loadClicked() {
        return function(){
            phoneBook.localStorage.LoadPhoneBook();
        }
    }

    function CreateLoadSaveButtons() {
        var newElem = document.createElement("a");
        newElem.id = "save";
        newElem.setAttribute("href","javascript:void(0)");
        newElem.innerHTML = "<img src='images/save.png' alt='Save'>";
        newElem.setAttribute("title","Save");
        newElem.onclick = saveClicked();
        document.getElementById("right").insertBefore(newElem,document.getElementById("right").firstChild);
        newElem = document.createElement("a");
        newElem.id = "load";
        newElem.setAttribute("href","javascript:void(0)");
        newElem.setAttribute("title","Load");
        newElem.innerHTML = "<img src='images/load.jpg' alt='Load' />";
        newElem.onclick = loadClicked();
        document.getElementById("right").insertBefore(newElem,document.getElementById("right").firstChild);

    }

    function CreateSearchBar() {
        var newElem = document.createElement("div");
        newElem.className = "searchbar";
        newElem.id = "searchbar";
        document.getElementById("right").insertBefore(newElem,document.getElementsByTagName("table")[0]);
        newElem = document.createElement("input");
        newElem.setAttribute("type","text");
        newElem.id = "searchbox";
        newElem.setAttribute("placeholder","Search Contacts");
        document.getElementById("searchbar").appendChild(newElem);
        newElem = document.createElement("input");
        newElem.setAttribute("type","button");
        newElem.id = "go";
        newElem.value = "Search";
        newElem.onclick = searchAction();
        document.getElementById("searchbar").appendChild(newElem);
    }

    function CreateAddGroupForm(){

        var newForm = document.createElement("div");
        newForm.id = ADD_GROUP_FORM_ID;
        newForm.style.display = "none";
        document.body.appendChild(newForm);

        var newElem = document.createElement("h4");
        newElem.innerHTML = "Add New Group";
        newForm.appendChild(newElem);

        var newElem = document.createElement("input");
        newElem.id = GROUP_NAME_INPUT_ID;
        newElem.setAttribute("type","text");
        newForm.appendChild(newElem);

        newElem = document.createElement("input");
        newElem.id = "submitgroup";
        newElem.setAttribute("type","button");
        newElem.value = "Add";
        newElem.onclick = function(){
            var newGroup = document.getElementById(GROUP_NAME_INPUT_ID).value;
            phoneBook.phoneBookManager.addNewGroup(newGroup);
            phoneBook.GUI.HideAll();
            var groupsArr = phoneBook.phoneBookManager.getAllGroups();
            phoneBook.GUI.printGrouops(groupsArr);

        };
        newForm.appendChild(newElem);

    }

    function showForm(formID) {
        blackout.style.display = "block";
        document.getElementById(ADD_GROUP_FORM_ID).style.display="none";
        document.getElementById(ADD_CONTACT_FORM_ID).style.display="none";
        document.getElementById(formID).style.display = "block";
    }


    function CreateGroupElem(elemObj){

        var ulElem = document.createElement("ul");
        ulElem.id = TREE_ELEM_ID;
        elemObj.appendChild(ulElem);
        var newElem = document.createElement("li");
        newElem.className = "nobg";
        newElem.innerHTML = "<A href='javascript:void(0)'>+ Add New Group</A>";
        newElem.onclick = function(){
          showForm(ADD_GROUP_FORM_ID);
        };
        ulElem.appendChild(newElem);

    }

    function createContainer(){

        container = document.createElement("div");
        container.id = CONTAINER_ELEM_ID;
        document.getElementsByTagName("body")[0].appendChild(container);

    }

    function createGrid(){

        var newElement = document.createElement("div");

        newElement.id = HEADER_ELEM_ID;
        newElement.innerHTML = "Phone Book App";
        container.appendChild(newElement);

        newElement = document.createElement("div");
        newElement.id = LEFT_SIDE_ELEM_ID;
        newElement.innerHTML = "<h2>Groups</h2>";
        container.appendChild(newElement);
        CreateGroupElem(newElement);



        newElement = document.createElement("div");
        newElement.id = RIGHT_SIDE_ELEM_ID;
        newElement.innerHTML = "<h2>Contacts</h2>";
        container.appendChild(newElement);

        newElement = document.createElement("a");
        newElement.id = ADD_NEW_CONTACT_ELEM_ID;
        newElement.setAttribute("href","javascript:void(0)");
        newElement.innerHTML = "+ Add New Contact";
        newElement.onclick = function(){
            showForm(ADD_CONTACT_FORM_ID);
        };
        document.getElementById(RIGHT_SIDE_ELEM_ID).appendChild(newElement);

        newElement = document.createElement("table");
        newElement.id = CONTACT_TABLE_ELEM_ID;
        var header = newElement.createTHead();
        var row = header.insertRow(0);

        for(var i=0;i< tableHeader.length ; i++) {

            var cell = row.insertCell(i);
            cell.innerHTML = tableHeader[i];

        }
        newElement.createTBody();

        document.getElementById(RIGHT_SIDE_ELEM_ID).appendChild(newElement);

        newElement = document.createElement("div");
        newElement.id = FOOTER_ELEM_ID;
        newElement.innerHTML = "&copy;All Rights Reserved Gal Matheys";
        document.getElementsByTagName("body")[0].appendChild(newElement);

        createscreenBlocker();
        CreateAddContactForm();
        CreateAddGroupForm();

    }


    function createPhoneBookHtmlElements() {

        createContainer();
        createGrid();
        CreateSearchBar();
        CreateLoadSaveButtons();
        phoneBook.phoneBookManager.createPhoneBook();

    }

    return {
        createPhoneBookHtmlElements: createPhoneBookHtmlElements,
        TREE_ELEM_ID: TREE_ELEM_ID,
        CONTACT_TABLE_ELEM_ID: CONTACT_TABLE_ELEM_ID,
        tableHeader: tableHeader,
        ADD_GROUP_FORM_ID: ADD_GROUP_FORM_ID,
        ADD_CONTACT_FORM_ID: ADD_CONTACT_FORM_ID,
        blackout: blackout,
    }

})();