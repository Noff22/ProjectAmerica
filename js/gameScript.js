//Sizing
var marginX = window.innerWidth/4;
var marginY = window.innerHeight/4;
var width = (window.innerWidth > 0) ? window.innerWidth : screen.width;

//controls scoring 
var deduction = 0.1; //percent deduction for wrong answers
var speedBonus = 0.05; //percent bonus for each second left
var stdScore = 100; //score for question without bonuses or deductions
//keeps track of score
var currentScore=0;

//Timer
var timeElapsed=0;

//Set to false at the start of question, true when correct: control gameplay
var q1=false;
var q2=false;

//Temporary question control. count1 is odd, count2 is even
var qSet = 0;
var count1=-1;
var count2=0;

//Question Limit
var qLimit;

//Game settings
var selection; //[era id string, battles boolean, inventions boolean, elections boolean, court boolean, other boolean, length string]


$(document).ready(function(){
    selection = gameSetup(); //era id, events booleans, length id
    //Komal's setup methods done in gameSetup to avoid timer starting before game start, etc

});

function gameSetup(){
    $(".eraOption").click(function(){
        
        var era = this.id;
        
        $(".eraOption").hide();
        $(".settings").show();
        
        $(".goButton").click(function(){
            var battles = $('#battles')[0].checked;
            var inventions = $('#inventions')[0].checked;
            var elections = $('#elections')[0].checked;
            var court = $('#court')[0].checked;
            var other = $('#other')[0].checked;
            var length = $('input[name="length"]:checked', '#lengthForm').val();
            setQuestionLimit(length);
            var choice = [era, battles, inventions, elections, court, other, length];
            $(".pregame").hide();
            $(document.body).css('background-image','url(img/CrossingDelaware.jpg)');
            $(".game").show();
            gameStart();
            return choice;
        });
    });

}

function setQuestionLimit(lengthSelect){
    var limit = lengthSelect;
    alert (limit);
    
    if(limit==="quick"){
        qLimit = 10;
    }
    else if(limit==="medium"){
        qLimit = 20;
    }
    else if(limit==="long"){
        qLimit = 30;
    }
    else{
        qLimit = -1; //Code to use every event
    }
}

function gameStart(){
    startTimer();
    questionSetup();
    dragManager();
}

//keeps track of score
var currentScore=0;

function dragManager(){
    $(".answerBox1").droppable({
        accept: ".optionA",
        activeClass:"answerBox1Active",
        drop: function(event, ui) {
            if(isCorrect("#"+ui.draggable.attr("id"))){
                q1=true;
                $(this).addClass( "answerBox1Dropped" )
                ui.draggable.position({
                    my: "center",
                    at: "center",
                    of: $(this)
                    });
                if(q2){ //If other question was also answered correctly, go to next set
                    questionSetup();
                }

            }
            else{
                setBlock("#"+ui.draggable.attr("id"));
            }

      }
      });

      $(".answerBox2").droppable({
        accept: ".optionB",
        activeClass:"answerBox2Active",
        drop: function(event, ui) {
            if(isCorrect("#"+ui.draggable.attr("id"))){
                q2=true;
                $(this).addClass( "answerBox2Dropped" )
                ui.draggable.position({
                    my: "center",
                    at: "center",
                    of: $(this)
                    });
                if(q1){
                    questionSetup();
                }

            }
            else{
                setBlock("#"+ui.draggable.attr("id"));
            }

        }
    });

      /*if($("#box1").hasClass("answerBox1Dropped") && $("#box2").hasClass("answerBox2Dropped"){
        console.log("pls work");
      }
      */
      console.log($("#box1").hasClass("answerBox1Dropped"));
}

//temporary implementation for testing. 
//returns array of form: [q1, correct, wrong, wrong, wrong, q2, correct, wrong,]
function getQuestion(){
    qSet++;
    count1+=2;
    count2+=2;
    return ["q"+count1,"c"+count1,"w"+count1,"w"+count1,"w"+count1,"q"+count2,"c"+count2,"w"+count2,"w"+count2,"w"+count2]; //Remember to keep the qSet increments but not this

}

