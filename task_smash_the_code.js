(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Cell = function () {
  function Cell(x, y, value) {
    _classCallCheck(this, Cell);

    this.x = x;
    this.y = y;
    this.value = value;
  }

  _createClass(Cell, [{
    key: 'isEmpty',
    value: function isEmpty() {
      return this.value === '.';
    }
  }, {
    key: 'toString',
    value: function toString() {
      return this.x + ' ' + this.y + ' ' + this.value;
    }
  }]);

  return Cell;
}();

exports.default = Cell;

},{}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var DEPTH = exports.DEPTH = 4;
var SIZE = exports.SIZE = 20;
var TOURNAMENT_SIZE = exports.TOURNAMENT_SIZE = 1;
var NB_GENERATION = exports.NB_GENERATION = 500;
var MUTATION_RATE = exports.MUTATION_RATE = 0.1;
var NEW_MEMBERS = exports.NEW_MEMBERS = 15;

},{}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getOppositeDirection = getOppositeDirection;
var Directions = exports.Directions = {
  DOWN: 0,
  LEFT: 1,
  UP: 2,
  RIGHT: 3
};

function getOppositeDirection(direction) {
  switch (direction) {
    case Directions.UP:
      return Directions.DOWN;
    case Directions.DOWN:
      return Directions.UP;
    case Directions.RIGHT:
      return Directions.LEFT;
    case Directions.LEFT:
    default:
      return Directions.RIGHT;
  }
}

},{}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Gene = function () {
  function Gene(colorA, colorB) {
    var column = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];
    var rotation = arguments.length <= 3 || arguments[3] === undefined ? null : arguments[3];

    _classCallCheck(this, Gene);

    this.colorA = colorA;
    this.colorB = colorB;
    if (!column) {
      this.column = Math.floor(Math.random() * 6);
    } else {
      this.column = column;
    }
    if (!rotation) {
      this.rotation = Math.floor(Math.random() * 4);
    } else {
      this.rotation = rotation;
    }
    if (this.column === 0 && this.rotation === 2) {
      this.column++;
    } else if (this.column === 5 && this.rotation === 0) {
      this.column--;
    }
  }

  _createClass(Gene, [{
    key: "toString",
    value: function toString() {
      return this.colorA + " " + this.colorB + " " + this.column + " " + this.rotation;
    }
  }]);

  return Gene;
}();

exports.default = Gene;

},{}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Cell = require('./Cell');

var _Cell2 = _interopRequireDefault(_Cell);

var _DirectionEnum = require('./DirectionEnum');

