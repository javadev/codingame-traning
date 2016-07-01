(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _MapData = require('./MapData');

var _Utils = require('./Utils');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Cell = function () {
  function Cell(x, y) {
    _classCallCheck(this, Cell);

    this.x = x;
    this.y = y;
    this.noGhost = false;
  }

  _createClass(Cell, [{
    key: 'updateHasGhost',
    value: function updateHasGhost() {
      var _this = this;

      this.noGhost = true;
      _MapData.mapData.ghosts.forEach(function (ghost) {
        var ghostCell = (0, _Utils.getCell)(ghost.x, ghost.y);
        if (ghostCell.x === _this.x && ghostCell.y === _this.y) {
          _this.noGhost = false;
        }
      });
    }
  }]);

  return Cell;
}();

exports.default = Cell;

},{"./MapData":3,"./Utils":5}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _MapData = require('./MapData');

var _Utils = require('./Utils');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Entity = function () {
  function Entity(id, x, y, type, state, value) {
    _classCallCheck(this, Entity);

    this.id = id;
    this.x = x;
    this.y = y;
    this.type = type;
    this.state = state;
    this.value = value;
    this.startingLoop = true;
    this.helping = false;
    this.currentAction = 'IDLE';
    this.stunCD = 0;
  }

  _createClass(Entity, [{
    key: 'goTo',
    value: function goTo(x, y) {
      var _cleanCoords = (0, _Utils.cleanCoords)(x, y);

      var cleanX = _cleanCoords.x;
      var cleanY = _cleanCoords.y;

      this.action = 'MOVE ' + cleanX + ' ' + cleanY;
      this.destination = { x: cleanX, y: cleanY };
      this.currentAction = 'MOVING';
    }
  }, {
    key: 'bust',
    value: function bust(id) {
      this.action = 'BUST ' + id;
      this.destination = null;
    }
  }, {
    key: 'release',
    value: function release() {
      this.action = 'RELEASE';
      this.destination = null;
      _MapData.mapData.release(this.value);
      _MapData.mapData.score++;
    }
  }, {
    key: 'stun',
    value: function stun(id) {
      this.action = 'STUN ' + id;
      this.destination = null;
      this.stunCD = 21;
    }
  }, {
    key: 'isInBaseRange',
    value: function isInBaseRange() {
      if (this.type === 0) {
        return (0, _Utils.getDistance2)([this.x, this.y], [0, 0]) <= 1600;
      }
      return (0, _Utils.getDistance2)([this.x, this.y], [16000, 9000]) <= 1600;
    }
  }, {
    key: 'isStunAvailable',
    value: function isStunAvailable() {
      return this.stunCD === 0 || this.stunCD === 21;
    }
  }, {
    key: 'toString',
    value: function toString() {
      var readableType = 'ghost';
      if (this.type === _MapData.mapData.myTeamId) {
        readableType = 'buster';
      } else if (this.type !== -1) {
        readableType = 'ennemy';
      } else if (this.giveUp) {
        readableType += ' givenUp';
      }
      return this.id + ' [' + this.x + ', ' + this.y + '] ' + readableType + ' ' + this.state + ' ' + this.value + ' ' + this.stunCD;
    }
  }]);

  return Entity;
}();

exports.default = Entity;

},{"./MapData":3,"./Utils":5}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mapData = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Entity = require('./Entity');

var _Entity2 = _interopRequireDefault(_Entity);

var _Cell = require('./Cell');

var _Cell2 = _interopRequireDefault(_Cell);

