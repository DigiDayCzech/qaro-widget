/* QARO webview: plávajúce tlačidlo + okno s iframe.
   <script src="https://digidayczech.github.io/qaro-widget/webview/webview.js"
     data-url="https://..." data-position="bottom-left" data-color="#1f1545" data-label="Otevřít"></script> */
(function () {
  var s = document.currentScript;
  if (!s || !s.dataset.url) return;
  var URL = s.dataset.url;
  var LABEL = s.dataset.label || "Otevřít";
  var COLOR = s.dataset.color || "#1f1545";
  var side = (s.dataset.position || "bottom-left").indexOf("right") > -1 ? "right" : "left";
  var id = "qwv" + Math.random().toString(36).slice(2, 7);

  var css = document.createElement("style");
  css.textContent =
    "." + id + "-b{position:fixed;" + side + ":20px;bottom:20px;z-index:2147483000;width:56px;height:56px;border-radius:50%;border:0;background:" + COLOR + ";color:#fff;cursor:pointer;box-shadow:0 4px 14px rgba(0,0,0,.3);display:flex;align-items:center;justify-content:center}" +
    "." + id + "-b:focus-visible{outline:3px solid #ffbf47;outline-offset:2px}" +
    "." + id + "-p{position:fixed;" + side + ":20px;bottom:86px;z-index:2147483001;width:400px;height:600px;max-height:calc(100vh - 106px);background:#fff;border-radius:12px;box-shadow:0 10px 40px rgba(0,0,0,.35);display:none;flex-direction:column;overflow:hidden}" +
    "." + id + "-p.open{display:flex}" +
    "." + id + "-h{display:flex;align-items:center;gap:8px;padding:10px 12px;background:" + COLOR + ";color:#fff;font:600 15px/1.2 sans-serif}" +
    "." + id + "-h span{flex:1}." + id + "-h a,." + id + "-h button{color:#fff;background:none;border:0;cursor:pointer;font-size:20px;line-height:1;text-decoration:none;padding:2px 6px}" +
    "." + id + "-p iframe{flex:1;width:100%;border:0}" +
    "@media(max-width:600px){." + id + "-p{left:0;right:0;top:0;bottom:0;width:auto;height:auto;max-height:none;border-radius:0}}";
  document.head.appendChild(css);

  var btn = document.createElement("button");
  btn.type = "button";
  btn.className = id + "-b";
  btn.title = LABEL;
  btn.setAttribute("aria-label", LABEL);
  btn.setAttribute("aria-expanded", "false");
  btn.innerHTML = '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>';

  var panel = document.createElement("div");
  panel.className = id + "-p";
  panel.setAttribute("role", "dialog");
  panel.setAttribute("aria-label", LABEL);
  panel.innerHTML = '<div class="' + id + '-h"><span></span><a target="_blank" rel="noopener" title="Otevřít v novém okně">&#8599;</a><button type="button" aria-label="Zavřít" title="Zavřít">&times;</button></div>';
  panel.querySelector("span").textContent = LABEL;
  panel.querySelector("a").href = URL;

  var frame;
  function toggle(open) {
    if (open && !frame) {
      frame = document.createElement("iframe");
      frame.src = URL;
      frame.title = LABEL;
      panel.appendChild(frame);
    }
    panel.classList.toggle("open", open);
    btn.setAttribute("aria-expanded", String(open));
  }
  btn.onclick = function () { toggle(!panel.classList.contains("open")); };
  panel.querySelector("button").onclick = function () { toggle(false); btn.focus(); };
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && panel.classList.contains("open")) { toggle(false); btn.focus(); }
  });

  function mount() { document.body.appendChild(btn); document.body.appendChild(panel); }
  if (document.body) mount(); else document.addEventListener("DOMContentLoaded", mount);
})();
