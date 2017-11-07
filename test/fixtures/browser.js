const {err, obj, circular, quotes, custom} = require('./testcases')

module.exports = {
  browser: [
    [ 'ERROR test string +0ms' ],
    [ 'ERROR test %O +0ms', 1 ],
    [ 'ERROR test %O +1ms', false ],
    [ 'ERROR test %O +1ms', obj ],
    [ 'ERROR test %O +1ms', err ],
    [ 'ERROR test %s +1ms', 'string' ],
    [ 'ERROR test %O +1ms', 1 ],
    [ 'ERROR test %O +1ms', false ],
    [ 'ERROR test %O +1ms', obj ],
    [ 'ERROR test %O +1ms', obj ],
    [ 'ERROR test %O +1ms', [ 1, 2, 3 ] ],
    [ 'ERROR test %O +1ms', err ],
    [ 'ERROR test %O +1ms', circular ],
    [ 'ERROR test %s +1ms', null ],
    [ 'ERROR test %s +1ms', undefined ],
    [ 'ERROR test %d +1ms', null ],
    [ 'ERROR test %d +1ms', undefined ],
    [ 'ERROR test hello %s +1ms', 'world' ],
    [ 'ERROR test digit %d +1ms', 42.7 ],
    [ 'ERROR test integer %i +1ms', 42.7 ],
    [ 'ERROR test float %f +1ms', 42.666 ],
    [ 'ERROR test json %O +1ms', obj ],
    [ 'ERROR test obj %o +1ms', obj ],
    [ 'ERROR test obj %O +1ms', [ 1, 2, 3 ] ],
    [ 'ERROR test error %O +1ms', err ],
    [ 'ERROR test mixed %% %s %d %i %f %O %O +1ms', 'string', 1.1, 2.2, 3.33, obj, err ],
    [ 'ERROR test %O +1ms', err, '%s %% %d', 'string', 1.1 ],
    [ 'ERROR test %O +1ms', err, obj, '%s %% %d', 'string', 1.1 ],
    [ 'ERROR test %s %% %d +1ms', 'string', 1.1, obj, err ],
    [ 'ERROR test %O +1ms', quotes ],
    [ 'ERROR test %O +1ms', custom ],
    [ 'ERROR test custom color %c%o +1ms', 'color: red', {} ]
  ],
  colors: [
    [ '%cERROR test%c string %c+0ms%c', 'color: #CC00CC','color: inherit','color: #CC00CC','color: inherit' ],
    [ '%cERROR test%c %O %c+0ms%c', 'color: #CC00CC', 'color: inherit', 1, 'color: #CC00CC', 'color: inherit' ],
    [ '%cERROR test%c %O %c+1ms%c', 'color: #CC00CC', 'color: inherit', false, 'color: #CC00CC', 'color: inherit' ],
    [ '%cERROR test%c %O %c+1ms%c', 'color: #CC00CC', 'color: inherit', obj, 'color: #CC00CC', 'color: inherit' ],
    [ '%cERROR test%c %O %c+1ms%c', 'color: #CC00CC', 'color: inherit', err, 'color: #CC00CC', 'color: inherit' ],
    [ '%cERROR test%c %s %c+1ms%c', 'color: #CC00CC', 'color: inherit', 'string', 'color: #CC00CC', 'color: inherit' ],
    [ '%cERROR test%c %O %c+1ms%c', 'color: #CC00CC', 'color: inherit', 1, 'color: #CC00CC', 'color: inherit' ],
    [ '%cERROR test%c %O %c+1ms%c', 'color: #CC00CC', 'color: inherit', false, 'color: #CC00CC', 'color: inherit' ],
    [ '%cERROR test%c %O %c+1ms%c', 'color: #CC00CC', 'color: inherit', obj, 'color: #CC00CC', 'color: inherit' ],
    [ '%cERROR test%c %O %c+1ms%c', 'color: #CC00CC', 'color: inherit', obj, 'color: #CC00CC', 'color: inherit' ],
    [ '%cERROR test%c %O %c+1ms%c', 'color: #CC00CC', 'color: inherit', [ 1, 2, 3 ], 'color: #CC00CC', 'color: inherit' ],
    [ '%cERROR test%c %O %c+1ms%c', 'color: #CC00CC', 'color: inherit', err, 'color: #CC00CC', 'color: inherit' ],
    [ '%cERROR test%c %O %c+1ms%c', 'color: #CC00CC', 'color: inherit', circular, 'color: #CC00CC', 'color: inherit' ],
    [ '%cERROR test%c %s %c+1ms%c', 'color: #CC00CC', 'color: inherit', null, 'color: #CC00CC', 'color: inherit' ],
    [ '%cERROR test%c %s %c+1ms%c', 'color: #CC00CC', 'color: inherit', undefined, 'color: #CC00CC', 'color: inherit' ],
    [ '%cERROR test%c %d %c+1ms%c', 'color: #CC00CC', 'color: inherit', null, 'color: #CC00CC', 'color: inherit' ],
    [ '%cERROR test%c %d %c+1ms%c', 'color: #CC00CC', 'color: inherit', undefined, 'color: #CC00CC', 'color: inherit' ],
    [ '%cERROR test%c hello %s %c+1ms%c', 'color: #CC00CC', 'color: inherit', 'world', 'color: #CC00CC', 'color: inherit' ],
    [ '%cERROR test%c digit %d %c+1ms%c', 'color: #CC00CC', 'color: inherit', 42.7, 'color: #CC00CC', 'color: inherit' ],
    [ '%cERROR test%c integer %i %c+1ms%c', 'color: #CC00CC', 'color: inherit', 42.7, 'color: #CC00CC', 'color: inherit' ],
    [ '%cERROR test%c float %f %c+1ms%c', 'color: #CC00CC', 'color: inherit', 42.666, 'color: #CC00CC', 'color: inherit' ],
    [ '%cERROR test%c json %O %c+1ms%c', 'color: #CC00CC', 'color: inherit', obj, 'color: #CC00CC', 'color: inherit' ],
    [ '%cERROR test%c obj %o %c+1ms%c', 'color: #CC00CC', 'color: inherit', obj, 'color: #CC00CC', 'color: inherit' ],
    [ '%cERROR test%c obj %O %c+1ms%c', 'color: #CC00CC', 'color: inherit', [ 1, 2, 3 ], 'color: #CC00CC', 'color: inherit' ],
    [ '%cERROR test%c error %O %c+1ms%c', 'color: #CC00CC', 'color: inherit', err, 'color: #CC00CC', 'color: inherit' ],
    [ '%cERROR test%c mixed %% %s %d %i %f %O %O %c+1ms%c', 'color: #CC00CC', 'color: inherit', 'string', 1.1, 2.2, 3.33, obj, err, 'color: #CC00CC', 'color: inherit' ],
    [ '%cERROR test%c %O %c+1ms%c', 'color: #CC00CC', 'color: inherit', err, 'color: #CC00CC', 'color: inherit', '%s %% %d', 'string', 1.1 ],
    [ '%cERROR test%c %O %c+1ms%c', 'color: #CC00CC', 'color: inherit', err, 'color: #CC00CC', 'color: inherit', obj, '%s %% %d', 'string', 1.1 ],
    [ '%cERROR test%c %s %% %d %c+1ms%c', 'color: #CC00CC', 'color: inherit', 'string', 1.1, 'color: #CC00CC', 'color: inherit', obj, err ],
    [ '%cERROR test%c %O %c+1ms%c', 'color: #CC00CC', 'color: inherit', quotes, 'color: #CC00CC', 'color: inherit' ],
    [ '%cERROR test%c %O %c+1ms%c', 'color: #CC00CC', 'color: inherit', custom, 'color: #CC00CC', 'color: inherit' ],
    [ '%cERROR test%c custom color %c%o %c+1ms%c', 'color: #CC00CC', 'color: inherit', 'color: red', {}, 'color: #CC00CC', 'color: inherit' ]
  ]
}
