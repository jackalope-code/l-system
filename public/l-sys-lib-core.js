"use strict";
// Single threaded library class core for context free L-systems.
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// TODO: Does not currently check for invalid systems like unrecognized symbols. Rule checking is more difficult lol.
class ContextFreeLSystem {
    constructor(init) {
        const { axiom, alphabet, name, rules } = init;
        //   Protected by an alphabet/rule guard check which trivially (overcoded hehe)
        // checks the axiom as well (allows for any length axiom to resume computation).
        //   Once the initial conditions are met, ContextFreeLSystem.step_n fn will always remain within the
        // grammar from the rule check. This only works with single character alphabets.
        const error = ContextFreeLSystem._check_alphabet(alphabet, axiom, rules);
        if (error !== undefined) {
            throw error;
        }
        this.name = name;
        this.axiom = axiom;
        this.alphabet = alphabet;
        this.rules = rules;
    }
    step_n(max_iterations) {
        return __awaiter(this, void 0, void 0, function* () {
            let system = this.axiom;
            for (let i = 0; i < max_iterations; i++) {
                system = yield this.step(system);
            }
            return new Promise((resolve) => resolve(system));
        });
    }
    step(system) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Promise((resolve, reject) => {
                this._step(system, (res, err) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(res);
                    }
                });
            });
        });
    }
    _step(system, callback) {
        let new_system = [];
        for (let letter of system) {
            // L-system variable lookup / constant differentiation
            if (letter in this.rules) {
                new_system.push(this.rules[letter]);
            }
            else {
                new_system.push(letter);
            }
        }
        return callback(new_system.join(""), undefined);
    }
    // Assumes a single character alphabet and method of processing
    // Check for a valid alphabet/input/rule set. Return a silent error object with diagnostic
    // information if the system goes beyond the defined alphabet (grammar error)
    //    error: bool 
    //    message: undefined | string   Contains a diagnostic error message
    // TODO: What would happen with two, three character alphabets? Is that case useful? It's more difficult to implement.
    static _check_alphabet(alphabet, input, rules) {
        if (alphabet.length === 0) {
            return new Error("Alphabet may not be empty.");
        }
        if (input === undefined && rules === undefined) {
            return new Error("Either raw L-System input or L-System rules must be defined to check the alphabet against.");
        }
        const lookup = new Set();
        for (let symbol of alphabet) {
            lookup.add(symbol);
        }
        // Check input
        if (input !== undefined) {
            for (let single_char of input) {
                // Case of the input containing an unrecognized single letter symbol
                if (!lookup.has(single_char)) {
                    return new Error('Input contains an letter symbol outside the defined alphabet.');
                }
            }
        }
        if (rules !== undefined) {
            // Check rules quadratic O(nk) + O(nv); n=#rules, k=avg rule key length, v=avg rule value length
            for (const [rule_key, rule_value] of Object.entries(rules)) {
                for (let rule_lookup_letter of rule_key) {
                    if (!alphabet.includes(rule_lookup_letter)) {
                        return new Error('Rule lookup key contains symbol outside the defined alphabet.');
                    }
                }
                for (let rule_value_letter of rule_value) {
                    if (!alphabet.includes(rule_value_letter)) {
                        return new Error('Rule action contains symbol outside the defined alphabet.');
                    }
                }
            }
        }
    }
    static get_system(system_name) {
        switch (system_name) {
            case 'algea':
                return new ContextFreeLSystem({ name: "algea", axiom: "a", alphabet: ["a, b"], rules: { "a": "ab", "b": "a" } });
            case 'plant':
                return new ContextFreeLSystem({ name: "plant", axiom: "X", alphabet: ["X", "F", "+", "-", "[", "]"], rules: { "X": "F+[[X]-X]-F[-FX]+X", "F": "FF" } });
        }
    }
}
