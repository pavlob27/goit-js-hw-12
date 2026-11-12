import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import { PAGE_SIZE, getImagesByQuery } from './js/pixabay-api.js';
import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
  showLoadMoreBtn,
  hideLoadMoreBtn,
  loadMore,
} from './js/render-functions.js';

const searchForm = document.querySelector('form');

searchForm.addEventListener('submit', handleSearch);

let currentPage;

let maxPages;

let searchQuery;

async function handleSearch(event) {
  event.preventDefault();

  currentPage = 1;

  const form = event.currentTarget;
  searchQuery = form.elements['search-text'].value.trim();

  if (!searchQuery) {
    iziToast.warning({
      title: 'Warning',
      message: 'Please enter a search query!',
      position: 'topRight',
    });
    return;
  }

  clearGallery();

  showLoader();

  try {
    const data = await getImagesByQuery(searchQuery, currentPage);

    if (data.hits.length === 0) {
      iziToast.error({
        title: 'Error',
        message:
          'Sorry, there are no images matching your search query. Please try again!',
        position: 'topRight',
      });
      return;
    }
    maxPages = Math.ceil(data.totalHits / PAGE_SIZE);
    createGallery(data.hits);
  } catch (error) {
    iziToast.error({
      title: 'Error',
      message: 'Something went wrong. Please try again later.',
      position: 'topRight',
    });
    console.error(error);
  } finally {
    hideLoader();
    form.reset();
    if (currentPage >= maxPages) {
      hideLoadMoreBtn();
    } else {
      showLoadMoreBtn();
    }
  }
}

loadMore.addEventListener('click', async () => {
  currentPage += 1;

  if (currentPage >= maxPages) {
    hideLoadMoreBtn();
  } else {
    showLoadMoreBtn();
  }

  const data = await getImagesByQuery(searchQuery, currentPage);
  const markup = createGallery(data.hits);

  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
});
