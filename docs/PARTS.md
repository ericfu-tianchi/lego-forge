# Parts

Every part here is a real LEGO part (LDraw id). Size is **x × z studs at rot 0, then height in plates** (3 plates = 1 brick).
"studs" = studs on top (what can be built on it); "no anti-studs" = it cannot sit on studs (it needs a clip or a bar — avoid unless a kit places it).
For slopes and curves, "faces +z" means the sloped face drops towards +z at rot 0; rot 1 turns that to +x, rot 2 to −z, rot 3 to −x.
Plain bricks, plates and tiles are easier through `m.brick(size, …)`, `m.plate(size, …)`, `m.tile(size, …)` and `m.box(…)`.

Sized helpers — bricks: 1x1, 1x2, 1x3, 1x4, 1x6, 1x8, 1x10, 1x12, 2x2, 2x3, 2x4, 2x6, 2x8, 2x10 · plates: 1x1, 1x2, 1x3, 1x4, 1x6, 1x8, 1x10, 1x12, 2x2, 2x3, 2x4, 2x6, 2x8, 2x10, 2x12, 4x4, 4x6, 4x8, 4x10, 4x12, 6x6, 6x8, 6x10, 6x12, 6x16, 8x8, 8x16, 16x16 · tiles: 1x1, 1x2, 1x3, 1x4, 1x6, 1x8, 2x2, 2x3, 2x4

## Bricks

| id | part | size | top | note |
|---|---|---|---|---|
| 2357 | Brick 2 x 2 Corner | 2×2 · 3p | 3 studs |  |
| 2456 | Brick 2 x 6 | 6×2 · 3p | 12 studs |  |
| 2462 | Brick 3 x 3 Facet | 3×3 · 3p | 3 studs |  |
| 2465 | Brick 1 x 16 | 16×1 · 3p | 16 studs |  |
| 2577 | Brick 4 x 4 Corner Round | 4×4 · 3p | 11 studs |  |
| 2877 | Brick 1 x 2 with Grille | 2×1 · 3p | 2 studs | grille brick: radiators, speakers, vents |
| 3001 | Brick 2 x 4 | 4×2 · 3p | 8 studs |  |
| 3002 | Brick 2 x 3 | 3×2 · 3p | 6 studs |  |
| 3003 | Brick 2 x 2 | 2×2 · 3p | 4 studs |  |
| 3004 | Brick 1 x 2 | 2×1 · 3p | 2 studs |  |
| 3005 | Brick 1 x 1 | 1×1 · 3p | 1 studs |  |
| 3006 | Brick 2 x 10 | 10×2 · 3p | 20 studs |  |
| 3007 | Brick 2 x 8 | 8×2 · 3p | 16 studs |  |
| 3008 | Brick 1 x 8 | 8×1 · 3p | 8 studs |  |
| 3009 | Brick 1 x 6 | 6×1 · 3p | 6 studs |  |
| 3010 | Brick 1 x 4 | 4×1 · 3p | 4 studs |  |
| 3065 | Brick 1 x 2 without Centre Stud | 2×1 · 3p | 2 studs |  |
| 3581 | Brick 1 x 1 x 2 with Shutter Holder | 1×1 · 6p | 1 studs · no anti-studs |  |
| 3622 | Brick 1 x 3 | 3×1 · 3p | 3 studs |  |
| 3941 | Brick 2 x 2 Round without Reinforcement | 2×2 · 3p | 4 studs | round 2×2 brick: columns, trunks, barrels |
| 4070 | Brick 1 x 1 with Headlight | 1×1 · 3p | 1 studs | headlight brick |
| 4733 | Brick 1 x 1 with Studs on Four Sides | 1×1 · 3p | 1 studs |  |
| 4735 | Brick 1 x 1 x 0.667 Round with Bar and Clip Vertical | 1×3 · 2.5p | 1 studs · no anti-studs |  |
| 6111 | Brick 1 x 10 | 10×1 · 3p | 10 studs |  |
| 6112 | Brick 1 x 12 | 12×1 · 3p | 12 studs |  |
| 6143 | Brick 2 x 2 Round Reinforced | 2×2 · 3p | 4 studs |  |
| 6212 | Brick 4 x 10 | 10×4 · 3p | 40 studs |  |
| 6213 | Brick 2 x 6 x 3 | 6×2 · 9p | 12 studs |  |
| 14716 | Brick 1 x 1 x 3 | 1×1 · 9p | 1 studs |  |
| 22886 | Brick 1 x 2 x 3 without Understud | 2×1 · 9p | 2 studs |  |
| 30136 | Brick 1 x 2 Log | 2×1 · 3p | 2 studs | log brick: cabins |
| 30145 | Brick 2 x 2 x 3 | 2×2 · 9p | 4 studs |  |
| 30414 | Brick 1 x 4 with Studs on Side | 4×1 · 3p | 4 studs · no anti-studs | studs on one side (decorative) |
| 47905 | Brick 1 x 1 with Studs on Two Opposite Sides | 1×1 · 3p | 1 studs |  |
| 52107 | Brick 1 x 2 with Studs on Sides | 2×1 · 3p | 2 studs |  |
| 85080 | Brick 2 x 2 Corner Round w Stud Notch and Reinforced Underside | 2×2 · 3p | 2 studs |  |
| 87081 | Brick 4 x 4 Round with Pinhole and Snapstud | 4×4 · 3p | 12 studs |  |
| 87087 | Brick 1 x 1 with Stud on 1 Side | 1×1 · 3p | 1 studs · no anti-studs | stud on one side (SNOT) — decorative here: its side stud is not used by the checker |
| 92947 | Brick 2 x 2 Round with Grille | 2×2 · 3p | 4 studs |  |
| 2453b | Brick 1 x 1 x 5 with Solid Stud | 1×1 · 15p | 1 studs |  |
| 3062b | Brick 1 x 1 Round with Hollow Stud | 1×1 · 3p | 1 studs | round 1×1 brick: posts, trunks, lamp posts |
| 3063b | Brick 2 x 2 Corner Round with Stud Notch | 2×2 · 3p | 2 studs |  |
| 3245c | Brick 1 x 2 x 2 without Understud | 2×1 · 6p | 2 studs |  |
| 3755a | Brick 1 x 3 x 5 without Inner Ridges | 3×1 · 15p | 3 studs |  |

