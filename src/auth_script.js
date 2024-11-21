console.log(localStorage.getItem("RA"));

/*
 First, check for existing session info,
 if it doesn't exist, attempt to login automatically
 if it fails, do manual login

 Session info for JSON:
 {
    "Session_ID",
    "ID_Ref"
 }

 Login info JSON:
 {
    "RA",
    "password"
 }
*/

window.onload = () => {
  console.log("Window has loaded");

  // Manual login part

  function manualLogin() {
    console.log("manualLogin called");

    const data = {
      RA: document.getElementById("RA").value,
      password: document.getElementById("password").value,
    };

    const WS = new WebSocket("ws://" + window.location.hostname + ":8080");

    WS.onopen = () => {
      WS.send("lgn" + JSON.stringify(data));
    };

    WS.onmessage = (event) => {
      const header = event.data.substring(0, 3);
      console.log("Data received: " + event.data);

      switch (header) {
        case "chk":
          const chkinfo = {
            SessionID: sessionStorage.getItem("Session_ID"),
            AccountRef: sessionStorage.getItem("ID_Ref"),
          };

          console.log("Authentication requested");
          // Debugging, there seems to be an error within the JSON
          console.log(chkinfo);

          WS.send("chk" + JSON.stringify(chkinfo));
          break;

        case "ath":
          console.log("Authentication successful");
          let auth_info = JSON.parse(
            event.data.substring(3, event.data.length)
          );

          console.log(auth_info);

          sessionStorage.setItem("ID_Ref", auth_info["ID_Ref"]);
          sessionStorage.setItem("Session_ID", auth_info["Session_ID"]);
          localStorage.setItem("RA", document.getElementById("RA").value);

          document.location.href = "pagina_principal.html";

          break;
        case "cls":
          WS.close("1000");
          break;
        default:
          console.log(
            "Data has been received, but no valid command was found: " +
              event.data
          );
      }
    };
  }

  // Login setup

  const submitbtn = document.getElementById("submit");

  submitbtn.onclick = manualLogin;

  // TODO Do automatic login if possible
};
