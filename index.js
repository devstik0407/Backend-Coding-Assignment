//Constructor for creating an object Movie 
function Movie(name, releaseYear, genre){
    this.name=name;
    this.releaseYear=releaseYear;
    this.genre=genre;
    this.totalReviewCount=0;
    this.totalReviewScore=0;
    this.totalCriticScore=0;
}
//Constructor for creating an object User
function User(name){
    this.name=name;
    this.reviewCount=0;
    this.reviewedMovies=new Set();
    this.category="Viewer";
}
//MovieReview class contains list of users and movies and all operations
//to be performed in a movie review system
class MovieReview{
    #movies=new Array();
    #users=new Array();
    #movieIds={}; //maps the name of a movie to the index of that movie in movies array
    #userIds={}; //maps the name of a user to the index of that user in users array
    #reviewsPerReleaseYear={};
    constructor(){
        console.log("Created a new instance of Movie Review class");
    }
    addMovie(name, releaseYear, genre){
        let currYear=new Date().getFullYear();
        if(currYear<releaseYear){
            console.log("ERROR: Invalid data");
            return;
        }
        for(let i=0;i<genre.length;i++){
            genre[i]=genre[i].toLowerCase();
        }
        let newMovie=new Movie(name, releaseYear, genre);
        this.#movieIds[name]=this.#movies.length;
        this.#movies.push(newMovie);
        console.log("Successfully added a new movie")
    }
    addUser(name){
        if(name in this.#userIds){
            console.log("User already registered");
            return;
        }
        let newUser=new User(name);
        this.#userIds[name]=this.#users.length;
        this.#users.push(newUser);
        console.log("Successfully added a new user");
    }
    add_review(userName, movieName, reviewScore){
        if(this.#userIds[userName]===undefined){
            console.log("ERROR: Not a registered user\nPlease register first");
            return;
        }
        if(this.#movieIds[movieName]===undefined){
            console.log("ERROR: Movie not yet produced");
            return;
        }
        let currDate=new Date();
        let movie=this.#movies[this.#movieIds[movieName]], user=this.#users[this.#userIds[userName]];
        if(user.reviewedMovies.has(movieName)){
            console.log("ERROR: Multiple reviews not allowed");
            return;
        }
        if(currDate.getFullYear()<movie.releaseYear){
            console.log("ERROR: Movie yet to be released");
            return;
        }
        if(reviewScore>10 || reviewScore<0){
            console.log("ERROR: Review-score is invalid");
            return;
        }
        user.reviewedMovies.add(movieName);
        movie.totalReviewScore += reviewScore * this.#getMultiplier(user);
        movie.totalReviewCount++;
        if (user.category==="Critic") {
            movie.totalCriticScore += reviewScore * this.#getMultiplier(user);
        }
        let releaseYear = movie.releaseYear;
        if (this.#reviewsPerReleaseYear[releaseYear] === undefined) {
            this.#reviewsPerReleaseYear[releaseYear] = { reviewCount: 0, reviewScore: 0 };
        }
        this.#reviewsPerReleaseYear[releaseYear].reviewScore += reviewScore * this.#getMultiplier(user);
        this.#reviewsPerReleaseYear[releaseYear].reviewCount++;
        user.reviewCount++;
        console.log("Successfully added a new review");
        this.#upgradeUser(user);
    }
    topMoviesByGenre(n, genre){
        if(n<=0){
            return [];
        }
        genre=genre.toLowerCase();
        this.#sortMoviesByCriticScore(0, this.#movies.length-1);
        let topMovies=[];
        let count=0;
        for(let i=0;i<this.#movies.length;i++){
            this.#movieIds[this.#movies[i].name]=i;
            for(let j=0;j<this.#movies[i].genre.length;j++){
                if(genre===this.#movies[i].genre[j]){
                    topMovies.push(this.#movies[i].name);
                    count++;
                    break;
                }
            }
            if(count===n){
                break;
            }
        }
        return topMovies;
    }
    averageReviewScoreOfYear(releaseYear){
        if(this.#reviewsPerReleaseYear[releaseYear]===undefined){
            console.log("ERROR: No movie released in this year");
            return;
        }
        return this.#reviewsPerReleaseYear[releaseYear].reviewScore/this.#reviewsPerReleaseYear[releaseYear].reviewCount;
    }
    averageReviewScoreOfMovie(movieName){
        let movieId=this.#movieIds[movieName];
        if(movieId===undefined){
            console.log("ERROR: Movie not yet produced");
            return;
        }
        return this.#movies[movieId].totalReviewScore/this.#movies[movieId].totalReviewCount;
    }
    #sortMoviesByCriticScore(startIndex, endIndex){
        if(endIndex-startIndex===0){
            return;
        }
        let midIndex=Math.floor((startIndex+endIndex)/2);
        this.#sortMoviesByCriticScore(startIndex, midIndex);
        this.#sortMoviesByCriticScore(midIndex+1, endIndex);
        let i=startIndex, j=midIndex+1;
        let tempArr=[];
        while(i<=midIndex && j<=endIndex){
            if(this.#movies[i].totalCriticScore>this.#movies[j].totalCriticScore){
                tempArr.push(this.#movies[i]);
                i++;
            }
            else{
                tempArr.push(this.#movies[j]);
                j++;
            }
        }
        while(i<=midIndex){
            tempArr.push(this.#movies[i]);
            i++;
        }
        while(j<=endIndex){
            tempArr.push(this.#movies[j]);
            j++;
        }
        for(let k=startIndex;k<=endIndex;k++){
            this.#movies[k]=tempArr[k-startIndex];
        }
    }
    #upgradeUser(user){
        if(user.reviewCount>=40){
            user.category="Admin";
        }
        else if(user.reviewCount>=20){
            user.category="Expert";
        }
        else if(user.reviewCount>=3){
            user.category="Critic";
        }
    }
    #getMultiplier(user){
        if(user.category==="Admin"){
            return 5;
        }
        if(user.category==="Expert"){
            return 3;
        }
        if(user.category==="Critic"){
            return 2;
        }
        return 1;
    }
    getAllUsers(){
        let allUsers=[];
        for(let i=0;i<this.#users.length;i++){
            allUsers.push(this.#users[i].name);
        }
        return allUsers;
    }
    getAllMovies(){
        let allMovies=[];
        for(let i=0;i<this.#movies.length;i++){
            allMovies.push(this.#movies[i].name);
        }
        return allMovies;
    }
}