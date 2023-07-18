const signup_btn = document.getElementById('btn-signup');
const signin_btn = document.getElementById('btn-signin');
const main = document.getElementById('main');

signup_btn.addEventListener('click', () => {
    main.classList.add('right-panel-active');
});

signin_btn.addEventListener('click', () => {
    main.classList.remove('right-panel-active');
});