//jshint esversion: 6 
//jshint esversion: 8

$(document).ready(function () {
    var searchType;
    //click search button set the searchBox as the value
    $("#searchSongsBtn").on('click', function (event) {
        //prevent default prevents page from auto refreshing 
        event.preventDefault();
        searchType = 'tag.getTopTracks';
        populateSearchSong();  
        populateLastSearch();

    });
    $("#searchArtistBtn").on('click', function (event) {
        event.preventDefault();
        searchType = 'tag.getTopArtists';
        populateSearchArtist();  
        populateLastSearch();
    });
    $("#searchAlbumBtn").on('click', function (event) {
        event.preventDefault();
        searchType = 'tag.getTopAlbums';
        populateSearchAlbum();  
        populateLastSearch();
    });
    $("#searchBtn").on('click', function (event) {
        event.preventDefault();
        emptyModel();
        searchFM();
    });

    //put in text depending on search type.
    function populateSearchSong(){
        emptyModel();
        $("#modalLabel").text("Songs by Mood");
    }

    function populateSearchArtist() {
        emptyModel();
        $("#modalLabel").text("Artists by Mood");
    }

    function populateSearchAlbum() {
        emptyModel();
        $("#modalLabel").text("Albums by Mood");
    }

    //Empties the Model so things can be populated
    function emptyModel() {
        $('#populateListHere').empty();
    }
    //get the last search and populate on model open
    function populateLastSearch(){
        var lastSearched = localStorage.getItem('lastSearched');
        if (lastSearched === null){
            return;
        }
        var lastSearchEl = $("<p>").attr('data-name', lastSearched).text('Last Searched Mood: ' + lastSearched).attr('class', 'text-center');
        $('#populateListHere').append(lastSearchEl);
    }
    //ajax call
    function searchFM() {
        var key = '4042e92bded8b7f879e7f753d9f06247';
        var searchText = $("#searchBox").val();
        var queryURL = 'https://ws.audioscrobbler.com/2.0/?method=' + searchType + '&tag=' + searchText + '&api_key=' + key + '&format=json';
        
        //Save the last searched
        localStorage.setItem('lastSearched', searchText);

        $.ajax({
                url: queryURL,
                method: "GET"
            })
            .then(function (songInfo) {
                if (searchType === 'tag.getTopTracks') {
                    populateSongList(songInfo.tracks.track);
                }
                if (searchType === 'tag.getTopArtists') {
                    populateArtistList(songInfo.topartists.artist);
                }
                if (searchType === 'tag.getTopAlbums') {
                    populateAlbumList(songInfo.albums.album);
                }
            });
    }
    //populate the populateMeHere div with top tracks
    function populateSongList(songTag) {

        for (var i = 0; i < songTag.length; i++) {
            //create a div for each song
            //put in name, artist, and link to LastFM
            var songEl = $("<div>");
            var songName = songTag[i].name;
            var songArtist = songTag[i].artist.name;
            var numberEl = i + 1;
            var nameEl = $('<p>').text(numberEl + ' Song: ' + songName);
            var artistEl = $('<p>').text('Artist: ' + songArtist);
            var songURL = songTag[i].url;
            var songURLEl = $('<a>link</a>').attr('href', songURL).attr('target', '_blank');
            songEl.append(nameEl);
            songEl.append(artistEl);
            songEl.append(songURLEl);
            $('#populateListHere').append(songEl);
        }
    }

    function populateArtistList(songTag) {
    
        for (var i = 0; i < songTag.length; i++) {
            var artistEl = $("<div>");
            var artistName = songTag[i].name;
            var numberEl = i + 1;
            var artistNameEl = $('<p>').text(numberEl + ' Artist: ' + artistName);
            var artistURL = songTag[i].url;
            var artistURLEl = $('<a>link</a>').attr('href', artistURL).attr('target', '_blank');
            artistEl.append(artistNameEl);
            artistEl.append(artistURLEl);
            $('#populateListHere').append(artistEl);
        }
    }

    function populateAlbumList(songTag) {
        for (var i = 0; i < songTag.length; i++) {
            albumEl = $("<div>");
            var numberEl = i + 1;
            var albumName = songTag[i].name;
            var artistName = songTag[i].artist.name;
            var albumNameEl = $('<p>').text(numberEl + ' Album: ' + albumName);
            var artistNameEl = $('<p>').text('Artist: ' + artistName);
            var albumURL = songTag[i].url;
            var albumURLEl = $('<a>link</a>').attr('href', albumURL).attr('target', '_blank');
            albumEl.append(albumNameEl);
            albumEl.append(artistNameEl);
            albumEl.append(albumURLEl);
            $('#populateListHere').append(albumEl);
        }
    }

    //Kanye Rest API https://kanye.rest/ ***********************************************************************
    const quoteHtml = document.querySelector('#Kanyequote');
    const kanyeBtn = document.querySelector('#kanyeRestbtn');

    //function to append quote to DOM
    function appendQuote(object) {
        quoteHtml.innerHTML = ''; //
        //create h4 tags so it implements 
        const quote = document.createElement('h4');
        const span = document.createElement('span');
        span.textContent = object.quote;
        quote.appendChild(span);
        return quoteHtml.appendChild(quote);
    }
    //function to get quote
    function kanyeRest() {
        loadKanyeQuote(true);
        //async function https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function
        return new Promise(async function (resolve, reject) {
            //try catch 
            try {
                //use Fetch https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
                const request = await fetch('https://api.kanye.rest/');
                const response = await request.json();
                //if successful append to response
                resolve(appendQuote(response));
                console.log(response);
            } catch (error) {
                //incase there is an error append the output
                reject(appendError(error));
                console.log(error);
            }
        });
    }

    kanyeBtn.addEventListener("click", function () {
        console.log("Kanye clicked me");
        kanyeRest();
    });


    function loadKanyeQuote(yes) {
        if (yes) {
            return quoteHtml.textContent == 'slow your roll, I am loading';
            //console.log(quoteHtml.textContent);
        } else {
            console.error("Invalid Argument");
            return quoteHtml.innerHTML == '';

        }
    }
});
