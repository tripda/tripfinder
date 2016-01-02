(function(isNode, isAngular) {
    function Geocoder(
        httpClient
    ) {
        var _httpClient = httpClient;
        var _key = null;

        this.setHttpClient = setHttpClient;
        this.setKey = setKey;
        this.geocode = geocode;

        function setHttpClient(httpClient) {
            _httpClient = httpClient;
        }

        function setKey(key) {
            _key = key;
        }

        function geocode(address) {
            var promise = new Promise(function (resolve, reject) {
                if (_key == null) {
                    throw new Error('In order to use the Geocoder, you must provide an API key from Google.');
                }

                _httpClient({
                    uri: 'https://maps.googleapis.com/maps/api/geocode/json',
                    qs: {
                        key: _key,
                        address: address
                    },
                    json: true
                })
                .then(function(response) {
                    resolve({
                        "lat" : response.results[0].geometry.location.lat,
                        "lng" : response.results[0].geometry.location.lng,
                    });
                });
            });

            return promise;
        }
    }

    if (isNode) {
        module.exports = new Geocoder(
            require('request-promise')
        );
    } else if (isAngular) {
        angular
            .module('TripFinder')
            .provider('TripFinderGeocoder', function() {
                this.$get = [
                    'TripFinderHttpClient',
                    function(tripFinderHttpClient) {
                        return new Geocoder(
                            tripFinderHttpClient
                        );
                    }]
                });
    }
})(
    typeof module !== "undefined" && module.exports,
    typeof angular !== "undefined"
);
