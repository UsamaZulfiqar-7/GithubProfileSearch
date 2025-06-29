const APIURL = 'https://api.github.com/users/';

const main = document.getElementById('main');
const form = document.getElementById('form');
const search = document.getElementById('search');
const modeToggle = document.getElementById('modeToggle');

// Fetch GitHub user data
async function getUser(username) {
  main.innerHTML = '<h2>Loading...</h2>';
  try {
    const { data } = await axios(APIURL + username);
    createUserCard(data);
    getRepos(username);
  } catch (err) {
    if (err.response && err.response.status === 404) {
      createErrorCard('No profile with this username');
    } else {
      createErrorCard('Error fetching profile');
    }
  }
}

// Fetch repositories
async function getRepos(username) {
  try {
    const { data } = await axios(APIURL + username + '/repos?sort=created');
    addReposToCard(data);
  } catch (err) {
    createErrorCard('Problem fetching repos');
  }
}

// Create user card
function createUserCard(user) {
  const userID = user.name || user.login;
  const userBio = user.bio ? `<p>${user.bio}</p>` : '';
  const cardHTML = `
    <a href="${user.html_url}" target="_blank" style="text-decoration: none;">
      <div class="card">
        <div>
          <img src="${user.avatar_url}" alt="${user.name}" class="avatar">
        </div>
        <div class="user-info">
          <h2>${userID}</h2>
          ${userBio}
          <ul>
            <li>${user.followers} <strong>Followers</strong></li>
            <li>${user.following} <strong>Following</strong></li>
            <li>${user.public_repos} <strong>Repos</strong></li>
          </ul>
          <div id="repos"></div>
        </div>
      </div>
    </a>
  `;
  main.innerHTML = cardHTML;
}

// Error card
function createErrorCard(msg) {
  const cardHTML = `
    <div class="card">
      <h1>${msg}</h1>
    </div>
  `;
  main.innerHTML = cardHTML;
}

// Add repos to card
function addReposToCard(repos) {
  const reposEl = document.getElementById('repos');
  repos
    .slice(0, 5)
    .forEach(repo => {
      const repoEl = document.createElement('a');
      repoEl.classList.add('repo');
      repoEl.href = repo.html_url;
      repoEl.target = '_blank';
      repoEl.innerText = repo.name;
      reposEl.appendChild(repoEl);
    });
}

// Form submission
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const user = search.value.trim();
  if (user) {
    getUser(user);
    search.value = '';
  }
});

// Theme toggle
document.body.classList.add('light');
modeToggle.textContent = '🌙 Night Mode';

modeToggle.addEventListener('click', () => {
  if (document.body.classList.contains('light')) {
    document.body.classList.remove('light');
    document.body.classList.add('night');
    modeToggle.textContent = '☀️ Light Mode';
  } else {
    document.body.classList.remove('night');
    document.body.classList.add('light');
    modeToggle.textContent = '🌙 Night Mode';
  }
});
// Load particles config
particlesJS('particles-js', {
  particles: {
    number: { value: 80, density: { enable: true, value_area: 800 } },
    color: { value: "#ffffff" },
    shape: { type: "circle", stroke: { width: 0, color: "#000000" } },
    opacity: { value: 0.5 },
    size: { value: 3, random: true },
    line_linked: { enable: true, distance: 150, color: "#ffffff", opacity: 0.4, width: 1 },
    move: { enable: true, speed: 12, direction: "none", out_mode: "out" }
  },
  interactivity: {
    detect_on: "canvas",
    events: {
      onhover: { enable: true, mode: "repulse" },
      onclick: { enable: true, mode: "push" }
    },
    modes: {
      repulse: { distance: 100, duration: 0.4 },
      push: { particles_nb: 4 }
    }
  },
  retina_detect: true
});
