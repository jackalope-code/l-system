// Global module l-sys-lib. Compiled from Typescript without webpack rn. Update to webpack UMD.
// Text based Lindenmayer systems designed in tandem with turtle graphics l-turtle
// Only has context free deterministic grammar rn. Add stochastic and then look into other grammars.

// exports removed until webpack is added for proper library bundling
interface ContextFreeLSystemRules {
  [key: string]: string
}

// type ContextFreeLSystems = "algea" | "bin_tree" | "cantor_set" | "koch_curve" | "sier_triangle" | "dragon_curve" | "plant"
type ContextFreeLSystemName = "algea" | "plant";

interface ContextFreeLSystemInit {
  axiom: string;
  alphabet: string[];
  name: string;
  rules: ContextFreeLSystemRules
}

// TODO: Does not currently check for invalid systems like unrecognized symbols. Rule checking is more difficult lol.
class ContextFreeLSystem {
  alphabet: string[];
  rules: ContextFreeLSystemRules;
  axiom: string;
  name: string;

  constructor(init: ContextFreeLSystemInit) {
    const {axiom, alphabet, name, rules} = init;
    //   Protected by an alphabet/rule guard check which trivially (overcoded hehe)
    // checks the axiom as well (allows for any length axiom to resume computation).
    //   Once the initial conditions are met, ContextFreeLSystem.step_n fn will always remain within the
    // grammar from the rule check. This only works with single character alphabets.
    const error = ContextFreeLSystem._check_alphabet(alphabet, axiom, rules);
    if(error !== undefined) {
      throw error;
    }
    this.name = name;
    this.axiom = axiom;
    this.alphabet = alphabet;
    this.rules = rules;
  }

  step_n(max_iterations: number): string {
    let system = this.axiom;
    for(let i=0; i<max_iterations; i++) {
      system = this._apply_context_free_rules(system);
    }
    return system;
  }

  _apply_context_free_rules(system: string): string {
    let new_system = "";
    for(let letter of system) {
      // L-system variable lookup / constant differentiation
      if(letter in this.rules) {
        new_system = new_system.concat(this.rules[letter]);
      } else {
        new_system = new_system.concat(letter);
      }
    }
    return new_system;
  }

  // Assumes a single character alphabet and method of processing
  // Check for a valid alphabet/input/rule set. Return a silent error object with diagnostic
  // information if the system goes beyond the defined alphabet (grammar error)
  //    error: bool 
  //    message: undefined | string   Contains a diagnostic error message
  // TODO: What would happen with two, three character alphabets? Is that case useful? It's more difficult to implement.
  static _check_alphabet(alphabet: string[], input: string | undefined, rules: ContextFreeLSystemRules | undefined): Error | undefined {
    if(alphabet.length === 0) {
      return new Error("Alphabet may not be empty.");
    }

    if(input === undefined && rules === undefined) {
      return new Error("Either Raw L-System input or L-System rules must be defined to check the alphabet against.")
    }

    const lookup = new Set();
    for(let symbol of alphabet) {
      lookup.add(symbol);
    }
    // Check input
    if(input !== undefined) {
      for(let single_char of input) {
        // Case of the input containing an unrecognized single letter symbol
        if(!lookup.has(single_char)) {
          return new Error('Input contains an letter symbol outside the defined alphabet.');
        }
      }
    }
    if(rules !== undefined) {
      // Check rules quadratic O(nk) + O(nv); n=#rules, k=avg rule key length, v=avg rule value length
      for(const [rule_key, rule_value] of Object.entries(rules)) {
        for(let rule_lookup_letter of rule_key) {
          if(!alphabet.includes(rule_lookup_letter)) {
            return new Error('Rule lookup key contains symbol outside the defined alphabet.');
          }
        }
        for(let rule_value_letter of rule_value) {
          if(!alphabet.includes(rule_value_letter)) {
            return new Error('Rule action contains symbol outside the defined alphabet.');
          }
        }
      }
    }
  }

  static get_system(system_name: ContextFreeLSystemName): ContextFreeLSystem {
    switch(system_name) {
      case 'algea':
        return new ContextFreeLSystem({name: "algea", axiom: "a", alphabet: ["a, b"], rules: { "a": "ab", "b": "a" }});
      case 'plant':
        return new ContextFreeLSystem({name: "plant", axiom: "X", alphabet:["X", "F", "+", "-", "[", "]"], rules: { "X": "F+[[X]-X]-F[-FX]+X", "F": "FF" }});
    }
  }
}