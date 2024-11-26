# AutoPiP Safari Extension

A Safari extension that automatically enables Picture-in-Picture (PiP) mode for videos when switching tabs and disables it when returning to the video tab.

> **Note**: This is my first coding project using Swift and Xcode. As a beginner, I welcome any help, suggestions, or contributions to improve the code and functionality!

## Features

- **Automatic PiP**: Automatically enables Picture-in-Picture mode when switching away from a tab with a playing video
- **Smart Detection**: Only activates PiP for actively playing videos
- **Auto Disable**: Automatically disables PiP when returning to the video tab
- **Wide Compatibility**: See [Compatibility Status](#compatibility-status) for more information

- **Status Indication**: Visual feedback of extension status through toolbar icon (coming soon)

## Installation

- Currently you have to clone this repo and build the app using xcode yourself.
- In the future I might add a build script to make this easier and publish the extension via the App Store.

## Compatibility Status

| Platform | Notes |
|----------|--------|
| YouTube | ✅ |
| Twitch | ✅ |
| Amazon Prime Video | ❌ |
| Netflix | ⁉️ |
| MAX | ⁉️ |
| Disney+ | ⁉️ |
| Apple TV+ | ⁉️ |


### 📝 Notes on Compatibility

- All HTML5 video players should theoretically work
- Some streaming services may require additional authentication or have DRM restrictions
- Compatibility may vary depending on Safari and macOS versions

> This compatibility list will be updated as more platforms are tested. Please report your experiences with other video platforms through issues on GitHub.


## Usage

- The extension works automatically when enabled
- PiP will activate automatically when:
  - A video is actively playing including audio
  - You switch to another tab/app
- PiP will deactivate automatically when:
  - You return to the video tab

## Requirements

- macOS 14 or later
- Safari 16 or later

## Development

This extension is built using:
- Swift
- JavaScript
- Safari Web Extension API

## Current Limitations

- Only tested on macOS 15.1
- Toggle functionality via toolbar icon is still under development
- Code might need optimization (beginner project)

## To-Do

- [ ] Implement toolbar icon toggle functionality
- [ ] Test with other video platforms
- [ ] Test on different macOS versions
- [ ] Add visual status indication
- [ ] Code optimization and cleanup
- [ ] Improve documentation
- [ ] Publish the app via the App Store

## Contributing

As this is my first Swift/Xcode project, I'm particularly open to:
- Code reviews and suggestions
- Best practices advice
- Feature improvements
- Bug reports and fixes
- Documentation improvements

All contributions are welcome! Feel free to submit issues and pull requests.

## License

This project is licensed under the GNU GPLv3 License - see the LICENSE file for details.

## Acknowledgments

- Inspired by various PiP extensions
- Built with Safari Web Extension technology
- Thanks to the Swift and Safari development community for resources and documentation
- Updater using [Sparkle](https://sparkle-project.org)

## Author

vordenken
