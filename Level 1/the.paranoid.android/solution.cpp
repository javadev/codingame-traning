/**
 * \author Anton Gorev aka Veei
 * \date 2015-08-09
 */
#include <iostream>
#include <string>
#include <vector>
#include <algorithm>
#include <map>
#include <list>
#include <set>

using namespace std;

struct SStep
{
    int f;
    int p;
    int a;

    SStep(int _f, int _p, int _a): f(_f), p(_p), a(_a) {}
};

class CMap
{
    public:
        typedef std::list<SStep> solution_t;
        CMap(int width, int height): w(width), h(height) {}

        void add_elevator(int f, int p)
        {
            m[f].insert(p);
        }
        void set_exit(int f, int p)
        {
            e = exit_t(f, p);
            cerr << "exit at " << e.first << "/" << e.second << endl;
        }

        bool get_solution(int ind, int f, int p, int dir, int e, int c, int r, int l, solution_t& s)
        {
            if (f >= h || 0 > p || 0 >= r)
            {
                return false;
            }

            if (this->e.first == f && this->e.second == p)
            {
                cerr << "found from elevator: " << f << "/" << p << "/" << dir << "/" << e << "/" << c << "/" << r << "/" << l << endl;
                return true;
            }

            if (m[f].end() != m[f].find(p))
            {
                if (get_solution(ind + 1, f + 1, p, dir, e, c, r - 1, l + 1, s))
                {
                    //s.push_front(0);
                    //cerr << "moving up: " << f << "/" << i << "/" << dir << "/" << e << "/" << c << "/" << r << "/" << l << endl;
                    return true;
                }
                return false;
            }

            /*
            for (int i = 0; i < ind; i++)
            {
                cerr << " ";
            }
            cerr << f << "/" << p << "/" << dir << "/" << e << "/" << c << "/" << r << "/" << l << endl;
            */
            int steps = 0;
            bool skip = false;
            for (int i = p; i >= 0 && i < w; i += dir, steps++)
            {
                if (m[f].end() != m[f].find(i))
                {
                    // encountered elevator to upward (WAIT)
                    if (get_solution(ind + 1, f + 1, i, dir, e, c, r - (steps + 1), l + steps + 1, s))
                    {
                        //s.push_front(0);
                        //cerr << "moving up: " << f << "/" << i << "/" << dir << "/" << e << "/" << c << "/" << r << "/" << l << endl;
                        return true;
                    }
                    break;
                }
                // try move forward (WAIT)
                if (this->e.first == f && this->e.second == i)
                {
                    cerr << "found: " << f << "/" << i << "/" << dir << "/" << e << "/" << c << "/" << r << "/" << l << endl;
                    return true;
                }

                bool under_lift = false;
                if (f < h && m[f + 1].end() != m[f + 1].find(i))
                {
                    skip = false;
                    under_lift = true;
                }
                if (!skip)
                {
                    // try build elevator (ELEVATOR)
                    if (0 < e && get_solution(ind + 1, f + 1, i, dir, e - 1, c, r - (steps + 4), (l + steps), s))
                    {
                        s.push_front(SStep(f, i, 1));
                        cerr << f << "/" << p << "/" << "ELEVATOR" << endl;
                        return true;
                    }
                    skip = !under_lift;
                }
            }
            // try to block (BLOCK)
            int b = p + dir;
            steps = 1;  // one step to turn back
            if (0 < c)
            {
                for (int i = p - dir; i >= 0 && i < w; i -= dir, steps++)
                {
                    if (m[f].end() != m[f].find(i))
                    {
                        // encountered elevator to upward (WAIT)
                        if (get_solution(ind + 1, f + 1, i, -dir, e, c - 1, r - (steps + 4), (l + steps), s))
                        {
                            s.push_front(SStep(f, b, 0));
                            return true;
                        }
                        break;
                    }
                    // try move forward (WAIT)
                    if (this->e.first == f && this->e.second == i)
                    {
                        cerr << "found in back direction: " << f << "/" << i << "/" << dir << "/" << e << "/" << c << "/" << r << "/" << l << endl;
                        s.push_front(SStep(f, b, 0));
                        return true;
                    }

                    bool under_lift = false;
                    if (f < h && m[f + 1].end() != m[f + 1].find(i))
                    {
                        skip = false;
                        under_lift = true;
                    }
                    if (!skip)
                    {
                        // try build elevator (ELEVATOR)
                        if (0 < e && get_solution(ind + 1, f + 1, i, -dir, e - 1, c - 1, r - (steps + 8), (l + steps), s))
                        {
                            s.push_front(SStep(f, i, 1));
                            s.push_front(SStep(f, b, 0));
                            return true;
                        }
                        skip = !under_lift;
                    }
                }
            }

            return false;
        }

    private:
        typedef std::set<int> elevators_t;
        typedef std::pair<int, int> exit_t;
        typedef std::map<int, elevators_t> map_t;

        int w;
        int h;
        map_t m;
        exit_t e;
};

int main()
{
    int nbFloors; // number of floors
    int width; // width of the area
    int nbRounds; // maximum number of rounds
    int exitFloor; // floor on which the exit is found
    int exitPos; // position of the exit on its floor
    int nbTotalClones; // number of generated clones
    int nbAdditionalElevators; // ignore (always zero)
    int nbElevators; // number of elevators
    cin >> nbFloors >> width >> nbRounds >> exitFloor >> exitPos >> nbTotalClones >> nbAdditionalElevators >> nbElevators; cin.ignore();

    typedef std::pair<int, int> pair_t;
    typedef std::map<int, int> elevators_t;
    typedef std::vector<bool> fixed_t;

    CMap g(width, nbFloors);
    for (int i = 0; i < nbElevators; i++)
    {
        int elevatorFloor; // floor on which this elevator is found
        int elevatorPos; // position of the elevator on its floor
        cin >> elevatorFloor >> elevatorPos;
        cin.ignore();
        //cerr << "elevator #" << i << ": " << elevatorFloor << "/" << elevatorPos << endl;
        g.add_elevator(elevatorFloor, elevatorPos);
    }
    g.set_exit(exitFloor, exitPos);

    bool first = true;
    int start = -1;
    CMap::solution_t s;
    while (1)
    {
        int cloneFloor; // floor of the leading clone
        int clonePos; // position of the leading clone on its floor
        string direction; // direction of the leading clone: LEFT or RIGHT
        cin >> cloneFloor >> clonePos >> direction; cin.ignore();

        if (first)
        {
            start = clonePos;
            first = false;
            bool solved = g.get_solution(0, 0, start, direction == "RIGHT" ? 1 : -1, nbAdditionalElevators, nbTotalClones, nbRounds, 0, s);
            if (!solved)
            {
                cerr << "solution has not been found" << endl;
            }
            else
            {
                cerr << "solution has been found" << endl;
            }
            for (CMap::solution_t::const_iterator i = s.begin(); i != s.end(); i++)
            {
                cerr << "(" << i->f << ", " << i->p << "): " << (1 == i->a ? "ELEVATOR" : "BLOCK") << " ";
            }
            //break;
        }

        cerr << endl;
        cerr << "position: " << cloneFloor << "/" << clonePos << endl;
        if (!s.empty())
        {
            SStep step = s.front();
            if (clonePos == step.p && cloneFloor == step.f)
            {
                cout << (1 == step.a ? "ELEVATOR" : "BLOCK") << endl;
                s.pop_front();
            } else
            {
                cout << "WAIT" << endl;
            }
        }
        else
        {
            cout << "WAIT" << endl;
        }
   }
}
