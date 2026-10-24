# Morning and evening story scenes

Implemented locally with the built-in image_gen tool. Original mother and baby assets are retained; only a small clipped smiling-mouth overlay is shown in the evening.

## Final assets and prompts

### assets/dad-standing.png

Create a single transparent 2D game sprite: the father for this exact pastel nursery game. Reference image is the mother, use her soft painterly flat style, gentle small dark oval eyes, peach skin, round friendly face, minimal shading, no outlines. Father about 30, short warm brown hair, clean shaven, sage/teal long-sleeve sweater, beige trousers, brown shoes, no bag. Full body standing in three-quarter view facing RIGHT toward his wife, warm smile, relaxed arms at sides. Adult proportions, slightly taller than mother. Portrait 1024x1536 canvas; feet anchor at 96% height, head near 7%, centered around50%x. True transparent alpha, no background, no text, no floor or glow. This identity and clothing must remain consistent for later kiss/wave/hug sprites.

### assets/dad-kiss.png

Exact father identity from reference1, same sage sweater/beige pants/brown shoes, same pastel game art. A full-body transparent sprite of DAD KNEELING ON ONE KNEE and leaning right to kiss his SEATED wife's cheek (do NOT draw wife). IMPORTANT CANVAS LAYOUT: portrait1024x1536; TOP THIRD OF CANVAS MUST BE EMPTY TRANSPARENT; hair top at y35%, head between y35%-60%, kissing lips at x85%, y52%; bent knees and shoes below, ground at y96%. Thus this is a low kneeling lean, not a standing bend and not filling the top of canvas. Loving closed eyes, small pursed lips facing right, gentle hands extended. Preserve adult face/hair/color from reference1, no aging/changeclothes. Mother reference2 for style/scale only. No background, no text, no glow. Full body and limbs completely visible with transparent margins.

### assets/dad-wave.png

Identity-preserving transparent game sprite pose variant. Reference1 is the EXACT father; preserve his facial identity, warm brown hair, small dark oval eyes, sage/teal sweater, beige trousers, brown shoes, soft pastel painterly 2D style, proportions and colors. Reference2 mother is scale/style reference only, do not draw her. Pose: Same exact standing father silhouette, head/feet position and identity as reference. Only raise his right hand beside face, palm facing viewer, warm smile, waving goodbye. Full body, maintain original exact canvas and baseline. Transparent alpha, no backdrop, no shadow/glow, no floor, no props or text. Full portrait 1024x1536 canvas, preserve original margins/scale as much as pose allows.

### assets/dad-back.png

Identity-preserving transparent game sprite pose variant. Reference1 is the EXACT father; preserve his facial identity, warm brown hair, small dark oval eyes, sage/teal sweater, beige trousers, brown shoes, soft pastel painterly 2D style, proportions and colors. Reference2 mother is scale/style reference only, do not draw her. Pose: Same father, viewed from BACK in a gentle walking step toward the LEFT, turning to leave room. Same brown short hair, sage sweater, beige pants, brown shoes, exact same scale as reference with feet at y96%. Full body; no added room. Transparent alpha, no backdrop, no shadow/glow, no floor, no props or text. Full portrait 1024x1536 canvas, preserve original margins/scale as much as pose allows.

### assets/dad-hug.png

Identity-preserving transparent game sprite pose variant. Reference1 is the EXACT father; preserve his facial identity, warm brown hair, small dark oval eyes, sage/teal sweater, beige trousers, brown shoes, soft pastel painterly 2D style, proportions and colors. Reference2 mother is scale/style reference only, do not draw her. Pose: Same father kneels low on his heels on floor, facing RIGHT and leaning affectionately toward seated wife (wife NOT drawn). Gentle smile, head center around x73% y43% of canvas so it sits beside seated mother's head. One arm curves behind her shoulders toward canvas right edge, other hand reaches forward at x95% y60% as if embracing her far shoulder. Keep feet/ground at original y96%. Full body with bent knees, no sitting furniture, no wife or baby; exact original 1024x1536 canvas. Expression loving, never childlike. Transparent alpha, no backdrop, no shadow/glow, no floor, no props or text. Full portrait 1024x1536 canvas, preserve original margins/scale as much as pose allows.

### assets/mother-story-smile.png

Precise expression-only edit of this mother and newborn game sprite. Preserve full original 1214x1295 canvas, exact framing, position, body, hair color and strands, eyes, eyebrows, skin, lavender clothes, hands, crossed legs, slippers and newborn exactly. Change ONLY mother's small downward mouth into a tender content closed-mouth smile. No other edits, no pose changes, no added figures, no scenery or text. True transparent alpha. This sprite will overlay only a tiny mouth area in a family hug scene.

## Timing and rendering

- Both levels use the same 4000 ms introduction and 4000 ms evening scene.
- start() resets the chosen level without generating needs, shows the morning scene, then calls startGameplay() only after 4000 ms. The gameplay clock starts at zero / 07:00.
- Intro: standing together; kneel/lean and kiss; smile and wave; turn to the rear pose; walk out left. Scene sprites blend using eased weights, with a single consistent dad identity.
- Evening begins at 19:00 / 72000 ms. GameModel clears needs and current actions at this final boundary; other hour boundaries still queue needs behind ongoing actions. This final-day rule follows the new evening-scene requirement.
- Evening: Dad enters left, approaches, kneels beside Mom, embraces her with a foreground hand layer, and Mom smiles. Baby stays in Mom's arms. Victory buttons appear only after the 4000 ms scene.
- Scene time uses a separate GameClock and the existing generation-guarded requestAnimationFrame loop. Game time is paused throughout; the evening game clock is clamped to 72000 ms. Hidden/background scenes automatically pause and resume when visible/focused. No scene setTimeout callbacks or libraries.
- Scene inputs are disabled. Existing game pause and restart confirmation remain available during active play; restart and level selection replay the morning for the selected level.
- All story captions use the existing RU/EN dictionary and language persistence. Language changes do not reset scenes.
- Dad portraits use a common 1024x1536 scene canvas. The final kiss sprite includes a transparent upper area to bring the face to the seated mother's cheek. The hug sprite uses .85 scale about the feet to match head sizes. A clipped foreground hand completes the embrace. The smiling-mouth overlay preserves Mom's original hair, skin, clothes and body.

