// ===== API Keys & URLs =====
const apiKey = '0e00bd881c455a9ddefa89f35634fe82'; // OpenWeatherMap API key
const googleFormScriptURL = 'https://script.google.com/macros/s/AKfycbzdRNq_5XXDtD1cHHgh5UHLoH6sV9gORCXymqCONcEorHObgkI8rQkmUyK2yRJpdCb6Sw/exec';

const form = document.forms['driverForm'];
const beep = document.getElementById('beepAudio');

form.addEventListener('submit', e => {
    e.preventDefault();

    const driverData = {
        name: form.Name.value,
        license: form.License.value,
        vehicleType: form.VehicleType.value,
        plateNumber: form.PlateNumber.value,
        odometer: form.Odometer.value,
        fuelType: form.FuelType.value,
        lastService: form.LastService.value,
        insuranceExpiry: form.InsuranceExpiry.value,
        emergencyName: form.EmergencyName.value,
        emergencyPhone: form.EmergencyPhone.value
    };

    // Display driver summary
    document.getElementById('driverSummary').innerHTML = `
        <h2>Welcome, ${driverData.name}</h2>
        <p><strong>License:</strong> ${driverData.license}</p>
        <p><strong>Vehicle:</strong> ${driverData.vehicleType} (${driverData.plateNumber})</p>
        <p><strong>Odometer:</strong> ${driverData.odometer} km</p>
        <p><strong>Fuel Type:</strong> ${driverData.fuelType}</p>
        <p><strong>Last Service:</strong> ${driverData.lastService}</p>
        <p><strong>Insurance Expiry:</strong> ${driverData.insuranceExpiry}</p>
        <p><strong>Emergency Contact:</strong> ${driverData.emergencyName} (${driverData.emergencyPhone})</p>
    `;

    // Send to Google Sheets
    fetch(googleFormScriptURL, { method: 'POST', body: new FormData(form) })
        .then(() => alert("Form submitted to Google Sheets successfully."))
        .catch(() => alert("Submission failed."));

    form.reset();
});

// ====== Location & Weather ======
function getDriverLocationAndWeather() {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
            pos => fetchWeather(pos.coords.latitude, pos.coords.longitude),
            err => {
                console.warn("Geolocation error:", err);
                fetchWeather(-1.2921, 36.8219); // fallback: Nairobi
            }
        );
    } else {
        fetchWeather(-1.2921, 36.8219);
    }
}

