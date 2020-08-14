$(document).ready(function() {

$('input[type=radio][name=myradio]').change(function() {
    if ($(this).val() == '0') {
        $("#nerkh").text("درهم");
    } else if ($(this).val() == '1') {
        $("#nerkh").html("دلار&nbsp;&nbsp;");
    }
});


$("input[type=radio][name=myradio]").change(function() {
    if (this.value == "0") {
        $("#divtala").show();
        $("#divsekke").show();
    }
    else if (this.value == "1") {
        $("#divtala").show();
        $("#divsekke").show();
    }
    else if (this.value == "2") {
        $("#divtala").hide();
        $("#divsekke").show();
    }
    else if (this.value == "3") {
        $("#divtala").show();
        $("#divsekke").hide();
    }
});

$(document).on("click", "#convertDollar", function() {
	$.ajax({
	    type: "POST",
	    url: "/gold/dollar.php", 
	    data: { 
	        "mydollar": $("#dollar").val(),
	        "myounce": $("#ounce").val(),
	        "mytala": $("#tala").val(),
	        "mysekke": $("#sekke").val(),
	        "mydarsad": $("#darsad").val(),
	        "isdollar": $('input[name="myradio"]:checked').val()
	    },
	    scriptCharset: "utf-8" ,
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
	    success: function(msg) {
	        $("#javab").html(msg);
	    }
	});
});
});
