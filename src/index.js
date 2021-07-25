/**
 * vmongo | Copyright (C) 2021 | vironlab.eu
 * Licensed under the MIT License
 *
 * ___    _______                        ______         ______
 * __ |  / /___(_)______________ _______ ___  / ______ ____  /_
 * __ | / / __  / __  ___/_  __ \__  __ \__  /  _  __ `/__  __ \
 * __ |/ /  _  /  _  /    / /_/ /_  / / /_  /___/ /_/ / _  /_/ /
 * _____/   /_/   /_/     \____/ /_/ /_/ /_____/\__,_/  /_.___/
 *
 * ____  _______     _______ _     ___  ____  __  __ _____ _   _ _____
 * |  _ \| ____\ \   / / ____| |   / _ \|  _ \|  \/  | ____| \ | |_   _|
 * | | | |  _|  \ \ / /|  _| | |  | | | | |_) | |\/| |  _| |  \| | | |
 * | |_| | |___  \ V / | |___| |__| |_| |  __/| |  | | |___| |\  | | |
 * |____/|_____|  \_/  |_____|_____\___/|_|   |_|  |_|_____|_| \_| |_|
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 * IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
 * CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
 * TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 * You should have received a copy of the MIT License
 *
 * Repository:
 *     Github:          https://github.com/VironLab/vextension-web
 *     NPM:             https://www.npmjs.com/package/vextension-web
 * Contact:
 *     Discordserver:   https://discord.gg/wvcX92VyEH
 *     Website:         https://vironlab.eu/
 *     Mail:            contact@vironlab.eu
 *
 */

'use strict'; // https://www.w3schools.com/js/js_strict.asp

const MongoClient = require('mongodb').MongoClient;

const DRIVER_OPTIONS = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

class VMongoDriver {
    /**
     * Get the instance of the driver by giving a connection String
     * @param {String} connectionstring
     */
    constructor(connectionstring) {
        this.connectionstring = connectionstring;
    }

    /**
     * Get the instance of the driver by giving simply the following parameter ( wthout connection String )
     * @param {String} username
     * @param {String} password
     * @param {String} host
     * @param {Integer} port
     * @param {String} authenticationDatabase
     */
    static simple(username, password, host, port, authenticationDatabase) {
        if (!username || !password || !host) {
            throw new Error('Username Password and Host MUST be given.');
        }
        return new NodejsMongoDriver(`mongodb://${username}:${password}@${host}:${port != null ? port : '27017'}/${authenticationDatabase != null ? authenticationDatabase : 'admin'}`);
    }

    /**
     * Create a database at your MongoDB instance
     * @param {String} databaseName
     * @param {CallableFunction} callbackFunction
     */
    createDatabase = (databaseName, callbackFunction) => {
        MongoClient.connect(this.connectionstring + databaseName, DRIVER_OPTIONS, function (error, db) {
            if (error) return callbackFunction(false, error);
            db.close();
            if (callbackFunction) callbackFunction(true);
        });
    };

