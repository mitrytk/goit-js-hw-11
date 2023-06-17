import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import API from './fetch-api';

refs = {
  galleryList: document.querySelector('.gallery'),
  searchForm: document.querySelector('#search-form'),
  searchInput: document.querySelector('#search-input'),
};

refs.searchForm.addEventListener('submit', onSubmit);
let page = 1;
let storeSearch = null;
let isButtonMore = false;
let cart = '';

async function onSubmit(e) {
  e.preventDefault();
  cart = '';
  page = 1;
  const search = e.target.searchQuery.value.trim();
  reset();

  if (isButtonMore) {
    removeButtonMore();
  }

  if (storeSearch === search) {
    Notify.info('Search result is already on the page.');
    return;
  }

  await handlerFetch(search);
  if (cart !== '') {
    renderButtonMore();
  }
  storeSearch = search;
  smoothScrollUp();
}

async function onClick(e) {
  page += 1;
  await handlerFetch(storeSearch);
  smoothScrollDown();
}

async function renderGallery(date) {
  date.map(
    ({
      webformatURL,
      tags,
      likes,
      views,
      comments,
      downloads,
      largeImageURL,
    }) => {
      return (cart += `<a href="${largeImageURL}" class="cart">
    <img class="cart-image" src="${webformatURL}" alt="${tags}" loading="lazy" />
    <div class="info">
      <p class="info-item">
        <b>Likes</b>
        ${likes}
      </p>
      <p class="info-item">
        <b>Views</b>
        ${views}
      </p>
      <p class="info-item">
        <b>Comments</b>
        ${comments}
      </p>
      <p class="info-item">
        <b>Downloads</b>
        ${downloads}
      </p>
    </div>
  </a>`);
    }
  );
  refs.galleryList.innerHTML = cart;
}

async function handlerFetch(search) {
  try {
    const gallery = await API.fetchGallery(page, search);
    if (gallery.total === 0) {
      Notify.info(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }

    if (storeSearch !== search) {
      Notify.success(`Hooray! We found ${gallery.total} totalHits images.`);
    }

    await renderGallery(gallery.hits);

    new SimpleLightbox('.gallery a');
  } catch (error) {
    console.log(error);
  }
}

async function renderButtonMore() {
  const button = document.createElement('button');
  button.textContent = 'LOAD MORE';
  button.type = 'button';
  button.classList.add('loadmore-button');

  refs.galleryList.after(button);
  const buttonEl = document.querySelector('.loadmore-button');
  buttonEl.addEventListener('click', onClick);

  isButtonMore = true;
}

function removeButtonMore() {
  const button = document.querySelector('.loadmore-button');
  button.remove();

  isButtonMore = false;
}

function reset() {
  refs.searchInput.value = '';
}

function smoothScrollDown() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight,
    behavior: 'smooth',
  });
}

function smoothScrollUp() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
}
