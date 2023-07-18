$(document).ready(function () {

    $('#sidebarCollapse').on('click', function () {
        $('#sidebar').toggleClass('active');
        $('#sidebar').toggleClass('col-1');
        $('.sidebar-text').toggleClass('hidden');
    });

});