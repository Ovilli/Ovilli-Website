const header = document.getElementById('main-header');
const nav = document.getElementById('about-nav');
const content = document.querySelector('.about-content');
const langButton = document.getElementById('lang-toggle');

let currentLang = 'EN';
let isVerified = false;
let turnstileWidgetId = null;

const WORKER_URL = "https://ovilli-captcha.mzlatin4.workers.dev/";

document.body.classList.add("locked");

const translations = {
    EN: {
        about: "About",
        me: "Me",
        gaming: "Gaming",
        tech: "Tech",
        music: "Music",
        contact: "Contact",
        sections: {
            me: "Hey. I spend most of my time bouncing between code, games, and a good playlist.",
            gaming: "Gaming is my reset button...",
            tech: "I like building things...",
            music: "There's always a soundtrack...",
            contact: "If something here resonates with you, feel free to reach out."
        }
    },
    DE: {
        about: "Über",
        me: "Ich",
        gaming: "Gaming",
        tech: "Tech",
        music: "Musik",
        contact: "Kontakt",
        sections: {
            me: "Hey. Ich verbringe die meiste Zeit...",
            gaming: "Zocken ist für mich...",
            tech: "Ich baue gerne Dinge...",
            music: "Bei mir läuft eigentlich immer Musik...",
            contact: "Wenn dich hier irgendwas anspricht..."
        }
    }
};

function render() {
    const t = translations[currentLang];

    nav.innerHTML =
        `<span class="nav-brand-label">${t.about}</span>` +
        Object.keys(t.sections).map(key =>
            `<a class="nav-pill" href="#${key}">${t[key]}</a>`
        ).join('');

    content.innerHTML = Object.entries(t.sections).map(([key, val]) => `
        <section class="about-section" id="${key}">
            <h4>${t[key]}</h4>
            <p>${val}</p>

            ${key === 'contact' ? `
                <div class="socials">
                    <a href="https://github.com/ovilli" target="_blank" class="social-icon">
                        <i class="fab fa-github"></i>
                    </a>
                    <a href="mailto:mzlatin4@gmail.com" class="social-icon">
                        <i class="fas fa-envelope"></i>
                    </a>
                </div>

                <div class="turnstile-container">
                    <div id="turnstile-box"></div>
                </div>

                <p id="verify-status">Not verified</p>
            ` : ''}
        </section>
    `).join('');

    setupObserver();
    setTimeout(loadTurnstile, 80);
}

function loadTurnstile() {
    if (!window.turnstile || isVerified) return;

    const box = document.getElementById("turnstile-box");
    if (!box) return;

    box.innerHTML = "";

    turnstileWidgetId = turnstile.render("#turnstile-box", {
        sitekey: "0x4AAAAAACwW_d7_86SOKI22",
        callback: onTurnstileSuccess
    });
}

let requestInProgress = false;

function onTurnstileSuccess(token) {
    if (requestInProgress || isVerified) return;
    requestInProgress = true;

    fetch(WORKER_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ token })
    })
        .then(async (res) => {
            if (!res.ok) throw new Error("HTTP error");
            return res.json();
        })
        .then(data => {
            if (data.success) {
                unlockSite();
                updateStatus("Verified");
            } else {
                updateStatus("Failed");
            }
        })
        .catch(() => {
            updateStatus("Error (CORS or Worker issue)");
        })
        .finally(() => {
            requestInProgress = false;
        });
}

function unlockSite() {
    isVerified = true;
    document.body.classList.remove("locked");

    const gate = document.getElementById("gate");
    if (gate) gate.style.display = "none";
}

function updateStatus(text) {
    const el = document.getElementById("verify-status");
    if (el) el.textContent = text;
}

function setupObserver() {
    const sections = document.querySelectorAll('.about-section');
    const navLinks = document.querySelectorAll('.nav-pill');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');

                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${entry.target.id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, { threshold: 0.4 });

    sections.forEach(s => observer.observe(s));
}

window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    if (scrollY > 100) {
        header.classList.add('scrolled');
        nav.classList.add('visible');
    } else {
        header.classList.remove('scrolled');
        nav.classList.remove('visible');
    }
});

langButton.addEventListener('click', () => {
    currentLang = currentLang === 'EN' ? 'DE' : 'EN';
    render();
});

render();