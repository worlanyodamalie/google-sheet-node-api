const allowCors = (allowedOrigins) => (fn) => async (req, res) => {
    const origin = req.headers.origin;
  
    if (allowedOrigins.includes(origin)) {
      res.setHeader('Access-Control-Allow-Credentials', true);
      res.setHeader('Access-Control-Allow-Origin', origin);
      // Set other CORS headers as needed
      res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS, PATCH, DELETE, POST, PUT');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
      if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
      }
  
      return await fn(req, res);
    } else {
      return res.status(403).send({ message: 'Forbidden' });
    }
  };
  
  module.exports = allowCors;
  