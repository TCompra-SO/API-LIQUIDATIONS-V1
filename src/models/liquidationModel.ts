import mongoose, { Schema } from "mongoose";
import { RequerimentI } from "../interfaces/requeriment.interface";

import ShortUniqueId from "short-unique-id";
import { string } from "joi";

const uid = new ShortUniqueId({ length: 20 });

const LiquidationSchema = new Schema<RequerimentI>(
  {
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
    description: {
      type: String,
      required: true,
    },
    categoryID: {
      type: Number,
      required: true,
    },
    cityID: {
      type: Number,
      required: true,
    },
    budget: {
      type: Number,
      required: true,
    },
    currencyID: {
      type: Number,
      required: true,
    },
    payment_methodID: {
      type: Number,
      required: true,
    },
    completion_date: {
      type: Date,
      required: true,
    },
    submission_dateID: {
      type: Number,
      required: true,
    },
    state_article: {
      type: Number,
      required: false,
    },
    allowed_bidersID: {
      type: [Number],
      required: true,
    },
    entityID: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    userID: {
      type: String,
      required: true,
    },
    subUserEmail: {
      type: String,
      required: false,
    },
    publish_date: {
      type: Date,
      required: true,
      index: true,
    },
    stateID: {
      type: Number,
      required: true,
    },
    number_offers: {
      type: Number,
      required: true,
    },
    images: {
      type: [String],
      required: false,
    },
    files: {
      type: [String],
      required: false,
    },
    winOffer: {
      type: Object,
      required: false,
    },
    valid: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const LiquidationModel = mongoose.model<RequerimentI>(
  "Liquidations",
  LiquidationSchema
);
export default LiquidationModel;
