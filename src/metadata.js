import db from "./db.js"

export const file_metadata = function({id  , file_name , thumbnailLink, user_id , title , remarks}){
    const time = new Date().toLocaleString();
//    const  = `https://drive.google.com/file/d/${id}/view`;
    //    const imageUrl = `https://drive.google.com/file/d/${id}/view`;
    // const imageUrl = `https://drive.google.com/uc?export=view&id=${id}`;


    // const imageUrl = `https://drive.google.com/thumbnail?id=${id}&sz=w1000`;
    const imageUrl = `https://drive.google.com/uc?export=view&id=${id}`;

    const response = db.prepare(`
        INSERT INTO files_data (
            id,
            file_name,
            thumbnailLink,
            user_id, 
            title,
            remarks,
            time
        )
        VALUES (?, ?, ?, ? ,? , ? , ? )
    `).run(id, file_name, imageUrl, user_id , title , remarks , time );    

    return response;
}