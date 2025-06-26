console.log("🌐 browse.js loaded");

// Get the current user from localStorage
const currentUser = JSON.parse(localStorage.getItem("currentUser"));
const welcomeUser = document.getElementById("welcomeUser");

// Redirect to auth.html if no user is logged in
const logoutBtn = document.getElementById("logoutBtn");
logoutBtn.addEventListener("click", () => {
  console.log("🚪 Logging out...");
  localStorage.removeItem("currentUser");
  window.location.href = "index.html";
});


// If hustler is logged in
if (currentUser) {
  welcomeUser.textContent = `Hey, ${currentUser.username}`;
  logoutBtn.style.display = "inline-block"; // Show logout
} else {
  // Client browsing, hide login-specific stuff
  welcomeUser.textContent = `Welcome, visitor.`;
  logoutBtn.style.display = "none"; // Hide logout
}


// Get all users from localStorage
const allUsers = JSON.parse(localStorage.getItem("users")) || [];
console.log("👥 All users:", allUsers);
console.log("👤 Current user:", currentUser);

// Filter out the current user
const hustlers = allUsers

console.log("🧠 Hustlers list (excluding current):", hustlers);

// Render hustlers
const hustlersList = document.getElementById("hustlersList");

if (hustlers.length === 0) {
  hustlersList.innerHTML = "<p>No other hustlers found. Be the first to signup.</p>";
}

hustlers.forEach(hustler => {
  const card = document.createElement("div");
  card.className = "card";

  const isCurrentUser = currentUser && hustler.email === currentUser.email;

  card.innerHTML = `
    <div style="position: relative;">
      ${isCurrentUser ? `
        <button id="editBtn">Edit</button>
      ` : ""}
      <h3>${hustler.username}</h3>
      <p><strong>Location:</strong> ${hustler.location || "Unknown"}</p>
      <p><strong>Skills:</strong> ${hustler.description || "No description provided."}</p>
      <p><strong>Rate:</strong> ${hustler.price ? `ZAR ${hustler.price}` : "Negotiable"}</p>
      <button class="whatsappBtn">WhatsApp</button>
      <button class="emailBtn">Email</button>
    </div>
  `;

  hustlersList.appendChild(card);

  // WhatsApp and Email Buttons
  const whatsappBtn = card.querySelector(".whatsappBtn");
  const emailBtn = card.querySelector(".emailBtn");

  whatsappBtn.addEventListener("click", () => {
    contactViaWhatsApp(hustler.whatsApp);
  });

  emailBtn.addEventListener("click", () => {
    contactViaEmail(hustler.email);
  });
  
  function contactViaWhatsApp(number) {
  if (!number) {
    Swal.fire('Oops!', "This hustler didn't add a WhatsApp number.", 'warning');
    return;
  }

  // Sanitize number and prepend country code (e.g., South Africa: 27)
  const cleaned = number.replace(/\D/g, ''); // Remove non-digits
  const formatted = cleaned.startsWith("0")
    ? "27" + cleaned.slice(1) // Replace starting 0 with SA's country code
    : cleaned;

  const url = `https://wa.me/${formatted}`;
  window.open(url, "_blank");
}


function contactViaEmail(email) {
  if (!email) {
    Swal.fire('Oops!', "No email found for this hustler.", 'warning');
    return;
  }
  window.location.href = `mailto:${email}`;
}


  // 🛠 Edit feature (now correctly placed inside forEach)
  if (isCurrentUser) {
    const editBtn = card.querySelector("#editBtn");
    editBtn.addEventListener("click", () => {
      Swal.fire({
        title: "Edit Your Info",
        html: `
          <input id="editUsername" class="swal2-input" placeholder="Username" value="${hustler.username}">
          <input id="editLocation" class="swal2-input" placeholder="Location" value="${hustler.location || ""}">
          <input id="editDescription" class="swal2-input" placeholder="Skills / Description" value="${hustler.description || ""}">
          <input id="editPrice" class="swal2-input" placeholder="Price" value="${hustler.price || ""}">
          <input id="editWhatsapp" class="swal2-input" placeholder="WhatsApp Number" value="${hustler.whatsApp || ""}">
        `,
        confirmButtonText: "Save Changes",
        focusConfirm: false,
        preConfirm: () => {
          return {
            username: document.getElementById("editUsername").value.trim(),
            location: document.getElementById("editLocation").value.trim(),
            description: document.getElementById("editDescription").value.trim(),
            price: document.getElementById("editPrice").value.trim(),
            whatsApp: document.getElementById("editWhatsapp").value.trim(),
          };
        }
      }).then(result => {
        if (result.isConfirmed) {
          const updatedData = result.value;

          const allUsers = JSON.parse(localStorage.getItem("users")) || [];
          const updatedUsers = allUsers.map(user => {
            if (user.email === hustler.email) {
              return { ...user, ...updatedData };
            }
            return user;
          });

          // Save updated data
          localStorage.setItem("users", JSON.stringify(updatedUsers));
          localStorage.setItem("currentUser", JSON.stringify({ ...hustler, ...updatedData }));

          Swal.fire({
            icon: "success",
            title: "Profile Updated",
            timer: 1000,
            showConfirmButton: false
          }).then(() => location.reload());
        }
      });
    });
  }
});
