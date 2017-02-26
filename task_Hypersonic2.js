const DEBUG = false;
const TIME_THRESHOLD = 70;

const inputs = readline().split(' ');
const width = parseInt(inputs[0]);
const height = parseInt(inputs[1]);
const myId = parseInt(inputs[2]);

const FLOOR = 'FLOOR';
const BOMB = 'BOMB';
const BOX = 'BOX';
const WALL = 'WALL';
const ITEM = 'ITEM';

const ITEM_RANGE = 'ITEM_RANGE';
const ITEM_BOMB = 'ITEM_BOMB';

let target;
let lastTime = 0;

/* eslint-disable no-unused-vars */
const log = msg => {
    if (!DEBUG) { return; }
    printErr(JSON.stringify(msg));
};

let allInput = [];
const inputRead = () => {
    const str = readline();
    allInput.push(str);
    return str;
};
const inputClear = () => { allInput = []; };
/* eslint-enable no-unused-vars */

const createUser = (owner, x, y, bombs, bombRange) => ({owner, x, y, bombs, bombRange});
const createBomb = (owner, x, y, timer, range) => ({owner, x, y, timer, range});
const createItem = (x, y, type) => ({
    x, y,
    type: type === 1 ? ITEM_RANGE : ITEM_BOMB
});

const getMap = () => {
    const map = [];
    for (let i = 0; i < height; i++) {
        const strRow = inputRead();
        const row = [];

        for (let j = 0; j < width; j++) {
            const s = strRow[j];
            const cell = {
                x: j,
                y: i,
                explodeFrom: []
            };

            if (s === '.') {
                cell.type = FLOOR;
            } else if (s === '0') {
                cell.type = BOX;
            } else if (s === 'X') {
                cell.type = WALL;
            } else if (s === '1') {
                cell.type = BOX;
                cell.item = 1;
            } else if (s === '2') {
                cell.type = BOX;
                cell.item = 2;
            } else {
                log('Undefined cell type: ' + s + ' x: ' + j + ' y: ' + i);
            }

            row.push(cell);
        }

        map.push(row);
    }
    return map;
};

const clamp = (x1, x2, x) => x < x1 ? x1 : (x > x2 ? x2 : x);

const explosiveWave = (map, x, y, range) => {
    const r = range - 1;
    const h = height - 1;
    const w = width - 1;
    const explosians = [];

    const minY = clamp(0, h, y - r);
    const maxY = clamp(0, h, y + r);

    for (let i = y - 1; i >= minY; i--) {
        const p = map[i][x];
        if (p.type === WALL) { break; }
        explosians.push(p);
        if (p.type === ITEM || p.type === BOX) { break; }
    }
    for (let i = y + 1; i <= maxY; i++) {
        const p = map[i][x];
        if (p.type === WALL) { break; }
        explosians.push(p);
        if (p.type === ITEM || p.type === BOX) { break; }
    }

    const minX = clamp(0, w, x - r);
    const maxX = clamp(0, w, x + r);

    for (let i = x - 1; i >= minX; i--) {
        const p = map[y][i];
        if (p.type === WALL) { break; }
        explosians.push(p);
        if (p.type === ITEM || p.type === BOX) { break; }
    }
    for (let i = x + 1; i <= maxX; i++) {
        const p = map[y][i];
        if (p.type === WALL) { break; }
        explosians.push(p);
        if (p.type === ITEM || p.type === BOX) { break; }
    }

    return explosians;
};

const addBomb = (state, bomb) => {
    const {map, bombs} = state;
    const {x, y} = bomb;

    const index = bombs.push(bomb) - 1;
    bomb.index = index;

    map[y][x] = {
        x, y,
        type: BOMB,
        data: index,
        explode: true,
        explodeFrom: [index]
    };
};

const addItem = (state, item) => {
    const {map, items} = state;
    const index = items.push(item) - 1;
    const {x, y} = item;

    map[y][x] = {
        x, y,
        type: ITEM,
        data: index,
        explodeFrom: []
    };
};

