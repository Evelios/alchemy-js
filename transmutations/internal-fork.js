const Vector = require('vector');
const regularPolygon = require('regular-polygon');
const NewArray = require('new-array');
const inscribePolygon = require('../algorithms/inscribe-polygon.js');

module.exports = function internalFork(continuation, strength=1/continuation.nsides) {
  const N_CIRCLE_SIDES = 300;
  const fork_radius = continuation.radius * strength;
  const internal_radius = continuation.radius - 2 * fork_radius;

  const nsides = continuation.nsides;

  const forking_points = NewArray(nsides).map((_, i) => {
    const rotation = continuation.rotation + i * 2*Math.PI / nsides;
    return Vector.offset(continuation.center, continuation.radius - fork_radius, rotation);
  });

  const getRendering = function() {

    let outer_circle = regularPolygon(
      N_CIRCLE_SIDES,
      continuation.center,
      continuation.radius,
      0
    );
    outer_circle.push(outer_circle[0]);

    const forking_rendering = forking_points.map(pos => {
      let circle = regularPolygon(
        N_CIRCLE_SIDES,
        pos,
        fork_radius,
        0
      );
      circle.push(circle[0]);
      return circle;
    });

    let interior_circle = regularPolygon(
      N_CIRCLE_SIDES,
      continuation.center,
      internal_radius,
      continuation.rotation
    );
    interior_circle.push(interior_circle[0]);

    return [
      outer_circle,
      forking_rendering,
      interior_circle
    ];
  }

  const getForks = function() {
    return forking_points.map(pos => {
      return {
        center   : pos,
        radius   : fork_radius,
        nsides   : nsides,
        rotation : 0,
      };
    });
  };

  const getInterior = function() {
    const interior_radius = continuation.radius * Math.cos(Math.PI / nsides);

    return {
      center   : continuation.center,
      radius   : internal_radius,
      nsides   : nsides,
      rotation : 0
    };
  };

  return {
    rendering : getRendering(), 
    forks     : getForks(),
    interior  : getInterior()
  }
};
