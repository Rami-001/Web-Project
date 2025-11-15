document.addEventListener("DOMContentLoaded", function () {
  const servicesLink = document.querySelector(".dropdown a");
  const dropdownMenu = document.querySelector(".dropdown-content");
  if (!servicesLink || !dropdownMenu) return;
  let hideTimeout;
  let isMobile = window.innerWidth <= 960;
  // Detect screen size changes
  window.addEventListener("resize", () => {
    isMobile = window.innerWidth <= 960;
  });
  // Hover to show (desktop)
  servicesLink.addEventListener("mouseenter", () => {
    if (!isMobile) {
      clearTimeout(hideTimeout);
      dropdownMenu.classList.add("visible");
    }
  });
  // Hover out to hide (desktop)
  servicesLink.addEventListener("mouseleave", () => {
    if (!isMobile) {
      hideTimeout = setTimeout(
        () => dropdownMenu.classList.remove("visible"),
        500
      );
    }
  });
  // Keep open while hovering dropdown (desktop)
  dropdownMenu.addEventListener("mouseenter", () => {
    if (!isMobile) {
      clearTimeout(hideTimeout);
      dropdownMenu.classList.add("visible");
    }
  });
  // Hide when leaving dropdown (desktop)
  dropdownMenu.addEventListener("mouseleave", () => {
    if (!isMobile) {
      hideTimeout = setTimeout(
        () => dropdownMenu.classList.remove("visible"),
        500
      );
    }
  });
  // Toggle dropdown on click (mobile) and go to page on second click
  let dropdownOpenedOnce = false;
  servicesLink.addEventListener("click", (e) => {
    // If dropdown not visible → show it
    if (!dropdownMenu.classList.contains("visible")) {
      e.preventDefault();
      dropdownMenu.classList.add("visible");
      dropdownOpenedOnce = true;
      return;
    }
    // If dropdown already visible → navigate
    if (dropdownOpenedOnce) {
      window.location.href = "services.html"; // <-- Change this to your real Services page
    }
  });
  // Close dropdown when clicking outside
  document.addEventListener("click", (e) => {
    if (!servicesLink.contains(e.target) && !dropdownMenu.contains(e.target)) {
      dropdownMenu.classList.remove("visible");
      dropdownOpenedOnce = false;
    }
  });
  // Close dropdown with Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      dropdownMenu.classList.remove("visible");
      dropdownOpenedOnce = false;
    }
  });
});

