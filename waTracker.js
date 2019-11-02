//WhatsApp on Web stalker JS
//Copyright (c) 2016 Parh Parikh 
//Distributed under MIT License
//Usage
//Open the chat you want to monitor
//stalk() to start stalking, return intervalId
//stalk(intervalId) to stop stalking
//Output is in console
//Quick Start
//Open Browser console, copy the code in console, write stalk()
//Happy stalking :)

var csvContent = "data:text/csv;charset=utf-8,Name,Status,Time,Date\n";
var globIntId = -1;
var buttonAdded = false;
function f() {
    try {
        b = document.querySelector('#main > header > div>div>span').textContent;
        name = document.querySelectorAll('#main > header > div>div>div>span')[1].textContent;
    } catch (TypeError) {
        return;
    }
    if (b === "typing…" && typing) {
        typing = false;
        if (checkPermission()) {
            var not = new Notification(name + " Typing");
            tm = new Date();
            csvContent += name + ",2," + tm.toLocaleTimeString() + "," + tm.toLocaleDateString() + "\n";
        }
    }
    if (b === "online" || b === "typing…") {
        if (b === "online") {
            typing = true;
        }
        if (!online || name !== lastName || ft) {
            online = true;
            lastName = name;
            ft = false;
            onlineTimeObj = new Date();
            onlineTimeMs = onlineTimeObj.getTime();
            onlineTimeStr = onlineTimeObj.toLocaleString();
            console.log(name + ",1," + onlineTimeObj.toLocaleTimeString() + "," + onlineTimeObj.toLocaleDateString() + "\n");
            csvContent += name + ",1," + onlineTimeObj.toLocaleTimeString() + "," + onlineTimeObj.toLocaleDateString() + "\n";
            if (checkPermission()) {
                var not = new Notification(name + " Online",{
                    body: onlineTimeStr
                });
            }
        }
    }
    if (b.search("last seen") > -1) {
        if (online || ft || name !== lastName) {
            online = false;
            ft = false;
            lastName = name;
            typing = true;
            offlineTimeObj = new Date();
            offlineTimeMs = offlineTimeObj.getTime();
            offlineTimeStr = offlineTimeObj.toLocaleString();
            console.log(name + ",0," + offlineTimeObj.toLocaleTimeString() + "," + offlineTimeObj.toLocaleDateString() + "\n");
            csvContent += name + ",0," + offlineTimeObj.toLocaleTimeString() + "," + offlineTimeObj.toLocaleDateString() + "\n";
            if (checkPermission()) {
                var not = new Notification(name + " Offline",{
                    body: b
                });
            }
        }
    }
}
function stalk(intervalId) {
    intervalId = intervalId || false;
    ft = true;
    online = false;
    typing = true;
    csvContent = "data:text/csv;charset=utf-8,Name,Status,Time,Date\n";
    if (!buttonAdded) {
        putCSVLink();
        putStopStalkButton();
        buttonAdded = true;
    }
    try {
        lastName = document.querySelector("#main > header > div.chat-body > div.chat-main > h2 > span");
    } catch (TypeError) {
        //stalk();
        return;
    }
    if (intervalId !== false) {
        clearInterval(intervalId);
        globIntId = -1;
        return true;
    }
    interval = setInterval(f, 1000);
    globIntId = interval;
    alert("Stalking");
    //document.querySelector("#side > header > div.pane-list-user").textContent += "Stalking";
    return interval;
}
//Modified Code from Notifiaction API example from MDN 
function checkPermission() {
    // Let's check if the browser supports notifications
    if (!("Notification"in window)) {
        return flase;
    }// Let's check whether notification permissions have already been granted
    else if (Notification.permission === "granted") {
        // If it's okay let's create a notification
        return true;
    }// Otherwise, we need to ask the user for permission
    else if (Notification.permission !== 'denied') {
        Notification.requestPermission(function(permission) {
            // If the user accepts, let's create a notification
            if (permission === "granted") {
                return true;
            }
        });
    }
    // At last, if the user has denied notifications, and you 
    // want to be respectful there is no need to bother them any more.
}
function getCSV(data) {
    data = encodeURI(data);
    var link = document.createElement("a");
    link.setAttribute("href", data);
    link.setAttribute("download", "stalk_data.csv");
    document.body.appendChild(link);
    link.click();
}
function getStalkData() {
    getCSV(csvContent);
}
function putCSVLink() {
    var button = document.createElement("button");
    button.textContent = "GetStalkCSV";
    button.className = "stalker";
    button.onclick = getStalkData;
    var sideBar = document.querySelector("#side > header");
    sideBar.appendChild(button);
}
function toggleStalk() {
    if (globIntId === -1) {
        stalk();
        this.textContent = "Stop";
    } else {
        clearInterval(globIntId);
        globIntId = -1;
        alert("Stalking Stopped");
        this.textContent = "Start";
        console.log("Stopped Stalking");
    }
}
function putStopStalkButton() {
    var button = document.createElement("button");
    button.className = "stalker";
    button.textContent = "ToggleStalk";
    button.onclick = toggleStalk;
    var sideBar = document.querySelector("#side > header");
    sideBar.appendChild(button);
}
stalk();
