const form = document.querySelector('form');
const loadingOverlay = document.getElementById('loading-overlay');
const storyOverlay = document.getElementById('story-overlay');
const storyType = document.querySelector('#storyType');
const moral = document.querySelector('#moral');
const characterName = document.querySelector('#name');
var language = "en";
var selectedImage = null;
const urlParams = new URLSearchParams(window.location.search);
const pageParam = urlParams.get('prev');

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const data = { 
    characterName: characterName.value, 
    storyType: selectedImage,
    moral: moral.checked,
    seconds: "30",
    lang: language.value
  };

  // Show loading overlay
  loadingOverlay.style.display = 'block';

  const responseObj = await fetch('https://n9qwpmmfd9.execute-api.sa-east-1.amazonaws.com/default/cuentos', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  const responseBody = await responseObj.json();
  const responseObject = JSON.parse(JSON.parse(responseBody.body).text);
  const responseTitle = responseObject.title;
  const responseText = responseObject.text;
  title.innerText = responseTitle;
  output.innerText = responseText;

  // Hide loading overlay
  loadingOverlay.style.display = 'none';
  // Show story overlay
  storyOverlay.style.display = 'block';
});

function closeOverlay() {
    var overlay = document.getElementById('story-overlay');
    overlay.style.display = 'none';
    clearFields();
}

function clearFields() {
    characterName.value = '';
    moral.checked = false;
}

var xhr = new XMLHttpRequest();
xhr.open('GET', 'translations.json', true);
xhr.onload = function () {
  if (xhr.status === 200) {
    var translations = JSON.parse(xhr.responseText);
    var langElements = document.querySelectorAll('[data-lang]');

    function translateElements(lang) {
      for (var i = 0; i < langElements.length; i++) {
        var element = langElements[i];
        var key = element.dataset.lang;
        if (key) {
          element.textContent = translations[lang][key] || translations['en'][key];
        }
      }
    }

    document.getElementById('language').addEventListener('change', function () {
      var lang = this.value;
      translateElements(lang);
    });

    var defaultLang = 'en'; //default language
    translateElements(defaultLang);
  }
};
xhr.send();

function selectImage(image) {
  if (selectedImage) {
    selectedImage.classList.remove("selected-image");
  }
  selectedImage = image;
  selectedImage.classList.add("selected-image");
}

function goBack() {
  if (pageParam === null) {
    window.location.href = 'index.html';
  } else {
    window.location.href = pageParam + '.html';
  }
}

document.addEventListener('DOMContentLoaded', function() {
  translatePage(true);
});

function changeLanguage(lang) {
  localStorage.setItem('selectedLanguage', lang);
  translatePage(true);
}

function translatePage(fromEventListener) {
  const selectedLanguage = localStorage.getItem('selectedLanguage');
  console.log('Selected language:', selectedLanguage);
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
        imageElement.src = "images/flags/" + selectedLanguage + ".png";
      }
  }
}

function toggleDropdown() {
  var dropdownContent = document.querySelector('.dropdown-content');
  dropdownContent.classList.toggle('show');
}

function selectLanguage(image, lang) {
  var selectedImage = image.cloneNode(true);
  var toggleButton = document.querySelector('.dropdown-toggle');
  selectedImage.classList.remove('flag-image-border');
  toggleButton.innerHTML = selectedImage.outerHTML;
  localStorage.setItem('selectedLanguage', lang);
  translatePage(false);
  
  var dropdownContent = document.querySelector('.dropdown-content');
  dropdownContent.classList.remove('show');
}

document.addEventListener('DOMContentLoaded', function() {
  var defaultImage = document.querySelector('.dropdown-content img:first-child');
  defaultImage.classList.add('selected');
});
