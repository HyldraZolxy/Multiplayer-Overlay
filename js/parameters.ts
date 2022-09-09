import { Globals } from "./globals.js";
import { Leaderboard } from "./leaderboard.js";

export class Parameters {

    ///////////////
    // @INSTANCE //
    ///////////////
    private static _instance: Parameters;

    /////////////////////
    // @CLASS VARIABLE //
    /////////////////////
    private _leaderboard: Leaderboard;

    //////////////////////
    // PUBLIC VARIABLES //
    //////////////////////
    public _uriParams: Globals.I_uriParamsAllowed = {
        debug: false,
        tournamentMode: false,

        ip: "localhost",

        pRenNum: 5,
        pos: "top-left",
        sk: "default",
        sc: 1
    };

    constructor() {
        this._leaderboard = Leaderboard.Instance;

        this.findParameters(new URLSearchParams(Globals.URI_NAV_SEARCH));
        this.giveParametersToClass();
    }

    ///////////////////////
    // PRIVATE FUNCTIONS //
    ///////////////////////
    private findParameters(uri_search: URLSearchParams): void {
        for (const [key, value] of uri_search.entries()) {
            if (decodeURI(key) in this._uriParams)
                if (this.parseParameters(decodeURI(key), decodeURI(value))) {
                    this._uriParams[decodeURI(key)] = ["pRenNum", "sc"].includes(decodeURI(key)) ? +(decodeURI(value))
                        : ["debug", "tournamentMode"].includes(decodeURI(key)) ? true
                            : decodeURI(value);
                }
        }
    }

    private giveParametersToClass(): void {
        this._leaderboard.leaderboardData.position = this._uriParams.pos;
        this._leaderboard.leaderboardData.skin = this._uriParams.sk;
        this._leaderboard.leaderboardData.scale = this._uriParams.sc;
        this._leaderboard.leaderboardData.playerRenderNumber = this._uriParams.pRenNum;
        this._leaderboard.leaderboardData.tournamentMode = this._uriParams.tournamentMode;
    }

    /////////////////////
    // PUBLIC FUNCTION //
    /////////////////////
    public parseParameters(key: string, value: string): boolean {
        switch(key) {
            case "debug":
            case "tournamentMode":
                if (value === "true")
                    return true;
                return false;

            case "ip":
                if (RegExp(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/).test(value) || value === "localhost")
                    return true;
                return false;

            case "pRenNum":
                if (RegExp(/\b([1-9]|1[0-9]|2[0-9]|30)\b/).test(value))
                    return true;
                return false;

            case "pos":
                if (Globals.DISPLAY_POSITION.includes(value))
                    return true;
                return false;

            case "sk":
                if (Globals.SKIN_AVAILABLE[Globals.E_MODULES.LEADERBOARD].hasOwnProperty(value))
                    return true;
                return false;

            case "sc":
                if (RegExp(/^[+-]?\d+(\.\d+)?$/).test(value))
                    return true;
                return false;

            default: return false;
        }
    }

    /////////////
    // GETTERS //
    /////////////
    public static get Instance(): Parameters {
        return this._instance || (this._instance = new this());
    }
}