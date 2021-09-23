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
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#license">License</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project
This is a sample project using Node JS to create an RESTful API with roles, users, authentication through JWT and more.

In addition the project will have a client application built in React JS to consume the API

### Built With
* [NodeJS](https://nodejs.org/es/)
* [ReactJS](https://reactjs.org/)
* [Express](https://expressjs.com/)
* [Sequelize](https://sequelize.org/)



<!-- GETTING STARTED -->
## Getting Started

Clone the repo on your local, you will need to have Node JS installed and a Postgres DB to be able to run the project.

### Prerequisites

1. You will need to .env files, the first one to run the test and the second one if you want to run the server locally.
2. Copy the `.env.example` twice as `.env.test` and `.env.development` one per environment.
3. Replace the placeholder values, the .env.example has an explanation of what each variable is.

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/Francisco-BT/ChallengeServer
   ```
2. Install NPM packages
   ```sh
   npm install
   or
   yarn
   ```
 3. Run the project
	   ```sh
	   npm run dev
	   or
	   yarn dev
	   ```
3.  Run the tests, to see the coverage use the flag `--coverage` for more information see the [Jest CLI Options](https://jestjs.io/docs/cli)
	 ```sh
	npm run test
	or
	yarn test 
	 ```
	

<!-- USAGE EXAMPLES -->
## Usage

You can use the API as reference.

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

