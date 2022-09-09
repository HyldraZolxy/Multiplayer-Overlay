import { Globals } from "./globals.js";
import { Parameters } from "./parameters.js";
import { Leaderboard } from "./leaderboard.js";
import { BSPlus } from "./bsPlus.js";

export class Plugins {

    ///////////////
    // @INSTANCE //
    ///////////////
    private static _instance: Plugins;

    /////////////////////
    // @CLASS VARIABLE //
    /////////////////////
    private _parameters: Parameters;
    private _leaderboard: Leaderboard;
    private _bsPlus: BSPlus;

    //////////////////////
    // PRIVATE VARIABLE //
    //////////////////////
    private isConnected = Globals.E_WEBSOCKET_STATES.DISCONNECTED;

    constructor() {
        this._parameters = Parameters.Instance;
        this._leaderboard = Leaderboard.Instance;
        this._bsPlus = new BSPlus();
    }

    //////////////////////
    // PRIVATE FUNCTION //
    //////////////////////
    private webSocketConnection(pluginName: Globals.E_PLUGINS, retryNumber: number): Promise<WebSocket> {
        const numberOfRetries = retryNumber;
        let hasReturned = false;
        let websocket: WebSocket;

        let promise: Promise<WebSocket> = new Promise((resolve, reject) => {
            setTimeout(() => {
                if(!hasReturned) {
                    websocket.close(1000, "Timeout");
                    rejectInternal();
                }
            }, Globals.TIMEOUT_MS);

            websocket = new WebSocket("ws://" +
                this._parameters._uriParams.ip +
                ":" +
                Globals.PLUGINS_CONNECTIONS[pluginName].port +
                Globals.PLUGINS_CONNECTIONS[pluginName].entry
            );

            websocket.onopen = () => {
                if(hasReturned) {
                    websocket.close(1000, "Already Open");
                } else {
                    this.isConnected = Globals.E_WEBSOCKET_STATES.CONNECTED;

                    resolve(websocket);
                }
            };

            websocket.onclose = () => {
                if (this.isConnected === Globals.E_WEBSOCKET_STATES.CONNECTED) {
                    this.isConnected = Globals.E_WEBSOCKET_STATES.DISCONNECTED;
                    this._leaderboard.leaderboardData.display = false;
                }
                rejectInternal();
            };

            websocket.onerror = () => {
                this.isConnected = Globals.E_WEBSOCKET_STATES.ERROR;
                rejectInternal();
            };

            const rejectInternal = () => {
                if(numberOfRetries <= 1) {
                    reject();
                } else if (!hasReturned) {
                    hasReturned = true;
                    this.webSocketConnection(pluginName, numberOfRetries-1).then(resolve, reject);
                } else if (this.isConnected === Globals.E_WEBSOCKET_STATES.DISCONNECTED) {
                    this.beatSaberConnection();
                }
            }
        });

        promise.then(function () { hasReturned = true; }, function () { hasReturned = true; });
        return promise;
    }

    /////////////////////
    // PUBLIC FUNCTION //
    /////////////////////
    public async beatSaberConnection(): Promise<void> {
        await this.webSocketConnection(Globals.E_PLUGINS.BSPLUS, Globals.RETRY_NUMBER).then((socket: WebSocket) => {
            console.log("socket initialized on BeatSaberPlus Multiplayer!");
            console.log("\n\n");

            socket.onmessage = (data) => {
                this._bsPlus.dataParser(data.data);
            }
        }, async () => {
            console.log("init of BeatSaberPlus Multiplayer socket failed!");
            console.log("\n\n");

            setTimeout(() => {
                this.beatSaberConnection();
            }, Globals.TIME_BEFORE_RETRY);
        });
    }

    /////////////
    // GETTERS //
    /////////////
    public static get Instance(): Plugins {
        return this._instance || (this._instance = new this());
    }
}