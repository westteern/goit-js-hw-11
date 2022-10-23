import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const KEY = '30721488-ec9ca19b7cca22464bcdf3786';

export default async function fetchPhotos(userInput, pageNumber) {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        key: KEY,
        q: userInput,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: 'true',
        page: `${pageNumber}`,
        per_page: '40',
      },
    });
    return await response.data;
  } catch (error) {
    console.log(error);
  }
}
