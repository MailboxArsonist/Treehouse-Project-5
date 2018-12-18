/*
1.Only display 12 students on the page. (create 12 cards) Maybe a function that creates the card, takes a load of arguments from the fetch
1.1 There will be 2 containers, one for the image and one for the info. Maybe a function to build each div.
1.2 Img div takes the image. in an img tag. The info div will take h3 with name, a p for their email address and another p for city, state.


******EXCEEDS*******
-
*/

//Define Global Variables.
const gallery = document.getElementById('gallery');

//Call fetch to the randomuser api for 12 random students.
fetch('https://randomuser.me/api/')
  .then(response => response.json())
  .then(result => cardCreator(result.results[0]))


//function to create the image container
const cardCreator = (person) => {
  const cardDiv = document.createElement('div')
  cardDiv.classList.add('card');
  const html = `
      <div class="card-img-container">
          <img class="card-img" src="${person.picture.thumbnail}" alt="profile picture">
      </div>
      <div class="card-info-container">
          <h3 id="name" class="card-name cap">${person.name.first} ${person.name.last}</h3>
          <p class="card-text">${person.email}</p>
          <p class="card-text cap">${person.location.city}, ${person.location.state}</p>
      </div>
  `;
  cardDiv.innerHTML = html;
  gallery.appendChild(cardDiv)
}