var _Utils = require('./Utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Grid = function () {
  function Grid(rows) {
    var _this = this;

    _classCallCheck(this, Grid);

    this.rows = [];
    rows.forEach(function (row, y) {
      var columns = row.split('');
      _this.rows.push(columns.map(function (cellValue, x) {
        return new _Cell2.default(x, y, cellValue);
      }));
    });
  }

  _createClass(Grid, [{
    key: 'getCell',
    value: function getCell(x, y) {
      if (x >= 6 || x < 0 || y >= 12 || y < 0) {
        return new _Cell2.default(-1, -1, '.');
      }
      return this.rows[y][x];
    }
  }, {
    key: 'getTopCell',
    value: function getTopCell(column) {
      for (var i = 0; i < this.rows.length; i++) {
        var cell = this.rows[i][column];
        if (!cell.isEmpty()) {
          return cell;
        }
      }
      return new _Cell2.default(column, 12, '.');
    }
  }, {
    key: 'clearCell',
    value: function clearCell(x, y) {
      var _this2 = this;

      var currentCell = this.getCell(x, y);
      var currentRow = y;
      var skullCleared = 0;
      while (!currentCell.isEmpty()) {
        if (parseInt(currentCell.value) !== 0) {
          var skulls = this.getAdjacentSkulls(currentCell);
          skullCleared = skulls.length;
          skulls.forEach(function (skull) {
            return _this2.clearCell(skull.x, skull.y);
          });
        }
        var nextCell = this.getCell(x, --currentRow);
        currentCell.value = nextCell.value;
        currentCell = this.getCell(x, currentRow);
      }
      return skullCleared;
    }
  }, {
    key: 'clearCells',
    value: function clearCells(cellsList) {
      var _this3 = this;

      _Utils.Utils.sortCells(cellsList);
      var skullCleared = 0;
      var colorToClear = cellsList[0].value;
      cellsList.forEach(function (cell) {
        if (parseInt(colorToClear) === parseInt(cell.value)) {
          skullCleared += _this3.clearCell(cell.x, cell.y);
        }
      });
      return skullCleared;
    }
  }, {
    key: 'resolve',
    value: function resolve(cell1, cell2) {
      var nbCellsCleared = 0;
      var colorList = [];
      var groupBonus = 0;
      var skullCleared = 0;
      var cell1List = this.getSameAdjacentCells(cell1);
      var cell2List = [];
      var cell2Done = false;
      var scoreParameters = [];
      cell1List.forEach(function (cell) {
        if (!cell2Done && _Utils.Utils.isEqual(cell, cell2)) {
          cell2Done = true;
          return;
        }
      });
      if (!cell2Done) {
        cell2List = this.getSameAdjacentCells(cell2);
      }
      var orderedCellsList = [cell1List, cell2List];
      _Utils.Utils.sortCellsList(orderedCellsList);
      cell1List = orderedCellsList[0];
      cell2List = orderedCellsList[1];

      if (cell1List.length >= 4) {
        nbCellsCleared += cell1List.length;
        groupBonus += _Utils.Utils.computeGroupBonus(cell1List.length);
        _Utils.Utils.addColor(colorList, parseInt(cell1List[0].value));
        skullCleared += this.clearCells(cell1List);
      }
      if (cell2List.length >= 4) {
        nbCellsCleared += cell2List.length;
        groupBonus += _Utils.Utils.computeGroupBonus(cell2List.length);
        _Utils.Utils.addColor(colorList, parseInt(cell2List[0].value));
        skullCleared += this.clearCells(cell2List);
      }
      scoreParameters.push({
        nbCellsCleared: nbCellsCleared,
        skullCleared: skullCleared,
        groupBonus: groupBonus,
        adjacentCells: nbCellsCleared === 0 ? cell1List.length + cell2List.length : 0,
        colorBonus: _Utils.Utils.computeColorBonus(colorList.length)
      });

      if (nbCellsCleared > 0) {
        var stepResult = this.resolveFullBoard();
        while (stepResult.nbCellsCleared > 0) {
          var _stepResult = stepResult;
          nbCellsCleared = _stepResult.nbCellsCleared;
          groupBonus = _stepResult.groupBonus;
          skullCleared = _stepResult.skullCleared;
          colorList = _stepResult.colorList;

          scoreParameters.push({
            nbCellsCleared: nbCellsCleared,
            skullCleared: skullCleared,
            groupBonus: groupBonus,
            adjacentCells: stepResult.adjacentCells,
            colorBonus: _Utils.Utils.computeColorBonus(colorList.length)
          });
          stepResult = this.resolveFullBoard(colorList);
        }
      }
      return scoreParameters;
    }
  }, {
    key: 'resolveFullBoard',
    value: function resolveFullBoard() {
      var _this4 = this;

      var cellsToClear = [];
      var adjacentCells = 0;
      var groupBonus = 0;
      var colorList = [];
      for (var column = 0; column < 6; column++) {
        var currentCell = this.getTopCell(column);
        while (!currentCell.isEmpty()) {
          var cellAlreadyDone = false;
          for (var i = 0; i < cellsToClear.length; i++) {
            if (_Utils.Utils.isCellInList(currentCell, cellsToClear[i])) {
              cellAlreadyDone = true;
              break;
            }
          }
          if (!cellAlreadyDone) {
            var currentCellsList = this.getSameAdjacentCells(currentCell);
            if (currentCellsList.length >= 4) {
              _Utils.Utils.addColor(colorList, parseInt(currentCellsList[0].value));
              groupBonus += _Utils.Utils.computeGroupBonus(currentCellsList.length);
              cellsToClear.push(currentCellsList);
            } else {
              adjacentCells += currentCellsList.length;
            }
          }
          currentCell = this.getCell(column, currentCell.y + 1);
        }
      }
      var nbCellsCleared = 0;
      var skullCleared = 0;
      cellsToClear.forEach(function (cellsList) {
        nbCellsCleared += cellsList.length;
        skullCleared += _this4.clearCells(cellsList);
      });
      return {
        nbCellsCleared: nbCellsCleared,
        groupBonus: groupBonus,
        skullCleared: skullCleared,
        colorList: colorList,
        adjacentCells: adjacentCells
      };
    }
  }, {
    key: 'getSameAdjacentCells',
    value: function getSameAdjacentCells(cell, initialDirection) {
      var _this5 = this;

      var previousCells = arguments.length <= 2 || arguments[2] === undefined ? [] : arguments[2];

      var cellsList = [cell];
      previousCells.push(cell);
      Object.keys(_DirectionEnum.Directions).forEach(function (directionName) {
        var direction = _DirectionEnum.Directions[directionName];
        if (typeof initialDirection === 'undefined' || initialDirection !== direction) {
          var adjacentCell = _this5.getAdjacentCell(cell, direction);
          if (_Utils.Utils.isSameColor(cell, adjacentCell) && !_Utils.Utils.isCellInList(adjacentCell, previousCells)) {
            cellsList.push.apply(cellsList, _toConsumableArray(_this5.getSameAdjacentCells(adjacentCell, (0, _DirectionEnum.getOppositeDirection)(direction), previousCells)));
          }
        }
      });
      return cellsList;
    }
  }, {
    key: 'getAdjacentCell',
    value: function getAdjacentCell(cell, direction) {
      switch (direction) {
        case _DirectionEnum.Directions.DOWN:
          return this.getCell(cell.x, cell.y + 1);
        case _DirectionEnum.Directions.LEFT:
          return this.getCell(cell.x - 1, cell.y);
        case _DirectionEnum.Directions.UP:
          return this.getCell(cell.x, cell.y - 1);
        case _DirectionEnum.Directions.RIGHT:
        default:
          return this.getCell(cell.x + 1, cell.y);
      }
    }
  }, {
    key: 'getAdjacentSkulls',
    value: function getAdjacentSkulls(cell) {
      var _this6 = this;

      var skulls = [];
      Object.keys(_DirectionEnum.Directions).forEach(function (directionName) {
        var direction = _DirectionEnum.Directions[directionName];
        var adjacentCell = _this6.getAdjacentCell(cell, direction);
        if (parseInt(adjacentCell.value) === 0) {
          skulls.push(adjacentCell);
        }
      });
      return skulls;
    }
  }, {
    key: 'putCell',
    value: function putCell(column, value) {
      var topCell = this.getTopCell(column);
      var cell = this.getCell(column, topCell.y - 1);
      cell.value = value;
      return cell;
    }
  }, {
    key: 'putCellBlock',
    value: function putCellBlock(column, color1, color2, rotation) {
      var cell1 = void 0;
      var cell2 = void 0;
      switch (rotation) {
        case 1:
          cell1 = this.putCell(column, color1);
          cell2 = this.putCell(column, color2);
          break;
        case 2:
          cell1 = this.putCell(column, color1);
          if (column > 0) {
            cell2 = this.putCell(column - 1, color2);
          } else {
            return -1;
          }
          break;
        case 3:
          cell1 = this.putCell(column, color2);
          cell2 = this.putCell(column, color1);
          break;
        case 0:
        default:
          cell1 = this.putCell(column, color1);
          if (column < 5) {
            cell2 = this.putCell(column + 1, color2);
          } else {
            return -1;
          }
          break;
      }
      if (cell1.y === -1 || cell2.y === -1) {
        return -1;
      }
      return this.resolve(cell1, cell2);
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
      this.rows.forEach(function (row) {
        return printErr(row.map(function (cell) {
          return cell.value;
        }));
      });
    })
  }]);

  return Grid;
}();

