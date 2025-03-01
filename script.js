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
    { title: "The Human Brain", file: "the_human_brain.md" },
    { title: "The Periodic Table", file: "the_periodic_table.md" },
    { title: "Oceanography", file: "oceanography.md" },
];

// Populate sidebar with subcategories and articles
const sidebar = document.querySelector('.sidebar');
const categories = {};

articles.forEach(article => {
    if (!categories[article.category]) {
        categories[article.category] = [];
    }
    categories[article.category].push(article);
});

for (const category in categories) {
    const categoryDiv = document.createElement('div');
    categoryDiv.className = 'category';
    
    const categoryHeader = document.createElement('h4');
    categoryHeader.textContent = category;
    categoryDiv.appendChild(categoryHeader);

    const ul = document.createElement('ul');
    categories[category].forEach(article => {
        const li = document.createElement('li');
        const link = document.createElement('a');
        link.href = `#${article.file.replace('.md', '')}`;
        link.textContent = article.title;
        li.appendChild(link);
        ul.appendChild(li);
    });
    categoryDiv.appendChild(ul);
    sidebar.appendChild(categoryDiv);
}

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

// Light/Dark/Paper Mode Toggle
const themeToggle = document.querySelector('.theme-toggle');
const themeIcon = document.getElementById('theme-icon');

themeToggle.addEventListener('click', () => {
    const currentTheme = document.body.className;
    let newTheme;

    if (currentTheme === '') {
        newTheme = 'light-mode';
        themeIcon.className = 'fas fa-moon'; // Moon for light mode
    } else if (currentTheme === 'light-mode') {
        newTheme = 'paper-mode';
        themeIcon.className = 'fas fa-leaf'; // Leaf for paper mode
    } else if (currentTheme === 'paper-mode') {
        newTheme = '';
        themeIcon.className = 'fas fa-sun'; // Sun for dark mode
    }

    document.body.className = newTheme;
    localStorage.setItem('theme', newTheme);
});

// Load saved theme or default to dark mode
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    document.body.className = savedTheme;
    if (savedTheme === 'light-mode') {
        themeIcon.className = 'fas fa-moon';
    } else if (savedTheme === 'paper-mode') {
        themeIcon.className = 'fas fa-leaf';
    }
} else {
    themeIcon.className = 'fas fa-sun'; // Default to dark mode
}