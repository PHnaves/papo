// Security measure to block all users from entering pages without login
if (sessionStorage.getItem("Session_ID") == null) {
  document.location.href = "login.html";
}