exports.default = Grid;

},{"./Cell":1,"./DirectionEnum":3,"./Utils":8}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Gene = require('./Gene');

var _Gene2 = _interopRequireDefault(_Gene);

var _Grid = require('./Grid');

var _Grid2 = _interopRequireDefault(_Grid);

var _Utils = require('./Utils');

var _Constants = require('./Constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Individu = function () {
  function Individu(rows, blocks) {
    var init = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

    _classCallCheck(this, Individu);

    this.genome = [];
    this.fitness = 0;
    this.rows = rows;
    if (init) {
      for (var i = 0; i < _Constants.DEPTH; i++) {
        var gene = new _Gene2.default(blocks[i].colorA, blocks[i].colorB);
        this.addGene(gene, false);
      }
    }
  }

  _createClass(Individu, [{
    key: 'addGene',
    value: function addGene(gene) {
      var allowMutation = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

      var finalGene = gene;
      if (allowMutation && Math.random < _Constants.MUTATION_RATE) {
        if (Math.random < 0.5) {
          finalGene = new _Gene2.default(gene.colorA, gene.colorB, gene.column);
        } else {
          finalGene = new _Gene2.default(gene.colorA, gene.colorB, null, gene.rotation);
        }
        this.fitness = 0;
      }
      this.genome.push(finalGene);
    }
  }, {
    key: 'getFitness',
    value: function getFitness() {
      var _this = this;

      if (this.fitness > 0) {
        return this.fitness;
      }
      var grid = new _Grid2.default(this.rows);
      var fitness = 0;
      var loosingPlay = false;
      this.genome.forEach(function (gene, index) {
        if (loosingPlay) {
          return;
        }
        var scoreParameters = grid.putCellBlock(gene.column, gene.colorA, gene.colorB, gene.rotation);
        if (scoreParameters === -1) {
          loosingPlay = true;
          return;
        }
        var stepScore = _Utils.Utils.computeScore(scoreParameters);
        if (index === 0) {
          _this.nextScore = stepScore;
        }
        var highestNewRow = grid.getTopCell(gene.column).y;
        var topCell2 = void 0;
        if (gene.rotation === 0) {
          topCell2 = grid.getTopCell(gene.column + 1);
        } else if (gene.rotation === 2) {
          topCell2 = grid.getTopCell(gene.column - 1);
        }
        if (topCell2) {
          highestNewRow += topCell2.y;
        }
        var skullCleared = 0;
        var adjacentCells = 0;
        scoreParameters.forEach(function (scoreParameter) {
          skullCleared += scoreParameter.skullCleared;
          adjacentCells += scoreParameter.adjacentCells;
        });
        var compareTo = stepScore / (2 * Math.max(1, index + 1)) + 10 * skullCleared + 20 * adjacentCells;
        fitness += compareTo;
      });
      this.fitness = fitness;
      this.finalGrid = grid;
      return this.fitness;
    }
  }, {
    key: 'shiftBlocks',
    value: function shiftBlocks(blocks, rows) {
      this.rows = rows;
      this.fitness = 0;
      this.genome.shift();
      this.addGene(new _Gene2.default(blocks[_Constants.DEPTH - 1].colorA, blocks[_Constants.DEPTH - 1].colorB), false);
    }
  }, {
    key: 'toString',
    value: function toString() {
      return this.genome.map(function (gene) {
        return gene.toString();
      });
    }
  }, {
    key: 'printStepByStep',
    value: function printStepByStep() {
      var grid = new _Grid2.default(this.rows);
      grid.printErr();
      this.genome.forEach(function (gene) {
        var step = grid.putCellBlock(gene.column, gene.colorA, gene.colorB, gene.rotation);
        printErr('Score : ', step === -1 ? step : _Utils.Utils.computeScore(step));
        grid.printErr();
      });
    }
  }, {
    key: 'toPrint',
    value: function toPrint() {
      return this.genome[0].column + ' ' + this.genome[0].rotation;
    }
  }]);

  return Individu;
}();

