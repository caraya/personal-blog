---
title: Responsive images with img elements
date: 2024-05-06
tags:
  - CSS
  - Design
  - Images
  - Layout
draft: true
---

```bash
#!/bin/env bash

INPUT=images/master/*.jpg
OUTPUT=images/
Q=75

mkdir -p $OUTPUT/{100,300,800}

for f in $INPUT
do
  echo "Processing: $f"
  fn_ext=$(basename "$f")
  fn="${fn_ext%.*}"
  convert $f -resize 100x100 -interlace Plane \
        -quality $Q $OUTPUT/100/$fn.jpg
  convert $f -resize 100x100 \
        -define webp:lossless=false \
        -quality $Q $OUTPUT/100/$fn.webp
  convert $f -resize 300x300 -interlace Plane \
        -quality $Q $OUTPUT/300/$fn.jpg
  convert $f -resize 300x300 \
        -define webp:lossless=false \
        -quality $Q $OUTPUT/300/$fn.webp
  convert $f -resize 800x800 -interlace Plane \
        -quality $Q $OUTPUT/800/$fn.jpg
  convert $f -resize 800x800 \
        -define webp:lossless=false \
        -quality $Q $OUTPUT/800/$fn.webp
  done
```
