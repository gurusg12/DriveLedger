import db from "./db.js"

export const file_metadata = function({id  , file_name , thumbnailLink, user_id , naration01 , naration02}){
    const time = new Date().toLocaleString();
   const imageUrl = `https://drive.google.com/file/d/${id}/view`;
    const response = db.prepare(`
        INSERT INTO files_data (
            id,
            file_name,
            thumbnailLink,
            user_id, 
            naration01,
            naration02,
            time
        )
        VALUES (?, ?, ?, ? ,? , ? , ? )
    `).run(id, file_name, imageUrl, user_id , naration01 , naration02 , time );    

    return response;
}