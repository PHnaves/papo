var socket = new WebSocket("ws://172.30.2.235:8080");

window.onload = function () {
  console.log("Window has loaded");

  // Get data based on Session data

  // Verify if login info is valid, if it is not, return to login page
};

socket.onopen = function () {
  console.log("Connection established");
  socket.send("png");
};
socket.onmessage = function (event) {
  console.log("Data received: " + event.data);
  const req = event.data.substring(0, 3);
  console.log("req: " + req);

  switch (req) {
    case "msg":
      const jsonmsg = event.data.substring(4, event.data.length);
      console.log("Message: ", jsonmsg);
      renderMsg(event.data);
      break;
    case "sys":
      renderSysMsg(event.data);
      break;
    default:
      break;
  }
};
socket.onclose = function () {
  console.log("Connection closed or lost");

  socket.close();

  const conlost = {
    type: "error",
    notif_message: "Conexão perdida :(",
    reason: "Problema de rede",
  };

  renderSysMsg("sys" + JSON.stringify(conlost));
  socket = null;
};

socket.onerror = function (error) {
  console.log("Error: " + error.target);
};

// Pinging

function renderMsg(jsonmsg) {
  jsonmsg = JSON.parse(jsonmsg.substring(3, jsonmsg.length));
  const author = jsonmsg["user"];
  const d = new Date();

  const msgCamp = document.getElementById("msgCamp");
  const mB = document.createElement("div");
  mB.className = "msgBubble";
  authorP = document.createElement("p");
  dateP = document.createElement("p");
  msgP = document.createElement("p");
  authorP.className = "msgAuthor";
  authorP.textContent = author;
  msgP.textContent = jsonmsg["messagecontent"];
  dateP.className = "msgTimeDate";
  dateP.textContent = `${d.toLocaleDateString("pt-br", {
    weekday: "long",
  })}, ${d.getHours()}:${d.getMinutes()}`;

  mB.appendChild(authorP);
  mB.appendChild(msgP);
  mB.appendChild(dateP);
  msgCamp.appendChild(mB);
}

function communicateWithServer(msg) {
  if (socket == null) {
    console.log("Attempting to reconnect");
    try {
      socket = new WebSocket("ws://172.30.2.74:4242");
    } catch (error) {
      console.log("Failed to reconnect, error: " + error);
      socket = null;
      return;
    }
  }
  // The 'msg' is sent to the server as a request to send a message
  const data = {
    user: localStorage.getItem("RA"),
    useravatar: 1,
    messagecontent: msg,
    to: "all",
  };

  console.log(data);

  const msgjson = JSON.stringify(data);

  socket.send("msg" + msgjson);
}

function renderownmsg() {
  const msg = document.getElementById("msgInput").value;

  communicateWithServer(msg);

  document.getElementById("msgInput").value = ""; // Clear message
}

function renderSysMsg(data) {
  console.log(data.substring(3, data.length));
  const datajson = JSON.parse(data.substring(3, data.length));

  let bgcolor = "";
  console.log(datajson);
  /* Types: warning, error, info */

  switch (datajson["type"]) {
    case "warning":
      bgcolor = "y"; // Yellow
      break;
    case "error":
      bgcolor = "r";
      break;
    case "info":
      bgcolor = "g";
      break;
    default:
      bgcolor = "r"; // Most likely system error
      break;
  }
  const divbg = document.createElement("div");
  const pdescription = document.createElement("p");
  pdescription.textContent = datajson["notif_message"];
  const reason = document.createElement("p");
  reason.textContent = datajson["reason"];

  divbg.className = "sysmsg " + bgcolor;

  document.body.appendChild(divbg);
  divbg.appendChild(pdescription);
  divbg.appendChild(reason);
}
