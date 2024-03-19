const helpbtn = document.getElementById('helpbtn');
const backbtn = document.getElementById('backbtn');
const helpcontainer = document.getElementById('helpcontainer');

helpbtn.addEventListener("click", toggleHelp);
backbtn.addEventListener("click", toggleHelp);

if (!helpcontainer.classList.contains("active")){
    helpcontainer.style.top = `calc(100vh + 400px)`;
}

function toggleHelp(){
    helpcontainer.classList.toggle("active")
    if (!helpcontainer.classList.contains("active")){
        helpcontainer.style.top = `calc(100vh + 400px)`;
    }
}