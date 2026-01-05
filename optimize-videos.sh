#!/bin/bash

# Script to optimize videos for web use
# Uses ffmpeg to convert videos to H.264 with web-optimized settings

set -euo pipefail

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "Video Optimization Script"
echo "========================="
echo ""

# Check if ffmpeg is installed
if ! command -v ffmpeg &> /dev/null; then
    echo "Error: ffmpeg is not installed. Please install ffmpeg first."
    exit 1
fi

# Find all video files
videos=$(find videos/ -type f \( -name "*.mp4" -o -name "*.mov" -o -name "*.avi" -o -name "*.webm" -o -name "*.mkv" \))

if [ -z "$videos" ]; then
    echo "No video files found in videos/ directory"
    exit 0
fi

# Count total videos
total=$(echo "$videos" | wc -l | tr -d ' ')
current=0

echo "Found $total video(s) to optimize"
echo ""

# Process each video
while IFS= read -r input_file; do
    current=$((current + 1))

    # Create temporary output filename
    dir=$(dirname "$input_file")
    filename=$(basename "$input_file")
    name="${filename%.*}"
    temp_output="$dir/${name}-optimized-temp.mp4"

    echo -e "${YELLOW}[$current/$total]${NC} Processing: $input_file"

    # Get video resolution to determine if we need to downscale
    resolution=$(ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=p=0 "$input_file" 2>/dev/null || echo "0,0")
    width=$(echo "$resolution" | cut -d',' -f1)
    height=$(echo "$resolution" | cut -d',' -f2)

    # Check if video is 4K or higher and needs downscaling
    scale_filter=""
    if [ "$width" -gt 2000 ] || [ "$height" -gt 2000 ]; then
        if [ "$width" -gt "$height" ]; then
            # Landscape orientation
            scale_filter="-vf scale=1920:1080"
        else
            # Portrait orientation
            scale_filter="-vf scale=1080:1920"
        fi
        echo "  Downscaling from ${width}x${height}"
    fi

    # Optimize the video
    if ffmpeg -i "$input_file" \
        $scale_filter \
        -c:v libx264 \
        -preset slow \
        -crf 23 \
        -movflags +faststart \
        -c:a aac -b:a 128k \
        "$temp_output" \
        -y \
        -loglevel error -stats; then

        # Get file sizes
        original_size=$(ls -lh "$input_file" | awk '{print $5}')
        new_size=$(ls -lh "$temp_output" | awk '{print $5}')

        # Replace original with optimized version
        mv "$temp_output" "$input_file"

        echo -e "  ${GREEN}✓${NC} Done: $original_size → $new_size"
    else
        echo "  ✗ Failed to optimize $input_file"
        # Clean up temp file if it exists
        [ -f "$temp_output" ] && rm "$temp_output"
    fi

    echo ""
done < <(echo "$videos")

echo -e "${GREEN}Optimization complete!${NC}"
