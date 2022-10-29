// exports removed until webpack is added for proper library bundling
interface ContextFreeLSystemRules {
  [key: string]: string
}

class ContextFreeLSystem {
  alphabet: string[];
  rules: ContextFreeLSystemRules;

  constructor(alphabet: string[], rules: ContextFreeLSystemRules) {
    this.alphabet = alphabet;
    this.rules = rules;
  }

  compute(axiom: string, max_iterations: number): string {
    let system = axiom;
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
}