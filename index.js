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

mongoose.connect('mongodb://localhost:27017/cfDB', {useNewURLParser: true, useUnifiedTopology: true});

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true}));

app.use(bodyParser.json());

// create a write stream (in append mode)
// a ‘log.txt’ file is created in root directory
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {flags: 'a'})

// setup the logger
app.use(morgan('combined', {stream: accessLogStream}));

//array of users
let users = [
    {
        id: 1,
        name: "Joey",
        favouriteMovies: []
    },
    {
        id: 2,
        name: "Kelly",
        favouriteMovies: []
    },
]
/*
//array of movies
let movies = [
    {
        "Title": "City of God (Cidade de Deus)",
        "Description": "A sweeping tale of how crime affects the poor population of Rio de Janeiro, Brazil, City of God depicts the rise of organized crime in the Cidade de Deus suburb.",
        "Genre": {
            "Name": "Crime",
            "Description": "A genre that revolves around criminal activities, often focusing on the lives of criminals and the consequences of their actions."
        },
        "Director": {
            "Name": "Fernando Meirelles and Kátia Lund",
            "Bio": "Fernando Meirelles is a Brazilian film director and producer known for his work in City of God, The Constant Gardener, and Blindness. Kátia Lund is a Brazilian director and screenwriter.",
            "Birth": "N/A"
        },
        "ImageURL": "https://example.com/city_of_god.jpg",
        "Featured": true
    },
    {
        "Title": "Memories of Underdevelopment (Memorias del Subdesarrollo)",
        "Description": "Set in the wake of the Cuban revolution, this film follows a bourgeois intellectual who decides to stay in Cuba while his family flees to Miami. It explores themes of alienation, identity, and politics.",
        "Genre": {
            "Name": "Drama",
            "Description": "A genre that focuses on serious, emotional storytelling often with realistic characters and settings."
        },
        "Director": {
            "Name": "Tomás Gutiérrez Alea",
            "Bio": "Tomás Gutiérrez Alea was a Cuban film director and screenwriter. He was considered one of the most important directors in the history of Cuban cinema.",
            "Birth": "December 11, 1928"
        },
        "ImageURL": "https://example.com/memories_of_underdevelopment.jpg",
        "Featured": false
    },
    {
        "Title": "Tsotsi",
        "Description": "Set in Johannesburg, South Africa, Tsotsi follows a young street thug who steals a car, only to discover a baby in the back seat. As he cares for the child, he begins to confront his own past and the possibility of redemption.",
        "Genre": {
            "Name": "Drama",
            "Description": "A genre that focuses on serious, emotional storytelling often with realistic characters and settings."
        },
        "Director": {
            "Name": "Gavin Hood",
            "Bio": "Gavin Hood is a South African filmmaker best known for directing the film Tsotsi, which won the Academy Award for Best Foreign Language Film in 2006.",
            "Birth": "May 12, 1963"
        },
        "ImageURL": "https://example.com/tsotsi.jpg",
        "Featured": true
    },
    {
        "Title": "Frida",
        "Description": "Frida is a biographical drama that chronicles the life of Mexican artist Frida Kahlo, focusing on her tumultuous relationship with fellow artist Diego Rivera, her struggle with disability, and her pioneering work in the art world.",
        "Genre": {
            "Name": "Biography",
            "Description": "A genre that portrays the life of a real person, highlighting significant events, achievements, and challenges."
        },
        "Director": {
            "Name": "Julie Taymor",
            "Bio": "Julie Taymor is an American director known for her visually stunning productions, including stage adaptations of The Lion King and Across the Universe.",
            "Birth": "December 15, 1952"
        },
        "ImageURL": "https://example.com/frida.jpg",
        "Featured": true
    },
    {
        "Title": "Basquiat",
        "Description": "Basquiat is a biographical drama that tells the story of Jean-Michel Basquiat, a young graffiti artist who becomes a sensation in the New York art world in the 1980s. The film explores his rise to fame, struggles with addiction, and untimely death.",
        "Genre": {
            "Name": "Biography",
            "Description": "A genre that portrays the life of a real person, highlighting significant events, achievements, and challenges."
        },
        "Director": {
            "Name": "Julian Schnabel",
            "Bio": "Julian Schnabel is an American artist and filmmaker known for his distinctive style and exploration of complex characters. He is also known for directing The Diving Bell and the Butterfly.",
            "Birth": "October 26, 1951"
        },
        "ImageURL": "https://example.com/basquiat.jpg",
        "Featured": false
    },
    {
        "Title": "Loving Vincent",
        "Description": "Loving Vincent is an animated biographical drama that explores the life and death of Dutch post-impressionist painter Vincent van Gogh. The film is unique in that it is the world's first fully painted feature film, with each frame created in the style of Van Gogh's paintings.",
        "Genre": {
            "Name": "Animation",
            "Description": "A genre that uses various artistic techniques to create moving images, often with a focus on storytelling."
        },
        "Director": {
            "Name": "Dorota Kobiela and Hugh Welchman",
            "Bio": "Dorota Kobiela is a Polish filmmaker and animator known for her innovative approach to storytelling. Hugh Welchman is a British film producer and director.",
            "Birth": "N/A"
        },
        "ImageURL": "https://example.com/loving_vincent.jpg",
        "Featured": true
    },
    {
        "Title": "Pollock",
        "Description": "Pollock is a biographical film that explores the life and career of American painter Jackson Pollock. The film delves into Pollock's struggles with alcoholism, his tumultuous relationship with fellow artist Lee Krasner, and his pioneering contributions to abstract expressionism.",
        "Genre": {
            "Name": "Biography",
            "Description": "A genre that portrays the life of a real person, highlighting significant events, achievements, and challenges."
        },
        "Director": {
            "Name": "Ed Harris",
            "Bio": "Ed Harris is an American actor and filmmaker known for his intense performances and versatility. Pollock marks his directorial debut.",
            "Birth": "November 28, 1950"
        },
        "ImageURL": "https://example.com/pollock.jpg",
        "Featured": false
    },
    {
        "Title": "Big Eyes",
        "Description": "Big Eyes is a biographical drama that tells the story of Margaret and Walter Keane, a couple known for their popular paintings of children with big, sad eyes. The film explores Margaret's struggle for recognition as the true artist behind the paintings, which were initially credited to her husband.",
        "Genre": {
            "Name": "Biography",
            "Description": "A genre that portrays the life of a real person, highlighting significant events, achievements, and challenges."
        },
        "Director": {
            "Name": "Tim Burton",
            "Bio": "Tim Burton is an American filmmaker known for his unique visual style and dark, whimsical storytelling. Big Eyes marks a departure from his typical gothic aesthetic.",
            "Birth": "August 25, 1958"
        },
        "ImageURL": "https://example.com/big_eyes.jpg",
        "Featured": true
    },
    {
        "Title": "Rang Rasiya (Colours of Passion)",
        "Description": "Rang Rasiya is a biographical drama film based on the life of the 19th-century Indian painter Raja Ravi Varma. It explores his artistic journey and his defiance of societal norms.",
        "Genre": {
            "Name": "Biography",
            "Description": "A genre that portrays the life of a real person, often focusing on significant events, achievements, and challenges."
        },
        "Director": {
            "Name": "Ketan Mehta",
            "Bio": "Ketan Mehta is an Indian film director and screenwriter known for his work in Hindi cinema.",
            "Birth": "July 7, 1952"
        },
        "ImageURL": "https://example.com/rang_rasiya.jpg",
        "Featured": true
    },
    {
        "Title": "Hokusai",
        "Description": "Hokusai is a biographical drama film about the life of Japanese artist Katsushika Hokusai, known for his iconic woodblock print series, Thirty-Six Views of Mount Fuji.",
        "Genre": {
            "Name": "Biography",
            "Description": "A genre that portrays the life of a real person, often focusing on significant events, achievements, and challenges."
        },
        "Director": {
            "Name": "Keiichi Hara",
            "Bio": "Keiichi Hara is a Japanese animator and director known for his work in anime films and television series.",
            "Birth": "1959"
        },
        "ImageURL": "https://example.com/hokusai.jpg",
        "Featured": true
    }
];
*/

