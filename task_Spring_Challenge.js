const ROCK = 'ROCK';
const PAPER = 'PAPER';
const SCISSORS = 'SCISSORS';
const DEAD = 'DEAD';
const TYPES = [ROCK, PAPER, SCISSORS]; 

const MOVE = "MOVE";
const SWITCH = "SWITCH";
const SPEED = "SPEED";
const STOP = "STOP";


const CHANGE_DIST_TRESH = 1;
const CHASE_DIST_TRESH = 1;
const FLIGHT_DIST_TRESH = 2;
const CLOSE_SUPER_TRESH = 3;
const SPEED_DIST_TRESH = 1;
const VISIBLE_PELLET_BOOST = 2;
const SPEED_CLOSE_PENALTY = 5;
const MAX_NORMED_DISTANCE = 20;
const FLOOD_DEPTH = 10;
const PRIMARY_FLOOD_METRIC = 'score';
const SECONDARY_FLOOD_METRIC = PRIMARY_FLOOD_METRIC == 'score' ? 'averageScore' : 'score';

const SUPER_PELLET_SCORE = 10;

const NOT_SEEN_DECAY = 0.98;
const FUTURE_DECAY = 0.98;

const FLOOR = " ";
const WALL = "#";
const PELLET = ".";
const SUPER_PELLET = "*";
const GLOBAL_PELLET = "+";

const B64 = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ\/_";

const S ={ pac: [], round: 0, enemy:[], superPellets:[], pellets:[] };

const MOVES = [];
MOVES.push(f => ({x: (f.x+1)%S.width, y:f.y}));
MOVES.push(f => ({x: f.x, y:f.y+1}));
MOVES.push(f => ({x: (f.x-1+S.width) % S.width, y:f.y}));
MOVES.push(f => ({x: f.x, y:f.y-1}));


readMaze();
const MAX_D = S.width + S.height;
const MAX_D_HALF = Math.ceil(MAX_D/2);

// game loop
while (true) {
	readRound();
	printMap(S.maze);
	// Write an action using console.log()
	// To debug: console.error('Debug messages...');
	//console.error(S.pac);
	
	processOrders();
	
	console.log(getOrders());
	S.round++;
}

function getOrders() {
	console.error(S.pac.map(p => ({o: p.order, e: p.orders})));
	
	return S.pac.filter(p => p.order != STOP).map(p => p.order + ' ' + p.id + ' ' + p.orders[p.order]).join('|');
}

function processOrders() {
	//chase vs run
	printPacs("Start")
	flightOrFight();
	printPacs("post flightOrFight");
	pickSuperPellets();
	printPacs("post pickSuperPellets")
//	
	floodPickPellet();
	printPacs("post flood pick Pellet")

    pickPellet();
    printPacs("post pick Pellet")	
    stalledFix();
	printPacs("post stalled fix")
}

function flightOrFight() {
	S.pac.forEach(p => {
		//printMap(S.dist[p.x][p.y],"Pac:"+p.id, false);
		
		let e = closest(p, S.enemy);
		p.closest = e;		
		p.enemyClosing = p.closest && p.lastClosest && p.closest.id == p.lastClosest.id && dist(p, p.lastClosest) > dist(p, p.closest);
	
		console.error(["CLOSEST", p.id, e && e.id,e && e.abilityCooldown, e && e.speedTurnsLeft, p.enemyClosing]);
		processSwitch(p, e) || processChase(p, e) || processFlight(p, e) ||processSpeed(p, e) ;
	});
}

function processSwitch(p, e) {
	if (p.abilityCooldown != 0) return
	if (!e || dist(p, e) > CHANGE_DIST_TRESH * (e.speedTurnsLeft > 0 ? 2 :1)) return;

	let t = better(e.typeId);
	if (t == p.typeId) return;

	p.order = SWITCH;
	p.orders[SWITCH] = t;
	p.state = "SWITCH TO FIGHT"
	return true;
}

function processChase(p, e) {	
	if (!e || dist(p, e) > CHASE_DIST_TRESH ) return; 
	console.error(["COULD CHASE", p.id, e.id, e.abilityCooldown == 0, (p.abilityCooldown != 0 && p.typeId != better(e.typeId)), !p.enemyClosing]);
	if (e.abilityCooldown == 0 || (p.abilityCooldown != 0 && p.typeId != better(e.typeId)) || !p.enemyClosing) return;
		
	move(p, e);
	return true;
}

