/*
The community JSON:
ID_Community
Community_name
Description
Creation_date
Theme
isPreCreated
*/

// TODO Implement get communities
function sendCommunitiesRequest(ws) {}

function renderCommunityPage(selectedCommunity) {
  const communityName = document.getElementById("communityname");

  communityName.textContent = selectedCommunity.Community_name;
}

function renderCommunityList(commlist) {
  // Inside of community list there is going to be JSON
  commlist.forEach((community) => {});
}

function updateCommunityList(communitylist) {
  // Implement server side check, and add to array
  console.log("updateCommunityList was called");
  const updatedCommunityList = "yet to implement";
  // Then
  renderCommunityList(updatedCommunityList);
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
          const comdata = JSON.parse(ev.data.substring(4, ev.data.length));
          commlist.push(comdata);
        } catch (e) {
          console.log("Error while trying to parse community data JSON: " + e);
        }

        updateCommunityList(commlist);
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
