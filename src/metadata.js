import db from "./db.js"

export const file_metadata = function({id  , file_name , thumbnailLink, user_id}){
    const response = db.prepare(`
        INSERT INTO files_data (
            id,
            file_name,
            thumbnailLink,
            user_id
        )
        VALUES (?, ?, ?, ?)
    `).run(id, file_name, thumbnailLink, user_id);

    return response;
}