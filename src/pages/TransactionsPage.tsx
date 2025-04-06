import { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { format } from 'date-fns';
import { transactionsApi } from '../api/api';
import { useAuth } from '../contexts/AuthContext';

interface Transaction {
  _id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  date: string;
  description?: string;
}

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState<Partial<Transaction> | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await transactionsApi.getTransactions();
        setTransactions(response.data);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchTransactions();
    }
  }, [user]);

  const handleOpenDialog = (transaction: Partial<Transaction> | null) => {
    setCurrentTransaction(transaction || { 
      type: 'expense', 
      amount: 0, 
      category: '', 
      date: new Date().toISOString() 
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentTransaction(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentTransaction(prev => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) : value
    }));
  };

  const handleSelectChange = (e: any) => {
    const { name, value } = e.target;
    setCurrentTransaction(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      if (currentTransaction?._id) {
        // Update existing transaction
        const response = await transactionsApi.updateTransaction(
          currentTransaction._id,
          currentTransaction
        );
        setTransactions(transactions.map(t => 
          t._id === currentTransaction._id ? response.data : t
        ));
      } else {
        // Create new transaction
        const response = await transactionsApi.createTransaction(currentTransaction);
        setTransactions([response.data, ...transactions]);
      }
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving transaction:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await transactionsApi.deleteTransaction(id);
      setTransactions(transactions.filter(t => t._id !== id));
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Transactions</Typography>
        <Button 
          variant="contained" 
          startIcon={<Add />}
          onClick={() => handleOpenDialog(null)}
        >
          Add Transaction
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction._id}>
                <TableCell>{format(new Date(transaction.date), 'MMM dd, yyyy')}</TableCell>
                <TableCell>{transaction.type}</TableCell>
                <TableCell>{transaction.category}</TableCell>
                <TableCell 
                  sx={{ 
                    color: transaction.type === 'income' ? 'success.main' : 'error.main',
                    fontWeight: 'bold'
                  }}
                >
                  {transaction.type === 'income' ? '+' : '-'}{transaction.amount}
                </TableCell>
                <TableCell>{transaction.description || '-'}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenDialog(transaction)}>
                    <Edit color="primary" />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(transaction._id)}>
                    <Delete color="error" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          {currentTransaction?._id ? 'Edit Transaction' : 'Add Transaction'}
        </DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel>Type</InputLabel>
            <Select
              name="type"
              value={currentTransaction?.type || 'expense'}
              onChange={handleSelectChange}
              label="Type"
            >
              <MenuItem value="income">Income</MenuItem>
              <MenuItem value="expense">Expense</MenuItem>
            </Select>
          </FormControl>
          <TextField
            name="amount"
            label="Amount"
            type="number"
            fullWidth
            margin="normal"
            value={currentTransaction?.amount || ''}
            onChange={handleInputChange}
          />
          <TextField
            name="category"
            label="Category"
            fullWidth
            margin="normal"
            value={currentTransaction?.category || ''}
            onChange={handleInputChange}
          />
          <TextField
            name="date"
            label="Date"
            type="date"
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            value={currentTransaction?.date ? format(new Date(currentTransaction.date), 'yyyy-MM-dd') : ''}
            onChange={handleInputChange}
          />
          <TextField
            name="description"
            label="Description"
            fullWidth
            margin="normal"
            multiline
            rows={3}
            value={currentTransaction?.description || ''}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TransactionsPage;