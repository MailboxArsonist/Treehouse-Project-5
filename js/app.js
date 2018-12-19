

//Define Global Variables.
const body = document.querySelector('body');
const gallery = document.getElementById('gallery');
let employeesArr =[];
let cards = document.getElementsByClassName('card');
let cardsOnDisplay = cards;
let storeModalInfo = [];
let modalOnDisplay;

//**--------------Create and Append HTML--------------**//
//SEARCH BAR
const searchContainer = document.querySelector('.search-container');
const form = `<form action="#" method="get">
                <input type="search" id="search-input" class="search-input" placeholder="Search...">
                <input type="submit" value="&#x1F50D;" id="serach-submit" class="search-submit">
              </form>`;
searchContainer.innerHTML = form;
//MODAL CONTAINER
const modalContainer = document.createElement('div');
modalContainer.className = 'modal-container';
body.appendChild(modalContainer);
//MODAL DIV
const modalDiv = document.createElement('div');
modalDiv.className = 'modal';
modalContainer.appendChild(modalDiv);
//MODAL BUTTON CONTAINER
const modalBtnContainer = document.createElement('div');
modalBtnContainer.className = 'modal-btn-container';
modalContainer.appendChild(modalBtnContainer);
//MODAL BUTTON CONTAINER BUTTONS
const nextPrevButtons = '<button type="button" id="modal-prev" class="modal-prev btn">Prev</button><button type="button" id="modal-next" class="modal-next btn">Next</button>';
modalBtnContainer.innerHTML = nextPrevButtons;
//MODAL EXIT BUTTON
const exitButton = '<button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>';
modalDiv.innerHTML = exitButton;
//MODALINFO DIV
const modalInfo = document.createElement('div');
modalInfo.className = 'modal-info-container';
modalDiv.appendChild(modalInfo);
//ERROR MESSAGE DIV
const errorMessage = document.createElement('p');
errorMessage.textContent = "Whoops.. Something went wrong, no students were found matching that name. Please try again."
errorMessage.className = 'error-message';
gallery.appendChild(errorMessage);



//Call fetch to the randomuser api for 12 random students.
fetch('https://randomuser.me/api/?results=12&nat=gb')
  .then(response => response.json())
  .then(result => {
    employeesArr = result.results;
    employeesArr.forEach(personObj => {
      cardCreator(personObj);
      buildModal(personObj);
    });
  })




//**--------------Functions to build employee divs--------------**//
//function to create a card div
const cardCreator = (person) => {
  const cardDiv = document.createElement('div');
  cardDiv.classList.add('card');
  const html = `
      <div class="card-img-container">
          <img class="card-img" src="${person.picture.large}" alt="profile picture">
      </div>
      <div class="card-info-container">
          <h3 id="name" class="card-name cap">${person.name.first} ${person.name.last}</h3>
          <p class="card-text">${person.email}</p>
          <p class="card-text cap">${person.location.city}, ${person.location.state}</p>
      </div>
  `;
  cardDiv.innerHTML = html;
  cardDiv.addEventListener('click', (e) => showModal(e))
  gallery.appendChild(cardDiv)
}

// function to build modal
const buildModal = (person) => {
  const html = `
      <img class="modal-img" src="${person.picture.large}">
      <h3 id="name" class="modal-name cap">${person.name.first} ${person.name.last}</h3>
      <p class="modal-text">${person.email}</p>
      <p class="modal-text cap">${person.location.city}</p>
      <hr>
      <p class="modal-text">${person.phone}</p>
      <p class="modal-text">${person.location.street}, ${person.location.city.charAt(0).toUpperCase()}${person.location.city.slice(1)}, ${person.location.state.charAt(0).toUpperCase()}${person.location.state.slice(1)}, ${person.location.postcode}</p>
      <p class="modal-text">Birthday: ${person.dob.date.slice(0,10)}</p>
  `;
  storeModalInfo.push(html);
}



//**-------------- Functions called when cards are clicked--------------**//

const showModal = (e) => {

  if(e.target.className === 'card'){
    setModalHtml(e.target);
  } else if (e.target.parentNode.className === 'card') {
    setModalHtml(e.target.parentNode)
  } else {
    setModalHtml(e.target.parentNode.parentNode)
  }

};

const setModalHtml = (div) => {
  for(let i = 0; i < cards.length; i++){
    if(cards[i] === div){
      modalInfo.innerHTML = storeModalInfo[i];
      modalOnDisplay = i;
      modalContainer.style.display = 'block';
    }
  }
}

//**--------------EVENT LISTENERS ON MODAL--------------**//
document.getElementById('modal-close-btn').addEventListener('click', () => {
  modalInfo.innerHTML = '';
  modalContainer.style.display = 'none';
  modalOnDisplay = null;
});

const showNextEmployee = (event) => {
  if(event === 'Next' || event === 39){
    modalOnDisplay++;
    if(modalOnDisplay === 12){
      modalOnDisplay = 0;
    }
    modalInfo.innerHTML = storeModalInfo[modalOnDisplay];
  } else if (event === 'Prev' || event === 37) {
    modalOnDisplay--;
    if(modalOnDisplay === -1){
      modalOnDisplay = 11;
    }
    modalInfo.innerHTML = storeModalInfo[modalOnDisplay];
  }
};

document.addEventListener('keyup', (e) => {
  if(modalContainer.style.display === 'block'){
    showNextEmployee(e.keyCode);
  }
});

document.querySelector('.modal-btn-container').addEventListener('click', (e) => {
  showNextEmployee(e.target.textContent);
});

//**--------------Functions for seaching employees--------------**//
const searchEmployees = () => {
  const searchVal = document.getElementById('search-input').value.toLowerCase();
  cardsOnDisplay = [];
  for(let i = 0; i < cards.length; i++){
    let employeeName = cards[i].lastElementChild.firstElementChild.textContent;
    if(employeeName.includes(searchVal)){
      cards[i].style.display = 'flex';
      cardsOnDisplay.push(cards[i]);
    } else if (searchVal === "") {
      cards[i].style.display = 'flex';
    } else {
      cards[i].style.display = 'none';
    }
  }
  if(cardsOnDisplay.length === 0){
    errorMessage.style.display = 'block';
  } else {
    errorMessage.style.display = 'none';
  }
};

//**--------------EVENT LISTENERS ON SEARCHBAR--------------**//
document.querySelector('form').addEventListener('keyup', searchEmployees);
document.querySelector('#serach-submit').addEventListener('click', searchEmployees);
