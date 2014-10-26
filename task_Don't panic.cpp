enum {
  NONE, ELEVETOR, EXIT
};

enum {
  LEFT, RIGHT, TOP, BOTTOM
};
const int DX[] = { -1, 1, 0, 0 };
const int DY[] = { 0, 0, 1, -1 };

int main() {
    std::ios::sync_with_stdio(false);

  int nbFloors; // number of floors
  int width; // width of the area
  int nbRounds; // maximum number of rounds
  int exitFloor; // floor on which the exit is found
  int exitPos; // position of the exit on its floor
  int nbTotalClones; // number of generated clones
  int nbAdditionalElevators; // ignore (always zero)
  int nbElevators; // number of elevators
  cin >> nbFloors >> width >> nbRounds >> exitFloor >> exitPos >> nbTotalClones >> nbAdditionalElevators >> nbElevators; cin.ignore();
  fprintf(stderr, "%d %d %d %d %d %d %d %d\n", nbFloors, width, nbRounds, exitFloor, exitPos, nbTotalClones, nbAdditionalElevators, nbElevators);

  vector<vector<int> > maze(nbFloors, vector<int>(width));
  maze[exitFloor][exitPos] = EXIT;

  REP(i, nbElevators) {
    int y, x;
    cin >> y >> x;
    fprintf(stderr, "%d %d\n", y, x);
    maze[y][x] = ELEVETOR;
  }

  MIN_UPDATE(nbAdditionalElevators, nbFloors);
  vector<vector<vector<vector<int> > > > steps(nbFloors, vector<vector<vector<int> > >(width, vector<vector<int> >(nbAdditionalElevators + 1, vector<int>(2, -1))));
  vector<vector<vector<vector<int> > > > prev(nbFloors, vector<vector<vector<int> > >(width, vector<vector<int> >(nbAdditionalElevators + 1, vector<int>(2, -1))));
  vector<vector<vector<vector<int> > > > prevLeftRight(nbFloors, vector<vector<vector<int> > >(width, vector<vector<int> >(nbAdditionalElevators + 1, vector<int>(2, -1))));

  vector<vector<int> > path(nbFloors, vector<int>(width, -1));

  // game loop
  bool first = true;
  while (1) {
    int cloneFloor; // floor of the leading clone
    int clonePos; // position of the leading clone on its floor
    string direction; // direction of the leading clone: LEFT or RIGHT
    cin >> cloneFloor >> clonePos >> direction; cin.ignore();
    fprintf(stderr, "%d %d %s\n", cloneFloor, clonePos, direction.c_str());
    int initialDirection = (direction == "RIGHT" ? RIGHT : LEFT);

    if (first) {
      steps[cloneFloor][clonePos][nbAdditionalElevators][initialDirection] = 0;

      multimap<int, vector<int> > q;
      vector<int> initialState;
      initialState.push_back(cloneFloor);
      initialState.push_back(clonePos);
      initialState.push_back(nbAdditionalElevators);
      initialState.push_back(initialDirection);
      q.insert(MP(0, initialState));

      while (!q.empty()) {
        int currentStep = q.begin()->first;
        int y = q.begin()->second[0];
        int x = q.begin()->second[1];
        int remainingElevators = q.begin()->second[2];
        int leftRight = q.begin()->second[3];
        q.erase(q.begin());

        if (steps[y][x][remainingElevators][leftRight] != currentStep) {
          continue;
        }

        for (int dir = 0; dir < 3; ++dir) {
          if (dir < 2 && maze[y][x] == ELEVETOR) {
            // エレベーターの場合は上のみに進む
            continue;
          }

          int ny, nx, nextDirection, nextStep;
          if (dir == leftRight) {
            // 同じ向きの場合は進む
            ny = y + DY[dir];
            nx = x + DX[dir];
            nextDirection = leftRight;
            nextStep = currentStep + 1;
          }
          else if (dir == (leftRight ^ 1)) {
            // 左右反対向きの場合は反転する
            ny = y;
            nx = x;
            nextDirection = (leftRight ^ 1);
            nextStep = currentStep + 4;
          }
          else {
            // 同じ向きの場合は進む
            ny = y + DY[dir];
            nx = x + DX[dir];
            nextDirection = leftRight;
            nextStep = currentStep + 1;
          }

          if (nx < 0 || width <= nx || ny < 0 || nbFloors <= ny) {
            continue;
          }

          int nextRemainingElevators = remainingElevators;
          if (dir == 2) {
            if (maze[y][x] == ELEVETOR) {
            }
            else {
              // エレベーター建設
              if (--nextRemainingElevators < 0) {
                continue;
              }
              nextStep += 4;
            }
          }

          if (steps[ny][nx][nextRemainingElevators][nextDirection] == -1 ||
            steps[ny][nx][nextRemainingElevators][nextDirection] > nextStep) {
            steps[ny][nx][nextRemainingElevators][nextDirection] = nextStep;
            prev[ny][nx][nextRemainingElevators][nextDirection] = dir ^ 1;
            prevLeftRight[ny][nx][nextRemainingElevators][nextDirection] = leftRight;
            vector<int> nextState;
            nextState.push_back(ny);
            nextState.push_back(nx);
            nextState.push_back(nextRemainingElevators);
            nextState.push_back(nextDirection);
            q.insert(MP(nextStep, nextState));
          }
        }
      }

      REP(elevetor, nbAdditionalElevators + 1) {
        for (int y = nbFloors - 1; y >= 0; --y) {
          REP(x, width) {
            fprintf(stderr, "%2d,%2d ", steps[y][x][elevetor][0], steps[y][x][elevetor][1]);
          }
          fprintf(stderr, "\n");
        }
        fprintf(stderr, "\n\n");
      }

      int currentY = exitFloor;
      int currentX = exitPos;
      int remainingElevators = -1;
      int leftRight = -1;
      int bestSteps = INT_MAX;
      for (int d = 0; d < 2; ++d) {
        for (int r = nbAdditionalElevators; r >= 0; --r) {
          if (steps[currentY][currentX][r][d] != -1 &&
            bestSteps > steps[currentY][currentX][r][d]) {
            bestSteps = steps[currentY][currentX][r][d];
            remainingElevators = r;
            leftRight = d;
          }
        }
      }

      assert(remainingElevators != -1);

      while (!(currentY == cloneFloor && currentX == clonePos)) {
        int direction = prev[currentY][currentX][remainingElevators][leftRight];
        int nextLeftRight = prevLeftRight[currentY][currentX][remainingElevators][leftRight];
        int nextY = currentY + DY[direction];
        int nextX = currentX + DX[direction];
        int nextRemainingElevators = remainingElevators;
        if (direction == BOTTOM && maze[nextY][nextX] != ELEVETOR) {
          ++nextRemainingElevators;
        }
        path[nextY][nextX] = direction ^ 1;
        currentY = nextY;
        currentX = nextX;
        remainingElevators = nextRemainingElevators;
        leftRight = nextLeftRight;
      }

      first = false;
    }

    if (cloneFloor == -1) {
      cout << "WAIT" << endl; // action: WAIT or BLOCK
      continue;
    }

    int dir = (direction == "RIGHT" ? RIGHT : LEFT);

    if (path[cloneFloor][clonePos] == TOP &&
      maze[cloneFloor][clonePos] != ELEVETOR) {
      maze[cloneFloor][clonePos] = ELEVETOR;
      cout << "ELEVATOR" << endl;

    } else if (path[cloneFloor][clonePos] == RIGHT && dir == LEFT ||
      path[cloneFloor][clonePos] == LEFT && dir == RIGHT) {
      cout << "BLOCK" << endl;

    }
    else {
      cout << "WAIT" << endl; // action: WAIT or BLOCK
    }
  }
}