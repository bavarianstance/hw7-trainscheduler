 // Firebase Config 

 let config = {
    apiKey: "AIzaSyDzIYjALeTyduRWvXxtVd8W0czr-KCwmhQ",
    authDomain: "hk-highspeed-rail.firebaseapp.com",
    databaseURL: "https://hk-highspeed-rail.firebaseio.com",
    projectId: "hk-highspeed-rail",
    storageBucket: "",
    messagingSenderId: "623260624993"
  };
// Firebase Initialization
  firebase.initializeApp(config);

  let database = firebase.database();

// current time function
  let currentTime = () => {
  	let current = moment().format('LT');
  	$("#currentTime").html(current);
  	setTimeout(currentTime,1000);
  };
// add train onclick listener and function
  $("#btn-add-train").on("click", (event) => {
  	event.preventDefault();

  	let trainName = $("#train-name").val().trim();
  	let trainDestination = $("#destination-name").val().trim();
  	let firstTrainTime = $("#first-train-time").val().trim();
  	let trainFrequency = $("#frequency").val().trim();
// firebase data attribution
  	let newTrain = {
  		name: trainName,
  		destination: trainDestination,
  		firstTime: firstTrainTime,
  		frequency: trainFrequency
  	};
// push new train input values to firebase
  database.ref().push(newTrain);
// reset form input values
  $("#train-name").val("");
  $("#destination-name").val("");
  $("#first-train-time").val("");
  $("#frequency").val("");

  });

// append html dynamically using firebase
database.ref().on("child_added", (childSnapshot) => {

	let trainName = childSnapshot.val().name;
	let trainDestination = childSnapshot.val().destination;
	let firstTrainTime = childSnapshot.val().firstTime;
	let trainFrequency = childSnapshot.val().frequency;
// calculations for train timing / schedule
	let firstTrainTimeCalc = moment(firstTrainTime, "hh:mm a").subtract(1, "years");
	let time = moment().format("HH:mm a");
	let timeDifference = moment().diff(moment(firstTrainTimeCalc), "minutes");
	let timeCalc = timeDifference % trainFrequency;
	let nextTrain = trainFrequency - timeCalc;
	let trainArrival = moment().add(nextTrain, "minutes").format("hh:mm a");

 	$("#train-schedule > tbody").append("<tr><td>" + trainName + "</td><td>" + trainDestination + "</td><td>" + trainFrequency + "</td><td>" + trainArrival + "</td><td>" + nextTrain + "</td></tr>");
},
// handling errors
(errorObject) => {
//console.log("Errors : " + errorObject.code)
});
//run current time function
currentTime();
