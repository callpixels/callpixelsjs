(function () {
    // Dependencies
    var Base = Callpixels.Base;
    /**
     * @constructor
     * @memberof Callpixels.Base
     * @param {Object}  config - Configuration hash
     * @param {String}  config.type - The data type
     * @param {Numeric}  config.primary_key - The primary_key
     */
    var Data = function (config) {

        function initialize() {
            Base.assert_required_keys(config, 'type', 'primary_key');
            if (typeof Callpixels.Base.Data._store[config.type] === 'undefined') {
                Callpixels.Base.Data._store[config.type] = {};
            }
            if (typeof Callpixels.Base.Data._store[config.type][config.primary_key] === 'undefined') {
                Callpixels.Base.Data._store[config.type][config.primary_key] = {};
            }
        }

        var self = this;

        /**
         * Request data from the host
         * @memberOf Callpixels.Base.Data
         * @function get
         * @instance
         * @param {String} key - The key to retrieve
         * @returns {*}
         */
        self.get = function () {
            var output = {};
            if (typeof arguments[0] === 'undefined') {
                output = Callpixels.Base.Data._store[config.type][config.primary_key];
            } else if (arguments.length === 1) {
                output = Callpixels.Base.Data._store[config.type][config.primary_key][arguments[0]];
            } else {
                for (var i = 0; i < arguments.length; i++) {
                    var key = arguments[i];
                    output[key] = Callpixels.Base.Data._store[config.type][config.primary_key][key];
                }
            }
            return output;
        };

        /**
         * Request data from the host
         * @memberOf Callpixels.Base.Data
         * @function set
         * @instance
         * @param {String} key - The key to retrieve
         * @param {String} value - The value to assign
         * @returns {*}
         */
        self.set = function (key, value) {
            Callpixels.Base.Data._store[config.type][config.primary_key][key] = value;
            return value;
        };

        /**
         * Merge data
         * @memberOf Callpixels.Base.Data
         * @function set
         * @instance
         * @param {String} object - The object to merge
         * @returns {*}
         */
        self.merge = function (object) {
            for (var key in object) {
                Callpixels.Base.Data._store[config.type][config.primary_key][key] = object[key];
            }
            return object;
        };

        initialize();
    };
    Data._store = {};
    Callpixels.Base.Data = Data;
})();