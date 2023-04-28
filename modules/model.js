var mongoose = require("mongoose");

//Luodaan Mongoose Schema. Vähän kuin olio joka sisältää eri tietoja ja määritellään tietojen tyypit
const SongSchema = new mongoose.Schema({
  id: Number,
  name: String,
  artist: String,
  playcount: Number,
});

module.exports = mongoose.model("Song", SongSchema, "songs");
