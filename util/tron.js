const axios = require("axios");

async function fetchTronTransactions(address) {

  const apiUrl = `https://apilist.tronscanapi.com/api/filter/trc20/transfers?limit=20&start=0&sort=-timestamp&count=true&filterTokenValue=0&relatedAddress=${address}`; // Tron API URL

  const response = await axios.get(apiUrl);
  if (response.status !== 200) {
    throw new Error(`请求失败: ${response.status}`);
  }
  // console.log(response.data);
  const data = response.data;
  return data.token_transfers;
}


export { fetchTronTransactions };