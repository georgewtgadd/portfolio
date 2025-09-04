// Add this to enable image expand modal
document.addEventListener('DOMContentLoaded', function() {
  var modal = document.getElementById('imgModal');
  var modalImg = document.getElementById('modalImg');
  var closeBtn = modal.querySelector('.close');
  document.querySelectorAll('.expandable-img').forEach(function(img) {
    img.addEventListener('click', function() {
      modal.style.display = "flex";
      modalImg.src = this.src;
      modalImg.alt = this.alt;
    });
  });
  closeBtn.onclick = function() {
    modal.style.display = "none";
    modalImg.src = "";
  };
  modal.onclick = function(e) {
    if (e.target === modal) {
      modal.style.display = "none";
      modalImg.src = "";
    }
  };
});
