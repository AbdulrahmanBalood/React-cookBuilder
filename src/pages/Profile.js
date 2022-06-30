import { useState, useContext, useEffect } from 'react';
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
  Spinner,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
} from '@chakra-ui/react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import RecipeContext from '../context/RecipeContext';
export const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [reload, setReload] = useState(false);
  const { favoriteRecipes, setFavoriteRecipes, favoriteRecipesIDs, setFavId } =
    useContext(RecipeContext);
  const Navigate = useNavigate();

  useEffect(() => {
    const getData = async () => {
      const request = await fetch('/api/v1/auth/userinfo/' + loggedUser);
      const data = await request.json();
      setLoading(false);
      setFavoriteRecipes(data.favoriteRecipes);
      setUserID(data.id);
      setFavId();
    };
    getData();
  }, []);

  const RemoveOnClick = recipeID => {
    {
      const removeRecipe = async () => {
        let ArecipeID = recipeID;

        const request = await fetch(
          `/api/v1/auth/userrecipe/removerecipe/${userID}/${ArecipeID}`,
          {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userID, recipeID),
          }
        );
        const data = await request.json();
        setLoading(true);
      };
      removeRecipe();
    }
  };
  useEffect(() => {
    const getData = async () => {
      const request = await fetch('/api/v1/auth/userinfo/' + loggedUser);
      const data = await request.json();
      setLoading(false);
      setFavoriteRecipes(data.favoriteRecipes);
      setUserID(data.id);
      setFavId();
    };
    getData();
    setLoading(false);
  }, [loading]);
  const { login, addIsLogged, loggedUser, userID, setUserID } =
    useContext(AuthContext);
  return (
    <Flex justifyContent={'center'} alignItems="center" height={'100vh'}>
      {loading ? (
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="white"
          color="green.500"
          size="xl"
        />
      ) : (
        <Container>
          <Text fontSize="6xl">Welcome {loggedUser}</Text>
          <TableContainer>
            <Table variant="striped" colorScheme="green">
              <Thead>
                <Tr>
                  <Th>Recipe</Th>
                  <Th></Th>
                </Tr>
              </Thead>
              {favoriteRecipes.map((recipe, index) => {
                let recipeID = recipe.recipeID;
                return (
                    <Tr>
                         <Td>
                  <Text key={index}>
                  
                    <Link to={`/recipe/${recipe.recipeID}`}>
                      {recipe.recipeName}
                    </Link>

                  </Text>
                  </Td>
                  <Td>
                  <Button
                      onClick={() => RemoveOnClick(recipeID)}
                      colorScheme={'red'}
                    >
                      Delete
                    </Button>
                    </Td>
                  </Tr>
                );
              })}
            </Table>
          </TableContainer>
        </Container>
      )}
    </Flex>
  );
};
