var regexCounter = 1;
var currentRegex = null;
var sourceRegex = null;

function setVal(regex) {
	// replace all $ to lambda
	regex = regex.split('$').join('λ');	
	
	$("#originalRegex").val(regex);
}

function getVal() {
	var regex = $("#originalRegex").val()

	// replace all lambda to $
	regex = regex.split('λ').join('$');		
	
	return regex;
}

$("#generateRegex").click(function() {
  setVal(noam.re.string.random(20, "abc", {}));
  onRegexChange();
});

$("#originalRegex").change(onRegexChange);
$("#originalRegex").keyup(onRegexChange);

function onRegexChange() {
  currentRegex = getVal();
  regexCounter = 1;
  //$("#simplificationHistory").html("");
  validateRegex();
}

function validateRegex() {
  var regex = getVal();

  if (regex.length === 0) {
    $("#originalRegex").parent().removeClass("success error");
    $("#simplifyRegex").attr("disabled", true);
    $("#simplifyRegexStep").attr("disabled", true);
    $("#inputError").hide();
	
  } else {
    try {
      noam.re.string.toTree(regex);
      $("#originalRegex").parent().removeClass("error");
      $("#originalRegex").parent().addClass("success");
      $("#simplifyRegex").attr("disabled", false);
      $("#simplifyRegexStep").attr("disabled", false);
      $("#inputError").hide();
	  
    } catch (e) {
      $("#originalRegex").parent().removeClass("success");
      $("#originalRegex").parent().addClass("error");
      $("#simplifyRegex").attr("disabled", true);
      $("#simplifyRegexStep").attr("disabled", true);
      $("#inputError").text("Error: " + e.message);
      $("#inputError").show();
    }
  }
}

$("#simplifyRegex").click(simplifyAll);

function simplifyAll() {
    $("#simplificationHistory").html("");
    
  $("#simplifyRegexStep").attr("disabled", true);
  $("#simplifyRegex").attr("disabled", true);

  var loop = function() {
    var isDone = simplifyStep();

    if (isDone === false) {
      setTimeout(loop, 0);
    }
  };

  setTimeout(loop, 0);
}

function colorize(source, result) {
  var sourceText = source.text();
  var resultText = result.text();

  var diff = JsDiff.diffChars(sourceText, resultText);

  colorDiv(source, diff, "removed", "emph");
  colorDiv(result, diff, "added", "emphG");
}

function createSimplifyStepDiv(isInitial, regex) {
	// replace all $ to lambda
	regex = regex.split('$').join('λ');	

  var outerDiv = $("<div />", { "class": "simplifyStep" });

  var stepLabel = $("<label />", { "class": "regexStep" });
  var stepDiv = $("<div />", { "class": "appliedRule", type : "text"});

  var regexDiv = $("<div />", { "class": "regexString", type : "text"});
  var regexResultDiv = $("<div />", { "class": "regexResultString", type : "text"});

  regexCounter += 1;
  regexDiv.html(regex);
  regexResultDiv.html(regex);

  var steplab = "Rule: ";
  stepLabel.html(steplab);

  if (!isInitial) {
    outerDiv.append(stepLabel);
    outerDiv.append(stepDiv);
  }

  outerDiv.append(regexDiv);
  outerDiv.append(regexResultDiv);

  return outerDiv;
}

function simplifyStep() {
  var stepResult = simplify_(currentRegex);
  
  if (regexCounter === 1) {
        $("#simplificationHistory").html("");
    var div = createSimplifyStepDiv(true, currentRegex);
    $("#simplificationHistory").append(div);
        // if it is simple
    	if (currentRegex == stepResult[0]) {
		    div.find(".regexString").remove();
    	}
  }

  var result = stepResult[0];
  var appliedPatterns = stepResult[1];
  var isDone = result === currentRegex;
  
  if (isDone) {
    $("#simplifyRegexStep").attr("disabled", true);
    $("#simplifyRegex").attr("disabled", true);
	
  } else {
    var previousDiv = $(".simplifyStep").slice(-1)[0];
    var currentDiv = createSimplifyStepDiv(false, currentRegex);
	$("#simplificationHistory").append(currentDiv);
    $(currentDiv).find(".regexStep").append(appliedPatterns[appliedPatterns.length - 1].split("$").join("λ"));
    $(currentDiv).find(".regexString").html(result.split("$").join("λ"));
	$(currentDiv).find(".regexResultString").html(result.split("$").join("λ"));
    colorize($(previousDiv).find(".regexString"), $(currentDiv).find(".regexString"));
    colorize($(previousDiv).find(".regexResultString"), $(currentDiv).find(".regexResultString"));

    sourceRegex = currentRegex;
    currentRegex = result;

	if (result == simplify_(result)[0]) {
		$(currentDiv).find(".regexString").remove();
		//$(currentDiv).find(".regexResultString").remove();
	}
  }

  return isDone;
}

$("#simplifyRegexStep").click(simplifyStep);

function colorDiv(div, parts, type, cssClass) {
  var out = "";
  var shouldBeTrueOrUndefined = type;
  var mustBeUndefined = type === "added" ? "removed" : "added";

  for (var i = 0; i < parts.length; i++) {
    if (parts[i][mustBeUndefined] === undefined) {
      if (parts[i][shouldBeTrueOrUndefined] === undefined){
        out += parts[i].value;
      } else {
        out += '<font class="' + cssClass + '">' + parts[i].value + '</font>';
      }
    }
  }

  div.html(out);
}

function simplify_(regex) {
  var config = {numIterations : 1, appliedPatterns : []};
  var result = noam.re.string.simplify(regex, config);
  var numOfLastStepPatterns = config.appliedPatterns.length;
  
  while (result === regex) {
    config.numIterations += 1;
    config.appliedPatterns = [];
    result = noam.re.string.simplify(regex, config);
	
    if (config.appliedPatterns.length === 0 ||
        config.appliedPatterns.length === numOfLastStepPatterns)
		break;
		
    numOfLastStepPatterns = config.appliedPatterns.length;
  }
  
  return [result, config.appliedPatterns];
}
