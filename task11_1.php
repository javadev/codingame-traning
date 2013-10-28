<?php
// Read inputs from STDIN. Print outputs to STDOUT.
 
fscanf(STDIN, "%d", $n);
$nodes = [];
$wrong = [];
 
for ($i = 0; $i < $n; $i++)
{
    fscanf(STDIN, "%d %d", $a, $b);
    if (array_key_exists($a, $nodes))
        $nodes[$a][] = $b;
    else
        $nodes[$a] = [$b];
    $wrong[$b] = 1;
}
 
function depth($a, $nodes) {
    $max = 1;
    if (array_key_exists($a, $nodes)) {
       foreach ($nodes[$a] as $b => $c) {
            $max = max(1 + depth($c, $nodes), $max);
        }
    }
    return $max;
}
 
$max = 0;
foreach ($nodes as $a => $child) {
    if (!array_key_exists($a, $wrong)) {
        $max = max(depth($a, $nodes), $max);
    }
}
 
echo $max;
 
?>

