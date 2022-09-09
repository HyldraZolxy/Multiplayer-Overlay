import { Globals } from "./globals.js";
import { Template } from "./template.js";
import { Parameters } from "./parameters.js";
import { Leaderboard } from "./leaderboard.js";
import { Plugins } from "./plugins.js";
import { Debug } from "./debug.js";

export class Setup {

    /////////////////////
    // @CLASS VARIABLE //
    /////////////////////
    private _template:  Template;
    private _parameters: Parameters;
    private _leaderboard: Leaderboard;
    private _plugins: Plugins;
    private _debug: Debug;

    //////////////////////
    // PRIVATE VARIABLE //
    //////////////////////
    private isDisplayed = false;
    private isLeaderboardChecked = false;

    constructor() {
        this._template = new Template();
        this._parameters = Parameters.Instance;
        this._leaderboard = Leaderboard.Instance;
        this._plugins = Plugins.Instance;
        this._debug = new Debug();

        $("#setupButton").on("click", async () => {
            if (!this.isDisplayed) {
                this.isDisplayed = true;

                this._template.setupHide(false);
                await this.loadSkin("default", Globals.SKIN_AVAILABLE.setup.default[Globals.E_SETUP_FILES.INDEX]);

                setTimeout(() => {
                    this.setupAction();
                }, Globals.MS_TIMER);
            }
        });
    }

    //////////////////////
    // PRIVATE FUNCTION //
    //////////////////////
    private async loadSkin(skinName: string, fileName: string): Promise<void> {
        if (skinName !== undefined && fileName !== undefined)
            await this._template.loadSkin(Globals.E_MODULES.SETUP, skinName, fileName);
    }

    private setupAction() {
        $(".closeButton").on("click",() => {
            if (this.isDisplayed) {
                this.isDisplayed = false;

                this._template.setupHide(true);
                $("#setup").empty();
                this._template.makeActive();

                setTimeout(() => {
                    this.setupAction();
                }, Globals.MS_TIMER);
            }
        });

        $(".generalSettings").on("click",async () => {
            if (this.isDisplayed) {
                if (!$(".generalSettings").hasClass("active")) {
                    this._template.makeActive($(".generalSettings"));
                    this._template.makeHidden(true);

                    setTimeout(async () => {
                        $("#setup").empty();
                        await this.loadSkin("default", Globals.SKIN_AVAILABLE.setup.default[Globals.E_SETUP_FILES.GENERAL]);
                        this._template.makeHidden(false);

                        setTimeout(() => {
                            this.setupAction();
                        }, Globals.MS_TIMER);
                    }, 300);
                }
            }
        });

        $(".leaderboardSettings").on("click",async () => {
            if (this.isDisplayed) {
                if (!$(".leaderboardSettings").hasClass("active")) {
                    this._template.makeActive($(".leaderboardSettings"));
                    this._template.makeHidden(true);

                    setTimeout(async () => {
                        $("#setup").empty();
                        await this.loadSkin("default", Globals.SKIN_AVAILABLE.setup.default[Globals.E_SETUP_FILES.LEADERBOARD]);
                        this._template.makeHidden(false);

                        setTimeout(() => {
                            this.setupAction();
                            $("#switchLeaderbordPreview").prop("checked", this.isLeaderboardChecked);
                        }, Globals.MS_TIMER);
                    }, 300);
                }
            }
        });

        $("#setupURL").on("click", async () => {
            await this.urlTextBuilder();
            let value = $("#Urldescription").data("clipboardtext");
            navigator.clipboard.writeText(value);
        });

        $("#ipChanger").on("click", () => {
            let ipValue = $("#ip").val();

            if ((ipValue !== undefined) && (typeof ipValue === "string")) {
                if (this._parameters.parseParameters("ip", ipValue)) {
                    this._parameters._uriParams.ip = ipValue;
                }
            }
        });

        $("#switchLeaderboardPreview").on("click", async () => {
            if ($("#switchLeaderboardPreview").prop("checked") === true) {
                await this._leaderboard.loadSkin(this._leaderboard.leaderboardData.skin);
                this.isLeaderboardChecked = true;
                this._debug.play();
            } else {
                this.isLeaderboardChecked = false;
                this._debug.stop();
            }
        });

        $("#leaderboardPosition").on("change", () => {
            let leaderboardPositionValue = $("#leaderboardPosition").val();

            if ((leaderboardPositionValue !== undefined) && (typeof leaderboardPositionValue === "string")) {
                if (this._parameters.parseParameters("pos", leaderboardPositionValue)) {
                    this._leaderboard.leaderboardData.position = leaderboardPositionValue;
                }
            }
        });

        $("#leaderboardPlayerRender").on("input", () => {
            let leaderboardRenderValue = $("#leaderboardPlayerRender").val();

            if ((leaderboardRenderValue !== undefined) && (typeof leaderboardRenderValue === "string")) {
                if (this._parameters.parseParameters("pRenNum", leaderboardRenderValue)) {
                    this._leaderboard.leaderboardData.playerRenderNumber = +(leaderboardRenderValue);
                    $(".playerRenderingNumber").text(leaderboardRenderValue);
                }
            }
        });

        $("#leaderboardScale").on("input", () => {
            let leaderboardScaleValue = $("#leaderboardScale").val();

            if ((leaderboardScaleValue !== undefined) && (typeof leaderboardScaleValue === "string")) {
                if (this._parameters.parseParameters("sc", leaderboardScaleValue)) {
                    this._leaderboard.leaderboardData.scale = +(leaderboardScaleValue);
                }
            }
        });

        $("#leaderboardSkin").on("change", async () => {
            let leaderboardSkinValue = $("#leaderboardSkin").val();

            if ((leaderboardSkinValue !== undefined) && (typeof leaderboardSkinValue === "string")) {
                if (this._parameters.parseParameters("sk", leaderboardSkinValue)) {
                    this._leaderboard.leaderboardData.skin = leaderboardSkinValue;

                    await this._leaderboard.loadSkin(this._leaderboard.leaderboardData.skin);
                }
            }
        });

        $("#leaderboardTournamentMode").on("click", async () => {
            if ($("#leaderboardTournamentMode").prop("checked") === true) {
                this._leaderboard.leaderboardData.tournamentMode = true;
            } else {
                this._leaderboard.leaderboardData.tournamentMode = false;
            }
        });
    }

