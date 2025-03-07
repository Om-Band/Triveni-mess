async function fetchTodayMenu() {
    const response = await fetch("http://localhost/triveni_mess/api.php");
    const menu = await response.json();

    const today = new Date().toLocaleString('en-us', { weekday: 'long' });
    const todayMenu = menu.find(item => item.day === today);

    const table = document.querySelector("#today-menu table");
    table.innerHTML = `
        <tr>
            <th>Meals</th>
            <th>Time</th>
            <th>Menu</th>
            <th>Rate</th>
        </tr>
        <tr>
            <td>Breakfast</td>
            <td>After 8:30 am</td>
            <td>${todayMenu.breakfast}</td>
            <td><button onclick="openFeedbackForm('Breakfast')">Rate</button></td>
        </tr>
        <tr>
            <td>Lunch</td>
            <td>1:00 pm</td>
            <td>${todayMenu.lunch}</td>
            <td><button onclick="openFeedbackForm('Lunch')">Rate</button></td>
        </tr>
        <tr>
            <td>Dinner</td>
            <td>7:00 pm</td>
            <td>${todayMenu.dinner}</td>
            <td><button onclick="openFeedbackForm('Dinner')">Rate</button></td>
        </tr>
    `;
}
async function saveMenu(day) {
    const breakfast = document.querySelector(`[data-day="${day}"][data-meal="breakfast"]`).innerText;
    const lunch = document.querySelector(`[data-day="${day}"][data-meal="lunch"]`).innerText;
    const dinner = document.querySelector(`[data-day="${day}"][data-meal="dinner"]`).innerText;

    const response = await fetch("http://localhost/triveni_mess/api.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ day, breakfast, lunch, dinner }),
    });

    const result = await response.json();
    alert(result.message);
}
function logoutUser() {
    sessionStorage.removeItem("loggedInUser"); // Remove admin session
    alert("You have logged out!");
    location.reload(); // Reload page to reflect logout
}



//login func
async function loginUser() {
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    let response = await fetch("http://localhost/triveni_mess/login.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    });

    let result = await response.json();

    if (result.status === "success") {
        alert("Login Successful!");
        document.getElementById("login-form").style.display = "none";
        sessionStorage.setItem("loggedInUser", username); // Store login session in browser
    } else {
        alert("Invalid Username or Password!");
    }
}

async function fetchWeeklyMenu() {
    try {
        const response = await fetch("http://localhost/triveni_mess/api.php");
        const menu = await response.json();

        const tableBody = document.getElementById("weekly-menu-table");
        tableBody.innerHTML = ""; // Clear old content

        const isAdmin = sessionStorage.getItem("loggedInUser"); // Check if admin is logged in

        menu.forEach((item) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${item.day}</td>
                <td contenteditable="${isAdmin ? 'true' : 'false'}" data-day="${item.day}" data-meal="breakfast">${item.breakfast}</td>
                <td contenteditable="${isAdmin ? 'true' : 'false'}" data-day="${item.day}" data-meal="lunch">${item.lunch}</td>
                <td contenteditable="${isAdmin ? 'true' : 'false'}" data-day="${item.day}" data-meal="dinner">${item.dinner}</td>
                ${isAdmin ? `<td><button onclick="saveMenu('${item.day}')">Save</button></td>` : ""}
            `;
            tableBody.appendChild(row);
        });

        document.getElementById("weekly-menu").style.display = "block"; // Show menu

    } catch (error) {
        console.error("Error fetching weekly menu:", error);
    }
}




window.onload = function () {
    fetchTodayMenu();
    fetchWeeklyMenu();

    const isAdmin = sessionStorage.getItem("loggedInUser");

    if (!isAdmin) {
        document.getElementById("weekly-menu-btn").style.display = "none";
        document.getElementById("logout-btn").style.display = "none";
    } else {
        document.getElementById("weekly-menu-btn").style.display = "inline-block";
        document.getElementById("logout-btn").style.display = "inline-block"; // Show logout button when admin is logged in
    }
};

