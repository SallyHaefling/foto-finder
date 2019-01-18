// GLOBAL VARIABLES

var imagesArray = JSON.parse(localStorage.getItem('photos')) || [];
var addToAlbumButton = document.getElementById('add-to-album');
var cardSection = document.querySelector('.card-section');
var input = document.querySelector('.choose-input');
var reader = new FileReader();
var showButton = document.querySelector('.show-button');
var searchInput = document.querySelector('.search-input');

// EVENT LISTENERS

showButton.addEventListener('click', showLess);
searchInput.addEventListener('input', liveSearchFilter);
addToAlbumButton.addEventListener('click', createElement);
window.addEventListener('load', loadPage(imagesArray));
window.addEventListener('input', enableDisableAddToAlbum);
cardSection.addEventListener('keyup', saveOnReturn);
cardSection.addEventListener('click', function(event) {
  if (event.target.classList.contains('delete-button')) {
    deletePhoto(event.target);
  } else if (event.target.classList.contains('favorite-button')) {
    persistFavorite();
  }
});

//FUNCTIONS

function loadPage(array) {
  imagesArray = [];
  array.forEach(function(image){
    var photoObj = new Photo(image.title, image.caption, image.file, image.favorite, image.id);
    imagesArray.push(photoObj)
  });
  createCards(imagesArray);
  displayNoneOnCardSection();
}

function saveNewCard() {
var titleInput = document.querySelector('#title').value;
var captionInput = document.querySelector('#caption').value;
var photoObj = new Photo(titleInput, captionInput, reader.result);
  imagesArray.push(photoObj);
  photoObj.saveToStorage(imagesArray);
  createCards(imagesArray);
  displayNoneOnCardSection();
}

function enableDisableAddToAlbum() {
  var titleInput = parseInt(document.querySelector('#title'));
  var captionInput = parseInt(document.querySelector('#caption'));
  if((titleInput.value != '' || captionInput.value != '') && input.files.length >= 1) {
    addToAlbumButton.disabled = false;
  }
}

function createCards(arr) {
  removeAllCards();
  arr.forEach(function(photoObj, i) {
  var newPhotoObj = new Photo (photoObj.title, photoObj.caption, photoObj.file, photoObj.favorite, photoObj.id);
    var card =
  `<section class="photo-card" data-id=${photoObj.id}>
  <p contenteditable = true class = "title">${photoObj.title}</p>
  <label class="photo-label" for="change-photo${i}">
          <img class="photo" src="${photoObj.file}" alt="user uploaded photo">
        </label>
        <input class="choose-input photoObj-photo" type="file" accept="image/*" name="change-photo" id="change-photo${i}">
        <p contenteditable = true = class = "text caption">${photoObj.caption}</p>
        <section class="card-footer">
          <button class="icon-buttons delete-button"></button>
          <button class="icon-buttons favorite-button favorite-${photoObj.favorite}"></button>
        </section>
  </section>`
  cardSection.innerHTML = card + cardSection.innerHTML;
});
}

function persistFavorite() {
  var photoId = parseInt(event.target.closest('.photo-card').dataset.id);
  imagesArray.forEach(function(photo) {
    if(photo.id === photoId) {
      photo.favorite = !photo.favorite;
      photo.updatePhoto(photo.title, photo.caption, photo.favorite);
      photo.saveToStorage(imagesArray);
      event.target.classList.replace(`favorite-${!photo.favorite}`, `favorite-${photo.favorite}`);
    }
  })
}

function displayNoneOnCardSection() {
  var cardPlaceholder = document.querySelector('.card-placeholder');
  switch (true) {
    case imagesArray.length >= 1 :
    cardPlaceholder.classList.add('hide-placeholder');
    break;
    default :
    cardPlaceholder.classList.remove('hide-placeholder');
  }
}

function deletePhoto(target) {
  var cardId = target.parentElement.parentElement.dataset.id;
  var card = imagesArray.find(function(card) {
    return parseInt(cardId) === card.id
  });
  var photoObj = new Photo(card.title, card.caption, reader.result);
  var index = imagesArray.indexOf(card);
  imagesArray.splice(index, 1);
  photoObj.deleteFromStorage(imagesArray);
  target.closest('.photo-card').remove();
  displayNoneOnCardSection();
}

function createElement(e) {
  e.preventDefault();
  switch (input.files[0]) {
    case input.files[0] :
    reader.readAsDataURL(input.files[0]);
    reader.onload = saveNewCard;
    break;
  }
}

function saveOnReturn(event) {
  $(document).ready(() => {
  const cardId = parseInt(event.target.closest('.photo-card').getAttribute('data-id'));
  const card = imagesArray.find(function(card) {
    return cardId === card.id
  });
  const cardTitle = $('.photo-card').find('.title').first().text();
  const cardCaption = $('.photo-card').find('.caption').first().text();
  card.updatePhoto(cardTitle, cardCaption, card.favorite);
  switch (event.keycode === 13) {
  case event.keyCode === 13 :
    card.saveToStorage(imagesArray);
    break;
  }
  });
}

function removeAllCards() {
  cardSection.innerHTML = '';
}

function liveSearchFilter() {
  removeAllCards();
  var searchCurrentText = searchInput.value;
  var filteredCards = imagesArray.filter(function(photo) {
    return photo.title.toLowerCase().includes(searchCurrentText.toLowerCase()) || photo.caption.toLowerCase().includes(searchCurrentText.toLowerCase());
  });
  createCards(filteredCards);
}

function showLess() {
  var slicedCards = imagesArray.slice(-10);
  imagesArray.forEach(function(photo) {
    createCards(slicedCards);
  if(showButton.innertext === 'Show Less' && imagesArray.length > 10) {
   return slicedCards;
  }
  });
}