let currentPage = document.createElement('span');
let currentImageIndex = 0;
const images = document.querySelectorAll('.cover img');
const imageSources = Array.from(images).map(img => img.src);
const totalImage = imageSources.length;

const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css';
document.head.appendChild(link);

function openModal(src) {
  const modal = document.createElement('div');
  modal.id = 'imageModal';
  modal.style = `
    display: block;
    position: fixed;
    z-index: 1000;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.9);
  `;

  const img = document.createElement('img');
  img.src = src;
  img.style = `
    margin: auto;
    display: block;
    max-width: 90%;
    max-height: 90%;
    height: 90%;
    width: auto;
    margin-top: 2.5%;
  `;

  const closeBtn = createIcon({
    position: 'absolute',
    top: '16px',
    right: '25px',
    fontSize: '185%',
    cursor: 'pointer',
    onClick: () => document.body.removeChild(modal),
    iconClass: 'fa-solid fa-xmark'
  });

  const leftBtn = createButton({
    position: 'absolute',
    top: '50%',
    left: '30px',
    transform: 'translateY(-50%)',
    cursor: 'pointer',
    onClick: () => changeImage(-1),
    iconClass: 'fa-solid fa-arrow-left'
  });

  const rightBtn = createButton({
    position: 'absolute',
    top: '50%',
    right: '30px',
    transform: 'translateY(-50%)',
    cursor: 'pointer',
    onClick: () => changeImage(1),
    iconClass: 'fa-solid fa-arrow-right'
  });

  const nextEpisodeLink = createNextEpisodeLink();

  const fullScreenIcon = createIcon({
    position: 'absolute',
    top: '20px',
    right: '100px',
    fontSize: '130%',
    cursor: 'pointer',
    iconClass: 'fas fa-expand',
    onClick: toggleFullScreen
  });

  const zoomIcon = createIcon({
    position: 'absolute',
    top: '20px',
    right: '60px',
    fontSize: '130%',
    cursor: 'pointer',
    iconClass: 'fa-solid fa-magnifying-glass-minus',
    onClick: toggleZoom
  });

  /*currentPage.style = `
    position: 'absolute';
    top: '10px';
    left: '10px';
    font-size: 120%;
    color: #AAA;
  `;*/

  currentPage.style.position = 'absolute';
  currentPage.style.top = '10px';
  currentPage.style.left = '10px'
  currentPage.style.fontSize = '120%'
  currentPage.style.color = '#AAA'

  modal.appendChild(leftBtn);
  modal.appendChild(rightBtn);
  modal.appendChild(img);
  modal.appendChild(closeBtn);
  modal.appendChild(currentPage);
  modal.appendChild(nextEpisodeLink);
  modal.appendChild(fullScreenIcon);
  modal.appendChild(zoomIcon);

  document.body.appendChild(modal);

  function toggleFullScreen() {
    const isFullScreen = !!document.fullscreenElement;
    const requestMethod = modal.requestFullscreen || modal.webkitRequestFullscreen || modal.msRequestFullscreen;
    const exitMethod = document.exitFullscreen || document.webkitExitFullscreen || document.msExitFullscreen;
    if (!isFullScreen) {
      requestMethod && requestMethod.call(modal);
      fullScreenIcon.className = 'fa-solid fa-compress';
    } else {
      exitMethod && exitMethod.call(document);
      fullScreenIcon.className = 'fas fa-expand';
    }
  }

  function toggleZoom() {
    if (zoomIcon.className === 'fa-solid fa-magnifying-glass-minus') {
      zoomIcon.className = 'fa-solid fa-magnifying-glass-plus';
      img.style.height = 'auto';
    } else {
      zoomIcon.className = 'fa-solid fa-magnifying-glass-minus';
      img.style.height = '90%';
    }
  }

  let lastMouseMoveTime = Date.now();
  const elementsToHide = [currentPage, leftBtn, rightBtn, closeBtn, nextEpisodeLink, fullScreenIcon, zoomIcon];

  document.addEventListener('mousemove', () => {
    lastMouseMoveTime = Date.now();
    showHiddenElements();
  });

  function hideElementsIfNotMoved() {
    const currentTime = Date.now();
    const timeSinceLastMove = currentTime - lastMouseMoveTime;
    if (timeSinceLastMove >= 5000) {
      elementsToHide.forEach(element => {
        element.style.visibility = 'hidden';
      });
    }
  }

  function showHiddenElements() {
    elementsToHide.forEach(element => {
      element.style.visibility = 'visible';
    });
  }

  hideElementsIfNotMoved();
  setInterval(hideElementsIfNotMoved, 1000);

}

function createButton({ position, top, left, right, transform, cursor, onClick, iconClass }) {
  const btn = document.createElement('button');
  btn.style = `
    position: ${position};
    top: ${top};
    ${left ? `left: ${left};` : `right: ${right};`}
    ${transform ? `transform: ${transform};` : ''}
    cursor: ${cursor};
    background-color: transparent;
    border: none;
  `;
  const icon = document.createElement('i');
  icon.className = iconClass;
  icon.style.color = '#AAA';
  icon.style.fontSize = '120%';
  btn.appendChild(icon);
  btn.onclick = onClick;
  addHoverEffect(btn, icon);
  return btn;
}

function createIcon({ position, top, right, fontSize, cursor, iconClass, onClick }) {
  const icon = document.createElement('i');
  icon.className = iconClass;
  icon.style = `
    position: ${position};
    top: ${top};
    right: ${right};
    font-size: ${fontSize};
    color: #AAA;
    cursor: ${cursor};
  `;
  icon.onclick = onClick;
  addHoverEffect(icon, icon);
  return icon;
}

function createNextEpisodeLink() {
  const nextLink = document.createElement('a');
  nextLink.style = `
    position: absolute;
    bottom: 5px;
    right: 10px;
    color: #AAA;
    font-size: 110%;
  `;
  const { href, text } = getNextEpisode();
  if (href) {
    nextLink.href = href;
    nextLink.textContent = text;
  } else {
    nextLink.textContent = 'Không tìm thấy tập tiếp theo';
  }
  addHoverEffect(nextLink, nextLink);
  return nextLink;
}

function getNextEpisode() {
  const bElements = document.querySelectorAll('b');
  for (const bElement of bElements) {
    const aElement = bElement.querySelector('a');
    if (aElement) {
      return {
        href: aElement.href,
        text: `Tập tiếp theo: ${aElement.textContent}`
      };
    }
  }
  return {};
}

function addHoverEffect(element, target) {
  element.addEventListener('mouseover', () => {
    target.style.color = 'white';
    target.style.transition = 'color 0.3s ease';
  });
  element.addEventListener('mouseout', () => {
    target.style.color = '#AAA';
    target.style.transition = 'color 0.3s ease';
  });
}


function changeImage(step) {
  currentImageIndex = (currentImageIndex + step + imageSources.length) % imageSources.length;
  document.querySelector('#imageModal img').src = imageSources[currentImageIndex];
  updateCurrentPageText();
}

function updateCurrentPageText() {
  currentPage.textContent = `${currentImageIndex + 1} / ${totalImage}`;
}

function handleArrowKeyPress(event) {
  if (event.key === 'ArrowLeft') {
    changeImage(-1);
  } else if (event.key === 'ArrowRight') {
    changeImage(1);
  }
}

window.addEventListener('keydown', handleArrowKeyPress);

images.forEach((img, index) => {
  img.style.cursor = 'zoom-in';
  img.onclick = function() {
    openModal(img.src);
    currentImageIndex = index;
    updateCurrentPageText();
  };
});