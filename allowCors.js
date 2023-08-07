const allowedOrigins = [ 
  'https://exploredynamo.com' ,
  'https://1gallon.com.gh',
  'https://exploredynamo.com/',
  'https://1gallon.com.gh/'
];

const allowCors = fn => async (req, res) => {

  const origin = req.headers.origin

  if(allowedOrigins.includes(origin)){
    res.setHeader('Access-Control-Allow-Credentials', true)

    res.setHeader('Access-Control-Allow-Origin', origin)

    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')

   res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
   )

   if (req.method === 'OPTIONS') {
    //res.setHeader('Access-Control-Allow-Origin', origin)
    res.status(200).end()

    return

    }
    return await fn(req, res)
  }else {
    return res.status(403).send({ message: 'Forbidden' });
  }



}



export default allowCors


