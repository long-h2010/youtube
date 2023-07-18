$(document).on('click', '#sidebarToggle', function(e) {
    e.preventDefault();
    $('body').toggleClass('sidebar-toggled');
    $('.sidebar').toggleClass('toggled');

    if ($('.video').hasClass('col-xl-4')) {
        $('.video').removeClass('col-xl-4');
        $('.video').toggleClass('col-xl-3');
        $('span').css('display', 'none');
    } else {
        $('.video').removeClass('col-xl-3');
        $('.video').toggleClass('col-xl-4');
        $('span').css('display', '');
    }
});