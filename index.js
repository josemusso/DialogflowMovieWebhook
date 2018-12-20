// definir constantes a usar
'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const http = require('https');
var unirest = require("unirest");
let errorResponse = {
    results: []
};

// definir puerto
var port = process.env.PORT || 8080;

// server
const server = express();

server.use(bodyParser.json());

server.post('/getMovies',function (request,response)  {
//  caso parametro top-rated esta en la frase de input
    if(request.body.result.parameters['top-rated']) {
        var req = unirest("GET", "https://api.themoviedb.org/3/movie/top_rated");
        req.query({
            "page": "1",
            "language": "en-US",
            "api_key": "6f85f3f3f9be7e521911dab7a7bc6e9c"
        });
        req.send("{}");
        req.end(function(res) {
            if(res.error) {
//              manejo de error
                response.setHeader('Content-Type', 'application/json');
                response.send(JSON.stringify({
//                  enviar respuesta
                    "speech" : "Error. Can you try it again ? ",
                    "displayText" : "Error. Can you try it again ? "
                }));
            }
            else if(res.body.results.length > 0) {
//              caso exitoso
                let result = res.body.results;
                let output = '';
                for(let i = 0; i<result.length;i++) {
                    output += result[i].title;
                    output+="\n"
                }
                response.setHeader('Content-Type', 'application/json');
                response.send(JSON.stringify({
                    "speech" : "Top Rated Movies:\n" + output,
                    "displayText" : output
                }));
            }
        });
    }
    else if(request.body.result.parameters['movie-name']) {
//  caso parametro movie-name esta en la frase de input
        let movie = request.body.result.parameters['movie-name'];
        var req = unirest("GET", "https://api.themoviedb.org/3/search/movie");
        req.query({
            "include_adult": "false",
            "page": "1",
            "query":movie,
            "language": "en-US",
            "api_key": "6f85f3f3f9be7e521911dab7a7bc6e9c"
        });
        req.send("{}");
        req.end(function(res) {
            if(res.error) {
//              manejo de error
                response.setHeader('Content-Type', 'application/json');
                response.send(JSON.stringify({
//                  enviar respuesta
                    "speech" : "Error. Can you try it again ? ",
                    "displayText" : "Error. Can you try it again ? "
                }));
            }
            else if(res.body.results.length > 0) {
                let result = res.body.results[0];
                let output = "Average Rating : " + result.vote_average +
                    "\nPlot : " + result.overview + "\nhttp://image.tmdb.org/t/p/w185/" + result.poster_path
                response.setHeader('Content-Type', 'application/json');
                response.send(JSON.stringify({
//                  enviar respuesta con detalles de overview, rating y foto
                    "speech" : output,
                    "displayText" : output
                }));
            }
            else {
                response.setHeader('Content-Type', 'application/json');
                response.send(JSON.stringify({
//                  enviar respuesta si no se encuentra la pelicula
                    "speech" : "Couldn't find any details. :(  ",
                    "displayText" : "Couldn't find any details. :(  "
                }));
            }
        });

    }
    else if(request.body.result.parameters['popular-movies']) {
//  caso parametro popular-movies esta en la frase de input
        var req = unirest("GET", "https://api.themoviedb.org/3/movie/popular");
        req.query({
            "page": "1",
            "language": "en-US",
            "api_key": "6f85f3f3f9be7e521911dab7a7bc6e9c"
        });
        req.send("{}");
        req.end(function(res){
            if(res.error) {
                response.setHeader('Content-Type', 'application/json');
                response.send(JSON.stringify({
                    "speech" : "Error. Can you try it again ? ",
                    "displayText" : "Error. Can you try it again ? "
                }));
            } else {
                let result = res.body.results;
                let output = '';
                for(let i = 0; i < result.length;i++) {
                    output += result[i].title;
                    output+="\n"
                }
                response.setHeader('Content-Type', 'application/json');
                response.send(JSON.stringify({
//                  enviar respuesta
                    "speech" : "Most Popular Movies:\n" + output,
                    "displayText" : output
                }));
            }
        });
    }
    else if(request.body.result.parameters['now-playing']) {
//  caso parametro now-playing esta en la frase de input
        var req = unirest("GET", "https://api.themoviedb.org/3/movie/now_playing");
        req.query({
            "page": "1",
            "language": "en-US",
            "api_key": "6f85f3f3f9be7e521911dab7a7bc6e9c"
        });
        req.send("{}");
        req.end(function(res){
            if(res.error) {
                response.setHeader('Content-Type', 'application/json');
                response.send(JSON.stringify({
                    "speech" : "Error. Can you try it again ? ",
                    "displayText" : "Error. Can you try it again ? "
                }));
            } else {
                let result = res.body.results;
                let output = '';
                for(let i = 0; i < result.length;i++) {
                    output += result[i].title;
                    output+="\n"
                }
                response.setHeader('Content-Type', 'application/json');
                response.send(JSON.stringify({
//                  enviar respuesta
                    "speech" : "Movies On Theaters:\n" + output,
                    "displayText" : output
                }));
            }
        });
    }
});

// funcion de prueba para ver si el webook esta online
server.get('/getName',function (req,res){
    res.send('Jose Musso prueba Webhook');
});

// dejar webhook activo para escuchar solicitud
server.listen(port, function () {
    console.log("Server is up and running...");
});
