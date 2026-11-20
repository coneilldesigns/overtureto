/* Overture: Find us map. Leaflet + CARTO dark tiles, loaded when the map nears the viewport. */
(function () {
  const el = document.querySelector("[data-map]");
  if (!el) return;

  const LEAFLET = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/";
  // CARTO Basemaps key (public by design; restrict it to the site's domains in the CARTO dashboard)
  const CARTO_KEY = "cb1_3gh5_1_cac8ba4700eb9cfdf20ae2b2";

  function load() {
    const css = document.createElement("link");
    css.rel = "stylesheet";
    css.href = LEAFLET + "leaflet.min.css";
    document.head.appendChild(css);
    const js = document.createElement("script");
    js.src = LEAFLET + "leaflet.min.js";
    js.onload = init;
    document.head.appendChild(js);
  }

  function init() {
    const L = window.L;
    const at = [parseFloat(el.dataset.lat), parseFloat(el.dataset.lng)];
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.textContent = "";

    const map = L.map(el, {
      center: at,
      zoom: 15,
      scrollWheelZoom: false,
      zoomControl: false,
      zoomAnimation: !reduce,
      attributionControl: true,
    });
    L.control.zoom({ position: "bottomright" }).addTo(map);
    L.tileLayer("https://basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}{r}.png?key={key}", {
      key: CARTO_KEY,
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
    }).addTo(map);

    L.marker(at, {
      icon: L.divIcon({ className: "map-pin", html: "<b></b><span>Overture</span>", iconSize: [0, 0] }),
      keyboard: false,
      title: "Overture Studios, 163 Sterling Rd",
    }).addTo(map);

    // drift in from the wider city on first view
    if (!reduce && "IntersectionObserver" in window) {
      map.setView(at, 12, { animate: false });
      const seen = new IntersectionObserver((entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        seen.disconnect();
        setTimeout(() => map.flyTo(at, 15, { duration: 2.2 }), 300);
      }, { threshold: 0.5 });
      seen.observe(el);
    }
  }

  if (!("IntersectionObserver" in window)) return load();
  const io = new IntersectionObserver((entries) => {
    if (entries.some((e) => e.isIntersecting)) { io.disconnect(); load(); }
  }, { rootMargin: "400px 0px" });
  io.observe(el);
})();
