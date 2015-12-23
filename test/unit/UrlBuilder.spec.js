describe('Url Builder', function() {
    var urlBuilder;

    beforeEach(function() {
        urlBuilder = require('../../src/UrlBuilder.js');

        urlBuilder.setDomain('api.tripda.com.br/trip/search/');
    });

    describe('mount the Search URL', function() {

        it('with departure', function() {
            var searchParams = {fromGeohash: '123456'};
            var searchUrl = urlBuilder.buildSearchUrl(searchParams);
            var expectedSearchUrl = 'api.tripda.com.br/trip/search/123456';

            expect(searchUrl).to.be.eql(expectedSearchUrl);
        })

        it('with departure and destination', function() {
            var searchParams = {fromGeohash: '123456', toGeohash: '456789'};
            var searchUrl = urlBuilder.buildSearchUrl(searchParams);
            var expectedSearchUrl = 'api.tripda.com.br/trip/search/123456/456789';

            expect(searchUrl).to.be.eql(expectedSearchUrl);
        })

        it('with departure and destination and date', function() {
            var searchParams = {fromGeohash: '123456', toGeohash: '456789', date: '2015-06-30'};
            var searchUrl = urlBuilder.buildSearchUrl(searchParams);
            var expectedSearchUrl = 'api.tripda.com.br/trip/search/123456/456789/2015-06-30';

            expect(searchUrl).to.be.eql(expectedSearchUrl);
        })

        it('with departure and date', function() {
            var searchParams = {fromGeohash: '123456', date: '2015-06-30'};
            var searchUrl = urlBuilder.buildSearchUrl(searchParams);
            var expectedSearchUrl = 'api.tripda.com.br/trip/search/123456/0/2015-06-30';

            expect(searchUrl).to.be.eql(expectedSearchUrl);
        })

        it('with destination', function() {
            var searchParams = {toGeohash: '456789'};
            var searchUrl = urlBuilder.buildSearchUrl(searchParams);
            var expectedSearchUrl = 'api.tripda.com.br/trip/search/0/456789';

            expect(searchUrl).to.be.eql(expectedSearchUrl);
        })

        it('with destination and date', function() {
            var searchParams = {toGeohash: '456789', date: '2015-06-30'};
            var searchUrl = urlBuilder.buildSearchUrl(searchParams);
            var expectedSearchUrl = 'api.tripda.com.br/trip/search/0/456789/2015-06-30';

            expect(searchUrl).to.be.eql(expectedSearchUrl);
        })

        it('with destination and date and sort', function() {
            var searchParams = {toGeohash: '456789', date: '2015-06-30', sort: 'proximity'};
            var searchUrl = urlBuilder.buildSearchUrl(searchParams);
            var expectedSearchUrl = 'api.tripda.com.br/trip/search/0/456789/2015-06-30?sort=proximity';

            expect(searchUrl).to.be.eql(expectedSearchUrl);
        })

        it('with destination and date and sort and time range', function() {
            var searchParams = {toGeohash: '456789', date: '2015-06-30', sort: 'price', timeRange: '10,20'};
            var searchUrl = urlBuilder.buildSearchUrl(searchParams);
            var expectedSearchUrl = 'api.tripda.com.br/trip/search/0/456789/2015-06-30?sort=price&time_range=10,20';

            expect(searchUrl).to.be.eql(expectedSearchUrl);
        })

        it('with destination and date and time range and ladies only', function() {
            var searchParams = {toGeohash: '456789', date: '2015-06-30', timeRange: '10,20', ladies: '1'};
            var searchUrl = urlBuilder.buildSearchUrl(searchParams);
            var expectedSearchUrl = 'api.tripda.com.br/trip/search/0/456789/2015-06-30?time_range=10,20&ladies=1';

            expect(searchUrl).to.be.eql(expectedSearchUrl);
        })

        it('with destination and departure distance and destination distance', function() {
            var searchParams = {toGeohash: '456789', date: '2015-06-30', departureDistance: '20', destinationDistance: '50'};
            var searchUrl = urlBuilder.buildSearchUrl(searchParams);
            var expectedSearchUrl = 'api.tripda.com.br/trip/search/0/456789/2015-06-30?departure_distance=20&destination_distance=50';

            expect(searchUrl).to.be.eql(expectedSearchUrl);
        })

        it('with destination and price category', function() {
            var searchParams = {toGeohash: '456789', date: '2015-06-30', priceCategory: '1,2'};
            var searchUrl = urlBuilder.buildSearchUrl(searchParams);
            var expectedSearchUrl = 'api.tripda.com.br/trip/search/0/456789/2015-06-30?price_category=1,2';

            expect(searchUrl).to.be.eql(expectedSearchUrl);
        })

        it('with destination and date and badge', function() {
            var searchParams = {toGeohash: '456789', date: '2015-06-30', badge: 'harvard'};
            var searchUrl = urlBuilder.buildSearchUrl(searchParams);
            var expectedSearchUrl = 'api.tripda.com.br/trip/search/0/456789/2015-06-30?badge=harvard';
        })

        it('with page', function() {
            var searchParams = {toGeohash: '456789', date: '2015-06-30', page: '5'};
            var searchUrl = urlBuilder.buildSearchUrl(searchParams);
            var expectedSearchUrl = 'api.tripda.com.br/trip/search/0/456789/2015-06-30?page=5';

            expect(searchUrl).to.be.eql(expectedSearchUrl);
        })
    });
});

