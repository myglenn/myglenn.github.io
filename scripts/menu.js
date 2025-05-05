function getMenuList() {
    fetch('../data/category.json')
        .then(res => res.json())
        .then(categories => {
            const container = document.getElementById('menu-panel-list');
            categories.forEach(cat => {
                const li = document.createElement('li');
                const link = document.createElement('a');
                link.href = `/list.html?category=${cat.id}`;
                link.textContent = '📁 ' + cat.name;
                li.appendChild(link);
                container.appendChild(li);
            });
        });
}

function menuEvtHandler() {
    const menuToggle = document.getElementById("menu-toggle");
    const menuPanel = document.querySelector(".menu-panel");

    menuToggle.addEventListener("click", () => {
        const isOpen = menuPanel.getAttribute("aria-hidden") === "false";

        if (isOpen) {
            menuPanel.setAttribute("aria-hidden", "true");
            setTimeout(() => menuPanel.setAttribute("hidden", ""), 300);
        } else {
            menuPanel.removeAttribute("hidden");
            menuPanel.setAttribute("aria-hidden", "false");
        }
    });
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            menuPanel.setAttribute("aria-hidden", "true");
            setTimeout(() => menuPanel.setAttribute("hidden", ""), 300);
        }
        if (e.key === "Enter") {
            e.preventDefault();
        }
    });

}