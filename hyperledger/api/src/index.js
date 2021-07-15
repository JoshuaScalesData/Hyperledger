const express = require('express')
const query = require('./controllers/query')
const invoke = require('./controllers/invoke')
const enrollAdmin = require('./controllers/enrollAdmin')
const app = express()
const port = 3001

app.get('/', (req, res) => {
    res.set('Content-Type', 'text/html');
    const responseHtml = `<h1>Welcome to REST API for landrec Blockchain.</h1>
                          <p>Before anything else, you "<strong><span style="color: #ff0000;">MUST</span></strong>" hit the <span style="color: #ff0000;">/enrollAdmin</span> endpoint so a valid user id is generated and stored in wallet on the express server. This user id will be used for query and invoke endpoints.</p>
                          <p>Here are all the endpoints. You can click and visit:</p>
                          <p>1. First, <a href="/enrollAdmin" target="_blank" rel="noopener">/enrollAdmin</a></p>
                          <p>2. Query Ledger: <a href="/query" target="_blank" rel="noopener">/query</a></p>
                          <p>3. Invoke: <a href="/invoke" target="_blank" rel="noopener">/invoke</a></p>`;
    res.send(new Buffer(responseHtml));
})

app.get('/query', (req, res) => query.query(req, res))

app.get('/invoke', (req, res) => invoke.invokecc(req, res))

app.get('/enrollAdmin', (req, res) => enrollAdmin.enrollAdmin(req, res))

app.listen(port, () => console.log(`Landrec Blockchain REST API listening on port ${port}!`))
