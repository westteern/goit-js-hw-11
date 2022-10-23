import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import fetchPhotos from './js/fetchPhotos.js';

import markupGalleryCard from './template/gallery_card.hbs';

const searhFormRef = document.querySelector('#search-form');
const galleryRef = document.querySelector('.gallery');
const guardRef = document.querySelector('.guard');

searhFormRef.addEventListener('submit', onSubmit);

const options = {
  root: null,
  rootMargin: '100px',
  threshold: 1,
};
const observer = new IntersectionObserver(onLoad, options);

let userInput;
let pageNumber;
let totalPages;

function onSubmit(e) {
  e.preventDefault();
  resetAll();
  userInput = searhFormRef.elements.searchQuery.value.trim();
  fetchPhotos(userInput, pageNumber).then(totalHits).then(appendMarkup);
}

function appendMarkup(data) {
  galleryRef.insertAdjacentHTML('beforeend', markupGalleryCard(data));
  observer.observe(guardRef);
  onClickPhotoCard();
}

function resetAll() {
  galleryRef.innerHTML = '';
  pageNumber = 1;
  totalPages = 0;
  observer.unobserve(guardRef);
}

function totalHits(data) {
  if (data.totalHits === 0) {
    return Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  } else {
    Notify.info(`Hooray! We found ${data.totalHits} images.`);
  }
  totalPagesCalc(data);
  return data;
}

function onClickPhotoCard() {
  const lightbox = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionDelay: 250,
  });
}

function onLoad(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      onLoadMore();
    }
  });
}
function onLoadMore() {
  pageNumber += 1;
  if (pageNumber > totalPages) {
    Notify.failure(
      "We're sorry, but you've reached the end of search results."
    );
    observer.unobserve(guardRef);
  } else {
    return fetchPhotos(userInput, pageNumber)
      .then(totalPagesCalc)
      .then(appendMarkup);
  }
}

function totalPagesCalc(data) {
  totalPages = Math.ceil(data.totalHits / data.hits.length);
  return data;
}
