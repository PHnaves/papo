
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
function getCommunities(ws) {

}

function renderCommunityPage(selectedCommunity) {
    const communityName = document.getElementById("communityname");

    communityName.textContent = selectedCommunity.Community_name;
}

function renderCommunityList(commlist) {
    // Inside of community list there is going to be JSON
    commlist.forEach(community => {

    })
}

function updateCommunityList(communitylist) {
    // Update list

    // Implement server side check, and add to array
    const updatedCommunityList = "yet to implement";
    // Then
    renderCommunityList(updatedCommunityList);
}



window.onload = () => {
    /* Model
    const testCommunity = {
        ID_Community: 0,
        Community_name: "test",
        Creation_date: "2024-1-1",
        Theme: "among us",
        isPreCreated: true,
    }*/
    const ws = new WebSocket("ws://" + window.location.hostname + ":8080")
    const commlist = [];

    ws.onopen = (ev) => {
        console.log("Websocket connection has opened.")
    }

    ws.onmessage = (ev) => {
        if (ev.data.length < 3) {
            // Fail safe
            console.log("Received a invalid command: " + ev.data)
            return;
        }

        const command = ev.data.substring(0, 3)
        switch (command) {
            // Community received data
            case "crd":
                console.log("crd yay");
                break;
            case "sys":
                console.log("System message: " + ev.data.substring(4, ev.data.length));
                break;
            default:
                console.log(command + " is invalid... but here is the message: " + ev.data)
                break;
        }
    }




}