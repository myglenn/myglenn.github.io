(function () {
    document.addEventListener("DOMContentLoaded", () => {
        getMenuList();
        setLogo('logo');
        const toggleBtn = document.getElementById("search-toggle");
        const searchOverlay = document.querySelector(".search-overlay");
        const closeBtn = document.querySelector(".search-popup-close");

        toggleBtn?.addEventListener("click", () => {
            searchOverlay.removeAttribute("hidden");
            searchOverlay.querySelector("input").focus();
        });

        closeBtn?.addEventListener("click", () => {
            searchOverlay.setAttribute("hidden", "");
        });

        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") {
                searchOverlay.setAttribute("hidden", "");
            }
        });

        menuEvtHandler();

        const params = new URLSearchParams(window.location.search);
        const category = params.get("category");
        const postList = document.querySelector(".post-list");
        const paginationEl = document.querySelector(".pagination");

        const pageSize = 4;
        let currentPage = 1;
        let allPosts = [];

        function renderPosts(posts) {
            const container = document.getElementById('post-list');
            container.innerHTML = "";

            if (posts.length === 0) {
                container.innerHTML = "<p>검색 결과가 없습니다.</p>";
                return;
            }

            posts.forEach(post => {
                const article = document.createElement('article');
                article.className = 'post-item';
                article.innerHTML = `<h2><a href="${post.href}">${post.title}</a></h2><p class="summary">${post.summary}</p>`;
                container.appendChild(article);
            });
        }

        function renderPage(page) {
            postList.innerHTML = "";
            const start = (page - 1) * pageSize;
            const end = start + pageSize;
            const posts = allPosts.slice(start, end);

            posts.forEach(post => {
                const item = document.createElement("article");
                item.className = "post-item";
                item.innerHTML = `<a href="viewer.html?post=${category}/${post.id}"><h3>${post.title}</h3><p class="summary">${post.summary}</p></a>`;
                postList.appendChild(item);
            });

            const totalPages = Math.ceil(allPosts.length / pageSize);
            paginationEl.innerHTML = `<button ${page === 1 ? "disabled" : ""} class="prev-page">이전</button><span class="page-info">${page} / ${totalPages}</span><button ${page === totalPages ? "disabled" : ""} class="next-page">다음</button>`;

            paginationEl.querySelector(".prev-page").onclick = () => renderPage(page - 1);
            paginationEl.querySelector(".next-page").onclick = () => renderPage(page + 1);
        }

        if (!category) {
            return;
        }

        function handleSearch(value) {
            const keyword = value.toLowerCase();
            const filtered = allPosts.filter(post =>
                post.title.toLowerCase().includes(keyword) ||
                post.summary.toLowerCase().includes(keyword)
            );
            renderPosts(filtered);
        }

        fetch(`../contents/${category}/posts.json`)
            .then(res => res.json())
            .then(json => {
                const { info, posts } = json;

                if (info) {
                    const header = document.querySelector(".category-header");
                    header.querySelector("h2").textContent = `📁 ${info.label}`;
                    header.querySelector("p").textContent = info.description;
                }

                allPosts = posts;
                renderPage(currentPage);
            })
            .catch(() => {
                document.querySelector(".category-header p").textContent = "데이터를 불러오지 못했습니다.";
            });

        document.getElementById('search-input')?.addEventListener('input', (e) => {
            handleSearch(e.target.value);
        });

        document.getElementById('search-popup-input')?.addEventListener('input', (e) => {
            handleSearch(e.target.value);
        });
    });
})();