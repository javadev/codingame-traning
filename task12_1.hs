import Control.Monad
import Control.Monad.ST
import Data.Array.ST
import Data.Char
import Data.List
 
type Point = (Int, Int)
 
data Bender = Bender {
    position :: Point,
    direction :: Char,
    priorities :: [Char],
    berserk :: Bool,
    alive :: Bool,
    roadmap :: [Char],
    history :: [(Point, Char, Bool)]
}
 
data Town s = Town {
    height :: Int,
    width :: Int,
    positions :: [Point],
    area :: STArray s Point Char
}
 
newTownFromString :: Int -> Int -> [String] -> ST s (Town s)
newTownFromString h w s = do
    a <- newListArray ((1, 1), (h, w)) (concat s)
    return (Town h w [(y, x) | y <- [1..h], x <- [1..w]] a)
 
findAll :: (Char -> Bool) -> (Town s) -> ST s [Point]
findAll f (Town _ _ ps a) = do
    entries <- fmap (zip ps) (forM ps (readArray a))
    return $ map fst (filter (f . snd) entries)
 
offset :: Point -> Char -> Point
offset (y, x) c = case c of
    'S' -> (y+1, x)
    'E' -> (y, x+1)
    'N' -> (y-1, x)
    'W' -> (y, x-1)
 
wander :: (Town s) -> [Point] -> Bender -> ST s Bender
wander t ts b = do
    (b2, c2, breaking) <- stepOut t ts b
    let b3 = stepIn ts b2 c2
    let state = (position b3, direction b3, berserk b3)
    let h = if breaking then [] else state : history b
    if alive b3 && not (state `elem` history b)
        then wander t ts b3{ history = h }
        else return b3
 
stepOut :: (Town s) -> [Point] -> Bender -> ST s (Bender, Char, Bool)
stepOut t ts b = do
    let d = direction b
    let moves = zip ds (map (offset (position b)) ds) where ds = d : delete d (priorities b)
    let crossable c = c /= '#' && (c /= 'X' || berserk b)
    choices <- forM moves $ \m -> fmap ((,) m) (readArray (area t) (snd m))
    let ((d2, p2), c2) = head $ filter (crossable . snd) choices
    let breaking = c2 == 'X' && (berserk b)
    writeArray (area t) p2 (if breaking then ' ' else c2)
    return (b{ position = p2, direction = d2, roadmap = d2:roadmap b }, c2, breaking)
 
stepIn :: [Point] -> Bender -> Char -> Bender
stepIn ts b c
    | c == '$' = b{ alive = False }
    | c `elem` "SENW" = b{ direction = c }
    | c == 'I' = b{ priorities = reverse (priorities b) }
    | c == 'B' = b{ berserk = not (berserk b) }
    | c == 'T' = b{ position = head (delete (position b) ts) }
    | otherwise = b
 
getName :: Char -> String
getName c = case c of
        'S' -> "SOUTH"
        'E' -> "EAST"
        'N' -> "NORTH"
        'W' -> "WEST"
 
main :: IO ()
main = do
    [h, w] <- fmap (map read . words) getLine
    s <- forM [1..h] (const getLine)
    mapM_ putStrLn $ runST $ do
        t <- newTownFromString h w s
        [p] <- findAll (== '@') t
        ts <- findAll (== 'T') t
        b <- wander t ts (Bender p 'S' "SENW" False True [] [])
        return $ if alive b then ["LOOP"] else (map getName $ reverse $ roadmap b)

