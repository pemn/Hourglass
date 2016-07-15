#Hourglass :hourglass:
This minimalist app emulates a classic sandglass using a 3D model rendered with WebGL. The goal is to be simple to use like the physical object but free, unbreakable and precise.  
The main purpose of this app is to remind the user to rest its arms and eyes every hour. Those small pauses (5-10 minutes) greatly help against RSIs (Repetitive strain injuries).  
It will keep track of time even if minimized. When time is up it will play a sound (can be disabled) and will become always visible (but wont steal keyboard focus) until turned.  
Resizable, moveable and with transparent background (if supported by your desktop).  
  
Since its a HTML5 application, can be packaged to run pretty much everywhere.  
The Windows installer uses the NW.js HTML5 engine.  
Can be run as a chrome App (no transparency), sideloaded using a launch script (chrome-lauch-app.bat).  
  
Can be used a web page on modern browsers (no transparency, with browser frame and decorations). For web page mode, just copy the folder into a web server. Running index.html from local file system wont work.  
  
Uses Three.js, dat.gui.js and chrome APIs (when it finds it, otherwise some features will be unavailable).
##Screenshot
![screenshot](https://github.com/pemn/Hourglass/blob/master/assets/screenshot.png)
##Installer
The project includes a NSIS config file for creating a standard Windows installer/uninstaller.  
The Windows installer does not require administrator privileges.  
##Downloads
- Windows 64 bits  
:octocat: https://github.com/pemn/Hourglass/releases/download/latest/Hourglass-x64-setup.exe

- Windows 32 bits  
:octocat: https://github.com/pemn/Hourglass/releases/download/latest/Hourglass-x86-setup.exe

- Linux 64 bits  
:octocat: https://github.com/pemn/Hourglass/releases/download/latest/Hourglass-x64-linux.zip

##License
Apache 2.0
