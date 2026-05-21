# Image Overlay

A Re:Earth Visualizer plugin that displays a user-configured image as a non-blocking overlay on the map. Image URL and optional caption are set from the widget's inspector.

## Features

- Image URL configurable from the inspector
- Optional caption shown under the image
- Top-left placement by default
- Graceful messages for empty / unloadable URLs (no broken-image icon)
- Does not block map interaction

## Usage

1. Install the plugin from a zip or this GitHub repository URL.
2. Add the **Image Overlay** widget from the widget panel.
3. In the inspector, set:
   - **Image URL** — image to display (image host must allow CORS)
   - **Caption text** *(optional)*

## Error states

| Situation | Message |
| --- | --- |
| Image URL is empty | `The image URL has not been set` |
| Image fails to load | `Image could not be loaded` |

## Files

```
image-overlay-plugin/
├── reearth.yml
├── image-overlay.js
└── README.md
```

## License

Apache-2.0
