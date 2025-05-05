(function () {
    document.addEventListener("DOMContentLoaded", () => {
        getMenuList();
        setLogo('logo');
        const params = new URLSearchParams(window.location.search);
        const postPath = params.get("post");
        if (!postPath || !/^[a-z0-9_/-]+$/i.test(postPath)) {
            document.getElementById("markdown-content").innerHTML = "<p>유효한 글 경로가 아닙니다.</p>";
            return;
        }

        menuEvtHandler();

        const [category, id] = postPath.split("/");
        const contentEl = document.getElementById("markdown-content");
        const titleEl = document.querySelector(".post-title");
        const metaEl = document.querySelector(".post-meta");
        const summaryEl = document.querySelector(".post-summary");

        fetch(`../contents/${category}/posts.json`)
            .then(res => {
                if (!res.ok) throw new Error("posts.json 로드 실패");
                return res.json();
            })
            .then(data => {
                const post = data.posts.find(p => p.id === id || p.slug === id);
                if (!post) throw new Error("해당 글 없음");

                titleEl.textContent = post.title;
                metaEl.innerHTML = `${post.date} · <span class="post-category">${post.category}</span>`;
                summaryEl.textContent = post.summary ?? "";

                return fetch(`../contents/${category}/${id}.md`);
            })
            .then(res => {
                if (!res.ok) throw new Error("md 로드 실패");
                return res.text();
            })
            .then(md => {
                const before = marked.parse(md);
                const after = DOMPurify.sanitize(before);
                document.getElementById('markdown-content').innerHTML = after;
            })
            .catch(err => {
                console.error("콘텐츠 로딩 오류:", err);
                contentEl.innerHTML = "<p>콘텐츠를 불러오지 못했습니다.</p>";
            });
    });
})();