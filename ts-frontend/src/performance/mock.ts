
const TEST_STRING_1 = 'johannesvonplato';
// eng-us-3k
const TEST_SUBANAGRAMS_1 = [
  {
    "set": "aalnnoopst",
    "words": [
      "pantaloons"
    ],
    "index": 0
  },
  {
    "set": "ehjnnoost",
    "words": [
      "johnstone"
    ],
    "index": 1
  },
  {
    "set": "aelnnoops",
    "words": [
      "napoleons"
    ],
    "index": 2
  },
  {
    "set": "aalnnoopt",
    "words": [
      "pantaloon"
    ],
    "index": 3
  },
  {
    "set": "aehnnopst",
    "words": [
      "pantheons"
    ],
    "index": 4
  },
  {
    "set": "aehlnops",
    "words": [
      "alphonse"
    ],
    "index": 5
  },
  {
    "set": "aaennnst",
    "words": [
      "antennas"
    ],
    "index": 6
  },
  {
    "set": "aennostv",
    "words": [
      "evanston"
    ],
    "index": 7
  },
  {
    "set": "aehjnnos",
    "words": [
      "johannes",
      "johansen"
    ],
    "index": 8
  },
  {
    "set": "hjnnoost",
    "words": [
      "johnston"
    ],
    "index": 9
  },
  {
    "set": "aahjnnot",
    "words": [
      "jonathan"
    ],
    "index": 10
  },
  {
    "set": "aelnnoop",
    "words": [
      "napoleon"
    ],
    "index": 11
  },
  {
    "set": "aaelnnot",
    "words": [
      "neonatal"
    ],
    "index": 12
  },
  {
    "set": "aehnnopt",
    "words": [
      "pantheon"
    ],
    "index": 13
  },
  {
    "set": "aennnpst",
    "words": [
      "pennants"
    ],
    "index": 14
  },
  {
    "set": "aehnopst",
    "words": [
      "phaetons"
    ],
    "index": 15
  },
  {
    "set": "aaehnpst",
    "words": [
      "pheasant"
    ],
    "index": 16
  },
  {
    "set": "alnoopst",
    "words": [
      "platoons"
    ],
    "index": 17
  },
  {
    "set": "aaelnpst",
    "words": [
      "pleasant"
    ],
    "index": 18
  },
  {
    "set": "nnooopst",
    "words": [
      "pontoons"
    ],
    "index": 19
  },
  {
    "set": "ehloopst",
    "words": [
      "potholes"
    ],
    "index": 20
  },
  {
    "set": "aaelnstv",
    "words": [
      "svetlana"
    ],
    "index": 21
  },
  {
    "set": "aenoopst",
    "words": [
      "teaspoon"
    ],
    "index": 22
  },
  {
    "set": "aaelnnn",
    "words": [
      "annalen"
    ],
    "index": 23
  },
  {
    "set": "aaelnns",
    "words": [
      "anneals"
    ],
    "index": 24
  },
  {
    "set": "aaennnt",
    "words": [
      "antenna"
    ],
    "index": 25
  },
  {
    "set": "aelopst",
    "words": [
      "apostle"
    ],
    "index": 26
  },
  {
    "set": "aahlpst",
    "words": [
      "asphalt"
    ],
    "index": 27
  },
  {
    "set": "aehlnot",
    "words": [
      "ethanol"
    ],
    "index": 28
  },
  {
    "set": "ahloops",
    "words": [
      "hooplas"
    ],
    "index": 29
  },
  {
    "set": "aahnnos",
    "words": [
      "hosanna"
    ],
    "index": 30
  },
  {
    "set": "aahjnno",
    "words": [
      "johanna"
    ],
    "index": 31
  },
  {
    "set": "hjnnoos",
    "words": [
      "johnson"
    ],
    "index": 32
  },
  {
    "set": "elnopst",
    "words": [
      "leptons"
    ],
    "index": 33
  },
  {
    "set": "ehloost",
    "words": [
      "lesotho"
    ],
    "index": 34
  },
  {
    "set": "aehlost",
    "words": [
      "loathes"
    ],
    "index": 35
  },
  {
    "set": "aajnosv",
    "words": [
      "navajos"
    ],
    "index": 36
  },
  {
    "set": "aennosv",
    "words": [
      "novenas"
    ],
    "index": 37
  },
  {
    "set": "aaelpst",
    "words": [
      "palates"
    ],
    "index": 38
  },
  {
    "set": "aaenpst",
    "words": [
      "peasant"
    ],
    "index": 39
  },
  {
    "set": "aennnpt",
    "words": [
      "pennant"
    ],
    "index": 40
  },
  {
    "set": "ennnops",
    "words": [
      "pennons"
    ],
    "index": 41
  },
  {
    "set": "aehnopt",
    "words": [
      "phaeton"
    ],
    "index": 42
  },
  {
    "set": "ehlnops",
    "words": [
      "phenols"
    ],
    "index": 43
  },
  {
    "set": "hnoopst",
    "words": [
      "photons"
    ],
    "index": 44
  },
  {
    "set": "aelnpst",
    "words": [
      "planets",
      "platens"
    ],
    "index": 45
  },
  {
    "set": "alnoopt",
    "words": [
      "platoon"
    ],
    "index": 46
  },
  {
    "set": "nnooopt",
    "words": [
      "pontoon"
    ],
    "index": 47
  },
  {
    "set": "ehloopt",
    "words": [
      "pothole"
    ],
    "index": 48
  },
  {
    "set": "aaelnst",
    "words": [
      "sealant"
    ],
    "index": 49
  },
  {
    "set": "ahnnnos",
    "words": [
      "shannon"
    ],
    "index": 50
  },
  {
    "set": "ehlnost",
    "words": [
      "shelton"
    ],
    "index": 51
  },
  {
    "set": "elnostv",
    "words": [
      "solvent"
    ],
    "index": 52
  },
  {
    "set": "aehnpst",
    "words": [
      "stephan"
    ],
    "index": 53
  },
  {
    "set": "aehopst",
    "words": [
      "teashop"
    ],
    "index": 54
  },
  {
    "set": "aahlos",
    "words": [
      "alohas"
    ],
    "index": 55
  },
  {
    "set": "aahlps",
    "words": [
      "alphas"
    ],
    "index": 56
  },
  {
    "set": "aaehlt",
    "words": [
      "althea"
    ],
    "index": 57
  },
  {
    "set": "aalnns",
    "words": [
      "annals"
    ],
    "index": 58
  },
  {
    "set": "aaelnn",
    "words": [
      "anneal"
    ],
    "index": 59
  },
  {
    "set": "aaenop",
    "words": [
      "apnoea"
    ],
    "index": 60
  },
  {
    "set": "ahnost",
    "words": [
      "ashton"
    ],
    "index": 61
  },
  {
    "set": "aalnst",
    "words": [
      "aslant"
    ],
    "index": 62
  },
  {
    "set": "aaehnt",
    "words": [
      "athena"
    ],
    "index": 63
  },
  {
    "set": "aehnst",
    "words": [
      "athens",
      "hasten",
      "thanes"
    ],
    "index": 64
  },
  {
    "set": "aalnot",
    "words": [
      "atonal"
    ],
    "index": 65
  },
  {
    "set": "aenost",
    "words": [
      "atones"
    ],
    "index": 66
  },
  {
    "set": "aalnov",
    "words": [
      "avalon"
    ],
    "index": 67
  },
  {
    "set": "aelnot",
    "words": [
      "etalon"
    ],
    "index": 68
  },
  {
    "set": "aehlst",
    "words": [
      "halest",
      "lathes"
    ],
    "index": 69
  },
  {
    "set": "aehlos",
    "words": [
      "haloes"
    ],
    "index": 70
  },
  {
    "set": "ahlnot",
    "words": [
      "halton"
    ],
    "index": 71
  },
  {
    "set": "aehlsv",
    "words": [
      "halves"
    ],
    "index": 72
  },
  {
    "set": "aehlns",
    "words": [
      "hansel"
    ],
    "index": 73
  },
  {
    "set": "aehnns",
    "words": [
      "hansen",
      "hennas"
    ],
    "index": 74
  },
  {
    "set": "ahnnos",
    "words": [
      "hanson"
    ],
    "index": 75
  },
  {
    "set": "aahntv",
    "words": [
      "havant"
    ],
    "index": 76
  },
  {
    "set": "aehnsv",
    "words": [
      "havens",
      "shaven"
    ],
    "index": 77
  },
  {
    "set": "ehlost",
    "words": [
      "helots",
      "hostel",
      "hotels"
    ],
    "index": 78
  },
  {
    "set": "ehnost",
    "words": [
      "honest"
    ],
    "index": 79
  },
  {
    "set": "ahloop",
    "words": [
      "hoopla"
    ],
    "index": 80
  },
  {
    "set": "ehoosv",
    "words": [
      "hooves"
    ],
    "index": 81
  },
  {
    "set": "ehlosv",
    "words": [
      "hovels",
      "shovel"
    ],
    "index": 82
  },
  {
    "set": "aejnns",
    "words": [
      "jansen"
    ],
    "index": 83
  },
  {
    "set": "ejnnos",
    "words": [
      "jenson"
    ],
    "index": 84
  },
  {
    "set": "aajnno",
    "words": [
      "joanna"
    ],
    "index": 85
  },
  {
    "set": "aejnno",
    "words": [
      "joanne"
    ],
    "index": 86
  },
  {
    "set": "ahjnno",
    "words": [
      "johann"
    ],
    "index": 87
  },
  {
    "set": "ehjops",
    "words": [
      "joseph"
    ],
    "index": 88
  },
  {
    "set": "ejlost",
    "words": [
      "jostle"
    ],
    "index": 89
  },
  {
    "set": "elnnno",
    "words": [
      "lennon"
    ],
    "index": 90
  },
  {
    "set": "elnost",
    "words": [
      "lentos",
      "stolen"
    ],
    "index": 91
  },
  {
    "set": "elnopt",
    "words": [
      "lepton"
    ],
    "index": 92
  },
  {
    "set": "aelntv",
    "words": [
      "levant"
    ],
    "index": 93
  },
  {
    "set": "aehlot",
    "words": [
      "loathe"
    ],
    "index": 94
  },
  {
    "set": "aelosv",
    "words": [
      "loaves"
    ],
    "index": 95
  },
  {
    "set": "elnoos",
    "words": [
      "loosen"
    ],
    "index": 96
  },
  {
    "set": "aennst",
    "words": [
      "nantes"
    ],
    "index": 97
  },
  {
    "set": "aelnps",
    "words": [
      "naples",
      "panels",
      "planes"
    ],
    "index": 98
  },
  {
    "set": "aahnnt",
    "words": [
      "nathan"
    ],
    "index": 99
  },
  {
    "set": "aahnov",
    "words": [
      "navaho"
    ],
    "index": 100
  },
  {
    "set": "aajnov",
    "words": [
      "navajo"
    ],
    "index": 101
  },
  {
    "set": "aelnsv",
    "words": [
      "navels"
    ],
    "index": 102
  },
  {
    "set": "elnnos",
    "words": [
      "nelson"
    ],
    "index": 103
  },
  {
    "set": "elnosv",
    "words": [
      "novels",
      "sloven"
    ],
    "index": 104
  },
  {
    "set": "aennov",
    "words": [
      "novena"
    ],
    "index": 105
  },
  {
    "set": "aeostv",
    "words": [
      "ovates"
    ],
    "index": 106
  },
  {
    "set": "aaenps",
    "words": [
      "paeans"
    ],
    "index": 107
  },
  {
    "set": "aaelpt",
    "words": [
      "palate"
    ],
    "index": 108
  },
  {
    "set": "aelpst",
    "words": [
      "palest",
      "pastel",
      "petals",
      "plates",
      "pleats",
      "staple"
    ],
    "index": 109
  },
  {
    "set": "ahopst",
    "words": [
      "pathos",
      "potash"
    ],
    "index": 110
  },
  {
    "set": "ennnop",
    "words": [
      "pennon"
    ],
    "index": 111
  },
  {
    "set": "ehlnop",
    "words": [
      "phenol"
    ],
    "index": 112
  },
  {
    "set": "ehnops",
    "words": [
      "phones"
    ],
    "index": 113
  },
  {
    "set": "hnnoop",
    "words": [
      "phonon"
    ],
    "index": 114
  },
  {
    "set": "hnoopt",
    "words": [
      "photon"
    ],
    "index": 115
  },
  {
    "set": "hoopst",
    "words": [
      "photos"
    ],
    "index": 116
  },
  {
    "set": "aelnpt",
    "words": [
      "planet",
      "platen"
    ],
    "index": 117
  },
  {
    "set": "alnpst",
    "words": [
      "plants"
    ],
    "index": 118
  },
  {
    "set": "alopst",
    "words": [
      "postal"
    ],
    "index": 119
  },
  {
    "set": "alnoos",
    "words": [
      "saloon"
    ],
    "index": 120
  },
  {
    "set": "aanstv",
    "words": [
      "savant"
    ],
    "index": 121
  },
  {
    "set": "aelnos",
    "words": [
      "sloane"
    ],
    "index": 122
  },
  {
    "set": "aanost",
    "words": [
      "sonata"
    ],
    "index": 123
  },
  {
    "set": "ennost",
    "words": [
      "sonnet",
      "tenons",
      "tonnes"
    ],
    "index": 124
  },
  {
    "set": "ehoost",
    "words": [
      "soothe"
    ],
    "index": 125
  },
  {
    "set": "aehpst",
    "words": [
      "spathe"
    ],
    "index": 126
  },
  {
    "set": "lnoost",
    "words": [
      "stolon"
    ],
    "index": 127
  },
  {
    "set": "alnost",
    "words": [
      "talons"
    ],
    "index": 128
  },
  {
    "set": "aelstv",
    "words": [
      "valets",
      "vestal"
    ],
    "index": 129
  },
  {
    "set": "aenos",
    "words": [
      "aeons"
    ],
    "index": 130
  },
  {
    "set": "aeops",
    "words": [
      "aesop"
    ],
    "index": 131
  },
  {
    "set": "aehlp",
    "words": [
      "aleph"
    ],
    "index": 132
  },
  {
    "set": "aelos",
    "words": [
      "aloes"
    ],
    "index": 133
  },
  {
    "set": "aahlo",
    "words": [
      "aloha"
    ],
    "index": 134
  },
  {
    "set": "aelno",
    "words": [
      "alone",
      "leona"
    ],
    "index": 135
  },
  {
    "set": "aahlp",
    "words": [
      "alpha"
    ],
    "index": 136
  },
  {
    "set": "alnot",
    "words": [
      "alton",
      "talon",
      "tonal"
    ],
    "index": 137
  },
  {
    "set": "alost",
    "words": [
      "altos"
    ],
    "index": 138
  },
  {
    "set": "aalnn",
    "words": [
      "annal"
    ],
    "index": 139
  },
  {
    "set": "annos",
    "words": [
      "anson"
    ],
    "index": 140
  },
  {
    "set": "annot",
    "words": [
      "anton"
    ],
    "index": 141
  },
  {
    "set": "aaost",
    "words": [
      "aosta"
    ],
    "index": 142
  },
  {
    "set": "aehns",
    "words": [
      "ashen",
      "shane"
    ],
    "index": 143
  },
  {
    "set": "aenps",
    "words": [
      "aspen",
      "napes",
      "panes",
      "snape"
    ],
    "index": 144
  },
  {
    "set": "anost",
    "words": [
      "aston",
      "natos",
      "santo"
    ],
    "index": 145
  },
  {
    "set": "aalst",
    "words": [
      "atlas"
    ],
    "index": 146
  },
  {
    "set": "aenot",
    "words": [
      "atone",
      "eaton",
      "oaten"
    ],
    "index": 147
  },
  {
    "set": "aantv",
    "words": [
      "avant"
    ],
    "index": 148
  },
  {
    "set": "aastv",
    "words": [
      "avast"
    ],
    "index": 149
  },
  {
    "set": "aelns",
    "words": [
      "elans",
      "lanes",
      "leans"
    ],
    "index": 150
  },
  {
    "set": "elnot",
    "words": [
      "elton",
      "lento"
    ],
    "index": 151
  },
  {
    "set": "eoops",
    "words": [
      "espoo"
    ],
    "index": 152
  },
  {
    "set": "aehnt",
    "words": [
      "ethan",
      "neath",
      "thane"
    ],
    "index": 153
  },
  {
    "set": "ehost",
    "words": [
      "ethos",
      "those"
    ],
    "index": 154
  },
  {
    "set": "aensv",
    "words": [
      "evans",
      "naves",
      "vanes"
    ],
    "index": 155
  },
  {
    "set": "aehls",
    "words": [
      "hales",
      "heals",
      "leash",
      "shale"
    ],
    "index": 156
  },
  {
    "set": "ahlno",
    "words": [
      "halon"
    ],
    "index": 157
  },
  {
    "set": "ahlos",
    "words": [
      "halos",
      "shoal"
    ],
    "index": 158
  },
  {
    "set": "ahlst",
    "words": [
      "halts",
      "laths",
      "stahl"
    ],
    "index": 159
  },
  {
    "set": "aehlv",
    "words": [
      "halve"
    ],
    "index": 160
  },
  {
    "set": "aahnn",
    "words": [
      "hanna"
    ],
    "index": 161
  },
  {
    "set": "aehst",
    "words": [
      "haste",
      "hates",
      "heats"
    ],
    "index": 162
  },
  {
    "set": "aehnv",
    "words": [
      "haven"
    ],
    "index": 163
  },
  {
    "set": "aehsv",
    "words": [
      "haves",
      "shave"
    ],
    "index": 164
  },
  {
    "set": "aehps",
    "words": [
      "heaps",
      "phase",
      "shape"
    ],
    "index": 165
  },
  {
    "set": "ehlot",
    "words": [
      "helot",
      "hotel",
      "thole"
    ],
    "index": 166
  },
  {
    "set": "ehlps",
    "words": [
      "helps"
    ],
    "index": 167
  },
  {
    "set": "aehnn",
    "words": [
      "henna"
    ],
    "index": 168
  },
  {
    "set": "ehlos",
    "words": [
      "holes"
    ],
    "index": 169
  },
  {
    "set": "hlost",
    "words": [
      "holst",
      "sloth"
    ],
    "index": 170
  },
  {
    "set": "ehnos",
    "words": [
      "hones",
      "shone"
    ],
    "index": 171
  },
  {
    "set": "hoops",
    "words": [
      "hoops",
      "poohs"
    ],
    "index": 172
  },
  {
    "set": "hoost",
    "words": [
      "hoots",
      "shoot",
      "sooth"
    ],
    "index": 173
  },
  {
    "set": "ehops",
    "words": [
      "hopes"
    ],
    "index": 174
  },
  {
    "set": "aehos",
    "words": [
      "hosea"
    ],
    "index": 175
  },
  {
    "set": "ehlov",
    "words": [
      "hovel"
    ],
    "index": 176
  },
  {
    "set": "aejnt",
    "words": [
      "janet"
    ],
    "index": 177
  },
  {
    "set": "ajnos",
    "words": [
      "janos",
      "jason",
      "jonas",
      "sonja"
    ],
    "index": 178
  },
  {
    "set": "aajnp",
    "words": [
      "japan"
    ],
    "index": 179
  },
  {
    "set": "aejps",
    "words": [
      "japes"
    ],
    "index": 180
  },
  {
    "set": "ajost",
    "words": [
      "jatos"
    ],
    "index": 181
  },
  {
    "set": "aejns",
    "words": [
      "jeans"
    ],
    "index": 182
  },
  {
    "set": "hjnos",
    "words": [
      "johns"
    ],
    "index": 183
  },
  {
    "set": "jlost",
    "words": [
      "jolts"
    ],
    "index": 184
  },
  {
    "set": "ahjno",
    "words": [
      "jonah"
    ],
    "index": 185
  },
  {
    "set": "ejnos",
    "words": [
      "jones"
    ],
    "index": 186
  },
  {
    "set": "aelps",
    "words": [
      "lapse",
      "leaps",
      "pales",
      "peals",
      "pleas",
      "sepal"
    ],
    "index": 187
  },
  {
    "set": "aehlt",
    "words": [
      "lathe"
    ],
    "index": 188
  },
  {
    "set": "aalsv",
    "words": [
      "lavas"
    ],
    "index": 189
  },
  {
    "set": "aelsv",
    "words": [
      "laves",
      "salve",
      "slave",
      "vales"
    ],
    "index": 190
  },
  {
    "set": "aelnt",
    "words": [
      "leant"
    ],
    "index": 191
  },
  {
    "set": "aelpt",
    "words": [
      "leapt",
      "lepta",
      "patel",
      "petal",
      "plate",
      "pleat"
    ],
    "index": 192
  },
  {
    "set": "aelst",
    "words": [
      "least",
      "slate",
      "stale",
      "steal",
      "tales",
      "teals",
      "tesla"
    ],
    "index": 193
  },
  {
    "set": "aahls",
    "words": [
      "lhasa"
    ],
    "index": 194
  },
  {
    "set": "alnos",
    "words": [
      "loans",
      "salon",
      "sloan"
    ],
    "index": 195
  },
  {
    "set": "ahlot",
    "words": [
      "loath"
    ],
    "index": 196
  },
  {
    "set": "lnoos",
    "words": [
      "loons",
      "olson"
    ],
    "index": 197
  },
  {
    "set": "loops",
    "words": [
      "loops",
      "polos",
      "pools",
      "sloop",
      "spool"
    ],
    "index": 198
  },
  {
    "set": "eloos",
    "words": [
      "loose"
    ],
    "index": 199
  },
  {
    "set": "loost",
    "words": [
      "loots",
      "stool",
      "tools"
    ],
    "index": 200
  },
  {
    "set": "elops",
    "words": [
      "lopes",
      "poles",
      "slope"
    ],
    "index": 201
  },
  {
    "set": "elosv",
    "words": [
      "loves",
      "solve",
      "voles"
    ],
    "index": 202
  },
  {
    "set": "aalns",
    "words": [
      "nasal"
    ],
    "index": 203
  },
  {
    "set": "aalnt",
    "words": [
      "natal"
    ],
    "index": 204
  },
  {
    "set": "aalnv",
    "words": [
      "naval"
    ],
    "index": 205
  },
  {
    "set": "aelnv",
    "words": [
      "navel",
      "venal"
    ],
    "index": 206
  },
  {
    "set": "ennos",
    "words": [
      "neons",
      "nones"
    ],
    "index": 207
  },
  {
    "set": "aelnp",
    "words": [
      "nepal",
      "panel",
      "penal",
      "plane"
    ],
    "index": 208
  },
  {
    "set": "elnos",
    "words": [
      "noels",
      "olsen"
    ],
    "index": 209
  },
  {
    "set": "alnno",
    "words": [
      "nolan"
    ],
    "index": 210
  },
  {
    "set": "nnoos",
    "words": [
      "noons"
    ],
    "index": 211
  },
  {
    "set": "enoos",
    "words": [
      "noose"
    ],
    "index": 212
  },
  {
    "set": "enost",
    "words": [
      "notes",
      "onset",
      "seton",
      "stone",
      "tones"
    ],
    "index": 213
  },
  {
    "set": "aenov",
    "words": [
      "novae"
    ],
    "index": 214
  },
  {
    "set": "anosv",
    "words": [
      "novas"
    ],
    "index": 215
  },
  {
    "set": "elnov",
    "words": [
      "novel"
    ],
    "index": 216
  },
  {
    "set": "aeost",
    "words": [
      "oates",
      "seato"
    ],
    "index": 217
  },
  {
    "set": "ahost",
    "words": [
      "oaths"
    ],
    "index": 218
  },
  {
    "set": "alops",
    "words": [
      "opals"
    ],
    "index": 219
  },
  {
    "set": "enops",
    "words": [
      "opens",
      "peons",
      "pones"
    ],
    "index": 220
  },
  {
    "set": "alosv",
    "words": [
      "ovals",
      "salvo"
    ],
    "index": 221
  },
  {
    "set": "aeotv",
    "words": [
      "ovate"
    ],
    "index": 222
  },
  {
    "set": "enosv",
    "words": [
      "ovens"
    ],
    "index": 223
  },
  {
    "set": "aaenp",
    "words": [
      "paean"
    ],
    "index": 224
  },
  {
    "set": "anpst",
    "words": [
      "pants"
    ],
    "index": 225
  },
  {
    "set": "aalop",
    "words": [
      "paola"
    ],
    "index": 226
  },
  {
    "set": "aloop",
    "words": [
      "paolo"
    ],
    "index": 227
  },
  {
    "set": "aahps",
    "words": [
      "pasha"
    ],
    "index": 228
  },
  {
    "set": "aapst",
    "words": [
      "pasta"
    ],
    "index": 229
  },
  {
    "set": "aepst",
    "words": [
      "paste",
      "pates",
      "peats",
      "septa",
      "spate",
      "tapes"
    ],
    "index": 230
  },
  {
    "set": "aenpt",
    "words": [
      "paten"
    ],
    "index": 231
  },
  {
    "set": "ahpst",
    "words": [
      "paths"
    ],
    "index": 232
  },
  {
    "set": "aanpt",
    "words": [
      "patna"
    ],
    "index": 233
  },
  {
    "set": "aepsv",
    "words": [
      "paves"
    ],
    "index": 234
  },
  {
    "set": "elpst",
    "words": [
      "pelts",
      "slept",
      "spelt"
    ],
    "index": 235
  },
  {
    "set": "eopst",
    "words": [
      "pesto",
      "poets"
    ],
    "index": 236
  },
  {
    "set": "ehnop",
    "words": [
      "phone"
    ],
    "index": 237
  },
  {
    "set": "hoopt",
    "words": [
      "photo"
    ],
    "index": 238
  },
  {
    "set": "alnps",
    "words": [
      "plans"
    ],
    "index": 239
  },
  {
    "set": "alnpt",
    "words": [
      "plant"
    ],
    "index": 240
  },
  {
    "set": "ahlps",
    "words": [
      "plash"
    ],
    "index": 241
  },
  {
    "set": "alopt",
    "words": [
      "plato"
    ],
    "index": 242
  },
  {
    "set": "lopst",
    "words": [
      "plots"
    ],
    "index": 243
  },
  {
    "set": "eloop",
    "words": [
      "poole"
    ],
    "index": 244
  },
  {
    "set": "aanst",
    "words": [
      "santa",
      "satan"
    ],
    "index": 245
  },
  {
    "set": "aenns",
    "words": [
      "senna"
    ],
    "index": 246
  },
  {
    "set": "ehosv",
    "words": [
      "shove"
    ],
    "index": 247
  },
  {
    "set": "alnst",
    "words": [
      "slant"
    ],
    "index": 248
  },
  {
    "set": "noops",
    "words": [
      "snoop",
      "spoon"
    ],
    "index": 249
  },
  {
    "set": "noost",
    "words": [
      "snoot"
    ],
    "index": 250
  },
  {
    "set": "enpst",
    "words": [
      "spent"
    ],
    "index": 251
  },
  {
    "set": "alpst",
    "words": [
      "splat"
    ],
    "index": 252
  },
  {
    "set": "aestv",
    "words": [
      "stave",
      "vesta"
    ],
    "index": 253
  },
  {
    "set": "elost",
    "words": [
      "stole",
      "tesol"
    ],
    "index": 254
  },
  {
    "set": "oopst",
    "words": [
      "stoop"
    ],
    "index": 255
  },
  {
    "set": "eostv",
    "words": [
      "stove",
      "votes"
    ],
    "index": 256
  },
  {
    "set": "aehot",
    "words": [
      "tahoe"
    ],
    "index": 257
  },
  {
    "set": "ennot",
    "words": [
      "tenon",
      "tonne"
    ],
    "index": 258
  },
  {
    "set": "aeltv",
    "words": [
      "valet"
    ],
    "index": 259
  },
  {
    "set": "enstv",
    "words": [
      "vents"
    ],
    "index": 260
  },
  {
    "set": "alotv",
    "words": [
      "volta"
    ],
    "index": 261
  },
  {
    "set": "elotv",
    "words": [
      "volte"
    ],
    "index": 262
  },
  {
    "set": "lostv",
    "words": [
      "volts"
    ],
    "index": 263
  },
  {
    "set": "aeno",
    "words": [
      "aeon"
    ],
    "index": 264
  },
  {
    "set": "aahs",
    "words": [
      "ahas"
    ],
    "index": 265
  },
  {
    "set": "aaln",
    "words": [
      "alan",
      "anal",
      "lana"
    ],
    "index": 266
  },
  {
    "set": "aals",
    "words": [
      "alas"
    ],
    "index": 267
  },
  {
    "set": "aels",
    "words": [
      "ales",
      "lase",
      "leas",
      "sale",
      "seal"
    ],
    "index": 268
  },
  {
    "set": "aelo",
    "words": [
      "aloe"
    ],
    "index": 269
  },
  {
    "set": "alps",
    "words": [
      "alps",
      "laps",
      "pals",
      "slap"
    ],
    "index": 270
  },
  {
    "set": "alos",
    "words": [
      "also",
      "laos",
      "salo"
    ],
    "index": 271
  },
  {
    "set": "alot",
    "words": [
      "alto"
    ],
    "index": 272
  },
  {
    "set": "aalv",
    "words": [
      "alva",
      "lava"
    ],
    "index": 273
  },
  {
    "set": "aann",
    "words": [
      "anna",
      "nana"
    ],
    "index": 274
  },
  {
    "set": "aenn",
    "words": [
      "anne"
    ],
    "index": 275
  },
  {
    "set": "anno",
    "words": [
      "anon",
      "nano",
      "nona"
    ],
    "index": 276
  },
  {
    "set": "aent",
    "words": [
      "ante",
      "etna",
      "neat"
    ],
    "index": 277
  },
  {
    "set": "anst",
    "words": [
      "ants",
      "stan",
      "tans"
    ],
    "index": 278
  },
  {
    "set": "aeps",
    "words": [
      "apes",
      "apse",
      "peas"
    ],
    "index": 279
  },
  {
    "set": "aaps",
    "words": [
      "asap"
    ],
    "index": 280
  },
  {
    "set": "aest",
    "words": [
      "ates",
      "east",
      "eats",
      "sate",
      "seat",
      "teas"
    ],
    "index": 281
  },
  {
    "set": "aopt",
    "words": [
      "atop"
    ],
    "index": 282
  },
  {
    "set": "aesv",
    "words": [
      "aves",
      "save",
      "vase"
    ],
    "index": 283
  },
  {
    "set": "anov",
    "words": [
      "avon",
      "nova"
    ],
    "index": 284
  },
  {
    "set": "aehl",
    "words": [
      "hale",
      "heal",
      "leah"
    ],
    "index": 285
  },
  {
    "set": "ahlo",
    "words": [
      "halo"
    ],
    "index": 286
  },
  {
    "set": "ahlt",
    "words": [
      "halt",
      "lath"
    ],
    "index": 287
  },
  {
    "set": "ahns",
    "words": [
      "hans",
      "nash"
    ],
    "index": 288
  },
  {
    "set": "ahps",
    "words": [
      "haps",
      "hasp"
    ],
    "index": 289
  },
  {
    "set": "ahst",
    "words": [
      "hast",
      "hats"
    ],
    "index": 290
  },
  {
    "set": "aeht",
    "words": [
      "hate",
      "heat"
    ],
    "index": 291
  },
  {
    "set": "aehv",
    "words": [
      "have"
    ],
    "index": 292
  },
  {
    "set": "aehp",
    "words": [
      "heap"
    ],
    "index": 293
  },
  {
    "set": "ehlp",
    "words": [
      "help"
    ],
    "index": 294
  },
  {
    "set": "ehns",
    "words": [
      "hens"
    ],
    "index": 295
  },
  {
    "set": "ehos",
    "words": [
      "hoes",
      "hose",
      "shoe"
    ],
    "index": 296
  },
  {
    "set": "ehlo",
    "words": [
      "hole"
    ],
    "index": 297
  },
  {
    "set": "hlot",
    "words": [
      "holt"
    ],
    "index": 298
  },
  {
    "set": "ehno",
    "words": [
      "hone"
    ],
    "index": 299
  },
  {
    "set": "hoop",
    "words": [
      "hoop",
      "pooh"
    ],
    "index": 300
  },
  {
    "set": "hoot",
    "words": [
      "hoot",
      "otoh"
    ],
    "index": 301
  },
  {
    "set": "ehop",
    "words": [
      "hope"
    ],
    "index": 302
  },
  {
    "set": "hops",
    "words": [
      "hops",
      "hosp",
      "posh",
      "shop"
    ],
    "index": 303
  },
  {
    "set": "host",
    "words": [
      "host",
      "hots",
      "shot"
    ],
    "index": 304
  },
  {
    "set": "ehov",
    "words": [
      "hove"
    ],
    "index": 305
  },
  {
    "set": "aajn",
    "words": [
      "jana"
    ],
    "index": 306
  },
  {
    "set": "aejn",
    "words": [
      "jane",
      "jean"
    ],
    "index": 307
  },
  {
    "set": "aejp",
    "words": [
      "jape"
    ],
    "index": 308
  },
  {
    "set": "ajot",
    "words": [
      "jato"
    ],
    "index": 309
  },
  {
    "set": "aajv",
    "words": [
      "java"
    ],
    "index": 310
  },
  {
    "set": "ejst",
    "words": [
      "jest",
      "jets"
    ],
    "index": 311
  },
  {
    "set": "ajno",
    "words": [
      "joan"
    ],
    "index": 312
  },
  {
    "set": "ejlo",
    "words": [
      "joel"
    ],
    "index": 313
  },
  {
    "set": "hjno",
    "words": [
      "john"
    ],
    "index": 314
  },
  {
    "set": "jlot",
    "words": [
      "jolt"
    ],
    "index": 315
  },
  {
    "set": "ejos",
    "words": [
      "jose"
    ],
    "index": 316
  },
  {
    "set": "jost",
    "words": [
      "jots"
    ],
    "index": 317
  },
  {
    "set": "ejov",
    "words": [
      "jove"
    ],
    "index": 318
  },
  {
    "set": "aeln",
    "words": [
      "lane",
      "lean",
      "lena",
      "neal"
    ],
    "index": 319
  },
  {
    "set": "ahls",
    "words": [
      "lash"
    ],
    "index": 320
  },
  {
    "set": "alst",
    "words": [
      "last",
      "salt",
      "slat"
    ],
    "index": 321
  },
  {
    "set": "aelt",
    "words": [
      "late",
      "tale",
      "teal"
    ],
    "index": 322
  },
  {
    "set": "aelv",
    "words": [
      "lave",
      "vale",
      "veal"
    ],
    "index": 323
  },
  {
    "set": "aelp",
    "words": [
      "leap",
      "pale",
      "peal",
      "plea"
    ],
    "index": 324
  },
  {
    "set": "elno",
    "words": [
      "leno",
      "leon",
      "lone",
      "noel",
      "olen"
    ],
    "index": 325
  },
  {
    "set": "elns",
    "words": [
      "lens"
    ],
    "index": 326
  },
  {
    "set": "elnt",
    "words": [
      "lent"
    ],
    "index": 327
  },
  {
    "set": "elst",
    "words": [
      "lest",
      "lets",
      "tesl"
    ],
    "index": 328
  },
  {
    "set": "alno",
    "words": [
      "loan",
      "nola"
    ],
    "index": 329
  },
  {
    "set": "lnoo",
    "words": [
      "loon"
    ],
    "index": 330
  },
  {
    "set": "loop",
    "words": [
      "loop",
      "polo",
      "pool"
    ],
    "index": 331
  },
  {
    "set": "loot",
    "words": [
      "loot",
      "tool"
    ],
    "index": 332
  },
  {
    "set": "elop",
    "words": [
      "lope",
      "pole"
    ],
    "index": 333
  },
  {
    "set": "lops",
    "words": [
      "lops",
      "slop"
    ],
    "index": 334
  },
  {
    "set": "elos",
    "words": [
      "lose",
      "oles",
      "sloe",
      "sole"
    ],
    "index": 335
  },
  {
    "set": "lost",
    "words": [
      "lost",
      "lots",
      "slot",
      "stol"
    ],
    "index": 336
  },
  {
    "set": "elov",
    "words": [
      "love",
      "vole"
    ],
    "index": 337
  },
  {
    "set": "aenp",
    "words": [
      "nape",
      "neap",
      "pane"
    ],
    "index": 338
  },
  {
    "set": "anps",
    "words": [
      "naps",
      "pans",
      "snap",
      "span"
    ],
    "index": 339
  },
  {
    "set": "aans",
    "words": [
      "nasa"
    ],
    "index": 340
  },
  {
    "set": "aant",
    "words": [
      "nata"
    ],
    "index": 341
  },
  {
    "set": "alnt",
    "words": [
      "natl"
    ],
    "index": 342
  },
  {
    "set": "anot",
    "words": [
      "nato"
    ],
    "index": 343
  },
  {
    "set": "aenv",
    "words": [
      "nave",
      "neva",
      "vane"
    ],
    "index": 344
  },
  {
    "set": "enno",
    "words": [
      "neon",
      "none"
    ],
    "index": 345
  },
  {
    "set": "enst",
    "words": [
      "nest",
      "nets",
      "sent",
      "tens"
    ],
    "index": 346
  },
  {
    "set": "aano",
    "words": [
      "noaa"
    ],
    "index": 347
  },
  {
    "set": "ahno",
    "words": [
      "noah"
    ],
    "index": 348
  },
  {
    "set": "enos",
    "words": [
      "noes",
      "nose",
      "ones"
    ],
    "index": 349
  },
  {
    "set": "nnoo",
    "words": [
      "noon"
    ],
    "index": 350
  },
  {
    "set": "enop",
    "words": [
      "nope",
      "open",
      "peon",
      "pone"
    ],
    "index": 351
  },
  {
    "set": "hnos",
    "words": [
      "nosh"
    ],
    "index": 352
  },
  {
    "set": "enot",
    "words": [
      "note",
      "tone"
    ],
    "index": 353
  },
  {
    "set": "nost",
    "words": [
      "nots",
      "snot",
      "tons"
    ],
    "index": 354
  },
  {
    "set": "noov",
    "words": [
      "novo"
    ],
    "index": 355
  },
  {
    "set": "ahot",
    "words": [
      "oath"
    ],
    "index": 356
  },
  {
    "set": "aost",
    "words": [
      "oats",
      "sato"
    ],
    "index": 357
  },
  {
    "set": "hoos",
    "words": [
      "ohos",
      "oohs",
      "shoo",
      "soho"
    ],
    "index": 358
  },
  {
    "set": "ahos",
    "words": [
      "ohsa",
      "osha"
    ],
    "index": 359
  },
  {
    "set": "noot",
    "words": [
      "onto"
    ],
    "index": 360
  },
  {
    "set": "oops",
    "words": [
      "oops"
    ],
    "index": 361
  },
  {
    "set": "alop",
    "words": [
      "opal",
      "palo"
    ],
    "index": 362
  },
  {
    "set": "opst",
    "words": [
      "opts",
      "post",
      "pots",
      "spot",
      "stop",
      "tops"
    ],
    "index": 363
  },
  {
    "set": "loos",
    "words": [
      "oslo",
      "solo"
    ],
    "index": 364
  },
  {
    "set": "alov",
    "words": [
      "oval"
    ],
    "index": 365
  },
  {
    "set": "enov",
    "words": [
      "oven"
    ],
    "index": 366
  },
  {
    "set": "anpt",
    "words": [
      "pant"
    ],
    "index": 367
  },
  {
    "set": "apst",
    "words": [
      "past",
      "pats",
      "spat",
      "taps"
    ],
    "index": 368
  },
  {
    "set": "aept",
    "words": [
      "pate",
      "peat",
      "tape"
    ],
    "index": 369
  },
  {
    "set": "ahpt",
    "words": [
      "path"
    ],
    "index": 370
  },
  {
    "set": "aepv",
    "words": [
      "pave"
    ],
    "index": 371
  },
  {
    "set": "elpt",
    "words": [
      "pelt"
    ],
    "index": 372
  },
  {
    "set": "ehnp",
    "words": [
      "penh"
    ],
    "index": 373
  },
  {
    "set": "ennp",
    "words": [
      "penn"
    ],
    "index": 374
  },
  {
    "set": "enps",
    "words": [
      "pens"
    ],
    "index": 375
  },
  {
    "set": "enpt",
    "words": [
      "pent"
    ],
    "index": 376
  },
  {
    "set": "eops",
    "words": [
      "peso",
      "pose"
    ],
    "index": 377
  },
  {
    "set": "epst",
    "words": [
      "pest",
      "pets",
      "sept",
      "step"
    ],
    "index": 378
  },
  {
    "set": "alnp",
    "words": [
      "plan"
    ],
    "index": 379
  },
  {
    "set": "alpt",
    "words": [
      "plat"
    ],
    "index": 380
  },
  {
    "set": "lopt",
    "words": [
      "plot"
    ],
    "index": 381
  },
  {
    "set": "eopt",
    "words": [
      "poet"
    ],
    "index": 382
  },
  {
    "set": "nops",
    "words": [
      "pons"
    ],
    "index": 383
  },
  {
    "set": "aens",
    "words": [
      "sane",
      "sean"
    ],
    "index": 384
  },
  {
    "set": "ehst",
    "words": [
      "seth"
    ],
    "index": 385
  },
  {
    "set": "aehs",
    "words": [
      "shea"
    ],
    "index": 386
  },
  {
    "set": "alsv",
    "words": [
      "slav"
    ],
    "index": 387
  },
  {
    "set": "aops",
    "words": [
      "soap"
    ],
    "index": 388
  },
  {
    "set": "noos",
    "words": [
      "soon"
    ],
    "index": 389
  },
  {
    "set": "oost",
    "words": [
      "soot"
    ],
    "index": 390
  },
  {
    "set": "ensv",
    "words": [
      "sven"
    ],
    "index": 391
  },
  {
    "set": "ahnt",
    "words": [
      "than"
    ],
    "index": 392
  },
  {
    "set": "ehnt",
    "words": [
      "then"
    ],
    "index": 393
  },
  {
    "set": "ehot",
    "words": [
      "theo"
    ],
    "index": 394
  },
  {
    "set": "eost",
    "words": [
      "toes"
    ],
    "index": 395
  },
  {
    "set": "ansv",
    "words": [
      "vans"
    ],
    "index": 396
  },
  {
    "set": "astv",
    "words": [
      "vast",
      "vats"
    ],
    "index": 397
  },
  {
    "set": "ennv",
    "words": [
      "venn"
    ],
    "index": 398
  },
  {
    "set": "entv",
    "words": [
      "vent"
    ],
    "index": 399
  },
  {
    "set": "estv",
    "words": [
      "vest",
      "vets"
    ],
    "index": 400
  },
  {
    "set": "eotv",
    "words": [
      "veto",
      "vote"
    ],
    "index": 401
  },
  {
    "set": "lotv",
    "words": [
      "volt",
      "vtol"
    ],
    "index": 402
  },
  {
    "set": "eht",
    "words": [
      "the"
    ],
    "index": 403
  },
  {
    "set": "not",
    "words": [
      "not",
      "ton"
    ],
    "index": 404
  },
  {
    "set": "ehs",
    "words": [
      "she"
    ],
    "index": 405
  },
  {
    "set": "eno",
    "words": [
      "one",
      "neo"
    ],
    "index": 406
  },
  {
    "set": "elt",
    "words": [
      "let",
      "tel"
    ],
    "index": 407
  },
  {
    "set": "ahs",
    "words": [
      "has",
      "ash",
      "sha"
    ],
    "index": 408
  },
  {
    "set": "oot",
    "words": [
      "too"
    ],
    "index": 409
  },
  {
    "set": "lot",
    "words": [
      "lot"
    ],
    "index": 410
  },
  {
    "set": "nos",
    "words": [
      "son"
    ],
    "index": 411
  },
  {
    "set": "aet",
    "words": [
      "eat",
      "tea",
      "ate",
      "eta"
    ],
    "index": 412
  },
  {
    "set": "est",
    "words": [
      "set",
      "est"
    ],
    "index": 413
  },
  {
    "set": "hot",
    "words": [
      "hot"
    ],
    "index": 414
  },
  {
    "set": "opt",
    "words": [
      "top",
      "pot"
    ],
    "index": 415
  },
  {
    "set": "ent",
    "words": [
      "ten",
      "net"
    ],
    "index": 416
  },
  {
    "set": "hoo",
    "words": [
      "ooh"
    ],
    "index": 417
  },
  {
    "set": "ejo",
    "words": [
      "joe"
    ],
    "index": 418
  },
  {
    "set": "aes",
    "words": [
      "sea"
    ],
    "index": 419
  },
  {
    "set": "aah",
    "words": [
      "aah",
      "aha"
    ],
    "index": 420
  },
  {
    "set": "anv",
    "words": [
      "van"
    ],
    "index": 421
  },
  {
    "set": "aht",
    "words": [
      "hat"
    ],
    "index": 422
  },
  {
    "set": "alp",
    "words": [
      "pal",
      "lap"
    ],
    "index": 423
  },
  {
    "set": "ahn",
    "words": [
      "nah"
    ],
    "index": 424
  },
  {
    "set": "elo",
    "words": [
      "leo"
    ],
    "index": 425
  },
  {
    "set": "ast",
    "words": [
      "sat"
    ],
    "index": 426
  },
  {
    "set": "enp",
    "words": [
      "pen"
    ],
    "index": 427
  },
  {
    "set": "los",
    "words": [
      "los"
    ],
    "index": 428
  },
  {
    "set": "ept",
    "words": [
      "pet"
    ],
    "index": 429
  },
  {
    "set": "aev",
    "words": [
      "eva"
    ],
    "index": 430
  },
  {
    "set": "apt",
    "words": [
      "pat",
      "tap"
    ],
    "index": 431
  },
  {
    "set": "hop",
    "words": [
      "hop"
    ],
    "index": 432
  },
  {
    "set": "ejt",
    "words": [
      "jet"
    ],
    "index": 433
  },
  {
    "set": "nov",
    "words": [
      "von"
    ],
    "index": 434
  },
  {
    "set": "anp",
    "words": [
      "pan",
      "nap"
    ],
    "index": 435
  },
  {
    "set": "ejn",
    "words": [
      "jen"
    ],
    "index": 436
  },
  {
    "set": "hno",
    "words": [
      "hon"
    ],
    "index": 437
  },
  {
    "set": "als",
    "words": [
      "las",
      "sal"
    ],
    "index": 438
  },
  {
    "set": "eot",
    "words": [
      "toe"
    ],
    "index": 439
  },
  {
    "set": "jno",
    "words": [
      "jon"
    ],
    "index": 440
  },
  {
    "set": "ajn",
    "words": [
      "jan"
    ],
    "index": 441
  },
  {
    "set": "ant",
    "words": [
      "tan"
    ],
    "index": 442
  },
  {
    "set": "ahl",
    "words": [
      "hal"
    ],
    "index": 443
  },
  {
    "set": "nno",
    "words": [
      "non"
    ],
    "index": 444
  },
  {
    "set": "etv",
    "words": [
      "vet"
    ],
    "index": 445
  },
  {
    "set": "aps",
    "words": [
      "spa"
    ],
    "index": 446
  },
  {
    "set": "aep",
    "words": [
      "ape",
      "pea"
    ],
    "index": 447
  },
  {
    "set": "eos",
    "words": [
      "seo"
    ],
    "index": 448
  },
  {
    "set": "ann",
    "words": [
      "nan"
    ],
    "index": 449
  },
  {
    "set": "ehn",
    "words": [
      "hen"
    ],
    "index": 450
  },
  {
    "set": "aln",
    "words": [
      "lan"
    ],
    "index": 451
  },
  {
    "set": "oop",
    "words": [
      "poo"
    ],
    "index": 452
  },
  {
    "set": "ael",
    "words": [
      "ale",
      "lea"
    ],
    "index": 453
  },
  {
    "set": "loo",
    "words": [
      "loo"
    ],
    "index": 454
  },
  {
    "set": "ans",
    "words": [
      "nsa"
    ],
    "index": 455
  },
  {
    "set": "aop",
    "words": [
      "pao"
    ],
    "index": 456
  },
  {
    "set": "eho",
    "words": [
      "hoe"
    ],
    "index": 457
  },
  {
    "set": "aot",
    "words": [
      "oat"
    ],
    "index": 458
  },
  {
    "set": "as",
    "words": [
      "as"
    ],
    "index": 459
  },
  {
    "set": "at",
    "words": [
      "at"
    ],
    "index": 460
  },
  {
    "set": "eh",
    "words": [
      "he"
    ],
    "index": 461
  },
  {
    "set": "no",
    "words": [
      "no",
      "on"
    ],
    "index": 462
  },
  {
    "set": "ho",
    "words": [
      "oh"
    ],
    "index": 463
  },
  {
    "set": "os",
    "words": [
      "so"
    ],
    "index": 464
  },
  {
    "set": "ot",
    "words": [
      "to"
    ],
    "index": 465
  },
  {
    "set": "tv",
    "words": [
      "tv"
    ],
    "index": 466
  },
  {
    "set": "sv",
    "words": [
      "vs"
    ],
    "index": 467
  },
  {
    "set": "a",
    "words": [
      "a"
    ],
    "index": 468
  },
  {
    "set": "",
    "words": [
      ""
    ],
    "index": 469
  }
];

export default {
  testOne: {
    string: TEST_STRING_1,
    subanagrams: TEST_SUBANAGRAMS_1,
  }
};
