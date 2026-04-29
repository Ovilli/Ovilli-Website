const header = document.getElementById("main-header");
const nav = document.getElementById("about-nav");
const content = document.getElementById("about-content");
const langButton = document.getElementById("lang-toggle");
const scrollProgress = document.getElementById("scroll-progress");
const heroSection = document.querySelector(".hero");
const backToTopButton = document.getElementById("back-to-top");
const olivePageLink = document.getElementById("olive-page-link");

const heroEyebrow = document.getElementById("hero-eyebrow");
const heroTitle = document.getElementById("hero-title");
const heroCopy = document.getElementById("hero-copy");
const heroCtaPrimary = document.getElementById("hero-cta-primary");
const heroCtaSecondary = document.getElementById("hero-cta-secondary");
const heroChip1 = document.getElementById("hero-chip-1");
const heroChip2 = document.getElementById("hero-chip-2");
const heroChip3 = document.getElementById("hero-chip-3");
const brandSubline = document.getElementById("brand-subline");
const footerText = document.getElementById("footer-text");

const gateTitle = document.getElementById("gate-title");
const gateCopy = document.getElementById("gate-copy");
const gateError = document.getElementById("gate-error");

let currentLang = "EN";
let isVerified = false;
let requestInProgress = false;
let observer = null;
let visibilityObserver = null;
let turnstileWidgetId = null;
let lastScrollY = window.scrollY;
let scrollThreshold = 40;
let accumulatedScroll = 0;
let scrollTicking = false;

const WORKER_URL = "https://ovilli-captcha.mzlatin4.workers.dev/";
const TURNSTILE_SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js";
const DEV_MODE = (
    ["localhost", "127.0.0.1", "::1"].includes(window.location.hostname) ||
    window.location.search.includes("dev=1")
);

if (!DEV_MODE) {
    document.body.classList.add("locked");
}

const SVG = {
    github: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>`,
    envelope: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 16" width="18" height="14" fill="currentColor" aria-hidden="true"><path d="M18 0H2C.9 0 0 .9 0 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V2c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V2l8 5 8-5v2z"/></svg>`,
};

