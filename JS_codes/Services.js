document.addEventListener("DOMContentLoaded", function () {
  let servicesLink = document.querySelector(".dropdown a");
  let dropdownMenu = document.querySelector(".dropdown-content");
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
// ================================
// Sample services data
// ================================
// id:1 ==> hospital
// id:2 ==> Pharmacy
// id:3 ==> Police Station
// id:4 ==> Bank
// id:5 ==> ATM
// id:6 ==> Money Exchanger
// id:7 ==> Resturant
// id:8 ==> Coffe Shop
//  id:9 ==> Hotel
//  id:10 ==>Money Transfer
//  id:11 ==> Medical Volunteers
$(document).ready(function () {
  let services = [];
  let citiesData = {};
  // ================================
  // Load JSON Data
  // ================================
  $.getJSON('../JS_codes/data.json', function (data) {
    services = data.services;
    citiesData = data.citiesData;
    // Initialize filters and render
    initApp();
  });
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
  function getUserPlan() {
    return (localStorage.getItem("userPlan") || "basic").toLowerCase();
  }
  function applyPlanRestrictions() {
    let isBasic = getUserPlan() === "basic";
    let $filterCity = $("#filter-city");
    let $filterCategory = $("#filter-category");
    $filterCity.prop("disabled", isBasic).toggleClass("locked", isBasic);
    $filterCategory.prop("disabled", isBasic).toggleClass("locked", isBasic);
  }
  // ================================
  // Render Services
  // ================================
  function render(list = load()) {
    let $container = $("#services-by-category");
    $container.empty();
    if (!list || list.length === 0) {
      $container.html(`<div class="no-results"><p>🔍 No matching services found.</p></div>`);
      return;
    }
    let favIds = JSON.parse(localStorage.getItem("favIds")) || [];
    $.each(list, function (_, s) {
      let isFavorite = favIds.includes(s.name);
      let scheduleText =
        typeof s.Schedule === "object"
          ? Object.entries(s.Schedule).map(([day, time]) => `${day}: ${time}`).join(", ")
          : s.Schedule;
      
      // Fix image path
      let imageSrc = s.image;
      if (imageSrc.includes('http')) {
        // External URL - use as is
      } else {
        // Local image - add correct path
        imageSrc = imageSrc.replace('imgs/', '../imgs/');
      }
      let $card = $(`
        <div class="service-card ${isFavorite ? "favorite-card" : ""}">
          <img src="${imageSrc}" alt="${s.name}">
          <div class="card-content">
            <h2>${s.name}</h2>
            <span class="heart-icon ${isFavorite ? "favorited" : ""}" data-servicename="${s.name}">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="${isFavorite ? "#ff6b6b" : "none"}" stroke="${isFavorite ? "#ff6b6b" : "black"}" stroke-width="2">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </span>
            <p><strong>Country:</strong> ${s.country}</p>
            <p><strong>City:</strong> ${s.city.join(", ")}</p>
            <p><strong>Schedule:</strong> ${scheduleText}</p>
            <p>${s.description}</p>
            <p><strong>Contact:</strong> ${s.contact_information}</p>
            <p><a class="more-info-link" href="${s.more_info_on}" target="_blank">Visit</a></p>
          </div>
        </div>
      `);

      $container.append($card);
    });
    $(".heart-icon").off("click").on("click", function () {
      let serviceName = $(this).data("servicename");
      toggleFavorite(serviceName);
    });
  }
  // ================================
  // Favorites
  // ================================
  function toggleFavorite(serviceName) {
    if (getUserPlan() === "basic") {
      alert("Favorites are only available for higher-tier plans.");
      return;
    }
    let favIds = JSON.parse(localStorage.getItem("favIds")) || [];
    if (favIds.includes(serviceName)) {
      favIds = favIds.filter((n) => n !== serviceName);
    } else {
      favIds.push(serviceName);
    }
    localStorage.setItem("favIds", JSON.stringify(favIds));
    filter();
  }
  // ================================
  // Filtering
  // ================================
  function filter() {
    let allServices = load();
    let searchValue = $("#searchInput").val().toLowerCase();
    let sortValue = $("#sortSelect").val() || "";
    let categoryValue = $("#filter-category").val();
    let cityValue = $("#filter-city").val();
    let countryValue = $("#filter-country").val();
    let favIds = JSON.parse(localStorage.getItem("favIds")) || [];
    let filtered = allServices.filter((s) => s.name.toLowerCase().includes(searchValue));
    if (categoryValue && categoryValue !== "All")
      filtered = filtered.filter((s) => s.category === categoryValue);
    if (countryValue && countryValue !== "All")
      filtered = filtered.filter((s) => s.country.toLowerCase().includes(countryValue.toLowerCase()));
    if (cityValue && cityValue !== "All") {
      filtered = filtered.filter((s) => {
        if (Array.isArray(s.city)) return s.city.some((c) => c.toLowerCase().startsWith(cityValue.toLowerCase()));
        return s.city.toLowerCase().includes(cityValue.toLowerCase());
      });
    }
    if (sortValue === "name-asc") filtered.sort((a, b) => a.name.localeCompare(b.name));
    else if (sortValue === "name-desc") filtered.sort((a, b) => b.name.localeCompare(a.name));
    else if (sortValue === "fav-services") filtered = filtered.filter((s) => favIds.includes(s.name));

    render(filtered);
  }
  $("#searchInput").on("input", filter);
  $("#sortSelect").on("change", filter);
  $("#filter-category, #filter-country, #filter-city").on("change input", filter);
  $(".clear-filters").on("click", function () {
    $("#searchInput").val("");
    $("#filter-category").val("All");
    $("#filter-city").val("");
    $("#sortSelect").val("");
    filter();
  });
  // ================================
  // Dynamic City Filter
  // ================================
  function updateCitiesByCountry(selectedCountry) {
    let $cityInput = $("#filter-city");
    let $cityDatalist = $("#cities");
    $cityDatalist.empty();
    $cityInput.val("");
    let citiesToShow = selectedCountry && selectedCountry !== ""
      ? citiesData[selectedCountry] || []
      : Object.values(citiesData).flat();
    citiesToShow.sort().forEach((city) => $cityDatalist.append(`<option value="${city}">`));
  }
  // ================================
  // Initialization
  // ================================
  function initApp() {
    applyPlanRestrictions();
    let urlParams = new URLSearchParams(window.location.search);
    let urlID = urlParams.get("id") ? parseInt(urlParams.get("id")) : null;
    let urlCategory = urlParams.get("category");
    let urlCountry = urlParams.get("country");
    let savedCountry = localStorage.getItem("selectedCountry") || "";
    if (urlCategory) $("#filter-category").val(urlCategory);
    if (urlCountry) {
      $("#filter-country").val(urlCountry);
      updateCitiesByCountry(urlCountry);
    } else if (savedCountry) {
      $("#filter-country").val(savedCountry);
      updateCitiesByCountry(savedCountry);
    } else {
      $("#filter-country").val("");
      updateCitiesByCountry(null);
    }
    // Set defaults for other filters
    $("#filter-category").val($("#filter-category").val() || "All");
    $("#filter-city").val("");
    $("#sortSelect").val("");
    // Render based on URL id or just filter
    if (urlID) {
      let filteredServices = load().filter((s) => s.id === urlID);
      if (urlCountry) filteredServices = filteredServices.filter((s) => s.country.toLowerCase() === urlCountry.toLowerCase());
      render(filteredServices);
    } else {
      filter();
    }
    // Handle country change dynamically
    $("#filter-country").on("change input", function () {
      let selectedCountry = $(this).val();
      localStorage.setItem("selectedCountry", selectedCountry);
      updateCitiesByCountry(selectedCountry);
      filter();
    });
  }
});