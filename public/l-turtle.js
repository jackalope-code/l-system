"use strict";
// Global module l-turtle. Compiled from Typescript without webpack bundling rn. Update to webpack UMD.
// W Lindenmayer Turtle
function toRadians(degrees) {
    return degrees * (Math.PI / 180);
}
class LTurtle {
    // TODO: Cleaner way of initializing quickly/easily for different system starting configurations?
    constructor(width, height, x = width / 2, y = height / 2, angle = 90, step_distance = 5) {
        var _a, _b;
        this.history = [];
        if (!document) {
            throw new Error("Could not find global document object.");
        }
        const canvas = document.getElementById("turtle-canvas");
        if (!canvas) {
            throw new Error("Could not find app canvas element turtle-canvas.  Make sure a canvas element with the given id exists and that the initialization function is called after the element loads.");
        }
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.step_distance = step_distance;
        this.canvas = canvas;
        this.canvas.width = width;
        this.canvas.height = height;
        this.ctx = canvas.getContext("2d");
        if (this.ctx) {
            this.ctx.lineWidth = 1;
        }
        (_a = this.ctx) === null || _a === void 0 ? void 0 : _a.scale(1, 1);
        // this.ctx?.beginPath();
        (_b = this.ctx) === null || _b === void 0 ? void 0 : _b.moveTo(this.x, this.height - this.y);
    }
    process_lstr(lsystem, draw_rules) {
        if (draw_rules === undefined || draw_rules == null) {
            throw new Error("LTurtle draw rules must be specified either by looking a system up by name with LTurtle.get_draw_rules, or by specifying a custom rule map.");
        }
        let i = 0;
        // TODO: MANUAL DEBUG OVERRIDE
        let MAX_ITER = 30;
        for (let letter of lsystem) {
            console.log("i=" + i);
            if (!draw_rules[letter]) {
                throw new Error("Encounted unknown letter symbol " + letter);
            }
            draw_rules[letter](this);
            i++;
            if (i > MAX_ITER) {
                break;
            }
        }
        console.log("testing string " + lsystem.slice(0, MAX_ITER));
    }
    push_state() {
        this.history.push({ x: this.x, y: this.y, angle: this.angle });
        // this.ctx?.closePath();
    }
    pop_state() {
        const restored_pt = this.history.pop();
        if (restored_pt) {
            this.x = restored_pt.x;
            this.y = restored_pt.y;
            this.angle = restored_pt.angle;
        }
        // this.ctx?.beginPath();
    }
    move(distance = this.step_distance, wrap = false) {
        var _a, _b;
        this.x += distance * Math.cos(toRadians(this.angle));
        this.y += distance * Math.sin(toRadians(this.angle));
        if (wrap) {
            this.x = this.x % this.width;
            this.y = this.y % this.height;
        }
        else {
            this.x = this.check_x(this.x) ? this.x : this.width;
            this.y = this.check_y(this.y) ? this.y : this.height;
        }
        (_a = this.ctx) === null || _a === void 0 ? void 0 : _a.lineTo(this.x, this.height - this.y);
        (_b = this.ctx) === null || _b === void 0 ? void 0 : _b.stroke();
    }
    turn(angle) {
        this.angle = (this.angle + angle) % 360;
    }
    check_x(x) {
        return x >= 0 && x <= this.width;
    }
    check_y(y) {
        return y >= 0 && y <= this.height;
    }
    static get_system_draw_rules(name) {
        const DEBUG_STEP_DISTANCE = 5;
        const DEBUG_SHOULD_TURTLE_WRAP = true;
        let plant_draw_rules = {
            "F": (turtle) => {
                turtle.move(DEBUG_STEP_DISTANCE, DEBUG_SHOULD_TURTLE_WRAP);
            },
            "-": (turtle) => {
                turtle.turn(-25);
            },
            "+": (turtle) => {
                turtle.turn(25);
            },
            "X": (turtle) => { },
            "[": (turtle) => {
                turtle.push_state();
            },
            "]": (turtle) => {
                turtle.pop_state();
            }, // restore (pop) saved position and angle values
        };
        switch (name) {
            case 'plant':
                return plant_draw_rules;
        }
    }
}
