const stages = {
  start: document.getElementById("start-stage"),
  balloons: document.getElementById("balloon-stage"),
  gifts: document.getElementById("gift-stage"),
  cake: document.getElementById("cake-stage"),
  slideshow: document.getElementById("slideshow-stage")
};

const startBtn = document.getElementById("start-btn");
const balloonContainer = document.getElementById("balloon-container");
const giftContainer = document.getElementById("gift-container");
const blowBtn = document.getElementById("blow-btn");
const bgMusic = document.getElementById("bg-music");
const popSound = document.getElementById("pop-sound");
const confettiSound = document.getElementById("confetti-sound");
const cheersSound = document.getElementById("cheers-sound");
const confettiCanvas = document.getElementById("confetti-canvas");
const ctx = confettiCanvas.getContext("2d");

function showStage(name) {
  Object.values(stages).forEach(s => {
    s.classList.remove("active");
  });
  stages[name].classList.add("active");
}

startBtn.addEventListener("click", () => {
  showStage("balloons");
  bgMusic.play();
  spawnBalloons();
});

let popped = 0;
const requiredPops = 15;
const colors = ["red", "blue", "green", "yellow", "purple", "orange"];

function spawnBalloons() {
  const interval = setInterval(() => {
    if (popped >= requiredPops) {
      clearInterval(interval);
      setTimeout(() => showGifts(), 1000);
      return;
    }

    let b = document.createElement("div");
    b.classList.add("balloon", colors[Math.floor(Math.random() * colors.length)]);
    b.style.left = Math.random() * 90 + "vw";
    balloonContainer.appendChild(b);

    let duration = 6000 + Math.random() * 4000;
    let start = Date.now();

    function animate() {
      let progress = (Date.now() - start) / duration;
      if (progress >= 1) {
        b.remove();
        return;
      }
      b.style.bottom = progress * 100 + "vh";
      requestAnimationFrame(animate);
    }
    animate();

    ["click", "touchstart"].forEach(eventType => {
      b.addEventListener(eventType, () => {
        popped++;
        popSound.currentTime = 0;
        popSound.play();
        b.remove();
      }, { once: true });
    });

  }, 800);
}

function showGifts() {
  showStage("gifts");
  giftContainer.innerHTML = "";

  const boxImages = [
    "assets/images/gift1.png",
    "assets/images/gift2.png",
    "assets/images/gift3.png",
    "assets/images/gift4.png",
    "assets/images/gift5.png"
  ];

  const funnyImages = [
    "assets/images/funny1.jpg",
    "assets/images/funny2.jpg",
    "assets/images/funny3.jpg",
    "assets/images/funny4.jpeg"
  ];

  let shuffledFunny = [...funnyImages].sort(() => Math.random() - 0.5);
  let selectedFunny = shuffledFunny.slice(0, 4);

  let gifts = [...selectedFunny, "correct"];

  gifts = gifts.sort(() => Math.random() - 0.5);

  for (let i = 0; i < 5; i++) {
    const g = document.createElement("div");
    g.classList.add("gift");
    g.style.backgroundImage = `url('${boxImages[i]}')`;

    g.addEventListener("click", () => {
      if (gifts[i] === "correct") {
        showCake();
      } else {
        g.classList.add("shake");
        setTimeout(() => g.classList.remove("shake"), 500);
        g.style.backgroundImage = `url('${gifts[i]}')`;
        g.style.pointerEvents = "none";
      }
    });

    giftContainer.appendChild(g);
  }
}

blowBtn.addEventListener("click", () => {
  document.querySelector(".flame").style.display = "none";
  confettiSound.play();
  cheersSound.play();
  createConfetti();
  drawConfetti();
  setTimeout(() => showSlideshow(), 5000);
});

function showCake() {
  showStage("cake");
}

function resizeCanvas() {
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

let confettiPieces = [];

function createConfetti() {
  for (let i = 0; i < 200; i++) {
    confettiPieces.push({
      x: Math.random() * confettiCanvas.width,
      y: Math.random() * confettiCanvas.height - confettiCanvas.height,
      w: 10,
      h: 10,
      color: `hsl(${Math.random() * 360}, 100%, 50%)`,
      speed: Math.random() * 3 + 2,
      rotation: Math.random() * 360
    });
  }
}

function drawConfetti() {
  ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  confettiPieces.forEach(p => {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation * Math.PI / 180);
    ctx.fillStyle = p.color;
    ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
    ctx.restore();

    p.y += p.speed;
    p.rotation += 5;
    if (p.y > confettiCanvas.height) p.y = -10;
  });
  requestAnimationFrame(drawConfetti);
}

const photos = [
  { src: "assets/images/photo1.jpg", text: "Happy Birthday, Nigar🎉" },
  { src: "assets/images/photo2.jpg", text: "I wish you all the very best and may all your dreams come true ✨" },
  { src: "assets/images/photo3.JPG", text: "I'm so happy you're in my life, I love you! ❤️" }
];

function showSlideshow() {
  showStage("slideshow");
  let i = 0;
  const slideshow = document.getElementById("slideshow");
  const caption = document.getElementById("caption");

  function next() {
    if (i >= photos.length) i = 0;
    slideshow.innerHTML = `<img src="${photos[i].src}" style="max-height:70vh; border-radius:20px;">`;
    caption.textContent = photos[i].text;
    i++;
  }
  next();
  setInterval(next, 4000);
}
