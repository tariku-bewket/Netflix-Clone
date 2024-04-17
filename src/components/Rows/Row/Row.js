import React, { useEffect, useState } from 'react';
import './row.css';
import axios from '../../../utils/axios';
import movieTrailer from 'movie-trailer';
import YouTube from 'react-youtube';

const Row = ({ title, fetchUrl, isLargeRow }) => {
  const [movies, setMovies] = useState([]);
  const [trailerUrl, setTrailerUrl] = useState('');

  const base_url = 'https://image.tmdb.org/t/p/original';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const request = await axios.get(fetchUrl);
        setMovies(request.data.results);
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    };
    fetchData();
  }, [fetchUrl]);

  const handleClick = async (movie) => {
    try {
      if (trailerUrl) {
        setTrailerUrl('');
      } else {
        const url = await movieTrailer(
          movie?.title || movie?.name || movie?.original_name
        );
        const urlParams = new URLSearchParams(new URL(url)?.search);
        setTrailerUrl(urlParams.get('v'));
      }
    } catch (error) {
      console.error('Error fetching trailer:', error);
    }
  };

  const opts = {
    height: '390',
    width: '100%',
    playerVars: {
      autoplay: 1,
      origin: 'http://localhost:3000',
    },
  };

  return (
    <div className="row">
      <h1>{title}</h1>
      <div className="row__posters">
        {movies?.map((movie) => (
          <img
            onClick={() => handleClick(movie)}
            key={movie.id} // * Use a unique identifier as key
            src={`${base_url}${
              isLargeRow ? movie.poster_path : movie.backdrop_path
            }`}
            alt={movie.name}
            className={`row__poster ${isLargeRow && 'row__posterLarge'}`}
          />
        ))}
      </div>

      <div style={{ padding: '40px' }}>
        {trailerUrl && <YouTube videoId={trailerUrl} opts={opts} />}
      </div>
    </div>
  );
};

export default Row;
