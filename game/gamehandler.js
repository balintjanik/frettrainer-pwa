import { string6, string5, string4, string3, string2, string1 } from './strings.js';

const strings = [ string6, string5, string4, string3, string2, string1 ];
let gamemode = '';
let cooldown = false;
let checkNote = function(){}
let successAudio, levelupAudio;

// endless specific variables
let level, difficulty, expectedNote = 0
let progress = 0;
const progressbar = document.getElementById("progression")
const progressMaxWidth = 50;
const lvllabel = document.getElementById("lvllabel")
let maxlevelreached = false;

// custom specific variables
let custompool = [];

// string visualization variables
const noteText = document.getElementById("note")
const notehelpText = document.getElementById("notehelp")
const stringsDisp = document.querySelectorAll(".string")
const stringsCircDisp = document.querySelectorAll(".stringcirc")

function checkNoteEndless(actualNote, actualNoteOctave){
    let actualData = formattedToData((actualNote + actualNoteOctave));
    if (!cooldown && actualData == expectedNote.note){
        successAudio.src = './data/success.mp3';
        //const successAudio = new Audio('./data/success.mp3');
        successAudio.play();
        base.classList.add("active");
        cooldown = true;
        setTimeout(function(){
            base.classList.remove("active");
            cooldown = false;

            if (!maxlevelreached){
                progress++;
                progressbar.style.width = (progressMaxWidth / difficulty) * (progress%difficulty) + "vw";
                if (progress % difficulty == 0){
                    if (level != 24)
                    {
                        levelupAudio.src = './data/levelup.mp3';
                        //const levelupAudio = new Audio('./data/levelup.mp3');
                        levelupAudio.play();
                        level++;
                        lvllabel.innerText = "LEVEL " + level;
                    } else {
                        maxlevelreached = true;
                        progressbar.style.width = progressMaxWidth +  "vw";
                        lvllabel.innerText = "MAX LEVEL FINISHED";
                    }
                }
                
            }

            expectedNote = getNextNoteEndless()
            updateString(expectedNote.string-1);
            noteText.innerText = dataToFormatted(expectedNote.note) + (expectedNote.fret == 12 ? '°' : ''); // add ° if it's an octave
            notehelpText.innerText = "String " + expectedNote.string + ", Fret " + expectedNote.fret;
            console.log("Expected: " + expectedNote.note)
        }, 520);
    }
}

function getNextNoteEndless(){
    let pool = []

    // elvileg jo V
    let stringCount = Math.floor((level-1)/4)+1
    if (level % 4 == 0){
        for (let i = 0; i < stringCount; i++){
            pool = pool.concat(strings[i].filter(obj => obj.type === 'whole'));
            pool = pool.concat(strings[i].filter(obj => obj.type === 'half'));
            pool = pool.concat(strings[i].filter(obj => obj.type === 'high'));
        }
    } else if (level % 4 == 1){
        pool = pool.concat(strings[stringCount-1].filter(obj => obj.type === 'whole'));
    } else if (level % 4 == 2){
        pool = pool.concat(strings[stringCount-1].filter(obj => obj.type === 'whole'));
        pool = pool.concat(strings[stringCount-1].filter(obj => obj.type === 'half'));
    } else if (level % 4 == 3)
    {
        pool = strings[stringCount-1];
    }
    console.log(pool)

    // avoid duplicate notes
    let newnote = pool[Math.floor(Math.random() * pool.length)];
    while(newnote.note == expectedNote.note){
        newnote = pool[Math.floor(Math.random() * pool.length)];
        console.log("DUPLICATE AVOIDEDDDDDDDDDDDDDDDDDDDd")
    }
    return newnote;
}

function updateString(index){
    clearStringDisps();
    stringsDisp[index].style.backgroundColor = '#3498db';
    stringsCircDisp[index].style.backgroundColor = '#3498db';
    stringsCircDisp[index].style.color = '#FFFFFF';
}

function clearStringDisps(){
    stringsDisp.forEach(string => {
        string.style.backgroundColor = '#333333'
    });
    stringsCircDisp.forEach(stringCirc => {
        stringCirc.style.backgroundColor = '#333333'
        stringCirc.style.color = '#777777'
    });
}

function checkNoteCustom(actualNote, actualNoteOctave){
    let actualData = formattedToData((actualNote + actualNoteOctave));
    if (!cooldown && actualData == expectedNote.note){
        //const successAudio = new Audio('./data/success.mp3');
        successAudio.src = './data/success.mp3';
        successAudio.play();
        base.classList.add("active");
        cooldown = true;
        setTimeout(function(){
            base.classList.remove("active");
            cooldown = false;
            expectedNote = getNextNoteCustom()
            updateString(expectedNote.string-1);
            noteText.innerText = dataToFormatted(expectedNote.note) + (expectedNote.fret == 12 ? '°' : ''); // add ° if it's an octave
            notehelpText.innerText = "String " + expectedNote.string + ", Fret " + expectedNote.fret;
            console.log("Expected: " + expectedNote.note)
        }, 520);
    }
}

