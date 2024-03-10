const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const uuid = require("uuid");


// Define schema for business listings
const listingSchema = new Schema({
  name: { type: String, unique: true, required: true },
  owner: { type: String, required: true },
  phone: { type: String, required: true },
  city: { type: String, required: true },
  address: { type: String, required: true },
  images: { type: [String]}, // Assuming images are stored as URLs
  reviews: [{ user: String, rating: Number, comment: String, createdAt: { type: Date, default: Date.now }, updatedAt: { type: Date, default: Date.now }, reply: { user: String, comment: String} }]
});

module.exports = mongoose.model("Listing", listingSchema);