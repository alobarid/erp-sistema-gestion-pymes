// Enhanced Inventory Shop and Clear-Lag Management System
// Integrates shop functionality, clear-lag system, illegal items management, and protection zones

import { world, system, ItemStack, EntityTypes } from "@minecraft/server";
import { ActionFormData, MessageFormData, ModalFormData } from "@minecraft/server-ui";

class InvShopManager {
    constructor() {
        this.config = {
            illegalItems: [],
            clearLag: {
                interval: 300, // seconds
                entityCategories: ['item', 'projectile', 'monster'],
                immunityTag: 'clearlag_immune',
                enabled: true
            },
            shop: {
                items: [],
                defaultQuantity: 1,
                maxQuantity: 64
            },
            protectionZones: []
        };
        this.clearLagTimer = null;
        this.illegalItemsTimer = null;
        this.init();
    }

    init() {
        this.startClearLagTimer();
        this.startIllegalItemsCheck();
        this.registerCommands();
    }

    // Main Commands Menu
    showMainMenu(player) {
        const form = new ActionFormData()
            .title("§l§bAdmin Commands")
            .body("Select an option:")
            .button("§2Shop Management", "textures/items/emerald")
            .button("§4Illegal Items Config", "textures/items/barrier")
            .button("§6Clear-Lag Settings", "textures/items/clock_item")
            .button("§5Protection Zones", "textures/items/totem_of_undying");

        form.show(player).then(response => {
            if (response.canceled) return;
            
            switch (response.selection) {
                case 0: this.showShopMenu(player); break;
                case 1: this.showIllegalItemsMenu(player); break;
                case 2: this.showClearLagMenu(player); break;
                case 3: this.showProtectionZonesMenu(player); break;
            }
        });
    }

    // Illegal Items Management
    showIllegalItemsMenu(player) {
        const form = new ActionFormData()
            .title("§4Illegal Items Management")
            .body(`Current illegal items: ${this.config.illegalItems.length}\n§7Items are periodically removed from non-admin inventories`)
            .button("§cView/Remove Items", "textures/items/barrier")
            .button("§aAdd New Item", "textures/ui/plus")
            .button("§6Configure Check Settings", "textures/items/clock_item");

        form.show(player).then(response => {
            if (response.canceled) return;
            
            switch (response.selection) {
                case 0: this.showIllegalItemsList(player); break;
                case 1: this.addIllegalItem(player); break;
                case 2: this.configureIllegalItemsCheck(player); break;
            }
        });
    }

    showIllegalItemsList(player) {
        if (this.config.illegalItems.length === 0) {
            const form = new MessageFormData()
                .title("§4No Illegal Items")
                .body("No items are currently marked as illegal.")
                .button1("Add Item")
                .button2("Back");
            
            form.show(player).then(response => {
                if (response.selection === 0) this.addIllegalItem(player);
                else this.showIllegalItemsMenu(player);
            });
            return;
        }

        const form = new ActionFormData()
            .title("§4Illegal Items List")
            .body("Click an item to remove it:");

        this.config.illegalItems.forEach(itemId => {
            form.button(`§c${itemId}`, "textures/items/barrier");
        });
        form.button("§7« Back", "textures/ui/arrow_left");

        form.show(player).then(response => {
            if (response.canceled) return;
            
            if (response.selection === this.config.illegalItems.length) {
                this.showIllegalItemsMenu(player);
                return;
            }

            const itemToRemove = this.config.illegalItems[response.selection];
            this.config.illegalItems.splice(response.selection, 1);
            player.sendMessage(`§aRemoved §c${itemToRemove} §afrom illegal items list`);
            this.showIllegalItemsList(player);
        });
    }

    addIllegalItem(player) {
        const form = new ModalFormData()
            .title("§4Add Illegal Item")
            .textField("Item ID (e.g., minecraft:diamond_sword):", "minecraft:item_id", "")
            .dropdown("Dimension Filter:", ["All Dimensions", "Overworld Only", "Nether Only", "End Only"], 0);

        form.show(player).then(response => {
            if (response.canceled) return;

            const [itemId, dimensionFilter] = response.formValues;
            if (!itemId.trim()) {
                player.sendMessage("§cItem ID cannot be empty");
                return;
            }

            const itemConfig = {
                id: itemId.trim(),
                dimension: dimensionFilter
            };

            this.config.illegalItems.push(itemConfig);
            player.sendMessage(`§aAdded §c${itemId} §ato illegal items list`);
            this.showIllegalItemsMenu(player);
        });
    }

