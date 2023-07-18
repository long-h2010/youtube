const avatarImage = document.getElementById('avatar-img');
const imageInput = document.getElementById('image-input');

avatarImage.addEventListener('click', () => {
    imageInput.click();
});

imageInput.addEventListener('change', () => {
    const file = imageInput.files[0];
    avatarImage.src = URL.createObjectURL(file);
});