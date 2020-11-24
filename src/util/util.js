export function hideBg() {
    var hideobj=document.getElementById("hidebgDiv");
    hideobj.style.display="block";
}

export function displayBgMsg(msg) {
    var msgDivObj=document.getElementById("hidebgMsgDiv");
    msgDivObj.style.display="block";
    var msgObj=document.getElementById("hidebgMsgText");
    msgObj.innerHTML=msg
}

export function hideBgMsg() {
    var msgDivObj=document.getElementById("hidebgMsgDiv");
    msgDivObj.style.display="none";
    var msgObj=document.getElementById("hidebgMsgText");
    msgObj.innerHTML=''
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

