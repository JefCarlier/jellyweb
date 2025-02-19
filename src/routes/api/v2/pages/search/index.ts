import {
    searchItems,
} from "$lib/api/jellyfin/methods";
import {createApiResponse} from "$lib/apiHelper";
import type {Item} from "$lib/typings/internal";

export const get = async ({ locals, query }) => {
    const session = locals.session.data.active
    const term = query.get("term")

    const items: Item[] = await searchItems(session, term)
    return createApiResponse(true, items)
}