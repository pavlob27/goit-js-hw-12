import axios from 'axios';

export const PAGE_SIZE = 15;
const BASE_URL= "https://pixabay.com/api/";
const API_KEY = "58534309-d92a2dde2d4e6e1a18c9d9222";

export async function getImagesByQuery(query, page){
    const res = await axios.get(BASE_URL, {
        params: {
            key: API_KEY,
            q: query,
            image_type: 'photo',
            orientation: 'horizontal',
            safesearch: true,
            per_page: PAGE_SIZE,
            page: page
        }
    })
    return res.data;
};