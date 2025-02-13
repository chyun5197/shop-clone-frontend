import {categroy} from "../../global/Category.js";
import BrandMenu from "./BrandMenu.jsx";

const CategoryMenu = ({cateKey}) => { // cateKey: Guitars 1
    return <li className="category">
        <a>{cateKey}</a>
        <ul className="brand">
            {categroy[cateKey].map((category) =>
                <BrandMenu brandName={category.name} cateKey={cateKey} key={category.name}/>
                //category.name: "Fender" | cateKey: "Guitars 1"
            )}
        </ul>
    </li>
};
export default CategoryMenu;