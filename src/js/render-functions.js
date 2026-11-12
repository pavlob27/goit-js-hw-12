import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";



const lightbox = new SimpleLightbox('.gallery a', {
    captions: true,
    captionsData: 'alt',
    captionDelay: 250

});


const galleryContainer = document.querySelector('.gallery');
const loaderContainer = document.querySelector('.loader-container');


export function createGallery(images) {
  const markup = images
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `
        <li class="gallery-item">
          <a class="gallery-link" href="${largeImageURL}">
            <img class="gallery-image" src="${webformatURL}" alt="${tags}" />
          </a>
          <div class="info">
            <p class="info-item"><b>Likes</b><span>${likes}</span></p>
            <p class="info-item"><b>Views</b><span>${views}</span></p>
            <p class="info-item"><b>Comments</b><span>${comments}</span></p>
            <p class="info-item"><b>Downloads</b><span>${downloads}</span></p>
          </div>
        </li>
      `
    )
    .join('');

  galleryContainer.innerHTML = markup;
  lightbox.refresh();
}

export function clearGallery() {
  galleryContainer.innerHTML = '';
}

export function showLoader() {
  if (loaderContainer) {
    loaderContainer.classList.remove('is-hidden');
  }
}

export function hideLoader() {
  if (loaderContainer) {
    loaderContainer.classList.add('is-hidden');
  }
}
