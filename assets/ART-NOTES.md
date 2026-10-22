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
