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

// var xhr = new XMLHttpRequest();
// xhr.open('GET', 'translations.json', true);
// xhr.onload = function () {
//   if (xhr.status === 200) {
//     var translations = JSON.parse(xhr.responseText);
//     var langElements = document.querySelectorAll('[data-lang]');

//     function translateElements(lang) {
//       for (var i = 0; i < langElements.length; i++) {
//         var element = langElements[i];
//         var key = element.dataset.lang;
//         if (key) {
//           element.textContent = translations[lang][key] || translations['en'][key];
//         }
//       }
//     }

//     document.getElementById('language').addEventListener('change', function () {
//       var lang = this.value;
//       translateElements(lang);
//     });

//     var defaultLang = 'en'; //default language
//     translateElements(defaultLang);
//   }
// };
// xhr.send();

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
  var defaultImage = document.querySelector('.dropdown-content img:first-child');
  defaultImage.classList.add('selected');

  changeFontSize(true);
  var defaultImage = document.querySelector('.dropdown-content img:first-child');
  defaultImage.classList.add('selected');
});

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
}

function changeFontSize(fromEventListener) {
  const selectedFontSize = localStorage.getItem('fontSize') == null ? "fontM" : localStorage.getItem('fontSize');
  console.info(selectedFontSize)
  var textArea = document.getElementById("storyText");

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

function toggleDropdown() {
  var dropdownContent = document.querySelector("[class*='dropdown-content']");
  console.info("LALALLALAL")
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
  
  var dropdownContent = document.querySelector('.dropdown-content');
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

window.onload = function() {
  // Text coming from GPT
  var apiText = "Title\n\nLorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque ducimus minus deleniti temporibus ea velit, beatae ex ipsum adipisci molestias deserunt quaerat numquam natus sed quae praesentium quam at possimus.\n\nAliquam suscipit gravida ex sed congue. Aliquam scelerisque orci eget libero aliquam euismod. Pellentesque et bibendum nisl. Proin convallis massa eu ex volutpat consectetur. Aliquam vulputate eget nulla id euismod. Aenean sagittis vel justo vel finibus. Duis luctus sem sit amet erat condimentum, et sollicitudin purus porttitor. Vestibulum tempor ornare sodales. Vivamus faucibus massa vitae lectus mollis pharetra. Sed fringilla luctus orci. Proin egestas nec ante vel pharetra.\n\nQuisque ac sapien ornare, porta augue id, efficitur ipsum. Nulla lacus dui, molestie et diam vel, feugiat tincidunt nibh. Nunc vitae tincidunt elit. Aliquam ut turpis quis nisl efficitur rutrum sed eu metus. In vitae nulla id orci egestas interdum at in ligula. Quisque felis quam, consequat eget varius eget, pretium ut sapien. Curabitur et porta felis. Etiam sit amet fringilla ex. Quisque non libero ornare, consequat ipsum eu, tempus diam. Sed viverra dui placerat ante mattis placerat. Phasellus lacus tellus, iaculis et tempus nec, vulputate quis nisi. Integer ultrices sagittis felis. Sed molestie auctor orci, eget viverra dolor pretium non. Donec et finibus diam, congue semper erat. Aliquam ac mauris porta, tempus purus nec, vestibulum justo.\n\nVivamus lacinia semper massa id sagittis. Morbi sed justo odio. Maecenas ultrices mauris at mauris euismod, sit amet gravida diam lobortis. Aliquam at ornare eros. Etiam dignissim ut turpis nec hendrerit. Aenean eget ante ipsum. Duis in justo vel eros viverra tempus. Duis cursus eros vitae accumsan elementum. Nunc eu nunc sed erat egestas condimentum. Fusce porta imperdiet turpis, ut cursus lacus lacinia posuere. Aenean eleifend posuere rutrum. Curabitur non lorem eleifend lectus facilisis consequat. Mauris sit amet suscipit ligula. Pellentesque eget tempus turpis.";

  var formattedText = apiText.replace(/\n/g, "<br>");

  var textDiv = document.getElementById("storyText");
  textDiv.innerHTML = formattedText;
};