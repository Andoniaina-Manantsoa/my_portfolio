const projectsGrid = document.querySelector("#projects-grid");
const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector(".nav-menu");
const navLinks = [...document.querySelectorAll(".nav-menu a")];
const sections = [...document.querySelectorAll("main section[id]")];

function renderProjects(projects) {
  projectsGrid.innerHTML = projects.map((project) => `
    <article class="project-card reveal">
      <div class="project-top">
        <span class="project-badge" style="background:${project.color};">${project.badge}</span>
        <a class="project-link" href="${project.link}" aria-label="Voir le projet ${project.title}">Voir plus</a>
      </div>
      <h3>${project.title}</h3>
      <p>${project.description}</p>
      <div class="project-tags">
        ${project.tags.map((tag) => `<span>${tag}</span>`).join("")}
      </div>
    </article>
  `).join("");
}

async function loadProjects() {
  try {
    const response = await fetch("projects.json");

    if (!response.ok) {
      throw new Error("Impossible de charger les projets.");
    }

    const projects = await response.json();
    renderProjects(projects);
  } catch (error) {
    projectsGrid.innerHTML = `
      <article class="project-card">
        <h3>Projets indisponibles</h3>
        <p>Le fichier JSON n'a pas pu être chargé. Vérifie que le portfolio est lancé depuis un serveur local.</p>
      </article>
    `;
  }
}

function setupRevealAnimation() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.18
  });

  document.querySelectorAll(".reveal").forEach((item) => observer.observe(item));
}

function toggleMenu() {
  const isOpen = navMenu.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
}

function closeMenu() {
  navMenu.classList.remove("is-open");
  navToggle.setAttribute("aria-expanded", "false");
}

function updateActiveLink() {
  const scrollPosition = window.scrollY + 120;

  sections.forEach((section) => {
    const start = section.offsetTop;
    const end = start + section.offsetHeight;
    const id = section.getAttribute("id");
    const matchingLink = navLinks.find((link) => link.getAttribute("href") === `#${id}`);

    if (!matchingLink) {
      return;
    }

    if (scrollPosition >= start && scrollPosition < end) {
      navLinks.forEach((link) => link.classList.remove("is-active"));
      matchingLink.classList.add("is-active");
    }
  });
}

async function init() {
  await loadProjects();
  setupRevealAnimation();
  updateActiveLink();

  navToggle.addEventListener("click", toggleMenu);
  navLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  window.addEventListener("scroll", updateActiveLink, { passive: true });
  window.addEventListener("resize", () => {
    if (window.innerWidth > 760) {
      closeMenu();
    }
  });
}

init();
