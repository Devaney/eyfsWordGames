debug = false;

wordStartCount = 95;

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

var correct_answers = wordStartCount;

function startGame() {
    //getShuffledListOfWords();
    getNewWord();
    selection_snd.play();
    clearTimer();
    timerStart();    
};

function getNewWord() {
    roundSeconds = 0;
    roundTimeVar = setInterval(roundCountStart, 100);

    if (debug == true) {
    document.getElementById("current-word").innerHTML = "<p class='"+ words.eyfsWords[correct_answers].colour + "'>" + words.eyfsWords[correct_answers].word + " </p>";
    } else{
          document.getElementById("current-word").innerHTML = "<p>" + words.eyfsWords[correct_answers].word + " </p>";
    };

    document.getElementById("intro-wrap").style.display = 'none';
    document.getElementById("game-wrap").style.display = 'block';
    document.getElementById("is_"+words.eyfsWords[correct_answers].colour).className += " correct_answer_btn";
    document.getElementById("is_red").onclick = answer;
    document.getElementById("is_green").onclick = answer;
};

function roundCountStart() {
    ++roundSeconds;
    endRoundTime = roundSeconds;
};

function answer() {
    if (this.classList.contains("correct_answer_btn")) {
        correct_snd.play();
        addResultsTableRow('results-table', words.eyfsWords[correct_answers].word, endRoundTime);
        correct_answers++; //Add 1 to correct answers
        document.getElementById('happy-face-animation').style.display='block';
        setTimeout(function () {document.getElementById('happy-face-animation').style.display='none'}, 2000);
    clearInterval(roundTimeVar);
        this.classList.remove("correct_answer_btn");
        if (correct_answers == words.eyfsWords.length) {
            endGame();
        } else{
        getNewWord();
        };
    } else{
        wrong_snd.play();
        document.getElementById('error-screen-block').style.display='block';
        setTimeout(function () {document.getElementById('error-screen-block').style.display='none'}, 4000);
    };
}; // function answer()

function endGame() {
    usersTime = document.getElementById("timer").innerHTML;
    document.getElementById("intro-wrap").style.display = 'block';
    document.getElementById("game-wrap").style.display = 'none';
    document.getElementById("initial-intro").innerHTML = "Well done<br>You did it in<br>" + usersTime;
    correct_answers = wordStartCount;
    end_snd.play();
    stopTimer();
    getShuffledListOfWords();
};

function restartGame() {
    correct_answers = wordStartCount;
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
        var seconds = totalSeconds;
        document.getElementById("timer").innerHTML = seconds + " seconds";
    };
};

function clearTimer() {
    totalSeconds = 0;
    document.getElementById("timer").innerHTML = "0 seconds";
};

function stopTimer() {
    clearInterval(timerVar);
    clearInterval(roundTimeVar);
};

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

//sorting the results table
// // Table data sorting starts....
//   function sortData() {
//       // Read table body node.
//       var tableData = document.getElementById('data_table').getElementsByTagName('tbody').item(0);

//       // Read table row nodes.
//       var rowData = tableData.getElementsByTagName('tr'); 

//       for(var i = 0; i < rowData.length - 1; i++) {
//           for(var j = 0; j < rowData.length - (i + 1); j++) {

//               //Swap row nodes if short condition matches
//               if(parseInt(rowData.item(j).getElementsByTagName('td').item(0).innerHTML) > parseInt(rowData.item(j+1).getElementsByTagName('td').item(0).innerHTML)) {
//                   tableData.insertBefore(rowData.item(j+1),rowData.item(j));
//               }
//           }
//       }
//   }
//   // Table data sorting ends....
