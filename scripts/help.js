const helpbtn = document.getElementById('helpbtn');
const backbtn = document.getElementById('backbtn');
const helpcontainer = document.getElementById('helpcontainer');

helpbtn.addEventListener("click", toggleHelp);
backbtn.addEventListener("click", toggleHelp);

function toggleHelp(){
    helpcontainer.classList.toggle("active")
}