function processFlight(p, e) {	
	if (!e || dist(p, e) > FLIGHT_DIST_TRESH * (e.speedTurnsLeft > 0 ? 2 :1) ) return; 
	
	console.error(["COULD FLIGHT", p.id, e.id, e.typeId != better(p.typeId), e.abilityCooldown == 0]);
	if (e.typeId != better(p.typeId) && e.abilityCooldown != 0) return;
		
	
	let t = MOVES
	        .map(m => m(p))
	        .filter(p => safeValue(S.maze, p) == FLOOR)
	        .map(p => ({p:p, ed: dist(p, e)}))
	        .reduce((a,v) => a.ed >= v.ed ? a : v,{p:p, ed:1}).p;

	move(p, t);
	return true;
}

function processSpeed(p, e) {	
	if (e && dist(p, e) < SPEED_DIST_TRESH) return; 
	if (p.abilityCooldown != 0) return;
		
	p.order = SPEED;
	p.orders[SPEED] = "";
	
	return true;
}

function pickSuperPellets() {
	let pacs = S.pac.filter(p => !p.order);
	const pellets = Array.from(S.superPellets);

	S.allSuperPellets.forEach(pe => pacs.forEach(pa => dist(pa, pe) < CLOSE_SUPER_TRESH && move(pa, pe)));
    pacs = S.pac.filter(p => !p.order);

    console.error(pellets);
	
	if (pacs.length == 0 || pellets.length == 0) return;
	
	const dists = [];
	pacs.forEach(pa => { 
		d = [];
		pellets.forEach(pe => {
			d.push(dist(pa, pe));
		});
		dists.push(d);
	});
	
	//console.error(pacs, pellets, dists);
	
	while (dists[0] && dists[0].length > 0) {
		let best = {val: 2* MAX_D};

		dists.forEach((line, pai) => {
			line.forEach((val, pei) => {
				if (val < best.val) {
					best.pai = pai;
					best.pei = pei;
					best.val = val;
				}
			});
		});
		
		move(pacs[best.pai], pellets[best.pei]);
		pacs.splice(best.pai,1);
		pellets.splice(best.pei,1);
		
		dists.forEach(line=> line.splice(best.pei,1));
		dists.splice(best.pai, 1);
	}
	
}

function floodPickPellet() { 
	if (!S.pac.some(p => !p.order)) return;
  
  const mp = copy(S.maze);
  let debug = copy(S.maze);
  const next = [];
 
	
	S.globalPellets.forEach(p => {
	    mp[p.x][p.y] = 1;
	});
	S.pellets.forEach(p => mp[p.x][p.y] += VISIBLE_PELLET_BOOST);

	//console.error(S.globalPellets.map(p => 1).join(""));;
  
  printMap(mp ,"MP", false);
  S.pac.concat([]).forEach(p=> next.push(mp[p.x][p.y] = { id: p.uid, score:0, averageScore:0, d:0, x: p.x, y: p.y}));
  
  const best = {};
  next.forEach(b => best[b.id] = b);
  
  while (n = next.shift()) { 
   // if (n.id == 0) console.error(["processing:", n.id, ",averageScore:",n.averageScore, ",score:",n.score, ",d:", n.d,",", n.x, ":",n.y].join(""));
	debug[n.x][n.y] = (n.d == 0 ? ("" + n.id).slice(-1) : B64[Math.floor(n[PRIMARY_FLOOD_METRIC])+9]);
	const lb = best[n.id];

	if (n[PRIMARY_FLOOD_METRIC] > lb[PRIMARY_FLOOD_METRIC] || ( n[PRIMARY_FLOOD_METRIC] == lb[PRIMARY_FLOOD_METRIC] && n[SECONDARY_FLOOD_METRIC] > lb[SECONDARY_FLOOD_METRIC])) best[n.id] = n;
		
	if (n.d > FLOOD_DEPTH) continue;
    
    forEachMove(mp, n, (m, coord) => {
		if (m == FLOOR) m = 0;
		if (typeof m != typeof NaN ) return;

		let v = {
		    id: n.id,
		    score: n.score + m * Math.pow(FUTURE_DECAY, n.d),
		    averageScore: ((n.averageScore * n.d) + m)/(n.d+1),
		    d: n.d+1,
		    prev: n,
		    x: coord.x,
		    y: coord.y
        }
		next.push(v);
		return v; 
	});
  }
  
  		
	printMap(debug ,"FILL", false);
  
  S.pac.filter(p => !p.order).forEach(p => {
	  let b = best[p.uid];
	  if (b[PRIMARY_FLOOD_METRIC] == 0) return;
	  while (b.d > 2) {
		  b = b.prev;
	  }
	  console.error(["BEST:",b.id, ",averageScore:", b.averageScore, ",score:", b.score ,",d:", b.d," final score:",best[p.uid].score,",d:",best[p.uid].d,",", coord(b), "prev:", coord(b.prev) ].join(""));


	 move(p, b);
  });

}

