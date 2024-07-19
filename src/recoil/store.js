import { atom } from 'recoil';

export const selectedProductAtom = atom({
  key: 'selectedProduct',
  default:'',
});

export const selectedPriceAtom = atom({
  key: 'selectedPrice',
  default: null,
});