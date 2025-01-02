export interface Tasinmaz {
    id?: number;
    ada: string;
    parsel: string;
    nitelik: string;
    adres: string;
    koordinat: string;
    mahalleId: number;
    mahalle?: Mahalle;
    selected?: boolean;
  }
  export interface Mahalle {
    id?: number;
    ad: string;
    ilceId: number; 
    ilce?: Ilce;
  }
  export interface Ilce {
    id?: number;
    ad: string;
    ilId: number;
    il?: Il;
  } 
  export interface Il {
    id?: number;
    ad: string;
  }