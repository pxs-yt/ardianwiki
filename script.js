const articles = [
    { title: "Artificial Intelligence", file: "artificial_intelligence.md" },
    { title: "Climate Change", file: "climate_change.md" },
    { title: "Famous Scientists", file: "famous_scientists.md" },
    { title: "Healthy Eating", file: "healthy_eating.md" },
    { title: "Internet History", file: "internet_history.md" },
    { title: "Introduction", file: "introduction.md" },
    { title: "Programming Languages", file: "programming_languages.md" },
    { title: "Renewable Energy", file: "renewable_energy.md" },
    { title: "Solar System", file: "solar_system.md" },
    { title: "World War II", file: "world_war_ii.md" },
    { title: "Quantum Mechanics", file: "quantum_mechanics.md" },
    { title: "The Amazon Rainforest", file: "amazon_rainforest.md" },
    { title: "The Internet", file: "the_internet.md" },
    { title: "Volcanology", file: "volcanology.md" },
];

// Populate sidebar with article links
const sidebar = document.querySelector('.sidebar');
articles.forEach(article => {
    const link = document.createElement('a');
    link.href = `#${article.file.replace('.md', '')}`;
    link.textContent = article.title;
    sidebar.appendChild(link);
});

// Load article based on hash
window.addEventListener('hashchange', loadArticle);
window.addEventListener('load', loadArticle);

function loadArticle() {
    const hash = window.location.hash.slice(1);
    if (hash) {
        const article = articles.find(a => a.file.replace('.md', '') === hash);
        if (article) {
            fetch(`articles/${article.file}`)
                .then(response => response.text())
                .then(markdown => {
                    document.getElementById('article-content').innerHTML = marked.parse(markdown);
                })
                .catch(() => {
                    document.getElementById('article-content').innerHTML = '<p>Article not found.</p>';
                });
        }
    } else {
        document.getElementById('article-content').innerHTML = '<h1>Welcome to ArdianWiki</h1><p>Select an article from the sidebar or use the search bar to find articles.</p>';
    }
}

// Search functionality
document.getElementById('search-input').addEventListener('input', () => {
    const query = document.getElementById('search-input').value.toLowerCase();
    const filteredArticles = articles.filter(article => article.title.toLowerCase().includes(query));
    displaySearchResults(filteredArticles);
});

function displaySearchResults(results) {
    const articleContent = document.getElementById('article-content');
    if (results.length > 0) {
        const html = `
            <h2>Search Results</h2>
            ${results.map(article => `
                <div class="result">
                    <a href="#${article.file.replace('.md', '')}">${article.title}</a>
                    <p>${article.snippet}</p>
                </div>
            `).join('')}
        `;
        articleContent.innerHTML = html;
    } else {
        articleContent.innerHTML = '<p>No articles found.</p>';
    }
}

// Toggle sidebar on all screen sizes
const hamburger = document.querySelector('.hamburger');
const closeSidebar = document.querySelector('.close-sidebar');

// Open the sidebar
hamburger.addEventListener('click', () => {
    sidebar.classList.add('open');
});

// Close the sidebar
closeSidebar.addEventListener('click', () => {
    sidebar.classList.remove('open');
});

// Close sidebar when clicking outside on all screen sizes
document.addEventListener('click', (event) => {
    const isClickInsideSidebar = sidebar.contains(event.target);
    const isClickOnHamburger = hamburger.contains(event.target);
    
    if (!isClickInsideSidebar && !isClickOnHamburger) {
        sidebar.classList.remove('open');
    }
});

// Prevent clicks inside the sidebar from closing it immediately
sidebar.addEventListener('click', (event) => {
    event.stopPropagation();
});

// Light/Dark Mode Toggle
const themeToggle = document.querySelector('.theme-toggle');

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    const isLightMode = document.body.classList.contains('light-mode');
    themeToggle.querySelector('i').classList.toggle('fa-sun', !isLightMode);
    themeToggle.querySelector('i').classList.toggle('fa-moon', isLightMode);
    localStorage.setItem('theme', isLightMode ? 'light' : 'dark');
});

// Load saved theme or default to dark mode
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') {
    document.body.classList.add('light-mode');
    themeToggle.querySelector('i').classList.remove('fa-sun');
    themeToggle.querySelector('i').classList.add('fa-moon');
}