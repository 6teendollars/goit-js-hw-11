import './css/styles.css';
import Notiflix from 'notiflix';
import axios from 'axios';

const API_KEY = '34653415-e76f837a15d16f03129de4a6a';
const baseUrl = 'https://pixabay.com/api/';
let currentPage = 1;
const perPage = 40;

const refs = {
  form: document.querySelector('#search-form'),
  input: document.querySelector('input[name="searchQuery"]'),
  button: document.querySelector('button'),
  gallery: document.querySelector('.gallery'),
  loadMoreButton: document.querySelector('.load-more'),
};

refs.loadMoreButton.addEventListener('click', handleLoadMoreClick);
refs.loadMoreButton.classList.add('is-hidden');

async function handleLoadMoreClick() {
  currentPage += 1;
  await fetchImages();
}

refs.form.addEventListener('submit', handleFormSubmit);

async function handleFormSubmit(e) {
  e.preventDefault();
  currentPage = 1;
  const searchTerm = refs.input.value;
  const url = `${baseUrl}?key=${API_KEY}&q=${searchTerm}&image_type=photo&orientation=horizontal&safesearch=true&page=${currentPage}&per_page=${perPage}`;

  refs.loadMoreButton.classList.add('is-hidden');

  await fetchImages(url);
}

async function fetchImages(url) {
  if (!url) {
    url = `${baseUrl}?key=${API_KEY}&q=dog&image_type=photo&orientation=horizontal&safesearch=true&page=${currentPage}&per_page=${perPage}`;
  }

  try {
    const response = await axios.get(url);
    const data = response.data;
    if (data.hits.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else {
      const images = data.hits
        .map(
          hit => `
          <div class="photo-card">
            <img src="${hit.webformatURL}" alt="${hit.tags}" loading="lazy" />
            <div class="info">
              <p class="info-item">
                <b>Likes:${hit.likes}</b>
              </p>
              <p class="info-item">
                <b>Views:${hit.views}</b>
              </p>
              <p class="info-item">
                <b>Comments:${hit.comments}</b>
              </p>
              <p class="info-item">
                <b>Downloads:${hit.downloads}</b>
              </p>
            </div>
          </div>
        `
        )
        .join('');

      if (currentPage === 1) {
        refs.gallery.innerHTML = images;
      } else {
        refs.gallery.insertAdjacentHTML('beforeend', images);
      }

      if (data.totalHits > currentPage * perPage) {
        refs.loadMoreButton.classList.remove('is-hidden');
      } else {
        refs.loadMoreButton.classList.add('is-hidden');
        if (currentPage === 1) {
          Notiflix.Notify.info(
            "We're sorry, but you've reached the end of search results."
          );
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
}
