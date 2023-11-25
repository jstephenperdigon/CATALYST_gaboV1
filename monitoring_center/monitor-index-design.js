$(document).ready(function () {
    // Handle click events on navigation links
    $('.nav-link').click(function (e) {
      e.preventDefault();
      var targetId = $(this).data('target');

      // Hide all content divs
      $('#reports, #summary').removeClass('active-content').addClass('hidden');

      // Show the selected content
      $('#' + targetId).removeClass('hidden').addClass('active-content');
    });
  });