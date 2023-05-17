const form = document.querySelector('form');
const loadingOverlay = document.getElementById('loading-overlay');
const storyOverlay = document.getElementById('story-overlay');
const storyType = document.querySelector('#storyType');
const moral = document.querySelector('#moral');
const characterName = document.querySelector('#name');
const language = document.querySelector('#language');

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const data = { 
      characterName: characterName.value, 
      storyType: storyType.value,
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

      var defaultLang = 'en'; // Idioma predeterminado
      translateElements(defaultLang);
    }
  };
  xhr.send();