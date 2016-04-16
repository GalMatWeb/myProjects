var phoneBook = phoneBook || {};
(function() {

    phoneBook.Main = (function(){

        function Main() {

            this.root = null;
            this.currentGroup = null;
            this.nextid = 0;

        }

        Main.prototype.generateNextId = function(){

            return ++this.nextid;

        };

        Main.prototype.setCurrentGroup = function(group) {

            this.currentGroup = group;
            if(!this.root) { //if new group set root point to it
                this.root = this.currentGroup;
            }

        };

        Main.prototype.getCurrentGroup = function(){

            return this.currentGroup;

        };

        return Main;

    })();
})();