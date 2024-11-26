//
//  AppDelegate.swift
//  AutoPiP
//
//  Created by vordenken on 18.11.24.
//

import Cocoa

@main
class AppDelegate: NSObject, NSApplicationDelegate {
    
    private let updateController = UpdateController()
    
    func applicationDidFinishLaunching(_ notification: Notification) {
        // Override point for customization after application launch.
        
        // Erstelle Update-Menü
        let mainMenu = NSMenu()
        let appMenuItem = NSMenuItem()
        let appMenu = NSMenu()
        let checkForUpdatesItem = NSMenuItem(
            title: "Nach Updates suchen...",
            action: #selector(checkForUpdates(_:)),
            keyEquivalent: ""
        )
        
        mainMenu.addItem(appMenuItem)
        appMenuItem.submenu = appMenu
        appMenu.addItem(checkForUpdatesItem)
        
        NSApplication.shared.mainMenu = mainMenu
    }

    func applicationShouldTerminateAfterLastWindowClosed(_ sender: NSApplication) -> Bool {
        return true
    }
    
    @objc func checkForUpdates(_ sender: Any?) {
        updateController.checkForUpdates()
    }
}
