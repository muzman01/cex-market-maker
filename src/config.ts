import dotenv from "dotenv";

dotenv.config();

export const API_URL = process.env.API_URL || "";
export const API_KEY = process.env.API_KEY || "";
export const SPREAD = parseFloat(process.env.SPREAD || "0.01"); // Örnek spread değeri
export const TRADE_AMOUNT = parseFloat(process.env.TRADE_AMOUNT || "0.1"); // Örnek işlem miktarı
