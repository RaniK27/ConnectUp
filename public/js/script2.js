const side_menu = document.querySelector("aside");
const menu_btn = document.querySelector("#menu-btn");
const close_btn = document.querySelector("#close-btn");

menu_btn.addEventListener('click', () => {
    side_menu.style.display = 'block';
});

close_btn.addEventListener('click', () => {
    side_menu.style.display = 'none';
});

