# ℹ️ ATENTION!
Work in progress! Lucen Framework it's not finished.

## Para probarlo:
Linkear el cdn

      https://cdn.jsdelivr.net/gh/SOFT-cRONOS/Lucen@v0.3.7/dist/lucen-ui.min.css

y el js

      https://cdn.jsdelivr.net/gh/SOFT-cRONOS/Lucen@v0.3.7/dist/lucen-ui.min.js

## 📌 Lucen Framework

Lucen Framework es un sistema de estilos minimalista basado en el lenguaje visual de Fluent Design. Diseñado para aplicaciones web elegantes, ligeras y responsivas.

Desarrollado con ❤️ por [SoftCronos](https://softcronos.com.ar)

---

### ✨ Características

- Sistema de diseño inspirado en Fluent Design
- Componentes UI responsivos y accesibles
- Transiciones suaves y efectos de transparencia con blur
- Variables CSS listas para personalizar
- Compatibilidad con todos los navegadores

### Styles
- Layouts
- Colors
- DarkMode

### Componentes:

- Accordion
- Alerts <span style="color:green;"> ✓</span>
- Buttons <span style="color:green;"> ✓</span>
- CheckBox & Switch <span style="color:green;"> ✓</span>
- CommandBar
- Dialog
- Input <span style="color:green;"> ✓</span>
- MenuBar
- ProgressBar 
- RadioBUtton
- Select <span style="color:green;"> ✓</span>
- SliderBar
- TableView <span style="color:green;"> ✓</span>

### Utilities

- Appearance
- Classes
- Icons

## Files
```
lucen-ui/
├── dist/                   # Archivos finales minificados
│   ├── lucen-ui.min.css
│   └── lucen-ui.min.js
├── src/                    # Archivos fuente
│   ├── js/
│   │   └── lucen-ui.js
│   └── scss/
│       ├── _variables.scss
│       ├── _buttons.scss
│       ├── _components.scss
│       ├── _layout.scss
│       └── lucen-ui.scss        # archivo principal que importa los otros
├── docs/                   # Web de demo y documentación
│   └── index.html
├── LICENSE                 # Licencia GPLv3
├── README.md               # Descripción del proyecto
```
## Branches

   - main: versión estable (lo que va al CDN y a producción)

   - dev: rama de desarrollo activo (donde hacés cambios y pruebas)

   - gh-pages: rama usada automáticamente por GitHub Pages para publicar la demo (/docs o root)

# Como aportar
Desde el visual studio
```
cd lucen-ui
npm init -y
```

`Nota: Si hace falta instalar nodejs npm luego sudo npm install -g sass`
# License
This project is licensed under the GNU GPL v3.0 — see the LICENSE file for details.
© [SoftCronos](https://softcronos.com.ar)
