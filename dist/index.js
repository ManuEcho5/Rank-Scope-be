import express from 'express';
import cors from 'cors';
import rankRoutes from './routes/rankRoutes.js';
const app = express();
const PORT = process.env.PORT || 4000;
app.use(cors());
app.use(express.json());
app.use('/api', rankRoutes);
app.get('/', (_req, res) => {
    res.send('Keyword Rank Checker API');
});
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