var _Utils = require('./Utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MapData = function () {
  function MapData() {
    _classCallCheck(this, MapData);

    this.ghosts = [];
    this.grid = [];
    this.stealers = [];
    this.nbBusterDesperate = 0;
    this.turn = 0;
    this.score = 0;
    for (var i = 0; i < 48; i++) {
      var x = 1000 + 2000 * (i % 8);
      var y = 750 + 1500 * Math.floor(i / 8);
      this.grid.push(new _Cell2.default(x, y));
    }
  }

  _createClass(MapData, [{
    key: 'setGhostsCount',
    value: function setGhostsCount(ghostsCount) {
      this.nbGhosts = ghostsCount;
    }
  }, {
    key: 'setMyTeamId',
    value: function setMyTeamId(id) {
      this.myTeamId = id;
      if (id === 0) {
        this.grid[0].noGhost = true;
      } else {
        this.grid[47].noGhost = true;
      }
    }
  }, {
    key: 'clearInstantData',
    value: function clearInstantData() {
      this.sighedGhosts = [];
      this.sighedBusters = [];
      this.grid.forEach(function (cell) {
        cell.searched = false;
      });
    }
  }, {
    key: 'createOrUpdateGhost',
    value: function createOrUpdateGhost(id, x, y, state, value) {
      var found = false;
      this.ghosts.forEach(function (ghost) {
        if (ghost.id === id) {
          ghost.x = x;
          ghost.y = y;
          ghost.value = value;
          ghost.state = state;
          found = true;
        }
      });

      if (!found) {
        this.ghosts.push(new _Entity2.default(id, x, y, -1, state, value));
      }
    }
  }, {
    key: 'addSighedGhost',
    value: function addSighedGhost(id, x, y, state, value) {
      this.sighedGhosts.push(new _Entity2.default(id, x, y, -1, state, value));
      this.createOrUpdateGhost(id, x, y, state, value);
    }
  }, {
    key: 'addSighedBuster',
    value: function addSighedBuster(id, x, y, state, value) {
      this.sighedBusters.push(new _Entity2.default(id, x, y, this.myTeamId ? 0 : 1, state, value));
    }
  }, {
    key: 'addSighedEntity',
    value: function addSighedEntity(id, x, y, type, state, value) {
      if (type === -1) {
        this.addSighedGhost(id, x, y, state, value);
      } else {
        this.addSighedBuster(id, x, y, state, value);
      }
    }
  }, {
    key: 'cleanFalseGhost',
    value: function cleanFalseGhost(busters) {
      var _this = this;

      busters.forEach(function (buster) {
        var inSigh = (0, _Utils.getSighed)(buster, _this.ghosts);
        inSigh.forEach(function (_ref) {
          var currentEntity = _ref.currentEntity;

          var isRealGhost = false;
          _this.sighedGhosts.forEach(function (sighedGhost) {
            if (currentEntity.id === sighedGhost.id) {
              isRealGhost = true;
            }
          });
          if (!isRealGhost) {
            _this.release(currentEntity.id);
          }
        });
      });
    }
  }, {
    key: 'release',
    value: function release(id) {
      for (var i = 0; i < this.ghosts.length; i++) {
        if (this.ghosts[i].id === id) {
          this.ghosts.splice(i, 1);
          return;
        }
      }
    }
  }, {
    key: 'getGhost',
    value: function getGhost(id) {
      for (var i = 0; i < this.ghosts.length; i++) {
        if (this.ghosts[i].id === id) {
          return this.ghosts[i];
        }
      }
      return null;
    }
  }, {
    key: 'printErr',
    value: function (_printErr) {
      function printErr() {
        return _printErr.apply(this, arguments);
      }

      printErr.toString = function () {
        return _printErr.toString();
      };

      return printErr;
    }(function () {
      printErr('mapData', this.nbGhosts, this.myTeamId);
      printErr(this.ghosts.map(function (ghost) {
        return ghost.toString();
      }));
      printErr(this.sighedGhosts.map(function (ghost) {
        return ghost.toString();
      }));
      printErr(this.sighedBusters.map(function (buster) {
        return buster.toString();
      }));
      printErr(this.grid.map(function (cell, index) {
        if (cell.noGhost) {
          return 'cell ' + index;
        }
        return '';
      }));
    })
  }]);

  return MapData;
}();

var mapData = exports.mapData = new MapData();

},{"./Cell":1,"./Entity":2,"./Utils":5}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Entity = require('./Entity');

var _Entity2 = _interopRequireDefault(_Entity);

var _Utils = require('./Utils');

