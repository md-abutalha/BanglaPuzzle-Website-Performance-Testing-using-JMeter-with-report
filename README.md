# BanglaPuzzle Website Performance Testing with JMeter

This repository contains the performance testing results for the [BanglaPuzzle](https://www.banglapuzzle.com/) website. The tests were conducted using Apache JMeter and BlazeMeter, focusing on evaluating API performance under various loads.

## Project Overview

The performance tests aimed to evaluate:
- Response Time
- Throughput
- Error Rate
- APDEX (Application Performance Index)
- Server's ability to handle concurrent requests

## JMeter Installation Guide

### Step 1: Download JMeter
You can download Apache JMeter from the official website: [JMeter Download](https://jmeter.apache.org/download_jmeter.cgi).

### Step 2: Installation
1. After downloading, extract the **.zip** file.
2. Navigate to the **bin** folder.
3. Run the **jmeter.bat** file (on Windows) or **jmeter.sh** file (on Unix/Linux) to start the JMeter GUI.

### Step 3: Verifying Installation
Open your terminal and run the following command to verify the JMeter installation:
```bash
jmeter -v
```
This will display the current version of JMeter installed.

## **Project Setup in JMeter**
### Step 1: Creating a Test Plan
- Open JMeter.
- Create a Thread Group.
- Set the number of threads (users), ramp-up period, and loop count.
- Add HTTP Request Sampler to simulate API calls to the BanglaPuzzle website.
- Configure the request with the correct API endpoint and parameters.

### Step 2: Running the Test
Once the test plan is configured, execute the performance test by clicking the start button in JMeter. You can also save the test plan for later execution using the command line.

## **BlazeMeter for JMeter Cloud Testing**
BlazeMeter was used to execute tests on BanglaPuzzle APIs. BlazeMeter allows running JMeter tests in the cloud for better scalability and reporting.

### Step 1: Setting Up BlazeMeter
Go to BlazeMeter and sign up for a free account.
Upload the JMeter .jmx test plan.
Configure the number of users, location, and duration.
Execute the test and monitor real-time reports.

## Test Scenarios
Server: https://www.banglapuzzle.com/

### 1. 70 Concurrent Requests with 10 Loop Count
Avg TPS: ~0.9
Total API Requests: 490

### 2. 110 Concurrent Requests with 10 Loop Count
Avg TPS: ~0.357
Total API Requests: 770

### 3. 150 Concurrent Requests with 10 Loop Count
Avg TPS: ~0.077
Total API Requests: 1050

### 4. 180 Concurrent Requests with 10 Loop Count
Avg TPS: ~0.305
Total API Requests: 1260
Errors: 17 connection timeouts, Error Rate: 1.35%

## Results Summary
The performance tests indicate that the BanglaPuzzle server can handle up to 160 concurrent API requests with almost zero errors. For 180 concurrent requests, a 1.35% error rate was observed due to connection timeouts.

## Test Report Regeneration Command
You can regenerate the test reports using the following commands:

```bash
jmeter -n -t banglapuzzle_t150.jmx -l report\banglapuzzle_t150.jtl
jmeter -g report\banglapuzzle_t150.jtl -o report\banglapuzzle_t150.html

```
Repeat the same for other .jmx files like banglapuzzle_t110.jmx and banglapuzzle_t180.jmx to generate their respective reports.

## Analysis of HTML Report Files
### 1: banglapuzzle_t150
- TPS: ~0.357
- Total Samples: 150
- Duration: 420 seconds
- Errors: Minimal errors encountered.
  
### 2: banglapuzzle_t180
- TPS: ~0.077
- Total Samples: 180
- Duration: 2340 seconds
- Errors: 17 connection timeouts.

### 3: banglapuzzle_t110
- TPS: ~0.305
- Total Samples: 110
- Duration: 360 seconds
- Errors: No significant errors encountered.

## __Summary__
The BanglaPuzzle website performs well under moderate loads, with response times and error rates remaining within acceptable limits up to 160 concurrent requests. However, for 180 requests, a slight error rate was noticed. The results indicate that the server can handle higher concurrency, but further optimizations are recommended for sustained high-load conditions.

## Key Takeaways
- Performance: The server handles up to 160 concurrent API calls with negligible errors.
- Optimization: Further improvements are needed for higher load scenarios (180+ requests).
- Scalability: The website scales well up to moderate loads but requires optimization for peak traffic.

## __Screenshots__
![image](https://github.com/user-attachments/assets/afd4f40c-b8f7-47a7-862c-8123abc0cbf4)
![image](https://github.com/user-attachments/assets/e2ba0caa-c85b-4c22-83fc-1ec42167fe7b)
![image](https://github.com/user-attachments/assets/466f648a-c28c-4374-bdf8-bbc18a4bebbb)
![image](https://github.com/user-attachments/assets/24a6875d-d942-4f8a-a82b-b54605cc25d5)
![image](https://github.com/user-attachments/assets/c92aa7dc-0c25-4410-9aac-fe6ae5914e7e)
![image](https://github.com/user-attachments/assets/74aff2c0-e9d2-4ca7-8d9f-ee3d34491847)

## Authors

- [@abutalha](https://github.com/md-abutalha)


## 🔗 Links
[![portfolio](https://img.shields.io/badge/my_portfolio-000?style=for-the-badge&logo=ko-fi&logoColor=white)](https://github.com/md-abutalha)
[![linkedin](https://img.shields.io/badge/linkedin-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/abu-talha1/)
[![twitter](https://img.shields.io/badge/twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white)](https://x.com/abu_talha0x)





