var express = require("express");
const bodyParser = require("body-parser");
var mongoose = require("mongoose");
require("dotenv").config();

var app = express();

const Song = require("./modules/model");

const uri = process.env.DB_URI;

const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: true }));
const client = mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//Find 10 songs from database

app.get("/api/songs", function (req, res) {
  async function connect() {
    try {
      const songs = await Song.find({}).limit(10);
      console.log("Songs found...");
      res.status(200).json(songs);
    } catch (error) {
      res.status(500).json("Connection error");
      console.error(
        `Connection error: ${error.stack} on Worker process: ${process.pid}`
      );
    } finally {
      console.log("Job done...");
    }
  }
  connect();
});

// Find song by objectID

app.get("/api/:id", async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);
    if (!song) {
      return res.status(404).json({ message: "Song not found" });
    }
    res.json(song);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// add song to the database
app.post("/api/add", function (req, res) {
  const { id, name, artist, playcount } = req.body;
  const song = new Song({
    id,
    name,
    artist,
    playcount,
  });

  async function connect() {
    try {
      await song.save();
      console.log("Song added");
      res.status(200).json("Song added");
    } catch (error) {
      res.status(500).json("Error adding song");
    } finally {
      console.log("Job done...");
    }
  }

  connect();
});

// Update a song by ID
app.put("/api/update/:id", async (req, res) => {
  try {
    const song = await Song.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!song) return res.status(404).json("Song not found");
    res.status(200).json(song);
  } catch (error) {
    res.status(500).json("Error adding song");
  }
});

// Delete a song by ID
app.delete("/api/delete/:id", async (req, res) => {
  try {
    const deletedSong = await Song.findByIdAndDelete(req.params.id);
    if (!deletedSong) {
      return res.status(404).json("Song not found");
    }
    res.status(200).json("Song deleted");
  } catch (error) {
    res.status(500).json("Error deleting song");
  }
});

app.listen(PORT, function () {
  console.log("Kuunnellaan porttia..." + PORT);
});
