async function findRecipes() {
  const input = document.getElementById("ingredientsInput").value;
  if (!input) {
    alert("Please enter ingredients!");
    return;
  }

  // Show loading animation
  document.getElementById("loading").style.display = "block";
  document.getElementById("results").innerHTML = "";

  try {
    // Call Spoonacular API with your key
    const response = await fetch(
      `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${encodeURIComponent(input)}&number=10&ranking=1&apiKey=67b40b86de8e475c8781175d2d1ac44a`
    );
    const data = await response.json();

    displayResults(data);
  } catch (err) {
    document.getElementById("results").innerHTML = "<p>Error fetching recipes 😕</p>";
  } finally {
    document.getElementById("loading").style.display = "none";
  }
}

function displayResults(recipes) {
  const container = document.getElementById("results");
  container.innerHTML = "";

  if (!recipes || recipes.length === 0) {
    container.innerHTML = "<p>No recipes found 😕</p>";
    return;
  }

  recipes.forEach(r => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      <h3>${r.title}</h3>
      <img src="${r.image}" alt="${r.title}" style="width:100%;border-radius:8px;">
    `;
    container.appendChild(div);
  });
}
