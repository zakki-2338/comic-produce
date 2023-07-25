import axios from 'axios';

export const getComics = async () => {
  const { data } = await axios.get('/comics');
  return data;
};

// eslint-disable-next-line
export const postComic = (title, author, trial_read_url, recommendation, popularity, genre, quote, comicImage, frameImage) => axios.post('/comics', { title, author, trial_read_url, recommendation, popularity, genre, quote, comicImage, frameImage });
