code
proc Setup_ResetDefaults_Action 0 8
ADDRFP4 0
INDIRI4
CNSTI4 0
NEI4 $70
ADDRGP4 $69
JUMPV
LABELV $70
CNSTI4 2
ARGI4
ADDRGP4 $72
ARGP4
ADDRGP4 trap_Cmd_ExecuteText
CALLV
pop
CNSTI4 2
ARGI4
ADDRGP4 $73
ARGP4
ADDRGP4 trap_Cmd_ExecuteText
CALLV
pop
CNSTI4 2
ARGI4
ADDRGP4 $74
ARGP4
ADDRGP4 trap_Cmd_ExecuteText
CALLV
pop
LABELV $69
endproc Setup_ResetDefaults_Action 0 8
proc Setup_ResetDefaults_Draw 0 20
CNSTI4 320
ARGI4
CNSTI4 356
ARGI4
ADDRGP4 $76
ARGP4
CNSTI4 17
ARGI4
ADDRGP4 color_yellow
ARGP4
ADDRGP4 UI_DrawProportionalString
CALLV
pop
CNSTI4 320
ARGI4
CNSTI4 383
ARGI4
ADDRGP4 $77
ARGP4
CNSTI4 17
ARGI4
ADDRGP4 color_yellow
ARGP4
ADDRGP4 UI_DrawProportionalString
CALLV
pop
LABELV $75
endproc Setup_ResetDefaults_Draw 0 20
proc UI_SetupMenu_Event 8 12
ADDRFP4 4
INDIRI4
CNSTI4 3
EQI4 $79
ADDRGP4 $78
JUMPV
LABELV $79
ADDRLP4 0
ADDRFP4 0
INDIRP4
CNSTI4 8
ADDP4
INDIRI4
ASGNI4
ADDRLP4 0
INDIRI4
CNSTI4 10
LTI4 $81
ADDRLP4 0
INDIRI4
CNSTI4 18
GTI4 $81
ADDRLP4 0
INDIRI4
CNSTI4 2
LSHI4
ADDRGP4 $92-40
ADDP4
INDIRP4
JUMPV
lit
align 4
LABELV $92
address $84
address $85
address $86
address $87
address $88
address $81
address $81
address $89
address $91
code
LABELV $84
ADDRGP4 UI_PlayerSettingsMenu
CALLV
pop
ADDRGP4 $82
JUMPV
LABELV $85
ADDRGP4 UI_ControlsMenu
CALLV
pop
ADDRGP4 $82
JUMPV
LABELV $86
ADDRGP4 UI_GraphicsOptionsMenu
CALLV
pop
ADDRGP4 $82
JUMPV
LABELV $87
ADDRGP4 UI_PreferencesMenu
CALLV
pop
ADDRGP4 $82
JUMPV
LABELV $88
ADDRGP4 UI_CDKeyMenu
CALLV
pop
ADDRGP4 $82
JUMPV
LABELV $89
ADDRGP4 $90
ARGP4
ADDRGP4 Setup_ResetDefaults_Draw
ARGP4
ADDRGP4 Setup_ResetDefaults_Action
ARGP4
ADDRGP4 UI_ConfirmMenu
CALLV
pop
ADDRGP4 $82
JUMPV
LABELV $91
ADDRGP4 UI_PopMenu
CALLV
pop
LABELV $81
LABELV $82
LABELV $78
endproc UI_SetupMenu_Event 8 12
proc UI_SetupMenu_Init 12 12
ADDRGP4 UI_SetupMenu_Cache
CALLV
pop
ADDRGP4 setupMenuInfo
ARGP4
CNSTI4 0
ARGI4
CNSTU4 1056
ARGU4
ADDRGP4 qk_memset
CALLP4
pop
ADDRGP4 setupMenuInfo+276
CNSTI4 1
ASGNI4
ADDRGP4 setupMenuInfo+280
CNSTI4 1
ASGNI4
ADDRGP4 setupMenuInfo+288
CNSTI4 10
ASGNI4
ADDRGP4 setupMenuInfo+288+12
CNSTI4 320
ASGNI4
ADDRGP4 setupMenuInfo+288+16
CNSTI4 16
ASGNI4
ADDRGP4 setupMenuInfo+288+60
ADDRGP4 $104
ASGNP4
ADDRGP4 setupMenuInfo+288+68
ADDRGP4 color_white
ASGNP4
ADDRGP4 setupMenuInfo+288+64
CNSTI4 1
ASGNI4
ADDRGP4 setupMenuInfo+360
CNSTI4 6
ASGNI4
ADDRGP4 setupMenuInfo+360+4
ADDRGP4 $112
ASGNP4
ADDRGP4 setupMenuInfo+360+44
CNSTU4 16384
ASGNU4
ADDRGP4 setupMenuInfo+360+12
CNSTI4 0
ASGNI4
ADDRGP4 setupMenuInfo+360+16
CNSTI4 78
ASGNI4
ADDRGP4 setupMenuInfo+360+76
CNSTI4 256
ASGNI4
ADDRGP4 setupMenuInfo+360+80
CNSTI4 329
ASGNI4
ADDRGP4 setupMenuInfo+448
CNSTI4 6
ASGNI4
ADDRGP4 setupMenuInfo+448+4
ADDRGP4 $126
ASGNP4
ADDRGP4 setupMenuInfo+448+44
CNSTU4 16384
ASGNU4
ADDRGP4 setupMenuInfo+448+12
CNSTI4 376
ASGNI4
ADDRGP4 setupMenuInfo+448+16
CNSTI4 76
ASGNI4
ADDRGP4 setupMenuInfo+448+76
CNSTI4 256
ASGNI4
ADDRGP4 setupMenuInfo+448+80
CNSTI4 334
ASGNI4
ADDRLP4 0
CNSTI4 134
ASGNI4
ADDRGP4 setupMenuInfo+536
CNSTI4 9
ASGNI4
ADDRGP4 setupMenuInfo+536+44
CNSTU4 264
ASGNU4
ADDRGP4 setupMenuInfo+536+12
CNSTI4 320
ASGNI4
ADDRGP4 setupMenuInfo+536+16
ADDRLP4 0
INDIRI4
ASGNI4
ADDRGP4 setupMenuInfo+536+8
CNSTI4 10
ASGNI4
ADDRGP4 setupMenuInfo+536+48
ADDRGP4 UI_SetupMenu_Event
ASGNP4
ADDRGP4 setupMenuInfo+536+60
ADDRGP4 $150
ASGNP4
ADDRGP4 setupMenuInfo+536+68
ADDRGP4 color_red
ASGNP4
ADDRGP4 setupMenuInfo+536+64
CNSTI4 1
ASGNI4
ADDRLP4 0
ADDRLP4 0
INDIRI4
CNSTI4 34
ADDI4
ASGNI4
ADDRGP4 setupMenuInfo+608
CNSTI4 9
ASGNI4
ADDRGP4 setupMenuInfo+608+44
CNSTU4 264
ASGNU4
ADDRGP4 setupMenuInfo+608+12
CNSTI4 320
ASGNI4
ADDRGP4 setupMenuInfo+608+16
ADDRLP4 0
INDIRI4
ASGNI4
ADDRGP4 setupMenuInfo+608+8
CNSTI4 11
ASGNI4
ADDRGP4 setupMenuInfo+608+48
ADDRGP4 UI_SetupMenu_Event
ASGNP4
ADDRGP4 setupMenuInfo+608+60
ADDRGP4 $168
ASGNP4
ADDRGP4 setupMenuInfo+608+68
ADDRGP4 color_red
ASGNP4
ADDRGP4 setupMenuInfo+608+64
CNSTI4 1
ASGNI4
ADDRLP4 0
ADDRLP4 0
INDIRI4
CNSTI4 34
ADDI4
ASGNI4
ADDRGP4 setupMenuInfo+680
CNSTI4 9
ASGNI4
ADDRGP4 setupMenuInfo+680+44
CNSTU4 264
ASGNU4
ADDRGP4 setupMenuInfo+680+12
CNSTI4 320
ASGNI4
ADDRGP4 setupMenuInfo+680+16
ADDRLP4 0
INDIRI4
ASGNI4
ADDRGP4 setupMenuInfo+680+8
CNSTI4 12
ASGNI4
ADDRGP4 setupMenuInfo+680+48
ADDRGP4 UI_SetupMenu_Event
ASGNP4
ADDRGP4 setupMenuInfo+680+60
ADDRGP4 $186
ASGNP4
ADDRGP4 setupMenuInfo+680+68
ADDRGP4 color_red
ASGNP4
ADDRGP4 setupMenuInfo+680+64
CNSTI4 1
ASGNI4
ADDRLP4 0
ADDRLP4 0
INDIRI4
CNSTI4 34
ADDI4
ASGNI4
ADDRGP4 setupMenuInfo+752
CNSTI4 9
ASGNI4
ADDRGP4 setupMenuInfo+752+44
CNSTU4 264
ASGNU4
ADDRGP4 setupMenuInfo+752+12
CNSTI4 320
ASGNI4
ADDRGP4 setupMenuInfo+752+16
ADDRLP4 0
INDIRI4
ASGNI4
ADDRGP4 setupMenuInfo+752+8
CNSTI4 13
ASGNI4
ADDRGP4 setupMenuInfo+752+48
ADDRGP4 UI_SetupMenu_Event
ASGNP4
ADDRGP4 setupMenuInfo+752+60
ADDRGP4 $204
ASGNP4
ADDRGP4 setupMenuInfo+752+68
ADDRGP4 color_red
ASGNP4
ADDRGP4 setupMenuInfo+752+64
CNSTI4 1
ASGNI4
ADDRLP4 0
ADDRLP4 0
INDIRI4
CNSTI4 34
ADDI4
ASGNI4
ADDRGP4 setupMenuInfo+824
CNSTI4 9
ASGNI4
ADDRGP4 setupMenuInfo+824+44
CNSTU4 264
ASGNU4
ADDRGP4 setupMenuInfo+824+12
CNSTI4 320
ASGNI4
ADDRGP4 setupMenuInfo+824+16
ADDRLP4 0
INDIRI4
ASGNI4
ADDRGP4 setupMenuInfo+824+8
CNSTI4 14
ASGNI4
ADDRGP4 setupMenuInfo+824+48
ADDRGP4 UI_SetupMenu_Event
ASGNP4
ADDRGP4 setupMenuInfo+824+60
ADDRGP4 $222
ASGNP4
ADDRGP4 setupMenuInfo+824+68
ADDRGP4 color_red
ASGNP4
ADDRGP4 setupMenuInfo+824+64
CNSTI4 1
ASGNI4
ADDRGP4 $229
ARGP4
ADDRLP4 4
ADDRGP4 trap_Cvar_VariableValue
CALLF4
ASGNF4
ADDRLP4 4
INDIRF4
CNSTF4 0
NEF4 $227
ADDRLP4 0
ADDRLP4 0
INDIRI4
CNSTI4 34
ADDI4
ASGNI4
ADDRGP4 setupMenuInfo+896
CNSTI4 9
ASGNI4
ADDRGP4 setupMenuInfo+896+44
CNSTU4 264
ASGNU4
ADDRGP4 setupMenuInfo+896+12
CNSTI4 320
ASGNI4
ADDRGP4 setupMenuInfo+896+16
ADDRLP4 0
INDIRI4
ASGNI4
ADDRGP4 setupMenuInfo+896+8
CNSTI4 17
ASGNI4
ADDRGP4 setupMenuInfo+896+48
ADDRGP4 UI_SetupMenu_Event
ASGNP4
ADDRGP4 setupMenuInfo+896+60
ADDRGP4 $243
ASGNP4
ADDRGP4 setupMenuInfo+896+68
ADDRGP4 color_red
ASGNP4
ADDRGP4 setupMenuInfo+896+64
CNSTI4 1
ASGNI4
LABELV $227
ADDRGP4 setupMenuInfo+968
CNSTI4 6
ASGNI4
ADDRGP4 setupMenuInfo+968+4
ADDRGP4 $251
ASGNP4
ADDRGP4 setupMenuInfo+968+44
CNSTU4 260
ASGNU4
ADDRGP4 setupMenuInfo+968+8
CNSTI4 18
ASGNI4
ADDRGP4 setupMenuInfo+968+48
ADDRGP4 UI_SetupMenu_Event
ASGNP4
ADDRGP4 setupMenuInfo+968+12
CNSTI4 0
ASGNI4
ADDRGP4 setupMenuInfo+968+16
CNSTI4 416
ASGNI4
ADDRGP4 setupMenuInfo+968+76
CNSTI4 128
ASGNI4
ADDRGP4 setupMenuInfo+968+80
CNSTI4 64
ASGNI4
ADDRGP4 setupMenuInfo+968+60
ADDRGP4 $268
ASGNP4
ADDRGP4 setupMenuInfo
ARGP4
ADDRGP4 setupMenuInfo+288
ARGP4
ADDRGP4 Menu_AddItem
CALLV
pop
ADDRGP4 setupMenuInfo
ARGP4
ADDRGP4 setupMenuInfo+360
ARGP4
ADDRGP4 Menu_AddItem
CALLV
pop
ADDRGP4 setupMenuInfo
ARGP4
ADDRGP4 setupMenuInfo+448
ARGP4
ADDRGP4 Menu_AddItem
CALLV
pop
ADDRGP4 setupMenuInfo
ARGP4
ADDRGP4 setupMenuInfo+536
ARGP4
ADDRGP4 Menu_AddItem
CALLV
pop
ADDRGP4 setupMenuInfo
ARGP4
ADDRGP4 setupMenuInfo+608
ARGP4
ADDRGP4 Menu_AddItem
CALLV
pop
ADDRGP4 setupMenuInfo
ARGP4
ADDRGP4 setupMenuInfo+680
ARGP4
ADDRGP4 Menu_AddItem
CALLV
pop
ADDRGP4 setupMenuInfo
ARGP4
ADDRGP4 setupMenuInfo+752
ARGP4
ADDRGP4 Menu_AddItem
CALLV
pop
ADDRGP4 setupMenuInfo
ARGP4
ADDRGP4 setupMenuInfo+824
ARGP4
ADDRGP4 Menu_AddItem
CALLV
pop
ADDRGP4 $229
ARGP4
ADDRLP4 8
ADDRGP4 trap_Cvar_VariableValue
CALLF4
ASGNF4
ADDRLP4 8
INDIRF4
CNSTF4 0
NEF4 $277
ADDRGP4 setupMenuInfo
ARGP4
ADDRGP4 setupMenuInfo+896
ARGP4
ADDRGP4 Menu_AddItem
CALLV
pop
LABELV $277
ADDRGP4 setupMenuInfo
ARGP4
ADDRGP4 setupMenuInfo+968
ARGP4
ADDRGP4 Menu_AddItem
CALLV
pop
LABELV $94
endproc UI_SetupMenu_Init 12 12
export UI_SetupMenu_Cache
proc UI_SetupMenu_Cache 0 4
ADDRGP4 $251
ARGP4
ADDRGP4 trap_R_RegisterShaderNoMip
CALLI4
pop
ADDRGP4 $268
ARGP4
ADDRGP4 trap_R_RegisterShaderNoMip
CALLI4
pop
ADDRGP4 $112
ARGP4
ADDRGP4 trap_R_RegisterShaderNoMip
CALLI4
pop
ADDRGP4 $126
ARGP4
ADDRGP4 trap_R_RegisterShaderNoMip
CALLI4
pop
LABELV $281
endproc UI_SetupMenu_Cache 0 4
export UI_SetupMenu
proc UI_SetupMenu 0 4
ADDRGP4 UI_SetupMenu_Init
CALLV
pop
ADDRGP4 setupMenuInfo
ARGP4
ADDRGP4 UI_PushMenu
CALLV
pop
LABELV $282
endproc UI_SetupMenu 0 4
bss
align 4
LABELV setupMenuInfo
skip 1056
import UI_RankStatusMenu
import RankStatus_Cache
import UI_SignupMenu
import Signup_Cache
import UI_LoginMenu
import Login_Cache
import UI_RankingsMenu
import Rankings_Cache
import Rankings_DrawPassword
import Rankings_DrawName
import Rankings_DrawText
import UI_InitGameinfo
import UI_SPUnlockMedals_f
import UI_SPUnlock_f
import UI_GetAwardLevel
import UI_LogAwardData
import UI_NewGame
import UI_GetCurrentGame
import UI_CanShowTierVideo
import UI_ShowTierVideo
import UI_TierCompleted
import UI_SetBestScore
import UI_GetBestScore
import UI_GetNumBots
import UI_GetBotInfoByName
import UI_GetBotInfoByNumber
import UI_GetNumSPTiers
import UI_GetNumSPArenas
import UI_GetNumArenas
import UI_GetSpecialArenaInfo
import UI_GetArenaInfoByMap
import UI_GetArenaInfoByNumber
import UI_NetworkOptionsMenu
import UI_NetworkOptionsMenu_Cache
import UI_SoundOptionsMenu
import UI_SoundOptionsMenu_Cache
import UI_DisplayOptionsMenu
import UI_DisplayOptionsMenu_Cache
import UI_SaveConfigMenu
import UI_SaveConfigMenu_Cache
import UI_LoadConfigMenu
import UI_LoadConfig_Cache
import UI_TeamOrdersMenu_Cache
import UI_TeamOrdersMenu_f
import UI_TeamOrdersMenu
import UI_RemoveBotsMenu
import UI_RemoveBots_Cache
import UI_AddBotsMenu
import UI_AddBots_Cache
import trap_SetPbClStatus
import trap_VerifyCDKey
import trap_SetCDKey
import trap_GetCDKey
import trap_MemoryRemaining
import trap_LAN_GetPingInfo
import trap_LAN_GetPing
import trap_LAN_ClearPing
import trap_LAN_ServerStatus
import trap_LAN_GetPingQueueCount
import trap_LAN_GetServerInfo
import trap_LAN_GetServerAddressString
import trap_LAN_GetServerCount
import trap_GetConfigString
import trap_GetGlconfig
import trap_GetClientState
import trap_GetClipboardData
import trap_Key_SetCatcher
import trap_Key_GetCatcher
import trap_Key_ClearStates
import trap_Key_SetOverstrikeMode
import trap_Key_GetOverstrikeMode
import trap_Key_IsDown
import trap_Key_SetBinding
import trap_Key_GetBindingBuf
import trap_Key_KeynumToStringBuf
import trap_S_RegisterSound
import trap_S_StartLocalSound
import trap_CM_LerpTag
import trap_UpdateScreen
import trap_R_DrawStretchPic
import trap_R_SetColor
import trap_R_RenderScene
import trap_R_AddLightToScene
import trap_R_AddPolyToScene
import trap_R_AddRefEntityToScene
import trap_R_ClearScene
import trap_R_RegisterShaderNoMip
import trap_R_RegisterSkin
import trap_R_RegisterModel
import trap_FS_Seek
import trap_FS_GetFileList
import trap_FS_FCloseFile
import trap_FS_Write
import trap_FS_Read
import trap_FS_FOpenFile
import trap_Cmd_ExecuteText
import trap_Argv
import trap_Argc
import trap_Cvar_InfoStringBuffer
import trap_Cvar_Create
import trap_Cvar_Reset
import trap_Cvar_SetValue
import trap_Cvar_VariableStringBuffer
import trap_Cvar_VariableValue
import trap_Cvar_Set
import trap_Cvar_Update
import trap_Cvar_Register
import trap_Milliseconds
import trap_Error
import trap_Print
import UI_SPSkillMenu_Cache
import UI_SPSkillMenu
import UI_SPPostgameMenu_f
import UI_SPPostgameMenu_Cache
import UI_SPArena_Start
import UI_SPLevelMenu_ReInit
import UI_SPLevelMenu_f
import UI_SPLevelMenu
import UI_SPLevelMenu_Cache
import uis
import m_entersound
import UI_StartDemoLoop
import UI_Cvar_VariableString
import UI_Argv
import UI_ForceMenuOff
import UI_PopMenu
import UI_PushMenu
import UI_SetActiveMenu
import UI_IsFullscreen
import UI_DrawTextBox
import UI_AdjustFrom640
import UI_CursorInRect
import UI_DrawChar
import UI_DrawString
import UI_ProportionalStringWidth
import UI_DrawProportionalString_AutoWrapped
import UI_DrawProportionalString
import UI_ProportionalSizeScale
import UI_DrawBannerString
import UI_LerpColor
import UI_SetColor
import UI_UpdateScreen
import UI_DrawRect
import UI_FillRect
import UI_DrawHandlePic
import UI_DrawNamedPic
import UI_ClampCvar
import UI_ConsoleCommand
import UI_Refresh
import UI_MouseEvent
import UI_KeyEvent
import UI_Shutdown
import UI_Init
import UI_RegisterClientModelname
import UI_PlayerInfo_SetInfo
import UI_PlayerInfo_SetModel
import UI_DrawPlayer
import DriverInfo_Cache
import GraphicsOptions_Cache
import UI_GraphicsOptionsMenu
import ServerInfo_Cache
import UI_ServerInfoMenu
import UI_BotSelectMenu_Cache
import UI_BotSelectMenu
import ServerOptions_Cache
import StartServer_Cache
import UI_StartServerMenu
import ArenaServers_Cache
import UI_ArenaServersMenu
import SpecifyServer_Cache
import UI_SpecifyServerMenu
import SpecifyLeague_Cache
import UI_SpecifyLeagueMenu
import Preferences_Cache
import UI_PreferencesMenu
import PlayerSettings_Cache
import UI_PlayerSettingsMenu
import PlayerModel_Cache
import UI_PlayerModelMenu
import UI_CDKeyMenu_f
import UI_CDKeyMenu_Cache
import UI_CDKeyMenu
import UI_ModsMenu_Cache
import UI_ModsMenu
import UI_CinematicsMenu_Cache
import UI_CinematicsMenu_f
import UI_CinematicsMenu
import Demos_Cache
import UI_DemosMenu
import Controls_Cache
import UI_ControlsMenu
import UI_DrawConnectScreen
import TeamMain_Cache
import UI_TeamMainMenu
import UI_Message
import UI_ConfirmMenu_Style
import UI_ConfirmMenu
import ConfirmMenu_Cache
import UI_InGameMenu
import InGame_Cache
import UI_CreditMenu
import UI_UpdateCvars
import UI_RegisterCvars
import UI_MainMenu
import MainMenu_Cache
import MenuField_Key
import MenuField_Draw
import MenuField_Init
import MField_Draw
import MField_CharEvent
import MField_KeyDownEvent
import MField_Clear
import ui_medalSounds
import ui_medalPicNames
import ui_medalNames
import text_color_highlight
import text_color_normal
import text_color_disabled
import listbar_color
import list_color
import name_color
import color_dim
import color_red
import color_orange
import color_blue
import color_yellow
import color_white
import color_black
import menu_dim_color
import menu_black_color
import menu_red_color
import menu_highlight_color
import menu_dark_color
import menu_grayed_color
import menu_text_color
import weaponChangeSound
import menu_null_sound
import menu_buzz_sound
import menu_out_sound
import menu_move_sound
import menu_in_sound
import ScrollList_Key
import ScrollList_Draw
import Bitmap_Draw
import Bitmap_Init
import Menu_DefaultKey
import Menu_SetCursorToItem
import Menu_SetCursor
import Menu_ActivateItem
import Menu_ItemAtCursor
import Menu_Draw
import Menu_AdjustCursor
import Menu_AddItem
import Menu_Focus
import Menu_Cache
import ui_ioq3
import ui_cdkeychecked
import ui_cdkey
import ui_server16
import ui_server15
import ui_server14
import ui_server13
import ui_server12
import ui_server11
import ui_server10
import ui_server9
import ui_server8
import ui_server7
import ui_server6
import ui_server5
import ui_server4
import ui_server3
import ui_server2
import ui_server1
import ui_marks
import ui_drawCrosshairNames
import ui_drawCrosshair
import ui_brassTime
import ui_browserShowEmpty
import ui_browserShowFull
import ui_browserSortKey
import ui_browserGameType
import ui_browserMaster
import ui_spSelection
import ui_spSkill
import ui_spVideos
import ui_spAwards
import ui_spScores5
import ui_spScores4
import ui_spScores3
import ui_spScores2
import ui_spScores1
import ui_botsFile
import ui_arenasFile
import ui_ctf_friendly
import ui_ctf_timelimit
import ui_ctf_capturelimit
import ui_team_friendly
import ui_team_timelimit
import ui_team_fraglimit
import ui_tourney_timelimit
import ui_tourney_fraglimit
import ui_ffa_timelimit
import ui_ffa_fraglimit
import BG_PlayerTouchesItem
import BG_PlayerStateToEntityStateExtraPolate
import BG_PlayerStateToEntityState
import BG_TouchJumpPad
import BG_AddPredictableEventToPlayerstate
import BG_EvaluateTrajectoryDelta
import BG_EvaluateTrajectory
import BG_CanItemBeGrabbed
import BG_FindItemForHoldable
import BG_FindItemForPowerup
import BG_FindItemForWeapon
import BG_FindItem
import bg_numItems
import bg_itemlist
import Pmove
import PM_UpdateViewAngles
import Com_Printf
import Com_Error
import Info_NextPair
import Info_Validate
import Info_SetValueForKey_Big
import Info_SetValueForKey
import Info_RemoveKey_Big
import Info_RemoveKey
import Info_ValueForKey
import Com_TruncateLongString
import va
import Q_CountChar
import Q_CleanStr
import Q_PrintStrlen
import Q_strcat
import Q_strncpyz
import Q_stristr
import Q_strupr
import Q_strlwr
import Q_stricmpn
import Q_strncmp
import Q_stricmp
import Q_isintegral
import Q_isanumber
import Q_isalpha
import Q_isupper
import Q_islower
import Q_isprint
import Com_RandomBytes
import Com_SkipCharset
import Com_SkipTokens
import Com_sprintf
import Com_HexStrToInt
import Parse3DMatrix
import Parse2DMatrix
import Parse1DMatrix
import SkipRestOfLine
import SkipBracedSection
import COM_MatchToken
import COM_ParseWarning
import COM_ParseError
import COM_Compress
import COM_ParseExt
import COM_Parse
import COM_GetCurrentParseLine
import COM_BeginParseSession
import COM_DefaultExtension
import COM_CompareExtension
import COM_StripExtension
import COM_GetExtension
import COM_SkipPath
import Com_Clamp
import PerpendicularVector
import AngleVectors
import MatrixMultiply
import MakeNormalVectors
import RotateAroundDirection
import RotatePointAroundVector
import ProjectPointOnPlane
import PlaneFromPoints
import AngleDelta
import AngleNormalize180
import AngleNormalize360
import AnglesSubtract
import AngleSubtract
import LerpAngle
import AngleMod
import BoundsIntersectPoint
import BoundsIntersectSphere
import BoundsIntersect
import BoxOnPlaneSide
import SetPlaneSignbits
import AxisCopy
import AxisClear
import AnglesToAxis
import vectoangles
import Q_crandom
import Q_random
import Q_rand
import Q_acos
import Q_log2
import VectorRotate
import Vector4Scale
import VectorNormalize2
import VectorNormalize
import CrossProduct
import VectorInverse
import VectorNormalizeFast
import DistanceSquared
import Distance
import VectorLengthSquared
import VectorLength
import VectorCompare
import AddPointToBounds
import ClearBounds
import RadiusFromBounds
import NormalizeColor
import ColorBytes4
import ColorBytes3
import _VectorMA
import _VectorScale
import _VectorCopy
import _VectorAdd
import _VectorSubtract
import _DotProduct
import ByteToDir
import DirToByte
import ClampShort
import ClampChar
import Q_rsqrt
import Q_fabs
import Q_isnan
import axisDefault
import vec3_origin
import g_color_table
import colorDkGrey
import colorMdGrey
import colorLtGrey
import colorWhite
import colorCyan
import colorMagenta
import colorYellow
import colorBlue
import colorGreen
import colorRed
import colorBlack
import bytedirs
import Hunk_AllocDebug
import FloatSwap
import LongSwap
import ShortSwap
import CopyLongSwap
import CopyShortSwap
import qk_acos
import qk_fabs
import qk_abs
import qk_tan
import qk_atan2
import qk_cos
import qk_sin
import qk_sqrt
import qk_floor
import qk_ceil
import qk_memcpy
import qk_memset
import qk_memmove
import qk_sscanf
import qk_vsnprintf
import qk_strtol
import qk_atoi
import qk_strtod
import qk_atof
import qk_toupper
import qk_tolower
import qk_strncpy
import qk_strstr
import qk_strrchr
import qk_strchr
import qk_strcmp
import qk_strcpy
import qk_strcat
import qk_strlen
import qk_rand
import qk_srand
import qk_qsort
lit
align 1
LABELV $268
byte 1 109
byte 1 101
byte 1 110
byte 1 117
byte 1 47
byte 1 97
byte 1 114
byte 1 116
byte 1 47
byte 1 98
byte 1 97
byte 1 99
byte 1 107
byte 1 95
byte 1 49
byte 1 0
align 1
LABELV $251
byte 1 109
byte 1 101
byte 1 110
byte 1 117
byte 1 47
byte 1 97
byte 1 114
byte 1 116
byte 1 47
byte 1 98
byte 1 97
byte 1 99
byte 1 107
byte 1 95
byte 1 48
byte 1 0
align 1
LABELV $243
byte 1 68
byte 1 69
byte 1 70
byte 1 65
byte 1 85
byte 1 76
byte 1 84
byte 1 83
byte 1 0
align 1
LABELV $229
byte 1 99
byte 1 108
byte 1 95
byte 1 112
byte 1 97
byte 1 117
byte 1 115
byte 1 101
byte 1 100
byte 1 0
align 1
LABELV $222
byte 1 67
byte 1 68
byte 1 32
byte 1 75
byte 1 101
byte 1 121
byte 1 0
align 1
LABELV $204
byte 1 71
byte 1 65
byte 1 77
byte 1 69
byte 1 32
byte 1 79
byte 1 80
byte 1 84
byte 1 73
byte 1 79
byte 1 78
byte 1 83
byte 1 0
align 1
LABELV $186
byte 1 83
byte 1 89
byte 1 83
byte 1 84
byte 1 69
byte 1 77
byte 1 0
align 1
LABELV $168
byte 1 67
byte 1 79
byte 1 78
byte 1 84
byte 1 82
byte 1 79
byte 1 76
byte 1 83
byte 1 0
align 1
LABELV $150
byte 1 80
byte 1 76
byte 1 65
byte 1 89
byte 1 69
byte 1 82
byte 1 0
align 1
LABELV $126
byte 1 109
byte 1 101
byte 1 110
byte 1 117
byte 1 47
byte 1 97
byte 1 114
byte 1 116
byte 1 47
byte 1 102
byte 1 114
byte 1 97
byte 1 109
byte 1 101
byte 1 49
byte 1 95
byte 1 114
byte 1 0
align 1
LABELV $112
byte 1 109
byte 1 101
byte 1 110
byte 1 117
byte 1 47
byte 1 97
byte 1 114
byte 1 116
byte 1 47
byte 1 102
byte 1 114
byte 1 97
byte 1 109
byte 1 101
byte 1 50
byte 1 95
byte 1 108
byte 1 0
align 1
LABELV $104
byte 1 83
byte 1 69
byte 1 84
byte 1 85
byte 1 80
byte 1 0
align 1
LABELV $90
byte 1 83
byte 1 69
byte 1 84
byte 1 32
byte 1 84
byte 1 79
byte 1 32
byte 1 68
byte 1 69
byte 1 70
byte 1 65
byte 1 85
byte 1 76
byte 1 84
byte 1 83
byte 1 63
byte 1 0
align 1
LABELV $77
byte 1 111
byte 1 112
byte 1 116
byte 1 105
byte 1 111
byte 1 110
byte 1 115
byte 1 32
byte 1 116
byte 1 111
byte 1 32
byte 1 116
byte 1 104
byte 1 101
byte 1 105
byte 1 114
byte 1 32
byte 1 100
byte 1 101
byte 1 102
byte 1 97
byte 1 117
byte 1 108
byte 1 116
byte 1 32
byte 1 118
byte 1 97
byte 1 108
byte 1 117
byte 1 101
byte 1 115
byte 1 46
byte 1 0
align 1
LABELV $76
byte 1 87
byte 1 65
byte 1 82
byte 1 78
byte 1 73
byte 1 78
byte 1 71
byte 1 58
byte 1 32
byte 1 84
byte 1 104
byte 1 105
byte 1 115
byte 1 32
byte 1 119
byte 1 105
byte 1 108
byte 1 108
byte 1 32
byte 1 114
byte 1 101
byte 1 115
byte 1 101
byte 1 116
byte 1 32
byte 1 42
byte 1 65
byte 1 76
byte 1 76
byte 1 42
byte 1 0
align 1
LABELV $74
byte 1 118
byte 1 105
byte 1 100
byte 1 95
byte 1 114
byte 1 101
byte 1 115
byte 1 116
byte 1 97
byte 1 114
byte 1 116
byte 1 10
byte 1 0
align 1
LABELV $73
byte 1 99
byte 1 118
byte 1 97
byte 1 114
byte 1 95
byte 1 114
byte 1 101
byte 1 115
byte 1 116
byte 1 97
byte 1 114
byte 1 116
byte 1 10
byte 1 0
align 1
LABELV $72
byte 1 101
byte 1 120
byte 1 101
byte 1 99
byte 1 32
byte 1 100
byte 1 101
byte 1 102
byte 1 97
byte 1 117
byte 1 108
byte 1 116
byte 1 46
byte 1 99
byte 1 102
byte 1 103
byte 1 10
byte 1 0
