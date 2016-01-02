(function() {
    function httpClient(options) {
        var promise = new Promise(function(resolve, reject) {
            var url = options.uri;

            if (options.qs) {
                url += "?" + buildQueryString(options.qs);
            }

            var xhr = new XMLHttpRequest();
            xhr.open('GET', url);
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

    function buildQueryString(data) {
        var params = [];

        for (var i in data) {
            params.push(i + '=' + data[i]);
        }

        return params.join('&');
    }

    angular
        .module('TripFinder')
        .provider('TripFinderHttpClient', function() {
            this.$get = function() {
                return httpClient;
            }
        });
})();
