let questions = [];
let currentQuestion = 0;
let score = 0;

/* ========================= */
/* ELEMENT */
/* ========================= */

const questionEl =
document.getElementById("question");

const optionsEl =
document.getElementById("options");

const scoreEl =
document.getElementById("score");

const questionNumberEl =
document.getElementById("question-number");

const actionBtn =
document.getElementById("actionBtn");

const startBtn =
document.getElementById("startBtn");

const startScreen =
document.getElementById("startScreen");

const gameScreen =
document.getElementById("gameScreen");

const bgMusic =
document.getElementById("bgMusic");

const openingMusic =
document.getElementById("openingMusic");

/* ========================= */
/* START */
/* ========================= */

startBtn.addEventListener("click", async () => {

    try {

        openingMusic.pause();
        openingMusic.currentTime = 0;

        bgMusic.volume = 0.15;
        bgMusic.play();

    } catch (e) {}

    startScreen.style.display = "none";

    gameScreen.style.display = "block";

    await loadQuestions();

});

/* ========================= */
/* LOAD QUESTIONS */
/* ========================= */

async function loadQuestions() {

    const response =
    await fetch("questions.json");

    questions =
    await response.json();

    currentQuestion = 0;
    score = 0;

    scoreEl.textContent = score;

    showQuestion();
}

/* ========================= */
/* SHOW QUESTION */
/* ========================= */

function showQuestion() {

    const q =
    questions[currentQuestion];

    questionNumberEl.textContent =
    `Soal ${currentQuestion + 1} dari ${questions.length}`;

    questionEl.textContent =
    q.question;

    optionsEl.innerHTML = "";

    const letters =
    ["A","B","C"];

    q.options.forEach((option,index)=>{

        const button =
        document.createElement("button");

        button.classList.add("option-btn");

        button.textContent =
        `${letters[index]}. ${option}`;

        button.onclick = () =>
        checkAnswer(option, button);

        optionsEl.appendChild(button);

    });

    actionBtn.style.display = "block";

    actionBtn.textContent =
    "🔊 Ulangi Soal";

    actionBtn.onclick = () => {

        speechSynthesis.cancel();

        setTimeout(() => {

            speakQuestion();

        }, 200);

    };

    setTimeout(() => {

        speakQuestion();

    }, 700);

}

/* ========================= */
/* CHECK ANSWER */
/* ========================= */

function checkAnswer(selectedAnswer, button) {

    const q =
    questions[currentQuestion];

    const buttons =
    document.querySelectorAll(".option-btn");

    buttons.forEach(btn => {

        btn.disabled = true;

    });

    if(selectedAnswer === q.answer){

        button.classList.add("correct");

        score += 500;

        scoreEl.textContent = score;

        speak(
        "Hebat. Jawabanmu benar.");

    }else{

        button.classList.add("wrong");

        buttons.forEach(btn=>{

            if(
                btn.textContent.includes(q.answer)
            ){
                btn.classList.add("correct");
            }

        });

        speak(
        "Jawabanmu salah. Jawaban yang benar adalah " +
        q.answer
        );

    }

    setTimeout(() => {

        actionBtn.textContent =
        "➡️ Next";

        actionBtn.onclick = () => {

            nextQuestion();

        };

    }, 3000);

}

/* ========================= */
/* NEXT QUESTION */
/* ========================= */

function nextQuestion() {

    currentQuestion++;

    if(currentQuestion < questions.length){

        showQuestion();

    }else{

        gameFinished();

    }

}

/* ========================= */
/* GAME FINISHED */
/* ========================= */

function gameFinished() {

    questionNumberEl.textContent =
    "🎉 Permainan Selesai";

    questionEl.innerHTML =
    `Selamat!<br><br>Skor Kamu: ${score}`;

    optionsEl.innerHTML = "";

    actionBtn.textContent =
    "🔄 Main Lagi";

    actionBtn.onclick =
    restartGame;

    speak(
    `Permainan selesai. Skor kamu ${score}`
    );

}

/* ========================= */
/* RESTART */
/* ========================= */

function restartGame() {

    speechSynthesis.cancel();

    bgMusic.pause();

    bgMusic.currentTime = 0;

    openingMusic.currentTime = 0;

    openingMusic.play();

    gameScreen.style.display =
    "none";

    startScreen.style.display =
    "flex";

}

/* ========================= */
/* SPEAK QUESTION */
/* ========================= */

function speakQuestion() {

    const q =
    questions[currentQuestion];

    let text =
    q.question + ". ";

    const letters =
    ["A","B","C"];

    q.options.forEach((option,index)=>{

        text +=
        letters[index] +
        ". " +
        option +
        ". ";

    });

    speak(text);

}

/* ========================= */
/* SPEAK */
/* ========================= */

function speak(text) {

    speechSynthesis.cancel();

    if(bgMusic){

        bgMusic.volume = 0.05;

    }

    const speech =
    new SpeechSynthesisUtterance(text);

    speech.lang = "id-ID";

    speech.rate = 0.9;

    speech.pitch = 1.1;

    speech.volume = 1;

    speech.onend = () => {

        if(bgMusic){

            bgMusic.volume = 0.15;

        }

    };

    speechSynthesis.speak(speech);

}