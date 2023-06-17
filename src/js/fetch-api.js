import axios from 'axios';

const fetchGallery = async (page, search) => {
  const KEY_API = '34362001-d5ec89d1d84675fe0e9033f4a';

  const res = await axios.get(
    `https://pixabay.com/api/?q=${search}&page=${page}&key=${KEY_API}&image_type=photo&orientation=horizontal&per_page=40`
  );
  return res.data;
};

export default { fetchGallery };