var _MapData = require('./MapData');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Team = function () {
  function Team(id) {
    _classCallCheck(this, Team);

    if (id === 0) {
      this.x = 0;
      this.y = 0;
      this.ennemyX = 16000;
      this.ennemyY = 9000;
    } else {
      this.x = 16000;
      this.y = 9000;
      this.ennemyX = 0;
      this.ennemyY = 0;
    }
    this.busters = [];
  }

  _createClass(Team, [{
    key: 'createOrUpdateBuster',
    value: function createOrUpdateBuster(id, x, y, type, state, value) {
      var found = false;
      this.busters.forEach(function (buster) {
        if (buster.id === id) {
          buster.x = x;
          buster.y = y;
          buster.value = value;
          buster.state = state;
          buster.helping = false;
          if (buster.stunCD > 0) {
            buster.stunCD--;
          }
          if (!buster.destination) {
            buster.currentAction = 'IDLE';
          } else {
            var destinationCell = (0, _Utils.getCell)(buster.destination.x, buster.destination.y);
            var busterCell = (0, _Utils.getCell)(buster.x, buster.y);
            if (busterCell.x === destinationCell.x && busterCell.y === destinationCell.y) {
              buster.currentAction = 'IDLE';
            }
          }
          found = true;
        }
      });

      if (!found) {
        var buster = new _Entity2.default(id, x, y, type, state, value);
        this.busters.push(buster);
      }
    }
  }, {
    key: 'updateHasGhost',
    value: function updateHasGhost() {
      this.busters.forEach(function (buster) {
        var busterCell = (0, _Utils.getCell)(buster.x, buster.y);
        busterCell.updateHasGhost();
      });
    }
  }, {
    key: 'getNbTeamTrapping',
    value: function getNbTeamTrapping(id) {
      var count = 0;
      this.busters.forEach(function (buster) {
        if (buster.state === 3 && buster.value === id) {
          count++;
        }
      });
      return count;
    }
  }, {
    key: 'behaviour',
    value: function behaviour(buster) {
      var _this = this;

      var distanceToBase = (0, _Utils.getDistance2)([buster.x, buster.y], [this.x, this.y]);
      if (buster.helping) {}
      if (distanceToBase < 6000) {
        this.updateStealers(buster);
      }
      if (buster.state === 1) {
        this.carryingDecision(buster);
      }
      if (buster.state === 3 && !buster.helping) {
        this.trappingDecision(buster);
      }
      if (buster.state === 0 && !buster.helping) {
        var _ret = function () {
          var shouldDefend = _this.shouldDefendLast(buster);
          if (shouldDefend === 2) {
            return {
              v: void 0
            };
          }

          var _getClosest = (0, _Utils.getClosest)(buster, _MapData.mapData.sighedBusters, -1, [0, 2, 3, 4]);

          var closestEnnemy = _getClosest.closest;
          var ennemyDistance = _getClosest.minDist;

          if (!closestEnnemy || ennemyDistance > 1760) {
            var _getClosest2 = (0, _Utils.getClosest)(buster, _MapData.mapData.sighedBusters, -1, [2, 4]);

            closestEnnemy = _getClosest2.closest;
            ennemyDistance = _getClosest2.minDist;
          }
          if (closestEnnemy) {
            var ennemyToBase = (0, _Utils.getDistance2)([closestEnnemy.x, closestEnnemy.y], [_this.x, _this.y]);
            if (ennemyDistance < 1760 && buster.isStunAvailable() && ennemyToBase > 3500) {
              buster.stun(closestEnnemy.id);
              closestEnnemy.willBeStunBy = buster;
              closestEnnemy.state = 4;
              var ghost = _MapData.mapData.getGhost(closestEnnemy.value);
              if (ghost) {
                ghost.giveUp = false;
              } else if (closestEnnemy.value !== -1) {
                var estimatedNextPos = (0, _Utils.getNextPos)([closestEnnemy.x, closestEnnemy.y], [_this.ennemyX, _this.ennemyY]);
                _MapData.mapData.createOrUpdateGhost(closestEnnemy.value, estimatedNextPos.x, estimatedNextPos.y, 0, 0);
              }
              return {
                v: void 0
              };
            } else if (ennemyDistance < 2200 && ennemyToBase > 3500) {
              if (closestEnnemy.willBeStunBy) {}
              var distanceToEnnemyBase = (0, _Utils.getDistance2)([buster.x, buster.y], [_this.ennemyX, _this.ennemyY]);
              var ennemyToHisBase = (0, _Utils.getDistance2)([closestEnnemy.x, closestEnnemy.y], [_this.ennemyX, _this.ennemyY]);
              if (closestEnnemy.state === 1 && distanceToEnnemyBase > ennemyToHisBase) {
                _this.goToBase(buster, true);
                ennemyToHisBase = _this.goToBase(closestEnnemy, true);
                if (Math.ceil(ennemyToHisBase / 800) - 1 > buster.stunCD) {
                  return {
                    v: void 0
                  };
                }
              } else {
                var nbTurnToGo = Math.ceil((ennemyDistance - 1760) / 800);
                if (buster.isStunAvailable() || buster.stunCD < nbTurnToGo) {
                  buster.goTo(closestEnnemy.x, closestEnnemy.y);
                  return {
                    v: void 0
                  };
                }
              }
            }
          }

          var _getBestGhost = _this.getBestGhost(buster);

          var closest = _getBestGhost.closest;
          var minDist = _getBestGhost.minDist;

          if (closest) {
            if (minDist < 1760 && minDist >= 900) {
              buster.bust(closest.id);
              if (buster.state !== 3) {
                closest.value++;
                closest.state--;
                buster.value = closest.id;
                buster.state = 3;
              }
            } else if (minDist < 900) {
              var _ret2 = function () {
                var ennemyInSigh = (0, _Utils.getSighed)(buster, _MapData.mapData.sighedBusters);
                var countEnnemies = 0;
                ennemyInSigh.forEach(function (ennemy) {
                  var ennemyToGhost = (0, _Utils.getDistance)(ennemy, closest);
                  if (ennemy.state !== 2 && ennemyToGhost > 900 && ennemyToGhost < 1760) {
                    countEnnemies++;
                  }
                });
                if (countEnnemies > 0) {
                  _this.goToBase(buster, true);
                  return {
                    v: {
                      v: void 0
                    }
                  };
                }
                var nextPosToBase = (0, _Utils.getNextPos)([buster.x, buster.y], [_this.x, _this.y], 600);
                buster.goTo(nextPosToBase.x, nextPosToBase.y);
              }();

              if ((typeof _ret2 === 'undefined' ? 'undefined' : _typeof(_ret2)) === "object") return _ret2.v;
            } else {
              buster.goTo(closest.x, closest.y);
            }
          } else if (!_this.shouldRoam(buster, shouldDefend)) {
            _this.search(buster);
          }
        }();

        if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
      }
      if (buster.state === 2) {
        this.search(buster);
      }
    }
  }, {
    key: 'getBestGhost',
    value: function getBestGhost(buster) {
      var bestGhost = void 0;
      var minDist = void 0;
      _MapData.mapData.ghosts.forEach(function (ghost) {
        var currentDist = (0, _Utils.getDistance)(ghost, buster);
        var nbTurnToGo = Math.ceil((currentDist - 1760) / 800);
        var countEnnemies = 0;
        _MapData.mapData.sighedBusters.forEach(function (ennemy) {
          var ennemyToGhost = (0, _Utils.getDistance)(ennemy, ghost);
          if (ennemy.state !== 2 && ennemyToGhost > 900 && ennemyToGhost < 1760) {
            countEnnemies++;
          }
        });
        var isBustable = currentDist < 1760 && currentDist > 900;
        var isReachable = ghost.value > 0 && ghost.state - ghost.value * nbTurnToGo > 0 || ghost.value === 0 && (countEnnemies === 0 || isBustable);
        var onlyWeak = _MapData.mapData.turn < 2 * _MapData.mapData.nbGhosts && ghost.state <= 15 && ghost.value < 1 || _MapData.mapData.turn >= 2 * _MapData.mapData.nbGhosts || _MapData.mapData.ghosts.length >= (_MapData.mapData.nbGhosts - 1) / 2;
        if (!ghost.giveUp && isReachable && onlyWeak && (!bestGhost || ghost.state < bestGhost.state)) {
          bestGhost = ghost;
          minDist = currentDist;
        }
      });
      return {
        closest: bestGhost,
        minDist: minDist
      };
    }
  }, {
    key: 'makeDecision',
    value: function makeDecision() {
      var _this2 = this;

      this.busters.forEach(function (buster) {
        _this2.behaviour(buster);
      });
    }
  }, {
    key: 'shouldRoam',
    value: function shouldRoam(buster, shouldDefend) {
      if (shouldDefend === 1 && _MapData.mapData.ghosts.length === 0 && _MapData.mapData.nbBusterDesperate < _MapData.mapData.stealers.length - 1 && !buster.roam) {
        this.goToBase(buster, true, 1700);
        buster.roam = true;
        _MapData.mapData.nbBusterDesperate++;
        return true;
      }

      if (buster.roam && (0, _Utils.getDistance2)([buster.x, buster.y], [this.ennemyX, this.ennemyY]) < 3000) {
        this.roam(buster);
        return true;
      }
      return false;
    }
  }, {
    key: 'roam',
    value: function roam(buster) {
      var left = {
        x: 1000,
        y: 2500
      };
      var right = {
        x: 2500,
        y: 1000
      };
      if (_MapData.mapData.myTeamId === 0) {
        left = {
          x: 13500,
          y: 8000
        };
        right = {
          x: 15000,
          y: 6500
        };
      }
      if (buster.goingLeft && buster.x !== left.x && buster.y !== left.y) {
        buster.goTo(left.x, left.y);
        buster.goingLeft = true;
      } else if (buster.x !== right.x && buster.y !== right.y) {
        buster.goTo(right.x, right.y);
        buster.goingLeft = false;
      } else {
        buster.goingLeft = true;
        buster.goTo(left.x, left.y);
      }
    }
  }, {
    key: 'updateStealers',
    value: function updateStealers(buster) {
      var _this3 = this;

      var inSigh = (0, _Utils.getSighed)(buster, _MapData.mapData.stealers);
      _MapData.mapData.sighedBusters.forEach(function (sighedBuster) {
        var distMeToHim = (0, _Utils.getDistance)(buster, sighedBuster);
        var distMeToBase = (0, _Utils.getDistance2)([buster.x, buster.y], [_this3.x, _this3.y]);
        var distHimToBase = (0, _Utils.getDistance2)([sighedBuster.x, sighedBuster.y], [_this3.x, _this3.y]);
        var found = false;
        var foundIndex = -1;
        _MapData.mapData.stealers.forEach(function (stealer, index) {
          if (stealer.id === sighedBuster.id) {
            found = true;
            foundIndex = index;
            stealer.state = sighedBuster.state;
            stealer.x = sighedBuster.x;
            stealer.y = sighedBuster.y;
          }
        });
        if (!found && distMeToHim < 2200 && distHimToBase - 800 < distMeToBase) {
          _MapData.mapData.stealers.push(sighedBuster);
        } else if (found && distHimToBase > 4000) {
          _MapData.mapData.stealers.splice(foundIndex, 1);
        }
      });
    }
  }, {
    key: 'askProtection',
    value: function askProtection(buster, wanted) {
      var _this4 = this;

      this.closestBusters = [];
      this.busters.forEach(function (currentBuster) {
        if (buster.id !== currentBuster.id) {
          _this4.closestBusters.push(currentBuster);
        }
      });
      this.closestBusters.sort(function (buster1, buster2) {
        var nbTurnToGo1 = Math.ceil(((0, _Utils.getDistance)(buster, buster1) - 950) / 800);
        var nbTurnToGo2 = Math.ceil(((0, _Utils.getDistance)(buster, buster2) - 950) / 800);
        if (nbTurnToGo1 + buster1.stunCD < nbTurnToGo2 + buster2.stunCD) {
          return -1;
        } else if (nbTurnToGo1 + buster1.stunCD > nbTurnToGo2 + buster2.stunCD) {
          return 1;
        }
        return 0;
      });
      this.closestBusters.forEach(function (currentBuster, index) {
        var nbTurnToGo = Math.ceil(((0, _Utils.getDistance)(buster, currentBuster) - 950) / 800);
        if (index < wanted && (nbTurnToGo === 0 || nbTurnToGo > currentBuster.stunCD)) {
          currentBuster.helping = true;
          currentBuster.helpingOn = buster.id;
          var distMeToHim = (0, _Utils.getDistance)(buster, currentBuster);

          var _getClosest3 = (0, _Utils.getClosest)(currentBuster, _MapData.mapData.sighedBusters, -1, [2, 4]);

          var closestEnnemy = _getClosest3.closest;
          var ennemyDistance = _getClosest3.minDist;

          if (closestEnnemy && ennemyDistance < 1760 && currentBuster.isStunAvailable()) {
            var ennemyToCarrier = (0, _Utils.getDistance)(closestEnnemy, buster);
            if (ennemyToCarrier < 1760 && buster.isStunAvailable()) {
              buster.stun(closestEnnemy.id);
              closestEnnemy.state = 2;
              return;
            }
            currentBuster.stun(closestEnnemy.id);
            closestEnnemy.state = 2;
          } else if (distMeToHim > 1000) {
            var nextPos = (0, _Utils.getNextPos)([buster.x, buster.y], [_this4.x, _this4.y], 950);
            currentBuster.goTo(nextPos.x, nextPos.y);
          } else {
            _this4.goToBase(currentBuster);
          }
        }
      });
      var countCloseBusters = 0;
      this.closestBusters.forEach(function (currentBuster) {
        var distMeToHim = (0, _Utils.getDistance)(buster, currentBuster);
        var distMeToBase = (0, _Utils.getDistance2)([buster.x, buster.y], [_this4.x, _this4.y]);
        var distHimToBase = (0, _Utils.getDistance2)([currentBuster.x, currentBuster.y], [_this4.x, _this4.y]);
        if (currentBuster.isStunAvailable() && (distMeToHim < 300 || distMeToBase >= distHimToBase)) {
          countCloseBusters++;
        }
      });
      return countCloseBusters;
    }
  }, {
    key: 'carryingDecision',
    value: function carryingDecision(buster) {
      var _this5 = this;

      _MapData.mapData.release(buster.value);
      if (_MapData.mapData.stealers.length > 0) {
        var _ret3 = function () {
          var countThreats = buster.isStunAvailable() ? 0 : 1;
          _MapData.mapData.stealers.forEach(function (stealer) {
            if (stealer.state !== 2) {
              countThreats++;
            }
          });
          var closeBusters = _this5.askProtection(buster, countThreats - 1);
          var distanceToBase = (0, _Utils.getDistance2)([buster.x, buster.y], [_this5.x, _this5.y]);
          var stealerClose = false;
          var stunnedStealerClose = false;
          _MapData.mapData.stealers.forEach(function (stealer) {
            if ((0, _Utils.getDistance)(stealer, buster) < 2200 && stealer.state !== 2) {
              stealerClose = true;
            } else if (stealer.state === 2) {
              stunnedStealerClose = true;
            }
          });
          if (distanceToBase > 2400 && distanceToBase < 6000 && closeBusters < countThreats - 1) {
            if (!stealerClose) {
              buster.goTo(buster.x, buster.y);
              return {
                v: void 0
              };
            } else if (!stealerClose && stunnedStealerClose) {
              var _getClosest4 = (0, _Utils.getClosest)(buster, _this5.busters, buster.id);

              var closestTeam = _getClosest4.closest;

              buster.goTo(closestTeam.x, closestTeam.y);
              return {
                v: void 0
              };
            }
          }
        }();

        if ((typeof _ret3 === 'undefined' ? 'undefined' : _typeof(_ret3)) === "object") return _ret3.v;
      }

      if (buster.isInBaseRange()) {
        buster.release();
        return;
      }

      var _getClosest5 = (0, _Utils.getClosest)(buster, _MapData.mapData.sighedBusters, -1, [2]);

      var closestEnnemy = _getClosest5.closest;
      var ennemyDistance = _getClosest5.minDist;

      if (closestEnnemy) {
        if (ennemyDistance > 1760) {
          this.avoid(buster, closestEnnemy);
          return;
        } else if (buster.isStunAvailable()) {
          buster.stun(closestEnnemy.id);
          closestEnnemy.state = 2;
          var busterWouldStun = closestEnnemy.willBeStunBy;
          if (busterWouldStun) {
            closestEnnemy.willBeStunBy = null;
            this.behaviour(busterWouldStun);
          }
          return;
        }
      }
      this.goToBase(buster);
      return;
    }
  }, {
    key: 'shouldDefendLast',
    value: function shouldDefendLast(buster) {
      var _this6 = this;

      if (_MapData.mapData.score === (_MapData.mapData.nbGhosts - 1) / 2) {
        var _ret4 = function () {
          var carryingBuster = null;
          var minDist = 100000;
          _this6.busters.forEach(function (currentBuster) {
            var distance = (0, _Utils.getDistance)(buster, currentBuster);
            if (currentBuster.state === 1 && currentBuster.action !== 'RELEASE' && distance < minDist) {
              carryingBuster = currentBuster;
              minDist = distance;
            }
          });
          if (carryingBuster) {
            var _getClosest6 = (0, _Utils.getClosest)(buster, _MapData.mapData.sighedBusters, -1, [2]);

            var closestEnnemy = _getClosest6.closest;
            var ennemyDistance = _getClosest6.minDist;

            if (closestEnnemy && ennemyDistance < 1760 && buster.isStunAvailable()) {
              buster.stun(closestEnnemy.id);
              closestEnnemy.state = 2;
            } else {
              buster.goTo(carryingBuster.x, carryingBuster.y);
            }
            return {
              v: 2
            };
          }
          _MapData.mapData.sighedBusters.forEach(function (currentBuster) {
            if (currentBuster.state === 1) {
              carryingBuster = currentBuster;
            }
          });
          if (carryingBuster) {
            var _getClosest7 = (0, _Utils.getClosest)(buster, _MapData.mapData.sighedBusters, -1, [0, 2, 3]);

            var _closestEnnemy = _getClosest7.closest;
            var _ennemyDistance = _getClosest7.minDist;

            if (!_closestEnnemy) {
              var _getClosest8 = (0, _Utils.getClosest)(buster, _MapData.mapData.sighedBusters, -1, [2]);

              _closestEnnemy = _getClosest8.closest;
              _ennemyDistance = _getClosest8.minDist;
            }
            if (_closestEnnemy && _ennemyDistance < 1760 && buster.isStunAvailable()) {
              buster.stun(_closestEnnemy.id);
              _closestEnnemy.state = 2;
            } else {
              if (!carryingBuster.isFollowed || buster.id === carryingBuster.isFollowedBy) {
                buster.goTo(carryingBuster.x, carryingBuster.y);
                carryingBuster.isFollowed = true;
                carryingBuster.isFollowedBy = buster.id;
              } else {
                var nextPos = (0, _Utils.getNextPos)([carryingBuster.x, carryingBuster.y], [_this6.ennemyX, _this6.ennemyY]);
                buster.goTo(nextPos.x, nextPos.y);
              }
            }
            return {
              v: 2
            };
          }
          return {
            v: 1
          };
        }();

        if ((typeof _ret4 === 'undefined' ? 'undefined' : _typeof(_ret4)) === "object") return _ret4.v;
      }
      return 0;
    }
  }, {
    key: 'trappingDecision',
    value: function trappingDecision(buster) {
      var _getClosest9 = (0, _Utils.getClosest)(buster, _MapData.mapData.sighedBusters);

      var closestEnnemy = _getClosest9.closest;
      var ennemyDistance = _getClosest9.minDist;

      var ghost = _MapData.mapData.getGhost(buster.value);
      var teamTrapping = -1;
      var ennemyTrapping = -1;
      if (ghost) {
        teamTrapping = this.getNbTeamTrapping(ghost.id);
        ennemyTrapping = ghost.value - teamTrapping;
      }
      if (closestEnnemy && closestEnnemy.state !== 2 && (teamTrapping === -1 || ennemyTrapping < teamTrapping || teamTrapping === ennemyTrapping && closestEnnemy.value === ghost.id) && buster.isStunAvailable()) {
        if (ennemyDistance < 1760) {
          buster.stun(closestEnnemy.id);
          closestEnnemy.state = 2;
          return;
        } else if (ennemyDistance < 2200) {
          buster.goTo(closestEnnemy.x, closestEnnemy.y);
          return;
        }
      }
      if (!ghost) {
        buster.state = 0;
        return;
      }
      if (ennemyTrapping >= teamTrapping) {
        var needed = ennemyTrapping - teamTrapping;
        if (!this.askForHelp(buster, needed)) {
          ghost.giveUp = true;
          buster.state = 0;
        }
      } else {
        ghost.state--;
        if (ghost.state === 0 && ennemyTrapping < teamTrapping - 1) {
          _MapData.mapData.release(ghost.id);
        }
      }
    }
  }, {
    key: 'avoid',
    value: function avoid(buster, ennemy) {

      var nextPosToBase = (0, _Utils.getNextPos)([buster.x, buster.y], [this.x, this.y]);
      var nextPosToEnnemyDistance = (0, _Utils.getDistance2)([nextPosToBase.x, nextPosToBase.y], [ennemy.x, ennemy.y]);
      if (nextPosToEnnemyDistance > 2563) {
        this.goToBase(buster);
        return;
      }

      var ennemyRange = Math.pow(2400, 2);
      var a = 2 * (ennemy.x - buster.x);
      var b = 2 * (ennemy.y - buster.y);
      var c = Math.pow(ennemy.x - buster.x, 2) + Math.pow(ennemy.y - buster.y, 2) - ennemyRange + 640000;
      var delta = Math.pow(2 * a * c, 2) - 4 * (Math.pow(a, 2) + Math.pow(b, 2)) * (Math.pow(c, 2) - Math.pow(b, 2) * 640000);
      if (delta <= 0) {
        buster.goTo(this.x, this.y);
        return;
      }
      var x1 = buster.x + Math.floor((2 * a * c - Math.sqrt(delta)) / (2 * (Math.pow(a, 2) + Math.pow(b, 2))));
      var x2 = buster.x + Math.floor((2 * a * c + Math.sqrt(delta)) / (2 * (Math.pow(a, 2) + Math.pow(b, 2))));
      var y1 = void 0;
      var y2 = void 0;
      if (b !== 0) {
        y1 = buster.y + Math.floor((c - a * (x1 - buster.x)) / b);
        y2 = buster.y + Math.floor((c - a * (x2 - buster.x)) / b);
      } else {
        y1 = buster.y + Math.floor(Math.sqrt(ennemyRange - Math.pow((2 * c - Math.pow(a, 2)) / (2 * a), 2)));
        y2 = buster.y - Math.floor(Math.sqrt(ennemyRange - Math.pow((2 * c - Math.pow(a, 2)) / (2 * a), 2)));
      }
      var distance1 = (0, _Utils.getDistance2)([this.x, this.y], [x1, y1]);
      var distance2 = (0, _Utils.getDistance2)([this.x, this.y], [x2, y2]);
      if (distance1 < distance2) {
        buster.goTo(x1, y1);
      } else {
        buster.goTo(x2, y2);
      }
    }
  }, {
    key: 'askForHelp',
    value: function askForHelp(buster, needed) {
      var _this7 = this;

      var available = 0;
      var helpers = [];
      var ghost = _MapData.mapData.getGhost(buster.value);
      this.busters.forEach(function (currentBuster) {
        if (available >= needed + 1) {
          return;
        }
        if (currentBuster.state !== 1 && (currentBuster.state !== 2 || currentBuster.value === 1) && (!currentBuster.helping || currentBuster.helpingOn === ghost.id) && currentBuster.id !== buster.id) {
          var distance = (0, _Utils.getDistance2)([currentBuster.x, currentBuster.y], [ghost.x, ghost.y]);
          var nbTurnToGo = Math.ceil((distance - 1760) / 800);
          if (ghost.state - ghost.value * nbTurnToGo > 0 || ghost.state === 0 && needed === 0) {
            helpers.push(currentBuster);
            available++;
          }
        }
      });
      if (available >= needed) {
        helpers.forEach(function (currentBuster) {
          var distance = (0, _Utils.getDistance2)([currentBuster.x, currentBuster.y], [ghost.x, ghost.y]);
          currentBuster.helping = true;
          currentBuster.helpingOn = ghost.id;
          if (distance < 1760 && distance >= 900) {
            currentBuster.bust(ghost.id);
          } else if (distance < 900) {
            _this7.goToBase(currentBuster);
          } else {
            currentBuster.goTo(ghost.x, ghost.y);
          }
        });
        return true;
      }
      return false;
    }
  }, {
    key: 'search',
    value: function search(buster) {
      var _this8 = this;

      if (buster.currentAction === 'IDLE') {
        (function () {
          var minDist = 1000000;
          var closestCell = null;
          var closestCellId = -1;
          _MapData.mapData.grid.forEach(function (cell, index) {
            var distance = (0, _Utils.getDistance2)([buster.x, buster.y], [cell.x, cell.y]);
            if (distance > 2200 && distance < minDist && !cell.noGhost && !cell.searched) {
              closestCell = cell;
              closestCellId = index;
              minDist = distance;
            }
          });
          if (closestCell) {
            closestCell.searched = true;
            buster.goTo(closestCell.x, closestCell.y);
          } else {
            _this8.goToBase(buster, true);
          }
        })();
      }
    }
  }, {
    key: 'goToBase',
    value: function goToBase(buster) {
      var ennemy = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];
      var baseRange = arguments.length <= 2 || arguments[2] === undefined ? 1597 : arguments[2];

      var baseX = ennemy ? this.ennemyX : this.x;
      var baseY = ennemy ? this.ennemyY : this.y;
      var roundFunc = (0, _Utils.roundForBase)(baseX);
      if (buster.x - baseX !== 0) {
        var a = (buster.y - baseY) / (buster.x - baseX);
        var b = buster.y - a * buster.x;
        var A = 1 + Math.pow(a, 2);
        var B = 2 * (a * (b - baseY) - baseX);
        var C = Math.pow(baseX, 2) + Math.pow(b - baseY, 2) - Math.pow(baseRange, 2);
        var delta = Math.pow(B, 2) - 4 * A * C;
        var x1 = roundFunc((-B - Math.sqrt(delta)) / (2 * A));
        var x2 = roundFunc((-B + Math.sqrt(delta)) / (2 * A));
        var y1 = roundFunc(a * x1 + b);
        var y2 = roundFunc(a * x2 + b);
        var distance1 = (0, _Utils.getDistance2)([buster.x, buster.y], [x1, y1]);
        var distance2 = (0, _Utils.getDistance2)([buster.x, buster.y], [x2, y2]);
        if (distance1 < distance2) {
          buster.goTo(x1, y1);
          return distance1;
        }
        buster.goTo(x2, y2);
        return distance2;
      }
      buster.goTo(buster.x, Math.abs(baseY - 1600));
      var distance = (0, _Utils.getDistance2)([buster.x, buster.y], [buster.x, Math.abs(baseY - 1600)]);
      return distance;
    }
  }, {
    key: 'toString',
    value: function toString() {
      return this.busters.map(function (buster) {
        return buster.toString();
      });
    }
  }]);

  return Team;
}();

