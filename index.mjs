import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { xss } from 'express-xss-sanitizer';
import helmet from 'helmet';
import hpp from 'hpp';

// configurations
import corsOptions from './config/corsOptions.mjs';
import connectDB from './config/dbConnect.mjs';
import limiter from './config/limiter.mjs';

// custom middlewares
import credentials from './middlewares/credentials.mjs';
import { logToConsole } from './middlewares/logger.mjs';

// routers
import authRouter from './routes/authRoutes.mjs';
import blogRouter from './routes/blogRoutes.mjs';
import commentRouter from './routes/commentRoutes.mjs';
import likeRouter from './routes/likesRoutes.mjs';
import logoutRouter from './routes/logoutRoutes.mjs';
import registerRouter from './routes/registerRoutes.mjs';
import resetRouter from './routes/resetRoutes.mjs';

const app = express();

// environment variable config
dotenv.config();

// parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// security middlewares
app.use(limiter);
app.use(cors(corsOptions));
app.use(xss());
app.use(hpp());
app.use(helmet());
app.use(credentials);

const PORT = 8000;

// connection to database
await connectDB();

// logger
app.use(logToConsole);

app.use(express.static('./public'));

// routers
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/register', registerRouter);
app.use('/api/v1/reset', resetRouter);
app.use('/api/v1/logout', logoutRouter);

app.use('/api/v1/blogs', blogRouter);
app.use('/api/v1/blogs', commentRouter);
app.use('/api/v1/blogs', likeRouter);

app.get('/', (req, res) => {
  res.json({ text: 'hellow world' });
});

// invalid routes handler
app.all('*', (_, res) => {
  res.status(404).json({ message: 'Not a valid endpoint' });
});

// error handling middleware
app.use((err, req, res, next) => {
  res.status(500).send(err.message);
});

app.listen(PORT, () => console.log(`Server is listening at port ${PORT}`));
