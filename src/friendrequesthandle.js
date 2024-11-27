let ws = new WebSocket("ws://" + window.location.hostname + ":8080");
const reqlist = [];

function renderFriendRequestList(requestarea) {
  requestarea.innerHTML = "";

  reqlist.forEach((reqjson) => {
    const from = reqjson["from"];
    const req_id = reqjson["request_id"];

    const f = document.createElement("li");
    const acceptbtn = document.createElement("button");
    const refusebtn = document.createElement("button");

    f.textContent = from;
    acceptbtn.textContent = "Aceitar";
    acceptbtn.className = "accept-btn"

    refusebtn.textContent = "Rejeitar";
    refusebtn.className = "decline-btn"

    requestarea.appendChild(f)
    f.appendChild(acceptbtn);
    f.appendChild(refusebtn);

    acceptbtn.onclick = () =>
    {
        console.log("Accepted friend request: " + String(req_id));
        const d = {
            request_id: req_id,
            isAccepted: true
        };
        ws.send("afr" + JSON.stringify(d));
        // Removing after accept
        f.remove();
    }
  });
}

window.onload = () => {
  const requestarea = document.getElementById("requestarea");
  ws.onopen = () => {
    ws.send(
      "chk" +
        JSON.stringify({
          SessionID: sessionStorage.getItem("Session_ID"),
          AccountRef: sessionStorage.getItem("ID_Ref"),
        })
    );
    ws.send("gfr" + localStorage.getItem("RA")); // Get friend requests
    console.log("Sent gfr")
  };

  ws.onmessage = (ev) => {
    const com = ev.data.substring(0, 3);

    if (com.length < 3) {
      console.log("Invalid command");
      return;
    }

    switch (com) {
      case "gfr": {
        console.log("Friend request received");
        const d = ev.data.substring(3, ev.data.length);
        try {
          const djson = JSON.parse(d);

          console.log(djson);

          reqlist.push(djson);
          renderFriendRequestList(requestarea);
        } catch (e) {
          console.log("Could not handle friend request data, ERR: " + e);
        }
        break;
      }

      case "sys":
        console.log("System message: " + ev.data.substring(3, ev.data.length));
        break;

      default:
        console.log("Uninplemented (or invalid) command: " + ev.data);
        break;
    }
  };
};