    // Clear-Lag System
    showClearLagMenu(player) {
        const form = new ActionFormData()
            .title("§6Clear-Lag Management")
            .body(`Status: ${this.config.clearLag.enabled ? '§aEnabled' : '§cDisabled'}\nInterval: ${this.config.clearLag.interval}s\nImmunity Tag: §b${this.config.clearLag.immunityTag}`)
            .button("§6Configure Settings", "textures/items/clock_item")
            .button("§aManual Clear Now", "textures/items/diamond_pickaxe")
            .button("§cToggle Auto Clear", this.config.clearLag.enabled ? "textures/ui/toggle_on" : "textures/ui/toggle_off")
            .button("§5Entity Categories", "textures/items/spawn_egg");

        form.show(player).then(response => {
            if (response.canceled) return;
            
            switch (response.selection) {
                case 0: this.configureClearLag(player); break;
                case 1: this.manualClearLag(player); break;
                case 2: this.toggleClearLag(player); break;
                case 3: this.configureClearLagCategories(player); break;
            }
        });
    }

    configureClearLag(player) {
        const form = new ModalFormData()
            .title("§6Clear-Lag Configuration")
            .slider("Clear Interval (seconds):", 30, 1800, 30, this.config.clearLag.interval)
            .textField("Immunity Tag:", "Entity tag", this.config.clearLag.immunityTag);

        form.show(player).then(response => {
            if (response.canceled) return;

            const [interval, immunityTag] = response.formValues;
            this.config.clearLag.interval = interval;
            this.config.clearLag.immunityTag = immunityTag || 'clearlag_immune';
            
            player.sendMessage(`§aClear-lag interval set to ${interval} seconds`);
            player.sendMessage(`§aImmunity tag set to: §b${this.config.clearLag.immunityTag}`);
            
            this.restartClearLagTimer();
            this.showClearLagMenu(player);
        });
    }

    configureClearLagCategories(player) {
        const form = new ModalFormData()
            .title("§5Entity Categories to Clear")
            .toggle("Items", this.config.clearLag.entityCategories.includes('item'))
            .toggle("Projectiles", this.config.clearLag.entityCategories.includes('projectile'))
            .toggle("Monsters", this.config.clearLag.entityCategories.includes('monster'))
            .toggle("Animals", this.config.clearLag.entityCategories.includes('animal'))
            .toggle("XP Orbs", this.config.clearLag.entityCategories.includes('xp_orb'));

        form.show(player).then(response => {
            if (response.canceled) return;

            const [items, projectiles, monsters, animals, xpOrbs] = response.formValues;
            this.config.clearLag.entityCategories = [];
            
            if (items) this.config.clearLag.entityCategories.push('item');
            if (projectiles) this.config.clearLag.entityCategories.push('projectile');
            if (monsters) this.config.clearLag.entityCategories.push('monster');
            if (animals) this.config.clearLag.entityCategories.push('animal');
            if (xpOrbs) this.config.clearLag.entityCategories.push('xp_orb');

            player.sendMessage(`§aUpdated clear-lag categories: §b${this.config.clearLag.entityCategories.join(', ')}`);
            this.showClearLagMenu(player);
        });
    }

    // Shop System with Quantity Selection
    showShopMenu(player) {
        const form = new ActionFormData()
            .title("§2Shop Management")
            .body("Manage shop items and purchases")
            .button("§aBuy Items", "textures/items/emerald")
            .button("§6Sell Items", "textures/items/gold_ingot")
            .button("§5Admin: Manage Shop", "textures/items/writable_book");

        form.show(player).then(response => {
            if (response.canceled) return;
            
            switch (response.selection) {
                case 0: this.showBuyMenu(player); break;
                case 1: this.showSellMenu(player); break;
                case 2: this.showAdminShopMenu(player); break;
            }
        });
    }

