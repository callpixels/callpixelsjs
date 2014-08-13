(function () {
    // Dependencies
    var Base = Callpixels.Base;
    /**
     * @constructor
     * @memberOf Callpixels
     * @param {Object} attributes - Attributes
     * @property {Object} attributes
     * @property {Number} attributes.id
     * @property {String} attributes.body
     * @property {String} attributes.number
     * @property {String} attributes.plain_number
     * @property {String} attributes.ref
     */
    Callpixels.Number = function (options) {

        var self = this;
        self.type = 'numbers';

        function initialize(data) {
            self.store(data);
            self.set('is_active', 'true');
        }

        /**
         * Add tags to a number.
         * @memberOf Callpixels.Number
         * @function add_tags
         * @instance
         * @param {Object} tags - A collection of tags {key: 'value', tag2: 'value2'}
         * @param {Function} callback - Callback that will be fired after request.
         */
        self.add_tags = function (tags, callback) {
            ensure_is_per_visitor();
            self.post_data('numbers/tag', tags_payload(tags), callback);
        };

        /**
         * Remove tags from a number.
         * @memberOf Callpixels.Number
         * @function remove_tags
         * @instance
         * @param {Object} tags - A collection of tags {key: 'value', tag2: 'value2'}
         * @param {Function} callback - Callback that will be fired after request.
         */
        self.remove_tags = function (tags, callback) {
            ensure_is_per_visitor();
            self.post_data('numbers/untag', tags_payload(tags), callback);
        };

        /**
         * Remove tags from a number.
         * @memberOf Callpixels.Number
         * @function remove_tags
         * @instance
         * @param {Array} keys - An array of keys to remove. eg: ['key1', 'key2']
         * @param {Function} callback - Callback that will be fired after request.
         */
        self.remove_tags_by_keys = function (keys, callback) {
            ensure_is_per_visitor();
            if (typeof(keys) === 'string') keys = keys.split(',');
            var payload = {
                tag_keys: keys,
                ids: [ get('id') ],
                campaign_key: get('campaign_key')
            };
            self.post_data('numbers/untag/keys', payload, callback);
        };

        /**
         * Clear all tags from a number.
         * @memberOf Callpixels.Number
         * @function clear_tags
         * @instance
         * @param {Function} callback - Callback that will be fired after request.
         */
        self.clear_tags = function (callback) {
            ensure_is_per_visitor();
            var payload = {
                ids: [ get('id') ],
                campaign_key: get('campaign_key'),
                all: 'true'
            };
            self.post_data('numbers/untag', payload, callback);
        };

        /**
         * Release number back to pool.
         * @memberOf Callpixels.Number
         * @function release
         * @instance
         */
        self.release = function () {
            self.set('is_active', 'false');
        };

        /**
         * Start a call immediately by having a campaign target dial the visitor.
         * @memberOf Callpixels.Number
         * @function initiate_call
         * @instance
         * @param {String} dial - The number to call.
         * @param {Object} payload
         * @param {Function} callback - Callback that will be fired after request.
         */
        self.initiate_call = function (dial, payload, callback) {
            if (typeof(payload) === 'undefined') payload = {};
            // assign dial to payload
            payload.dial = dial;
            // merge payload into payload
            payload = Base.merge(self.get('id', 'campaign_key'), payload);
            // post the payload
            self.post_data('numbers/initiate_call', payload, callback);
        };

        function tags_payload(tags) {
            if (typeof(tags) === 'string') tags = Callpixels.Number.extract_tags_from_string(tags);
            return {
                tag_values: tags,
                ids: [ get('id') ],
                campaign_key: get('campaign_key')
            };
        }

        function get(key) {
            return self.get(key);
        }

        function ensure_is_per_visitor() {
            if (self.get('is_per_visitor') === false) {
                throw "Error: Tried to add tags to non per-visitor number.";
            }
        }

        initialize(options);
    };

    Callpixels.Number.extract_tags_from_string = function (tags) {
        var output = {};
        var tags = tags.split(",");
        for (var i = 0; i < tags.length; i++) {
            var tag = tags[i].split(":");
            output[tag[0]] = tag[1]
        }
        return output;
    };

    Callpixels.Number.prototype = new Callpixels.Base.Model();

    function ping_active_numbers(callback) {
        if (typeof(Callpixels.Base.Data._store) !== 'undefined') {
            // get numbers
            var numbers = Callpixels.Base.Data._store['numbers'];
            // for each number
            if (typeof(numbers) !== 'undefined') {
                // group number_ids by campaign_key
                var grouped = {};
                for (var primary_key in numbers) {
                    var number = numbers[primary_key];
                    if (number.is_active === 'true') {
                        if (typeof(grouped[number.campaign_key]) === 'undefined') grouped[number.campaign_key] = [];
                        grouped[number.campaign_key].push(number.id);
                    }
                }
                // ping each group of number_ids
                for (var campaign_key in grouped) {
                    var payload = {
                        campaign_key: campaign_key,
                        ids: grouped[campaign_key]
                    };
                    Callpixels.Base.Request.connection().postJSON('/api/v1/numbers/ping', payload, [Callpixels.Base.Model.update, callback], this);
                }
            }
        }
        // call recursively
        setTimeout(ping_active_numbers, 15000);
    }

    // always ping active numbers
    ping_active_numbers();

})();