const { google } = require("googleapis");
const cors = require("micro-cors")();

const authSheet = async () => {
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

    return { sheets }

}

const corsOptions = {
    allowMethods: ['POST'],
    origin: [ 'https://exploredynamo.com' ,'https://1gallon.com.gh'], // Replace with your actual domain
};

const corsHandler = cors(corsOptions);



const sheetHandler = async (req,res) => {
    const contact = req.body

    try {
     
        const spreadsheetId = contact?.type === "dynamo" ? process.env.SPREADSHEET_ID : process.env.ONE_GALLON_SPREADSHEET_ID
        const { sheets } = await authSheet();

        //console.log(`spreadsheetId: ${spreadsheetId}`)
        const response = await sheets.spreadsheets.values.append({
            spreadsheetId:  spreadsheetId,
            range: contact?.range ,
            valueInputOption: 'USER_ENTERED',
            requestBody: {
              values: [contact?.data],
            },
          });

          return res.status(201).json({
             data: response.data,
             status: response.status
          })

    } catch (e) {
        // console.log("error",e)
        return res.status(e.code || 500 ).send({message: e.message})
    }
}

module.exports = corsHandler(sheetHandler);