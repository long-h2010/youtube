const description = document.getElementById('description');
const btnSubscribe = document.getElementById('btnSubscribe');
const displaySubscribe = document.getElementById('displaySubscribe');
const btnLike = document.getElementById('btnLike');
const displayComment = document.getElementById('displayComment');
const comment = document.getElementById('comment');
const btnComment = document.getElementById('btnComment');
const btnMoreComment = document.getElementById('btnMoreComment');
const modalBackground = document.getElementById('modalBackground');
const btnShowAddPlaylistForm = document.getElementById('btnShowAddPlaylistForm');
const addPlaylistForm = document.getElementById('addPlaylistForm');
const addPlaylistName = document.getElementById('addPlaylistName');
const inputError = document.getElementById('inputError');
const inputCounter = document.getElementById('inputCounter');
const addPlaylistPrivacy= document.getElementById('addPlaylistPrivacy');
const btnAddPlaylist= document.getElementById('btnAddPlaylist');
const toast = document.getElementById('toast');

const numberOfCommentPerLoad = 10;
var page = 2;

// Hide Display more comment button if all comments are display
if (((page - 1) * numberOfCommentPerLoad) >= parseInt(displayComment.textContent.replace(',', ''))) {
    btnMoreComment.style.display = 'none';
}

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

// Change like state
if (btnLike) {
    btnLike.addEventListener('click', function() {
        var state;
        if (btnLike.dataset.state == 'true'){
            state = 0;
        }
        if (btnLike.dataset.state == 'false'){
            state = 1;
        }
        $.ajax({
            url: '/account/like',
            method: 'PUT',
            data: {
                videoId: videoId,
                state: state
            },
            success: function(data) {
                let displayLike = btnLike.children[1].textContent;
                if (!displayLike.includes(' ')) {
                    if (state == 1) {
                        btnLike.children[1].textContent = parseInt(displayLike) + 1;
                    }
                    if (state == 0) {
                        btnLike.children[1].textContent = parseInt(displayLike) - 1;
                    }
                }
                if (state == 1) {
                    btnLike.dataset.state = 'true';
                }
                if (state == 0) {
                    btnLike.dataset.state = 'false';
                }
                btnLike.children[0].classList.toggle('fa-solid');
            }
        });
    });
}

// Show add to playlist modal
function showAddToPlaylistModal() {
    modalBackground.style.display = 'block';
}

// Hide add to playlist modal when click close icon
function hideAddToPlaylistModal() {
    modalBackground.style.display = 'none';
    btnShowAddPlaylistForm.style.display = 'block';
    addPlaylistForm.classList.add('d-none');
}

// Hide add to playlist modal when click outside of modal
window.onclick = function(event) {
    if (event.target == modalBackground) {
        hideAddToPlaylistModal();
    }
}

// Show form to add new playlist
function showAddPlaylistForm() {
    btnShowAddPlaylistForm.style.display = 'none';
    addPlaylistForm.classList.remove('d-none');
}

// Update count show error if input is empty
addPlaylistName.addEventListener('input', function() {
    if (addPlaylistName.value.trim() == '') {
        addPlaylistForm.children[0].classList.add('text-danger');
        inputError.classList.remove('d-none');
        addPlaylistName.style.borderBottomColor = 'red';
        btnAddPlaylist.disabled = true;
    } else {
        addPlaylistForm.children[0].classList.remove('text-danger');
        inputError.classList.add('d-none');
        addPlaylistName.removeAttribute('style');
        btnAddPlaylist.disabled = false;
    }
    inputCounter.textContent = addPlaylistName.value.length;
});

// Add video to exist playlists
function addVideoToPlaylist(e, playlistId, playlistName) {
    let type;
    if (e.target.checked) {
        type = 'POST';
        toast.textContent = 'Đã thêm vào ' + playlistName;
    } else {
        type = 'DELETE';
        toast.textContent = 'Đã xóa khỏi ' + playlistName;
    }
    $.ajax({
        url: '/account/playlist/content',
        type: type,
        data: {
            playlistId: playlistId,
            videoId: videoId
        },
        success: function(data) {
            // Show message
            toast.className = 'show';
            setTimeout(function() {
                toast.className = toast.className.replace('show', '');
            }, 3000);
        }
    });
}

// Create new playlist and add video to it
btnAddPlaylist.addEventListener('click', function() {
    $.ajax({
        url: '/account/playlist',
        type: 'POST',
        data: {
            name: $('#addPlaylistName').val().trim(),
            privacy: $('#addPlaylistPrivacy').val(),
            videoId: videoId
        },
        success: function(data) {
            // Hide modal
            hideAddToPlaylistModal();
            toast.textContent = 'Đã thêm vào ' + $('#addPlaylistName').val().trim();
            // Reset input value
            $('#addPlaylistName').val('');
            inputCounter.textContent = addPlaylistName.value.length;
            $('#addPlaylistPrivacy').val('0');
            // Show message
            toast.className = 'show';
            setTimeout(function() {
                toast.className = toast.className.replace('show', '');
            }, 3000);
        }
    });
});

// Show/hide description on click
description.addEventListener('click', function() {
    description.classList.toggle('description-show');
});

// Detect comment input change
if (comment != null) {
    comment.addEventListener('input', function() {
        // Disable, enable comment button when value is empty or not
        if (comment.value.trim() != '' && btnComment.disabled) {
            btnComment.classList.toggle('bg-primary');
            btnComment.disabled = false;
        } else if (comment.value.trim() == '' && !btnComment.disabled) {
            btnComment.classList.toggle('bg-primary');
            btnComment.disabled = true;
        }
        // Increase comment input height accordingly
        setTimeout(function() {
            comment.style.cssText = 'height: 20px;';
            comment.style.cssText = 'height:' + comment.scrollHeight + 'px';
        }, 0);
    });
}

// Post comment
btnComment.addEventListener('click', function() {
    let content = comment.value;
    $.ajax({
        url: '/account/comment',
        method: 'POST',
        data: {
            videoId: videoId,
            content: content
        },
        success: function(data) {
            // Update comment count
            let commentCount = parseInt(displayComment.textContent.replace(',', '')) + 1;
            displayComment.textContent = commentCount.toLocaleString('en-US');
            // Clear comment input and disable button
            comment.value = '';
            btnComment.classList.toggle('bg-primary');
            btnComment.disabled = true;
            // Clear comment list and reload comment from page 1
            $('#commentList').html('');
            getComments(videoId, 1);
            page = 2;
            // Hide or show display more comment button wether all comments are display or not
            if (((page - 1) * numberOfCommentPerLoad) >= parseInt(displayComment.textContent.replace(',', ''))) {
                btnMoreComment.style.display = 'none';
            } else {
                btnMoreComment.style.display = 'block';
            }
        }
    });
});

// Show more comment on click
btnMoreComment.addEventListener('click', function() {
    getComments(videoId, page);
    page += 1;
    // Hide Display more comment button if all comments are display
    if (((page - 1) * numberOfCommentPerLoad) >= parseInt(displayComment.textContent.replace(',', ''))) {
        btnMoreComment.style.display = 'none';
    }
});

// Get comment from partial view.
function getComments(videoId, page) {
    $.ajax({
        url: '/watch/comment',
        method: 'GET',
        data: {
            videoId: videoId,
            page: page,
            limit: numberOfCommentPerLoad
        },
        success: function(data) {
            $('#commentList').append(data);
        }
    });
};