## Plates

| id | part | size | top | note |
|---|---|---|---|---|
| 2420 | Plate 2 x 2 Corner | 2×2 · 1p | 3 studs |  |
| 2445 | Plate 2 x 12 | 12×2 · 1p | 24 studs |  |
| 2450 | Plate 3 x 3 without Corner | 3×3 · 1p | 6 studs |  |
| 2540 | Plate 1 x 2 with Handle | 2×2 · 1p | 2 studs · no anti-studs |  |
| 2926 | Plate 1 x 4 with 2 Wheel Pins | 5×1 · 1.25p | 4 studs · no anti-studs |  |
| 3020 | Plate 2 x 4 | 4×2 · 1p | 8 studs |  |
| 3021 | Plate 2 x 3 | 3×2 · 1p | 6 studs |  |
| 3022 | Plate 2 x 2 | 2×2 · 1p | 4 studs |  |
| 3024 | Plate 1 x 1 | 1×1 · 1p | 1 studs |  |
| 3027 | Plate 6 x 16 | 16×6 · 1p | 96 studs |  |
| 3028 | Plate 6 x 12 | 12×6 · 1p | 72 studs |  |
| 3029 | Plate 4 x 12 | 12×4 · 1p | 48 studs |  |
| 3030 | Plate 4 x 10 | 10×4 · 1p | 40 studs |  |
| 3031 | Plate 4 x 4 | 4×4 · 1p | 16 studs |  |
| 3032 | Plate 4 x 6 | 6×4 · 1p | 24 studs |  |
| 3033 | Plate 6 x 10 | 10×6 · 1p | 60 studs |  |
| 3034 | Plate 2 x 8 | 8×2 · 1p | 16 studs |  |
| 3035 | Plate 4 x 8 | 8×4 · 1p | 32 studs |  |
| 3036 | Plate 6 x 8 | 8×6 · 1p | 48 studs |  |
| 3176 | Plate 3 x 2 with Hole | 2×3 · 1p | 4 studs |  |
| 3460 | Plate 1 x 8 | 8×1 · 1p | 8 studs |  |
| 3623 | Plate 1 x 3 | 3×1 · 1p | 3 studs |  |
| 3666 | Plate 1 x 6 | 6×1 · 1p | 6 studs |  |
| 3710 | Plate 1 x 4 | 4×1 · 1p | 4 studs |  |
| 3795 | Plate 2 x 6 | 6×2 · 1p | 12 studs |  |
| 3832 | Plate 2 x 10 | 10×2 · 1p | 20 studs |  |
| 3958 | Plate 6 x 6 | 6×6 · 1p | 36 studs |  |
| 4477 | Plate 1 x 10 | 10×1 · 1p | 10 studs |  |
| 4488 | Plate 2 x 2 with 1 Wheel Pin | 3×2 · 2p | 4 studs |  |
| 4600 | Plate 2 x 2 with 2 Wheel Pins | 3×2 · 1.25p | 4 studs · no anti-studs | wheel holder plate (wheels: see Vehicles) |
| 6019 | Plate 1 x 1 with Clip Horizontal (Thick U-Clip) | 1×2 · 2p | 1 studs · no anti-studs |  |
| 6141 | Plate 1 x 1 Round | 1×1 · 1p | 1 studs | round 1×1: lights, knobs, flower centres |
| 6157 | Plate 2 x 2 with 2 Wheel Pins Extended without Wishbones | 4×2 · 2p | 4 studs |  |
| 15573 | Plate 1 x 2 with Groove with 1 Centre Stud, without Understud | 2×1 · 1p | 1 studs | jumper: one centred stud — offsets the next part by half a stud |
| 18677 | Plate 1 x 2 with Offset Peghole on Underside | 2×1 · 2.37p | 2 studs · no anti-studs |  |
| 22888 | Plate 4 x 8 Round Semicircle | 8×4 · 1p | 22 studs |  |
| 24866 | Plate 1 x 1 with 5 Petals | 1×1 · 1p | 1 studs | flower 1×1 |
| 26047 | Plate 1 x 1 Round with Horizontal Handle on Side | 1×2 · 1p | 1 studs · no anti-studs |  |
| 30565 | Plate 4 x 4 with Corner Round | 4×4 · 1p | 11 studs |  |
| 32028 | Plate 1 x 2 with Door Rail | 2×1 · 1p | 2 studs · no anti-studs |  |
| 32607 | Plate 1 x 1 Round with 3 Leaves | 2×2 · 1p | 1 studs · no anti-studs |  |
| 33291 | Plate 1 x 1 Round with Tabs | 1×1 · 1p | 1 studs |  |
| 35480 | Plate 1 x 2 with Round Ends and 2 Open Studs | 2×1 · 1p | 2 studs |  |
| 41539 | Plate 8 x 8 | 8×8 · 1p | 64 studs |  |
| 60478 | Plate 1 x 2 with Handle on End | 3×1 · 1p | 2 studs |  |
| 60479 | Plate 1 x 12 | 12×1 · 1p | 12 studs |  |
| 61252 | Plate 1 x 1 with Clip Horizontal (Thick C-Clip) | 1×2 · 1.18p | 1 studs · no anti-studs |  |
| 63868 | Plate 1 x 2 with Clip Horizontal on End (Thick C-Clip) | 3×1 · 1.18p | 2 studs · no anti-studs |  |
| 85861 | Plate 1 x 1 Round with Open Stud | 1×1 · 1p | 1 studs |  |
| 87580 | Plate 2 x 2 with Groove with 1 Centre Stud | 2×2 · 1p | 1 studs | jumper 2×2: one centred stud |
| 91405 | Plate 16 x 16 with Underside Ribs | 16×16 · 1p | 256 studs | plate 16×16 |
| 92280 | Plate 1 x 2 with Single Clip on Top | 2×1 · 2.25p | 1 studs |  |
| 92438 | Plate 8 x 16 | 16×8 · 1p | 128 studs |  |
| 92593 | Plate 1 x 4 with Two Studs | 4×1 · 1p | 2 studs |  |
| 99206 | Plate 2 x 2 x 0.667 with Two Studs On Side and Two Raised with Closed Understud | 2×2 · 2p | 4 studs · no anti-studs |  |
| 3023b | Plate 1 x 2 | 2×1 · 1p | 2 studs |  |
| 3794b | Plate 1 x 2 with Groove with 1 Centre Stud | 2×1 · 1p | 1 studs | jumper (older id) |
| 3839b | Plate 1 x 2 with Handles Type 2 | 3×2 · 1.25p | 2 studs · no anti-studs |  |
| 4032a | Plate 2 x 2 Round with Axlehole | 2×2 · 1p | 4 studs |  |
| 4081b | Plate 1 x 1 with Clip Light Type 2 | 1×2 · 2p | 1 studs · no anti-studs |  |
| 4085c | Plate 1 x 1 with Clip Vertical (Thick U-Clip) | 1×2 · 1p | 1 studs · no anti-studs |  |
| 30157a | Plate 2 x 4 with Rounded Pins | 6×2 · 2.25p | 8 studs |  |

