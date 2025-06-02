const map = L.map('map').setView([20, 0], 2);

// Add tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

const livedCities = [
  {
    name: "Harbin, China", lat: 45.75, lng: 126.65,
    clue: "Famous for its ice and snow festival.",
    description: "Harbin is known for its Russian influence and winter festivities.",
    image: "images/harbin1.png"
  },
  {
    name: "Dubai, UAE", lat: 25.20, lng: 55.27,
    clue: "Home to the tallest building on Earth.",
    description: "Dubai is a desert metropolis of futuristic design and luxury.",
    image: "images/dubai1.png"
  },
  {
    name: "Punta Cana, DR", lat: 18.58, lng: -68.40,
    clue: "Tropical beaches and Caribbean vibes.",
    description: "Punta Cana is a resort town in the Dominican Republic.",
    image: "images/puntacana1.png"
  },
  {
    name: "Cancun, Mexico", lat: 21.16, lng: -86.85,
    clue: "Mayan ruins and Spring Break parties.",
    description: "Cancun offers turquoise beaches and historical wonders.",
    image: "images/cancun1.png"
  },
  {
    name: "Sao Paulo, Brazil", lat: -23.55, lng: -46.63,
    clue: "The largest city in Brazil and South America.",
    description: "Sao Paulo is a sprawling, vibrant urban giant.",
    image: "images/saopaulo1.png"
  }
];

const wrongCities = [
  { name: "Toronto, Canada", lat: 43.65, lng: -79.38 },
  { name: "Paris, France", lat: 48.85, lng: 2.35 },
  { name: "Tokyo, Japan", lat: 35.68, lng: 139.69 },
  { name: "Cairo, Egypt", lat: 30.04, lng: 31.24 },
  { name: "Rome, Italy", lat: 41.90, lng: 12.50 },
  { name: "Bangkok, Thailand", lat: 13.75, lng: 100.50 },
  { name: "Cape Town, SA", lat: -33.92, lng: 18.42 },
  { name: "New York, USA", lat: 40.71, lng: -74.00 },
];

let guessed = new Set();
let lastRoundCities = [];

function getNewRoundCities() {
  let remaining = livedCities.filter(c => !guessed.has(c.name));
  if (remaining.length === 0) {
    showModal("🏆 You found all cities!", "", null);
    return [];
  }

  const correctCity = remaining[Math.floor(Math.random() * remaining.length)];
  let options = [correctCity];
  while (options.length < 5) {
    const candidate = wrongCities[Math.floor(Math.random() * wrongCities.length)];
    if (!options.some(o => o.name === candidate.name)) options.push(candidate);
  }
  return options.sort(() => Math.random() - 0.5);
}

function addMarkers(cities) {
  map.eachLayer(layer => {
    if (layer instanceof L.Marker) map.removeLayer(layer);
  });

  lastRoundCities = cities;
  cities.forEach(city => {
    const marker = L.marker([city.lat, city.lng]).addTo(map);
    marker.on('click', () => handleSelection(city));
  });
}

function handleSelection(city) {
  const real = livedCities.find(c => c.name === city.name);
  if (real) {
    guessed.add(city.name);
    showModal(
      `✅ You found ${city.name}`,
      `${real.description}`,
      () => showImage(real.image)
    );
  } else {
    const remaining = livedCities.filter(c => !guessed.has(c.name));
    const randomCity = remaining[Math.floor(Math.random() * remaining.length)];
    showModal("❌ Not quite!", `Clue: ${randomCity.clue}`, () => addMarkers(getNewRoundCities()));
  }
}

function showModal(title, body, actionFn) {
  const modal = document.getElementById("modal");
  const modalBody = document.getElementById("modal-body");
  const modalAction = document.getElementById("modal-action");

  modal.classList.remove("hidden");
  modalBody.innerHTML = `<h2>${title}</h2><p>${body}</p>`;
  modalAction.textContent = actionFn ? (title.startsWith("✅") ? "Show Photo" : "Keep Investigating") : "Close";
  modalAction.onclick = () => {
    modal.classList.add("hidden");
    if (actionFn) actionFn();
  };
}

function showImage(imagePath) {
  showModal("", `<img src="${imagePath}" style="width:100%">`, () => addMarkers(getNewRoundCities()));
}

document.getElementById("modal-close").onclick = () => {
  document.getElementById("modal").classList.add("hidden");
};

addMarkers(getNewRoundCities());
