/**
 * fetchModel - Fetch a model from the web server.
 *
 * @param {string} url      The URL to issue the GET request.
 *
 */
import axios from 'axios'

async function fetchModel(url) {
  try {
    const response = await axios.get(url)
    return response.data
  } catch (error) {
    console.error('Failed to fetch model data using axios:', error)
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Error data:', error.response.data)
      console.error('Error status:', error.response.status)
      console.error('Error headers:', error.response.headers)
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Error request:', error.request)
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error message:', error.message)
    }
    return null
  }
}

export default fetchModel
