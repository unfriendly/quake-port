code
proc UI_SaveConfigMenu_BackEvent 0 0
ADDRFP4 4
INDIRI4
CNSTI4 3
EQI4 $70
ADDRGP4 $69
JUMPV
LABELV $70
ADDRGP4 UI_PopMenu
CALLV
pop
LABELV $69
endproc UI_SaveConfigMenu_BackEvent 0 0
proc UI_SaveConfigMenu_SaveEvent 68 12
ADDRFP4 4
INDIRI4
CNSTI4 3
EQI4 $73
ADDRGP4 $72
JUMPV
LABELV $73
ADDRGP4 saveConfig+448+60+12
INDIRI1
CVII4 1
CNSTI4 0
NEI4 $75
ADDRGP4 $72
JUMPV
LABELV $75
ADDRGP4 saveConfig+448+60+12
ARGP4
ADDRLP4 0
ARGP4
CNSTI4 64
ARGI4
ADDRGP4 COM_StripExtension
CALLV
pop
ADDRGP4 $83
ARGP4
ADDRLP4 0
ARGP4
ADDRLP4 64
ADDRGP4 va
CALLP4
ASGNP4
CNSTI4 2
ARGI4
ADDRLP4 64
INDIRP4
ARGP4
ADDRGP4 trap_Cmd_ExecuteText
CALLV
pop
ADDRGP4 UI_PopMenu
CALLV
pop
LABELV $72
endproc UI_SaveConfigMenu_SaveEvent 68 12
proc UI_SaveConfigMenu_SavenameDraw 24 20
ADDRLP4 0
ADDRFP4 0
INDIRP4
ASGNP4
ADDRGP4 saveConfig
ARGP4
ADDRLP4 12
ADDRGP4 Menu_ItemAtCursor
CALLP4
ASGNP4
ADDRLP4 0
INDIRP4
CVPU4 4
ADDRLP4 12
INDIRP4
CVPU4 4
NEU4 $85
ADDRLP4 4
CNSTI4 16400
ASGNI4
ADDRLP4 8
ADDRGP4 text_color_highlight
ASGNP4
ADDRGP4 $86
JUMPV
LABELV $85
ADDRLP4 4
CNSTI4 16
ASGNI4
ADDRLP4 8
ADDRGP4 colorRed
ASGNP4
LABELV $86
CNSTI4 320
ARGI4
CNSTI4 192
ARGI4
ADDRGP4 $87
ARGP4
CNSTI4 17
ARGI4
ADDRGP4 color_orange
ARGP4
ADDRGP4 UI_DrawProportionalString
CALLV
pop
ADDRLP4 0
INDIRP4
CNSTI4 12
ADDP4
INDIRI4
CVIF4 4
ARGF4
ADDRLP4 0
INDIRP4
CNSTI4 16
ADDP4
INDIRI4
CVIF4 4
ARGF4
ADDRLP4 0
INDIRP4
CNSTI4 68
ADDP4
INDIRI4
CNSTI4 3
LSHI4
CVIF4 4
ARGF4
CNSTF4 1098907648
ARGF4
ADDRGP4 colorBlack
ARGP4
ADDRGP4 UI_FillRect
CALLV
pop
ADDRLP4 0
INDIRP4
CNSTI4 60
ADDP4
ARGP4
ADDRLP4 0
INDIRP4
CNSTI4 12
ADDP4
INDIRI4
ARGI4
ADDRLP4 0
INDIRP4
CNSTI4 16
ADDP4
INDIRI4
ARGI4
ADDRLP4 4
INDIRI4
ARGI4
ADDRLP4 8
INDIRP4
ARGP4
ADDRGP4 MField_Draw
CALLV
pop
LABELV $84
endproc UI_SaveConfigMenu_SavenameDraw 24 20
proc UI_SaveConfigMenu_Init 0 12
ADDRGP4 saveConfig
ARGP4
CNSTI4 0
ARGI4
CNSTU4 956
ARGU4
ADDRGP4 qk_memset
CALLP4
pop
ADDRGP4 UI_SaveConfigMenu_Cache
CALLV
pop
ADDRGP4 saveConfig+276
CNSTI4 1
ASGNI4
ADDRGP4 saveConfig+280
CNSTI4 1
ASGNI4
ADDRGP4 saveConfig+288
CNSTI4 10
ASGNI4
ADDRGP4 saveConfig+288+12
CNSTI4 320
ASGNI4
ADDRGP4 saveConfig+288+16
CNSTI4 16
ASGNI4
ADDRGP4 saveConfig+288+60
ADDRGP4 $98
ASGNP4
ADDRGP4 saveConfig+288+68
ADDRGP4 color_white
ASGNP4
ADDRGP4 saveConfig+288+64
CNSTI4 1
ASGNI4
ADDRGP4 saveConfig+360
CNSTI4 6
ASGNI4
ADDRGP4 saveConfig+360+4
ADDRGP4 $106
ASGNP4
ADDRGP4 saveConfig+360+44
CNSTU4 16384
ASGNU4
ADDRGP4 saveConfig+360+12
CNSTI4 142
ASGNI4
ADDRGP4 saveConfig+360+16
CNSTI4 118
ASGNI4
ADDRGP4 saveConfig+360+76
CNSTI4 359
ASGNI4
ADDRGP4 saveConfig+360+80
CNSTI4 256
ASGNI4
ADDRGP4 saveConfig+448
CNSTI4 4
ASGNI4
ADDRGP4 saveConfig+448+44
CNSTU4 557056
ASGNU4
ADDRGP4 saveConfig+448+56
ADDRGP4 UI_SaveConfigMenu_SavenameDraw
ASGNP4
ADDRGP4 saveConfig+448+60+8
CNSTI4 20
ASGNI4
ADDRGP4 saveConfig+448+60+268
CNSTI4 20
ASGNI4
ADDRGP4 saveConfig+448+12
CNSTI4 240
ASGNI4
ADDRGP4 saveConfig+448+16
CNSTI4 227
ASGNI4
ADDRGP4 saveConfig+448+20
CNSTI4 240
ASGNI4
ADDRGP4 saveConfig+448+24
CNSTI4 227
ASGNI4
ADDRGP4 saveConfig+448+28
CNSTI4 393
ASGNI4
ADDRGP4 saveConfig+448+32
CNSTI4 245
ASGNI4
ADDRGP4 saveConfig+780
CNSTI4 6
ASGNI4
ADDRGP4 saveConfig+780+4
ADDRGP4 $143
ASGNP4
ADDRGP4 saveConfig+780+44
CNSTU4 260
ASGNU4
ADDRGP4 saveConfig+780+8
CNSTI4 11
ASGNI4
ADDRGP4 saveConfig+780+48
ADDRGP4 UI_SaveConfigMenu_BackEvent
ASGNP4
ADDRGP4 saveConfig+780+12
CNSTI4 0
ASGNI4
ADDRGP4 saveConfig+780+16
CNSTI4 416
ASGNI4
ADDRGP4 saveConfig+780+76
CNSTI4 128
ASGNI4
ADDRGP4 saveConfig+780+80
CNSTI4 64
ASGNI4
ADDRGP4 saveConfig+780+60
ADDRGP4 $160
ASGNP4
ADDRGP4 saveConfig+868
CNSTI4 6
ASGNI4
ADDRGP4 saveConfig+868+4
ADDRGP4 $164
ASGNP4
ADDRGP4 saveConfig+868+44
CNSTU4 272
ASGNU4
ADDRGP4 saveConfig+868+8
CNSTI4 12
ASGNI4
ADDRGP4 saveConfig+868+48
ADDRGP4 UI_SaveConfigMenu_SaveEvent
ASGNP4
ADDRGP4 saveConfig+868+12
CNSTI4 640
ASGNI4
ADDRGP4 saveConfig+868+16
CNSTI4 416
ASGNI4
ADDRGP4 saveConfig+868+76
CNSTI4 128
ASGNI4
ADDRGP4 saveConfig+868+80
CNSTI4 64
ASGNI4
ADDRGP4 saveConfig+868+60
ADDRGP4 $181
ASGNP4
ADDRGP4 saveConfig
ARGP4
ADDRGP4 saveConfig+288
ARGP4
ADDRGP4 Menu_AddItem
CALLV
pop
ADDRGP4 saveConfig
ARGP4
ADDRGP4 saveConfig+360
ARGP4
ADDRGP4 Menu_AddItem
CALLV
pop
ADDRGP4 saveConfig
ARGP4
ADDRGP4 saveConfig+448
ARGP4
ADDRGP4 Menu_AddItem
CALLV
pop
ADDRGP4 saveConfig
ARGP4
ADDRGP4 saveConfig+780
ARGP4
ADDRGP4 Menu_AddItem
CALLV
pop
ADDRGP4 saveConfig
ARGP4
ADDRGP4 saveConfig+868
ARGP4
ADDRGP4 Menu_AddItem
CALLV
pop
LABELV $88
endproc UI_SaveConfigMenu_Init 0 12
export UI_SaveConfigMenu_Cache
proc UI_SaveConfigMenu_Cache 0 4
ADDRGP4 $143
ARGP4
ADDRGP4 trap_R_RegisterShaderNoMip
CALLI4
pop
ADDRGP4 $160
ARGP4
ADDRGP4 trap_R_RegisterShaderNoMip
CALLI4
pop
ADDRGP4 $164
ARGP4
ADDRGP4 trap_R_RegisterShaderNoMip
CALLI4
pop
ADDRGP4 $181
ARGP4
ADDRGP4 trap_R_RegisterShaderNoMip
CALLI4
pop
ADDRGP4 $106
ARGP4
ADDRGP4 trap_R_RegisterShaderNoMip
CALLI4
pop
LABELV $187
endproc UI_SaveConfigMenu_Cache 0 4
export UI_SaveConfigMenu
proc UI_SaveConfigMenu 0 4
ADDRGP4 UI_SaveConfigMenu_Init
CALLV
pop
ADDRGP4 saveConfig
ARGP4
ADDRGP4 UI_PushMenu
CALLV
pop
LABELV $188
endproc UI_SaveConfigMenu 0 4
bss
align 4
LABELV saveConfig
skip 956
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
import UI_SetupMenu
import UI_SetupMenu_Cache
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
LABELV $181
byte 1 109
byte 1 101
byte 1 110
byte 1 117
byte 1 47
byte 1 97
byte 1 114
byte 1 116
byte 1 47
byte 1 115
byte 1 97
byte 1 118
byte 1 101
byte 1 95
byte 1 49
byte 1 0
align 1
LABELV $164
byte 1 109
byte 1 101
byte 1 110
byte 1 117
byte 1 47
byte 1 97
byte 1 114
byte 1 116
byte 1 47
byte 1 115
byte 1 97
byte 1 118
byte 1 101
byte 1 95
byte 1 48
byte 1 0
align 1
LABELV $160
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
LABELV $143
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
LABELV $106
byte 1 109
byte 1 101
byte 1 110
byte 1 117
byte 1 47
byte 1 97
byte 1 114
byte 1 116
byte 1 47
byte 1 99
byte 1 117
byte 1 116
byte 1 95
byte 1 102
byte 1 114
byte 1 97
byte 1 109
byte 1 101
byte 1 0
align 1
LABELV $98
byte 1 83
byte 1 65
byte 1 86
byte 1 69
byte 1 32
byte 1 67
byte 1 79
byte 1 78
byte 1 70
byte 1 73
byte 1 71
byte 1 0
align 1
LABELV $87
byte 1 69
byte 1 110
byte 1 116
byte 1 101
byte 1 114
byte 1 32
byte 1 102
byte 1 105
byte 1 108
byte 1 101
byte 1 110
byte 1 97
byte 1 109
byte 1 101
byte 1 58
byte 1 0
align 1
LABELV $83
byte 1 119
byte 1 114
byte 1 105
byte 1 116
byte 1 101
byte 1 99
byte 1 111
byte 1 110
byte 1 102
byte 1 105
byte 1 103
byte 1 32
byte 1 37
byte 1 115
byte 1 46
byte 1 99
byte 1 102
byte 1 103
byte 1 10
byte 1 0