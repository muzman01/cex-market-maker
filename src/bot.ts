import axios from "axios";
import { API_URL, API_KEY, TRADE_AMOUNT } from "./config";
import { OrderBookManager } from "./orderBook";

const orderBookManager = new OrderBookManager();

async function fetchOrderBook() {
  try {
    const response = await axios.get(`${API_URL}/orderbook`, {
      headers: { Authorization: `Bearer ${API_KEY}` },
    });
    orderBookManager.updateOrderBook(response.data);
  } catch (error) {
    console.error("Order book alınamadı:", error);
  }
}

async function placeOrder(side: "buy" | "sell", price: number, amount: number) {
  try {
    const response = await axios.post(
      `${API_URL}/order`,
      {
        side,
        price,
        amount,
      },
      {
        headers: { Authorization: `Bearer ${API_KEY}` },
      }
    );
    console.log(`Emir yerleştirildi: ${side} ${amount} @ ${price}`);
  } catch (error) {
    console.error("Emir yerleştirilemedi:", error);
  }
}

async function balanceOrderBook() {
  await fetchOrderBook();
  if (orderBookManager.isSpreadAcceptable()) {
    const bestBid = orderBookManager.getBestBid();
    const bestAsk = orderBookManager.getBestAsk();

    if (bestBid && bestAsk) {
      const buyPrice = bestBid.price + 0.01; // Küçük bir fark ekleniyor
      const sellPrice = bestAsk.price - 0.01; // Küçük bir fark ekleniyor

      await placeOrder("buy", buyPrice, TRADE_AMOUNT);
      await placeOrder("sell", sellPrice, TRADE_AMOUNT);
    }
  } else {
    console.log("Spread kabul edilebilir değil, dengelemeye gerek yok.");
  }
}

setInterval(balanceOrderBook, 5000); // Her 5 saniyede bir order book dengele
