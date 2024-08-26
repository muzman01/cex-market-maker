import { SPREAD } from "./config";

interface Order {
  price: number;
  amount: number;
}

interface OrderBook {
  bids: Order[];
  asks: Order[];
}

export class OrderBookManager {
  private orderBook: OrderBook;

  constructor() {
    this.orderBook = { bids: [], asks: [] };
  }

  updateOrderBook(newOrderBook: OrderBook): void {
    this.orderBook = newOrderBook;
  }

  getBestBid(): Order | undefined {
    return this.orderBook.bids[0];
  }

  getBestAsk(): Order | undefined {
    return this.orderBook.asks[0];
  }

  isSpreadAcceptable(): boolean {
    const bestBid = this.getBestBid();
    const bestAsk = this.getBestAsk();
    if (!bestBid || !bestAsk) return false;

    const spread = (bestAsk.price - bestBid.price) / bestAsk.price;
    return spread > SPREAD;
  }
}
