require ('dotenv').config();

const checkApiKey = (request, result, next) => {
  const apiKey = request.headers['x-api-key'];
  if (apiKey===process.env.API_KEY) {
    next();
  } else {
    result.status(401).json({ error: 'API key no valida' });
  }     
}
module.exports = checkApiKey;
                     