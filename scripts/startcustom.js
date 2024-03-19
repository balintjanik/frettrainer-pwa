const stringCheckboxes = document.querySelectorAll(".stringCheckbox")
const noteTypeCheckboxes = document.querySelectorAll(".notetype")
const stringlbls = document.querySelectorAll(".stringlbl")
const emptybtn = document.querySelector("#presetempty")
const easybtn = document.querySelector("#preseteasy")
const mediumbtn = document.querySelector("#presetmedium")
const hardbtn = document.querySelector("#presethard")
const checkcontainer = document.querySelector("#checkcontainer")
const startbtn = document.getElementById("startbtn");
const backbtn = document.getElementById("backbtn");

startbtn.addEventListener("click", startGame);

stringCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', () => {
        toggleLabelClass(checkbox.id);
    });
});

stringCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', () => {
        toggleDifficultyOptions(checkbox.id);
    });
});

noteTypeCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', () => {
        checkForNoteType(checkbox.name);
    });
});

emptybtn.addEventListener("click", function(){
    const checkboxes = checkcontainer.querySelectorAll('input[type="checkbox"]');
    const checkboxesArr = Array.from(checkboxes);
    checkboxesArr.forEach(checkbox => {
        if (checkbox.checked == true){
            checkbox.checked = false;
            checkbox.dispatchEvent(new Event('change'));
        }
    });
})

easybtn.addEventListener("click", function(){
    stringCheckboxes.forEach(checkbox => {
        if (checkbox.checked == false){
            checkbox.checked = true;
            checkbox.dispatchEvent(new Event('change'));
        }
        const notesId = `notes${checkbox.id.slice(-1)}`;
        const notes = document.getElementById(notesId);
        const inputElements = notes.querySelectorAll('input[type="checkbox"]');
        const optionsCheckboxes = Array.from(inputElements);
        optionsCheckboxes[0].checked = true;
        optionsCheckboxes[1].checked = false;
        optionsCheckboxes[2].checked = false;
    });
})

mediumbtn.addEventListener("click", function(){
    stringCheckboxes.forEach(checkbox => {
        if (checkbox.checked == false){
            checkbox.checked = true;
            checkbox.dispatchEvent(new Event('change'));
        }
        const notesId = `notes${checkbox.id.slice(-1)}`;
        const notes = document.getElementById(notesId);
        const inputElements = notes.querySelectorAll('input[type="checkbox"]');
        const optionsCheckboxes = Array.from(inputElements);
        optionsCheckboxes[0].checked = true;
        optionsCheckboxes[1].checked = true;
        optionsCheckboxes[2].checked = false;
    });
})

hardbtn.addEventListener("click", function(){
    const checkboxes = checkcontainer.querySelectorAll('input[type="checkbox"]');
    const checkboxesArr = Array.from(checkboxes);
    checkboxesArr.forEach(checkbox => {
        if (checkbox.checked == false){
            checkbox.checked = true;
            checkbox.dispatchEvent(new Event('change'));
        }
    });
})

function toggleLabelClass(stringCheckboxId){
    const stringlblId = `stringlbl${stringCheckboxId.slice(-1)}`;
    const stringlbl = document.getElementById(stringlblId);
    stringlbl.classList.toggle("checked");
}

function checkForNoteType(ownName){
    const notesId = `notes${ownName.slice(-1)}`;
    const notes = document.getElementById(notesId);
    if (!notes.classList.contains('hidden')){
        checkAtLeastOne(notes);
    }
}

function toggleDifficultyOptions(stringCheckboxId) {
    const notesId = `notes${stringCheckboxId.slice(-1)}`;
    const notes = document.getElementById(notesId);

    if (notes) {
        notes.classList.toggle('hidden', !document.getElementById(stringCheckboxId).checked);
    }

    if (!notes.classList.contains('hidden')){
        checkAtLeastOne(notes);
    } else {
        uncheckAll(notes);
    }
}

function checkAtLeastOne(notes){
    const inputElements = notes.querySelectorAll('input[type="checkbox"]');
    const optionsCheckboxes = Array.from(inputElements);

    // Ensure at least one option is checked
    const atLeastOneChecked = Array.from(optionsCheckboxes).some(optionCheckbox => optionCheckbox.checked);
    if (!atLeastOneChecked) {
        optionsCheckboxes[0].checked = true;
    }
}

function uncheckAll(notes){
    const inputElements = notes.querySelectorAll('input[type="checkbox"]');
    const optionsCheckboxes = Array.from(inputElements);

    // disable all
    for (let i = 0; i < optionsCheckboxes.length; i++){
        optionsCheckboxes[i].checked = false;
    }
}

function startGame() {
    let settings = [];
    stringCheckboxes.forEach(checkbox => {
        const notesId = `notes${checkbox.id.slice(-1)}`;
        const notes = document.getElementById(notesId);
        const inputElements = notes.querySelectorAll('input[type="checkbox"]');
        const optionsCheckboxes = Array.from(inputElements);
        let string = []
        string[0] = optionsCheckboxes[0].checked
        string[1] = optionsCheckboxes[1].checked
        string[2] = optionsCheckboxes[2].checked
        settings.push(string)
    });
    if (settings.every(string => string.every(value => value === false))){
        alert("No strings were set");
    } else {
        const url = `game.html?mode=${encodeURIComponent("custom")}&settings=${encodeURIComponent(settings)}`;
        window.location.href = url;
    }
}

backbtn.addEventListener("click", function(){
    window.location.href = ".";
});