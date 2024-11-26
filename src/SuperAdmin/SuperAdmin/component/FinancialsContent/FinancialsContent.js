import React, { useEffect, useState } from 'react';
import { Box, Grid, Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Pagination, CircularProgress } from '@mui/material';
import TopBar from '../topBar';
import axios from 'axios';

function FinancialsContent() {
  const [paymentData, setPaymentData] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchPayments = async () => {
    const token = localStorage.getItem('token_for_sa'); // Retrieve token from local storage

    if (!token) {
      setError('Token not found');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get('https://ss-track-xi.vercel.app/api/v1/SystemAdmin/getAllPayments', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setPaymentData(response.data.data);
        setInvoices(response.data.data.invoices);

      } else {
        setError('Failed to fetch payment data');
      }
    } catch (err) {
      console.error('Error fetching payment data:', err);
      setError('An error occurred while fetching payment data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('get cjhlaaaa', paymentData?.totalReceivedAmount)
    fetchPayments();
  }, []);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;
  return (
    <Box sx={{ padding: 3, height: 'auto', width: '80vw', alignSelf: 'start', backgroundColor: '#fff' }}>
      {/* TopBar */}
      <TopBar />

      {/* Header */}
      <Typography variant="h4" gutterBottom>
        Financials
      </Typography>

      {/* Summary Cards */}
      {/* Summary Cards with Mini Bar Charts */}
      <Grid container spacing={2} mb={4}>
        {paymentData ? (
          [
            {
              label: 'Total Revenue',
              value: `$${(paymentData.totalReceivedAmount || 0).toFixed(2)}`,
              color: '#4285F4',
              chartBars: [30, 50, 45, 55, 50, 45, 60, 55, 50, 45, 60, 55, 50, 45, 60],
              subtext: 'Total earnings from all payments',
            },
            {
              label: 'Pending Payments',
              value: `$${(paymentData.totalUnpaidAmount || 0).toFixed(2)}`,
              color: '#9B51E0',
              chartBars: [30, 50, 45, 55, 50, 45, 60, 55, 50, 45, 60, 55, 50, 45, 60],
              subtext: 'Total amount in unpaid invoices',
            },
          ].map((card, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <Card
                sx={{
                  backgroundColor: '#fff',
                  borderRadius: 2,
                  boxShadow: 1,
                  height: '100%', // Ensures consistent height
                }}
              >
                <CardContent>
                  <Typography
                    variant="subtitle2"
                    color="textSecondary"
                    sx={{ fontWeight: 'bold', textAlign: 'start' }}
                  >
                    {card.label}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    {card.subtext}
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 'bold', mt: 1, textAlign: 'end' }}
                  >
                    {card.value}
                  </Typography>

                  {/* Mini Bar Chart */}
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'flex-end',
                      mt: 2,
                      gap: 0.5,
                    }}
                  >
                    {card.chartBars.map((height, i) => (
                      <Box
                        key={i}
                        sx={{
                          width: 20,
                          height: `${height * 0.9}px`, // Set height in pixels
                          backgroundColor: card.color,
                          borderRadius: '2px',
                          opacity: i % 2 === 0 ? 0.7 : 0.4, // Adjusted opacity for better visibility
                        }}
                      />
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography variant="h6" color="textSecondary">
            Loading payment data...
          </Typography>
        )}
      </Grid>





      {/* Financial Transactions Table */}
      <Typography variant="h4" mb={2}>
        Financial Transactions
      </Typography>
      <Box sx={{ backgroundColor: '#fff', borderRadius: 2, }}>
        <TableContainer component={Paper} elevation={0}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Transaction ID</TableCell>
                <TableCell>Owner Name</TableCell>
                <TableCell>Company Name</TableCell>
                <TableCell>Plan</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {invoices.map((invoice, index) => (
                <TableRow key={index}>
                  <TableCell>{invoice.invoiceNumber}</TableCell>
                  <TableCell>{invoice.ownerName}</TableCell>
                  <TableCell>{invoice.company || 'N/A'}</TableCell>
                  <TableCell>{invoice.planId || 'N/A'}</TableCell>
                  <TableCell>${invoice.subTotal.toFixed(2)} USD</TableCell>
                  <TableCell>{new Date(invoice.invoiceDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Typography
                      color={invoice.status === 'paid' ? 'success' : 'warning'}
                      sx={{ fontWeight: 'bold' }}
                    >
                      {invoice.status === 'paid' ? 'Success' : 'Pending'}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination
        <Box display="flex" justifyContent="flex-end" mt={2}>
          <Pagination count={2} variant="outlined" shape="rounded" />
        </Box> */}
      </Box>
    </Box>
  );
}

export default FinancialsContent;