const translations = {
    EN: {
        htmlLang: "en",
        navLabel: "Explore",
        switchTo: "DE",
        gateTitle: "Quick human check",
        gateCopy: "Please verify before entering the site.",
        heroEyebrow: "Ovilli means olive",
        heroTitle: "Frontend Developer & Creative Coder",
        heroCopy: "I build interactive web experiences that blend clean code with playful visual design. Growing ideas into functional tools.",
        heroCtaPrimary: "Jump to Contact",
        heroCtaSecondary: "See GitHub",
        heroChip1: "Olive inspired",
        heroChip2: "Interactive UI",
        heroChip3: "Built by Ovilli",
        olivePageLink: "Olives page",
        brandSubline: "Developer and digital tinkerer",
        footerText: "Official website of Ovilli",
        sections: [
            {
                id: "about",
                title: "About me",
                text: "I enjoy creating clean, useful projects and learning by shipping. Curiosity drives everything I do, so I am always exploring new methods, tools, and visual ideas to turn small concepts into complete experiences."
            },
            {
                id: "gaming",
                title: "Gaming",
                text: "Games are where I reset, recharge, and discover fresh ideas. I enjoy both competitive rounds for focus and story-heavy worlds for inspiration, atmosphere, and pacing."
            },
            {
                id: "tech",
                title: "Tech",
                text: "I like practical technology that solves real problems and still feels enjoyable to use. I care about clarity, speed, accessibility, and smooth interactions that make products feel alive.",
                items: ["Frontend and web experiments", "Small automations", "Designing smoother user experience", "UI micro-interaction systems", "Readable and maintainable architecture"]
            },
            {
                id: "music",
                title: "Music",
                text: "There is usually a playlist running in the background. Music keeps me focused while I create, and different genres help me switch between exploration, execution, and final polish."
            },
            {
                id: "projects",
                title: "Projects",
                text: "I build personal products that mix function and atmosphere: interactive landing pages, mini tools, playful UI concepts, and automation helpers that save time.",
                items: ["Interactive personal websites", "Web animations and visual systems", "Utility scripts and automation", "Experimental UI components"]
            },
            {
                id: "workflow",
                title: "Workflow",
                text: "My workflow starts with idea capture, then quick prototypes, then iterative refinement. I like short feedback cycles and shipping in small improvements instead of waiting for a giant release.",
                items: ["Prototype fast", "Refine through feedback", "Optimize and simplify", "Ship consistently"]
            },
            {
                id: "vision",
                title: "Vision",
                text: "My vision is to blend strong engineering with visual storytelling. I want each project to feel clear, personal, and memorable, with enough detail that people enjoy staying on the page."
            },
            {
                id: "contact",
                title: "Contact",
                text: "If you want to connect, collaborate, or just say hi, reach out. I am always open to interesting ideas, creative partnerships, and meaningful project discussions."
            },
        ]
    },
    DE: {
        htmlLang: "de",
        navLabel: "Bereiche",
        switchTo: "EN",
        gateTitle: "Kurzer Mensch-Check",
        gateCopy: "Bitte bestaetigen, bevor du die Seite betrittst.",
        heroEyebrow: "Ovilli bedeutet Olive",
        heroTitle: "Frontend Developer & Creative Coder",
        heroCopy: "Ich entwickle interaktive Web-Erlebnisse, die sauberen Code mit spielerischem Design verbinden. Ideen werden zu funktionalen Tools.",
        heroCtaPrimary: "Zum Kontakt",
        heroCtaSecondary: "GitHub ansehen",
        heroChip1: "Von Oliven inspiriert",
        heroChip2: "Interaktive UI",
        heroChip3: "Von Ovilli gebaut",
        olivePageLink: "Oliven-Seite",
        brandSubline: "Entwickler und digitaler Bastler",
        footerText: "Offizielle Website von Ovilli",
        sections: [
            {
                id: "about",
                title: "Ueber mich",
                text: "Ich mag es, saubere und nuetzliche Projekte zu bauen und dabei durch echtes Ausliefern zu lernen. Neugier treibt mich an, deshalb probiere ich staendig neue Tools, Ideen und Workflows aus."
            },
            {
                id: "gaming",
                title: "Gaming",
                text: "Gaming ist mein Ausgleich. Ich mag sowohl kompetitive Runden fuer Fokus als auch starke Story-Spiele fuer Atmosphaere und Inspiration."
            },
            {
                id: "tech",
                title: "Tech",
                text: "Mich interessiert Technik, die reale Probleme loest und sich trotzdem gut anfuehlt. Klarheit, Tempo, Zugaenglichkeit und gute Interaktionen sind mir wichtig.",
                items: ["Frontend und Web-Experimente", "Kleine Automationen", "Bessere User Experience", "UI-Micro-Interactions", "Saubere und wartbare Struktur"]
            },
            {
                id: "music",
                title: "Musik",
                text: "Fast immer laeuft Musik im Hintergrund. Je nach Aufgabe nutze ich unterschiedliche Sounds fuer Ideenfindung, Umsetzung und Feinschliff."
            },
            {
                id: "projects",
                title: "Projekte",
                text: "Ich baue persoenliche Projekte mit Funktion und Stimmung: interaktive Seiten, kleine Tools, spielerische UI-Konzepte und hilfreiche Automationen.",
                items: ["Interaktive Webseiten", "Web-Animationen", "Utility-Skripte", "Experimentelle UI-Bausteine"]
            },
            {
                id: "workflow",
                title: "Workflow",
                text: "Mein Workflow startet mit Ideen-Sammlung, geht in schnelle Prototypen und endet in iterativer Verbesserung. Ich arbeite lieber in klaren kleinen Schritten statt in riesigen Bloecken.",
                items: ["Schnell prototypen", "Mit Feedback verbessern", "Optimieren und vereinfachen", "Regelmaessig releasen"]
            },
            {
                id: "vision",
                title: "Vision",
                text: "Meine Vision ist die Mischung aus starker Technik und visuellem Storytelling. Projekte sollen klar, persoenlich und einpraegsam wirken."
            },
            {
                id: "contact",
                title: "Kontakt",
                text: "Wenn du dich austauschen oder zusammenarbeiten willst, melde dich gern. Ich freue mich immer ueber spannende Ideen und kreative Zusammenarbeit."
            },
        ]
    }
};

function render() {
    const t = translations[currentLang];
    const sections = t.sections;

    document.documentElement.lang = t.htmlLang;
    langButton.textContent = t.switchTo;
    gateTitle.textContent = t.gateTitle;
    gateCopy.textContent = t.gateCopy;
    heroEyebrow.textContent = t.heroEyebrow;
    heroTitle.textContent = t.heroTitle;
    heroCopy.textContent = t.heroCopy;
    heroCtaPrimary.textContent = t.heroCtaPrimary;
    heroCtaSecondary.textContent = t.heroCtaSecondary;
    heroChip1.textContent = t.heroChip1;
    heroChip2.textContent = t.heroChip2;
    heroChip3.textContent = t.heroChip3;
    olivePageLink.textContent = t.olivePageLink;
    brandSubline.textContent = t.brandSubline;
    footerText.textContent = `${t.footerText} • ${new Date().getFullYear()}`;

    nav.innerHTML =
        `<span class="nav-brand-label">${t.navLabel}</span>` +
        sections.map((section) => `<a class="nav-pill" href="#${section.id}">${section.title}</a>`).join("");

    content.innerHTML = sections.map((section, index) => {
        const listHtml = section.items
            ? `<ul class="topic-list">${section.items.map((item) => `<li>${item}</li>`).join("")}</ul>`
            : "";

        const socialHtml = section.id === "contact"
            ? `<div class="socials">
                    <a href="https://github.com/ovilli" target="_blank" rel="noreferrer" class="social-icon" aria-label="GitHub">
                        ${SVG.github}
                    </a>
                    <a href="mailto:ovilli@ovilli.de" class="social-icon" aria-label="Email">
                        ${SVG.envelope}
                    </a>
               </div>`
            : "";

        return `<section class="about-section" id="${section.id}" style="--reveal-delay: ${index * 40}ms;">
                    <h4><span class="section-index">${String(index + 1).padStart(2, "0")}</span>${section.title}</h4>
                    <p>${section.text}</p>
                    ${listHtml}
                    ${socialHtml}
                </section>`;
    }).join("");

    setupObserver();
}

