describe('Trip Finder', function() {
    var tripFinder;

    var URL_BUILDER_MOCK_BUILD_RETURN = "http://myserver.com/search/";
    var HTTP_CLIENT_MOCK_RETURN = {};
    var TRIP_FACTORY_CREATE_FROM_API_RESPONSE_RETURN = [];
    var GEOCODER_GEOCODE_RETURN = {lat: '123', lng: '456'};
    var GEOHASH_ENCODER_ENCODE_RETURN = 'abcdefg';

    var urlBuilderMock = {
        buildSearchUrl: sinon.stub().returns(URL_BUILDER_MOCK_BUILD_RETURN)
    };

    var httpClientMock = sinon.stub().returns(q.when(HTTP_CLIENT_MOCK_RETURN));

    var tripFactoryMock = {
        createFromApiResponse: sinon.stub().returns(TRIP_FACTORY_CREATE_FROM_API_RESPONSE_RETURN)
    };

    var geocoderMock = {
        geocode: sinon.stub().returns(q.when(GEOCODER_GEOCODE_RETURN)),
        setKey: sinon.stub()
    };

    var geohashEncoderMock = {
        encode: sinon.stub().returns(GEOHASH_ENCODER_ENCODE_RETURN)
    };

    beforeEach(function() {
        tripFinder = require('../../src/TripFinder.js');

        tripFinder.setUrlBuilder(urlBuilderMock);
        tripFinder.setHttpClient(httpClientMock);
        tripFinder.setTripFactory(tripFactoryMock);
        tripFinder.setGeocoder(geocoderMock);
        tripFinder.setGeohashEncoder(geohashEncoderMock);
        tripFinder.resetSearchParameters();
    });

    it('find trips', function(done) {
        var expectedParams = {
            fromGeohash: '123456',
            toGeohash: '654321'
        };

        tripFinder.setOrigin('123456');
        tripFinder.setDestination('654321');

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

    it('use geocoder and geohash encoder when origin is set as address string', function(done) {
        tripFinder.setOrigin('New York');
        tripFinder.setDestination('San Francisco');

        tripFinder.find()
            .then(function() {
                var expectedParams = {
                    fromGeohash: GEOHASH_ENCODER_ENCODE_RETURN,
                    toGeohash: GEOHASH_ENCODER_ENCODE_RETURN,
                };

                expect(geocoderMock.geocode).to.have.been.calledWith('New York');
                expect(geocoderMock.geocode).to.have.been.calledWith('San Francisco');

                expect(geohashEncoderMock.encode).to.have.been.calledWith(
                    GEOCODER_GEOCODE_RETURN.lat,
                    GEOCODER_GEOCODE_RETURN.lng
                )

                expect(urlBuilderMock.buildSearchUrl).to.have.been.calledWith(expectedParams);

                done();
            });
    });

    it('set geocoder api key', function() {
        tripFinder.setGeocoderKey('MY_KEY');

        expect(geocoderMock.setKey).to.have.been.calledWith('MY_KEY');
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
