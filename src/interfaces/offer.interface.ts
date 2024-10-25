export interface OfferI {
  uid: string;
  name: string;
  email: string;
  description: string;
  cityID: number;
  deliveryTimeID: number;
  currencyID: number;
  warranty: number;
  timeMeasurementID: number;
  support: number;
  budget: number;
  includesIGV: boolean;
  includesDelivery: boolean;
  requerimentID: string;
  stateID: number;
  publishDate: Date;
  deliveryDate: Date;
  userID: string;
  entityID: string;
  canceledByCreator: boolean;
}
