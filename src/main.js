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

function showEndOfResultsMessage() {
  iziToast.info({
    title: 'Warning',
    message: "You've reached the end of search results.",
    position: 'topRight',
  });
}

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

  hideLoadMoreBtn();
  clearGallery();

  showLoader();

  let searchSucceeded = false;

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
    searchSucceeded = true;
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
    if (!searchSucceeded) {
      hideLoadMoreBtn();
    } else if (currentPage >= maxPages) {
      hideLoadMoreBtn();
      showEndOfResultsMessage();
    } else {
      showLoadMoreBtn();
    }
  }
}

loadMore.addEventListener('click', async () => {
  if (currentPage >= maxPages) {
    hideLoadMoreBtn();
    return;
  }

  currentPage += 1;
  hideLoadMoreBtn();
  showLoader();

  let requestSucceeded = false;

  try {
    const data = await getImagesByQuery(searchQuery, currentPage);
    createGallery(data.hits);
    requestSucceeded = true;

    const firstGalleryItem = document.querySelector('.gallery')?.firstElementChild;

    if (firstGalleryItem) {
      const { height: cardHeight } = firstGalleryItem.getBoundingClientRect();
      window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
      });
    }
  } catch (error) {
    currentPage -= 1;
    iziToast.error({
      title: 'Error',
      message: 'Something went wrong. Please try again later.',
      position: 'topRight',
    });
    console.error(error);
  } finally {
    hideLoader();
    if (currentPage >= maxPages) {
      hideLoadMoreBtn();
      if (requestSucceeded) {
        showEndOfResultsMessage();
      }
    } else {
      showLoadMoreBtn();
    }
  }
});