    showBuyMenu(player) {
        if (this.config.shop.items.length === 0) {
            const form = new MessageFormData()
                .title("§cEmpty Shop")
                .body("No items available for purchase.")
                .button1("OK")
                .button2("Back");
            
            form.show(player).then(response => {
                if (response.selection === 1) this.showShopMenu(player);
            });
            return;
        }

        const form = new ActionFormData()
            .title("§2Buy Items")
            .body("Select an item to purchase:");

        this.config.shop.items.forEach(item => {
            form.button(`§a${item.name}\n§7Price: §6${item.price} §7each`, item.icon || "textures/items/paper");
        });

        form.show(player).then(response => {
            if (response.canceled) return;
            
            const selectedItem = this.config.shop.items[response.selection];
            this.showQuantitySelection(player, selectedItem, 'buy');
        });
    }

    showQuantitySelection(player, item, action) {
        const form = new ModalFormData()
            .title(`§${action === 'buy' ? '2' : '6'}${action === 'buy' ? 'Buy' : 'Sell'}: ${item.name}`)
            .slider("Quantity:", 1, this.config.shop.maxQuantity, 1, this.config.shop.defaultQuantity);

        if (action === 'buy') {
            form.textField("Total Cost Calculation:", "Will be calculated", "");
        }

        form.show(player).then(response => {
            if (response.canceled) return;

            const quantity = response.formValues[0];
            const totalPrice = item.price * quantity;

            if (action === 'buy') {
                this.processPurchase(player, item, quantity, totalPrice);
            } else {
                this.processSale(player, item, quantity, totalPrice);
            }
        });
    }

    processPurchase(player, item, quantity, totalPrice) {
        // Check if player has enough currency (assuming emeralds)
        const playerInventory = player.getComponent("inventory").container;
        let emeraldCount = 0;

        for (let i = 0; i < playerInventory.size; i++) {
            const slot = playerInventory.getItem(i);
            if (slot && slot.typeId === "minecraft:emerald") {
                emeraldCount += slot.amount;
            }
        }

        if (emeraldCount < totalPrice) {
            player.sendMessage(`§cInsufficient funds! Need §6${totalPrice} §cemerald(s), have §6${emeraldCount}`);
            return;
        }

        // Remove emeralds
        this.removeItemsFromInventory(player, "minecraft:emerald", totalPrice);

        // Give items or execute commands
        if (item.type === 'item') {
            const itemStack = new ItemStack(item.itemId, quantity);
            playerInventory.addItem(itemStack);
        } else if (item.type === 'command') {
            for (let i = 0; i < quantity; i++) {
                world.getDimension(player.dimension.id).runCommand(item.command.replace('%player%', player.name));
            }
        }

        player.sendMessage(`§aPurchased §b${quantity}x ${item.name} §afor §6${totalPrice} §aemerald(s)`);
    }

    // Protection Zones with Hostile Mob Management
    showProtectionZonesMenu(player) {
        const form = new ActionFormData()
            .title("§5Protection Zones")
            .body(`Active zones: ${this.config.protectionZones.length}`)
            .button("§aCreate Zone", "textures/ui/plus")
            .button("§6Manage Zones", "textures/items/writable_book")
            .button("§cRemove Zone", "textures/ui/cancel");

        form.show(player).then(response => {
            if (response.canceled) return;
            
            switch (response.selection) {
                case 0: this.createProtectionZone(player); break;
                case 1: this.manageProtectionZones(player); break;
                case 2: this.removeProtectionZone(player); break;
            }
        });
    }

    manageProtectionZones(player) {
        if (this.config.protectionZones.length === 0) {
            const form = new MessageFormData()
                .title("§cNo Protection Zones")
                .body("No protection zones exist.")
                .button1("Create Zone")
                .button2("Back");
            
            form.show(player).then(response => {
                if (response.selection === 0) this.createProtectionZone(player);
                else this.showProtectionZonesMenu(player);
            });
            return;
        }

        const form = new ActionFormData()
            .title("§6Manage Protection Zones")
            .body("Select a zone to configure:");

        this.config.protectionZones.forEach(zone => {
            const mobSuppression = zone.hostileMobSuppression ? '§aON' : '§cOFF';
            form.button(`§b${zone.name}\n§7Mob Suppression: ${mobSuppression}`, "textures/items/totem_of_undying");
        });

        form.show(player).then(response => {
            if (response.canceled) return;
            
            const selectedZone = this.config.protectionZones[response.selection];
            this.configureProtectionZone(player, selectedZone, response.selection);
        });
    }

