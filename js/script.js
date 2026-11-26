/* SER.AARTE — interações (JavaScript puro) */
(function () {
  "use strict";

  document.documentElement.classList.add("js");

  /* WhatsApp: DDI 55 + DDD 47 + número, só dígitos — (47) 9705-0270 */
  var WHATSAPP_NUMBER = "554797050270";

  document.querySelectorAll(".js-whatsapp").forEach(function (el) {
    var msg = el.getAttribute("data-msg") || "";
    if (WHATSAPP_NUMBER) {
      el.href = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(msg);
      el.target = "_blank";
      el.rel = "noopener";
    } else {
      el.href = "#contato";
    }
  });

  /* ---------------------------------------------------------
     ENTREVISTA
     # COLOCAR AQUI: o link da entrevista do Sérgio.
     Aceita YouTube, Vimeo (o vídeo toca dentro do site),
     Instagram, Facebook ou matéria de jornal/site (abre em nova aba).
     Enquanto "link" estiver vazio, a seção fica oculta.
     --------------------------------------------------------- */
  var ENTREVISTA = {
    link: "https://youtu.be/JKYf9O78rO0",
    veiculo: "Jornal Correio do Norte",
    titulo: "Exposição de Arte no MAC — Esculturas em Madeira",
    frase: ""      // # COLOCAR AQUI (opcional): uma frase do Sérgio na entrevista
  };

  /* ---------- Menu fixo + hambúrguer ---------- */
  var nav = document.getElementById("nav");
  var toggle = document.getElementById("navToggle");
  var waFloat = document.querySelector(".wa-float");

  function onScroll() {
    var y = window.scrollY;
    nav.classList.toggle("is-scrolled", y > 40);
    if (waFloat) waFloat.classList.toggle("is-visible", y > window.innerHeight * 0.6);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  function setMenu(open) {
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    document.body.style.overflow = open ? "hidden" : "";
  }
  toggle.addEventListener("click", function () { setMenu(!nav.classList.contains("is-open")); });
  document.querySelectorAll(".nav__menu a").forEach(function (a) {
    a.addEventListener("click", function () { setMenu(false); });
  });
  window.addEventListener("resize", function () { if (window.innerWidth > 860) setMenu(false); });

  /* ---------- Entrevista ---------- */
  function setupInterview(cfg) {
    var sec = document.getElementById("entrevista");
    if (!sec || !cfg || !cfg.link) return;
    var url;
    try { url = new URL(cfg.link); } catch (e) { return; }
    var host = url.hostname.replace(/^www\.|^m\./, "");
    var q = function (sel) { return sec.querySelector(sel); };

    var yt = null, vimeo = null;
    if (/youtube\.com$/.test(host)) {
      yt = url.searchParams.get("v") || (url.pathname.match(/\/(?:shorts|live|embed)\/([\w-]{6,})/) || [])[1];
    } else if (host === "youtu.be") {
      yt = url.pathname.slice(1).split("/")[0];
    } else if (/vimeo\.com$/.test(host)) {
      vimeo = (url.pathname.match(/(\d{6,})/) || [])[1];
    }
    var isVideo = !!(yt || vimeo) || /instagram\.com$|facebook\.com$|fb\.watch$|tiktok\.com$/.test(host);
    var names = { "youtube.com": "YouTube", "youtu.be": "YouTube", "vimeo.com": "Vimeo", "instagram.com": "Instagram", "facebook.com": "Facebook", "fb.watch": "Facebook", "tiktok.com": "TikTok" };

    q(".js-interview-source").textContent = cfg.veiculo || names[host] || host;
    q(".js-interview-badge").textContent = isVideo ? "Entrevista em vídeo" : "Entrevista";
    q(".js-interview-cta-label").textContent = isVideo ? "Assistir entrevista" : "Ler entrevista";
    q(".js-interview-cta").href = url.href;
    if (cfg.titulo) q(".js-interview-title").textContent = cfg.titulo;
    if (cfg.frase) q(".js-interview-quote").textContent = cfg.frase;

    var poster = q(".js-interview-poster");
    if (yt) {
      var thumb = q(".js-interview-thumb");
      var tries = ["maxresdefault", "sddefault", "hqdefault"];
      var next = function () {
        var t = tries.shift();
        if (t) thumb.src = "https://i.ytimg.com/vi/" + yt + "/" + t + ".jpg";
        else { thumb.onerror = thumb.onload = null; thumb.src = "assets/sergio-artesao.jpg"; thumb.classList.remove("is-yt"); }
      };
      // o YouTube devolve uma imagem cinza de 120px quando a versão não existe
      thumb.onload = function () { if (thumb.naturalWidth <= 120 && tries.length) next(); };
      thumb.onerror = next;
      thumb.classList.add("is-yt");
      next();
      thumb.alt = "Entrevista com Sérgio Gresczeschen";
    }
    if (!isVideo) {
      poster.classList.add("is-link");
      q(".interview__play svg").innerHTML = '<path d="M7 17 17 7M9 7h8v8" fill="none" stroke="currentColor" stroke-width="1.6"/>';
    }
    poster.addEventListener("click", function () {
      var src = yt ? "https://www.youtube-nocookie.com/embed/" + yt + "?autoplay=1&rel=0&playsinline=1"
              : vimeo ? "https://player.vimeo.com/video/" + vimeo + "?autoplay=1" : null;
      // aberto direto do computador (file://) o YouTube recusa o player embutido (erro 153): abre em nova aba
      if (!src || location.protocol === "file:") { window.open(url.href, "_blank", "noopener"); return; }
      var f = document.createElement("iframe");
      f.src = src; f.title = "Entrevista com Sérgio Gresczeschen";
      f.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen"; f.allowFullscreen = true;
      f.referrerPolicy = "strict-origin-when-cross-origin";
      poster.replaceWith(f);
    });

    sec.hidden = false;
    document.querySelectorAll(".js-interview-link").forEach(function (a) { a.hidden = false; });
  }
  setupInterview(ENTREVISTA);
  window.__setupInterview = setupInterview; // usado só para testes

  /* ---------- Fade-in ao rolar ---------- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-in"); });
  }
  // o hero aparece logo de cara
  document.querySelectorAll(".hero .reveal").forEach(function (el, i) {
    setTimeout(function () { el.classList.add("is-in"); }, 200 + i * 140);
  });

  /* ---------- Filtros da galeria ---------- */
  var pieces = Array.prototype.slice.call(document.querySelectorAll(".piece"));
  var filters = document.querySelectorAll(".filter");
  filters.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var f = btn.getAttribute("data-filter");
      filters.forEach(function (b) {
        var on = b === btn;
        b.classList.toggle("is-active", on);
        b.setAttribute("aria-selected", String(on));
      });
      pieces.forEach(function (p) {
        var show = f === "all" || p.getAttribute("data-cat") === f;
        p.classList.toggle("is-hidden", !show);
        if (show) p.classList.add("is-in");
      });
    });
  });

  /* ---------- Lightbox ---------- */
  var lb = document.getElementById("lightbox");
  var lbImg = lb.querySelector(".lightbox__img");
  var lbCap = lb.querySelector(".lightbox__caption");
  var current = 0;
  var lastFocus = null;

  function visiblePieces() { return pieces.filter(function (p) { return !p.classList.contains("is-hidden"); }); }

  function show(index) {
    var list = visiblePieces();
    if (!list.length) return;
    current = (index + list.length) % list.length;
    var p = list[current];
    var img = p.querySelector("img");
    var cat = p.querySelector(".piece__cat").textContent;
    var title = p.querySelector("h3").textContent;
    lbImg.classList.add("is-switching");
    var pre = new Image();
    pre.onload = pre.onerror = function () {
      lbImg.src = img.getAttribute("src");
      lbImg.alt = img.alt;
      lbCap.innerHTML = "";
      var s = document.createElement("small"); s.textContent = cat;
      lbCap.appendChild(s);
      lbCap.appendChild(document.createTextNode(title));
      var d = p.querySelector(".piece__desc");
      if (d) { var dp = document.createElement("p"); dp.textContent = d.textContent; lbCap.appendChild(dp); }
      lbImg.classList.remove("is-switching");
    };
    pre.src = img.getAttribute("src");
  }

  function open(piece) {
    lastFocus = document.activeElement;
    lb.hidden = false;
    document.body.style.overflow = "hidden";
    show(visiblePieces().indexOf(piece));
    requestAnimationFrame(function () { lb.classList.add("is-open"); });
    lb.querySelector(".lightbox__close").focus();
  }

  function close() {
    lb.classList.remove("is-open");
    document.body.style.overflow = "";
    setTimeout(function () { lb.hidden = true; }, 350);
    if (lastFocus) lastFocus.focus();
  }

  pieces.forEach(function (p) {
    p.querySelector(".piece__btn").addEventListener("click", function () { open(p); });
  });
  lb.querySelector(".lightbox__close").addEventListener("click", close);
  lb.querySelector(".lightbox__nav--prev").addEventListener("click", function () { show(current - 1); });
  lb.querySelector(".lightbox__nav--next").addEventListener("click", function () { show(current + 1); });
  lb.addEventListener("click", function (e) { if (e.target === lb || e.target.classList.contains("lightbox__figure")) close(); });

  document.addEventListener("keydown", function (e) {
    if (lb.hidden) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) setMenu(false);
      return;
    }
    if (e.key === "Escape") close();
    else if (e.key === "ArrowLeft") show(current - 1);
    else if (e.key === "ArrowRight") show(current + 1);
  });

  // swipe no celular
  var sx = 0, sy = 0;
  lb.addEventListener("touchstart", function (e) { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
  lb.addEventListener("touchend", function (e) {
    var dx = e.changedTouches[0].clientX - sx;
    var dy = e.changedTouches[0].clientY - sy;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) show(current + (dx < 0 ? 1 : -1));
  }, { passive: true });

  /* ---------- Ano no rodapé ---------- */
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
})();