function pickPellet() {

	let mp = copy(S.maze);
	S.globalPellets.forEach(p => {
	    mp[p.x][p.y] = p;
	    p.dv = 1;
	});


//	S.globalPellets.forEach(p => {
//	    MOVES.forEach(m => {
//	        let sf = safeValue(mp, m(p), "dv");
//	        let nor = numberOrZero(sf)
//	        p.dv += nor;
//	        console.error([p.x, p.y, sf, nor, m(p)])
//	    });
//	});

	S.globalPellets.forEach(p => {
        MOVES.forEach(m => {
            p.dv += numberOrZero(safeValue(mp, m(p), "value"));
        });
    });
	
	S.pellets.forEach(p => mp[p.x][p.y].dv += VISIBLE_PELLET_BOOST);

  //  S.globalPellets.forEach(p => p.dv = mp[p.x][p.y]);

	S.pac.forEach(pa => {
		if (pa.order == MOVE) {
			console.error(['not here', pa.next.x, pa.next.y])
		    S.globalPellets.forEach(pe => pe.dv += norm(dist(pe, pa.next)));
		} 
	});

        let m = copy(S.maze);
		S.globalPellets.forEach(pe => m[pe.x][pe.y] = B64[pe.dv]);
		S.pac.forEach(p => m[p.x][p.y] = p.id);
		S.pac.filter(p => p.order == MOVE).forEach(p =>m[p.next.x][p.next.y] = "X");
		printMap(m ,"DVS", false);

	S.pac.forEach(p => {
		if (p.order) return;

		m = copy(S.maze);
//		S.globalPellets.forEach(pe => m[pe.x][pe.y] = B64[pe.dv]);
//		m[p.x][p.y] = "@"
//		S.pac.filter(p => p.order == MOVE).forEach(p =>m[p.next.x][p.next.y] = "X");
//		printMap(m ,p.id + ":dvs", false);


		
		//console.error(["Pelets count", S.globalPellets.length]);
		let best = S.globalPellets
			.filter(p => !S.pac.some(s => s.next == p))
			.reduce(
				(a,v) => {
					v.rv = v.dv - dist(p,v) * 1.1- ((p.speedTurnsLeft > 0 && dist(p,v) == 1) ? SPEED_CLOSE_PENALTY : 0);
					return a.rv > v.rv ? a : v;
				},{
					x: Math.floor(Math.random()*S.width),
					y: Math.floor(Math.random()*S.height), 
					rv: -1024000
				}
			);
		
//		S.globalPellets.forEach(pe => m[pe.x][pe.y] = B64[Math.floor(pe.rv)]);
//		m[p.x][p.y] = "@"
//		S.pac.filter(p => p.order == MOVE).forEach(p =>m[p.next.x][p.next.y] = "X");
//		printMap(m ,p.id + ":rvs", false);
			
		move(p, best);
		console.error(['pellet picked',p.id, best.x +":"+best.y, best.dv, best.rv, dist(p,best)]);
		S.globalPellets.forEach(pe => pe.dv += norm(dist(pe, best)));
	});	
	
	
	tradeTargets();
}

function norm(d) {
	return Math.min(d, MAX_NORMED_DISTANCE);
}

function tradeTargets() {
	S.pac.forEach(() => {		
		S.pac.forEach(p1 => {
			S.pac.forEach(p2 => {
				if (p1.order == MOVE && p2.order == MOVE) {
					if (dist(p1, p1.next) + dist(p2, p2.next) > dist(p1, p2.next) + dist(p2, p1.next)) {
						let tn = p1.next
						let tc = p1.orders[MOVE];
						
						p1.next = p2.next;
						p1.orders[MOVE] = p2.orders[MOVE];
						
						p2.next = tn;
						p2.orders[MOVE] = tc;					
					}
				}
			});
		});
	});

}


function stalledFix() {
	p = S.pac.filter(p => (p.order == 'MOVE' && p.stalled))[0]
	if (p) {
		p.order = STOP;
	}
}

