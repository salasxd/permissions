"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const event_1 = require("bdsx/event");
const utils_1 = require("./utils");
const player_1 = require("bdsx/bds/player");
const command_1 = require("bdsx/bds/command");
const abilities_1 = require("bdsx/bds/abilities");
const launcher_1 = require("bdsx/launcher");
const packetids_1 = require("bdsx/bds/packetids");
const packets_1 = require("bdsx/bds/packets");
const common_1 = require("bdsx/common");
const command_2 = require("bdsx/command");
var PositionRank;
(function (PositionRank) {
    PositionRank[PositionRank["score"] = 0] = "score";
    PositionRank[PositionRank["name"] = 1] = "name";
})(PositionRank || (PositionRank = {}));
var ColorText;
(function (ColorText) {
    ColorText["amethyst"] = "\u00A7u";
    ColorText["lapis"] = "\u00A7t";
    ColorText["diamond"] = "\u00A7s";
    ColorText["emerald"] = "\u00A7q";
    ColorText["gold"] = "\u00A7p";
    ColorText["copper"] = "\u00A7n";
    ColorText["redstone"] = "\u00A7m";
    ColorText["netherite"] = "\u00A7j";
    ColorText["iron"] = "\u00A7i";
    ColorText["quartz"] = "\u00A7h";
    ColorText["minecoin"] = "\u00A7g";
    ColorText["yellow"] = "\u00A7e";
    ColorText["red"] = "\u00A7c";
    ColorText["aqua"] = "\u00A7b";
    ColorText["green"] = "\u00A7a";
    ColorText["blue"] = "\u00A79";
    ColorText["orange"] = "\u00A76";
    ColorText["white"] = "\u00A7f";
})(ColorText || (ColorText = {}));
const defaultUser = {
    rank: "User"
};
const defaultRank = {
    rank: "User",
    showRank: false,
    positionRank: PositionRank.score,
    joinedServer: {
        show: true,
        sound: {
            enabled: false,
            name: ""
        }
    },
    leftServer: {
        show: true,
        sound: {
            enabled: false,
            name: ""
        }
    },
    colorRank: ColorText.green,
    colorChat: ColorText.white,
    levelPermissions: 1,
    permissions: {
        build: true,
        mine: true,
        doorAndSwitches: true,
        openContainers: true,
        attackPlayers: true,
        attackMobs: true,
        operatorCommands: false,
        teleport: false,
        exposedAbilityCount: false,
        invulnerable: false,
        flying: false,
        mayFly: false,
        instaBuild: false,
        lightning: false,
        flySpeed: 0.049999237060546875,
        walkSpeed: 0.09999847412109375,
        muted: false,
        worldBuilder: false,
        noClip: false,
        abilityCount: 0
    }
};
(0, utils_1.Folder)(utils_1.FolderType.plugin, ``, `users`);
const Ranks = (0, utils_1.StringToMap)((0, utils_1.LoadFile)(utils_1.FolderType.plugin, "", "ranks"), "rank");
const Commands = (0, utils_1.StringToMap)((0, utils_1.LoadFile)(utils_1.FolderType.plugin, "", "commands"), "command");
let firstReload = false;
if (!Ranks.has("User")) {
    (0, utils_1.Print)(`Default Rank`, utils_1.TypePrint.debug);
    Ranks.set("User", defaultRank);
    (0, utils_1.SaveFile)(utils_1.FolderType.plugin, "", "ranks", (0, utils_1.MapToString)(Ranks));
}
function ReloadPermissionsPlayer(player) {
    const data = (0, utils_1.Json)((0, utils_1.LoadFile)(utils_1.FolderType.plugin, "users/", player.getXuid()));
    if (!data.rank) {
        (0, utils_1.SaveFile)(utils_1.FolderType.plugin, "users/", player.getXuid(), (0, utils_1.Json)(defaultUser));
        data.rank = defaultRank.rank;
    }
    if (data.rank) {
        if (!Ranks.has(data.rank))
            data.rank = "User";
        const rank = Ranks.get(data.rank);
        switch (rank.levelPermissions) {
            default:
            case 1:
                player.getAbilities().setPlayerPermissions(player_1.PlayerPermission.CUSTOM);
                player.setPermissions(command_1.CommandPermissionLevel.Normal);
                break;
            case 2:
                player.getAbilities().setPlayerPermissions(player_1.PlayerPermission.CUSTOM);
                player.setPermissions(command_1.CommandPermissionLevel.Operator);
                break;
            case 3:
                player.getAbilities().setPlayerPermissions(player_1.PlayerPermission.OPERATOR);
                player.setPermissions(command_1.CommandPermissionLevel.Admin);
                break;
        }
        (0, utils_1.Print)(`Level ${rank.levelPermissions}`, utils_1.TypePrint.debug);
        player.getAbilities().setAbility(abilities_1.AbilitiesIndex.Build, rank.permissions.build);
        player.getAbilities().setAbility(abilities_1.AbilitiesIndex.Mine, rank.permissions.mine);
        player.getAbilities().setAbility(abilities_1.AbilitiesIndex.DoorsAndSwitches, rank.permissions.doorAndSwitches);
        player.getAbilities().setAbility(abilities_1.AbilitiesIndex.OpenContainers, rank.permissions.openContainers);
        player.getAbilities().setAbility(abilities_1.AbilitiesIndex.AttackPlayers, rank.permissions.attackPlayers);
        player.getAbilities().setAbility(abilities_1.AbilitiesIndex.AttackMobs, rank.permissions.attackMobs);
        player.getAbilities().setAbility(abilities_1.AbilitiesIndex.Teleport, rank.permissions.teleport);
        //player.getAbilities().setAbility(AbilitiesIndex.ExposedAbilityCount,rank.permissions.exposedAbilityCount);
        player.getAbilities().setAbility(abilities_1.AbilitiesIndex.Invulnerable, rank.permissions.invulnerable);
        //player.getAbilities().setAbility(AbilitiesIndex.Flying,rank.permissions.flying);
        //player.getAbilities().setAbility(AbilitiesIndex.MayFly,rank.permissions.mayFly);
        //player.getAbilities().setAbility(AbilitiesIndex.Instabuild,rank.permissions.instaBuild);
        //player.getAbilities().setAbility(AbilitiesIndex.Lightning,rank.permissions.lightning);
        //player.getAbilities().setAbility(AbilitiesIndex.FlySpeed,rank.permissions.flySpeed);
        //player.getAbilities().setAbility(AbilitiesIndex.WalkSpeed,rank.permissions.walkSpeed);
        player.getAbilities().setAbility(abilities_1.AbilitiesIndex.Muted, rank.permissions.muted);
        //player.getAbilities().setAbility(AbilitiesIndex.WorldBuilder,rank.permissions.worldBuilder);
        //player.getAbilities().setAbility(AbilitiesIndex.NoClip,rank.permissions.noClip);
        //player.getAbilities().setAbility(AbilitiesIndex.AbilityCount,rank.permissions.abilityCount);
        player.getAbilities().setAbility(abilities_1.AbilitiesIndex.OperatorCommands, rank.permissions.operatorCommands);
        player.syncAbilities();
        if (rank.showRank) {
            switch (rank.positionRank) {
                case PositionRank.score:
                    player.setScoreTag(`${rank.colorRank}${rank.rank}§r`);
                    break;
                case PositionRank.name:
                    player.setNameTag(`${rank.colorRank}${rank.rank}§r ${player.getName()}`);
                    break;
            }
        }
    }
}
command_2.command.register('rank', 'Change a player rank', command_1.CommandPermissionLevel.Operator).overload((param, origin, output) => {
    if (param.players) {
        const players = [];
        for (const player of param.players.newResults(origin, player_1.Player)) {
            const data = (0, utils_1.Json)((0, utils_1.LoadFile)(utils_1.FolderType.plugin, "users/", player.getXuid()));
            if (Ranks.has(param.rank)) {
                data.rank = param.rank;
                (0, utils_1.SaveFile)(utils_1.FolderType.plugin, "users/", player.getXuid(), (0, utils_1.Json)(data));
                launcher_1.bedrockServer.serverInstance.disconnectClient(player.getNetworkIdentifier(), `Your rank has been changed`);
                players.push(player.getName());
            }
            else {
                output.error(`${param.rank} rank not found in list of available ranks`);
                return;
            }
        }
        output.success(`Added rank ${param.rank} to player ${players.join(",")}`);
    }
}, {
    players: command_1.PlayerCommandSelector,
    rank: command_2.command.enum("ranks", Array.from(Ranks.keys()))
});
function sendAllPlaySound(sound, volume = 100, pitch = 1) {
    for (const player of launcher_1.bedrockServer.level.getPlayers()) {
        player.playSound(sound, player.getPosition(), volume, pitch);
    }
}
function sendAllMessage(message) {
    for (const player of launcher_1.bedrockServer.level.getPlayers()) {
        player.sendMessage(message);
    }
}
function getXuid(username) {
    for (const player of launcher_1.bedrockServer.level.getPlayers()) {
        if (username == player.getName()) {
            return player.getXuid();
        }
    }
    return "";
}
event_1.events.packetBefore(packetids_1.MinecraftPacketIds.Text).on((pkt, net) => {
    switch (pkt.type) {
        case packets_1.TextPacket.Types.Chat:
            const data = (0, utils_1.Json)((0, utils_1.LoadFile)(utils_1.FolderType.plugin, "users/", getXuid(pkt.name)));
            if (data.rank) {
                const rank = Ranks.get(data.rank);
                if (rank.showRank)
                    sendAllMessage(`[${rank.colorRank}${rank.rank}§r] <${pkt.name}> ${rank.colorChat}${pkt.message}§r`);
                else
                    sendAllMessage(`<${pkt.name}> ${rank.colorChat}${pkt.message}§r`);
            }
            return common_1.CANCEL;
    }
});
event_1.events.packetSend(packetids_1.MinecraftPacketIds.Text).on((pkt, net) => {
    switch (pkt.type) {
        case packets_1.TextPacket.Types.Translate: {
            switch (pkt.message) {
                case "§e%multiplayer.player.joined": {
                    const namePlayer = pkt.params.get(0);
                    const data = (0, utils_1.Json)((0, utils_1.LoadFile)(utils_1.FolderType.plugin, "users/", getXuid(namePlayer)));
                    if (data.rank) {
                        const rank = Ranks.get(data.rank);
                        if (rank.joinedServer.show) {
                            pkt.params.set(0, `${rank.colorRank}${rank.rank}§r ${namePlayer}`);
                            if (rank.joinedServer.sound.enabled)
                                sendAllPlaySound(rank.joinedServer.sound.name);
                        }
                        else
                            return common_1.CANCEL;
                    }
                    break;
                }
                case "§e%multiplayer.player.left": {
                    const namePlayer = pkt.params.get(0);
                    const data = (0, utils_1.Json)((0, utils_1.LoadFile)(utils_1.FolderType.plugin, "users/", getXuid(namePlayer)));
                    if (data.rank) {
                        const rank = Ranks.get(data.rank);
                        if (rank.leftServer.show) {
                            pkt.params.set(0, `${rank.colorRank}${rank.rank}§r ${namePlayer}`);
                            if (rank.leftServer.sound.enabled)
                                sendAllPlaySound(rank.leftServer.sound.name);
                        }
                        else
                            return common_1.CANCEL;
                    }
                    break;
                }
            }
            break;
        }
    }
});
function ReloadCommands() {
    for (const cmd of launcher_1.bedrockServer.commandRegistry.signatures.values()) {
        const data = Commands.get(cmd.command);
        let isOk = true;
        if (data) {
            for (const ranks of data.rank) {
                if (ranks == "All") {
                    command_2.command.find(data.command).signature.permissionLevel = command_1.CommandPermissionLevel.Normal;
                    break;
                }
                else if (ranks == "Host") {
                    command_2.command.find(data.command).signature.permissionLevel = command_1.CommandPermissionLevel.Host;
                    break;
                }
                else if (ranks == "Automation") {
                    command_2.command.find(data.command).signature.permissionLevel = command_1.CommandPermissionLevel.Automation;
                    break;
                }
                else {
                    const rank = Ranks.get(ranks);
                    if (rank) {
                        switch (rank.levelPermissions) {
                            default:
                            case 1:
                                command_2.command.find(data.command).signature.permissionLevel = command_1.CommandPermissionLevel.Normal;
                                break;
                            case 2:
                                command_2.command.find(data.command).signature.permissionLevel = command_1.CommandPermissionLevel.Operator;
                                break;
                            case 3:
                                command_2.command.find(data.command).signature.permissionLevel = command_1.CommandPermissionLevel.Admin;
                                break;
                        }
                    }
                    else {
                        command_2.command.find(data.command).signature.permissionLevel = command_1.CommandPermissionLevel.Host;
                        isOk = false;
                    }
                    break;
                }
            }
        }
        else {
            command_2.command.find(cmd.command).signature.permissionLevel = command_1.CommandPermissionLevel.Host;
            isOk = false;
        }
        if (isOk)
            (0, utils_1.Print)(`${cmd.command} command was registered`, utils_1.TypePrint.debug);
        else
            (0, utils_1.Print)(`${cmd.command} command was not registered`, utils_1.TypePrint.error);
    }
}
command_2.command.register('reloadcmd', 'Reload commads', command_1.CommandPermissionLevel.Operator).overload((param, origin, output) => {
    ReloadCommands();
    output.success(`Command list reloaded`);
}, {});
event_1.events.command.on((cmd, origin, ctx) => {
    if (ctx.origin.isServerCommandOrigin())
        return;
    const _cmd = Commands.get(cmd.split(" ")[0].replace("/", ""));
    const data = (0, utils_1.Json)((0, utils_1.LoadFile)(utils_1.FolderType.plugin, "users/", getXuid(ctx.origin.getEntity().getNetworkIdentifier().getActor().getName())));
    const rank = Ranks.get(data.rank);
    if (_cmd && rank) {
        if (`/${_cmd.command}` == cmd.split(" ")[0]) {
            for (const ranks of _cmd.rank) {
                if (ranks == "All" || ranks == "Host" || ranks == "Automation" || rank.rank == ranks) {
                    return;
                }
            }
        }
    }
    ctx.origin.getEntity().getNetworkIdentifier().getActor().sendTranslatedMessage("§ccommands.generic.unknown", [cmd]);
    return 0;
});
event_1.events.playerJoin.on(ev => {
    if (!ev.isSimulated) {
        if (!firstReload) {
            firstReload = true;
            ReloadCommands();
        }
        (0, utils_1.Print)(`Reload Permissions ${ev.player.getName()}`, utils_1.TypePrint.debug);
        ReloadPermissionsPlayer(ev.player);
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGVybWlzc2lvbnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJwZXJtaXNzaW9ucy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHNDQUFvQztBQUNwQyxtQ0FBbUg7QUFDbkgsNENBQTJEO0FBQzNELDhDQUF3RztBQUN4RyxrREFBb0Q7QUFDcEQsNENBQThDO0FBQzlDLGtEQUF3RDtBQUN4RCw4Q0FBOEM7QUFDOUMsd0NBQXFDO0FBQ3JDLDBDQUF1QztBQUd2QyxJQUFLLFlBR0o7QUFIRCxXQUFLLFlBQVk7SUFDYixpREFBSyxDQUFBO0lBQ0wsK0NBQUksQ0FBQTtBQUNSLENBQUMsRUFISSxZQUFZLEtBQVosWUFBWSxRQUdoQjtBQUVELElBQUssU0FtQko7QUFuQkQsV0FBSyxTQUFTO0lBQ1YsaUNBQWUsQ0FBQTtJQUNmLDhCQUFZLENBQUE7SUFDWixnQ0FBYyxDQUFBO0lBQ2QsZ0NBQWMsQ0FBQTtJQUNkLDZCQUFXLENBQUE7SUFDWCwrQkFBYSxDQUFBO0lBQ2IsaUNBQWUsQ0FBQTtJQUNmLGtDQUFnQixDQUFBO0lBQ2hCLDZCQUFXLENBQUE7SUFDWCwrQkFBYSxDQUFBO0lBQ2IsaUNBQWUsQ0FBQTtJQUNmLCtCQUFhLENBQUE7SUFDYiw0QkFBVSxDQUFBO0lBQ1YsNkJBQVcsQ0FBQTtJQUNYLDhCQUFZLENBQUE7SUFDWiw2QkFBVyxDQUFBO0lBQ1gsK0JBQWEsQ0FBQTtJQUNiLDhCQUFZLENBQUE7QUFDaEIsQ0FBQyxFQW5CSSxTQUFTLEtBQVQsU0FBUyxRQW1CYjtBQUVELE1BQU0sV0FBVyxHQUFHO0lBQ2hCLElBQUksRUFBRSxNQUFNO0NBQ2YsQ0FBQTtBQUVELE1BQU0sV0FBVyxHQUFJO0lBQ2pCLElBQUksRUFBRSxNQUFNO0lBQ1osUUFBUSxFQUFFLEtBQUs7SUFDZixZQUFZLEVBQUUsWUFBWSxDQUFDLEtBQUs7SUFDaEMsWUFBWSxFQUFFO1FBQ1YsSUFBSSxFQUFFLElBQUk7UUFDVixLQUFLLEVBQUU7WUFDSCxPQUFPLEVB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