function questionSetup(){
    if(qSet <= qLimit){
        var qa = getQuestion();
        $('#questionBox td').eq(0).html(qa[0]);

        $('#questionBox td').eq(2).html(qa[5]);

        $( "#a1" ).html(qa[1]);
        $( "#a2" ).html(qa[2]);
        $( "#a3" ).html(qa[3]);
        $( "#a4" ).html(qa[4]);
        $( "#b1" ).html(qa[6]);
        $( "#b2" ).html(qa[7]);
        $( "#b3" ).html(qa[8]);
        $( "#b4" ).html(qa[9]);

        setBlock("#a1");
        setBlock("#a2");
        setBlock("#a3");
        setBlock("#a4");
        setBlock("#b1");
        setBlock("#b2");
        setBlock("#b3");
        setBlock("#b4");
        //$(".option").each(animateDiv);
        console.log("MarginX " + marginX);
        console.log("MarginY " + marginY);
        $( ".option" ).draggable({
            containment: "window",
            scroll: false,
        });
        q1=false;
        q2=false;
    }
    else{
        toScore();
    }
}

//currently set up to be called once at start of game. can be adjusted to pause
//during loading if we can't load quickly enough
function startTimer(){
    var counter=0;
    $( "p.timeText" ).html("Time: "+counter);
    var timer= setInterval(function() {
    counter++;
    if(counter < 0) {
        nextQuestion(); //KOMAL, THIS DOESN'T EXIST. Best wishes, Nick
        clearInterval(timer);
    } 
    else {
        $( "p.timeText" ).html("Time: "+counter);
    }
}, 1000);

}



function isCorrect(ans){
    //temporary implementation 
    return $(ans).hasClass("correct");
}

function toScore(){
    $("#yourScore").text("Your Score: " + currentScore);
    $(".game").hide();
    $(".scoreBoard").show();
    
    $(".returnOption").click(function(){
        resetGame();
        backToMenu();
    });
}

function backToMenu(){
    $(".scoreBoard").hide();
    $(".pregame").show();
    selection = gameSetup(); //The cycle never ends! What is life?
}

function resetGame(){
    currentScore = 0;
    qSet = 0;
    count1=-1;
    count2=0;
    //Stop timer from counting further, please. Komal, do you want to make it global?
    timeElapsed = 0;
    
    $(document.body).css('background-image','url(img/HomeInTheWoods.jpg)');
}

function setBlock(tile) {
    var x = genX();
    var y = genY();
    
    $(tile).css({
        "left": x,
        "top": y       
     });
 
}

function genX() {
    var x = Math.floor(Math.random() * (window.innerWidth-marginX))+2;
    return x;
}

function genY() {
    var y = Math.floor(Math.random() * (window.innerHeight-marginY*2))+marginY;
return y;
}


/*http://codepen.io/anon/pen/myyzXV

function animateDiv(){
    var newq = [makeNewPosition()];
    var oldq = $('.option').offset();
    var speed = calcSpeed([oldq.top, oldq.left], newq);
    $('.option').animate({ top: newq[0], left: newq[1] }, speed, function(){
      animateDiv();        
    });
    
};

function makeNewPosition(){
    
    // Get viewport dimensions (remove the dimension of the div)
    var h = $(window).height() - 50;
    var w = $(window).width() - 50;
    
    var nh = Math.floor(Math.random() * h);
    var nw = Math.floor(Math.random() * w);
    
    return [nh,nw];    
    
}

function calcSpeed(prev, next) {
    
    var x = Math.abs(prev[1] - next[1]);
    var y = Math.abs(prev[0] - next[0]);
    
    var greatest = x > y ? x : y;
    
    var speedModifier = 0.05;

    var speed = Math.ceil(greatest/speedModifier);

    return speed;

}
*/

