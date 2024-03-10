const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const roles = require("../roles");

const userSchema = new Schema({
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    role: { type: String, required: true, validate: { validator: validateRole } },
    createdDate: { type: Date, default: Date.now },
});

/**
 * Validates the given role.
 *
 * @param {any} role - The role to be validated
 * @return {boolean} Whether the role is valid
 */
function validateRole(role) {
    return Object.values(roles).includes(role);
}

module.exports = mongoose.model("User", userSchema);
