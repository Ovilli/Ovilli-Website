const hero = document.querySelector('.icon-text-row');
const nav = document.getElementById('about-nav');
const content = document.querySelector('.about-content');
const langButton = document.getElementById('lang-toggle');
let currentLang = 'EN';
const scrollThreshold = 100;

const translations = {
    EN: {
        nav: { about: "About", aboutMe: "Me", gaming: "Gaming", tech: "Tech", music: "Music", contact: "Contact" },
        content: {
            about: "Hey. I spend most of my time bouncing between code, games, and a good playlist. I like things simple, functional, and authentic. That's exactly what this site is all about.",
            gaming: "Gaming is my reset button. I gravitate toward strong mechanics and immersive worlds — the kind of games that stick with you long after you log off. Whether it's a clever indie or a massive RPG, if it's well-crafted, I'm playing it.",
            tech: "I like building things. Sometimes to solve a problem, sometimes just to see if I can pull it off. I care about clean code, practical tools, and how tech actually improves our daily lives, way beyond the latest hype.",
            music: "There's always a soundtrack to my day. Music sets the tone whether I'm deep in a codebase, gaming, or just chilling. My taste is all over the place, but the vibe always has to be right.",
            contact: "If something here resonates with you, feel free to reach out. I'm always up for a good chat about projects, ideas, or just swapping recommendations."
        }
    },
    DE: {
        nav: { about: "Über", aboutMe: "Ich", gaming: "Gaming", tech: "Tech", music: "Musik", contact: "Kontakt" },
        content: {
            about: "Hey. Ich verbringe die meiste Zeit irgendwo zwischen Code, Games und einer guten Playlist. Ich mag es simpel, funktional und authentisch. Genau darum geht es auf dieser Seite.",
            gaming: "Zocken ist für mich der perfekte Ausgleich. Ich stehe auf clevere Mechaniken und Welten, in denen man sich verlieren kann – Spiele, die im Kopf bleiben, auch wenn der PC schon aus ist. Egal ob kleines Indie-Game oder riesiges RPG: Wenn es gut gemacht ist, bin ich dabei.",
            tech: "Ich baue gerne Dinge. Manchmal, weil ich sie selbst brauche, und manchmal einfach, um zu sehen, ob es klappt. Mir geht es um sauberen Code, praktische Tools und darum, wie Technik den Alltag wirklich besser macht – ganz ohne den ganzen Hype.",
            music: "Bei mir läuft eigentlich immer Musik. Sie gibt den Takt vor, egal ob ich programmiere, zocke oder einfach nur abschalte. Mein Geschmack ist ziemlich breit gefächert, aber der Vibe muss einfach stimmen.",
            contact: "Wenn dich hier irgendwas anspricht, meld dich einfach. Ich bin immer offen für einen Austausch über Projekte, Ideen oder auch einfach gute Empfehlungen."
        }
    }
};

function renderNav(){
    nav.innerHTML = `<span class="nav-brand">${translations[currentLang].nav.about}</span>` +
        Object.entries(translations[currentLang].nav).filter(([key])=>key!=="about").map(([key,val])=>
            `<a class="nav-pill" href="#${key}">${val}</a>`).join('');
}

function renderContent(){
    content.innerHTML = Object.entries(translations[currentLang].content).map(([key,val])=>
        `<div class="about-section" id="${key}">
            <h4>${translations[currentLang].nav[key] || key}</h4>
            <p>${val}</p>
            ${key==="contact"?`<div class="socials">
                <a href="https://github.com/ovilli" target="_blank" class="social-icon"><i class="fab fa-github"></i></a>
                <a href="mailto:mzlatin4@gmail.com" class="social-icon"><i class="fas fa-envelope"></i></a>
            </div>`:''}
        </div>`).join('');
}

function updateLanguage(){
    renderNav();
    renderContent();
    updateVisibility();
    observeSections();
}

function observeSections(){
    const sections = document.querySelectorAll('.about-section');
    const navLinks = document.querySelectorAll('#about-nav a.nav-pill');
    const observer = new IntersectionObserver(entries=>{
        entries.forEach(entry=>{
            const section = entry.target;
            const navLink = document.querySelector(`#about-nav a[href="#${section.id}"]`);
            if(entry.isIntersecting && window.scrollY > scrollThreshold){
                navLinks.forEach(l=>l.classList.remove('active'));
                if(navLink) navLink.classList.add('active');
            }
        });
    }, {threshold:0.5});
    sections.forEach(s=>observer.observe(s));
}

function updateVisibility(){
    const sections = document.querySelectorAll('.about-section');
    sections.forEach(section=>{
        const rect = section.getBoundingClientRect();
        if(window.scrollY > scrollThreshold && rect.top < window.innerHeight*0.75) section.classList.add('visible');
        else section.classList.remove('visible');
    });
}

window.addEventListener('scroll',()=>{
    if(window.scrollY>50) hero.classList.add('left'); else hero.classList.remove('left');
    if(window.scrollY>scrollThreshold) nav.classList.add('visible'); else nav.classList.remove('visible');
    updateVisibility();
});

langButton.addEventListener('click',()=>{
    currentLang = currentLang==='EN'?'DE':'EN';
    updateLanguage();
});

updateLanguage();