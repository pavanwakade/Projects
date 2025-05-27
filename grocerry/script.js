// Load Header and Footer
async function loadComponent(id, file) {
  try {
    const response = await fetch(file);
    const text = await response.text();
    document.getElementById(id).innerHTML = text;

    // Highlight current page after header or footer is loaded
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    if (id === 'header') {
      const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
      navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    } else if (id === 'footer') {
      const footerLinks = document.querySelectorAll('.footer-links a');
      footerLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    }
  } catch (error) {
    console.error(`Error loading ${id}:`, error);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadComponent('header', 'header.html');
  loadComponent('footer', 'footer.html');

  // Newsletter form submission
  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Thank you for subscribing!');
      newsletterForm.reset();
    });
  }
});

// Existing carousel, search, and recipe logic (unchanged)
const slides = document.getElementById("slides");
const totalSlides = slides ? slides.children.length : 0;
let index = 0;
let slideInterval;
const video = slides ? slides.querySelector('video') : null;

function showSlide() {
  if (slides) {
    slides.style.transform = `translateX(-${index * 100}%)`;
    document.querySelectorAll('.dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });
  }
}

function autoSlide() {
  if (video && !video.paused) return;
  index = (index + 1) % totalSlides;
  showSlide();
}

if (slides) {
  slideInterval = setInterval(autoSlide, 5000);
  if (video) {
    video.addEventListener('play', () => clearInterval(slideInterval));
    video.addEventListener('ended', () => slideInterval = setInterval(autoSlide, 5000));
  }

  const prevBtn = document.querySelector('.prev');
  const nextBtn = document.querySelector('.next');

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      index = (index - 1 + totalSlides) % totalSlides;
      showSlide();
      clearInterval(slideInterval);
      slideInterval = setInterval(autoSlide, 5000);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      index = (index + 1) % totalSlides;
      showSlide();
      clearInterval(slideInterval);
      slideInterval = setInterval(autoSlide, 5000);
    });
  }

  const indicators = document.querySelector('.indicators');
  if (indicators) {
    for (let i = 0; i < totalSlides; i++) {
      const dot = document.createElement('span');
      dot.classList.add('dot');
      if (i === 0) dot.classList.add('active');
      indicators.appendChild(dot);
      dot.addEventListener('click', () => {
        index = i;
        showSlide();
        clearInterval(slideInterval);
        slideInterval = setInterval(autoSlide, 5000);
      });
    }
  }
}

let recipes = [];
let mainsection = document.getElementById("mainsection");

