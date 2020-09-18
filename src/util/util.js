export function hideBg() {
    var hideobj=document.getElementById("hidebgDiv");
    hideobj.style.display="block";
}


export function activeBg() {
    var hideobj=document.getElementById("hidebgDiv");
    hideobj.style.display="none";
}

export function displayPop(id) {
    var popObj=document.getElementById(id);
    popObj.style.display="block";
}

export function hidePop(id) {
    var popObj=document.getElementById(id);
    popObj.style.display="none";
}

