$(document).ready(function() {

  // Smooth Scroll for anchor links
  $('a[href^="#"]').on('click', function(e) {
    e.preventDefault();
    const target = this.hash;
    if ($(target).length) {
      $('html, body').animate({
        scrollTop: $(target).offset().top
      }, 800);
    }
  });

  // Scroll to Top Button
  let btn = document.getElementById("scrollTopBtn");

  window.addEventListener("scroll", function() {
    if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
      btn.style.display = "flex";
    } else {
      btn.style.display = "none";
    }
  });

  btn.addEventListener("click", function() {
    $('html, body').animate({scrollTop: 0}, 600);
  });

  // Fade-in animation on scroll
  $(window).on("scroll", function() {
    $(".fade-in").each(function() {
      let elemTop = $(this).offset().top;
      let winTop = $(window).scrollTop();
      let winHeight = $(window).height();

      if (elemTop < winTop + winHeight - 50) {
        $(this).addClass("visible");
      }
    });
  });

  // Trigger once on load
  $(window).trigger("scroll");

  // Dynamic Year in Footer
  document.querySelector("#footer .copyright li")
    .innerHTML = "&copy; " + new Date().getFullYear() + " George Gadd. All rights reserved.";
});
