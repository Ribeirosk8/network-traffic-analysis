# Network Traffic Analysis Dashboard

A comprehensive Next.js application for visualizing and analyzing network traffic data to identify attack patterns, similar to tools like Maltego and Kibana.

![Network Analysis Dashboard](/placeholder.svg?height=400&width=800&query=network%20traffic%20analysis%20dashboard%20with%20graphs%20and%20charts)

## Overview

This application provides a powerful dashboard for security analysts to visualize and analyze network traffic data from different sources. It supports both labeled Ground Truth data and raw PCAP traffic data, allowing for comprehensive network security monitoring and attack pattern detection.

## Features

### Data Analysis
- Support for multiple data formats (Ground Truth and PCAP)
- Automatic detection of attack patterns and suspicious activities
- Identification of time windows with multiple attack types
- Protocol analysis and categorization
- Network traffic visualization

### Visualizations
- **Network Graph**: Interactive visualization of network connections and attack patterns
- **Timeline Chart**: Chronological view of events and attack patterns
- **Attack Distribution**: Statistical breakdown of attack types or protocols
- **Attack Windows**: Identification of time periods with multiple attack types

### Interactive Components
- File selector to switch between data sources
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

### Switching Between Data Sources

Use the file selector in the header to switch between:
- **Ground Truth Data**: Pre-labeled network events with attack classifications
- **PCAP Data**: Raw network packet capture data

![Data Source Selector](/placeholder.svg?height=100&width=300&query=data%20source%20selector%20buttons)

### Dashboard Overview

The main dashboard provides key metrics:
- Total events
- Number of attack types or protocols
- Attack windows (1-minute periods with 3+ attack types)
- Unique IP addresses

### Exploring Attack Patterns

1. **Overview Tab**: View distribution of attack types or protocols
2. **Attack Windows Tab**: Examine time periods with multiple attack types
3. **Network Graph Tab**: Visualize network connections and attack patterns
4. **Timeline Tab**: See chronological distribution of events
5. **Events Tab**: Browse detailed event information

### Network Graph

The network graph visualizes connections between IP addresses:
- Internal IPs (172.28.x.x) are shown in blue
- External IPs are shown in red
- Connections are color-coded by attack type or protocol
- Line thickness indicates connection frequency

![Network Graph](/placeholder.svg?height=300&width=600&query=network%20graph%20visualization%20with%20nodes%20and%20edges)

### Attack Windows Analysis

The Attack Windows tab identifies 1-minute periods containing at least 3 different attack types or protocols:
1. Click on a row to expand details
2. View breakdown of attack types within each window
3. Use this to identify coordinated attack patterns

## Supported Data Formats

### Ground Truth Format
Tab-separated values with the following columns:
- Event Type
- C2S ID
- Source
- Source Port(s)
- Destination
- Destination Port(s)
- Start Time
- Stop Time

### PCAP Format
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
- Direct CSV upload interface
- Data caching for improved performance

## License

[MIT License](LICENSE)

## Acknowledgements

- Sample network traffic data provided for educational purposes
- Inspired by professional security tools like Maltego and Kibana
