const calculateBtn = document.getElementById('calculateBtn');
const clearFormBtn = document.getElementById('clearBtn');
const splitDisplayArea = document.getElementById('results');
const splitUnitField = document.getElementById('splitMeasurement');
const distanceUnitField = document.getElementById('distanceMeasurement');
const raceTimeField = document.getElementById('raceTime');
const distanceField = document.getElementById('distance');
const splitDistanceField = document.getElementById('splitDistance');

calculateBtn.addEventListener("click", () => {
  
   let raceTime = raceTimeField.value;
   let distance = parseInt(distanceField.value, 10);
   let distanceUnit = distanceUnitField.value;
   let splitDistance = parseInt(splitDistanceField.value, 10);
   let splitUnit = splitUnitField.value;

   if(CheckForExtremeNumbers(distance)) {
     alert("Distance is too extreme");
     return;
   }

   ConvertDistances(distanceUnit, splitUnit, distance);

   if(CheckTimeForCorrectFormat(raceTime)) {
     alert("Please put your raceTime in the proper format 00:00:00");
     return;
   }
   if(CheckForValidNumbers(distance, splitDistance)) {
     return;
   }
   if(CheckForEmptyFields(raceTime, distance, splitDistance)) {
     return;
   }
   if(CheckSplitDistance(distance, splitDistance)) {
     alert("Split distance cannot be greater than your race distance.");
     return;
   }
   if(CheckForNumbersGreaterThanSixty(raceTime)) {
     alert("Seconds, Minutes, or Hours are greater than 59");
     return;
   }

   let timeInSeconds = ConvertTimeToSeconds(raceTime);

   averageSplitInSeconds = GetAverageSplitInSeconds(timeInSeconds, distance, splitDistance);

   ClearResults();
   DisplaySplits(averageSplitInSeconds, raceTime, splitUnit, distance, splitDistance);

})

clearFormBtn.addEventListener("click", () => {
   ClearForm();
   ClearResults();
});

let ClearForm = () => {
  raceTimeField.value = "";
  distanceField.value = "";
  splitDistanceField.value = "";
}

let ClearResults = () => {
  var node = document.getElementById("results");
  while(node.firstChild) {
    node.removeChild(node.firstChild);
  }
}

let ConvertTimeToSeconds = (raceTime) => {
  var hours = parseInt(raceTime.slice(0, 2), 10);
  var minutes = parseInt(raceTime.slice(3, 5), 10);
  var seconds = parseInt(raceTime.slice(6), 10);

  return seconds + (minutes * 60) + ((hours * 60) * 60);
}

let GetAverageSplitInSeconds = (timeInSeconds, distance, splitDistance) => {
  var numberOfSplits = distance / splitDistance;

  let secondsPerSplit = timeInSeconds / numberOfSplits;

  return secondsPerSplit;
}

let DisplaySplits = (averageSplitInSeconds, raceTime, splitUnit, distance, splitDistance) => {
  var leftoverSeconds;
  var originalSplitSeconds = averageSplitInSeconds;
  for(var i = splitDistance; i < distance; i+= splitDistance) {

    leftoverSeconds = Math.round((averageSplitInSeconds % 60) * 10) / 10;
    if(leftoverSeconds == 60) {
      leftoverSeconds = 0;
      averageSplitInSeconds + 1;
    }
    if(leftoverSeconds < 10 && averageSplitInSeconds < 60) {

    }
    else if(leftoverSeconds < 10){
      leftoverSeconds = "0" + leftoverSeconds;
    }
    var pTag = document.createElement("p");
    if(GetTimeToDisplay(averageSplitInSeconds) == 0) {
      pTag.innerText = i + splitUnit + "\xa0\xa0" + " : " + "\xa0\xa0" + leftoverSeconds;
    }
    else {
      pTag.innerText = i + splitUnit + "\xa0\xa0" + " : " + "\xa0\xa0" + GetTimeToDisplay(averageSplitInSeconds) + ":" + leftoverSeconds;
    }
    splitDisplayArea.appendChild(pTag);
    averageSplitInSeconds += originalSplitSeconds;
  }

    var pTag = document.createElement("p");
    if(averageSplitInSeconds > 3600) {
      var finalHours = parseInt(raceTime.slice(0, 2), 10);
      if(finalHours < 10) {
        pTag.innerText = distance + splitUnit + "\xa0\xa0" + " : " + "\xa0\xa0" + raceTime.slice(1);;
      }
      else {
        pTag.innerText = distance + splitUnit + "\xa0\xa0" + " : " + "\xa0\xa0" + raceTime;
      }
    }
    else if(averageSplitInSeconds < 60) {
        var finalSeconds = parseInt(raceTime.slice(6), 10);
        if(finalSeconds < 10) {
          pTag.innerText = distance + splitUnit + "\xa0\xa0" + " : " + "\xa0\xa0" + raceTime.slice(7);
        }
        else {
          pTag.innerText = distance + splitUnit + "\xa0\xa0" + " : " + "\xa0\xa0" + raceTime.slice(6);
        }
    }
    else {
      var finalMinutes = parseInt(raceTime.slice(3,5), 10);
      if(finalMinutes < 10) {
        pTag.innerText = distance + splitUnit + "\xa0\xa0" + " : " + "\xa0\xa0" + raceTime.slice(4);
      }
      else {
        pTag.innerText = distance + splitUnit + "\xa0\xa0" + " : " + "\xa0\xa0" + raceTime.slice(raceTime.indexOf(":") + 1);
      }
    }

    splitDisplayArea.appendChild(pTag);
}

let GetTimeToDisplay = (averageSplitInSeconds) => {
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

let CheckForEmptyFields = (raceTime, distance, splitDistance) => {
  var numberOfEmptyFields = 0;
  if(raceTime == "") {
    numberOfEmptyFields++;
    alert("Please fill in the raceTime field.");
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

let CheckForValidNumbers = (distance, splitDistance) => {
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


let CheckTimeForCorrectFormat = (raceTime) => {

  if(raceTime.length != 8)
  {
    return true;
  }

  if(raceTime.charAt(2) != ":" || raceTime.charAt(5) != ":")
  {
    return true;
  }

  if(isNaN(parseInt(raceTime.charAt(0))) || isNaN(parseInt(raceTime.charAt(1))) || isNaN(parseInt(raceTime.charAt(3))) || isNaN(parseInt(raceTime.charAt(4))) || isNaN(parseInt(raceTime.charAt(6))) || isNaN(parseInt(raceTime.charAt(7)))) {
    return true;
  }
}

let CheckForNumbersGreaterThanSixty = (raceTime) => {
  let seconds = parseInt(raceTime.charAt(6) + raceTime.charAt(7), 10);
  let minutes = parseInt(raceTime.charAt(3) + raceTime.charAt(4), 10);
  let hours = parseInt(raceTime.charAt(0) + raceTime.charAt(1), 10);

  if(seconds > 59 || minutes > 59 || hours > 59) {
    return true;
  }
}

let ConvertDistances = (distanceUnit, splitUnit, distance) => {
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


let CheckSplitDistance = (distance, splitDistance) => distance < splitDistance ? true : false

let CheckForExtremeNumbers = (distance) => distance >= 100000 ? true : false
