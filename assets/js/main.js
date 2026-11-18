/* Домашний мастер — меню, FAQ, заявка */
(function () {
  "use strict";

  /* Куда уходит заявка. Пока канал не задан — заявка копируется в буфер. */
  var DEST = ""; // например "375291112233" после получения номера

  var burger = document.getElementById("burger"), drawer = document.getElementById("drawer"), dclose = document.getElementById("drawerClose");
  function setDrawer(open) {
    if (!drawer) return;
    drawer.setAttribute("data-open", open ? "true" : "false");
    drawer.setAttribute("aria-hidden", open ? "false" : "true");
    if (burger) burger.setAttribute("aria-expanded", open ? "true" : "false");
    document.body.style.overflow = open ? "hidden" : "";
  }
  if (burger) burger.addEventListener("click", function () { setDrawer(true); });
  if (dclose) dclose.addEventListener("click", function () { setDrawer(false); });
  if (drawer) drawer.addEventListener("click", function (e) { if (e.target === drawer) setDrawer(false); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") setDrawer(false); });

  document.querySelectorAll(".faq__q").forEach(function (q) {
    q.addEventListener("click", function () {
      var item = q.closest(".faq__i");
      var open = item.getAttribute("data-open") === "true";
      item.parentElement.querySelectorAll('.faq__i[data-open="true"]').forEach(function (o) { if (o !== item) o.setAttribute("data-open", "false"); });
      item.setAttribute("data-open", open ? "false" : "true");
      q.setAttribute("aria-expanded", open ? "false" : "true");
    });
  });

  document.querySelectorAll("form[data-form]").forEach(function (form) {
    var box = form.querySelector(".formout"), copy = form.querySelector(".copybox");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var phoneEl = form.querySelector('[name="phone"]');
      var phone = phoneEl ? phoneEl.value.trim() : "";
      if (phone.replace(/\D/g, "").length < 6) {
        if (box) { box.className = "formout msg--err"; box.textContent = "Укажите телефон — перезвоним и договоримся о времени."; }
        if (phoneEl) phoneEl.focus();
        return;
      }
      var labels = { name: "Имя", phone: "Телефон", what: "Что нужно", where: "Адрес / район", message: "Описание" };
      var lines = ["Заявка мастеру на час:"];
      ["name", "phone", "what", "where", "message"].forEach(function (k) {
        var el = form.querySelector('[name="' + k + '"]');
        if (el && el.value && el.value.trim()) lines.push(labels[k] + ": " + el.value.trim());
      });
      lines.push(form.getAttribute("data-form") || "Прошу помочь с бытовыми работами.");
      var text = lines.join("\n");
      if (DEST) {
        window.open("https://wa.me/" + DEST + "?text=" + encodeURIComponent(text), "_blank");
        if (box) { box.className = "formout"; box.textContent = "Открыли мессенджер с готовым сообщением — останется нажать «Отправить»."; }
        return;
      }
      if (copy) { copy.textContent = text; copy.setAttribute("data-on", "true"); }
      if (box) { box.className = "formout"; box.textContent = "Заявка собрана — скопируйте её и отправьте мастеру в любом мессенджере."; }
      var t = copy && copy.textContent;
      if (navigator.clipboard && t) navigator.clipboard.writeText(t).catch(function () {});
    });
  });

  document.querySelectorAll("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
