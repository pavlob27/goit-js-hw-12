import axios from 'axios';

const BASE_URL= "https://pixabay.com/api/";
const API_KEY = "58534309-d92a2dde2d4e6e1a18c9d9222";

export function getImagesByQuery(query){
    return axios.get(BASE_URL, {
        params: {
            key: API_KEY,
            q: query,
            image_type: 'photo',
            orientation: 'horizontal',
            safesearch: true
        }
    }).then(res => {return res.data;});
};