let guessCount = 0;
let wrongGuessCount = 0;

const map = L.map('map').setView([20, 0], 2);

const victorySound = document.getElementById('victory-sound');

// Add tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

const livedCities = [
  {
    name: "Harbin, China", lat: 45.75, lng: 126.65,
    clue: "Famous for its ice and snow festival.",
    description: "Here was my first destination after leaving Brasil, one of the coldest cities in China, where during winter the average temperature is -17°C, and some days I experienced -32°C. As part of the Chinese culture, they have a great respect towards the older or higher in hierarchy, where even the position of your glass when cheering had a meaning. (Your glass should always be below the others, to show respect). Also, drinking alcohol is a huge part of their culture, it was normal for some people you just met to ask how many bottles of beer you can drink. This was measured in 600 mL bottles. And if you end up going for dinner with them, they will challenge you and make you drink as much as you can. Everyone gets their own bottles, to keep count, and when someone shouts ‘Ganbei’ (which means Cheers or bottoms up), everyone takes their short glass full of beer and drinks bottoms up. I’ve seen people drinking 18 bottles of beer in a 2-hour dinner. And most of them seem to be fine after that.",
    images: ["images/harbin.jpg", "images/harbin2.jpg", "images/harbin3.jpg"]
  },
  {
    name: "Dubai, UAE", lat: 25.20, lng: 55.27,
    clue: "Home to the tallest building on Earth.",
    description: "I was fortunate enough to work at Jumeirah Beach Hotel there, and the restaurant I was working at was on the beach in front of the Burj al Arab. Every day I would see that iconic building, and even after 3 years seen it, I would still find it amazing. Dubai is well known for the manmade landmarks: Palm Jumeirah, Burj Khalifa, the biggest mall in the world, the water canal, etc. For me it’s a place of an amazing diverse culture where 90% of the population are foreign and are there just to work, most of them coming from India, Bangladesh, Pakistan and Philippines, so for me I learned more from those cultures than the local culture, especially because on the restaurant I worked most of the staff were from those countries. I remember one day I was in a grocery store, an Arabic man entered speaking Arabic, and no one from the store was able to understand him.",
    images: ["images/dubai.jpg", "images/dubai2.jpg", "images/dubai3.jpg"]
  },
  {
    name: "Punta Cana, Dominican Republic", lat: 18.58, lng: -68.40,
    clue: "Tropical beaches and Caribbean vibes.",
    description: "The Dominican Republic was the first country of Spanish language I lived in, and believe it or not, for someone speaking Portuguese was quite the challenge. Between their culture and how fast they talk, I am still impressed by how I was able to go day by day. This city is known for its big all-inclusive resorts. The hotel where I was the Executive Sous Chef had 500 rooms (not so big compared to other hotels), 8 restaurants, 1 coffee shop, and a 24-hour Room Service. If you are hungry at any time, you could find food somewhere in the resort. Which means that a LOT needed to be prepared daily. The kitchen had 200 cooks, plus 50 stewards (They were in charge of cleaning the kitchen), and on average per week, the hotel consumes: 1000 kg of potatoes, 300kg of filet mignon, and around 200 kg of lobster tail (YES; Lobster was included on the All-Inclusive package, you should go see it for yourself!) ",
    images: ["images/puntacana.jpg", "images/puntacana2.jpg", "images/puntacana3.jpg"]
  },
  {
    name: "Cancun, Mexico", lat: 21.16, lng: -86.85,
    clue: "Mayan ruins and Spring Break parties.",
    description: "Every other city I went to live because of work, here I came because of love. My now wife was transferred here, and after spending the pandemic far away (She was in Mexico, I was in Sao Paulo). We finally started living together in 2020. Cancun is well known for tourism, its beaches, and All-Inclusive resorts. Besides being a very young city, with only 55 years old, and a small city, with only 900 thousand inhabitants, it’s the most visited city in Latin America, with more than 16 million visitors every year. I also had the opportunity to work for an 810-room all-inclusive resort as Executive Chef, which helped me to understand a bit more about the Mexican culture and their food. For the locals, corn tortilla is the base for any meal, and they have to eat it every day (yes, it is a need, even with soup, they have to roll some tortillas to accompany it). I also found out that most of the Mexican food we see worldwide is actually Tex-Mex and the locals do not eat it. So forget about hard shell tacos, shredded lettuce, and refried beans, here most of the tacos are just corn tortilla (soft) and meat, which could be pork or beef, from different parts of the animal. The sauces are served on the side, and for them, nothing is spicy. (But you should never trust them)",
    images: ["images/cancun.jpg", "images/cancun2.jpg", "images/cancun3.jpg" ]
  },
  {
    name: "São Paulo, Brasil", lat: -23.55, lng: -46.63,
    clue: "The largest city in Brasil and South America.",
    description: "I was born and raised here. Besides the insecurity, traffic, and the number of people, I love this city. Here is where my family and friends lives, where my heart (trully) is and I always try to visit. With around 12 million inhabitants, the traffic is crazy; not only are there millions of cars, but there are even more motorcycles. And they always drive between cars, making it more insane, but I can guarantee that we don’t drive that badly (Dominicans win that battle).Brasil has always welcomed people from different parts of the world, the biggest Japanese community outside Japan is in São Paulo. The biggest Italian community? São Paulo also. With so many immigrants, you see their influence everywhere, in architecture, music, and food. Making São Paulo a place where you can find all types of restaurants available at any time, and really good food. My favourites as must-tries in Brazilian cuisine: Pão de Queijo (Cassava Cheese Bread), Coxinha (Chicken croquette), Feijoada (Black beans and pork meat), Pastel (Deep-fried dough with different fillings), and many more.",
    images: ["images/saopaulo.jpg", "images/saopaulo2.jpg", "images/saopaulo3.jpg"]
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
const correctSound = document.getElementById('correct-sound');
const wrongSound = document.getElementById('wrong-sound');
let currentImages = [];
let imageIndex = 0;
let lastRoundCities = [];

function getNewRoundCities() {
  let remaining = livedCities.filter(c => !guessed.has(c.name));
  if (remaining.length === 0) {
  victorySound.play();
  showModal(
  "🏆 You found all cities!",
  `You solved it in <strong>${guessCount}</strong> guesses.`,
  () => {
    guessed.clear();
    guessCount = 0;
    wrongGuessCount = 0;
    updateStats();
    addMarkers(getNewRoundCities());
  },
  "Play Again"
);
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
  guessCount++;

  const real = livedCities.find(c => c.name === city.name);
  if (real) {
    correctSound.play();
    guessed.add(city.name);
    updateStats();
    currentImages = real.images;
    imageIndex = 0;
    showModal(
      `✅ You found ${city.name}`,
      `${real.description}`,
      () => showGallery()
    );
  } else {
    wrongSound.play();
    wrongGuessCount++;
    updateStats();
    const remaining = livedCities.filter(c => !guessed.has(c.name));
    const randomCity = remaining[Math.floor(Math.random() * remaining.length)];
    showModal(
      `❌ You chose ${city.name}`,
      `Clue: ${randomCity.clue}`,
      () => addMarkers(getNewRoundCities())
    );
  }
}

function updateStats() {
  document.getElementById("found-count").textContent = guessed.size;
  document.getElementById("total-guesses").textContent = guessCount;
  document.getElementById("wrong-guesses").textContent = wrongGuessCount;
}

function showModal(title, body, actionFn, actionText) {
  const modal = document.getElementById("modal");
  const modalBody = document.getElementById("modal-body");
  const modalAction = document.getElementById("modal-action");
  const imageNav = document.getElementById("image-nav");

  modal.classList.remove("hidden");
  modalBody.innerHTML = `<h2>${title}</h2><p>${body}</p>`;
  modalAction.textContent = actionFn
  ? actionText || (title.startsWith("✅") ? "Show Photos" : "Keep Investigating")
  : "Close";

  imageNav.classList.add("hidden"); // Hide gallery
  modalAction.onclick = () => {
    modal.classList.add("hidden");
    if (actionFn) actionFn();
  };
}

function showGallery() {
  const modal = document.getElementById("modal");
  const modalBody = document.getElementById("modal-body");
  const imageNav = document.getElementById("image-nav");
  const galleryImg = document.getElementById("gallery-img");

  // Clear previous modal text content
  modalBody.innerHTML = `<img id="gallery-img" src="${currentImages[imageIndex]}" style="width:100%; max-height:600px; object-fit:contain;">`;

  imageNav.classList.remove("hidden");
  modal.classList.remove("hidden");

  const modalAction = document.getElementById("modal-action");
  modalAction.textContent = "Keep Investigating";
  modalAction.onclick = () => {
    modal.classList.add("hidden");
    addMarkers(getNewRoundCities());
  };

  // Re-bind arrows now that gallery-img is regenerated
  document.getElementById("prev-img").onclick = () => {
    imageIndex = (imageIndex - 1 + currentImages.length) % currentImages.length;
    document.getElementById("gallery-img").src = currentImages[imageIndex];
  };

  document.getElementById("next-img").onclick = () => {
    imageIndex = (imageIndex + 1) % currentImages.length;
    document.getElementById("gallery-img").src = currentImages[imageIndex];
  };
}

document.getElementById("prev-img").onclick = () => {
  imageIndex = (imageIndex - 1 + currentImages.length) % currentImages.length;
  document.getElementById("gallery-img").src = currentImages[imageIndex];
};

document.getElementById("next-img").onclick = () => {
  imageIndex = (imageIndex + 1) % currentImages.length;
  document.getElementById("gallery-img").src = currentImages[imageIndex];
};

function showImage(imagePath) {
  showModal("", `<img src="${imagePath}" style="width:100%">`, () => addMarkers(getNewRoundCities()));
}



addMarkers(getNewRoundCities());