## Tiles (no studs on top)

| id | part | size | top | note |
|---|---|---|---|---|
| 1751 | Tile 4 x 4 | 4×4 · 1p | smooth |  |
| 2342 | Tile 1 x 2 with Console | 2×2 · 5.78p | 1 studs |  |
| 2431 | Tile 1 x 4 with Groove | 4×1 · 1p | smooth |  |
| 2555 | Tile 1 x 1 with Clip | 1×1 · 2.25p | smooth |  |
| 3396 | Tile 2 x 2 with Two 1 x 1 Curved Cutouts | 2×2 · 1p | smooth |  |
| 4150 | Tile 2 x 2 Round with Cross Underside Stud | 2×2 · 1p | smooth |  |
| 4162 | Tile 1 x 8 | 8×1 · 1p | smooth |  |
| 6636 | Tile 1 x 6 | 6×1 · 1p | smooth |  |
| 14769 | Tile 2 x 2 Round with Round Underside Stud | 2×2 · 1p | smooth |  |
| 15535 | Tile 2 x 2 Round with Hole | 2×2 · 1p | smooth |  |
| 15712 | Tile 1 x 1 with Clip (Thick C-Clip) | 1×1 · 2.25p | smooth |  |
| 24246 | Tile 1 x 1 with Rounded End | 1×1 · 1p | smooth |  |
| 25269 | Tile 1 x 1 Corner Round | 1×1 · 1p | smooth |  |
| 26603 | Tile 2 x 3 | 3×2 · 1p | smooth |  |
| 27925 | Tile 2 x 2 Corner Round | 2×2 · 1p | smooth |  |
| 35381 | Tile 1 x 1 Round with Groove | 1×1 · 1p | smooth |  |
| 63864 | Tile 1 x 3 | 3×1 · 1p | smooth |  |
| 87079 | Tile 2 x 4 | 4×2 · 1p | smooth |  |
| 98138 | Tile 1 x 1 Round with Groove | 1×1 · 1p | smooth | round tile: dials, plates on tables, eyes |
| 2412b | Tile 1 x 2 Grille with Groove | 2×1 · 1p | smooth | grille tile: vents, fronts, drains |
| 3068b | Tile 2 x 2 with Groove | 2×2 · 1p | smooth |  |
| 3068bp06 | Tile 2 x 2 with Red Warning Triangle Pattern | 2×2 · 1p | smooth |  |
| 3069b | Tile 1 x 2 with Groove | 2×1 · 1p | smooth |  |
| 3069bp01 | Tile 1 x 2 with Letter Pattern | 2×1 · 1p | smooth |  |
| 3070b | Tile 1 x 1 with Groove | 1×1 · 1p | smooth | tile: smooth finish |
| 3070bp01 | Tile 1 x 1 with Black "1" Pattern | 1×1 · 1p | smooth |  |

## Slopes and wedges

