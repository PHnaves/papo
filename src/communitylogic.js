// General logic employed at the communities pages

// Assign default value
var SELECTED_COMMUNITY = 1;

// FIXME Fix problems with "unrelated messages"

// Same rendermsg function from messages.js
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
    } else {
      divbubble.className = "message received";
    }

    msgcamp.appendChild(divbubble);
    divbubble.appendChild(bubbletext);
    divbubble.appendChild(messagetime);
    bubbletext.textContent = data["messagecontent"];
    messagetime.textContent = gettimeformsg();

    // Scrolling automatically to last message, for convenience
    msgcamp.scrollTop = msgcamp.scrollHeight;
  } catch (e) {
    console.log(`Error while rendering msg ${e}`);
    console.log(`For reference, data: ${data}`);
  }
}

function sendCommunitiesRequest(ws) { }

function renderCommunityPage(selectedCommunity) {
  const communityName = document.getElementById("communityname");

  communityName.textContent = selectedCommunity.Community_name;
}

function renderCommunityList(communitySection, commlist, ws) {
  // Inside of community list there is going to be JSON

  /*
  Structure:
   <div class="contact-item">
                    <img src="avatar.png" alt="User Avatar">
                    <h5>Contact Name</h5>
                    <p>Last message preview...</p>
    </div>

    according to the HTML
  */

  // Also implements functionality
  commlist.forEach((community) => {
    const maindiv = document.createElement("div");
    const commname = document.createElement("h5");
    const likes = document.createElement("p");

    maindiv.className = "contact-item"
    commname.textContent = community["community_name"]
    likes.textContent = community["likes"]

    communitySection.appendChild(maindiv);
    maindiv.appendChild(commname);
    maindiv.appendChild(likes);

    // TODO Implement community functionality, such as onclick below

    // User clicked on main div of this community
    maindiv.onclick = () => {
      console.log("Community: " + community["community_name"]);

      if (SELECTED_COMMUNITY != Number(community["community_id"])) {
        SELECTED_COMMUNITY = Number(community["community_id"]);

        document.getElementById("communityname").textContent = community["community_name"];
        // Clear messages to switch context
        document.getElementById("messages").innerHTML = "";
        ws.send("gdm" + String(SELECTED_COMMUNITY));
      }

      // TODO Render other stuff

    }
  });
}

window.onload = () => {
  const ws = new WebSocket("ws://" + window.location.hostname + ":8080");
  // Stores community JSON
  /*
    Updated community model:
    community_id,
    community_name,
    likes,
    isPreCreated -> could also be used to check for "official" communities.
  */
  const commlist = [];
  const communitySection = document.getElementById("community-section");
  // Clean before any of these load
  communitySection.innerHTML = "";

  ws.onopen = (ev) => {
    console.log("Websocket connection has opened.");
    // get community list
    ws.send("gcl");
    ws.send("gdm" + String(SELECTED_COMMUNITY))
  };

  ws.onmessage = (ev) => {
    if (ev.data.length < 3) {
      // Fail safe
      console.log("Received a invalid command: " + ev.data);
      return;
    }

    const command = ev.data.substring(0, 3);
    switch (command) {
      // Community received data
      case "msg":
        const datajson = ev.data.substring(3, ev.data.length);

        if (Number(datajson["to"]) === SELECTED_COMMUNITY) {
          rendermsg(ev.data);
        }
        else {
          console.log("Received message unrelated to the community: " + ev.data);
        }
        // Check if message is related to the community

        break;
      case "crd":
        try {
          const comdata = JSON.parse(ev.data.substring(3, ev.data.length));
          commlist.push(comdata);

          // Update list
          renderCommunityList(communitySection, commlist, ws);

        } catch (e) {
          console.log("Attempted to parse: " + ev.data.substring(3, ev.data.length))
          console.log("Error while trying to parse community data JSON: " + e);
          return;
        }

        renderCommunityList(communitySection, commlist);
        break;
      case "sys":
        console.log("System message: " + ev.data.substring(4, ev.data.length));
        break;
      default:
        console.log(
          command + " is not defined... \n here is the full message: " + ev.data
        );
        break;
    }
  };
};
