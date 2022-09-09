import { Globals } from "./globals.js";
import { Leaderboard } from "./leaderboard.js";

export class BSPlus {
    ///////////////
    // @INSTANCE //
    ///////////////
    private static _instance: BSPlus;

    //////////////////////
    // @CLASS VARIABLES //
    //////////////////////
    private _leaderboard: Leaderboard;

    constructor() {
        this._leaderboard = Leaderboard.Instance;
    }

    //////////////////////
    // PRIVATE FUNCTION //
    //////////////////////
    private eHandshake(dataHandshake: Globals.I_bsPlusObject): void {
        console.log("%cBeat Saber " + dataHandshake.GameVersion + " | Protocol Version " + dataHandshake.ProtocolVersion, "background-color: green;");
        console.log("\n\n");

        this._leaderboard.leaderboardData.playerLocalId = dataHandshake.LocalUserID;
        this._leaderboard.leaderboardData.playerLocalName = dataHandshake.LocalUserName;
    }

    private eHandler(dataEvent: Globals.I_bsPlusObject) {
        switch (dataEvent._event) {
            case "RoomJoined":
                this._leaderboard.leaderboardData.display = true;
                break;

            case "RoomLeaved":
                this._leaderboard.leaderboardData.display = false;
                this._leaderboard.leaderboard.forEach((value: Globals.I_LeaderboardMap, key) => {
                    this._leaderboard.leaderboard.get(key)["Leaved"] = true;

                    setTimeout(() => {
                        this._leaderboard.leaderboard.delete(key);
                    }, 100);
                });
                break;

            case "RoomState":
                this._leaderboard.leaderboardData.roomState = dataEvent.RoomState;
                break;

            case "PlayerJoined":
            case "PlayerLeaved":
                this.playerInfo(dataEvent);
                break;

            case "PlayerUpdated":
            case "Score":
                this.playerUpdate(dataEvent);
                break;
        }
    }

    private playerInfo(dataEvent: Globals.I_bsPlusObject) {
        if (dataEvent.PlayerJoined !== undefined) {
            this._leaderboard.leaderboard.set(dataEvent.PlayerJoined.LUID, {
                UserID: dataEvent.PlayerJoined.UserID,
                UserName: dataEvent.PlayerJoined.UserName,
                UserAvatar: this.playerAvatar(dataEvent),

                Position: 0,
                Score: 0,
                Accuracy: 1,
                Combo: 0,
                MissCount: 0,

                Joined: true,
                Leaved: false,
                Failed: false,
                Deleted: false,
                Missed: false,
                Spectating: dataEvent.PlayerJoined.Spectating
            });

            if (dataEvent.PlayerJoined.UserName === this._leaderboard.leaderboardData.playerLocalName)
                this._leaderboard.leaderboardData.playerLocalLUID = dataEvent.PlayerJoined.LUID;
        }

        if (dataEvent.PlayerLeaved !== undefined) {
            this._leaderboard.leaderboard.get(dataEvent.PlayerLeaved.LUID)["Leaved"] = true;

            setTimeout(() => {
                this._leaderboard.leaderboard.delete(dataEvent.PlayerLeaved.LUID);
            }, 100);
        }
    }

    private playerUpdate(dataEvent: Globals.I_bsPlusObject) {
        let playerData = {};
        let playerLUID: number;

        if (dataEvent.Score !== undefined) {
            playerLUID = dataEvent.Score.LUID;
            playerData = dataEvent.Score;
        }

        if (dataEvent.PlayerUpdated !== undefined) {
            playerLUID = dataEvent.PlayerUpdated.LUID;
            playerData = dataEvent.PlayerUpdated;
        }

        Object.entries(playerData).forEach(entry => {
            let [key, value] = entry;

            if (key === "LUID")
                return;

            if (key === "MissCount" && this._leaderboard.leaderboard.get(playerLUID).MissCount !== value) {
                this._leaderboard.leaderboard.get(playerLUID)["Missed"] = true;
            }

            this._leaderboard.leaderboard.get(playerLUID)[key] = value;
        });
    }

    private playerAvatar(dataEvent: Globals.I_bsPlusObject) {
        if (dataEvent.PlayerJoined.UserID === null || dataEvent.PlayerJoined.UserID === "")
            return "https://cdn.scoresaber.com/avatars/oculus.png";

        return "https://cdn.scoresaber.com/avatars/" + dataEvent.PlayerJoined.UserID + ".jpg";
    }

    /////////////////////
    // PUBLIC FUNCTION //
    /////////////////////
    public dataParser(data: string): void {
        let dataParsed: Globals.I_bsPlusObject = JSON.parse(data);

        if (dataParsed._type === "handshake") {
            this.eHandshake(dataParsed);
        }

        if (dataParsed._type === "event") {
            this.eHandler(dataParsed);
        }
    }

    /////////////
    // GETTERS //
    /////////////
    public static get Instance(): BSPlus {
        return this._instance || (this._instance = new this());
    }
}