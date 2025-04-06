import { Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
      <Typography variant="h3">404 - Page Not Found</Typography>
      <Button component={Link} to="/" variant="contained" sx={{ mt: 2 }}>
        Go to Home
      </Button>
    </div>
  );
};

export default NotFoundPage;