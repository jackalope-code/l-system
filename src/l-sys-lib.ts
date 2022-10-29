// exports removed until webpack is added for proper library bundling
interface ContextFreeLSystemRules {
  [key: string]: string
}

// type ContextFreeLSystems = "algea" | "bin_tree" | "cantor_set" | "koch_curve" | "sier_triangle" | "dragon_curve" | "plant"
type ContextFreeLSystems = "algea" | "plant";

class ContextFreeLSystem {
  alphabet: string[];
  rules: ContextFreeLSystemRules;
  axiom: string;

  constructor(axiom: string, alphabet: string[], rules: ContextFreeLSystemRules) {
    this.axiom = axiom;
    this.alphabet = alphabet;
    this.rules = rules;
  }

  step_n(max_iterations: number): string {
    let system = this.axiom;
    for(let i=0; i<=max_iterations; i++) {
      system = this._apply_context_free_rules(system);
    }
    return system;
  }

  _apply_context_free_rules(system: string): string {
    let new_system = "";
    for(let letter of system) {
      // L-system variable lookup / constant differentiation
      if(letter in this.rules) {
        new_system += this.rules[letter];
      } else {
        new_system += letter;
      }
    }
    return new_system;
  }

  static start_container() {
    // console.log("code executed")
    if(!document) {
        throw new Error("Could not find global document object.");
    }
    const container = document.getElementById("l-system-root");
    if(container) {
        const app = document.createElement("div");
        app.setAttribute("id", "ls-system");
        // console.log(container);
        // console.log(app);
        container.appendChild(app);
    } else {
        throw new Error("Could not find app root element l-system-root. Make sure a div element with the given id exists and that the initialization function is called after the element loads.");
    }
  }

  static get_system(system_name: ContextFreeLSystems): ContextFreeLSystem {
    switch(system_name) {
      case 'algea':
        return new ContextFreeLSystem("a", ["a, b"], { "a": "ab", "b": "a" });
      case 'plant':
        return new ContextFreeLSystem("X", ["X", "F", "+", "-", "[", "]"], { "X": "F+[[X]-F[-FX]+X", "F": "FF" });
    }
  }
}