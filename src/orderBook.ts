import { SPREAD, MIN_ORDER_SIZE } from "./config"; // SPREAD ve MIN_ORDER_SIZE, konfigürasyondan alınır

interface Order {
  ordType: string; // 'LIMIT' veya 'MARKET' olabilir
  price: number; // Fiyat
  sz: number; // Miktar
  _id?: string; // Sipariş ID'si, opsiyonel
}

interface OrderBook {
  buyBook: Order[];
  sellBook: Order[];
}

export class OrderBookManager {
  private orderBook: OrderBook;

  constructor() {
    this.orderBook = { buyBook: [], sellBook: [] };
  }

  updateOrderBook(newOrderBook: OrderBook): void {
    this.orderBook = newOrderBook;
  }

  getBestBid(): Order | undefined {
    return this.orderBook.buyBook
      .filter((order) => order.sz >= MIN_ORDER_SIZE)
      .reduce((bestBid, currentOrder) => {
        return !bestBid || currentOrder.price > bestBid.price
          ? currentOrder
          : bestBid;
      }, undefined as Order | undefined);
  }

  getBestAsk(): Order | undefined {
    return this.orderBook.sellBook
      .filter((order) => order.sz >= MIN_ORDER_SIZE)
      .reduce((bestAsk, currentOrder) => {
        return !bestAsk || currentOrder.price < bestAsk.price
          ? currentOrder
          : bestAsk;
      }, undefined as Order | undefined);
  }

  // En az bir kitap doluysa emir açacak olan fonksiyon
  placeOrder(): void {
    const bestBid = this.getBestBid();
    const bestAsk = this.getBestAsk();

    // Eğer buyBook veya sellBook'ta en az bir emir varsa emir açılacak
    if (bestBid || bestAsk) {
      let orderPrice: number;
      let orderSize: number;

      if (bestBid && bestAsk) {
        // Hem buyBook hem de sellBook doluysa, orta bir fiyat belirle
        orderPrice = (bestBid.price + bestAsk.price) / 2;
        orderSize = Math.min(bestBid.sz, bestAsk.sz);
      } else if (bestBid) {
        // Sadece buyBook doluysa, buyBook'taki en iyi alış fiyatına yakın bir fiyat belirle
        orderPrice = bestBid.price + 0.01; // Biraz yüksek fiyatla
        orderSize = bestBid.sz; // En iyi alış emrinin miktarı
      } else if (bestAsk) {
        // Sadece sellBook doluysa, sellBook'taki en iyi satış fiyatına yakın bir fiyat belirle
        orderPrice = bestAsk.price - 0.01; // Biraz düşük fiyatla
        orderSize = bestAsk.sz; // En iyi satış emrinin miktarı
      } else {
        // Eğer ne buyBook ne de sellBook doluysa (oldukça nadir bir durum), işlem yapılmayacak
        console.log("Eşleştirilebilecek uygun emir bulunamadı.");
        return;
      }

      console.log(
        `Yeni order açılıyor: Fiyat = ${orderPrice.toFixed(
          2
        )}, Miktar = ${orderSize.toFixed(2)}`
      );
      // Burada API çağrısı veya başka bir işlemle emir açabilirsiniz.
    } else {
      console.log("Eşleştirilebilecek uygun emir bulunamadı.");
    }
  }
}
