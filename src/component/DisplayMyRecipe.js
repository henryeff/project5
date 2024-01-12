import { useNavigate, useParams } from "react-router-dom";
import Modal from "./Modal";
import styles from "./DisplayMyRecipe.module.css";
import { BeatLoader } from "react-spinners";

function DisplayMyRecipe({
  openModal,
  handlerCloseModal,
  myRecipeList,
  deleteMyRecipe,
  deleteMyRecipeLoading,
}) {
  const { idMeal } = useParams();
  console.log(myRecipeList);
  console.log(idMeal);
  const recipeById = myRecipeList.find((item) => item.idMeal === idMeal);
  console.log(recipeById);
  const navigate = useNavigate();
  let ingredients = [];
  const filterIngerdients = (recipeById) => {
    for (let i = 1; i <= 10; i++) {
      const ingredientKey = "strIngredient" + i;
      if (
        (recipeById[ingredientKey] !== null) &
        (recipeById[ingredientKey] !== "")
      ) {
        ingredients.push(recipeById[ingredientKey]);
      }
    }
    return ingredients;
  };

  console.log("ingredients", filterIngerdients(recipeById));
  return (
    <div
      style={{
        textAlign: "center",
        display: "block",
        padding: 30,
        margin: "auto",
      }}
    >
      <Modal openModal={openModal}>
        <>
          <img
            src={
              !recipeById.strMealThumb
                ? `${process.env.PUBLIC_URL}/noimage.png`
                : recipeById.strMealThumb
            }
            style={{ width: "30%" }}
            alt={recipeById.idMeal}
          />
          <br />
          <h2 style={{ color: "#5f3dc4" }}>{recipeById.strMeal}</h2>
          <h3>Ingredients</h3>
          <div className={styles.ingredientsContainer}>
            {ingredients.map((ingredient, index) => (
              <div className={styles.ingredientItem} key={index}>
                {ingredient}
              </div>
            ))}
          </div>
          <h3>Instructions</h3>
          <div style={{ whiteSpace: "pre-wrap" }}>
            {recipeById.strInstructions}
          </div>
        </>
        <br />
        {deleteMyRecipeLoading && (
          <>
            <div>
              <BeatLoader color="#5f3dc4" />
            </div>
            <br />
          </>
        )}
        {!deleteMyRecipeLoading && (
          <>
            <button>Edit</button>
            <button
              onClick={async () => {
                await deleteMyRecipe(recipeById.idMeal);
                if (!deleteMyRecipeLoading) {
                  handlerCloseModal();
                  navigate("/myrecipe");
                }
              }}
            >
              Delete
            </button>
            <button
              onClick={() => {
                handlerCloseModal();
                navigate("/myrecipe");
              }}
            >
              Close
            </button>
          </>
        )}
      </Modal>
    </div>
  );
}

export default DisplayMyRecipe;
