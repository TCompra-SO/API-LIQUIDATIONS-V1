export interface RequerimentI {
  uid: string;
  name: string;
  description: string;
  categoryID: number;
  cityID: number;
  budget: number;
  currencyID: number;
  payment_methodID: number;
  completion_date: Date;
  submission_dateID: number;
  state_article: number;
  allowed_bidersID: number[];
  userID: string;
  subUserEmail: string;
  entityID: string;
  email: string;
  publish_date: Date;
  stateID: number;
  number_offers: number;
  images: string[];
  files: string[];
  winOffer: WinOfferI;
  valid: boolean;
}

export interface WinOfferI {
  uid: string;
  observation: string;
}