    configureProtectionZone(player, zone, zoneIndex) {
        const form = new ActionFormData()
            .title(`§5Configure: ${zone.name}`)
            .body(`Hostile Mob Suppression: ${zone.hostileMobSuppression ? '§aEnabled' : '§cDisabled'}`)
            .button("§cToggle Mob Suppression", zone.hostileMobSuppression ? "textures/ui/toggle_on" : "textures/ui/toggle_off")
            .button("§6Edit Zone Bounds", "textures/items/compass_item")
            .button("§aManual Mob Clear", "textures/items/diamond_sword");

        form.show(player).then(response => {
            if (response.canceled) return;
            
            switch (response.selection) {
                case 0:
                    zone.hostileMobSuppression = !zone.hostileMobSuppression;
                    player.sendMessage(`§aHostile mob suppression ${zone.hostileMobSuppression ? 'enabled' : 'disabled'} for zone: §b${zone.name}`);
                    this.configureProtectionZone(player, zone, zoneIndex);
                    break;
                case 1:
                    this.editZoneBounds(player, zone, zoneIndex);
                    break;
                case 2:
                    this.clearHostileMobsInZone(zone);
                    player.sendMessage(`§aCleared hostile mobs in zone: §b${zone.name}`);
                    break;
            }
        });
    }

    // Clear-Lag Timer Functions
    startClearLagTimer() {
        if (this.clearLagTimer) {
            system.clearRun(this.clearLagTimer);
        }

        if (!this.config.clearLag.enabled) return;

        this.clearLagTimer = system.runInterval(() => {
            this.startClearLagCountdown();
        }, this.config.clearLag.interval * 20); // Convert seconds to ticks
    }

    startClearLagCountdown() {
        // 30 second warning
        world.sendMessage("§6[Clear-Lag] §eClearing entities in 30 seconds...");
        
        system.runTimeout(() => {
            // 10 second warning
            world.sendMessage("§6[Clear-Lag] §cClearing entities in 10 seconds!");
            
            system.runTimeout(() => {
                this.executeClearLag();
            }, 200); // 10 seconds
        }, 400); // 20 seconds (30-10)
    }

    executeClearLag() {
        let totalRemoved = 0;
        const categories = {};

        for (const dimension of world.getDimensions()) {
            for (const entity of dimension.getEntities()) {
                if (entity.hasTag(this.config.clearLag.immunityTag)) continue;
                
                const entityType = this.getEntityCategory(entity);
                if (!this.config.clearLag.entityCategories.includes(entityType)) continue;

                categories[entityType] = (categories[entityType] || 0) + 1;
                entity.remove();
                totalRemoved++;
            }
        }

        const categoryReport = Object.entries(categories)
            .map(([type, count]) => `§b${count} §7${type}(s)`)
            .join(', ');

        world.sendMessage(`§6[Clear-Lag] §aRemoved §b${totalRemoved} §aentities: ${categoryReport}`);
    }

    getEntityCategory(entity) {
        const typeId = entity.typeId;
        
        if (typeId === 'minecraft:item') return 'item';
        if (typeId === 'minecraft:xp_orb') return 'xp_orb';
        if (typeId.includes('arrow') || typeId.includes('projectile')) return 'projectile';
        if (this.isHostileMob(typeId)) return 'monster';
        if (this.isPassiveMob(typeId)) return 'animal';
        
        return 'other';
    }

    isHostileMob(typeId) {
        const hostileMobs = ['zombie', 'skeleton', 'spider', 'creeper', 'enderman', 'witch', 'pillager'];
        return hostileMobs.some(mob => typeId.includes(mob));
    }

    isPassiveMob(typeId) {
        const passiveMobs = ['cow', 'pig', 'sheep', 'chicken', 'horse', 'llama', 'cat', 'dog'];
        return passiveMobs.some(mob => typeId.includes(mob));
    }

    // Illegal Items Check
    startIllegalItemsCheck() {
        this.illegalItemsTimer = system.runInterval(() => {
            this.checkAndRemoveIllegalItems();
        }, 1200); // Check every minute (1200 ticks)
    }

