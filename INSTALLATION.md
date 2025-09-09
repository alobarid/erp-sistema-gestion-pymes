# Installation Guide - Enhanced InvShop System

## Prerequisites

- Minecraft Bedrock Edition Server
- Behavior Pack with scripting enabled
- Server with admin privileges
- Basic understanding of Minecraft server management

## Installation Steps

### 1. File Setup

1. **Copy the main script file:**
   ```
   invshop.js → behavior_packs/your_pack/scripts/invshop.js
   ```

2. **Update your manifest.json:**
   ```json
   {
     "dependencies": [
       {
         "module_name": "@minecraft/server",
         "version": "1.0.0"
       },
       {
         "module_name": "@minecraft/server-ui", 
         "version": "1.0.0"
       }
     ]
   }
   ```

3. **Update your main.js (or create one):**
   ```javascript
   import './invshop.js';
   ```

### 2. Server Configuration

1. **Enable Scripting:**
   - Ensure behavior pack is applied to world
   - Verify scripting is enabled in world settings
   - Restart server if necessary

2. **Set Admin Permissions:**
   ```
   /tag @a[name="AdminName"] add admin
   ```

### 3. Initial Setup

1. **Test Basic Functionality:**
   - Join the server
   - Type `!invshop` or `!shop` in chat
   - Verify the main menu appears

2. **Configure Initial Settings:**
   - Access "Clear-Lag Settings" from main menu
   - Set desired interval (recommended: 300 seconds)
   - Choose entity categories to clear
   - Set immunity tag (default: `clearlag_immune`)

3. **Add Shop Items:**
   - Go to "Shop Management" → "Admin: Manage Shop"
   - Add initial items with prices
   - Test purchasing with different quantities

### 4. Feature Configuration

#### Illegal Items Management
1. Access "Illegal Items Config"
2. Add problematic items (e.g., bedrock, command blocks)
3. Set dimension filters if needed
4. System will automatically check every minute

#### Protection Zones
1. Go to "Protection Zones"
2. Create zones around important areas
3. Enable hostile mob suppression as needed
4. Test by spawning mobs in protected areas

#### Clear-Lag System
1. Configure entity categories to clear
2. Set appropriate intervals based on server load
3. Test manual clear-lag execution
4. Verify countdown notifications work

### 5. Testing Checklist

- [ ] Main menu opens with `!invshop` command
- [ ] Admin features accessible with admin tag
- [ ] Shop purchases work with quantity selection
- [ ] Clear-lag countdown and execution functions
- [ ] Illegal items are removed from non-admin inventories
- [ ] Protection zones suppress hostile mobs when enabled
- [ ] All UI forms display correctly with proper textures
- [ ] Timer systems function without errors

### 6. Troubleshooting

#### Common Issues:

**Script not loading:**
- Verify behavior pack is applied
- Check manifest.json dependencies
- Ensure main.js imports invshop.js

**UI not appearing:**
- Confirm player has necessary permissions
- Check console for JavaScript errors
- Verify @minecraft/server-ui is available

**Features not working:**
- Ensure admin tag is set correctly: `/tag @s add admin`
- Check server logs for error messages
- Verify world settings allow script execution

**Performance issues:**
- Increase clear-lag intervals
- Reduce number of entity categories being cleared
- Monitor server resource usage

### 7. Customization

#### Adding Custom Shop Items:
1. Use Admin Shop Management interface
2. Specify item type (Item or Command)
3. Set appropriate pricing
4. Test purchases thoroughly

#### Modifying Protection Zones:
1. Access Protection Zones menu
2. Create zones with appropriate boundaries
3. Configure mob suppression per zone
4. Test hostile mob behavior

#### Adjusting Clear-Lag:
1. Monitor server performance
2. Adjust intervals based on entity buildup
3. Configure immunity tags for important entities
4. Balance frequency with server stability

### 8. Maintenance

- **Regular Monitoring:** Check clear-lag statistics
- **Performance Review:** Monitor server resource usage
- **Configuration Updates:** Adjust settings based on player feedback
- **Backup Configurations:** Save working configurations before changes

### 9. Advanced Configuration

For advanced users, the system can be extended:

- **Custom Entity Categories:** Modify `getEntityCategory()` function
- **Additional Payment Methods:** Extend shop system for multiple currencies
- **Complex Protection Shapes:** Enhance zone boundary checking
- **Integration Hooks:** Add callbacks for other server systems

### 10. Support

If you encounter issues:

1. Check the test suite: `node test_invshop.js`
2. Review console logs for errors
3. Verify all dependencies are properly installed
4. Ensure server permissions are correctly configured

## File Structure

```
behavior_pack/
├── manifest.json
├── scripts/
│   ├── main.js
│   └── invshop.js
└── pack_icon.png
```

## Version Information

- **Version:** 1.0.0
- **Minecraft Bedrock:** 1.20+
- **Dependencies:** @minecraft/server, @minecraft/server-ui
- **Last Updated:** 2024

---

**Note:** This system maintains all existing functionality while adding the requested enhancements. All changes are non-breaking and preserve current server operations.