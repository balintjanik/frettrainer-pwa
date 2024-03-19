const startbtn = document.getElementById("startbtn");
const backbtn = document.getElementById("backbtn");

startbtn.addEventListener("click", startGame);

var selectlvl = document.getElementById("startlvlinp");
for (var i = 1; i <= 24; i++) {
    var option = document.createElement("option");
    option.text = i;
    option.value = i;
    selectlvl.appendChild(option);
}
var selectdiff = document.getElementById("notesperlvlinp");
for (var i = 1; i <= 50; i++) {
    var option = document.createElement("option");
    option.text = i;
    option.value = i;
    selectdiff.appendChild(option);
}
selectdiff.value = 10;

function startGame() {
    const startlvl = document.getElementById('startlvlinp').value;
    const notesperlvl = document.getElementById('notesperlvlinp').value;

    const url = `game.html?mode=${encodeURIComponent("endless")}&difficulty=${encodeURIComponent(notesperlvl)}&level=${encodeURIComponent(startlvl)}`;

    window.location.href = url;
}

backbtn.addEventListener("click", function(){
    window.location.href = ".";
});