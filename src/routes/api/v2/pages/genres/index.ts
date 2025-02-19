import {
    getGenres,
} from "$lib/api/jellyfin/methods";
import {createApiResponse} from "$lib/apiHelper";

export const get = async ({ locals }) => {
    const session = locals.session.data.active
    const genres = await getGenres(session)

    return createApiResponse(true, genres)
}