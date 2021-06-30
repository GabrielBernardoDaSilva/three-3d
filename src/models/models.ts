export interface IBay {
    BayID: number;
    BayLabel: string;
    PointX: number;
    PointY: number;
    PointZ: number;
    SizeX: number;
    SizeY: number;
    SizeZ: number;
    CustomerID: string;
    CustomerName: string;
    BayWeight: number;
    PalletTypeID: number;
    PalletBaseID: string;
    PrintFormat: number;
    BayReference: string;
    AllReturnable: false;
    HeightOfProductsAndBase: number;
  }
  
  export interface IChestDimension {
    chestSizeX: number;
    chestSizeY: number;
    chestSizeZ: number;
  }
  
  export interface ITLoadPalletXYZ {
    PalletXyzId: number;
    LocationId: string;
    TripNumber: number;
    BayId: number;
    PositionId: number;
    ObjectType: number;
    PositionX: number;
    PositionY: number;
    PositionZ: number;
    SizeX: number;
    SizeY: number;
    SizeZ: number;
    Shape: number;
    ProductId: string;
    Quantity: number;
  }
  
  export interface IPalletCaseXYZ {
    BayId: number;
    TLoadPalletXYZ: ITLoadPalletXYZ;
    LargerSideImage: string;
    SmallerSideImage: string;
    TopImage: string;
    PackageLargerSide: number;
    PackageSmallerSide: number;
    PackageHeight: number;
  }
  