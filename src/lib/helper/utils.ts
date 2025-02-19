import type {JellyfinSession} from "$lib/typings/jellyfin";
import {icons} from "feather-icons";
import {bitrate} from "$lib/stores";
import {browser} from "$app/env";
import type {Item} from "$lib/typings/internal";
import {testBitrate} from "$lib/api/jellyfin/methods";

export const getIconByType = ({ type }: Item) => {
    let icon = "alert-triangle"

    if(type === "movie") icon = "film"
    else if(type === "episode") icon = "tv"
    else if(type === "show") icon = "bookmark"

    return icons[icon].toSvg()
}

export const removeClass = (element, className) => {
    if(element.classList) element.classList.remove(className)
    else element.className = element.className.replace(new RegExp("(^|\\b)" + className.split(" ").join("|") + "(\\b|$)", "gi"), " ")
}
export const addClass = (element, className) => {
    if (element.classList) element.classList.add(className)
    else element.className += " " + className
}

// https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
export const shuffleArray = (array: any[]) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]
    }
    return array
}
export const scrollUp = () => document.querySelector("#svelte > div") && document.querySelector("#svelte > div").scrollTo(0, 0)
export const bitrateTest = async (session: JellyfinSession) => {
    const byteSize = 5000000
    const now = new Date().getTime()

    await testBitrate(session)

    const responseTimeSeconds = (new Date().getTime() - now) / 1000;
    const bytesPerSecond = byteSize / responseTimeSeconds;
    const rate = Math.round(bytesPerSecond * 8);

    console.log("Bitrate", rate)
    bitrate.set(rate)
}
export const subscribeButIgnoreFirst = (store, callback) => {
    let first: boolean = true

    return store.subscribe(state => {
        try {
            if(typeof state === "object" && Object.keys(state).length === 0) return
        } catch(error) {}

        if(state == {}) return
        else if(first) first = false
        else callback(state)
    })
}

export const getBrowserName = () => {
    if((navigator.userAgent.indexOf("Opera") || navigator.userAgent.indexOf("OPR")) != -1 ) return "Opera"
    else if(navigator.userAgent.indexOf("Chrome") != -1 ) return "Chrome"
    else if(navigator.userAgent.indexOf("Safari") != -1) return "Safari"
    else if(navigator.userAgent.indexOf("Firefox") != -1 ) return "Firefox"
    // @ts-ignore
    else if((navigator.userAgent.indexOf("MSIE") != -1 ) || (!!document.documentMode == true )) return "IE"
    else return "Unknown"
}

type osTypes = "Mac OS" | "iOS" | "Windows" | "Android" | "Linux" | "unknown"
export const getOS = (): osTypes => {
    if(!browser) return "unknown"

    const userAgent = window.navigator.userAgent,
        platform = window.navigator.platform,
        macosPlatforms = ["Macintosh", "MacIntel", "MacPPC", "Mac68K"],
        windowsPlatforms = ["Win32", "Win64", "Windows", "WinCE"],
        iosPlatforms = ["iPhone", "iPad", "iPod"]
    let os: osTypes = "unknown"

    if(macosPlatforms.indexOf(platform) !== -1) os = "Mac OS"
    else if(iosPlatforms.indexOf(platform) !== -1) os = "iOS"
    else if(windowsPlatforms.indexOf(platform) !== -1) os = "Windows"
    else if(/Android/.test(userAgent)) os = "Android"
    else if(/Linux/.test(platform)) os = "Linux"

    return os
}

export const changeScrollDirection = (event: WheelEvent, element: HTMLElement) => {
    if(event.deltaX !== 0) return

    const parent = element.parentElement
    const style = getComputedStyle(parent)
    const rect = parent.getBoundingClientRect()

    const marginBottom = parseInt(style.marginBottom)
    const marginTop = parseInt(style.marginTop)
    const height = parseInt(style.height)
    const y = event.clientY - rect.top

    if(marginBottom < 0 && height - Math.abs(marginBottom) * 0.85 < y) return
    if(marginTop < 0 && Math.abs(marginTop) * 0.85 > y) return

    // @ts-ignore
    const delta = Math.max(-1, Math.min(1, (event.wheelDelta || -event.detail)))
    const scrollSpeed = 40

    element.scrollLeft -= (delta * scrollSpeed)
    event.preventDefault()
}

const MILLIS_PER_TICK = 10000
export const convertTicksToMillis = (ticks: number): number => ticks / MILLIS_PER_TICK

export const isInvalidParam = param => param == null || param == "null" || param == "false"
export const hash = value => {
    let hash = 5381, i = value.length
    while(i) hash = (hash * 33) ^ value.charCodeAt(--i)

    return hash >>> 0
}

export const compareObjects = (a, b) => {
    if (a === b) return true;

    if (typeof a != 'object' || typeof b != 'object' || a == null || b == null) return false;

    let keysA = Object.keys(a), keysB = Object.keys(b);

    if (keysA.length != keysB.length) return false;

    for (let key of keysA) {
        if (!keysB.includes(key)) return false;

        if (typeof a[key] === 'function' || typeof b[key] === 'function') {
            if (a[key].toString() != b[key].toString()) return false;
        } else {
            if (!compareObjects(a[key], b[key])) return false;
        }
    }

    return true;
}