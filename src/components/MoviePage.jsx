import React, { useState, useEffect } from "react";
import Tag from "./Tag";
import Actor from "./Actor";
import Movies from "./Movies";
import Search from "./Search";

const poster = "http://image.tmdb.org/t/p/w154/";

const MoviePage = (props) => {
  const id = props.match.params.id;

  const [data, setData] = useState([]);

  const [image, setImage] = useState("");

  const [genre, setGenre] = useState([]);

  const [trailer, settrailer] = useState("");

  const [cast, setCast] = useState([]);

  const [similar, setSimilar] = useState([]);

  const [crew, setCrew] = useState([]);

  const [loaded, isLoaded] = useState(false);

  const noImage =
    "https://upload.wikimedia.org/wikipedia/commons/f/fc/No_picture_available.png";

  const youtube = "https://www.youtube.com/embed/";

  useEffect(() => {
    fetch(
      `https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.REACT_APP_API_KEY}`
    )
      .then((res) => res.json())
      .then((data) => {
        // console.log(data)
        setData(data);
        // setName(data.original_title)
        // setDescription(data.overview)
        setGenre(data.genres);
        const image_path = data.poster_path ? poster + data.poster_path : "";
        setImage(image_path);
        isLoaded(true);
      });

    fetch(
      `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${process.env.REACT_APP_API_KEY}`
    )
      .then((res) => res.json())
      .then((data) => {
        // List of all videos data.results
        //https://youtu.be/data.results[0].key
        if (data.results) {
          if (data.results[0]) {
            if (data.results[0].key != null) {
              settrailer(youtube + data.results[0].key);
            }
          } else {
            return;
          }
        } else {
          return;
        }
      });

    // /movie/{movie_id}/credits

    fetch(
      `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${process.env.REACT_APP_API_KEY}`
    )
      .then((res) => res.json())
      .then((data) => {
        setCrew(data.crew.filter((crew) => crew.job == "Director"));
        if (data.cast) {
          setCast(data.cast);
        } else {
          return;
        }
      });

    // /movie/{movie_id}/similar

    fetch(
      `https://api.themoviedb.org/3/movie/${id}/similar?api_key=${process.env.REACT_APP_API_KEY}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.results) {
          setSimilar(data.results);
        } else {
          return;
        }
      });
  }, [id]);

  const {
    original_title,
    title,
    overview,
    release_date,
    tagline,
    vote_average,
    runtime,
  } = data;

  let tag = tagline ? tagline : "None";

  //let genre = genres.map(gen => gen.name)
  const BackDrop_Path = "http://image.tmdb.org/t/p/w1280//";

  // Styling

  const bgImage = {
    backgroundImage: `url(${BackDrop_Path + data.backdrop_path})`,
    backgroundSize: "contain",
    backgroundRepeat: "no-repeat",
  };

  const minToHrs = (minutes) => {
    let hour = Math.floor(minutes / 60);
    let seconds = minutes - 60 * hour;

    return `${hour}hr ${seconds}min`;
  };

  return (
    <>
      {loaded ? (
        original_title == "" ? (
          <div className="loading"></div>
        ) : (
          <div>
            <div className="MovieWrapper" id="Movie" style={bgImage}>
              <div className="flex-col">
                <div className="MovieInfo">
                  <img
                    src={image == "" ? noImage : image}
                    className={image == "" ? "noImage" : ""}
                    alt={data.title}
                  />
                  <div>
                    <div className="sm:flex sm:justify-between">
                      <h2 className="font-bold text-2xl">
                        {title}{" "}
                        {release_date ? (
                          <span>({release_date.split("-")[0]})</span>
                        ) : (
                          ""
                        )}
                      </h2>
                      {genre
                        ? genre.map((gen, index) => (
                            <Tag key={index} genre={gen.name} />
                          ))
                        : null}
                    </div>

                    <h3>
                      Director:{" "}
                      {crew.map((crw, index) => (
                        <span className="pl-1">
                          {crw.name}
                          {index == crew.length - 1 ? null : ","}
                        </span>
                      ))}
                    </h3>
                    <h3>Rating: {vote_average}</h3>
                    {/* <h3>Date of Release: {release_date}</h3> */}
                    <h3>Run Time: {minToHrs(runtime)}</h3>
                    <h4>Plot</h4>
                    <hr />
                    <p>{overview}</p>
                    <h4>Tag Line</h4>
                    <hr />
                    <p>{tag}</p>
                    <h4 className="font-bold text-xl">Trailer</h4>
                    <hr />
                    {/* <p> {isAuthenticated ? 'Your Rating:' : null}</p> */}
                    <div id="video">
                      {trailer ? (
                        <iframe
                          title={`${title} trailer`}
                          width="560"
                          height="315"
                          className="mt-2"
                          src={`${trailer}`}
                          allowFullScreen
                        ></iframe>
                      ) : (
                        <p>The Trailer couldn't be loaded</p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="bg-white">
                  <h1 className="font-bold text-2xl underline">Actors</h1>
                  <div className="gridx actors">
                    {cast.length > 0
                      ? cast
                          .slice(0, 6)
                          .map((actor, index) => (
                            <Actor key={index} actor={actor} />
                          ))
                      : "Couldn't find any Actors for the movie"}
                  </div>
                  <h1 className="font-bold text-2xl underline">
                    Similar Movies:
                  </h1>
                  <div className="gridx">
                    {similar.length > 0
                      ? similar.map((movies, index) => (
                          <Movies key={index} movie={movies} />
                        ))
                      : "Couldn't find any Similar movies for the movie"}
                  </div>
                  <h1 className="mb-1 text-2xl font-medium text-center">
                    Looking for something else? Search our reviews:
                  </h1>
                  <div className="">
                    <Search
                      setMovies={props.setMovies}
                      history={props.history}
                      footer={true}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      ) : (
        <p className="loading"></p>
      )}
    </>
  );
};

export default MoviePage;
