
/**
 * lucen UI Framework - Complemento para Bootstrap 5
 * Versión 1.0.0
 * 
 * Este framework proporciona componentes con estilo lucen Design (Windows 11)
 * que complementan Bootstrap 5, usando solo HTML, CSS y JS.
 */

const lucenUI = (function() {
    'use strict';
    
    // Variables globales
    let toastTimeout;
    
    // Métodos públicos
    return {
        /**
         * Inicializa todos los componentes lucen UI
         */
        init: function() {
            this.initSidebar();
            this.initTooltips();
            this.initTabs();
            this.initModals();
            this.initDropdownArrows();
            this.initCollapsibles();
            this.initDropdowns();
            this.initSelects();
            this.initTablePagination();
            this.initCommandBars();
            this.initContextualMenu();

            //dark and lght mode functions:
            this.setupEventListeners();
            this.applySavedTheme();
            this.watchSystemPreference();

            //sliders
            this.initSliders();
        },
        
        /**
         * Inicializa el sidebar con funcionalidad de toggle
         */
        initSidebar: function() {
            // Sidebar collapse functionality
            const sidebarCollapseBtn = document.getElementById('sidebarCollapse');
            if (sidebarCollapseBtn) {
                const sidebar = document.getElementById('sidebar');
                const container = document.querySelector('.lucen-main');
                
                sidebarCollapseBtn.addEventListener('click', () => {
                    if (sidebar) sidebar.classList.toggle('collapsed');
                    if (container) container.classList.toggle('sidebar-collapsed');
                    
                    const icon = sidebarCollapseBtn.querySelector('i');
                    if (icon) {
                        icon.classList.toggle('bi-chevron-double-left');
                        icon.classList.toggle('bi-chevron-double-right');
                    }
                });
            }
        
            // Widgetbar collapse functionality
            const widgetbarBtn = document.getElementById("widgetbarCollapse");
            if (widgetbarBtn) {
                const widgetbar = document.getElementById("widgetbar");
                const container = document.querySelector(".lucen-main");
                
                widgetbarBtn.addEventListener("click", () => {
                    if (widgetbar) widgetbar.classList.toggle("collapsed");
                    if (container) container.classList.toggle("widgetbar-collapsed");
                    
                    const icon = widgetbarBtn.querySelector("i");
                    if (icon) {
                        icon.classList.toggle("bi-chevron-double-left");
                        icon.classList.toggle("bi-chevron-double-right");
                    }
                });
            }
        },
        
        /**
         * Inicializa los menús colapsables del sidebar con altura dinámica
         */
        initCollapsibles: function() {
            document.querySelectorAll('.lucen-nav-item > .lucen-nav-link').forEach(toggle => {
                const href = toggle.getAttribute('href');

                // Solo procesar enlaces que tengan un ID válido después del #
                if (href && href.startsWith('#') && href.length > 1) {
                    const submenuId = href;
                    const submenu = document.querySelector(submenuId);
                    const arrow = toggle.querySelector('.lucen-nav-arrow');

                    if (submenu) {
                        // Inicializar estilo en cero
                        submenu.style.height = '0px';
                        submenu.style.overflow = 'hidden';
                        submenu.style.transition = 'height 0.3s ease';

                        toggle.addEventListener('click', function(e) {
                            e.preventDefault();

                            const isOpen = submenu.classList.contains('show');

                            // Cerrar otros submenús
                            const parentNav = this.closest('.lucen-nav');
                            if (parentNav) {
                                parentNav.querySelectorAll('.lucen-nav-submenu').forEach(menu => {
                                    if (menu !== submenu) {
                                        menu.classList.remove('show');
                                        menu.style.height = '0px';
                                        const otherArrow = menu.previousElementSibling?.querySelector('.lucen-nav-arrow');
                                        if (otherArrow) otherArrow.classList.remove('rotate');
                                    }
                                });
                            }

                            if (isOpen) {
                                // Cerrar submenu
                                submenu.style.height = submenu.scrollHeight + 'px'; // Forzar a su altura actual
                                requestAnimationFrame(() => {
                                    submenu.style.height = '0px';
                                });
                                submenu.classList.remove('show');
                                if (arrow) arrow.classList.remove('rotate');
                                toggle.setAttribute('aria-expanded', 'false');
                            } else {
                                // Abrir submenu
                                submenu.classList.add('show');
                                const totalHeight = Array.from(submenu.children).reduce((acc, el) => {
                                    const style = window.getComputedStyle(el);
                                    const marginTop = parseInt(style.marginTop) || 0;
                                    const marginBottom = parseInt(style.marginBottom) || 0;
                                    return acc + el.offsetHeight + marginTop + marginBottom;
                                }, 0);
                                submenu.style.height = totalHeight + 'px';
                                if (arrow) arrow.classList.add('rotate');
                                toggle.setAttribute('aria-expanded', 'true');
                            }
                        });
                    }
                }
            });
        },


        /**
         * Inicializa los dropdowns del menubar
         */
        initDropdowns: function() {
            // Asignar eventos a los elementos del menubar
            document.querySelectorAll('.lucen-menubar-item').forEach(item => {
                // Eliminar el onclick del HTML y manejarlo aquí
                item.removeAttribute('onclick');
                item.addEventListener('click', (e) => {
                    // Evitar que se propague si se hace clic en un elemento interno
                    if (e.target.closest('.lucen-menubar-dropdown-item') || 
                        e.target.classList.contains('lucen-menubar-arrow')) {
                        return;
                    }
                    this.toggleDropdown(item);
                });
                
                // Manejar la flecha del dropdown
                const arrow = item.querySelector('.lucen-menubar-arrow');
                if (arrow) {
                    arrow.addEventListener('click', (e) => {
                        e.stopPropagation();
                        this.toggleDropdown(item);
                    });
                }
            });
            
            // Cerrar dropdowns cuando se hace clic fuera
            document.addEventListener('click', (e) => {
                if (!e.target.closest('.lucen-menubar-item')) {
                    this.closeAllDropdowns();
                }
            });
            
            // Cerrar dropdowns con tecla Escape
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    this.closeAllDropdowns();
                }
            });
        },
        
        /**
         * Alterna un dropdown específico
         * @param {HTMLElement} element - El elemento .lucen-menubar-item
         */
        toggleDropdown: function(element) {
            // Cerrar otros dropdowns primero
            this.closeAllDropdowns(element);
            
            // Alternar el dropdown actual
            element.classList.toggle('active');
            const dropdown = element.querySelector('.lucen-menubar-dropdown');
            if (dropdown) dropdown.classList.toggle('show');

            // Detectar si debe abrir hacia arriba
            if (element.dataset.drop === 'up') {
                dropdown.classList.add('dropup');
            } else {
                dropdown.classList.remove('dropup');
            }
            
            // Rotar la flecha
            const arrow = element.querySelector('.lucen-menubar-arrow');
            if (arrow) {
                arrow.classList.toggle('rotate');
            }
        },
        
        /**
         * Cierra todos los dropdowns excepto uno opcional
         * @param {HTMLElement} [except] - Elemento a excluir del cierre
         */
        closeAllDropdowns: function(except) {
            document.querySelectorAll('.lucen-menubar-item').forEach(item => {
                if (!except || item !== except) {
                    item.classList.remove('active');
                    const dropdown = item.querySelector('.lucen-menubar-dropdown');
                    if (dropdown) {
                        dropdown.classList.remove('show');
                        dropdown.classList.remove('dropup'); 
                    }
                    
                    // Restablecer flecha
                    const arrow = item.querySelector('.lucen-menubar-arrow');
                    if (arrow) arrow.classList.remove('rotate');
                }
            });
        },

        initContextualMenu: function () {
            const menu = document.querySelector('.lucen-contextmenu');

            if (!menu) return;

            // Mostrar el menú contextual al hacer click derecho
            document.addEventListener('contextmenu', (e) => {
                e.preventDefault();

                // Ocultar cualquier otro menú contextual
                document.querySelectorAll('.lucen-contextmenu.show').forEach(ctx => {
                    ctx.classList.remove('show');
                });

                // Posicionar y mostrar el menú
                menu.style.left = `${e.pageX}px`;
                menu.style.top = `${e.pageY}px`;
                menu.classList.add('show');
            });

            // Ocultar el menú al hacer clic en cualquier otra parte
            document.addEventListener('click', () => {
                menu.classList.remove('show');
            });

            // Ocultar con tecla Escape
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    menu.classList.remove('show');
                }
            });
        },
        /**
         * Inicializa los select personalizados
         */
        initSelects: function() {
            const selects = document.querySelectorAll('.lucen-select');
            
            if (selects.length === 0) {
                console.warn('No se encontraron elementos .lucen-select');
                return;
            }

            selects.forEach(select => {
                const trigger = select.querySelector('.lucen-select-trigger');
                const dropdown = select.querySelector('.lucen-select-dropdown');
                const selected = select.querySelector('.lucen-select-selected');
                const options = select.querySelectorAll('.lucen-select-option');
                
                if (!trigger || !dropdown || !selected || options.length === 0) {
                    console.warn('Elementos incompletos en un .lucen-select', select);
                    return;
                }
                
                trigger.addEventListener('click', (e) => {
                    e.stopPropagation();
                    document.querySelectorAll('.lucen-select').forEach(s => {
                        if (s !== select) s.classList.remove('active');
                    });
                    select.classList.toggle('active');
                });
                
                options.forEach(option => {
                    option.addEventListener('click', () => {
                        const value = option.getAttribute('data-value');
                        const text = option.querySelector('span')?.textContent || '';
                        
                        selected.textContent = text;
                        select.classList.remove('active');
                        // Aquí puedes disparar un evento personalizado si lo necesitas
                        select.dispatchEvent(new CustomEvent('change', {
                            detail: { value, text }
                        }));
                    });
                });
            });
            
            document.addEventListener('click', () => {
                document.querySelectorAll('.lucen-select').forEach(select => {
                    select.classList.remove('active');
                });
            });
            
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    document.querySelectorAll('.lucen-select').forEach(select => {
                        select.classList.remove('active');
                    });
                }
            });
        },
        /**
         * Inicializa los tooltips
         */
        initTooltips: function() {
            document.querySelectorAll('[data-lucen-tooltip]').forEach(el => {
                const tooltipText = el.getAttribute('data-lucen-tooltip');
                const placement = el.getAttribute('data-lucen-placement') || 'top';
        
                // Crear elemento tooltip
                const tooltip = document.createElement('div');
                tooltip.className = 'lucen-tooltip';
                tooltip.textContent = tooltipText;
        
                // Crear contenedor para posicionamiento relativo
                const tooltipContainer = document.createElement('div');
                tooltipContainer.className = 'lucen-tooltip-container';
                tooltipContainer.setAttribute('data-lucen-placement', placement);
                tooltipContainer.style.position = 'relative';
                tooltipContainer.style.display = 'inline-block';
        
                // Insertar tooltip en el contenedor
                tooltipContainer.appendChild(tooltip);
        
                // Insertar contenedor en el DOM antes del elemento original
                el.parentNode.insertBefore(tooltipContainer, el);
                // Mover el elemento original dentro del contenedor
                tooltipContainer.appendChild(el);
        
                // Ocultar tooltip inicialmente
                tooltip.classList.remove('show');
        
                // Eventos para mostrar y ocultar tooltip
                el.addEventListener('mouseenter', () => {
                    // Limpiar estilos por si acaso
                    tooltip.style.top = '';
                    tooltip.style.bottom = '';
                    tooltip.style.left = '';
                    tooltip.style.right = '';
                    tooltip.style.marginTop = '';
                    tooltip.style.marginBottom = '';
                    tooltip.style.marginLeft = '';
                    tooltip.style.marginRight = '';
        
                    // Posicionar tooltip según el placement
                    switch (placement) {
                        case 'top':
                            tooltip.style.bottom = '100%';
                            tooltip.style.left = '50%';
                            tooltip.style.transform = 'translateX(-50%)';
                            tooltip.style.marginBottom = '8px';
                            break;
                        case 'bottom':
                            tooltip.style.top = '100%';
                            tooltip.style.left = '50%';
                            tooltip.style.transform = 'translateX(-50%)';
                            tooltip.style.marginTop = '8px';
                            break;
                        case 'left':
                            tooltip.style.top = '50%';
                            tooltip.style.right = '100%';
                            tooltip.style.transform = 'translateY(-50%)';
                            tooltip.style.marginRight = '8px';
                            break;
                        case 'right':
                            tooltip.style.top = '50%';
                            tooltip.style.left = '100%';
                            tooltip.style.transform = 'translateY(-50%)';
                            tooltip.style.marginLeft = '8px';
                            break;
                    }
        
                    tooltip.classList.add('show');
                });
        
                el.addEventListener('mouseleave', () => {
                    tooltip.classList.remove('show');
                });
            });
        },
        
        /**
         * Inicializa el sistema de tabs
         */
        initTabs: function() {
            document.querySelectorAll('.lucen-tabs-btn').forEach(tab => {
                tab.addEventListener('click', function() {
                    const tabId = this.getAttribute('data-tab');
                    const tabsContainer = this.closest('.lucen-tabs');
                    
                    // Remover clase active de todos los botones
                    tabsContainer.querySelectorAll('.lucen-tabs-btn').forEach(btn => {
                        btn.classList.remove('active');
                    });
                    
                    // Añadir clase active al botón clickeado
                    this.classList.add('active');
                    
                    // Ocultar todos los paneles
                    tabsContainer.querySelectorAll('.lucen-tabs-pane').forEach(pane => {
                        pane.classList.remove('active');
                    });
                    
                    // Mostrar el panel correspondiente
                    document.getElementById(tabId).classList.add('active');
                });
            });
        },
        
        /**
         * Inicializa los modales
         */
        initModals: function() {
            // Cerrar modal al hacer clic fuera del contenido (si NO es static)
            document.querySelectorAll('.lucen-modal').forEach(modal => {
                modal.addEventListener('click', function(e) {
                    const isStatic = modal.getAttribute('data-bs-backdrop') === 'static';
                    if (!isStatic && e.target === modal) {
                        lucenUI.hideModal(`#${modal.id}`);
                    }
                });
            });

            // Cerrar modal con tecla ESC (si NO está deshabilitado)
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    const openModal = document.querySelector('.lucen-modal.show');
                    if (openModal) {
                        const keyboardDisabled = openModal.getAttribute('data-bs-keyboard') === 'false';
                        if (!keyboardDisabled) {
                            lucenUI.hideModal(`#${openModal.id}`);
                        }
                    }
                }
            });

            // Manejar los modales que usan data-bs-toggle de Bootstrap
            document.querySelectorAll('[data-bs-toggle="modal"]').forEach(button => {
                button.addEventListener('click', function() {
                    const modalId = this.getAttribute('data-bs-target');
                    lucenUI.showModal(modalId);
                });
            });

            // Manejar los botones de cierre de Bootstrap
            document.querySelectorAll('[data-bs-dismiss="modal"]').forEach(button => {
                button.addEventListener('click', function() {
                    const modal = this.closest('.lucen-modal');
                    if (modal) {
                        lucenUI.hideModal(`#${modal.id}`);
                    }
                });
            });
        },

        /**
         * Muestra un modal
         * @param {string} modalId - ID del modal a mostrar (incluyendo el #)
         */
        showModal: function(modalId) {
            const modal = document.querySelector(modalId);
            if (modal) {
                // Cerrar cualquier modal abierto primero
                document.querySelectorAll('.lucen-modal.show').forEach(m => {
                    m.classList.remove('show');
                });
                
                modal.classList.add('show');
                modal.style.display = 'flex';
                document.body.style.overflow = 'hidden';
                modal.removeAttribute('aria-hidden');
                
                // Enfocar el primer elemento interactivo
                setTimeout(() => {
                    const focusable = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
                    if (focusable) {
                        focusable.focus();
                    }
                }, 100);
            }
        },

        /**
         * Oculta un modal
         * @param {string} modalId - ID del modal a ocultar (incluyendo el #)
         */
        hideModal: function(modalId) {
            const modal = document.querySelector(modalId);
            if (modal) {
                modal.classList.remove('show');
                document.body.style.overflow = '';
                modal.style.display = 'none';
                modal.setAttribute('aria-hidden', 'true');
                
                // Opcional: Reenfocar el botón que abrió el modal
                const opener = document.querySelector(`[data-bs-target="${modalId}"], [onclick*="${modalId}"]`);
                if (opener) {
                    opener.focus();
                }
            }
        },
        
        /**
         * Muestra un toast notification
         * @param {string} message - Mensaje a mostrar
         * @param {string} type - Tipo de toast (success, error, etc.)
         */
        showToast: function(message, type = '') {
            // Eliminar toast anterior si existe
            const existingToast = document.querySelector('.lucen-toast');
            if (existingToast) {
                existingToast.remove();
            }
            
            // Crear nuevo toast
            const toast = document.createElement('div');
            toast.className = 'lucen-toast';
            // Añadir clase según el tipo
        if (type === 'success') {
          toast.classList.add('lucen-toast-success');
          toast.innerHTML = `<i class="bi bi-check-circle"></i><span>${message}</span>`;
      } else if (type === 'error') {
          toast.classList.add('lucen-toast-error');
          toast.innerHTML = `<i class="bi bi-x-circle"></i><span>${message}</span>`;
      } else {
          toast.innerHTML = `<i class="bi bi-info-circle"></i><span>${message}</span>`;
      }
      
      document.body.appendChild(toast);
      
      // Mostrar toast
      setTimeout(() => {
          toast.classList.add('show');
      }, 10);
      
      // Ocultar toast después de 5 segundos
      clearTimeout(toastTimeout);
      toastTimeout = setTimeout(() => {
          toast.classList.remove('show');
          setTimeout(() => {
              toast.remove();
          }, 300);
      }, 5000);
        },
        
        /**
         * Inicializa las flechas de los dropdowns
         */
        initDropdownArrows: function() {
            document.querySelectorAll('.dropdown-toggle').forEach(toggle => {
                toggle.addEventListener('click', function() {
                    const arrow = this.querySelector('.lucen-nav-arrow');
                    if (arrow) {
                        arrow.classList.toggle('rotate');
                    }
                });
            });
        },

        /**
         * Inicializa las CommandBars con funcionalidad adicional
         */
        initCommandBars: function() {
            // Agregar efecto de hover/active mejorado para touch
            document.querySelectorAll('.commandbar-horizontal .lucen-btn, .commandbar-vertical .lucen-btn').forEach(btn => {
                btn.addEventListener('touchstart', function() {
                    this.classList.add('active');
                });
                
                btn.addEventListener('touchend', function() {
                    this.classList.remove('active');
                });
            });
            
            // Inicializar tooltips para commandbars compactas
            document.querySelectorAll('.commandbar-compact .lucen-btn').forEach(btn => {
                if (!btn.hasAttribute('data-lucen-tooltip')) {
                    const span = btn.querySelector('span');
                    if (span) {
                        btn.setAttribute('data-lucen-tooltip', span.textContent);
                    }
                }
            });
            
        },

        /**
         * Inicializa la paginación para tablas
         */
        initTablePagination: function() {
            document.querySelectorAll('[data-lucen-pagination]').forEach(tableWrapper => {
                const tableId = tableWrapper.getAttribute('data-lucen-pagination');
                const table = document.getElementById(tableId);
                
                if (table) {
                    const config = {
                        rowsPerPage: parseInt(tableWrapper.getAttribute('data-rows-per-page')) || 5,
                        maxVisiblePages: parseInt(tableWrapper.getAttribute('data-max-pages')) || 5,
                        showInfo: tableWrapper.getAttribute('data-show-info') !== 'false',
                        showPrevNext: tableWrapper.getAttribute('data-show-prev-next') !== 'false',
                        numeric: tableWrapper.getAttribute('data-numeric') === 'true'
                    };
                    
                    this.createPagination(table, config);
                }
            });
        },

        /**
         * Crea la paginación para una tabla específica
         * @param {HTMLElement} table - Elemento de la tabla
         * @param {Object} config - Configuración de paginación
         */
        createPagination: function(table, config) {
            const tableBody = table.querySelector('tbody');
            const allRows = Array.from(tableBody.querySelectorAll('tr'));
            const totalPages = Math.ceil(allRows.length / config.rowsPerPage);
            
            // Crear contenedor de paginación si no existe
            let paginationContainer = table.parentNode.querySelector('.lucen-pagination');
            if (!paginationContainer) {
                paginationContainer = document.createElement('div');
                paginationContainer.className = 'lucen-pagination';
                table.parentNode.appendChild(paginationContainer);
            }
            
            // Estado de la paginación
            let currentPage = 1;
            
            // Función para mostrar las filas de la página actual
            const displayPage = (page) => {
                const start = (page - 1) * config.rowsPerPage;
                const end = start + config.rowsPerPage;
                
                // Ocultar todas las filas
                allRows.forEach(row => row.style.display = 'none');
                
                // Mostrar solo las filas de la página actual
                const visibleRows = allRows.slice(start, end);
                visibleRows.forEach(row => row.style.display = '');
                
                currentPage = page;
                updatePaginationUI();
            };
            
            // Función para actualizar la UI de paginación
            const updatePaginationUI = () => {
                paginationContainer.innerHTML = '';
                
                // Botón Anterior
                if (config.showPrevNext) {
                    const prevBtn = document.createElement('button');
                    prevBtn.className = 'lucen-btn lucen-btn-icon';
                    prevBtn.innerHTML = '<i class="bi bi-chevron-left"></i>';
                    prevBtn.disabled = currentPage === 1;
                    prevBtn.addEventListener('click', () => {
                        if (currentPage > 1) displayPage(currentPage - 1);
                    });
                    paginationContainer.appendChild(prevBtn);
                }
                
                // Información de página
                if (config.showInfo && !config.numeric) {
                    const pageInfo = document.createElement('span');
                    pageInfo.className = 'lucen-pagination-info';
                    pageInfo.textContent = `Página ${currentPage} de ${totalPages}`;
                    paginationContainer.appendChild(pageInfo);
                }
                
                // Paginación numérica
                if (config.numeric) {
                    const pageNumbers = document.createElement('div');
                    pageNumbers.className = 'page-numbers';
                    
                    const maxPagesBeforeCurrent = Math.floor(config.maxVisiblePages / 2);
                    const maxPagesAfterCurrent = Math.ceil(config.maxVisiblePages / 2) - 1;
                    
                    let startPage = 1;
                    let endPage = totalPages;
                    
                    if (totalPages > config.maxVisiblePages) {
                        if (currentPage <= maxPagesBeforeCurrent) {
                            endPage = config.maxVisiblePages;
                        } else if (currentPage + maxPagesAfterCurrent >= totalPages) {
                            startPage = totalPages - config.maxVisiblePages + 1;
                        } else {
                            startPage = currentPage - maxPagesBeforeCurrent;
                            endPage = currentPage + maxPagesAfterCurrent;
                        }
                    }
                    
                    // Primer botón y puntos suspensivos
                    if (startPage > 1) {
                        const firstBtn = this.createPageButton(1, currentPage, displayPage);
                        pageNumbers.appendChild(firstBtn);
                        
                        if (startPage > 2) {
                            const dots = document.createElement('span');
                            dots.textContent = '...';
                            dots.style.padding = '0 8px';
                            pageNumbers.appendChild(dots);
                        }
                    }
                    
                    // Botones de página
                    for (let i = startPage; i <= endPage; i++) {
                        const pageBtn = this.createPageButton(i, currentPage, displayPage);
                        pageNumbers.appendChild(pageBtn);
                    }
                    
                    // Último botón y puntos suspensivos
                    if (endPage < totalPages) {
                        if (endPage < totalPages - 1) {
                            const dots = document.createElement('span');
                            dots.textContent = '...';
                            dots.style.padding = '0 8px';
                            pageNumbers.appendChild(dots);
                        }
                        
                        const lastBtn = this.createPageButton(totalPages, currentPage, displayPage);
                        pageNumbers.appendChild(lastBtn);
                    }
                    
                    paginationContainer.appendChild(pageNumbers);
                }
                
                // Botón Siguiente
                if (config.showPrevNext) {
                    const nextBtn = document.createElement('button');
                    nextBtn.className = 'lucen-btn lucen-btn-icon';
                    nextBtn.innerHTML = '<i class="bi bi-chevron-right"></i>';
                    nextBtn.disabled = currentPage === totalPages;
                    nextBtn.addEventListener('click', () => {
                        if (currentPage < totalPages) displayPage(currentPage + 1);
                    });
                    paginationContainer.appendChild(nextBtn);
                }
            };
            
            // Mostrar la primera página inicialmente
            displayPage(1);
        },

        /**
         * Crea un botón de página para la paginación numérica
         * @param {number} pageNum - Número de página
         * @param {number} currentPage - Página actual
         * @param {function} onClick - Función para manejar el clic
         * @returns {HTMLElement} - Elemento del botón
         */
        createPageButton: function(pageNum, currentPage, onClick) {
            const pageBtn = document.createElement('button');
            pageBtn.className = `page-btn ${pageNum === currentPage ? 'active' : ''}`;
            pageBtn.textContent = pageNum;
            pageBtn.addEventListener('click', () => onClick(pageNum));
            return pageBtn;
        },

        //Light and Dark mode functions:
        setupEventListeners: function () {
            //botones de tema dark/light
            const themeBtn = document.getElementById('theme-toggle-btn');

            if (themeBtn) {
                themeBtn.addEventListener('click', () => {
                const currentTheme = document.documentElement.getAttribute('data-theme');
                const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
                this.setTheme(newTheme);
                this.updateThemeButton(newTheme);
            });
                // Inicializar estado del botón
                const savedTheme = localStorage.getItem('lucen-theme') || 
                                (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
                this.updateThemeButton(savedTheme);
            };
            
            //switchde tema dark/light
            const themeToggle = document.getElementById('theme-toggle');
            // Sincronizar el estilo inicial y Escuchar cambios en el switch
            if (themeToggle) {
                themeToggle.addEventListener('change', (e) => {
                this.setTheme(e.target.checked ? 'dark' : 'light');
                });
                
                // Sincronizar estado inicial
                const savedTheme = localStorage.getItem('lucen-theme');
                const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                themeToggle.checked = savedTheme === 'dark' || (!savedTheme && systemDark);
            };

            //Ver el tamaño de pantalla para contraer sidebars y widget
            this.handleResponsive();
            window.addEventListener('resize', () => this.handleResponsive());

        },

        // Nuevo método para actualizar el botón
        updateThemeButton: function(theme) {
            const btn = document.getElementById('theme-toggle-btn');
            if (!btn) return;
            
            const icon = btn.querySelector('.theme-icon');
            const text = btn.querySelector('.theme-text');
            
            if (theme === 'dark') {
                icon.classList.replace('bi-moon-fill', 'bi-sun-fill');
                text.textContent = 'Modo día';
            } else {
                icon.classList.replace('bi-sun-fill', 'bi-moon-fill');
                text.textContent = 'Modo noche';
            }
        },

        //Funcion de estilos responsive, se ejecuta con el evento resize
        handleResponsive: function() {
            const container = document.querySelector('.lucen-main');

            const toggleClass = (el, className, condition) => {
                if (el) el.classList.toggle(className, condition);
            };

            const isMobile = window.innerWidth <= 992;
            const isSmallMobile = window.innerWidth <= 768;

            toggleClass(document.getElementById('widgetbar'), 'collapsed', isMobile);
            toggleClass(container, 'widgetbar-collapsed', isMobile);

            toggleClass(document.getElementById('sidebar'), 'collapsed', isSmallMobile);
            toggleClass(container, 'sidebar-collapsed', isSmallMobile);
        },

        applySavedTheme: function () {
            const savedTheme = localStorage.getItem('lucen-theme');
            const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

            // Determinar el tema inicial (prioridad: localStorage > preferencias sistema > light)
            let initialTheme = 'light';
            
            if (savedTheme) {
                initialTheme = savedTheme;
            } else if (systemDark) {
                initialTheme = 'dark';
            }
            // Aplicar el tema
            this.setTheme(initialTheme, !savedTheme);
        },
        
        watchSystemPreference: function () {
            window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', e => {
                if (!localStorage.getItem('lucen-theme')) {
                this.setTheme(e.matches ? 'dark' : 'light');
                }
            });
        },
        
        setTheme: function(theme, isSystem = false) {
            document.documentElement.setAttribute('data-theme', theme);
            if (!isSystem) {
                localStorage.setItem('lucen-theme', theme);
            }
            this.updateActiveButton(theme);
        },
        
        useSystemPreference: function() {
            localStorage.removeItem('lucen-theme');
            const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            this.setTheme(systemDark ? 'dark' : 'light', true);
        },
        
        updateActiveButton: function(theme) {
            document.querySelectorAll('.theme-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            
            const activeBtn = document.querySelector(`.theme-btn[data-theme="${theme}"]`);
            if (activeBtn) {
                activeBtn.classList.add('active');
            }
        },

        /**
        * Inicializa los sliders hero
        */
        initSliders: function() {
            document.querySelectorAll('.lucen-hero-slider').forEach(slider => {
                this.setupSlider(slider);
            });
        },

        /**
         * Configura un slider con las opciones proporcionadas
         * @param {HTMLElement} slider - Elemento del slider
         */
        setupSlider: function(slider) {
            const slides = slider.querySelectorAll('.lucen-hero-slide');
            const dots = slider.querySelectorAll('.dot');
            const prevBtn = slider.querySelector('.slider-prev');
            const nextBtn = slider.querySelector('.slider-next');
            
            // Obtener configuración del data attributes o usar valores por defecto
            const config = {
                autoplay: slider.dataset.autoplay !== 'false',
                interval: parseInt(slider.dataset.interval) || 5000,
                transitionSpeed: parseInt(slider.dataset.transitionSpeed) || 300,
                loop: slider.dataset.loop !== 'false'
            };
            
            let currentSlide = 0;
            const totalSlides = slides.length;
            let autoplayInterval;
            
            // Función para mostrar una diapositiva específica
            const showSlide = (index) => {
                // Validar índice según configuración de loop
                if (!config.loop) {
                    if (index >= totalSlides) index = totalSlides - 1;
                    if (index < 0) index = 0;
                } else {
                    index = (index + totalSlides) % totalSlides;
                }
                
                // Ocultar todas las diapositivas
                slides.forEach(slide => {
                    slide.style.transition = `opacity ${config.transitionSpeed}ms ease`;
                    slide.classList.remove('active');
                });
                dots.forEach(dot => dot.classList.remove('active'));
                
                // Mostrar la diapositiva actual
                slides[index].classList.add('active');
                dots[index]?.classList.add('active');
                currentSlide = index;
                
                // Actualizar estado de los botones si no hay loop
                if (!config.loop) {
                    if (prevBtn) prevBtn.disabled = currentSlide === 0;
                    if (nextBtn) nextBtn.disabled = currentSlide === totalSlides - 1;
                }
            };
            
            // Función para avanzar al siguiente slide
            const nextSlide = () => {
                showSlide(currentSlide + 1);
            };
            
            // Función para retroceder al slide anterior
            const prevSlide = () => {
                showSlide(currentSlide - 1);
            };
            
            // Función para iniciar autoplay
            const startAutoplay = () => {
                if (config.autoplay && totalSlides > 1) {
                    stopAutoplay();
                    autoplayInterval = setInterval(nextSlide, config.interval);
                }
            };
            
            // Función para detener autoplay
            const stopAutoplay = () => {
                if (autoplayInterval) {
                    clearInterval(autoplayInterval);
                }
            };
            
            // Event listeners
            if (nextBtn) {
                nextBtn.addEventListener('click', () => {
                    nextSlide();
                    if (config.autoplay) startAutoplay(); // Reiniciar autoplay después de interacción manual
                });
            }
            
            if (prevBtn) {
                prevBtn.addEventListener('click', () => {
                    prevSlide();
                    if (config.autoplay) startAutoplay(); // Reiniciar autoplay después de interacción manual
                });
            }
            
            // Navegación por dots
            dots.forEach((dot, index) => {
                dot.addEventListener('click', () => {
                    showSlide(index);
                    if (config.autoplay) startAutoplay(); // Reiniciar autoplay después de interacción manual
                });
            });
            
            // Pausar autoplay al interactuar con el slider
            slider.addEventListener('mouseenter', stopAutoplay);
            slider.addEventListener('mouseleave', startAutoplay);
            
            // Pausar autoplay cuando la ventana no está visible
            document.addEventListener('visibilitychange', () => {
                if (document.hidden) {
                    stopAutoplay();
                } else {
                    startAutoplay();
                }
            });
            
            // Mostrar el primer slide e iniciar autoplay
            showSlide(0);
            startAutoplay();
        },

        /**
         * Configura un slider con opciones personalizadas
         * @param {string} selector - Selector del slider
         * @param {Object} options - Opciones de configuración
         */
        configSlider: function(selector, options) {
            const slider = document.querySelector(selector);
            if (!slider) {
                console.warn(`Slider no encontrado: ${selector}`);
                return;
            }
            
            // Aplicar opciones como data attributes
            if (options.autoplay !== undefined) {
                slider.dataset.autoplay = options.autoplay;
            }
            if (options.interval) {
                slider.dataset.interval = options.interval;
            }
            if (options.transitionSpeed) {
                slider.dataset.transitionSpeed = options.transitionSpeed;
            }
            if (options.loop !== undefined) {
                slider.dataset.loop = options.loop;
            }
            
            // Reconfigurar el slider
            this.setupSlider(slider);
        }

};
})();