function renderCards(recipesToShow) {
  if (mainsection) {
    mainsection.innerHTML = '';
    recipesToShow.forEach((val) => {
      let newCard = document.createElement("div");
      newCard.className = "card";
      newCard.innerHTML = `
        <img src="${val.image}" alt="${val.name}">
        <p style="font-size:18px; margin:5px 0">${val.name}</p>
        <p style="margin:3px 0">rating : ⭐${val.rating}</p>
        <p style="margin:3px 0">cuisine: ${val.cuisine}</p>
        <p style="margin:3px 0">difficulty : ${val.difficulty}</p>
        <button class="order-btn" data-id="${val.id}">Details</button>
      `;
      mainsection.appendChild(newCard);
    });

    document.querySelectorAll('.order-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        const id = this.getAttribute('data-id');
        const recipe = recipes.find(r => r.id == id);
        showRecipeModal(recipe);
      });
    });
  }
}
function showRecipeModal(recipe) {
  // Create URL parameters for the recipe data
  const params = new URLSearchParams({
    name: recipe.name || 'Recipe Name',
    image: recipe.image || '',
    cuisine: recipe.cuisine || 'Unknown',
    difficulty: recipe.difficulty || 'Unknown',
    rating: recipe.rating || '0',
    ingredients: (recipe.ingredients || []).join(','),
    instructions: (recipe.instructions || []).join('|')
  });

  // Create a temporary HTML content
  const tempContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Recipe Details</title>
  <link rel="shortcut icon" href="/images/ood/logo4.png" type="image/x-icon">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&family=Poppins:wght@300;500;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="style.css">
  <style>
    body {
      font-family: 'Poppins', sans-serif;
      background: linear-gradient(135deg, #f5f5f5 0%, #bc8245 50%, #af2b67 100%);
      margin: 0;
      padding: 0;
      overflow-x: hidden;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .recipe-container {
      max-width: 1100px;
      margin: 120px auto 40px;
      padding: 40px;
      background: rgba(255, 255, 255, 0.95);
      border-radius: 20px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
      border: 3px solid transparent;
      border-image: linear-gradient(45deg, #ff00d9, #00ff80, #01e1ff) 1;
      animation: borderGlow 5s linear infinite;
      backdrop-filter: blur(5px);
      transition: transform 0.3s ease;
    }

    .recipe-container:hover {
      transform: translateY(-5px);
    }

    .recipe-image img {
      max-width: 100%;
      height: auto;
      border-radius: 15px;
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
      transition: transform 0.4s ease, box-shadow 0.4s ease;
      object-fit: cover;
    }

    .recipe-image img:hover {
      transform: scale(1.08);
      box-shadow: 0 12px 25px rgba(0, 0, 0, 0.3);
    }

    .recipe-content h2 {
      color: #1a2e44;
      border-bottom: 3px solid #ff00d9;
      padding-bottom: 12px;
      font-weight: 700;
      font-size: 2.8rem;
      margin-bottom: 25px;
      text-transform: capitalize;
      letter-spacing: 1px;
      position: relative;
      animation: slideIn 0.5s ease;
    }

    .recipe-content h2::after {
      content: '';
      position: absolute;
      width: 50px;
      height: 3px;
      background: #00ff80;
      left: 0;
      bottom: -3px;
      transition: width 0.3s ease;
    }

    .recipe-content h2:hover::after {
      width: 100px;
    }

    .recipe-content p {
      line-height: 1.9;
      color: #2c3e50;
      font-size: 1.15rem;
      margin-bottom: 20px;
      font-weight: 400;
    }

    .recipe-content strong {
      color: #1a2e44;
      font-weight: 600;
      text-transform: uppercase;
      font-size: 1rem;
      letter-spacing: 0.5px;
    }

    .ingredients-list, .instructions-list {
      margin-left: 25px;
      background: rgba(245, 245, 245, 0.8);
      padding: 15px;
      border-radius: 10px;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease;
    }

    .ingredients-list:hover, .instructions-list:hover {
      transform: translateX(5px);
    }

    .ingredients-list li, .instructions-list li {
      margin-bottom: 12px;
      line-height: 1.7;
      font-size: 1.05rem;
      color: #34495e;
      position: relative;
      padding-left: 20px;
    }

    .ingredients-list li::before, .instructions-list li::before {
      content: '➤';
      position: absolute;
      left: 0;
      color: #ff00d9;
      font-size: 1.2rem;
    }

    .btn-primary {
      background: linear-gradient(45deg, #ff00d9, #00ff80);
      border: none;
      padding: 14px 40px;
      font-size: 1.2rem;
      font-weight: 500;
      border-radius: 50px;
      text-transform: uppercase;
      letter-spacing: 1px;
      transition: all 0.3s ease;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    }

    .btn-primary:hover {
      background: linear-gradient(45deg, #00ff80, #01e1ff);
      color: #1a2e44;
      transform: translateY(-3px);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
    }

    .btn-primary:active {
      transform: translateY(0);
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    }

    @keyframes borderGlow {
      0% { border-image-source: linear-gradient(45deg, #ff00d9, #00ff80, #01e1ff); }
      50% { border-image-source: linear-gradient(225deg, #ff00d9, #00ff80, #01e1ff); }
      100% { border-image-source: linear-gradient(45deg, #ff00d9, #00ff80, #01e1ff); }
    }

    @keyframes slideIn {
      from { opacity: 0; transform: translateX(-20px); }
      to { opacity: 1; transform: translateX(0); }
    }

    @media (max-width: 768px) {
      .recipe-container {
        margin: 90px 20px 30px;
        padding: 25px;
      }
      .recipe-content h2 {
        font-size: 2rem;
      }
      .recipe-image img {
        margin-bottom: 25px;
      }
      .btn-primary {
        padding: 12px 30px;
        font-size: 1rem;
      }
    }

    @media (max-width: 576px) {
      .recipe-container {
        margin: 80px 15px 20px;
        padding: 20px;
      }
      .recipe-content h2 {
        font-size: 1.8rem;
      }
      .ingredients-list, .instructions-list {
        margin-left: 15px;
        padding: 10px;
      }
    }
  </style>
</head>
<body>
  <div id="header"></div>

  <div class="recipe-container">
    <div class="row">
      <div class="col-md-5 recipe-image">
        <img src="" alt="Recipe Image" id="recipeImage">
      </div>
      <div class="col-md-7 recipe-content">
        <h2 id="recipeName"></h2>
        <p><strong>Cuisine:</strong> <span id="recipeCuisine"></span></p>
        <p><strong>Difficulty:</strong> <span id="recipeDifficulty"></span></p>
        <p><strong>Rating:</strong> ⭐<span id="recipeRating"></span></p>
        <p><strong>Ingredients:</strong></p>
        <ul class="ingredients-list" id="recipeIngredients"></ul>
        <p><strong>Instructions:</strong></p>
        <ol class="instructions-list" id="recipeInstructions"></ol>
        <button class="btn btn-primary" onclick="window.close()">Close</button>
      </div>
    </div>
  </div>

  <div id="footer"></div>

  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
  <script src="script.js"></script>
  <script>
    // Load recipe data from URL parameters
    const params = new URLSearchParams('${params.toString()}');
    
    document.getElementById('recipeName').textContent = params.get('name') || 'Recipe Name';
    document.getElementById('recipeImage').src = params.get('image') || '';
    document.getElementById('recipeCuisine').textContent = params.get('cuisine') || 'Unknown';
    document.getElementById('recipeDifficulty').textContent = params.get('difficulty') || 'Unknown';
    document.getElementById('recipeRating').textContent = params.get('rating') || '0';
    
    // Handle ingredients
    const ingredients = params.get('ingredients') ? params.get('ingredients').split(',') : [];
    const ingredientsList = document.getElementById('recipeIngredients');
    ingredients.forEach(ingredient => {
      const li = document.createElement('li');
      li.textContent = ingredient.trim();
      ingredientsList.appendChild(li);
    });
    
    // Handle instructions
    const instructions = params.get('instructions') ? params.get('instructions').split('|') : [];
    const instructionsList = document.getElementById('recipeInstructions');
    instructions.forEach(instruction => {
      const li = document.createElement('li');
      li.textContent = instruction.trim();
      instructionsList.appendChild(li);
    });

    // Load header and footer, then highlight current page
    async function loadComponent(id, file) {
      try {
        const response = await fetch(file);
        const text = await response.text();
        document.getElementById(id).innerHTML = text;

        // Highlight current page (index.html for recipe details)
        const currentPage = 'index.html';
        if (id === 'header') {
          const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
          navLinks.forEach(link => {
            if (link.getAttribute('href') === currentPage) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        } else if (id === 'footer') {
          const footerLinks = document.querySelectorAll('.footer-links a');
          footerLinks.forEach(link => {
            if (link.getAttribute('href') === currentPage) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      } catch (error) {
        console.error(\`Error loading \${id}:\`, error);
      }
    }

    // Load header and footer
    loadComponent('header', 'header.html');
    loadComponent('footer', 'footer.html');
  </script>
</body>
</html>
`;
  const newWindow = window.open('', '_blank');
  newWindow.document.write(tempContent);
  newWindow.document.close();
}

async function fetchdata() {
  try {
    const apiresponse = await fetch("https://dummyjson.com/recipes");
    const data = await apiresponse.json();
    recipes = data.recipes;
    renderCards(recipes);
  } catch (error) {
    console.error('Error fetching recipes:', error);
    if (mainsection) {
      mainsection.innerHTML = '<p>Error loading recipes. Please try again later.</p>';
    }
  }
}

if (mainsection) fetchdata();

document.addEventListener('submit', (event) => {
  if (event.target.id === "searchForm") {
    event.preventDefault();
    const searchTerm = document.querySelector('.custom-search').value.toLowerCase();
    const filteredRecipes = recipes.filter(recipe =>
      recipe.name.toLowerCase().includes(searchTerm) ||
      recipe.cuisine.toLowerCase().includes(searchTerm)
    );
    renderCards(filteredRecipes);
  }
});

document.addEventListener('input', (event) => {
  if (event.target.classList.contains('custom-search') && !event.target.value) {
    renderCards(recipes);
  }
});