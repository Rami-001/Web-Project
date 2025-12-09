$(document).ready(function () {
  let services = [];
  let citiesData = {};

  // Load JSON Data
  $.getJSON("../JS_codes/data.json", function (data) {
    services = data.services;
    citiesData = data.citiesData;
    initApp();
  });

  // Utilities
  function load() {
    let raw = localStorage.getItem("services");
    return raw ? JSON.parse(raw) : services;
  }

  function getUserPlan() {
    return (localStorage.getItem("userPlan") || "basic").toLowerCase();
  }

  function applyPlanRestrictions() {
    let isBasic = getUserPlan() === "basic";
    $("#filter-city, #filter-category")
      .prop("disabled", isBasic)
      .toggleClass("locked", isBasic);
  }

  // -------------------------------
  // RENDER SERVICES
  // -------------------------------
  function render(list = load()) {
    let $container = $("#services-by-category");
    $container.empty();

    if (!list || list.length === 0) {
      $container.html(
        `<div class="no-results"><p>🔍 No matching services found.</p></div>`
      );
      return;
    }

    let favIds = JSON.parse(localStorage.getItem("favIds")) || [];

    $.each(list, function (_, s) {
      let isFavorite = favIds.includes(s.name);
      let scheduleText = typeof s.Schedule === "object"
        ? Object.entries(s.Schedule)
            .map(([day, time]) => `${day}: ${time}`)
            .join(", ")
        : s.Schedule;

      let imageSrc = s.image.includes("http")
        ? s.image
        : s.image.replace("imgs/", "../imgs/");

      // *************** FIXED CARD HTML ***************
      let $card = $(`
        <div class="service-card ${isFavorite ? "favorite-card" : ""}">
          <img src="${imageSrc}" alt="${s.name}">
          <div class="card-content">
            
            <h2>${s.name}</h2>

            <span class="heart-icon ${isFavorite ? "favorited" : ""}"
                  data-servicename="${s.name}">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="${isFavorite ? "#ff6b6b" : "none"}" stroke="${isFavorite ? "#ff6b6b" : "#ccc"}" stroke-width="2">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </span>

            <p><strong>Country:</strong> ${s.country}</p>
            <p><strong>City:</strong> ${s.city.join(", ")}</p>
            <p><strong>Schedule:</strong> ${scheduleText}</p>

            <p class="description" data-full="${s.description}">
              ${s.description}
            </p>

            <div class="extra-content" style="display:none;">
              <p><strong>Contact:</strong> ${s.contact_information}</p>
              <p>
                <a class="more-info-link" href="${s.more_info_on}" target="_blank">
                  Visit
                </a>
              </p>
            </div>

            <button class="read-more-btn" style="display:none;">Read More</button>

          </div>
        </div>
      `);

      $container.append($card);
    });

    // Heart behavior
    $(".heart-icon").off("click").on("click", function () {
      toggleFavorite($(this).data("servicename"));
    });

    // READ MORE / LESS LOGIC
    $(".read-more-btn").off("click").on("click", function () {
      let $btn = $(this);
      let $content = $btn.closest(".card-content");
      let $desc = $content.find(".description");
      let $extra = $content.find(".extra-content");

      let fullText = $desc.data("full");

      let expanded = $btn.data("expanded") === true;

      if (!expanded) {
        // EXPAND
        $desc.css({
          display: "block",
          "-webkit-line-clamp": "unset",
          overflow: "visible",
          textOverflow: "unset",
        }).text(fullText);

        $extra.slideDown(200);
        $btn.text("Read Less");
        $btn.data("expanded", true);
      } else {
        // COLLAPSE
        $desc.css({
          display: "-webkit-box",
          "-webkit-line-clamp": "2",
          "-webkit-box-orient": "vertical",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }).text(fullText);

        $extra.slideUp(200);
        $btn.text("Read More");
        $btn.data("expanded", false);
      }
    });

    // *************** ALWAYS SHOW BUTTON IF EXTRA CONTENT EXISTS ***************
    setTimeout(() => {
      $(".card-content").each(function () {
        let $content = $(this);
        let $extra = $content.find(".extra-content");
        let $btn = $content.find(".read-more-btn");

        // If there is contact/visit → show Read More
        if ($extra.text().trim().length > 0) {
          $btn.show();
        }
      });
    }, 100);
  }

  // -------------------------------
  // FAVORITES
  // -------------------------------
  function toggleFavorite(name) {
    if (getUserPlan() === "basic") {
      alert("Favorites are only available for higher-tier plans.");
      return;
    }

    let favIds = JSON.parse(localStorage.getItem("favIds")) || [];

    if (favIds.includes(name)) {
      favIds = favIds.filter((n) => n !== name);
    } else {
      favIds.push(name);
    }

    localStorage.setItem("favIds", JSON.stringify(favIds));
    filter();
  }

  // -------------------------------
  // FILTERING
  // -------------------------------
  function filter() {
    let all = load();
    let search = $("#searchInput").val().toLowerCase();
    let sort = $("#sortSelect").val();
    let category = $("#filter-category").val();
    let city = $("#filter-city").val();
    let country = $("#filter-country").val();
    let service = $("#filter-service").val();

    let favIds = JSON.parse(localStorage.getItem("favIds")) || [];

    let result = all.filter((s) =>
      s.name.toLowerCase().includes(search)
    );

    if (category && category !== "All")
      result = result.filter((s) => s.category === category);

    if (country && country !== "All")
      result = result.filter((s) =>
        s.country.toLowerCase().includes(country.toLowerCase())
      );

    if (service && service !== "All")
      result = result.filter((s) =>
        s.name.toLowerCase().includes(service.toLowerCase())
      );

    if (city && city !== "All") {
      result = result.filter((s) => {
        if (Array.isArray(s.city))
          return s.city.some((c) =>
            c.toLowerCase().startsWith(city.toLowerCase())
          );
        return s.city.toLowerCase().includes(city.toLowerCase());
      });
    }

    if (sort === "name-asc")
      result.sort((a, b) => a.name.localeCompare(b.name));

    if (sort === "name-desc")
      result.sort((a, b) => b.name.localeCompare(a.name));

    if (sort === "fav-services")
      result = result.filter((s) => favIds.includes(s.name));

    render(result);
  }

  $("#searchInput").on("input", filter);
  $("#sortSelect").on("change", filter);
  $("#filter-category, #filter-country, #filter-city, #filter-service")
    .on("change input", filter);

  $(".clear-filters").on("click", function () {
    $("#searchInput").val("");
    $("#filter-category").val("All");
    $("#filter-city").val("");
    $("#filter-service").val("All");
    $("#sortSelect").val("");
    filter();
  });

  // -------------------------------
  // CITY FILTER
  // -------------------------------
  function updateCitiesByCountry(selected) {
    let $d = $("#cities");
    $d.empty();
    $("#filter-city").val("");

    let cities =
      selected && selected !== ""
        ? citiesData[selected] || []
        : Object.values(citiesData).flat();

    cities.sort().forEach((c) =>
      $d.append(`<option value="${c}">`)
    );
  }

  // -------------------------------
  // INIT
  // -------------------------------
  function initApp() {
    applyPlanRestrictions();

    let url = new URLSearchParams(window.location.search);
    let id = url.get("id") ? parseInt(url.get("id")) : null;
    let cat = url.get("category");
    let ctry = url.get("country");
    let saved = localStorage.getItem("selectedCountry") || "";

    if (cat) $("#filter-category").val(cat);

    if (ctry) {
      $("#filter-country").val(ctry);
      updateCitiesByCountry(ctry);
    } else if (saved) {
      $("#filter-country").val(saved);
      updateCitiesByCountry(saved);
    } else {
      $("#filter-country").val("");
      updateCitiesByCountry(null);
    }

    $("#filter-city").val("");
    $("#sortSelect").val("");

    if (id) {
      let one = load().filter((s) => s.id === id);
      if (ctry)
        one = one.filter(
          (s) => s.country.toLowerCase() === ctry.toLowerCase()
        );
      render(one);
    } else {
      filter();
    }

    $("#filter-country").on("change input", function () {
      let val = $(this).val();
      localStorage.setItem("selectedCountry", val);
      updateCitiesByCountry(val);
      filter();
    });
  }
});
