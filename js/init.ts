console.time("Load time");

import { Parameters } from "./parameters.js";
import { Leaderboard } from "./leaderboard.js";
import { UI } from "./ui.js";
import { Plugins } from "./plugins.js";
import { Debug } from "./debug.js";
import { Setup } from "./setup.js";

class Init {
    //////////////////////
    // @CLASS VARIABLES //
    //////////////////////
    private _parameters: Parameters;
    private _leaderboard: Leaderboard;
    private _ui: UI;
    private _plugins: Plugins;
    private _debug: Debug;
    private _setup: Setup;

    constructor() {
        this._parameters = Parameters.Instance;
        this._leaderboard = Leaderboard.Instance;
        this._ui = new UI();
        this._plugins = Plugins.Instance;
        this._debug = new Debug();
        this._setup = new Setup();

        (async () => {
            await this.appInit();
        })();
    }

    /////////////////////
    // PUBLIC FUNCTION //
    /////////////////////
    public async appInit() {
        await this._leaderboard.loadSkin(this._leaderboard.leaderboardData.skin);

        this._ui.refreshUI();

        console.timeEnd("Load time");

        await this._plugins.beatSaberConnection();

        if (this._parameters._uriParams.debug)
            this._debug.play();
    }
}

new Init();