document.addEventListener("DOMContentLoaded", () => {
  // Footer year
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile menu (funciona no index e no press)
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".nav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });

    document.querySelectorAll(".nav-link").forEach((a) => {
      a.addEventListener("click", () => {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Smooth scroll (ajuda inclusive o "Voltar ao topo")
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const href = a.getAttribute("href");
      if (!href || href === "#") return;
      const el = document.querySelector(href);
      if (!el) return;
      e.preventDefault();
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      history.pushState(null, "", href);
    });
  });

  // Active link highlight (FIX: só trabalha com links internos #...)
  const links = Array.from(document.querySelectorAll(".nav-link"));
  const hashLinks = links.filter((l) => (l.getAttribute("href") || "").startsWith("#"));
  const sections = hashLinks
    .map((l) => document.querySelector(l.getAttribute("href")))
    .filter(Boolean);

  if (sections.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = `#${entry.target.id}`;
          hashLinks.forEach((l) => l.classList.toggle("is-active", l.getAttribute("href") === id));
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0.01 }
    );

    sections.forEach((s) => io.observe(s));
  } else {
    // Página sem âncoras internas (ex: press.html com links externos)
    // Nada a fazer aqui.
  }

  // ===== MEMBERS =====
  // Mantenha seus arquivos em ./assets/members/
  const members = [
    //{ name: "Alicia Morbach", place: "São Paulo (BRA)", inst: "voz, ganzá, caxixi e pandeiro", img: "./assets/members/alicia.png" },
    //{ name: "Cassiano", place: "Alagoas (BRA)", inst: "Agogô e triângulo", img: "./assets/members/cassiano.png" },
    { name: "Edvandro (Edinho)", place: "Rio de Janeiro (BRA)", inst: "Bombo, ilú, matraca e voz", img: "./assets/members/edinho.png" },
    { name: "Efrat", place: "Jerusalem (JM)", inst: "Pandeiro e voz", img: "./assets/members/efi.png" },
    { name: "Fly", place: "Minas Gerais (BRA)", inst: "Matraca e voz", img: "./assets/members/fly.png" },
    { name: "Juliano Mattos", place: "Sergipe (BRA)", inst: "Caixa, congas, ganzá e maracá", img: "./assets/members/juliano.png" },
    { name: "Karla Oliveira", place: "Pernambuco (BRA)", inst: "Ganzá, caxixi, voz e agbê", img: "./assets/members/karla.png" },
    { name: "Lisa Sousa", place: "Pernambuco (BRA)", inst: "Ganzá, triângulo, caxixi e voz", img: "./assets/members/lisa.png" },
    { name: "Nuno Guedes", place: "Porto (PRT)", inst: "Caixa e congas", img: "./assets/members/nuno.png" },
    { name: "Sofia Costa", place: "Porto (PRT)", inst: "Pandeiro, caxixi e voz", img: "./assets/members/sofia.png" },
    { name: "Victória Andrade", place: "Sergipe (BRA)", inst: "Pandeiro, agbê e voz", img: "./assets/members/victoria.png" },
    { name: "Vanize", place: "Rio de Janeiro (BRA)", inst: "Matraca e voz", img: "./assets/members/nize.png" }
  ];

  const membersGrid = document.getElementById("membersGrid");
  if (membersGrid) {
    membersGrid.innerHTML = members
      .map(
        (m) => `
      <article class="member">
        <div class="member__avatar">
          <img src="${m.img}" alt="${m.name}" loading="lazy"
               onerror="this.onerror=null;this.src='./assets/members/placeholder.jpg';">
        </div>
        <p class="member__name">${m.name}</p>
        <p class="member__meta">${m.place}</p>
        <p class="member__inst">${m.inst}</p>
      </article>
    `
      )
      .join("");
  }

  // ===== LIGHTBOX (para "Mais registros" quando não houver link) =====
  function ensureLightbox() {
    let lb = document.getElementById("lightbox");
    if (lb) return lb;

    lb = document.createElement("div");
    lb.id = "lightbox";
    lb.className = "lightbox";
    lb.innerHTML = `
      <div class="lightbox__backdrop" data-close="1"></div>
      <div class="lightbox__panel" role="dialog" aria-modal="true" aria-label="Imagem em destaque">
        <button class="lightbox__close" type="button" aria-label="Fechar" data-close="1">×</button>
        <div class="lightbox__content">
          <img class="lightbox__img" alt="" />
          <p class="lightbox__caption muted"></p>
        </div>
      </div>
    `;
    document.body.appendChild(lb);

    lb.addEventListener("click", (e) => {
      const t = e.target;
      if (t && t.getAttribute && t.getAttribute("data-close") === "1") closeLightbox();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeLightbox();
    });

    return lb;
  }

  function openLightbox({ src, title }) {
    const lb = ensureLightbox();
    const img = lb.querySelector(".lightbox__img");
    const cap = lb.querySelector(".lightbox__caption");
    img.src = src;
    img.alt = title || "Imagem";
    cap.textContent = title || "";
    lb.classList.add("is-open");
    document.documentElement.style.overflow = "hidden";
  }

  function closeLightbox() {
    const lb = document.getElementById("lightbox");
    if (!lb) return;
    lb.classList.remove("is-open");
    document.documentElement.style.overflow = "";
  }

  // ===== EVENTS (VERTICAIS 9:16) =====
  // Coloque as imagens em: ./assets/events/
  // Recomendado: 1080x1920 (reels/stories)
  const events = [
    { title: "Roda de Coco Pré-Carnaval", month: "Fevereiro", year: 2025, img: "./assets/events/roda-de-coco.pre-carnaval.png", link: "https://www.instagram.com/p/DF9wsHQMgbU/" },
    { title: "Kebraku Karnaval", month: "Março", year: 2025, img: "./assets/events/kebraku.png", link: "https://www.instagram.com/p/DGThkresQYz/?img_index=1" },
    { title: "Roda de Coco Primaveril", month: "Abril", year: 2025, img: "./assets/events/primaveril.png", link: "https://www.instagram.com/p/DHx-LC_sRD1/" },
    { title: "Festival de Primavera", month: "Maio", year: 2025, img: "./assets/events/festival-primavera.png", link: "https://www.instagram.com/p/DJcbJlHtZ0w/" },
    { title: "Forróbodó (São João)", month: "Junho", year: 2025, img: "./assets/events/forrobodo.png", link: "https://www.instagram.com/p/DK6-cuIoXQr/" },
    { title: "Oficina com Tiago Félix", month: "Maio", year: 2025, img: "./assets/events/tiago-felix.png", link: "https://www.instagram.com/p/DJzDoc7MJ0J/?img_index=1" },
    { title: "Festival Brasil Cósmico", month: "Julho", year: 2025, img: "./assets/events/festival-brasil-cosmico.png", link: "https://www.instagram.com/p/DK-OucWoPNb/" },
    { title: "Mestra Ana Lúcia", month: "Agosto", year: 2025, img: "./assets/events/mestra-ana-lucia.png", link: "https://www.instagram.com/p/DNF1jI2s9M8/" },
    { title: "Dia do Brasil no Porto", month: "Setembro", year: 2025, img: "./assets/events/dia-do-brasil-no-porto.png", link: "https://www.instagram.com/p/DN-4y4GjFDx/" },
    { title: "Carnaverão 2025", month: "Setembro", year: 2025, img: "./assets/events/carnaverao-2025.png", link: "https://www.instagram.com/p/DObhiMQCA7a/" },
    { title: "Aniversário de 1 ano", month: "Novembro", year: 2025, img: "./assets/events/aniversario-1-ano-coco-dos-quatro-cantos.png", link: "https://www.instagram.com/p/DRU3PhnjIOJ/" },
    { title: "Katimbó Duo + Oficina", month: "Novembro", year: 2025, img: "./assets/events/presto-do-coco-e-furmiga-dub.png", link: "https://www.instagram.com/p/DRnB62ZjCyN/" },
    { title: "Roda de Coco Pré-Carnaval 2a. Edição", month: "Fevereiro", year: 2026, img: "./assets/events/roda-de-coco-pre-carnaval-II.png", link: "https://www.instagram.com/p/DUTqPxtDI1p/" },
    { title: "Terça da Mandinga 2a. Edição", month: "Fevereiro", year: 2026, img: "./assets/events/terca-da-mandinga-II.png", link: "https://www.instagram.com/p/DU1HjuXDPWA/?img_index=1" },
    { title: "Aniversário de 5 anos do Habitação Hoje", month: "Abril", year: 2026, img: "./assets/events/5o-aniversaio-habitacao-hoje-2025.png", link: "https://www.instagram.com/p/DXiCdBJibRb/?img_index=1" },
    { title: "KEBRAKU e MACHAMBA", month: "Maio", year: 2026, img: "./assets/events/kebraku-e-machamba.png", link: "https://www.instagram.com/p/DYAYXEejImu/?img_index=1" },
    { title: "Baião de Dois - Festival de Música, arte e sabores do Nordeste", month: "Maio", year: 2026, img: "./assets/events/fesitval-baiao-de-dois-1a-edicao-2025.png", link: "https://www.instagram.com/p/DXkNL-oiNSR/" }
  ];

  const yearSelect = document.getElementById("yearFilter");
  const searchInput = document.getElementById("searchFilter");
  const eventsGrid = document.getElementById("eventsGrid");

  // ✅ MODIFICAÇÃO: só inicializa eventos se os elementos existirem
  if (!yearSelect || !searchInput || !eventsGrid) {
    console.warn("[WARN] Página sem grid de eventos (ok).");
  } else {
    const years = [...new Set(events.map((e) => e.year))].sort((a, b) => b - a);
    years.forEach((y) => {
      const opt = document.createElement("option");
      opt.value = String(y);
      opt.textContent = String(y);
      yearSelect.appendChild(opt);
    });

    function renderEvents() {
      const y = yearSelect.value;
      const q = (searchInput.value || "").toLowerCase().trim();

      const filtered = events.filter((e) => {
        const okYear = y === "all" ? true : String(e.year) === y;
        const hay = `${e.title} ${e.month} ${e.year}`.toLowerCase();
        const okSearch = q ? hay.includes(q) : true;
        return okYear && okSearch;
      });

      if (!filtered.length) {
        eventsGrid.innerHTML = `<p class="muted">Nenhum resultado com os filtros atuais.</p>`;
        return;
      }

      eventsGrid.innerHTML = filtered
        .map((e) => {
          const safeTitle = String(e.title || "");
          const safeImg = String(e.img || "");

          return `
          <article class="event">
            <div class="event__thumb">
              <img src="${safeImg}" alt="${safeTitle}" loading="lazy"
                   onerror="this.onerror=null;this.src='./assets/events/placeholder.jpg';">
            </div>
            <div class="event__body">
              <h3 class="event__title">${safeTitle}</h3>
              <p class="event__meta">${e.month}/${e.year}</p>
              <div class="event__actions">
                <a class="smallbtn smallbtn--ghost" href="${e.link}" target="_blank">Link</a>
              </div>
            </div>
          </article>
        `;
        })
        .join("");
    }

    // Delegação de clique pro lightbox
    eventsGrid.addEventListener("click", (ev) => {
      const btn = ev.target.closest?.(".js-open-lightbox");
      if (!btn) return;
      openLightbox({
        src: btn.getAttribute("data-img"),
        title: btn.getAttribute("data-title"),
      });
    });

    yearSelect.addEventListener("change", renderEvents);
    searchInput.addEventListener("input", renderEvents);
    renderEvents();
  }
});