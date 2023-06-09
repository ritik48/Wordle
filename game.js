import four_letters from './word_files/four_letters.json' assert { type: 'json' };
import five_letters from './word_files/five_letters.json' assert { type: 'json' };
import three_letters from './word_files/three_letters.json' assert { type: 'json' };


const boxes = Array.from(document.querySelectorAll('.box'));

const words = four_letters['words'];

function randomWord() {
    return words[Math.floor(Math.random() * words.length)];
}


const word = randomWord().toUpperCase();
console.log(word)
let guessWord = ''
let guessCount = 1;

document.addEventListener('keyup', (event) => {
    if(event.key == 'Backspace'){
        eraseLetter();
    }

    if(event.key === 'Enter') {
        if(guessWord.length !== 4) return;

        changeBoxColor();
        if(checkWin()) return;

        const currentActiveInd = boxes.findIndex(getActiveBox);
        boxes[currentActiveInd].classList.remove('selected');

        const activeInd = guessCount * 4;
        boxes[activeInd].classList.add('selected');

        guessWord = '';
        guessCount += 1;
    }

    
    if(event.key.match('[A-Za-z]')===null || event.key.length!==1) {
        return;
    }

    const pos = boxes.findIndex(getActiveBox);
    const activeBox = boxes[pos];
    
    activeBox.innerText = event.key.toUpperCase();

    if(guessWord.length === word.length) {
        guessWord = guessWord.substring(0, guessWord.length-1);
    }

    guessWord += event.key.toUpperCase();
   
    if(guessWord.length !== word.length)
    {
        activeBox.classList.remove('selected');
        boxes[pos+1].classList.add('selected');
    }
})

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
        console.log(box.innerText,'    ', word[ind]);
        if(box.innerText === word[ind]) {
            box.style.color = 'white';
            box.style.backgroundColor = 'green';
        } else if(word.includes(box.innerText)) {
            box.style.color = 'white';
            box.style.backgroundColor = '#d4bc22';
        } else {
            box.style.color = 'white';
            box.style.backgroundColor = '#292929';
        }
    })
}

function checkWin() {
    if(guessWord === word) {
        console.log('You Won !!!');

        setTimeout(() => {
            location.reload();
        }, 1000);
        
        return true;
    }
    if(guessCount == 6) {
        console.log('You lost :(');
        

        setTimeout(() => {
            location.reload();
        }, 1000);

        return true;
    }
    return false;
}


