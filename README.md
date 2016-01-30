# TripFinder

TripFinder is a JavaScript tool for searching and retrieving car rides, stored in carpooling platform Tripda's database.

## Installation

### NodeJS

```sh
npm install https://github.com/tripda/tripfinder
```

### AngularJS

```sh
bower install https://github.com/tripda/tripfinder
```

## Requirements

In order to use TripFinder you need to [get a Google Places API Key](https://developers.google.com/places/web-service/get-api-key). This key can be obtained for free, you only need a Google account. 

## Usage

### NodeJS

```javascript
var finder = require('tripfinder');

finder.setGeocoderKey('YOUR-KEY');

finder.setOrigin('Sao Paulo, SP, Brazil');

finder.setDestination('Rio de Janeiro, RJ, Brazil');

finder.find()
    .then(function(trips) {

        if (trips.length == 0) {

            // No trips were found...

            return;

        }

        console.log(trips.length + ' trips were found.');

        trips.forEach(function(trip) {

            var driver = trip.getDriver();

            console.log('From: ' + trip.getOriginAddress());
            console.log('To: ' + trip.getDestinationAddress());
            console.log('Driver: ' + driver.getName());
            console.log("\n");

        });

    });
```

### AngularJS

(To do...)
