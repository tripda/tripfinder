describe('Trip Factory', function() {
    var tripFactory;

    var apiResponseSearchFixture = require('../fixtures/api-response-search.js');

    beforeEach(function() {
        tripFactory = require('../../src/TripFactory.js');
    });

    it('create trip collection from Api Response', function() {
        var trips = tripFactory.createFromApiResponse(apiResponseSearchFixture);

        expect(trips.length).to.equal(3);

        var firstTrip = trips[0];

        expect(firstTrip.getGuid()).to.equal('9ca39793-b76c-4fef-b8a2-cf51d9424fc6');
        expect(firstTrip.getDepartureDateTime().getFullYear()).to.equal(2016);
        expect(firstTrip.getPrice()).to.equal(56);
        expect(firstTrip.getSeatsAvailable()).to.equal(2);
        expect(firstTrip.getLadiesOnly()).to.equal(true);

        expect(firstTrip.getDriver().getPicture()).to.equal('https://graph.facebook.com/100005369929083/picture?width=150&height=150');
    });
});

