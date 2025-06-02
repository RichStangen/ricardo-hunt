const livedCities = [
  { name: "Harbin, China", clue: "This city is known for its ice festivals.", image: "harbin.png", description: "Harbin is famous for its icy winters and Russian architecture." },
  { name: "Dubai, UAE", clue: "A city with the tallest building in the world.", image: "dubai.png", description: "Dubai dazzles with modern skyscrapers and desert beauty." },
  { name: "Punta Cana, DR", clue: "A paradise known for its beaches in the Caribbean.", image: "puntacana.png", description: "Punta Cana is a tropical haven on the Dominican coast." },
  { name: "Cancun, Mexico", clue: "Popular spring break spot with Mayan ruins nearby.", image: "cancun.png", description: "Cancun blends turquoise waters with ancient history." },
  { name: "Sao Paulo, Brazil", clue: "The largest city in South America.", image: "saopaulo.png", description: "Sao Paulo buzzes with culture, cuisine, and commerce." },
];

const allCities = [
  ...livedCities.map(c => c.name),
  "Paris, France", "Tokyo, Japan", "Sydney, Australia",
  "Toronto, Canada", "Berlin, Germany", "Bangkok, Thailand",
  "Rome, Italy", "Cape Town, South Africa", "New York, USA"
];

let guessedCities = new Set();

const getRandomCities = (correctCity) => {
  const wrong = allCities.filter(c => c !== correctCity.name && !livedCities.find(l => l.name === c));
  const randomWrong = wrong.sort(() => 0.5 - Math.random()).slice(0, 3);
  const mixed = [...randomWrong, correctCity.name].sort(() => 0.5 - Math.random());
  return mixed;
};

const renderChoices = () => {
  let remaining = livedCities.filter(c => !guessedCities.has(c.name));
  if (remaining.length === 0) {
    document.getElementById("message-box").innerHTML = "<h2>You found all cities!</h2>";
    document.getElementById("city-options").innerHTML = "";
    return;
  }

  const targetCity = remaining[Math.floor(Math.random() * remaining.length)];
  const options = getRandomCities(targetCity);
  const container = document.getElementById("city-options");
  container.innerHTML = "";

  options.forEach(city => {
    const btn = document.createElement("button");
    btn.textContent = city;
    btn.onclick = () => handleSelection(city, targetCity);
    container.appendChild(btn);
  });

  document.getElementById("message-box").innerHTML = "";
};

const handleSelection = (selected, correct) => {
  const messageBox = document.getElementById("message-box");

  if (selected === correct.name) {
    guessedCities.add(correct.name);
    messageBox.innerHTML = `
      <h2>✅ You found ${correct.name}!</h2>
      <p>${correct.description}</p>
      <img src="${correct.image}" alt="${correct.name}"/>
    `;
  } else {
    const randomCity = livedCities.filter(c => !guessedCities.has(c.name))[Math.floor(Math.random() * (livedCities.length - guessedCities.size))];
    messageBox.innerHTML = `
      <h2>❌ Not quite!</h2>
      <p>Clue: ${randomCity.clue}</p>
    `;
  }
};

document.getElementById("next-btn").addEventListener("click", renderChoices);

// Start game
renderChoices();
