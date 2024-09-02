# Market Making Bot

This is a Market Making Bot implemented using TypeScript, designed to balance the order book for a cryptocurrency exchange. The bot aims to manage spread, provide liquidity, handle volatility, and balance the order book.

## Features

1. **Spread Management**: The bot ensures that the spread between buy and sell orders stays within a specified range.
2. **Liquidity Provision**: The bot places buy and sell orders to maintain liquidity within the order book.
3. **Volatility Handling**: The bot monitors market volatility and can place orders to counteract sudden price movements.
4. **Order Book Balancing**: The bot continuously monitors the order book and places orders to balance it.

## Project Structure

```plaintext
market-making-bot/
│
├── src/
│   ├── bot.ts           # Main bot logic
│   ├── config.ts        # Configuration and environment variables
│   └── orderBook.ts     # Order book management and balancing logic
│
├── .env                 # Environment configuration file
├── tsconfig.json        # TypeScript configuration
└── package.json         # Project dependencies and scripts

```

## Order Book Management

The core of the market-making bot's functionality revolves around managing and balancing the order book. This is handled primarily through the `OrderBookManager` class located in `orderBook.ts`. Below is an explanation of how the order book management and the key functions operate:

### OrderBookManager Class

The `OrderBookManager` class is responsible for managing the state of the order book and making decisions based on the current buy and sell orders. It includes methods to update the order book, find the best bid and ask prices, and place orders.

#### Key Methods

1. **`updateOrderBook(newOrderBook: OrderBook): void`**: Updates the internal state of the order book with new buy and sell orders. This method is called whenever new order data is received.

2. **`getBestBid(): Order | undefined`**: Finds and returns the highest bid (buy order) in the order book. This method uses the following logic:

   - It filters out orders that do not meet a minimum size requirement (`MIN_ORDER_SIZE`).
   - It uses the `reduce` function to iterate through the filtered buy orders and selects the order with the highest price.
   - The `reduce` function compares each current order with the best bid found so far. If the current order's price is higher, it becomes the new best bid.

   Example logic for selecting the best bid:

   ```typescript
   getBestBid(): Order | undefined {
     return this.orderBook.buyBook
       .filter(order => order.sz >= MIN_ORDER_SIZE)
       .reduce((bestBid, currentOrder) => {
         return !bestBid || currentOrder.price > bestBid.price
           ? currentOrder
           : bestBid;
       }, undefined as Order | undefined);
   }
   ```

   - In this logic:
     - `bestBid` represents the highest bid found so far.
     - `currentOrder` represents the current order being checked.
     - The method returns the order with the highest price, which represents the best bid in the buy book.

3. **`getBestAsk(): Order | undefined`**: Finds and returns the lowest ask (sell order) in the order book. This method operates similarly to `getBestBid()` but looks for the lowest price in the `sellBook`.

   Example logic for selecting the best ask:

   ```typescript
   getBestAsk(): Order | undefined {
     return this.orderBook.sellBook
       .filter(order => order.sz >= MIN_ORDER_SIZE)
       .reduce((bestAsk, currentOrder) => {
         return !bestAsk || currentOrder.price < bestAsk.price
           ? currentOrder
           : bestAsk;
       }, undefined as Order | undefined);
   }
   ```

- In this logic:
  - `bestAsk`bestAsk`` represents the lowest ask found so far.
  - `currentOrder` represents the current order being checked.
  - The method returns the order with the lowest price, which represents the best ask in the sell book.

### Example: Finding the Best Bid

Let's say your `buyBook` array is structured as follows:

```json
[
  { "ordType": "LIMIT", "price": 99.5, "sz": 2.5, "_id": "order1" },
  { "ordType": "LIMIT", "price": 98, "sz": 5, "_id": "order2" },
  { "ordType": "LIMIT", "price": 97.75, "sz": 1, "_id": "order3" }
]
```

- Order 1: Limit order with a price of 99.5, size of 2.5, and ID of "order1".
- Order 2: Limit order with a price of 98, size of 5, and ID of "order2".
- Order 3: Limit order with a price of 97.75, size of 1, and ID of "order3".

The `getBestBid()` function will process this `buyBook` to find the highest bid price:

1. **First Iteration**: Initially, `bestBid` is `undefined`. Therefore, the `currentOrder` (with a price of 99.5) becomes the `bestBid`.
2. **Second Iteration**: The `currentOrder` (with a price of 98) is compared with the `bestBid` (with a price of 99.5). Since 99.5 is greater than 98, the `bestBid` remains unchanged.
3. **Third Iteration**: The `currentOrder` (with a price of 97.75) is compared with the `bestBid` (with a price of 99.5). Since 99.5 is greater than 97.75, the `bestBid` remains unchanged.

As a result, the `getBestBid()` function will return the order with a price of 99.5, which is:

- Order 1: Limit order with a price of 99.5, size of 2.5, and ID of "order1".

### Example: Finding the Best Ask

Similarly, consider the following `sellBook` array:

```json
[
  { "ordType": "LIMIT", "price": 100.5, "sz": 3, "_id": "order4" },
  { "ordType": "LIMIT", "price": 101, "sz": 2, "_id": "order5" },
  { "ordType": "LIMIT", "price": 102.25, "sz": 4.5, "_id": "order6" }
]
```

- Order 4: Limit order with a price of 100.5, size of 3, and ID of "order4".
- Order 5: Limit order with a price of 101, size of 2, and ID of "order5".
- Order 6: Limit order with a price of 102.25, size of 4.5, and ID of "order6".

The `getBestAsk()` function will process this `sellBook` to find the lowest ask price:

1. **First Iteration**: Initially, `bestAsk` is `undefined`. Therefore, the `currentOrder` (with a price of 100.5) becomes the `bestAsk`.
2. **Second Iteration**: The `currentOrder` (with a price of 101) is compared with the `bestAsk` (with a price of 100.5). Since 100.5 is less than 101, the `bestAsk` remains unchanged.
3. **Third Iteration**: The `currentOrder` (with a price of 102.25) is compared with the `bestAsk` (with a price of 100.5). Since 100.5 is less than 102.25, the `bestAsk` remains unchanged.

As a result, the `getBestAsk()` function will return the order with a price of 100.5, which is:

- Order 4: Limit order with a price of 100.5, size of 3, and ID of "order4".

These examples illustrate how the `getBestBid()` and `getBestAsk()` functions select the optimal orders to maintain a balanced order book, ensuring that the market-making bot operates efficiently.

```

```
