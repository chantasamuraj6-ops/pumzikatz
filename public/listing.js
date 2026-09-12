// Read the "id" from the URL (e.g. ?id=3)
const params = new URLSearchParams(window.location.search);
const listingId = params.get("id");

async function loadListing() {
    const response = await fetch(`/api/listings/${listingId}`);

    if (!response.ok) {
        document.getElementById("listing-detail").innerHTML = "<p>Listing not found.</p>";
        return;
    }

    const listing = await response.json();

    document.getElementById("listing-detail").innerHTML = `
        <img src="${listing.image_url}" alt="${listing.name}" style="width:100%; border-radius:12px; margin-bottom:20px;">
        <h2>${listing.name}</h2>
        <p class="location">${listing.location} · ${listing.type}</p>
        <p style="margin:16px 0;">${listing.description}</p>
        <p class="price" style="font-size:22px;">TSh ${listing.price_per_night.toLocaleString()} / night</p>
    `;
}

loadListing();
let currentListing = null;

// Update loadListing() to save the listing data for later use
async function loadListing() {
    const response = await fetch(`/api/listings/${listingId}`);

    if (!response.ok) {
        document.getElementById("listing-detail").innerHTML = "<p>Listing not found.</p>";
        return;
    }

    currentListing = await response.json(); // NEW: save it globally

    document.getElementById("listing-detail").innerHTML = `
        <img src="${currentListing.image_url}" alt="${currentListing.name}" style="width:100%; border-radius:12px; margin-bottom:20px;">
        <h2>${currentListing.name}</h2>
        <p class="location">${currentListing.location} · ${currentListing.type}</p>
        <p style="margin:16px 0;">${currentListing.description}</p>
        <p class="price" style="font-size:22px;">TSh ${currentListing.price_per_night.toLocaleString()} / night</p>
    `;
}

// Calculate and show total price whenever dates change
function updateTotal() {
    const checkIn = new Date(document.getElementById("check_in").value);
    const checkOut = new Date(document.getElementById("check_out").value);

    if (!currentListing || isNaN(checkIn) || isNaN(checkOut) || checkOut <= checkIn) {
        document.getElementById("total-price").innerText = "";
        return;
    }

    const nights = (checkOut - checkIn) / (1000 * 60 * 60 * 24);
    const total = nights * currentListing.price_per_night;
    document.getElementById("total-price").innerText =
        `${nights} night(s) — Total: TSh ${total.toLocaleString()}`;
}

document.getElementById("check_in").addEventListener("change", updateTotal);
document.getElementById("check_out").addEventListener("change", updateTotal);

// Handle form submission
document.getElementById("booking-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const checkIn = document.getElementById("check_in").value;
    const checkOut = document.getElementById("check_out").value;
    const nights = (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24);
    const total = nights * currentListing.price_per_night;

    const booking = {
        listing_id: currentListing.id,
        guest_name: document.getElementById("guest_name").value,
        guest_email: document.getElementById("guest_email").value,
        check_in: checkIn,
        check_out: checkOut,
        total_price: total
    };

    const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(booking)
    });

    const result = await response.json();
    window.location.href = `/payment.html?booking_id=${result.id}`;
});

loadListing();
