If you want to rebuild the installer, first you must download and extract the NW.js runtime binaries:  
http://nwjs.io/downloads/  

Extract to the directory corresponding to the architecture you want to build.  
Default is x64. It can be changed either as a flag in the command line or directly in the the nsi file.  
Ex.: `makensis.exe /DAPPARCH=x86 hourglass.nsi`  

And of course you need NSIS (Nullsoft Scriptable Install System):  
http://nsis.sourceforge.net/Download
