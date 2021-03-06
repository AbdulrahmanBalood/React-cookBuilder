import { useState, useEffect, useContext } from 'react';
import {
  ChakraProvider,
  Box,
  Text,
  VStack,
  HStack,
  Code,
  Grid,
  theme,
  Flex,
  Image,
  GridItem,
  Container,
  Button,
  Spinner 
} from '@chakra-ui/react';
import { Navigate, useParams, Link } from 'react-router-dom';
import RecipeContext from '../context/RecipeContext';
import { RecipeCard } from '../components/RecipeCard';

export const Home = () => {
  const { setSearchType, recipes, setRecipes } = useContext(RecipeContext);
  const [loadRecipes, setLoadRecipes] = useState(false);

  useEffect(() => {
      const getRecipes = async () => {
        const request = await fetch(
          '/api/v1/recipe/recipes/homepage'
        );
        const data = await request.json();
        setRecipes(data.recipes);
        setSearchType('homepage');
        setLoadRecipes(true)
      };
      getRecipes();
  
  }, []);

  return (
    <>
      <Flex justifyContent={'center'} alignItems="center" height={'100vh'} >
        {!loadRecipes ? (
     <Spinner
     thickness='4px'
     speed='0.65s'
     emptyColor='white'
     color='green.500'
     size='xl'
   />
        ) : (
          <RecipeCard />
        )}
      </Flex>
    </>
  );
};
