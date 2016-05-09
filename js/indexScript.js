$(document).ready(function(){
    $(".toggle").click(function(){
        if($(this).children("input").is(":checked"))
        $(this).parent().parent().parent().addClass("focus-layout-active");
      else
        $(this).parent().parent().parent().removeClass("focus-layout-active");
      $( "#submit" ).trigger( "click" );
    });
    $('#submit').click(function() {
        return false;
    });
});