exports.default = Individu;

},{"./Constants":2,"./Gene":4,"./Grid":5,"./Utils":8}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Individu = require('./Individu');

var _Individu2 = _interopRequireDefault(_Individu);

var _Gene = require('./Gene');

var _Gene2 = _interopRequireDefault(_Gene);

var _Utils = require('./Utils');

var _Grid = require('./Grid');

var _Grid2 = _interopRequireDefault(_Grid);

var _Constants = require('./Constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Population = function () {
  function Population(blocks, rows) {
    var init = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

    _classCallCheck(this, Population);

    if (init) {
      this.rows = rows;
      this.blocks = blocks;
      this.individus = [];
      for (var i = 0; i < _Constants.SIZE; i++) {
        this.individus.push(new _Individu2.default(rows, blocks, true));
      }
    }
  }

  _createClass(Population, [{
    key: 'evolve',
    value: function evolve() {
      var nextGeneration = [];
      nextGeneration.push(this.getFittest());
      for (var i = 1; i < _Constants.SIZE - _Constants.NEW_MEMBERS; i++) {
        var mate1 = this.tournamentSelection();
        var mate2 = this.tournamentSelection();
        nextGeneration.push(this.crossover(mate1, mate2));
      }
      for (var _i = 0; _i < _Constants.NEW_MEMBERS; _i++) {
        nextGeneration.push(new _Individu2.default(this.rows, this.blocks, true));
      }

      this.individus = nextGeneration;
    }
  }, {
    key: 'tournamentSelection',
    value: function tournamentSelection() {
      var tournamentIndividus = [];
      for (var i = 0; i < _Constants.TOURNAMENT_SIZE; i++) {
        tournamentIndividus.push(this.individus[Math.floor(Math.random() * _Constants.SIZE)]);
      }
      var tournament = new Population();
      tournament.individus = tournamentIndividus;
      return tournament.getFittest();
    }
  }, {
    key: 'crossover',
    value: function crossover(mate1, mate2) {
      var child = new _Individu2.default(this.rows);
      var grid1 = new _Grid2.default(this.rows);
      var grid2 = new _Grid2.default(this.rows);
      mate1.genome.forEach(function (gene1, index) {
        var gene2 = mate2.genome[index];
        var scoreParameters1 = grid1.putCellBlock(gene1.column, gene1.colorA, gene1.colorB, gene1.rotation);
        var scoreParameters2 = grid2.putCellBlock(gene2.column, gene2.colorA, gene2.colorB, gene2.rotation);
        if (scoreParameters1 === -1 && scoreParameters2 === -1) {
          child.addGene(new _Gene2.default(gene1.colorA, gene1.colorB));
        } else if (scoreParameters1 === -1) {
          child.addGene(new _Gene2.default(gene2.colorA, gene2.colorB, gene2.column, gene2.rotation));
        } else if (scoreParameters2 === -1) {
          child.addGene(new _Gene2.default(gene1.colorA, gene1.colorB, gene1.column, gene1.rotation));
        } else {
          var stepScore1 = _Utils.Utils.computeScore(scoreParameters1);
          var stepScore2 = _Utils.Utils.computeScore(scoreParameters2);
          if (stepScore1 > stepScore2) {
            child.addGene(new _Gene2.default(gene1.colorA, gene1.colorB, gene1.column, gene1.rotation));
          } else {
            child.addGene(new _Gene2.default(gene2.colorA, gene2.colorB, gene2.column, gene2.rotation));
          }
        }
      });
      return child;
    }
  }, {
    key: 'shiftBlocks',
    value: function shiftBlocks(blocks, rows) {
      this.blocks = blocks;
      this.rows = rows;
      this.individus.forEach(function (individu) {
        individu.shiftBlocks(blocks, rows);
      });
    }
  }, {
    key: 'getFittest',
    value: function getFittest() {
      var fittest = void 0;
      var previousFitness = 0;
      this.individus.forEach(function (individu) {
        if (!fittest || previousFitness < individu.getFitness()) {
          fittest = individu;
          previousFitness = fittest.getFitness();
        }
      });
      return fittest;
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
      this.individus.forEach(function (individu) {
        return printErr(individu.toString());
      });
    })
  }]);

  return Population;
}();

