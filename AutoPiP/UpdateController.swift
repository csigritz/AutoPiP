//Created by vordenken on 26.11.24
//UpdateController.swift

import Sparkle

class UpdateController {
    private let updaterController: SPUStandardUpdaterController
    
    init() {
        // Initialisiere den Updater
        updaterController = SPUStandardUpdaterController(
            startingUpdater: true,
            updaterDelegate: nil,
            userDriverDelegate: nil
        )
    }
    
    func checkForUpdates() {
        updaterController.checkForUpdates(nil)
    }
}
