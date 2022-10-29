"use strict";
// W Lindenmayer Turtle - Lucian
function toRadians(degrees) {
    return degrees * (Math.PI / 180);
}
class LTurtle {
    // TODO: Cleaner way of initializing quickly/easily for different system starting configurations?
    constructor(width, height, x = width / 2, y = height / 2, angle = 90, step_distance = 5) {
        var _a, _b, _c;
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
        (_b = this.ctx) === null || _b === void 0 ? void 0 : _b.beginPath();
        (_c = this.ctx) === null || _c === void 0 ? void 0 : _c.moveTo(this.x, this.height - this.y);
    }
    process_lstr(lsystem, draw_rules, step_distance) {
        let i = 0;
        let plant_draw_rules = {
            "F": (turtle) => {
                turtle.move(step_distance, true);
                console.log(i + " move");
            },
            "-": (turtle) => {
                turtle.turn(-25);
                console.log(i + " turn right -25");
            },
            "+": (turtle) => {
                turtle.turn(25);
                console.log(i + " turn left +25");
            },
            "X": (turtle) => { },
            "[": (turtle) => {
                turtle.push_state();
            },
            "]": (turtle) => {
                turtle.pop_state();
            }, // restore (pop) saved position and angle values
        };
        for (let letter of lsystem) {
            plant_draw_rules[letter](this);
            i++;
        }
    }
    push_state() {
        var _a;
        this.history.push({ x: this.x, y: this.y, angle: this.angle });
        (_a = this.ctx) === null || _a === void 0 ? void 0 : _a.closePath();
    }
    pop_state() {
        var _a;
        const restored_pt = this.history.pop();
        if (restored_pt) {
            this.x = restored_pt.x;
            this.y = restored_pt.y;
            this.angle = restored_pt.angle;
        }
        (_a = this.ctx) === null || _a === void 0 ? void 0 : _a.beginPath();
    }
    move(distance = this.step_distance, wrap = false) {
        var _a, _b;
        this.x += distance * Math.cos(toRadians(this.angle));
        this.y += this.y + distance * Math.sin(toRadians(this.angle));
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
}
