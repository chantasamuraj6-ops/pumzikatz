const db = require("./database");

const listings = [
    { name: "Zanzibar Beach Lodge", location: "Nungwi, Zanzibar", type: "Lodge", price_per_night: 120000, description: "Beachfront lodge with ocean views, 5 minutes from Nungwi beach.", image_url: "https://picsum.photos/seed/zanzibar-beach-lodge/600/400" },
    { name: "Stone Town Heritage Inn", location: "Stone Town, Zanzibar", type: "Hotel", price_per_night: 95000, description: "Restored Swahili-Arab townhouse in the heart of Stone Town's old quarter.", image_url: "https://picsum.photos/seed/stone-town-inn/600/400" },
    { name: "Paje Kite Villa", location: "Paje, Zanzibar", type: "Airbnb", price_per_night: 70000, description: "Private villa steps from Paje beach, popular with kitesurfers.", image_url: "https://picsum.photos/seed/paje-kite-villa/600/400" },
    { name: "Arusha City Hotel", location: "Arusha", type: "Hotel", price_per_night: 85000, description: "Comfortable city-center hotel, close to safari tour operators.", image_url: "https://picsum.photos/seed/arusha-city-hotel/600/400" },
    { name: "Ngorongoro Rim Lodge", location: "Ngorongoro", type: "Lodge", price_per_night: 260000, description: "Lodge perched on the crater rim with sweeping views into the caldera.", image_url: "https://picsum.photos/seed/ngorongoro-rim/600/400" },
    { name: "Serengeti Tented Camp", location: "Serengeti", type: "Lodge", price_per_night: 310000, description: "Classic canvas tented camp inside the Serengeti ecosystem.", image_url: "https://picsum.photos/seed/serengeti-tent/600/400" },
    { name: "Moshi Kilimanjaro View", location: "Moshi", type: "Guesthouse", price_per_night: 55000, description: "Guesthouse with direct views of Kilimanjaro, popular with trekkers.", image_url: "https://picsum.photos/seed/moshi-kili-view/600/400" },
    { name: "Dar Airbnb Studio", location: "Mikocheni, Dar es Salaam", type: "Airbnb", price_per_night: 45000, description: "Cozy studio apartment in Mikocheni, walking distance to shops.", image_url: "https://picsum.photos/seed/dar-airbnb-studio/600/400" },
    { name: "Msasani Bay Apartments", location: "Msasani, Dar es Salaam", type: "Airbnb", price_per_night: 60000, description: "Modern apartment near the peninsula with easy beach access.", image_url: "https://picsum.photos/seed/msasani-bay/600/400" },
    { name: "Dar Business Hotel", location: "City Centre, Dar es Salaam", type: "Hotel", price_per_night: 110000, description: "Business-friendly hotel near the harbour and CBD offices.", image_url: "https://picsum.photos/seed/dar-business-hotel/600/400" },
    { name: "Mwanza Lakeview Hotel", location: "Mwanza", type: "Hotel", price_per_night: 78000, description: "Hotel overlooking Lake Victoria, close to the ferry terminal.", image_url: "https://picsum.photos/seed/mwanza-lakeview/600/400" },
    { name: "Bujora Cultural Lodge", location: "Mwanza", type: "Lodge", price_per_night: 65000, description: "Small lodge near the Sukuma cultural heritage centre.", image_url: "https://picsum.photos/seed/bujora-lodge/600/400" },
    { name: "Dodoma Central Hotel", location: "Dodoma", type: "Hotel", price_per_night: 60000, description: "Straightforward hotel near government offices and the bus stand.", image_url: "https://picsum.photos/seed/dodoma-central/600/400" },
    { name: "Mbeya Highlands Lodge", location: "Mbeya", type: "Lodge", price_per_night: 58000, description: "Cool-climate lodge in the Southern Highlands, good base for hiking.", image_url: "https://picsum.photos/seed/mbeya-highlands/600/400" },
    { name: "Iringa Guesthouse", location: "Iringa", type: "Guesthouse", price_per_night: 40000, description: "Family-run guesthouse near Gangilonga rock, close to Ruaha gateway routes.", image_url: "https://picsum.photos/seed/iringa-guesthouse/600/400" },
    { name: "Morogoro Mountain View", location: "Morogoro", type: "Guesthouse", price_per_night: 42000, description: "Quiet guesthouse at the foot of the Uluguru Mountains.", image_url: "https://picsum.photos/seed/morogoro-mountain/600/400" },
    { name: "Tanga Beach House", location: "Tanga", type: "Airbnb", price_per_night: 52000, description: "Relaxed beach house on Tanzania's underrated northern coast.", image_url: "https://picsum.photos/seed/tanga-beach-house/600/400" },
    { name: "Bagamoyo Heritage Cottages", location: "Bagamoyo", type: "Lodge", price_per_night: 68000, description: "Cottages near the old slave-trade route town's historic waterfront.", image_url: "https://picsum.photos/seed/bagamoyo-cottages/600/400" },
    { name: "Pemba Island Retreat", location: "Pemba Island", type: "Lodge", price_per_night: 135000, description: "Quiet retreat on Zanzibar's quieter sister island, known for diving.", image_url: "https://picsum.photos/seed/pemba-retreat/600/400" },
    { name: "Lake Manyara Treehouse", location: "Lake Manyara", type: "Lodge", price_per_night: 190000, description: "Elevated treehouse-style rooms overlooking the Rift Valley floor.", image_url: "https://picsum.photos/seed/manyara-treehouse/600/400" },
    { name: "Selous Riverside Camp", location: "Nyerere/Selous", type: "Lodge", price_per_night: 220000, description: "Riverside camp inside Africa's largest game reserve.", image_url: "https://picsum.photos/seed/selous-riverside/600/400" },
    { name: "Arusha Airbnb Cottage", location: "Arusha", type: "Airbnb", price_per_night: 50000, description: "Garden cottage close to Arusha National Park's entrance gate.", image_url: "https://picsum.photos/seed/arusha-cottage/600/400" },
    { name: "Zanzibar Airport Inn", location: "Zanzibar Town", type: "Hotel", price_per_night: 62000, description: "Convenient stopover hotel near Abeid Amani Karume Airport.", image_url: "https://picsum.photos/seed/zanzibar-airport-inn/600/400" },
    { name: "Kigamboni Beach Bandas", location: "Kigamboni, Dar es Salaam", type: "Lodge", price_per_night: 48000, description: "Simple beach bandas across the ferry from Dar's city centre.", image_url: "https://picsum.photos/seed/kigamboni-bandas/600/400" },
    { name: "Mto wa Mbu Village Stay", location: "Mto wa Mbu", type: "Guesthouse", price_per_night: 38000, description: "Village guesthouse between Lake Manyara and Ngorongoro routes.", image_url: "https://picsum.photos/seed/mto-wa-mbu/600/400" }
];

const insert = db.prepare(`
    INSERT INTO listings (name, location, type, price_per_night, description, image_url)
    VALUES (@name, @location, @type, @price_per_night, @description, @image_url)
`);

// Clear old data. Bookings must be cleared BEFORE listings,
// since bookings reference listings via a foreign key.
const clearBookings = db.prepare("DELETE FROM bookings");
const clearListings = db.prepare("DELETE FROM listings");
clearBookings.run();
clearListings.run();

listings.forEach(listing => insert.run(listing));

console.log(`Seeded ${listings.length} listings successfully.`);