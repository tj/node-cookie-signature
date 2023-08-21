/**
 * Module dependencies.
 */
const crypto = require('node:crypto');

const encoder = new TextEncoder();

/**
 * Sign the given `val` with `secret`.
 *
 * @param {String} value
 * @param {String} secret
 * @return {Promise<String>}
 * @api public
 */
exports.sign = async (value, secret) => {
  if (typeof value !== "string") {
    throw new TypeError("Cookie value must be provided as a string.");
  }
  if (typeof secret !== "string") {
    throw new TypeError("Secret key must be provided as a string.");
  }

  const data = encoder.encode(value);
  const key = await createKey(secret, ["sign"]);
  const signature = await crypto.webcrypto.subtle.sign("HMAC", key, data);
  const hash = btoa(String.fromCharCode(...new Uint8Array(signature))).replace(
      /=+$/,
      ""
  );

  return `${value}.${hash}`;
};

/**
 * Unsign and decode the given `input` with `secret`,
 * returning `false` if the signature is invalid.
 *
 * @param {String} cookie
 * @param {String} secret
 * @return {Promise<String|false>}
 * @api public
 */
exports.unsign = async (cookie, secret) => {
  if (typeof cookie !== "string") {
    throw new TypeError("Signed cookie string must be provided.");
  }
  if (typeof secret !== "string") {
    throw new TypeError("Secret key must be provided.");
  }

  const value = cookie.slice(0, cookie.lastIndexOf("."));
  const hash = cookie.slice(cookie.lastIndexOf(".") + 1);

  const data = encoder.encode(value);
  const key = await createKey(secret, ["verify"]);
  const signature = byteStringToUint8Array(atob(hash));
  const valid = await crypto.webcrypto.subtle.verify("HMAC", key, signature, data);

  return valid ? value : false;
};

/**
 * @param {String} secret
 * @param {ReadonlyArray<KeyUsage>} usages
 * @return {Promise<CryptoKey>}
 * @api private
 */
const createKey = async (secret, usages) =>
    crypto.webcrypto.subtle.importKey(
        "raw",
        encoder.encode(secret),
        { name: "HMAC", hash: "SHA-256" },
        false,
        usages
    );

/**
 * @param {String} byteString
 * @return {Uint8Array}
 * @api private
 */
const byteStringToUint8Array = (byteString) => {
  const array = new Uint8Array(byteString.length);

  for (let i = 0; i < byteString.length; i++) {
    array[i] = byteString.charCodeAt(i);
  }

  return array;
};
