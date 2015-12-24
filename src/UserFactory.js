(function(isNode, isAngular) {
    function UserFactory() {
        this.create = create;

        function create() {
            return new User();
        }
    }

    function User() {
        var _picture = false;

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

