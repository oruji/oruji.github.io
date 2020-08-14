/*
 * base64.js - Base64 encoding and decoding functions
 *
 * See: http://developer.mozilla.org/en/docs/DOM:window.btoa
 *      http://developer.mozilla.org/en/docs/DOM:window.atob
 *
 * Copyright (c) 2007, David Lindquist <david.lindquist@gmail.com>
 * Released under the MIT license
 */

if (typeof btoa == 'undefined') {
    function btoa(str) {
        var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
        var encoded = [];
        var c = 0;
        while (c < str.length) {
            var b0 = str.charCodeAt(c++);
            var b1 = str.charCodeAt(c++);
            var b2 = str.charCodeAt(c++);
            var buf = (b0 << 16) + ((b1 || 0) << 8) + (b2 || 0);
            var i0 = (buf & (63 << 18)) >> 18;
            var i1 = (buf & (63 << 12)) >> 12;
            var i2 = isNaN(b1) ? 64 : (buf & (63 << 6)) >> 6;
            var i3 = isNaN(b2) ? 64 : (buf & 63);
            encoded[encoded.length] = chars.charAt(i0);
            encoded[encoded.length] = chars.charAt(i1);
            encoded[encoded.length] = chars.charAt(i2);
            encoded[encoded.length] = chars.charAt(i3);
        }
        return encoded.join('');
    }
}

function myHeight() {
document.getElementById("canvas").setAttribute("width", document.getElementById("mywidth").value);
document.getElementById("canvas").setAttribute("height", document.getElementById("myheight").value);
}

$(document).ready(function() {
    $('body').mousemove(function(event) {
        $('#mouse-x-pos').text(Math.round(event.pageX-$("canvas").offset().left));
        $('#mouse-y-pos').text(Math.round(event.pageY-$("canvas").offset().top));
});
	
$("body").keydown(function(event) {
    if(event.which == 113) { //F2
	document.getElementById("canvas").setAttribute("width", $('#mouse-x-pos').text());
        document.getElementById("mywidth").value = $('#mouse-x-pos').text();
		
    } else if(event.which == 115) { //F4
        document.getElementById("canvas").setAttribute("height", $('#mouse-y-pos').text());
        document.getElementById("myheight").value = $('#mouse-y-pos').text();
    }
});

$('#resize').mousedown(function(event) {
    switch (event.which) {
        case 1:
            //alert('Left Mouse button pressed.');
            break;
        case 2:
            //alert('Middle Mouse button pressed.');
            break;
        case 3:
$("#myIn").slideToggle("1500");
$("#myOut").slideToggle("1500");
$("#myImport").slideToggle("1500");
            break;
        default:
            //alert('You have a strange Mouse!');
    }
});
});

function genRegex() {
    	// generate output dfa noam string
	var myArr = JSON.parse(localStorage['fsm'])

	var myStr2 = "";
		
	// #states
	myStr2 += "#states\n";
	for (var i=0;i < myArr.nodes.length;i++) {
		myStr2 += i + "\n";
	}
	
	// #initial
	myStr2 += "#initial\n";
	for (var i=0;i < myArr.links.length;i++) {
		if (myArr.links[i].type == "StartLink") {
			myStr2 += myArr.links[i].node + "\n";
			break;
		}
	}
	
	// #accepting
	myStr2 += "#accepting\n";
	for (var i=0;i < myArr.nodes.length;i++) {
		if (myArr.nodes[i].isAcceptState)
			myStr2 += i + "\n";
	}
	
	// #alphabet
	myStr2 += "#alphabet\n";
	var myAlph = "";
	for (var i=0;i < myArr.links.length;i++) {
		if (myArr.links[i].type != "StartLink") {
			// if edge lable has , like -> a,b
			if (myArr.links[i].text.includes(",")) {
				var commaArr = myArr.links[i].text.split(",")
				for (var j = 0; j < commaArr.length; j++) {
					myAlph += commaArr[j] + "\n";
				}
			} else 
				myAlph += myArr.links[i].text + "\n";
		}
	}
	// remove duplicates
	var names = myAlph.split("\n");
	var uniqueNames = [];
	$.each(names, function(i, el){
		if($.inArray(el, uniqueNames) === -1) uniqueNames.push(el);
	});
	myAlph = uniqueNames.join("\n");
	myStr2 += myAlph + "\n";
	
	// #transitions
	myStr2 += "#transitions\n";
	for (var i=0;i < myArr.links.length;i++) {
		if (myArr.links[i].type != "StartLink") {
			if (myArr.links[i].type == "SelfLink") {
				// if edge lable has , like -> a,b
				if (myArr.links[i].text.includes(",")) {
					var commaArr = myArr.links[i].text.split(",")
					for (var j = 0; j < commaArr.length; j++) {
						myStr2 += myArr.links[i].node + ":" + commaArr[j] + ">" + myArr.links[i].node + "\n";
					}
				} else {
					myStr2 += myArr.links[i].node + ":" + myArr.links[i].text + ">" + myArr.links[i].node + "\n";
				}
			} else {
				// if edge lable has , like -> a,b
				if (myArr.links[i].text.includes(",")) {
					var commaArr = myArr.links[i].text.split(",")
					for (var j = 0; j < commaArr.length; j++) {
						myStr2 += myArr.links[i].nodeA + ":" + commaArr[j] + ">" + myArr.links[i].nodeB + "\n";
					}
				} else {
					myStr2 += myArr.links[i].nodeA + ":" + myArr.links[i].text + ">" + myArr.links[i].nodeB + "\n";
				}
			}
		}
	}
	
	// convert dfa to regex
        try {
	        var automation = noam.fsm.parseFsmFromString(myStr2);
        	automation = noam.fsm.minimize(automation);
	        var result = noam.fsm.toRegex(automation);
	        result = noam.re.tree.toString(result);
	        result = noam.re.string.simplify(result);
	
	        result = result.split("$").join("λ");

        } catch(err) {
	        $("#outRegex").html('<span class="myError">خطا: ' + err.message + '</span>');
        }
	
	$("#outRegex").text(result);
}