import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import fetchPhotos from './js/fetchPhotos.js';

import markupGalleryCard from './template/gallery_card.hbs';

const searhFormRef = document.querySelector('#search-form');
const galleryRef = document.querySelector('.gallery');

searhFormRef.addEventListener('submit', onSubmit);

function onSubmit(e) {
  e.preventDefault();
  clearGallery();
  const userInput = searhFormRef.elements.searchQuery.value.trim();
  fetchPhotos(userInput).then(totalHits).then(appendMarkup);
}
function appendMarkup(data) {
  console.log(data);
  galleryRef.insertAdjacentHTML('beforeend', markupGalleryCard(data));
}
function clearGallery() {
  galleryRef.innerHTML = '';
}
function totalHits(data) {
  if (data.totalHits === 0) {
    return Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  } else {
    Notify.info(`Hooray! We found ${data.totalHits} images.`);
  }
  return data;
}
