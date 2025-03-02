const articles = [
    { title: "Introduction", category: "Introduction", file: "introduction.md" },

    { title: "Artificial Intelligence", category: "Artificial Intelligence", file: "artificial_intelligence.md" },

    { title: "Programming Languages", category: "Technology", file: "programming_languages.md" },
    { title: "Quantum Mechanics", category: "Technology", file: "quantum_mechanics.md" },
    { title: "The Internet", category: "Technology", file: "the_internet.md" },

    { title: "Famous Scientists", category: "Science", file: "famous_scientists.md" },
    { title: "Renewable Energy", category: "Science", file: "renewable_energy.md" },
    { title: "The Periodic Table", category: "Science", file: "the_periodic_table.md" },

    { title: "Climate Change", category: "Nature", file: "climate_change.md" },
    { title: "The Amazon Rainforest", category: "Nature", file: "amazon_rainforest.md" },
    { title: "Volcanology", category: "Nature", file: "volcanology.md" },
    { title: "Oceanography", category: "Nature", file: "oceanography.md" },

    { title: "Healthy Eating", category: "Wellbeing", file: "healthy_eating.md" },

    { title: "Solar System", category: "Space", file: "solar_system.md" },

    { title: "World War II", category: "War", file: "world_war_ii.md" },

    { title: "The Human Brain", category: "Biology", file: "the_human_brain.md" },

    { title: "Albania", category: "Countries", file: "Albania.md" },
    { title: "Italy", category: "Countries", file: "Italy.md" },
    { title: "Japan", category: "Countries", file: "Japan.md" },
    { title: "South Korea", category: "Countries", file: "South_Korea.md" },
    { title: "United States of America (USA)", category: "Countries", file: "United_States_of_America.md" },
    { title: "Germany", category: "Countries", file: "Germany.md" },
    
    { title: "Edi Rama", category: "Politicians", file: "Edi_Rama.md" },
    { title: "Donald Trump", category: "Politicians", file: "Donald_Trump.md" },
    { title: "Joe Biden", category: "Politicians", file: "Joe_Biden.md" },
    { title: "JD Vance", category: "Politicians", file: "JD_Vance.md" },

    { title: "Elon Musk", category: "Personalities", file: "Elon_Musk.md" },
    { title: "Bill Gates", category: "Personalities", file: "Bill_Gates.md" },
    { title: "Tim Cook", category: "Personalities", file: "Tim_Cook.md" },
    { title: "Steve Jobs", category: "Personalities", file: "Steve_Jobs.md" },
    { title: "Tim Sweeney", category: "Personalities", file: "Tim_Sweeney.md" },
    { title: "Satya Nadella", category: "Personalities", file: "Satya_Nadella.md" },

    { title: "Microsoft", category: "Tech Companies", file: "Microsoft.md" },
];

// Custom renderer for images (optional, for future content)
const renderer = new marked.Renderer();
renderer.image = function(href, title, text) {
    return `<figure><img src="${href}" alt="${text}" title="${title}" loading="lazy"><figcaption>${title || text}</figcaption></figure>`;
};
marked.setOptions({ renderer });

// Populate sidebar with collapsible subcategories
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

    const categoryHeader = document.createElement('div');
    categoryHeader.className = 'category-header';
    categoryHeader.innerHTML = `<h4>${category}</h4><i class="fas fa-chevron-down"></i>`;
    categoryDiv.appendChild(categoryHeader);

    const categoryContent = document.createElement('div');
    categoryContent.className = 'category-content';

    const ul = document.createElement('ul');
    categories[category].forEach(article => {
        const li = document.createElement('li');
        const link = document.createElement('a');
        link.href = `#${article.file.replace('.md', '')}`;
        link.textContent = article.title;
        li.appendChild(link);
        ul.appendChild(li);
    });
    categoryContent.appendChild(ul);
    categoryDiv.appendChild(categoryContent);
    sidebar.appendChild(categoryDiv);

    categoryHeader.addEventListener('click', () => {
        const isExpanded = categoryContent.classList.toggle('expanded');
        categoryHeader.classList.toggle('expanded', isExpanded);
    });
}

// Load article or home screen based on hash
window.addEventListener('hashchange', loadArticle);
window.addEventListener('load', loadArticle);

