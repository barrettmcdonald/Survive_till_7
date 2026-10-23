# Survive till 7 — reference art layers

All four PNG assets were made with the built-in image_gen tool, using the user's attached nursery illustration as the mandatory visual reference. They are local assets; no remote services are used by the game.

## Files and layering
- room.png — 1024 × 1536 clean room plate. In the game, the upper 325 pixels (formerly UI) are cropped by the SVG viewBox. The room, sink, crib and foreground table have separate SVG groups/clips in index.html.
- mother-baby-seated.png — transparent seated mother and newborn, the resting pose.
- mother-baby-standing.png — transparent standing mother carrying the newborn, the approach/action/return pose.
- bottle.png — transparent bottle, used as an interactive table object and as a feeding prop.

The UI, thought bubble, touch markers, tears, water bubbles and Zzz remain independent HTML/CSS elements and can be translated or paused. No text is baked into the illustration.

## Final prompt set (built-in image_gen)
1. Background plate, precise-object-edit: preserve the exact 1024 × 1536 portrait composition, soft flat painterly pastel nursery, peach/cream palette, arched blue window, moon print, sink at left with grey tap and lavender towel, crib at right with moon/star mobile, oval sage rug, foreground table/chairs, teddy, blocks and plants. Remove all UI/text/touch markers, thought bubble, mother/newborn and foreground bottle; reconstruct wall/rug/floor; no redesign or repositioning.
2. Seated character, background-extraction: reproduce only the exact reference mother holding her newborn, loose honey-brown bun and long hair, peach skin, tiny dark eyes, lavender clothes and crossed legs, brown slippers, mint striped swaddle and baby curl. Preserve pose and proportions. Full body, true transparent alpha background, no room, rug, UI or bubble.
3. Bottle, background-extraction: reproduce only the foreground cream milk bottle, dusty pink collar, golden teat, five grey measurement ticks, slight clockwise lean. Same soft pastel painterly 2D style; tightly framed transparent alpha; no table, touch marker or text.
4. Standing character, identity-preserve: use the original scene and seated extraction as identity/style references. Same mother and swaddled baby, same hair, face, clothes and palette. Change only to an upright small step to the right while holding baby securely, gentle attentive expression; full body including slippers, transparent alpha, no room or props.

## Animation
The existing GameModel and GameClock remain unchanged. renderScene() reads model.elapsed and model.actionStarted only: 0–180 ms rise, 180–580 ms approach, 580–1520 ms care, 1520–1820 ms return, 1820–2000 ms sit. The standing sprite and care props use a 1.52 scale with a shared foot anchor; pose blending follows game time. All movement and effect visibility freeze with the existing pause. A new hour or restart resets the visual pose through the same render path.


## Separate baby care layers (update)
Generated with built-in image_gen using mother-baby-standing.png as mandatory identity/style reference:
- mother-standing-empty.png: precise-object-edit. Keep exact mother appearance, pose, full 1024x1536 canvas, body/hair/feet coordinates and lavender clothes. Remove only baby; reconstruct blouse; preserve cupped empty hands; true transparent alpha, no background or props.
- baby.png: background-extraction. Extract only exact newborn, peach round head, single brown curl, closed eyes, tiny open mouth, mint striped swaddle and white collar. Cradled diagonal pose head upper right/feet lower left, full baby, tightly framed small transparent margins, no mother's hands, no props, transparent alpha.
The new layers move independently: baby is lowered into the crib/basin during the care phase and returned to Mom's arms before the same 2000 ms action ends. Foreground crib rails/basin edge occlude the baby correctly. Water, soap bubbles and Zzz are independent effects driven by the existing paused game clock. Feeding continues to use the original carrying pose with a smaller bottle aligned to the baby's mouth.
UI update: rounded thought bubble with wrapped RU/EN text and contained progress bar; compact status panel.
Game rule update: GameModel filters out the previous need after two repetitions, choosing uniformly from the two remaining needs. Restart clears the streak. tests/game.test.cjs covers 1002 games including adversarial constant random values, old penalties, pause, restart and day duration.


