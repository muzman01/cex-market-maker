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