const markBombExplodes = (state, bomb) => {
    const {map, bombs} = state;
    const {x, y, range} = bomb;

    const mapCells = explosiveWave(map, x, y, range);
    mapCells.forEach(cell => {
        if (cell.type === BOMB) {
            bombs[cell.data].timer = bomb.timer = Math.min(bombs[cell.data].timer, bomb.timer);
        }

        cell.explode = true;
        cell.explodeFrom.push(bomb.index);
    });
};

const checkPlace = (map, x, y) => {
    if (!map[y] || !map[y][x]) {
        return false;
    }

    const type = map[y][x].type;
    return type !== BOX && type !== BOMB && type !== WALL;
};

const createWave = (state, x, y) => ({
    state,
    closed: {},
    queue: [[{x, y}]]
});

const checkExplode = (state, path, x, y) => {
    const {map, bombs} = state;
    const place = map[y][x];
    if (!place.explode) {
        return false;
    }

    const explodeFrom = place.explodeFrom;
    for (let i = 0; i < explodeFrom.length; i++) {
        const bomb = bombs[explodeFrom[i]];
        if (path.length + 1 === bomb.timer) {
            return true;
        }
    }

    return false;
};

const checkWaveStepPoint = (state, wave, path, x, y) => {
    if (checkPlace(state.map, x, y) && !checkExplode(state, path, x, y)) {
        const newPath = path.slice();
        newPath.push({x, y});
        wave.queue.push(newPath);
    }
};

const wavePointsSort = (a, b) => b.length - a.length;

const waveStep = (state, wave, path) => {
    const point = path[path.length - 1];
    const {x, y} = point;

    checkWaveStepPoint(state, wave, path, x - 1, y);
    checkWaveStepPoint(state, wave, path, x + 1, y);
    checkWaveStepPoint(state, wave, path, x, y - 1);
    checkWaveStepPoint(state, wave, path, x, y + 1);

    wave.queue.sort(wavePointsSort);
};

const waveEnd = (state, wave) => {
    if (wave.queue.length === 0) { return null; }

    const places = [];
    const {closed, queue} = wave;

    while (queue.length !== 0) {
        const path = queue.pop();
        const point = path[path.length - 1];
        const {x, y} = point;

        if (closed[x] && closed[x][y]) {
            continue;
        }

        if (!closed[x]) {
            closed[x] = {};
        }

        closed[x][y] = true;

        const place = {
            x, y,
            distance: path.length,
            path: path.slice()
        };

        places.push(place);

        waveStep(state, wave, path);
    }

    const first = places[0];
    if (!checkPlace(state.map, first.x, first.y) || checkExplode(state, first.path, first.x, first.y)) {
        places.shift();
    }

    return places;
};

const cloneState = state => {
    const st = {};

    const map = state.map;
    const tmap = st.map = [];
    for (let i = 0; i < map.length; i++) {
        const trow = tmap[i] = [];
        const row = map[i];
        for (let j = 0; j < row.length; j++) {
            const cell = row[j];
            trow[j] = {
                x: cell.x,
                y: cell.y,
                explode: cell.explode,
                data: cell.data,
                type: cell.type,
                explodeFrom: cell.explodeFrom.slice()
            };
        }
    }

    const titems = st.items = [];
    const items = state.items;
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        titems[i] = {
            x: item.x,
            y: item.y,
            type: item.type
        };
    }

    const tbombs = st.bombs = [];
    const bombs = state.bombs;
    for (let i = 0; i < bombs.length; i++) {
        const bomb = bombs[i];
        tbombs[i] = {
            x: bomb.x,
            y: bomb.y,
            owner: bomb.type,
            timer: bomb.timer,
            range: bomb.range
        };
    }

    return st;
};

const cellExplodeTimer = (state, cell) => {
    if (!cell.explode) { return Infinity; }
    const {bombs} = state;
    let timer = Infinity;
    cell.explodeFrom.forEach(index => {
        const bombTimer = bombs[index].timer;
        if (timer > bombTimer) {
            timer = bombTimer;
        }
    });
    return timer;
};

