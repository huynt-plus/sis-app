'use strict';

// node.js usage for tests
var Logging = {
    level: 0,
    log: function (message) { console.log(message); }
};

var AuthenticationContext;
if (typeof module !== 'undefined' && module.exports) {
    module.exports.inject = function (conf) {
        return new AuthenticationContext(conf);
    };
}

AuthenticationContext = function (config) {
    /**
    * Enum for request type
    * @enum {string}
    */
    this.REQUEST_TYPE = {
        LOGIN: 'LOGIN',
        RENEW_TOKEN: 'RENEW_TOKEN',
        ID_TOKEN: 'ID_TOKEN',
        UNKNOWN: 'UNKNOWN'
    };

    /**
    * Enum for storage constants
    * @enum {string}
    */
    this.CONSTANTS = {
        STORAGE: {
            ACCESS_TOKEN_KEY: 'auth.access.token.key',
            EXPIRATION_KEY: 'auth.expiration.key',
            USERNAME: 'auth.username',
        },
        RESOURCE_DELIMETER: '|',
        ERR_MESSAGES: {
            NO_TOKEN: 'User is not authorized',
            TOKEN_REFRESH_TIMED_OUT: 'Token refresh request timed out'
        },
        LOGGING_LEVEL: {
            ERROR: 0,
            WARN: 1,
            INFO: 2,
            VERBOSE: 3
        },
        LEVEL_STRING_MAP: {
            0: 'ERROR:',
            1: 'WARNING:',
            2: 'INFO:',
            3: 'VERBOSE:'
        },
        TOKEN_REFRESH_TIMEOUT: 60000
    };

    if (AuthenticationContext.prototype._singletonInstance) {
        return AuthenticationContext.prototype._singletonInstance;
    }
    AuthenticationContext.prototype._singletonInstance = this;

    // public
    this.config = {};

    // private
    this._user = null;

    this.config = this._cloneConfig(config);
};

/**
 * Gets initial Idtoken for the app backend
 * Saves the resulting Idtoken in localStorage.
 */
AuthenticationContext.prototype.login = function (accessToken, userName) {
    // Token is not present and user needs to login
    this._saveItem(this.CONSTANTS.STORAGE.ACCESS_TOKEN_KEY, accessToken);
    this._saveItem(this.CONSTANTS.STORAGE.USERNAME, userName);
    this._saveItem(this.CONSTANTS.STORAGE.EXPIRATION_KEY, this._expiresIn(86400));

};

/**
* Gets token for the specified resource from local storage cache
* @param {string}   resource A URI that identifies the resource for which the token is valid.
* @returns {string} token if exists and not expired or null
*/
AuthenticationContext.prototype.getCachedToken = function () {
    if (!this._hasResource()) {
        return null;
    }

    var token = this._getItem(this.CONSTANTS.STORAGE.ACCESS_TOKEN_KEY);
    var expired = this._getItem(this.CONSTANTS.STORAGE.EXPIRATION_KEY);

    if (expired && (expired > this._now())) {
        return token;
    } else {
        this._saveItem(this.CONSTANTS.STORAGE.ACCESS_TOKEN_KEY, '');
        this._saveItem(this.CONSTANTS.STORAGE.EXPIRATION_KEY, 0);
        return null;
    }

    return null;
};

AuthenticationContext.prototype._hasResource = function () {
    var keys = this._getItem(this.CONSTANTS.STORAGE.ACCESS_TOKEN_KEY);
    return keys && !this._isEmpty(keys);
};

/**
* Retrieves and parse idToken from localstorage
* @returns {User} user object
*/
AuthenticationContext.prototype.getCachedUser = function () {
    if (this._user) {
        return this._user;
    }

    var accessToken = this._getItem(this.CONSTANTS.STORAGE.ACCESS_TOKEN_KEY);
    var userName = this._getItem(this.CONSTANTS.STORAGE.USERNAME);
    this._user = this._createUser(accessToken, userName);
    return this._user;
};

AuthenticationContext.prototype._createUser = function (idToken, userName) {
    var user = null;
    if (idToken) {
        user = {
            userName: userName,
            accessToken: idToken
        };
    }

    return user;
};


AuthenticationContext.prototype.clearCacheForResource = function () {
    if (this._hasResource()) {
        this._saveItem(this.CONSTANTS.STORAGE.ACCESS_TOKEN_KEY, '');
        this._saveItem(this.CONSTANTS.STORAGE.EXPIRATION_KEY, 0);
    }
};


/**
* Clear cache items.
*/
AuthenticationContext.prototype.clearCache = function () {
    this._saveItem(this.CONSTANTS.STORAGE.ACCESS_TOKEN_KEY, '');
    this._saveItem(this.CONSTANTS.STORAGE.EXPIRATION_KEY, 0);
};


/**
* Logout user will redirect page to logout endpoint.
* After logout, it will redirect to post_logout page if provided.
*/
AuthenticationContext.prototype.logOut = function () {
    this.clearCache();
    var logout = '';
    this._user = null;
};

