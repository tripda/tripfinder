(function(isNode, isAngular) {
    function TripFinder(
        urlBuilder,
        httpClient,
        tripFactory
    ) {
        var _urlBuilder = urlBuilder;
        var _httpClient = httpClient;
        var _tripFactory = tripFactory;

        var _parameters = {
            origin: false
        };

        this.setUrlBuilder = setUrlBuilder;
        this.setHttpClient = setHttpClient;
        this.setTripFactory = setTripFactory;
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

        function setOrigin(origin) {
            _parameters.origin = origin;
        }

        function getOrigin() {
            return _parameters.origin;
        }

        function find() {
            var promise = new Promise(function(resolve, reject) {
                var urlParams = {
                    fromGeohash: _parameters.origin
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
            require('../src/TripFactory.js')
        );
    } else if (isAngular) {
        angular
            .module('TripFinder')
            .provider('TripFinder', function() {
                this.$get = [
                    'UrlBuilder',
                    'TripFactory',
                    'TripFinderHttpClient',
                    function(urlBuilder, tripFactory, tripFinderHttpClient) {
                        urlBuilder.setDomain('http://api.tripda.com.br/trip/new-search/');

                        return new TripFinder(
                            urlBuilder,
                            tripFinderHttpClient,
                            tripFactory
                        );
                    }]
                });
    }
})(
    typeof module !== "undefined" && module.exports,
    typeof angular !== "undefined"
);
