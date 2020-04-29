/* W moim projekcie zastosowałem jquery, ale proszę je potraktować jako taką formę własnego ćwiczenia, które pozoliło mi na zapoznanie się z funkcjami frameworka
oraz jego możliwościami, które zastosowałem w moim projekcie.
Dlatego proszę się nie zdziwić, jeśli w skrypcie pojawiać się będą okazjonalnie "surowe" wstawki z js */

let g_timerPosition = 0;
const g_timerInterval = 1000;
let g_time = new Date(0, 0, 0, 0, 0, 0, 0);
let clock;
let handler;
let g_difficulty;
const defaultValues = [30, 20, 150];
const easy = [7, 7, 15];
const medium = [10, 10, 25];
const hard = [15, 15, 50];
const legendary = [30, 25, 225];

$('document').ready(() => {
  const timer = $('.gameBox .timer');
  const diffSelect = $('.mainMenu .config select');
  const input = $('.mainMenu .config .custom input');
  const button = $('.mainMenu .config button');
  //Waits for user input
  $(diffSelect).val(1337);
  $(button).prop('disabled', true);

  //Actives if player have JS active
  $('.mainMenu').show();
  $(timer).hover(() => {
    if (!g_timerPosition) {
      $(timer).animate({
        left: "10px",
        right: null
      }, 'slow');
      g_timerPosition = 1;
    } else {
      $(timer).css("right", "10px");
      $(timer).css("left", "initial");
      g_timerPosition = 0;
    }
  }, () => { });
  //Shows and hides custom user defined size
  $(diffSelect).click(() => {
    g_difficulty = $('.difficulty').val();
    if (g_difficulty == 0) {
      $(input[0]).attr("placeholder", defaultValues[0]);
      $(input[1]).attr("placeholder", defaultValues[1]);
      $(input[2]).attr("placeholder", defaultValues[2]);
      $('.custom').show();
    } else {
      $('.custom').hide();
    }
    if (g_difficulty != 1337) {
      $(button).prop('disabled', false);
    }
  });

  $(button).click(() => {
    let columns;
    let rows;
    let bombs;
    if (g_difficulty == 0) {
      if ($(input[0]).val() == "") {
        columns = defaultValues[0];
      } else {
        columns = $(input[0]).val();
      }
      if ($(input[1]).val() == "") {
        rows = defaultValues[1];
      } else {
        rows = $(input[1]).val();
      }
      if ($(input[2]).val() == "") {
        bombs = defaultValues[2];
      } else {
        bombs = $(input[2]).val();
      }
      let errorMsg = "";
      if (!(columns > 0)) {
        errorMsg += "Za mała liczba kolumn!\n";
      }
      if (!(rows > 0)) {
        errorMsg += "Za mała liczba wierszy!\n";
      }
      if (!(bombs < columns * rows)) {
        errorMsg += "Za dużo min!";
      }
      if (errorMsg != "") {
        alert(errorMsg);
        return;
      }
    } else if (g_difficulty == 1) {
      columns = easy[0];
      rows = easy[1];
      bombs = easy[2];
    } else if (g_difficulty == 2) {
      columns = medium[0];
      rows = medium[1];
      bombs = medium[2];
    } else if (g_difficulty == 3) {
      columns = hard[0];
      rows = hard[1];
      bombs = hard[2];
    } else if (g_difficulty == 4) {
      columns = legendary[0];
      rows = legendary[1];
      bombs = legendary[2];
    }


    $('.gameBox .game').html(genTable(columns, rows)); //Generate table based on user input
    $('.gameBox .game table').contextmenu((e) => { e.preventDefault(); }); //forbids right click on table
    if($("input[type='checkbox']").val() == "on") {
    }
    //Declare handler and 
    handler = new GameHandler(columns, rows, bombs);
    handler.attachEvents(document.querySelectorAll(".gameBox .game td"));

      //Checks for game sumuarry
    $(document).click(() => {
      if(g_gameOver < 1) {
        return;
      }
      else if (g_gameOver == 1) {
        handler.explode();
        $(".gameOverOverlay").show();
        $(".gameOverOverlay .loseBox").show();
      } else if (g_gameOver == 2) {
        $(".gameOverOverlay").show();
        $(".gameOverOverlay .winBox").show();
      }
    });
    $('.mainMenu').slideUp();

    //#region Time script
    clock = setInterval(() => {
      if (g_gameOver) {
        clearInterval(clock);
      }
      let timeStr = "";
      if (g_time.getMinutes() < 10) {
        timeStr += '0' + g_time.getMinutes();
      } else {
        timeStr += g_time.getMinutes();
      }
      timeStr += ":";
      if (g_time.getSeconds() < 10) {
        timeStr += '0' + g_time.getSeconds();
      } else {
        timeStr += g_time.getSeconds();
      }
      $('.gameBox .timer span').text(timeStr);
      g_time.setSeconds(g_time.getSeconds() + 1);
    }, g_timerInterval);
    //#endregion Time script
  });

});