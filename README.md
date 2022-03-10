# cyjack-defender

### Required Hardware
* Raspberry Pi 3B+

### Dependencies
* Visual Studio 2019 / 2022
  * Workload: Universal Windows Platform development
* [Windows 10 IoT Core Dashboard](https://docs.microsoft.com/en-us/windows/iot-core/connect-your-device/iotdashboard)

### Setup
1. Using the Windows 10 IoT Dashboard, create a new device using "Raspberry Pi 2 & 3" as the device type and "Windows 10 IoT Core (17763)" as the OS Build.
2. a
3. When debugging on VS, attach debugger to the IoT device.

### Endpoints
* API: http://{ipAddress}:5000/api
* UI: http://{ipAddress}:5000/ui