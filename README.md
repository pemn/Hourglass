#Hourglass :hourglass:
This minimalist app emulates a classic sandglass using a 3D model rendered with WebGL. The goal is to be simple to use like the physical object but free, unbreakable and precise.  
The main purpose of this app is to remind the user to rest its arms and eyes every hour. Those small pauses (5-10 minutes) greatly help against RSIs (Repetitive strain injuries).  
It will keep track of time even if minimized. When time is up it will play a sound (can be disabled) and will become always visible (but wont steal keyboard focus) until turned.  
Resizable, moveable and with transparent background (if supported by your desktop).  
  
This is a HTML5 desktop application, built on top of web technologies like Three.js, dat.gui.js and the chrome APIs.
It requires OpenGL to work, so ensure its enabled if you test this app in virtual machines.  
The HTML5 engine used is NW.js, which provides HTML5 Apps with first class citizen status on the desktop.  
The engine and setup structure used for this App should offer a good alternative for packaging other HTML5 apps as a Desktop App.  

Can also be run as a chrome App (no transparency), sideloaded using a launch script (chrome-lauch-app.bat).  
  
Can be used a web page on modern browsers (no transparency, with browser frame and decorations). For web page mode, just copy the folder into a web server. Running index.html from local file system wont work. Also, the features requiring chrome APIs will only be available when supported.  
##Screenshot
![screenshot](https://github.com/pemn/Hourglass/blob/master/assets/screenshot.png)
##Installer
The project includes the NSIS config file used to build the Windows installer/uninstaller.  
The Windows installer does not require administrator privileges and allows multiple Apps to share the same HTML5 Engine.
##Downloads
- v1.0
  - Windows 64 bits  
  :octocat: https://github.com/pemn/Hourglass/releases/download/latest/Hourglass-x64-setup.exe

  - Windows 32 bits  
  :octocat: https://github.com/pemn/Hourglass/releases/download/latest/Hourglass-x86-setup.exe

  - Linux 64 bits  
  :octocat: https://github.com/pemn/Hourglass/releases/download/latest/Hourglass-x64-linux.zip

##License
Apache 2.0
