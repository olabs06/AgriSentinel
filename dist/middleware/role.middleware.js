"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = void 0;
const errors_1 = require("../utils/errors");
const firebase_1 = require("../config/firebase");
const authorize = (...roles) => {
    return async (req, res, next) => {
        try {
            if (!req.user) {
                throw new errors_1.ForbiddenError('User not authenticated');
            }
            const userDoc = await firebase_1.db.collection('users').doc(req.user.uid).get();
            const userData = userDoc.data();
            if (!userData || !roles.includes(userData.role)) {
                throw new errors_1.ForbiddenError('Insufficient permissions');
            }
            next();
        }
        catch (error) {
            next(error);
        }
    };
};
exports.authorize = authorize;
//# sourceMappingURL=role.middleware.js.map