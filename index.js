require('dotenv').config();
const app = require('./src/app');

const port = process.env.SERVER_PORT;
app.listen(port, '0.0.0.0', () => {
    console.log(`Message Board app listening at http://localhost:${port}`);
});
