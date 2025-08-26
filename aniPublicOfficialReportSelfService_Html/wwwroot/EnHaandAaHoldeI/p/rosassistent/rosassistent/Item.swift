//
//  Item.swift
//  rosassistent
//
//  Created by Gorm Braarvig on 26/08/2025.
//

import Foundation
import SwiftData

@Model
final class Item {
    var timestamp: Date
    
    init(timestamp: Date) {
        self.timestamp = timestamp
    }
}
