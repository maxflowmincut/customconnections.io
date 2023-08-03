<h1 align="center">CustomConnections.io</h1>
<p align="center">
    <a href="https://github.com/imaad-f/customconnections.io/blob/main/LICENSE"><img alt="GitHub license" src="https://img.shields.io/github/license/imaad-f/customconnections.io"></a>
    <a href="https://github.com/imaad-f/customconnections.io/issues"><img alt="GitHub issues" src="https://img.shields.io/github/issues/imaad-f/customconnections.io"></a>
    <a href="https://github.com/imaad-f/customconnections.io/network"><img alt="GitHub forks" src="https://img.shields.io/github/forks/imaad-f/customconnections.io"></a>
    <a href="https://github.com/imaad-f/customconnections.io/stargazers"><img alt="GitHub stars" src="https://img.shields.io/github/stars/imaad-f/customconnections.io"></a>
</p>

#

## See the website live [here](https://customconnections.io)

<p align="center">
    <img src="assets/example.JPG?raw=true" alt="Example image of site">
</p>

## About 📖

CustomConnections.io is an online game inspired by The New York Times's online Connections [game](https://www.nytimes.com/games/connections), which in turn is based on the British TV show quiz 'Only Connect'. It was developed using React, TypeScript, Express, Node.js, Tailwind CSS and MongoDB for the backend, and Docker to containerize. 

## Technologies used 🛠️

- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Express](https://expressjs.com/)
- [Node.js](https://nodejs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [MongoDB](https://www.mongodb.com/)
- [Docker](https://www.docker.com/)

## Getting Started 🚀

Clone the repository and install the dependencies:

```shell
git clone https://github.com/imaad-f/customconnections.io.git
cd customconnections.io
cd client
npm install
cd ../server
npm install
```

Then update server.js and/or set your environmental variables to connect to a database
Create a docker file to build the application with the environmental variables you have set

```shell
docker build -t username/tag .
docker run -e "DB_CLUSTER=?" -e "PORT=?" -e "DB_USERNAME=?" -e "DB_PASSWORD=?" -e "NODE_ENV=?" -e "LOGGING=?" -p port:port username/tag
```

And you're ready to go!

## Contributing 💡

If you would like to help contribute please don't hesitate to open a [pull request](https://github.com/imaad-f/customconnections.io/pulls) or [issue](https://github.com/imaad-f/customconnections.io/issues).

## Credits ✨

Website icon made by [ShareIcon](https://www.shareicon.net/social-normal-social-network-shared-multimedia-option-sharing-interface-846003).

## License 📄

This project is licensed under GPL-3.0 - see the [LICENSE](./LICENSE) file for further details.

## Support 🎁

Give a ⭐️ if this project was of any help!
