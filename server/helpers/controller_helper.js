const ObjectId = require('mongoose').Types.ObjectId;

module.exports = {
  isValidObjectId: (idToCheck) => {
    const validObjectId = ObjectId.isValid(idToCheck);
        if (!validObjectId) {
            return false;
        }
        return true;
  }
}