import {categroy} from "../../util/Category.js";
import BrandMenu from "./BrandMenu.jsx";

const CategoryMenu = ({cateKey}) => {
    return <li className="category">
        <a>{cateKey}</a>
        <ul className="brand">
            {categroy[cateKey].map((category) =>
                <BrandMenu brandName={category.name} key={category.name}/>
            )}
        </ul>
    </li>
};
export default CategoryMenu;