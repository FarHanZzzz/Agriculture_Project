// dashboard.js

// Wait for the DOM to be fully loaded before initializing the charts
document.addEventListener('DOMContentLoaded', function() {

    // 1. Supply Chain Performance Chart (Bar Chart)
    const performanceCtx = document.getElementById('performanceChart').getContext('2d');
    new Chart(performanceCtx, {
        type: 'bar',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Delivery Time (hrs)',
                data: [12, 15, 10, 8, 9, 7],
                backgroundColor: 'rgba(54, 162, 235, 0.7)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
                borderRadius: 4
            }, {
                label: 'Transport Cost ($)',
                data: [1200, 1500, 1100, 900, 950, 800],
                backgroundColor: 'rgba(255, 99, 132, 0.7)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false, // Important to allow chart to fill container height
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            plugins: {
                legend: {
                    position: 'top',
                }
            }
        }
    });

    // 2. Inventory Status Chart (Doughnut Chart)
    const inventoryCtx = document.getElementById('inventoryChart').getContext('2d');
    new Chart(inventoryCtx, {
        type: 'doughnut',
        data: {
            labels: ['Optimal', 'Moderate', 'Low'],
            datasets: [{
                data: [65, 25, 10],
                backgroundColor: ['#28a745', '#ffc107', '#dc3545'],
                borderColor: '#ffffff',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false, // Important to allow chart to fill container height
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });

});