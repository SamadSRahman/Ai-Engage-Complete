import { load } from "@cashfreepayments/cashfree-js";
import axios from 'axios';

export const cashfree = await load({
    mode:"sandbox", //or production
    redirectTarget: "_self" 
});




const API_URL = 'https://v6.exchangerate-api.com/v6/842fc6edbd6854969272ec0d/latest/USD';

export const convertUsdToInr = async (amount) => {
  try {
    const response = await axios.get(API_URL);
    const rate = response.data.conversion_rates.INR;
    return amount * rate;
  } catch (error) {
    console.error("Error fetching exchange rate", error);
    return null;
  }
};
