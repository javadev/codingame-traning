-- Snakes and ladders
import Control.Monad.Reader
 
import Data.Set(Set)
import qualified Data.Set as Set
 
import Control.Applicative ((<$>))
import Data.Maybe (fromJust)
import Control.Monad.IO.Class
 
import Data.Array
import Data.List
 
data Square = Start | End | Roll | Go Int deriving (Show,Eq)
 
c2Square "S" = Start
c2Square "E" = End
c2Square "R" = Roll
c2Square  d  = Go $ read d
 
type Board a =  (ReaderT (Array Pos Square) IO) a
type Pos = Int
 
value :: Pos -> Board (Maybe Square)
value i = do
    array <- ask
    if inRange (bounds array) i then return (Just $ array!i)
    else return Nothing
 
go :: Pos -> Board (Set Pos)
go pos = go' <$> value pos
   where go' Nothing       = Set.empty
         go' (Just (Go i)) = Set.singleton (pos+i)
         go' _             = Set.fromList [pos+i | i<-[1..6]]
 
step :: Set Pos -> Board (Set Pos)
step positions = do
    new_poss <- mapM go $ Set.elems positions
    return $ Set.unions new_poss
 
containsEnd :: Set Pos -> Board Bool
containsEnd set = do
    values <- mapM value $ Set.elems set
    return $ or.map (==Just End) $ values
 
expand' :: Int -> Set Pos -> Set Pos -> Board (Maybe Int)
expand' turn last set = do
   --liftIO $ putStrLn.show $ set
   endReached <- containsEnd set
   if set `Set.isSubsetOf` last then return Nothing
   else if endReached then return $ Just turn
   else expand' (turn+1) (Set.union last set) =<< step set
 
expand :: Pos -> Board (Maybe Int)
expand start = expand' 0 Set.empty (Set.singleton start)
 
main :: IO ()
main = do
   n <- readLn :: IO Int
   lboard <- map c2Square <$> replicateM n getLine
   let start = (+1).fromJust $ findIndex (==Start) lboard
       array = listArray (1,n) lboard
   res <- runReaderT (expand start) array
   putStrLn $ maybe "impossible" show res

