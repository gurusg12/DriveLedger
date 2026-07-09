export const get_token = async function(code){
     try {
        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);
        const oauth2 = google.oauth2({
            version: "v2",
            auth: oauth2Client
        });
        const { data } = await oauth2.userinfo.get();
        db.prepare(`
    INSERT INTO users (
        id,
        email,
        name,
        picture,
        access_token,
        refresh_token
    )
    VALUES (?, ?, ?, ?, ?, ?)
`).run(
            data.id,
            data.email,
            data.name,
            data.picture,
            tokens.access_token,
            tokens.refresh_token
        );

        res.send("✅ Login Successful! token.json created");


    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
}