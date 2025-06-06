import type { NetworkEvent } from "./types"

// Sample data to use as fallback if the CSV fetch fails
export const sampleData: NetworkEvent[] = [
  {
    "Event Type": "scan /usr/bin/nmap",
    "C2S ID": "43562",
    Source: "151.243.222.89",
    "Source Port(s)": "54527",
    Destination: "172.28.52.6",
    "Destination Port(s)": "22321",
    "Start Time": "11/3/2009 8:20",
    "Stop Time": "11/3/2009 8:20",
  },
  {
    "Event Type": "scan /usr/bin/nmap",
    "C2S ID": "43563",
    Source: "19.16.150.30",
    "Source Port(s)": "59406",
    Destination: "172.28.177.139",
    "Destination Port(s)": "3129",
    "Start Time": "11/3/2009 8:30",
    "Stop Time": "11/3/2009 8:30",
  },
  {
    "Event Type": "scan /usr/bin/nmap",
    "C2S ID": "43565",
    Source: "49.232.95.127",
    "Source Port(s)": "55944",
    Destination: "172.28.97.169",
    "Destination Port(s)": "21 4899",
    "Start Time": "11/3/2009 8:32",
    "Stop Time": "11/3/2009 8:32",
  },
  {
    "Event Type": "no precursor client compromise exfil/sams_launch_v",
    "C2S ID": "43555",
    Source: "172.28.219.190",
    "Source Port(s)": "0",
    Destination: "138.106.196.178",
    "Destination Port(s)": "80",
    "Start Time": "11/3/2009 8:36",
    "Stop Time": "11/3/2009 8:36",
  },
  {
    "Event Type": "no precursor client compromise exfil/sams_launch_v",
    "C2S ID": "43556",
    Source: "172.28.219.190",
    "Source Port(s)": "0",
    Destination: "28.133.133.90",
    "Destination Port(s)": "80",
    "Start Time": "11/3/2009 8:36",
    "Stop Time": "11/3/2009 8:36",
  },
  {
    "Event Type": "failed attack framework-2.6/msfcli iis_nsiislog_po",
    "C2S ID": "43570",
    Source: "24.168.166.204",
    "Source Port(s)": "0",
    Destination: "172.28.23.56",
    "Destination Port(s)": "80",
    "Start Time": "11/3/2009 8:35",
    "Stop Time": "11/3/2009 8:36",
  },
  {
    "Event Type": "c2 + tcp control channel exfil - no precursor nc",
    "C2S ID": "43557",
    Source: "138.106.196.178",
    "Source Port(s)": "0",
    Destination: "172.28.219.190",
    "Destination Port(s)": "10000",
    "Start Time": "11/3/2009 8:41",
    "Stop Time": "11/3/2009 8:42",
  },
  {
    "Event Type": "no precursor client compromise exfil/sams_launch_v",
    "C2S ID": "43558",
    Source: "172.28.14.52",
    "Source Port(s)": "0",
    Destination: "198.123.37.66",
    "Destination Port(s)": "80",
    "Start Time": "11/3/2009 8:49",
    "Stop Time": "11/3/2009 8:49",
  },
  {
    "Event Type": "no precursor client compromise exfil/sams_launch_v",
    "C2S ID": "43559",
    Source: "172.28.14.52",
    "Source Port(s)": "0",
    Destination: "28.133.133.90",
    "Destination Port(s)": "80",
    "Start Time": "11/3/2009 8:49",
    "Stop Time": "11/3/2009 8:49",
  },
  {
    "Event Type": "failed attack framework-2.6/msfcli iis_nsiislog_po",
    "C2S ID": "43571",
    Source: "24.168.166.204",
    "Source Port(s)": "0",
    Destination: "172.28.23.56",
    "Destination Port(s)": "80",
    "Start Time": "11/3/2009 8:52",
    "Stop Time": "11/3/2009 8:52",
  },
  {
    "Event Type": "c2 + control channel exfil - no precursor nc",
    "C2S ID": "43560",
    Source: "198.123.37.66",
    "Source Port(s)": "0",
    Destination: "172.28.14.52",
    "Destination Port(s)": "10000",
    "Start Time": "11/3/2009 8:52",
    "Stop Time": "11/3/2009 8:54",
  },
  {
    "Event Type": "scan /usr/bin/nmap",
    "C2S ID": "43572",
    Source: "42.196.162.102",
    "Source Port(s)": "26707",
    Destination: "172.28.79.227",
    "Destination Port(s)": "30860",
    "Start Time": "11/3/2009 8:56",
    "Stop Time": "11/3/2009 8:56",
  },
  {
    "Event Type": "scan /usr/bin/nmap",
    "C2S ID": "43573",
    Source: "193.168.132.153",
    "Source Port(s)": "10468",
    Destination: "172.28.147.136",
    "Destination Port(s)": "45248",
    "Start Time": "11/3/2009 8:56",
    "Stop Time": "11/3/2009 8:56",
  },
  {
    "Event Type": "failed attack or scan exploit/bin/iis_nsiislog.pl",
    "C2S ID": "43561",
    Source: "161.154.58.214",
    "Source Port(s)": "0",
    Destination: "255.255.255.255",
    "Destination Port(s)": "21",
    "Start Time": "11/3/2009 8:54",
    "Stop Time": "11/3/2009 9:10",
  },
  {
    "Event Type": "phishing email exploit/malware/trawler",
    "C2S ID": "43590",
    Source: "24.252.33.237",
    "Source Port(s)": "0",
    Destination: "172.28.1.5",
    "Destination Port(s)": "25",
    "Start Time": "11/3/2009 9:01",
    "Stop Time": "11/3/2009 9:01",
  },
  {
    "Event Type": "phishing email exploit/malware/trawler",
    "C2S ID": "43591",
    Source: "24.252.33.237",
    "Source Port(s)": "0",
    Destination: "172.28.192.5",
    "Destination Port(s)": "25",
    "Start Time": "11/3/2009 9:01",
    "Stop Time": "11/3/2009 9:01",
  },
  {
    "Event Type": "post-phishing c2 exploit/malware/malclient.pl",
    "C2S ID": "43592",
    Source: "172.28.221.155",
    "Source Port(s)": "0",
    Destination: "24.252.33.237",
    "Destination Port(s)": "80",
    "Start Time": "11/3/2009 9:04",
    "Stop Time": "11/3/2009 9:04",
  },
  {
    "Event Type": "post-phishing c2 + tcp control channel exfil explo",
    "C2S ID": "43593",
    Source: "172.28.221.155",
    "Source Port(s)": "0",
    Destination: "24.252.33.237",
    "Destination Port(s)": "80",
    "Start Time": "11/3/2009 9:05",
    "Stop Time": "11/3/2009 9:05",
  },
  {
    "Event Type": "post-phishing c2 + tcp control channel exfil explo",
    "C2S ID": "43594",
    Source: "172.28.221.155",
    "Source Port(s)": "0",
    Destination: "24.252.33.237",
    "Destination Port(s)": "80",
    "Start Time": "11/3/2009 9:07",
    "Stop Time": "11/3/2009 9:07",
  },
  {
    "Event Type": "post-phishing c2 + tcp control channel exfil explo",
    "C2S ID": "43595",
    Source: "172.28.221.155",
    "Source Port(s)": "0",
    Destination: "24.252.33.237",
    "Destination Port(s)": "80",
    "Start Time": "11/3/2009 9:09",
    "Stop Time": "11/3/2009 9:09",
  },
  {
    "Event Type": "router-rewrite /home/administrator/attack-scripts/",
    "C2S ID": "43596",
    Source: "255.255.255.255",
    "Source Port(s)": "0",
    Destination: "255.255.255.255",
    "Destination Port(s)": "0",
    "Start Time": "11/3/2009 9:09",
    "Stop Time": "11/3/2009 9:11",
  },
  {
    "Event Type": "ddos",
    "C2S ID": "43601",
    Source: "23.3.252.153",
    "Source Port(s)": "0",
    Destination: "172.28.128.5",
    "Destination Port(s)": "25",
    "Start Time": "11/3/2009 9:20",
    "Stop Time": "11/3/2009 9:20",
  },
  {
    "Event Type": "ddos",
    "C2S ID": "43602",
    Source: "34.110.234.33",
    "Source Port(s)": "0",
    Destination: "172.28.2.93",
    "Destination Port(s)": "10000",
    "Start Time": "11/3/2009 9:19",
    "Stop Time": "11/3/2009 9:23",
  },
  {
    "Event Type": "post-phishing c2 heartbeat exploit/malware/malclie",
    "C2S ID": "43603",
    Source: "172.28.136.45",
    "Source Port(s)": "0",
    Destination: "23.3.252.153",
    "Destination Port(s)": "80",
    "Start Time": "11/3/2009 9:22",
    "Stop Time": "11/3/2009 9:22",
  },
]
