const header = document.getElementById("main-header");
const nav = document.getElementById("about-nav");
const content = document.getElementById("about-content");
const langButton = document.getElementById("lang-toggle");
const scrollProgress = document.getElementById("scroll-progress");
const heroSection = document.querySelector(".hero");
const backToTopButton = document.getElementById("back-to-top");
const olivePageLink = document.getElementById("olive-page-link");
// const branchOverlay = document.getElementById("branch-overlay");

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

// const tendrilCanvas = document.getElementById("tendril-canvas");
const tendrilCtx = typeof tendrilCanvas !== 'undefined' && tendrilCanvas ? tendrilCanvas.getContext("2d") : null;

let currentLang = "EN";
let isVerified = false;
let requestInProgress = false;
let observer = null;
let turnstileWidgetId = null;
let tendrilState = null;
let lastScrollY = window.scrollY;
let scrollThreshold = 40;
let accumulatedScroll = 0;

const WORKER_URL = "https://ovilli-captcha.mzlatin4.workers.dev/";
const TURNSTILE_SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js";
const REDUCED_MOTION_QUERY = window.matchMedia("(prefers-reduced-motion: reduce)");
const DEV_MODE = (
    ["localhost", "127.0.0.1", "::1"].includes(window.location.hostname) ||
    window.location.search.includes("dev=1")
);

if (!DEV_MODE) {
    document.body.classList.add("locked");
}

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
                        <i class="fab fa-github"></i>
                    </a>
                    <a href="mailto:ovilli@ovilli.de" class="social-icon" aria-label="Email">
                        <i class="fas fa-envelope"></i>
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
    const sections = document.querySelectorAll(".about-section");
    const navLinks = document.querySelectorAll(".nav-pill");

    if (observer) {
        observer.disconnect();
    }

    observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) {
                return;
            }

            entry.target.classList.add("visible");
            navLinks.forEach((link) => {
                const isCurrent = link.getAttribute("href") === `#${entry.target.id}`;
                link.classList.toggle("active", isCurrent);
            });
        });
    }, { threshold: 0.25 });

    sections.forEach((section) => observer.observe(section));
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
            resetTurnstile();
        })
        .catch(() => {
            resetTurnstile();
        })
        .finally(() => {
            requestInProgress = false;
        });
}

function unlockSite(immediate = false) {
    isVerified = true;
    document.body.classList.remove("locked");

    const gate = document.getElementById("gate");
    if (!gate) {
        return;
    }

    gate.classList.add("hidden");
    if (immediate) {
        gate.style.display = "none";
        return;
    }
    setTimeout(() => {
        gate.style.display = "none";
    }, 280);
}

function resetTurnstile() {
    if (window.turnstile && turnstileWidgetId !== null) {
        turnstile.reset(turnstileWidgetId);
    }
}

function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

