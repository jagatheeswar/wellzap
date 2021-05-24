import React from 'react'
import './NutritionCard.css'

function NutritionCard() {
    return (
        <div className="nutritionCard">
        <img src="/assets/nutrition.jpeg" alt="" width="110px" height="110px" />
        <div className="nutritionCard__info">
            <div className="nutritionCard__macroNutrients">
                <h3>Do jdkdd</h3>
            </div>
            <div className="nutritionCard__macroNutrients">
                <h3>2021-05-21</h3>
            </div>
        </div>
        <div className="right__arrow">
                <img src="/assets/right__arrow.png" alt="" />
            </div>
        </div>
    )
}

export default NutritionCard
