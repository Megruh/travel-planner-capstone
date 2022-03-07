require("dotenv").config();
const path = require("path");
const Sequelize = require("sequelize");

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      rejectUnauthorized: false,
    },
  },
});

const serveHome = (req, res) => {
  res.sendFile(path.resolve("client/home.html"));
};

const servePlanner = (req, res) => {
  res.sendFile(path.resolve("client/planner.html"));
};

const serveDocument = (req, res) => {
  res.sendFile(path.resolve("client/document.html"));
};

const createNewPlan = (req, res) => {
  let { trip_name } = req.body;
  sequelize
    .query(
      `INSERT INTO future_trips (trip_name, is_checked)
    VALUES ('${trip_name}', false)
    RETURNING trip_name;`
    )
    .then((dbRes) => {
      res.status(200).send(dbRes[0][0]);
      console.log(dbRes);
    });
};

const createNewTrip = (req, res) => {
  let {
    tripDate,
    cityName,
    faveRestaurant,
    faveDessert,
    photoSpot,
    faveTouristSpot,
    faveNonTouristSpot,
    highlights,
    buddies,
    futureSites,
    hindsight,
    extraDetails,
  } = req.body;

  tripDate = sequelize.escape(tripDate);
  cityName = sequelize.escape(cityName);
  faveRestaurant = sequelize.escape(faveRestaurant);
  faveDessert = sequelize.escape(faveDessert);
  photoSpot = sequelize.escape(photoSpot);
  faveTouristSpot = sequelize.escape(faveTouristSpot);
  faveNonTouristSpot = sequelize.escape(faveNonTouristSpot);
  highlights = sequelize.escape(highlights);
  buddies = sequelize.escape(buddies);
  futureSites = sequelize.escape(futureSites);
  hindsight = sequelize.escape(hindsight);
  extraDetails = sequelize.escape(extraDetails);

  sequelize
    .query(
      `INSERT INTO document_trips (trip_dates, city_name, fav_restaurant, fav_dessert, trip_photo_op, tourist_spot, non_tourist_spot, trip_highlights, travel_buddies, see_next_time, hindsight, other_details)
    VALUES (${tripDate}, ${cityName}, ${faveRestaurant}, ${faveDessert}, ${photoSpot}, ${faveTouristSpot}, ${faveNonTouristSpot}, ${highlights}, ${buddies}, ${futureSites}, ${hindsight}, ${extraDetails})
    RETURNING *;`
    )

    .then((dbRes) => {
      res.status(200).send(dbRes[0][0]);
      console.log(dbRes.data);
    })
    .catch((error) => console.log(error));
};

const getPastTrips = (req, res) => {
  let query = "SELECT * FROM document_trips;";
  if (req.query?.id)
    query = `SELECT * FROM document_trips WHERE documented_trip_id = ${req.query.id};`;
  sequelize
    .query(query)
    .then((dbRes) => {
      res.status(200).send(req.query.id ? dbRes[0][0] : dbRes[0]);
    })
    .catch((error) => console.log(error));
};

const deleteTrip = (req, res) => {
  const { documented_trip_id } = req.body;
  sequelize
    .query(
      `DELETE FROM document_trips WHERE documented_trip_id = ${documented_trip_id};`
    )
    .then(res.sendStatus(200))
    .catch((error) => console.log(error));
};

const getFutureTrips = (req, res) => {
  sequelize
    .query(`SELECT * FROM future_trips`)
    .then((dbRes) => {
      res.status(200).send(dbRes[0]);
      console.log(dbRes);
    })
    .catch((error) => console.log(error));
};

const deleteFutureTrip = (req, res) => {
  const { future_trip_id } = req.body;
  sequelize
    .query(`DELETE FROM future_trips WHERE future_trip_id = ${future_trip_id};`)
    .then(res.sendStatus(200))
    .catch((error) => console.log(error));
};

const crossOffTrip = (req, res) => {
    const {id, is_checked} = req.body
    sequelize.query(`UPDATE future_trips
    SET is_checked = ${is_checked}
    WHERE future_trip_id = ${id};`)
    .then(dbRes => {
        res.sendStatus(200)
    })
    .catch((error) => console.log(error))
}
//set up functions to connect to endpoints

module.exports = {
  serveHome,
  servePlanner,
  serveDocument,
  createNewTrip,
  getPastTrips,
  deleteTrip,
  createNewPlan,
  getFutureTrips,
  deleteFutureTrip,
  crossOffTrip
};
