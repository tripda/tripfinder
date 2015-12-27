(function(isNode, isAngular) {
    function TripFactory(
        userFactory
    ) {
        var _userFactory = userFactory;

        this.setUserFactory = setUserFactory;
        this.createFromApiResponse = createFromApiResponse;

        function setUserFactory(userFactory) {
            _userFactory = userFactory;
        }

        function createFromApiResponse(apiResponse) {
            var trips = [];

            for (var i in apiResponse.result) {
                var resultItem = apiResponse.result[i];
                var trip = new Trip(resultItem);
                var driver = _userFactory.create();

                trip.setGuid(resultItem.trip_leg_guid);
                trip.setDepartureDateTime(new Date(resultItem.departure_datetime));
                trip.setCities(resultItem.cities);
                trip.setPrice(resultItem.price);
                trip.setPriceLevel(resultItem.price_level);
                trip.setCurrencySign(resultItem.currency_sign);
                trip.setSeatsAvailable(resultItem.seats_available);
                trip.setLadiesOnly(resultItem.ladies_only);
                trip.setAutoAccept(resultItem.auto_accept);

                driver.setName(resultItem.driver_member_name);
                driver.setPicture(resultItem.driver_picture_url);
                driver.setAge(resultItem.driver_age);
                driver.setAverageRating(resultItem.driver_average_rating);

                trip.setDriver(driver);

                trips.push(trip);
            }

            return trips;
        }
    }

    function Trip(data) {
        var _guid = false;
        var _driver = null;
        var _departureDateTime = new Date();
        var _cities = [];
        var _price = 0;
        var _priceLevel = 0;
        var _currencySign = false;
        var _seatsAvailable = 0;
        var _ladiesOnly = false;
        var _autoAccept = false;

        this.setAutoAccept = function(autoAccept) {
            _autoAccept = autoAccept;
        }

        this.isAutoAccept = function() {
            return _autoAccept;
        }

        this.setPriceLevel = function(priceLevel) {
            _priceLevel = priceLevel;
        }

        this.getPriceLevel = function() {
            return _priceLevel;
        }

        this.setCities = function(cities) {
            _cities = cities;
        }

        this.getCities = function() {
            return _cities;
        }

        this.getOriginCity = function() {
            return _cities[0].name;
        }

        this.getOriginAddress = function() {
            return _cities[0].address;
        }

        this.getDestinationCity = function() {
            return _cities[1].name;
        }

        this.getDestinationAddress = function() {
            return _cities[1].address;
        }

        this.setDriver = function(driver) {
            _driver = driver;
        }

        this.getDriver = function() {
            return _driver;
        }

        this.setDepartureDateTime = function(departureDateTime) {
            _departureDateTime = departureDateTime;
        }

        this.getDepartureDateTime = function() {
            return _departureDateTime;
        }

        this.setSeatsAvailable = function(seatsAvailable) {
            _seatsAvailable = seatsAvailable;
        }

        this.getSeatsAvailable = function() {
            return _seatsAvailable;
        }

        this.setGuid = function(guid) {
            _guid = guid;
        }

        this.getGuid = function() {
            return _guid;
        }

        this.setPrice = function(price) {
            _price = price;
        }

        this.getPrice = function() {
            return _price;
        }

        this.setCurrencySign = function(currencySign) {
            _currencySign = currencySign;
        }

        this.getCurrencySign = function() {
            return _currencySign;
        }

        this.setLadiesOnly = function(ladiesOnly) {
            _ladiesOnly = ladiesOnly;
        }

        this.getLadiesOnly = function() {
            return _ladiesOnly;
        }
    }

    if (isNode) {
        module.exports = new TripFactory(
            require('../src/UserFactory.js')
        );
    } else if (isAngular) {
        angular
            .module('TripFinder')
            .provider('TripFactory', function() {
                this.$get = [
                    'UserFactory',
                    function(userFactory) {
                        return new TripFactory(
                            userFactory
                        );
                    }];
            });
    }
})(
    typeof module !== "undefined" && module.exports,
    typeof angular !== "undefined"
);

