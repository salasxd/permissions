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
                            if (rank.showRank)
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
                            if (rank.showRank)
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
    const temp = (0, utils_1.StringToMap)((0, utils_1.LoadFile)(utils_1.FolderType.plugin, "", "commands"), "command");
    Commands.clear();
    for (const data of temp.values()) {
        Commands.set(data.command, data);
    }
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
function ReloadRanks() {
    const temp = (0, utils_1.StringToMap)((0, utils_1.LoadFile)(utils_1.FolderType.plugin, "", "ranks"), "rank");
    Ranks.clear();
    for (const data of temp.values()) {
        Ranks.set(data.rank, data);
    }
}
command_2.command.register('reloadcmd', 'Reload commads', command_1.CommandPermissionLevel.Operator).overload((param, origin, output) => {
    ReloadCommands();
    output.success(`Command list reloaded`);
}, {});
command_2.command.register('reloadranks', 'Reload ranks', command_1.CommandPermissionLevel.Operator).overload((param, origin, output) => {
    ReloadRanks();
    output.success(`Ranks list reloaded`);
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
    ctx.origin.getEntity().getNetworkIdentifier().getActor().sendTranslatedMessage("commands.generic.unknown", [cmd]);
    return 0;
});
event_1.events.playerJoin.on(ev => {
    if (!ev.isSimulated) {
        (0, utils_1.Print)(`Reload Permissions ${ev.player.getName()}`, utils_1.TypePrint.debug);
        ReloadPermissionsPlayer(ev.player);
    }
});
setTimeout(() => {
    launcher_1.bedrockServer.executeCommandOnConsole("reloadcmd");
}, 15 * 1000);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGVybWlzc2lvbnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJwZXJtaXNzaW9ucy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHNDQUFvQztBQUNwQyxtQ0FBbUg7QUFDbkgsNENBQTJEO0FBQzNELDhDQUF3RztBQUN4RyxrREFBb0Q7QUFDcEQsNENBQThDO0FBQzlDLGtEQUF3RDtBQUN4RCw4Q0FBOEM7QUFDOUMsd0NBQXFDO0FBQ3JDLDBDQUF1QztBQUl2QyxJQUFLLFlBR0o7QUFIRCxXQUFLLFlBQVk7SUFDYixpREFBSyxDQUFBO0lBQ0wsK0NBQUksQ0FBQTtBQUNSLENBQUMsRUFISSxZQUFZLEtBQVosWUFBWSxRQUdoQjtBQUVELElBQUssU0FtQko7QUFuQkQsV0FBSyxTQUFTO0lBQ1YsaUNBQWUsQ0FBQTtJQUNmLDhCQUFZLENBQUE7SUFDWixnQ0FBYyxDQUFBO0lBQ2QsZ0NBQWMsQ0FBQTtJQUNkLDZCQUFXLENBQUE7SUFDWCwrQkFBYSxDQUFBO0lBQ2IsaUNBQWUsQ0FBQTtJQUNmLGtDQUFnQixDQUFBO0lBQ2hCLDZCQUFXLENBQUE7SUFDWCwrQkFBYSxDQUFBO0lBQ2IsaUNBQWUsQ0FBQTtJQUNmLCtCQUFhLENBQUE7SUFDYiw0QkFBVSxDQUFBO0lBQ1YsNkJBQVcsQ0FBQTtJQUNYLDhCQUFZLENBQUE7SUFDWiw2QkFBVyxDQUFBO0lBQ1gsK0JBQWEsQ0FBQTtJQUNiLDhCQUFZLENBQUE7QUFDaEIsQ0FBQyxFQW5CSSxTQUFTLEtBQVQsU0FBUyxRQW1CYjtBQUVELE1BQU0sV0FBVyxHQUFHO0lBQ2hCLElBQUksRUFBRSxNQUFNO0NBQ2YsQ0FBQTtBQUVELE1BQU0sV0FBVyxHQUFJO0lBQ2pCLElBQUksRUFBRSxNQUFNO0lBQ1osUUFBUSxFQUFFLEtBQUs7SUFDZixZQUFZLEVBQUUsWUFBWSxDQUFDLEtBQUs7SUFDaEMsWUFBWSxFQUFFO1FBQ1YsSUFBSSxFQUFFLElBQUk7UUFDVixLQUFLLEVBQUU7WUFDSCxPQUFPLEVB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