const express = require("express");
const db = require("./database");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("public"));

// Auto-seed listings if the table is empty (handles Render's free-tier filesystem reset)
const listingCount = db.prepare("SELECT COUNT(*) as count FROM listings").get().count;

if (listingCount === 0) {
    const listings = require("./listing-data");
    const insert = db.prepare(`
        INSERT INTO listings (name, location, type, price_per_night, description, image_url)
        VALUES (@name, @location, @type, @price_per_night, @description, @image_url)
    `);
    listings.forEach(listing => insert.run(listing));
    console.log(`Auto-seeded ${listings.length} listings on startup.`);
}

// Get all listings
app.get("/api/listings", (req, res) => {
    const listings = db.prepare("SELECT * FROM listings").all();
    res.json(listings);
});

// Get a single listing by ID
app.get("/api/listings/:id", (req, res) => {
    const listing = db.prepare("SELECT * FROM listings WHERE id = ?").get(req.params.id);
    if (!listing) {
        return res.status(404).json({ error: "Listing not found" });
    }
    res.json(listing);
});

// Create a new booking
app.post("/api/bookings", (req, res) => {
    const { listing_id, guest_name, guest_email, check_in, check_out, total_price } = req.body;

    const stmt = db.prepare(`
        INSERT INTO bookings (listing_id, guest_name, guest_email, check_in, check_out, total_price)
        VALUES (?, ?, ?, ?, ?, ?)
    `);
    const result = stmt.run(listing_id, guest_name, guest_email, check_in, check_out, total_price);

    res.json({ id: result.lastInsertRowid, ...req.body });
});

// Get a single booking by ID (needed on the payment page)
app.get("/api/bookings/:id", (req, res) => {
    const booking = db.prepare("SELECT * FROM bookings WHERE id = ?").get(req.params.id);
    if (!booking) {
        return res.status(404).json({ error: "Booking not found" });
    }
    res.json(booking);
});

// Mark a booking as paid once Flutterwave confirms success
app.post("/api/bookings/:id/confirm", (req, res) => {
    db.prepare("UPDATE bookings SET payment_status = 'paid' WHERE id = ?").run(req.params.id);
    res.json({ success: true });
});

app.listen(PORT, () => {
    console.log(`PumzikaTZ server running at http://localhost:${PORT}`);
});
