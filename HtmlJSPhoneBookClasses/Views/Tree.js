var phoneBook = phoneBook || {};

phoneBook.Tree = (function(){

    function Tree() {

    }

//return id from loop
    Tree.closureForID = function(id) {

        var closureid = id;
        return closureid;

    };

//Display The Currnet Group Items Array remove old and create new
    Tree.prototype.printTree = function(displayArr){

        var newElemnt;
        var cid = 0;
        $("#" + htmlElements.GROUPS_UL_ELE_ID + " li").remove();
        for(var i=0 ; i<displayArr.length ; i++) {
            cid = Tree.closureForID(displayArr[i].id);
            newElemnt = $("<li class='" +displayArr[i].type +"' data-id='"+cid+"'>#"+cid+ "." +displayArr[i].title+"<a href='javascript:void(0)' class='del'><img src='images/del.png'></a></li>");

            newElemnt.on("click",function(){

                cid = $(this).data("id");
                dispatcher.emit("treeElementClicked",cid)

            });

            newElemnt.appendTo($("#" + htmlElements.GROUPS_UL_ELE_ID )).show();
        }

        phoneBook.events.bind();

    };

    return Tree
})();



