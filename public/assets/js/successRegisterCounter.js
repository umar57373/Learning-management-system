// redirect.js
let countdown = 10; // Countdown time in seconds
const countdownElement = document.getElementById('countdown'); // Get the countdown element

// Function to update the countdown
function updateCountdown() {
    countdownElement.textContent = `You will be redirected to the login page in ${countdown} seconds.`;
    countdown--;

    // Check if countdown has reached zero
    if (countdown < 0) {
        window.location.href = '/login'; // Redirect to login page
    }
}

// Update countdown every second
setInterval(updateCountdown, 1000);

// Initial call to set the countdown message
updateCountdown();
