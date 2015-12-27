(function(isNode, isAngular) {
    function UserFactory() {
        this.create = create;

        function create() {
            return new User();
        }
    }

    function User() {
        var _name = false;
        var _picture = false;
        var _age = 0;
        var _average_rating = 0;

        this.setAverageRating = function(averageRating) {
            _average_rating = averageRating;
        }

        this.getAverageRating = function() {
            return _average_rating;
        }

        this.setAge = function(age) {
            _age = age;
        }

        this.getAge = function() {
            return _age;
        }

        this.setName = function(name) {
            _name = name;
        }

        this.getName = function() {
            return _name;
        }

        this.setPicture = function(picture) {
            _picture = picture;
        }

        this.getPicture = function() {
            return _picture;
        }
    }

    if (isNode) {
        module.exports = new UserFactory();
    } else if (isAngular) {
        angular
            .module('TripFinder')
            .provider('UserFactory', function() {
                this.$get = function() {
                    return new UserFactory();
                }
            });
    }
})(
    typeof module !== "undefined" && module.exports,
    typeof angular !== "undefined"
);

