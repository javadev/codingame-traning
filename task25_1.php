<?php
// Doctor Who
function readLine() {
    $line = fgets(STDIN);
	return substr($line, 0, strlen($line) - 1);
}
list($w,$h)=explode(' ',readLine());
$in=explode(' ',readLine());
$ar=array();
$x=0;
$y=0;
for($i=0;$i<count($in);$i+=2){
    $col=($in[$i]=='W'?0:1);
    for ($j=0;$j<$in[$i+1];$j++){
        if (!isset($ar[$y])){
            $ar[$y]=array();
        }
        $ar[$y][$x]=$col;
        $x++;
        if($x==$w){
            $x=0;
            $y++;
        }
    }
}

for($x=0;$x<$w;$x++){
    for($y=0;$y<$h;$y++){
        if($ar[$y][$x]){
            $line0=$y;
            while($ar[++$y][$x]);
            while(!$ar[++$y][$x]);
            $line1=$y;
            break 2;
        }
    }
}
$inter=$line1-$line0;

$notes=array('G','F','E','D','C','B','A','G','F','E','D','C');
$out = array();
for($x=0;$x<$w;$x++){
    for($yl=0;$yl<=11;$yl++){
        $y=floor($line0+($yl-1)*($inter/2))-1;
        if($ar[$y][$x]){
            $dc=floor($inter*($yl==11?.8:.67));
            $dc=5;
            $bl=$ar[$y][$x+$dc];
            $out[]=$notes[$yl].($bl?'Q':'H');
            $x+=floor($inter*1.1);
        }
    }
}

echo implode(' ',$out);

?>