| id | part | size | top | note |
|---|---|---|---|---|
| 2449 | Slope Brick 75 2 x 1 x 3 Inverted | 1×2 · 9p | 2 studs |  |
| 3037 | Slope Brick 45 2 x 4 | 4×2 · 3p | 4 studs | faces +z |
| 3038 | Slope Brick 45 2 x 3 | 3×2 · 3p | 3 studs | faces +z |
| 3039 | Slope Brick 45 2 x 2 | 2×2 · 3p | 2 studs | faces +z · the classic roof slope |
| 3041 | Slope Brick 45 2 x 4 Double | 4×2 · 3p | smooth |  |
| 3042 | Slope Brick 45 2 x 3 Double | 3×2 · 3p | smooth |  |
| 3043 | Slope Brick 45 2 x 2 Double | 2×2 · 3p | smooth | roof ridge (two faces) |
| 3045 | Slope Brick 45 2 x 2 Double Convex | 2×2 · 3p | 1 studs | faces +z · hip-roof outer corner |
| 3046 | Slope Brick 45 2 x 2 Double Concave | 2×2 · 3p | 3 studs | faces +z · hip-roof inner corner |
| 3297 | Slope Brick 33 3 x 4 | 4×3 · 3p | 4 studs | faces +z |
| 3298 | Slope Brick 33 3 x 2 | 2×3 · 3p | 2 studs | faces +z |
| 3299 | Slope Brick 33 2 x 4 Double | 4×2 · 1.75p | smooth |  |
| 3676 | Slope Brick 45 2 x 2 Inverted Double Convex | 2×2 · 3p | 4 studs |  |
| 4161 | Slope Brick 33 3 x 3 | 3×3 · 3p | 3 studs | faces +z |
| 4286 | Slope Brick 33 3 x 1 | 1×3 · 3p | 1 studs | faces +z |
| 6564 | Wedge 3 x 2 Right | 2×3 · 3p | 3 studs |  |
| 6565 | Wedge 3 x 2 Left | 2×3 · 3p | 3 studs |  |
| 30363 | Slope Brick 18 4 x 2 | 2×4 · 3p | 2 studs | faces +z |
| 54200 | Slope Brick 31 1 x 1 x 0.667 | 1×1 · 1.95p | smooth | "cheese" slope: tiny details, roof textures |
| 60477 | Slope Brick 18 4 x 1 | 1×4 · 3p | 1 studs | faces +z |
| 85984 | Slope Brick 31 1 x 2 x 0.667 | 2×1 · 1.95p | smooth | low 1×2 slope: dashboards, roofs, keyboards |
| 92946 | Slope Plate 45.73 2 x 1 | 1×2 · 3p | 1 studs | faces −z |
| 99301 | Slope Brick 33 3 x 3 Double Concave | 3×3 · 3p | 5 studs | faces +z |
| 3040b | Slope Brick 45 2 x 1 | 1×2 · 3p | 1 studs | faces +z · roof slope, 1 wide |
| 3044b | Slope Brick 45 2 x 1 Double | 1×2 · 3p | smooth | roof ridge, 1 wide |
| 3048b | Slope Brick 45 1 x 2 Triple | 2×1 · 3p | smooth |  |
| 3665a | Slope Brick 45 2 x 1 Inverted without Inner Stopper Ring | 1×2 · 3p | 2 studs | inverted: overhangs, eaves, undersides |
| 3747a | Slope Brick 33 3 x 2 Inverted without Ribs between Studs | 2×3 · 3p | 6 studs |  |
| 4287a | Slope Brick 33 3 x 1 Inverted with Notch and Thick Front | 1×3 · 3p | 3 studs |  |
| 4460a | Slope Brick 75 2 x 1 x 3 with Open Stud | 1×2 · 9p | 1 studs | faces +z |
| 60481a | Slope Brick 65 2 x 1 x 2 with Symmetric Stud Holder | 1×2 · 6p | 1 studs | faces +z |

## Curved slopes and curved arches

| id | part | size | top | note |
|---|---|---|---|---|
| 6005 | Arch 1 x 3 x 2 with Curved Top | 1×3 · 6p | 1 studs | faces +z |
| 6091 | Brick 2 x 1 x 1.333 with Curved Top | 1×2 · 4p | 1 studs | curved top 1×2: fenders, rounded tops |
| 6183 | Arch 1 x 6 x 2 with Curved Top | 6×1 · 6p | 2 studs |  |
| 11290 | Slope Brick Curved 2 x 8 x 2 Double | 8×2 · 6p | 4 studs |  |
| 11477 | Slope Brick Curved 2 x 1 | 1×2 · 2p | smooth | faces +z · curved 2×1: small smooth edges |
| 15068 | Slope Brick Curved 2 x 2 x 0.667 | 2×2 · 2p | smooth | faces +z · curved 2×2: smooth roofs, car bonnets |
| 24201 | Slope Brick Curved 2 x 1 Inverted | 1×2 · 1.99p | 2 studs · no anti-studs | faces −z |
| 24309 | Slope Brick Curved 3 x 2 | 2×3 · 3p | smooth | faces +z · curved 3×2 |
| 30602 | Slope Brick Curved Top 2 x 2 x 1 | 2×2 · 3p | smooth · no anti-studs | faces +z |
| 37352 | Brick 1 x 2 with Curved Top | 2×1 · 3p | smooth |  |
| 50950 | Slope Brick Curved 3 x 1 | 1×3 · 3p | smooth | faces +z · curved 3×1 |
| 61678 | Slope Brick Curved 4 x 1 | 1×4 · 3p | smooth | faces +z · curved 4×1: streamlined edges |
| 88930 | Slope Brick Curved 2 x 4 with Underside Studs | 4×2 · 2p | smooth | faces +z · curved 2×4 with studs underneath |
| 92903 | Arch 1 x 3 x 2 with Curved Top | 1×3 · 6p | 1 studs | faces +z |
| 93273 | Slope Brick Curved 4 x 1 Double | 1×4 · 2p | smooth | curved 4×1 double |
| 93604 | Slope Brick Curved 3 x 4 x 0.667 Rounded | 4×3 · 2p | 2 studs | faces −z |
| 93606 | Slope Brick Curved 4 x 2 | 2×4 · 3p | smooth | faces +z |
| 98281 | Wedge 6 x 4 x 0.667 Quadruple Curved | 4×6 · 2p | 4 studs |  |

