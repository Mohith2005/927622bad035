import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { AppBar, Toolbar, Typography, Container, Button } from '@mui/material'
import { StockChart } from './components/StockChart'
import { CorrelationHeatmap } from './components/CorrelationHeatmap'
import './App.css'

function App() {
  return (
    <Router>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Stock Price Aggregator
          </Typography>
          <Button color="inherit" component={Link} to="/">
            Stock Chart
          </Button>
          <Button color="inherit" component={Link} to="/correlation">
            Correlation
          </Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Routes>
          <Route path="/" element={<StockChart ticker="AAPL" />} />
          <Route path="/correlation" element={<CorrelationHeatmap />} />
        </Routes>
      </Container>
    </Router>
  )
}

export default App