    private async urlTextBuilder() {
        let url = "https://testmpplus.hyldrazolxy.fr/";
        let parameters = [];
        let firstParameter = true;
        let toggled = true;

        if (this._parameters._uriParams.ip !== "localhost") {
            parameters.push("ip", this._parameters._uriParams.ip);
        }

        if (this._leaderboard.leaderboardData.position !== "top-left") {
            parameters.push("pos", this._leaderboard.leaderboardData.position);
        }

        if (this._leaderboard.leaderboardData.scale !== 1) {
            parameters.push("sc", this._leaderboard.leaderboardData.scale);
        }

        if (this._leaderboard.leaderboardData.skin !== "default") {
            parameters.push("sk", this._leaderboard.leaderboardData.skin);
        }

        if (this._leaderboard.leaderboardData.tournamentMode !== false) {
            parameters.push("tournamentMode", this._leaderboard.leaderboardData.tournamentMode);
        }

        if (this._leaderboard.leaderboardData.playerRenderNumber !== 5) {
            parameters.push("pRenNum", this._leaderboard.leaderboardData.playerRenderNumber);
        }

        for (let i = 0; i < parameters.length; i++) {
            if (firstParameter) {
                firstParameter = false;
                url = url + "?" + parameters[i];

                if (parameters[i] === "ip") {
                    url = url.replace("https", "http");
                }
            } else {
                if (toggled) {
                    toggled = false;
                    url = url + "=" + parameters[i];
                } else {
                    toggled = true;
                    url = url + "&" + parameters[i];

                    if (parameters[i] === "ip") {
                        url = url.replace("https", "http");
                    }
                }
            }
        }

        $("#Urldescription").data("clipboardtext", url);
    }
}