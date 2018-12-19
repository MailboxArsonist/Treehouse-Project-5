

//Define Global Variables.
const body = document.querySelector('body');
const gallery = document.getElementById('gallery');
let employeesArr =[];
let cards = [];
let storeModalInfo = [];
let modalOnDisplay;

//**--------------Create and Append HTML--------------**//
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
      <p class="modal-text">${person.location.street}, ${person.location.city}, ${person.location.state} ${person.location.postcode}</p>
      <p class="modal-text">Birthday: ${person.dob.date}</p>
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
  let cards = document.getElementsByClassName('card');
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
document.querySelector('.modal-btn-container').addEventListener('click', (e) => {
  if(e.target.textContent === 'Next'){
    modalOnDisplay++;
    modalInfo.innerHTML = storeModalInfo[modalOnDisplay];
    console.log('next');
  } else if (e.target.textContent === 'Prev') {
    modalOnDisplay--;
    modalInfo.innerHTML = storeModalInfo[modalOnDisplay];
    console.log('Prev');
  }
});
