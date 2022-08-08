import { IVendor } from "./vendor.interface";

/**
 * Interface model of Product object
 */
export interface IProduct {
  id?: string;
  google_product_id?: string;
  gtin?: string; //Global Trade Item Number (GTIN); May be upc, ean, jan,isbn,itf-14
  name?: string;
  category?: string;
  brand?: string;
  partNumbers?: string;
  imageUrl?: string;
  price?: number;
  rating?: number;
  totalReviews?: number;
  isLeasable?: boolean;
  vendors?: IVendor[];
}
