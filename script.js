const apiKey = '0e00bd881c455a9ddefa89f35634fe82'; // OpenWeatherMap API key
const form = document.forms['driverForm'];
const beep = document.getElementById('beepAudio');

// Google Apps Script URL – replace with your actual script deployment URL
const googleFormScriptURL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';

// ===== Form Submission =====
form.addEventListener('submit', e => {
    e.preventDefault();

    const name = form.Name.value;
    const license = form.License.value;
    const vehicle = form.Vehicle.value;

    document.getElementById('driverSummary').innerHTML = `
    <h2>Welcome, ${name}</h2>
    <p><strong>License:</strong> ${license}</p>
    <p><strong>Vehicle:</strong> ${vehicle}</p>
  `;

    fetch(googleFormScriptURL, { method: 'POST', body: new FormData(form) })
        .then(() => alert("Form submitted to Google Sheets successfully."))
        .catch(err => alert("Submission failed."));

    form.reset();
});

// ====== Real Location & Weather ======
function getDriverLocationAndWeather() {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const lat = pos.coords.latitude;
                const lon = pos.coords.longitude;
                fetchWeather(lat, lon);
            },
            (err) => {
                console.warn("Geolocation error:", err);
                fetchWeather(-1.2921, 36.8219); // fallback: Nairobi
            }
        );
    } else {
        fetchWeather(-1.2921, 36.8219);
    }
}

async function fetchWeather(lat, lon) {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
    try {
        const res = await fetch(url);
        const data = await res.json();

        const city = data.name || 'Unknown';
        const country = data.sys.country || '';
        const temp = data.main.temp + '°C';
        const condition = data.weather[0].main;
        const humidity = data.main.humidity + '%';

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
function simulateSpeed() {
    const speed = Math.floor(Math.random() * 121);
    document.getElementById('speed').textContent = speed + ' km/h';
    document.getElementById('speedLevel').textContent = speed + ' km/h';

    if (speed > 100) {
        triggerAlert("⚠️ Overspeeding Detected!", true);
    }
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
    addToLog(log);

    if (tire !== 'Normal' || battery !== 'Good') {
        triggerAlert("⚠️ Vehicle Fault Detected!", true);
    }
});

// ====== AI Driving Tips ======
const tips = [
    "Avoid distractions while driving.",
    "Check tire pressure regularly.",
    "Use indicators when turning.",
    "Keep both hands on the wheel.",
    "Don’t tailgate the car in front.",
    "Follow speed limits.",
    "Take breaks on long drives.",
    "Stay calm in traffic.",
    "Watch for pedestrians."
];
setInterval(() => {
    const randomTip = tips[Math.floor(Math.random() * tips.length)];
    document.getElementById('aiTips').textContent = randomTip;
}, 10000);

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

function addToLog(entry) {
    const logList = document.getElementById('logList');
    const li = document.createElement('li');
    li.textContent = entry;
    logList.appendChild(li);
}

// ====== Initialization ======
getDriverLocationAndWeather();
setInterval(simulateSpeed, 5000);