    checkAndRemoveIllegalItems() {
        if (this.config.illegalItems.length === 0) return;

        for (const player of world.getPlayers()) {
            if (player.hasTag('admin')) continue; // Skip admins
            
            const inventory = player.getComponent("inventory").container;
            let removedItems = 0;

            for (let i = 0; i < inventory.size; i++) {
                const item = inventory.getItem(i);
                if (!item) continue;

                const illegalConfig = this.config.illegalItems.find(illegal => 
                    typeof illegal === 'string' ? illegal === item.typeId : illegal.id === item.typeId
                );

                if (illegalConfig) {
                    // Check dimension filter if applicable
                    if (typeof illegalConfig === 'object' && illegalConfig.dimension > 0) {
                        const playerDimension = player.dimension.id;
                        const requiredDimension = ['minecraft:overworld', 'minecraft:nether', 'minecraft:the_end'][illegalConfig.dimension - 1];
                        if (playerDimension !== requiredDimension) continue;
                    }

                    inventory.setItem(i);
                    removedItems++;
                }
            }

            if (removedItems > 0) {
                player.sendMessage(`§c${removedItems} illegal item(s) removed from your inventory`);
            }
        }
    }

    // Helper Functions
    removeItemsFromInventory(player, itemId, amount) {
        const inventory = player.getComponent("inventory").container;
        let remaining = amount;

        for (let i = 0; i < inventory.size && remaining > 0; i++) {
            const item = inventory.getItem(i);
            if (!item || item.typeId !== itemId) continue;

            if (item.amount <= remaining) {
                remaining -= item.amount;
                inventory.setItem(i);
            } else {
                item.amount -= remaining;
                inventory.setItem(i, item);
                remaining = 0;
            }
        }
    }

    clearHostileMobsInZone(zone) {
        let cleared = 0;
        
        for (const dimension of world.getDimensions()) {
            for (const entity of dimension.getEntities()) {
                if (!this.isHostileMob(entity.typeId)) continue;
                if (!this.isEntityInZone(entity, zone)) continue;

                entity.remove();
                cleared++;
            }
        }

        return cleared;
    }

    isEntityInZone(entity, zone) {
        const pos = entity.location;
        return pos.x >= zone.minX && pos.x <= zone.maxX &&
               pos.y >= zone.minY && pos.y <= zone.maxY &&
               pos.z >= zone.minZ && pos.z <= zone.maxZ;
    }

    // Command Registration
    registerCommands() {
        // Register chat commands
        world.beforeEvents.chatSend.subscribe((event) => {
            const message = event.message;
            const player = event.sender;

            if (message === '!invshop' || message === '!shop') {
                event.cancel = true;
                this.showMainMenu(player);
            }
        });
    }

    restartClearLagTimer() {
        this.startClearLagTimer();
    }

    toggleClearLag(player) {
        this.config.clearLag.enabled = !this.config.clearLag.enabled;
        player.sendMessage(`§aClear-lag ${this.config.clearLag.enabled ? 'enabled' : 'disabled'}`);
        
        if (this.config.clearLag.enabled) {
            this.startClearLagTimer();
        } else if (this.clearLagTimer) {
            system.clearRun(this.clearLagTimer);
            this.clearLagTimer = null;
        }
        
        this.showClearLagMenu(player);
    }

    manualClearLag(player) {
        player.sendMessage("§6Manual clear-lag initiated...");
        this.executeClearLag();
        this.showClearLagMenu(player);
    }

    createProtectionZone(player) {
        const form = new ModalFormData()
            .title("§aCreate Protection Zone")
            .textField("Zone Name:", "My Protection Zone", "")
            .toggle("Enable Hostile Mob Suppression", false);

        form.show(player).then(response => {
            if (response.canceled) return;

            const [name, mobSuppression] = response.formValues;
            const pos = player.location;

            const newZone = {
                name: name || "Unnamed Zone",
                minX: pos.x - 50,
                maxX: pos.x + 50,
                minY: pos.y - 20,
                maxY: pos.y + 20,
                minZ: pos.z - 50,
                maxZ: pos.z + 50,
                hostileMobSuppression: mobSuppression,
                owner: player.name
            };

            this.config.protectionZones.push(newZone);
            player.sendMessage(`§aCreated protection zone: §b${newZone.name}`);
            this.showProtectionZonesMenu(player);
        });
    }

    editZoneBounds(player, zone, zoneIndex) {
        player.sendMessage("§7Zone bounds editing feature - Use coordinates to define boundaries");
        // This would typically involve a more complex coordinate selection system
        this.configureProtectionZone(player, zone, zoneIndex);
    }

