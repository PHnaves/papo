// Message ballons: classname = "message sent" ou "message received"
var ws = new WebSocket("ws://" + window.location.hostname + ":8080");

// TODO Request all communities

function sendmsg() {
    let usertext = msginput.value;

    // Had to chain, what a shame
    if (usertext.length == 0) {
        return;
    }
    // Character limit of 2000 chars, no security implemented server-side because I don't think anyone is going to abuse that
    if (usertext.length > 2000) {
        usertext = usertext.substring(0, 2000);
    }

    const data = {
        user: localStorage.getItem("RA"),
        useravatar: 1,
        messagecontent: usertext,
        to: "all",
    };

    console.log(data)

    ws.send("msg" + JSON.stringify(data));

    msginput.value = "";

}

function gettimeformsg() {
    const d = new Date();
    const time = d.toLocaleString("pt-br", { hour: "numeric", minute: "numeric" });
    let t;
    if (d.getHours() > 12) {
        t = "PM";
    }
    else {
        t = "AM";
    }

    return time + " " + t;
}

function rendermsg(data) {
    // Get message -> check if message is theirs, apply style
    data = data.substring(3, data.length);
    const msgcamp = document.getElementById("messages");
    const msginput = document.getElementById("msginput");
    const divbubble = document.createElement("div");
    const bubbletext = document.createElement("p");
    const messagetime = document.createElement("span");


    divbubble.className = "message sent";
    messagetime.className = "message-time";

    try {
        data = JSON.parse(data);

        if (data["user"] == localStorage.getItem("RA")) {
            divbubble.className = "message sent";
        }
        else {
            divbubble.className = "message received";
        }

        msgcamp.appendChild(divbubble);
        divbubble.appendChild(bubbletext);
        divbubble.appendChild(messagetime);
        bubbletext.textContent = data["messagecontent"];
        messagetime.textContent = gettimeformsg();

        // Scrolling automatically to last message, for convenience
        msgcamp.scrollTop = msgcamp.scrollHeight;
    }
    catch (e) {
        console.log(`Error while rendering msg ${e}`);
        console.log(`For reference, data: ${data}`);
    }
}

// document loaded
window.onload = function () {
    
    const sendbtn = document.getElementById("sendbtn");

    sendbtn.addEventListener("click", sendmsg);

    ws.onopen = function () {
        console.log("Connection established");
        ws.send("png");
        ws.send("gdm") // Get past messages
        ws.send("chk" + JSON.stringify({ "SessionID": sessionStorage.getItem("Session_ID"), "AccountRef": sessionStorage.getItem("ID_Ref") }));
    };
    ws.onmessage = function (event) {
        console.log("Data has been received: " + event.data);

        if (event.data.length < 4) {
            return;
        }

        switch (event.data.substring(0, 3)) {
            case "msg":
                console.log("Message!");
                rendermsg(event.data);
                break;
            case "png":
                break;
            case "sys":
                console.log("System message!");
                break;
            case "ath":
                console.log("Authentication message!");
                // Should have been implemented in auth_script.js tbh

                break;

            case "chk":
                const chkinfo = {
                    "SessionID": sessionStorage.getItem("Session_ID"),
                    "AccountRef": sessionStorage.getItem("ID_Ref")
                }

                console.log("Authentication requested");

                ws.send("chk" + JSON.parse(chkinfo))
                break;

            default:
                console.log("Data has been received, but no valid command was found: " + event.data);
        }
    };
    ws.onerror = function (error) {
        console.log("Error: " + error.target);
    };
    ws.onclose = function () {
        console.log("Connection closed");
    };
}
