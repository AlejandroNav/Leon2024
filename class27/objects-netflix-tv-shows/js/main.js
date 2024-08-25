//Create a Netflix TV Show class with a constructor that makes Netflix TV Shows with 4 properties and 3 methods

class netflixShow {
    constructor(name, genre, rating, seasons) {
        this.name = name
        this.genre = genre
        this.rating = rating
        this.seasons = seasons
    }

    showInfo() {
        console.log(`Name: ${this.name}, Genre: ${this.genre}`)
    }

    showRating() {
        const starRating = Math.round(this.rating / 2);
        const stars = '⭐'.repeat(starRating);
        console.log(`Rating in stars: ${stars}`);
    }

    showSeasons() {
        console.log(`This whole show has ${this.seasons} Seasons: ${this.seasons} \n `)
    }
    
}   

let myShow = new netflixShow('The Office', 'Comedy', 8, 9)
myShow.showInfo()
myShow.showRating()
myShow.showSeasons()

let myShow2 = new netflixShow('Breaking Bad', 'Drama', 9, 5)
myShow2.showInfo()
myShow2.showRating()
myShow2.showSeasons()

let myShow3 = new netflixShow('Game of Thrones', 'Fantasy', 9, 8)
myShow3.showInfo()
myShow3.showRating()
myShow3.showSeasons()

let worstShow = new netflixShow('The Big Bang Theory', 'Comedy', 1, 12)
worstShow.showInfo()
worstShow.showRating()
worstShow.showSeasons()
