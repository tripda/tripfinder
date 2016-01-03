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
            origin: false
        };

        this.setUrlBuilder = setUrlBuilder;
        this.setHttpClient = setHttpClient;
        this.setTripFactory = setTripFactory;
        this.setGeocoder = setGeocoder;
        this.setGeohashEncoder = setGeohashEncoder;
        this.setGeocoderKey = setGeocoderKey;
        this.setOrigin = setOrigin;
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

        function getOrigin() {
            return _parameters.origin;
        }

        function find() {
            var promise = new Promise(function(resolve, reject) {
                var origin = getOrigin();
                var geohashResolvedPromise = Promise.resolve(origin);

                if (origin == false) {
                    throw new Error('Cannot find trips with undefined origin and destination.');
                }

                if (origin.match(/\ /)) {
                    geohashResolvedPromise = new Promise(function(resolve) {
                        _geocoder.geocode(origin)
                            .then(function(coordinates) {
                                resolve(_geohashEncoder.encode(coordinates.lat, coordinates.lng));
                            });
                    });
                }

                geohashResolvedPromise
                    .then(function(originGeohash) {
                        var urlParams = {
                            fromGeohash: originGeohash
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
