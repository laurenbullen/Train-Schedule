$(document).ready(function(){
    var config = {
        apiKey: "AIzaSyCZELbyF11EqwSkr-lMmneL2skzEDP9uyw",
        authDomain: "train-scheduler-1b49f.firebaseapp.com",
        databaseURL: "https://train-scheduler-1b49f.firebaseio.com",
        projectId: "train-scheduler-1b49f",
        storageBucket: "train-scheduler-1b49f.appspot.com",
        messagingSenderId: "77244592980"
      };
      firebase.initializeApp(config);

    // A variable to reference the database.
    var database = firebase.database();

   

    $("#add-train").on("click", function() {
        event.preventDefault();

         // Variables for the onClick event
        // var name = "";
        // var destination = "";
        // var firstTrain = "";
        // var frequency = 0;

        var name = $("#train-name").val().trim();
        var destination = $("#destination").val().trim();
        var firstTrain = $("#first-train-time").val().trim();
        var frequency = $("#frequency").val().trim();

        // Pushing to database
        database.ref().push({
            name: name,
            destination: destination,
            firstTrain: firstTrain,
            frequency: frequency,
            dateAdded: firebase.database.ServerValue.TIMESTAMP
        });
    
});

    database.ref().on("child_added", function(childSnapshot) {
        var nextArr = [];
        var minAway = 0;
        // Change year so first train comes before now
        var firstTrainNew = moment(childSnapshot.val().firstTrain, "hh:mm").subtract(1, "years");
        // Difference between the current and firstTrain
        var diffTime = moment().diff(moment(firstTrainNew), "minutes");
        var remainder = diffTime % childSnapshot.val().frequency;
        // Minutes until next train
        var minAway = childSnapshot.val().frequency - remainder;
        // Next train time
        var nextTrain = moment().add(minAway, "minutes");
        nextTrain = moment(nextTrain).format("HH:mm");

        $("#add-row").append("<tr><td>" + childSnapshot.val().name +
                "</td><td>" + childSnapshot.val().destination +
                "</td><td>" + childSnapshot.val().frequency +
                "</td><td>" + nextTrain + 
                "</td><td>" + minAway + "</td></tr>");
                
            // Clear input fields
            $("#train-name, #destination, #first-train-time, #frequency").val("");
            return false;
        }, 
            // Handle the errors
            function(errorObject) {
            console.log("Errors handled: " + errorObject.code);
    });

    database.ref().orderByChild("dateAdded").limitToLast(1).on("child_added", function(snapshot) {
        // Change the HTML to reflect
        $("#name-display").html(snapshot.val().name);
        $("#email-display").html(snapshot.val().email);
        $("#age-display").html(snapshot.val().age);
        $("#comment-display").html(snapshot.val().comment);
    });


})