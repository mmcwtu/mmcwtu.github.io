const form = document.querySelector('form');
const storyOverlay = document.getElementById('story-overlay');
const storyType = document.querySelector('#storyType');
var selectedImage = null;
var imageForSubmit = ""; 
const urlParams = new URLSearchParams(window.location.search);
const pageParam = urlParams.get('prev');

const myMap = new Map([
  ['en', 'english'],
  ['es', 'spanish'],
  ['it', 'italian']
]);

document.addEventListener('DOMContentLoaded', function() {
  translatePage(true);

  changeFontSize(true);

  hideWelcomePage();
});

async function getStory() {
  const loadingOverlay = document.getElementById('loading-overlay');
  const characterName = document.getElementById('name') == null? "" : document.getElementById('name').value;
  
  const data = { 
    characterName: characterName, 
    storyType: imageForSubmit,
    storyLanguage: myMap.get(localStorage.getItem("selectedLanguage"))
  };

  loadingOverlay.style.display = 'block';

  try {
    const responseObj = await fetch('https://n9qwpmmfd9.execute-api.sa-east-1.amazonaws.com/default/cuentos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    const responseData = await responseObj.json();
    const body = responseData.body
    const title = body.title;
    const story = body.story;
    const moral = body.moral;

    localStorage.setItem("title", title);
    localStorage.setItem("story", story);
    localStorage.setItem("moral", moral);
  } catch (error) {
    console.error(error);
  }

  loadingOverlay.style.display = 'none';

  window.location.href = "story.html";
}

function closeOverlay() {
    var overlay = document.getElementById('story-overlay');
    overlay.style.display = 'none';
    clearFields();
}

function clearFields() {
    characterName.value = '';
    moral.checked = false;
}

function selectCard(image) {
  if (selectedImage) {
    selectedImage.classList.remove("selected-image");
  }
  selectedImage = document.querySelector(`img[alt="${image}"]`);
  selectedImage.classList.add("selected-image");
}

function selectDefaultFontSize() {
  const selectedLanguage = localStorage.getItem('fontSize');
  const imageElement = document.getElementById('selected-font-size');
  imageElement.src = "images/menu/" + selectedLanguage + ".png";
}

function translatePage(fromEventListener) {
  const selectedLanguage = localStorage.getItem('selectedLanguage');
  if (selectedLanguage) {
    fetch('translations.json')
      .then(response => response.json())
      .then(translations => {
        const elements = document.querySelectorAll('[data-lang]');
        elements.forEach(element => {
          const key = element.getAttribute('data-lang');
          const translation = translations[selectedLanguage][key];
          if (translation) {
            element.textContent = translation;
          }
        });
      })
      .catch(error => {
        console.error('Error loading translations:', error);
      });

      if (fromEventListener) {
        const imageElement = document.getElementById('selected-language');
        if (imageElement != null) {
          imageElement.src = "images/flags/" + selectedLanguage + ".png";
        }
      }
  }

  var defaultImage = document.querySelector('.dropdown-content img:first-child');
  if (defaultImage != null) {
    defaultImage.classList.add('selected');
  }
}

function changeFontSize(fromEventListener) {
  const selectedFontSize = localStorage.getItem('fontSize') == null ? "fontM" : localStorage.getItem('fontSize');
  console.info(selectedFontSize)
  var textArea = document.getElementById("storyText");

  if (textArea != null) {
    switch (selectedFontSize) {
      case "fontS":
        textArea.style.fontSize = "16px";
        break;
      case "fontM":
        textArea.style.fontSize = "20px";
        break;
      case "fontL":
        textArea.style.fontSize = "24px";
        break;
    }

    if (fromEventListener) {
      const imageElement = document.getElementById('selected-font-size');
      if (imageElement != null) {
        imageElement.src = "images/menu/" + selectedFontSize + ".png";
      }
    }
  }

  var defaultImage = document.querySelector('.dropdown-content img:first-child');

  if (defaultImage != null) {
    defaultImage.classList.add('selected');
  }
}

function hideWelcomePage() {
  var overlay = document.getElementById("overlay");

  if (overlay != null) {
    overlay.addEventListener("animationend", function() {
      overlay.style.display = "none";
      localStorage.setItem('welcomeShown', true);
      window.location.href = "home.html";
      localStorage.setItem('selectedLanguage', "es");
    });
  
    setTimeout(function() {
      overlay.classList.add("fade-out");
    }, 1000);
  }
}

function toggleDropdown() {
  var dropdownContent = document.querySelector("[class*='dropdown-content']");
  var isDisplayed = window.getComputedStyle(dropdownContent).getPropertyValue("display") === "block" ? true : false;
  console.info(window.getComputedStyle(dropdownContent).getPropertyValue("display"));

  if (isDisplayed) {
    dropdownContent.classList.remove('show');
  } else {
    dropdownContent.classList.add('show');
  }
}

function selectLanguage(image, lang) {
  var selectedImage = image.cloneNode(true);
  var toggleButton = document.querySelector('.dropdown-toggle');
  selectedImage.classList.remove('flag-image-border');
  toggleButton.innerHTML = selectedImage.outerHTML;
  localStorage.setItem('selectedLanguage', lang);
  translatePage(false);
  
  var dropdownContent = document.querySelector("[class*='dropdown-content']");
  dropdownContent.classList.remove('show');
}

function selectFontSize(image, size) {
  var selectedImage = image.cloneNode(true);
  var toggleButton = document.querySelector('.dropdown-toggle');
  selectedImage.classList.remove('flag-image-border');
  toggleButton.innerHTML = selectedImage.outerHTML;
  localStorage.setItem('fontSize', size);
  changeFontSize(false);

  var dropdownContent = document.querySelector('.dropdown-content');
  dropdownContent.classList.remove('show');
}

function countCharacters() {
  var textarea = document.getElementById("myTextarea");
  var counter = document.getElementById("counter");
  var maxLength = 500;
  var currentLength = textarea.value.length;
  counter.textContent = maxLength - currentLength;

  if (currentLength > maxLength) {
    counter.style.color = "red";
  } else {
    counter.style.color = "";
  }
}

function pageTransition(page, image) {
  setTimeout(function() {
    window.location.href = page;
  }, 300);

  selectImage(image)
}

function showDataOnPage() {
  const title = localStorage.getItem('title');
  const story = localStorage.getItem('story');
  const moral = localStorage.getItem('moral');

  document.getElementById('storyText').innerHTML = `
    <h1>${title}</h1>
    <p>${story}</p>
    <br>
    <div class="paragraphs" data-lang="moralLabel">Moraleja</div>
    <p>${moral}</p>
  `;

}

if (window.location.pathname === '/story.html') {
  window.onload = showDataOnPage();
}
