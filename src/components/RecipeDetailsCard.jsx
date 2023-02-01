import React, { useState, useEffect, useContext } from 'react';
import { Button } from 'react-bootstrap';
import { useHistory, useParams } from 'react-router-dom';
import shareIcon from '../images/shareIcon.svg';
import whiteHeartIcon from '../images/whiteHeartIcon.svg';
import blackHeartIcon from '../images/blackHeartIcon.svg';
import RecipesContext from '../context/RecipesContext';
import { setLocalStorage, getLocalStorageFavorite } from '../localStorage/localStorage';

const copy = require('clipboard-copy');

function RecipeDetailsCard() {
  const { fetchId, resultApiId, ingredientsValidArray } = useContext(RecipesContext);
  const [ingredientsValid, setIngredientsValid] = useState([]);
  const [isCopied, setIsCopied] = useState('');
  const [isClicked, setIsClicked] = useState(false);
  const [checkbox, setCheckbox] = useState({ 1: false });
  const history = useHistory();
  const params = useParams();

  const handleChange = ({ target: { name, checked } }) => {
    setCheckbox({
      ...checkbox,
      [name]: checked,
    });
  };

  useEffect(() => {
    fetchId(params.id);
    const returnLocalStorage = getLocalStorageFavorite('favoriteRecipes');
    const findLocalStorage = returnLocalStorage.find((recipe) => recipe.id === params.id);
    if (findLocalStorage) {
      setIsClicked(true);
    }
  }, [fetchId, params.id]);

  const shareButtonClick = () => {
    copy(`http://localhost:3000${history.location.pathname}`);
    setIsCopied('Link copied!');
  };

  const favoriteButtonClick = () => {
    const objectFavoriteRecipes = {
      id: (resultApiId[0].idMeal ? resultApiId[0].idMeal : resultApiId[0].idDrink),
      type: (history.location.pathname.includes('meals') ? 'meal' : 'drink'),
      nationality: (resultApiId[0].strArea ? resultApiId[0].strArea : ''),
      category: (resultApiId[0].strCategory ? resultApiId[0].strCategory : ''),
      alcoholicOrNot: (resultApiId[0].strAlcoholic ? resultApiId[0].strAlcoholic : ''),
      name: (resultApiId[0].strMeal ? resultApiId[0].strMeal : resultApiId[0].strDrink),
      image: (resultApiId[0].strMealThumb
        ? resultApiId[0].strMealThumb : resultApiId[0].strDrinkThumb),
    };
    setLocalStorage('favoriteRecipes', objectFavoriteRecipes);
    if (!isClicked) {
      setIsClicked(true);
    } else {
      setIsClicked(false);
      const parseLocalStorage = JSON.parse(localStorage.getItem('favoriteRecipes')) || [];
      const filterLocalStorage = parseLocalStorage
        .filter((recipe) => recipe.id !== params.id);
      localStorage.setItem('favoriteRecipes', JSON.stringify(filterLocalStorage));
    }
  };

  useEffect(() => {
    if (resultApiId.length > 0) {
      setIngredientsValid(ingredientsValidArray());
      ingredientsValidArray();
    }
  }, [resultApiId, ingredientsValidArray]);

  return (
    <div>
      {resultApiId.length > 0 && (
        <div>
          <img
            src={ resultApiId[0].strMealThumb
              ? resultApiId[0].strMealThumb : resultApiId[0].strDrinkThumb }
            data-testid="recipe-photo"
            alt="meal"
            width="200px"
          />
          <h1 data-testid="recipe-title">
            {
              (resultApiId[0].strMeal ? resultApiId[0].strMeal : resultApiId[0].strDrink)
            }
          </h1>
          <Button
            type="button"
            data-testid="share-btn"
            className="btn btn-danger"
            src={ shareIcon }
            onClick={ shareButtonClick }
          >
            <img src={ shareIcon } alt="shareIcon" />
          </Button>
          <h1>{isCopied}</h1>
          <Button
            type="button"
            data-testid="favorite-btn"
            className="btn btn-danger"
            src={ isClicked ? blackHeartIcon : whiteHeartIcon }
            onClick={ favoriteButtonClick }
          >
            <img
              src={ isClicked ? blackHeartIcon : whiteHeartIcon }
              alt="favoriteIcon"
            />
          </Button>
          <h2 data-testid="recipe-category">
            { resultApiId[0].strCategory}
          </h2>
          <h2 data-testid="recipe-category">
            { resultApiId[0].strAlcoholic }
          </h2>
          <ul>
            {ingredientsValid.length > 0 && (
              ingredientsValid.map((ingredient, index) => (
                <li key={ index }>
                  <label
                    htmlFor={ `ingredient-${index}` }
                    data-testid={ `${index}-ingredient-step` }
                    className={ checkbox[index + 1] ? 'ingredientUsed' : '' }
                  >
                    { `${ingredient.ingredient} ${ingredient.measure}` }
                    <input
                      name={ index + 1 }
                      type="checkbox"
                      id={ `ingredient-${index}` }
                      onChange={ handleChange }
                      checked={ checkbox[index + 1] }
                      value={ checkbox[index + 1] }
                    />
                  </label>
                </li>
              ))
            )}
          </ul>
          <br />
          <p data-testid="instructions">
            {resultApiId[0].strInstructions}
          </p>
          <Button
            type="button"
            data-testid="finish-recipe-btn"
            className="finish-recipe-btn"
            disabled
          >
            Finish Recipe
          </Button>
        </div>
      )}
    </div>
  );
}

export default RecipeDetailsCard;
