var menu = document.querySelector(".menu");
var menuToggle = document.querySelector(".menu__toggle");

menu.classList.add("menu--js");

menuToggle.addEventListener("click", function() {
  menu.classList.toggle("menu--js");
});
