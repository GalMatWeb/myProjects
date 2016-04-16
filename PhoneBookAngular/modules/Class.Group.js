var phoneBook = phoneBook || {};
(function(){

    phoneBook.Group = (function(){

        function Group(name,id) {

            this.parent = 0;
            this.name = name;
            this.items = [];
            if(id) {
                this.id = id;
            }

        }

        //Add group into this
        Group.prototype.addItem = function(groupAddTo,id){

            if(!this.id) {
                this.id = id;
            }
            this.parent = groupAddTo.id;
            groupAddTo.items.push(this);

        };

        return Group;

    })();

})();