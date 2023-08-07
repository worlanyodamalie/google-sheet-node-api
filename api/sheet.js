const { google } = require("googleapis");
// const allowCors = require('../allowCors');
import allowCors from '../allowCors'

const allowedOrigins = [ 'https://exploredynamo.com' ,'https://1gallon.com.gh','https://exploredynamo.com/','https://1gallon.com.gh/','http://localhost:3000'];

 export default  async function handler(req,res){
    const contact = req.body;
    const origin = req.headers.origin;

      if(req.method === 'POST'){
             try {
                const spreadsheetId =
                  contact?.type === "dynamo"
                    ? process.env.SPREADSHEET_ID
                    : process.env.ONE_GALLON_SPREADSHEET_ID;

                const jwt = new google.auth.GoogleAuth({
                  credentials: {
                    client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
                    private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY.replace(/\\n/g, "\n"),
                  },
                  scopes: [
                    "https://www.googleapis.com/auth/drive",
                    "https://www.googleapis.com/auth/drive.file",
                    "https://www.googleapis.com/auth/spreadsheets",
                  ],
                });

                const sheets = google.sheets({ version: 'v4', auth: jwt });

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
             } catch (error) {
                return res.status(500).send({ message: error.message });

                // return res.status(error.code || 500).send({ message: error.message });
             }
      }else{
        return res.status(405).send({ message: 'Method Not Allowed' });
      }
    
  
}

// module.exports = allowCors(allowedOrigins)(handler);
module.exports = allowCors(handler)

