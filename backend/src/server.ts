import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';

import routes from './routes';
import AppError from './errors/AppError';
import uploadConfig from './config/upload';

const port = process.env.PORT || 3333;

const app = express();

app.use(express.json());
app.use(cors());
app.use('/files', express.static(uploadConfig.directory));
app.use(routes);

app.use((err: Error, request: Request, response: Response, _: NextFunction) => {
  if (err instanceof AppError) {
    return response.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  console.error(err);

  return response.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
});

app.listen(port, () => console.log(`Server started at ${port}`));
