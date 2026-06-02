// ============================================================
// app.ts — Ferretería El Constructor
// TypeScript que genera TODO el contenido HTML dinámicamente.
// ============================================================
import ferreteriaUrl          from './assets/ferreteria.jpg'
import ferreteriaPordentroUrl from './assets/ferreteriapordentro.png'
import { getTasks, createTask, updateTask, deleteTask } from './services/api'
import type { Task } from './services/api'

(function (): void {
    "use strict";

    // ============================================================
    // INTERFACES
    // ============================================================

    interface NavItem {
        label: string;
        href: string;
        target: "_self" | "_blank" | "_parent" | "_top";
    }

    interface FilaProducto {
        prod: string;
        marca: string;
        precio: string;
        stock: number;
    }

    interface InventarioCategoria {
        nombre: string;
        rowspan: number;
        filas: Array<{ prod: string; stock: number; precio: string }>;
    }

    interface GlosarioEntry {
        termino: string;
        definicion: string;
    }

    interface DivCard {
        titulo: string;
        desc: string;
    }

    interface TargetItem {
        code: string;
        desc: string;
        href: string;
        target: string;
        label: string;
    }

    // ============================================================
    // HELPERS
    // ============================================================

    /** Crea un elemento HTML con atributos y texto opcionales */
    function el<K extends keyof HTMLElementTagNameMap>(
        tag: K,
        attrs: Record<string, string> = {},
        text?: string
    ): HTMLElementTagNameMap[K] {
        const elem = document.createElement(tag);
        for (const [key, val] of Object.entries(attrs)) {
            elem.setAttribute(key, val);
        }
        if (text !== undefined) elem.textContent = text;
        return elem;
    }

    /** Agrega múltiples hijos a un padre */
    function ap(parent: HTMLElement, ...children: HTMLElement[]): HTMLElement {
        children.forEach((c) => parent.appendChild(c));
        return parent;
    }

    function crearHR(clase?: string): HTMLHRElement {
        const hr = document.createElement("hr");
        if (clase) hr.className = clase;
        return hr;
    }

    function crearBR(): HTMLBRElement {
        return document.createElement("br");
    }

    // ============================================================
    // CSS — inyectado desde TypeScript
    // ============================================================

    function inyectarCSS(): void {
        const s = document.createElement("style");
        s.textContent = `
            body { background-color:#f0ebe4; font-family:'Segoe UI',Georgia,sans-serif; margin:0; padding:0; color:#2c2c2c; }
            header { background-color:#1c1c1c; color:#f0ebe4; padding:36px 20px 28px; text-align:center; border-bottom:5px solid #9b3a10; }
            header h1 { font-size:2.4em; margin:0 0 6px; letter-spacing:4px; text-transform:uppercase; font-weight:700; }
            header p { font-size:1em; margin:0; color:#b0a090; letter-spacing:1px; }
            hr { border:none; border-top:2px solid #c8b8a8; width:90%; margin:20px auto; }
            .hr-footer { border-top-color:#3a3a3a; width:65%; }
            nav { background-color:#2b2b2b; text-align:center; }
            nav ul { list-style:none; margin:0; padding:0; display:inline-flex; flex-wrap:wrap; justify-content:center; }
            nav ul li { display:inline; }
            nav ul li a { display:inline-block; color:#d4c9be; text-decoration:none; font-weight:600; font-size:0.82em; letter-spacing:1px; text-transform:uppercase; padding:14px 16px; transition:background .2s,color .2s; }
            nav ul li a:hover { background-color:#9b3a10; color:#f0ebe4; }
            section, article, aside { max-width:900px; margin:28px auto; padding:30px 38px; background:#fff; border-radius:4px; box-shadow:0 2px 10px rgba(0,0,0,.09); text-align:left; }
            section h2, article h2, aside h2 { color:#1c1c1c; border-bottom:3px solid #9b3a10; padding-bottom:8px; margin-top:0; font-size:1.35em; letter-spacing:1px; text-transform:uppercase; }
            h3 { color:#6b2a08; font-size:1em; margin:22px 0 8px; padding-left:8px; border-left:3px solid #c8850a; }
            p { line-height:1.75; color:#3a3530; }
            blockquote { background:#faf6f1; border-left:5px solid #9b3a10; margin:18px 0; padding:13px 20px; font-style:italic; color:#5a4a40; border-radius:0 4px 4px 0; }
            .img-float { float:left; width:255px; max-width:40%; height:auto; margin:4px 26px 16px 0; border-radius:3px; box-shadow:0 4px 16px rgba(0,0,0,.22); border:3px solid #9b3a10; }
            .img-seccion { display:block; width:100%; max-width:440px; height:auto; margin:14px auto; border-radius:4px; box-shadow:0 3px 12px rgba(0,0,0,.18); border-top:4px solid #9b3a10; }
            .clearfix::after { content:""; display:table; clear:both; }
            ul, ol { padding-left:24px; line-height:1.95; margin:8px 0; color:#3a3530; }
            ul li::marker { color:#9b3a10; }
            ol li::marker { color:#9b3a10; font-weight:bold; }
            ul ul, ul ol { margin-top:2px; margin-bottom:2px; border-left:2px solid #d4c0b0; padding-left:16px; }
            ul ul li::marker { color:#c8850a; }
            dl { margin:14px 0; }
            dt { font-weight:700; color:#1c1c1c; font-size:1em; margin-top:16px; padding:5px 0 5px 12px; border-left:4px solid #9b3a10; background:#faf6f1; }
            dd { margin-left:20px; color:#5a4a40; line-height:1.7; padding:4px 0; }
            aside { background:#faf8f5; border-left:5px solid #c8850a; }
            aside h2 { color:#7a4a00; border-bottom-color:#c8850a; }
            footer { background-color:#1c1c1c; color:#908070; text-align:center; padding:26px 20px; margin-top:32px; }
            footer p { margin:5px 0; font-size:.9em; }
            footer a { color:#c8850a; text-decoration:none; margin:0 8px; }
            footer a:hover { color:#f0ebe4; }
            a { color:#7a2e08; }
            a:hover { color:#c8850a; }
            .texto-mediano { font-size:1.15em; }
            .texto-pequeno { font-size:.93em; }
            .galeria-thumbs { display:flex; gap:30px; flex-wrap:wrap; align-items:flex-start; margin:14px 0; padding:20px 0 60px 0; overflow:visible; }
            .figura { display:inline-block; text-align:center; }
            .thumbnail { width:130px; height:auto; border:3px solid #9b3a10; border-radius:3px; cursor:zoom-in; display:block; transition:transform .3s ease,box-shadow .3s ease; }
            .thumbnail:hover { transform:scale(2.6); box-shadow:0 14px 42px rgba(0,0,0,.5); position:relative; z-index:300; }
            .figura figcaption { font-size:.8em; color:#6b5a50; margin-top:6px; }
            .img-link { display:inline-block; border:3px solid transparent; border-radius:3px; transition:border-color .2s; }
            .img-link:hover { border-color:#9b3a10; }
            .img-link img { display:block; transition:opacity .2s; }
            .img-link:hover img { opacity:.82; }
            .target-grid { display:flex; gap:12px; flex-wrap:wrap; margin:14px 0; }
            .target-item { flex:1; min-width:170px; padding:14px 16px; background:#faf6f1; border:1px solid #d4c0b0; border-top:3px solid #9b3a10; border-radius:0 0 4px 4px; }
            .target-item code { display:block; font-size:.95em; font-weight:bold; color:#9b3a10; margin-bottom:5px; font-family:'Courier New',monospace; }
            .target-item p { margin:0 0 8px; font-size:.86em; }
            .target-item a { font-size:.88em; font-weight:600; }
            table { border-collapse:collapse; width:100%; margin:14px 0; font-size:.93em; }
            th { background-color:#2b2b2b; color:#f0ebe4; padding:11px 14px; font-size:.88em; letter-spacing:.5px; }
            td { padding:9px 14px; border-bottom:1px solid #e0d8cf; color:#3a3530; vertical-align:middle; }
            tr:nth-child(even) td { background-color:#faf6f1; }
            tr:hover td { background-color:#f5efe8; }
            .tabla-controles { display:flex; gap:16px; align-items:center; margin-bottom:16px; flex-wrap:wrap; padding:16px 18px; background:#faf6f1; border-radius:4px; border:1px solid #d4c0b0; }
            .tabla-controles label { font-weight:600; color:#1c1c1c; font-size:.93em; }
            .tabla-controles input[type=number] { width:62px; padding:6px 8px; border:2px solid #c8b8a8; border-radius:3px; font-size:.95em; margin-left:6px; }
            .tabla-controles button { padding:8px 22px; background:#9b3a10; color:#fff; border:none; border-radius:3px; cursor:pointer; font-weight:bold; font-size:.92em; transition:background .2s; }
            .tabla-controles button:hover { background:#7a2e08; }
            #resultado-tabla table { border:2px solid #9b3a10; }
            #resultado-tabla th { background:#9b3a10; }
            #resultado-tabla td { border:1px solid #d4c0b0; text-align:center; }
            .div-contenedor { display:flex; gap:14px; margin:14px 0; flex-wrap:wrap; }
            .div-caja { flex:1; min-width:130px; padding:18px 14px; background:#faf6f1; border:1px solid #d4c0b0; border-top:4px solid #9b3a10; border-radius:0 0 4px 4px; text-align:center; }
            .div-caja h4 { color:#9b3a10; margin:0 0 6px; font-size:.9em; text-transform:uppercase; letter-spacing:1px; }
            .div-caja p { margin:0; font-size:.86em; color:#5a4a40; }
            .iframe-wrapper { border:2px solid #c8b8a8; border-radius:4px; overflow:hidden; }
            .iframe-banner { width:100%; height:80px; border:none; display:block; }
            .iframe-main { display:flex; height:420px; }
            .iframe-sidebar { width:190px; min-width:190px; height:100%; border:none; border-right:2px solid #c8b8a8; }
            .iframe-content { flex:1; height:100%; border:none; }
            .tareas-search{width:100%;padding:.55rem 1rem;margin-bottom:1rem;border:1px solid #d4c0b0;border-radius:3px;outline:none;background:#faf6f1;color:#2c2c2c;font-size:.93em;box-sizing:border-box;}
            .tareas-search:focus{border-color:#9b3a10;}
            .tareas-stats{display:flex;gap:1.5rem;margin-bottom:.5rem;font-size:.9em;}
            .tareas-form{display:flex;flex-wrap:wrap;gap:.5rem;margin-bottom:1rem;}
            .tareas-form input{flex:1;min-width:150px;padding:.5rem;border-radius:3px;border:1px solid #d4c0b0;background:#faf6f1;color:#2c2c2c;font-size:.93em;}
            .tareas-form input:focus{outline:none;border-color:#9b3a10;}
            .tareas-edit-form{background:#faf6f1;padding:1rem;border-radius:4px;margin-bottom:1rem;border-left:4px solid #c8850a;}
            .tareas-edit-form input[type="text"]{display:block;width:100%;margin-bottom:.5rem;padding:.5rem;border-radius:3px;border:1px solid #d4c0b0;background:#fff;color:#2c2c2c;font-size:.93em;box-sizing:border-box;}
            .tareas-edit-form input[type="text"]:focus{outline:none;border-color:#9b3a10;}
            .tareas-checkbox-label{display:flex;align-items:center;gap:.5rem;margin:.5rem 0;font-size:.93em;color:#3a3530;}
            .tareas-form-buttons{display:flex;gap:.5rem;margin-top:.5rem;}
            .tareas-list{display:flex;flex-direction:column;gap:.8rem;}
            .tarea-card{display:flex;justify-content:space-between;align-items:center;padding:.8rem 1rem;background:#faf6f1;border:1px solid #d4c0b0;border-top:3px solid #9b3a10;border-radius:0 0 4px 4px;}
            .tarea-card.completada{opacity:.55;border-top-color:#c8850a;}
            .tarea-card.completada .tarea-titulo{text-decoration:line-through;color:#5a4a40;}
            .tarea-titulo{margin-bottom:.25rem;color:#6b2a08;font-weight:700;font-size:.95em;}
            .tarea-desc{font-size:.88em;color:#5a4a40;margin:0;}
            .tarea-botones{display:flex;gap:.4rem;flex-shrink:0;}
            .btn-tarea-editar{padding:6px 14px;background:#c8850a;color:#1c1c1c;border:none;border-radius:3px;cursor:pointer;font-weight:600;font-size:.85em;letter-spacing:.3px;}
            .btn-tarea-editar:hover{background:#a06b00;}
            .btn-tarea-eliminar{padding:6px 14px;background:#8b2500;color:#f0ebe4;border:none;border-radius:3px;cursor:pointer;font-weight:600;font-size:.85em;letter-spacing:.3px;}
            .btn-tarea-eliminar:hover{background:#6b1a00;}
            .btn-tarea-guardar{padding:6px 18px;background:#9b3a10;color:#f0ebe4;border:none;border-radius:3px;cursor:pointer;font-weight:600;font-size:.85em;letter-spacing:.3px;}
            .btn-tarea-guardar:hover{background:#7a2e08;}
            .btn-tarea-cancelar{padding:6px 14px;background:#5a4a40;color:#f0ebe4;border:none;border-radius:3px;cursor:pointer;font-weight:600;font-size:.85em;letter-spacing:.3px;}
            .btn-tarea-cancelar:hover{background:#3a3530;}
        `;
        document.head.appendChild(s);
    }

    // ============================================================
    // BUILDERS
    // ============================================================

    function construirHeader(): HTMLElement {
        const header = document.createElement("header");
        return ap(
            header,
            el("h1", {}, "FERRETERÍA EL CONSTRUCTOR"),
            el("p", {}, "Herramientas y materiales para construcción")
        );
    }

    function construirNav(): HTMLElement {
        const nav = document.createElement("nav");
        const ul = document.createElement("ul");

        const items: NavItem[] = [
            { label: "Inicio",      href: "#inicio",       target: "_self" },
            { label: "Productos",   href: "#productos",    target: "_self" },
            { label: "Galería",     href: "#galeria",      target: "_self" },
            { label: "TARGET",      href: "#target-demo",  target: "_self" },
            { label: "Tablas",      href: "#tablas",       target: "_self" },
            { label: "DIV",         href: "#div-demo",     target: "_self" },
            { label: "Glosario",    href: "#glosario",     target: "_self" },
            { label: "Promociones", href: "#promociones",  target: "_self" },
            { label: "IFRAME",      href: "#iframe-demo",  target: "_self" },
            { label: "Tareas",      href: "#tareas",       target: "_self" },
            { label: "Contacto",    href: "#contacto",     target: "_self" },
        ];

        items.forEach(({ label, href, target }) => {
            const li = document.createElement("li");
            li.appendChild(el("a", { href, target }, label));
            ul.appendChild(li);
        });

        nav.appendChild(ul);
        return nav;
    }

    // --- SECTION INICIO: img float (ferreteriapordentro.png) + texto ---
    function construirInicio(): HTMLElement {
        const section = el("section", { id: "inicio", class: "clearfix" });

        const img = el("img", {
            src:   ferreteriaPordentroUrl,
            alt:   "Interior de la ferretería El Constructor — pasillos y estantes con herramientas",
            class: "img-float",
            width: "255",
        });

        const bq = el("blockquote", {}, '"Las mejores herramientas para tus proyectos de construcción y hogar."');

        return ap(
            section,
            el("h2", {}, "Inicio"),
            img,
            bq,
            el("p", { class: "texto-mediano" },
                "Bienvenido a nuestra ferretería. Somos tu aliado número uno en materiales " +
                "de construcción, herramientas eléctricas, herramientas manuales y pinturas."),
            el("p", { class: "texto-pequeno" },
                "Más de 20 años atendiendo a constructores, maestros de obra y clientes " +
                "particulares en toda la región. Calidad, variedad y el mejor precio del mercado."),
            crearBR()
        );
    }

    // --- ARTICLE PRODUCTOS: ferreteria.jpg + UL/OL/anidadas ---
    function construirProductos(): HTMLElement {
        const article = el("article", { id: "productos" });

        // Imagen ferreteria.jpg
        const img = el("img", {
            src:   ferreteriaUrl,
            alt:   "Fachada y exhibición de la ferretería El Constructor",
            class: "img-seccion",
            width: "440",
        });

        // UL / LI
        const ul = document.createElement("ul");
        ["Martillos", "Taladros eléctricos", "Destornilladores", "Llaves y alicates",
         "Sierras y seguetas", "Pinturas y barnices", "Cemento y materiales de obra"]
        .forEach((t) => ap(ul, el("li", {}, t)));

        // OL / LI
        const ol = document.createElement("ol");
        ["Visita nuestra tienda o catálogo", "Selecciona los productos que necesitas",
         "Consulta disponibilidad con un asesor", "Realiza tu pago en caja",
         "Recibe tus productos en el mostrador"]
        .forEach((t) => ap(ol, el("li", {}, t)));

        // ANIDAMIENTO de listas
        const ulNested = document.createElement("ul");

        const categorias = [
            { nombre: "Herramientas manuales",   subs: ["Martillos y mazos", "Destornilladores", "Llaves de tubo"] },
            { nombre: "Herramientas eléctricas",  subs: ["Amoladoras", "Sierras eléctricas"],
              subOL: ["Taladro de percusión", "Taladro inalámbrico", "Rotomartillo"] },
            { nombre: "Materiales",               subs: ["Cemento y concreto", "Arena y gravilla", "Varillas"] },
            { nombre: "Pinturas y acabados",      subs: ["Pinturas vinílicas", "Esmaltes y lacas", "Selladores"] },
        ];

        categorias.forEach(({ nombre, subs, subOL }) => {
            const li = el("li", {}, nombre);
            const subUl = document.createElement("ul");

            if (subOL) {
                const liTal = el("li", {}, "Taladros");
                const subOl = document.createElement("ol");
                subOL.forEach((t) => ap(subOl, el("li", {}, t)));
                liTal.appendChild(subOl);
                subUl.appendChild(liTal);
            }

            subs.forEach((s) => ap(subUl, el("li", {}, s)));
            li.appendChild(subUl);
            ulNested.appendChild(li);
        });

        return ap(
            article,
            el("h2", {}, "Productos"),
            img,
            el("h3", {}, "Herramientas disponibles (UL / LI)"),
            ul,
            crearBR(),
            el("h3", {}, "Pasos para comprar (OL / LI)"),
            ol,
            crearBR(),
            el("h3", { id: "categorias" }, "Categorías — Anidamiento de listas"),
            ulNested
        );
    }

    // --- SECTION GALERÍA: img+link, thumbnails, MAP ---
    function construirGaleria(): HTMLElement {
        const section = el("section", { id: "galeria" });
        ap(section, el("h2", {}, "Galería de imágenes"));

        // Imagen con hipervínculo
        ap(section, el("h3", {}, "Imagen con hipervínculo"));
        const link = el("a", { href: "#productos", class: "img-link", title: "Clic para ir a Productos" });
        link.appendChild(el("img", {
            src:   ferreteriaUrl,
            alt:   "Clic para ver los productos de la ferretería El Constructor",
            width: "200",
        }));
        ap(section, link, el("p", { class: "texto-pequeno" }, "Clic en la imagen → navega a la sección Productos."), crearBR());

        // Thumbnails (zoom al pasar cursor)
        ap(section, el("h3", {}, "Thumbnails — zoom al pasar el cursor"));
        const galDiv = el("div", { class: "galeria-thumbs" });
        [{ src: ferreteriaUrl,          alt: "Thumbnail: fachada de la ferretería",  cap: "Fachada"  },
         { src: ferreteriaPordentroUrl, alt: "Thumbnail: interior de la ferretería", cap: "Interior" }]
        .forEach(({ src, alt, cap }) => {
            const fig = el("figure", { class: "figura" });
            ap(fig, el("img", { src, alt, class: "thumbnail", width: "130" }), el("figcaption", {}, cap));
            galDiv.appendChild(fig);
        });
        section.appendChild(galDiv);

        // MAP — múltiples links en una imagen
        ap(section, el("h3", {}, "Imagen con múltiples links (MAP)"));
        ap(section, el("p", { class: "texto-pequeno" }, "Haz clic en una zona de la imagen para navegar:"));

        const imgMap = el("img", {
            src:    ferreteriaUrl,
            alt:    "Mapa de la ferretería — haz clic en una zona",
            usemap: "#mapa-ferreteria",
            width:  "420",
            style:  "display:block;border:3px solid #9b3a10;border-radius:3px;",
        });

        const map = el("map", { name: "mapa-ferreteria" });
        [{ coords: "0,0,140,300",   href: "#productos",   alt: "Zona izquierda: Productos",   title: "Ver Productos"   },
         { coords: "140,0,280,300", href: "#promociones", alt: "Zona central: Promociones",   title: "Ver Promociones" },
         { coords: "280,0,420,300", href: "#contacto",    alt: "Zona derecha: Contacto",      title: "Ver Contacto"    }]
        .forEach(({ coords, href, alt, title }) => {
            ap(map, el("area", { shape: "rect", coords, href, alt, title }));
        });

        ap(section, imgMap, map,
            el("p", { style: "font-size:.82em;color:#7a5a4a;margin-top:6px;" },
                "Zona izquierda → Productos | Zona central → Promociones | Zona derecha → Contacto"));

        return section;
    }

    // --- SECTION TARGET: _blank, _self, _parent, _top ---
    function construirTargetDemo(): HTMLElement {
        const section = el("section", { id: "target-demo" });
        ap(section,
            el("h2", {}, "Atributo TARGET en enlaces"),
            el("p", { class: "texto-pequeno" }, "El atributo target controla dónde se abre un enlace:")
        );

        const grid = el("div", { class: "target-grid" });

        const items: TargetItem[] = [
            { code: 'target="_self"',   desc: "Abre en la misma pestaña (comportamiento por defecto).", href: "#inicio",              target: "_self",   label: "Ir a Inicio (_self)"   },
            { code: 'target="_blank"',  desc: "Abre en una pestaña o ventana nueva del navegador.",     href: "https://www.google.com", target: "_blank", label: "Abrir Google (_blank)"  },
            { code: 'target="_parent"', desc: "Abre en el marco padre. Útil dentro de iframes.",        href: "#inicio",              target: "_parent", label: "Inicio (_parent)"       },
            { code: 'target="_top"',    desc: "Abre en la ventana raíz, saliendo de todos los marcos.", href: "#inicio",              target: "_top",    label: "Inicio (_top)"          },
        ];

        items.forEach(({ code, desc, href, target, label }) => {
            const div = el("div", { class: "target-item" });
            ap(div, el("code", {}, code), el("p", {}, desc), el("a", { href, target }, label));
            grid.appendChild(div);
        });

        section.appendChild(grid);
        return section;
    }

    // --- SECTION TABLAS: básica + combinada ROWSPAN/COLSPAN + dinámica ---
    function construirTablas(): HTMLElement {
        const section = el("section", { id: "tablas" });
        ap(section, el("h2", {}, "Tablas"));

        // === Tabla básica ===
        ap(section, el("h3", {}, "Tabla de precios (TABLE / TR / TH / TD / ALIGN)"));
        const t1 = document.createElement("table");

        const trH1 = document.createElement("tr");
        [{ t: "Producto", a: "left" }, { t: "Marca", a: "left" },
         { t: "Precio",   a: "center" }, { t: "Stock", a: "center" }]
        .forEach(({ t, a }) => ap(trH1, el("th", { align: a }, t)));
        t1.appendChild(trH1);

        const filas: FilaProducto[] = [
            { prod: "Martillo carpintero",  marca: "Stanley",        precio: "$25.000",  stock: 50  },
            { prod: "Taladro percutor",     marca: "Bosch",          precio: "$189.000", stock: 18  },
            { prod: "Set destornilladores", marca: "Black & Decker", precio: "$38.000",  stock: 75  },
            { prod: "Pintura vinílica 1 gl",marca: "Pintuco",        precio: "$52.000",  stock: 40  },
            { prod: "Cemento 50 kg",        marca: "Cemex",          precio: "$28.000",  stock: 100 },
        ];
        filas.forEach(({ prod, marca, precio, stock }) => {
            const tr = document.createElement("tr");
            ap(tr, el("td", { align: "left"  }, prod),
                   el("td", { align: "left"  }, marca),
                   el("td", { align: "right" }, precio),
                   el("td", { align: "center"}, String(stock)));
            t1.appendChild(tr);
        });
        ap(section, t1, crearBR());

        // === Tabla combinada: ROWSPAN + COLSPAN + ALIGN TOP/CENTER/LEFT/RIGHT ===
        ap(section, el("h3", {}, "Tabla combinada (ROWSPAN y COLSPAN)"));
        const t2 = document.createElement("table");

        // COLSPAN 4
        const trTit = document.createElement("tr");
        const thTit = el("th", { colspan: "4", align: "center" },
            "Inventario por categoría — Ferretería El Constructor");
        trTit.appendChild(thTit);
        t2.appendChild(trTit);

        // Sub-encabezados
        const trSub = document.createElement("tr");
        [{ t: "Categoría", a: "left" }, { t: "Producto", a: "left" },
         { t: "Stock",     a: "center" }, { t: "Precio", a: "right" }]
        .forEach(({ t, a }) => ap(trSub, el("th", { align: a }, t)));
        t2.appendChild(trSub);

        const inventario: InventarioCategoria[] = [
            { nombre: "Herramientas<br>Manuales", rowspan: 3,
              filas: [{ prod: "Martillo", stock: 50, precio: "$25.000" },
                      { prod: "Destornillador", stock: 75, precio: "$38.000" },
                      { prod: "Llave inglesa", stock: 30, precio: "$45.000" }] },
            { nombre: "Herramientas<br>Eléctricas", rowspan: 2,
              filas: [{ prod: "Taladro",  stock: 18, precio: "$189.000" },
                      { prod: "Amoladora", stock: 12, precio: "$220.000" }] },
        ];

        inventario.forEach(({ nombre, rowspan, filas: fls }) => {
            fls.forEach((fila, idx) => {
                const tr = document.createElement("tr");
                if (idx === 0) {
                    const tdCat = el("td", { rowspan: String(rowspan), align: "center", valign: "top" });
                    const strong = document.createElement("strong");
                    strong.innerHTML = nombre; // innerHTML para el <br>
                    tdCat.appendChild(strong);
                    tr.appendChild(tdCat);
                }
                ap(tr,
                    el("td", { align: "left"   }, fila.prod),
                    el("td", { align: "center" }, String(fila.stock)),
                    el("td", { align: "right"  }, fila.precio));
                t2.appendChild(tr);
            });
        });

        // Fila total: COLSPAN 2
        const trTot = document.createElement("tr");
        const tdLbl = el("td", { colspan: "2", align: "right" });
        tdLbl.appendChild(el("strong", {}, "Total en stock:"));
        const tdTot = el("td", { align: "center" });
        tdTot.appendChild(el("strong", {}, "185"));
        ap(trTot, tdLbl, tdTot, el("td", {}));
        t2.appendChild(trTot);

        ap(section, t2, crearBR());

        // === Tabla dinámica ===
        ap(section, el("h3", { id: "tabla-dinamica" }, "Tabla dinámica — JavaScript"));
        ap(section, el("p", { class: "texto-pequeno" }, "Indica filas y columnas y haz clic en Generar:"));

        const controles = el("div", { class: "tabla-controles" });

        const lblFilas = document.createElement("label");
        lblFilas.textContent = "Filas: ";
        const inputFilas = el("input", { type: "number", id: "filas", min: "1", max: "20", value: "3" });
        lblFilas.appendChild(inputFilas);

        const lblCols = document.createElement("label");
        lblCols.textContent = "Columnas: ";
        const inputCols = el("input", { type: "number", id: "columnas", min: "1", max: "10", value: "4" });
        lblCols.appendChild(inputCols);

        const btn = el("button", { type: "button" }, "Generar tabla");
        btn.addEventListener("click", generarTablaDinamica);

        ap(controles, lblFilas, lblCols, btn);
        ap(section, controles, el("div", { id: "resultado-tabla" }));

        return section;
    }

    // --- SECTION DIV ---
    function construirDivDemo(): HTMLElement {
        const section = el("section", { id: "div-demo" });
        ap(section,
            el("h2", {}, "Etiqueta DIV"),
            el("p", {}, "La etiqueta <div> agrupa contenido en bloque. " +
                "Sin semántica propia, se organiza con CSS para construir layouts.")
        );

        const contenedor = el("div", { class: "div-contenedor" });

        const cards: DivCard[] = [
            { titulo: "Herramientas", desc: "Más de 200 referencias manuales y eléctricas." },
            { titulo: "Materiales",   desc: "Cemento, arena, varillas y todo para tu obra." },
            { titulo: "Pinturas",     desc: "Catálogo completo de pinturas y selladores."   },
            { titulo: "Asesoría",     desc: "Expertos listos para guiarte en tu proyecto."  },
        ];

        cards.forEach(({ titulo, desc }) => {
            const caja = el("div", { class: "div-caja" });
            ap(caja, el("h4", {}, titulo), el("p", {}, desc));
            contenedor.appendChild(caja);
        });

        section.appendChild(contenedor);
        return section;
    }

    // --- SECTION GLOSARIO: DL / DT / DD ---
    function construirGlosario(): HTMLElement {
        const section = el("section", { id: "glosario" });
        ap(section, el("h2", {}, "Glosario de términos"),
                    el("p", {}, "Términos frecuentes en ferretería y construcción:"));

        const dl = document.createElement("dl");
        const entradas: GlosarioEntry[] = [
            { termino: "Taladro de percusión", definicion: "Combina rotación y golpes para perforar concreto y mampostería." },
            { termino: "Amoladora",            definicion: "Herramienta giratoria para cortar, desbastar y pulir metales." },
            { termino: "Mortero",              definicion: "Mezcla de cemento, arena y agua para pegar ladrillos y acabados." },
            { termino: "Esmalte",              definicion: "Pintura brillante y durable para superficies metálicas y de madera." },
            { termino: "Nivel de burbuja",     definicion: "Indica si una superficie está horizontal o vertical." },
            { termino: "Sellador",             definicion: "Se aplica antes de pintar para mejorar la adherencia y el acabado." },
        ];
        entradas.forEach(({ termino, definicion }) => {
            ap(dl, el("dt", {}, termino), el("dd", {}, definicion));
        });

        section.appendChild(dl);
        return section;
    }

    // --- ASIDE PROMOCIONES ---
    function construirPromociones(): HTMLElement {
        const aside = el("aside", { id: "promociones" });
        ap(aside, el("h2", {}, "Promociones del mes"),
                  el("p", { class: "texto-pequeno" }, "Aprovecha nuestras ofertas especiales:"));

        const ul = document.createElement("ul");
        ["20% de descuento en herramientas eléctricas",
         "2×1 en pinturas vinílicas",
         "Envío gratis en compras superiores a $150.000"]
        .forEach((t) => ap(ul, el("li", {}, t)));

        ap(aside, ul, el("blockquote", {}, '"Calidad garantizada al mejor precio. ¡No dejes pasar estas ofertas!"'));
        return aside;
    }

    // --- SECTION IFRAME: banner + sidebar + contenido central (srcdoc) ---
    function construirIframeDemo(): HTMLElement {
        const section = el("section", { id: "iframe-demo" });
        ap(section,
            el("h2", {}, "Layout con IFRAME"),
            el("p", { class: "texto-pequeno" },
                "Banner superior + barra lateral con imágenes y links + contenido central. " +
                "Generado con IFRAME y atributo srcdoc (sin archivos HTML externos):")
        );

        const bannerDoc =
            `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><style>
            body{margin:0;background:#1c1c1c;display:flex;align-items:center;
                 justify-content:center;height:80px;border-bottom:4px solid #9b3a10;}
            h1{color:#f0ebe4;font-size:1.3em;letter-spacing:3px;text-transform:uppercase;margin:0;}
            span{color:#9b3a10;}</style></head>
            <body><h1>Ferretería <span>El Constructor</span></h1></body></html>`;

        const sidebarDoc =
            `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><style>
            body{margin:0;background:#2b2b2b;font-family:Segoe UI,Arial,sans-serif;}
            h3{color:#908070;font-size:.7em;text-transform:uppercase;letter-spacing:2px;
               padding:12px 14px 8px;border-bottom:1px solid #3a3a3a;margin:0;}
            ul{list-style:none;padding:0;margin:0;}li{border-bottom:1px solid #3a3a3a;}
            a{display:flex;align-items:center;gap:10px;padding:10px 14px;color:#c8b8a8;
              text-decoration:none;font-size:.85em;font-weight:500;transition:background .2s;}
            a:hover{background:#9b3a10;color:#fff;}
            img{width:44px;height:36px;object-fit:cover;border-radius:2px;flex-shrink:0;}
            </style></head><body><h3>Navegación</h3><ul>
            <li><a href="#inicio"      target="_top"><img src="${ferreteriaUrl}"          alt="Inicio">      Inicio</a></li>
            <li><a href="#productos"   target="_top"><img src="${ferreteriaPordentroUrl}" alt="Productos">  Productos</a></li>
            <li><a href="#galeria"     target="_top"><img src="${ferreteriaUrl}"          alt="Galería">     Galería</a></li>
            <li><a href="#contacto"    target="_top"><img src="${ferreteriaPordentroUrl}" alt="Contacto">   Contacto</a></li>
            </ul></body></html>`;

        const contentDoc =
            `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><style>
            body{margin:0;padding:22px 28px;background:#f7f4f0;font-family:Segoe UI,Arial,sans-serif;color:#2c2c2c;}
            h2{color:#1c1c1c;font-size:1.2em;text-transform:uppercase;letter-spacing:1px;
               border-bottom:3px solid #9b3a10;padding-bottom:7px;margin-bottom:14px;}
            p{line-height:1.7;color:#3a3530;margin-bottom:10px;}
            blockquote{background:#faf6f1;border-left:5px solid #9b3a10;margin:14px 0;
                       padding:10px 16px;font-style:italic;color:#5a4a40;}
            a{color:#7a2e08;font-weight:600;}a:hover{color:#c8850a;}
            </style></head><body>
            <h2>Bienvenidos</h2>
            <blockquote>"Las mejores herramientas para tus proyectos."</blockquote>
            <p>Este contenido está dentro de un <strong>IFRAME</strong>.
               Los links de la barra lateral usan <code>target="_top"</code>
               para navegar la página principal.</p>
            <p><a href="#inicio" target="_top">← Volver al inicio</a></p>
            </body></html>`;

        const wrapper = el("div", { class: "iframe-wrapper" });

        const iBanner = el("iframe", { class: "iframe-banner", title: "Banner principal", scrolling: "no" });
        iBanner.setAttribute("srcdoc", bannerDoc);

        const mainArea = el("div", { class: "iframe-main" });

        const iSidebar = el("iframe", { class: "iframe-sidebar", title: "Barra lateral con imágenes y enlaces" });
        iSidebar.setAttribute("srcdoc", sidebarDoc);

        const iContent = el("iframe", { class: "iframe-content", name: "contenido", title: "Contenido central" });
        iContent.setAttribute("srcdoc", contentDoc);

        ap(mainArea, iSidebar, iContent);
        ap(wrapper, iBanner, mainArea);
        section.appendChild(wrapper);
        return section;
    }

    // --- SECTION CONTACTO ---
    function construirContacto(): HTMLElement {
        const section = el("section", { id: "contacto" });
        ap(section,
            el("h2", {}, "Contacto"),
            el("p", {}, "Teléfono: 3001234567"),
            el("p", {}, "Email: ferreteria@gmail.com"),
            el("p", {}, "Dirección: Calle 45 # 12-30, Bogotá - Colombia"),
            crearBR(),
            el("a", { href: "https://www.google.com", target: "_blank" }, "Ver ubicación en el mapa")
        );
        return section;
    }

    // --- FOOTER ---
    function construirFooter(): HTMLElement {
        const footer = document.createElement("footer");
        const p2 = document.createElement("p");

        const links: NavItem[] = [
            { label: "Inicio",      href: "#inicio",      target: "_self" },
            { label: "Productos",   href: "#productos",   target: "_self" },
            { label: "Tablas",      href: "#tablas",      target: "_self" },
            { label: "Glosario",    href: "#glosario",    target: "_self" },
            { label: "Contacto",    href: "#contacto",    target: "_self" },
        ];
        links.forEach(({ label, href, target }, i) => {
            if (i > 0) p2.appendChild(document.createTextNode(" | "));
            p2.appendChild(el("a", { href, target }, label));
        });

        ap(footer,
            crearHR("hr-footer"),
            el("p", {}, "© 2026 Ferretería El Constructor — Bogotá, Colombia"),
            p2
        );
        return footer;
    }

    // ============================================================
    // TABLA DINÁMICA
    // ============================================================

    function generarTablaDinamica(): void {
        const inputFilas  = document.getElementById("filas")    as HTMLInputElement | null;
        const inputCols   = document.getElementById("columnas") as HTMLInputElement | null;
        const resultado   = document.getElementById("resultado-tabla") as HTMLElement | null;

        if (!inputFilas || !inputCols || !resultado) return;

        const filas    = parseInt(inputFilas.value, 10);
        const columnas = parseInt(inputCols.value, 10);

        if (isNaN(filas) || isNaN(columnas) || filas < 1 || columnas < 1) {
            alert("Ingresa valores válidos (mínimo 1).");
            return;
        }

        const tabla = document.createElement("table");

        const trH = document.createElement("tr");
        for (let c = 1; c <= columnas; c++) {
            ap(trH, el("th", { align: "center" }, "Columna " + c));
        }
        tabla.appendChild(trH);

        for (let f = 1; f <= filas; f++) {
            const tr = document.createElement("tr");
            for (let c = 1; c <= columnas; c++) {
                ap(tr, el("td", { align: "center" }, `F${f} / C${c}`));
            }
            tabla.appendChild(tr);
        }

        resultado.innerHTML = "";
        resultado.appendChild(tabla);
    }

    // ============================================================
    // GESTIÓN DE TAREAS — estado y renderizado
    // ============================================================

    let gTareas: Task[] = [];
    let gTareasSearch = "";
    let gTareaEditando: Task | null = null;
    let gTareasListRef: HTMLElement | null = null;
    let gTareasStatsRef: HTMLElement | null = null;
    let gEditFormRef: HTMLElement | null = null;

    function renderizarStats(): void {
        if (!gTareasStatsRef) return;
        const filtradas = gTareas.filter(t =>
            t.title.toLowerCase().includes(gTareasSearch.toLowerCase())
        );
        const pendientes = filtradas.filter(t => !t.completed).length;
        const completadas = filtradas.filter(t => t.completed).length;
        gTareasStatsRef.innerHTML =
            `<span style="color:#9b3a10">Pendientes: <strong>${pendientes}</strong></span>` +
            `&nbsp;&nbsp;<span style="color:#5a4a40">Completadas: <strong>${completadas}</strong></span>`;
    }

    function renderizarListaTareas(): void {
        if (!gTareasListRef) return;
        renderizarStats();
        const filtradas = gTareas.filter(t =>
            t.title.toLowerCase().includes(gTareasSearch.toLowerCase())
        );
        gTareasListRef.innerHTML = "";
        if (filtradas.length === 0) {
            gTareasListRef.appendChild(el("p", {
                style: "color:#5a4a40;font-style:italic;text-align:center;padding:1rem;",
            }, "No hay tareas registradas. Agregue una arriba."));
            return;
        }
        filtradas.forEach(task => {
            const card = el("div", {
                class: "tarea-card" + (task.completed ? " completada" : ""),
            });
            const info = el("div", {});
            ap(info,
                el("p", { class: "tarea-titulo" }, task.title),
                el("p", { class: "tarea-desc" }, task.description || "")
            );
            const botones = el("div", { class: "tarea-botones" });
            const btnEditar = el("button", { class: "btn-tarea-editar", type: "button" }, "Editar");
            btnEditar.addEventListener("click", () => {
                gTareaEditando = { ...task };
                renderizarFormEdicion();
            });
            const btnEliminar = el("button", { class: "btn-tarea-eliminar", type: "button" }, "Eliminar");
            btnEliminar.addEventListener("click", async () => {
                await deleteTask(task.id);
                gTareas = await getTasks();
                renderizarListaTareas();
            });
            ap(botones, btnEditar, btnEliminar);
            ap(card, info, botones);
            gTareasListRef!.appendChild(card);
        });
    }

    function renderizarFormEdicion(): void {
        if (!gEditFormRef) return;
        gEditFormRef.innerHTML = "";
        if (!gTareaEditando) return;
        const formEdit = el("div", { class: "tareas-edit-form" });
        ap(formEdit, el("h3", {
            style: "color:#6b2a08;margin-bottom:.6rem;border:none;padding-left:0;",
        }, "Editando tarea"));
        const inpTit = document.createElement("input");
        inpTit.type = "text";
        inpTit.value = gTareaEditando.title;
        inpTit.addEventListener("input", () => {
            if (gTareaEditando) gTareaEditando = { ...gTareaEditando, title: inpTit.value };
        });
        const inpDesc = document.createElement("input");
        inpDesc.type = "text";
        inpDesc.value = gTareaEditando.description || "";
        inpDesc.addEventListener("input", () => {
            if (gTareaEditando) gTareaEditando = { ...gTareaEditando, description: inpDesc.value };
        });
        const lbl = document.createElement("label");
        lbl.className = "tareas-checkbox-label";
        const chk = document.createElement("input");
        chk.type = "checkbox";
        chk.checked = gTareaEditando.completed;
        chk.addEventListener("change", () => {
            if (gTareaEditando) gTareaEditando = { ...gTareaEditando, completed: chk.checked };
        });
        lbl.appendChild(chk);
        lbl.appendChild(document.createTextNode(" Marcar como completada"));
        const botonesEdit = el("div", { class: "tareas-form-buttons" });
        const btnGuardar = el("button", { class: "btn-tarea-guardar", type: "button" }, "Guardar cambios");
        btnGuardar.addEventListener("click", async () => {
            if (!gTareaEditando) return;
            await updateTask(gTareaEditando.id, {
                title: gTareaEditando.title,
                description: gTareaEditando.description || "",
                completed: gTareaEditando.completed,
            });
            gTareaEditando = null;
            gTareas = await getTasks();
            renderizarListaTareas();
            renderizarFormEdicion();
        });
        const btnCancelar = el("button", { class: "btn-tarea-cancelar", type: "button" }, "Cancelar");
        btnCancelar.addEventListener("click", () => {
            gTareaEditando = null;
            renderizarFormEdicion();
        });
        ap(botonesEdit, btnGuardar, btnCancelar);
        ap(formEdit, inpTit, inpDesc, lbl, botonesEdit);
        gEditFormRef.appendChild(formEdit);
    }

    function construirGestionTareas(): HTMLElement {
        const section = el("section", { id: "tareas" });
        ap(section, el("h2", {}, "Gestión de Tareas Operativas"));

        ap(section, el("h3", {}, "Buscar tarea"));
        const inpBuscar = document.createElement("input");
        inpBuscar.type = "text";
        inpBuscar.className = "tareas-search";
        inpBuscar.placeholder = "Buscar por nombre de tarea...";
        inpBuscar.addEventListener("input", () => {
            gTareasSearch = inpBuscar.value;
            renderizarListaTareas();
        });
        section.appendChild(inpBuscar);

        const statsDiv = el("div", { class: "tareas-stats" });
        gTareasStatsRef = statsDiv;
        section.appendChild(statsDiv);

        ap(section, el("h3", { style: "margin-top:1.2rem;" }, "Nueva tarea"));
        const formDiv = el("div", { class: "tareas-form" });
        const inpNuevoTitulo = document.createElement("input");
        inpNuevoTitulo.type = "text";
        inpNuevoTitulo.placeholder = "Ej: Revisar stock de tornillos Stanley...";
        const inpNuevaDesc = document.createElement("input");
        inpNuevaDesc.type = "text";
        inpNuevaDesc.placeholder = "Ej: Bodega nivel 2, sección B";
        const btnAgregar = el("button", { class: "btn-tarea-guardar", type: "button" }, "Agregar");
        btnAgregar.addEventListener("click", async () => {
            const title = inpNuevoTitulo.value.trim();
            if (!title) return;
            await createTask({ title, description: inpNuevaDesc.value.trim(), completed: false });
            inpNuevoTitulo.value = "";
            inpNuevaDesc.value = "";
            gTareas = await getTasks();
            renderizarListaTareas();
        });
        ap(formDiv, inpNuevoTitulo, inpNuevaDesc, btnAgregar);
        section.appendChild(formDiv);

        const editContainer = el("div", {});
        gEditFormRef = editContainer;
        section.appendChild(editContainer);

        section.appendChild(crearHR());
        ap(section, el("h3", {}, "Tareas operativas"));
        const listaDiv = el("div", { class: "tareas-list" });
        gTareasListRef = listaDiv;
        section.appendChild(listaDiv);

        getTasks()
            .then(tasks => { gTareas = tasks; renderizarListaTareas(); })
            .catch(() => { gTareas = []; renderizarListaTareas(); });

        return section;
    }

    // ============================================================
    // INICIALIZAR — punto de entrada
    // ============================================================

    function inicializar(): void {
        // title y bgcolor controlados desde TypeScript
        document.title = "Ferretería El Constructor";
        document.body.setAttribute("bgcolor", "#f0ebe4");

        inyectarCSS();

        const elementos: HTMLElement[] = [
            construirHeader(),
            crearHR(),
            construirNav(),
            crearBR(),
            construirInicio(),
            crearHR(),
            construirProductos(),
            crearHR(),
            construirGaleria(),
            crearHR(),
            construirTargetDemo(),
            crearHR(),
            construirTablas(),
            crearHR(),
            construirDivDemo(),
            crearHR(),
            construirGlosario(),
            crearHR(),
            construirPromociones(),
            crearHR(),
            construirIframeDemo(),
            crearHR(),
            construirGestionTareas(),
            crearHR(),
            construirContacto(),
            crearBR(),
            construirFooter(),
        ];

        elementos.forEach((e) => document.body.appendChild(e));

        // Tabla inicial al cargar
        generarTablaDinamica();
    }

    document.addEventListener("DOMContentLoaded", inicializar);

})();
