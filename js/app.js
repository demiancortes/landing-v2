document.addEventListener("DOMContentLoaded", () => {
    const body = document.body;
    const header = document.querySelector("#site-header");
    const menuToggle = document.querySelector("#menu-toggle");
    const menuClose = document.querySelector("#menu-close");
    const mobileMenu = document.querySelector("#mobile-menu");
    const mobileLinks = document.querySelectorAll(".mobile-menu__nav a");
    const revealItems = document.querySelectorAll(".reveal");
    const year = document.querySelector("#year");

    /* ===== CONFIGURA AQUÍ EL WHATSAPP REAL ===== */
    const WHATSAPP_NUMBER = "6691632351"; // Ejemplo: "526691234567"

    const whatsappMessages = {
        cotizar: "Hola, vi su página y me interesa una cotización.",
        cita: "Hola, vi su página y me interesa agendar una cita.",
        comprar: "Hola, vi su página y me interesa comprar.",
        informacion: "Hola, vi su página y me gustaría recibir información."
    };

    const openWhatsApp = (type = "cotizar", product = "") => {
        const base = whatsappMessages[type] || whatsappMessages.cotizar;
        const message = product
        ? `${base} Me interesa ${product}.`
        : base;

        if (!WHATSAPP_NUMBER) {
            // Mientras no se configure el número, abre WhatsApp Web con el mensaje.
            window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank", "noopener");
            return;
        }

        window.open(
    `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
    "_blank",
    "noopener"
    );
    };

    /* Header: el fondo se mantiene consistente según la sección */
    const updateHeader = () => {
        header?.classList.toggle("is-scrolled", window.scrollY > 25);
        header?.classList.remove("is-light");
    };

    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });

    /* Mobile menu */
    const openMenu = () => {
        mobileMenu?.classList.add("is-open");
        mobileMenu?.setAttribute("aria-hidden", "false");
        menuToggle?.setAttribute("aria-expanded", "true");
        body.classList.add("menu-open");
    };

    const closeMenu = () => {
        mobileMenu?.classList.remove("is-open");
        mobileMenu?.setAttribute("aria-hidden", "true");
        menuToggle?.setAttribute("aria-expanded", "false");
        body.classList.remove("menu-open");
    };

    menuToggle?.addEventListener("click", openMenu);
    menuClose?.addEventListener("click", closeMenu);
    mobileLinks.forEach(link => link.addEventListener("click", closeMenu));

    document.addEventListener("keydown", event => {
        if (event.key === "Escape") {
            closeMenu();
            closeModal();
        }
    });

    /* Reveal */
    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver(
            (entries, current) => {
                entries.forEach(entry => {
                    if (!entry.isIntersecting) return;
                    entry.target.classList.add("is-visible");
                    current.unobserve(entry.target);
                });
            },
            { threshold: .08, rootMargin: "0px 0px -25px 0px" }
            );

        revealItems.forEach(item => observer.observe(item));
    } else {
        revealItems.forEach(item => item.classList.add("is-visible"));
    }

    /* Product modal */
    const modal = document.querySelector("#product-modal");
    const modalTitle = document.querySelector("#modal-title");
    const modalDescription = document.querySelector("#modal-description");
    const modalWhatsapp = modal?.querySelector('[data-whatsapp="cotizar"]');

    const productData = {
        sheer: {
            title: "Sheer Elegance",
            description: "Control de luz y privacidad con un diseño moderno.",
            messageName: "Sheer Elegance"
        },
        roller: {
            title: "Enrollables",
            description: "Una solución limpia y moderna para cualquier ambiente.",
            messageName: "Enrollables"
        },
        curtain: {
            title: "Cortinas",
            description: "Tergal, Dimout y Blackout.",
            messageName: "Cortinas"
        },
        wallpaper: {
            title: "Papel Tapiz",
            description: "Texturas y patrones para transformar tus paredes.",
            messageName: "Papel Tapiz"
        }
    };

    let currentProduct = "";

    const openModal = key => {
        const product = productData[key];
        if (!product) return;

        currentProduct = product.messageName;
        modalTitle.textContent = product.title;
        modalDescription.textContent = product.description;
        modal.classList.add("is-open");
        modal.setAttribute("aria-hidden", "false");
        body.classList.add("modal-open");
    };

    function closeModal() {
        modal?.classList.remove("is-open");
        modal?.setAttribute("aria-hidden", "true");
        body.classList.remove("modal-open");
        currentProduct = "";
    }

    document.querySelectorAll("[data-product]").forEach(button => {
        button.addEventListener("click", () => openModal(button.dataset.product));
    });

    document.querySelectorAll("[data-modal-close]").forEach(element => {
        element.addEventListener("click", closeModal);
    });

    modalWhatsapp?.addEventListener("click", event => {
        event.preventDefault();
        openWhatsApp("cotizar", currentProduct);
        closeModal();
    });

    /* WhatsApp buttons */
    document.querySelectorAll("[data-whatsapp]").forEach(link => {
        link.addEventListener("click", event => {
            event.preventDefault();
            openWhatsApp(link.dataset.whatsapp);
        });
    });

    /* Contact form */
    document.querySelector("#contact-form")?.addEventListener("submit", event => {
        event.preventDefault();

        const form = new FormData(event.currentTarget);
        const name = form.get("name")?.trim() || "";
        const phone = form.get("phone")?.trim() || "";
        const intent = form.get("intent") || "una cotización";
        const message = form.get("message")?.trim() || "";

        const text = [
            `Hola, soy ${name}.`,
            phone ? `Mi teléfono es ${phone}.` : "",
            `Me interesa ${intent}.`,
            message ? `Mensaje: ${message}` : ""
        ].filter(Boolean).join(" ");

        if (!WHATSAPP_NUMBER) {
            window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank", "noopener");
            return;
        }

        window.open(
    `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`,
    "_blank",
    "noopener"
    );
    });

    if (year) year.textContent = new Date().getFullYear();

/* ========================================
   REVIEWS SLIDER
======================================== */

const reviewsSlider = document.querySelector('.reviews__slider');

if (reviewsSlider) {

    const viewport = reviewsSlider.querySelector('.reviews__viewport');
    const track = reviewsSlider.querySelector('.reviews__track');
    const cards = [...reviewsSlider.querySelectorAll('.review-card')];

    const prevButton = reviewsSlider.querySelector('.reviews__arrow--prev');
    const nextButton = reviewsSlider.querySelector('.reviews__arrow--next');

    const dots = [
        ...document.querySelectorAll('.reviews__dots button')
    ];

    let currentIndex = 0;

    function getStep() {
        if (!cards.length) return 0;

        const card = cards[0];
        const styles = window.getComputedStyle(track);
        const gap = parseFloat(styles.columnGap) || 0;

        return card.offsetWidth + gap;
    }

    function getVisibleCards() {
        return window.innerWidth <= 800 ? 1 : 3;
    }

    function getMaxIndex() {
        return Math.max(
            0,
            cards.length - getVisibleCards()
        );
    }

    function updateSlider() {

        const maxIndex = getMaxIndex();

        currentIndex = Math.min(
            Math.max(currentIndex, 0),
            maxIndex
        );

        track.style.transform =
            `translateX(-${currentIndex * getStep()}px)`;

        updateDots();
        updateButtons();
    }

    function updateDots() {

        if (!dots.length) return;

        const maxIndex = getMaxIndex();

        const dotIndex = Math.min(
            currentIndex,
            dots.length - 1,
            maxIndex
        );

        dots.forEach((dot, index) => {
            dot.classList.toggle(
                'is-active',
                index === dotIndex
            );
        });
    }

    function updateButtons() {

        if (prevButton) {
            prevButton.disabled = currentIndex <= 0;
        }

        if (nextButton) {
            nextButton.disabled =
                currentIndex >= getMaxIndex();
        }
    }

    function goTo(index) {

        currentIndex = Math.min(
            Math.max(index, 0),
            getMaxIndex()
        );

        updateSlider();
    }

    /* FLECHA ANTERIOR */

    if (prevButton) {
        prevButton.addEventListener('click', () => {
            goTo(currentIndex - 1);
        });
    }

    /* FLECHA SIGUIENTE */

    if (nextButton) {
        nextButton.addEventListener('click', () => {
            goTo(currentIndex + 1);
        });
    }

    /* DOTS */

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            goTo(index);
        });
    });

    /* RESIZE */

    window.addEventListener('resize', () => {
        updateSlider();
    });

    /* SWIPE MÓVIL */

    let touchStartX = 0;
    let touchEndX = 0;

    viewport.addEventListener('touchstart', (event) => {
        touchStartX = event.touches[0].clientX;
    }, { passive: true });

    viewport.addEventListener('touchend', (event) => {

        touchEndX = event.changedTouches[0].clientX;

        const difference = touchStartX - touchEndX;

        if (Math.abs(difference) < 50) return;

        if (difference > 0) {
            goTo(currentIndex + 1);
        } else {
            goTo(currentIndex - 1);
        }

    }, { passive: true });

    /* INICIALIZAR */

    updateSlider();
}
});