/*
//UPDATE: Handle PUT request to update user information
app.put('/users/:id', (req, res) => {
    // Extract the user ID from the request parameters
    const { id } = req.params;
    // Extract the updated user data from the request body
    const updatedUser = req.body;

    // Find the user in the array of users based on the provided ID
    let user = users.find(user => user.id == id );

    // If the user exists, update the user's name with the provided name
    if (user) {
        user.name = updatedUser.name;
        // Respond with status 200 (OK) and the updated user object
        res.status(200).json(user);
    } else {
        // If no user is found with the provided ID, respond with status 400 (Bad Request) and a message indicating so
        res.status(400).send('no such user');
    }
});
*/

//UPDATE: Handle PUT request to update user information
/* We'll expect JSON in this format
{
  Username: String,
  (required)
  Password: String,
  (required)
  Email: String,
  (required)
  Birthday: Date
}*/
app.put('users/:Username', async (req, res) => {
    await Users.findOneAndUpdate({ Username: req.params.Username }, { $set:
    {
        Username: req.body.Username,
        Password: req.body.Password,
        Email: req.body.Email,
        Birthday: req.body.Birthday
    }
},
{ new: true } //This line makes sure that the updated document is returned
)
.then((updatedUser) => {
    res.json(updatedUser);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send("Error: " + err);
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

/*
// CREATE: Handle POST request to create a new user
app.post('/users', (req, res) => {
    const newUser = req.body;

    if (newUser.name) {
        newUser.id = uuid.v4();
        users.push(newUser);
        res.status(201).json(newUser);
    } else {
        res.status(400).send('users need names');
    }
});
*/

// Add a movie to a user's list of favorites
app.post('/users/:Username/movies/:movieId', async (req, res) => {
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
app.delete('/users/:username/movies/:movieId', async (req, res) => {
    try {
    const updatedUser = await Users.findOneAndUpdate({username: req.params.username}, 
      { $pull: {favouriteMovies: req.params.movieId} }, {new: true})
      res.json(updatedUser);
    }
      catch(error){
    console.trace("error occurred deleting the movie", error)
      }
  })
  


// CREATE: Handle POST request to add a new user
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

/*
// READ: Handle GET request to retrieve all movies
app.get('/movies', (req, res) => {
    // Respond with status 200 (OK) and the array of movies in JSON format
    res.status(200).json(movies);
});
*/
// READ: Handle GET request to retrieve all movies
app.get('/movies', async (req, res) => {
    await Movies.find()
    .then((movies) => {
        res.status(201).json(movies);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

/*
// READ: Handle GET request to retrieve a movie by its title
app.get('/movies/:title', (req, res) => {
    // Extract the movie title from the request parameters
    const { title } = req.params;
    // Find the movie in the array of movies based on the provided title
    const movie = movies.find( movie => movie.Title === title );

    // If the movie exists, respond with status 200 (OK) and the movie object in JSON format
    if (movie) {
        res.status(200).json(movie);
    } else {
        // If no movie is found with the provided title, respond with status 400 (Bad Request) and a message indicating so
        res.status(400).send('no such movie');
    }
});
*/

// READ: Handle GET request to retrieve a movie by its title
app.get('/movies/:title', async (req, res) => {
    await Movies.findOne({ Title: req.params.title })
        .then((movie) => {
            res.json(movie);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

/*
//READ:  Handle GET request to retrieve a genre by it's name
app.get('/movies/genre/:genreName', (req, res) => {
    const { genreName } = req.params;
    const genre = movies.find( movie => movie.Genre.Name === genreName).Genre;

    if (genre) {
        res.status(200).json(genre);
    } else {
        res.status(400).send('no such genre');
    }
});
*/


//READ:  Handle GET request to retrieve a genre by it's name
app.get('/movies/genre/:genreName', async (req, res) => {
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




/*
//READ: Handle GET request to retrieve a director by name
app.get('/movies/director/:directorName', (req, res) => {
    const { directorName } = req.params;
    const director = movies.find( movie => movie.Director.Name === directorName).Director;

    if (director) {
        res.status(200).json(director);
    } else {
        res.status(400).send('no such director');
    }
});
*/

//READ: Handle GET request to retrieve a director by name
app.get('movies/director/:directorName', async (req, res) => {
    await Movies.findOne({ Name: req.params.directorName })
      .then((director) => {
        if (director) {
            res.status(200).json(director);
        } else {
            res.status(400).send('no such director');
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
})

// Get all users
app.get('/users', async (req, res) => {
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
app.get('/users/:Username', async (req, res) => {
    await Users.findOne({ Username: req.params.Username })
      .then((user) => {
        res.json(user);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  });

/*
// DELETE: Handle DELETE request to remove a movie from a user's favorite movies array
app.delete('/users/:id/:movieTitle', (req, res) => {
    // Extract the user ID and movie title from the request parameters
    const { id, movieTitle } = req.params;
    // Find the user in the array of users based on the provided ID
    let user = users.find(user => user.id == id );

        // If the user exists, remove the movie title from the user's favorite movies array
    if (user) {
        // Filter out the movie title from the user's favorite movies array
        user.favouriteMovies = user.favouriteMovies.filter( title => title !== movieTitle );
        // Respond with status 200 (OK) and a message indicating the movie has been removed from the user's array
        res.status(200).send(`${movieTitle} has been removed from user ${id}'s array`);
    } else {
        // If no user is found with the provided ID, respond with status 400 (Bad Request) and a message indicating so
        res.status(400).send('no such film on list');
    }
});
*/


  
/*
//DELETE user by username
app.delete('/users/:id/', (req, res) => {
    const { id } = req.params;
    
    let user = users.find(user => user.id == id );

    if (user) {
        users = users.filter( user => user.id != id);
        res.status(200).send(`ID:${id}'s email has been removed.`);
    } else {
        res.status(400).send('no such film on list');
    }
});
*/


// Delete a user by username
app.delete('/users/:Username', async (req, res) => {
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