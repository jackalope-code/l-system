"use strict";
// TODO: Does not currently check for invalid systems like unrecognized symbols. Rule checking is likely more difficult lol.
class ContextFreeLSystem {
    constructor(axiom, alphabet, rules) {
        this.axiom = axiom;
        this.alphabet = alphabet;
        this.rules = rules;
    }
    step_n(max_iterations) {
        let system = this.axiom;
        for (let i = 0; i <= max_iterations; i++) {
            system = this._apply_context_free_rules(system);
        }
        return system;
    }
    _apply_context_free_rules(system) {
        let new_system = "";
        for (let letter of system) {
            // L-system variable lookup / constant differentiation
            if (letter in this.rules) {
                new_system += this.rules[letter];
            }
            else {
                new_system += letter;
            }
        }
        return new_system;
    }
    static get_system(system_name) {
        switch (system_name) {
            case 'algea':
                return new ContextFreeLSystem("a", ["a, b"], { "a": "ab", "b": "a" });
            case 'plant':
                return new ContextFreeLSystem("X", ["X", "F", "+", "-", "[", "]"], { "X": "F+[[X]-X]-F[-FX]+X", "F": "FF" });
        }
    }
}
