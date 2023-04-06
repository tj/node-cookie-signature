/// <reference types="node" />
import type { Buffer } from "node:crypto";
/** Sign the given `val` with `secret`. */
export function sign(value: string, secret: string | Buffer): string;

/**
 * Unsign and decode the given `val` with `secret`,
 * returning `false` if the signature is invalid.
 */
export function unsign(value: string, secret: string | Buffer): string | false;