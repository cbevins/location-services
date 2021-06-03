/**
 * @file Defines Svelte stores for a currentLocation and a foundLocation.
 * @copyright 2021 Systems for Environmental Management
 * @author Collin D. Bevins, <cbevins@montana.com>
 * @license MIT
 */
import { writable } from 'svelte/store';
import { Location } from './Location.js'

// The Location currently in use by the application
export const currentLocation = writable(new Location())

// The Location found by the most recent search
export const foundLocation = writable(new Location())
