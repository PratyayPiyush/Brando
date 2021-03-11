import React, { useState, useEffect, useContext } from 'react';
import { Route, Link } from 'react-router-dom'
import { AuthContext } from '../Context/AuthContext'
import MovieService from '../Services/MovieService';
import { TiStarFullOutline } from "react-icons/ti";
import { BsFillBookmarkFill } from "react-icons/bs";

// import MoviePage from './MoviePage'

const Movie_Img = "http://image.tmdb.org/t/p/w220_and_h330_face/"

const Movies = ({ movie }) => {

    // if user is logged in only then
    const { user, isAuthenticated } = useContext(AuthContext)

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const getData = async (id) => {
        fetch(`/user/movies/${user._id}/${id}`)
            .then(async res => {

                if (res.status == 200) {

                    const data = await res.json()
                    setFav(data.fav.fav)
                    // setSame(!same)
                    if (!data.fav.fav) {
                        await deleteServer(data.fav._id)
                    } else {
                        return
                    }

                } else {
                    return
                }
            }).catch(err => console.log('Error: ' + err))
    }

    const getWish = async (id) => {

        MovieService.getMovieWishList(user._id, id)
            .then(data => {
                if (data) {
                    setWish(data.wishlist)
                    setWishId(data._id)
                } else {
                    return
                }
            })

    }

    const [fav, setFav] = useState(false)

    const [wish, setWish] = useState(false)

    const [wishId, setWishId] = useState(0)

    // const [same, setSame] = useState(false)

    useEffect(() => {

        const fetchData = async () => {
            await getData(movie.id)
            await getWish(movie.id)
        }

        fetchData();

    }, [getData, movie.id])

    const noImage = "https://upload.wikimedia.org/wikipedia/commons/f/fc/No_picture_available.png"
    const poster = Movie_Img + movie.poster_path

    const postMovie = async (id) => {

        const cine = {
            id,
            fav: false // it will change in the modifyServer
        }

        const res = await fetch(`/user/movies/`, {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(cine)
        })
        const data = res.json()
        return data;
    }

    const modifyServer = async (data) => {

        const cine = {
            id: data.id,
            fav: !fav
        }

        const res = await fetch(`/user/movies/${data._id}`, {
            method: "PUT",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(cine)
        })
    }

    // id is the book id
    const deleteServer = async (id) => {

        await fetch(`/user/movies/${id}`, {
            method: "DELETE"
        })
    }

    const getServer = async (id) => {
        fetch(`/user/movies/${user._id}/${id}`)
            .then(async res => {
                // if !res.ok delete that entry
                if (res.status == 200) {
                    const data = await res.json()
                    await modifyServer(data.fav)

                } else {
                    // await deleteServer(id)
                    const data = await postMovie(id)
                    await modifyServer(data)
                }
            })
        // const data = res.json()

        // const cines = data.map(m => m.id === id)

        // return true
    }

    const favourite = async (id) => {

        // UI changes
        setFav(fav => !fav)
        // setSame(same => !same)
        // Server Side Storing

        await getServer(id)

    }

    const wishList = async (id) => {

        // UI changes
        setWish(wish => !wish)

        // Server Side Storing
        if (!wish) {
            MovieService.postWish(id)
                .then(data => {
                    console.log(data)
                    return
                })
        }
        else {
            // movies mongo id
            MovieService.deleteWish(wishId)
                .then(data => {
                    console.log(data)
                    return
                })

        }

    }



    const setTagColour = (vote) => {
        if (vote >= 8) {
            return 's'
        } else if (vote >= 5) {
            return 'a'
        } else if (vote > 0) {
            return 'f'
        }
        else if (vote == 0) {
            return 'n'
        }
    }
    return (
        <Route path="/">
            <div className="card flex-col justify-items-center">
                <div id="movieCard" className="max-h-1/6 mx-auto rounded-lg overflow-hidden bg-white" style={{ maxWidth: '13.7rem', }}>
                    {/* background: '#22254b' */}
                    <div className="relative overflow-hidden z-10" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 calc(100% - 3vh))' }}>
                        <Link to={`/movies/${movie.id}/#Movie`}>
                            <img className src={movie.poster_path ? poster : noImage} alt="Movie Image" />
                        </Link>
                    </div>
                    <div className="relative flex justify-between items-center flex-row px-2 z-50 -mt-8">
                        <p className="flex items-center text-gray-400" className={`tag ${setTagColour(movie.vote_average)}`}>
                            {/* className={`tag ${setTagColour(movie.vote_average)}`} */}
                            <span className={`dot ${setTagColour(movie.vote_average)}`} />{(movie.vote_average.toFixed(2)) * 10}%</p>

                        {isAuthenticated ? <>
                            {fav ? null : < BsFillBookmarkFill onClick={() => wishList(movie.id)} className={wish ? "text-yellow-500 text-3xl rounded-full cursor-pointer" : "text-green-400 hover:bg-yellow-300 text-3xl hover:text-yellow-500 active:text-yellow-500 rounded-full cursor-pointer"} />}
                            {!wish ? <button className="p-4 bg-blue-600 rounded-full hover:bg-blue-500 focus:bg-blue-700 transition ease-in duration-200 focus:outline-none" onClick={() => favourite(movie.id)}>
                                <TiStarFullOutline className={fav ? "blue" : "star"} />
                            </button> : null}
                        </> : null}
                    </div>
                    <div className="pt-2 pb-2 text-gray-600 text-center">

                        <p>{movie.title}</p>
                        <p className="text-sm">{movie.release_date}</p>
                    </div>
                    <div className="pb-1 capitalize text-center tracking-wide flex justify-evenly bg-blue-200">
                        <div className="posts">
                            <p className=" border-t-2 w-screen border-blue-400" />
                            <Link to={`/movies/${movie.id}/#Movie`} className="text-lg underline cursor-pointer hover:text-blue-600 font-semibold text-blue-500">view details</Link>
                        </div>
                    </div>
                </div>
                {/*                 
                    {isAuthenticated ? <svg fill="currentColor" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className={fav ? "blue" : "star"} viewBox="0 0 24 24" onClick={() => favourite(movie.id)}>
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                    </svg> : null}
                */}
            </div>
        </Route>
    );
}

export default Movies;