function remedy(p) {
	console.error(["No target",p]);
	p.next = {x: 0, y:0};
}

function dist(a, b) {
	if (!a || !b ) console.error(["NO DISTANCE",a,b]);
	
	return S.dist[a.x][a.y][b.x][b.y];
	// let dx = Math.abs(a.x - b.x);
	// let dy = Math.abs(a.y - b.y);
	
	// if (dx > S.widthHalf) dx = S.width - dx;	
	
	// console.error(['DIST', a.x, a.y, b.x, b.y, dx + dy]);
	// return dx + dy;
} 

function readRound() {
	var inputs = readline().split(' ');
	S.myScore = parseInt(inputs[0]);
	S.opponentScore = parseInt(inputs[1]);

	const firstRound = S.round == 0;

	readPacs(firstRound);
	readPellets(firstRound);

    if (firstRound) removeSuperPelletsForEnemy();

}

function readPacs(firstRound) {
	const newPac = []
	const newEnemy = []

	const visiblePacCount = parseInt(readline()); // all your pacs and enemy pacs in sight
	for (let i = 0; i < visiblePacCount; i++) {
		var inputs = readline().split(' ');
		const pacId = parseInt(inputs[0]);
		const mine = inputs[1] !== '0';
		const x = parseInt(inputs[2]);
		const y = parseInt(inputs[3]);
		const typeId = inputs[4];
		const speedTurnsLeft = parseInt(inputs[5]);
		const abilityCooldown = parseInt(inputs[6]);

		if (typeId == DEAD) continue;

		let p = (mine ? newPac : newEnemy)[pacId] = {
			id: pacId,
			x: x,
			y: y,
			mine: mine,
			uid: pacId + (mine ? 0 : 10),
			typeId: typeId,
			speedTurnsLeft: speedTurnsLeft,
			abilityCooldown: abilityCooldown,
			stalled: S.pac[pacId] && S.pac[pacId].order == MOVE && S.pac[pacId].x == x && S.pac[pacId].y == y,
			lastClosest: S.pac[pacId] && S.pac[pacId].closest,
			orders: {}
		};

		if (mine) removeGlobalPelletView(p);
		if (firstRound) removeGlobalPellet(mirror(p));

	}

	S.pac = newPac;
	S.enemy = newEnemy;
}

function readPellets(firstRound) {
	S.pellets = [];
	S.allSuperPellets =[];

    S.globalPellets.forEach(p => p.v *= NOT_SEEN_DECAY);

	const superToKeep = [];

	const visiblePelletCount = parseInt(readline()); // all pellets in sight
	for (let i = 0; i < visiblePelletCount; i++) {
		var inputs = readline().split(' ');
		const x = parseInt(inputs[0]);
		const y = parseInt(inputs[1]);
		const value = parseInt(inputs[2]); // amount of points this pellet is worth

		let p = {x: x, y:y, v: value, ev: value};

		if (value == SUPER_PELLET_SCORE) {

			if (firstRound) {
			    removeGlobalPellet(p);
			    S.superPellets.push(p);
			} else {
			    superToKeep.push(p);
			}

			if (S.round > 5 && !S.globalPellets.some((x1,y1) => x1 == x && y1 == y)) {
			    S.globalPellets.push(p);
			}

			S.allSuperPellets.push(p);

		} else {
		    S.pellets.push(p);
			//S.globalPellets.filter(({x,y}) => p.x==x && p.y ==y).forEach(pe => pe.v = value);
			S.globalPellets.push(p);
		}

	}
	if (!firstRound) {
	    S.superPellets = S.superPellets.filter(p => superToKeep.some(({x,y}) => p.x == x && p.y == y));
	}
	//printMap(S.maze, "After load", true);
}

function removeGlobalPelletView(p) {
	removeGlobalPellet(p);
	MOVES.forEach(m => {
		for (let t = p; S.maze[t.x][t.y] != WALL && (t.x != p.x || t.y != p.y || t == p); t = m(t)) {
			removeGlobalPellet(t);
		}		
	}); 
}

function removeGlobalPellet(p) {
	S.globalPellets = S.globalPellets.filter(({x,y}) => p.x != x || p.y != y);			
}

function removeSuperPelletsForEnemy() {
    const all = S.pac.concat(S.enemy);

    S.superPellets = S.superPellets.filter(pe => {
        let v = closest(pe, all).mine;
        console.error("Keeping super pellet", pe, v);
        return v;
    });
}

