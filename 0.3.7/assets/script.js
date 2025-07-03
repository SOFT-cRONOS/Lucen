  function cargarHTMLParcial(idContenedor, archivo) {
    return fetch(archivo)
      .then(response => response.text())
      .then(html => {
        document.getElementById(idContenedor).innerHTML = html;
      });
  }

  document.addEventListener("DOMContentLoaded", () => {
    // ⏳ Cargar ambos fragmentos y esperar que ambos terminen
    Promise.all([
      cargarHTMLParcial('sidebar-container', 'sidebar.html'),
      cargarHTMLParcial('widgetbar-container', 'widgetbar.html')
    ])
    .then(() => {
      // ✅ Solo ahora inicializamos Lucen UI
      if (typeof lucenUI !== "undefined" && typeof lucenUI.init === "function") {
        lucenUI.init();
      }
    })
    .catch(err => console.error("Error al cargar componentes:", err));
  });

  lucenUI.init();