## Cones, domes, dishes

| id | part | size | top | note |
|---|---|---|---|---|
| 3960 | Dish 4 x 4 Inverted | 4×4 · 2p | 1 studs | dish 4×4 |
| 4589 | Cone 1 x 1 | 1×1 · 3p | 1 studs | cone 1×1: tips, lamp tops |
| 4740 | Dish 2 x 2 Inverted | 2×2 · 1p | 1 studs · no anti-studs | dish 2×2: satellite dishes, lamp shades |
| 6233 | Cone 3 x 3 x 2 | 3×3 · 6p | 4 studs |  |
| 15395 | Dome 2 x 2 Inverted with Stud and Tube | 2×2 · 3.5p | 1 studs |  |
| 59900 | Cone 1 x 1 with Stop | 1×1 · 3p | 1 studs |  |
| 98100 | Cone 2 x 2 Truncated | 2×2 · 3p | 1 studs |  |
| 2654a | Dish 2 x 2 with Rim | 2×2 · 1p | 4 studs · no anti-studs |  |
| 3942b | Cone 2 x 2 x 2 with Hollow Stud and Axlehole Teeth | 2×2 · 6p | 1 studs | cone 2×2×2 |
| 3943b | Cone 4 x 4 x 2 with Axlehole | 4×4 · 6p | 4 studs |  |
| 30361a | Cylinder 2 x 2 x 2 Robot Body without Bottom Axle Holder | 2×2 · 6p | 4 studs |  |

## Arches

| id | part | size | top | note |
|---|---|---|---|---|
| 2339 | Arch 1 x 5 x 4 | 1×5 · 12p | 5 studs |  |
| 3307 | Arch 1 x 6 x 2 with Thick Top and Reinforced Underside | 6×1 · 6p | 6 studs |  |
| 3455 | Arch 1 x 6 | 6×1 · 3p | 6 studs | arch 1×6 |
| 3659 | Arch 1 x 4 | 4×1 · 3p | 4 studs | arch 1×4 |
| 4490 | Arch 1 x 3 | 3×1 · 3p | 3 studs |  |
| 6108 | Arch 1 x 12 x 3 | 12×1 · 9p | 12 studs | arch 1×12×3 (bridges) |
| 6182 | Arch 1 x 4 x 2 | 4×1 · 6p | 4 studs | arch 1×4×2 |
| 13965 | Arch 1 x 3 x 3 Pointed | 1×3 · 9p | 3 studs |  |
| 14707 | Arch 1 x 12 x 3 Raised | 12×1 · 9p | 12 studs |  |
| 15254 | Arch 1 x 6 x 2 with Thin Top | 6×1 · 6p | 6 studs |  |
| 18653 | Arch 1 x 3 x 2 Inverted | 3×1 · 6p | 1 studs |  |
| 30099 | Arch 1 x 5 x 4 Inverted | 5×1 · 12p | 2 studs |  |

## Windows, doors, panels, fences

| id | part | size | top | note |
|---|---|---|---|---|
| 2529 | Window 1 x 2 x 3 Pane Latticed | 1×2 · 7.75p | smooth · no anti-studs |  |
| 3582 | Window 1 x 2 x 2 Shutter | 1×2 · 6p | smooth · no anti-studs |  |
| 3633 | Fence Lattice 1 x 4 x 1 | 4×1 · 3p | smooth | lattice fence 1×4 |
| 3644 | Door 1 x 4 x 6 Grooved | 1×4 · 17p | smooth · no anti-studs |  |
| 3821 | Door 1 x 3 x 1 Right | 1×3 · 3p | 1 studs · no anti-studs |  |
| 3822 | Door 1 x 3 x 1 Left | 1×3 · 3p | 1 studs · no anti-studs |  |
| 3853 | Window 1 x 4 x 3 | 4×1 · 9p | 2 studs · no anti-studs |  |
| 3854 | Window 1 x 2 x 3 Pane | 1×2 · 7.75p | smooth · no anti-studs |  |
| 23969 | Panel 1 x 2 x 1 Double Corner with Rounded Corners | 2×1 · 3p | smooth |  |
| 30044 | Window 1 x 2 x 2.667 with Rounded Top | 2×1 · 8p | 1 studs |  |
| 30046 | Window 1 x 2 x 2.667 Pane Lattice Diamond with Rounded Top | 2×1 · 6.59p | smooth · no anti-studs |  |
| 30055 | Fence Spindled 1 x 4 x 2 | 4×1 · 6p | 2 studs | spindled fence 1×4×2 |
| 30156 | Panel 4 x 6 x 6 Sloped | 6×4 · 18p | 6 studs |  |
| 30179 | Door 1 x 4 x 6 Frame Type 1 | 4×1 · 18p | 2 studs | door frame 1×4×6 (use kit.door) |
| 40241 | Door 1 x 4 x 6 with Window | 5×1 · 16.93p | smooth · no anti-studs |  |
| 60592 | Window 1 x 2 x 2 without Sill | 2×1 · 6p | 2 studs | window frame 1×2×2 (use kit.window) |
| 60593 | Window 1 x 2 x 3 without Sill | 2×1 · 9p | 2 studs | window frame 1×2×3 (use kit.window) |
| 60594 | Window 1 x 4 x 3 without Shutter Tabs | 4×1 · 9p | 2 studs | window frame 1×4×3 (use kit.window) |
| 60596 | Door 1 x 4 x 6 Frame | 4×1 · 18p | 2 studs |  |
| 60621 | Door 1 x 4 x 6 Barred | 4×1 · 16.81p | smooth · no anti-studs |  |
| 87544 | Panel 1 x 2 x 3 Reinforced with Hollow Studs | 2×1 · 9p | 2 studs | panel 1×2×3 |
| 87552 | Panel 1 x 2 x 2 Reinforced | 2×1 · 6p | 2 studs | panel 1×2×2 |
| 2493b | Window 1 x 4 x 5 with Hollow Studs | 4×1 · 15p | 4 studs |  |
| 3861c | Door 1 x 4 x 5 with 4 Panes and Reinforced Hinge | 1×4 · 15p | 1 studs · no anti-studs |  |
| 4865a | Panel 1 x 2 x 1 with Square Corners | 2×1 · 3p | smooth | panel 1×2×1: low walls, counters |

