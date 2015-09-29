/**
 * \author Anton Gorev aka Veei
 * \date 2015-08-09
 */
#include <iostream>
#include <string>
#include <vector>
#include <algorithm>
#include <list>
#include <map>

using namespace std;

enum EType
{
    ET_EMPTY = '.',
    ET_NODE = '@',
    ET_PASSIVE = '#'
};
typedef std::vector<EType> row_t;
typedef std::vector<row_t> map_t;
typedef std::pair<int, int> action_t;
typedef std::list<action_t> solution_t;
typedef std::pair<int, int> node_t;
typedef std::list<node_t> nodes_list_t;

void dump_map(const map_t& m)
{
    for (size_t i = 0; i < m.size(); i++)
    {
        for (size_t j = 0; j < m[i].size(); j++)
        {
            std::cerr << static_cast<char>(m[i][j]);
        }
        std::cerr << std::endl;
    }
}

void dump_nodes(const nodes_list_t& n)
{
    nodes_list_t::const_iterator i = n.begin();
    while (i != n.end())
    {
        std::cerr << "(" << i->first << ", " << i->second << ") ";
        i++;
    }
    std::cerr << std::endl;
}

typedef std::vector<int> flags_row_t;
typedef std::vector<flags_row_t> flags_map_t;

flags_map_t build_flags_map(const map_t& m, const nodes_list_t& nodes, bool& empty)
{
    flags_map_t result;
    size_t width = m[0].size(), height = m.size();
    empty = true;

    result.resize(height);
    for (size_t i = 0; i < m.size(); i++)
    {
        result[i].resize(width, 0);
    }

    for (nodes_list_t::const_iterator i = nodes.begin(); i != nodes.end(); i++)
    {
        for (int y = i->first + 1; y < std::min<int>(i->first + 4, height); y++)
        {
            if (ET_PASSIVE == m[y][i->second])
            {
                break;
            }
            if (ET_EMPTY == m[y][i->second])
            {
                result[y][i->second]++;
                empty = false;
            }
        }
        for (int y = i->first - 1; y >= std::max<int>(i->first - 3, 0); y--)
        {
            if (ET_PASSIVE == m[y][i->second])
            {
                break;
            }
            if (ET_EMPTY == m[y][i->second])
            {
                result[y][i->second]++;
                empty = false;
            }
        }
        for (int x = i->second + 1; x < std::min<int>(i->second + 4, width); x++)
        {
            if (ET_PASSIVE == m[i->first][x])
            {
                break;
            }
            if (ET_EMPTY == m[i->first][x])
            {
                result[i->first][x]++;
                empty = false;
            }
        }
        for (int x = i->second - 1; x >= std::max<int>(i->second - 3, 0); x--)
        {
            if (ET_PASSIVE == m[i->first][x])
            {
                break;
            }
            if (ET_EMPTY == m[i->first][x])
            {
                result[i->first][x]++;
                empty = false;
            }
        }
    }

    return result;
}

void explode(map_t& m, const node_t& n)
{
    size_t width = m[0].size(), height = m.size();
    for (int y = n.first + 1; y < std::min<int>(n.first + 4, height); y++)
    {
        if (ET_PASSIVE == m[y][n.second])
        {
            break;
        }
        if (ET_NODE == m[y][n.second])
        {
            m[y][n.second] = ET_EMPTY;
        }
    }
    for (int y = n.first - 1; y >= std::max<int>(n.first - 3, 0); y--)
    {
        if (ET_PASSIVE == m[y][n.second])
        {
            break;
        }
        if (ET_NODE == m[y][n.second])
        {
            m[y][n.second] = ET_EMPTY;
        }
    }
    for (int x = n.second + 1; x < std::min<int>(n.second + 4, width); x++)
    {
        if (ET_PASSIVE == m[n.first][x])
        {
            break;
        }
        if (ET_NODE == m[n.first][x])
        {
            m[n.first][x] = ET_EMPTY;
        }
    }
    for (int x = n.second - 1; x >= std::max<int>(n.second - 3, 0); x--)
    {
        if (ET_PASSIVE == m[n.first][x])
        {
            break;
        }
        if (ET_NODE == m[n.first][x])
        {
            m[n.first][x] = ET_EMPTY;
        }
    }
}

void dump_flags(const flags_map_t& f)
{
    for (size_t i = 0; i < f.size(); i++)
    {
        for (size_t j = 0; j < f[i].size(); j++)
        {
            if (0 == f[i][j])
            {
                std::cerr << ". ";
            } else
            {
                std::cerr << f[i][j] << " ";
            }
        }
        std::cerr << std::endl;
    }
}

nodes_list_t get_possible_turns(const flags_map_t& f)
{
    nodes_list_t result;
    std::multimap<int, node_t> turns;

    for (size_t i = 0; i < f.size(); i++)
    {
        for (size_t j = 0; j < f[i].size(); j++)
        {
            if (0 != f[i][j])
            {
                int w = f[i][j];
                turns.insert(std::pair<int, node_t>(w, node_t(i, j)));
            }
        }
    }

    for (std::multimap<int, node_t>::const_iterator i = turns.begin(); i != turns.end(); i++)
    {
        result.push_front(i->second);
    }

    return result;
}

