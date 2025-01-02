export interface Tasinmaz {
    id: number;
    ada: string;
    parsel: string;
    nitelik: string;
    adres: string;
    koordinat: string;
    mahalleId: number;
    mahalle: { 
      // Add properties of Mahalle here if needed
    };
  }