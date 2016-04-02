/*
Dispatcher Class
 */
var dispatcher = new AppDispatcher();

function AppDispatcher() {
    this.events = {};
}


/*
add Events Callbacks/functions to Array
 */
AppDispatcher.prototype.on = function(eventName, method) {

    var handlers = this.events[eventName];
    if(!handlers) {
        handlers = this.events[eventName] = [];
    }

    handlers.push({
        method: method,
    });

};

/*
runs all event callbacks/functions when called
 */
AppDispatcher.prototype.emit = function(eventName, args) {

    var handlers = this.events[eventName];
    if(!handlers) {
        return;
    }

    handlers.forEach(function(handler) {

        handler.method.call(handler, args);

    });
};
