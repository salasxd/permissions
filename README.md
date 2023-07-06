
# Permissions

a rank system for bedrock

Commands:
* /rank user rank - add a rank to a player
* /reloadcmd - reloads the list of commands with their permissions



# Ranks
to add more ranks edit the file ranks.json

## Usage/Examples

```json
{
    "rank": "User", //Name Rank
    "showRank": false, //show range
    "positionRank": 0, //where to display the range, 0 = under the nametag 1= in the nametag
    "joinedServer": { //
        "show": true, //show welcome text
        "sound": {
            "enabled": false,
            "name": "" //sound name
        }
    },
    "leftServer": {
        "show": true, //show welcome text
        "sound": {
            "enabled": false,
            "name": "" //sound name
        }
    },
    "colorRank": "§a", //rank color
    "colorChat": "§f", //chat color
    "levelPermissions": 1, //1 = CommandPermissionLevel.Normal, 2 = CommandPermissionLevel.Operator & 3 = CommandPermissionLevel.Admin
    "permissions": {
        "build": true,
        "mine": true,
        "doorAndSwitches": true,
        "openContainers": true,
        "attackPlayers": true,
        "attackMobs": true,
        "operatorCommands": false,
        "teleport": false,
        "invulnerable": false,
        "muted": false
    }
}
```

# Commands
to add more commands edit the file commands.json

## Usage/Examples

```json
{
    "command": "kick",
    "rank": ["Mod","Admin"]
},
{
    "command": "me",
    "rank": ["All"]
},
{
    "command": "deop",
    "rank": ["Host"]
},
{
    "command": "listd",
    "rank": ["Automation"]
}
```
default ranges
* All
* Host
* Automation

