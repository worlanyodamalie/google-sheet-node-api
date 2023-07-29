const express = require('express');
const { google } = require("googleapis");
const port = process.env.PORT || 3001
const app = express();
const cors = require('cors');
app.use(express.json());


app.listen(port, () => {
    console.log(`Server is running on ${port}`)
})

app.post('/sheet' , cors() , async (req,res) => {
    const contact = req.body

    console.log(`this is  ${contact}`)

    try {

        const jwt = new google.auth.GoogleAuth(
          {  credentials: {
                client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
                private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY.replace(/\\n/g, "\n"),

            },
            scopes: [
                'https://www.googleapis.com/auth/drive',
                'https://www.googleapis.com/auth/drive.file',
                'https://www.googleapis.com/auth/spreadsheets'
            ]
        }
          );
          const sheets = google.sheets({ version: "v4", auth: jwt });

          const response = await sheets.spreadsheets.values.append({
            spreadsheetId: process.env.SPREADSHEET_ID,
            range: contact?.range ,
            valueInputOption: 'USER_ENTERED',
            requestBody: {
              values: [contact?.data],
            },
          });

        //   console.log("response",response)
          return res.status(201).json({
             data: response.data,
             status: response.status
          })

    } catch (e) {
        // console.log("error",e)
        return res.status(e.code).send({message: e.message})
    }

})

