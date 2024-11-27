window.onload = () => {
  const RA = document.getElementById("RA");
  const desc = document.getElementById("description");
  // Page startup
  RA.textContent = localStorage.getItem("RA");
  desc.textContent = "Deseja alterar sua descrição?";
};
