import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Search from "./pages/Search";
import RootLayout from "./Layout/RootLayout";
import { useEffect, useState } from "react";
import { api, myRecipeApi } from "./api/api";
import DisplayRecipe from "./component/DisplayRecipe";
import Favorite from "./pages/Favorite";
import About from "./pages/About";
import Home from "./pages/Home";
import MyRecipe from "./pages/MyRecipe";
import DisplayMyRecipe from "./component/DisplayMyRecipe";
import DisplayMyFavorite from "./component/DisplayMyFavorite";
import Login from "./pages/Login";

const initialRecipeState = {
  strMeal: "",
  strMealThumb: "",
  strIngredient1: "",
  strIngredient2: "",
  strIngredient3: "",
  strIngredient4: "",
  strIngredient5: "",
  strIngredient6: "",
  strIngredient7: "",
  strIngredient8: "",
  strIngredient9: "",
  strIngredient10: "",
  strInstructions: "",
  idMeal: "",
};

function App() {
  const [searchBy, setSearchBy] = useState("search.php?s=");
  const [foodName, setFoodName] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [recipeById, setRecipeById] = useState(null);
  const [recipeLoading, setRecipeLoading] = useState(false);
  const [addMyRecipeLoading, setAddMyRecipeLoading] = useState(false);
  const [addMyFavouriteLoading, setAddMyFavouriteLoading] = useState(false);
  const [myRecipeList, setMyRecipeList] = useState([]);
  const [deleteMyRecipeLoading, setDeleteMyRecipeLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [myFavoriteList, setMyFavoriteList] = useState([]);
  const [deleteMyFavoriteLoading, setDeleteMyFavoriteLoading] = useState(false);
  const [myRecipe, setMyRecipe] = useState(initialRecipeState);
  const [formStatus, setFormStatus] = useState(false);
  const [form, setForm] = useState(initialRecipeState);
  const [editLoading, setEditLoading] = useState(false);
  const [displayLoading, setDisplayLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    console.log("Initial load");
    handlerClear();
  }, []);

  const handlerCloseModal = () => {
    setOpenModal(false);
  };

  const handlerOpenModal = () => {
    setOpenModal(true);
  };

  const handlerChangeName = (event) => {
    setFoodName(event.target.value);
  };

  const handlerChangeSearchBy = (event) => {
    setSearchBy(event.target.value);
    setFoodName("");
  };

  const handlerClear = () => {
    setFoodName("");
    setSearchResult("");
    setSearchBy("search.php?s=");
  };

  const handlerFormStatus = (status) => setFormStatus(status);

  const searchByName = async () => {
    try {
      setDisplayLoading(true);
      const response = await api.get(`${searchBy}${foodName}`);
      setSearchResult(response.data.meals);
    } catch (error) {
      console.log("error", error.message);
    } finally {
      setDisplayLoading(false);
    }
  };

  const searchRecipe = async (id) => {
    try {
      setRecipeLoading(true);
      const response = await api.get(`lookup.php?i=${id}`);
      setRecipeById(response.data.meals[0]);
    } catch (error) {
      console.log("error", error.message);
    } finally {
      setRecipeLoading(false);
    }
  };

  const handlerRecipeChange = (event) => {
    setMyRecipe((prevState) => {
      return { ...prevState, [event.target.name]: event.target.value };
    });
  };

  const handlerSubmit = async (event) => {
    event.preventDefault();
    await handlerAddMyRecipe(myRecipe);
    setMyRecipe(initialRecipeState);
    !addMyRecipeLoading && handlerFormStatus(false);
  };

  const handlerAddMyRecipe = async (myRecipe) => {
    let addMyRecipeMessage = "";
    try {
      setAddMyRecipeLoading(true);
      await myRecipeApi.post("/myrecipe", myRecipe);
      addMyRecipeMessage = "New Recipe added";
    } catch (error) {
      addMyRecipeMessage = error.message;
      alert("Error", error.message);
    } finally {
      setAddMyRecipeLoading(false);
      alert(addMyRecipeMessage);
      setRefreshKey((prevKey) => prevKey + 1);
    }
  };

  const getMyFavourite = async () => {
    try {
      setDisplayLoading(true);
      const response = await myRecipeApi.get("/favorites");
      setMyFavoriteList(response.data);
    } catch (error) {
      console.log("Error", error.message);
    } finally {
      setDisplayLoading(false);
    }
  };

  const searchMyRecipe = async () => {
    try {
      setDisplayLoading(true);
      const response = await myRecipeApi.get("/myrecipe");
      setMyRecipeList(response.data);
    } catch (error) {
      console.log("Error", error.message);
    } finally {
      setDisplayLoading(false);
    }
  };

  const deleteMyRecipe = async (id) => {
    let deleteMyRecipeMessage = "";
    try {
      setDeleteMyRecipeLoading(true);
      await myRecipeApi.delete("/myrecipe/" + id);
      deleteMyRecipeMessage = "Recipe Deleted";
    } catch (error) {
      deleteMyRecipeMessage = error.message;
    } finally {
      alert(deleteMyRecipeMessage);
      setRefreshKey((prevKey) => prevKey + 1);
      setDeleteMyRecipeLoading(false);
    }
  };

  const handlerDisplayMyRecipe = (id) => {
    const selectMyRecipe = myRecipeList.find((item) => item.idMeal === id);
    setRecipeById(selectMyRecipe);
  };

  const handlerAddMyFavourite = async () => {
    let addMyFavouriteMessage = "";
    try {
      setAddMyFavouriteLoading(true);
      const favoriteList = {
        strMeal: recipeById.strMeal,
        strMealThumb: recipeById.strMealThumb,
        idMeal: recipeById.idMeal,
      };
      await myRecipeApi.post("/favorites", favoriteList);
      addMyFavouriteMessage =
        "Recipe has been added to My Favorite Recipe List";
    } catch (error) {
      addMyFavouriteMessage = error.message;
      alert("Error", error.message);
    } finally {
      setAddMyFavouriteLoading(false);
      alert(addMyFavouriteMessage);
    }
  };

  const handlerEditMyRecipe = (recipeById) => {
    const editValues = {
      idMeal: recipeById.idMeal,
      strMeal: recipeById.strMeal,
      strMealThumb: recipeById.strMealThumb,
      strIngredient1: recipeById.strIngredient1,
      strIngredient2: recipeById.strIngredient2,
      strIngredient3: recipeById.strIngredient3,
      strIngredient4: recipeById.strIngredient4,
      strIngredient5: recipeById.strIngredient5,
      strIngredient6: recipeById.strIngredient6,
      strIngredient7: recipeById.strIngredient7,
      strIngredient8: recipeById.strIngredient8,
      strIngredient9: recipeById.strIngredient9,
      strIngredient10: recipeById.strIngredient10,
      strInstructions: recipeById.strInstructions,
    };
    setForm(editValues);
  };

  const handlerUpdateMyRecipe = (event, key) => {
    const values = event.target.value;
    const updatedForm = { ...form, [key]: values };
    setForm(updatedForm);
  };

  const handlerSubmitUpdateMyRecipe = async (id) => {
    let editLoadingMessage = "";
    try {
      setEditLoading(true);
      await myRecipeApi.put("/myrecipe/" + id, form);
      setRecipeById((prevState) => ({
        ...prevState,
        ...form,
      }));
      editLoadingMessage = "Recipe has been updated";
    } catch (error) {
      editLoadingMessage = error.message;
    } finally {
      setEditLoading(false);
      alert(editLoadingMessage);
      setRefreshKey((prevKey) => prevKey + 1);
    }
  };

  const deleteMyFavorite = async (id) => {
    let deleteMyFavoriteMessage = "";
    try {
      setDeleteMyFavoriteLoading(true);
      await myRecipeApi.delete("/favorites/" + id);
      deleteMyFavoriteMessage =
        "Recipe has been deleted from My Favorite Recipe List";
    } catch (error) {
      deleteMyFavoriteMessage = error.message;
    } finally {
      alert(deleteMyFavoriteMessage);
      setRefreshKey((prevKey) => prevKey + 1);
      setDeleteMyFavoriteLoading(false);
    }
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            isLogin ? (
              <RootLayout setIsLogin={setIsLogin} />
            ) : (
              <Login setIsLogin={setIsLogin} />
            )
          }
        >
          <Route index element={isLogin ? <Home /> : null} />
          <Route path="about" element={<About />} />
          <Route
            path="search"
            element={
              <Search
                searchBy={searchBy}
                handlerChangeSearchBy={handlerChangeSearchBy}
                handlerChangeName={handlerChangeName}
                foodName={foodName}
                searchResult={searchResult}
                searchByName={searchByName}
                handlerOpenModal={handlerOpenModal}
                searchRecipe={searchRecipe}
                handlerClear={handlerClear}
                displayLoading={displayLoading}
              />
            }
          >
            <Route
              path=":idMeal"
              element={
                <DisplayRecipe
                  openModal={openModal}
                  handlerCloseModal={handlerCloseModal}
                  recipeLoading={recipeLoading}
                  recipeById={recipeById}
                  handlerAddMyFavourite={handlerAddMyFavourite}
                  addMyFavouriteLoading={addMyFavouriteLoading}
                />
              }
            />
          </Route>
          {/* <Route path="favorite" element={<Favorite />} /> */}
          <Route
            path="favorite"
            element={
              <Favorite
                getMyFavourite={getMyFavourite}
                handlerOpenModal={handlerOpenModal}
                refreshKey={refreshKey}
                myFavoriteList={myFavoriteList}
                searchRecipe={searchRecipe}
                displayLoading={displayLoading}
              />
            }
          >
            <Route
              path=":id"
              element={
                <DisplayMyFavorite
                  openModal={openModal}
                  handlerCloseModal={handlerCloseModal}
                  recipeLoading={recipeLoading}
                  myFavoriteList={myFavoriteList}
                  deleteMyFavorite={deleteMyFavorite}
                  recipeById={recipeById}
                  deleteMyFavoriteLoading={deleteMyFavoriteLoading}
                />
              }
            />
          </Route>
          <Route
            path="myrecipe"
            element={
              <MyRecipe
                handlerAddMyRecipe={handlerAddMyRecipe}
                openModal={openModal}
                handlerOpenModal={handlerOpenModal}
                handlerCloseModal={handlerCloseModal}
                addMyRecipeLoading={addMyRecipeLoading}
                refreshKey={refreshKey}
                searchMyRecipe={searchMyRecipe}
                myRecipeList={myRecipeList}
                handlerRecipeChange={handlerRecipeChange}
                handlerSubmit={handlerSubmit}
                myRecipe={myRecipe}
                handlerFormStatus={handlerFormStatus}
                formStatus={formStatus}
                handlerDisplayMyRecipe={handlerDisplayMyRecipe}
                displayLoading={displayLoading}
              />
            }
          >
            <Route
              path=":idMeal"
              element={
                <DisplayMyRecipe
                  openModal={openModal}
                  handlerCloseModal={handlerCloseModal}
                  myRecipeList={myRecipeList}
                  deleteMyRecipe={deleteMyRecipe}
                  deleteMyRecipeLoading={deleteMyRecipeLoading}
                  handlerUpdateMyRecipe={handlerUpdateMyRecipe}
                  recipeById={recipeById}
                  handlerEditMyRecipe={handlerEditMyRecipe}
                  form={form}
                  handlerSubmitUpdateMyRecipe={handlerSubmitUpdateMyRecipe}
                  editLoading={editLoading}
                />
              }
            />
          </Route>
          <Route path="login" element={<Login />}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