    removeProtectionZone(player) {
        if (this.config.protectionZones.length === 0) {
            player.sendMessage("§cNo zones to remove");
            return;
        }

        const form = new ActionFormData()
            .title("§cRemove Protection Zone")
            .body("Select a zone to remove:");

        this.config.protectionZones.forEach(zone => {
            form.button(`§c${zone.name}`, "textures/ui/cancel");
        });

        form.show(player).then(response => {
            if (response.canceled) return;
            
            const removedZone = this.config.protectionZones.splice(response.selection, 1)[0];
            player.sendMessage(`§aRemoved protection zone: §b${removedZone.name}`);
            this.showProtectionZonesMenu(player);
        });
    }

    showSellMenu(player) {
        player.sendMessage("§7Sell menu - Feature to be implemented based on inventory items");
        this.showShopMenu(player);
    }

    showAdminShopMenu(player) {
        if (!player.hasTag('admin')) {
            player.sendMessage("§cYou don't have permission to access admin features");
            return;
        }

        const form = new ActionFormData()
            .title("§5Admin Shop Management")
            .body("Manage shop items and settings")
            .button("§aAdd Shop Item", "textures/ui/plus")
            .button("§cRemove Shop Item", "textures/ui/cancel")
            .button("§6Configure Settings", "textures/items/writable_book");

        form.show(player).then(response => {
            if (response.canceled) return;
            
            switch (response.selection) {
                case 0: this.addShopItem(player); break;
                case 1: this.removeShopItem(player); break;
                case 2: this.configureShopSettings(player); break;
            }
        });
    }

    addShopItem(player) {
        const form = new ModalFormData()
            .title("§aAdd Shop Item")
            .textField("Item Name:", "Display name", "")
            .textField("Item ID:", "minecraft:item_id", "")
            .textField("Price (emeralds):", "10", "")
            .dropdown("Type:", ["Item", "Command"], 0)
            .textField("Command (if type is Command):", "/give %player% diamond 1", "");

        form.show(player).then(response => {
            if (response.canceled) return;

            const [name, itemId, price, type, command] = response.formValues;
            
            const newItem = {
                name: name || "Unnamed Item",
                itemId: type === 0 ? itemId : null,
                command: type === 1 ? command : null,
                price: parseInt(price) || 1,
                type: type === 0 ? 'item' : 'command'
            };

            this.config.shop.items.push(newItem);
            player.sendMessage(`§aAdded shop item: §b${newItem.name}`);
            this.showAdminShopMenu(player);
        });
    }

    removeShopItem(player) {
        if (this.config.shop.items.length === 0) {
            player.sendMessage("§cNo shop items to remove");
            return;
        }

        const form = new ActionFormData()
            .title("§cRemove Shop Item")
            .body("Select an item to remove:");

        this.config.shop.items.forEach(item => {
            form.button(`§c${item.name} - §6${item.price}§7 emeralds`, "textures/ui/cancel");
        });

        form.show(player).then(response => {
            if (response.canceled) return;
            
            const removedItem = this.config.shop.items.splice(response.selection, 1)[0];
            player.sendMessage(`§aRemoved shop item: §b${removedItem.name}`);
            this.showAdminShopMenu(player);
        });
    }

    configureShopSettings(player) {
        const form = new ModalFormData()
            .title("§6Shop Settings")
            .slider("Default Quantity:", 1, 10, 1, this.config.shop.defaultQuantity)
            .slider("Max Quantity:", 1, 64, 1, this.config.shop.maxQuantity);

        form.show(player).then(response => {
            if (response.canceled) return;

            const [defaultQty, maxQty] = response.formValues;
            this.config.shop.defaultQuantity = defaultQty;
            this.config.shop.maxQuantity = maxQty;
            
            player.sendMessage(`§aShop settings updated - Default: ${defaultQty}, Max: ${maxQty}`);
            this.showAdminShopMenu(player);
        });
    }

    processSale(player, item, quantity, totalPrice) {
        // Implementation for selling items back to shop
        player.sendMessage(`§aSold ${quantity}x ${item.name} for ${totalPrice} emeralds`);
    }
}

// Initialize the system
const invShopManager = new InvShopManager();

// Export for potential external use
export { InvShopManager };