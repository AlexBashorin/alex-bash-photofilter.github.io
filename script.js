const filters = document.querySelector('.filters');
const btnLoad = document.querySelector('.btn-load');
const btnReset = document.querySelector('.btn-reset');
const btnNext = document.querySelector('.btn-next');
const btnSave = document.querySelector('.btn-save');
const inputLoad = document.querySelector('.btn-load--input');
const image = document.querySelector('img');

// get output value and set filter on img
filters.addEventListener("input", function(event) {
  if(event.target.tagName == "INPUT") {
    event.target.nextElementSibling.value = event.target.value;  
    let suf = event.target.dataset.sizing;
    image.style.setProperty(`--${event.target.name}`, event.target.value + suf);
  }
});

// reset
btnReset.addEventListener("click", function() {
  let inputs = filters.getElementsByTagName("INPUT");
  for(let el of inputs) {
    el.value = el.defaultValue;
    el.nextElementSibling.value = el.nextElementSibling.defaultValue;
    image.style.removeProperty(`--${el.name}`);
  }
})

// load
inputLoad.addEventListener("change", function(e) {
  const file = inputLoad.files[0];
  const reader = new FileReader();
  reader.onload = () => {
      image.src = reader.result;
    }
    reader.readAsDataURL(file);
    e.target.value = '';
});



// SAVE
btnSave.addEventListener("click", function(e) {
  const img = new Image();
  img.setAttribute('crossOrigin', 'anonymous');
  img.src = image.src;

  img.onload = function() {
    canvas.width = img.width;
    canvas.height = img.height;

    const blurCorr = img.width >= img.height ? img.width / image.clientWidth : img.height / image.clientHeight;
    const blur = document.getElementsByName('blur')[0].nextElementSibling.value;
    const invert = getComputedStyle(image).getPropertyValue('--invert');
    const sepia = getComputedStyle(image).getPropertyValue('--sepia');
    const saturate = getComputedStyle(image).getPropertyValue('--saturate');
    const hue = getComputedStyle(image).getPropertyValue('--hue');

    const ctx = canvas.getContext("2d");
    ctx.filter = `blur(${blur * blurCorr}px) invert(${invert}) sepia(${sepia}) saturate(${saturate}) hue-rotate(${hue})`;
    ctx.drawImage(img, 0, 0);
    canvas.classList.add('hide');
    let link = document.createElement('a');
    link.setAttribute('download', 'myImg.png');
    link.href = image.src;
    link.href = canvas.toDataURL('image/png');
    // link.download = 'downoad.png';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    link.delete;
  }
});

// next
const hour = new Date().getHours();
const minutes = new Date().getMinutes();
let daypart;
if (hour >= 6 && (hour <= 11 && minutes <= 59)) {
    daypart = 'morning';
}
if (hour >= 12 && (hour <= 17 && minutes <= 59)) {
    daypart = 'day';
}
if (hour >= 18 && (hour <= 23 && minutes <= 59)) {
    daypart = 'evening';
}
if (hour >= 00 && (hour <= 5 && minutes <= 59)) {
    daypart = 'night';
}

const base = `https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/${daypart}/`;
const images = ['01.jpg', '02.jpg', '03.jpg', '05.jpg', '06.jpg', '07.jpg', '08.jpg', '09.jpg', '10.jpg', '11.jpg', '12.jpg', '13.jpg', '14.jpg', '15.jpg', '16.jpg', '17.jpg', '18.jpg', '19.jpg', '20.jpg'];

let i = 0;
function getImage() {
  const index = i % images.length;
  const imageSrc = base + images[index];

  drawImage(imageSrc);
  i++;
  btnNext.disabled = true;
  setTimeout(function() {
    btnNext.disabled = false;
  }, 1000);
}

btnNext.addEventListener("click", getImage);


// draw Image
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

function drawImage(src) {
  const img = new Image();
  img.setAttribute('crossOrigin', 'anonymous');
  img.src = src;
  img.onload = function() {
    canvas.width = img.width;
    canvas.height = img.height;

    // ctx.drawImage(img, 0, 0);
    image.src = src;
  }
}

// fullscreen
const screenButton = document.querySelector('.fullscreen');

function toggleFullscreen() {
    let elem = document.querySelector('body');

    if (!document.fullscreenElement) {
        elem.requestFullscreen().catch((err) => {
            alert(
                `Error attempting to enable full-screen mode: ${err.message} (${err.name})`
            );
        });
    } else {
        document.exitFullscreen();
    }
}

screenButton.addEventListener('click', () => toggleFullscreen());
screenButton.addEventListener('keyup', (e) => {
    if (e.keycode === 122) {
        e.preventDefault;
        toggleFullscreen();
    }
});