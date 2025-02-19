import {writable} from "svelte/store";
import type {Settings} from "$lib/typings/jellyfin";

export const noPadding = writable<boolean>(false)
export const modal = writable(null)
export const settings = writable<Settings>({})