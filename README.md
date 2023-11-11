# Opportune

## About
 
<img src="public/team.jpeg" alt="team" width="200"/>

A platform to tune an internship opportunity to the fullest. After interns receive an offer at a company, we help them get to know the teams and match them to the team of best fit.
After the matching, we hope to provide a dedicated hub for the intern so that they can monitor their project / day-to-day tasks effortlessly.

## Architecture
Frontend: HTML/CSS/Javascript, React, Remix Run, Axios
Backend: Express, MongoDB, 

Frontend
* `/` landing page
    * `/login` login page
    * `/signup` signup page
* `/profile` basic information survey for intern
* `/teams` information about each team the intern may be matched on
* `/matching` matching survey
* `/results` matching results
* `/project` (locked) - project management flow for next term

## Setup Local Development
Frontend Development
- Clone this repository
- Install project dependencies with `npm install`
- Start the development server with `npm run dev`
- Navigate to http://localhost:3000 to view the application.

## Setup Testing Environment
Make sure that Docker is installed prior to running the testing environment.

Frontend
- Run `docker-compose build`
- Run `docker-compose up`

Backend
- Run `docker-compose build`
- Run `docker-compose up`

Matching Engine
- Run `docker-compose build`
- Run `docker-compose up`

*Note:* Each time you make a change to the frontend, you must rerun `docker-compose build` and `docker-compose up`

## Authors
Ethan Chen, Eren Aldemir, Stephen Wang, Karina Montiel, Ryan Luu

## Acknowledgments
- [Remix Docs](https://remix.run/docs)
