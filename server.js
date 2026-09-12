const express = require("express");
const db = require("./database");
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static("public"));

app.get("/api/listings", (req, res) => {
    const listings = db.prepare("SELECT * FROM listings").all();
    res.json(listings);
});

app.get("/api/listings/:id", (req, res) => {
    const listing = db.prepare("SELECT * FROM listings WHERE id = ?").get(req.params.id);
    if (!listing) {
        return res.status(404).json({ error: "Listing not found" });
    }
    res.json(listing);
});
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

app.post("/api/bookings/:id/confirm", (req, res) => {
    db.prepare("UPDATE bookings SET payment_status = 'paid' WHERE id = ?").run(req.params.id);
    res.json({ success: true });
});
app.listen(PORT, () => {
    console.log(`PumzikaTZ server running at http://localhost:${PORT}`);
});