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
OutFile "${APPNAME}-${APPARCH}-setup.exe"
RequestExecutionLevel user
;--------------------------------
; Pages
Page directory
Page components
Page instfiles

UninstPage uninstConfirm
UninstPage instfiles

;--------------------------------
; Sections

; Hidden sections creating the uninstaller
Section
    SetOutPath $INSTDIR
    ; Create uninstall information
    WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APPNAME}-${APPARCH}" "DisplayName" "${APPNAME}-${APPARCH}"
    WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APPNAME}-${APPARCH}" "UninstallString" '"$INSTDIR\uninstall.exe"'
    WriteUninstaller "uninstall.exe"
SectionEnd
; HTML5 App
Section "!Hourglass HTML5 App"
    SetOutPath "$INSTDIR\${APPNAME}"
    File "..\*.*"
    File /r "..\assets"
    File /r "..\js"
SectionEnd
; HTML5 Engine
Section "!NW.js HTML5 Engine"
    SetOutPath "$INSTDIR\${APPARCH}"
    File /r "nwjs-${APPARCH}\*.*"
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
    Exec 'taskkill.exe /im dwm.exe'
SectionEnd
Section "Uninstall"
    ; Remove registry keys
    DeleteRegKey HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APPNAME}-${APPARCH}" 
    DeleteRegValue HKCU "Software\Microsoft\Windows\CurrentVersion\Run" "${APPNAME}-${APPARCH}"
    ; Remove shortcuts
    Delete "$DESKTOP\${APPNAME}.lnk"
    ; Remove directories used
    RMDir /r $INSTDIR
SectionEnd
