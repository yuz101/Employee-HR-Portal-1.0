const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const refType = Schema.Types.ObjectId;

const HouseSchema = new Schema({
  address: {
    streetName: { type: String },
    buildingNumber: { type: String },
    city: { required: true, type: String },
    state: { required: true, type: String },
    zip: { required: true, type: String },
  },
  landlord: {
    fullName: {
      required: true,
      type: String,
    },
    phoneNumber: {
      required: true,
      type: String,
    },
    email: {
      required: true,
      type: String,
    },
  },
  facility: {
    beds: {
      required: true,
      type: Number,
    },
    mattresses: {
      required: true,
      type: Number,
    },
    tables: {
      required: true,
      type: Number,
    },
    chairs: {
      required: true,
      type: Number,
    },
  },
  residents: {
    type: Number,
    default: 0,
  },
  roommates: [{ type: refType, ref: "Employee" }],
  reports: [{ type: refType, ref: "FacilityReport" }],
});

HouseSchema.pre("save", function (next) {
  if (this.roommates && this.roommates.length > 0) {
    this.residents = this.roommates.length;
  }
  next();
});
const House = mongoose.model("House", HouseSchema);
module.exports = House;
