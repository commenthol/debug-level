/**
 * mocha BDD tests with boolean pre-condition
 */

const noop = () => {}

export const describeBool = (trueish) => trueish ? describe : describe.skip
describeBool.only = (trueish) => trueish ? describe.only : noop
describeBool.skip = (trueish) => describe.skip

export const itBool = (trueish) => trueish ? it : it.skip
itBool.only = (trueish) => trueish ? it.only : noop
itBool.skip = (trueish) => it.skip