## Details (bars, brackets, hinges, wings…)

| id | part | size | top | note |
|---|---|---|---|---|
| 2489 | Barrel 2 x 2 x 1.667 | 2×2 · 5.5p | smooth |  |
| 2569 | Antenna 8H Whip | 1×1 · 24p | smooth |  |
| 3700 | Technic Brick 1 x 2 with Hole | 2×1 · 3p | 2 studs |  |
| 3701 | Technic Brick 1 x 4 with Holes | 4×1 · 3p | 4 studs |  |
| 3823 | Windscreen 2 x 4 x 2 | 4×2 · 6p | 2 studs |  |
| 3937 | Hinge 1 x 2 Base | 2×1 · 2.75p | smooth |  |
| 3938 | Hinge 1 x 2 Top | 2×1 · 2p | 2 studs · no anti-studs |  |
| 4083 | Bar 1 x 4 x 2 with Studs | 4×1 · 6p | 2 studs |  |
| 4214 | Hinge Car Roof Holder 1 x 4 x 2 | 4×1 · 7p | smooth |  |
| 4274 | Technic Pin 1/2 | 1×1 · 2p | smooth · no anti-studs |  |
| 4346 | Container Box 2 x 2 x 2 Door with Slot | 2×1 · 6p | smooth · no anti-studs |  |
| 4594 | Windscreen 2 x 4 x 2 Vertical | 4×2 · 6p | 6 studs |  |
| 4598 | Bracket 2 x 3 - 2 x 2 | 2×3 · 6p | 5 studs · no anti-studs |  |
| 6020 | Bar 7 x 3 with Double Clips | 3×7 · 2p | smooth · no anti-studs |  |
| 6134 | Hinge 2 x 2 Top | 2×2 · 2p | 4 studs · no anti-studs |  |
| 6187 | Bar 1 x 4 x 2 | 4×1 · 6p | smooth |  |
| 6556 | Train Window 1 x 4 x 3 with Shutter Holes | 4×1 · 9p | 2 studs |  |
| 24375 | Technic Rubber Pin for Chain Tread 5 Wide | 1×1 · 1.75p | smooth · no anti-studs |  |
| 30153 | Rock 1 x 1 Gem Facetted | 1×1 · 2.75p | smooth · no anti-studs |  |
| 30374 | Bar 4L Lightsaber Blade | 1×1 · 10p | smooth · no anti-studs |  |
| 32001 | Technic Plate 2 x 6 with Holes | 6×2 · 1p | 12 studs |  |
| 32530 | Technic Tile 1 x 2 with Two Holes | 2×1 · 4.88p | smooth |  |
| 87994 | Bar 3L | 1×1 · 7.5p | smooth · no anti-studs |  |
| 99207 | Bracket 1 x 2 - 2 x 2 Up | 2×1 · 5p | 2 studs · no anti-studs |  |
| 99780 | Bracket 1 x 2 - 1 x 2 Up | 2×1 · 2.5p | 2 studs · no anti-studs |  |
| 99781 | Bracket 1 x 2 - 1 x 2 Down | 2×1 · 2.5p | 2 studs |  |
| 2436a | Bracket 1 x 2 - 1 x 4 with Square Corners | 4×1 · 2.5p | 2 studs |  |
| 3957a | Antenna 4H with Rounded Top | 1×1 · 12p | smooth |  |
| 4345b | Container Box 2 x 2 x 2 with Hollow Studs | 2×2 · 6p | 4 studs · no anti-studs |  |
| 4346p01 | Container Box 2 x 2 x 2 Door with Fire Logo Red/Orange/Yellow Pattern | 2×1 · 6p | smooth · no anti-studs |  |
| 4495a | Flag 4 x 1 with First Wave Left | 1×4 · 3p | 1 studs · no anti-studs |  |
| 4599a | Tap 1 x 1 with Hole in Spout | 1×1 · 3p | 1 studs · no anti-studs |  |
| 32064a | Technic Brick 1 x 2 with Axlehole with Open Sides and Stud Blocker | 2×1 · 3p | 2 studs |  |
| 41769a | Wing 2 x 4 Right without Chamfer | 2×4 · 1p | 4 studs |  |
| 41770a | Wing 2 x 4 Left without Chamfer | 2×4 · 1p | 4 studs |  |
| 43722a | Wing 2 x 3 Right without Chamfer | 2×3 · 1p | 3 studs |  |
| 43723a | Wing 2 x 3 Left without Chamfer | 2×3 · 1p | 3 studs |  |
| 48729a | Bar 1.5L with Clip without Hole in Shaft | 1×1 · 4.79p | smooth · no anti-studs |  |

## Plants

