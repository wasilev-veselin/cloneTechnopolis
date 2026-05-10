// Typed spec interfaces per product category.
// ProductSpec[] in ProductDetailsModel covers generic display (SpecsTable);
// CategorySpecs adds compile-time safety for business logic and filtering.

export interface PhoneSpecs {
  batteryCapacity?: number;   // mAh
  screenSize?: number;        // inches
  ram?: number;               // GB
  storage?: number;           // GB
  cameraResolution?: number;  // MP
  os?: string;                // e.g. 'Android', 'iOS'
  refreshRate?: number;       // Hz
  chargingSpeed?: number;     // W
}

export interface LaptopSpecs {
  ram?: number;               // GB
  storage?: number;           // GB
  storageType?: string;       // e.g. 'SSD', 'HDD'
  screenSize?: number;        // inches
  processorBrand?: string;    // e.g. 'Intel', 'AMD', 'Apple'
  processorModel?: string;
  graphicsCard?: string;
  batteryLife?: number;       // hours
}

export interface WashingMachineSpecs {
  maxRpm?: number;            // ob./min
  loadCapacity?: number;      // kg
  energyClass?: string;       // e.g. 'A+++', 'A++'
  programCount?: number;
  noiseLevel?: number;        // dB
  installationType?: string;  // 'freestanding' | 'builtin'
}

export interface RefrigeratorSpecs {
  totalVolume?: number;       // L
  fridgeVolume?: number;      // L
  freezerVolume?: number;     // L
  energyClass?: string;
  noiseLevel?: number;        // dB
  height?: number;            // cm
  frostFree?: boolean;
}

export interface TelevisionSpecs {
  screenSize?: number;        // inches
  resolution?: string;        // e.g. '4K', 'Full HD'
  panelType?: string;         // e.g. 'OLED', 'QLED', 'LED'
  refreshRate?: number;       // Hz
  hdrSupport?: string[];      // e.g. ['HDR10', 'Dolby Vision']
  smartTv?: boolean;
  os?: string;                // e.g. 'webOS', 'Tizen', 'Android TV'
}

export type CategorySpecs =
  | { category: 'phones'; specs: PhoneSpecs }
  | { category: 'laptops'; specs: LaptopSpecs }
  | { category: 'washing-machines'; specs: WashingMachineSpecs }
  | { category: 'refrigerators'; specs: RefrigeratorSpecs }
  | { category: 'televisions'; specs: TelevisionSpecs }
  | { category: string; specs: Record<string, unknown> };
