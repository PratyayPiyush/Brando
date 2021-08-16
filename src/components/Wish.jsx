import React, { useState, useEffect } from "react";
import { BsFillBookmarksFill } from "react-icons/bs";
import { FiArrowRight } from "react-icons/fi";
import { Link } from "react-router-dom";
import MovieService from "../Services/MovieService";

const Wish = ({ _id, tmdbId, setToWatch }) => {
  const [flim, setFlim] = useState([]);

  const [loaded, setLoaded] = useState(false);

  const [image, setImage] = useState("");
  const [backdrop, setBackdrop] = useState("");
  const [genre, setGenre] = useState([]);

  const poster = "http://image.tmdb.org/t/p/w154/";

  // const noImage =
  //   "https://upload.wikimedia.org/wikipedia/commons/f/fc/No_picture_available.png";

  useEffect(() => {
    const fetchMovie = async () => {
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/${tmdbId}?api_key=${process.env.REACT_APP_API_KEY}`
      );
      const data = await res.json();
      // console.log(data);
      const image_path = data.poster_path ? poster + data.poster_path : "";
      const backdrop_path = data.backdrop_path
        ? poster + data.backdrop_path
        : "";
      setBackdrop(backdrop_path);

      const gen = data.genres.map((genre) => genre.name);
      setGenre(gen);

      setImage(image_path);
      setLoaded(true);
      return data;
    };

    const getMovie = async () => {
      const movieFromServer = await fetchMovie();
      setFlim(movieFromServer);
    };

    getMovie();
  }, [tmdbId]);

  const minToHrs = (minutes) => {
    let hour = Math.floor(minutes / 60);
    let seconds = minutes - 60 * hour;

    return `${hour}hr ${seconds}min`;
  };

  const BackDrop_Path = "http://image.tmdb.org/t/p/w1280//";
  // Styling

  const bgImage = {
    backgroundImage: `url(${BackDrop_Path + backdrop})`,
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
  };

  const { id, title, overview, vote_average: rating, runtime } = flim;

  const handleRemoveFromWishList = () => {
    MovieService.deleteWish(_id).then((data) => {
      if (data.done) {
        setToWatch((towatch) => towatch.filter((wish) => wish._id !== _id));
      } else {
        alert(data.error);
      }
    });
  };

  return (
    <>
      {loaded ? (
        <>
          <div className="movie_card" style={bgImage}>
            <div className="info_section">
              <div className="movie_header">
                <img className="locandina" src={image} alt="Movie" />
                <h1>{title}</h1>
                <h4>
                  {/* flim.release_date.split("-")[0] */}
                  Rating: {rating}, {flim.release_date}
                </h4>
                <span className="minutes">{minToHrs(runtime)}</span>
                <p className="type">
                  {genre.map((gen, indx) => (
                    // eslint-disable-next-line eqeqeq
                    <>{indx == genre.length - 1 ? gen : gen + ", "}</>
                  ))}
                </p>
              </div>
              <div className="movie_desc">
                <p className="text">{overview}</p>
              </div>
              <div className="movie_social">
                <ul>
                  <li>
                    <Link
                      to={`/movies/${id}/#Movie`}
                      className=" ml-auto hover:text-blue-500 hover:underline"
                    >
                      Show more <FiArrowRight className=" inline-flex" />
                    </Link>
                  </li>
                  <li>
                    <BsFillBookmarksFill
                      style={{ cursor: "pointer" }}
                      onClick={handleRemoveFromWishList}
                    />
                  </li>
                </ul>
              </div>
            </div>
            <div className="blur_back bright_back" />
          </div>
        </>
      ) : (
        <div className="w-full flex items-center flex-col">
          <div className="flex bg-white shadow-md p-4 rounded-md mb-4">
            <div
              data-placeholder
              className="mr-2 h-20 w-20 rounded-full overflow-hidden relative bg-gray-200"
            ></div>
            <div className="flex flex-col justify-between">
              <div
                data-placeholder
                className="mb-2 h-5 w-40 overflow-hidden relative bg-gray-200"
              ></div>
              <div
                data-placeholder
                className="h-10 w-40 overflow-hidden relative bg-gray-200"
              ></div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Wish;
