require('./db/database')
const express = require("express");
const cors = require('cors');
const dotenv = require("dotenv");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const http = require('http');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./docs/swagger_output.json');
// const multer = require('multer');
// const img=require('./db/models/img')

// routers
const auth=require('./middleware/auth');
const client_routes = require('./router/client');
const user_routes = require('./router/user');
const img_routes = require('./router/img');
const location_routes = require('./router/location');

// utils
dotenv.config();
const app = express();
const PORT = process.env.NODE_PORT || 8080;
app.use(morgan("dev"));
app.use(cors());
app.use(helmet());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))
// require('./docs/endpoints')(app)
// app.use(morgan('combined'))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(__dirname + '/uploads'));


// app.use(taskRoutes);
// app.use('/image',auth, img_routes);
app.use('/image', img_routes);
app.use('/client', client_routes);
app.use('/user', user_routes);
app.use('/location', location_routes);
app.use('/welcome', (req, res) => {
    res.json({ name: "Hello" })
})

app.listen(process.env.PORT || 5000, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
  });