function setupCanvasResolution(canvas, ctx, width, height, dpr) {
    if (!canvas || !ctx) {
        return;
    }

    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.height = `${height}px`;
    canvas.style.width = `${width}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function createTendrilSegment(anchorX, anchorY, index, spacing) {
    const y = anchorY + (index * spacing);
    return { x: anchorX, y, px: anchorX, py: y };
}

function buildTendrils() {
    if (!tendrilState || !tendrilState.ctx) {
        return;
    }

    const count = Math.max(5, Math.min(9, Math.floor(tendrilState.width / 180)));
    const tendrils = [];
    const spacing = 21;

    for (let i = 0; i < count; i += 1) {
        const anchorX = ((i + 0.5) / count) * tendrilState.width + ((i % 2) ? 18 : -18);
        const anchorY = -26 + ((i % 3) * 8);
        const points = [];
        const pointCount = Math.ceil((tendrilState.height + 120) / spacing) + (i % 5);

        for (let j = 0; j < pointCount; j += 1) {
            points.push(createTendrilSegment(anchorX, anchorY, j, spacing));
        }

        tendrils.push({
            anchorX,
            anchorY,
            points,
            spacing,
            swayOffset: Math.random() * Math.PI * 2,
            swayStrength: 0.7 + Math.random() * 0.45,
            oliveColor: (i % 2 === 0) ? "#5f7d34" : "#738f3e"
        });
    }

    tendrilState.tendrils = tendrils;
}


function resizeTendrilCanvas() {
    if (!tendrilState || !tendrilState.ctx) {
        return;
    }

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = window.innerWidth;
    const height = window.innerHeight;

    setupCanvasResolution(tendrilCanvas, tendrilState.ctx, width, height, dpr);
    tendrilState.width = width;
    tendrilState.height = height;
    buildTendrils();
}

function applySegmentPhysics(tendril, time) {
    const points = tendril.points;
    const baseWind = Math.sin(time * 0.0009 + tendril.swayOffset) * 0.16 * tendril.swayStrength;
    const scrollWave = Math.sin((time * 0.0011) + (tendrilState.scrollY * 0.006) + tendril.swayOffset) * 0.13;
    const scrollVelocityInfluence = clamp(tendrilState.scrollVelocity, -70, 70) * 0.012;

    for (let i = 1; i < points.length; i += 1) {
        const point = points[i];
        const vx = (point.x - point.px) * 0.986;
        const vy = (point.y - point.py) * 0.986;
        const depthFactor = i / points.length;
        point.px = point.x;
        point.py = point.y;
        point.x += vx + baseWind + scrollWave + (scrollVelocityInfluence * depthFactor);
        point.y += vy + 0.2 + (Math.abs(scrollVelocityInfluence) * 0.03 * depthFactor);
    }
}

function applyConstraints(tendril) {
    const points = tendril.points;
    points[0].x = tendril.anchorX;
    points[0].y = tendril.anchorY;

    for (let iteration = 0; iteration < 3; iteration += 1) {
        points[0].x = tendril.anchorX;
        points[0].y = tendril.anchorY;

        for (let i = 1; i < points.length; i += 1) {
            const prev = points[i - 1];
            const point = points[i];
            const dx = point.x - prev.x;
            const dy = point.y - prev.y;
            const dist = Math.hypot(dx, dy) || 0.001;
            const diff = (dist - tendril.spacing) / dist;

            if (i === 1) {
                point.x -= dx * diff;
                point.y -= dy * diff;
            } else {
                point.x -= dx * diff * 0.5;
                point.y -= dy * diff * 0.5;
                prev.x += dx * diff * 0.5;
                prev.y += dy * diff * 0.5;
            }
        }
    }
}

function interactTendrils(ctx) {
    if (!tendrilState) {
        return;
    }

    const tips = tendrilState.tendrils.map((tendril) => tendril.points[tendril.points.length - 1]);

    for (let i = 0; i < tips.length; i += 1) {
        for (let j = i + 1; j < tips.length; j += 1) {
            const a = tips[i];
            const b = tips[j];
            const dx = b.x - a.x;
            const dy = b.y - a.y;
            const distance = Math.hypot(dx, dy) || 0.001;

            if (distance > 220) {
                continue;
            }

            const closeness = 1 - (distance / 220);
            const nx = dx / distance;
            const ny = dy / distance;
            const pull = closeness * 0.45;
            const weave = Math.sin((tendrilState.tick * 0.012) + (i * 0.8) + (j * 0.45)) * closeness;
            const perpendicularX = -ny;
            const perpendicularY = nx;

            a.x += nx * pull;
            a.y += ny * pull * 0.4;
            b.x -= nx * pull;
            b.y -= ny * pull * 0.4;

            if (distance < 120) {
                a.x += perpendicularX * weave * 0.75;
                a.y += perpendicularY * weave * 0.75;
                b.x -= perpendicularX * weave * 0.75;
                b.y -= perpendicularY * weave * 0.75;
            }

            ctx.strokeStyle = `rgba(110, 134, 67, ${0.22 * closeness})`;
            ctx.lineWidth = 1 + (1.8 * closeness);
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            if (distance < 140) {
                const mx = (a.x + b.x) * 0.5 + (perpendicularX * 9 * closeness);
                const my = (a.y + b.y) * 0.5 + (perpendicularY * 9 * closeness);
                ctx.quadraticCurveTo(mx, my, b.x, b.y);
            } else {
                ctx.lineTo(b.x, b.y);
            }
            ctx.stroke();
        }
    }
}

function applyPointerInfluence() {
    if (!tendrilState || !tendrilState.pointer.active) {
        return;
    }

    tendrilState.tendrils.forEach((tendril) => {
        for (let i = 2; i < tendril.points.length; i += 1) {
            const point = tendril.points[i];
            const dx = point.x - tendrilState.pointer.x;
            const dy = point.y - tendrilState.pointer.y;
            const distance = Math.hypot(dx, dy) || 0.001;
            if (distance > 130) {
                continue;
            }
            const push = (130 - distance) / 130;
            point.x += (dx / distance) * push * 1.8;
            point.y += (dy / distance) * push * 1.2;
        }
    });
}

function drawTendril(ctx, tendril) {
    const points = tendril.points;

    const drawPath = () => {
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length - 1; i += 1) {
            const current = points[i];
            const next = points[i + 1];
            const midX = (current.x + next.x) * 0.5;
            const midY = (current.y + next.y) * 0.5;
            ctx.quadraticCurveTo(current.x, current.y, midX, midY);
        }
        const tipPoint = points[points.length - 1];
        ctx.lineTo(tipPoint.x, tipPoint.y);
    };

    ctx.lineCap = "round";
    ctx.strokeStyle = "rgba(176, 199, 120, 0.2)";
    ctx.lineWidth = 3.3;
    drawPath();
    ctx.stroke();

    ctx.strokeStyle = "rgba(75, 98, 40, 0.95)";
    ctx.lineWidth = 1.85;
    drawPath();
    ctx.stroke();

    const tip = points[points.length - 1];

    for (let i = 3; i < points.length; i += 4) {
        const node = points[i];
        ctx.fillStyle = "rgba(184, 203, 136, 0.32)";
        ctx.beginPath();
        ctx.arc(node.x, node.y, 2.6, 0, Math.PI * 2);
        ctx.fill();
    }

    for (let i = 4; i < points.length - 1; i += 6) {
        const node = points[i];
        const next = points[i + 1];
        const angle = Math.atan2(next.y - node.y, next.x - node.x);
        const side = (i % 12 === 0) ? 1 : -1;
        const leafX = node.x + (Math.cos(angle + (side * 1.2)) * 8);
        const leafY = node.y + (Math.sin(angle + (side * 1.2)) * 8);
        ctx.fillStyle = "rgba(126, 156, 73, 0.55)";
        ctx.beginPath();
        ctx.ellipse(leafX, leafY, 4.8, 2.6, angle + (side * 0.4), 0, Math.PI * 2);
        ctx.fill();
    }

    for (let i = 8; i < points.length - 1; i += 12) {
        const node = points[i];
        ctx.fillStyle = "rgba(92, 120, 48, 0.9)";
        ctx.beginPath();
        ctx.ellipse(node.x + 2, node.y + 2, 3.4, 4.8, Math.PI / 8, 0, Math.PI * 2);
        ctx.fill();
    }

    ctx.fillStyle = tendril.oliveColor;
    ctx.beginPath();
    ctx.ellipse(tip.x, tip.y, 5.2, 7.2, Math.PI / 7, 0, Math.PI * 2);
    ctx.fill();
}

function animateTendrils(time) {
    if (!tendrilState || !tendrilState.ctx) {
        return;
    }

    const ctx = tendrilState.ctx;
    tendrilState.tick = time;
    tendrilState.scrollVelocity *= 0.9;
    ctx.clearRect(0, 0, tendrilState.width, tendrilState.height);

    tendrilState.tendrils.forEach((tendril) => {
        applySegmentPhysics(tendril, time);
        applyConstraints(tendril);
    });

    applyPointerInfluence();
    interactTendrils(ctx);
    tendrilState.tendrils.forEach((tendril) => drawTendril(ctx, tendril));
    tendrilState.frame = window.requestAnimationFrame(animateTendrils);
}

function renderStaticTendrils() {
    if (!tendrilState || !tendrilState.ctx) {
        return;
    }

    const ctx = tendrilState.ctx;
    ctx.clearRect(0, 0, tendrilState.width, tendrilState.height);

    tendrilState.tendrils.forEach((tendril, index) => {
        applySegmentPhysics(tendril, index * 35);
        applyConstraints(tendril);
    });

    interactTendrils(ctx);
    tendrilState.tendrils.forEach((tendril) => drawTendril(ctx, tendril));
}

function initTendrils() {
    if (!tendrilCtx) {
        return;
    }

    tendrilState = {
        ctx: tendrilCtx,
        width: 0,
        height: 0,
        tick: 0,
        scrollY: window.scrollY,
        lastScrollY: window.scrollY,
        scrollVelocity: 0,
        frame: 0,
        tendrils: [],
        pointer: { x: 0, y: 0, active: false }
    };

    resizeTendrilCanvas();
    const reducedMotionEnabled = REDUCED_MOTION_QUERY.matches;

    window.addEventListener("resize", () => {
        resizeTendrilCanvas();
        if (REDUCED_MOTION_QUERY.matches) {
            renderStaticTendrils();
        }
    });

    if (reducedMotionEnabled) {
        renderStaticTendrils();
        return;
    }

    window.addEventListener("pointermove", (event) => {
        if (!tendrilState) {
            return;
        }
        tendrilState.pointer.x = event.clientX;
        tendrilState.pointer.y = event.clientY;
        tendrilState.pointer.active = true;
    });
    window.addEventListener("pointerleave", () => {
        if (tendrilState) {
            tendrilState.pointer.active = false;
        }
    });

    if (tendrilState.frame) {
        window.cancelAnimationFrame(tendrilState.frame);
    }
    tendrilState.frame = window.requestAnimationFrame(animateTendrils);
}

function updateScrollUI() {
    const scrollTop = window.scrollY;
    header.classList.toggle("scrolled", scrollTop > 8);

    const delta = scrollTop - lastScrollY;
    accumulatedScroll += delta;

    if (delta > 0) { // Scrolling down
        if (accumulatedScroll > scrollThreshold && scrollTop > 200) {
            header.classList.add("hidden");
            nav.classList.add("header-hidden");
        }
    } else { // Scrolling up
        if (accumulatedScroll < -scrollThreshold || scrollTop < 50) {
            header.classList.remove("hidden");
            nav.classList.remove("header-hidden");
        }
    }

    // Reset accumulated scroll when direction changes significantly
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

/*
    if (branchOverlay) {
        const branchShift = clamp(scrollTop * 0.18, 0, 190);
        branchOverlay.style.transform = `translateY(${branchShift}px)`;
    }
    */

    if (backToTopButton) {
        backToTopButton.classList.toggle("is-visible", scrollTop > 420);
    }

    if (tendrilState) {
        const currentY = scrollTop;
        tendrilState.scrollVelocity = currentY - tendrilState.lastScrollY;
        tendrilState.lastScrollY = currentY;
        tendrilState.scrollY = currentY;

        if (REDUCED_MOTION_QUERY.matches) {
            renderStaticTendrils();
        }
    }
}

window.addEventListener("scroll", updateScrollUI);

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
// initTendrils();
updateScrollUI();
