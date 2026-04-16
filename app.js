const API_KEY = "67b40b86de8e475c8781175d2d1ac44a";

function chooseSearch(type) {
  const section = document.getElementById("dynamicSection");
  section.innerHTML = "";

  if (type === "name") {
    section.innerHTML = `
      <input type="text" id="dishName" placeholder="Enter dish name (e.g. Lemon Rice)">
      <button onclick="searchByName()">Search</button>
    `;
  } else {
    section.innerHTML = `
      <input type="text" id="ingredientsInput" placeholder="Enter ingredients (e.g. rice, lemon)">
      <p>Only Veg?</p>
      <button onclick="searchByIngredients(true)">Yes</button>
      <button onclick="searchByIngredients(false)">No</button>
    `;
  }
}

// --- Search by Name ---
async function searchByName() {
  const dish = document.getElementById("dishName").value;
  if (!dish) return alert("Enter a dish name!");

  document.getElementById("loading").style.display = "block";
  document.getElementById("results").innerHTML = "";

  try {
    const res = await fetch(
      `https://api.spoonacular.com/recipes/complexSearch?query=${encodeURIComponent(dish)}&number=1&apiKey=${API_KEY}`
    );
    const data = await res.json();
    if (data.results.length === 0) {
      document.getElementById("results").innerHTML = "<p>No recipe found 😕</p>";
    } else {
      askServings(data.results[0].id);
    }
  } catch {
    document.getElementById("results").innerHTML = "<p>Error fetching recipe 😕</p>";
  } finally {
    document.getElementById("loading").style.display = "none";
  }
}

// --- Search by Ingredients ---
async function searchByIngredients(vegOnly) {
  const input = document.getElementById("ingredientsInput").value;
  if (!input) return alert("Enter ingredients!");

  document.getElementById("loading").style.display = "block";
  document.getElementById("results").innerHTML = "";

  try {
    const url = `https://api.spoonacular.com/recipes/complexSearch?includeIngredients=${encodeURIComponent(input)}&number=5${vegOnly ? "&diet=vegetarian" : ""}&apiKey=${API_KEY}`;
    const res = await fetch(url);
    const data = await res.json();

    if (data.results.length === 0) {
      document.getElementById("results").innerHTML = "<p>No recipes found 😕</p>";
    } else {
      // Show recipe options
      data.results.forEach(r => {
        const div = document.createElement("div");
        div.className = "card";
        div.innerHTML = `
          <h3>${r.title}</h3>
          <img src="${r.image}" style="width:100%;border-radius:8px;">
          <button onclick="askServings(${r.id})">Select</button>
        `;
        document.getElementById("results").appendChild(div);
      });
    }
  } catch {
    document.getElementById("results").innerHTML = "<p>Error fetching recipes 😕</p>";
  } finally {
    document.getElementById("loading").style.display = "none";
  }
}

// --- Ask Servings ---
function askServings(id) {
  const container = document.getElementById("results");
  container.innerHTML = `
    <p>How many people are you cooking for?</p>
    <input type="number" id="servingsInput" min="1" value="2">
    <button onclick="showIngredients(${id})">Confirm</button>
  `;
}

// --- Show Ingredients ---
async function showIngredients(id) {
  const servings = document.getElementById("servingsInput").value;

  document.getElementById("loading").style.display = "block";
  document.getElementById("results").innerHTML = "";

  try {
    const res = await fetch(
      `https://api.spoonacular.com/recipes/${id}/information?includeNutrition=false&apiKey=${API_KEY}`
    );
    const recipe = await res.json();

    const container = document.getElementById("results");
    container.innerHTML = `
      <h2>${recipe.title}</h2>
      <img src="${recipe.image}" style="width:100%;border-radius:8px;">
      <h3>Ingredients for ${servings} people:</h3>
      <ul>
        ${recipe.extendedIngredients.map(i => {
          const scaled = (i.amount / recipe.servings) * servings;
          return `<li>${scaled.toFixed(1)} ${i.unit} ${i.name}</li>`;
        }).join("")}
      </ul>
      <button onclick="showInstructions(${id})">Ingredients ready, Start Cooking!</button>
    `;
  } catch {
    document.getElementById("results").innerHTML = "<p>Error loading recipe 😕</p>";
  } finally {
    document.getElementById("loading").style.display = "none";
  }
}

// --- Show Instructions ---
async function showInstructions(id) {
  document.getElementById("loading").style.display = "block";
  document.getElementById("results").innerHTML = "";

  try {
    const res = await fetch(
      `https://api.spoonacular.com/recipes/${id}/information?apiKey=${API_KEY}`
    );
    const recipe = await res.json();

    const steps = recipe.analyzedInstructions[0]?.steps || [];
    let stepIndex = 0;

    function renderStep() {
      const container = document.getElementById("results");
      if (stepIndex < steps.length) {
        container.innerHTML = `
          <h2>${recipe.title}</h2>
          <p><b>Step ${stepIndex + 1}:</b> ${steps[stepIndex].step}</p>
          <button onclick="nextStep()">Next Step</button>
        `;
      } else {
        container.innerHTML = `<h2>${recipe.title}</h2><p>✅ Cooking complete! Enjoy your meal.</p>`;
      }
    }

    window.nextStep = function() {
      stepIndex++;
      renderStep();
    };

    renderStep();
  } catch {
    document.getElementById("results").innerHTML = "<p>Error loading instructions 😕</p>";
  } finally {
