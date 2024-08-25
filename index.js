const axios = require('axios');

async function refreshPage() {
  try {
    const response = await axios.get('(link unavailable)'); // Replace with the URL you want to refresh
    console.log('Page refreshed successfully!');
  } catch (error) {
    console.error('Error refreshing page:', error);
  }
}

setInterval(refreshPage, 60000); // Refresh every 1 minute (60000ms)
