const axios = require('axios')


const API = {
    id: '_' + Math.random().toString(36).substr(2, 9),
    url: "https://animelazerapi.herokuapp.com",
    key: "Bearer "
}



const test1 = async() => {
    axios.post(`${API.url}/AnimeLazer/Login`, {
        headers: {
            'Content-Type': 'application/json',
            id: API.id
        }
      })
      .then(async function(res) {
        axios.get(`${API.url}/Animes/scrapeAnimeDetails`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `${API.key}${res.data.token}`,
                url: "https://www1.7anime.io/anime/fena-pirate-princess/"
            }
        }).then(async function(res1) {                            
            let list = res1.data.data
            list.map((data) => {
                console.log(data.summary)
            })
            // navigate.navigate("EpisodeRoom", { ...topRated[key] })
        })
    
    
      })
      .catch(function(err) {
        console.log(err)
      })
}

test1()



const test = async() =>  {
    axios.post(`${API.url}/AnimeLazer/Login`, {
        headers: {
            'Content-Type': 'application/json',
            id: API.id
        }
      })
      .then(async function(res) {
        axios.get(`${API.url}/Animes/recentEpisodes`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `${API.key}${res.data.token}`
            }
        }).then(async function(res1) {
            console.log(res1.data)
        })
    
    
      })
      .catch(function(err) {
        console.log(err)
      })

}
// test()

// const fetchRecentEp = async(list , id) => {
//     try {
//         const user = {id}
//         const param = {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//                 id: JSON.stringify(user)
//             }
//         }
//         const res = await fetch(`${API.url}/AnimeLazer/login`, param)
//         const token = await res.json()

//         const param1 = {
//             method: 'GET',
//             headers: {
//                 'Content-Type': 'application/json',
//                 Authorization: `Bearer ${token['token']}`
//             },
//         }

//         const res1 = await fetch(`${API.url}/Animes/recentEpisodes`, param1)
//         const animeList = await res1.json()
//         list = animeList['data']
//         console.log(list)

//     } catch (err) {
//         console.log(err)
//     }
    
// }

// const fetchRecentShow = async(id) => {
//     try {
//         const user = {id}
//         const param = {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//                 id: JSON.stringify(user)
//             }
//         }
//         const res = await fetch(`${API.url}/AnimeLazer/login`, param)
//         const token = await res.json()

//         const param1 = {
//             method: 'GET',
//             headers: {
//                 'Content-Type': 'application/json',
//                 Authorization: `Bearer ${token['token']}`
//             },
//         }

//         const res1 = await fetch(`${API.url}/Animes/recentTvSeries`, param1)
//         const animeList = await res1.json()
//         console.log(animeList['data'])

//     } catch (err) {
//         console.log(err)
//     }
    
// }