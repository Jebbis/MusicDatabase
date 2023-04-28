var mongoose = require("mongoose");

const SongSchema = new mongoose.Schema({
  id: Number,
  name: String,
  artist: String,
  playcount: Number,
});

module.exports = mongoose.model("Song", SongSchema, "songs");
