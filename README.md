#Rikishi
##A Voting Application
![rikishi: a sumo wrestler](https://openclipart.org/image/90px/svg_to_png/223220/SumoColour.png)

###Setup
- Clone the repo and run `npm install` in the root of the cloned directory
- Prolly wanna get an `.env` file from me, which goes in the root directory
- ???
- Profit

###Running the app
####Locally
After completing the npm installation process, you have two options:
  - If you don't have `nodemon` or don't want live reloading, run `npm start` from the root directory.
  - If you are into live reloading, run `npm run dev-start` from the root directoty.

Then, visit [localhost:3000](http://localhost:3000) to get started.

####Publicly
Visit the app on [Heroku](https://nameless-lake-26408.herokuapp.com/) and get to surveyin'!

###Contributing
- Feature branches split off of `develop`, per [GitHub Flow](https://guides.github.com/introduction/flow/).
- Use the ES5 JavaScript Style Guide located [here](https://github.com/airbnb/javascript/tree/master/es5).
- Make sure you have [Nodemon](http://nodemon.io) installed globally, and then run `npm run dev-start` to fire up the server locally.

###Todo
- [x] Create a web app written in Node.JS using an Express-based framework, SequelizeJS, and MySQL.
- [x] Use the latest stable release of Node.JS v0.10.x.
- [x] Follow the ES5 JavaScript Style Guide located [here](https://github.com/airbnb/javascript/tree/master/es5)
- [x] Use NPM to declare all dependencies so that we can run it in a test environment.
- [x] The app should allow an admin to enter survey questions with multiple choice answers.
- [x] When a guest visits the app in a browser it should present a random survey question to the guest and allow them to answer.
- [ ] Avoid showing a previously-answered question to the same guest. [[bug noted](https://github.com/chrisbodhi/rikishi/issues/10)]
- [x] Record answers and...
- [x] ...display the survey results in an admin interface.
- [x] Secure the admin interface from guests.
- [x] Make sure the UI is mobile browser friendly.
- [x] Provide a clear README with instructions on how to setup and run the app.
- [x] Create a github.com repository with the app that we can pull from and test.
- [x] Provide a link to your application running on a publicly accessible server with any credentials needed to fully test it.

