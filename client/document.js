//set up variables for html
//create a function for axios.get and axios.post
//set up event listeners on functions
//add event listener to load on page load

const createForm = document.querySelector("#create-form");
const tripDate = document.querySelector("#trip-date");
const cityName = document.querySelector("#city-name");
const faveRestaurant = document.querySelector("#fave-restaurant");
const faveDessert = document.querySelector("#fave-dessert");
const photoSpot = document.querySelector("#photos");
const faveTouristSpot = document.querySelector("#fave-tourist");
const faveNonTouristSpot = document.querySelector("#fave-non-tourist");
const highlights = document.querySelector("#highlights");
const buddies = document.querySelector("#buddies");
const futureSites = document.querySelector("#sites-next-time");
const hindsight = document.querySelector("#hindsight");
const extraDetails = document.querySelector("#more-details");
const pastTrips = document.querySelector("#past-trips");
const pastTripsCont = document.querySelector("#past-trips-container");
const homeBtn = document.getElementById('home-button')
const plannerBtn = document.getElementById('planner-button')

function createNewTrip(trip) {
  let newTrip = document.createElement("div");
  newTrip.dataset.tripId = trip.documented_trip_id;
  newTrip.style.color = "white";
  newTrip.setAttribute("class", "new-trip");
  let tripName = document.createElement("div");
  tripName.textContent = trip.city_name;

  tripName.addEventListener("click", async (event) => {
    await viewPastTripInfo(trip.documented_trip_id);

    if (newTrip.querySelector("#delete-past-trip-btn")) return;
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete This Trip";
    deleteBtn.setAttribute("id", "delete-past-trip-btn");
    //const x = deleteBtn.textContent

    deleteBtn.addEventListener("click", async (event) => {
      await deleteTrip(event);
      tripDate.value = "";
      cityName.value = "";
      faveRestaurant.value = "";
      faveDessert.value = "";
      photoSpot.value = "";
      faveTouristSpot.value = "";
      faveNonTouristSpot.value = "";
      highlights.value = "";
      buddies.value = "";
      futureSites.value = "";
      hindsight.value = "";
      extraDetails.value = "";
    });

    newTrip.appendChild(deleteBtn);
  });
  newTrip.appendChild(tripName);
  pastTrips.appendChild(newTrip);
}

async function viewPastTripInfo(id) {
  await axios.get(`/past-trips?id=${id}`).then((res) => {
    tripDate.value = res.data.trip_dates;
    cityName.value = res.data.city_name;
    faveRestaurant.value = res.data.fav_restaurant;
    faveDessert.value = res.data.fav_dessert;
    photoSpot.value = res.data.trip_photo_op;
    faveTouristSpot.value = res.data.tourist_spot;
    faveNonTouristSpot.value = res.data.non_tourist_spot;
    highlights.value = res.data.trip_highlights;
    buddies.value = res.data.travel_buddies;
    futureSites.value = res.data.see_next_time;
    hindsight.value = res.data.hindsight;
    extraDetails.value = res.data.other_details;
  });
}

function addNewCity(event) {
  event.preventDefault();
  let body = {
    tripDate: tripDate.value,
    cityName: cityName.value,
    faveRestaurant: faveRestaurant.value,
    faveDessert: faveDessert.value,
    photoSpot: photoSpot.value,
    faveTouristSpot: faveTouristSpot.value,
    faveNonTouristSpot: faveNonTouristSpot.value,
    highlights: highlights.value,
    buddies: buddies.value,
    futureSites: futureSites.value,
    hindsight: hindsight.value,
    extraDetails: extraDetails.value,
  };
  axios
    .post(`/past-trips`, body)
    .then((res) => {
      refreshPastTrips();
    })
    .catch((error) => console.log(error));

  tripDate.value = "";
  cityName.value = "";
  faveRestaurant.value = "";
  faveDessert.value = "";
  photoSpot.value = "";
  faveTouristSpot.value = "";
  faveNonTouristSpot.value = "";
  highlights.value = "";
  buddies.value = "";
  futureSites.value = "";
  hindsight.value = "";
  extraDetails.value = "";
}

const refreshPastTrips = () => {
  while (pastTrips.hasChildNodes()) {
    pastTrips.firstChild.remove();
  }
  getPastTrips();
};

const getPastTrips = () => {
  axios
    .get(`/past-trips`)
    .then((res) => {
      for (let i = 0; i < res.data.length; i++) {
        createNewTrip(res.data[i]);
      }
    })
    .catch((error) => console.log(error));
};

const deleteTrip = async (event) => {
  //pastTrips.appendChild(deleteBtn);
  await axios
    .delete("/past-trips", {
      data: { documented_trip_id: event.target.parentNode.dataset.tripId },
    })
    .then(async (res) => {
      await refreshPastTrips();
    });
};

const unclickDeleteBtn = () => {
  const deleteBtns = pastTrips.querySelectorAll("#delete-past-trip-btn");
  for (let i = 0; i < deleteBtns.length; i++) {
    deleteBtns[i].remove();
  }
  tripDate.value = "";
  cityName.value = "";
  faveRestaurant.value = "";
  faveDessert.value = "";
  photoSpot.value = "";
  faveTouristSpot.value = "";
  faveNonTouristSpot.value = "";
  highlights.value = "";
  buddies.value = "";
  futureSites.value = "";
  hindsight.value = "";
  extraDetails.value = "";
};


homeBtn.addEventListener('click', () => {
    window.location.href = '/home'
})

plannerBtn.addEventListener('click', () => {
    window.location.href = '/planner'
})

window.onload = getPastTrips;

pastTripsCont.addEventListener("click", unclickDeleteBtn);

createForm.addEventListener("submit", addNewCity);
