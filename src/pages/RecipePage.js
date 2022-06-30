import React, { useEffect, useState,useContext } from 'react';
import { Navbar } from '../components/Navbar';
import { Navigate, useParams } from 'react-router-dom';
import {
  ChakraProvider,
  Box,
  Text,
  VStack,
  HStack,
  Stack,
  Code,
  Grid,
  theme,
  Flex,
  Image,
  GridItem,
  Container,
  OrderedList,
  ListItem,
  Badge,
  Divider ,
  Button,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react';
import RecipeContext from '../context/RecipeContext';
import { useNavigate,Link  } from "react-router-dom";
import AuthContext from '../context/AuthContext';
import he from 'he'
export const RecipePage = () => {
  let id = useParams();
  const Navigate = useNavigate()
  const { userID } = useContext(AuthContext);
  const {setSearchType,setSearchUrl,favoriteRecipesIDs} = useContext(RecipeContext)
  const [recipe, setRecipe] = useState([]);
  const [ingredient, setIngredient] = useState([]);
  const [dataRecived,setDataRecived] = useState(true);
  const [diet,setDiet] = useState('')
  const [instructions,setInstructions] = useState('')
  const [added,setAdded] = useState(false)
  let newUrl = ''
  console.log(favoriteRecipesIDs);
  useEffect(() => {
    const getRecipe = async () => {
      const request = await fetch(
        `/api/v1/recipe/user/getrecipeinfo/${id.id}`
        
      );
      console.log(`/api/v1/recipe/user/getrecipeinfo/${id.id}`);
      const data = await request.json();
      setRecipe(data);
      
      setIngredient(data.extendedIngredients);
      setDataRecived(false)
      setDiet(data.diets)
      setInstructions(data.instructions)
    };
   getRecipe();
    
  }, []);
  
  const instructionsData = () =>{
  if(instructions !== '' ){
    return (<>
    <Text fontWeight={'bold'} fontSize='3xl'>Instructions:</Text>
     {he.decode(instructions)} </>);
  }else{
    return <Text fontWeight={'bold'} fontSize='3xl'>No Instructions avalible</Text>
  }
}
const favoriteOnClick = () => {
  const addFav = async()=> {
    let recipeID = id.id
    let urlRecipeTitle = recipe.title; 
    console.log(userID);
    const request = await fetch(`/api/v1/auth/userrecipe/favrecipe/${userID}/${recipeID}/${urlRecipeTitle}`,{
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userID,recipeID)
    })
    const data = await request.json();
    console.log(data);
    setAdded(true)
  }
  addFav()

}
const addedAlert = ()=> {
  return(<Alert status='success'>
  <AlertIcon />
  <AlertTitle>Recipe added to list</AlertTitle>
  <AlertDescription></AlertDescription>
</Alert>)}
  
  return (
    <Flex justifyContent={'center'} alignItems='center' >
        {dataRecived ? ( <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="white"
            color="green.500"
            size="xl"
          />):( <Container maxWidth={"3xl"}>
            {added? (addedAlert()):(<></>)}
          <Text fontSize="4xl"> {recipe.title} </Text>
          <Button marginY='5px' width={'5rem'} onClick={favoriteOnClick} colorScheme='green'>+ favorite</Button>
          <Stack  direction={['column', 'row']} spacing='10px'>
    
            {diet.map((diet,index)=> {
              
              return(
                <Badge  key={index} colorScheme="green"><button onClick={() => {
                    let url = "/api/v1/recipe/recipes/findbydiet/"+diet
                    console.log(diet);
                    newUrl = url.replace(/ /g,'%20')
                    console.log(newUrl);
                    setSearchUrl(newUrl)
                    setSearchType("ByDiet")
                    Navigate('/result')
                  }}>{diet}</button></Badge>
              )
            })}
    
          </Stack>
         
           <Image marginLeft={'5%'} borderRadius={'10px'} marginY='10px' src={recipe.image}></Image>
         
        <Text fontWeight={'bold'} fontSize='3xl' >Summary</Text>
          <Text>{he.decode(recipe.summary)}
          </Text>
          <Divider orientation='horizontal' />
          
          
            <Text>
          {instructionsData()
          }
          </Text>
          <Divider orientation='horizontal' />
          <Text fontWeight={'bold'} fontSize='3xl'>Ingredients:</Text>
          <OrderedList>
            {ingredient.map((ingredient, index) => {
              return (
                
                  <ListItem key={index}>
                    <Text >
                    <strong>{ingredient.name} </strong>: {ingredient.measures.metric.amount}  {ingredient.measures.metric.unitLong}
                    </Text>
                   </ListItem>
              );
            })}
          </OrderedList>
          <Text></Text>
        </Container>)}
   
    </Flex>
  );
};
