const videosNav = document.getElementById('videosNav');
const playlistsNav = document.getElementById('playlistsNav');
const videosTab = document.getElementById('videosTab');
const playlistsTab = document.getElementById('playlistsTab');

const btnSubscribe = document.getElementById('btnSubscribe');
const displaySubscribe = document.getElementById('displaySubscribe');

// Change subscribe state
if (btnSubscribe) {
    btnSubscribe.addEventListener('click', function() {
        var state;
        if (btnSubscribe.dataset.state == 'true'){
            state = 0;
        }
        if (btnSubscribe.dataset.state == 'false'){
            state = 1;
        }
        $.ajax({
            url: '/account/subscribe',
            type: 'PUT',
            data: {
                subscribeUserId: subscribeUserId,
                state: state
            },
            success: function(data) {
                if (!displaySubscribe.textContent.includes(' ')) {
                    if (state == 1) {
                        displaySubscribe.textContent = parseInt(displaySubscribe.textContent) + 1;
                    }
                    if (state == 0) {
                        displaySubscribe.textContent = parseInt(displaySubscribe.textContent) - 1;
                    }
                }
                if (state == 1) {
                    btnSubscribe.dataset.state = 'true';
                    btnSubscribe.textContent = 'Đã đăng ký';
                }
                if (state == 0) {
                    btnSubscribe.dataset.state = 'false';
                    btnSubscribe.textContent = 'Đăng ký';
                }
                btnSubscribe.classList.toggle('bg-light-gray');
                btnSubscribe.classList.toggle('text-dark');
                btnSubscribe.classList.toggle('bg-dark');
                btnSubscribe.classList.toggle('text-light');
            }
        });
    });
}

if (videosNav) {
    videosNav.addEventListener('click', (e) => {
        e.preventDefault();
        videosNav.classList.add('active');
        playlistsNav.classList.remove('active');
        videosTab.hidden = "";
        playlistsTab.hidden = "hidden";
    });
}

if (playlistsNav) {
    playlistsNav.addEventListener('click', (e) => {
        e.preventDefault();
        videosNav.classList.remove('active');
        playlistsNav.classList.add('active');
        videosTab.hidden = "hidden";
        playlistsTab.hidden = "";
    });
}