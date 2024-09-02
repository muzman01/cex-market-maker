import axios from "axios";
import WebSocket from "ws"; // WebSocket modülünü ekliyoruz
import { ORDER_BOOK_URL, TRADE_AMOUNT } from "./config";
import { OrderBookManager } from "./orderBook";

const orderBookManager = new OrderBookManager();

// WebSocket bağlantısını başlat
const ws = new WebSocket(ORDER_BOOK_URL);

// WebSocket mesajı alındığında çalışacak işlev
ws.on("message", (data) => {
  try {
    const message = JSON.parse(data.toString());
    if (message.message === "order-book" && message.orderData) {
      // OrderBookManager'ı gelen order verisiyle güncelle
      orderBookManager.updateOrderBook({
        buyBook: message.orderData.buyBook.map((order: any) => ({
          ordType: order.ordType,
          price: parseFloat(order.px),
          sz: parseFloat(order.sz),
          _id: order._id,
        })),
        sellBook: message.orderData.sellBook.map((order: any) => ({
          ordType: order.ordType,
          price: parseFloat(order.px),
          sz: parseFloat(order.sz),
          _id: order._id,
        })),
      });
      console.log("Order book güncellendi.");
    }
  } catch (error) {
    console.error("WebSocket mesajı işlenirken hata:", error);
  }
});

// Order yerleştirme işlevi
async function placeOrder(side: "buy" | "sell", price: number, amount: number) {
  try {
    // const response = await axios.post(
    //   `${API_URL}/order`,
    //   {
    //     side,
    //     price,
    //     amount,
    //   },
    //   {
    //     headers: { Authorization: `Bearer ${API_KEY}` },
    //   }
    // );
    console.log(`Emir yerleştirildi: ${side} ${amount} @ ${price}`);
  } catch (error) {
    console.error("Emir yerleştirilemedi:", error);
  }
}

// Order book'u dengeleme işlevi
async function balanceOrderBook() {
  // OrderBookManager'ın içeriğini okunabilir şekilde yazdır
  console.log(
    "OrderBookManager içeriği:",
    JSON.stringify(orderBookManager, null, 2)
  );

  if (orderBookManager) {
    const bestBid = orderBookManager.getBestBid();
    const bestAsk = orderBookManager.getBestAsk();

    // En iyi alış ve satış emirlerini daha ayrıntılı şekilde yazdır
    console.log(
      "En iyi Alış Emri (Best Bid):",
      JSON.stringify(bestBid, null, 2)
    );
    console.log(
      "En iyi Satış Emri (Best Ask):",
      JSON.stringify(bestAsk, null, 2)
    );

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

// Periodik olarak order book'u dengelemeyi dene
setInterval(balanceOrderBook, 5000); // Her 5 saniyede bir order book dengele
