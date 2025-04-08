import app from './app';
import dotenv from 'dotenv';

dotenv.config({ path: './konfig.env' });

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});