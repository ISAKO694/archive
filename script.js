const indexButton = document.getElementById("indexButton");
const indexMenu = document.getElementById("indexMenu");

indexButton.addEventListener("click", () => {
    indexMenu.classList.toggle("open");
});


const menuLinks = document.querySelectorAll(".index-menu a");

menuLinks.forEach(link => {
    link.addEventListener("click", () => {
        indexMenu.classList.remove("open");
    });
});
