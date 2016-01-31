(function(isNode, isAngular) {
    function TripFinder(
        urlBuilder,
        httpClient,
        tripFactory,
        geocoder,
        geohashEncoder
    ) {
        var _urlBuilder = urlBuilder;
        var _httpClient = httpClient;
        var _tripFactory = tripFactory;
        var _geocoder = geocoder;
        var _geohashEncoder = geohashEncoder;

        var _parameters = {
            origin: false,
            destination: false,
            date: false
        };

        this.setUrlBuilder = setUrlBuilder;
        this.setHttpClient = setHttpClient;
        this.setTripFactory = setTripFactory;
        this.setGeocoder = setGeocoder;
        this.setGeohashEncoder = setGeohashEncoder;
        this.setGeocoderKey = setGeocoderKey;
        this.setOrigin = setOrigin;
        this.setDestination = setDestination;
        this.setDate = setDate;
        this.getOrigin = getOrigin;
        this.find = find;
        this.resetSearchParameters = resetSearchParameters;

        function setUrlBuilder(urlBuilder) {
            _urlBuilder = urlBuilder;
        }

        function setHttpClient(httpClient) {
            _httpClient = httpClient;
        }

        function setTripFactory(tripFactory) {
            _tripFactory = tripFactory;
        }

        function setGeocoder(geocoder) {
            _geocoder = geocoder;
        }

        function setGeohashEncoder(geohashEncoder) {
            _geohashEncoder = geohashEncoder;
        }

        function setGeocoderKey(key) {
            _geocoder.setKey(key);
        }

        function setOrigin(origin) {
            _parameters.origin = origin;
        }

        function setDestination(destination) {
            _parameters.destination = destination;
        }

        function getOrigin() {
            return _parameters.origin;
        }

        function getDestination() {
            return _parameters.destination;
        }

        function setDate(date) {
            _parameters.date = date;
        }

        function getDate() {
            return _parameters.date;
        }

        function find() {
            var promise = new Promise(function(resolve, reject) {
                var origin = getOrigin();
                var destination = getDestination();
                var date = getDate();
                var geohashResolvedPromise = [
                    Promise.resolve(origin),
                    Promise.resolve(destination),
                ]

                if (origin == false && destination == false) {
                    throw new Error('Cannot find trips with undefined origin and destination.');
                }

                if (isAddress(origin)) {
                    geohashResolvedPromise[0] = new Promise(function(resolve) {
                        _geocoder.geocode(origin)
                            .then(function(coordinates) {
                                resolve(_geohashEncoder.encode(coordinates.lat, coordinates.lng));
                            });
                    });
                }

                if (isAddress(destination)) {
                    geohashResolvedPromise[1] = new Promise(function(resolve) {
                        _geocoder.geocode(destination)
                            .then(function(coordinates) {
                                resolve(_geohashEncoder.encode(coordinates.lat, coordinates.lng));
                            });
                    });
                }

                Promise.all(geohashResolvedPromise)
                    .then(function(geohash) {
                        var urlParams = {
                            fromGeohash: geohash[0],
                            toGeohash: geohash[1],
                            date: date
                        };

                        var url = _urlBuilder.buildSearchUrl(urlParams);

                        _httpClient({
                            uri: url,
                            json: true
                        })
                            .then(function(apiResponse) {
                                var trips = _tripFactory.createFromApiResponse(apiResponse);

                                resolve(trips);
                            });
                    });
            });

            return promise;
        }

        function resetSearchParameters() {
            _parameters.origin = false;
            _parameters.destination = false;
            _parameters.date = false;
        }

        function isAddress(str) {
            if (!isNaN(parseInt(str))) {
                return false;
            }

            if (typeof str == "string") {
                return true;
            }

            return false;
        }
    }

    if (isNode) {
        var urlBuilder = require('../src/UrlBuilder.js');
        urlBuilder.setDomain('http://api.tripda.com.br/trip/new-search/');

        module.exports = new TripFinder(
            urlBuilder,
            require('request-promise'),
            require('../src/TripFactory.js'),
            require('../src/Geocoder.js'),
            require('ngeohash')
        );
    } else if (isAngular) {
        angular
            .module('TripFinder')
            .provider('TripFinder', function() {
                this.$get = [
                    'UrlBuilder',
                    'TripFactory',
                    'TripFinderHttpClient',
                    'TripFinderGeocoder',
                    'Geohash',
                    function(
                        urlBuilder,
                        tripFactory,
                        tripFinderHttpClient,
                        tripFinderGeocoder,
                        geohash
                    ) {
                        urlBuilder.setDomain('http://api.tripda.com.br/trip/new-search/');

                        return new TripFinder(
                            urlBuilder,
                            tripFinderHttpClient,
                            tripFactory,
                            tripFinderGeocoder,
                            geohash
                        );
                    }]
                });
    }
})(
    typeof module !== "undefined" && module.exports,
    typeof angular !== "undefined"
);
