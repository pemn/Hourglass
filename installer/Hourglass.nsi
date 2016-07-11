; NSIS config file
; NWJS App setup

!define APPNAME Hourglass
!ifndef APPARCH
    !define APPARCH x64
!endif

SetCompressor /SOLID /FINAL LZMA

;--------------------------------
Name "${APPNAME}"
InstallDir "$APPDATA\nwjs"
Icon "..\assets\favicon.ico"
UninstallIcon "..\assets\favicon.ico"
OutFile "${APPNAME}-${APPARCH}-setup.exe"
RequestExecutionLevel user
;--------------------------------
; Pages
Page directory
Page components
Page instfiles

UninstPage components
UninstPage instfiles

; Hidden sections creating the uninstaller
Section
    SetOutPath "$INSTDIR"
    ; Create uninstall information
    WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APPNAME}-${APPARCH}" "DisplayName" "${APPNAME}-${APPARCH}"
    WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APPNAME}-${APPARCH}" "UninstallString" '"$INSTDIR\uninstaller.exe"'
    WriteUninstaller "uninstaller.exe"
SectionEnd
; HTML5 App
; The files must reside on the folder parent to this file
Section "!Hourglass HTML5 App"
    SetOutPath "$INSTDIR\${APPNAME}"
    File "..\*.*"
    File /r "..\assets"
    File /r "..\js"
SectionEnd
; HTML5 Engine
; The unzipped engine files must reside on a subfolder (relative to this file) named: nwjs-(architecture)
Section "!NW.js HTML5 Engine"
    SetOutPath "$INSTDIR\${APPARCH}"
    File /r "${APPARCH}\*.*"
SectionEnd
Section "Create Desktop Shortcut"
    CreateShortCut "$DESKTOP\${APPNAME}.lnk" "$INSTDIR\${APPARCH}\nw.exe" " --nwapp=..\${APPNAME}" "$INSTDIR\${APPNAME}\assets\favicon.ico"
SectionEnd
Section "Auto start with Windows"
    WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Run" "${APPNAME}-${APPARCH}" '"$INSTDIR\${APPARCH}\nw.exe" --nwapp="$INSTDIR\${APPNAME}"'
SectionEnd
Section "Enable Transparency in Windows"
    WriteRegDWORD HKCU "Software\Microsoft\Windows\DWM" "Composition" 0x1
    WriteRegDWORD HKCU "Software\Microsoft\Windows\DWM" "CompositionPolicy" 0x2
    ; Restart window manager so changes are applied right away
    Exec 'taskkill.exe /im dwm.exe'
SectionEnd

Section "un.Hourglass HTML5 App"
    ; Remove engine
    RMDir /r "$INSTDIR\${APPNAME}"
SectionEnd
Section "un.NW.js HTML5 Engine"
    ; Remove engine
    RMDir /r "$INSTDIR\${APPARCH}"
SectionEnd
Section "-un.Uninstall"
    ; Remove registry keys
    DeleteRegKey HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APPNAME}-${APPARCH}" 
    DeleteRegValue HKCU "Software\Microsoft\Windows\CurrentVersion\Run" "${APPNAME}-${APPARCH}"
    ; Remove shortcuts
    Delete "$DESKTOP\${APPNAME}.lnk"
    ; Remove uninstaller
    Delete "$INSTDIR\uninstaller.exe"
    ; Remove base dir if empty
    RMDir "$INSTDIR"
SectionEnd
