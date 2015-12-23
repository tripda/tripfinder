(function(isNode) {
    function TripFinder(
        urlBuilder,
        httpClient,
        tripFactory
    ) {
        var _urlBuilder = urlBuilder;
        var _httpClient = httpClient;
        var _tripFactory = tripFactory;

        var _parameters = {
            departure: false
        };

        this.setUrlBuilder = setUrlBuilder;
        this.setHttpClient = setHttpClient;
        this.setTripFactory = setTripFactory;
        this.setDeparture = setDeparture;
        this.find = find;

        function setUrlBuilder(urlBuilder) {
            _urlBuilder = urlBuilder;
        }

        function setHttpClient(httpClient) {
            _httpClient = httpClient;
        }

        function setTripFactory(tripFactory) {
            _tripFactory = tripFactory;
        }

        function setDeparture(departure) {
            _parameters.departure = departure;
        }

        function find() {
            var promise = new Promise(function(resolve, reject) {
                var urlParams = {
                    fromGeohash: _parameters.departure
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
    }

    if (isNode) {
        var urlBuilder = require('../src/UrlBuilder.js');
        urlBuilder.setDomain('http://api.tripda.com.br/trip/new-search/');

        module.exports = new TripFinder(
            urlBuilder,
            require('request-promise'),
            require('../src/TripFactory.js')
        );
    }
})(
    typeof module !== "undefined" && module.exports
);
