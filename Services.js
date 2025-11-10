document.addEventListener('DOMContentLoaded', function() {
  const servicesLink = document.querySelector('.dropdown a');
  const dropdownMenu = document.querySelector('.dropdown-content');
  if (!servicesLink || !dropdownMenu) return;
  let hideTimeout;
  let isMobile = window.innerWidth <= 960;
  // Detect screen size changes
  window.addEventListener('resize', () => {
    isMobile = window.innerWidth <= 960;
  });
  // Hover to show (desktop)
  servicesLink.addEventListener('mouseenter', () => {
    if (!isMobile) {
      clearTimeout(hideTimeout);
      dropdownMenu.classList.add('visible');
    }
  });
  // Hover out to hide (desktop)
  servicesLink.addEventListener('mouseleave', () => {
    if (!isMobile) {
      hideTimeout = setTimeout(() => dropdownMenu.classList.remove('visible'), 500);
    }
  });
  // Keep open while hovering dropdown (desktop)
  dropdownMenu.addEventListener('mouseenter', () => {
    if (!isMobile) {
      clearTimeout(hideTimeout);
      dropdownMenu.classList.add('visible');
    }
  });
  // Hide when leaving dropdown (desktop)
  dropdownMenu.addEventListener('mouseleave', () => {
    if (!isMobile) {
      hideTimeout = setTimeout(() => dropdownMenu.classList.remove('visible'), 500);
    }
  });
  // Toggle dropdown on click (mobile) and go to page on second click
  let dropdownOpenedOnce = false;
  servicesLink.addEventListener('click', (e) => {
    // If dropdown not visible → show it
    if (!dropdownMenu.classList.contains('visible')) {
      e.preventDefault();
      dropdownMenu.classList.add('visible');
      dropdownOpenedOnce = true;
      return;
    }
    // If dropdown already visible → navigate
    if (dropdownOpenedOnce) {
      window.location.href = 'services.html'; // <-- Change this to your real Services page
    }
  });
  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (!servicesLink.contains(e.target) && !dropdownMenu.contains(e.target)) {
      dropdownMenu.classList.remove('visible');
      dropdownOpenedOnce = false;
    }
  });
  // Close dropdown with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      dropdownMenu.classList.remove('visible');
      dropdownOpenedOnce = false;
    }
  });
});

// Sample services data
let services = [
  {
    "category":"Health & Safety",
    "image":"https://mzv.gov.cz/public/51/c7/97/5046259_3040778_Rafic_Hariri_Hospital.jpg",
    "name":"Rafic Hariri Hospital",
    "description":"This is an example service.",
    "country":"Lebanon",
    "city":"Beirut",
    "Schedule":"24/7",
    "contact_information":"phone: 123-456-7890"
  },
  {
    "category":"Finance",
    "image":"https://imcdn.org/uploads/2017/03/bankmed.gif",
    "name":"Bank Med",
    "description":"This is an example service.",
    "country":"Lebanon",
    "city":"Beirut,Saida,Aley.....",
    "Schedule":{
      "Mon–Thurs": "9am–3pm",
      "Fri": "8am–2pm",
      "Sat": "Closed",
      "Sun": "Closed",
      "Holidays": "Closed"
    },
    "contact_information":"phone: 123-456-7890"
  },
  {
    "category":"Sustenance & Lodging",
    "image":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS827y_R2jhZ8GJzrUp7sbwZ3QENpmFAUOJLA&s",
    "name":"Malak al Tawouk",
    "description":"This is an example service.",
    "country":"Lebanon",
    "city":"Beirut,Mount Lebanon,Saida......",
    "Schedule":{
      "Mon–Thurs": "9am–5pm",
      "Fri": "9am–3pm",
      "Sat": "Closed",
      "Sun": "Closed",
      "Holidays": "Closed"
    },
    "contact_information":"phone: 123-456-7890"
  }
]
let search=document.getElementById("searchInput");
function load() {
    let raw = localStorage.getItem("services");
    return raw ? JSON.parse(raw) : services; 
}
function save(services) {
    localStorage.setItem("services", JSON.stringify(services));
}
function render(list = load()) {
  let container = document.getElementById("service-container");
  container.innerHTML = "";
  let favIds = JSON.parse(localStorage.getItem("favIds")) || [];
  list.forEach((s) => {
    let isFavorite = favIds.includes(s.name);
    let card = document.createElement("div");
    card.className = "service-card";
    card.innerHTML = `
      <img src="${s.image}" alt="${s.name}">
      <div class="card-content">
        <h2>${s.name}</h2>
        <button class="favbtn" data-servicename="${s.name}">${isFavorite ? "Unfavorite" : "Favorite"}</button>
        <ul>Country: ${s.country}</ul>
        <ul>City: ${s.city}</ul>
        <ul>Schedule: ${typeof s.Schedule === "object" ? Object.entries(s.Schedule).map(([day, time]) => `${day}: ${time}`).join(", ") : s.Schedule}</ul>
        <p>${s.description}</p>
        <p><strong>Contact Information:</strong> ${s.contact_information}</p>
      </div>`;
    if (isFavorite) card.classList.add("favorite-card");
    container.appendChild(card);
  });
  document.querySelectorAll(".favbtn").forEach((button) => {
    button.addEventListener("click", function () {
      let serviceName = this.getAttribute("data-servicename");
      toggleFavorite(serviceName);
    });
  });
}
function filter() {
    let allServices = load();
    let favIds = JSON.parse(localStorage.getItem("favIds")) || [];
    let searchValue = document.getElementById("searchInput").value.toLowerCase();
    let sortValue = document.getElementById("sortSelect").value;
    let onlyFav = document.getElementById("onlyFavorites").checked;
    let filtered = allServices.filter(s=> s.name.toLowerCase().includes(searchValue));
    if (onlyFav) {
        filtered = filtered.filter(s => favIds.includes(s.name));
    }
     if (sortValue === "name-asc") {
        filtered.sort((a, b) => a.name.localeCompare(b.name));
    } 
    else if (sortValue === "name-desc") {
        filtered.sort((a, b) => b.name.localeCompare(a.name));
    } 
    render(filtered);
}
function toggleFavorite(serviceName) {
    let favIds = JSON.parse(localStorage.getItem("favIds")) || [];
    if (favIds.includes(serviceName)) {
        favIds = favIds.filter(n => n !== serviceName);
    } else {
        favIds.push(serviceName);
    }
    localStorage.setItem("favIds", JSON.stringify(favIds));
    filter();
}
search.addEventListener("input", filter);
document.getElementById("sortSelect").addEventListener("change", filter);
document.getElementById("onlyFavorites").addEventListener("change", filter);
render();