exports.default = Population;

},{"./Constants":2,"./Gene":4,"./Grid":5,"./Individu":6,"./Utils":8}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
function addColor(colorList, color) {
  if (colorList.indexOf(color) === -1) {
    colorList.push(color);
  }
}

function isSameColor(cell1, cell2) {
  return parseInt(cell1.value) !== 0 && parseInt(cell1.value) === parseInt(cell2.value);
}

function isBothSkull(cell1, cell2) {
  return parseInt(cell1.value) === 0 && parseInt(cell1.value) === parseInt(cell2.value);
}

function isEqual(cell1, cell2) {
  return cell1.x === cell2.x && cell1.y === cell2.y;
}

function isCellInList(cell, cellsList) {
  var cellFound = false;
  cellsList.forEach(function (currentCell) {
    if (isEqual(cell, currentCell)) {
      cellFound = true;
    }
  });
  return cellFound;
}

function computeGroupBonus(nbCells) {
  if (nbCells < 11) {
    return nbCells - 4;
  }
  return 8;
}

function computeColorBonus(nbColors) {
  if (nbColors > 1) {
    return Math.pow(2, nbColors - 1);
  }
  return 0;
}

function computeScore(scoreParameters) {
  var score = 0;
  scoreParameters.forEach(function (scoreParameter, index) {
    var chainPower = index === 0 ? 0 : 8 * Math.pow(2, index - 1);
    var colorBonus = scoreParameter.colorBonus;
    var groupBonus = scoreParameter.groupBonus;
    var nbCellsCleared = scoreParameter.nbCellsCleared;

    var scoreMultiplier = colorBonus + chainPower + groupBonus;
    scoreMultiplier = Math.max(scoreMultiplier, 1);
    scoreMultiplier = Math.min(scoreMultiplier, 999);
    score += nbCellsCleared * 10 * scoreMultiplier;
  });
  return score;
}

