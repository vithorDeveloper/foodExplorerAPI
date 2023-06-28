require('express-async-errors')
const database = require('./database/sqlite')

const express = require('express');

const routes = require('./routes');
const AppError = require('./utils/AppError');
const uploadConfig = require('./config/uploads')
const cors = require('cors');

const app = express();

database()  

app.use(cors());

app.use(express.json());

app.use("/files", express.static(uploadConfig.UPLOADS_FOLDER)); // REVISAR

app.use(routes);

app.use((error, req, res, next) => {

  if(error instanceof AppError){

    return res.status(error.statusCode).json({
      message : error.message,
      status : 'error'
    })

  }

  console.log(error)

  return res.status(500).json({
    message : 'erro no servidor',
    status : 'error'
  })
})

const PORT = 3333;

app.listen(PORT, () => console.log(`🎈🚀SERVIDOR TÁ ON NA PORTA ${PORT}🚀🎈`));