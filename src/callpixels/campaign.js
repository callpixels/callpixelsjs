(function () {
    // Dependencies
    var RequestNumber = Callpixels.Base.RequestNumber;
    /**
     * @constructor
     * @memberOf Callpixels
     * @param {Object} options
     * @param {String} options.campaign_key - Campaign key
     */
    var Campaign = function (options) {

        function initialize(data) {
            // initialize data store
            self.store(data);
        }

        var self = this;
        self.type = 'campaigns';
        self.primary_key('campaign_key');
        self.numbers = [];

        /**
         * Fetch a campaign number.
         * @memberOf Callpixels.Campaign
         * @function request_number
         * @instance
         * @param {Object} tags - Numbers will be returned that match these tags
         * @param {getNumberCallback} callback - Callback fired after the request completes.
         */
        self.request_number = function (tags, callback) {
            // assign the tags (this is important since it runs it through set_number_matching_tags)
            self.set('number_matching_tags', tags);
            // request the number
            new RequestNumber(self.get('campaign_key', 'number_matching_tags')).perform(function (data) {
                // initialize number
                var number = new Callpixels.Number(data.number);
                // call callback
                callback.apply(self, [number]);
            });
        };
        /**
         * Callpixels.Campaign#request_number callback fired after the request completes.
         * @callback getNumberCallback
         * @param {Callpixels.Campaign} - The campaign that made the request
         * @param {Callpixels.Number} - The number that was returned
         */

        self.numbers = function () {
            var output = [];
            if (typeof(Callpixels.Base.Data._store) !== 'undefined') {
                // get numbers
                var numbers = Callpixels.Base.Data._store['numbers'];
                // present?
                if (typeof(numbers) !== 'undefined') {
                    // collect numbers matching this campaign
                    for (var primary_key in numbers) {
                        var number = numbers[primary_key];
                        if (self.get('campaign_key') == number.campaign_key) {
                            output.push(new Callpixels.Number(number));
                        }
                    }
                }
            }
            return output;
        };

        self.set_number_matching_tags = function (tags) {
            if (typeof(tags) === 'string') {
                tags = Callpixels.Number.extract_tags_from_string(tags);
            }
            if (tags && (typeof tags === "object") && !(tags instanceof Array)) {
                return tags
            }
            else {
                throw "ArgumentError: Expected number_matching_tags to be an object. eg: {tag: 'value'}";
            }
        };

        initialize(options);
    };
    Campaign.prototype = new Callpixels.Base.Model();
    Callpixels.Campaign = Campaign;
})();