const apologiesTitle = new Map([
  ['en', 'The Mischievous Adventures of Pixel'],
  ['es', 'Las Traviesas Aventuras de Pixel'],
  ['it', 'Le Avventure Birichine di Pixel']
]);

const apologiesStory = new Map([
  ['en', '<p>Once upon a time, in the magical world of the Internet, there lived a playful gremlin named Pixel. Pixel loved to have fun and play tricks on websites.</p><p>One day, as children eagerly clicked on a web page, Pixel decided to join in the adventure. With mischievous glee, Pixel sneaked into the website and started rearranging things. Buttons swapped places, pictures turned upside down, and silly sounds echoed through the page.</p><p>Oh no! The children were confused! Instead of the fun games and cool pictures they expected, everything seemed topsy-turvy. But worry not!</p><p>In a flash, the brave webmaster discovered Pixel\'s trickery. Armed with a magical keyboard, they chased Pixel through the virtual maze of the website. With each click and clack, order was restored.</p><p>To apologize, the webmaster left a friendly note on the page: "Oopsie-doodle! Pixel, our playful gremlin, had a bit too much fun. We\'ve fixed everything now, so the page is back to being awesome and full of excitement! Enjoy the wonders that await!"</p><p>From that day on, whenever children stumbled upon a website surprise, they giggled and remembered Pixel\'s funny tricks. It became a special secret, a reminder that even in the digital realm, laughter and kindness can turn a glitch into an adventure.</p><p>So remember, dear friends, when things go wacky on a webpage, Pixel might be up to mischief. But fear not, for the clever webmaster will always restore the magic and bring smiles back to your screen. Try again and happy reading!</p>'],
  ['es', '<p>Érase una vez, en el mundo mágico de Internet, vivía un travieso duendecillo llamado Pixel. A Pixel le encantaba divertirse y jugar trucos en los sitios web.</p><p>Un día, mientras los niños hacían clic emocionados en una página web, Pixel decidió unirse a la aventura. Con alegría traviesa, Pixel se coló en el sitio web y comenzó a reorganizar las cosas. Los botones cambiaban de lugar, las imágenes se ponían boca abajo y sonidos graciosos resonaban por la página.</p><p>¡Ay, no! ¡Los niños estaban confundidos! En lugar de los divertidos juegos y las imágenes geniales que esperaban, todo parecía estar patas arriba. ¡Pero no te preocupes!</p><p>En un abrir y cerrar de ojos, el valiente webmaster descubrió las travesuras de Pixel. Armado con un teclado mágico, persiguió a Pixel a través del laberinto virtual del sitio web. Con cada clic y tecleo, se restableció el orden.</p><p>Para disculparse, el webmaster dejó una nota amigable en la página: "¡Ups! Pixel, nuestro duendecillo juguetón, se divirtió demasiado. Ya hemos arreglado todo, ¡así que la página vuelve a ser asombrosa y llena de emoción! ¡Disfruten de las maravillas que les esperan!"</p><p>Desde ese día, cada vez que los niños se encontraban con una sorpresa en un sitio web, se reían y recordaban las divertidas travesuras de Pixel. Se convirtió en un secreto especial, un recordatorio de que incluso en el mundo digital, la risa y la amabilidad pueden convertir un fallo en una aventura.</p><p>Así que recuerden, queridos amigos, cuando las cosas se vuelvan locas en una página web, puede que Pixel esté haciendo de las suyas. Pero no teman, porque el ingenioso webmaster siempre restaurará la magia y devolverá las sonrisas a su pantalla. Inténtalo de nuevo y feliz lectura!</p>'],
  ['it', '<p>C\'era una volta, nel magico mondo di Internet, viveva un folletto giocoso chiamato Pixel. Pixel adorava divertirsi e fare scherzi ai siti web.</p><p>Un giorno, mentre i bambini cliccavano con impazienza su una pagina web, Pixel decise di unirsi all\'avventura. Con gioia maliziosa, Pixel si infiltrò nel sito web e iniziò a riorganizzare tutto. I pulsanti scambiavano posizione, le immagini si capovolgevano e suoni divertenti risuonavano sulla pagina.</p><p>Oh no! I bambini erano confusi! Invece dei divertenti giochi e delle belle immagini che si aspettavano, tutto sembrava sottosopra. Ma non preoccupatevi!</p><p>In un baleno, il coraggioso webmaster scoprì i giochetti di Pixel. Armato di una tastiera magica, inseguì Pixel attraverso il labirinto virtuale del sito web. Con ogni clic e pressione di tasti, l\'ordine fu ripristinato.</p><p>Per scusarsi, il webmaster lasciò un messaggio amichevole sulla pagina: "Ops! Pixel, il nostro folletto giocoso, si è divertito un po\' troppo. Ora abbiamo sistemato tutto, quindi la pagina è di nuovo fantastica e piena di emozioni! Godetevi le meraviglie che vi aspettano!"</p><p>Da quel giorno, ogni volta che i bambini si imbatterono in una sorpresa su un sito web, ridevano e ricordavano i buffi scherzi di Pixel. Questo divenne un segreto speciale, un ricordo che anche nel mondo digitale, la risata e la gentilezza possono trasformare un inconveniente in un\'avventura.</p><p>Quindi ricordate, cari amici, quando le cose diventano strambe su una pagina web, potrebbe essere Pixel a combinare pasticci. Ma non temete, perché l\'ingegnoso webmaster ripristinerà sempre la magia e riporterà il sorriso sul vostro schermo. Riprova e buona lettura!</p>']
]);

const form = document.querySelector('form');
const storyOverlay = document.getElementById('story-overlay');
const storyType = document.querySelector('#storyType');
var selectedImage = null;
var submittedStoryType = "";
var submittedStoryName = "";
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
    storyType: localStorage.getItem("storyType"),
    storyName: submittedStoryName,
    storyLanguage: myMap.get(localStorage.getItem("selectedLanguage"))
  };

  loadingOverlay.style.display = 'block';

  try {
    const responseObj = await fetch('https://haq91yyijc.execute-api.sa-east-1.amazonaws.com/default/storyRetriever', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    const responseData = await responseObj.json();

    const body = responseData.body
    var title = "";
    var story = "";

    if (body == null) {
      const language = localStorage.getItem("selectedLanguage");
      title = apologiesTitle.get(language)
      story = apologiesStory.get(language)
    } else {
      title = body.title;
      story = body.storyText;
    }

    localStorage.setItem("title", title);
    localStorage.setItem("story", story);
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
  submittedStoryName = image;

  if (selectedImage) {
    selectedImage.classList.remove("selected-image");
  }
  selectedImage = document.querySelector(`img[alt="${image}"]`);
  selectedImage.classList.add("selected-image");

  getStory();
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
            element.setAttribute('placeholder', translation);
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
    }, 500);
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
  localStorage.setItem("storyType", image);

  if (selectedImage) {
    selectedImage.classList.remove("selected-menu-image");
  }
  selectedImage = document.querySelector(`img[alt="${image}"]`);
  selectedImage.classList.add("selected-menu-image");

  setTimeout(function() {
    window.location.href = page;
  }, 300);
}

function showDataOnPage() {
  const title = localStorage.getItem('title');
  const story = localStorage.getItem('story');

  document.getElementById('storyText').innerHTML = `
    <h1>${title}</h1>
    <p>${story}</p>
    <br>
  `;
}

if (window.location.pathname === '/story.html') {
  window.onload = showDataOnPage();
}
