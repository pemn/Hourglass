#Hourglass :hourglass:
A 3D animated hourglass to remind you to take breaks every hour.  
When time is up it will play a sound and become "always on top" until turned over.  
As simple as a physical hourglass but free, unbreakable and precise.  
Resizable, moveable and with transparent background (if supported by your desktop).  
  
Since its a HTML5 application, can be packaged to run pretty much everywhere.  
The binary installer uses the NW.js HTML5 engine.  
Can be run as a chrome App (no transparency), sideloaded using a launch script (chromeapp.bat).  
  
Can be used a web page on modern browsers (no transparency, with browser frame and decorations). For web page mode, just copy the folder into a web server. Running from local file system wont work.  
  
Uses Three.js, dat.gui.js and chrome APIs (when it find its, otherwise some features will be unavailable).  
#Installer
I also made a NSIS config file for creating a complete Windows installer/uninstaller.  
If you want to rebuild the installer, the NW.js binaries are required. Copy then to "installer/(architectury)" folder and run batch.
#License
Apache 2.0
#Downloads
###Windows 64 bits :octocat:
https://github.com/pemn/Hourglass/releases/download/latest/Hourglass-x64-setup.exe  
###Windows 32 bits :octocat:
https://github.com/pemn/Hourglass/releases/download/latest/Hourglass-x86-setup.exe  
#Screenshot
![screenshot](https://github.com/pemn/Hourglass/blob/master/img/screenshot.png)
