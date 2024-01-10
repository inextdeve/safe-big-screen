(function (win) {
    var HashMap = function () {
        this._initial();
    }

    HashMap.prototype = {
        _initial: function () {
            this.count = 0;
            this.entry = {};
        },
        put: function (key, value) {
            if (!this.containsKey(key)) {
                this.count++;
            }
            this.entry[key] = value;
        },
        get: function (key) {
            return this.containsKey(key) ? this.entry[key] : null;
        },
        remove: function (key) {
            var item = this.entry[key];
            if (this.containsKey(key) && (delete this.entry[key])) {
                this.count--;
            }
            return item;
        },
        removeArr: function (arr) {
            for (var i = 0; i < arr.length; i++) {
                this.remove(arr[i])
            }
        },
        containsKey: function (key) {
            return (key in this.entry);
        },
        containsValue: function (value) {
            for (var prop in this.entry) {
                if (this.entry[prop] == value) {
                    return true;
                }
            }
            return false;
        },
        getValues: function () {
            var values = [];
            for (var prop in this.entry) {
                values.push(this.entry[prop]);
            }
            return values;
        },
        getFirstKey: function () {
            for (var prop in this.entry) {
                return prop;
            }
        },
        getKeys: function () {
            var keys = [];
            for (var prop in this.entry) {
                keys.push(prop);
            }
            return keys;
        },
        size: function () {
            return this.count;
        },
        clear: function () {
            this.count = 0;
            this.entry = {};
        },
        each: function (callback) {
            for (var key in this.entry) {
                var value = this.entry[key];
                callback(key, value);
            }
        }
    }
    win.HashMap = HashMap;
})(window)