exports.default = Team;

},{"./Entity":2,"./MapData":3,"./Utils":5}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.getDistance2 = getDistance2;
exports.getDistance = getDistance;
exports.getClosest = getClosest;
exports.getClosestFrom = getClosestFrom;
exports.getSighed = getSighed;
exports.roundForBase = roundForBase;
exports.getCell = getCell;
exports.cleanCoords = cleanCoords;
exports.getNextPos = getNextPos;

var _MapData = require('./MapData');

function getDistance2(_ref, _ref2) {
  var _ref4 = _slicedToArray(_ref, 2);

  var x1 = _ref4[0];
  var y1 = _ref4[1];

  var _ref3 = _slicedToArray(_ref2, 2);

  var x2 = _ref3[0];
  var y2 = _ref3[1];

  return Math.ceil(Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2)));
}

function getDistance(entity1, entity2) {
  return getDistance2([entity1.x, entity1.y], [entity2.x, entity2.y]);
}

function getClosest(entity, entities) {
  var exceptId = arguments.length <= 2 || arguments[2] === undefined ? -1 : arguments[2];
  var exceptState = arguments.length <= 3 || arguments[3] === undefined ? [] : arguments[3];

  var minDist = 100000;
  var closest = null;
  entities.forEach(function (currentEntity) {
    var currentDist = getDistance(entity, currentEntity);
    if (minDist > currentDist && currentEntity.id !== exceptId && exceptState.indexOf(currentEntity.state) === -1) {
      minDist = currentDist;
      closest = currentEntity;
    }
  });
  return {
    closest: closest,
    minDist: minDist
  };
}

