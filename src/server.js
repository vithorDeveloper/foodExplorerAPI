require('express-async-errors')
const database = require('./database/sqlite')

const express = require('express');

const routes = require('./routes');
const AppError = require('./utils/AppError');

const app = express();


app.use(express.json());
app.use(routes);
database()

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

app.listen(PORT, () => console.log(`🎈🚀SERVIDOR TÁ ON PAI, MARCHAAA, TAMO AQUI NA PORTA ${PORT}, ENCOSTA🚀🎈`));