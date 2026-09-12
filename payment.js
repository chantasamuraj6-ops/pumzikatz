const params = new URLSearchParams(window.location.search);
const bookingId = params.get("booking_id");
let booking = null;

async function loadBooking() {
    const response = await fetch(`/api/bookings/${bookingId}`);
    booking = await response.json();

    document.getElementById("booking-summary").innerHTML = `
        <p><strong>Guest:</strong> ${booking.guest_name}</p>
        <p><strong>Dates:</strong> ${booking.check_in} → ${booking.check_out}</p>
        <p class="price"><strong>Total:</strong> TSh ${booking.total_price.toLocaleString()}</p>
    `;
}

document.getElementById("pay-btn").addEventListener("click", () => {
    FlutterwaveCheckout({
        public_key: FLW_PUBLIC_KEY,
        tx_ref: "pumzikatz-" + booking.id + "-" + Date.now(),
        amount: booking.total_price,
        currency: "TZS",
        customer: {
            email: booking.guest_email,
            name: booking.guest_name,
        },
        customizations: {
            title: "PumzikaTZ Booking",
            description: "Payment for accommodation booking",
        },
        callback: function (data) {
            // Payment succeeded — tell our server to mark it as paid
            fetch(`/api/bookings/${booking.id}/confirm`, { method: "POST" })
                .then(() => {
                    document.getElementById("booking-summary").innerHTML +=
                        "<p style='color:green; font-weight:bold;'>✅ Payment confirmed!</p>";
                });
        },
        onclose: function () {
            console.log("Payment popup closed");
        },
    });
});

loadBooking();