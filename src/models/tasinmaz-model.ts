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
  userId?: number;
}
export interface Mahalle {
  id?: number;
  mahalleAdi: string;
  ilceId: number;
  ilce?: Ilce;
}
export interface Ilce {
  id?: number;
  ilceAdi: string;
  ilId: number;
  il?: Il;
}
export interface Il {
  id?: number;
  ilAdi: string;
}
