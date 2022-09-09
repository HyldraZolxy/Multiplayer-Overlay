import { Globals } from "./globals.js";

export class Template {

    //////////////////////
    // PRIVATE FUNCTION //
    //////////////////////
    private createRowSeparator(): void {
        if ($("#leaderboard").find("#row-seperator").length)
            return;

        $("table#leaderboard").append("<tr id=\"row-seperator\">"
                + "<td class=\"separator ion-more\">"
                    + "<div class=\"playerLocalName localPlayer\"></div>"
                + "</td>"
            + "</tr>"
        );
    }

    private deleteRowSeparator(): void {
        if (!$("#leaderboard").find("#row-seperator").length)
            return;

        $("#row-seperator").empty().remove();
    }

    /////////////////////
    // PUBLIC FUNCTION //
    /////////////////////
    public loadSkin(moduleName: Globals.E_MODULES, skinName: string, fileName?: string): Promise<unknown> {
        return new Promise(resolve => {
            let skin = (Globals.SKIN_AVAILABLE[moduleName].hasOwnProperty(skinName) ? Globals.SKIN_AVAILABLE[moduleName][skinName] : Globals.SKIN_AVAILABLE[moduleName]["default"]);
            let skinPath = skin[0];

            $("link[rel=stylesheet][href*=\"./skins/" + moduleName + "\"]").remove();

            if (fileName !== undefined) {
                if (skin.includes(fileName)) {
                    for (let i = 1; i < skin.length; i++) {
                        if (skin[i] === "style.css") {
                            $("head").append("<link rel=\"stylesheet\" href=\"" + skinPath + skin[i] + "\" type=\"text/css\" />");
                            continue;
                        }
                    }

                    $("#" + moduleName).load(skinPath + fileName);
                }
            } else {
                for (let i = 1; i < skin.length; i++) {
                    if (skin[i] === "style.css") {
                        $("head").append("<link rel=\"stylesheet\" href=\"" + skinPath + skin[i] + "\" type=\"text/css\" />");
                        continue;
                    }

                    $("#" + moduleName).load(skinPath + skin[i]);
                }
            }

            setTimeout(() => resolve(""), 0);
        });
    }

    public moduleToggleDisplay(displayed: boolean): void {
        if (!displayed)
            $("#leaderboard").addClass("hidden");

        if (displayed)
            $("#leaderboard").removeClass("hidden");
    }

    public moduleScale(position: string, scale: number): void {
        let element = $("#leaderboard");

        element.css("transform-origin", position.replace(/(-)/g, " "));
        element.css("transform", "scale(" + scale + ")");
    }

    public moduleCorners(position: string): void {
        let element = $("#leaderboard");

        element.removeClass("top-left bottom-left top-right bottom-right");
        element.addClass(position);
    }

    public createRow(key: number, value: Globals.I_LeaderboardMap, localPlayerLUID: number): void {
        if ($("#leaderboard").find("#row-" + key).length)
            return;

        $("table#leaderboard").append("<tr id=\"row-" + key + "\" class=\"joined\">"
                + "<td class=\"position ion-pound\">" + value.Position + "</td>"
                + "<td class=\"avatar\">"
                    + "<div class=\"innerAvatar\"></div>"
                + "</td>"
                + "<td class=\"pseudo\">" + value.UserName + "</td>"
                + "<td class=\"score\">" + value.Score + "</td>"
                + "<td class=\"percentage\">" + value.Accuracy + "</td>"
                + "<td class=\"fcMiss ion-android-checkmark-circle\"> FC</td>"
                + "<td class=\"barPercentage\">"
                    + "<div class=\"barToPercentage\"></div>"
                +"</td>"
            + "</tr>"
        );

        if (key === localPlayerLUID)
            $(".pseudo").addClass("localPlayer");

        setTimeout(() => {
            $("#row-" + key).removeClass("joined");
        }, 500);
    }

    public deleteRow(key: number): void {
        if (!$("#leaderboard").find("#row-" + key).length)
            return;

        $("#row-" + key).addClass("leaved");

        setTimeout(() => {
            $("#row-" + key).empty().remove();
        }, 500);
    }

    public addClass(key: number, className: string, position?: number): void {
        switch (className) {
            case "fcClass":
                $("#row-" + key + " .fcMiss").removeClass("ion-android-checkmark-circle ion-android-cancel");
                $("#row-" + key + " .fcMiss").addClass("ion-android-checkmark-circle");
                break;

            case "missClass":
                $("#row-" + key + " .fcMiss").removeClass("ion-android-checkmark-circle ion-android-cancel");
                $("#row-" + key + " .fcMiss").addClass("ion-android-cancel");
                break;

            case "miss":
                $("#row-" + key).addClass("miss");

                setTimeout(() => {
                    $("#row-" + key).removeClass("miss");
                }, 200);
                break;

            case "position":
                $("#row-" + key).removeClass("first second third");
                $("#row-" + key).addClass(position === 1
                    ? "first"
                    : position === 2
                        ? "second"
                        : position === 3
                            ? "third"
                            : ""
                );
                break;
        }
    }

