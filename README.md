# Network Traffic Analysis Dashboard

A comprehensive Next.js application for visualizing and analyzing network traffic data to identify attack patterns, inspired by the Elastic Stack approach.

![Network Analysis Dashboard](/placeholder.svg?height=400&width=800&query=network%20traffic%20analysis%20dashboard%20with%20graphs%20and%20charts)

## Overview

This application provides a powerful dashboard for security analysts to visualize and analyze network traffic data from different sources. It follows the Elastic Stack approach with a clear data pipeline (Ingest, Store, Analyze) and provides comprehensive security monitoring and attack pattern detection capabilities.

## Features

### Data Pipeline
- **Ingest**: Upload CSV/PCAP files, connect to APIs, or capture live network traffic
- **Store**: Index and store processed data for efficient retrieval
- **Analyze**: Visualize and analyze network patterns through interactive dashboards

### Security Analysis
- Support for multiple data formats (Ground Truth and PCAP)
- Custom file upload for analyzing your own network data
- Automatic detection of attack patterns and suspicious activities
- Identification of time windows with multiple attack types
- Protocol analysis and categorization
- Network traffic visualization

### Dashboard Templates
- **Security Overview**: Summary of security environment activity
- **Network Graph**: Interactive visualization of network connections
- **Attack Timeline**: Chronological view of events
- **Attack Distribution**: Statistical breakdown of attack types
- **Detection & Response**: Information about alerts and cases
- **Geo Analysis**: Geographic visualization of attack sources

### Interactive Components
- Sidebar navigation for easy access to all features
- Dashboard gallery with search functionality
- File upload with drag-and-drop support
- Detailed event tables with filtering and pagination
- Expandable attack window details
- Interactive charts and graphs

## Getting Started

### Prerequisites
- Node.js 18.0.0 or later
- npm or yarn

### Installation

1. Clone the repository:
\`\`\`bash
git clone https://github.com/yourusername/network-analysis-dashboard.git
cd network-analysis-dashboard
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
# or
yarn install
\`\`\`

3. Run the development server:
\`\`\`bash
npm run dev
# or
yarn dev
\`\`\`

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Usage Guide

### Navigation

The application features a sidebar navigation that organizes features into logical sections:
- **Overview**: Dashboard home and main views
- **Data Pipeline**: Ingest, Store, and Analyze sections
- **Security**: Security-focused views and analysis
- **Settings**: Application configuration

### Dashboard Gallery

The home page displays a gallery of available dashboards:
- **Security Views**: Pre-built security dashboards
- **Custom Dashboards**: User-created dashboards
- Search functionality to quickly find dashboards

### Data Ingestion

The Ingest page provides multiple ways to bring data into the system:
- **File Upload**: Upload CSV or PCAP files with drag-and-drop support
- **API Integration**: Connect to external data sources via API
- **Live Capture**: Capture and analyze network traffic in real-time

### Security Analysis

The Security Overview dashboard provides:
- Key metrics about your network traffic
- Attack distribution visualization
- Timeline of security events
- Network graph showing connections and attack patterns
- Detailed event tables

### Supported Data Formats

#### Ground Truth Format
Tab-separated values with the following columns:
- Event Type
- C2S ID
- Source
- Source Port(s)
- Destination
- Destination Port(s)
- Start Time
- Stop Time

#### PCAP Format
Comma or tab-separated values with columns including:
- Time
- Source
- Source Port
- Destination
- Destination Port
- Protocol
- Length
- Info

## Technical Implementation

This application is built with:
- **Next.js**: React framework for the frontend
- **TypeScript**: For type safety and better developer experience
- **Tailwind CSS**: For styling
- **shadcn/ui**: For UI components
- **Recharts**: For data visualization
- **TanStack Table**: For interactive tables

## Attack Detection Methodology

### For Ground Truth Data
- Uses pre-labeled attack types
- Identifies time windows with multiple attack types
- Analyzes attack distribution and patterns

### For PCAP Data
- Infers attack types based on protocol patterns
- Detects suspicious activities like:
  - SYN scans (TCP packets with SYN flag but no ACK)
  - Port scans (multiple connection attempts to different ports)
  - Potential DDoS (high volume of traffic to specific destinations)
  - Malformed packets (which may indicate exploit attempts)
- Identifies time windows with multiple protocols as potential attack periods

## Future Enhancements

- Machine learning for improved attack classification
- Geolocation visualization of attack sources
- Real-time data ingestion
- Alert system for suspicious activity
- Export functionality for reports
- Data caching for improved performance
- Custom dashboard creation

## License

[MIT License](LICENSE)

## Acknowledgements

- Sample network traffic data provided for educational purposes
- Inspired by the Elastic Stack approach to data analysis
