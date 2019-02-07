$(window).load(function() {
  // Animate loader off screen
  $(".se-pre-con").fadeOut("slow");
});

function openNav() {
  document.getElementById("side-menu-desktop").style.left = "0";
}

function closeNav() {
  document.getElementById("side-menu-desktop").style.left = "-250px";
}