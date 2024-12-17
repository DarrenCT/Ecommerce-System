import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line, Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const AdminDashboard = () => {
    const [salesData, setSalesData] = useState({
        totalSales: 0,
        dailySales: [],
        topProducts: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [timeRange, setTimeRange] = useState('7'); // days

    useEffect(() => {
        fetchSalesData();
    }, [timeRange]);

    const fetchSalesData = async () => {
        try {
            setLoading(true);
            const endDate = new Date();
            const startDate = new Date();
            startDate.setDate(endDate.getDate() - parseInt(timeRange));
            
            // Format dates in YYYY-MM-DD format
            const formatDate = (date) => {
                return date.toISOString().split('T')[0];
            };
            
            const response = await axios.get('/api/orders/history', {
                params: {
                    startDate: formatDate(startDate),
                    endDate: formatDate(endDate)
                }
            });

            const orders = response.data;
            
            // Process total sales
            const total = orders.reduce((sum, order) => sum + order.totalAmount, 0);
            
            // Process daily sales
            const dailySalesMap = new Map();
            for (let d = 0; d < parseInt(timeRange); d++) {
                const date = new Date();
                date.setDate(endDate.getDate() - d);
                dailySalesMap.set(formatDate(date), 0);
            }
            
            orders.forEach(order => {
                const date = new Date(order.createdAt).toISOString().split('T')[0];
                if (dailySalesMap.has(date)) {
                    dailySalesMap.set(date, dailySalesMap.get(date) + order.totalAmount);
                }
            });

            // Process top products
            const productSales = new Map();
            orders.forEach(order => {
                order.items.forEach(item => {
                    const productName = item.product.item_name[0].value;
                    const amount = item.price * item.quantity;
                    productSales.set(productName, (productSales.get(productName) || 0) + amount);
                });
            });

            const topProducts = Array.from(productSales.entries())
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5);

            setSalesData({
                totalSales: total,
                dailySales: Array.from(dailySalesMap.entries()).reverse(),
                topProducts
            });
        } catch (err) {
            setError('Failed to fetch sales data');
            console.error('Error fetching sales data:', err);
        } finally {
            setLoading(false);
        }
    };

    const lineChartData = {
        labels: salesData.dailySales.map(([date]) => {
            const dateParts = date.split('-');
            return `${dateParts[1]}/${dateParts[2]}`;
        }),
        datasets: [{
            label: 'Daily Sales ($)',
            data: salesData.dailySales.map(([, amount]) => amount),
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
        }]
    };

    const barChartData = {
        labels: salesData.topProducts.map(([product]) => product),
        datasets: [{
            label: 'Sales Amount ($)',
            data: salesData.topProducts.map(([, amount]) => amount),
            backgroundColor: 'rgba(54, 162, 235, 0.5)'
        }]
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="admin-dashboard">
            <h1>Sales Dashboard</h1>
            
            <div className="dashboard-controls">
                <select 
                    value={timeRange} 
                    onChange={(e) => setTimeRange(e.target.value)}
                >
                    <option value="7">Last 7 Days</option>
                    <option value="30">Last 30 Days</option>
                    <option value="90">Last 90 Days</option>
                </select>
            </div>

            <div className="total-sales">
                <h2>Total Sales</h2>
                <p>${salesData.totalSales.toFixed(2)}</p>
            </div>

            <div className="charts-grid">
                <div className="chart-container">
                    <h2>Sales Trend</h2>
                    <Line data={lineChartData} options={{
                        responsive: true,
                        plugins: {
                            legend: { position: 'top' },
                            title: { display: false }
                        }
                    }} />
                </div>

                <div className="chart-container">
                    <h2>Top Products</h2>
                    <Bar data={barChartData} options={{
                        responsive: true,
                        plugins: {
                            legend: { position: 'top' },
                            title: { display: false }
                        }
                    }} />
                </div>
            </div>

            <style>{`
                .admin-dashboard {
                    padding: 20px;
                }

                .dashboard-controls {
                    margin: 20px 0;
                }

                .total-sales {
                    background: #f8f9fa;
                    padding: 20px;
                    border-radius: 8px;
                    margin-bottom: 20px;
                }

                .total-sales p {
                    font-size: 2em;
                    color: #28a745;
                    margin: 0;
                }

                .charts-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 20px;
                    margin-top: 20px;
                }

                .chart-container {
                    background: white;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }

                select {
                    padding: 8px;
                    border-radius: 4px;
                    border: 1px solid #ddd;
                }
            `}</style>
        </div>
    );
};

export default AdminDashboard;