| id | part | size | top | note |
|---|---|---|---|---|
| 2417 | Plant Leaves 6 x 5 | 5×6 · 1p | 14 studs | leaves 6×5: tree canopies (see kit.tree) |
| 2423 | Plant Leaves 4 x 3 | 3×4 · 1p | 6 studs · no anti-studs | leaves 4×3 (no anti-studs: rides on a clip — avoid) |
| 2435 | Plant Tree Pyramidal 3 x 3 x 4 | 3×3 · 12.38p | smooth | small moulded pine |
| 3471 | Plant Tree Pyramidal 4 x 4 x 6.667 Type 1 | 4×4 · 19.88p | smooth | moulded pine tree |
| 3742 | Plant Flower | 1×1 · 0.75p | smooth · no anti-studs |  |
| 6148 | Plant Palm Leaf Small | 8×3 · 4.06p | 2 studs · no anti-studs |  |
| 6255 | Plant 1 x 1 x 0.667 Round with 3 Large Leaves | 5×4 · 5.43p | 1 studs · no anti-studs |  |
| 15279 | Plant Grass Stem | 1×2 · 8p | smooth |  |
| 19119 | Plant Flower Stem with Bar and 6 Stems | 2×3 · 5.35p | smooth · no anti-studs |  |
| 24855 | Plant Flower Stem with Bar and Hole | 2×2 · 5.94p | smooth |  |
| 30176 | Plant Brick 1 x 1 Round with 3 Bamboo Leaves | 3×4 · 3p | 1 studs · no anti-studs |  |
| 37695 | Plant Stem with 3 Leaves with Bar and Pin Holes | 2×2 · 3.96p | smooth |  |
| 98262 | Plant Flower 2 x 2 with Solid Stud | 2×2 · 3p | 1 studs | flower 2×2 |
| 3741a | Plant Flower Stem | 2×1 · 5.64p | 1 studs · no anti-studs |  |
| 6064b | Plant Bush | 4×4 · 13p | 1 studs | bush |

## Animals

| id | part | size | top | note |
|---|---|---|---|---|
| 2546 | Animal Bird Parrot | 1×1 · 9.22p | smooth · no anti-studs |  |
| 11602 | Animal Cat Sitting | 2×2 · 6.71p | smooth · no anti-studs |  |
| 13665 | Animal Bird Crow | 3×2 · 3.17p | smooth · no anti-studs |  |
| 30238 | Animal Spider | 3×2 · 2p | smooth |  |
| 33122 | Animal Starfish | 3×2 · 2p | 1 studs |  |
| 33320 | Animal Frog | 1×1 · 2.83p | smooth · no anti-studs |  |
| 64648 | Animal Fish Straight | 1×3 · 3.19p | smooth · no anti-studs |  |
| 2546p01 | Animal Bird Parrot with White Face and Yellow/Green Wings Pattern | 1×1 · 9.22p | smooth · no anti-studs |  |
| 12891p01 | Animal Bird Seagull with Bright Light Orange Beak and Black and Light Bluish Grey Wings Pattern | 3×3 · 5.78p | smooth · no anti-studs |  |
| 13786p03 | Animal Cat Standing Looking Forward with Yellow Eyes and Dark Bluish Grey Nose and Mouth Pattern | 1×2 · 7.67p | smooth · no anti-studs |  |
| 26078p01 | Animal Dog Terrier with Black Eyes and Nose and Light Bluish Grey Fur Lines Pattern | 1×3 · 6.78p | smooth |  |

## Vehicles

| id | part | size | top | note |
|---|---|---|---|---|
| 2441 | Car Base 7 x 4 x 0.667 | 4×7 · 2p | 20 studs | car base 7×4 |
| 3641 | Tyre 6/ 50 x 8 Offset Tread | 2×1 · 4.5p | smooth · no anti-studs |  |
| 3788 | Car Mudguard 2 x 4 | 4×2 · 2p | 8 studs |  |
| 4211 | Car Base 4 x 5 | 4×5 · 2p | 16 studs | car base 4×5 |
| 4624 | Wheel Rim 6.4 x 8 | 1×1 · 2.5p | smooth · no anti-studs |  |
| 6015 | Tyre 12/ 40 x 11 Wide | 2×1 · 6.25p | smooth · no anti-studs |  |
| 50944 | Wheel Rim 6.4 x 11 with 5 Spokes | 1×1 · 3.5p | smooth · no anti-studs |  |
| 50947 | Car Mudguard 4.5 x 1 x 1 | 4×1 · 2.38p | smooth |  |
| 50951 | Tyre 6/ 30 x 11 | 2×1 · 4.75p | smooth · no anti-studs |  |
| 55981 | Wheel Rim 14 x 18 with Holes on Both Sides (Needs Work) | 2×2 · 5.25p | smooth · no anti-studs |  |
| 56891 | Tyre 18/ 56 x 17 Off-Road with Offset Centre | 5×2 · 11.5p | smooth · no anti-studs |  |
| 92851 | Wheel Minifig Bicycle with Integral Rubber Black Tyre | 2×1 · 5.3p | smooth · no anti-studs |  |
| 3829c01 | Car Steering Stand and Wheel (Complete) | 2×1 · 5.84p | smooth | steering wheel on stand |
| 6014a | Wheel Rim 12 x 11 with Round Hole | 1×1 · 3.25p | smooth · no anti-studs |  |
| 30027b | Wheel Rim 8 x 8 Notched Hole, Two Slots, for Wheel Holding Pin | 1×1 · 2.5p | smooth · no anti-studs |  |
| 30028b | Tyre 8/ 40 x 8 Slick Smooth | 2×1 · 4.5p | smooth · no anti-studs |  |

## Minifigure hats, hair and accessories

