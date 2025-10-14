import db from "../server.js";

export default async function getMatchingImages(query) {
    // Simuleret søgning i billeddata
    return await db.getImagesMetadata(query);
}
