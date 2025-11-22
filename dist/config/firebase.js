"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.messaging = exports.storage = exports.auth = exports.db = void 0;
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const env_1 = __importDefault(require("./env"));
const serviceAccount = {
    projectId: env_1.default.FIREBASE_PROJECT_ID,
    clientEmail: env_1.default.FIREBASE_CLIENT_EMAIL,
    privateKey: env_1.default.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
};
firebase_admin_1.default.initializeApp({
    credential: firebase_admin_1.default.credential.cert(serviceAccount),
    storageBucket: env_1.default.STORAGE_BUCKET,
});
exports.db = firebase_admin_1.default.firestore();
exports.auth = firebase_admin_1.default.auth();
exports.storage = firebase_admin_1.default.storage();
exports.messaging = firebase_admin_1.default.messaging();
// Enable offline persistence for better performance
exports.db.settings({ ignoreUndefinedProperties: true });
exports.default = firebase_admin_1.default;
//# sourceMappingURL=firebase.js.map