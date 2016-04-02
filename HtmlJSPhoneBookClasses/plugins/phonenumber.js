/*
for each selctor disable none numeric input except '-'
 */
$.fn.phonenumbers = function() {

    $(this).on("keydown",function(e){

        var keypressed ;
        keypressed = e.keyCode;
        if( (keypressed >= 96 && keypressed <= 105) ||
            (keypressed >= 48 && keypressed <= 57) ||
            keypressed == 45 || keypressed == 189 ) {
            return true;
        }
        else {
            e.preventDefault();
        }

    });

};
 