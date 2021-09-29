import {settings} from "$lib/stores";
import {writable} from "svelte/store";
import {subscribeButIgnoreFirst} from "$lib/helper/utils";
import {browser} from "$app/env";
import {deleteDisplayPreferences, updateDisplayPreferences} from "$lib/api/internal";

export const blurBackdropImages = writable<boolean>(false)
export const showHeroImages = writable<boolean>(false)
export const maxBitrate = writable<number>(-1)

if(browser) {
    subscribeButIgnoreFirst(settings, updateDisplayPreferences)
    settings.subscribe(settings => {
        blurBackdropImages.set(settings["images.blur"] !== "false")
        showHeroImages.set(settings["images.hero"] !== "false")
        maxBitrate.set(settings["bitrate"] ?? 80000000)
    })
}

export const deletePreferences = async () => {
    await deleteDisplayPreferences()
    settings.set({})
}
export const updatePreference = (identifier: string, value: any) => {
    settings.update(preferences => {
        preferences[identifier] = value
        return preferences
    })
}