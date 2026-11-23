(function () {
  "use strict";

  // Цены и железо из карточки «Берсерк» на Яндекс Картах (обновлено 12 сентября).
  var ZONES = [
    {
      id: "standard", name: "Стандарт", gpu: "RTX 4060 Ti",
      desc: "Основной зал. Тянет популярные игры на высоких настройках.",
      specs: [["Видеокарта", "RTX 4060 Ti"], ["Процессор", "Intel i5-13400F"], ["Память", "32 ГБ DDR5"], ["Монитор", "Redmi 2K, 180 Гц"]],
      p: { h1: 200, h3: 520, h5: 750, h12: 1650, day: 500, night: 800 },
      photo: { src: "images/hall-row", w2: 960, alt: "Зал Стандарт: кресла у столов с синей подсветкой" }
    },
    {
      id: "bootcamp", name: "Буткэмп", gpu: "RTX 4060 Ti",
      desc: "Та же конфигурация, что в Стандарте.",
      specs: [["Видеокарта", "RTX 4060 Ti"], ["Процессор", "Intel i5-13400F"], ["Память", "32 ГБ DDR5"], ["Монитор", "Redmi 2K, 180 Гц"]],
      p: { h1: 230, h3: 600, h5: 850, h12: 1900, day: 600, night: 950 }
    },
    {
      id: "comfort", name: "Комфорт", gpu: "RTX 5060 Ti",
      desc: "Новое поколение видеокарт и монитор 240 Гц.",
      specs: [["Видеокарта", "RTX 5060 Ti"], ["Процессор", "Ryzen 7 7700"], ["Память", "32 ГБ DDR5"], ["Монитор", "MSI 2K IPS, 240 Гц"]],
      p: { h1: 280, h3: 750, h5: 1100, h12: 2350, day: 750, night: 1050 }
    },
    {
      id: "squad", name: "Сквад", gpu: "RTX 4070 Super",
      desc: "Комната для команды. Недавно поставили лёгкие мыши AJAZZ AJ200, выбирали их несколько месяцев вместе с гостями.",
      specs: [["Видеокарта", "RTX 4070 Super"], ["Процессор", "Intel i7-14600KF"], ["Память", "32 ГБ DDR5"], ["Монитор", "MSI 2K, 240 Гц"]],
      p: { h1: 310, h3: 850, h5: 1250, h12: 2600, day: 850, night: 1200 }
    },
    {
      id: "premium", name: "Премиум", gpu: "RTX 5070 Ti",
      desc: "Ryzen 7 7800X3D и выбор монитора: OLED на 280 Гц или IPS на 320 Гц.",
      specs: [["Видеокарта", "RTX 5070 Ti"], ["Процессор", "Ryzen 7 7800X3D"], ["Память", "32 ГБ DDR5"], ["Монитор", "MSI 2K OLED 280 Гц или IPS 320 Гц"]],
      p: { h1: 350, h3: 1000, h5: 1500, h12: 3200, day: 1000, night: 1450 }
    },
    {
      id: "stream", name: "Стрим", gpu: "RTX 5080",
      desc: "Комната на одного со звукоизоляцией. Самое мощное железо в клубе и OLED на 360 Гц.",
      specs: [["Видеокарта", "RTX 5080"], ["Процессор", "Ryzen 7 7800X3D"], ["Память", "64 ГБ DDR5"], ["Монитор", "Samsung Odyssey G6 OLED 2K, 360 Гц"]],
      p: { h1: 390, h3: 1100, h5: 1650, h12: 3500, day: 1200, night: 1650 },
      photo: { src: "images/stream", w2: 960, alt: "Стримерская комната: поролон на стенах, кресло и компьютер с GeForce RTX" }
    },
    {
      id: "ps5", name: "PS5 Pro", gpu: "PS5 Pro",
      desc: "Отдельная комната с телевизором LG MiniLED 65″ и бескаркасным диваном. В библиотеке есть GTA VI и UFC 6.",
      specs: [["Консоль", "PlayStation 5 Pro"], ["Экран", "LG MiniLED 65″"], ["Где сидеть", "Бескаркасный диван"]],
      p: { h1: 370, h3: 1000, h5: 1450, h12: null, day: 1050, night: 1550 },
      photo: { src: "images/ps5", w2: 721, alt: "Геймпады DualSense на диване в комнате с PS5 Pro" }
    }
  ];

  var LABELS = [["h1", "1 час"], ["h3", "3 часа"], ["h5", "5 часов"], ["h12", "12 часов"], ["day", "День, 8:00–16:00"], ["night", "Ночь, 22:00–8:00"]];
  var fmt = function (n) { return n.toLocaleString("ru-RU").replace(/ /g, " "); };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };

  var tabsEl = document.getElementById("zone-tabs");
  var panel = document.getElementById("zone-panel");
  var tbody = document.getElementById("compare-body");

  if (tabsEl && panel) {
    tabsEl.innerHTML = ZONES.map(function (z, i) {
      return '<button class="zone-tab" role="tab" type="button" id="tab-' + z.id + '" aria-controls="zone-panel" aria-selected="' + (i === 0) + '" tabindex="' + (i === 0 ? 0 : -1) + '" data-i="' + i + '">' +
        "<b>" + esc(z.name) + "</b><span>от " + fmt(z.p.h1) + " ₽ / час</span></button>";
    }).join("");

    var render = function (i) {
      var z = ZONES[i];
      var prices = LABELS.filter(function (l) { return z.p[l[0]] != null; }).map(function (l) {
        return '<div class="price"><dt>' + l[1] + "</dt><dd>" + fmt(z.p[l[0]]) + "<small>₽</small></dd></div>";
      }).join("");
      var photo = z.photo
        ? '<figure class="zone-photo" style="margin:0"><img src="' + z.photo.src + '-480.webp" srcset="' + z.photo.src + "-480.webp 480w, " + z.photo.src + "-960.webp " + z.photo.w2 + 'w" sizes="(min-width: 1024px) 380px, (min-width: 768px) 40vw, 100vw" alt="' + esc(z.photo.alt) + '" loading="lazy"></figure>'
        : "";
      panel.setAttribute("aria-labelledby", "tab-" + z.id);
      panel.innerHTML =
        '<div class="zone-top' + (z.photo ? " has-photo" : "") + '">' +
          '<div class="zone-info">' +
            '<p class="zone-gpu" aria-hidden="true">' + esc(z.gpu) + "</p>" +
            '<h3 class="zone-name">' + esc(z.name) + "</h3>" +            '<p class="zone-desc">' + esc(z.desc) + "</p>" +
            '<ul class="specs">' + z.specs.map(function (s) { return "<li><span>" + esc(s[0]) + "</span><span>" + esc(s[1]) + "</span></li>"; }).join("") + "</ul>" +
          "</div>" + photo +
        "</div>" +
        '<dl class="prices">' + prices + "</dl>" +
        '<p class="price-note">Цены за одно место, в рублях.' + (z.p.h12 == null ? " Пакета на 12 часов для PS5 Pro нет." : "") + "</p>";
    };

    var tabs = Array.prototype.slice.call(tabsEl.querySelectorAll(".zone-tab"));
    var select = function (i, focus) {
      tabs.forEach(function (t, j) {
        t.setAttribute("aria-selected", String(i === j));
        t.tabIndex = i === j ? 0 : -1;
      });
      render(i);
      panel.classList.remove("swap");
      void panel.offsetWidth;
      panel.classList.add("swap");
      if (focus) tabs[i].focus();
      tabs[i].scrollIntoView({ block: "nearest", inline: "nearest" });
    };
    tabsEl.addEventListener("click", function (e) {
      var b = e.target.closest(".zone-tab");
      if (b) select(+b.dataset.i, false);
    });
    tabsEl.addEventListener("keydown", function (e) {
      var cur = tabs.indexOf(document.activeElement);
      if (cur < 0) return;
      var n = null;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") n = (cur + 1) % tabs.length;
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") n = (cur - 1 + tabs.length) % tabs.length;
      if (e.key === "Home") n = 0;
      if (e.key === "End") n = tabs.length - 1;
      if (n !== null) { e.preventDefault(); select(n, true); }
    });
    render(0);
  }

  if (tbody) {
    tbody.innerHTML = ZONES.map(function (z) {
      return '<tr><th scope="row">' + esc(z.name) + "</th>" + ["h1", "h3", "h5", "h12", "day", "night"].map(function (k) {
        return "<td>" + (z.p[k] == null ? "—" : fmt(z.p[k]) + " ₽") + "</td>";
      }).join("") + "</tr>";
    }).join("");
  }

  // Лайтбокс
  var dlg = document.getElementById("lightbox");
  var items = Array.prototype.slice.call(document.querySelectorAll(".g-item"));
  var lbImg = document.getElementById("lb-img");
  var lbCap = document.getElementById("lb-cap");
  var lbCount = document.getElementById("lb-count");
  var idx = 0, opener = null;

  var show = function (i) {
    idx = (i + items.length) % items.length;
    var it = items[idx], im = it.querySelector("img");
    lbImg.classList.remove("is-swapping");
    void lbImg.offsetWidth;
    lbImg.classList.add("is-swapping");
    lbImg.src = it.dataset.full;
    lbImg.alt = im.alt;
    lbCap.textContent = im.alt;
    lbCount.textContent = (idx + 1) + " из " + items.length;
  };
  if (dlg && typeof dlg.showModal === "function") {
    items.forEach(function (it, i) {
      it.addEventListener("click", function () { opener = it; show(i); dlg.showModal(); document.getElementById("lb-close").focus(); });
    });
    document.getElementById("lb-close").addEventListener("click", function () { dlg.close(); });
    document.getElementById("lb-prev").addEventListener("click", function () { show(idx - 1); });
    document.getElementById("lb-next").addEventListener("click", function () { show(idx + 1); });
    dlg.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") { e.preventDefault(); show(idx - 1); }
      if (e.key === "ArrowRight") { e.preventDefault(); show(idx + 1); }
    });
    dlg.addEventListener("click", function (e) { if (e.target === dlg || e.target.classList.contains("lb-inner") || e.target.classList.contains("lb-figure")) dlg.close(); });
    dlg.addEventListener("close", function () { if (opener) opener.focus(); });
    var sx = null;
    dlg.addEventListener("touchstart", function (e) { sx = e.touches[0].clientX; }, { passive: true });
    dlg.addEventListener("touchend", function (e) {
      if (sx === null) return;
      var dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 50) show(idx + (dx < 0 ? 1 : -1));
      sx = null;
    });
  } else {
    items.forEach(function (it) { it.addEventListener("click", function () { window.open(it.dataset.full, "_blank"); }); });
  }

  // Шапка темнеет после начала прокрутки
  var header = document.querySelector(".header");
  var onScroll = function () { if (header) header.classList.toggle("is-scrolled", window.scrollY > 24); };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  var calm = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Плавное появление блоков при прокрутке
  if (!calm && "IntersectionObserver" in window) {
    var groups = [
      [".section-head"], [".about-text"], [".about-media figure", "zoom"], [".feat-title"], [".feat"],
      [".zone-tabs"], [".zone-panel"], [".compare"], [".promo"], [".g-item", "zoom"],
      [".score"], [".quote"], [".booking-inner > *"], [".c-row"], [".notes"], [".map-card", "zoom"],
      [".footer-mark"], [".footer-cols > *"]
    ];
    var targets = [];
    groups.forEach(function (g) {
      Array.prototype.forEach.call(document.querySelectorAll(g[0]), function (el, i) {
        el.setAttribute("data-reveal", g[1] || "up");
        el.style.setProperty("--i", Math.min(i, 8));
        targets.push(el);
      });
    });
    document.documentElement.classList.add("reveal-on");
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    targets.forEach(function (el) { io.observe(el); });
  }

  // Лёгкий параллакс фото в герое за курсором
  var heroMedia = document.querySelector(".hero-media");
  if (!calm && heroMedia && window.matchMedia("(pointer: fine)").matches) {
    var heroImg = heroMedia.querySelector("img");
    var hero = document.querySelector(".hero");
    var raf = 0;
    hero.addEventListener("pointermove", function (e) {
      if (raf) return;
      raf = requestAnimationFrame(function () {
        raf = 0;
        var x = e.clientX / window.innerWidth - 0.5;
        var y = e.clientY / window.innerHeight - 0.5;
        heroImg.style.transform = "scale(1.06) translate3d(" + (x * -14).toFixed(1) + "px," + (y * -14).toFixed(1) + "px,0)";
      });
    });
    hero.addEventListener("pointerleave", function () { heroImg.style.transform = ""; });
  }

  // Меню на телефоне и планшете
  var menuBtn = document.querySelector(".menu-btn");
  var nav = document.getElementById("site-nav");
  if (menuBtn && nav) {
    // Пока меню открыто, контент под ним недоступен с клавиатуры (inert),
    // а прокрутка заблокирована через position: fixed, иначе iOS Safari прокручивает страницу под меню
    var behind = [document.getElementById("main"), document.querySelector(".footer")];
    var lockedY = 0;
    var setMenu = function (open) {
      var wasOpen = nav.classList.contains("is-open");
      if (open === wasOpen) return;
      nav.classList.toggle("is-open", open);
      document.documentElement.classList.toggle("menu-open", open);
      menuBtn.setAttribute("aria-expanded", String(open));
      menuBtn.setAttribute("aria-label", open ? "Закрыть меню" : "Открыть меню");
      behind.forEach(function (el) { if (el) el.inert = open; });
      var b = document.body.style;
      if (open) {
        lockedY = window.scrollY;
        b.position = "fixed"; b.top = -lockedY + "px"; b.left = "0"; b.right = "0";
      } else {
        b.position = ""; b.top = ""; b.left = ""; b.right = "";
        window.scrollTo({ top: lockedY, behavior: "instant" });
      }
    };
    menuBtn.addEventListener("click", function () {
      var open = menuBtn.getAttribute("aria-expanded") !== "true";
      setMenu(open);
      if (open) { var first = nav.querySelector("a"); if (first) first.focus(); }
    });
    nav.addEventListener("click", function (e) { if (e.target.closest("a")) setMenu(false); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && menuBtn.getAttribute("aria-expanded") === "true") { setMenu(false); menuBtn.focus(); }
    });
    window.matchMedia("(min-width: 1100px)").addEventListener("change", function (m) { if (m.matches) setMenu(false); });
  }

  // Пауза бегущей строки (WCAG 2.2.2)
  var pauseBtn = document.querySelector(".ticker-pause");
  var ticker = document.querySelector(".ticker");
  if (pauseBtn && ticker) {
    pauseBtn.addEventListener("click", function () {
      var paused = pauseBtn.getAttribute("aria-pressed") !== "true";
      pauseBtn.setAttribute("aria-pressed", String(paused));
      pauseBtn.setAttribute("aria-label", paused ? "Запустить бегущую строку" : "Остановить бегущую строку");
      ticker.classList.toggle("is-paused", paused);
    });
  }

  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
})();
