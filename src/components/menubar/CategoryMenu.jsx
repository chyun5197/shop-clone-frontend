import {categroy} from "../../global/Category.js";
import BrandMenu from "./BrandMenu.jsx";

const CategoryMenu = ({cateKey, complete, index}) => { // cateKey: Guitars 1
    return <li className="category">
        <a className={"isCompleted"+(complete && index<6? " active" : "")}>{cateKey}</a>
        <ul className="brand">
            {categroy[cateKey].map((category, index) =>
                <BrandMenu brandName={category.name} cateKey={cateKey} complete={complete} index={index}key={category.name}/>
                //category.name: "Fender" | cateKey: "Guitars 1"
            )}
        </ul>
    </li>
};
export default CategoryMenu;