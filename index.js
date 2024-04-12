const express = require('express'),
morgan = require('morgan'), 
fs = require('fs'), 
path = require('path'),
bodyParser = require('body-parser'),
uuid = require('uuid'),
mongoose = require('mongoose'),
Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;

mongoose.connect('mongodb://localhost:27017/cfDB', { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true}));

app.use(bodyParser.json());

let auth = require('./auth')(app);

const passport = require('passport');
require('./passport');

// create a write stream (in append mode)
// a ‘log.txt’ file is created in root directory
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {flags: 'a'})

// setup the logger
app.use(morgan('combined', {stream: accessLogStream}));



//UPDATE: Handle PUT request to update user information
/* We'll expect JSON in this format
{
  Username: String,
  (required)
  Password: String,
  (required)
  Email: String,
  (required)
  Birthday: Date,
  FavouriteMovies: []
}
*/
app.put("/users/:username", passport.authenticate('jwt', {session: false}), async (req, res) => {
  
    await Users.findOneAndUpdate(
      { Username: req.params.username },
      {
        $set: {
          Username: req.body.Username,
          Password: req.body.Password,
          Email: req.body.Email,
          Birthday: req.body.Birthday,
          FavouriteMovies: req.body.FavouriteMovies,
        },
      },
      { new: true }
    )
      .then((updatedUser) => {
        res.json(updatedUser);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error:" + err);
      });
  });


/*
//CREATE: Handle POST request to add a movie to a user's favourite movies array
app.post('/users/:id/:movieTitle', (req, res) => {
    // Extract the user ID and movie title from the request parameters
    const { id, movieTitle } = req.params;
    
    // Find the user in the array of users based on the provided ID
    let user = users.find(user => user.id == id );

    // If the user exists, add the movie title to the user's favourite movies array
    if (user) {
        user.favouriteMovies.push(movieTitle);
        // Respond with status 200 (OK) and a message indicating the movie has been added to the user's array
        res.status(200).send(`${movieTitle} has been added to user ${id}'s array`);
    } else {
        // If no user is found with the provided ID, respond with status 400 (Bad Request) and a message indicating so
        res.status(400).send('no such user');
    }
});
*/


// Add a movie to a user's list of favorites
app.post('/users/:Username/movies/:movieId', passport.authenticate('jwt', {session: false}), async (req, res) => {
    await Users.findOneAndUpdate({ Username: req.params.Username }, {
       $push: { FavouriteMovies: req.params.movieId }
     },
     { new: true }) // This line makes sure that the updated document is returned
    .then((updatedUser) => {
      res.json(updatedUser);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
  });

  
// DELETE: Handle DELETE request to remove a movie from a user's favorite movies array
app.delete( '/users/:id/:movieTitle', passport.authenticate('jwt', {session: false}), async (req, res) => {
    await Users.findOneAndUpdate({username: req.params.username}, 
        { $pull: {FavouriteMovies: req.params.movieTitle} }, {new: true})
    .then ((updatedUser) => {
        res.json(updatedUser);
    })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
 })

 
// CREATE: Handle POST request to add/Create a new user
/* We'll expect JSON in this format
{
    ID: Integer,
    Username: String,
    Password: String,
    Email: String,
    Birthday: Date
}
*/
app.post('/users', async (req, res) =>{
    await Users.findOne({ Username: req.body.Username })
        .then((user) => {
          if (user) {
            return res.status(400).send(req.body.Username + 'already exists');
          } else {
            Users
              .create({
                Username: req.body.Username,
                Password: req.body.Password,
                Email: req.body.Email,
                Birthday: req.body.Birthday
              })
                .then((user) => {res.status(201).json(user) })
            .catch((error) => {
              console.error(error);
              res.status(500).send('Error: ' + error);
            })
          }
        })
        .catch((error) => {
          console.error(error);
          res.status(500).send('Error: ' + error);
        });
});


// READ: Handle GET request to retrieve all movies
app.get('/movies', passport.authenticate('jwt', { session: false }), async (req, res) => {
    await Movies.find()
    .then((movies) => {
        res.status(201).json(movies);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});


// READ: Handle GET request to retrieve a movie by its title
app.get('/movies/:title', passport.authenticate('jwt', {session: false}), async (req, res) => {
    await Movies.findOne({ Title: req.params.title })
        .then((movie) => {
            res.json(movie);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});


//READ:  Handle GET request to retrieve a genre by it's name
app.get('/movies/genre/:genreName', passport.authenticate('jwt', {session: false}), async (req, res) => {
    await Movies.findOne({ 'Genre.Name': req.params.genreName })
        .then((genre) => {
          if (genre) {
            res.json(genre);
          } else {
            res.status(400).send(req.params.genreName + " genre was not found.");
          }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});


//READ: Handle GET request to retrieve a director by name
app.get('/movies/director/:directorName', passport.authenticate('jwt', {session: false}), async (req, res) => {
    await Movies.findOne({ 'Director.Name': req.params.directorName })
      .then((director) => {
        if (director) {
            res.status(200).json(director);
        } else {
            res.status(404).send('no such director');
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
})

// Get all users
app.get('/users', passport.authenticate('jwt', {session: false}), async (req, res) => {
    await Users.find()
      .then((users) => {
        res.status(201).json(users);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  });

// Get a user by username
app.get('/users/:Username', passport.authenticate('jwt', {session: false}), async (req, res) => {
    await Users.findOne({ Username: req.params.Username })
      .then((user) => {
        res.json(user);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  });


// Delete a user by username
app.delete('/users/:Username', passport.authenticate('jwt', {session: false}), async (req, res) => {
    await Users.findOneAndDelete({ Username: req.params.Username })
      .then((user) => {
        if (!user) {
          res.status(400).send(req.params.Username + ' was not found');
        } else {
          res.status(200).send(req.params.Username + ' was deleted.');
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  });


app.get('/', (req, res) => {
    res.send('Welcome to my movies app....GETFLIX!!');
});

app.use(express.static('public'));

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(8080, () => {
    console.log('The movie app has loaded and is listening on port 8080');
});