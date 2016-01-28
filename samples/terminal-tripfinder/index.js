var finder = require('../../index.js');
var blessed = require('blessed');
var bcontrib = require('blessed-contrib');

var argv = require('yargs').argv;

if (!argv.key) {
    console.log('You need an API Key.');
    return;
}

if (!argv.origin && !argv.destination) {
    console.log('Please define an origin or a destination.');
    return;
}

finder.setGeocoderKey(argv.key);

finder.setOrigin(argv.origin);
finder.setDestination(argv.destination);

finder
    .find()
    .then(function(trips) {
        var screen = blessed.screen({
            smartCSR: true
        });

        var grid = new bcontrib.grid({
            rows: 12,
            cols: 12,
            screen: screen
        });

        var tripMenu = grid.set(7, 0, 5, 12, bcontrib.table, {
            keys: true,
            selectedBg: 'blue',
            columnWidth: [40, 40, 40],
            label: 'Choose a Trip'
        });

        tripMenu.setData({
            headers: ['Origin', 'Destination', 'Driver'],
            data: buildTripMenuArray(trips)
        });

        tripMenu.rows.on('select', function(obj, index) {
            var trip = trips[index];

            var map = grid.set(0, 5, 7, 7, bcontrib.map, {
            });

            var tripDetails = grid.set(0, 0, 4, 5, bcontrib.markdown, {
                label: 'Trip Details #' + trip.getGuid().toLowerCase()
            });

            var tripDetailsText = 'Origin: ' + trip.getOriginAddress() + '\n';
            tripDetailsText += 'Destination: ' + trip.getDestinationAddress() + '\n';
            tripDetailsText += 'Price: ' + trip.getCurrencySign() + trip.getPrice() + '\n';
            tripDetailsText += 'Seats Available: ' + trip.getSeatsAvailable() + '\n';
            tripDetailsText += 'Auto Accept: ' + (trip.isAutoAccept() ? "Yes" : "No") + '\n';
            tripDetailsText += 'For Ladies Only: ' + (trip.getLadiesOnly() ? "Yes" : "No") + '\n';

            tripDetails.setMarkdown(tripDetailsText);

            var driverDetails = grid.set(4, 0, 3, 5, bcontrib.markdown, {
                label: 'Driver Details'
            });

            var driverDetailsText = 'Name: ' + trip.getDriver().getName() + '\n';
            driverDetailsText += 'Age: ' + trip.getDriver().getAge() + '\n';
            driverDetailsText += 'Average Rating: ' + trip.getDriver().getAverageRating() + '\n';

            driverDetails.setMarkdown(driverDetailsText);

            screen.render();
        });

        tripMenu.focus();

        screen.key(['escape', 'q', 'C-c'], function(ch, key) {
            return process.exit(0);
        });

        screen.render();
    });

function buildTripMenuArray(trips) {
    var menu = [];

    for (var i in trips) {
        var item = [];

        item.push(trips[i].getOriginAddress());
        item.push(trips[i].getDestinationAddress());
        item.push(trips[i].getDriver().getName());

        menu.push(item);
    }

    return menu;
}