## Validation

- tests/game.test.cjs: 2004 complete simulations plus clock, queue, penalties, reset and exact 19:00 checks.
- tests/ui.test.cjs: updated launch/result flows wait for scenes, existing pause/restart, language, levels, interactions and responsive checks.
- tests/story.test.cjs: morning/evening on both levels, no need before intro ends, full reaction window, input blocking, exact 72-second game boundary, delayed victory overlay, captions and poses, automatic background pause, unlock/next level/restarts, stale-scene cancellation, defeat without happy ending, and four mobile viewports.
- Visual inspection in Chrome at 390x844 and 280x568, including kiss contact, waving and hug/foreground hand.


## Standing family during story scenes — 2026-10-23

Both intro and outro now render the original mother-baby-standing.png at the same 1.52 scale as gameplay standing poses. Mom already smiles in that original. Her original image/color/geometry are retained, and only the infant face from assets/mother-story-standing-smile.png is overlaid through an elliptical clip, so both smile throughout the scenes. Gameplay expressions and body sprites are unchanged.

Dad's story canvas is now 50% room width at top5%, sharing the family's floor line. The kiss uses assets/dad-kiss-standing.png (the earlier generated standing lean, reused without raster editing); the hug uses assets/dad-hug-standing.png with a clipped foreground forearm. Kneeling story poses and the former seated mouth overlay remain on disk but are no longer referenced. All scene timings, gameplay, pause, RU/EN and start/end rules remain unchanged.

New/selected asset prompts, built-in image_gen mode:

### assets/mother-story-standing-smile.png
Precise expression-only edit of this exact transparent standing mother holding newborn game sprite. Preserve exact1024x1536 canvas, full body and all coordinates, mother's exact smiling face, hair palette, lavender clothes, hands, proportions, slippers and baby curl/swaddle. Change ONLY newborn expression: happy gentle smile, little curved smiling eyes, tiny joyful open mouth (not crying or yawning), soft cheeks. Same infant age and size. Do NOT change mother's face, body, hair, baby size or pose. True transparent alpha, no background, no glow, no text. Used as a clipped infant-face overlay on exact original standing sprite.

### assets/dad-hug-standing.png
Identity-preserving transparent sprite variant of exact father from reference1, same face, brown hair, sage sweater, beige trousers, brown shoes and soft pastel 2D style. Full body STANDING upright (not kneeling) facing RIGHT, leaning just slightly affectionately, smiling, gently embracing wife to his right (wife NOT drawn). Reference2 is standing mother carrying infant for scale and partner position only. Maintain father's original1024x1536 canvas and standing head/feet locations, feet at96%height; same head size as reference1. One arm extends behind wife's shoulders at right edge around y38%, another forearm curves forward around her upper waist, hand near x90% y53%; open gentle hand not covering infant. No new mother or baby, no scenery or text; true transparent alpha. Keep body/clothing/face scale like standing dad, only change arms into a loving standing hug.

### assets/dad-kiss-standing.png
Identity-preserving transparent game sprite pose variant. Reference1 is the EXACT father; preserve his facial identity, warm brown hair, small dark oval eyes, sage/teal sweater, beige trousers, brown shoes, soft pastel painterly 2D style, proportions and colors. Reference2 mother is scale/style reference only, do not draw her. Pose: Father bends deeply forward to his RIGHT to kiss his seated wife's cheek (wife NOT drawn). Keep feet anchored at original y96%; face in right-facing profile, eyes tenderly closed and small pursed kissing lips. Mouth reaches around x85% y52% of canvas, head lowered naturally by bending at waist and knees, torso tilts, arms gently reaching forward. Do not draw wife/baby. Transparent alpha, no backdrop, no shadow/glow, no floor, no props or text. Full portrait 1024x1536 canvas, preserve original margins/scale as much as pose allows.

Validation: visual contact checks at390x844, both complete browser suites, and story regression assertions for visible standing pose/hidden seated pose, happy infant throughout both scenes, and normal pose restored afterward. Existing story tests cover both levels, four mobile sizes, exact durations, background freeze, inputs, restarts and language changes.

## Face-to-face staging and longer scenes — 2026-10-24
Both story scenes now last 5000 ms (previously 4000). The original choreography is proportionally stretched, including captions; gameplay remains 72000 ms and care actions remain 2000 ms. No new raster assets were needed.
During scenes only, Mom is at room left40% and her standing sprite plus clipped smiling infant overlay are mirrored together to face Dad on the left. Dad stands at16%, leans toward12% for the kiss, and approaches18% for the hug. His body remains visibly beside Mom rather than hidden behind her. The foreground forearm clip starts lower to keep the infant's face clear.
Validation: all model, UI and story suites pass. Story tests explicitly verify that the intro is still active at4000 ms, the outro still hides victory buttons at4000 ms, and both finish at5000 ms. Mirrored facing, left-side Dad placement, background pause, languages, restart and four mobile viewports are covered. Visual checks at390x844 and280x568 confirm contact and no clipped family members.