// Sample services data
let services = [
  {
    "category": "Health & Safety",
    "image": "https://mzv.gov.cz/public/51/c7/97/5046259_3040778_Rafic_Hariri_Hospital.jpg",
    "name": "Rafic Hariri University Hospital",
    "description": "Lebanon's largest public hospital and COVID-19 referral center with emergency services, ICU, and specialized medical departments.",
    "country": "Lebanon",
    "city": "Beirut",
    "Schedule": "24/7 Emergency",
    "contact_information": "Phone: +961-1-830000 | Emergency: 125 | Address: Bir Hassan, Beirut"
  },
  {
    "category": "Health & Safety",
    "image": "https://executive-bulletin.com/wp-content/uploads/2024/04/AUBMC.jpg",
    "name": "American University of Beirut Medical Center (AUBMC)",
    "description": "Leading academic medical center with advanced emergency care, specialized surgeries, and international patient services.",
    "country": "Lebanon",
    "city": "Beirut",
    "Schedule": "24/7 Emergency",
    "contact_information": "Phone: +961-1-350000 | Emergency: +961-1-350350 | Address: Bliss Street, Beirut"
  },
  {
    "category": "Health & Safety",
    "image": "https://upload.wikimedia.org/wikipedia/commons/f/ff/CMC_Building_Photo_by_K%26A-JPEG.jpg",
    "name": "Clemenceau Medical Center Network",
    "description": "Advanced medical facilities affiliated with Johns Hopkins Medicine offering specialized treatments across multiple cities.",
    "country": "Lebanon",
    "city": "Beirut,Jounieh",
    "Schedule": "24/7 Emergency",
    "contact_information": "Beirut: +961-1-373737 | Jounieh: +961-9-636363 | Emergency: +961-1-373750"
  },
  {
    "category": "Finance",
    "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEcgQ12nZpU9JK0S4X3_-n5GFKUTegqXvM5Q&s",
    "name": "BankMed",
    "description": "Full-service banking with foreign currency exchange, international transfers, and extensive branch network across Lebanon.",
    "country": "Lebanon",
    "city": "Beirut,Jounieh,Saida,Tripoli,Zahle",
    "Schedule": {
      "Monday-Thursday": "8:30 AM - 2:30 PM",
      "Friday": "8:30 AM - 1:30 PM",
      "Saturday-Sunday": "Closed"
    },
    "contact_information": "Head Office: +961-1-340340 | Customer Service: 1260 | Branches nationwide"
  },
  {
    "category": "Finance",
    "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcToF2qERD7L_HYtAekpIzaQHvPLV1rr4i5tyg&s",
    "name": "Bank Audi",
    "description": "Major Lebanese bank offering comprehensive financial services including currency exchange, credit cards, and international banking.",
    "country": "Lebanon",
    "city": "Beirut,Jounieh,Saida,Tripoli,Zahle,Byblos",
    "Schedule": {
      "Monday-Thursday": "8:30 AM - 3:00 PM",
      "Friday": "8:30 AM - 1:00 PM",
      "Saturday-Sunday": "Closed"
    },
    "contact_information": "Head Office: +961-1-977200 | Customer Service: 1262 | 85+ branches nationwide"
  },
  {
    "category": "Finance",
    "image": "https://i0.wp.com/bourjhamoud.com/wp-content/uploads/2017/08/Blom-bank.jpg?fit=800%2C800&ssl=1",
    "name": "BLOM Bank",
    "description": "Leading commercial bank with reliable currency exchange services and extensive branch network throughout Lebanon.",
    "country": "Lebanon",
    "city": "Beirut,Jounieh,Saida,Tripoli,Zahle,Byblos,Nabatieh",
    "Schedule": {
      "Monday-Thursday": "8:30 AM - 2:30 PM",
      "Friday": "8:30 AM - 1:30 PM",
      "Saturday-Sunday": "Closed"
    },
    "contact_information": "Head Office: +961-1-738738 | Customer Service: 1261 | 90+ branches nationwide"
  },
  {
    "category": "Finance",
    "image": "https://pbs.twimg.com/media/ETYtuAOWsAIB9HG.jpg",
    "name": "Fransabank",
    "description": "Reliable banking services with foreign currency accounts, remittances, and corporate banking solutions across Lebanon.",
    "country": "Lebanon",
    "city": "Beirut,Jounieh,Saida,Tripoli,Zahle,Byblos,Tyre",
    "Schedule": {
      "Monday-Thursday": "8:30 AM - 2:00 PM",
      "Friday": "8:30 AM - 12:30 PM",
      "Saturday-Sunday": "Closed"
    },
    "contact_information": "Head Office: +961-1-333111 | Customer Service: 1265 | 80+ branches nationwide"
  },
  {
    "category": "Finance",
    "image": "https://lh3.googleusercontent.com/gps-cs-s/AG0ilSzuJpQEL6IKp9ETwts1Z4BC-cDt74MTTsmf84HXmHM9SuuY1oP-O1WOKlnOAsHhuiah89mIwRH4k2EjWv3y5GMhWV4udVjw27rNJv7jdvjB4Ub2XRD4d4cvxzo8KYd3vBG09Mc=s680-w680-h510-rw",
    "name": "Halabi Exchange & Transfer",
    "description": "Licensed money exchange service offering competitive USD/LBP rates with international money transfer capabilities.",
    "country": "Lebanon",
    "city": "Beirut,Jounieh,Saida,Tripoli",
    "Schedule": {
      "Monday-Friday": "9:00 AM - 5:00 PM",
      "Saturday": "9:00 AM - 2:00 PM",
      "Sunday": "Closed"
    },
    "contact_information": "Beirut: +961-1-740000 | Jounieh: +961-9-636000 | Saida: +961-7-720000 | Tripoli: +961-6-411111"
  },
  {
    "category": "Sustenance & Lodging",
    "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS827y_R2jhZ8GJzrUp7sbwZ3QENpmFAUOJLA&s",
    "name": "Malak al Tawouk",
    "description": "Popular Lebanese fast-food chain famous for shawarma, grilled chicken, and traditional Lebanese sandwiches.",
    "country": "Lebanon",
    "city": "Beirut,Jounieh,Saida,Tripoli,Zahle,Byblos",
    "Schedule": {
      "Monday-Saturday": "10:00 AM - 2:00 AM",
      "Sunday": "11:00 AM - 1:00 AM"
    },
    "contact_information": "Beirut: +961-1-740111 | Jounieh: +961-9-636111 | Delivery: +961-71-444555"
  },
  {
    "category": "Sustenance & Lodging",
    "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKLI0G1hgFglirnNwnVeYRTNgfmJXxlEuK6Q&s",
    "name": "Roadster Diner",
    "description": "American-style diner chain serving burgers, sandwiches, and milkshakes in retro atmosphere across Lebanon.",
    "country": "Lebanon",
    "city": "Beirut,Jounieh,Saida,Tripoli,Zahle,Byblos",
    "Schedule": {
      "Sunday-Thursday": "7:00 AM - 2:00 AM",
      "Friday-Saturday": "24 Hours"
    },
    "contact_information": "Delivery: 1700 | Beirut: +961-1-739999 | Jounieh: +961-9-636999"
  },
  {
    "category": "Sustenance & Lodging",
    "image": "https://lh3.googleusercontent.com/p/AF1QipOgPrqjAwNPUyiBUb3Pg3VA-J91ZQnRyYhvLwOB=s680-w680-h510-rw",
    "name": "Le Royal Hotels & Resorts",
    "description": "Luxury hotel chain with properties in major Lebanese cities, offering premium accommodations and services.",
    "country": "Lebanon",
    "city": "Beirut,Jounieh,Zahle",
    "Schedule": "24/7 Reception",
    "contact_information": "Beirut: +961-1-791111 | Jounieh: +961-9-636363 | Zahle: +961-8-800800 | Reservations: +961-1-791000"
  },
  {
    "category": "Sustenance & Lodging",
    "image": "https://www.ahstatic.com/photos/b8w7_ho_00_p_1024x768.jpg",
    "name": "Mövenpick Hotel & Resorts",
    "description": "International hotel chain with beachfront and city-center properties offering luxury accommodations.",
    "country": "Lebanon",
    "city": "Beirut,Jounieh",
    "Schedule": "24/7 Reception",
    "contact_information": "Beirut: +961-1-869666 | Jounieh: +961-9-636666 | Reservations: +961-1-869667"
  },
  {
  "category": "Sustenance & Lodging",
  "image": "https://cafeyounes.com/cdn/shop/files/CY-Badaro-1.jpg?v=1652082942&width=1067",
  "name": "Café Younes",
  "description": "Historic Lebanese coffee roaster and café chain serving premium Arabic coffee, espresso, and traditional pastries since 1935.",
  "country": "Lebanon",
  "city": "Beirut,Jounieh,Saida",
  "Schedule": {
    "Monday-Sunday": "7:00 AM - 12:00 AM"
  },
  "contact_information": "Beirut: +961-1-738888 | Jounieh: +961-9-636888 | Saida: +961-7-725888 | Online Orders: +961-71-888999"
},
  {
    "category": "Sustenance & Lodging",
    "image": "https://lh3.googleusercontent.com/p/AF1QipPrDQ-iNJMgX4eMb0VllLzJnW-GKN87ySC2kulh=s680-w680-h510-rw",
    "name": "Le Crillon Restaurants",
    "description": "Fine dining restaurant chain offering French and Lebanese cuisine with extensive wine list across major cities.",
    "country": "Lebanon",
    "city": "Beirut,Jounieh,Zahle",
    "Schedule": {
      "Monday-Saturday": "12:00 PM - 11:30 PM",
      "Sunday": "12:00 PM - 10:00 PM"
    },
    "contact_information": "Beirut: +961-1-737373 | Jounieh: +961-9-636373 | Zahle: +961-8-800373"
  },
  {
    "category": "Health & Safety",
    "image": "https://www.globalgiftfoundation.org/wp-content/uploads/2022/01/croix-rouge-libanaise-logo.png",
    "name": "Lebanese Red Cross",
    "description": "Emergency medical services and ambulance network covering all Lebanese territories with 24/7 emergency response.",
    "country": "Lebanon",
    "city": "Beirut,Jounieh,Saida,Tripoli,Zahle,Byblos,Nabatieh,Tyre,Baalbek",
    "Schedule": "24/7 Emergency",
    "contact_information": "Emergency: 140 | Headquarters: +961-1-372802 | All regions covered"
  },
  {
    "category": "Finance",
    "image": "https://ir-omt-s3-media.s3.eu-west-1.amazonaws.com/informative/news/NZttgw4IalM0gCvCGhMbxJtQS.jpg",
    "name": "OMT Money Transfer",
    "description": "Leading money transfer service with branches in all major Lebanese cities for domestic and international transfers.",
    "country": "Lebanon",
    "city": "Beirut,Jounieh,Saida,Tripoli,Zahle,Byblos,Nabatieh,Tyre,Baalbek",
    "Schedule": {
      "Monday-Saturday": "8:00 AM - 6:00 PM",
      "Sunday": "9:00 AM - 2:00 PM"
    },
    "contact_information": "Customer Service: 1215 | Beirut: +961-1-999999 | Branches in all major cities"
  },
  {
    "category": "Sustenance & Lodging",
    "image": "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2c/32/d5/e3/exterior.jpg?w=900&h=500&s=1",
    "name": "Rotana Hotels",
    "description": "Luxury hotel chain with properties in key Lebanese cities offering international standards of hospitality.",
    "country": "Lebanon",
    "city": "Beirut,Jounieh",
    "Schedule": "24/7 Reception",
    "contact_information": "Beirut: +961-1-737777 | Jounieh: +961-9-636777 | Reservations: +961-1-737778"
  }
];
// ================================
// Utility Functions
// ================================
function load() {
  let raw = localStorage.getItem("services");
  return raw ? JSON.parse(raw) : services;
}
function save(services) {
  localStorage.setItem("services", JSON.stringify(services));
}
// ================================
// Rendering
// ================================
function render(list = load()) {
  let container = document.getElementById("services-by-category");
  container.innerHTML = "";
  //  If no results
  if (!list || list.length === 0) {
    container.innerHTML = `
    <div class="no-results">
      <p>🔍 No matching services found.</p>
    </div>
  `;
    return;
  }
  let favIds = JSON.parse(localStorage.getItem("favIds")) || [];
  list.forEach((s) => {
    let isFavorite = favIds.includes(s.name);
    let card = document.createElement("div");
    card.className = "service-card";
    card.innerHTML = `
      <img src="${s.image}" alt="${s.name}">
      <div class="card-content">
        <h2>${s.name}</h2>
        <span class="heart-icon ${isFavorite ? 'favorited' : ''}" data-servicename="${s.name}">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="${isFavorite ? '#ff6b6b' : 'none'}" stroke="${isFavorite ? '#ff6b6b' : '#ccc'}" stroke-width="2">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        </span>
        <ul><strong>Country:</strong> ${s.country}</ul>
        <ul><strong>City:</strong> ${s.city}</ul>
        <ul><strong>Schedule:</strong> ${typeof s.Schedule === "object" ? Object.entries(s.Schedule) .map(([day, time]) => `${day}: ${time}`) .join(", ") : s.Schedule}</ul>
        <p>${s.description}</p>
        <p><strong>Contact:</strong> ${s.contact_information}</p>
      </div>
    `;
    if (isFavorite) card.classList.add("favorite-card");
    container.appendChild(card);
  });
  document.querySelectorAll(".heart-icon").forEach((heart) => {
    heart.addEventListener("click", function () {
      let serviceName = this.getAttribute("data-servicename");
      toggleFavorite(serviceName);
    });
  });
}
// ================================
// Filtering + Sorting
// ================================
function filter() {
  let allServices = load();
  let favIds = JSON.parse(localStorage.getItem("favIds")) || [];
  let searchValue = document.getElementById("searchInput").value.toLowerCase();
  let sortValue = document.getElementById("sortSelect").value || "";
  let categoryValue = document.getElementById("filter-category").value;
  let cityValue = document.getElementById("filter-city").value;
  let filtered = allServices.filter((s) =>
    s.name.toLowerCase().includes(searchValue)
  );
  if (categoryValue && categoryValue !== "All") {
    filtered = filtered.filter((s) => s.category === categoryValue);
  }
  if (cityValue && cityValue !== "All") {
    filtered = filtered.filter((s) =>
      s.city.toLowerCase().includes(cityValue.toLowerCase())
    );
  }
  if (sortValue === "name-asc") {
    filtered.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortValue === "name-desc") {
    filtered.sort((a, b) => b.name.localeCompare(a.name));
  }
  render(filtered);
}
// ================================
// Favorites
// ================================
function toggleFavorite(serviceName) {
  let favIds = JSON.parse(localStorage.getItem("favIds")) || [];
  if (favIds.includes(serviceName)) {
    favIds = favIds.filter((n) => n !== serviceName);
  } else {
    favIds.push(serviceName);
  }
  localStorage.setItem("favIds", JSON.stringify(favIds));
  filter();
}
document.getElementById("searchInput").addEventListener("input", filter);
document.getElementById("sortSelect").addEventListener("change", filter);
document.getElementById("filter-category").addEventListener("change", filter);
document.getElementById("filter-city").addEventListener("change", filter);
let clearbtn=document.querySelector(".clear-filters");
if(clearbtn){
  clearbtn.addEventListener("click", function () {
    document.getElementById("searchInput").value = "";
    document.getElementById("filter-category").value = "All";
    document.getElementById("filter-city").value = "All";
    document.getElementById("sortSelect").value = "";
    filter();
  });
}
render();