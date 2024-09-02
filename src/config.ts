import dotenv from "dotenv";

dotenv.config();

export const API_URL = process.env.API_URL || "";
export const API_KEY = process.env.API_KEY || "";
export const ORDER_BOOK_URL =
  process.env.ORDER_BOOK_URL || "ws://localhost:8080/order-book";
export const SPREAD = parseFloat(process.env.SPREAD || "0.01"); // Örnek spread değeri
export const TRADE_AMOUNT = parseFloat(process.env.TRADE_AMOUNT || "0.1"); // Örnek işlem miktarı
export const MIN_ORDER_SIZE = 0.01; // Minimum order büyüklüğü 0.01
