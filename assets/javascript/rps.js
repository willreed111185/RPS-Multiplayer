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

var player1_wins=0;
var player1_loss=0;
var player2_wins=0;
var player2_loss=0;

$("#submit").on("click",function(){
	event.preventDefault();
	$("#iPick").css("visibility", "visible");
	userName = $("#name-input").val();
	console.log(userName);
	console.log(ConnectedPlayers);
	ConnectedPlayers++;
	console.log(ConnectedPlayers);

	$("#submit").prop('disabled', true);
	$("#name-input").val("");
	if (ConnectedPlayers == 1){
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
			userCount:ConnectedPlayers,
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
		player1_wins=snap.val().wins;
	}
	if(snap.child("loss").exists()){
		$("#player1loss").html("Losses: "+snap.val().loss);
		player1_loss=snap.val().loss;
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
		player2_wins=snap.val().wins;
	}
	if(snap.child("loss").exists()){
		$("#player2loss").html("Losses: "+snap.val().loss);
		player2_loss=snap.val().loss;
	}
	if(snap.child("choice").exists() && snap.val().player == PlayerNumber){
		$("#choice").html(snap.val().choice);
	}
	if(snap.child("choice").exists() && snap.val().player != PlayerNumber){
		opponentChoice=snap.val().choice;
		console.log("OpponentChoice: ",opponentChoice);
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
	choice="Rock";
	me.child("choice").set(choice);
	evaluateGame();
})
$(".playerBox").on("click", "#paper", function(){
	choice="Paper";
	me.child("choice").set(choice);
	evaluateGame();
})
$(".playerBox").on("click", "#scissor", function(){
	choice="Scissor";
	me.child("choice").set(choice);
	evaluateGame();
})

function evaluateGame(){
	console.log("myChoice",choice);
	console.log("EvaluateGame");
	if (opponentChoice != "" &&	 choice !=""){
		if (choice==opponentChoice){
			console.log("tie");
			$("#iPick").css("visibility", "hidden");
			$("#choice").html("");
			$("#player"+PlayerNumber).css("visibility","visible");
		}
		else if (choice == "Rock"){
			if(opponentChoice == "Scissor"){
				console.log("winner");
				winner();
			}else{
				console.log("loser");
				loser()
			}
		}
		else if (choice == "Paper"){
			if(opponentChoice == "Rock"){
				console.log("winner");
				winner();
			}else{
				console.log("loser");
				loser()
			}
		}
		else if (choice == "Scissor"){
			if(opponentChoice == "Paper"){
				console.log("winner");
				winner();
			}else{
				console.log("loser");
				loser()
			}
		}
	}
}
function winner(){
	if(PlayerNumber==1){
		console.log("player1WINS");
		player2_loss++;
		database.ref("currentGame2/loss").set(player2_loss);
		database.ref("currentGame2/choice").set("");
		player1_wins++;
		database.ref("currentGame1/wins").set(player1_wins);
		database.ref("currentGame1/choice").set("");
	}else{
		console.log("player2WINS");
		player1_loss++;
		database.ref("currentGame1/loss").set(player1_loss);
		database.ref("currentGame1/choice").set("");
		player2_wins++;
		database.ref("currentGame2/wins").set(player2_wins);
		database.ref("currentGame2/choice").set("");
	}
	$("#iPick").css("visibility", "hidden");
	$("#choice").html("");
	$("#player"+PlayerNumber).css("visibility","visible");
}
function loser(){
	if(PlayerNumber==2){
		console.log("player1WINS");
		player2_loss++;
		database.ref("currentGame2/loss").set(player2_loss);
		database.ref("currentGame2/choice").set("");
		player1_wins++;
		database.ref("currentGame1/wins").set(player1_wins);
		database.ref("currentGame1/choice").set("");
	}else{
		console.log("player2WINS");
		player1_loss++;
		database.ref("currentGame1/loss").set(player1_loss);
		database.ref("currentGame1/choice").set("");
		player2_wins++;
		database.ref("currentGame2/wins").set(player2_wins);
		database.ref("currentGame2/choice").set("");
	}
	$("#iPick").css("visibility", "hidden");
	$("#choice").html("");
	$("#player"+PlayerNumber).css("visibility","visible");
}