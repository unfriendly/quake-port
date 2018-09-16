data
align 4
LABELV teamoverlay_names
address $69
address $70
address $71
address $72
byte 4 0
code
proc Preferences_SetMenuItems 84 12
ADDRGP4 $76
ARGP4
ADDRLP4 0
ADDRGP4 trap_Cvar_VariableValue
CALLF4
ASGNF4
ADDRGP4 s_preferences+536+64
ADDRLP4 0
INDIRF4
CVFI4 4
CNSTI4 10
MODI4
ASGNI4
ADDRGP4 $79
ARGP4
ADDRLP4 8
ADDRGP4 trap_Cvar_VariableValue
CALLF4
ASGNF4
ADDRLP4 8
INDIRF4
CNSTF4 0
EQF4 $81
ADDRLP4 4
CNSTI4 1
ASGNI4
ADDRGP4 $82
JUMPV
LABELV $81
ADDRLP4 4
CNSTI4 0
ASGNI4
LABELV $82
ADDRGP4 s_preferences+632+60
ADDRLP4 4
INDIRI4
ASGNI4
ADDRGP4 $85
ARGP4
ADDRLP4 16
ADDRGP4 trap_Cvar_VariableValue
CALLF4
ASGNF4
ADDRLP4 16
INDIRF4
CNSTF4 0
EQF4 $87
ADDRLP4 12
CNSTI4 1
ASGNI4
ADDRGP4 $88
JUMPV
LABELV $87
ADDRLP4 12
CNSTI4 0
ASGNI4
LABELV $88
ADDRGP4 s_preferences+696+60
ADDRLP4 12
INDIRI4
ASGNI4
ADDRGP4 $91
ARGP4
ADDRLP4 24
ADDRGP4 trap_Cvar_VariableValue
CALLF4
ASGNF4
ADDRLP4 24
INDIRF4
CNSTF4 0
EQF4 $93
ADDRLP4 20
CNSTI4 1
ASGNI4
ADDRGP4 $94
JUMPV
LABELV $93
ADDRLP4 20
CNSTI4 0
ASGNI4
LABELV $94
ADDRGP4 s_preferences+760+60
ADDRLP4 20
INDIRI4
ASGNI4
ADDRGP4 $97
ARGP4
ADDRLP4 32
ADDRGP4 trap_Cvar_VariableValue
CALLF4
ASGNF4
ADDRLP4 32
INDIRF4
CNSTF4 0
EQF4 $99
ADDRLP4 28
CNSTI4 1
ASGNI4
ADDRGP4 $100
JUMPV
LABELV $99
ADDRLP4 28
CNSTI4 0
ASGNI4
LABELV $100
ADDRGP4 s_preferences+888+60
ADDRLP4 28
INDIRI4
ASGNI4
ADDRGP4 $103
ARGP4
ADDRLP4 40
ADDRGP4 trap_Cvar_VariableValue
CALLF4
ASGNF4
ADDRLP4 40
INDIRF4
CNSTF4 0
EQF4 $105
ADDRLP4 36
CNSTI4 1
ASGNI4
ADDRGP4 $106
JUMPV
LABELV $105
ADDRLP4 36
CNSTI4 0
ASGNI4
LABELV $106
ADDRGP4 s_preferences+824+60
ADDRLP4 36
INDIRI4
ASGNI4
ADDRGP4 $109
ARGP4
ADDRLP4 48
ADDRGP4 trap_Cvar_VariableValue
CALLF4
ASGNF4
ADDRLP4 48
INDIRF4
CNSTF4 0
NEF4 $111
ADDRLP4 44
CNSTI4 1
ASGNI4
ADDRGP4 $112
JUMPV
LABELV $111
ADDRLP4 44
CNSTI4 0
ASGNI4
LABELV $112
ADDRGP4 s_preferences+952+60
ADDRLP4 44
INDIRI4
ASGNI4
ADDRGP4 $115
ARGP4
ADDRLP4 56
ADDRGP4 trap_Cvar_VariableValue
CALLF4
ASGNF4
ADDRLP4 56
INDIRF4
CNSTF4 0
EQF4 $117
ADDRLP4 52
CNSTI4 1
ASGNI4
ADDRGP4 $118
JUMPV
LABELV $117
ADDRLP4 52
CNSTI4 0
ASGNI4
LABELV $118
ADDRGP4 s_preferences+1016+60
ADDRLP4 52
INDIRI4
ASGNI4
ADDRGP4 $121
ARGP4
ADDRLP4 64
ADDRGP4 trap_Cvar_VariableValue
CALLF4
ASGNF4
ADDRLP4 64
INDIRF4
CNSTF4 0
EQF4 $123
ADDRLP4 60
CNSTI4 1
ASGNI4
ADDRGP4 $124
JUMPV
LABELV $123
ADDRLP4 60
CNSTI4 0
ASGNI4
LABELV $124
ADDRGP4 s_preferences+1080+60
ADDRLP4 60
INDIRI4
ASGNI4
ADDRGP4 $127
ARGP4
ADDRLP4 68
ADDRGP4 trap_Cvar_VariableValue
CALLF4
ASGNF4
CNSTF4 0
ARGF4
CNSTF4 1077936128
ARGF4
ADDRLP4 68
INDIRF4
ARGF4
ADDRLP4 72
ADDRGP4 Com_Clamp
CALLF4
ASGNF4
ADDRGP4 s_preferences+1144+64
ADDRLP4 72
INDIRF4
CVFI4 4
ASGNI4
ADDRGP4 $130
ARGP4
ADDRLP4 80
ADDRGP4 trap_Cvar_VariableValue
CALLF4
ASGNF4
ADDRLP4 80
INDIRF4
CNSTF4 0
EQF4 $132
ADDRLP4 76
CNSTI4 1
ASGNI4
ADDRGP4 $133
JUMPV
LABELV $132
ADDRLP4 76
CNSTI4 0
ASGNI4
LABELV $133
ADDRGP4 s_preferences+1240+60
ADDRLP4 76
INDIRI4
ASGNI4
LABELV $73
endproc Preferences_SetMenuItems 84 12
proc Preferences_Event 12 8
ADDRFP4 4
INDIRI4
CNSTI4 3
EQI4 $135
ADDRGP4 $134
JUMPV
LABELV $135
ADDRLP4 0
ADDRFP4 0
INDIRP4
CNSTI4 8
ADDP4
INDIRI4
ASGNI4
ADDRLP4 0
INDIRI4
CNSTI4 127
LTI4 $137
ADDRLP4 0
INDIRI4
CNSTI4 138
GTI4 $137
ADDRLP4 0
INDIRI4
CNSTI4 2
LSHI4
ADDRGP4 $182-508
ADDP4
INDIRP4
JUMPV
lit
align 4
LABELV $182
address $140
address $143
address $146
address $152
address $157
address $160
address $163
address $166
address $169
address $172
address $175
address $181
code
LABELV $140
ADDRGP4 $76
ARGP4
ADDRGP4 s_preferences+536+64
INDIRI4
CVIF4 4
ARGF4
ADDRGP4 trap_Cvar_SetValue
CALLV
pop
ADDRGP4 $138
JUMPV
LABELV $143
ADDRGP4 $79
ARGP4
ADDRGP4 s_preferences+632+60
INDIRI4
CVIF4 4
ARGF4
ADDRGP4 trap_Cvar_SetValue
CALLV
pop
ADDRGP4 $138
JUMPV
LABELV $146
ADDRGP4 $109
ARGP4
ADDRGP4 s_preferences+952+60
INDIRI4
CNSTI4 0
NEI4 $150
ADDRLP4 8
CNSTI4 1
ASGNI4
ADDRGP4 $151
JUMPV
LABELV $150
ADDRLP4 8
CNSTI4 0
ASGNI4
LABELV $151
ADDRLP4 8
INDIRI4
CVIF4 4
ARGF4
ADDRGP4 trap_Cvar_SetValue
CALLV
pop
ADDRGP4 $138
JUMPV
LABELV $152
ADDRGP4 s_preferences+696+60
INDIRI4
CNSTI4 0
EQI4 $153
ADDRGP4 $85
ARGP4
ADDRGP4 trap_Cvar_Reset
CALLV
pop
ADDRGP4 $138
JUMPV
LABELV $153
ADDRGP4 $85
ARGP4
CNSTF4 0
ARGF4
ADDRGP4 trap_Cvar_SetValue
CALLV
pop
ADDRGP4 $138
JUMPV
LABELV $157
ADDRGP4 $91
ARGP4
ADDRGP4 s_preferences+760+60
INDIRI4
CVIF4 4
ARGF4
ADDRGP4 trap_Cvar_SetValue
CALLV
pop
ADDRGP4 $138
JUMPV
LABELV $160
ADDRGP4 $103
ARGP4
ADDRGP4 s_preferences+824+60
INDIRI4
CVIF4 4
ARGF4
ADDRGP4 trap_Cvar_SetValue
CALLV
pop
ADDRGP4 $138
JUMPV
LABELV $163
ADDRGP4 $97
ARGP4
ADDRGP4 s_preferences+888+60
INDIRI4
CVIF4 4
ARGF4
ADDRGP4 trap_Cvar_SetValue
CALLV
pop
ADDRGP4 $138
JUMPV
LABELV $166
ADDRGP4 $115
ARGP4
ADDRGP4 s_preferences+1016+60
INDIRI4
CVIF4 4
ARGF4
ADDRGP4 trap_Cvar_SetValue
CALLV
pop
ADDRGP4 $138
JUMPV
LABELV $169
ADDRGP4 $121
ARGP4
ADDRGP4 s_preferences+1080+60
INDIRI4
CVIF4 4
ARGF4
ADDRGP4 trap_Cvar_SetValue
CALLV
pop
ADDRGP4 $138
JUMPV
LABELV $172
ADDRGP4 $127
ARGP4
ADDRGP4 s_preferences+1144+64
INDIRI4
CVIF4 4
ARGF4
ADDRGP4 trap_Cvar_SetValue
CALLV
pop
ADDRGP4 $138
JUMPV
LABELV $175
ADDRGP4 $130
ARGP4
ADDRGP4 s_preferences+1240+60
INDIRI4
CVIF4 4
ARGF4
ADDRGP4 trap_Cvar_SetValue
CALLV
pop
ADDRGP4 $178
ARGP4
ADDRGP4 s_preferences+1240+60
INDIRI4
CVIF4 4
ARGF4
ADDRGP4 trap_Cvar_SetValue
CALLV
pop
ADDRGP4 $138
JUMPV
LABELV $181
ADDRGP4 UI_PopMenu
CALLV
pop
LABELV $137
LABELV $138
LABELV $134
endproc Preferences_Event 12 8
proc Crosshair_Draw 52 20
ADDRLP4 0
ADDRFP4 0
INDIRP4
ASGNP4
ADDRLP4 4
ADDRLP4 0
INDIRP4
CNSTI4 12
ADDP4
INDIRI4
ASGNI4
ADDRLP4 32
CNSTI4 16
ASGNI4
ADDRLP4 8
ADDRLP4 0
INDIRP4
ADDRLP4 32
INDIRI4
ADDP4
INDIRI4
ASGNI4
ADDRLP4 20
ADDRLP4 32
INDIRI4
ASGNI4
ADDRLP4 0
INDIRP4
CNSTI4 36
ADDP4
INDIRP4
INDIRI4
ADDRLP4 0
INDIRP4
CNSTI4 40
ADDP4
INDIRI4
NEI4 $186
ADDRLP4 24
CNSTI4 1
ASGNI4
ADDRGP4 $187
JUMPV
LABELV $186
ADDRLP4 24
CNSTI4 0
ASGNI4
LABELV $187
ADDRLP4 16
ADDRLP4 24
INDIRI4
ASGNI4
ADDRLP4 0
INDIRP4
CNSTI4 44
ADDP4
INDIRU4
CNSTU4 8192
BANDU4
CNSTU4 0
EQU4 $188
ADDRLP4 12
ADDRGP4 text_color_disabled
ASGNP4
ADDRGP4 $189
JUMPV
LABELV $188
ADDRLP4 16
INDIRI4
CNSTI4 0
EQI4 $190
ADDRLP4 12
ADDRGP4 text_color_highlight
ASGNP4
ADDRLP4 20
ADDRLP4 20
INDIRI4
CNSTI4 16384
BORI4
ASGNI4
ADDRGP4 $191
JUMPV
LABELV $190
ADDRLP4 0
INDIRP4
CNSTI4 44
ADDP4
INDIRU4
CNSTU4 1
BANDU4
CNSTU4 0
EQU4 $192
ADDRLP4 12
ADDRGP4 text_color_highlight
ASGNP4
ADDRLP4 20
ADDRLP4 20
INDIRI4
CNSTI4 4096
BORI4
ASGNI4
ADDRGP4 $193
JUMPV
LABELV $192
ADDRLP4 12
ADDRGP4 text_color_normal
ASGNP4
LABELV $193
LABELV $191
LABELV $189
ADDRLP4 16
INDIRI4
CNSTI4 0
EQI4 $194
ADDRLP4 40
ADDRLP4 0
INDIRP4
CNSTI4 20
ADDP4
INDIRI4
ASGNI4
ADDRLP4 40
INDIRI4
CVIF4 4
ARGF4
ADDRLP4 44
ADDRLP4 0
INDIRP4
CNSTI4 24
ADDP4
INDIRI4
ASGNI4
ADDRLP4 44
INDIRI4
CVIF4 4
ARGF4
ADDRLP4 48
CNSTI4 1
ASGNI4
ADDRLP4 0
INDIRP4
CNSTI4 28
ADDP4
INDIRI4
ADDRLP4 40
INDIRI4
SUBI4
ADDRLP4 48
INDIRI4
ADDI4
CVIF4 4
ARGF4
ADDRLP4 0
INDIRP4
CNSTI4 32
ADDP4
INDIRI4
ADDRLP4 44
INDIRI4
SUBI4
ADDRLP4 48
INDIRI4
ADDI4
CVIF4 4
ARGF4
ADDRGP4 listbar_color
ARGP4
ADDRGP4 UI_FillRect
CALLV
pop
ADDRLP4 4
INDIRI4
ARGI4
ADDRLP4 8
INDIRI4
ARGI4
CNSTI4 13
ARGI4
CNSTI4 4113
ARGI4
ADDRLP4 12
INDIRP4
ARGP4
ADDRGP4 UI_DrawChar
CALLV
pop
LABELV $194
ADDRLP4 4
INDIRI4
CNSTI4 8
SUBI4
ARGI4
ADDRLP4 8
INDIRI4
ARGI4
ADDRLP4 0
INDIRP4
CNSTI4 4
ADDP4
INDIRP4
ARGP4
ADDRLP4 20
INDIRI4
CNSTI4 2
BORI4
ARGI4
ADDRLP4 12
INDIRP4
ARGP4
ADDRGP4 UI_DrawString
CALLV
pop
ADDRLP4 0
INDIRP4
CNSTI4 64
ADDP4
INDIRI4
CNSTI4 0
NEI4 $196
ADDRGP4 $184
JUMPV
LABELV $196
ADDRLP4 4
INDIRI4
CNSTI4 8
ADDI4
CVIF4 4
ARGF4
ADDRLP4 8
INDIRI4
CNSTI4 4
SUBI4
CVIF4 4
ARGF4
ADDRLP4 36
CNSTF4 1103101952
ASGNF4
ADDRLP4 36
INDIRF4
ARGF4
ADDRLP4 36
INDIRF4
ARGF4
ADDRLP4 0
INDIRP4
CNSTI4 64
ADDP4
INDIRI4
CNSTI4 2
LSHI4
ADDRGP4 s_preferences+1392
ADDP4
INDIRI4
ARGI4
ADDRGP4 UI_DrawHandlePic
CALLV
pop
LABELV $184
endproc Crosshair_Draw 52 20
proc Preferences_MenuInit 8 12
ADDRGP4 s_preferences
ARGP4
CNSTI4 0
ARGI4
CNSTU4 1432
ARGU4
ADDRGP4 qk_memset
CALLP4
pop
ADDRGP4 Preferences_Cache
CALLV
pop
ADDRGP4 s_preferences+276
CNSTI4 1
ASGNI4
ADDRGP4 s_preferences+280
CNSTI4 1
ASGNI4
ADDRGP4 s_preferences+288
CNSTI4 10
ASGNI4
ADDRGP4 s_preferences+288+12
CNSTI4 320
ASGNI4
ADDRGP4 s_preferences+288+16
CNSTI4 16
ASGNI4
ADDRGP4 s_preferences+288+60
ADDRGP4 $209
ASGNP4
ADDRGP4 s_preferences+288+68
ADDRGP4 color_white
ASGNP4
ADDRGP4 s_preferences+288+64
CNSTI4 1
ASGNI4
ADDRGP4 s_preferences+360
CNSTI4 6
ASGNI4
ADDRGP4 s_preferences+360+4
ADDRGP4 $217
ASGNP4
ADDRGP4 s_preferences+360+44
CNSTU4 16384
ASGNU4
ADDRGP4 s_preferences+360+12
CNSTI4 0
ASGNI4
ADDRGP4 s_preferences+360+16
CNSTI4 78
ASGNI4
ADDRGP4 s_preferences+360+76
CNSTI4 256
ASGNI4
ADDRGP4 s_preferences+360+80
CNSTI4 329
ASGNI4
ADDRGP4 s_preferences+448
CNSTI4 6
ASGNI4
ADDRGP4 s_preferences+448+4
ADDRGP4 $231
ASGNP4
ADDRGP4 s_preferences+448+44
CNSTU4 16384
ASGNU4
ADDRGP4 s_preferences+448+12
CNSTI4 376
ASGNI4
ADDRGP4 s_preferences+448+16
CNSTI4 76
ASGNI4
ADDRGP4 s_preferences+448+76
CNSTI4 256
ASGNI4
ADDRGP4 s_preferences+448+80
CNSTI4 334
ASGNI4
ADDRLP4 0
CNSTI4 144
ASGNI4
ADDRGP4 s_preferences+536
CNSTI4 3
ASGNI4
ADDRGP4 s_preferences+536+44
CNSTU4 98562
ASGNU4
ADDRGP4 s_preferences+536+12
CNSTI4 360
ASGNI4
ADDRGP4 s_preferences+536+16
ADDRLP4 0
INDIRI4
ASGNI4
ADDRGP4 s_preferences+536+4
ADDRGP4 $251
ASGNP4
ADDRGP4 s_preferences+536+48
ADDRGP4 Preferences_Event
ASGNP4
ADDRGP4 s_preferences+536+56
ADDRGP4 Crosshair_Draw
ASGNP4
ADDRGP4 s_preferences+536+8
CNSTI4 127
ASGNI4
ADDRGP4 s_preferences+536+24
ADDRLP4 0
INDIRI4
CNSTI4 4
SUBI4
ASGNI4
ADDRGP4 s_preferences+536+32
ADDRLP4 0
INDIRI4
CNSTI4 20
ADDI4
ASGNI4
ADDRGP4 s_preferences+536+4
INDIRP4
ARGP4
ADDRLP4 4
ADDRGP4 qk_strlen
CALLU4
ASGNU4
ADDRGP4 s_preferences+536+20
CNSTU4 360
ADDRLP4 4
INDIRU4
CNSTU4 1
ADDU4
CNSTI4 3
LSHU4
SUBU4
CVUI4 4
ASGNI4
ADDRGP4 s_preferences+536+28
CNSTI4 408
ASGNI4
ADDRGP4 s_preferences+536+68
CNSTI4 10
ASGNI4
ADDRLP4 0
ADDRLP4 0
INDIRI4
CNSTI4 22
ADDI4
ASGNI4
ADDRGP4 s_preferences+632
CNSTI4 5
ASGNI4
ADDRGP4 s_preferences+632+4
ADDRGP4 $273
ASGNP4
ADDRGP4 s_preferences+632+44
CNSTU4 258
ASGNU4
ADDRGP4 s_preferences+632+48
ADDRGP4 Preferences_Event
ASGNP4
ADDRGP4 s_preferences+632+8
CNSTI4 128
ASGNI4
ADDRGP4 s_preferences+632+12
CNSTI4 360
ASGNI4
ADDRGP4 s_preferences+632+16
ADDRLP4 0
INDIRI4
ASGNI4
ADDRLP4 0
ADDRLP4 0
INDIRI4
CNSTI4 16
ADDI4
ASGNI4
ADDRGP4 s_preferences+760
CNSTI4 5
ASGNI4
ADDRGP4 s_preferences+760+4
ADDRGP4 $287
ASGNP4
ADDRGP4 s_preferences+760+44
CNSTU4 258
ASGNU4
ADDRGP4 s_preferences+760+48
ADDRGP4 Preferences_Event
ASGNP4
ADDRGP4 s_preferences+760+8
CNSTI4 131
ASGNI4
ADDRGP4 s_preferences+760+12
CNSTI4 360
ASGNI4
ADDRGP4 s_preferences+760+16
ADDRLP4 0
INDIRI4
ASGNI4
ADDRLP4 0
ADDRLP4 0
INDIRI4
CNSTI4 18
ADDI4
ASGNI4
ADDRGP4 s_preferences+696
CNSTI4 5
ASGNI4
ADDRGP4 s_preferences+696+4
ADDRGP4 $301
ASGNP4
ADDRGP4 s_preferences+696+44
CNSTU4 258
ASGNU4
ADDRGP4 s_preferences+696+48
ADDRGP4 Preferences_Event
ASGNP4
ADDRGP4 s_preferences+696+8
CNSTI4 130
ASGNI4
ADDRGP4 s_preferences+696+12
CNSTI4 360
ASGNI4
ADDRGP4 s_preferences+696+16
ADDRLP4 0
INDIRI4
ASGNI4
ADDRLP4 0
ADDRLP4 0
INDIRI4
CNSTI4 18
ADDI4
ASGNI4
ADDRGP4 s_preferences+824
CNSTI4 5
ASGNI4
ADDRGP4 s_preferences+824+4
ADDRGP4 $315
ASGNP4
ADDRGP4 s_preferences+824+44
CNSTU4 258
ASGNU4
ADDRGP4 s_preferences+824+48
ADDRGP4 Preferences_Event
ASGNP4
ADDRGP4 s_preferences+824+8
CNSTI4 132
ASGNI4
ADDRGP4 s_preferences+824+12
CNSTI4 360
ASGNI4
ADDRGP4 s_preferences+824+16
ADDRLP4 0
INDIRI4
ASGNI4
ADDRLP4 0
ADDRLP4 0
INDIRI4
CNSTI4 18
ADDI4
ASGNI4
ADDRGP4 s_preferences+888
CNSTI4 5
ASGNI4
ADDRGP4 s_preferences+888+4
ADDRGP4 $329
ASGNP4
ADDRGP4 s_preferences+888+44
CNSTU4 258
ASGNU4
ADDRGP4 s_preferences+888+48
ADDRGP4 Preferences_Event
ASGNP4
ADDRGP4 s_preferences+888+8
CNSTI4 133
ASGNI4
ADDRGP4 s_preferences+888+12
CNSTI4 360
ASGNI4
ADDRGP4 s_preferences+888+16
ADDRLP4 0
INDIRI4
ASGNI4
ADDRLP4 0
ADDRLP4 0
INDIRI4
CNSTI4 18
ADDI4
ASGNI4
ADDRGP4 s_preferences+952
CNSTI4 5
ASGNI4
ADDRGP4 s_preferences+952+4
ADDRGP4 $343
ASGNP4
ADDRGP4 s_preferences+952+44
CNSTU4 258
ASGNU4
ADDRGP4 s_preferences+952+48
ADDRGP4 Preferences_Event
ASGNP4
ADDRGP4 s_preferences+952+8
CNSTI4 129
ASGNI4
ADDRGP4 s_preferences+952+12
CNSTI4 360
ASGNI4
ADDRGP4 s_preferences+952+16
ADDRLP4 0
INDIRI4
ASGNI4
ADDRLP4 0
ADDRLP4 0
INDIRI4
CNSTI4 18
ADDI4
ASGNI4
ADDRGP4 s_preferences+1016
CNSTI4 5
ASGNI4
ADDRGP4 s_preferences+1016+4
ADDRGP4 $357
ASGNP4
ADDRGP4 s_preferences+1016+44
CNSTU4 258
ASGNU4
ADDRGP4 s_preferences+1016+48
ADDRGP4 Preferences_Event
ASGNP4
ADDRGP4 s_preferences+1016+8
CNSTI4 134
ASGNI4
ADDRGP4 s_preferences+1016+12
CNSTI4 360
ASGNI4
ADDRGP4 s_preferences+1016+16
ADDRLP4 0
INDIRI4
ASGNI4
ADDRLP4 0
ADDRLP4 0
INDIRI4
CNSTI4 18
ADDI4
ASGNI4
ADDRGP4 s_preferences+1080
CNSTI4 5
ASGNI4
ADDRGP4 s_preferences+1080+4
ADDRGP4 $371
ASGNP4
ADDRGP4 s_preferences+1080+44
CNSTU4 258
ASGNU4
ADDRGP4 s_preferences+1080+48
ADDRGP4 Preferences_Event
ASGNP4
ADDRGP4 s_preferences+1080+8
CNSTI4 135
ASGNI4
ADDRGP4 s_preferences+1080+12
CNSTI4 360
ASGNI4
ADDRGP4 s_preferences+1080+16
ADDRLP4 0
INDIRI4
ASGNI4
ADDRLP4 0
ADDRLP4 0
INDIRI4
CNSTI4 18
ADDI4
ASGNI4
ADDRGP4 s_preferences+1144
CNSTI4 3
ASGNI4
ADDRGP4 s_preferences+1144+4
ADDRGP4 $385
ASGNP4
ADDRGP4 s_preferences+1144+44
CNSTU4 258
ASGNU4
ADDRGP4 s_preferences+1144+48
ADDRGP4 Preferences_Event
ASGNP4
ADDRGP4 s_preferences+1144+8
CNSTI4 136
ASGNI4
ADDRGP4 s_preferences+1144+12
CNSTI4 360
ASGNI4
ADDRGP4 s_preferences+1144+16
ADDRLP4 0
INDIRI4
ASGNI4
ADDRGP4 s_preferences+1144+76
ADDRGP4 teamoverlay_names
ASGNP4
ADDRLP4 0
ADDRLP4 0
INDIRI4
CNSTI4 18
ADDI4
ASGNI4
ADDRGP4 s_preferences+1240
CNSTI4 5
ASGNI4
ADDRGP4 s_preferences+1240+4
ADDRGP4 $401
ASGNP4
ADDRGP4 s_preferences+1240+44
CNSTU4 258
ASGNU4
ADDRGP4 s_preferences+1240+48
ADDRGP4 Preferences_Event
ASGNP4
ADDRGP4 s_preferences+1240+8
CNSTI4 137
ASGNI4
ADDRGP4 s_preferences+1240+12
CNSTI4 360
ASGNI4
ADDRGP4 s_preferences+1240+16
ADDRLP4 0
INDIRI4
ASGNI4
ADDRLP4 0
ADDRLP4 0
INDIRI4
CNSTI4 18
ADDI4
ASGNI4
ADDRGP4 s_preferences+1304
CNSTI4 6
ASGNI4
ADDRGP4 s_preferences+1304+4
ADDRGP4 $415
ASGNP4
ADDRGP4 s_preferences+1304+44
CNSTU4 260
ASGNU4
ADDRGP4 s_preferences+1304+48
ADDRGP4 Preferences_Event
ASGNP4
ADDRGP4 s_preferences+1304+8
CNSTI4 138
ASGNI4
ADDRGP4 s_preferences+1304+12
CNSTI4 0
ASGNI4
ADDRGP4 s_preferences+1304+16
CNSTI4 416
ASGNI4
ADDRGP4 s_preferences+1304+76
CNSTI4 128
ASGNI4
ADDRGP4 s_preferences+1304+80
CNSTI4 64
ASGNI4
ADDRGP4 s_preferences+1304+60
ADDRGP4 $432
ASGNP4
ADDRGP4 s_preferences
ARGP4
ADDRGP4 s_preferences+288
ARGP4
ADDRGP4 Menu_AddItem
CALLV
pop
ADDRGP4 s_preferences
ARGP4
ADDRGP4 s_preferences+360
ARGP4
ADDRGP4 Menu_AddItem
CALLV
pop
ADDRGP4 s_preferences
ARGP4
ADDRGP4 s_preferences+448
ARGP4
ADDRGP4 Menu_AddItem
CALLV
pop
ADDRGP4 s_preferences
ARGP4
ADDRGP4 s_preferences+536
ARGP4
ADDRGP4 Menu_AddItem
CALLV
pop
ADDRGP4 s_preferences
ARGP4
ADDRGP4 s_preferences+632
ARGP4
ADDRGP4 Menu_AddItem
CALLV
pop
ADDRGP4 s_preferences
ARGP4
ADDRGP4 s_preferences+760
ARGP4
ADDRGP4 Menu_AddItem
CALLV
pop
ADDRGP4 s_preferences
ARGP4
ADDRGP4 s_preferences+696
ARGP4
ADDRGP4 Menu_AddItem
CALLV
pop
ADDRGP4 s_preferences
ARGP4
ADDRGP4 s_preferences+824
ARGP4
ADDRGP4 Menu_AddItem
CALLV
pop
ADDRGP4 s_preferences
ARGP4
ADDRGP4 s_preferences+888
ARGP4
ADDRGP4 Menu_AddItem
CALLV
pop
ADDRGP4 s_preferences
ARGP4
ADDRGP4 s_preferences+952
ARGP4
ADDRGP4 Menu_AddItem
CALLV
pop
ADDRGP4 s_preferences
ARGP4
ADDRGP4 s_preferences+1016
ARGP4
ADDRGP4 Menu_AddItem
CALLV
pop
ADDRGP4 s_preferences
ARGP4
ADDRGP4 s_preferences+1080
ARGP4
ADDRGP4 Menu_AddItem
CALLV
pop
ADDRGP4 s_preferences
ARGP4
ADDRGP4 s_preferences+1144
ARGP4
ADDRGP4 Menu_AddItem
CALLV
pop
ADDRGP4 s_preferences
ARGP4
ADDRGP4 s_preferences+1240
ARGP4
ADDRGP4 Menu_AddItem
CALLV
pop
ADDRGP4 s_preferences
ARGP4
ADDRGP4 s_preferences+1304
ARGP4
ADDRGP4 Menu_AddItem
CALLV
pop
ADDRGP4 Preferences_SetMenuItems
CALLV
pop
LABELV $199
endproc Preferences_MenuInit 8 12
export Preferences_Cache
proc Preferences_Cache 16 8
ADDRGP4 $217
ARGP4
ADDRGP4 trap_R_RegisterShaderNoMip
CALLI4
pop
ADDRGP4 $231
ARGP4
ADDRGP4 trap_R_RegisterShaderNoMip
CALLI4
pop
ADDRGP4 $415
ARGP4
ADDRGP4 trap_R_RegisterShaderNoMip
CALLI4
pop
ADDRGP4 $432
ARGP4
ADDRGP4 trap_R_RegisterShaderNoMip
CALLI4
pop
ADDRLP4 0
CNSTI4 0
ASGNI4
LABELV $449
ADDRGP4 $454
ARGP4
ADDRLP4 0
INDIRI4
CNSTI4 97
ADDI4
ARGI4
ADDRLP4 8
ADDRGP4 va
CALLP4
ASGNP4
ADDRLP4 8
INDIRP4
ARGP4
ADDRLP4 12
ADDRGP4 trap_R_RegisterShaderNoMip
CALLI4
ASGNI4
ADDRLP4 0
INDIRI4
CNSTI4 2
LSHI4
ADDRGP4 s_preferences+1392
ADDP4
ADDRLP4 12
INDIRI4
ASGNI4
LABELV $450
ADDRLP4 0
ADDRLP4 0
INDIRI4
CNSTI4 1
ADDI4
ASGNI4
ADDRLP4 0
INDIRI4
CNSTI4 10
LTI4 $449
LABELV $448
endproc Preferences_Cache 16 8
export UI_PreferencesMenu
proc UI_PreferencesMenu 0 4
ADDRGP4 Preferences_MenuInit
CALLV
pop
ADDRGP4 s_preferences
ARGP4
ADDRGP4 UI_PushMenu
CALLV
pop
LABELV $455
endproc UI_PreferencesMenu 0 4
bss
align 4
LABELV s_preferences
skip 1432
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
LABELV $454
byte 1 103
byte 1 102
byte 1 120
byte 1 47
byte 1 50
byte 1 100
byte 1 47
byte 1 99
byte 1 114
byte 1 111
byte 1 115
byte 1 115
byte 1 104
byte 1 97
byte 1 105
byte 1 114
byte 1 37
byte 1 99
byte 1 0
align 1
LABELV $432
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
LABELV $415
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
LABELV $401
byte 1 65
byte 1 117
byte 1 116
byte 1 111
byte 1 109
byte 1 97
byte 1 116
byte 1 105
byte 1 99
byte 1 32
byte 1 68
byte 1 111
byte 1 119
byte 1 110
byte 1 108
byte 1 111
byte 1 97
byte 1 100
byte 1 105
byte 1 110
byte 1 103
byte 1 58
byte 1 0
align 1
LABELV $385
byte 1 68
byte 1 114
byte 1 97
byte 1 119
byte 1 32
byte 1 84
byte 1 101
byte 1 97
byte 1 109
byte 1 32
byte 1 79
byte 1 118
byte 1 101
byte 1 114
byte 1 108
byte 1 97
byte 1 121
byte 1 58
byte 1 0
align 1
LABELV $371
byte 1 70
byte 1 111
byte 1 114
byte 1 99
byte 1 101
byte 1 32
byte 1 80
byte 1 108
byte 1 97
byte 1 121
byte 1 101
byte 1 114
byte 1 32
byte 1 77
byte 1 111
byte 1 100
byte 1 101
byte 1 108
byte 1 115
byte 1 58
byte 1 0
align 1
LABELV $357
byte 1 83
byte 1 121
byte 1 110
byte 1 99
byte 1 32
byte 1 69
byte 1 118
byte 1 101
byte 1 114
byte 1 121
byte 1 32
byte 1 70
byte 1 114
byte 1 97
byte 1 109
byte 1 101
byte 1 58
byte 1 0
align 1
LABELV $343
byte 1 72
byte 1 105
byte 1 103
byte 1 104
byte 1 32
byte 1 81
byte 1 117
byte 1 97
byte 1 108
byte 1 105
byte 1 116
byte 1 121
byte 1 32
byte 1 83
byte 1 107
byte 1 121
byte 1 58
byte 1 0
align 1
LABELV $329
byte 1 73
byte 1 100
byte 1 101
byte 1 110
byte 1 116
byte 1 105
byte 1 102
byte 1 121
byte 1 32
byte 1 84
byte 1 97
byte 1 114
byte 1 103
byte 1 101
byte 1 116
byte 1 58
byte 1 0
align 1
LABELV $315
byte 1 68
byte 1 121
byte 1 110
byte 1 97
byte 1 109
byte 1 105
byte 1 99
byte 1 32
byte 1 76
byte 1 105
byte 1 103
byte 1 104
byte 1 116
byte 1 115
byte 1 58
byte 1 0
align 1
LABELV $301
byte 1 69
byte 1 106
byte 1 101
byte 1 99
byte 1 116
byte 1 105
byte 1 110
byte 1 103
byte 1 32
byte 1 66
byte 1 114
byte 1 97
byte 1 115
byte 1 115
byte 1 58
byte 1 0
align 1
LABELV $287
byte 1 77
byte 1 97
byte 1 114
byte 1 107
byte 1 115
byte 1 32
byte 1 111
byte 1 110
byte 1 32
byte 1 87
byte 1 97
byte 1 108
byte 1 108
byte 1 115
byte 1 58
byte 1 0
align 1
LABELV $273
byte 1 83
byte 1 105
byte 1 109
byte 1 112
byte 1 108
byte 1 101
byte 1 32
byte 1 73
byte 1 116
byte 1 101
byte 1 109
byte 1 115
byte 1 58
byte 1 0
align 1
LABELV $251
byte 1 67
byte 1 114
byte 1 111
byte 1 115
byte 1 115
byte 1 104
byte 1 97
byte 1 105
byte 1 114
byte 1 58
byte 1 0
align 1
LABELV $231
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
LABELV $217
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
LABELV $209
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
LABELV $178
byte 1 115
byte 1 118
byte 1 95
byte 1 97
byte 1 108
byte 1 108
byte 1 111
byte 1 119
byte 1 68
byte 1 111
byte 1 119
byte 1 110
byte 1 108
byte 1 111
byte 1 97
byte 1 100
byte 1 0
align 1
LABELV $130
byte 1 99
byte 1 108
byte 1 95
byte 1 97
byte 1 108
byte 1 108
byte 1 111
byte 1 119
byte 1 68
byte 1 111
byte 1 119
byte 1 110
byte 1 108
byte 1 111
byte 1 97
byte 1 100
byte 1 0
align 1
LABELV $127
byte 1 99
byte 1 103
byte 1 95
byte 1 100
byte 1 114
byte 1 97
byte 1 119
byte 1 84
byte 1 101
byte 1 97
byte 1 109
byte 1 79
byte 1 118
byte 1 101
byte 1 114
byte 1 108
byte 1 97
byte 1 121
byte 1 0
align 1
LABELV $121
byte 1 99
byte 1 103
byte 1 95
byte 1 102
byte 1 111
byte 1 114
byte 1 99
byte 1 101
byte 1 109
byte 1 111
byte 1 100
byte 1 101
byte 1 108
byte 1 0
align 1
LABELV $115
byte 1 114
byte 1 95
byte 1 102
byte 1 105
byte 1 110
byte 1 105
byte 1 115
byte 1 104
byte 1 0
align 1
LABELV $109
byte 1 114
byte 1 95
byte 1 102
byte 1 97
byte 1 115
byte 1 116
byte 1 115
byte 1 107
byte 1 121
byte 1 0
align 1
LABELV $103
byte 1 114
byte 1 95
byte 1 100
byte 1 121
byte 1 110
byte 1 97
byte 1 109
byte 1 105
byte 1 99
byte 1 108
byte 1 105
byte 1 103
byte 1 104
byte 1 116
byte 1 0
align 1
LABELV $97
byte 1 99
byte 1 103
byte 1 95
byte 1 100
byte 1 114
byte 1 97
byte 1 119
byte 1 67
byte 1 114
byte 1 111
byte 1 115
byte 1 115
byte 1 104
byte 1 97
byte 1 105
byte 1 114
byte 1 78
byte 1 97
byte 1 109
byte 1 101
byte 1 115
byte 1 0
align 1
LABELV $91
byte 1 99
byte 1 103
byte 1 95
byte 1 109
byte 1 97
byte 1 114
byte 1 107
byte 1 115
byte 1 0
align 1
LABELV $85
byte 1 99
byte 1 103
byte 1 95
byte 1 98
byte 1 114
byte 1 97
byte 1 115
byte 1 115
byte 1 84
byte 1 105
byte 1 109
byte 1 101
byte 1 0
align 1
LABELV $79
byte 1 99
byte 1 103
byte 1 95
byte 1 115
byte 1 105
byte 1 109
byte 1 112
byte 1 108
byte 1 101
byte 1 73
byte 1 116
byte 1 101
byte 1 109
byte 1 115
byte 1 0
align 1
LABELV $76
byte 1 99
byte 1 103
byte 1 95
byte 1 100
byte 1 114
byte 1 97
byte 1 119
byte 1 67
byte 1 114
byte 1 111
byte 1 115
byte 1 115
byte 1 104
byte 1 97
byte 1 105
byte 1 114
byte 1 0
align 1
LABELV $72
byte 1 108
byte 1 111
byte 1 119
byte 1 101
byte 1 114
byte 1 32
byte 1 108
byte 1 101
byte 1 102
byte 1 116
byte 1 0
align 1
LABELV $71
byte 1 108
byte 1 111
byte 1 119
byte 1 101
byte 1 114
byte 1 32
byte 1 114
byte 1 105
byte 1 103
byte 1 104
byte 1 116
byte 1 0
align 1
LABELV $70
byte 1 117
byte 1 112
byte 1 112
byte 1 101
byte 1 114
byte 1 32
byte 1 114
byte 1 105
byte 1 103
byte 1 104
byte 1 116
byte 1 0
align 1
LABELV $69
byte 1 111
byte 1 102
byte 1 102
byte 1 0
