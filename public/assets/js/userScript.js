// Sidebar toggle functionality
document.addEventListener('DOMContentLoaded', function() {
    const toggleBtn = document.querySelector('.toggle-btn');
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    const profileContainer = document.querySelector('.profile-container');

    function toggleSidebar() {
        console.log('drawer');
        sidebar.classList.toggle('active');
        sidebar.classList.toggle('deActive');

        // Adjust main content and profile container based on sidebar state
        if (sidebar.classList.contains('active')) {
            mainContent.classList.add('shifted');
            profileContainer.classList.add('shifted');
        } else {
            mainContent.classList.remove('shifted');
            profileContainer.classList.remove('shifted');
        }

        // Update toggle button aria-label and icon
        toggleBtn.setAttribute('aria-label', sidebar.classList.contains('active') ? 'Hide Sidebar' : 'Show Sidebar');
        toggleBtn.innerHTML = sidebar.classList.contains('active') ? '&times;' : '&#9776;';

        // Save state to localStorage
        localStorage.setItem('sidebarActive', sidebar.classList.contains('active'));
    }

    // Toggle sidebar on button click
    toggleBtn.addEventListener('click', toggleSidebar);

    // Close sidebar when clicking outside
    document.addEventListener('click', function(event) {
        const isClickInside = sidebar.contains(event.target) || toggleBtn.contains(event.target);
        if (!isClickInside && sidebar.classList.contains('active')) {
            toggleSidebar();
        }
    });

    // Handle escape key to close sidebar
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && sidebar.classList.contains('active')) {
            toggleSidebar();
        }
    });

    // Restore sidebar state on page load
    const savedState = localStorage.getItem('sidebarActive');
    if (savedState !== null) {
        if (savedState === 'true') {
            toggleSidebar();
        }
    }

    // Add resize handler for responsive behavior
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && !sidebar.classList.contains('active')) {
            toggleSidebar();
        } else if (window.innerWidth <= 768 && sidebar.classList.contains('active')) {
            toggleSidebar();
        }
    });
}); 

// Accordion functionality
const accordionHeaders = document.querySelectorAll('.accordion-header');

accordionHeaders.forEach(header => {
    header.addEventListener('click', (event) => {
        // Toggle the clicked accordion item
        const content = header.nextElementSibling;
        const isActive = content.style.display === "block";

        // Close all accordion items
        document.querySelectorAll('.accordion-content').forEach(item => {
            item.style.display = "none";
        });

        // If the clicked item was not active, open it
        if (!isActive) {
            content.style.display = "block";
        }

        event.stopPropagation();
    });
});



window.addEventListener('click', ()=>{
    // Close all accordion items
    document.querySelectorAll('.accordion-content').forEach(item => {
        item.style.display = "none";
    });
})

// Get the button
const scrollToTopBtn = document.getElementById('scrollToTopBtn');

// Show or hide the button based on scroll position
window.onscroll = function() {
    if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
        scrollToTopBtn.style.display = "block";
    } else {
        scrollToTopBtn.style.display = "none";
    }
};

// Scroll to the top when the button is clicked
scrollToTopBtn.addEventListener('click', function() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth' // Smooth scrolling
    });
});

function openOverlay(overlayId) {
    document.getElementById(overlayId).style.display = 'flex';
}

function closeOverlay() {
    const overlays = document.getElementsByClassName('overlay');
    for (let i = 0; i < overlays.length; i++) {
        overlays[i].style.display = 'none';
    }
}

// Close overlay when clicking outside of the content area
window.addEventListener('click', function(event) {
    const overlays = document.getElementsByClassName('overlay');
    for (let i = 0; i < overlays.length; i++) {
        if (event.target === overlays[i]) {
            closeOverlay(); // Use closeOverlay function to hide the overlay
        }
    }
});

// Handle profile picture form submission
const formProfilePic = document.getElementById('form-profile-pic');

formProfilePic.addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const formData = new FormData(formProfilePic);
    const userId = formData.get('id'); // Extract the user ID from form data
    
    try {
        const response = await axios.put(`/user/edit-profile-pic/${userId}`, formData);
        
        displayMessage(response.data.message, 'success'); // Display success message
        closeActiveOverlay(); // Close overlay
    } catch (err) {
        displayMessage(`Error: ${err.message}`, 'error'); // Correct error message format
    }
});

// Convert form data to JSON
function formDataToJSON(formElement) {
    const formData = new FormData(formElement);
    return Object.fromEntries(formData.entries());  // Convert FormData to a plain object
}

// Handle personal info form submission
const formPersonalInfo = document.getElementById('form-personal-info');

formPersonalInfo.addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const formData = formDataToJSON(formPersonalInfo);
    const userId = formData.id;  // Assuming there's an 'id' field in the form
    
    try {
        const response = await axios.put(`/user/edit-personal-info/${userId}`, formData);
        
        displayMessage(response.data.message, 'success');
        closeActiveOverlay();
    } catch (err) {
        displayMessage(`Error: ${err.message}`, 'error'); // Correct error message format
    }
});

// Handle contact info form submission
const formContactInfo = document.getElementById('form-contact-info');

formContactInfo.addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const formData = formDataToJSON(formContactInfo);
    const userId = formData.id;  // Assuming there's an 'id' field in the form
    
    try {
        const response = await axios.put(`/user/edit-contact-info/${userId}`, formData);
        
        displayMessage(response.data.message, 'success');
        closeActiveOverlay();
    } catch (err) {
        displayMessage(`Error: ${err.message}`, 'error'); // Correct error message format
    }
});

// Handle profile deletion
async function deleteProfile(userId) {
    try {
        const response = await axios.delete(`/user/delete-profile/${userId}`);
        
        if (response.data.message) {
            window.location.href = '/'; // Redirect to home after successful deletion
        }
    } catch (err) {
        displayMessage(`Error: ${err.message}`, 'error'); // Correct error message format
    }
}

// Utility to close active overlay
function closeActiveOverlay() {
    const overlays = document.getElementsByClassName('overlay');
    for (let i = 0; i < overlays.length; i++) {
        if (overlays[i].classList.contains('active')) {
            overlays[i].classList.remove('active');
            break;
        }
    }
}

// Utility to display messages
function displayMessage(message, type) {
    const messageElement = document.getElementById('update-message');
    messageElement.textContent = message;
    
    // Apply styling based on message type
    if (type === 'success') {
        messageElement.style.backgroundColor = 'rgba(52, 152, 219, 0.1)';
        messageElement.style.color = '#3498db';
    } else {
        messageElement.style.backgroundColor = 'rgba(231, 76, 60, 0.1)';
        messageElement.style.color = '#e74c3c';
    }
    
    messageElement.style.display = 'block'; // Ensure the message is visible
}

// Reset messages before each new action
function resetMessage() {
    const messageElement = document.getElementById('update-message');
    messageElement.textContent = '';
    messageElement.style.display = 'none';
}

