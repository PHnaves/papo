
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
function getCommunities() {
    
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
    const updatedCommunityList = "yet to implement";
    // Then
    renderCommunityList(updatedCommunityList);
}



window.onload = () => {

    const testCommunity = {
        ID_Community: 0,
        Community_name: "test",
        Creation_date: "2024-1-1",
        Theme: "among us",
        isPreCreated: true,
    }

    const commlist = [testCommunity];

    // Test for now

    renderCommunityPage(testCommunity);
}