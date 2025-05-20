import React, { useState, useEffect } from 'react';
import { useGetReportQuery } from '../../slices/reportApiSlice';
import { 
  CartesianGrid, XAxis, YAxis, Tooltip, Legend,
  ResponsiveContainer, PieChart, Pie, Cell, 
  AreaChart, Area
} from 'recharts';
import { Row, Col, Card, Form, Spinner, Alert, Table } from 'react-bootstrap';
import { FaChartLine, FaChartBar, FaShoppingCart, FaMoneyBillWave, FaCalendarAlt } from 'react-icons/fa';

const ReportScreen = () => {
  const [period, setPeriod] = useState('30d');
  const { data, isLoading, error } = useGetReportQuery(period);
  const [totalSales, setTotalSales] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [averageOrderValue, setAverageOrderValue] = useState(0);

  // For pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  // Calculate summary metrics
  useEffect(() => {
    if (data?.salesData) {
      const sales = data.salesData.reduce((sum, day) => sum + day.totalSales, 0);
      const orders = data.salesData.reduce((sum, day) => sum + day.totalOrders, 0);
      
      setTotalSales(sales);
      setTotalOrders(orders);
      setAverageOrderValue(orders > 0 ? (sales / orders).toFixed(2) : 0);
    }
  }, [data]);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip" style={{ backgroundColor: '#fff', padding: '10px', border: '1px solid #ccc' }}>
          <p className="label" style={{ margin: 0 }}>{`Date: ${label}`}</p>
          <p style={{ margin: 0, color: '#8884d8' }}>{`Sales: ${formatCurrency(payload[0].value)}`}</p>
          {payload[1] && <p style={{ margin: 0, color: '#82ca9d' }}>{`Orders: ${payload[1].value}`}</p>}
        </div>
      );
    }
    return null;
  };

  // Get period label
  const getPeriodLabel = () => {
    switch(period) {
      case '7d': return 'Last 7 Days';
      case '90d': return 'Last 90 Days';
      case '1y': return 'Last Year';
      default: return 'Last 30 Days';
    }
  };

  return (
    <div className="py-4 px-3">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0"><FaChartLine className="me-2" /> Sales Dashboard</h2>
        <Form.Group className="d-flex align-items-center">
          <FaCalendarAlt className="me-2 text-secondary" />
          <Form.Select 
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            style={{ width: '200px', fontWeight: '500' }}
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
            <option value="1y">Last Year</option>
          </Form.Select>
        </Form.Group>
      </div>

      {isLoading ? (
        <div className="text-center my-5">
          <Spinner animation="border" role="status" variant="primary">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-2">Loading dashboard data...</p>
        </div>
      ) : error ? (
        <Alert variant="danger">Error loading report data</Alert>
      ) : (
        <>
          {/* Summary Cards */}
          <Row className="mb-4">
            <Col md={4}>
              <Card className="shadow-sm h-100">
                <Card.Body className="d-flex align-items-center">
                  <div className="rounded-circle bg-primary bg-opacity-10 p-3 me-3">
                    <FaMoneyBillWave className="text-primary" size={24} />
                  </div>
                  <div>
                    <h6 className="text-muted mb-1">Total Sales</h6>
                    <h3 className="mb-0">{formatCurrency(totalSales)}</h3>
                    <small className="text-muted">{getPeriodLabel()}</small>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="shadow-sm h-100">
                <Card.Body className="d-flex align-items-center">
                  <div className="rounded-circle bg-success bg-opacity-10 p-3 me-3">
                    <FaShoppingCart className="text-success" size={24} />
                  </div>
                  <div>
                    <h6 className="text-muted mb-1">Total Orders</h6>
                    <h3 className="mb-0">{totalOrders}</h3>
                    <small className="text-muted">{getPeriodLabel()}</small>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="shadow-sm h-100">
                <Card.Body className="d-flex align-items-center">
                  <div className="rounded-circle bg-info bg-opacity-10 p-3 me-3">
                    <FaChartBar className="text-info" size={24} />
                  </div>
                  <div>
                    <h6 className="text-muted mb-1">Average Order Value</h6>
                    <h3 className="mb-0">{formatCurrency(averageOrderValue)}</h3>
                    <small className="text-muted">{getPeriodLabel()}</small>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Charts Row */}
          <Row className="mb-4">
            <Col lg={8}>
              <Card className="shadow-sm mb-4 mb-lg-0">
                <Card.Header className="bg-white">
                  <h5 className="mb-0">Sales Performance</h5>
                </Card.Header>
                <Card.Body>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart 
                      data={data.salesData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <defs>
                        <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="_id" />
                      <YAxis 
                        tickFormatter={(value) => `$${value}`}
                        domain={['auto', 'auto']}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Area 
                        type="monotone" 
                        dataKey="totalSales" 
                        name="Daily Sales" 
                        stroke="#8884d8" 
                        fillOpacity={1} 
                        fill="url(#colorSales)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={4}>
              <Card className="shadow-sm">
                <Card.Header className="bg-white">
                  <h5 className="mb-0">Top Products</h5>
                </Card.Header>
                <Card.Body>
              <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={data.bestSellers}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="totalSold"
                        nameKey="name"
                        label={null}
                      >
                        {data.bestSellers.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value, name, props) => [`${value} units`, props.payload.name]}
                        contentStyle={{ 
                          backgroundColor: '#fff', 
                          padding: '10px', 
                          border: '1px solid #ccc',
                          borderRadius: '4px'
                        }}
                        itemStyle={{ padding: 0, margin: 0 }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          
          {/* Product Performance Table */}
          <Card className="shadow-sm">
            <Card.Header className="bg-white">
              <h5 className="mb-0">Product Performance</h5>
            </Card.Header>
            <Card.Body>
              <Table hover responsive className="mb-0">
                <thead className="bg-light">
                  <tr>
                    <th>#</th>
                    <th>Product Name</th>
                    <th className="text-end">Units Sold</th>
                  </tr>
                </thead>
                <tbody>
                  {data.bestSellers.map((product, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{product.name}</td>
                      <td className="text-end"><strong>{product.totalSold}</strong></td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </>
      )}
    </div>
  );
};

export default ReportScreen;