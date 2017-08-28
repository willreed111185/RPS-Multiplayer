console.log("connected")
  // Initialize Firebase
var config = {
apiKey: "AIzaSyDdDIb-AIstQJkxIkEgLrsQRLt8bvO28Q4",
authDomain: "rpsmultiplayerwdr.firebaseapp.com",
databaseURL: "https://rpsmultiplayerwdr.firebaseio.com",
projectId: "rpsmultiplayerwdr",
storageBucket: "",
messagingSenderId: "663148793516"
};
firebase.initializeApp(config);

var database = firebase.database();
var connectionsRef = database.ref("/connections");
//console.log(connectionsRef);
var connectedRef = database.ref(".info/connected");
var currentGame = database.ref("currentGame");
var player1 = database.ref("currentGame1");
var player2 = database.ref("currentGame2");
var me;

var ConnectedPlayers = 0;
var userName="";
var PlayerNumber;
var choice="";
var opponentChoice="";
var wins=0;
var loss=0;

$("#submit").on("click",function(){
	event.preventDefault();
	$("#iPick").css("visibility", "visible");
	userName = $("#name-input").val();
	console.log(ConnectedPlayers);
	ConnectedPlayers++;
	console.log(ConnectedPlayers);

	$("#submit").prop('disabled', true);
	$("#name-input").val("");
	if (ConnectedPlayers == 1){
		//$("#player1Name").html(userName);	
		PlayerNumber="1";
		me = database.ref("currentGame1");
		$("#player1").css("visibility", "visible");
		player1.set({
			name:userName,
			wins:0,
			loss:0,
			choice:"",
			player:"1",
		});
		currentGame.set({
			userCount:ConnectedPlayers
		})
	}else{
		//$("#player2Name").html(userName);
		PlayerNumber="2";
		me = database.ref("currentGame2");
		$("#player2").css("visibility", "visible");
		player2.set({
			name:userName,
			wins:0,
			loss:0,
			choice:"",
			player:"2",
		});
		currentGame.set({
			userCount:ConnectedPlayers
		})
	}
})

connectedRef.on("value", function(snap) {
	if (snap.val()) {
    	var con = connectionsRef.push(true);
	    con.onDisconnect().remove();
	}
});

player1.on("value",function(snap){
	if(snap.child("name").exists()){
		$("#player1Name").html(snap.val().name);
	}
	if(snap.child("wins").exists()){
		$("#player1wins").html("Wins: "+snap.val().wins);
	}
	if(snap.child("loss").exists()){
		$("#player1loss").html("Losses: "+snap.val().loss);
	}
	if(snap.child("choice").exists() && snap.val().player == PlayerNumber){
		$("#choice").html(snap.val().choice);
	}
	if(snap.child("choice").exists() && snap.val().player != PlayerNumber){
		opponentChoice=snap.val().choice;
		console.log(opponentChoice);
	}
})

player2.on("value",function(snap){
	if(snap.child("name").exists()){
		$("#player2Name").html(snap.val().name);
	}
	if(snap.child("wins").exists()){
		$("#player2wins").html("Wins: "+snap.val().wins);
	}
	if(snap.child("loss").exists()){
		$("#player2loss").html("Losses: "+snap.val().loss);
	}
	if(snap.child("choice").exists() && snap.val().player == PlayerNumber){
		$("#choice").html(snap.val().choice);
	}
	if(snap.child("choice").exists() && snap.val().player != PlayerNumber){
		opponentChoice=snap.val().choice;
		console.log(opponentChoice);
	}
})

currentGame.on("value",function(snap){
	if(snap.child("userCount").exists()){
		ConnectedPlayers=snap.val().userCount;
		if(snap.val().userCount >=2){
			$("#submit").prop('disabled', true);

		}else{
			$("#submit").prop('disabled', false);
		}
	}
})


connectionsRef.on("value", function(snap) {
  $("#viewers").html("Viewers: "+ snap.numChildren());
});


$(".playerBox").on("click", "#rock", function(){
	$("#player"+PlayerNumber).css("visibility","hidden");
	choice="Rock";
	me.child("choice").set(choice);
	evaluateGame();
})
$(".playerBox").on("click", "#paper", function(){
	$("#player"+PlayerNumber).css("visibility","hidden");
	choice="Paper";
	me.child("choice").set(choice);
	evaluateGame();
})
$(".playerBox").on("click", "#scissor", function(){
	$("#player"+PlayerNumber).css("visibility","hidden");
	choice="Scissor";
	me.child("choice").set(choice);
	evaluateGame();
})

function evaluateGame(){
	if (opponentChoice != "" &&	 choice !=""){
		if (choice==opponentChoice){
			console.log("tie");
			reset();
		}
		else if (choice == "Rock"){
			if(opponentChoice == "Scissor"){
				console.log("winner");
				winner();
			}else{
				console.log("loser");
				loser();
			}
		}
		else if (choice == "Paper"){
			if(opponentChoice == "Rock"){
				console.log("winner");
				winner();
			}else{
				console.log("loser");
				loser();
			}
		}
		else if (choice == "Scissor"){
			if(opponentChoice == "Paper"){
				console.log("winner");
				winner();
			}else{
				console.log("loser");
				loser();
			}
		}
	}
}

function winner(){
	wins++;
	me.child("wins").set(wins);
	reset();
	if(PlayerNumber==1){
		var loss = player2.child("loss").once('value',function(snapshot){
    		return snapshot.val();
		});
		loss++;
		player2.child("loss").set(loss);
	}else{
		var loss = player1.child("loss").once('value',function(snapshot){
    		return snapshot.val();
		});
		loss++;
		player1.child("loss").set(loss);
	}
	player2.child("choice").set("");
	player1.child("choice").set("");
}
function loser(){
	loss++;
	me.child("loss").set(loss);
	reset();
}
function reset(){
	$("#iPick").css("visibility", "hidden");
	$("#choice").html("");
	$("#player"+PlayerNumber).css("visibility","visible");
}