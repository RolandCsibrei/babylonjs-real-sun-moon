"use strict";
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
Object.defineProperty(exports, "__esModule", { value: true });
exports.get = void 0;
function get(object, property, defaultValue) {
    var key = property;
    return (object[key] === undefined ? defaultValue : object[key]);
}
exports.get = get;
