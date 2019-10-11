var calculateBtn = document.getElementById('calculateBtn');
var clearBtn = document.getElementById('clearBtn');
var splitDisplay = document.getElementById('results');
var timeField = document.getElementById('time');
var distanceField = document.getElementById('distance');
var splitField = document.getElementById('splitDistance');
var totalTime;
var distance;
var distanceUnit;
var splitDistance;
var splitUnit;
var timeInSeconds;
var AverageSplit

calculateBtn.addEventListener("click", function() {
   time = document.getElementById("time").value;
   distance = parseInt(document.getElementById("distance").value, 10);
   distanceUnit = document.getElementById("distanceMeasurement").value;
   splitDistance = parseInt(document.getElementById("splitDistance").value, 10);
   splitUnit = document.getElementById("splitMeasurement").value;

   ConvertDistances();

   if(CheckTimeForCorrectFormat(time)) {
     alert("Please put your time in the proper format 00:00:00");
     return;
   }
   if(CheckForValidNumbers(distance, splitDistance)) {
     return;
   }
   if(CheckForEmptyFields(time, distance, splitDistance)) {
     return;
   }
   if(CheckSplitDistance()) {
     alert("Split distance cannot be greater than your race distance.");
     return;
   }
   if(CheckForNumbersGreaterThanSixty()) {
     alert("Seconds, Minutes, or Hours are greater than 59");
     return;
   }

   timeInSeconds = ConvertTimeToSeconds(time);

   averageSplitInSeconds = GetAverageSplitInSeconds(timeInSeconds);

   ClearResults();
   DisplaySplits(averageSplitInSeconds);

})

clearBtn.addEventListener("click", function() {
   ClearForm();
   ClearResults();
});

function ClearForm() {
  timeField.value = "";
  distanceField.value = "";
  splitField.value = "";
}

function ClearResults() {
  var node = document.getElementById("results");
  while(node.firstChild) {
    node.removeChild(node.firstChild);
  }
}

function ConvertTimeToSeconds(time) {
  var hours = parseInt(time.slice(0, time.indexOf(":")), 10);

  time = time.slice(time.indexOf(":") + 1);
  var minutes = parseInt(time.slice(0, time.indexOf(":")), 10);

  time = time.slice(time.indexOf(":") + 1);
  var seconds = parseInt(time.slice(0), 10);

  return seconds + (minutes * 60) + ((hours * 60) * 60);
}

function GetAverageSplitInSeconds(timeInSeconds) {
  var numberOfSplits = distance / splitDistance;

  var secondsPerSplit = timeInSeconds / numberOfSplits;

  return secondsPerSplit;
}

function DisplaySplits(averageSplitInSeconds) {
  var leftoverSeconds;
  var originalSplitSeconds = averageSplitInSeconds;
  for(var i = splitDistance; i < distance; i+= splitDistance) {

    leftoverSeconds = Math.round((averageSplitInSeconds % 60) * 10) / 10;
    if(leftoverSeconds == 60) {
      leftoverSeconds = 0;
      averageSplitInSeconds + 1;
    }
    if(leftoverSeconds < 10) {
      leftoverSeconds = "0" + leftoverSeconds;
    }
    var pTag = document.createElement("p");
    if(GetTimeToDisplay(averageSplitInSeconds) == 0) {
      pTag.innerText = i + splitUnit + " : " + leftoverSeconds;
    }
    else {
      pTag.innerText = i + splitUnit + " : " + GetTimeToDisplay(averageSplitInSeconds) + ":" + leftoverSeconds;
    }
    splitDisplay.appendChild(pTag);
    averageSplitInSeconds += originalSplitSeconds;
  }

    var pTag = document.createElement("p");
    if(averageSplitInSeconds > 3600) {
      pTag.innerText = distance + splitUnit + " : " + time;
    }
    else if(averageSplitInSeconds < 60) {
      time = time.slice(time.indexOf(":") + 1);

      pTag.innerText = distance + splitUnit + " : " + time.slice(time.indexOf(":") + 1);
    }
    else {
      pTag.innerText = distance + splitUnit + " : " + time.slice(time.indexOf(":") + 1);
    }

    splitDisplay.appendChild(pTag);
}

function GetTimeToDisplay(averageSplitInSeconds)
{
  if(averageSplitInSeconds < 3600) {
    return Math.floor(averageSplitInSeconds / 60);
  }
  else {
    var leftoverMinutes = (Math.floor(averageSplitInSeconds / 60)) % 60;
    if(leftoverMinutes < 10) {
      leftoverMinutes = "0" + leftoverMinutes;
    }
    return Math.floor((averageSplitInSeconds / 60) / 60) + ":" + leftoverMinutes;
  }
}

function CheckForEmptyFields(time, distance, splitDistance) {
  var numberOfEmptyFields = 0;
  if(time == "") {
    numberOfEmptyFields++;
    alert("Please fill in the time field.");
  }
  if(distance == "") {
    numberOfEmptyFields++;
    alert("Please fill in the distance field.");
  }
  if(isNaN(splitDistance)) {
    numberOfEmptyFields++;
    alert("Please fill in the split distance field.");
  }

  if(numberOfEmptyFields > 1) {
    alert("Please fill in the empty fields.");
    return true;
  }
  else if(numberOfEmptyFields == 1) {
    return true;
  }
  else {
    return false;
  }
}

function CheckForValidNumbers(distance, splitDistance) {
  var invalidNumbers = 0;

  if(isNaN(distance)) {
    invalidNumbers += 1;
    alert("Distance field is not a valid number.");
  }

  if(isNaN(splitDistance)) {
    invalidNumbers += 1;
    alert("Split distance field is not a valid number.");
  }

  if(invalidNumbers > 0) {
    return true;
  }
}


function CheckTimeForCorrectFormat(time) {

  if(time.includes(":") == false)
  {
    return true;
  }
  if(time.length != 8) {
    return true;
  }
  if(time.charAt(2) != ":" || time.charAt(5) != ":")
  {
    return true;
  }
  if(isNaN(parseInt(time.charAt(0))) || isNaN(parseInt(time.charAt(1))) || isNaN(parseInt(time.charAt(3))) || isNaN(parseInt(time.charAt(4))) || isNaN(parseInt(time.charAt(6))) || isNaN(parseInt(time.charAt(7)))) {
    return true;
  }
}

function CheckForNumbersGreaterThanSixty() {
  var seconds = parseInt(time.charAt(6) + time.charAt(7), 10);
  var minutes = parseInt(time.charAt(3) + time.charAt(4), 10);
  var hours = parseInt(time.charAt(0) + time.charAt(1), 10);

  if(seconds > 59 || minutes > 59 || hours > 59) {
    return true;
  }
}

function ConvertDistances() {
  if(distanceUnit == "m" && splitUnit == "km") {
    distance = distance / 1000;
  }
  else if(distanceUnit == "km" && splitUnit == "m") {
    distance = distance * 1000;
  }
  else if(distanceUnit == "m" && splitUnit == "mi") {
    distance = distance / 1600;
  }
  else if(distanceUnit == "km" && splitUnit == "mi") {
    distance = (distance * 1000) / 1600;
  }
  else if(distanceUnit == "mi" && splitUnit == "m") {
    distance = distance * 1600;
  }
  else if(distanceUnit == "mi" && splitUnit == "km") {
    distance = (distance * 1600) / 1000;
  }
}


function CheckSplitDistance() {
  if(distance < splitDistance) {
    return true;
  }
  else {
    return false;
  }
}
