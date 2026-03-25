const header = document.getElementById('main-header');
const nav = document.getElementById('about-nav');
const content = document.querySelector('.about-content');
const langButton = document.getElementById('lang-toggle');

let currentLang = 'EN';

const translations = {
    EN: {
        about: "About",
        me: "Me",
        gaming: "Gaming",
        tech: "Tech",
        music: "Music",
        contact: "Contact",
        sections: {
            me: "Hey. I spend most of my time bouncing between code, games, and a good playlist. I like things simple, functional, and authentic. That's exactly what this site is all about.",
            gaming: "Gaming is my reset button. I gravitate toward strong mechanics and immersive worlds — the kind of games that stick with you long after you log off.",
            tech: "I like building things. Sometimes to solve a problem, sometimes just to see if I can pull it off. I care about clean code and practical tools.",
            music: "There's always a soundtrack to my day. Music sets the tone whether I'm deep in a codebase or just chilling. My taste is all over the place.",
            contact: "If something here resonates with you, feel free to reach out. I'm always up for a good chat."
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
            me: "Hey. Ich verbringe die meiste Zeit irgendwo zwischen Code, Games und einer guten Playlist. Ich mag es simpel, funktional und authentisch.",
            gaming: "Zocken ist für mich der perfekte Ausgleich. Ich stehe auf clevere Mechaniken und Welten, in denen man sich verlieren kann.",
            tech: "Ich baue gerne Dinge. Manchmal, weil ich sie selbst brauche, und manchmal einfach, um zu sehen, ob es klappt. Mir geht es um sauberen Code.",
            music: "Bei mir läuft eigentlich immer Musik. Sie gibt den Takt vor, egal ob ich programmiere, zocke oder einfach nur abschalte.",
            contact: "Wenn dich hier irgendwas anspricht, meld dich einfach. Ich bin immer offen für einen Austausch."
        }
    }
};

function render() {
    const t = translations[currentLang];

    // Render Nav
    nav.innerHTML = `<span class="nav-brand-label">${t.about}</span>` +
        Object.keys(t.sections).map(key =>
            `<a class="nav-pill" href="#${key}">${t[key]}</a>`
        ).join('');

    // Render Content
    content.innerHTML = Object.entries(t.sections).map(([key, val]) => `
        <section class="about-section" id="${key}">
            <h4>${t[key]}</h4>
            <p>${val}</p>
            ${key === 'contact' ? `
                <div class="socials">
                    <a href="https://github.com/ovilli" target="_blank" class="social-icon"><i class="fab fa-github"></i></a>
                    <a href="mailto:mzlatin4@gmail.com" class="social-icon"><i class="fas fa-envelope"></i></a>
                </div>` : ''}
        </section>
    `).join('');

    setupObserver();
}

// Logic to highlight nav and show sections on scroll
function setupObserver() {
    const sections = document.querySelectorAll('.about-section');
    const navLinks = document.querySelectorAll('.nav-pill');

    const options = { threshold: 0.4, rootMargin: "0px 0px -20% 0px" };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');

                // Update active nav link
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${entry.target.id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, options);

    sections.forEach(s => observer.observe(s));
}

// Scroll Effects
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

// Language Toggle
langButton.addEventListener('click', () => {
    currentLang = currentLang === 'EN' ? 'DE' : 'EN';
    render();
});

// Initial Init
render();