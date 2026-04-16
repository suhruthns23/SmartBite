const recipes = [
  {
    title: "Egg Fried Rice",
    ingredients: ["egg", "rice", "onion"],
    steps: ["Boil rice", "Fry egg", "Mix everything"]
  },
  {
    title: "Tomato Omelette",
    ingredients: ["egg", "tomato"],
    steps: ["Beat egg", "Add tomato", "Fry"]
  },
  {
    title: "Simple Rice Bowl",
    ingredients: ["rice"],
    steps: ["Cook rice", "Serve hot"]
  }
];

function findRecipes() {
  const input = document.getElementById("ingredientsInput").value.toLowerCase();
  const userIngredients = input.split(",").map(i => i.trim());

  const results = recipes.filter(recipe =>
    recipe.ingredients.some(ing => userIngredients.includes(ing))
  );

  displayResults(results);
}

function displayResults(results) {
  const container = document.getElementById("results");
  container.innerHTML = "";

  if (results.length === 0) {
    container.innerHTML = "<p>No recipes found 😕</p>";
    return;
  }

  results.forEach(r => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      <h3>${r.title}</h3>
      <p><b>Ingredients:</b> ${r.ingredients.join(", ")}</p>
      <p><b>Steps:</b> ${r.steps.join(" → ")}</p>
    `;
    container.appendChild(div);
  });
}
