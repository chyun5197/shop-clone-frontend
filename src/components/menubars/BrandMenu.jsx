import {useNavigate} from "react-router-dom";

const BrandMenu = ({brandName}) => {
    const nav = useNavigate()
    // console.log(name);
    return <li onClick={()=>nav(`/product/list?brand=${brandName.toLowerCase()}&page=1`)}>{brandName}</li>
};
export default BrandMenu;