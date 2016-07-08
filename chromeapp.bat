@echo off

:: find the path to chrome
for /f "TOKENS=2 delims=:" %%I in ('reg query "HKLM\Software\Microsoft\Windows\CurrentVersion\App Paths\Chrome.exe" /ve') do set chrome_exe=%systemdrive%%%I

:: start chrome with this app
@"%chrome_exe%" --load-and-launch-app=%~dp0
