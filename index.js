require('dotenv').config();
const express = require('express');
const { google } = require("googleapis");
const port = process.env.PORT || 3001
const app = express();
const cors = require('cors');
const options = {
    //uncomment when pushing
    origin: [ 'https://exploredynamo.com' ,'https://1gallon.com.gh'],
   //comment when deploying
    // origin: "http://localhost:3000/",
    methods: 'POST',
}


app.use(cors(options))

app.use(express.json());

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

app.get('/', (req, res) => {
    res.send('This is a Google sheet node api..')
  })

app.post('/sheet' ,  async (req,res) => {
    const contact = req.body


    try {

        // const jwt = new google.auth.GoogleAuth(
        //   {  credentials: {
        //         client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
        //         private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY.replace(/\\n/g, "\n"),

        //     },
        //     scopes: [
        //         'https://www.googleapis.com/auth/drive',
        //         'https://www.googleapis.com/auth/drive.file',
        //         'https://www.googleapis.com/auth/spreadsheets'
        //     ]
        // }
        //   );
        //   const sheets = google.sheets({ version: "v4", auth: jwt });
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

})


app.listen(port, () => {
    console.log(`Server is running on ${port}`)
})

