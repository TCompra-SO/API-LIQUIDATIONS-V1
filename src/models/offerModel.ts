import mongoose, { Schema } from "mongoose";
import ShortUniqueId from "short-unique-id";
import { OfferI } from "../interfaces/offer.interface";

const uid = new ShortUniqueId({ length: 20 });

const OfferSchema = new Schema<OfferI>({
  uid: {
    type: String,
    required: true,
    unique: true,
    default: () => uid.rnd(),
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
  },
  subUserEmail: {
    type: String,
    required: false,
  },
  description: {
    type: String,
    required: false,
    trim: true,
  },
  cityID: {
    type: Number,
    required: true,
  },
  deliveryTimeID: {
    type: Number,
    required: false,
  },
  currencyID: {
    type: Number,
    required: true,
  },
  budget: {
    type: Number,
    required: true,
  },
  includesIGV: {
    type: Boolean,
    required: false,
  },
  requerimentID: {
    type: String,
    required: true,
  },
  stateID: {
    type: Number,
    required: true,
  },
  publishDate: {
    type: Date,
    required: true,
  },
  deliveryDate: {
    type: Date,
    required: false,
  },
  userID: {
    type: String,
    required: true,
  },
  entityID: {
    type: String,
    required: true,
  },
  canceledByCreator: {
    type: Boolean,
    required: false,
  },
  selectionDate: {
    type: Date,
    required: false,
  },
  delivered: {
    type: Boolean,
    required: false,
  },
  review: {
    type: Boolean,
    required: false,
  },
  cancelRated: {
    type: Boolean,
    required: false,
  },
});

// Exportamos el modelo
export const OfferModel = mongoose.model<OfferI>(
  "OffersLiquidations",
  OfferSchema
);
