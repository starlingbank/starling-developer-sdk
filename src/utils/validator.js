
const runRules = (pos, name, rules, value) => {
  const valueType = typeof value

  if (rules[0] === 'optional') {
    if (value && (valueType !== rules[1])) {
      return `${name} parameter in position ${pos} is an optional ${rules[1]} but was ${valueType}`
    }
  }
  if (rules[0] === 'required') {
    if (value && (valueType !== rules[1])) {
      return `${name} parameter in position ${pos} is a required ${rules[1]} but was ${valueType}`
    } else if (!value && value !== 0) {
      return `${name} parameter in position ${pos} is a required ${rules[1]} but was ${value}`
    }
  }
}

export const typeValidation = (args, def) => {
  const problems = []

  if (Object.prototype.hasOwnProperty.call(args, 'length')) {
    for (let i = 0; i < def.length; i++) {
      const pos = i
      const name = def[i].name
      const rules = def[i].validations
      const value = i <= args.length ? args[i] : undefined
      const problem = runRules(pos, name, rules, value)
      if (problem) problems.push(problem)
    }
  } else if (typeof args === 'object') {
    for (const check of def) {
      const name = check.name
      const rules = check.validations
      const value = args[name]
      const problem = runRules(name, name, rules, value)
      if (problem) problems.push(problem)
    }
  } else {
    throw new Error('Type validation args must be an array or an object')
  }

  if (problems.length) {
    throw problems
  }
}
