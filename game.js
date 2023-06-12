import four_letters from './word_files/four_letters.json' assert { type: 'json' };
import five_letters from './word_files/five_letters.json' assert { type: 'json' };
import three_letters from './word_files/three_letters.json' assert { type: 'json' };


const boxes = Array.from(document.querySelectorAll('.box'));
const keys = document.querySelectorAll('.key');
const popup = document.querySelector('.popup');

let paused = false;

const words = four_letters['words'];

function randomWord() {
    return words[Math.floor(Math.random() * words.length)];
}


const word = randomWord().toUpperCase();
console.log(word)
let guessWord = ''
let guessCount = 1;

let score = 12;


keys.forEach((key) => {
    key.addEventListener('click', (e) => {

        const letter = e.target.innerText;

        if (paused) return;

        if (letter === '←') {
            eraseLetter();

            return;
        }

        if (letter == 'Enter') {
            if (guessWord.length !== 4) return;

            changeBoxColor();
            checkWin();

            return;
        }

        insertLetter(letter);
    })
})

document.addEventListener('keyup', (event) => {

    if (paused) return;

    if (event.key == 'Backspace') eraseLetter();

    if (event.key === 'Enter') {
        if (guessWord.length !== 4) return;

        changeBoxColor();
        checkWin();

        // const currentActiveInd = boxes.findIndex(getActiveBox);
        // boxes[currentActiveInd].classList.remove('selected');

        // const activeInd = guessCount * 4;
        // boxes[activeInd].classList.add('selected');

        // guessWord = '';
        // guessCount += 1;

        // score -= 2;
    }


    if (event.key.match('[A-Za-z]') === null || event.key.length !== 1) {
        return;
    }

    insertLetter(event.key.toUpperCase());
})

// get current active box where letter need to be inserted
function getActiveBox(box, index) {
    return box.classList.contains('selected');
}

function eraseLetter() {
    const activeBox = boxes.findIndex(getActiveBox);
    boxes[activeBox].classList.remove('selected');

    guessWord = guessWord.substring(0, guessWord.length - 1);
    const pos = (word.length * (guessCount - 1)) + guessWord.length;

    boxes[pos].innerText = '';
    boxes[pos].classList.add('selected');
}

function changeBoxColor() {
    const currentActiveIndex = boxes.findIndex(getActiveBox) + 1;
    const previousBoxes = [...boxes].slice((guessCount * 4) - 4, currentActiveIndex);

    previousBoxes.forEach((box, ind) => {
        console.log(box.innerText, '    ', word[ind]);
        if (box.innerText === word[ind]) {
            box.style.color = 'white';
            box.style.backgroundColor = 'green';

            // changing color of key elements
            keys.forEach((k) => {
                if (k.innerText === word[ind]) {
                    k.style.backgroundColor = 'green';
                }
            })

        } else if (word.includes(box.innerText)) {
            box.style.color = 'white';
            box.style.backgroundColor = '#d4bc22';

            keys.forEach((k) => {
                if (box.innerText === k.innerText) {
                    k.style.backgroundColor = '#d4bc22';
                }
            })
        } else {
            box.style.color = 'white';
            box.style.backgroundColor = '#292929';

            keys.forEach((k) => {
                if (box.innerText === k.innerText) {
                    k.style.backgroundColor = '#292929';
                }
            })

        }
    })
}

function checkWin() {
    if (guessWord === word) {
        console.log('You Won !!!');

        clearInterval(interval);

        paused = true
        showPopup('You Won !!!', `Score : ${score}`);

        return true;
    }

    if (guessCount == 6) {
        console.log('You lost :(');

        clearInterval(interval);

        paused = true;
        showPopup('You Lost :(', `The correct word was ${word}`);

        return true;
    }
    const currentActiveInd = boxes.findIndex(getActiveBox);
    boxes[currentActiveInd].classList.remove('selected');

    const activeInd = guessCount * 4;
    boxes[activeInd].classList.add('selected');

    guessWord = '';
    guessCount += 1;

    score -= 2;
}

function insertLetter(key) {
    const pos = boxes.findIndex(getActiveBox);
    const activeBox = boxes[pos];

    activeBox.innerText = key;

    if (guessWord.length === word.length) {
        guessWord = guessWord.substring(0, guessWord.length - 1);
    }

    guessWord += key;

    if (guessWord.length !== word.length) {
        activeBox.classList.remove('selected');
        boxes[pos + 1].classList.add('selected');
    }
}

// show popup on win or loss

function showPopup(title, message) {
    popup.querySelector('h2').innerText = title;
    popup.querySelector('p').innerText = message;

    popup.style.transform = 'scale(1)';
}


// reset the game

document.querySelector('button.play').addEventListener('click', (e) => {
    location.reload();
})

// start timer

let countdown = 59;
let interval = null;

const startTimer = () => {
    const timer = document.querySelector('.timer');
    const timer_val = timer.querySelector('.circle');

    

    interval = setInterval(() => {
        timer.style.background = `conic-gradient(rgb(236, 181, 15) ${(60 - countdown) * 6}deg, rgb(47, 45, 45) 0deg)`;

        timer_val.innerText = `0:${countdown}`;
        countdown--;


        if (countdown < 0) {

            showPopup('Times up !!!', `The correct word was ${word}`);

            timer_val.innerText = `0:00`;
            clearInterval(interval);
        }
    }, 1000)
}

startTimer();