    /**
     * Async creation of a database at your MongoDB instance
     * @param {String} databaseName
     * @returns {Promise<Object>}
     */
    createDatabaseAsync = async (databaseName) => {
        return new Promise((resolve, reject) => {
            this.createDatabase(this.connectionstring, databaseName, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
    };

    /**
     * Create a collection in your given database
     * @param {String} databaseName
     * @param {String} collectionName
     * @param {CallableFunction} callbackFunction
     */
    createCollection = (databaseName, collectionName, callbackFunction) => {
        MongoClient.connect(this.connectionstring, DRIVER_OPTIONS, (error, db) => {
            if (error) return callbackFunction(false, error);
            var dbf = db.db(databaseName);
            dbf.createCollection(collectionName, function (err, result) {
                if (err) return callbackFunction(false, err);
                db.close();
                if (callbackFunction) callbackFunction(true);
            });
        });
    };

    /**
     * Async creation of a collection in your given database
     * @param {String} databaseName
     * @param {String} collectionName
     * @returns {Promise<Object>}
     */
    createCollectionAsync = async (databaseName, collectionName) => {
        return new Promise((resolve, reject) => {
            this.createCollection(this.connectionstring, databaseName, collectionName, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
    };

    /**
     * Search for an Object by give em an object to match
     * @param {String} databaseName
     * @param {String} collectionName
     * @param {Object} queryObject
     * @param {CallableFunction} callbackFunction
     */
    query = (databaseName, collectionName, queryObject, callbackFunction) => {
        MongoClient.connect(this.connectionstring, DRIVER_OPTIONS, (error, db) => {
            if (error) return callbackFunction(false, error);
            var dbf = db.db(databaseName);
            dbf.collection(collectionName)
                .find(queryObject)
                .toArray(function (err, result) {
                    if (err) return callbackFunction(false, err);
                    db.close();
                    if (callbackFunction) callbackFunction(result);
                });
        });
    };

    /**
     * async search for an Object by give em an object to match
     * @param {String} databaseName
     * @param {String} collectionName
     * @param {Object} queryObject
     * @returns {Promise<Object>}
     */
    queryAsync = async (databaseName, collectionName, queryObject) => {
        return new Promise((resolve, reject) => {
            this.query(databaseName, collectionName, queryObject, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
    };

    /**
     * Insert a new Object to the given Collection
     * @param {String} databaseName
     * @param {String} collectionName
     * @param {Object} onject
     * @param {CallableFunction} callbackFunction
     */
    insertObject = (databaseName, collectionName, object, callbackFunction) => {
        MongoClient.connect(this.connectionstring, DRIVER_OPTIONS, (error, db) => {
            if (error) return callbackFunction(false, error);
            var dbf = db.db(databaseName);
            dbf.collection(collectionName).insertOne(object, (err, result) => {
                if (err) return callbackFunction(false, err);
                db.close();
                if (callbackFunction) callbackFunction(true);
            });
        });
    };

    /**
     * Async insert a new Object to the given Collection
     * @param {String} databaseName
     * @param {String} collectionName
     * @param {Object} object
     * @returns {Promise<Object>}
     */
    insertObjectAsync = async (databaseName, collectionName, object) => {
        return new Promise((resolve, reject) => {
            this.insertObject(databaseName, collectionName, object, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
    };

    /**
     * Delete a queried object
     * @param {String} databaseName
     * @param {String} collectionName
     * @param {Object} queryObject
     * @param {CallableFunction} callbackFunction
     */
    deleteObject = (databaseName, collectionName, queryObject, callbackFunction) => {
        MongoClient.connect(this.connectionstring, DRIVER_OPTIONS, (error, db) => {
            if (error) return callbackFunction(false, error);
            var dbf = db.db(databaseName);
            dbf.collection(collectionName).deleteOne(queryObject, function (err, result) {
                if (err) return callbackFunction(false, err);
                db.close();
                if (callbackFunction) callbackFunction(true);
            });
        });
    };

    /**
     * Async delete a queried object
     * @param {String} databaseName
     * @param {String} collectionName
     * @param {Object} queryObject
     * @returns {Promise<Object>}
     */
    deleteObjectAsync = async (databaseName, collectionName, queryObject) => {
        return new Promise((resolve, reject) => {
            this.deleteObject(databaseName, collectionName, queryObject, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
    };

    /**
     * Update a queried object.. it inserts the given object key value pairs
     * @param {String} databaseName
     * @param {String} collectionName
     * @param {Object} queryObject
     * @param {Object} newValues
     * @param {CallableFunction} callbackFunction
     */
    updateObject = (databaseName, collectionName, queryObject, newValues, callbackFunction) => {
        MongoClient.connect(this.connectionstring, DRIVER_OPTIONS, (error, db) => {
            if (error) return callbackFunction(false, error);
            var dbf = db.db(databaseName);
            let obj = {
                $set: newValues,
            };
            dbf.collection(collectionName).updateOne(queryObject, obj, function (err, result) {
                if (err) return callbackFunction(false, err);
                db.close();
                if (callbackFunction) callbackFunction(true);
            });
        });
    };

    /**
     * Async Update a queried object.. it inserts the given object key value pairs
     * @param {String} databaseName
     * @param {String} collectionName
     * @param {Object} queryObject
     * @param {Object} newValues
     * @returns {Promise<Object>}
     */
    updateObjectAsync = async (databaseName, collectionName, queryObject, newValues) => {
        return new Promise((resolve, reject) => {
            this.updateObject(databaseName, collectionName, queryObject, newValues, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
    };
}

module.exports = VMongoDriver;
module.exports.VMongoDriver = VMongoDriver;
