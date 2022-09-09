import { Globals } from "./globals.js";
import { Template } from "./template.js";

export class Leaderboard {
    ///////////////
    // @INSTANCE //
    ///////////////
    private static _instance: Leaderboard;

    /////////////////////
    // @CLASS VARIABLE //
    /////////////////////
    private _template: Template;

    /////////////////////
    // PUBLIC VARIABLE //
    /////////////////////
    public leaderboardData: Globals.I_leaderboard = {
        display: true,

        position: "top-left",
        skin: "default",
        scale: 1.0,
        playerRenderNumber: 5,

        playerLocalId: "0",
        playerLocalLUID: 0,
        playerLocalName: "Player",
        playerLocalPosition: 1,

        roomState: "None",
        tournamentMode: false
    };
    public leaderboard = new Map();

    constructor() {
        this._template = new Template();
    }

    //////////////////////
    // PRIVATE FUNCTION //
    //////////////////////
    private fcMiss(key: number, missCount: number): string {
        if (missCount === 0) {
            this._template.addClass(key, "fcClass");
            return " FC";
        } else {
            this._template.addClass(key,"missClass");
            return " " + missCount;
        }
    }

    private formatAccuracy(accuracy: number, failed: boolean): string {
        let multiplier = 100;

        if (failed && !this.leaderboardData.tournamentMode)
            multiplier *= 2;

        return (accuracy * multiplier).toFixed(1);
    }

    private sortLeaderboardByPositions() {
        let rankPosition = 1;
        const leaderboardSorted = new Map([...this.leaderboard].sort((a, b) => this.getSortAccuracy(b[1]) - this.getSortAccuracy(a[1])));

        leaderboardSorted.forEach( (value: Globals.I_LeaderboardMap, key: number) => {
            if (value.Accuracy === 0 && leaderboardSorted.get(key).Score === 0 || value.Accuracy === 1 && leaderboardSorted.get(key).Score  === 0) {
                this.leaderboard.get(key)["Position"] = 0;
                return;
            }

            this.leaderboard.get(key)["Position"] = rankPosition;

            rankPosition++;
        });

        return new Map([...leaderboardSorted].sort((a, b) => this.getSortPosition(a[1]) - this.getSortPosition(b[1])));
    }

    private getSortAccuracy(playerData: Globals.I_LeaderboardMap) {
        return (playerData.Accuracy + 0.01) * (playerData.Deleted ? 0.001 : 1);
    }

    private getSortPosition(playerData: Globals.I_LeaderboardMap) {
        return (playerData.Position + 1) * ((playerData.Position === 0)
            ? (playerData.UserID === this.leaderboardData.playerLocalId)
                ? 998
                : 999
            : 1);
    }

    /////////////////////
    // PUBLIC FUNCTION //
    /////////////////////
    public async loadSkin(skinName: string): Promise<void> {
        if (skinName !== undefined)
            await this._template.loadSkin(Globals.E_MODULES.LEADERBOARD, skinName);
    }

    public refreshLeaderboard() {
        this._template.moduleScale(this.leaderboardData.position, this.leaderboardData.scale);
        this._template.moduleCorners(this.leaderboardData.position);

        this._template.rowSort(
            this.sortLeaderboardByPositions(),
            this.leaderboardData.position,
            this.leaderboardData.tournamentMode,
            this.leaderboardData.playerLocalLUID,
            this.leaderboardData.playerRenderNumber
        );

        this.leaderboard.forEach((value: Globals.I_LeaderboardMap, key) => {
            if (value.Joined) {
                this._template.createRow(key, value, this.leaderboardData.playerLocalLUID);

                setTimeout(() => {
                    if (this.leaderboard.get(key) !== undefined)
                        this.leaderboard.get(key)["Joined"] = false;
                }, 500);
            }

            if (value.Leaved)
                this._template.deleteRow(key);

            if (value.Missed) {
                this._template.addClass(key, "miss");

                setTimeout(() => {
                    if (this.leaderboard.get(key) !== undefined)
                        this.leaderboard.get(key)["Missed"] = false;
                }, 500);
            }

            if ($("#leaderboard").find("#row-" + key).length) {
                $("#row-" + key).find(".position").text(value.Position);
                $("#row-" + key).find(".innerAvatar").css("background-image", "url('" + value.UserAvatar + "')");
                $("#row-" + key).find(".pseudo").text(value.UserName);
                $("#row-" + key).find(".score").text(value.Score);
                $("#row-" + key).find(".percentage").text(this.formatAccuracy(value.Accuracy, value.Failed));
                $("#row-" + key).find(".fcMiss").text(this.fcMiss(key, value.MissCount));
            }

            if (!this.leaderboardData.tournamentMode) {
                this._template.addClass(key, "position", value.Position);
            } else {
                this._template.addClass(key, "position", 99);
            }
        });
    }

    /////////////
    // GETTERS //
    /////////////
    public static get Instance(): Leaderboard {
        return this._instance || (this._instance = new this());
    }
}