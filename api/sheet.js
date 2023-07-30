const { google } = require("googleapis");


module.exports = async (req,res) => {
    const origin = req.headers.origin;

    const allowedOrigin = [ 'https://exploredynamo.com' ,'https://1gallon.com.gh','https://exploredynamo.com/','https://1gallon.com.gh/'];

    if(allowedOrigin.includes(origin)){
        res.setHeader("Access-Control-Allow-Origin", origin);
        res.setHeader("Access-Control-Allow-Methods", "POST");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type");

        if(req.method === "POST"){
            const contact = req.body
            try {
                const spreadsheetId =
                contact?.type === "dynamo"
                    ? process.env.SPREADSHEET_ID
                    : process.env.ONE_GALLON_SPREADSHEET_ID;

                const jwt = new google.auth.GoogleAuth({
                        credentials: {
                          client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
                          private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY,
                        },
                        scopes: [
                          "https://www.googleapis.com/auth/drive",
                          "https://www.googleapis.com/auth/drive.file",
                          "https://www.googleapis.com/auth/spreadsheets",
                        ],
                      });
                
                    const sheets = google.sheets({ version: "v4", auth: jwt }); 
                    
                    const response = await sheets.spreadsheets.values.append({
                        spreadsheetId: spreadsheetId,
                        range: contact?.range,
                        valueInputOption: "USER_ENTERED",
                        requestBody: {
                            values: [contact?.data],
                        },
                    });

                    return res.status(201).json({
                        data: response.data,
                        status: response.status,
                    });


            } catch (e) {
                return res.status(e.code || 500).send({ message: e.message });
            }
        }else{
            return res.status(405).send({ message: "Method Not Allowed" });
        }

    }else{
        return res.status(403).send({ message: "Forbidden" });
    }
}