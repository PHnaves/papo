// General logic employed at the communities pages
function sendCommunitiesRequest(ws) { }

function renderCommunityPage(selectedCommunity) {
  const communityName = document.getElementById("communityname");

  communityName.textContent = selectedCommunity.Community_name;
}

function renderCommunityList(communitySection, commlist) {
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

  ws.onopen = (ev) => {
    console.log("Websocket connection has opened.");
    // get community list
    ws.send("gcl");
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
      case "crd":
        try {
          const comdata = JSON.parse(ev.data.substring(3, ev.data.length));
          commlist.push(comdata);

          // Update list
          renderCommunityList(communitySection, commlist);

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
