# ChallengeServer
[![MIT License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]


<!-- TABLE OF CONTENTS -->
<details open="open">
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li>
	        <a href="#installation">Installation</a>
	        <ul>
		        <li><a href="#run-it-using-docker">Run it using Docker</a></li>
	        </ul>
        </li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#license">License</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project
This is a sample project using Node JS to create an RESTful API with roles, users, authentication through JWT and more.

In addition the project has a client application built in React JS to consume the API

### Built With
* [NodeJS](https://nodejs.org/es/)
* [ReactJS](https://reactjs.org/)
* [Express](https://expressjs.com/)
* [Sequelize](https://sequelize.org/)
* [React JS](https://reactjs.org/)



<!-- GETTING STARTED -->
## Getting Started

Clone the repo on your local, you will need to have Node JS installed and a Postgres DB to be able to run the project.

### Prerequisites

1. You will need to .env files, the first one to run the test and the second one if you want to run the server locally.
2. Copy the `.env.example` twice as `server/.env.test` and `server/.env.development` one per environment. Also for production using docker I recommend create a third one as `server/.env`
3. Replace the placeholder values, the .env.example has an explanation of what each variable is.

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/Francisco-BT/ChallengeServer
   ```
2. Install NPM packages for server
   ```sh
   cd server
   npm install
   or
   yarn
   ```
 3. Install NPM packages for client React JS app
	   ```sh
	   cd client
	   npm install
	   or
	   yarn
	   ```
 4. Run the server project
	   ```sh
	   cd server
	   npm run dev
	   or
	   yarn dev
	   ```
3. Run the client project
	```sh
		cd client
		npm start
		or
		yarn start
	``` 
6.  Run the tests, to see the coverage use the flag `--coverage` for more information see the [Jest CLI Options](https://jestjs.io/docs/cli)
	 ```sh
	cd server
	npm run test
	or
	yarn test 
	 ```
	
#### Run it using Docker
The project has a Docker file to run both server and client in a Docker container:
1. Run the docker build command to create the image:
	```sh
	docker build -t challenge-server .
	```
2. Then execute the follow command to run the container:
	```sh
	docker run --env-file=./server/.env -p 2504:2504 -t challenge-server
	```
Note: If you want you can use a [compose file](https://docs.docker.com/compose/compose-file/) to read the env variables, please consider that the port (`-p 2504:2504`) can be change depending on your env file.

<!-- USAGE EXAMPLES -->
## Usage

You can use the API as reference of how to build an Node JS API as well as an example of a React JS application.

_For more examples, please refer to the [Documentation][docs-url]_

<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE` for more information.


<!-- MARKDOWN LINKS & IMAGES -->
[license-shield]: https://img.shields.io/github/license/othneildrew/Best-README-Template.svg?style=for-the-badge
[license-url]: https://github.com/Francisco-BT/ChallengeServer/blob/dev/LICENSE
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://mx.linkedin.com/in/francisco-bt
[docs-url]: https://mind-challenge-server.herokuapp.com/api-docs
