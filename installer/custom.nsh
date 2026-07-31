!macro customHeader
  ; LUPER Solid Fluent Dark Mode Configuration
  !define MUI_BGCOLOR "121214"
  !define MUI_TEXTCOLOR "FFFFFF"
  !define MUI_ABORTWARNING
!macroend

!macro customInit
  ; Apply dark background to installer window
  SetCtlColors $HWNDPARENT 0xFFFFFF 0x121214
  
  ; Skip legacy Win32 grey boxes if possible (handled mainly by UI overrides)
!macroend

!macro customInstall
  ; Apply color during install steps
  SetCtlColors $HWNDPARENT 0xFFFFFF 0x121214
!macroend