function getNextNoteCustom(){
    // avoid duplicate notes
    let newnote = custompool[Math.floor(Math.random() * custompool.length)];
    while(newnote.note == expectedNote.note){
        newnote = custompool[Math.floor(Math.random() * custompool.length)];
    }
    return newnote;
}

function formattedToData(str){
    const firstChar = str.charAt(0).toLowerCase();
    let n = str.length;
    if (n == 3){
        const secondChar = "s";
        const thirdChar = str.charAt(2);
        return firstChar + secondChar + thirdChar;
    } else {
        const secondChar = str.charAt(1);
        return firstChar + secondChar
    }
}

function dataToFormatted(str){
    const firstChar = str.charAt(0).toUpperCase();
    let n = str.length;
    if (n == 3){
        const secondChar = "#";
        return firstChar + secondChar;
    } else {
        return firstChar;
    }
}

export function initModel(){
    const urlParams = new URLSearchParams(window.location.search);
    gamemode = urlParams.get('mode');
    if (gamemode == 'endless'){
        level = urlParams.get('level')
        lvllabel.innerText = "LEVEL " + level;
        difficulty = urlParams.get('difficulty')
        checkNote = checkNoteEndless;
        expectedNote = getNextNoteEndless();
        updateString(expectedNote.string-1);
        noteText.innerText = dataToFormatted(expectedNote.note) + (expectedNote.fret == 12 ? '°' : ''); // add ° if it's an octave
        notehelpText.innerText = "String " + expectedNote.string + ", Fret " + expectedNote.fret;
        document.getElementById("progressbar").style.opacity = 1;
        document.getElementById("lvllabel").style.opacity = 1;
        console.log("Expected: " + expectedNote.note)
    } else {
        // url param is a string, convertion to boolean array is needed
        const settings = urlParams.get('settings').split(',').map(function(item) { return item === 'true'; });
        for (let i = 0; i < 18; i++){
            if (settings[i]){
                const ind = 5-Math.floor(i/3);
                if (i % 3 == 0){
                    custompool = custompool.concat(strings[ind].filter(obj => obj.type === 'whole'));
                } else if (i % 3 == 1){
                    custompool = custompool.concat(strings[ind].filter(obj => obj.type === 'half'));
                } else if (i % 3 == 2){
                    custompool = custompool.concat(strings[ind].filter(obj => obj.type === 'high'));
                }
            }
        }
        console.log(custompool)
        checkNote = checkNoteCustom;
        expectedNote = getNextNoteCustom();
        updateString(expectedNote.string-1);
        noteText.innerText = dataToFormatted(expectedNote.note) + (expectedNote.fret == 12 ? '°' : ''); // add ° if it's an octave
        notehelpText.innerText = "String " + expectedNote.string + ", Fret " + expectedNote.fret;
        console.log("Expected: " + expectedNote.note)
    }
}

document.getElementById("test").addEventListener("click", function(){
    getNextNoteEndless();
});

document.getElementById("backbtn").addEventListener("click", function(){
    window.location.href = ".";
});


let wakeLock = null;

// Safari only let's audio play on user interaction, so we init the audio objects and play the sounds on start button press
// We interrupt the play after 10 millisecs, so the sound cannot be heard, but IOS is outplayed
document.getElementById("start").addEventListener("click", function(){
    successAudio = new Audio('./data/success.mp3');
    successAudio.play();
    setTimeout(function(){successAudio.pause(); successAudio.currentTime = 0;}, 10);
    levelupAudio = new Audio('./data/levelup.mp3');
    setTimeout(function(){levelupAudio.pause(); levelupAudio.currentTime = 0;}, 10);
    levelupAudio.play();

    window.scrollTo(0,1);

    if (wakeLock === null) {
        requestWakeLock();
    }
})

async function requestWakeLock() {
    try {
        wakeLock = await navigator.wakeLock.request('screen');
        console.log('Wake lock activated');
    } catch (err) {
        console.error(`Failed to request wake lock: ${err}`);
    }
}

function releaseWakeLock() {
    if (wakeLock !== null) {
        wakeLock.release();
        wakeLock = null;
        console.log('Wake lock released');
    }
}

document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      requestWakeLock();
    } else {
      releaseWakeLock();
    }
});

export { checkNote }