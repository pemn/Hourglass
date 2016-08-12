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

; Check if the user downloaded the correct installer for his plataform
!include x64.nsh
Function .onInit
  ${If} ${RunningX64}
    StrCmp ${APPARCH} "x64" +3
    messageBox MB_YESNO|MB_ICONEXCLAMATION "64 bit Windows detected.$\nThis installer is 32 bits, but a 64 bit version may be available.$\nContinue anyway?" IDYES +2
    Quit
  ${Else}
    StrCmp ${APPARCH} "x86" +3
    messageBox MB_ICONSTOP "32 bit Windows detected.$\nThis installer is 64 bits and will not work, but a 32 bits version may be available."
    Quit
  ${EndIf}
FunctionEnd

; Pages
Page directory
Page components
Page instfiles

UninstPage components
UninstPage instfiles

; Hidden sections creating the uninstaller
Section
    ; the working directory for the shortcuts must be the base dir
    SetOutPath "$INSTDIR"
    ; Create uninstall information
    CreateDirectory "$INSTDIR\${APPNAME}"
    WriteUninstaller "${APPNAME}\uninstaller.exe"
    WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APPNAME}-${APPARCH}" "DisplayName" "${APPNAME}-${APPARCH}"
    WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APPNAME}-${APPARCH}" "UninstallString" '"$INSTDIR\${APPNAME}\uninstaller.exe"'
    ; Create Shortcuts
    CreateDirectory "$SMPROGRAMS\${APPNAME}"
    CreateShortCut  "$SMPROGRAMS\${APPNAME}\${APPNAME}.lnk" "$INSTDIR\${APPARCH}\nw.exe" " --nwapp=${APPNAME}" "$INSTDIR\${APPNAME}\assets\favicon.ico"
    CreateShortCut  "$DESKTOP\${APPNAME}.lnk" "$INSTDIR\${APPARCH}\nw.exe" " --nwapp=${APPNAME}" "$INSTDIR\${APPNAME}\assets\favicon.ico"
SectionEnd
; HTML5 App
; The files must reside on the folder parent to this file
Section "!Hourglass App"
    SectionIn RO
    SetOutPath "$INSTDIR\${APPNAME}"
    ; Write app files
    File    "..\*.*"
    File /r "..\assets"
    File /r "..\js"
SectionEnd
; HTML5 Engine
; The unzipped engine files must reside on a subfolder (relative to this file) named: nwjs-(architecture)
Section "!NW.js Engine"
    SectionIn RO
    SetOutPath "$INSTDIR\${APPARCH}"
    File /r "${APPARCH}\*.*"
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
Section "Run after installation"
    ExecShell "" "$DESKTOP\${APPNAME}.lnk"
SectionEnd

Section "un.Hourglass App"
    ; Remove app
    ; the uninstaller $INSTDIR is actualy the $INSTDIR\${APPNAME} from the installer
    ; this enables us to have multiple apps sharing a single Engine
    ; this is desirable because usualy most disk space is taken by the Engine
    RMDir /r "$INSTDIR"
SectionEnd
Section "un.NW.js Engine"
    ; Remove engine
    RMDir /r "$INSTDIR\..\${APPARCH}"
SectionEnd
Section "-un.Uninstall"
    ; Remove registry keys
    DeleteRegKey HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APPNAME}-${APPARCH}" 
    DeleteRegValue HKCU "Software\Microsoft\Windows\CurrentVersion\Run" "${APPNAME}-${APPARCH}"
    ; Remove shortcuts
    Delete "$DESKTOP\${APPNAME}.lnk"
    Delete "$SMPROGRAMS\${APPNAME}\${APPNAME}.lnk"
    RMDir  "$SMPROGRAMS\${APPNAME}"
    ; Remove base dir if empty
    RMDir  "$INSTDIR\.."
SectionEnd
