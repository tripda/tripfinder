describe('Geocoder', function() {

    var geocoder;

    var httpClientMock = sinon.stub().returns(q.when(require('../fixtures/google-api-response.js')));

    beforeEach(function() {
        geocoder = require('../../src/Geocoder.js');

        geocoder.setHttpClient(httpClientMock);
    });

    it('error is thrown when attempting to use geocoder without providing key', function(done) {
        geocoder.geocode('New York')
            .then(null, function(error) {
                expect(error.message).to.equal('In order to use the Geocoder, you must provide an API key from Google.');

                done();
            });
    });

    it('convert address string into geo coordinates by requesting via the http client', function(done) {
        geocoder.setKey('MY_KEY');

        geocoder.geocode('New York')
            .then(function(location) {

                expect(httpClientMock).to.have.been.calledWith({
                    uri: 'https://maps.googleapis.com/maps/api/geocode/json',
                    qs: {
                        key: 'MY_KEY',
                        address: 'New York'
                    },
                    json: true
                });

                expect(location).to.deep.equal({"lat" : 40.7127837, "lng" : -74.0059413});

                done();
            });
    });

});
