(function() {
    function httpClient(options) {
        var promise = new Promise(function(resolve, reject) {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', options.uri);
            xhr.send(null);

            xhr.onreadystatechange = function() {
                var DONE = 4;
                var OK = 200;

                if (xhr.readyState === DONE) {
                    if (xhr.status === OK) {
                        var response = JSON.parse(xhr.responseText);

                        resolve(response);
                    }
                }
            }
        });

        return promise;
    }

    angular
        .module('TripFinder')
        .provider('TripFinderHttpClient', function() {
            this.$get = function() {
                return httpClient;
            }
        });
})();
