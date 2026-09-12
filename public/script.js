let allListings = [];

async function loadListings() {
    const response = await fetch("/api/listings");
    allListings = await response.json();

    populateLocationFilter();
    renderListings(allListings);
}

function populateLocationFilter() {
    const select = document.getElementById("location-filter");
    const locations = [...new Set(allListings.map(l => l.location))].sort();

    locations.forEach(loc => {
        const option = document.createElement("option");
        option.value = loc;
        option.innerText = loc;
        select.appendChild(option);
    });
}

function renderListings(listings) {
    const container = document.getElementById("listings");
    container.innerHTML = "";

    document.getElementById("results-count").innerText =
        `${listings.length} place${listings.length !== 1 ? "s" : ""} found`;

    listings.forEach(listing => {
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
            <img src="${listing.image_url}" alt="${listing.name}">
            <div class="card-body">
                <span class="type-tag ${listing.type}">${listing.type}</span>
                <h3>${listing.name}</h3>
                <p class="location">${listing.location}</p>
                <p class="price">TSh ${listing.price_per_night.toLocaleString()} / night</p>
            </div>
        `;
        card.onclick = () => {
            window.location.href = `/listing.html?id=${listing.id}`;
        };
        container.appendChild(card);
    })
}


function applyFilters() {
    const search = document.getElementById("search-input").value.toLowerCase();
    const location = document.getElementById("location-filter").value;
    const type = document.getElementById("type-filter").value;

    const filtered = allListings.filter(listing => {
        const matchesSearch =
            listing.name.toLowerCase().includes(search) ||
            listing.location.toLowerCase().includes(search);
        const matchesLocation = !location || listing.location === location;
        const matchesType = !type || listing.type === type;
        return matchesSearch && matchesLocation && matchesType;
    });

    renderListings(filtered);
}

document.getElementById("search-input").addEventListener("input", applyFilters);
document.getElementById("location-filter").addEventListener("change", applyFilters);
document.getElementById("type-filter").addEventListener("change", applyFilters);

loadListings();
