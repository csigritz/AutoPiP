<p align="center">
  <a href="#">
    <img height="128" width="128" src="https://raw.github.com/vordenken/AutoPiP/main/AutoPiP/Assets.xcassets/AppIcon.appiconset/icon_512x512%402x.png">
  </a>
  <h1 align="center">AutoPiP for Safari</h1>
</p>

![GitHub Downloads (all assets, all releases)](https://img.shields.io/github/downloads/vordenken/AutoPiP/total) ![GitHub License](https://img.shields.io/github/license/vordenken/AutoPiP)

A Safari extension that automatically enables Picture-in-Picture (PiP) mode for videos when switching tabs and disables it when returning to the video tab.

> **Note**: This is my first coding project using Swift and Xcode. As a beginner, I welcome any help, suggestions, or contributions to improve the code and functionality

## Features

- **Automatic PiP**: Automatically enables Picture-in-Picture mode when switching away from a tab with a playing video
- **Smart Detection**: Only activates PiP for actively playing videos
- **Auto Disable**: Automatically disables PiP when returning to the video tab
- **Wide Compatibility**: See [Compatibility Status](#compatibility-status) for more information

## Installation

- Download the latest release [here](https://github.com/vordenken/AutoPiP/releases)

## Compatibility Status

| Platform | Notes |
|----------|--------|
| YouTube | ✅ |
| Twitch | ✅ |
| Amazon Prime Video | ❌ |
| Netflix | ⁉️ |
| MAX | ⁉️ |
| Disney+ | ✅ |
| Apple TV+ | ❌* |

*AppleTV opens the app instead of launching in Safari.

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

## Support the Project

If you find this extension helpful, consider supporting its development:

[!["Buy Me A Coffee"](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://www.buymeacoffee.com/vordenken)

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/vordenken)

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
- Code might need optimization (beginner project)

## To-Do

- [X] Implement toolbar icon toggle functionality
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

## Privacy

AutoPiP respects your privacy and does not collect any personal data. For more information, see our [Privacy Policy](PRIVACY.md).

## Acknowledgments

- Inspired by various PiP extensions
- Built with Safari Web Extension technology
- Thanks to the Swift and Safari development community for resources and documentation
- Updater using [Sparkle](https://sparkle-project.org)
- Icons by [icons8](https://icons8.com)

## Author

vordenken