function getClosestFrom(buster, ennemies, _ref5) {
  var _ref6 = _slicedToArray(_ref5, 2);

  var baseX = _ref6[0];
  var baseY = _ref6[1];

  var minDist = 100000;
  var closest = null;
  ennemies.forEach(function (ennemy) {
    var currentDist = getDistance(buster, ennemy);
    var distToBase = getDistance2([ennemy.x, ennemy.y], [baseX, baseY]);
    if (currentDist < 1760 && distToBase < minDist && ennemy.state === 3) {
      minDist = currentDist;
      closest = ennemy;
    }
  });
  return {
    closest: closest,
    minDist: minDist
  };
}

function getSighed(entity, entities) {
  var result = [];
  entities.forEach(function (currentEntity) {
    var currentDist = getDistance(entity, currentEntity);
    if (currentDist < 2200) {
      result.push({
        currentEntity: currentEntity,
        currentDist: currentDist
      });
    }
  });
  return result;
}

function roundForBase(baseX) {
  if (baseX === 0) {
    return Math.floor;
  }
  return Math.ceil;
}

function getCell(x, y) {
  var row = Math.floor(x / 2001);
  var column = Math.floor(y / 1501);
  return _MapData.mapData.grid[row + column * 8];
}

function cleanCoords(x, y) {
  var cleanX = x;
  var cleanY = y;
  if (x < 0) {
    cleanX = 0;
  } else if (x > 16000) {
    cleanX = 16000;
  }

  if (y < 0) {
    cleanY = 0;
  } else if (y > 9000) {
    cleanY = 9000;
  }
  return {
    x: cleanX,
    y: cleanY
  };
}

