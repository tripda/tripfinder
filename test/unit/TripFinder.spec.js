describe('Trip Finder', function() {
    var tripFinder;

    var URL_BUILDER_MOCK_BUILD_RETURN = "http://myserver.com/search/";
    var HTTP_CLIENT_MOCK_RETURN = {};
    var TRIP_FACTORY_CREATE_FROM_API_RESPONSE_RETURN = [];

    var urlBuilderMock = {
        buildSearchUrl: sinon.stub().returns(URL_BUILDER_MOCK_BUILD_RETURN)
    };

    var httpClientMock = sinon.stub().returns(q.when(HTTP_CLIENT_MOCK_RETURN));

    var tripFactoryMock = {
        createFromApiResponse: sinon.stub().returns(TRIP_FACTORY_CREATE_FROM_API_RESPONSE_RETURN)
    };

    beforeEach(function() {
        tripFinder = require('../../src/TripFinder.js');

        tripFinder.setUrlBuilder(urlBuilderMock);
        tripFinder.setHttpClient(httpClientMock);
        tripFinder.setTripFactory(tripFactoryMock);
        tripFinder.resetSearchParameters();
    });

    it('find trips', function(done) {
        var expectedParams = {
            fromGeohash: '123456'
        };

        tripFinder.setOrigin('123456');

        tripFinder.find()
            .then(function(result) {
                expect(urlBuilderMock.buildSearchUrl).to.have.been.calledWith(expectedParams);
                
                expect(httpClientMock).to.have.been.calledWith({
                    uri: URL_BUILDER_MOCK_BUILD_RETURN,
                    json: true
                });

                expect(tripFactoryMock.createFromApiResponse).to.have.been.calledWith(HTTP_CLIENT_MOCK_RETURN);

                expect(result).to.equal(TRIP_FACTORY_CREATE_FROM_API_RESPONSE_RETURN);

                done();
            });
    });

    it('reset all parameters', function() {
        tripFinder.setOrigin('123456');

        tripFinder.resetSearchParameters();

        expect(tripFinder.getOrigin()).to.be.false;
    });

    describe('errors', function() {
        it('is thrown when attempting to find trips without defining an origin', function(done) {
            tripFinder
                .find()
                .then(null, function(error) {
                    expect(error.message).to.equal('Cannot find trips with undefined origin and destination.');

                    done();
                });
        });
    });
});
