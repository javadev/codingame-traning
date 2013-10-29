-- The money machine
import Control.Monad
import Control.Monad.ST
import Data.Array.ST
import Data.Char
import Data.List
import Data.Maybe
 
data Door = Door {
        to :: Maybe Int,
        profit :: Maybe Int
}
 
data Room = Room {
        gain :: Int,
        doors :: [Door]
}
 
type Hangar s = STArray s Int Room
 
readDoor :: String -> Door
readDoor s = Door (if s == "E" then Nothing else Just (read s)) Nothing
 
readRoom :: String -> Room
readRoom s = Room (read g) (map readDoor [d1, d2]) where [_, g, d1, d2] = words s
 
profitByDoor :: Hangar s -> Room -> Int -> Door -> ST s Int
profitByDoor hangar room at door =
        case profit door of
        Just g -> return g
        Nothing -> do
                g <- profitFromRoom hangar (to door)
                let otherDoors = filter ((/=) (to door) . to) (doors room)
                writeArray hangar at room{ doors = door{ profit = Just g } : otherDoors }
                return g
 
profitFromRoom :: Hangar s -> Maybe Int -> ST s Int
profitFromRoom hangar Nothing = return 0
profitFromRoom hangar (Just at) = do
        room <- readArray hangar at
        remoteGains <- mapM (profitByDoor hangar room at) (doors room)
        return (gain room + maximum remoteGains)
 
main :: IO ()
main = do
        n <- readLn
        rooms <- fmap (map readRoom) $ forM [1..n] (const getLine)
        putStrLn $ show $ runST $ do
                hangar <- newListArray (0, n-1) rooms
                profitFromRoom hangar (Just 0)

