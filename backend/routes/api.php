<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');



Route::get("/general", function() {

    $client = new Predis\Client([
        "scheme"    => "tcp",
        "host"      => "localhost",
        "port"      => 6379,
    ]);


    $client->publish(
        channel: "generalEvent", 
        message: "Welcome to our site, hope you enjoy your stay"
    );

    return response()->json(["success" => "sent"], 200);

});

Route::get("/temperature/{city}", function(String $city) {

    $client = new Predis\Client([
        "scheme"    => "tcp",
        "host"      => "localhost",
        "port"      => 6379,
    ]);

    $client->publish(
        channel: $city."Event", 
        message: "city: ".$city." - date: ".date("Y-m-d H:i:s")." - temparature: ".mt_rand(0, 32)
    );

    return response()->json(["success" => "sent ".$city."'s temperature"], 200);
  
});



