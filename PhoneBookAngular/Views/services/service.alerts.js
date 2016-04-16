(function(){
    'use strict'
    /*
    * future use will replace Alert of browser with cusom alerts*/
    function Alerts() {

    }

    Alerts.prototype.displayError = function(msg) {

        alert("Error: " + msg);

    };

    Alerts.prototype.Ask = function(message){

        var answer = window.confirm(message);
        return answer;
    };


    angular.module("app").service("Alerts",Alerts);

})();