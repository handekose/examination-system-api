const { database } = require("./googleFirestoreAdmin")

let getCollection = (collectionName) => {
    var docRef = database.collection(collectionName);
    return docRef;
}

module.exports = {
   getCollection : getCollection
};