/**
* Reemplaza el codigo escrito
*/
function styeCode() {
    document.querySelectorAll('.lucen-code-block code').forEach(block => {
        // Obtener el código del atributo data-code
        const rawCode = block.getAttribute('data-code');
        // Limpiar y formatear el código (eliminar espacios iniciales comunes)
        const formattedCode = formatCode(rawCode);
        // Aplicar el resaltado de sintaxis
        const highlightedCode = hljs.highlightAuto(formattedCode).value
        // Insertar el código resaltado
        block.innerHTML = highlightedCode;
        
    });
}

/**
* Formatea el código eliminando espacios iniciales comunes
*/
 function formatCode(code) {
    if (!code) return '';
    
    // Dividir en líneas
    const lines = code.split('\n');
    
    // Encontrar el mínimo espacio inicial (ignorando líneas vacías)
    let minSpaces = Infinity;
    lines.forEach(line => {
        if (line.trim().length === 0) return;
        const leadingSpaces = line.match(/^\s*/)[0].length;
        if (leadingSpaces < minSpaces) minSpaces = leadingSpaces;
    });
    
    // Recortar espacios iniciales comunes
    return lines.map(line => line.slice(minSpaces)).join('\n');
}


// Inicializar lucen UI cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {

    lucenUI.init();
     
    // Add click effect for touch checkboxes
    document.querySelectorAll('.lucen-checkbox-touch input').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            if(this.checked) {
                this.parentNode.classList.add('checked');
            } else {
                this.parentNode.classList.remove('checked');
            }
        });
    });
            
});

// Hacer accesible lucenUI desde el objeto window
window.lucenUI = lucenUI;


