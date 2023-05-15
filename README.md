# coordinates-api

A small project that will provide geocoding and weather data for a set of coordinates. You can either get a random set of coordinates for a given country or provide your own coordinates.

## Usage
- **Fetch random coordinates from a random country:** https://coordinates-api.usingthe.computer/random
- **Fetch random coordinates from a given country:** https://coordinates-api.usingthe.computer/random/brazil
- **Fetch geocoding and weather data for random coordinates:** https://coordinates-api.usingthe.computer/random/brazil?include=geocoding,weather
- **Fetch geocoding and weather data for given coordinates:** https://coordinates-api.usingthe.computer/coordinates?lat=41.879602&long=-87.624260&include=geocoding,weather


## Local development
Configure postgres:
```
$ psql
# create user coordinates_api with password 'dev';
# create database coordinates_api;
# exit
```

Sign in with `psql -U coordinates_api -d coordinates_api` and copy and paste the database schema located in `src/db/schema.sql`.

Run project with `npm run dev`.