## Rear pose and furniture occlusion correction
- mother-back.png: built-in image_gen, identity-preserve edit of mother-standing-empty.png. Final prompt: turn only the exact same mother to a three-quarter BACK VIEW facing a crib at upper-right; show the back of hair and lavender blouse, no front-facing face. Preserve bun, hair, clothes, slippers, proportions, full 1024x1536 canvas and foot anchor. Arms reach forward as if lowering baby, no baby/crib/props, transparent alpha.
- Mother now stops before the crib and is drawn in front of furniture. Baby depth changes separately between held and inside states. Rails, hanging blanket and the full opaque sink front/cabinet occlude only the baby. Transfer trajectories first lift above the edge, cross it, then lower; retrieval follows the same clearance rule.
- Sink front contour is traced in source-room coordinates rather than a diagonal strip. Full cabinet occlusion prevents the lower body from showing below the basin. Table/chairs remain foreground layers.
- Checked 192 intermediate frames across 3 phone sizes and RU/EN, rear pose, depth order, edge clearance, pause during turning, and unchanged two-second action duration. Existing 1002-game rule regression tests pass. A screenshot pixel comparison found no baby pixels inside the opaque cabinet (only 1-level anti-aliasing at the outer frame edge).


## Washing hands, crying expression and title return
Built-in image_gen was used for the following two new local assets:
- mother-washing.png — precise-object-edit of mother-standing-empty.png. Final prompt: keep the exact mother identity, lavender clothes, full 1024x1536 canvas, head/foot placement and style; change only both arms to reach forward/right at waist height, palms down, fingers gently washing on an unseen sink. No hands at chest or stomach; no baby, room or sink; transparent alpha. Mirrored in the game to reach the left-side basin.
- mother-baby-crying.png — precise-object-edit of mother-baby-seated.png. Final prompt: preserve the exact seated mother and baby, pose, swaddle and 1214x1295 canvas; change only baby's facial expression to unmistakable crying: tightly scrunched eyelids, distressed eyebrows, large wailing mouth with tongue, red cheeks and tiny wet eye highlights. No large painted tears; transparent alpha. Large CSS teardrops are animated separately and pause with the game.
Table bottle is straightened with a -6-degree CSS rotation; feeding prop is unchanged. The pause menu now has localized Back to title / На начальный экран. Returning invalidates old animation frames, resets the abandoned party, stops the game clock and restores the full localized title screen. Language persists; Start the day begins a clean party.
Verified RU/EN menu flow and no background penalties, new poses, animated tears freezing on pause, correct action ending crying, four viewport widths (280–480), and existing 1002-game regression tests.


## Growing Up / level 2
Built-in image_gen assets (original level 1 art is retained):
- level2-playmat.png (1536x1024): isolated soft oval infant play mat, cream/mint quilt with lavender edge, matching the reference nursery's elevated perspective and soft pastel style. Peach ring rattle, tan bunny plush, mint/lavender ball at edges; center empty. Transparent alpha, no people/room/text.
- level2-baby-playing.png (1536x1024): identity-preserve edit of baby.png. Same curl, round peach face and mint stripes, slightly older/plumper young infant around 3 months. Lying FLAT ON BACK, head right/feet left, smiling, both tiny arms raised toward a toy. Mint striped romper/loose sleep sack, no sitting/standing/walking, no mother/mat/toys, transparent alpha.
- level2-mother-playing.png (1024x1536): identity-preserve reference mother-standing-empty.png. Same mother/hair/bun/lavender clothes, kneeling on heels on floor facing right, looking affectionately down to a lying infant not drawn. Right hand holds peach ring rattle forward, left hand supports near baby's side; full body, transparent alpha, no floor/room/baby.
- level2-family-seated.png (1215x1295): preserve exact original seated mother pose/canvas, change only infant to same recognizable slightly older/plumper baby about 10% larger, mint striped romper/loose sack, quiet eyes open, tiny arm free, fully supported in mother's arms. Same framing and transparent alpha; never sitting or standing independently.
- level2-family-crying.png: expression variant of level2-family-seated.png; same pose/canvas, only baby's face changes to scrunched crying eyes, pinched brows, open wail, red cheeks, small wet eye highlights. Large animated tears stay in CSS.

