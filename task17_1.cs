// TAN Network
// Read inputs from Standard input.
// Write outputs to Standard output.

using System;
using System.IO;
using System.Text;
using System.Collections;
using System.Collections.Generic;
using System.Linq;

class Solution
{
    
    
	static void Main(string[] args)
        {
            var departId = Console.ReadLine();
            var arriveeId = Console.ReadLine();
            var n = int.Parse(Console.ReadLine());

            var graph = new Graph();

            graph.Locations = new Dictionary<string, Location>();

            for (int i = 0; i < n; i++)
            {
                var location = new Location(Console.ReadLine());
                graph.Locations[location.Id] = location;
            }
            graph.Aretes = new List<Arete>();
            var m = int.Parse(Console.ReadLine());
            for (int i = 0; i < m; i++)
            {
                var arete = new Arete(Console.ReadLine());
                arete.Distance = graph.Locations[arete.Start].DistanceFrom(graph.Locations[arete.End]);
                graph.Aretes.Add(arete);
            }

            var result = graph.FindShortestPath(departId, arriveeId);

            if (result == null)
            {
                Console.WriteLine("IMPOSSIBLE");
            }
            else
            {
                foreach (var loc in result)
                {
                    Console.WriteLine(loc.Nom);
                }
            }
        }
}

class Location
    {
        public Location(string p)
        {
            var components = p.Split(',');
            this.Id = components[0];
            this.Nom = components[1].Trim('"');
            this.Latitude = double.Parse(components[3], System.Globalization.CultureInfo.InvariantCulture);
            this.Longitude = double.Parse(components[4], System.Globalization.CultureInfo.InvariantCulture);
        }

        public string Id { get; set; }
        public string Nom { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }

        public double Distance { get; set; }
        public bool Visited { get; set; }
        public Location Parent { get; set; }

        private const double DegToRad = Math.PI / 180d;

        public double DistanceFrom(Location otherLoc)
        {

            var x = DegToRad * (this.Longitude - otherLoc.Longitude) * Math.Cos(DegToRad * (this.Latitude + otherLoc.Latitude) / 2);
            var y = DegToRad * (this.Latitude - otherLoc.Latitude);

            return Math.Sqrt(x * x + y * y);
        }

    }
    
    class Graph
    {
        public Dictionary<string, Location> Locations { get; set; }

        public List<Arete> Aretes { get; set; }

        public List<Location> FindShortestPath(string start, string end)
        {
            var result = new List<Location>();
            ResetGraphe();
            Locations[start].Distance = 0;
            Locations[start].Visited = true;



            var unvisited = new List<Location>();
            unvisited.AddRange(Locations.Values);

            var current = Locations[start];

            while (current != null)
            {
                var neighbors = Aretes.Where(a => a.Start == current.Id).Select(a => new { Weight = a.Distance, Node = Locations[a.End] });

                foreach (var neighbor in neighbors)
                {
                    var d = current.Distance + neighbor.Weight;
                    if (neighbor.Node.Distance > d)
                    {
                        neighbor.Node.Distance = d;
                        neighbor.Node.Parent = current;
                    }
                }
                current.Visited = true;
                unvisited.Remove(current);

                if (current.Id == end)
                {
                    return BuildResult(start ,end);
                }

                if (unvisited.All(l => l.Distance == double.MaxValue))
                {
                    return null;
                }
                current = unvisited.OrderBy(l => l.Distance).FirstOrDefault();
            }

            throw new InvalidOperationException();
        }

        private List<Location> BuildResult(string start, string end)
        {
            var locations = new List<Location>();
            var current = Locations[end];

            do
            {
                locations.Add(current);

                current = current.Parent;
            }
            while (current!= null);
           
            locations.Reverse();
            return locations;
        }

        private void ResetGraphe()
        {
            foreach (var location in Locations.Values)
            {
                location.Distance = double.MaxValue;
                location.Visited = false;
            }
        }
    }
    
    public class Arete
    {
        public Arete(string s)
        {
            var components = s.Split(' ');
            Start = components[0];
            End = components[1];
        }

        public string Start { get; set; }

        public string End { get; set; }

        public double Distance { get; set; }
    }
