import { LogEcs } from '../src/index.js'

// custom serialize function for key `my`
const myEcsSerializer = function (val, ecsFields) {
  if (typeof val !== 'object' || !val) return
  const { foo } = val
  ecsFields.My = foo // See https://www.elastic.co/guide/en/ecs/current/ecs-custom-fields-in-ecs.html#_capitalization
}

const log = new LogEcs('foobar', { serializers: { my: myEcsSerializer } })

const my = { foo: 'bar', sense: 42 }
log.info({ my })
