# coordinates-api

A small project that will provide geocoding and weather data for a set of coordinates. You can either get a random set of coordinates for a given country or provide your own coordinates.

## Usage
- **Fetch random coordinates from a random country:** https://coordinates-api.usingthe.computer/random
- **Fetch random coordinates from a given country:** https://coordinates-api.usingthe.computer/random/brazil
- **Fetch geocoding and weather data for random coordinates:** https://coordinates-api.usingthe.computer/random/brazil?include=geocoding,weather
- **Fetch geocoding and weather data for given coordinates:** https://coordinates-api.usingthe.computer/coordinates?lat=41.879602&lon=-87.624260&include=geocoding,weather

## Running locally
- Configure a `.env` file based off of `.env.example`.
- Run the project with `npm run dev`.