const findExplodeAvoidingPath = (state, x, y, stepsToTarget = 0) => {
    const {map} = state;
    const wave = createWave(state, x, y);
    const wavePlaces = waveEnd(state, wave).filter(p => !map[p.y][p.x].explode);
    wavePlaces.sort((a, b) => a.distance - b.distance);

    const avoidingPlaces = [];

    wavePlaces.forEach(place => {
        const placeState = state;
        const {map} = placeState;
        const {path} = place;
        let leftSteps = Infinity;

        for (let i = 0; i < path.length; i++) {
            const {x, y} = path[i];
            const cell = map[y][x];

            if (cell.type === ITEM) {
                return;
            }

            if (!cell.explode) {
                continue;
            }

            const explodeTimer = cellExplodeTimer(placeState, cell);
            if (explodeTimer - 1 - i - stepsToTarget < 0) {
                return;
            }

            leftSteps = Math.min(leftSteps, explodeTimer - 1 - i - stepsToTarget);
        }

        place.leftSteps = leftSteps;
        avoidingPlaces.push(place);
    });

    const result = avoidingPlaces.find(avoidPlace => avoidPlace.leftSteps > 0);

    return result || null;
};

const checkAvoidingPathAfterBomb = (state, x, y, bombRange, stepsToTarget) => {
    state = cloneState(state);
    const bomb = createBomb(myId, x, y, 8, bombRange);
    addBomb(state, bomb);
    markBombExplodes(state, bomb);

    return findExplodeAvoidingPath(state, x, y, stepsToTarget);
};

const searchBoxes = (state, wavePlaces, my, curtar) => {
    const {map} = state;
    const places = [];

    wavePlaces.forEach(wavePlace => {
        const {x, y, distance, path} = wavePlace;

        if (curtar && (x === curtar.x && y === curtar.y)) {
            return;
        }

        const explosians = explosiveWave(map, x, y, my.bombRange);
        const boxExplosians = explosians.filter(p => p.type === BOX && !p.explode);

        if (boxExplosians.length === 0) {
            return;
        }

        places.push({
            x, y, distance,
            explosians: boxExplosians,
            step: path[1] || {x, y},
            path
        });
    });

    places.sort((a, b) => {
        if (my.bombs > 1) {
            return a.distance - b.distance;
        }

        const count = b.explosians.length - a.explosians.length;

        if (count === 0) {
            return a.distance - b.distance;
        }

        return count;
    });

    const result = places.find(place => {
        const {x, y} = place;
        const canAvoid = checkAvoidingPathAfterBomb(state, x, y, my.bombRange, place.path.length - 1);
        return canAvoid;
    });

    return result || null;
};

const searchBombPlace = (state, wavePlaces, my) => {
    const {map} = state;
    const places = [];

    wavePlaces.forEach(wavePlace => {
        const {x, y, distance, path} = wavePlace;
        const explosians = explosiveWave(map, x, y, my.bombRange);

        const place = {
            x, y, distance,
            explosians,
            step: path[1] || {x, y},
            path
        };

        places.push(place);
    });

    places.sort((a, b) => {
        if (my.bombs > 1) {
            return a.distance - b.distance;
        }

        const count = b.explosians.length - a.explosians.length;

        if (count === 0) {
            return a.distance - b.distance;
        }

        return count;
    });

    const result = places.find(place => {
        const {x, y} = place;
        const canAvoid = checkAvoidingPathAfterBomb(state, x, y, my.bombRange, place.path.length - 1);
        return canAvoid;
    });

    return result || null;
};

const searchAvoidPlace = (state, wavePlaces, my) => {
    const places = wavePlaces.slice().sort((a, b) => a.distance - b.distance);
    if (places.length === 0) {
        return null;
    }

    const {x, y, path} = places[0];
    return {
        x, y,
        explosians: [],
        step: path[1] || {x, y}
    };
};

