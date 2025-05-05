async function setLogo(targetId) {
    try {
      const target = document.getElementById(targetId);
      const response = await fetch("../images/logo.html");
      const html = await response.text();
      target.innerHTML = html;
    } catch (err) {
      console.error("로고 삽입 실패 😢", err);
    }
  }