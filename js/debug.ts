import { BSPlus } from "./bsplus.js";

export class Debug {

    //////////////////////
    // @CLASS VARIABLES //
    //////////////////////
    private _bsplus: BSPlus;

    ///////////////////////
    // PRIVATE VARIABLES //
    ///////////////////////
    private numberOfPlayers = 0;
    private isLeaved = false;

    private playerIdGenerator = () => {
        let playerId = "";
        for (let i = 0; i < 17; i++) {
            playerId += (Math.floor(Math.random() * 9) + 1).toString();
        }

        return playerId;
    }
    private scoreGenerator = () => {
        return Math.floor(Math.random() * (920 - 0) + 2);
    }
    private accGenerator = () => {
        return (Math.floor(Math.random() * (100 - 10)) + 10) / 100;
    }

    constructor() {
        this._bsplus = BSPlus.Instance;
    }

    ///////////////////////
    // PRIVATE FUNCTIONS //
    ///////////////////////
    private roomJoin() {
        let dataHandshake = {
            _type: "handshake",
            ProtocolVersion: 1,
            GameVersion: "1.24.0",
            LocalUserName: "Player #1",
            LocalUserID: "76561198235823594"
        }

        this._bsplus.dataParser(JSON.stringify(dataHandshake));

        let data = {
            _type: "event",
            _event: "RoomJoined",
            RoomState: "None"
        };

        this._bsplus.dataParser(JSON.stringify(data));
    }

    private roomLeave() {
        this.isLeaved = true;

        let data2 = {
            _type: "event",
            _event: "RoomLeaved",
            RoomState: "None"
        };

        this._bsplus.dataParser(JSON.stringify(data2));
    }

    private roomState() {
        let data = {
            _type: "event",
            _event: "RoomState",
            RoomState: "Playing"
        }

        this._bsplus.dataParser(JSON.stringify(data));
    }

    private playerJoin(playersLUID: number) {
        let data = {
            _type: "event",
            _event: "PlayerJoined",
            RoomState: "None",
            PlayerJoined: {
                LUID: playersLUID,
                UserID: this.playerIdGenerator(),
                UserName: "Player #" + playersLUID,
                Spectating: false
            }
        };

        this.numberOfPlayers += 1;
        this._bsplus.dataParser(JSON.stringify(data));
    }

    private playerLeave(playersLUID: number) {
        let data = {
            _type: "event",
            _event: "PlayerLeaved",
            RoomState: "None",
            PlayerLeaved: {
                LUID: playersLUID
            }
        };

        this.numberOfPlayers += -1;
        this._bsplus.dataParser(JSON.stringify(data));
    }

    private playerScore() {
        for (let i = 1; i <= this.numberOfPlayers; i++) {
            const randomFailed = !!Math.floor(Math.random() * (1 - 0 + 1));

            let accuracy = this.accGenerator();
            let score = this.scoreGenerator();
            let combo = score > 50 ? 1 : 0;
            let miss = score > 50 ? 0 : 1;

            if (miss === 1) {
                accuracy = (accuracy / 2) / 2;
            }

            let data = {
                _type: "event",
                _event: "Score",
                RoomState: "None",
                Score: {
                    LUID: i,
                    Score: score,
                    Accuracy: accuracy,
                    Combo: combo,
                    MissCount: miss,
                    Failed: randomFailed,
                    Deleted: false,
                    Missed: miss === 1 ? true : false
                }
            };

            this._bsplus.dataParser(JSON.stringify(data));
        }
    }

    private loop() {
        let internalLoop;

        if (!this.isLeaved) {
            this.roomState();

            internalLoop = setInterval(() => {
                this.playerScore();
            }, 2000);
        } else {
            clearInterval(internalLoop);
        }
    }

    //////////////////////
    // PUBLIC FUNCTIONS //
    //////////////////////
    public play() {
        this.isLeaved = false;
        const players = 30;

        setTimeout(() => {
            this.roomJoin();

            for (let i = 1; i <= players; i++) {
                this.playerJoin(i);
            }

            this.loop();
        }, 200);
    }

    public stop() {
        this.isLeaved = true;

        for (let i = 1; i <= this.numberOfPlayers; i++) {
            setTimeout(() => {
                this.playerLeave(i);
            }, 20);
        }

        this.roomLeave();
    }
}