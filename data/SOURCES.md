# Sources — LBL 2025–26 seed (`lbl-2025-26.json`)

Fetched / used on 2026-09-08 (agent research). Every URL consulted is listed below.

## Primary pages (requested)

| URL | Status | What was used |
| --- | --- | --- |
| https://en.wikipedia.org/wiki/2025%E2%80%9326_Lebanese_Basketball_League | OK via `curl` (WebFetch timed out / later 404 on fetch provider) | Season dates, 12 teams + arenas/coaches/capacity, full regular-season standings + H2H score matrix, playoff bracket (QF/SF/Finals series lengths), war hiatus note, Flashscore citations |
| https://en.wikipedia.org/wiki/Lebanese_Basketball_League | OK via `curl` (WebFetch timed out) | League branding (Decathlon LBL), format, current champions (Al Riyadi 39th title), club/arena table for 2025–26 |
| https://www.asia-basket.com/Lebanon/Decathlon-Lebanese-Basketball-League_2025-2026.aspx | OK (WebFetch) | Champion, standings W–L, Game 7 box score, awards (MVP/POYs), roster/stat leaders, First/Second/Third teams |
| https://www.asia-basket.com/Lebanon/news/1016639/Riyadi-Wins-Game-7-Thriller-Claims-Lebanese-League-Title-Behind-Zeinouns-32 | OK (WebFetch) | Game 7 narrative; Karim Zeinoun Finals MVP (32 pts); Miletic double-double |
| https://www.asia-basket.com/Lebanon/Decathlon-Lebanese-Basketball-League-Standings.aspx | OK via `curl` | Detailed standings (PPG/OPPG, home/away splits); slight 4th–6th order difference vs Wikipedia |
| https://www.riyadi.com/calendar/fixtures-list/ | OK (WebFetch) | Dated finals scores (22 Jul–3 Aug 2026, series 4–3) and dated regular-season Al Riyadi LBL results used for sample games |
| https://lebanon.basketball/ | Page retrieved via `curl` (WebFetch timed out); not relied on for scores | Site is the league/federation portal referenced by Wikipedia; no structured 2025–26 standings/scores extracted for the seed |

## Arabic names

| URL | Status | What was used |
| --- | --- | --- |
| https://ar.wikipedia.org/wiki/%D8%A7%D9%84%D8%AF%D9%88%D8%B1%D9%8A_%D8%A7%D9%84%D9%84%D8%A8%D9%86%D8%A7%D9%86%D9%8A_%D9%84%D9%83%D8%B1%D8%A9_%D8%A7%D9%84%D8%B3%D9%84%D8%A9 | OK via `curl` | Arabic club names: الرياضي، الحكمة، هومنتمين، انترانيك، الشانفيل، فيرست بيروت، etc. |

Arabic names for Hoops (هوبس), Antonine (الأنطوني), Central (المركزي), Chabab Batroun (شباب البترون), NSA (أكاديمية نديم صعيّد), Tadamon Hrajel (تضامن حراجل) follow common Lebanese sports media usage consistent with the Arabic Wikipedia naming patterns above.

## Gaps / caveats

1. **Finals MVP conflict**: Game 7 article → Karim Zeinoun; Asia-Basket awards block → Dusan Miletic. Seed `finals.mvp` = Zeinoun; conflict documented in JSON.
2. **Standings 4–6 order**: Wikipedia/Flashscore: Antonine, Antranik, Central; Asia-Basket: Antranik, Antonine, Club Central. Seed follows Wikipedia.
3. **Non–Al Riyadi game dates**: Many H2H scores from the Wikipedia matrix have **no date** in fetched sources — those sample games previously used `"date": "unknown"`; PASS-2 replaced them with approximate mid-season ISO dates (`dateApproximate: true`) and UI still maps unknown/TBA safely to "Date TBA".
4. **lebanon.basketball**: Fetched but not used for numeric data (no reliable score tables extracted).
5. **Team colors**: Approximate brand colors for fan-app UI — not taken from an official palette document.
6. **Arena capacity / alternate venues**: Season page vs league page sometimes differ (e.g. Champville capacity, Batroun/Tadamon venues); both noted where relevant.
7. **Do not invent**: No fabricated scores; every score is from Wikipedia H2H, riyadi.com fixtures, or Asia-Basket Game 7 reporting.