    public rowSort(leaderboardSorted: Map<number, Globals.I_LeaderboardMap>, position: string, tournementMode: boolean, playerLocalLUID: number, playerRenderNumber: number): void {
        let leaderboardSize = leaderboardSorted.size;
        let rowSize = $("#leaderboard").find("tr").length - ($("#leaderboard").find("#row-seperator").length ? 1 : 0);
        let iteration = 0;
        let rowTotalHeight = 0;
        let cssPosition = ["top-left", "top-right"].includes(position) ? "top" : "bottom";
        let previousKey = 0;
        let previousScore = 0;

        leaderboardSorted.forEach((value: Globals.I_LeaderboardMap, key) => {
            iteration++;

            if ($("#leaderboard").find("#row-" + key).length) {
                if (value.Spectating) {
                    $("#row-" + key).css("display", "none");
                    iteration--;
                    return;
                }

                if (!tournementMode) {
                    $("tr").css("position", "absolute");

                    if (cssPosition === "top") {
                        if ($("#leaderboard").find("#row-seperator").length) {
                            $("#row-seperator").css("bottom", "");
                        }

                        $("#row-" + key).css("bottom", "");
                    } else {
                        if ($("#leaderboard").find("#row-seperator").length) {
                            $("#row-seperator").css("top", "");
                        }

                        $("#row-" + key).css("top", "");
                    }

                    if (playerRenderNumber > 1) {
                        if (leaderboardSize > playerRenderNumber) {
                            if (iteration < playerRenderNumber) {
                                $("#row-" + key).css("display", "inline-flex");
                                $("#row-" + key).css(cssPosition, rowTotalHeight);

                                rowTotalHeight += <number>$("#row-" + key).height() + 3;
                            } else if (iteration === playerRenderNumber) {
                                $("#row-" + key).css("display", "none");

                                this.createRowSeparator();

                                if ($("#leaderboard").find("#row-seperator").length) {
                                    $("#row-seperator").css(cssPosition, rowTotalHeight);
                                    rowTotalHeight += <number>$("#row-seperator").height() + 3;
                                }
                            } else if (iteration === leaderboardSize || iteration === rowSize) {
                                $("#row-" + key).css("display", "inline-flex");
                                $("#row-" + key).css(cssPosition, rowTotalHeight);

                                rowTotalHeight += <number>$("#row-" + key).height() + 3;
                            } else {
                                $("#row-" + key).css("display", "none");
                            }

                            if (playerLocalLUID === key) {
                                if ($("#leaderboard").find("#row-seperator").length) {
                                    if (playerRenderNumber !== 0 && iteration > playerRenderNumber) {
                                        $(".playerLocalName").addClass("ion-pound");
                                        $(".playerLocalName").text(value.Position + " " + value.UserName);
                                    } else {
                                        $(".playerLocalName").removeClass("ion-pound");
                                        $(".playerLocalName").text(" ");
                                    }
                                }
                            }
                        } else {
                            this.deleteRowSeparator();
                            $("#row-" + key).css("display", "inline-flex");
                            $("#row-" + key).css(cssPosition, rowTotalHeight);

                            rowTotalHeight += <number>$("#row-" + key).height() + 3;
                        }
                    } else {
                        if (leaderboardSize > playerRenderNumber) {
                            if (iteration === playerRenderNumber) {
                                $("#row-" + key).css("display", "inline-flex");
                                $("#row-" + key).css(cssPosition, rowTotalHeight);

                                rowTotalHeight += <number>$("#row-" + key).height() + 3;

                                this.createRowSeparator();

                                if ($("#leaderboard").find("#row-seperator").length) {
                                    $("#row-seperator").css(cssPosition, rowTotalHeight);
                                    rowTotalHeight += <number>$("#row-seperator").height() + 3;
                                }
                            } else {
                                $("#row-" + key).css("display", "none");
                            }

                            if (playerLocalLUID === key) {
                                if ($("#leaderboard").find("#row-seperator").length) {
                                    if (iteration > playerRenderNumber) {
                                        $(".playerLocalName").addClass("ion-pound");
                                        $(".playerLocalName").text(value.Position + " " + value.UserName);
                                    } else {
                                        $(".playerLocalName").removeClass("ion-pound");
                                        $(".playerLocalName").text(" ");
                                    }
                                }
                            }
                        } else {
                            this.deleteRowSeparator();
                            $("#row-" + key).css("display", "inline-flex");
                            $("#row-" + key).css(cssPosition, rowTotalHeight);

                            rowTotalHeight += <number>$("#row-" + key).height() + 3;
                        }
                    }
                } else {
                    if ($("#leaderboard").find("#row-seperator").length) {
                        this.deleteRowSeparator();
                    }

                    $("tr").css("position", "relative");
                    $("#row-" + key).css("display", "inline-flex");
                    $("#row-" + key).css(cssPosition, rowTotalHeight);

                    if (iteration > 0) {
                        if (value.Position === 1) {
                            $("#row-" + key + " .percentage").css("transform", "scale(1.2)");

                            previousKey = key;
                            previousScore = value.Accuracy * 100;
                        } else {
                            $("#row-" + key + " .percentage").css("transform", "scale(1)");

                            let difference = (value.Accuracy * 100) - previousScore;
                            difference = difference / previousScore;
                            difference = difference * 100;

                            // Difference multiplied by DIFFERENCE_MULTIPLIER because if the players is very close, the bar length is very short, and you cannot really see who is first
                            $("#row-" + previousKey + " .barToPercentage").css("width", ((difference * Globals.DIFFERENCE_MULTIPLIER) * -1) + "%");
                            $("#row-" + key + " .barToPercentage").css("width", "0%");
                        }
                    }
                }
            } else return;
        });

        if (leaderboardSize === 0) {
            if ($("#leaderboard").find("#row-seperator").length) {
                this.deleteRowSeparator();
            }
        }
    }

    ///////////////////////////
    // PUBLIC SETUP FUNCTION //
    ///////////////////////////
    public setupHide(display: boolean): void {
        if (display)
            $("#setupPanel").addClass("hidden");
        else
            $("#setupPanel").removeClass("hidden");
    }

    public makeActive(element?: JQuery): void {
        $("li").removeClass("active");

        if (element !== undefined)
            element.addClass("active");
    }

    public makeHidden(displayed: boolean): void {
        if (!displayed)
            $("#setup").removeClass("hidden");
        else
            $("#setup").addClass("hidden");
    }
}