const searchPlace = (state, my, curtar) => {
    if (curtar) {
        const bomb = createBomb(myId, my.x, my.y, 9, my.bombRange);
        addBomb(state, bomb);
        markBombExplodes(state, bomb);
    }

    const wave = createWave(state, my.x, my.y);
    const wavePlaces = waveEnd(state, wave);

    const avodingPlace = findExplodeAvoidingPath(state, my.x, my.y);
    if (avodingPlace && avodingPlace.leftSteps <= 1) {
        const {x, y, path} = avodingPlace;
        return {
            type: 'avoidExplode',
            target: {
                x, y,
                explosians: [],
                step: path[1] || {x, y}
            }
        };
    }

    const boxedPlace = searchBoxes(state, wavePlaces, my, curtar);
    if (boxedPlace) {
        return {
            type: 'boxes',
            target: boxedPlace
        };
    }

    const bombPlace = searchBombPlace(state, wavePlaces, my);
    if (bombPlace) {
        return {
            type: 'bombs',
            target: bombPlace
        };
    }

    const avoidPlace = searchAvoidPlace(state, wavePlaces, my);
    if (avoidPlace) {
        return {
            type: 'avoid',
            target: avoidPlace
        };
    }

    return null;
};

// game loop
while (true) {
    const startTime = Date.now();
    inputClear();

    const state = {
        map: getMap(),
        bombs: [],
        items: [],
        enemies: []
    };

    var my;

    var entities = parseInt(inputRead());
    for (var i = 0; i < entities; i++) {
        const inputs = inputRead().split(' ');
        var entityType = parseInt(inputs[0]);
        var owner = parseInt(inputs[1]);
        var x = parseInt(inputs[2]);
        var y = parseInt(inputs[3]);
        var param1 = parseInt(inputs[4]);
        var param2 = parseInt(inputs[5]);

        if (entityType === 0) {
            if (owner === myId) {
                my = createUser(owner, x, y, param1, param2);
            } else {
                state.enemies.push(createUser(owner, x, y, param1, param2));
            }
        } else if (entityType === 1) {
            const bomb = createBomb(owner, x, y, param1, param2);
            addBomb(state, bomb);
        } else if (entityType === 2) {
            const item = createItem(x, y, param1);
            addItem(state, item);
        }
    }
    state.bombs.map(bomb => markBombExplodes(state, bomb));

    log(allInput);

    const place = searchPlace(state, my);
    if (!place) {
        print('MOVE ' + my.x + ' ' + my.y + ' no target no type');
        continue;
    }

    const type = place.type;
    target = place.target;

    log('bombs: ' + my.bombs + ' range: ' + my.bombRange);

    if (!target) {
        print('MOVE ' + my.x + ' ' + my.y + ' no target ' + type);
        continue;
    }

    if (my.bombs > 0 && target.x === my.x && target.y === my.y) {
        const placeNext = lastTime > TIME_THRESHOLD ? place : searchPlace(state, my, target);

        if (!placeNext) {
            print('MOVE ' + my.x + ' ' + my.y + ' no target no type');
            continue;
        }

        const type = placeNext.type;
        target = placeNext.target;

        if (!target) {
            print('BOMB ' + my.x + ' ' + my.y + ' no target ' + type);
        } else {
            log('explosians count: ' + target.explosians.length);
            print('BOMB ' + target.step.x + ' ' + target.step.y + ' new target ' +
                target.x + ' ' + target.y + ' ' + type);
        }
    } else if (my.bombs === 0) {
        print('MOVE ' + target.step.x + ' ' + target.step.y + ' wait bombs ' +
            target.x + ' ' + target.y + ' ' + type);
    } else {
        log('explosians count: ' + target.explosians.length);
        print('MOVE ' + target.step.x + ' ' + target.step.y + ' move target ' +
            target.x + ' ' + target.y + ' ' + type);
    }

    lastTime = (Date.now() - startTime);

    log('Time: ' + lastTime + 'ms');
}
