# Published lesson covers

[Download today’s JPEG cover](lesson-01.jpg) · [Lossless PNG](lesson-01.png)

Lesson 01: **Requirements first**.

- Module 01: Design thinking and sizing.
- Video 1 of 5 in the module; lesson 01 of 60 overall.
- Both images are 1080 × 1920, with content inside the central crop area.

This cover is provided for a manual update to the [published reel](https://www.instagram.com/reel/Deg0xpADNM-/). Instagram rejected updating its cover through the media API.

Future thumbnails are generated on demand by each scheduled production job. This folder is not an input to the schedule, and future thumbnails are not pre-generated. The thumbnail generator and publishing integration were merged in PR #3.

To regenerate only this cover from the repository root:

```sh
python3 -m automation.thumbnail --lesson lesson-01
```

The generator writes review files into `out/thumbnails/`; these committed copies are a download for the already published lesson.
