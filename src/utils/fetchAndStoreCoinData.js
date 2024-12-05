// src/utils/fetchAndStoreCoinData.js
import CoinGeckoManager from '../services/CoinGeckoManager.js';
import Coin from '../models/Coin.js';

const fetchAndStoreCoinData = async () => {
    try {
        console.log('Fetching top 100 coins from CoinGecko...');
        const coins = await CoinGeckoManager.getTop100Coins();
        console.log('Fetched top 100 coins from CoinGecko:', coins[0]);
        for (const coinData of coins) {
            await Coin.upsert({
                id: coinData.id,
                symbol: coinData.symbol,
                name: coinData.name,
                image: coinData.image,
                current_price: coinData.current_price,
                market_cap: coinData.market_cap,
                market_cap_rank: coinData.market_cap_rank,
                fully_diluted_valuation: coinData.fully_diluted_valuation,
                total_volume: coinData.total_volume,
                high_24h: coinData.high_24h,
                low_24h: coinData.low_24h,
                price_change_24h: coinData.price_change_24h,
                price_change_percentage_24h: coinData.price_change_percentage_24h,
                market_cap_change_24h: coinData.market_cap_change_24h,
                market_cap_change_percentage_24h: coinData.market_cap_change_percentage_24h,
                circulating_supply: coinData.circulating_supply,
                total_supply: coinData.total_supply,
                max_supply: coinData.max_supply,
                ath: coinData.ath,
                ath_change_percentage: coinData.ath_change_percentage,
                ath_date: new Date(coinData.ath_date),
                atl: coinData.atl,
                atl_change_percentage: coinData.atl_change_percentage,
                atl_date: new Date(coinData.atl_date),
                last_updated: new Date(coinData.last_updated),
                currency: 'usd'
            });
            break;
        }
        console.log('Coin data updated successfully.');
    } catch (error) {
        console.error('Error updating coin data:', error);
    }
};

export default fetchAndStoreCoinData;


fetchAndStoreCoinData();