function loadArticle() {
    const hash = window.location.hash.slice(1);
    if (hash) {
        const article = articles.find(a => a.file.replace('.md', '') === hash);
        if (article) {
            // Placeholder for fetching article content (assumes Markdown files in an 'articles' folder)
            fetch(`articles/${article.file}`)
                .then(response => response.text())
                .then(markdown => {
                    document.getElementById('article-content').innerHTML = marked.parse(markdown);
                })
                .catch(() => {
                    document.getElementById('article-content').innerHTML = `<h1>${article.title}</h1><p>${article.snippet}</p>`;
                });
        }
    } else {
        const totalArticles = articles.length;
        const totalSubcategories = Object.keys(categories).length;
        document.getElementById('article-content').innerHTML = `
            <h1>Welcome to ArdianWiki</h1>
            <p>Select an article from the sidebar or use the search bar to find articles.</p>
            <div class="home-stats">Total Articles: ${totalArticles} | Total Subcategories: ${totalSubcategories}</div>
        `;
    }
}

// Search functionality
document.getElementById('search-input').addEventListener('input', () => {
    const query = document.getElementById('search-input').value.trim().toLowerCase();
    const results = articles.filter(article => article.title.toLowerCase().includes(query));
    displaySearchResults(results);
});

function displaySearchResults(results) {
    const articleContent = document.getElementById('article-content');
    if (results.length > 0) {
        const html = `
            <div class="search-results">
                <h2>Search Results</h2>
                ${results.map(article => `
                    <div class="result">
                        <a href="#${article.file.replace('.md', '')}">${article.title}</a>
                        <p>${article.snippet || 'undefined'}</p>
                    </div>
                `).join('')}
            </div>
        `;
        articleContent.innerHTML = html;
    } else {
        articleContent.innerHTML = '<p>No articles found.</p>';
    }
}

// Toggle sidebar
const hamburger = document.querySelector('.hamburger');
const closeSidebar = document.querySelector('.close-sidebar');

hamburger.addEventListener('click', () => {
    sidebar.classList.add('open');
});

closeSidebar.addEventListener('click', () => {
    sidebar.classList.remove('open');
});

document.addEventListener('click', (event) => {
    if (!sidebar.contains(event.target) && !hamburger.contains(event.target)) {
        sidebar.classList.remove('open');
    }
});

sidebar.addEventListener('click', (event) => {
    event.stopPropagation();
});

// Theme toggle
const themeToggle = document.querySelector('.theme-toggle');
const themeIcon = document.getElementById('theme-icon');

themeToggle.addEventListener('click', toggleTheme);
themeToggle.addEventListener('touchend', toggleTheme, { passive: true });

function toggleTheme(event) {
    event.preventDefault();
    const currentTheme = document.body.className || 'dark-mode';
    let newTheme;

    switch (currentTheme) {
        case 'dark-mode':
            newTheme = 'light-mode';
            themeIcon.className = 'fas fa-moon';
            break;
        case 'light-mode':
            newTheme = 'paper-mode';
            themeIcon.className = 'fas fa-leaf';
            break;
        case 'paper-mode':
            newTheme = 'dark-mode';
            themeIcon.className = 'fas fa-sun';
            break;
    }

    document.body.className = newTheme;
    localStorage.setItem('theme', newTheme);
}

// Load saved theme
const savedTheme = localStorage.getItem('theme') || 'dark-mode';
document.body.className = savedTheme;
if (savedTheme === 'light-mode') {
    themeIcon.className = 'fas fa-moon';
} else if (savedTheme === 'paper-mode') {
    themeIcon.className = 'fas fa-leaf';
} else {
    themeIcon.className = 'fas fa-sun';
}

// Image modal handling
document.getElementById('article-content').addEventListener('click', (e) => {
    if (e.target.tagName === 'IMG' && e.target.closest('figure')) {
        const img = e.target;
        const caption = img.nextElementSibling ? img.nextElementSibling.textContent : '';
        document.getElementById('modal-image').src = img.src;
        document.getElementById('modal-caption').textContent = caption;
        document.getElementById('image-modal').style.display = 'flex';
    }
});

document.querySelector('.close-modal').addEventListener('click', () => {
    document.getElementById('image-modal').style.display = 'none';
});

document.getElementById('image-modal').addEventListener('click', (e) => {
    if (e.target === document.getElementById('image-modal')) {
        document.getElementById('image-modal').style.display = 'none';
    }
});