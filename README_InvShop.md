# Enhanced Inventory Shop and Clear-Lag Management System

## Overview

This enhanced invshop.js system provides comprehensive management for Minecraft Bedrock Edition servers, integrating shop functionality, clear-lag system, illegal items management, and protection zones with hostile mob suppression.

## Features

### 1. Illegal Items Management
- **Admin Configuration**: Configurable list of illegal items via commands menu
- **Automatic Removal**: Periodically removes illegal items from non-admin player inventories
- **Dimension Filtering**: Optional conditions based on player dimension
- **Real-time Updates**: Add/remove item IDs through intuitive UI

### 2. Clear-Lag Integration
- **Configurable Intervals**: Set clear interval in seconds (30-1800s)
- **Entity Categories**: Choose which entity types to clear (items, projectiles, monsters, animals, XP orbs)
- **Immunity System**: Entities with configurable tags are protected from clearing
- **Countdown Alerts**: Displays warnings at 30 and 10 seconds before clearing
- **Statistics Display**: Shows total entities/items removed after execution
- **Manual Triggering**: Admins can trigger immediate clear-lag

### 3. Enhanced Shop System
- **Quantity Selection**: Buyers can select quantity via slider (default 1, max configurable)
- **Multiple Item Types**: Support for both items and command execution
- **Appropriate Pricing**: Automatic calculation of total cost based on quantity
- **Emerald Currency**: Uses emeralds as default currency
- **Admin Management**: Add/remove shop items, configure settings

### 4. Protection Zones Enhancement
- **Hostile Mob Suppression**: Automatic despawning of hostile mobs within claims
- **Per-Zone Toggle**: Enable/disable mob suppression for each protection zone individually
- **Zone Management**: Create, configure, and remove protection zones
- **Real-time Control**: Toggle mob suppression through protection actions menu

## Usage

### Commands
- `!invshop` or `!shop` - Opens the main commands menu

### Admin Access
Players with the `admin` tag have access to:
- Illegal items configuration
- Clear-lag settings
- Shop management
- Protection zone administration

### Shop Usage
1. Access shop through main menu
2. Select item to purchase
3. Use slider to choose quantity
4. Confirm purchase (emeralds will be deducted)
5. Items are automatically added to inventory

### Configuration Management
All settings are managed through intuitive UI forms:
- No need to edit configuration files manually
- Real-time updates without server restart
- Persistent settings across server sessions

## Technical Details

### Entity Categories
- **Items**: Dropped items in world
- **Projectiles**: Arrows, snowballs, etc.
- **Monsters**: Hostile mobs (zombies, skeletons, etc.)
- **Animals**: Passive mobs (cows, pigs, etc.)
- **XP Orbs**: Experience orbs

### Protection Zone Structure
```javascript
{
    name: "Zone Name",
    minX, maxX, minY, maxY, minZ, maxZ, // Boundaries
    hostileMobSuppression: boolean,
    owner: "player_name"
}
```

### Illegal Items Configuration
```javascript
{
    id: "minecraft:item_id",
    dimension: 0-3 // 0=all, 1=overworld, 2=nether, 3=end
}
```

## Integration

The system integrates seamlessly with existing Minecraft Bedrock Edition servers:
- Uses standard UI components and textures
- Maintains existing functionality
- Non-breaking changes to current systems
- Follows Minecraft scripting best practices

## Maintenance

- **Memory Efficient**: Automatic cleanup of timers and resources
- **Error Handling**: Graceful handling of player interactions
- **Modular Design**: Easy to extend and modify individual features
- **Performance Optimized**: Minimal impact on server performance

## Future Enhancements

The modular design allows for easy extension:
- Additional payment methods
- More complex protection zone shapes
- Advanced scheduling for clear-lag
- Integration with other server systems