AuthenticationContext.prototype._isEmpty = function (str) {
    return (typeof str === 'undefined' || !str || 0 === str.length);
};

/**
 * Gets login error
 * @returns {string} error message related to login
 */
AuthenticationContext.prototype.getLoginError = function () {
    return this._getItem(this.CONSTANTS.STORAGE.LOGIN_ERROR);
};


AuthenticationContext.prototype._convertUrlSafeToRegularBase64EncodedString = function (str) {
    return str.replace('-', '+').replace('_', '/');
};

AuthenticationContext.prototype._serialize = function (responseType, obj, resource) {
    var str = [];
    if (obj !== null) {
        str.push('?response_type=' + responseType);
        str.push('client_id=' + encodeURIComponent(obj.clientId));
        if (resource) {
            str.push('resource=' + encodeURIComponent(resource));
        }

        str.push('redirect_uri=' + encodeURIComponent(obj.redirectUri));
        str.push('state=' + encodeURIComponent(obj.state));

        if (obj.hasOwnProperty('slice')) {
            str.push('slice=' + encodeURIComponent(obj.slice));
        }

        if (obj.hasOwnProperty('extraQueryParameter')) {
            str.push(obj.extraQueryParameter);
        }

        if (obj.correlationId) {
            str.push('client-request-id=' + encodeURIComponent(obj.correlationId));
        }
    }

    return str.join('&');
};

AuthenticationContext.prototype._deserialize = function (query) {
    var match,
        pl = /\+/g,  // Regex for replacing addition symbol with a space
        search = /([^&=]+)=?([^&]*)/g,
        decode = function (s) { return decodeURIComponent(s.replace(pl, ' ')); },
        obj = {};
    match = search.exec(query);
    while (match) {
        obj[decode(match[1])] = decode(match[2]);
        match = search.exec(query);
    }

    return obj;
};

AuthenticationContext.prototype._expiresIn = function (expires) {
    return this._now() + parseInt(expires, 10);
};

AuthenticationContext.prototype._now = function () {
    return Math.round(new Date().getTime() / 1000.0);
};

AuthenticationContext.prototype._saveItem = function (key, obj) {

    if (this.config && this.config.cacheLocation && this.config.cacheLocation === 'localStorage') {

        if (!this._supportsLocalStorage()) {
            this.info('Local storage is not supported');
            return false;
        }

        localStorage.setItem(key, obj);

        return true;
    }

    // Default as session storage
    if (!this._supportsSessionStorage()) {
        this.info('Session storage is not supported');
        return false;
    }

    sessionStorage.setItem(key, obj);
    return true;
};

AuthenticationContext.prototype._getItem = function (key) {

    if (this.config && this.config.cacheLocation && this.config.cacheLocation === 'localStorage') {

        if (!this._supportsLocalStorage()) {
            this.info('Local storage is not supported');
            return null;
        }

        return localStorage.getItem(key);
    }

    // Default as session storage
    if (!this._supportsSessionStorage()) {
        this.info('Session storage is not supported');
        return null;
    }

    return sessionStorage.getItem(key);
};

AuthenticationContext.prototype._supportsLocalStorage = function () {
    try {
        return 'localStorage' in window && window['localStorage'];
    } catch (e) {
        return false;
    }
};

AuthenticationContext.prototype._supportsSessionStorage = function () {
    try {
        return 'sessionStorage' in window && window['sessionStorage'];
    } catch (e) {
        return false;
    }
};

AuthenticationContext.prototype._cloneConfig = function (obj) {
    if (null === obj || 'object' !== typeof obj) {
        return obj;
    }

    var copy = {};
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) {
            copy[attr] = obj[attr];
        }
    }
    return copy;
};

AuthenticationContext.prototype._libVersion = function () {
    return '1.0.0';
};

AuthenticationContext.prototype.log = function (level, message, error) {
    if (level <= Logging.level) {
        var correlationId = this.config.correlationId;
        var timestamp = new Date().toUTCString();

        var formattedMessage = timestamp + ':' + correlationId + '-' + this.CONSTANTS.LEVEL_STRING_MAP[level] + ' ' + message;

        if (error) {
            formattedMessage += '\nstack:\n' + error.stack;
        }

        Logging.log(formattedMessage);
    }
};

AuthenticationContext.prototype.error = function (message, error) {
    this.log(this.CONSTANTS.LOGGING_LEVEL.ERROR, message, error);
};

AuthenticationContext.prototype.warn = function (message) {
    this.log(this.CONSTANTS.LOGGING_LEVEL.WARN, message, null);
};

AuthenticationContext.prototype.info = function (message) {
    this.log(this.CONSTANTS.LOGGING_LEVEL.INFO, message, null);
};

AuthenticationContext.prototype.verbose = function (message) {
    this.log(this.CONSTANTS.LOGGING_LEVEL.VERBOSE, message, null);
};