node_t find_maximum(const flags_map_t f)
{
    node_t result(0, 0);
    for (size_t i = 0; i < f.size(); i++)
    {
        for (size_t j = 0; j < f[i].size(); j++)
        {
            if (f[i][j] > f[result.first][result.second])
            {
                result = node_t(i, j);
            }
        }
    }

    return result;
}

nodes_list_t get_nodes(const map_t& m)
{
    nodes_list_t result;
    for (size_t i = 0; i < m.size(); i++)
    {
        for (size_t j = 0; j < m[i].size(); j++)
        {
            if (ET_NODE == m[i][j])
            {
                result.push_back(node_t(i, j));
            }
        }
    }

    return result;
}

typedef std::list<nodes_list_t> seen_t;
seen_t seen;
std::list<solution_t> solutions;

solution_t find_solution(const map_t& m, nodes_list_t& nodes, int bombs, int rounds)
{
    bool empty;
    solution_t result;

    if ((0 == bombs && !nodes.empty())
        || 0 == rounds)
    {
        return result;
    }

    std::list<solution_t>::const_iterator j = solutions.begin();
    for (seen_t::const_iterator i = seen.begin(); i != seen.end(); i++, j++)
    {
        if (*i == nodes)
        {
            return *j;
        }
    }

    //std::cerr << "try solve: " << std::endl;
    //dump_map(m);

    flags_map_t flags = build_flags_map(m, nodes, empty);
    nodes_list_t pt = get_possible_turns(flags);
    //std::cerr << bombs << " " << std::endl;

    for (nodes_list_t::const_iterator i = pt.begin(); i != pt.end(); i++)
    {
        solution_t r;
        map_t m2 = m;
        explode(m2, *i);
        nodes_list_t n2 = get_nodes(m2);

        //std::cerr << bombs - 1 << " " << rounds - 1 << " ";
        //dump_nodes(n2);
        if (n2.empty())
        {
            r.push_back(*i);
            result = r;
            break;
        } else if (0 < bombs - 1 && 0 < rounds - 1)
        {
            r = find_solution(m2, n2, bombs - 1, rounds - 1);
            if (!r.empty())
            {
                r.push_front(*i);
            }
            if ((result.empty() && !r.empty()) || (!r.empty() && result.size() > r.size()))
            {
                result = r;
                break;
            }
        }
    }

    seen.push_back(nodes);
    solutions.push_back(result);
    return result;
}


/**
 * Auto-generated code below aims at helping you parse
 * the standard input according to the problem statement.
 **/
int main()
{
    int width; // width of the firewall grid
    int height; // height of the firewall grid
    cin >> width >> height;
    cin.ignore();

    map_t m(height);
    nodes_list_t nodes;
    for (int i = 0; i < height; i++)
    {
        m[i].resize(width);
        string mapRow; // one line of the firewall grid
        for (int j = 0; j < width; j++)
        {
            char c;
            cin >> c;
            m[i][j] = static_cast<EType>(c);
            if (ET_NODE == m[i][j])
            {
                nodes.push_back(node_t(i, j));   // [y, x]
            }
        }
        cin.ignore();
    }


    bool first = true;
    solution_t solution;

    std::list<int> countdown;
    // game loop
    while (1)
    {
        int rounds; // number of rounds left before the end of the game
        int bombs; // number of bombs left
        cin >> rounds >> bombs;
        cin.ignore();
        cerr << rounds << " " << bombs << std::endl;

        //dump_map(m);
        //dump_nodes(nodes);

        bool empty;
        flags_map_t f = build_flags_map(m, nodes, empty);
        //dump_flags(f);

        if (first)
        {
            solution = find_solution(m, nodes, bombs, rounds);
            dump_nodes(solution);
            first = false;
        }

        // Write an action using cout. DON'T FORGET THE "<< endl"
        // To debug: cerr << "Debug messages..." << endl;

        node_t max = find_maximum(f);
        //dump_flags(build_flags_map(m, nodes, empty));

        bool timer = false;
        for (std::list<int>::iterator i = countdown.begin(); i != countdown.end(); i++)
        {
            if (0 < *i)
            {
                (*i)--;
            }
            if (0 < *i)
            {
                timer = true;
            }
        }
        if (0 == bombs
            || (timer && rounds > bombs + 3)
            || solution.empty())
        {
            std::cout << "WAIT" << std::endl;
        } else
        {
            std::cout << solution.front().second << " " << solution.front().first << std::endl;
            explode(m, solution.front());
            nodes = get_nodes(m);
            solution.pop_front();
            //std::cout << max.second << " " << max.first << std::endl;
            countdown.push_back(3);
        }

        //cout << "3 0" << endl;
    }
}
