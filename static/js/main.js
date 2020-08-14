function increaseFont() {
    if (document.querySelector(".center").style.fontSize == "") {
        document.querySelector(".center").style.fontSize = "1.0em";
    }
    document.querySelector(".center").style.fontSize = parseFloat( document.querySelector(".center").style.fontSize) + 0.05 + "em";
}

function decreaseFont() {
    if (document.querySelector(".center").style.fontSize == "") {
        document.querySelector(".center").style.fontSize = "1.0em";
    }
    document.querySelector(".center").style.fontSize = parseFloat( document.querySelector(".center").style.fontSize) - 0.05 + "em";
}