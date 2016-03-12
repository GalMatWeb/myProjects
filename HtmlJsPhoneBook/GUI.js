var phoneBook = phoneBook || {};

phoneBook.GUI = (function(){


    var TREE_ELEM_ID = phoneBook.init.TREE_ELEM_ID;

    function groupCLicked(elem) {
        return function() {
            phoneBook.phoneBookManager.setCurrentGroup(elem.getAttribute("data-id"));
            var groupArr = phoneBook.phoneBookManager.getAllGroups();
            printGrouops(groupArr);
            printContacts();
        }
    }

    function delGroupClicked(elem) {
        return function(){
            var cid = elem.getAttribute("data-id");
            var okToDel = confirm("Are You Sure You Wish To Delete");
            if(okToDel == true) {
                console.log(cid);
                phoneBook.phoneBookManager.DeleteItem(+cid);
                var groupArr = phoneBook.phoneBookManager.getAllGroups();
                printGrouops(groupArr);
                printContacts();
            }
        }
    }


    function printGrouops(groupsArr) {

        var groupsULElement = document.getElementById(TREE_ELEM_ID);
        var groupsLIElements = groupsULElement.querySelectorAll("li");

        for(var i=1 ; i<groupsLIElements.length ; i++) {

            groupsULElement.removeChild(groupsLIElements[i]);

        }

        for(i=0;i<groupsArr.length;i++) {

            var newLIElement = document.createElement("li");
            var newancheor;
            newLIElement.setAttribute("data-id",groupsArr[i].id);
            newLIElement.style.marginLeft = (groupsArr[i].level * 3) + "px";
            newLIElement.innerHTML = groupsArr[i].name;
            if(groupsArr[i].id != 0) {
                newancheor = document.createElement("a");
                newancheor.className = "del";
                newancheor.setAttribute("href","javascript:void(0)");
                newancheor.innerHTML = "<img src='images/x.png'>";
                newancheor.onclick = delGroupClicked(newLIElement);
                newLIElement.appendChild(newancheor);
            }
            newLIElement.onclick = groupCLicked(newLIElement);
            groupsULElement.appendChild(newLIElement);
        }
    }

    function delContactClicked(cid) {
        return function() {
            phoneBook.phoneBookManager.DeleteItem(cid);
            printContacts();
        }
    }

    function AppendTableRaw(cntObj,contactsTBLElement) {

        var newrowindex = contactsTBLElement.getElementsByTagName('tbody')[0].rows.length;
        var row = contactsTBLElement.getElementsByTagName('tbody')[0].insertRow(newrowindex);
        var cell = row.insertCell(0);
        cell.innerHTML = cntObj.id;

        cell = row.insertCell(1);
        cell.innerHTML = cntObj.firstName;

        cell = row.insertCell(2);
        cell.innerHTML = cntObj.lastName;

        cell = row.insertCell(3);
        cell.innerHTML = cntObj.phoneNumbers.toString();

        cell = row.insertCell(4);
        cell.innerHTML = "<A href='javascript:void(0)'>Del</A>";
        cell.onclick = delContactClicked(cntObj.id);


    }

    function printContacts() {
        var contactsArr;
        contactsArr = phoneBook.phoneBookManager.getCurrentGroupContacts();
        printGroupContacts(contactsArr);
    }

    function printGroupContacts(contactsArr) {

        var contactsTBLElement = document.getElementById(phoneBook.init.CONTACT_TABLE_ELEM_ID);
        var contactsTRElements = contactsTBLElement.querySelector("tbody");

        while (contactsTRElements.firstChild) {
            contactsTRElements.removeChild(contactsTRElements.firstChild);
        }

        for(var i=0 ; i<contactsArr.length ; i++) {

            AppendTableRaw(contactsArr[i],contactsTBLElement);

        }


    }

    function HideAll() {

        document.getElementById(phoneBook.init.ADD_GROUP_FORM_ID).style.display="none";
        document.getElementById(phoneBook.init.ADD_CONTACT_FORM_ID).style.display="none";
        document.getElementById("blackout").style.display = "none";
        var inputs = document.querySelectorAll("input[type=text]");
        for(var i=0 ; i<inputs.length ; i++) {
            inputs[i].value = "";
        }

    }

    return {
        HideAll: HideAll,
        printGrouops: printGrouops,
        printContacts: printContacts,
        printGroupContacts: printGroupContacts,
    }

})();
