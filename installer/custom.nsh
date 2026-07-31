!macro customHeader
  ; LUPER Solid Fluent Dark Mode Configuration
  !ifdef MUI_BGCOLOR
    !undef MUI_BGCOLOR
  !endif
  !define MUI_BGCOLOR "121214"

  !ifdef MUI_TEXTCOLOR
    !undef MUI_TEXTCOLOR
  !endif
  !define MUI_TEXTCOLOR "FFFFFF"

  !ifdef MUI_ABORTWARNING
    !undef MUI_ABORTWARNING
  !endif
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
