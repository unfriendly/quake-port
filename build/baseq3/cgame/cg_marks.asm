export CG_InitMarkPolys
code
proc CG_InitMarkPolys 12 12
ADDRGP4 cg_markPolys
ARGP4
CNSTI4 0
ARGI4
CNSTU4 73728
ARGU4
ADDRGP4 qk_memset
CALLP4
pop
ADDRGP4 cg_activeMarkPolys+4
ADDRGP4 cg_activeMarkPolys
ASGNP4
ADDRLP4 4
ADDRGP4 cg_activeMarkPolys
ASGNP4
ADDRLP4 4
INDIRP4
ADDRLP4 4
INDIRP4
ASGNP4
ADDRGP4 cg_freeMarkPolys
ADDRGP4 cg_markPolys
ASGNP4
ADDRLP4 0
CNSTI4 0
ASGNI4
LABELV $73
ADDRLP4 8
CNSTI4 288
ADDRLP4 0
INDIRI4
MULI4
ASGNI4
ADDRLP4 8
INDIRI4
ADDRGP4 cg_markPolys+4
ADDP4
ADDRLP4 8
INDIRI4
ADDRGP4 cg_markPolys+288
ADDP4
ASGNP4
LABELV $74
ADDRLP4 0
ADDRLP4 0
INDIRI4
CNSTI4 1
ADDI4
ASGNI4
ADDRLP4 0
INDIRI4
CNSTI4 255
LTI4 $73
LABELV $71
endproc CG_InitMarkPolys 12 12
export CG_FreeMarkPoly
proc CG_FreeMarkPoly 12 4
ADDRFP4 0
ADDRFP4 0
INDIRP4
ASGNP4
ADDRFP4 0
INDIRP4
INDIRP4
CVPU4 4
CNSTU4 0
NEU4 $80
ADDRGP4 $82
ARGP4
ADDRGP4 CG_Error
CALLV
pop
LABELV $80
ADDRLP4 4
CNSTI4 4
ASGNI4
ADDRFP4 0
INDIRP4
INDIRP4
ADDRLP4 4
INDIRI4
ADDP4
ADDRFP4 0
INDIRP4
ADDRLP4 4
INDIRI4
ADDP4
INDIRP4
ASGNP4
ADDRFP4 0
INDIRP4
CNSTI4 4
ADDP4
INDIRP4
ADDRFP4 0
INDIRP4
INDIRP4
ASGNP4
ADDRFP4 0
INDIRP4
CNSTI4 4
ADDP4
ADDRGP4 cg_freeMarkPolys
INDIRP4
ASGNP4
ADDRGP4 cg_freeMarkPolys
ADDRFP4 0
INDIRP4
ASGNP4
LABELV $79
endproc CG_FreeMarkPoly 12 4
export CG_AllocMark
proc CG_AllocMark 16 12
ADDRGP4 cg_freeMarkPolys
INDIRP4
CVPU4 4
CNSTU4 0
NEU4 $84
ADDRLP4 4
ADDRGP4 cg_activeMarkPolys
INDIRP4
CNSTI4 8
ADDP4
INDIRI4
ASGNI4
ADDRGP4 $87
JUMPV
LABELV $86
ADDRGP4 cg_activeMarkPolys
INDIRP4
ARGP4
ADDRGP4 CG_FreeMarkPoly
CALLV
pop
LABELV $87
ADDRLP4 8
ADDRGP4 cg_activeMarkPolys
INDIRP4
ASGNP4
ADDRLP4 8
INDIRP4
CVPU4 4
CNSTU4 0
EQU4 $89
ADDRLP4 4
INDIRI4
ADDRLP4 8
INDIRP4
CNSTI4 8
ADDP4
INDIRI4
EQI4 $86
LABELV $89
LABELV $84
ADDRLP4 8
ADDRGP4 cg_freeMarkPolys
ASGNP4
ADDRLP4 12
ADDRLP4 8
INDIRP4
INDIRP4
ASGNP4
ADDRLP4 0
ADDRLP4 12
INDIRP4
ASGNP4
ADDRLP4 8
INDIRP4
ADDRLP4 12
INDIRP4
CNSTI4 4
ADDP4
INDIRP4
ASGNP4
ADDRLP4 0
INDIRP4
ARGP4
CNSTI4 0
ARGI4
CNSTU4 288
ARGU4
ADDRGP4 qk_memset
CALLP4
pop
ADDRLP4 0
INDIRP4
CNSTI4 4
ADDP4
ADDRGP4 cg_activeMarkPolys+4
INDIRP4
ASGNP4
ADDRLP4 0
INDIRP4
ADDRGP4 cg_activeMarkPolys
ASGNP4
ADDRGP4 cg_activeMarkPolys+4
INDIRP4
ADDRLP4 0
INDIRP4
ASGNP4
ADDRGP4 cg_activeMarkPolys+4
ADDRLP4 0
INDIRP4
ASGNP4
ADDRLP4 0
INDIRP4
RETP4
LABELV $83
endproc CG_AllocMark 16 12
export CG_ImpactMark
proc CG_ImpactMark 6088 28
ADDRFP4 0
ADDRFP4 0
INDIRI4
ASGNI4
ADDRFP4 4
ADDRFP4 4
INDIRP4
ASGNP4
ADDRFP4 8
ADDRFP4 8
INDIRP4
ASGNP4
ADDRFP4 16
ADDRFP4 16
INDIRF4
ASGNF4
ADDRFP4 20
ADDRFP4 20
INDIRF4
ASGNF4
ADDRFP4 24
ADDRFP4 24
INDIRF4
ASGNF4
ADDRFP4 28
ADDRFP4 28
INDIRF4
ASGNF4
ADDRFP4 32
ADDRFP4 32
INDIRI4
ASGNI4
ADDRFP4 36
ADDRFP4 36
INDIRF4
ASGNF4
ADDRFP4 40
ADDRFP4 40
INDIRI4
ASGNI4
ADDRGP4 cg_addMarks+12
INDIRI4
CNSTI4 0
NEI4 $94
ADDRGP4 $93
JUMPV
LABELV $94
ADDRFP4 36
INDIRF4
CNSTF4 0
GTF4 $97
ADDRGP4 $99
ARGP4
ADDRGP4 CG_Error
CALLV
pop
LABELV $97
ADDRFP4 8
INDIRP4
ARGP4
ADDRLP4 0
ARGP4
ADDRGP4 VectorNormalize2
CALLF4
pop
ADDRLP4 0+12
ARGP4
ADDRLP4 0
ARGP4
ADDRGP4 PerpendicularVector
CALLV
pop
ADDRLP4 0+24
ARGP4
ADDRLP4 0
ARGP4
ADDRLP4 0+12
ARGP4
ADDRFP4 12
INDIRF4
ARGF4
ADDRGP4 RotatePointAroundVector
CALLV
pop
ADDRLP4 0
ARGP4
ADDRLP4 0+24
ARGP4
ADDRLP4 0+12
ARGP4
ADDRGP4 CrossProduct
CALLV
pop
ADDRLP4 48
CNSTF4 1056964608
ADDRFP4 36
INDIRF4
DIVF4
ASGNF4
ADDRLP4 44
CNSTI4 0
ASGNI4
LABELV $105
ADDRLP4 5752
ADDRLP4 44
INDIRI4
CNSTI4 2
LSHI4
ASGNI4
ADDRLP4 5752
INDIRI4
ADDRLP4 4664
ADDP4
ADDRLP4 5752
INDIRI4
ADDRFP4 4
INDIRP4
ADDP4
INDIRF4
ADDRFP4 36
INDIRF4
ADDRLP4 5752
INDIRI4
ADDRLP4 0+12
ADDP4
INDIRF4
MULF4
SUBF4
ADDRFP4 36
INDIRF4
ADDRLP4 5752
INDIRI4
ADDRLP4 0+24
ADDP4
INDIRF4
MULF4
SUBF4
ASGNF4
ADDRLP4 5760
ADDRLP4 44
INDIRI4
CNSTI4 2
LSHI4
ASGNI4
ADDRLP4 5760
INDIRI4
ADDRLP4 4664+12
ADDP4
ADDRLP4 5760
INDIRI4
ADDRFP4 4
INDIRP4
ADDP4
INDIRF4
ADDRFP4 36
INDIRF4
ADDRLP4 5760
INDIRI4
ADDRLP4 0+12
ADDP4
INDIRF4
MULF4
ADDF4
ADDRFP4 36
INDIRF4
ADDRLP4 5760
INDIRI4
ADDRLP4 0+24
ADDP4
INDIRF4
MULF4
SUBF4
ASGNF4
ADDRLP4 5768
ADDRLP4 44
INDIRI4
CNSTI4 2
LSHI4
ASGNI4
ADDRLP4 5768
INDIRI4
ADDRLP4 4664+24
ADDP4
ADDRLP4 5768
INDIRI4
ADDRFP4 4
INDIRP4
ADDP4
INDIRF4
ADDRFP4 36
INDIRF4
ADDRLP4 5768
INDIRI4
ADDRLP4 0+12
ADDP4
INDIRF4
MULF4
ADDF4
ADDRFP4 36
INDIRF4
ADDRLP4 5768
INDIRI4
ADDRLP4 0+24
ADDP4
INDIRF4
MULF4
ADDF4
ASGNF4
ADDRLP4 5776
ADDRLP4 44
INDIRI4
CNSTI4 2
LSHI4
ASGNI4
ADDRLP4 5776
INDIRI4
ADDRLP4 4664+36
ADDP4
ADDRLP4 5776
INDIRI4
ADDRFP4 4
INDIRP4
ADDP4
INDIRF4
ADDRFP4 36
INDIRF4
ADDRLP4 5776
INDIRI4
ADDRLP4 0+12
ADDP4
INDIRF4
MULF4
SUBF4
ADDRFP4 36
INDIRF4
ADDRLP4 5776
INDIRI4
ADDRLP4 0+24
ADDP4
INDIRF4
MULF4
ADDF4
ASGNF4
LABELV $106
ADDRLP4 44
ADDRLP4 44
INDIRI4
CNSTI4 1
ADDI4
ASGNI4
ADDRLP4 44
INDIRI4
CNSTI4 3
LTI4 $105
ADDRLP4 5752
CNSTF4 3248488448
ASGNF4
ADDRLP4 4716
ADDRLP4 5752
INDIRF4
ADDRFP4 8
INDIRP4
INDIRF4
MULF4
ASGNF4
ADDRLP4 4716+4
ADDRLP4 5752
INDIRF4
ADDRFP4 8
INDIRP4
CNSTI4 4
ADDP4
INDIRF4
MULF4
ASGNF4
ADDRLP4 4716+8
CNSTF4 3248488448
ADDRFP4 8
INDIRP4
CNSTI4 8
ADDP4
INDIRF4
MULF4
ASGNF4
CNSTI4 4
ARGI4
ADDRLP4 4664
ARGP4
ADDRLP4 4716
ARGP4
CNSTI4 384
ARGI4
ADDRLP4 56
ARGP4
CNSTI4 128
ARGI4
ADDRLP4 4728
ARGP4
ADDRLP4 5760
ADDRGP4 trap_CM_MarkFragments
CALLI4
ASGNI4
ADDRLP4 4712
ADDRLP4 5760
INDIRI4
ASGNI4
ADDRLP4 5772
CNSTF4 1132396544
ADDRFP4 16
INDIRF4
MULF4
ASGNF4
ADDRLP4 5776
CNSTF4 1325400064
ASGNF4
ADDRLP4 5772
INDIRF4
ADDRLP4 5776
INDIRF4
LTF4 $123
ADDRLP4 5764
ADDRLP4 5772
INDIRF4
ADDRLP4 5776
INDIRF4
SUBF4
CVFI4 4
CVIU4 4
CNSTU4 2147483648
ADDU4
ASGNU4
ADDRGP4 $124
JUMPV
LABELV $123
ADDRLP4 5764
ADDRLP4 5772
INDIRF4
CVFI4 4
CVIU4 4
ASGNU4
LABELV $124
ADDRLP4 52
ADDRLP4 5764
INDIRU4
CVUU1 4
ASGNU1
ADDRLP4 5780
CNSTF4 1132396544
ADDRFP4 20
INDIRF4
MULF4
ASGNF4
ADDRLP4 5784
CNSTF4 1325400064
ASGNF4
ADDRLP4 5780
INDIRF4
ADDRLP4 5784
INDIRF4
LTF4 $127
ADDRLP4 5768
ADDRLP4 5780
INDIRF4
ADDRLP4 5784
INDIRF4
SUBF4
CVFI4 4
CVIU4 4
CNSTU4 2147483648
ADDU4
ASGNU4
ADDRGP4 $128
JUMPV
LABELV $127
ADDRLP4 5768
ADDRLP4 5780
INDIRF4
CVFI4 4
CVIU4 4
ASGNU4
LABELV $128
ADDRLP4 52+1
ADDRLP4 5768
INDIRU4
CVUU1 4
ASGNU1
ADDRLP4 5792
CNSTF4 1132396544
ADDRFP4 24
INDIRF4
MULF4
ASGNF4
ADDRLP4 5796
CNSTF4 1325400064
ASGNF4
ADDRLP4 5792
INDIRF4
ADDRLP4 5796
INDIRF4
LTF4 $131
ADDRLP4 5788
ADDRLP4 5792
INDIRF4
ADDRLP4 5796
INDIRF4
SUBF4
CVFI4 4
CVIU4 4
CNSTU4 2147483648
ADDU4
ASGNU4
ADDRGP4 $132
JUMPV
LABELV $131
ADDRLP4 5788
ADDRLP4 5792
INDIRF4
CVFI4 4
CVIU4 4
ASGNU4
LABELV $132
ADDRLP4 52+2
ADDRLP4 5788
INDIRU4
CVUU1 4
ASGNU1
ADDRLP4 5804
CNSTF4 1132396544
ADDRFP4 28
INDIRF4
MULF4
ASGNF4
ADDRLP4 5808
CNSTF4 1325400064
ASGNF4
ADDRLP4 5804
INDIRF4
ADDRLP4 5808
INDIRF4
LTF4 $135
ADDRLP4 5800
ADDRLP4 5804
INDIRF4
ADDRLP4 5808
INDIRF4
SUBF4
CVFI4 4
CVIU4 4
CNSTU4 2147483648
ADDU4
ASGNU4
ADDRGP4 $136
JUMPV
LABELV $135
ADDRLP4 5800
ADDRLP4 5804
INDIRF4
CVFI4 4
CVIU4 4
ASGNU4
LABELV $136
ADDRLP4 52+3
ADDRLP4 5800
INDIRU4
CVUU1 4
ASGNU1
ADDRLP4 44
CNSTI4 0
ASGNI4
ADDRLP4 40
ADDRLP4 4728
ASGNP4
ADDRGP4 $140
JUMPV
LABELV $137
ADDRLP4 40
INDIRP4
CNSTI4 4
ADDP4
INDIRI4
CNSTI4 10
LEI4 $141
ADDRLP4 40
INDIRP4
CNSTI4 4
ADDP4
CNSTI4 10
ASGNI4
LABELV $141
ADDRLP4 36
CNSTI4 0
ASGNI4
ADDRLP4 5812
ADDRLP4 5820
ASGNP4
ADDRGP4 $146
JUMPV
LABELV $143
ADDRLP4 5812
INDIRP4
CNSTI4 12
ADDRLP4 40
INDIRP4
INDIRI4
ADDRLP4 36
INDIRI4
ADDI4
MULI4
ADDRLP4 56
ADDP4
INDIRB
ASGNB 12
ADDRLP4 6060
ADDRLP4 5812
INDIRP4
INDIRF4
ADDRFP4 4
INDIRP4
INDIRF4
SUBF4
ASGNF4
ADDRLP4 6080
CNSTI4 4
ASGNI4
ADDRLP4 6060+4
ADDRLP4 5812
INDIRP4
ADDRLP4 6080
INDIRI4
ADDP4
INDIRF4
ADDRFP4 4
INDIRP4
ADDRLP4 6080
INDIRI4
ADDP4
INDIRF4
SUBF4
ASGNF4
ADDRLP4 6084
CNSTI4 8
ASGNI4
ADDRLP4 6060+8
ADDRLP4 5812
INDIRP4
ADDRLP4 6084
INDIRI4
ADDP4
INDIRF4
ADDRFP4 4
INDIRP4
ADDRLP4 6084
INDIRI4
ADDP4
INDIRF4
SUBF4
ASGNF4
ADDRLP4 5812
INDIRP4
CNSTI4 12
ADDP4
ADDRLP4 6060
INDIRF4
ADDRLP4 0+12
INDIRF4
MULF4
ADDRLP4 6060+4
INDIRF4
ADDRLP4 0+12+4
INDIRF4
MULF4
ADDF4
ADDRLP4 6060+8
INDIRF4
ADDRLP4 0+12+8
INDIRF4
MULF4
ADDF4
ADDRLP4 48
INDIRF4
MULF4
CNSTF4 1056964608
ADDF4
ASGNF4
ADDRLP4 5812
INDIRP4
CNSTI4 16
ADDP4
ADDRLP4 6060
INDIRF4
ADDRLP4 0+24
INDIRF4
MULF4
ADDRLP4 6060+4
INDIRF4
ADDRLP4 0+24+4
INDIRF4
MULF4
ADDF4
ADDRLP4 6060+8
INDIRF4
ADDRLP4 0+24+8
INDIRF4
MULF4
ADDF4
ADDRLP4 48
INDIRF4
MULF4
CNSTF4 1056964608
ADDF4
ASGNF4
ADDRLP4 5812
INDIRP4
CNSTI4 20
ADDP4
ADDRLP4 52
INDIRI4
ASGNI4
LABELV $144
ADDRLP4 36
ADDRLP4 36
INDIRI4
CNSTI4 1
ADDI4
ASGNI4
ADDRLP4 5812
ADDRLP4 5812
INDIRP4
CNSTI4 24
ADDP4
ASGNP4
LABELV $146
ADDRLP4 36
INDIRI4
ADDRLP4 40
INDIRP4
CNSTI4 4
ADDP4
INDIRI4
LTI4 $143
ADDRFP4 40
INDIRI4
CNSTI4 0
EQI4 $163
ADDRFP4 0
INDIRI4
ARGI4
ADDRLP4 40
INDIRP4
CNSTI4 4
ADDP4
INDIRI4
ARGI4
ADDRLP4 5820
ARGP4
ADDRGP4 trap_R_AddPolyToScene
CALLV
pop
ADDRGP4 $138
JUMPV
LABELV $163
ADDRLP4 6060
ADDRGP4 CG_AllocMark
CALLP4
ASGNP4
ADDRLP4 5816
ADDRLP4 6060
INDIRP4
ASGNP4
ADDRLP4 5816
INDIRP4
CNSTI4 8
ADDP4
ADDRGP4 cg+107604
INDIRI4
ASGNI4
ADDRLP4 5816
INDIRP4
CNSTI4 16
ADDP4
ADDRFP4 32
INDIRI4
ASGNI4
ADDRLP4 5816
INDIRP4
CNSTI4 12
ADDP4
ADDRFP4 0
INDIRI4
ASGNI4
ADDRLP4 5816
INDIRP4
CNSTI4 40
ADDP4
ADDRLP4 40
INDIRP4
CNSTI4 4
ADDP4
INDIRI4
ASGNI4
ADDRLP4 5816
INDIRP4
CNSTI4 20
ADDP4
ADDRFP4 16
INDIRF4
ASGNF4
ADDRLP4 5816
INDIRP4
CNSTI4 24
ADDP4
ADDRFP4 20
INDIRF4
ASGNF4
ADDRLP4 5816
INDIRP4
CNSTI4 28
ADDP4
ADDRFP4 24
INDIRF4
ASGNF4
ADDRLP4 5816
INDIRP4
CNSTI4 32
ADDP4
ADDRFP4 28
INDIRF4
ASGNF4
ADDRLP4 5816
INDIRP4
CNSTI4 48
ADDP4
ARGP4
ADDRLP4 5820
ARGP4
CNSTU4 24
ADDRLP4 40
INDIRP4
CNSTI4 4
ADDP4
INDIRI4
CVIU4 4
MULU4
ARGU4
ADDRGP4 qk_memcpy
CALLP4
pop
ADDRLP4 6064
ADDRGP4 markTotal
ASGNP4
ADDRLP4 6064
INDIRP4
ADDRLP4 6064
INDIRP4
INDIRI4
CNSTI4 1
ADDI4
ASGNI4
LABELV $138
ADDRLP4 44
ADDRLP4 44
INDIRI4
CNSTI4 1
ADDI4
ASGNI4
ADDRLP4 40
ADDRLP4 40
INDIRP4
CNSTI4 8
ADDP4
ASGNP4
LABELV $140
ADDRLP4 44
INDIRI4
ADDRLP4 4712
INDIRI4
LTI4 $137
LABELV $93
endproc CG_ImpactMark 6088 28
export CG_AddMarks
proc CG_AddMarks 84 12
ADDRGP4 cg_addMarks+12
INDIRI4
CNSTI4 0
NEI4 $167
ADDRGP4 $166
JUMPV
LABELV $167
ADDRLP4 0
ADDRGP4 cg_activeMarkPolys+4
INDIRP4
ASGNP4
ADDRGP4 $174
JUMPV
LABELV $171
ADDRLP4 16
ADDRLP4 0
INDIRP4
CNSTI4 4
ADDP4
INDIRP4
ASGNP4
ADDRGP4 cg+107604
INDIRI4
ADDRLP4 0
INDIRP4
CNSTI4 8
ADDP4
INDIRI4
CNSTI4 10000
ADDI4
LEI4 $175
ADDRLP4 0
INDIRP4
ARGP4
ADDRGP4 CG_FreeMarkPoly
CALLV
pop
ADDRGP4 $172
JUMPV
LABELV $175
ADDRLP4 0
INDIRP4
CNSTI4 12
ADDP4
INDIRI4
ADDRGP4 cgs+152852+372
INDIRI4
NEI4 $178
ADDRLP4 24
CNSTF4 1138819072
ASGNF4
ADDRLP4 8
ADDRLP4 24
INDIRF4
ADDRLP4 24
INDIRF4
ADDRGP4 cg+107604
INDIRI4
ADDRLP4 0
INDIRP4
CNSTI4 8
ADDP4
INDIRI4
SUBI4
CVIF4 4
CNSTF4 1161527296
DIVF4
MULF4
SUBF4
CVFI4 4
ASGNI4
ADDRLP4 8
INDIRI4
CNSTI4 255
GEI4 $183
ADDRLP4 8
INDIRI4
CNSTI4 0
GEI4 $185
ADDRLP4 8
CNSTI4 0
ASGNI4
LABELV $185
ADDRLP4 0
INDIRP4
CNSTI4 68
ADDP4
INDIRU1
CVUI4 1
CNSTI4 0
EQI4 $187
ADDRLP4 4
CNSTI4 0
ASGNI4
ADDRGP4 $192
JUMPV
LABELV $189
ADDRLP4 36
CNSTI4 20
ASGNI4
ADDRLP4 40
ADDRLP4 0
INDIRP4
ADDRLP4 36
INDIRI4
ADDP4
INDIRF4
ADDRLP4 8
INDIRI4
CVIF4 4
MULF4
ASGNF4
ADDRLP4 44
CNSTF4 1325400064
ASGNF4
ADDRLP4 40
INDIRF4
ADDRLP4 44
INDIRF4
LTF4 $194
ADDRLP4 28
ADDRLP4 40
INDIRF4
ADDRLP4 44
INDIRF4
SUBF4
CVFI4 4
CVIU4 4
CNSTU4 2147483648
ADDU4
ASGNU4
ADDRGP4 $195
JUMPV
LABELV $194
ADDRLP4 28
ADDRLP4 40
INDIRF4
CVFI4 4
CVIU4 4
ASGNU4
LABELV $195
CNSTI4 24
ADDRLP4 4
INDIRI4
MULI4
ADDRLP4 0
INDIRP4
CNSTI4 48
ADDP4
ADDP4
ADDRLP4 36
INDIRI4
ADDP4
ADDRLP4 28
INDIRU4
CVUU1 4
ASGNU1
ADDRLP4 56
CNSTI4 24
ASGNI4
ADDRLP4 60
ADDRLP4 0
INDIRP4
ADDRLP4 56
INDIRI4
ADDP4
INDIRF4
ADDRLP4 8
INDIRI4
CVIF4 4
MULF4
ASGNF4
ADDRLP4 64
CNSTF4 1325400064
ASGNF4
ADDRLP4 60
INDIRF4
ADDRLP4 64
INDIRF4
LTF4 $197
ADDRLP4 48
ADDRLP4 60
INDIRF4
ADDRLP4 64
INDIRF4
SUBF4
CVFI4 4
CVIU4 4
CNSTU4 2147483648
ADDU4
ASGNU4
ADDRGP4 $198
JUMPV
LABELV $197
ADDRLP4 48
ADDRLP4 60
INDIRF4
CVFI4 4
CVIU4 4
ASGNU4
LABELV $198
ADDRLP4 56
INDIRI4
ADDRLP4 4
INDIRI4
MULI4
ADDRLP4 0
INDIRP4
CNSTI4 48
ADDP4
ADDP4
CNSTI4 21
ADDP4
ADDRLP4 48
INDIRU4
CVUU1 4
ASGNU1
ADDRLP4 76
ADDRLP4 0
INDIRP4
CNSTI4 28
ADDP4
INDIRF4
ADDRLP4 8
INDIRI4
CVIF4 4
MULF4
ASGNF4
ADDRLP4 80
CNSTF4 1325400064
ASGNF4
ADDRLP4 76
INDIRF4
ADDRLP4 80
INDIRF4
LTF4 $200
ADDRLP4 68
ADDRLP4 76
INDIRF4
ADDRLP4 80
INDIRF4
SUBF4
CVFI4 4
CVIU4 4
CNSTU4 2147483648
ADDU4
ASGNU4
ADDRGP4 $201
JUMPV
LABELV $200
ADDRLP4 68
ADDRLP4 76
INDIRF4
CVFI4 4
CVIU4 4
ASGNU4
LABELV $201
CNSTI4 24
ADDRLP4 4
INDIRI4
MULI4
ADDRLP4 0
INDIRP4
CNSTI4 48
ADDP4
ADDP4
CNSTI4 22
ADDP4
ADDRLP4 68
INDIRU4
CVUU1 4
ASGNU1
LABELV $190
ADDRLP4 4
ADDRLP4 4
INDIRI4
CNSTI4 1
ADDI4
ASGNI4
LABELV $192
ADDRLP4 4
INDIRI4
ADDRLP4 0
INDIRP4
CNSTI4 40
ADDP4
INDIRI4
LTI4 $189
LABELV $187
LABELV $183
LABELV $178
ADDRLP4 12
ADDRLP4 0
INDIRP4
CNSTI4 8
ADDP4
INDIRI4
CNSTI4 10000
ADDI4
ADDRGP4 cg+107604
INDIRI4
SUBI4
ASGNI4
ADDRLP4 12
INDIRI4
CNSTI4 1000
GEI4 $203
ADDRLP4 8
CNSTI4 255
ADDRLP4 12
INDIRI4
MULI4
CNSTI4 1000
DIVI4
ASGNI4
ADDRLP4 0
INDIRP4
CNSTI4 16
ADDP4
INDIRI4
CNSTI4 0
EQI4 $205
ADDRLP4 4
CNSTI4 0
ASGNI4
ADDRGP4 $210
JUMPV
LABELV $207
CNSTI4 24
ADDRLP4 4
INDIRI4
MULI4
ADDRLP4 0
INDIRP4
CNSTI4 48
ADDP4
ADDP4
CNSTI4 23
ADDP4
ADDRLP4 8
INDIRI4
CVIU4 4
CVUU1 4
ASGNU1
LABELV $208
ADDRLP4 4
ADDRLP4 4
INDIRI4
CNSTI4 1
ADDI4
ASGNI4
LABELV $210
ADDRLP4 4
INDIRI4
ADDRLP4 0
INDIRP4
CNSTI4 40
ADDP4
INDIRI4
LTI4 $207
ADDRGP4 $206
JUMPV
LABELV $205
ADDRLP4 4
CNSTI4 0
ASGNI4
ADDRGP4 $214
JUMPV
LABELV $211
ADDRLP4 32
CNSTI4 20
ASGNI4
ADDRLP4 36
ADDRLP4 0
INDIRP4
ADDRLP4 32
INDIRI4
ADDP4
INDIRF4
ADDRLP4 8
INDIRI4
CVIF4 4
MULF4
ASGNF4
ADDRLP4 40
CNSTF4 1325400064
ASGNF4
ADDRLP4 36
INDIRF4
ADDRLP4 40
INDIRF4
LTF4 $216
ADDRLP4 24
ADDRLP4 36
INDIRF4
ADDRLP4 40
INDIRF4
SUBF4
CVFI4 4
CVIU4 4
CNSTU4 2147483648
ADDU4
ASGNU4
ADDRGP4 $217
JUMPV
LABELV $216
ADDRLP4 24
ADDRLP4 36
INDIRF4
CVFI4 4
CVIU4 4
ASGNU4
LABELV $217
CNSTI4 24
ADDRLP4 4
INDIRI4
MULI4
ADDRLP4 0
INDIRP4
CNSTI4 48
ADDP4
ADDP4
ADDRLP4 32
INDIRI4
ADDP4
ADDRLP4 24
INDIRU4
CVUU1 4
ASGNU1
ADDRLP4 52
CNSTI4 24
ASGNI4
ADDRLP4 56
ADDRLP4 0
INDIRP4
ADDRLP4 52
INDIRI4
ADDP4
INDIRF4
ADDRLP4 8
INDIRI4
CVIF4 4
MULF4
ASGNF4
ADDRLP4 60
CNSTF4 1325400064
ASGNF4
ADDRLP4 56
INDIRF4
ADDRLP4 60
INDIRF4
LTF4 $219
ADDRLP4 44
ADDRLP4 56
INDIRF4
ADDRLP4 60
INDIRF4
SUBF4
CVFI4 4
CVIU4 4
CNSTU4 2147483648
ADDU4
ASGNU4
ADDRGP4 $220
JUMPV
LABELV $219
ADDRLP4 44
ADDRLP4 56
INDIRF4
CVFI4 4
CVIU4 4
ASGNU4
LABELV $220
ADDRLP4 52
INDIRI4
ADDRLP4 4
INDIRI4
MULI4
ADDRLP4 0
INDIRP4
CNSTI4 48
ADDP4
ADDP4
CNSTI4 21
ADDP4
ADDRLP4 44
INDIRU4
CVUU1 4
ASGNU1
ADDRLP4 72
ADDRLP4 0
INDIRP4
CNSTI4 28
ADDP4
INDIRF4
ADDRLP4 8
INDIRI4
CVIF4 4
MULF4
ASGNF4
ADDRLP4 76
CNSTF4 1325400064
ASGNF4
ADDRLP4 72
INDIRF4
ADDRLP4 76
INDIRF4
LTF4 $222
ADDRLP4 64
ADDRLP4 72
INDIRF4
ADDRLP4 76
INDIRF4
SUBF4
CVFI4 4
CVIU4 4
CNSTU4 2147483648
ADDU4
ASGNU4
ADDRGP4 $223
JUMPV
LABELV $222
ADDRLP4 64
ADDRLP4 72
INDIRF4
CVFI4 4
CVIU4 4
ASGNU4
LABELV $223
CNSTI4 24
ADDRLP4 4
INDIRI4
MULI4
ADDRLP4 0
INDIRP4
CNSTI4 48
ADDP4
ADDP4
CNSTI4 22
ADDP4
ADDRLP4 64
INDIRU4
CVUU1 4
ASGNU1
LABELV $212
ADDRLP4 4
ADDRLP4 4
INDIRI4
CNSTI4 1
ADDI4
ASGNI4
LABELV $214
ADDRLP4 4
INDIRI4
ADDRLP4 0
INDIRP4
CNSTI4 40
ADDP4
INDIRI4
LTI4 $211
LABELV $206
LABELV $203
ADDRLP4 0
INDIRP4
CNSTI4 12
ADDP4
INDIRI4
ARGI4
ADDRLP4 0
INDIRP4
CNSTI4 40
ADDP4
INDIRI4
ARGI4
ADDRLP4 0
INDIRP4
CNSTI4 48
ADDP4
ARGP4
ADDRGP4 trap_R_AddPolyToScene
CALLV
pop
LABELV $172
ADDRLP4 0
ADDRLP4 16
INDIRP4
ASGNP4
LABELV $174
ADDRLP4 0
INDIRP4
CVPU4 4
ADDRGP4 cg_activeMarkPolys
CVPU4 4
NEU4 $171
LABELV $166
endproc CG_AddMarks 84 12
bss
align 4
LABELV markTotal
skip 4
export cg_freeMarkPolys
align 4
LABELV cg_freeMarkPolys
skip 4
export cg_activeMarkPolys
align 4
LABELV cg_activeMarkPolys
skip 288
import CG_NewParticleArea
import initparticles
import CG_ParticleExplosion
import CG_ParticleMisc
import CG_ParticleDust
import CG_ParticleSparks
import CG_ParticleBulletDebris
import CG_ParticleSnowFlurry
import CG_AddParticleShrapnel
import CG_ParticleSmoke
import CG_ParticleSnow
import CG_AddParticles
import CG_ClearParticles
import trap_GetEntityToken
import trap_getCameraInfo
import trap_startCamera
import trap_loadCamera
import trap_SnapVector
import trap_RealTime
import trap_CIN_SetExtents
import trap_CIN_DrawCinematic
import trap_CIN_RunCinematic
import trap_CIN_StopCinematic
import trap_CIN_PlayCinematic
import trap_Key_GetKey
import trap_Key_SetCatcher
import trap_Key_GetCatcher
import trap_Key_IsDown
import trap_R_RegisterFont
import trap_MemoryRemaining
import testPrintFloat
import testPrintInt
import trap_SetUserCmdValue
import trap_GetUserCmd
import trap_GetCurrentCmdNumber
import trap_GetServerCommand
import trap_GetSnapshot
import trap_GetCurrentSnapshotNumber
import trap_GetGameState
import trap_GetGlconfig
import trap_R_inPVS
import trap_R_RemapShader
import trap_R_LerpTag
import trap_R_ModelBounds
import trap_R_DrawStretchPic
import trap_R_SetColor
import trap_R_RenderScene
import trap_R_LightForPoint
import trap_R_AddAdditiveLightToScene
import trap_R_AddLightToScene
import trap_R_AddPolysToScene
import trap_R_AddPolyToScene
import trap_R_AddRefEntityToScene
import trap_R_ClearScene
import trap_R_RegisterShaderNoMip
import trap_R_RegisterShader
import trap_R_RegisterSkin
import trap_R_RegisterModel
import trap_R_LoadWorldMap
import trap_S_StopBackgroundTrack
import trap_S_StartBackgroundTrack
import trap_S_RegisterSound
import trap_S_Respatialize
import trap_S_UpdateEntityPosition
import trap_S_AddRealLoopingSound
import trap_S_AddLoopingSound
import trap_S_ClearLoopingSounds
import trap_S_StartLocalSound
import trap_S_StopLoopingSound
import trap_S_StartSound
import trap_CM_MarkFragments
import trap_CM_TransformedCapsuleTrace
import trap_CM_TransformedBoxTrace
import trap_CM_CapsuleTrace
import trap_CM_BoxTrace
import trap_CM_TransformedPointContents
import trap_CM_PointContents
import trap_CM_TempBoxModel
import trap_CM_InlineModel
import trap_CM_NumInlineModels
import trap_CM_LoadMap
import trap_UpdateScreen
import trap_SendClientCommand
import trap_RemoveCommand
import trap_AddCommand
import trap_SendConsoleCommand
import trap_FS_Seek
import trap_FS_FCloseFile
import trap_FS_Write
import trap_FS_Read
import trap_FS_FOpenFile
import trap_Args
import trap_Argv
import trap_Argc
import trap_Cvar_VariableStringBuffer
import trap_Cvar_Set
import trap_Cvar_Update
import trap_Cvar_Register
import trap_Milliseconds
import trap_Error
import trap_Print
import CG_CheckChangedPredictableEvents
import CG_TransitionPlayerState
import CG_Respawn
import CG_ShaderStateChanged
import CG_SetConfigValues
import CG_ParseServerinfo
import CG_ExecuteNewServerCommands
import CG_InitConsoleCommands
import CG_ConsoleCommand
import CG_DrawOldTourneyScoreboard
import CG_DrawOldScoreboard
import CG_DrawInformation
import CG_LoadingClient
import CG_LoadingItem
import CG_LoadingString
import CG_ProcessSnapshots
import CG_MakeExplosion
import CG_Bleed
import CG_BigExplode
import CG_GibPlayer
import CG_ScorePlum
import CG_SpawnEffect
import CG_BubbleTrail
import CG_SmokePuff
import CG_AddLocalEntities
import CG_AllocLocalEntity
import CG_InitLocalEntities
import CG_OutOfAmmoChange
import CG_DrawWeaponSelect
import CG_AddPlayerWeapon
import CG_AddViewWeapon
import CG_GrappleTrail
import CG_RailTrail
import CG_Bullet
import CG_ShotgunFire
import CG_MissileHitPlayer
import CG_MissileHitWall
import CG_FireWeapon
import CG_RegisterItemVisuals
import CG_RegisterWeapon
import CG_Weapon_f
import CG_PrevWeapon_f
import CG_NextWeapon_f
import CG_PositionRotatedEntityOnTag
import CG_PositionEntityOnTag
import CG_AdjustPositionForMover
import CG_Beam
import CG_AddPacketEntities
import CG_SetEntitySoundPosition
import CG_PainEvent
import CG_EntityEvent
import CG_PlaceString
import CG_CheckEvents
import CG_LoadDeferredPlayers
import CG_PredictPlayerState
import CG_Trace
import CG_PointContents
import CG_BuildSolidList
import CG_CustomSound
import CG_NewClientInfo
import CG_AddRefEntityWithPowerups
import CG_ResetPlayerEntity
import CG_Player
import CG_StatusHandle
import CG_OtherTeamHasFlag
import CG_YourTeamHasFlag
import CG_GameTypeString
import CG_CheckOrderPending
import CG_Text_PaintChar
import CG_Draw3DModel
import CG_GetKillerText
import CG_GetGameStatusText
import CG_GetTeamColor
import CG_InitTeamChat
import CG_SetPrintString
import CG_ShowResponseHead
import CG_RunMenuScript
import CG_OwnerDrawVisible
import CG_GetValue
import CG_SelectNextPlayer
import CG_SelectPrevPlayer
import CG_Text_Height
import CG_Text_Width
import CG_Text_Paint
import CG_OwnerDraw
import CG_DrawTeamBackground
import CG_DrawFlagModel
import CG_DrawActive
import CG_DrawHead
import CG_CenterPrint
import CG_AddLagometerSnapshotInfo
import CG_AddLagometerFrameInfo
import teamChat2
import teamChat1
import systemChat
import drawTeamOverlayModificationCount
import numSortedTeamPlayers
import sortedTeamPlayers
import CG_DrawTopBottom
import CG_DrawSides
import CG_DrawRect
import UI_DrawProportionalString
import CG_GetColorForHealth
import CG_ColorForHealth
import CG_TileClear
import CG_TeamColor
import CG_FadeColor
import CG_DrawStrlen
import CG_DrawSmallStringColor
import CG_DrawSmallString
import CG_DrawBigStringColor
import CG_DrawBigString
import CG_DrawStringExt
import CG_DrawString
import CG_DrawPic
import CG_FillRect
import CG_AdjustFrom640
import CG_DrawActiveFrame
import CG_AddBufferedSound
import CG_ZoomUp_f
import CG_ZoomDown_f
import CG_TestModelPrevSkin_f
import CG_TestModelNextSkin_f
import CG_TestModelPrevFrame_f
import CG_TestModelNextFrame_f
import CG_TestGun_f
import CG_TestModel_f
import CG_BuildSpectatorString
import CG_GetSelectedScore
import CG_SetScoreSelection
import CG_RankRunFrame
import CG_EventHandling
import CG_MouseEvent
import CG_KeyEvent
import CG_LoadMenus
import CG_LastAttacker
import CG_CrosshairPlayer
import CG_UpdateCvars
import CG_StartMusic
import CG_Error
import CG_Printf
import CG_Argv
import CG_ConfigString
import cg_trueLightning
import cg_oldPlasma
import cg_oldRocket
import cg_oldRail
import cg_noProjectileTrail
import cg_noTaunt
import cg_bigFont
import cg_smallFont
import cg_cameraMode
import cg_timescale
import cg_timescaleFadeSpeed
import cg_timescaleFadeEnd
import cg_cameraOrbitDelay
import cg_cameraOrbit
import pmove_msec
import pmove_fixed
import cg_smoothClients
import cg_scorePlum
import cg_teamChatsOnly
import cg_drawFriend
import cg_deferPlayers
import cg_predictItems
import cg_blood
import cg_paused
import cg_buildScript
import cg_forceModel
import cg_stats
import cg_teamChatHeight
import cg_teamChatTime
import cg_synchronousClients
import cg_drawAttacker
import cg_lagometer
import cg_thirdPerson
import cg_thirdPersonAngle
import cg_thirdPersonRange
import cg_zoomFov
import cg_fov
import cg_simpleItems
import cg_ignore
import cg_autoswitch
import cg_tracerLength
import cg_tracerWidth
import cg_tracerChance
import cg_viewsize
import cg_drawGun
import cg_gun_z
import cg_gun_y
import cg_gun_x
import cg_gun_frame
import cg_brassTime
import cg_addMarks
import cg_footsteps
import cg_showmiss
import cg_noPlayerAnims
import cg_nopredict
import cg_errorDecay
import cg_railTrailTime
import cg_debugEvents
import cg_debugPosition
import cg_debugAnim
import cg_animSpeed
import cg_draw2D
import cg_drawStatus
import cg_crosshairHealth
import cg_crosshairSize
import cg_crosshairY
import cg_crosshairX
import cg_teamOverlayUserinfo
import cg_drawTeamOverlay
import cg_drawRewards
import cg_drawCrosshairNames
import cg_drawCrosshair
import cg_drawAmmoWarning
import cg_drawIcons
import cg_draw3dIcons
import cg_drawSnapshot
import cg_drawFPS
import cg_drawTimer
import cg_gibs
import cg_shadows
import cg_swingSpeed
import cg_bobroll
import cg_bobpitch
import cg_bobup
import cg_runroll
import cg_runpitch
import cg_centertime
export cg_markPolys
align 4
LABELV cg_markPolys
skip 73728
import cg_items
import cg_weapons
import cg_entities
import cg
import cgs
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
LABELV $99
byte 1 67
byte 1 71
byte 1 95
byte 1 73
byte 1 109
byte 1 112
byte 1 97
byte 1 99
byte 1 116
byte 1 77
byte 1 97
byte 1 114
byte 1 107
byte 1 32
byte 1 99
byte 1 97
byte 1 108
byte 1 108
byte 1 101
byte 1 100
byte 1 32
byte 1 119
byte 1 105
byte 1 116
byte 1 104
byte 1 32
byte 1 60
byte 1 61
byte 1 32
byte 1 48
byte 1 32
byte 1 114
byte 1 97
byte 1 100
byte 1 105
byte 1 117
byte 1 115
byte 1 0
align 1
LABELV $82
byte 1 67
byte 1 71
byte 1 95
byte 1 70
byte 1 114
byte 1 101
byte 1 101
byte 1 76
byte 1 111
byte 1 99
byte 1 97
byte 1 108
byte 1 69
byte 1 110
byte 1 116
byte 1 105
byte 1 116
byte 1 121
byte 1 58
byte 1 32
byte 1 110
byte 1 111
byte 1 116
byte 1 32
byte 1 97
byte 1 99
byte 1 116
byte 1 105
byte 1 118
byte 1 101
byte 1 0
