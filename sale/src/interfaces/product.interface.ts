export interface IProduct {
  ProductId: number;
  Id: string;
  CategoryId: number;
  SubCategoryId: number;
  Price: number;
  TaxIncluded: number;
  TaxRate: number;
  GroupId: number;
  Name: string;
  OnlinePrice: number;
  ShortDescription: null | string;
  LongDescription: null | string;
  TypeGroup: number;
  SupplierId: number;
  SupplierName: string;
  ImageURL: null | string;
  Color: Color;
  Size: Size;
  ManufacturerId: null | string;
}

export interface Size {
  Id: number;
  Name: string;
}

export interface Color {
  Id: number;
  Name: string;
}
