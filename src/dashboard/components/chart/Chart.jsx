import React from 'react';
import { Bar } from 'react-chartjs-2';
import styles from './chart.module.css';
import { Chart, registerables } from 'chart.js';

const Charts = ({ data, totalResponse, noOfSkips }) => {
  // Extract labels and values from the data object
  const labels = Object.keys(data);
  const values = Object.values(data);

  // Register the necessary charts components
  Chart.register(...registerables);

  // Generate colors dynamically based on the number of labels
  const colors = [
    'rgba(75, 192, 192, 0.2)',
    'rgba(255, 99, 132, 0.2)',
    'rgba(153, 102, 255, 0.2)',
    'rgba(255, 159, 64, 0.2)',
    'rgba(54, 162, 235, 0.2)',
    'rgba(255, 206, 86, 0.2)',
    'rgba(75, 192, 192, 0.2)',
    'rgba(153, 102, 255, 0.2)',
    'rgba(255, 159, 64, 0.2)',
    'rgba(201, 203, 207, 0.2)'
  ];

  // Prepare the data for the chart
  const chartData = {
    labels: [...labels, 'No of Skips'], // Add 'No of Skips' to labels
    datasets: [
      {
        label: 'User Selection',
        backgroundColor: [...colors.slice(0, labels.length + 1)], // Use the next color from the colors array
        borderColor: [...colors.slice(0, labels.length + 1)],
        borderWidth: 1,
        hoverBackgroundColor: [...colors.slice(0, labels.length + 1)],
        hoverBorderColor: [...colors.slice(0, labels.length + 1)],
        data: [...values, noOfSkips] // Add noOfSkips to the data array
      }
    ]
  };

  // Render the chart
  return (
    <div className={styles.chartContainer}>
      <Bar
        data={chartData}
        width={200}
        height={40}
        options={{
          indexAxis: "y",
          maintainAspectRatio: true,
          scales: {
            x: {
              grid: {
                offset: 'true'
              },
              min: 0,
              max: totalResponse + noOfSkips, // Adjust the maximum value for the x-axis
              title: {
                display: true,
                text: `Total Responses: ${totalResponse + noOfSkips}`,
                font: {
                  size: 14
                }
              }
            },
            y: {
              beginAtZero: true,
              ticks: {
                min: 0,
                max: 10
              }
            }
          }
        }}
      />
    </div>
  );
};

export default Charts;