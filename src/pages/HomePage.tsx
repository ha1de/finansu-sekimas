import { Typography, Button, Box } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const { user } = useAuth();

  return (
    <Box sx={{ textAlign: 'center', mt: 4 }}>
      <Typography variant="h3" gutterBottom>
        Personal Finance Tracker
      </Typography>
      <Typography variant="h5" gutterBottom>
        Take control of your finances
      </Typography>
      
      {user ? (
        <Button 
          variant="contained" 
          color="primary" 
          size="large" 
          component={Link} 
          to="/transactions"
          sx={{ mt: 3 }}
        >
          Go to Dashboard
        </Button>
      ) : (
        <Box sx={{ mt: 3 }}>
          <Button 
            variant="contained" 
            color="primary" 
            size="large" 
            component={Link} 
            to="/login"
            sx={{ mr: 2 }}
          >
            Login
          </Button>
          <Button 
            variant="outlined" 
            color="primary" 
            size="large" 
            component={Link} 
            to="/register"
          >
            Register
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default HomePage;