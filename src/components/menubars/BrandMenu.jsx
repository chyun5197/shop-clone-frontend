import {useNavigate} from "react-router-dom";

const BrandMenu = ({brandName}) => {
    const nav = useNavigate()
    // console.log(name);
    return <li onClick={()=>nav(`/product/list?brand=${brandName}`)}>{brandName}</li>
};
export default BrandMenu;