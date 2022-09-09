import { Globals } from "./globals.js";
import { Leaderboard } from "./leaderboard.js";
import { Template } from "./template.js";

export class UI {
    //////////////////////
    // @CLASS VARIABLES //
    //////////////////////
    private _leaderboard: Leaderboard;
    private _template: Template;

    constructor() {
        this._leaderboard = Leaderboard.Instance;
        this._template = new Template();
    }

    /////////////////////
    // PUBLIC FUNCTION //
    /////////////////////
    public refreshUI(): void {
        setInterval(() => {
            this._leaderboard.refreshLeaderboard();
            this._template.moduleToggleDisplay(this._leaderboard.leaderboardData.display);
        }, Globals.FPS_REFRESH);
    }
}