// Importataan tarvittavat paketit
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config(); // Haetaan tiedot Mongodb apiin .env tiedostosta

// Luodaan express appi
const app = express();

// Haetaan Mongodb model kappaleille
const Song = require("./modules/model");

// Haetaan tietokannan URI .env tiedostosta
const uri = process.env.DB_URI;

// Haetaan portti .env tiedostosta tai jos sitä ei ole käytä porttia 5000
const PORT = process.env.PORT || 5000;

// Otetaan bodyparser käyttöön JSON lukemista varten
app.use(bodyParser.json());

// Yhdistetään tietokantaan
const client = mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//Haetaan tietokannasta kappaleita ja rajoitetaan se 10 tulokseen ".limit(10) avulla"
// Jos kappaleiden löytämisessä tulee virhe, lähetetään statuskoodi 500.
app.get("/api/songs", async (req, res) => {
  try {
    const songs = await Song.find({}).limit(10);
    console.log("Songs found...");
    res.status(200).json(songs);
  } catch (error) {
    res.status(500).json("Connection error");
  } finally {
    console.log("Job done...");
  }
});

// Etsitään kappale tietokannasta. Käytetään findById komentoa tähän.
// Jos kappaleen löytämisessä tulee virhe tai kappaletta ei ole, lähetetään statuskoodi 400 tai 500.
// Muussa tapauksessa näytetään kappaleentiedot ja ilmoitetaan siitä statuskoodilla 200
app.get("/api/:id", async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);
    if (!song) {
      return res.status(404).json({ message: "Song not found" });
    }
    res.status(200).json(song);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Lisätään uusi kappale tietokantaan käyttäen samaa modelia mikä on määritelty model.js tiedostossa
app.post("/api/add", function (req, res) {
  const { id, name, artist, playcount } = req.body;
  const song = new Song({
    id,
    name,
    artist,
    playcount,
  });

  // lisätään kappaleen tietokantaan. Käytetään findByIdAndUpdate komentoa tähän.
  // Jos kappaleen lisäämiesssä tulee virhe, lähetetään statuskoodi 500.
  // Muussa tapauksessa päivtetään kappaleentiedot ja ilmoitetaan siitä statuskoodilla 200
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

// Päivtetään kappaleen tietoja ID:n avulla. Käytetään findByIdAndUpdate komentoa tähän.
// Jos kappaletta ei löydy tai tulee virhe, lähetetään statuskoodi 400 tai 500.
// Muussa tapauksessa päivtetään kappaleentiedot ja ilmoitetaan siitä statuskoodilla 200
app.put("/api/update/:id", async (req, res) => {
  try {
    const song = await Song.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!song) return res.status(404).json("Song not found");
    res.status(200).json("Song updated");
  } catch (error) {
    res.status(500).json("Error adding song");
  }
});

// Poistetaan kappale ID:n avulla. Käytetään findByIdAndDelete komentoa tähän.
// Jos kappaletta ei löydy tai tulee virhe, lähetetään statuskoodi 400 tai 500.
// Muussa tapauksessa poistetaan kappale ja ilmoitetaan siitä statuskoodilla 200
app.delete("/api/delete/:id", async (req, res) => {
  try {
    const song = await Song.findByIdAndDelete(req.params.id);
    if (!song) {
      return res.status(404).json("Song not found");
    }
    res.status(200).json("Song deleted");
  } catch (error) {
    res.status(500).json("Error deleting song");
  }
});

// Aloitetaan "kuuntelemaan" tiettyä porttia joka on määritelty ohjelman alussa
app.listen(PORT, function () {
  console.log("Kuunnellaan porttia..." + PORT);
});