async function fetchWeather(lat, lon) {
    try {
        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`);
        const data = await res.json();

        const city = data.name || 'Unknown';
        const country = data.sys.country || '';
        const temp = data.main.temp + '°C';
        const condition = data.weather[0].main;

        document.getElementById('location').textContent = `${city}, ${country}`;
        document.getElementById('locationMonitor').textContent = `${city}, ${country}`;
        document.getElementById('mapLink').href = `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`;
        document.getElementById('mapLinkMonitor').href = `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`;
        document.getElementById('weather').textContent = `Condition: ${condition}`;
        document.getElementById('temperature').textContent = `Temperature: ${temp}`;
    } catch (err) {
        console.error("Weather fetch failed:", err);
    }
}

// ====== Speed Simulation ======
let lastSpeed = 80;
function simulateSpeed() {
    const speed = Math.floor(Math.random() * 121);
    document.getElementById('speed').textContent = speed + ' km/h';
    document.getElementById('speedLevel').textContent = speed + ' km/h';

    if (speed > 100) triggerAlert("⚠️ Overspeeding Detected!", true);

    // Collision detection
    const speedDrop = lastSpeed - speed;
    const collisionSpan = document.getElementById('Real-time-collision-detection');
    if (speedDrop > 40) {
        const warning = `🚨 Possible Collision (speed drop ${lastSpeed} → ${speed})`;
        collisionSpan.style.color = 'red';
        collisionSpan.textContent = "Collision Risk!";
        logIncident(warning);
        triggerAlert(warning, true);
    } else {
        collisionSpan.textContent = "Normal";
        collisionSpan.style.color = "green";
    }
    lastSpeed = speed;
}

// ====== Diagnostic System ======
document.getElementById('runDiagnostic').addEventListener('click', () => {
    const tireStatus = ['Normal', 'Low', 'Flat'];
    const batteryStatus = ['Good', 'Low', 'Critical'];

    const tire = tireStatus[Math.floor(Math.random() * tireStatus.length)];
    const battery = batteryStatus[Math.floor(Math.random() * batteryStatus.length)];

    document.getElementById('tirePressure').textContent = tire;
    document.getElementById('batteryLevel').textContent = battery;

    const now = new Date().toLocaleString();
    const log = `🔧 ${now} | Tire: ${tire}, Battery: ${battery}`;
    logIncident(log);

    if (tire !== 'Normal' || battery !== 'Good') triggerAlert("⚠️ Vehicle Fault Detected!", true);
});

// ====== AI Driving Tips ======
const tips = [
    "Avoid distractions while driving.",
    "Check tire pressure regularly.",
    "Use indicators when turning.",
    "Keep both hands on the wheel.",
    "Don’t tailgate.",
    "Follow speed limits.",
    "Take breaks on long drives.",
    "Stay calm in traffic.",
    "Watch for pedestrians."
];
setInterval(() => {
    document.getElementById('aiTips').textContent = tips[Math.floor(Math.random() * tips.length)];
}, 10000);

// ====== Fuel Level Simulation ======
function simulateFuelLevel() {
    const fuelSpan = document.getElementById('fuelLevel');
    const fuelPercentage = Math.floor(Math.random() * (100 - 5 + 1)) + 5;
    fuelSpan.textContent = `${fuelPercentage}%`;

    if (fuelPercentage < 15) {
        const warning = `⛽ Low Fuel (${fuelPercentage}%)`;
        logIncident(warning);
        triggerAlert(warning, true);
    }
}

// ====== Engine Temperature ======
function simulateEngineTemperature() {
    const engineSpan = document.getElementById('engineTemp');
    const temperature = Math.floor(Math.random() * 120);
    engineSpan.textContent = `${temperature}°C`;

    if (temperature > 100) {
        const warning = `🔥 Engine Overheat (${temperature}°C)`;
        logIncident(warning);
        triggerAlert(warning, true);
        engineSpan.style.color = "red";
    } else {
        engineSpan.style.color = "green";
    }
}

// ====== Brake System Check ======
function simulateBrakeSystem() {
    const brakeSpan = document.getElementById('BrakeSystemCheck');
    const status = Math.random() > 0.8 ? "Issue Detected" : "Normal";
    brakeSpan.textContent = status;

    if (status === "Issue Detected") {
        const warning = `🛑 Brake System Issue`;
        brakeSpan.style.color = "red";
        logIncident(warning);
        triggerAlert(warning, true);
    } else {
        brakeSpan.style.color = "green";
    }
}

// ====== Alerts & Logs ======
function triggerAlert(message, playSound = false) {
    const alertBox = document.getElementById('alerts');
    const alert = document.createElement('div');
    alert.className = 'alert';
    alert.textContent = message;
    alertBox.appendChild(alert);

    setTimeout(() => alert.remove(), 6000);
    if (playSound) beep.play();
}

function logIncident(entry) {
    const logList = document.getElementById('logList');
    const li = document.createElement('li');
    li.textContent = entry;
    logList.appendChild(li);
}

// ====== Initialization ======
document.addEventListener('DOMContentLoaded', () => {
    getDriverLocationAndWeather();
    simulateFuelLevel();
    simulateEngineTemperature();
    simulateBrakeSystem();
    simulateSpeed();

    setInterval(() => {
        simulateFuelLevel();
        simulateEngineTemperature();
        simulateBrakeSystem();
        simulateSpeed();
    }, 10000);
});
