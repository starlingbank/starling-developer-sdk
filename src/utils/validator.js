
const runRules = (pos, name, rules, value) => {
  const valueType = typeof value;

  if (rules[0] == 'optional') {
    if (value && (valueType !== rules[1])) {
      return `${name} parameter in position ${pos} is an optional ${rules[1]} but was ${valueType}`
    }
  }
  if (rules[0] == 'required') {
    if (value && (valueType !== rules[1])) {
      return `${name} parameter in position ${pos} is a required ${rules[1]} but was ${valueType}`
    } else if (!value) {
      return `${name} parameter in position ${pos} is a required ${rules[1]} but was ${value}`
    }
  }
};

export const  typeValidation = (args, def) => {
  let problems = [];
  for (let i = 0; i < def.length; i++) {
    const pos = i;
    const name = def[i].name;
    const rules = def[i].validations;
    const value = i <= args.length ? args[i] : undefined;
    const problem = runRules(pos, name, rules, value);
    if (problem) problems.push(problem);
  }

  if (problems.length) {
    throw problems;
  }

};

