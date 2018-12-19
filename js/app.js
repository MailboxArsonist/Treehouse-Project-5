

//Define Global Variables.
const body = document.querySelector('body');
const gallery = document.getElementById('gallery');
let employeesArr =[]; //Will hold an array of employee objects
let cards = document.getElementsByClassName('card'); //get card divs on page
let cardsOnDisplay = cards; //Will keep track of the cards on page
let storeModalInfo = []; //Contains an array of employee html, will be accessed to display modals
let modalsToDisplay = storeModalInfo; //Keeps track of the modals to display
let modalCounter; //A counter to keep track of index to access on modalsToDisplay

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




//**--------------FUNCTIONS TO BUILD EMPLOYEE HTML--------------**//
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
  cardDiv.addEventListener('click', (e) => checkClick(e)); //Add event listener to each div
  gallery.appendChild(cardDiv);
};

// function to build modal div
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
};



//**-------------- Functions called when cards are clicked--------------**//
//checkClick is called when div cards are clicked Will call setModalHtml and pass in the div.card as argument
const checkClick = (e) => {
  if(e.target.className === 'card'){
    setModalHtml(e.target);
  } else if (e.target.parentNode.className === 'card') {
    setModalHtml(e.target.parentNode)
  } else {
    setModalHtml(e.target.parentNode.parentNode)
  }
};
//Will loop through cardsOnDisplay to check if match, then set html for modal and set to display
const setModalHtml = (div) => {
  for(let i = 0; i < cardsOnDisplay.length; i++){
    if(cardsOnDisplay[i] === div){
      modalInfo.innerHTML = modalsToDisplay[i];
      modalCounter = i;
      modalContainer.style.display = 'block';
    }
  }
};

//**--------------FUNCTION TO DISPLAY NEXT/PREV EMPLOYEE--------------**//
//param is either textContent of button or keycode of arrow press
//Will set html to the modalsToDisplay[modalCounter]
const showNextEmployee = (event) => {
  if(event === 'Next' || event === 39){
    modalCounter++;
    //checks for end of array and loop back to index 0
    if(modalCounter === modalsToDisplay.length){
      modalCounter = 0;
    }
    modalInfo.innerHTML = modalsToDisplay[modalCounter];
  } else if (event === 'Prev' || event === 37) {
    modalCounter--;
    if(modalCounter === -1){
      modalCounter = modalsToDisplay.length - 1;
    }
    modalInfo.innerHTML = modalsToDisplay[modalCounter];
  }
};
//**--------------EVENT LISTENERS ON MODAL--------------**//
//Will close display and remove html
document.getElementById('modal-close-btn').addEventListener('click', () => {
  modalInfo.innerHTML = '';
  modalContainer.style.display = 'none';
  modalOnDisplay = null;
});
//checks for keyup when the modalContainer is displayed
document.addEventListener('keyup', (e) => {
  if(modalContainer.style.display === 'block'){
    showNextEmployee(e.keyCode);
  }
});
//Checks for clicks on next/prev buttons
document.querySelector('.modal-btn-container').addEventListener('click', (e) => {
  showNextEmployee(e.target.textContent);
});

//**--------------Functions for seaching employees--------------**//
const searchEmployees = () => {
  const searchVal = document.getElementById('search-input').value.toLowerCase();
  //reset display arrays
  cardsOnDisplay = [];
  modalsToDisplay = [];
  for(let i = 0; i < cards.length; i++){
    //Will set emloyeeName to h3 textContent, which is the employee name, compare to searchval
    let employeeName = cards[i].lastElementChild.firstElementChild.textContent;
    if(employeeName.includes(searchVal)){
      cards[i].style.display = 'flex';
      //push matched cards into cards to display array
      cardsOnDisplay.push(cards[i]);
      //push matched into modalsToDisplay array
      modalsToDisplay.push(storeModalInfo[i]);
    } else if (searchVal === "") {
      cards[i].style.display = 'flex';
    } else {
      cards[i].style.display = 'none';
    }
  }
  //if cardsOnDisplay === 0 = no matched results, set error message to display
  if(cardsOnDisplay.length === 0){
    errorMessage.style.display = 'block';
  } else {
    errorMessage.style.display = 'none';
  }
};

//**--------------EVENT LISTENERS ON SEARCHBAR--------------**//
document.querySelector('form').addEventListener('keyup', searchEmployees);
document.querySelector('#serach-submit').addEventListener('click', searchEmployees);
