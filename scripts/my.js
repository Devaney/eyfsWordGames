
function addResultsTableRow(tableID, cellOne, cellTwo) {
  // Get a reference to the table
  var tableRef = document.getElementById(tableID);
  var newRow = tableRef.insertRow(0);

  var newCell = newRow.insertCell(0);
  var newText = document.createTextNode(cellOne);
  newCell.appendChild(newText);

  var secondNewCell = newRow.insertCell(1);
  var secondNewText = document.createTextNode(cellTwo);
  secondNewCell.appendChild(secondNewText);
};

var selection_snd = new Audio("sounds/selection.mp3");
var correct_snd = new Audio("sounds/correct.mp3");
var wrong_snd = new Audio("sounds/wrong.mp3"); 
var end_snd = new Audio("sounds/end-sound.mp3"); 
//var welcome_snd = new Audio("sounds/intro-music.wav");
//welcome_snd.loop = true;
//welcome_snd.play();

function getShuffledListOfWords() {
    // setting up the GET request
    function readTextFile(file, callback) {
        var rawFile = new XMLHttpRequest();
        rawFile.overrideMimeType("application/json");
        rawFile.open("GET", file, true);
        rawFile.onreadystatechange = function() {
            if (rawFile.readyState === 4 && rawFile.status == "200") {
                callback(rawFile.responseText);
            }
        }
        rawFile.send(null);
    };
    
    function randomize(a, b) {
        return Math.random() - 0.5;
    };
    
    // Calling the data
    readTextFile("data/eyfsWords.json", function(text){
        words = JSON.parse(text);
        words.eyfsWords.sort(randomize);
    });//readTextFile

};//getShuffledListOfWords

var correct_answers = 90;

function getNewWord() {
    var roundSeconds = 0;
    roundTimeVar = setInterval(roundCountStart, 1000);

    function roundCountStart() {
        ++roundSeconds;
        var roundHour = Math.floor(roundSeconds /3600);
        var roundMinute = Math.floor((roundSeconds - roundHour*3600)/60);
        endRoundTime = roundSeconds;
    };


    document.getElementById("current-word").innerHTML = "<p>" + words.eyfsWords[correct_answers].word + " </p>";// class="+ words.eyfsWords[correct_answers].colour + "
    document.getElementById("intro-wrap").style.display = 'none';
    document.getElementById("game-wrap").style.display = 'block';
    document.getElementById("is_"+words.eyfsWords[correct_answers].colour).className += " correct_answer_btn";
    document.getElementById("is_red").onclick = answer;
    document.getElementById("is_green").onclick = answer;
};

function answer() {
    if (this.classList.contains("correct_answer_btn")) {
        correct_snd.play();
        addResultsTableRow('results-table', words.eyfsWords[correct_answers].word, endRoundTime);
        correct_answers++; //Add 1 to correct answers
        document.getElementById('happy-face-animation').style.display='block';
        setTimeout(function () {document.getElementById('happy-face-animation').style.display='none'}, 2000);
        this.classList.remove("correct_answer_btn");
        if (correct_answers == words.eyfsWords.length) {
            endGame();
        } else{
        getNewWord();
        };
    } else{
        wrong_snd.play();
        document.getElementById('error-screen-block').style.display='block';
        setTimeout(function () {
            document.getElementById('error-screen-block').style.display='none'},
            4000);
    };
}; // function answer()

function endGame() {
    usersTime = document.getElementById("timer").innerHTML;
    document.getElementById("intro-wrap").style.display = 'block';
    document.getElementById("game-wrap").style.display = 'none';
    document.getElementById("initial-intro").innerHTML = "Well done<br>You did it in<br>" + usersTime;
    correct_answers = 90;
    end_snd.play();
    stopTimer();
};

function restartGame() {
    correct_answers = 90;
    document.getElementById("intro-wrap").style.display = 'block';
    document.getElementById("game-wrap").style.display = 'none';
    document.getElementById("is_red").classList.remove("correct_answer_btn");
    document.getElementById("is_green").classList.remove("correct_answer_btn");
    stopTimer();
    clearTimer();
};


function timerStart() {
    timerVar = setInterval(countStart, 1000);
    totalSeconds = 0;
    function countStart() {
        ++totalSeconds;
        var hour = Math.floor(totalSeconds /3600);
        var minute = Math.floor((totalSeconds - hour*3600)/60);
        var seconds = totalSeconds;
        document.getElementById("timer").innerHTML = seconds + " seconds";
    };
};

function clearTimer() {
    totalSeconds = 0;
    document.getElementById("timer").innerHTML = " 0 minutes 0 seconds";
};

function stopTimer() {
    clearInterval(timerVar);
};