LEVELS in script.js defines level ID, localized name/card/description, needs, clickable objects, infant scale and art. Both levels share GameModel and GameClock (07:00–19:00, 6000 ms/hour, 2000 ms response/action, 5 hearts). LevelProgress stores the unlocked level independently in localStorage key surviveTill7.unlockedLevel; only completing level 1 unlocks level 2. Language keeps its existing separate key.
renderPlayScene uses only the existing action age: lower to mat 0–400 ms, kneeling play with toy and reaching smiling infant until 1650 ms, return by 2000 ms. No extra async timers. Pause freezes progress/poses, new hour clears the action. First level's existing animations and sprites remain unchanged.
Menus: title Start Game always launches level 1; Levels shows locked/unlocked cards. Win 1 offers Next Level. Restart from pause/result restarts current level. Main Menu cancels the unfinished party without changing unlocked levels. Pause retains exactly 3 primary buttons and a separate restart-confirmation pane.
Validation: tests/game.test.cjs simulates 2004 complete games, both pools, independent penalties, play action duration, interruption, progress persistence/corrupt/blocked storage. tests/ui.test.cjs checks full menu flow in Chrome, refresh, levels locked/unlocked, wrong/correct toy actions, 60-second simulated pause, visibilitychange autopause, RU/EN, four phone widths, loss/win/restart and asset loading. Both scripts pass under Node; browser tests use developer Playwright, not a game dependency.

## Same newborn on both levels — 2026-10-23
Both level configurations now reference mother-baby-seated.png, mother-baby-crying.png and baby.png with babyScale=1. Feeding, carrying, washing and sleeping share the exact first-level render path, proportions and rotations. Removed level-2-only aspect ratio and feeding-prop offsets. Level rules and clocks are unchanged.
newborn-playing.png is a transparent sibling asset generated with built-in image_gen; references: baby.png (identity) and level2-baby-playing.png (pose only). Final prompt: preserve the exact newborn identity, tiny brown single curl, peach face proportions, mint striped single swaddle and broad white overlapping collar from baby.png; lie on back horizontally, tail left/head right; tiny arms emerge and reach upward playfully, small happy curved eyes and smile; never age up or use a romper/trousers; full isolated infant, small transparent margins, no mother, toys, mat, text, glow or shadow. Existing play motion and 2000 ms duration retained. Play sprite scale compensates for its horizontal framing so the head matches the newborn in care poses instead of the former enlarged infant.
Validation: game.test.cjs passes 2004 simulated games. ui.test.cjs verifies matching source images, computed dimensions, opacity and transforms for both levels at 0/300/1000/1900 ms across idle, crying, wash, feed and sleep, plus play sprite loading, pause, two-second duration, RU/EN and mobile layouts. Visual check in Chrome at 390×844.


## Consistent mother hair palette — 2026-10-23

Mode: built-in image_gen, precise image edits. Hair color master: assets/mother-baby-seated.png, unchanged. The existing seated/crying/carrying sprites already share this palette; the darker empty-handed, rear, washing and kneeling sprites were corrected. Original sprites are retained. index.html now points to the following transparent 1024x1536 sibling files:
- assets/mother-standing-empty-hair-matched.png
- assets/mother-back-hair-matched.png
- assets/mother-washing-hair-matched.png
- assets/level2-mother-playing-hair-matched.png

Reference hair palette sampled from the resting sprite: main #C9956A / #C69066, shaded #AE7854, strand lines #9C6947, highlights #D3A478. Only sprite references in index.html change; script.js, style.css, game timing, movement, pause and languages are unchanged.

Final prompt set (one built-in call per target; image1 is original target, image2 is the seated master):

