let game = {
  state: "idle",
  score: 0,
  level: 1,
  scoreElem: $(".score"),
  levelElem: $(".level"),
  skippedBalloons: 0,

  balloonSkipped() {
    this.skippedBalloons++;
    if (this.skippedBalloons == 5) {
      this.loose();
    }
  },

  loose() {
    //  метод проигрыша
    alert("Вы проиграли :(");
    this.refresh();
  },

  start() {
    //метод начала
    if (this.state == "idle") {
      startBalloons();
      this.state = "game";
    }
  },

  refresh() {
    // метод рестарта
    if (this.state == "game") {
      clearInterval(balloonInterval);
      $(".balloons").html("");
      this.refreshScore();
      this.skippedBalloons = 0;
      this.setLevel(1);
      this.state = "idle";
    }
  },

  setLevel(level) {
    this.level = level;
    $(this.levelElem).html(level);
    if (level == 3) {
      this.win();
    }
  },

  win() {
    // ф-я выигрыша
    alert("Вы выиграли!");
    this.refresh();
  },

  addScore(amount) {
    // добавление счета
    this.score += amount;
    $(this.scoreElem).html(this.score);
    this.setLevel(Math.floor((this.score + 1000) / 1000));
  },
  refreshScore() {
    // сброс счета
    this.score = 0;
    $(this.scoreElem).html(this.score);
  },
};

$(".start-btn").on("click", () => {
  game.start();
});

$(".refresh-btn").on("click", () => {
  game.refresh();
});

$(".balloons").css({
  height: document.documentElement.clientHeight + "px",
  overflow: "hidden",
  position: "absolute",
  width: "100%",
});

let balloonInterval;
function startBalloons() {
  balloonInterval = setInterval(() => {
    createBalloon();
  }, 700);
}

function createBalloon() {
  let balloonColors = [
    "img/blueballoon.png",
    "img/greenballoon.png",
    "img/orangeballoon.png",
    "img/pinkballoon.png",
  ];
  let randomNumber = Math.floor(Math.random() * 4);
  balloonSrc = balloonColors[randomNumber];

  let randomLeft = Math.floor(Math.random() * ($(".balloons").width() - 50));
  let balloonSpeed =
    7000 + Math.floor(Math.random() * 3000) - (game.level - 1) * 1000 + "ms";

  let balloon = document.createElement("img");
  $(balloon)
    .attr({ src: balloonSrc })
    .css({
      position: "absolute",
      top: "100%",
      left: randomLeft + "px",
      width: "50px",
      transition: "top 5s ease-in",
      userSelect: "none",
      zIndex: "20",
    })
    .appendTo($(".balloons"));
  setTimeout(() => {
    let balloonHeihgt = $(balloon).height();
    $(balloon).css({ top: `calc(0% - ${balloonHeihgt}px)` });
    $(balloon).on("transitionend", () => {
      game.balloonSkipped();
      $(balloon).remove();
    });
  }, 10);
  $(balloon).on("click", () => {
    popBalloon(balloon);
  });
  $(balloon).on("mousedown", (event) => event.preventDefault());
}

function popBalloon(balloon) {
  game.addScore(100);
  let balloonTop = $(balloon).css("top");
  let balloonLeft = $(balloon).css("left");
  let confetti = document.createElement("img");
  $(confetti)
    .attr({ src: "img/confetti.gif" })
    .css({
      width: "100px",
      position: "absolute",
      top: balloonTop,
      left: balloonLeft,
      opasyty: 1,
      transition: "opasity .5s",
      userSelect: "none",
      zIndex: "10",
    })
    .appendTo($(".balloons"));
  let popSound = new Audio("sound/pop.wav");
  popSound.play();  
  setTimeout(() => {
    $(confetti).css({ opasity: 0 });
    $(confetti).on("transitionend", () => {
      $(confetti).remove();
    });
  }, 10);
  $(balloon).remove();
}
