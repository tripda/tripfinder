(function(isNode) {
    function UrlBuilder() {
        var _domain = null;

        this.setDomain = setDomain;
        this.buildSearchUrl = buildSearchUrl;

        function setDomain(domain) {
            _domain = domain;
        }

        function buildSearchUrl(searchParams) {
            var fromGeohash = normalizeSearchParams(searchParams.fromGeohash);
            var toGeohash = normalizeSearchParams(searchParams.toGeohash);
            var date = normalizeSearchParams(searchParams.date);

            var params = [fromGeohash, toGeohash, date];

            var paramsNormalized = clearEmptyLeftParams(params);

            var searchUrl = mountSearchUrl(_domain, paramsNormalized);

            var apiParams = {};

            if (searchParams.hasOwnProperty('sort') && searchParams.sort !== false) {
                apiParams.sort = searchParams.sort;
            }

            if (searchParams.hasOwnProperty('timeRange') && searchParams.timeRange !== false) {
                apiParams.time_range = searchParams.timeRange;
            }

            if (searchParams.hasOwnProperty('ladies') && searchParams.ladies !== false) {
                apiParams.ladies = searchParams.ladies;
            }

            if (searchParams.hasOwnProperty('departureDistance') && searchParams.departureDistance !== false) {
                apiParams.departure_distance = searchParams.departureDistance;
            }

            if (searchParams.hasOwnProperty('destinationDistance') && searchParams.destinationDistance !== false) {
                apiParams.destination_distance = searchParams.destinationDistance;
            }

            if (searchParams.hasOwnProperty('priceCategory') && searchParams.priceCategory !== false) {
                apiParams.price_category = searchParams.priceCategory;
            }

            if (searchParams.hasOwnProperty('badge') && searchParams.badge !== false) {
                apiParams.badge = searchParams.badge;
            }

            if (searchParams.hasOwnProperty('page') && searchParams.page !== false) {
                apiParams.page = searchParams.page;
            }

            if (Object.keys(apiParams).length > 0) {
                searchUrl += '?' + buildQueryString(apiParams);
            }

            return searchUrl;
        }

        function normalizeSearchParams(searchParam) {
            return searchParam || '0';
        }

        function clearEmptyLeftParams(params) {
            var paramsNormalized = params.slice(0);
            params.reverse();
            paramsNormalized.reverse();

            for (var index in params) {
                if (params[index] !== '0') {
                    break;
                }

                paramsNormalized.splice(0, 1);
            }

            paramsNormalized.reverse();

            return paramsNormalized;
        }

        function mountSearchUrl(_domain, params) {
            return _domain + params.join('/');
        }

        function buildQueryString(data) {
            var params = [];

            for (var i in data) {
                params.push(i + '=' + data[i]);
            }

            return params.join('&');
        }
    }

    if (isNode) {
        module.exports = new UrlBuilder();
    }
})(
    typeof module !== "undefined" && module.exports
);