function sortCells(cellsList) {
  cellsList.sort(function (cell1, cell2) {
    if (cell1.y < cell2.y) {
      return -1;
    }
    return 1;
  });
}

function sortCellsList(cellsList) {
  cellsList.sort(function (cellsList1, cellsList2) {
    sortCells(cellsList1);
    sortCells(cellsList2);
    if (cellsList2.length === 0 || cellsList1[0].y < cellsList2[0].y) {
      return -1;
    }
    return 1;
  });
}

var Utils = exports.Utils = {
  addColor: addColor,
  isSameColor: isSameColor,
  isBothSkull: isBothSkull,
  isEqual: isEqual,
  sortCells: sortCells,
  sortCellsList: sortCellsList,
  isCellInList: isCellInList,
  computeGroupBonus: computeGroupBonus,
  computeColorBonus: computeColorBonus,
  computeScore: computeScore
};

},{}],9:[function(require,module,exports){
'use strict';

var _Population = require('./Population');

var _Population2 = _interopRequireDefault(_Population);

var _Constants = require('./Constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var population = void 0;
var score = 0;
while (true) {
  var blocks = [];
  for (var _i = 0; _i < 8; _i++) {
    var inputs = readline().split(' ');
    blocks.push({
      colorA: parseInt(inputs[0]), // color of the first block
      colorB: parseInt(inputs[1]) // color of the attached block
    });
  }
  var rows = [];
  for (var _i2 = 0; _i2 < 12; _i2++) {
    rows.push(readline());
  }
  var enemyRows = [];
  for (var _i3 = 0; _i3 < 12; _i3++) {
    enemyRows.push(readline());
  }
  var start = new Date();

  if (!population) {
    population = new _Population2.default(blocks, rows, true);
  } else {
    population.shiftBlocks(blocks, rows);
  }
  var fittest = population.getFittest();
  printErr(fittest.toString(), fittest.getFitness(), fittest.nextScore);
  var i = 0;
  var timer = 0;
  var maxStepTime = 0;
  var previousStepTime = start;
  while (timer < 100 - (maxStepTime + 22) && i < _Constants.NB_GENERATION && !(fittest.nextScore / 70 + score / 70 % 6 > 17)) {
    population.evolve();
    fittest = population.getFittest();
    var stepTime = new Date().getTime() - previousStepTime.getTime();
    if (maxStepTime < stepTime) {
      maxStepTime = stepTime;
    }
    timer = new Date().getTime() - start.getTime();
    i++;
    previousStepTime = new Date();
  }

  var end = new Date();
  printErr('Duration : ', end.getTime() - start.getTime(), 'generations : ', i);
  printErr(fittest.toString(), fittest.getFitness(), fittest.nextScore);
  score += fittest.nextScore;
  print(fittest.toPrint());
}

},{"./Constants":2,"./Population":7}]},{},[9]);