function readMaze() {
	var inputs = readline().split(' ');
	S.width = parseInt(inputs[0]); // size of the grid
	S.widthHalf = S.width/2;
	S.height = parseInt(inputs[1]); // top left corner is (x=0, y=0)
	S.maxD = S.width + S.height;

	S.maze = [];
	S.globalPellets = [];
	S.dist = [];
	
	for (let x = 0; x < S.width; ++x) {
		S.maze.push([].fill(" ", 0 , S.height));
	}

	for (let i = 0; i < S.height; i++) {
		const row = readline(); // one line of the grid: space " " is floor, pound "#" is wall
		
		for (let x = 0; x < S.width; ++x) {
			const t = row[x];
			S.maze[x][i] = t;
			if (t == FLOOR) S.globalPellets.push({
				x: x,
				y: i,
				v: 1,
				ev: 1
			});
		}
	}
	printMap(S.maze, "After maze load", true);

	computeDistances();
}

function computeDistances() {
	for (let x = 0; x < S.width; ++x) {
		let a = []
		S.dist.push(a);
		for (let y = 0; y < S.height; ++y) {
			a.push(copy(S.maze));	
		}
	}

	S.dist.forEach((line,x) => {
		line.forEach((m,y) => {
			//console.error(["Computing",x,y, m[x][y]]);
			
			if (m[x][y] == FLOOR) {
				const next = [{x: x, y:y, v:0}];
				let f;
				while(f = next.shift()) {
					if (m[f.x] && m[f.x][f.y] && m[f.x][f.y] == FLOOR) {
						m[f.x][f.y] = f.v;
						
						next.push({x: (f.x+1)%S.width, y:f.y, v:f.v+1});
						next.push({x: f.x, y:f.y+1, v:f.v+1});
						next.push({x: (f.x-1+S.width) % S.width, y:f.y, v:f.v+1});
						next.push({x: f.x, y:f.y-1, v:f.v+1});
					}
				}
			}
		}); 
	});
}

function closest(t, others){
	if (!others || others.length == 0) return;
	
	return others.reduce((a,v) => dist(t,a) < dist(t,v) ? a : v);
}

function better(e) {
	return TYPES[(TYPES.indexOf(e) + 1) % TYPES.length];
}

function printMap(map, description, enrich = true){
	if (description) console.error(description);

	const m = (enrich) ? copy(map) : map;
	if (enrich) {
		S.globalPellets.forEach(p => m[p.x][p.y] = GLOBAL_PELLET);
		S.pac.concat(S.enemy).forEach(p => m[p.x][p.y] = p.id);
		S.pellets.concat(S.superPellets).forEach(p => m[p.x][p.y] = p.ev == SUPER_PELLET_SCORE ? SUPER_PELLET : (m[p.x][p.y]!= GLOBAL_PELLET ? "!" : PELLET));
	}
	
	m[0].map((col, i) => m.map(row => row[i]))
		.forEach((row) => console.error(row.map(s =>  typeof s == typeof NaN ? B64[Math.floor(s)] : (""+s).slice(-1)).join("")));
}

function copy(old, inplace = []){
	inplace.splice(0);
	inplace.push.apply(inplace, old.map(a => a.slice(0)));
	return inplace;
}


function coord(p) {
    if (!p) return "N/A";

	return p.x + " " + p.y;
}

function move(p, t) {
	p.order = MOVE;
	p.orders[MOVE] = coord(t);
	p.next = t;
}

function mirror(p) {
	return {
	y: p.y,
	x: ( -1 * (p.x - S.widthHalf) + S.widthHalf) -1
	}
}

function printPacs(description, enemies = false) {
	if (description) console.error(description);
	S.pac.concat(enemies ? S.enemy : []).map(p => (p.mine ? "F" : "E") + p.id + ":[" + p.x +","+p.y+"]" + p.order + ':'+p.orders[p.order]).forEach(p => console.error(p))
}

function safeValue(map, coord, prop) {
    if (!map || !map[coord.x]) return
    let v = map[coord.x][coord.y];

    if (v == undefined) return;
    return prop ? v[prop] : v;

}

function numberOrZero(v) {
    return typeof v == typeof 0 ? v : 0;
}

function forEachMove(map, from, callback) {
  MOVES.forEach(m => {
    let p = m(from);
    let v = safeValue(map, p);
	if (v) {
		let r = callback(v, p);
		if (r) map[p.x][p.y] = r;
	}
  });
}