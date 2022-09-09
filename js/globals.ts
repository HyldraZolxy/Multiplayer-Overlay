export namespace Globals {

    /////////////////////
    // GLOBAL VARIABLE //
    /////////////////////
    export enum E_MODULES {
        LEADERBOARD = "leaderboard",
        SETUP = "setup"
    }

    export const URI_NAV_SEARCH = window.location.search;
    export const MS_TIMER = 100;

    ////////////////////////////////
    // PARAMETERS GLOBAL VARIABLE //
    ////////////////////////////////
    export interface I_uriParamsAllowed {
        [key: string]: boolean|string|number;

        debug: boolean;             // Set to true to debug the Leaderboard
        tournamentMode: boolean;    // Set to true to tournament mode

        ip: string;                 // Local IP or External IP

        pRenNum: number;            // Number of players displayed on the screen
        pos: string;                // Position of the leaderboard
        sk: string;                 // Skin of the leaderboard
        sc: number;                 // Scale of the leaderboard
    }

    //////////////////////////////
    // TEMPLATE GLOBAL VARIABLE //
    //////////////////////////////
    export interface I_skinAvailable {
        leaderboard: {
            [key: string]: string[];

            default: string[];
        };
        setup: {
            [key: string]: string[];

            default: string[];
        }
    }

    export const DISPLAY_POSITION = [
        "top-left",
        "top-right",
        "bottom-left",
        "bottom-right"
    ];
    export const SKIN_AVAILABLE: I_skinAvailable = {
        leaderboard:  {
            default: ["./skins/leaderboard/default/", "index.html", "style.css"],
            tournamentDuo: ["./skins/leaderboard/tournamentDuo/", "index.html", "style.css"]
        },
        setup: {
            default: ["./skins/setup/default/", "index.html", "general.html", "leaderboard.html", "style.css"]
        }
    }
    export const DIFFERENCE_MULTIPLIER = 5;

    ////////////////////////
    // UI GLOBAL VARIABLE //
    ////////////////////////
    export const FPS_REFRESH = 1000 / 10;

    /////////////////////////////////
    // LEADERBOARD GLOBAL VARIABLE //
    /////////////////////////////////
    export interface I_leaderboard {
        display: boolean;               // Is leaderboard displayed?

        position: string;               // Position of leaderboard
        skin: string;                   // Skin of the leaderboard
        scale: number;                  // Scale of the leaderboard
        playerRenderNumber: number;     // Number of row rendered on the leaderboard

        playerLocalId: string;          // Local player ID (ScoreSaber)
        playerLocalLUID: number;        // Local player UID
        playerLocalName: string;        // Local player name
        playerLocalPosition: number;    // Local player position in the leaderboard

        roomState: string;              // State of the room
        tournamentMode: boolean;        // Is leaderbord in Tournament mode?
    }
    export interface I_LeaderboardMap {
        UserID: string;                 // Player ID (ScoreSaber)
        UserName: string;               // Player name
        UserAvatar: string;             // Player avatar (ScoreSaber link)

        Position: number;               // Player position in the leaderboard
        Score: number;                  // Player score
        Accuracy: number;               // Player accuracy
        Combo: number;                  // Player combo
        MissCount: number;              // Player miss count

        Joined: boolean;                // Is player just joined?
        Leaved: boolean;                // Is player just left?
        Failed: boolean;                // Is player failed?
        Deleted: boolean;               // Is player quit the map?
        Missed: boolean;                // Is player just miss a note ?
        Spectating : boolean;           // Is player spectating?
    }

    /////////////////////////////
    // PLUGINS GLOBAL VARIABLE //
    /////////////////////////////
    export enum E_WEBSOCKET_STATES {
        CONNECTED,
        DISCONNECTED,
        ERROR
    }
    export enum E_PLUGINS {
        BSPLUS = "bsPlus"
    }

    export interface I_pluginsConnection {
        bsPlus: {
            port: number;
            entry: string;
        };
    }

    export const TIMEOUT_MS = 4500;
    export const TIME_BEFORE_RETRY = 10000;
    export const RETRY_NUMBER = 2;
    export const PLUGINS_CONNECTIONS: I_pluginsConnection = {
        bsPlus: {
            port: 2948,
            entry: "/socket"
        }
    }

    /////////////////////
    // BSPLUS VARIABLE //
    /////////////////////
    export interface I_bsPlusObject {
        GameVersion: string;                                                                                                // Version of Beat Saber
        ProtocolVersion: number;                                                                                            // Protocol version of the plugin
        LocalUserName: string;                                                                                              // Player name
        LocalUserID: string;                                                                                                // Player platform ID (ScoreSaber ID here)

        _type: "handshake" | "event";                                                                                       // Type of the message
        _event: "RoomJoined" | "RoomLeaved" | "RoomState" | "PlayerJoined" | "PlayerLeaved" | "PlayerUpdated" | "Score";    // Event of the message

        RoomState: "None" | "SelectingSong" | "WarmingUp" | "Playing" | "Results";                                          // State of the room

        PlayerJoined: {
            LUID: number;                                                                                                   // Player UID
            UserID: string;                                                                                                 // Player ID (Platform ID [ScoreSaber])
            UserName: string;                                                                                               // Player name
            Spectating: boolean;                                                                                            // is Player spectating?
        }

        PlayerLeaved: {
            LUID: number;                                                                                                   // Player UID
        }

        PlayerUpdated: {
            LUID: number;                                                                                                   // Player UID
            Spectating: boolean;                                                                                            // is Player spectating?
        }

        Score: {
            LUID: number;                                                                                                   // Player UID
            Score: number;                                                                                                  // Player score
            Accuracy: number;                                                                                               // Player accuracy
            Combo: number;                                                                                                  // Player combo
            MissCount: number;                                                                                              // Player miss count
            Failed: boolean;                                                                                                // is player failed the song ?
            Deleted: boolean;                                                                                               // is player quit the song ?
        }
    }

    ///////////////////////////
    // SETUP GLOBAL VARIABLE //
    ///////////////////////////
    export enum E_SETUP_FILES {
        INDEX = 1,
        GENERAL = 2,
        LEADERBOARD = 3
    }
}