| id | part | size | top | note |
|---|---|---|---|---|
| 3624 | Minifig Police Hat | 2×2 · 1.98p | smooth · no anti-studs |  |
| 3625 | Minifig Hair Female with Pigtails | 2×1 · 3.53p | smooth |  |
| 3629 | Minifig Hat Cowboy | 2×2 · 2.5p | smooth · no anti-studs |  |
| 3833 | Minifig Construction Helmet | 2×2 · 2.13p | smooth · no anti-studs |  |
| 3834 | Minifig Fire Helmet | 2×2 · 3.25p | smooth · no anti-studs |  |
| 3836 | Minifig Pushbroom | 2×1 · 10.6p | smooth · no anti-studs |  |
| 3837 | Minifig Shovel | 1×1 · 11.5p | smooth · no anti-studs |  |
| 3846 | Minifig Shield Triangular | 2×1 · 5.8p | smooth · no anti-studs |  |
| 3878 | Minifig Top Hat | 2×2 · 2.63p | smooth · no anti-studs |  |
| 3896 | Minifig Helmet Castle with Chin-Guard | 2×2 · 5.12p | smooth · no anti-studs |  |
| 3899 | Minifig Cup | 1×2 · 3p | smooth |  |
| 3900 | Minifig Signal Holder | 1×3 · 0.75p | 1 studs · no anti-studs |  |
| 3901 | Minifig Hair Male | 1×1 · 3.01p | smooth |  |
| 4006 | Minifig Tool Spanner/Screwdriver | 1×1 · 9.05p | smooth · no anti-studs |  |
| 4079 | Minifig Seat 2 x 2 | 2×2 · 6p | 2 studs · no anti-studs |  |
| 4497 | Minifig Spear with Round End | 1×1 · 18.25p | smooth · no anti-studs |  |
| 4523 | Minifig Container D-Basket | 2×2 · 4p | smooth |  |
| 4528 | Minifig Frypan | 1×2 · 1.5p | smooth · no anti-studs |  |
| 4529 | Minifig Saucepan | 1×2 · 3p | smooth · no anti-studs |  |
| 4530 | Minifig Hair Shoulder Length | 2×1 · 3.71p | smooth · no anti-studs |  |
| 6131 | Minifig Wizards Hat | 3×3 · 4.86p | smooth |  |
| 6246 | Minifig Tool Mechanical, 6 on Sprue | 8×8 · 2.38p | smooth · no anti-studs |  |
| 10048 | Minifig Hair Tousled | 2×2 · 4.13p | smooth |  |
| 13785 | Minifig Hair with Ponytail and Fringe | 1×2 · 4.11p | smooth · no anti-studs |  |
| 15443 | Minifig Hair with 2 Locks on Left Side | 2×2 · 3.49p | smooth · no anti-studs |  |
| 20877 | Minifig Hair Female Short Swept Sideways | 2×2 · 4.04p | smooth · no anti-studs |  |
| 26139 | Minifig Hair Short Wavy with Centre Parting | 2×2 · 4.11p | smooth · no anti-studs |  |
| 30148 | Minifig Camera Movie | 1×3 · 9p | smooth |  |
| 30162 | Minifig Binoculars with Round Eyepiece | 1×1 · 1.5p | smooth · no anti-studs |  |
| 30608 | Minifig Hair Flat Top | 1×2 · 2.76p | smooth · no anti-studs |  |
| 33078 | Minifig Food Sausage | 2×1 · 1p | smooth · no anti-studs |  |
| 33085 | Minifig Food Banana | 2×2 · 1.67p | smooth · no anti-studs |  |
| 33183 | Minifig Food Carrot Top | 1×1 · 5.23p | smooth · no anti-studs |  |
| 40233 | Minifig Hair Short Tousled | 2×2 · 3.96p | smooth · no anti-studs |  |
| 40239 | Minifig Hair Long Straight | 2×2 · 7.79p | smooth · no anti-studs |  |
| 40251 | Minifig Hair Long Wavy | 2×2 · 5.87p | smooth · no anti-studs |  |
| 62696 | Minifig Hair Ponytail with Long Bangs | 2×2 · 7.74p | smooth · no anti-studs |  |
| 62810 | Minifig Hair Short, Tousled with Side Parting | 1×2 · 3.25p | smooth · no anti-studs |  |
| 64798 | Minifig Hair Backslick | 2×2 · 3.78p | smooth · no anti-studs |  |
| 86035 | Minifig Cap with Short Arched Peak | 1×2 · 2.13p | smooth |  |
| 87990 | Minifig Hair with Ponytail and Swept Sideways Fringe | 2×2 · 4.57p | smooth |  |
| 92081 | Minifig Hair Combed Front to Rear | 1×1 · 3.57p | smooth |  |
| 92746 | Minifig Hair Tousled and Layered | 2×2 · 3.9p | smooth · no anti-studs |  |
| 93219 | Minifig Baseball Cap with Button on Top | 1×2 · 2.44p | smooth |  |
| 95328 | Minifig Hair Mid-Length Smooth Wide Bob Cut | 2×2 · 4.23p | smooth · no anti-studs |  |
| 98385 | Minifig Hair Spiked | 2×2 · 4.24p | smooth · no anti-studs |  |
| 99930 | Minifig Hair Short Combed Sideways with Left Parting | 1×2 · 3.54p | smooth · no anti-studs |  |
| 3962b | Minifig Radio with Long Handle | 1×1 · 9.13p | smooth · no anti-studs |  |
| 4449-f1 | Minifig Suitcase (Closed) | 2×1 · 4.12p | smooth · no anti-studs |  |
| 30089a | Minifig Camera Snapshot Type 1 | 2×1 · 2.75p | smooth · no anti-studs |  |

## Baseplates

| id | part | size | top | note |
|---|---|---|---|---|
| 3811 | Baseplate 32 x 32 | 32×32 · 0.5p | 1024 studs | baseplate 32×32 (thin; prefer kit.base) |
