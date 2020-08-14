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
  var myinput = $("#dollar").val();
	var myounce = $("#ounce").val();
	var mytype = $('input[name="myradio"]:checked').val();

  var myinput = convert2english(myinput);
  var myounce = convert2english(myounce);
  var drate = 3.674;

  var finalString = '';

  var abshode;

  if(mytype == 1) {
      abshode = myinput * myounce / 9.5742;

  } else if(mytype == 0) {
      abshode = myinput * drate * myounce / 9.5742;
  }

  var sekke = abshode / 4.6083 / 705 * 900 * 8.133;
  
  var finalString = '';
  
  finalString = finalString + '<div>';
  finalString = finalString + '<span class="rightTD">';
  finalString = finalString + 'طلای جهانی ';
  finalString = finalString + '</span>';
  finalString = finalString + '<span class="leftTD">';
  finalString = finalString + number_format(abshode);
  finalString = finalString + '</span>';
  finalString = finalString + '</div>';

  finalString = finalString + '<div>';
  finalString = finalString + '<span class="rightTD">';
  finalString = finalString + 'سکه&nbsp; جهانی ';
  finalString = finalString + '</span>';
  finalString = finalString + '<span class="leftTD">';
  finalString = finalString + number_format(sekke);
  finalString = finalString + '</span>';
  finalString = finalString + '</div>';
  
  $("#javab").html(finalString);
});
});

function convert2english(str) {
  var persianNumbers = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g];
  var arabicNumbers  = [/٠/g, /١/g, /٢/g, /٣/g, /٤/g, /٥/g, /٦/g, /٧/g, /٨/g, /٩/g];

  if(typeof str === 'string') {
    for(var i = 0; i < 10; i++) {
      str = str.replace(persianNumbers[i], i).replace(arabicNumbers[i], i);
    }
  }
  
  return str;
}

function number_format(str) {
  str = Math.trunc(str);
  str = str.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");  
  
  return str;
}