function setupObserver() {
    if (observer) {
        observer.disconnect();
    }
    if (visibilityObserver) {
        visibilityObserver.disconnect();
    }

    const sections = document.querySelectorAll(".about-section");

    visibilityObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                visibilityObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            const link = nav.querySelector(`[href="#${entry.target.id}"]`);
            if (link) {
                link.classList.toggle("active", entry.isIntersecting);
            }
        });
    }, { rootMargin: "-25% 0px -65% 0px", threshold: 0 });

    sections.forEach((section) => {
        visibilityObserver.observe(section);
        observer.observe(section);
    });
}

function loadTurnstile() {
    if (isVerified) {
        return;
    }

    if (!window.turnstile) {
        setTimeout(loadTurnstile, 120);
        return;
    }

    const box = document.getElementById("turnstile-box");
    if (!box) {
        return;
    }

    box.innerHTML = "";
    turnstileWidgetId = turnstile.render("#turnstile-box", {
        sitekey: "0x4AAAAAACwW_d7_86SOKI22",
        callback: onTurnstileSuccess
    });
}

function ensureTurnstileScript() {
    if (window.turnstile) {
        return;
    }

    const existing = document.getElementById("turnstile-script");
    if (existing) {
        return;
    }

    const script = document.createElement("script");
    script.id = "turnstile-script";
    script.src = TURNSTILE_SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
}

function onTurnstileSuccess(token) {
    if (requestInProgress || isVerified) {
        return;
    }

    if (gateError) {
        gateError.textContent = "";
    }

    requestInProgress = true;

    fetch(WORKER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token })
    })
        .then(async (response) => {
            if (!response.ok) {
                throw new Error("Verification request failed");
            }
            return response.json();
        })
        .then((data) => {
            if (data.success) {
                unlockSite();
                return;
            }
            resetTurnstile("Verification failed. Please try again.");
        })
        .catch(() => {
            resetTurnstile("Something went wrong. Please try again.");
        })
        .finally(() => {
            requestInProgress = false;
        });
}

function animateHero() {
    if (!heroSection) {
        return;
    }
    heroSection.classList.remove("hero--ready");
    void heroSection.offsetWidth;
    heroSection.classList.add("hero--ready");
}

function unlockSite(immediate = false) {
    isVerified = true;
    document.body.classList.remove("locked");

    const gate = document.getElementById("gate");
    if (!gate) {
        return;
    }

    gate.classList.add("hidden");
    animateHero();
    if (immediate) {
        gate.style.display = "none";
        return;
    }
    setTimeout(() => {
        gate.style.display = "none";
    }, 280);
}

function resetTurnstile(errorMessage) {
    if (errorMessage && gateError) {
        gateError.textContent = errorMessage;
    }
    if (window.turnstile && turnstileWidgetId !== null) {
        turnstile.reset(turnstileWidgetId);
    }
}

function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

function updateScrollUI() {
    const scrollTop = window.scrollY;
    header.classList.toggle("scrolled", scrollTop > 8);

    const delta = scrollTop - lastScrollY;
    accumulatedScroll += delta;

    if (delta > 0) {
        if (accumulatedScroll > scrollThreshold && scrollTop > 200) {
            header.classList.add("hidden");
            nav.classList.add("header-hidden");
        }
    } else {
        if (accumulatedScroll < -scrollThreshold || scrollTop < 50) {
            header.classList.remove("hidden");
            nav.classList.remove("header-hidden");
        }
    }

    if ((delta > 0 && accumulatedScroll < 0) || (delta < 0 && accumulatedScroll > 0)) {
        accumulatedScroll = 0;
    }
    lastScrollY = scrollTop;

    if (scrollProgress) {
        const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
        const progress = Math.min((scrollTop / maxScroll) * 100, 100);
        scrollProgress.style.width = `${progress}%`;
    }

    if (heroSection) {
        const shift = clamp(scrollTop * 0.05, 0, 26);
        heroSection.style.transform = `translateY(${shift}px)`;
    }

    if (backToTopButton) {
        backToTopButton.classList.toggle("is-visible", scrollTop > 420);
    }
}

window.addEventListener("scroll", () => {
    if (!scrollTicking) {
        window.requestAnimationFrame(() => {
            updateScrollUI();
            scrollTicking = false;
        });
        scrollTicking = true;
    }
});

langButton.addEventListener("click", () => {
    currentLang = currentLang === "EN" ? "DE" : "EN";
    render();
});

if (backToTopButton) {
    backToTopButton.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
}

render();
if (DEV_MODE) {
    unlockSite(true);
} else {
    ensureTurnstileScript();
    loadTurnstile();
}
updateScrollUI();