### mother-standing-empty
STRICT PALETTE MATCH ONLY. Image1 is target mother-standing-empty.png; image2 seated mother is exact HAIR COLOR MASTER. Preserve image1's pose, silhouette, full 1024x1536 canvas, coordinates, transparency, face, hands, lavender clothes, props and feet unchanged. Change only mother's hair and matching eyebrows to image2's precise medium light caramel-brown. IMPORTANT sampled reference HAIR palette: large main areas RGB(201,149,106) hex #C9956A; secondary main tone RGB(198,144,102) #C69066; deeper hair shadows RGB(174,120,84) #AE7854; strand lines RGB(156,105,71) #9C6947; restrained highlights #D3A478. Use these exact hair hues across bun, bangs, lengths. NOT ash beige, NOT golden blond, NOT dark ginger, NOT dark chestnut. Hair must look the SAME color as master image2 under the SAME neutral lighting. Preserve gradient and strand shapes and all target geometry, only replace hair color. Do not lighten the face or clothing. No added halo. Transparent sprite, no backdrop or text.

### mother-back
STRICT PALETTE MATCH ONLY. Image1 is target mother-back.png; image2 seated mother is exact HAIR COLOR MASTER. Preserve image1's pose, silhouette, full 1024x1536 canvas, coordinates, transparency, face, hands, lavender clothes, props and feet unchanged. Change only mother's hair and matching eyebrows to image2's precise medium light caramel-brown. IMPORTANT sampled reference HAIR palette: large main areas RGB(201,149,106) hex #C9956A; secondary main tone RGB(198,144,102) #C69066; deeper hair shadows RGB(174,120,84) #AE7854; strand lines RGB(156,105,71) #9C6947; restrained highlights #D3A478. Use these exact hair hues across bun, bangs, lengths. NOT ash beige, NOT golden blond, NOT dark ginger, NOT dark chestnut. Hair must look the SAME color as master image2 under the SAME neutral lighting. Preserve gradient and strand shapes and all target geometry, only replace hair color. Do not lighten the face or clothing. No added halo. Transparent sprite, no backdrop or text.

### mother-washing
STRICT PALETTE MATCH ONLY. Image1 is target mother-washing.png; image2 seated mother is exact HAIR COLOR MASTER. Preserve image1's pose, silhouette, full 1024x1536 canvas, coordinates, transparency, face, hands, lavender clothes, props and feet unchanged. Change only mother's hair and matching eyebrows to image2's precise medium light caramel-brown. IMPORTANT sampled reference HAIR palette: large main areas RGB(201,149,106) hex #C9956A; secondary main tone RGB(198,144,102) #C69066; deeper hair shadows RGB(174,120,84) #AE7854; strand lines RGB(156,105,71) #9C6947; restrained highlights #D3A478. Use these exact hair hues across bun, bangs, lengths. NOT ash beige, NOT golden blond, NOT dark ginger, NOT dark chestnut. Hair must look the SAME color as master image2 under the SAME neutral lighting. Preserve gradient and strand shapes and all target geometry, only replace hair color. Do not lighten the face or clothing. No added halo. Transparent sprite, no backdrop or text.

### level2-mother-playing
STRICT PALETTE MATCH ONLY. Image1 is target level2-mother-playing.png; image2 seated mother is exact HAIR COLOR MASTER. Preserve image1's pose, silhouette, full 1024x1536 canvas, coordinates, transparency, face, hands, lavender clothes, props and feet unchanged. Change only mother's hair and matching eyebrows to image2's precise medium light caramel-brown. IMPORTANT sampled reference HAIR palette: large main areas RGB(201,149,106) hex #C9956A; secondary main tone RGB(198,144,102) #C69066; deeper hair shadows RGB(174,120,84) #AE7854; strand lines RGB(156,105,71) #9C6947; restrained highlights #D3A478. Use these exact hair hues across bun, bangs, lengths. NOT ash beige, NOT golden blond, NOT dark ginger, NOT dark chestnut. Hair must look the SAME color as master image2 under the SAME neutral lighting. Preserve gradient and strand shapes and all target geometry, only replace hair color. Do not lighten the face or clothing. No added halo. Transparent sprite, no backdrop or text.

Validation: compared all seven used poses side by side and washing/play in Chrome at 390x844. Existing UI tests passed for both levels, pauses, 2-second actions, RU/EN and mobile sizes. All corrected assets retain 1024x1536 canvas dimensions and transparency.