function roundForDest(sourceX, sourceY, destX, destY) {
  var roundX = Math.floor;
  var roundY = Math.floor;
  if (sourceX > destX) {
    roundX = Math.ceil;
  }
  if (sourceY > destY) {
    roundY = Math.ceil;
  }
  return {
    roundX: roundX,
    roundY: roundY
  };
}

function getNextPos(_ref7, _ref8) {
  var _ref10 = _slicedToArray(_ref7, 2);

  var sourceX = _ref10[0];
  var sourceY = _ref10[1];

  var _ref9 = _slicedToArray(_ref8, 2);

  var destX = _ref9[0];
  var destY = _ref9[1];
  var dist = arguments.length <= 2 || arguments[2] === undefined ? 799 : arguments[2];

  var roundFunc = roundForDest(sourceX, sourceY, destX, destY);
  if (sourceX - destX !== 0) {
    var a = (sourceY - destY) / (sourceX - destX);
    var b = sourceY - a * sourceX;
    var A = 1 + Math.pow(a, 2);
    var B = 2 * (a * (b - sourceY) - sourceX);
    var C = Math.pow(sourceX, 2) + Math.pow(b - sourceY, 2) - Math.pow(dist, 2);
    var delta = Math.pow(B, 2) - 4 * A * C;
    var x1 = roundFunc.roundX((-B - Math.sqrt(delta)) / (2 * A));
    var x2 = roundFunc.roundX((-B + Math.sqrt(delta)) / (2 * A));
    var y1 = roundFunc.roundY(a * x1 + b);
    var y2 = roundFunc.roundY(a * x2 + b);
    var distance1 = getDistance2([destX, destY], [x1, y1]);
    var distance2 = getDistance2([destX, destY], [x2, y2]);
    if (distance1 < distance2) {
      return {
        x: x1,
        y: y1
      };
    }
    return {
      x: x2,
      y: y2
    };
  }
  return {
    x: sourceX,
    y: sourceY < destY ? sourceY + 800 : sourceY - 800
  };
}

},{"./MapData":3}],6:[function(require,module,exports){
'use strict';

var _Team = require('./Team');

var _Team2 = _interopRequireDefault(_Team);

var _MapData = require('./MapData');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var bustersPerPlayer = parseInt(readline()); // the amount of busters you control
var ghostCount = parseInt(readline()); // the amount of ghosts on the map
var myTeamId = parseInt(readline()); // if this is 0, your base is on the top left of the map, if it is one, on the bottom right
var myTeam = new _Team2.default(myTeamId);
_MapData.mapData.setGhostsCount(ghostCount);
_MapData.mapData.setMyTeamId(myTeamId);

// game loop
while (true) {
  var entities = parseInt(readline());
  _MapData.mapData.turn++;
  _MapData.mapData.clearInstantData();
  for (var i = 0; i < entities; i++) {
    var inputs = readline().split(' ');
    var entityId = parseInt(inputs[0]);
    var x = parseInt(inputs[1]);
    var y = parseInt(inputs[2]);
    var entityType = parseInt(inputs[3]);
    var state = parseInt(inputs[4]);
    var value = parseInt(inputs[5]);
    if (entityType === myTeamId) {
      myTeam.createOrUpdateBuster(entityId, x, y, entityType, state, value);
    } else {
      _MapData.mapData.addSighedEntity(entityId, x, y, entityType, state, value);
    }
  }
  _MapData.mapData.cleanFalseGhost(myTeam.busters);
  myTeam.updateHasGhost();
  _MapData.mapData.printErr();

  myTeam.makeDecision();
  for (var _i = 0; _i < bustersPerPlayer; _i++) {
    print(myTeam.busters[_i].action);
  }
}

},{"./MapData":3,"./Team":4}]},{},[6]);
