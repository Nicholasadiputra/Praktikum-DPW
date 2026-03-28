// Navbar blur saat scroll
window.addEventListener("scroll", () => {
  const nav = document.querySelector(".navbar");
  if (window.scrollY > 50) {
    nav.style.background = "rgba(255,255,255,0.4)";
  } else {
    nav.style.background = "rgba(255,255,255,0.2)";
  }
});